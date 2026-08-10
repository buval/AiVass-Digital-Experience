/**
 * Supplementary download info endpoint (does not consume an attempt).
 * The core download (/:token) is handled by downloads.ts (mounted at /download).
 *
 * This file is NOT mounted — kept for reference and potential future use.
 * If you need the /info endpoint, mount this router in routes/index.ts.
 */

import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { downloadTokensTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

// GET /api/download/:token/info — returns token status without consuming an attempt
router.get("/download/:token/info", async (req: Request, res: Response): Promise<void> => {
  const { token } = req.params;

  const rows = await db
    .select()
    .from(downloadTokensTable)
    .where(eq(downloadTokensTable.token, token))
    .limit(1);

  const record = rows[0];

  if (!record) {
    res.status(404).json({ error: "Download link not found." });
    return;
  }

  const expired = new Date() > record.expiresAt;
  const exhausted = record.attemptsRemaining <= 0;

  res.json({
    valid: !expired && !exhausted,
    guide_slug: record.guideSlug,
    attempts_remaining: record.attemptsRemaining,
    expires_at: record.expiresAt.toISOString(),
    expired,
    exhausted,
  });
});

export default router;
