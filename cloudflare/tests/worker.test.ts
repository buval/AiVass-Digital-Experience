import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import Stripe from "stripe";
import { createWorker } from "../worker";
import { Store, TOKEN_TTL, CODE_TTL } from "../store";
import { GUIDE_CATALOG } from "../../artifacts/api-server/src/lib/guide-catalog";
import { ARTICLES } from "../../artifacts/aivass-web/src/data/articles";

// Run the production SQL against SQLite, the same SQL dialect as D1. Runtime
// smoke tests separately exercise the real workerd/D1/R2 bindings.
function database() {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(
    readFileSync(
      new URL("../migrations/0001_store.sql", import.meta.url),
      "utf8",
    ),
  );
  function prepare(sql: string, params: unknown[] = []): any {
    return {
      bind: (...values: unknown[]) => prepare(sql, values),
      first: async () => sqlite.prepare(sql).get(...(params as any[])) ?? null,
      all: async () => ({
        results: sqlite.prepare(sql).all(...(params as any[])),
      }),
      run: async () => ({
        meta: sqlite.prepare(sql).run(...(params as any[])),
        success: true,
      }),
    };
  }
  return { prepare, sqlite };
}

function setup() {
  const db = database();
  let now = 1800000000000;
  const messages: any[] = [];
  const files = new Set(
    Object.keys(GUIDE_CATALOG)
      .filter((s) => s !== "eb1a-complete")
      .map((s) => `guides/${s}.pdf`),
  );
  let failEmail = false;
  let failStream = false;
  let retrievals = 0;
  let creations = 0;
  let checkoutParams: any;
  const guide = GUIDE_CATALOG["eb1a-master"];
  const session: any = {
    id: "cs_test_example",
    mode: "payment",
    payment_status: "paid",
    customer_details: { email: "BUYER@example.com" },
    line_items: {
      has_more: false,
      data: [
        {
          quantity: 1,
          price: {
            id: guide.priceId,
            unit_amount: guide.expectedAmount,
            currency: "usd",
            product: { id: guide.productId },
          },
        },
      ],
    },
  };
  const stripe: any = {
    prices: {
      retrieve: async (id: string) => {
        const entry = Object.values(GUIDE_CATALOG).find(
          (g) => g.priceId === id,
        )!;
        return {
          id,
          active: true,
          type: "one_time",
          currency: "usd",
          unit_amount: entry.expectedAmount,
          product: entry.productId,
        };
      },
    },
    checkout: {
      sessions: {
        retrieve: async () => {
          retrievals++;
          return session;
        },
        create: async (params: unknown) => {
          creations++;
          checkoutParams = params;
          return { url: "https://checkout.stripe.com/c/test" };
        },
      },
    },
  };
  const env: any = {
    DB: db,
    APP_ORIGIN: "https://aivass.com",
    STRIPE_SECRET_KEY: "sk_test_fake",
    STRIPE_WEBHOOK_SECRET: "whsec_test",
    RESEND_API_KEY: "re_test",
    ACCESS_CODE_SECRET:
      "long-random-testing-secret-with-more-than-32-characters",
    GUIDES: {
      head: async (key: string) => (files.has(key) ? { size: 8 } : null),
      get: async (key: string) =>
        files.has(key)
          ? {
              size: 8,
              body: new ReadableStream({
                start(controller) {
                  if (failStream)
                    controller.error(new Error("Storage failure"));
                  else {
                    controller.enqueue(new TextEncoder().encode("%PDF-1.7"));
                    controller.close();
                  }
                },
              }),
            }
          : null,
    },
    ASSETS: {
      fetch: async (r: Request) =>
        new Response(`asset:${new URL(r.url).pathname}`),
    },
  };
  const worker = createWorker({
    stripe: () => stripe,
    now: () => now,
    email: async (_env, message) => {
      if (failEmail) throw new Error("Resend failed");
      messages.push(message);
    },
  });
  async function request(
    path: string,
    method = "GET",
    body?: unknown,
    headers: Record<string, string> = {},
  ) {
    return worker.fetch(
      new Request(`https://aivass.com${path}`, {
        method,
        headers: { "Content-Type": "application/json", ...headers },
        body: body === undefined ? undefined : JSON.stringify(body),
      }),
      env,
    );
  }
  const order = () => request("/api/order-complete?session_id=cs_test_example");
  async function token() {
    const r = await order();
    assert.equal(r.status, 200);
    return ((await r.json()) as any).downloads[0].token;
  }
  async function code(email = "buyer@example.com") {
    const response = await request("/api/my-downloads/request-code", "POST", {
      email,
    });
    assert.equal(response.status, 200);
    return messages.at(-1).subject.match(/\d{6}/)[0];
  }
  async function verify(email = "buyer@example.com") {
    const c = await code(email);
    const response = await request("/api/my-downloads/verify-code", "POST", {
      email,
      code: c,
    });
    assert.equal(response.status, 200);
    return ((await response.json()) as any).accessToken;
  }
  async function webhook(
    signature = true,
    eventType = "checkout.session.completed",
  ) {
    const payload = JSON.stringify({
      id: "evt_test",
      object: "event",
      type: eventType,
      data: { object: { id: session.id } },
    });
    const sig = new Stripe("sk_test_dummy").webhooks.generateTestHeaderString({
      payload,
      secret: env.STRIPE_WEBHOOK_SECRET,
    });
    return worker.fetch(
      new Request("https://aivass.com/api/webhooks/stripe", {
        method: "POST",
        body: payload,
        headers: signature
          ? { "Stripe-Signature": sig }
          : { "Stripe-Signature": "invalid" },
      }),
      env,
    );
  }
  return {
    db,
    env,
    worker,
    request,
    order,
    token,
    code,
    verify,
    webhook,
    messages,
    files,
    session,
    store: new Store(db as any),
    get retrievals() {
      return retrievals;
    },
    get creations() {
      return creations;
    },
    get checkoutParams() {
      return checkoutParams;
    },
    advance: (ms: number) => {
      now += ms;
    },
    get now() {
      return now;
    },
    failEmail: () => {
      failEmail = true;
    },
    recoverEmail: () => {
      failEmail = false;
    },
    failStream: () => {
      failStream = true;
    },
  };
}

