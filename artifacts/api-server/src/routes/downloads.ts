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

  // 4. Decrement attempts atomically
  await db
    .update(downloadTokensTable)
    .set({ attemptsRemaining: sql`${downloadTokensTable.attemptsRemaining} - 1` })
    .where(
      and(
        eq(downloadTokensTable.token, token),
        gt(downloadTokensTable.attemptsRemaining, 0),
      ),
    );

  const remaining = record.attemptsRemaining - 1;

  // 5. Fetch PDF from Object Storage
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

  logger.info({ token, guideSlug: record.guideSlug, remaining }, "Serving guide download");

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("X-Guide-Name", GUIDE_FILENAMES[record.guideSlug]?.replace(".pdf", "") ?? record.guideSlug);
  res.setHeader("X-Attempts-Remaining", String(remaining));
  res.setHeader("X-Filename", filename);
  if (fileSize) res.setHeader("Content-Length", fileSize);

  file.createReadStream().pipe(res);
});

export default router;
