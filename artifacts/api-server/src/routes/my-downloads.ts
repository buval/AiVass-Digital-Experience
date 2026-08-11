import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db, pool, downloadTokensTable } from "@workspace/db";
import { logger } from "../lib/logger.js";
import { GUIDE_NAMES } from "./order.js";
import { sendDownloadEmail } from "../lib/email.js";

const router = Router();

/**
 * GET /api/my-downloads?email=buyer@example.com
 *
 * Returns all purchases associated with the given email, grouped by guide.
 * Each entry shows the most-useful token (valid > exhausted > expired).
 */
router.get("/", async (req, res): Promise<void> => {
  const email = (req.query.email as string | undefined)?.trim().toLowerCase();

  if (!email || !email.includes("@")) {
    res.status(400).json({ error: "A valid email address is required." });
    return;
  }

  const now = new Date();

  // Load all tokens for this email, newest first
  const rows = await db
    .select()
    .from(downloadTokensTable)
    .where(eq(downloadTokensTable.buyerEmail, email))
    .orderBy(desc(downloadTokensTable.createdAt));

  if (rows.length === 0) {
    res.json({ purchases: [] });
    return;
  }

  // Group by guideSlug — pick the best token per guide:
  //   1. Valid (not expired, attempts > 0)
  //   2. Exhausted but not expired (may refresh)
  //   3. Expired
  const bySlug = new Map<string, (typeof rows)[number]>();

  for (const row of rows) {
    const existing = bySlug.get(row.guideSlug);

    const rowExpired = now > row.expiresAt;
    const rowExhausted = row.attemptsRemaining <= 0;
    const rowValid = !rowExpired && !rowExhausted;

    if (!existing) {
      bySlug.set(row.guideSlug, row);
      continue;
    }

    const exExpired = now > existing.expiresAt;
    const exExhausted = existing.attemptsRemaining <= 0;
    const exValid = !exExpired && !exExhausted;

    // Prefer: valid > exhausted-not-expired > expired
    if (rowValid && !exValid) {
      bySlug.set(row.guideSlug, row);
    } else if (!rowExpired && exExpired && !rowValid && !exValid) {
      bySlug.set(row.guideSlug, row);
    }
  }

  const purchases = Array.from(bySlug.entries()).map(([guideSlug, row]) => {
    const expired = now > row.expiresAt;
    const exhausted = row.attemptsRemaining <= 0;
    const canDownload = !expired && !exhausted;

    return {
      guideSlug,
      guideName: GUIDE_NAMES[guideSlug] ?? guideSlug,
      token: row.token,
      attemptsRemaining: row.attemptsRemaining,
      expiresAt: row.expiresAt.toISOString(),
      expired,
      exhausted,
      canDownload,
    };
  });

  // Sort: downloadable first, then by guide name
  purchases.sort((a, b) => {
    if (a.canDownload !== b.canDownload) return a.canDownload ? -1 : 1;
    return a.guideName.localeCompare(b.guideName);
  });

  logger.info({ email, count: purchases.length }, "my-downloads lookup");
  res.json({ purchases });
});

/**
 * POST /api/my-downloads/refresh
 *
 * Body: { email: string; guideSlug: string }
 *
 * Automatically issues a fresh 72-hour / 3-attempt token when the buyer's
 * existing token is expired or exhausted. The buyer must have previously
 * purchased that guide (verified by existing token in DB).
 *
 * All checks (active-token guard, lifetime cap) and the insert are performed
 * inside a single transaction that holds a PostgreSQL advisory lock keyed on
 * email+guideSlug, making the operation atomic even under concurrent requests.
 *
 * Lifetime cap: MAX_LIFETIME_TOKENS total rows per email+guideSlug, including
 * the original purchase token. A buyer therefore gets up to
 * (MAX_LIFETIME_TOKENS - 1) refreshes after their first token.
 */
router.post("/refresh", async (req, res): Promise<void> => {
  const email = (req.body?.email as string | undefined)?.trim().toLowerCase();
  const guideSlug = (req.body?.guideSlug as string | undefined)?.trim();

  if (!email || !email.includes("@")) {
    res.status(400).json({ error: "A valid email address is required." });
    return;
  }

  if (!guideSlug) {
    res.status(400).json({ error: "guideSlug is required." });
    return;
  }

  // MAX_LIFETIME_TOKENS: total download_tokens rows allowed per email+guideSlug
  // (original purchase token + refreshes). With 10, a buyer gets up to 9 refreshes.
  const MAX_LIFETIME_TOKENS = 10;

  const now = new Date();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Acquire a transaction-scoped advisory lock keyed on the normalised
    // email:guideSlug pair. Concurrent requests for the same pair block here
    // and are processed serially; the lock is released automatically on
    // COMMIT or ROLLBACK.
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1)::bigint)", [
      `${email}:${guideSlug}`,
    ]);

    // Load all tokens for this email+guide inside the lock
    const { rows: matching } = await client.query<{
      token: string;
      guide_slug: string;
      buyer_email: string;
      attempts_remaining: number;
      expires_at: Date;
      created_at: Date;
      stripe_session_id: string | null;
      fulfilled: boolean;
    }>(
      `SELECT token, guide_slug, buyer_email, attempts_remaining, expires_at,
              created_at, stripe_session_id, fulfilled
         FROM download_tokens
        WHERE buyer_email = $1 AND guide_slug = $2
        ORDER BY created_at DESC`,
      [email, guideSlug],
    );

    if (matching.length === 0) {
      await client.query("ROLLBACK");
      res.status(404).json({
        error:
          "No purchase found for this email and guide. Please contact connect@aivass.com if you believe this is an error.",
      });
      return;
    }

    // Reject if there is already an active (non-expired, non-exhausted) token
    const hasValid = matching.some(
      (r) => now <= r.expires_at && r.attempts_remaining > 0,
    );

    if (hasValid) {
      await client.query("ROLLBACK");
      res.status(409).json({
        error: "You already have an active download link for this guide.",
      });
      return;
    }

    // Enforce the lifetime token cap
    if (matching.length >= MAX_LIFETIME_TOKENS) {
      logger.warn(
        { email, guideSlug, tokenCount: matching.length },
        "Refresh limit reached for buyer",
      );
      await client.query("ROLLBACK");
      res.status(429).json({
        error:
          "You have reached the maximum number of download link refreshes for this guide. Please contact connect@aivass.com for assistance.",
      });
      return;
    }

    // Issue a fresh token
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);
    const stripeSessionId = matching[0].stripe_session_id ?? null;

    await client.query(
      `INSERT INTO download_tokens
         (token, guide_slug, buyer_email, attempts_remaining, expires_at, stripe_session_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [token, guideSlug, email, 3, expiresAt, stripeSessionId],
    );

    await client.query("COMMIT");

    logger.info(
      { token, guideSlug, email, totalTokens: matching.length + 1 },
      "Download token refreshed for buyer",
    );

    // Send a fresh download email — non-fatal if it fails
    const guideName = GUIDE_NAMES[guideSlug] ?? guideSlug;
    const downloadUrl = `https://aivass.com/download/${token}`;
    try {
      await sendDownloadEmail({ to: email, guideName, downloadUrl });
      logger.info({ token, guideSlug, email }, "Refresh: download email sent");
    } catch (err) {
      logger.error(
        { err, token, guideSlug },
        "Refresh: failed to send download email (token still valid)",
      );
    }

    res.json({
      token,
      guideSlug,
      guideName,
      attemptsRemaining: 3,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
});

export default router;
