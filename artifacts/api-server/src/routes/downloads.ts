import { Router } from "express";
import { eq, and, gt, sql } from "drizzle-orm";
import { db, downloadTokensTable } from "@workspace/db";
import { objectStorageClient } from "../lib/objectStorage.js";
import { logger } from "../lib/logger.js";

const router = Router();

const GUIDE_FILENAMES: Record<string, string> = {
  "eb1a-master": "EB-1A Master Guide.pdf",
  "eb1a-business": "EB-1A for Business Leaders.pdf",
  "eb1a-arts": "EB-1A for Artists and Creators.pdf",
  "eb1a-athletics": "EB-1A for Athletes and Coaches.pdf",
  "eb1a-education": "EB-1A for Educators.pdf",
  "eb1a-science": "EB-1A for Scientists.pdf",
  "eb1a-complete": "EB-1A Complete Collection.pdf",
};

// GET /api/download/:token — validate token, decrement attempt, stream PDF
router.get("/:token", async (req, res): Promise<void> => {
  const { token } = req.params;

  // 1. Look up token
  const [record] = await db
    .select()
    .from(downloadTokensTable)
    .where(eq(downloadTokensTable.token, token))
    .limit(1);

  if (!record) {
    res.status(404).json({ error: "Download link not found", code: "invalid" });
    return;
  }

  // 2. Check expiry
  if (new Date() > record.expiresAt) {
    res.status(410).json({ error: "Download link has expired", code: "expired" });
    return;
  }

  // 3. Check attempts
  if (record.attemptsRemaining <= 0) {
    res.status(410).json({ error: "Download limit reached", code: "exhausted", attemptsRemaining: 0 });
    return;
  }

  // 4. Verify storage BEFORE consuming an attempt, so a missing file or
  //    misconfiguration never burns one of the buyer's downloads.
  const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
  if (!bucketId) {
    logger.error("DEFAULT_OBJECT_STORAGE_BUCKET_ID not set");
    res.status(503).json({ error: "Storage not configured" });
    return;
  }

  const bucket = objectStorageClient.bucket(bucketId);
  const file = bucket.file(`guides/${record.guideSlug}.pdf`);

  const [exists] = await file.exists();
  if (!exists) {
    logger.error({ guideSlug: record.guideSlug }, "Guide PDF not found in object storage");
    res.status(503).json({ error: "Guide file not available yet. Please contact connect@aivass.com" });
    return;
  }

  const [metadata] = await file.getMetadata();
  const fileSize = metadata.size?.toString();
  const filename = GUIDE_FILENAMES[record.guideSlug] ?? `${record.guideSlug}.pdf`;

  // 5. Claim an attempt atomically — only proceed if this request won a slot.
  const claimed = await db
    .update(downloadTokensTable)
    .set({ attemptsRemaining: sql`${downloadTokensTable.attemptsRemaining} - 1` })
    .where(
      and(
        eq(downloadTokensTable.token, token),
        gt(downloadTokensTable.attemptsRemaining, 0),
      ),
    )
    .returning({ attemptsRemaining: downloadTokensTable.attemptsRemaining });

  if (claimed.length === 0) {
    res.status(410).json({ error: "Download limit reached", code: "exhausted", attemptsRemaining: 0 });
    return;
  }

  const remaining = claimed[0].attemptsRemaining;

  logger.info({ token, guideSlug: record.guideSlug, remaining }, "Serving guide download");

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("X-Guide-Name", GUIDE_FILENAMES[record.guideSlug]?.replace(".pdf", "") ?? record.guideSlug);
  res.setHeader("X-Attempts-Remaining", String(remaining));
  res.setHeader("X-Filename", filename);
  if (fileSize) res.setHeader("Content-Length", fileSize);

  const stream = file.createReadStream();

  // If the storage read fails server-side before delivery completes,
  // refund the attempt — the buyer never received the file.
  stream.on("error", async (err) => {
    logger.error({ err, token }, "Storage stream error — refunding download attempt");
    try {
      await db
        .update(downloadTokensTable)
        .set({ attemptsRemaining: sql`${downloadTokensTable.attemptsRemaining} + 1` })
        .where(eq(downloadTokensTable.token, token));
    } catch (refundErr) {
      logger.error({ refundErr, token }, "Failed to refund download attempt");
    }
    if (!res.headersSent) {
      res.status(503).json({ error: "Download failed. Please try again." });
    } else {
      res.destroy();
    }
  });

  stream.pipe(res);
});

export default router;
