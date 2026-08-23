import { Router } from "express";
import Stripe from "stripe";
import {
  CreateCheckoutSessionResponse,
  CreateCheckoutSessionBody,
} from "@workspace/api-zod";
import { getGuideCatalogEntry } from "../lib/guide-catalog.js";
import { getUncachableStripeClient } from "../lib/stripe-client.js";

const router = Router();

const APP_ORIGIN = "https://aivass.com";

function resolveAppOrigin(requestOrigin: string | undefined): string {
  if (!requestOrigin) return APP_ORIGIN;

  try {
    const url = new URL(requestOrigin);
    const isAiVass = url.protocol === "https:" &&
      (url.hostname === "aivass.com" || url.hostname === "www.aivass.com");
    const isReplitPreview = url.protocol === "https:" &&
      url.hostname.endsWith(".replit.dev");
    const isLocalDevelopment = process.env.NODE_ENV !== "production" &&
      (url.hostname === "localhost" || url.hostname === "127.0.0.1");

    return isAiVass || isReplitPreview || isLocalDevelopment
      ? url.origin
      : APP_ORIGIN;
  } catch {
    return APP_ORIGIN;
  }
}

async function resolveCheckoutPrice(
  stripe: Stripe,
  priceId: string,
  productId: string,
  expectedAmount: number,
): Promise<Stripe.Price> {
  const price = await stripe.prices.retrieve(priceId);
  const resolvedProductId =
    typeof price.product === "string" ? price.product : price.product.id;

  if (
    !price.active ||
    price.type !== "one_time" ||
    price.currency !== "usd" ||
    price.unit_amount !== expectedAmount ||
    resolvedProductId !== productId
  ) {
    throw new Error(`Stripe price configuration is invalid for ${productId}`);
  }

  return price;
}

router.post("/checkout-session", async (req, res): Promise<void> => {
  const parsed = CreateCheckoutSessionBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.issues }, "Invalid checkout selection");
    res.status(400).json({ error: "Please select a valid guide." });
    return;
  }

  const { guideSlug } = parsed.data;
  const guide = getGuideCatalogEntry(guideSlug);
  if (!guide) {
    res.status(400).json({ error: "Please select a valid guide." });
    return;
  }

  try {
    const stripe = await getUncachableStripeClient();
    const price = await resolveCheckoutPrice(
      stripe,
      guide.priceId,
      guide.productId,
      guide.expectedAmount,
    );
    const origin = resolveAppOrigin(req.get("origin"));
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: price.id, quantity: 1 }],
      success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/order-cancel`,
      client_reference_id: guideSlug,
      metadata: {
        guide_slug: guideSlug,
        checkout_source: "aivass_web",
      },
    });

    if (!session.url) {
      throw new Error("Stripe did not return a hosted checkout URL");
    }

    req.log.info(
      { sessionId: session.id, guideSlug },
      "Fresh Stripe checkout session created",
    );
    res.status(201).json(
      CreateCheckoutSessionResponse.parse({ url: session.url }),
    );
  } catch (err) {
    req.log.error(
      { err, guideSlug },
      "Could not create Stripe checkout session",
    );
    res.status(502).json({
      error: "Secure checkout is temporarily unavailable. Please try again.",
    });
  }
});

export default router;