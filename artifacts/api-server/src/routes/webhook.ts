/**
 * POST /api/webhooks/stripe
 *
 * Verifies the event with a signature or authenticated Stripe API lookup,
 * handles checkout.session.completed,
 * creates download tokens (idempotent per session+slug), and sends
 * the buyer a download email via Resend.
 *
 * Mounted at /webhooks in routes/index.ts → full path: /api/webhooks/stripe
 */

import express, { Router } from "express";
import Stripe from "stripe";
import { logger } from "../lib/logger.js";
import {
  getGuideSlugsForPurchase,
  GUIDE_NAMES,
} from "../lib/guide-catalog.js";
import { getUncachableStripeClient } from "../lib/stripe-client.js";
import {
  claimDownloadEmail,
  getOrCreateCheckoutDownloadToken,
  markDownloadEmailSent,
  releaseDownloadEmailClaim,
} from "../lib/download-token.js";
import { sendDownloadEmail, sendAdminAlertEmail } from "../lib/email.js";

const router = Router();
const webhookVerifier = new Stripe("sk_test_webhook_verifier", {
  apiVersion: "2026-07-29.dahlia",
});

// Raw body parser — Stripe signature verification requires the raw buffer
router.post(
  "/stripe",
  express.raw({ type: "*/*" }),
  async (req, res): Promise<void> => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const rawBody = req.body as Buffer;
    let event: Stripe.Event | null = null;

    if (webhookSecret && typeof sig === "string") {
      try {
        event = webhookVerifier.webhooks.constructEvent(
          rawBody,
          sig,
          webhookSecret,
        );
      } catch {
        // The live account was reconnected, so an older signing secret can
        // coexist during migration. The authenticated API lookup below still
        // proves that the event belongs to the connected production account.
        logger.warn(
          "Stripe signature did not match — verifying event through Stripe API",
        );
      }
    }

    if (!event) {
      let claimedEventId: string | undefined;
      try {
        const claimed = JSON.parse(rawBody.toString("utf8")) as {
          id?: unknown;
        };
        if (
          typeof claimed.id === "string" &&
          claimed.id.startsWith("evt_")
        ) {
          claimedEventId = claimed.id;
        }
      } catch {
        // Handled by the invalid-payload response below.
      }

      if (!claimedEventId) {
        res.status(400).json({ error: "Invalid Stripe event payload" });
        return;
      }

      try {
        const stripe = await getUncachableStripeClient();
        event = await stripe.events.retrieve(claimedEventId);
      } catch (err) {
        logger.error(
          { err, eventId: claimedEventId },
          "Could not verify Stripe event through API",
        );
        res.status(500).json({ error: "Could not verify Stripe event" });
        return;
      }
    }

    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object as Stripe.Checkout.Session;
      try {
        await handleCheckoutCompleted(session);
      } catch (err) {
        logger.error({ err, eventType: event.type }, "Error processing checkout fulfillment event");
        const msg = err instanceof Error ? err.message : String(err);
        await sendAdminAlertEmail({
          subject: "Checkout fulfillment failed",
          body: [
            `A checkout.session.completed event could not be processed.`,
            ``,
            `Session ID : ${session.id}`,
            `Buyer email: ${(session as Stripe.Checkout.Session).customer_details?.email ?? "unknown"}`,
            ``,
            `Error: ${msg}`,
            ``,
            `Action required: manually verify whether download tokens were created`,
            `for this session and resend the download email if needed.`,
          ].join("\n"),
        });
        res.status(500).json({ error: "Checkout fulfillment failed" });
        return;
      }
    }

    res.json({ received: true });
  },
);

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const stripe = await getUncachableStripeClient();
  const full = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["line_items.data.price.product"],
  });

  // Only fulfill verified-paid sessions. checkout.session.completed can fire
  // while an asynchronous payment method is still pending or unpaid — those
  // sessions are fulfilled later by checkout.session.async_payment_succeeded.
  if (full.payment_status !== "paid") {
    logger.info(
      { sessionId: session.id, paymentStatus: full.payment_status },
      "Webhook: session not paid yet — skipping fulfillment",
    );
    return;
  }

  const buyerEmail = full.customer_details?.email ?? "unknown";
  const lineItems = full.line_items?.data ?? [];

  for (const item of lineItems) {
    const price = item.price;
    const product = item.price?.product as Stripe.Product | null;
    if (!price || !product?.id) continue;

    const slugs = getGuideSlugsForPurchase({
      productId: product.id,
      priceId: price.id,
      unitAmount: price.unit_amount,
      currency: price.currency,
    });

    if (slugs.length === 0) {
      logger.warn(
        { productId: product.id, priceId: price.id },
        "Unknown or mismatched Stripe line item in webhook",
      );
      continue;
    }

    for (const guideSlug of slugs) {
      const { token, created } = await getOrCreateCheckoutDownloadToken({
        sessionId: session.id,
        guideSlug,
        buyerEmail,
      });

      if (created) {
        logger.info(
          { token: token.token, guideSlug, buyerEmail },
          "Webhook: download token created",
        );
      }

      // Exactly one webhook delivery claims email fulfillment. If the
      // order-success page won the token race, this webhook still sends it.
      const emailClaim = await claimDownloadEmail(token.token);
      if (emailClaim === "already-sent") {
        logger.info(
          { guideSlug, sessionId: session.id },
          "Webhook: download email already fulfilled",
        );
        continue;
      }
      if (emailClaim === "in-progress") {
        throw new Error(
          `Download email fulfillment is still in progress for ${guideSlug}`,
        );
      }

      const guideName = GUIDE_NAMES[guideSlug] ?? guideSlug;
      const downloadUrl = `https://aivass.com/download/${token.token}`;
      try {
        await sendDownloadEmail({
          to: buyerEmail,
          guideName,
          downloadUrl,
          idempotencyKey: `guide-download-${token.token}`,
        });
        await markDownloadEmailSent(token.token);
        logger.info(
          { token: token.token, guideSlug, buyerEmail },
          "Webhook: download email sent",
        );
      } catch (err) {
        await releaseDownloadEmailClaim(token.token);
        logger.error(
          { err, token: token.token, guideSlug },
          "Webhook: failed to send download email",
        );
        throw err;
      }
    }
  }
}

export default router;
