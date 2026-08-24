import assert from "node:assert/strict";
import http from "node:http";
import { test } from "node:test";
import express from "express";

const {
  GUIDE_CATALOG,
  createCheckoutRouter,
  getGuideSlugsForPurchase,
} = await import("../dist/testing.mjs");

function withRequestLogger(app) {
  app.use((req, _res, next) => {
    req.log = { info() {}, warn() {}, error() {} };
    next();
  });
  return app;
}

async function withServer(app, run) {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();

  try {
    return await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
}

function createCheckoutStripe({
  priceOverrides = {},
  sessions = [],
} = {}) {
  return {
    prices: {
      async retrieve(priceId) {
        const entry = Object.values(GUIDE_CATALOG).find(
          (guide) => guide.priceId === priceId,
        );
        if (!entry) throw new Error("Unknown test price");

        return {
          id: priceOverrides.id ?? entry.priceId,
          active: priceOverrides.active ?? true,
          type: priceOverrides.type ?? "one_time",
          currency: priceOverrides.currency ?? "usd",
          unit_amount: priceOverrides.unitAmount ?? entry.expectedAmount,
          product: priceOverrides.productId ?? entry.productId,
        };
      },
    },
    checkout: {
      sessions: {
        async create(parameters) {
          sessions.push(parameters);
          const index = sessions.length;
          return {
            id: `cs_contract_${index}`,
            url: `https://checkout.stripe.test/c/pay/cs_contract_${index}`,
          };
        },
      },
    },
  };
}

async function postCheckout(baseUrl, body, headers = {}) {
  const response = await fetch(`${baseUrl}/checkout-session`, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  return { status: response.status, body: await response.json() };
}

test("every catalog guide creates a fresh configured one-time USD Checkout Session", async () => {
  const sessions = [];
  const stripe = createCheckoutStripe({ sessions });
  const app = withRequestLogger(express());
  app.use(express.json());
  app.use(createCheckoutRouter({ getStripeClient: async () => stripe }));

  await withServer(app, async (baseUrl) => {
    const urls = [];
    for (const [guideSlug] of Object.entries(GUIDE_CATALOG)) {
      const response = await postCheckout(baseUrl, { guideSlug });
      assert.equal(response.status, 201);
      urls.push(response.body.url);
    }

    // A second click for the same guide must not recycle a completed or stale
    // Checkout Session URL.
    const repeat = await postCheckout(baseUrl, { guideSlug: "eb1a-master" });
    assert.equal(repeat.status, 201);
    urls.push(repeat.body.url);

    assert.equal(new Set(urls).size, urls.length);
    assert.equal(sessions.length, Object.keys(GUIDE_CATALOG).length + 1);

    for (const [index, [guideSlug, guide]] of Object.entries(GUIDE_CATALOG).entries()) {
      const checkout = sessions[index];
      assert.deepEqual(checkout.line_items, [
        { price: guide.priceId, quantity: 1 },
      ]);
      assert.equal(checkout.mode, "payment");
      assert.equal(checkout.client_reference_id, guideSlug);
      assert.deepEqual(checkout.metadata, {
        guide_slug: guideSlug,
        checkout_source: "aivass_web",
      });
      assert.equal(
        checkout.success_url,
        "https://aivass.com/order-success?session_id={CHECKOUT_SESSION_ID}",
      );
      assert.equal(checkout.cancel_url, "https://aivass.com/order-cancel");
    }
  });
});

test("checkout rejects invalid selections, foreign origins, and Stripe catalog drift", async () => {
  const sessions = [];
  const stripe = createCheckoutStripe({ sessions });
  const app = withRequestLogger(express());
  app.use(express.json());
  app.use(createCheckoutRouter({ getStripeClient: async () => stripe }));

  await withServer(app, async (baseUrl) => {
    for (const body of [
      {},
      { guideSlug: "anything-not-in-the-catalog" },
      { guideSlug: null },
    ]) {
      const response = await postCheckout(baseUrl, body);
      assert.equal(response.status, 400);
      assert.deepEqual(response.body, { error: "Please select a valid guide." });
    }
    assert.equal(sessions.length, 0);

    const foreignOrigin = await postCheckout(
      baseUrl,
      { guideSlug: "eb1a-master" },
      { origin: "https://checkout-attacker.example" },
    );
    assert.equal(foreignOrigin.status, 201);
    assert.equal(
      sessions[0].success_url,
      "https://aivass.com/order-success?session_id={CHECKOUT_SESSION_ID}",
    );
    assert.equal(sessions[0].cancel_url, "https://aivass.com/order-cancel");
  });

  for (const priceOverrides of [
    { id: "price_wrong" },
    { productId: "prod_wrong" },
    { unitAmount: GUIDE_CATALOG["eb1a-master"].expectedAmount + 1 },
    { currency: "eur" },
    { type: "recurring" },
  ]) {
    const driftSessions = [];
    const driftStripe = createCheckoutStripe({
      priceOverrides,
      sessions: driftSessions,
    });
    const driftApp = withRequestLogger(express());
    driftApp.use(express.json());
    driftApp.use(
      createCheckoutRouter({ getStripeClient: async () => driftStripe }),
    );

    await withServer(driftApp, async (baseUrl) => {
      const response = await postCheckout(baseUrl, { guideSlug: "eb1a-master" });
      assert.equal(response.status, 502);
      assert.deepEqual(response.body, {
        error: "Secure checkout is temporarily unavailable. Please try again.",
      });
    });
    assert.equal(driftSessions.length, 0);
  }
});

test("only the exact server-owned product, price, amount, and currency fulfill guides", () => {
  for (const [slug, guide] of Object.entries(GUIDE_CATALOG)) {
    const expectedSlugs =
      slug === "eb1a-complete"
        ? [
            "eb1a-master",
            "eb1a-business",
            "eb1a-arts",
            "eb1a-athletics",
            "eb1a-education",
            "eb1a-science",
          ]
        : [slug];
    const purchase = {
      productId: guide.productId,
      priceId: guide.priceId,
      unitAmount: guide.expectedAmount,
      currency: "usd",
    };

    assert.deepEqual(getGuideSlugsForPurchase(purchase), expectedSlugs);
    assert.deepEqual(
      getGuideSlugsForPurchase({ ...purchase, productId: "prod_foreign" }),
      [],
    );
    assert.deepEqual(
      getGuideSlugsForPurchase({ ...purchase, priceId: "price_foreign" }),
      [],
    );
    assert.deepEqual(
      getGuideSlugsForPurchase({
        ...purchase,
        unitAmount: purchase.unitAmount + 1,
      }),
      [],
    );
    assert.deepEqual(
      getGuideSlugsForPurchase({ ...purchase, currency: "eur" }),
      [],
    );
  }
});