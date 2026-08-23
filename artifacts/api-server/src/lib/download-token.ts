import { randomUUID } from "crypto";
import { and, eq, isNull, lt, or } from "drizzle-orm";
import { db, downloadTokensTable } from "@workspace/db";

const EMAIL_CLAIM_TTL_MS = 5 * 60 * 1000;

interface CheckoutDownloadTokenInput {
  sessionId: string;
  guideSlug: string;
  buyerEmail: string;
}

/**
 * Creates the one canonical fulfillment token for a Stripe session + guide.
 * The database unique index resolves races between Stripe's webhook and the
 * buyer's order-success page.
 */
export async function getOrCreateCheckoutDownloadToken({
  sessionId,
  guideSlug,
  buyerEmail,
}: CheckoutDownloadTokenInput) {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);
  const [inserted] = await db
    .insert(downloadTokensTable)
    .values({
      token,
      guideSlug,
      buyerEmail,
      attemptsRemaining: 3,
      expiresAt,
      stripeSessionId: sessionId,
    })
    .onConflictDoNothing({
      target: [
        downloadTokensTable.stripeSessionId,
        downloadTokensTable.guideSlug,
      ],
    })
    .returning();

  if (inserted) {
    return { token: inserted, created: true };
  }

  const [existing] = await db
    .select()
    .from(downloadTokensTable)
    .where(
      and(
        eq(downloadTokensTable.stripeSessionId, sessionId),
        eq(downloadTokensTable.guideSlug, guideSlug),
      ),
    )
    .limit(1);

  if (!existing) {
    throw new Error("Canonical checkout download token could not be resolved");
  }

  return { token: existing, created: false };
}

export type DownloadEmailClaim =
  | "claimed"
  | "already-sent"
  | "in-progress";

export async function claimDownloadEmail(
  token: string,
): Promise<DownloadEmailClaim> {
  const now = new Date();
  const staleBefore = new Date(now.getTime() - EMAIL_CLAIM_TTL_MS);
  const [claimed] = await db
    .update(downloadTokensTable)
    .set({ emailClaimedAt: now })
    .where(
      and(
        eq(downloadTokensTable.token, token),
        isNull(downloadTokensTable.emailSentAt),
        or(
          isNull(downloadTokensTable.emailClaimedAt),
          lt(downloadTokensTable.emailClaimedAt, staleBefore),
        ),
      ),
    )
    .returning({ token: downloadTokensTable.token });

  if (claimed) return "claimed";

  const [state] = await db
    .select({
      emailSentAt: downloadTokensTable.emailSentAt,
    })
    .from(downloadTokensTable)
    .where(eq(downloadTokensTable.token, token))
    .limit(1);

  return state?.emailSentAt ? "already-sent" : "in-progress";
}

export async function markDownloadEmailSent(token: string): Promise<void> {
  await db
    .update(downloadTokensTable)
    .set({
      fulfilled: true,
      emailClaimedAt: null,
      emailSentAt: new Date(),
    })
    .where(eq(downloadTokensTable.token, token));
}

export async function releaseDownloadEmailClaim(token: string): Promise<void> {
  await db
    .update(downloadTokensTable)
    .set({ emailClaimedAt: null })
    .where(eq(downloadTokensTable.token, token));
}