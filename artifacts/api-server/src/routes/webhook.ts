/**
 * POST /api/webhooks/stripe
 *
 * Verifies the event with Stripe's endpoint signing secret, handles
 * checkout.session.completed,
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

// `constructEvent` is a local HMAC check and never uses this placeholder
// credential. Actual Stripe API calls use getUncachableStripeClient instead.
const webhookVerifier = new Stripe("sk_test_local_signature_verifier", {
  apiVersion: "2026-07-29.dahlia",
});

type StripeClientFactory = () => Promise<Stripe>;
type DownloadTokenCreator = typeof getOrCreateCheckoutDownloadToken;

export interface WebhookFulfillmentDependencies {
  getStripeClient: StripeClientFactory;
  createDownloadToken: DownloadTokenCreator;
  claimDownloadEmail: typeof claimDownloadEmail;
  markDownloadEmailSent: typeof markDownloadEmailSent;
  releaseDownloadEmailClaim: typeof releaseDownloadEmailClaim;
  sendDownloadEmail: typeof sendDownloadEmail;
}

const defaultFulfillmentDependencies: WebhookFulfillmentDependencies = {
  getStripeClient: getUncachableStripeClient,
  createDownloadToken: getOrCreateCheckoutDownloadToken,
  claimDownloadEmail,
  markDownloadEmailSent,
  releaseDownloadEmailClaim,
  sendDownloadEmail,
};

// Raw body parser — Stripe signature verification requires the raw buffer
export function createWebhookRouter(
  fulfillmentDependencies: WebhookFulfillmentDependencies =
    defaultFulfillmentDependencies,
) {
  const router = Router();

  router.post(
    "/stripe",
    express.raw({ type: "*/*" }),
    async (req, res): Promise<void> => {
      const sig = req.headers["stripe-signature"];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      const rawBody = req.body as Buffer;
      if (!webhookSecret) {
        logger.error(
          "Stripe webhook signing secret is not configured; rejecting delivery",
        );
        res.status(503).json({ error: "Webhook verification is unavailable" });
        return;
      }

      if (typeof sig !== "string") {
        logger.warn("Stripe webhook missing its signature; rejecting delivery");
        res.status(400).json({ error: "Invalid Stripe signature" });
        return;
      }

      let event: Stripe.Event;
      try {
        event = webhookVerifier.webhooks.constructEvent(
          rawBody,
          sig,
          webhookSecret,
        );
      } catch {
        // Do not retrieve a claimed event ID from Stripe here. That would let
        // anyone who knows an event ID trigger fulfillment without proving this
        // delivery came from Stripe.
        logger.warn(
          "Stripe webhook signature did not match; rejecting delivery",
        );
        res.status(400).json({ error: "Invalid Stripe signature" });
        return;
      }

      if (
        event.type === "checkout.session.completed" ||
        event.type === "checkout.session.async_payment_succeeded"
      ) {
        const session = event.data.object as Stripe.Checkout.Session;
        try {
          await fulfillCheckoutSession(session, fulfillmentDependencies);
        } catch (err) {
          logger.error(
            { err, eventType: event.type },
            "Error processing checkout fulfillment event",
          );
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

  return router;
}

export async function fulfillCheckoutSession(
  session: Stripe.Checkout.Session,
  {
    getStripeClient,
    createDownloadToken,
    claimDownloadEmail: claimEmail,
    markDownloadEmailSent: markEmailSent,
    releaseDownloadEmailClaim: releaseEmailClaim,
    sendDownloadEmail: sendEmail,
  }: WebhookFulfillmentDependencies = defaultFulfillmentDependencies,
) {
  const stripe = await getStripeClient();
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
      const { token, created } = await createDownloadToken({
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
      const emailClaim = await claimEmail(token.token);
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
        await sendEmail({
          to: buyerEmail,
          guideName,
          downloadUrl,
          idempotencyKey: `guide-download-${token.token}`,
        });
        await markEmailSent(token.token);
        logger.info(
          { token: token.token, guideSlug, buyerEmail },
          "Webhook: download email sent",
        );
      } catch (err) {
        await releaseEmailClaim(token.token);
        logger.error(
          { err, token: token.token, guideSlug },
          "Webhook: failed to send download email",
        );
        throw err;
      }
    }
  }
}

export default createWebhookRouter();
