import { Router } from "express";
import Stripe from "stripe";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db, downloadTokensTable } from "@workspace/db";
import { logger } from "../lib/logger.js";

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-05-28.basil" });

// Stripe product ID → guide slug (from live Stripe dashboard)
const PRODUCT_ID_TO_SLUG: Record<string, string> = {
  "prod_UuuNVJM174nKvQ": "eb1a-master",
  "prod_UuubGa79bq84fn": "eb1a-business",
  "prod_UuucU0qjBiiFYp": "eb1a-arts",
  "prod_UuudKN57E7YBxm": "eb1a-athletics",
  "prod_Uuuecov9ZMnSbo": "eb1a-education",
  "prod_Uuuf4bMQ91y7V0": "eb1a-science",
  "prod_UuufVso7YgP9cq": "eb1a-complete",
};

export const GUIDE_NAMES: Record<string, string> = {
  "eb1a-master":    "EB-1A Master Guide",
  "eb1a-business":  "EB-1A for Business Leaders",
  "eb1a-arts":      "EB-1A for Artists & Creators",
  "eb1a-athletics": "EB-1A for Athletes & Coaches",
  "eb1a-education": "EB-1A for Educators",
  "eb1a-science":   "EB-1A for Scientists",
  "eb1a-complete":  "The Complete EB-1A Collection",
};

export interface DownloadReady {
  token: string;
  guideSlug: string;
  guideName: string;
  attemptsRemaining: number;
}

/**
 * GET /api/order-complete?session_id=cs_live_...
 *
 * Called by the order-success page immediately after Stripe redirect.
 * Verifies payment, maps product → guide, creates (or retrieves) download token.
 * Returns the token so the frontend can trigger an instant download.
 */
router.get("/order-complete", async (req, res): Promise<void> => {
  const sessionId = req.query.session_id as string | undefined;

  if (!sessionId) {
    res.status(400).json({ error: "Missing session_id" });
    return;
  }

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price.product"],
    });
  } catch (err) {
    logger.warn({ err, sessionId }, "Could not retrieve Stripe session");
    res.status(404).json({ error: "Session not found" });
    return;
  }

  if (session.payment_status !== "paid") {
    res.status(402).json({ error: "Payment not completed" });
    return;
  }

  const lineItems = session.line_items?.data ?? [];
  const downloads: DownloadReady[] = [];

  for (const item of lineItems) {
    const product = item.price?.product as Stripe.Product | null;
    if (!product?.id) continue;

    const guideSlug = PRODUCT_ID_TO_SLUG[product.id];
    if (!guideSlug) {
      logger.warn({ productId: product.id }, "Unknown product — no guide slug mapped");
      continue;
    }

    // Idempotent: reuse existing token for this session + slug
    const existing = await db
      .select()
      .from(downloadTokensTable)
      .where(eq(downloadTokensTable.stripeSessionId, sessionId))
      .limit(10);

    const match = existing.find((r) => r.guideSlug === guideSlug);

    if (match) {
      downloads.push({
        token: match.token,
        guideSlug: match.guideSlug,
        guideName: GUIDE_NAMES[match.guideSlug] ?? guideSlug,
        attemptsRemaining: match.attemptsRemaining,
      });
    } else {
      const token = randomUUID();
      const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 h

      await db.insert(downloadTokensTable).values({
        token,
        guideSlug,
        buyerEmail: session.customer_details?.email ?? "unknown",
        attemptsRemaining: 3,
        expiresAt,
        stripeSessionId: sessionId,
      });

      logger.info({ token, guideSlug, sessionId }, "Download token created");

      downloads.push({
        token,
        guideSlug,
        guideName: GUIDE_NAMES[guideSlug] ?? guideSlug,
        attemptsRemaining: 3,
      });
    }
  }

  if (downloads.length === 0) {
    res.status(422).json({ error: "No downloadable guides found for this purchase" });
    return;
  }

  res.json({ downloads });
});

export default router;
