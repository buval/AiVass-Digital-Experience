/**
 * Guide PDF retrieval from Replit Object Storage.
 *
 * Full PDFs are stored privately under the key:  guides/{slug}.pdf
 * They are never publicly accessible — download is gated via the token system.
 *
 * To upload a guide PDF, use the Replit Object Storage pane and upload to:
 *   guides/{slug}.pdf
 * where {slug} is the guide's slug (e.g. eb1a-master, eb1a-business, etc.)
 */

import { Storage } from "@google-cloud/storage";
import { Readable } from "stream";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

export const storageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

function getBucketName(): string {
  const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
  if (!bucketId) throw new Error("DEFAULT_OBJECT_STORAGE_BUCKET_ID not set");
  // bucketId has format: /replit-objstore-<uuid>  — strip leading slash if present
  return bucketId.replace(/^\//, "");
}

export async function streamGuidePdf(
  slug: string
): Promise<{ stream: Readable; contentType: string; size?: number } | null> {
  const bucketName = getBucketName();
  const objectName = `guides/${slug}.pdf`;
  const bucket = storageClient.bucket(bucketName);
  const file = bucket.file(objectName);

  const [exists] = await file.exists();
  if (!exists) return null;

  const [metadata] = await file.getMetadata();
  const stream = file.createReadStream();

  return {
    stream,
    contentType: (metadata.contentType as string) || "application/pdf",
    size: metadata.size ? Number(metadata.size) : undefined,
  };
}
