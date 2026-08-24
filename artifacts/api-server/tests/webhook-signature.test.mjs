import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import http from "node:http";
import express from "express";
import Stripe from "stripe";

const initialSecret = "whsec_test_initial_webhook_secret";
const rotatedSecret = "whsec_test_rotated_webhook_secret";
process.env.STRIPE_WEBHOOK_SECRET = initialSecret;

const { default: app } = await import("../dist/app.mjs");
const {
  createWebhookRouter,
  WebhookVerificationAlertMonitor,
} = await import("../dist/testing.mjs");
const signingClient = new Stripe("sk_test_local_signature_test_client", {
  apiVersion: "2026-07-29.dahlia",
});
const payload = JSON.stringify({
  id: "evt_test_webhook_signature",
  object: "event",
  type: "customer.created",
  data: { object: { id: "cus_test_webhook_signature", object: "customer" } },
});

let server;
let port;

before(async () => {
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  port = server.address().port;
});

after(async () => {
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
});

function signedHeader(secret) {
  return signingClient.webhooks.generateTestHeaderString({
    payload,
    secret,
  });
}

function deliver(signature, targetPort = port) {
  return new Promise((resolve, reject) => {
    const headers = {
      "content-type": "application/json",
      "content-length": Buffer.byteLength(payload),
    };
    if (signature !== undefined) {
      headers["stripe-signature"] = signature;
    }

    const request = http.request(
      {
        hostname: "127.0.0.1",
        port: targetPort,
        path: "/api/webhooks/stripe",
        method: "POST",
        headers,
      },
      (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => (body += chunk));
        response.on("end", () =>
          resolve({ status: response.statusCode, body }),
        );
      },
    );
    request.on("error", reject);
    request.end(payload);
  });
}

function createAlertMonitor(alerts, now = () => 10_000) {
  return new WebhookVerificationAlertMonitor({
    sendAdminAlert: async (alert) => alerts.push(alert),
    now,
    signatureFailureThreshold: 5,
    signatureFailureWindowMs: 5 * 60 * 1000,
    alertCooldownMs: 6 * 60 * 60 * 1000,
  });
}

async function withWebhookRouter(alertMonitor, run) {
  const testApp = express();
  testApp.use("/api/webhooks", createWebhookRouter(undefined, alertMonitor));
  const testServer = http.createServer(testApp);
  await new Promise((resolve) =>
    testServer.listen(0, "127.0.0.1", resolve),
  );

  try {
    return await run(testServer.address().port);
  } finally {
    await new Promise((resolve, reject) =>
      testServer.close((error) => (error ? reject(error) : resolve())),
    );
  }
}

test("accepts a delivery signed with the configured endpoint secret", async () => {
  process.env.STRIPE_WEBHOOK_SECRET = initialSecret;
  const response = await deliver(signedHeader(initialSecret));
  assert.equal(response.status, 200);
  assert.deepEqual(JSON.parse(response.body), { received: true });
});

test("rejects a delivery with an invalid signature", async () => {
  process.env.STRIPE_WEBHOOK_SECRET = initialSecret;
  const response = await deliver(signedHeader("whsec_test_not_the_endpoint_secret"));
  assert.equal(response.status, 400);
  assert.deepEqual(JSON.parse(response.body), { error: "Invalid Stripe signature" });
});

test("accepts the replacement secret and rejects the retired secret after rotation", async () => {
  process.env.STRIPE_WEBHOOK_SECRET = rotatedSecret;

  const replacement = await deliver(signedHeader(rotatedSecret));
  assert.equal(replacement.status, 200);

  const retired = await deliver(signedHeader(initialSecret));
  assert.equal(retired.status, 400);
});

test("fails closed when the endpoint secret is unavailable", async () => {
  await withWebhookRouter(createAlertMonitor([]), async (testPort) => {
    delete process.env.STRIPE_WEBHOOK_SECRET;

    const response = await deliver(signedHeader(initialSecret), testPort);
    assert.equal(response.status, 503);
    assert.deepEqual(JSON.parse(response.body), {
      error: "Webhook verification is unavailable",
    });
  });
});

test("rejects a delivery without a Stripe signature", async () => {
  process.env.STRIPE_WEBHOOK_SECRET = initialSecret;

  const response = await deliver();
  assert.equal(response.status, 400);
  assert.deepEqual(JSON.parse(response.body), { error: "Invalid Stripe signature" });
});

test("does not alert for a one-off invalid signature, then alerts once for sustained failures", async () => {
  process.env.STRIPE_WEBHOOK_SECRET = initialSecret;
  const alerts = [];
  let now = 10_000;
  const alertMonitor = createAlertMonitor(alerts, () => now);

  await withWebhookRouter(alertMonitor, async (testPort) => {
    const invalidSignature = signedHeader("whsec_test_wrong_secret");
    const first = await deliver(invalidSignature, testPort);
    assert.equal(first.status, 400);
    assert.equal(alerts.length, 0);

    for (let attempt = 0; attempt < 4; attempt += 1) {
      const response = await deliver(invalidSignature, testPort);
      assert.equal(response.status, 400);
    }

    assert.equal(alerts.length, 1);
    assert.equal(
      alerts[0].subject,
      "Repeated Stripe webhook signature verification failures",
    );
    assert.match(alerts[0].body, /Action required:/);
    assert.equal(alerts[0].body.includes(invalidSignature), false);
    assert.equal(alerts[0].body.includes(payload), false);
    assert.doesNotMatch(
      alerts[0].body,
      /whsec_test_wrong_secret|evt_test_webhook_signature|cus_test_webhook_signature/,
    );

    for (let attempt = 0; attempt < 20; attempt += 1) {
      const response = await deliver(invalidSignature, testPort);
      assert.equal(response.status, 400);
    }
    assert.equal(alerts.length, 1);

    now += 6 * 60 * 60 * 1000;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const response = await deliver(invalidSignature, testPort);
      assert.equal(response.status, 400);
    }
    assert.equal(alerts.length, 2);
  });
});

test("alerts once when the Stripe signing secret is missing", async () => {
  const alerts = [];
  const alertMonitor = createAlertMonitor(alerts);

  await withWebhookRouter(alertMonitor, async (testPort) => {
    delete process.env.STRIPE_WEBHOOK_SECRET;
    const first = await deliver(signedHeader(initialSecret), testPort);
    const second = await deliver(signedHeader(initialSecret), testPort);

    assert.equal(first.status, 503);
    assert.equal(second.status, 503);
    assert.equal(alerts.length, 1);
    assert.equal(
      alerts[0].subject,
      "Stripe webhook signing secret is not configured",
    );
    assert.match(alerts[0].body, /Action required:/);
    assert.equal(alerts[0].body.includes(signedHeader(initialSecret)), false);
    assert.equal(alerts[0].body.includes(payload), false);
    assert.doesNotMatch(
      alerts[0].body,
      /whsec_test_initial_webhook_secret|evt_test_webhook_signature|cus_test_webhook_signature/,
    );
  });
});