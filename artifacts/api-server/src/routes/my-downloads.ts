import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db, downloadTokensTable } from "@workspace/db";
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

  const now = new Date();

  // Verify the buyer actually purchased this guide
  const existing = await db
    .select()
    .from(downloadTokensTable)
    .where(eq(downloadTokensTable.buyerEmail, email))
    .orderBy(desc(downloadTokensTable.createdAt));

  const matching = existing.filter((r) => r.guideSlug === guideSlug);

  if (matching.length === 0) {
    res.status(404).json({
      error: "No purchase found for this email and guide. Please contact connect@aivass.com if you believe this is an error.",
    });
    return;
  }

  // Check that there's no currently valid token (prevent abuse)
  const hasValid = matching.some(
    (r) => now <= r.expiresAt && r.attemptsRemaining > 0,
  );

  if (hasValid) {
    res.status(409).json({
      error: "You already have an active download link for this guide.",
    });
    return;
  }

  // Issue a fresh token
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);

  // Carry forward stripeSessionId from original purchase if available
  const original = matching[0];

  await db.insert(downloadTokensTable).values({
    token,
    guideSlug,
    buyerEmail: email,
    attemptsRemaining: 3,
    expiresAt,
    stripeSessionId: original.stripeSessionId,
  });

  logger.info({ token, guideSlug, email }, "Download token refreshed for buyer");

  // Send a fresh download email — non-fatal if it fails
  const guideName = GUIDE_NAMES[guideSlug] ?? guideSlug;
  const downloadUrl = `https://aivass.com/download/${token}`;
  try {
    await sendDownloadEmail({ to: email, guideName, downloadUrl });
    logger.info({ token, guideSlug, email }, "Refresh: download email sent");
  } catch (err) {
    logger.error({ err, token, guideSlug }, "Refresh: failed to send download email (token still valid)");
  }

  res.json({
    token,
    guideSlug,
    guideName,
    attemptsRemaining: 3,
    expiresAt: expiresAt.toISOString(),
  });
});

export default router;
