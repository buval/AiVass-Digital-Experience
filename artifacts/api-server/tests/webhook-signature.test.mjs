import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import http from "node:http";
import Stripe from "stripe";

const initialSecret = "whsec_test_initial_webhook_secret";
const rotatedSecret = "whsec_test_rotated_webhook_secret";
process.env.STRIPE_WEBHOOK_SECRET = initialSecret;

const { default: app } = await import("../dist/app.mjs");
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

function deliver(signature) {
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
        port,
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
  delete process.env.STRIPE_WEBHOOK_SECRET;

  const response = await deliver(signedHeader(initialSecret));
  assert.equal(response.status, 503);
  assert.deepEqual(JSON.parse(response.body), {
    error: "Webhook verification is unavailable",
  });
});

test("rejects a delivery without a Stripe signature", async () => {
  process.env.STRIPE_WEBHOOK_SECRET = initialSecret;

  const response = await deliver();
  assert.equal(response.status, 400);
  assert.deepEqual(JSON.parse(response.body), { error: "Invalid Stripe signature" });
});