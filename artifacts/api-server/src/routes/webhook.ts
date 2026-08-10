import { Router } from "express";
import express from "express";
import Stripe from "stripe";
import { randomUUID } from "crypto";
import { db, downloadTokensTable } from "@workspace/db";
import { sendDownloadEmail } from "../lib/email.js";
import { logger } from "../lib/logger.js";

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-05-28.basil" });

// Map Stripe product names → guide slugs (must match names in your Stripe dashboard)
const PRODUCT_NAME_TO_SLUG: Record<string, string> = {
  "EB-1A Master Guide": "eb1a-master",
  "EB-1A for Business Leaders": "eb1a-business",
  "EB-1A for Artists & Creators": "eb1a-arts",
  "EB-1A for Athletes & Coaches": "eb1a-athletics",
  "EB-1A for Educators": "eb1a-education",
  "EB-1A for Scientists": "eb1a-science",
  "The Complete EB-1A Collection": "eb1a-complete",
};

const GUIDE_NAMES: Record<string, string> = {
  "eb1a-master": "EB-1A Master Guide",
  "eb1a-business": "EB-1A for Business Leaders",
  "eb1a-arts": "EB-1A for Artists & Creators",
  "eb1a-athletics": "EB-1A for Athletes & Coaches",
  "eb1a-education": "EB-1A for Educators",
  "eb1a-science": "EB-1A for Scientists",
  "eb1a-complete": "The Complete EB-1A Collection",
};

// Raw body parser — MUST be mounted before express.json() in app.ts
router.post(
  "/stripe",
  express.raw({ type: "*/*" }),
  async (req, res): Promise<void> => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      logger.error("STRIPE_WEBHOOK_SECRET not set");
      res.status(500).json({ error: "Webhook secret not configured" });
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
        // Still return 200 so Stripe doesn't retry endlessly
      }
    }

    res.json({ received: true });
  },
);

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  // Retrieve full session with expanded line items + products
  const full = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["line_items.data.price.product"],
  });

  const buyerEmail = full.customer_details?.email;
  if (!buyerEmail) {
    logger.warn({ sessionId: session.id }, "No buyer email on session — cannot deliver guide");
    return;
  }

  const lineItems = full.line_items?.data ?? [];

  for (const item of lineItems) {
    const product = item.price?.product as Stripe.Product | undefined;
    const productName = product?.name;
    if (!productName) continue;

    const guideSlug = PRODUCT_NAME_TO_SLUG[productName];
    if (!guideSlug) {
      logger.warn({ productName, sessionId: session.id }, "Unrecognised product name — no guide slug mapped");
      continue;
    }

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 hours

    await db.insert(downloadTokensTable).values({
      token,
      guideSlug,
      buyerEmail,
      attemptsRemaining: 3,
      expiresAt,
      stripeSessionId: session.id,
    });

    const downloadUrl = `https://aivass.com/download/${token}`;
    const guideName = GUIDE_NAMES[guideSlug] ?? productName;

    logger.info({ token, guideSlug, buyerEmail }, "Download token created");

    await sendDownloadEmail({ to: buyerEmail, guideName, downloadUrl });
  }
}

export default router;
