import { Router } from "express";
import Stripe from "stripe";
import {
  CreateCheckoutSessionResponse,
  CreateCheckoutSessionBody,
} from "@workspace/api-zod";
import { getGuideCatalogEntry } from "../lib/guide-catalog.js";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-07-29.dahlia",
});

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
  productId: string,
  expectedAmount: number,
): Promise<Stripe.Price> {
  const product = await stripe.products.retrieve(productId, {
    expand: ["default_price"],
  });

  if (!product.active) {
    throw new Error(`Stripe product ${productId} is inactive`);
  }

  let price: Stripe.Price | null = null;
  if (typeof product.default_price === "string") {
    price = await stripe.prices.retrieve(product.default_price);
  } else if (product.default_price) {
    price = product.default_price;
  }

  // Some legacy Stripe products do not have default_price set. Select only an
  // active one-time USD price that exactly matches the server-owned catalog.
  if (!price) {
    const prices = await stripe.prices.list({
      product: productId,
      active: true,
      type: "one_time",
      limit: 100,
    });
    price = prices.data.find(
      (candidate) =>
        candidate.currency === "usd" &&
        candidate.unit_amount === expectedAmount,
    ) ?? null;
  }

  if (
    !price ||
    !price.active ||
    price.type !== "one_time" ||
    price.currency !== "usd" ||
    price.unit_amount !== expectedAmount
  ) {
    throw new Error(
      `No active USD price matching ${expectedAmount} cents for ${productId}`,
    );
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
    const price = await resolveCheckoutPrice(
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