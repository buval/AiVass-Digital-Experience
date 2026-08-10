import { Router } from "express";
import express from "express";
import Stripe from "stripe";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db, downloadTokensTable } from "@workspace/db";
import { logger } from "../lib/logger.js";
import { GUIDE_NAMES } from "./order.js";

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-05-28.basil" });

// Stripe product ID → guide slug (matches Stripe live dashboard)
const PRODUCT_ID_TO_SLUG: Record<string, string> = {
  "prod_UuuNVJM174nKvQ": "eb1a-master",
  "prod_UuubGa79bq84fn": "eb1a-business",
  "prod_UuucU0qjBiiFYp": "eb1a-arts",
  "prod_UuudKN57E7YBxm": "eb1a-athletics",
  "prod_Uuuecov9ZMnSbo": "eb1a-education",
  "prod_Uuuf4bMQ91y7V0": "eb1a-science",
  "prod_UuufVso7YgP9cq": "eb1a-complete",
};

// Raw body parser — must run before express.json() (see app.ts)
router.post(
  "/stripe",
  express.raw({ type: "*/*" }),
  async (req, res): Promise<void> => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      logger.warn("STRIPE_WEBHOOK_SECRET not set — skipping webhook verification");
      res.json({ received: true });
      return;
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.body as Buffer, sig as string, webhookSecret);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.warn({ msg }, "Stripe webhook signature verification failed");
      res.status(400).json({ error: `Webhook error: ${msg}` });
      return;
    }

    if (event.type === "checkout.session.completed") {
      try {
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      } catch (err) {
        logger.error({ err }, "Error processing checkout.session.completed");
      }
    }

    res.json({ received: true });
  },
);

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const full = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["line_items.data.price.product"],
  });

  const buyerEmail = full.customer_details?.email ?? "unknown";
  const lineItems = full.line_items?.data ?? [];

  for (const item of lineItems) {
    const product = item.price?.product as Stripe.Product | null;
    if (!product?.id) continue;

    const guideSlug = PRODUCT_ID_TO_SLUG[product.id];
    if (!guideSlug) {
      logger.warn({ productId: product.id }, "Unknown product ID in webhook");
      continue;
    }

    // Idempotent — skip if a token already exists for this session+slug
    const existing = await db
      .select()
      .from(downloadTokensTable)
      .where(eq(downloadTokensTable.stripeSessionId, session.id))
      .limit(10);

    if (existing.some((r) => r.guideSlug === guideSlug)) {
      logger.info({ guideSlug, sessionId: session.id }, "Token already exists — skipping");
      continue;
    }

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);

    await db.insert(downloadTokensTable).values({
      token,
      guideSlug,
      buyerEmail,
      attemptsRemaining: 3,
      expiresAt,
      stripeSessionId: session.id,
    });

    logger.info({ token, guideSlug, buyerEmail }, "Webhook: download token created");
  }
}

export default router;
