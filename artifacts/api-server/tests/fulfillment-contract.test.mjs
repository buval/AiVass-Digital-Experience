import assert from "node:assert/strict";
import http from "node:http";
import { test } from "node:test";
import express from "express";

const {
  GUIDE_CATALOG,
  createOrderRouter,
  fulfillCheckoutSession,
} = await import("../dist/testing.mjs");

const BUNDLE_GUIDE_SLUGS = [
  "eb1a-master",
  "eb1a-business",
  "eb1a-arts",
  "eb1a-athletics",
  "eb1a-education",
  "eb1a-science",
];

function bundleSession() {
  const bundle = GUIDE_CATALOG["eb1a-complete"];
  return {
    id: "cs_bundle_contract",
    payment_status: "paid",
    customer_details: { email: "buyer@example.com" },
    line_items: {
      data: [
        {
          price: {
            id: bundle.priceId,
            unit_amount: bundle.expectedAmount,
            currency: "usd",
            product: { id: bundle.productId },
          },
        },
      ],
    },
  };
}

function fakeStripe(session) {
  return {
    checkout: {
      sessions: {
        async retrieve() {
          return session;
        },
      },
    },
  };
}

function tokenFactory(createdTokens) {
  return async ({ sessionId, guideSlug, buyerEmail }) => {
    createdTokens.push({ sessionId, guideSlug, buyerEmail });
    return {
      token: {
        token: `token-${guideSlug}`,
        guideSlug,
        attemptsRemaining: 3,
      },
      created: true,
    };
  };
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

test("order completion expands the complete collection into all six individual guides", async () => {
  const createdTokens = [];
  const app = express();
  app.use(
    createOrderRouter({
      getStripeClient: async () => fakeStripe(bundleSession()),
      createDownloadToken: tokenFactory(createdTokens),
    }),
  );

  await withServer(app, async (baseUrl) => {
    const response = await fetch(
      `${baseUrl}/order-complete?session_id=cs_bundle_contract`,
    );
    assert.equal(response.status, 200);
    const { downloads } = await response.json();
    assert.deepEqual(
      downloads.map((download) => download.guideSlug),
      BUNDLE_GUIDE_SLUGS,
    );
  });

  assert.deepEqual(
    createdTokens.map((token) => token.guideSlug),
    BUNDLE_GUIDE_SLUGS,
  );
  assert(createdTokens.every((token) => token.buyerEmail === "buyer@example.com"));
});

test("webhook fulfillment expands the complete collection and emails all six guides", async () => {
  const createdTokens = [];
  const sentEmails = [];
  const markedSent = [];

  await fulfillCheckoutSession(
    { id: "cs_bundle_contract" },
    {
      getStripeClient: async () => fakeStripe(bundleSession()),
      createDownloadToken: tokenFactory(createdTokens),
      claimDownloadEmail: async () => "claimed",
      markDownloadEmailSent: async (token) => {
        markedSent.push(token);
      },
      releaseDownloadEmailClaim: async () => {
        throw new Error("A successful email should not release its claim");
      },
      sendDownloadEmail: async (email) => {
        sentEmails.push(email);
      },
    },
  );

  assert.deepEqual(
    createdTokens.map((token) => token.guideSlug),
    BUNDLE_GUIDE_SLUGS,
  );
  assert.deepEqual(
    sentEmails.map((email) => email.idempotencyKey),
    BUNDLE_GUIDE_SLUGS.map((slug) => `guide-download-token-${slug}`),
  );
  assert.deepEqual(
    markedSent,
    BUNDLE_GUIDE_SLUGS.map((slug) => `token-${slug}`),
  );
});