test("static routes bypass the API; unknown API routes return JSON rather than SPA HTML", async () => {
  const f = setup();
  assert.equal(
    await (await f.request("/insights/example")).text(),
    "asset:/insights/example",
  );
  const r = await f.request("/api/unknown");
  assert.equal(r.status, 404);
  assert.match(r.headers.get("content-type")!, /json/);
});
test("public samples support native PDF byte ranges, suffixes and If-Range", async () => {
  const f = setup();
  f.env.ASSETS.fetch = async () =>
    new Response("%PDF-1.7", {
      headers: { "Content-Type": "application/pdf", ETag: '"sample"' },
    });
  const partial = await f.request("/samples/example.pdf", "GET", undefined, {
    Range: "bytes=0-4",
  });
  assert.equal(partial.status, 206);
  assert.equal(await partial.text(), "%PDF-");
  assert.equal(partial.headers.get("content-range"), "bytes 0-4/8");
  const suffix = await f.request("/samples/example.pdf", "GET", undefined, {
    Range: "bytes=-3",
  });
  assert.equal(await suffix.text(), "1.7");
  for (const Range of ["bytes=99-", "bytes=5-1", "bytes=-0", "invalid"])
    assert.equal(
      (await f.request("/samples/example.pdf", "GET", undefined, { Range }))
        .status,
      416,
    );
  const changed = await f.request("/samples/example.pdf", "GET", undefined, {
    Range: "bytes=0-4",
    "If-Range": '"older"',
  });
  assert.equal(changed.status, 200);
  assert.equal(await changed.text(), "%PDF-1.7");
});
test("latest article redirects keep queries and unknown articles return real 404s", async () => {
  const f = setup();
  const slug = ARTICLES[0].slug;
  for (const path of [
    `/articles/${slug}`,
    `/articles/${slug}/`,
    `/blog/${slug}`,
  ]) {
    const r = await f.request(path + "?utm_source=test");
    assert.equal(r.status, 301);
    assert.equal(
      r.headers.get("location"),
      `/insights/articles/${slug}?utm_source=test`,
    );
  }
  for (const path of [
    "/blog",
    "/blog/unknown",
    "/articles/unknown",
    "/articles/a/b",
    "/insights/articles/unknown",
  ]) {
    const r = await f.request(path);
    assert.equal(r.status, 404);
    assert.equal(r.headers.get("x-robots-tag"), "noindex");
  }
  assert.equal(
    await (await f.request(`/insights/articles/${slug}/`)).text(),
    `asset:/insights/articles/${slug}/`,
  );
});
test("Stripe sandbox ID overrides preserve server-owned prices and fulfillment rules", async () => {
  const f = setup();
  f.env.STRIPE_CATALOG_JSON = JSON.stringify({
    "eb1a-master": { productId: "prod_Sandbox", priceId: "price_Sandbox" },
  });
  f.session.line_items.data[0].price.product.id = "prod_Sandbox";
  f.session.line_items.data[0].price.id = "price_Sandbox";
  assert.equal((await f.order()).status, 200);
  f.session.line_items.data[0].price.unit_amount = 1;
  assert.equal((await f.order()).status, 422);
});
test("checkout creates fresh sessions with catalog prices and trusted return origin", async () => {
  const f = setup();
  for (let i = 0; i < 2; i++)
    assert.equal(
      (
        await f.request(
          "/api/checkout-session",
          "POST",
          { guideSlug: "eb1a-master", priceId: "attacker" },
          { Origin: "https://evil.test" },
        )
      ).status,
      201,
    );
  assert.equal(f.creations, 2);
  assert.equal(
    f.checkoutParams.line_items[0].price,
    GUIDE_CATALOG["eb1a-master"].priceId,
  );
  assert.equal(
    f.checkoutParams.success_url,
    "https://aivass.com/order-success?session_id={CHECKOUT_SESSION_ID}",
  );
});
test("checkout rejects unknown/prototype slugs and cannot sell missing PDFs or partially provisioned bundles", async () => {
  const f = setup();
  for (const slug of ["bad", "toString", "__proto__"])
    assert.equal(
      (await f.request("/api/checkout-session", "POST", { guideSlug: slug }))
        .status,
      400,
    );
  f.files.delete("guides/eb1a-science.pdf");
  assert.equal(
    (
      await f.request("/api/checkout-session", "POST", {
        guideSlug: "eb1a-complete",
      })
    ).status,
    503,
  );
  assert.equal(f.creations, 0);
  f.env.RESEND_API_KEY = "";
  assert.equal(
    (
      await f.request("/api/checkout-session", "POST", {
        guideSlug: "eb1a-master",
      })
    ).status,
    503,
  );
});
test("input errors do not leak internal errors", async () => {
  const f = setup();
  assert.equal(
    (
      await f.request("/api/my-downloads/request-code", "POST", {
        email: { bad: "type" },
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await f.request("/api/checkout-session", "POST", {
        guideSlug: "x".repeat(9000),
      })
    ).status,
    413,
  );
});
test("concurrent success-page and webhook fulfillment share one token and email", async () => {
  const f = setup();
  const results = await Promise.all([f.order(), f.webhook(), f.webhook()]);
  assert.ok(results.every((r) => [200, 503].includes(r.status)));
  assert.equal(
    f.db.sqlite.prepare("SELECT COUNT(*) AS n FROM download_tokens").get()!.n,
    1,
  );
  assert.equal(f.messages.length, 1);
  assert.equal((await f.webhook()).status, 200);
  assert.equal(f.messages.length, 1);
  assert.equal((await f.store.purchases("buyer@example.com")).length, 1);
});
test("email provider failure leaves fulfillment retryable with stable provider idempotency key", async () => {
  const f = setup();
  f.failEmail();
  assert.equal((await f.webhook()).status, 503);
  const row = (await f.store.purchases("buyer@example.com"))[0];
  assert.equal(row.email_sent_at, null);
  assert.equal(row.email_claim, null);
  f.recoverEmail();
  assert.equal((await f.webhook()).status, 200);
  assert.equal(f.messages[0].key, `guide-download-${row.token}`);
});
test("stale email lease may be reclaimed; an old owner cannot release the new lease", async () => {
  const f = setup();
  const token = await f.token();
  const first = await f.store.emailClaim(token, f.now);
  assert.equal(first.status, "claimed");
  f.advance(6 * 60 * 1000);
  const second = await f.store.emailClaim(token, f.now);
  assert.equal(second.status, "claimed");
  await f.store.releaseEmail(token, (first as any).claim);
  assert.equal(
    (await f.store.token(token))!.email_claim,
    (second as any).claim,
  );
});
test("invalid/missing webhook signatures reject before Stripe retrieval or token creation", async () => {
  const f = setup();
  assert.equal((await f.webhook(false)).status, 400);
  assert.equal(f.retrievals, 0);
  f.env.STRIPE_WEBHOOK_SECRET = "";
  assert.equal((await f.webhook()).status, 503);
  assert.equal(f.retrievals, 0);
});
test("unpaid sessions never fulfill; asynchronous success retries after payment", async () => {
  const f = setup();
  f.session.payment_status = "unpaid";
  assert.equal((await f.order()).status, 402);
  assert.equal((await f.webhook()).status, 200);
  assert.equal(
    f.db.sqlite.prepare("SELECT COUNT(*) AS n FROM download_tokens").get()!.n,
    0,
  );
  f.session.payment_status = "paid";
  assert.equal(
    (await f.webhook(true, "checkout.session.async_payment_succeeded")).status,
    200,
  );
  assert.equal(f.messages.length, 1);
});
test("mismatched product/price/amount/currency/quantity never grant downloads", async () => {
  for (const field of [
    "id",
    "unit_amount",
    "currency",
    "product",
    "quantity",
  ]) {
    const f = setup();
    const item = f.session.line_items.data[0];
    if (field === "quantity") item.quantity = 2;
    else
      item.price[field] =
        field === "unit_amount"
          ? 1
          : field === "product"
            ? { id: "prod_wrong" }
            : "wrong";
    assert.equal((await f.order()).status, 422);
    assert.equal(
      f.db.sqlite.prepare("SELECT COUNT(*) AS n FROM download_tokens").get()!.n,
      0,
    );
  }
});
test("complete collection grants exactly six private guide tokens", async () => {
  const f = setup();
  const g = GUIDE_CATALOG["eb1a-complete"];
  f.session.line_items.data[0].price = {
    id: g.priceId,
    unit_amount: g.expectedAmount,
    currency: "usd",
    product: { id: g.productId },
  };
  const response = await f.order();
  assert.equal(((await response.json()) as any).downloads.length, 6);
});
test("concurrent downloads cannot exceed three attempts, and PDFs are never publicly cached", async () => {
  const f = setup();
  const token = await f.token();
  const results = await Promise.all(
    Array.from({ length: 8 }, () => f.request(`/api/download/${token}`)),
  );
  assert.equal(results.filter((r) => r.status === 200).length, 3);
  assert.equal(results.filter((r) => r.status === 410).length, 5);
  for (const r of results.filter((r) => r.status === 200)) {
    assert.match(r.headers.get("cache-control")!, /no-store/);
    assert.equal(await r.text(), "%PDF-1.7");
  }
  assert.equal((await f.store.token(token))!.attempts_remaining, 0);
});
test("missing storage and HEAD requests do not consume downloads; expiry is explicit", async () => {
  const f = setup();
  const token = await f.token();
  assert.equal((await f.request(`/api/download/${token}`, "HEAD")).status, 405);
  f.files.clear();
  assert.equal((await f.request(`/api/download/${token}`)).status, 503);
  assert.equal((await f.store.token(token))!.attempts_remaining, 3);
  f.advance(TOKEN_TTL);
  const expired = await f.request(`/api/download/${token}`);
  assert.equal(expired.status, 410);
  assert.equal(((await expired.json()) as any).code, "expired");
});
test("R2 stream failures refund a claimed download", async () => {
  const f = setup();
  const token = await f.token();
  f.failStream();
  const r = await f.request(`/api/download/${token}`);
  await assert.rejects(() => r.text());
  assert.equal((await f.store.token(token))!.attempts_remaining, 3);
});
test("recovery requires verification, isolates buyers and prevents OTP replay", async () => {
  const f = setup();
  await f.token();
  assert.equal((await f.request("/api/my-downloads")).status, 401);
  const code = await f.code();
  const verified = await f.request("/api/my-downloads/verify-code", "POST", {
    email: "BUYER@example.com",
    code,
  });
  const { accessToken } = (await verified.json()) as any;
  assert.equal(
    (
      await f.request("/api/my-downloads/verify-code", "POST", {
        email: "buyer@example.com",
        code,
      })
    ).status,
    410,
  );
  const result = await f.request("/api/my-downloads", "GET", undefined, {
    "X-Access-Token": accessToken,
  });
  assert.equal(((await result.json()) as any).purchases.length, 1);
  const other = await f.verify("other@example.com");
  const isolated = await f.request("/api/my-downloads", "GET", undefined, {
    "X-Access-Token": other,
  });
  assert.deepEqual(((await isolated.json()) as any).purchases, []);
  f.advance(31 * 60 * 1000);
  assert.equal(
    (
      await f.request("/api/my-downloads", "GET", undefined, {
        "X-Access-Token": accessToken,
      })
    ).status,
    401,
  );
});
test("concurrent OTP requests/guesses honor quotas and never revive older codes", async () => {
  const f = setup();
  const results = await Promise.all(
    Array.from({ length: 8 }, () =>
      f.request("/api/my-downloads/request-code", "POST", {
        email: "buyer@example.com",
      }),
    ),
  );
  assert.equal(results.filter((r) => r.status === 200).length, 3);
  assert.equal(results.filter((r) => r.status === 429).length, 5);
  const wrong = "not-a-code";
  assert.equal(
    (
      await f.request("/api/my-downloads/verify-code", "POST", {
        email: "buyer@example.com",
        code: wrong,
      })
    ).status,
    400,
  );
  const correct = f.messages.at(-1).subject.match(/\d{6}/)[0];
  const incorrect = correct === "999999" ? "000000" : "999999";
  const guessResults = await Promise.all(
    Array.from({ length: 10 }, () =>
      f.request("/api/my-downloads/verify-code", "POST", {
        email: "buyer@example.com",
        code: incorrect,
      }),
    ),
  );
  assert.equal(guessResults.filter((r) => r.status === 401).length, 5);
  assert.equal(guessResults.filter((r) => r.status === 410).length, 5);
  const rows = f.db.sqlite
    .prepare(
      "SELECT attempts_remaining FROM download_access_codes ORDER BY rowid DESC",
    )
    .all();
  assert.deepEqual(
    rows.map((r) => r.attempts_remaining),
    [0, 5, 5],
  );
});
test("concurrent refresh grants one link, requires ownership and enforces lifetime cap", async () => {
  const f = setup();
  await f.token();
  const access = await f.verify();
  const headers = { "X-Access-Token": access };
  assert.equal(
    (
      await f.request(
        "/api/my-downloads/refresh",
        "POST",
        { guideSlug: "eb1a-master" },
        headers,
      )
    ).status,
    409,
  );
  f.db.sqlite.exec("UPDATE download_tokens SET attempts_remaining=0");
  const results = await Promise.all(
    Array.from({ length: 5 }, () =>
      f.request(
        "/api/my-downloads/refresh",
        "POST",
        { guideSlug: "eb1a-master", email: "attacker@example.com" },
        headers,
      ),
    ),
  );
  assert.equal(results.filter((r) => r.status === 200).length, 1);
  assert.equal(
    (
      await f.request(
        "/api/my-downloads/refresh",
        "POST",
        { guideSlug: "eb1a-science" },
        headers,
      )
    ).status,
    404,
  );
  for (let i = 2; i < 10; i++) {
    f.db.sqlite.exec("UPDATE download_tokens SET attempts_remaining=0");
    assert.equal(
      (
        await f.request(
          "/api/my-downloads/refresh",
          "POST",
          { guideSlug: "eb1a-master" },
          headers,
        )
      ).status,
      200,
    );
  }
  f.db.sqlite.exec("UPDATE download_tokens SET attempts_remaining=0");
  assert.equal(
    (
      await f.request(
        "/api/my-downloads/refresh",
        "POST",
        { guideSlug: "eb1a-master" },
        headers,
      )
    ).status,
    429,
  );
});
test("scheduled cleanup prunes expired codes while retaining purchase history", async () => {
  const f = setup();
  await f.token();
  await f.code();
  f.advance(2 * CODE_TTL + 1);
  await f.worker.scheduled({} as any, f.env);
  assert.equal(
    f.db.sqlite
      .prepare("SELECT COUNT(*) AS n FROM download_access_codes")
      .get()!.n,
    0,
  );
  assert.equal(
    f.db.sqlite.prepare("SELECT COUNT(*) AS n FROM download_tokens").get()!.n,
    1,
  );
});
