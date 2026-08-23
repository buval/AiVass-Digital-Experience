import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import { randomUUID, randomInt, createHash, timingSafeEqual } from "crypto";
import { db, pool, downloadTokensTable, downloadAccessCodesTable } from "@workspace/db";
import { logger } from "../lib/logger.js";
import { GUIDE_NAMES } from "../lib/guide-catalog.js";
import { sendDownloadEmail, sendAccessCodeEmail } from "../lib/email.js";

const router = Router();

const CODE_TTL_MS = 15 * 60 * 1000; // code valid 15 minutes
const SESSION_TTL_MS = 30 * 60 * 1000; // verified session valid 30 minutes
const MAX_CODES_PER_WINDOW = 3; // unexpired codes per email
const CODE_ATTEMPTS = 5; // wrong guesses allowed per code

function hashCode(email: string, code: string): string {
  return createHash("sha256").update(`${email}:${code}`).digest("hex");
}

function safeEqualHex(a: string, b: string): boolean {
  const ba = Buffer.from(a, "hex");
  const bb = Buffer.from(b, "hex");
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

/**
 * Validates the access session supplied via the X-Access-Token header.
 * Returns the verified email, or null (response already sent) on failure.
 */
async function requireSession(req: { headers: Record<string, unknown> }, res: {
  status: (n: number) => { json: (b: unknown) => void };
}): Promise<string | null> {
  const token = (req.headers["x-access-token"] as string | undefined)?.trim();
  if (!token) {
    res.status(401).json({ error: "Verification required.", code: "unverified" });
    return null;
  }

  const now = new Date();
  const [row] = await db
    .select()
    .from(downloadAccessCodesTable)
    .where(eq(downloadAccessCodesTable.sessionToken, token))
    .limit(1);

  if (!row || !row.sessionExpiresAt || now > row.sessionExpiresAt) {
    res.status(401).json({ error: "Your session has expired. Please verify your email again.", code: "session_expired" });
    return null;
  }

  return row.email;
}

/**
 * POST /api/my-downloads/request-code
 * Body: { email }
 *
 * Emails a one-time 6-digit code. Always responds with the same generic
 * message so the endpoint never reveals whether an email has purchases.
 */
router.post("/request-code", async (req, res): Promise<void> => {
  const email = (req.body?.email as string | undefined)?.trim().toLowerCase();

  if (!email || !email.includes("@")) {
    res.status(400).json({ error: "A valid email address is required." });
    return;
  }

  const code = String(randomInt(0, 1000000)).padStart(6, "0");
  const expiresAt = new Date(Date.now() + CODE_TTL_MS);

  // Rate-limit check and insert run inside one transaction guarded by a
  // per-email advisory lock so concurrent requests cannot exceed the cap.
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1)::bigint)", [
      `access-code:${email}`,
    ]);

    const { rows: active } = await client.query(
      `SELECT id FROM download_access_codes
        WHERE email = $1 AND expires_at > now() AND consumed_at IS NULL`,
      [email],
    );

    if (active.length >= MAX_CODES_PER_WINDOW) {
      await client.query("ROLLBACK");
      res.status(429).json({
        error: "Too many codes requested. Please wait a few minutes and use the most recent code from your inbox.",
      });
      return;
    }

    await client.query(
      `INSERT INTO download_access_codes (id, email, code_hash, attempts_remaining, expires_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [randomUUID(), email, hashCode(email, code), CODE_ATTEMPTS, expiresAt],
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    throw err;
  } finally {
    client.release();
  }

  try {
    await sendAccessCodeEmail({ to: email, code });
    logger.info({ email }, "Access code sent");
  } catch (err) {
    logger.error({ err, email }, "Failed to send access code email");
    res.status(502).json({ error: "We couldn't send the email right now. Please try again in a moment." });
    return;
  }

  res.json({ ok: true, message: "If this address has purchases, a code is on its way." });
});

/**
 * POST /api/my-downloads/verify-code
 * Body: { email, code }
 *
 * On success returns a short-lived access token used to gate lookups/refreshes.
 */
router.post("/verify-code", async (req, res): Promise<void> => {
  const email = (req.body?.email as string | undefined)?.trim().toLowerCase();
  const code = (req.body?.code as string | undefined)?.trim();

  if (!email || !email.includes("@") || !code || !/^\d{6}$/.test(code)) {
    res.status(400).json({ error: "Enter the 6-digit code from your email.", code: "bad_input" });
    return;
  }

  // Atomically claim one attempt on the most recent live code. Only a
  // request that wins a claim slot may compare against the hash — this
  // bounds total guesses at CODE_ATTEMPTS even under concurrent requests.
  const { rows: claimed } = await pool.query<{
    id: string;
    code_hash: string;
    attempts_remaining: number;
  }>(
    `UPDATE download_access_codes
        SET attempts_remaining = attempts_remaining - 1
      WHERE attempts_remaining > 0
        AND id = (
          SELECT id FROM download_access_codes
           WHERE email = $1 AND expires_at > now()
             AND consumed_at IS NULL AND attempts_remaining > 0
           ORDER BY created_at DESC
           LIMIT 1
        )
      RETURNING id, code_hash, attempts_remaining`,
    [email],
  );

  const row = claimed[0];
  if (!row) {
    res.status(410).json({ error: "This code has expired. Request a new one.", code: "expired" });
    return;
  }

  if (!safeEqualHex(row.code_hash, hashCode(email, code))) {
    const remaining = row.attempts_remaining;
    res.status(401).json({
      error: remaining > 0
        ? "That code doesn't match. Check your email and try again."
        : "Too many incorrect attempts. Request a new code.",
      code: remaining > 0 ? "wrong_code" : "attempts_exhausted",
    });
    return;
  }

  const sessionToken = randomUUID();
  const sessionExpiresAt = new Date(Date.now() + SESSION_TTL_MS);

  // Conditional consume: only one matching request can mint a session.
  const { rowCount: consumedCount } = await pool.query(
    `UPDATE download_access_codes
        SET consumed_at = now(), session_token = $2, session_expires_at = $3
      WHERE id = $1 AND consumed_at IS NULL`,
    [row.id, sessionToken, sessionExpiresAt],
  );

  if (!consumedCount) {
    res.status(410).json({ error: "This code has already been used. Request a new one.", code: "expired" });
    return;
  }

  logger.info({ email }, "Access code verified");
  res.json({ accessToken: sessionToken, expiresAt: sessionExpiresAt.toISOString() });
});

/**
 * GET /api/my-downloads
 * Requires X-Access-Token from a verified email session.
 * Returns all purchases for the verified email, grouped by guide.
 */
router.get("/", async (req, res): Promise<void> => {
  const email = await requireSession(req, res);
  if (!email) return;

  const now = new Date();

  // Load all tokens for this email, newest first
  const rows = await db
    .select()
    .from(downloadTokensTable)
    .where(eq(downloadTokensTable.buyerEmail, email))
    .orderBy(desc(downloadTokensTable.createdAt));

  if (rows.length === 0) {
    res.json({ email, purchases: [] });
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

  logger.info({ email, count: purchases.length }, "my-downloads lookup (verified)");
  res.json({ email, purchases });
});

/**
 * POST /api/my-downloads/refresh
 * Requires X-Access-Token from a verified email session.
 * Body: { guideSlug: string }
 *
 * Issues a fresh 72-hour / 3-attempt token when the buyer's existing token
 * is expired or exhausted. The buyer must have previously purchased that
 * guide (verified by existing token in DB) — and the email is taken from
 * the verified session, never from the request body.
 */
router.post("/refresh", async (req, res): Promise<void> => {
  const email = await requireSession(req, res);
  if (!email) return;

  const guideSlug = (req.body?.guideSlug as string | undefined)?.trim();

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
