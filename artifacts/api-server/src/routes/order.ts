import { Router } from "express";
import Stripe from "stripe";
import { logger } from "../lib/logger.js";
import {
  getGuideSlugsForPurchase,
  GUIDE_NAMES,
} from "../lib/guide-catalog.js";
import { getUncachableStripeClient } from "../lib/stripe-client.js";
import { getOrCreateCheckoutDownloadToken } from "../lib/download-token.js";

type StripeClientFactory = () => Promise<Stripe>;
type DownloadTokenCreator = typeof getOrCreateCheckoutDownloadToken;

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
export function createOrderRouter({
  getStripeClient = getUncachableStripeClient,
  createDownloadToken = getOrCreateCheckoutDownloadToken,
}: {
  getStripeClient?: StripeClientFactory;
  createDownloadToken?: DownloadTokenCreator;
} = {}) {
  const router = Router();

  router.get("/order-complete", async (req, res): Promise<void> => {
    const sessionId = req.query.session_id as string | undefined;

    if (!sessionId) {
      res.status(400).json({ error: "Missing session_id" });
      return;
    }

    let session: Stripe.Checkout.Session;
    try {
      const stripe = await getStripeClient();
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
      const price = item.price;
      const product = item.price?.product as Stripe.Product | null;
      if (!price || !product?.id) continue;

      // Fulfill only the exact server-owned product + price configuration.
      const slugs = getGuideSlugsForPurchase({
        productId: product.id,
        priceId: price.id,
        unitAmount: price.unit_amount,
        currency: price.currency,
      });

      if (slugs.length === 0) {
        logger.warn(
          { productId: product.id, priceId: price.id },
          "Unknown or mismatched Stripe line item",
        );
        continue;
      }

      for (const guideSlug of slugs) {
        const { token, created } = await createDownloadToken({
          sessionId,
          guideSlug,
          buyerEmail: session.customer_details?.email ?? "unknown",
        });

        if (created) {
          logger.info(
            { token: token.token, guideSlug, sessionId },
            "Download token created",
          );
        }

        downloads.push({
          token: token.token,
          guideSlug: token.guideSlug,
          guideName: GUIDE_NAMES[token.guideSlug] ?? guideSlug,
          attemptsRemaining: token.attemptsRemaining,
        });
      }
    }

    if (downloads.length === 0) {
      res
        .status(422)
        .json({ error: "No downloadable guides found for this purchase" });
      return;
    }

    res.json({ downloads });
  });

  return router;
}

export default createOrderRouter();
