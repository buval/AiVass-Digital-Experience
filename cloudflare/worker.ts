import Stripe from "stripe";
import {
  GUIDE_NAMES,
  getGuideCatalogEntry,
} from "../artifacts/api-server/src/lib/guide-catalog";
import { catalog, purchaseSlugs } from "./catalog";
import { Store } from "./store";
import type { DownloadToken, Env } from "./types";
import { ARTICLES } from "../artifacts/aivass-web/src/data/articles";

const articleSlugs = new Set(ARTICLES.map((article) => article.slug));

async function sampleResponse(request: Request, env: Env) {
  const range = request.headers.get("Range");
  if (request.method !== "GET" || !range) return env.ASSETS.fetch(request);
  const headers = new Headers(request.headers);
  headers.delete("Range");
  headers.delete("If-Range");
  headers.set("Accept-Encoding", "identity");
  const full = await env.ASSETS.fetch(new Request(request, { headers }));
  if (
    full.status !== 200 ||
    !full.headers.get("Content-Type")?.includes("application/pdf")
  )
    return full;
  const ifRange = request.headers.get("If-Range");
  if (
    ifRange &&
    ifRange !== full.headers.get("ETag") &&
    ifRange !== full.headers.get("Last-Modified")
  )
    return full;
  // Workers Assets currently returns full bodies for Range requests locally.
  // Public samples are small; provide deterministic byte ranges for native PDF
  // viewers on both the local runtime and the deployed Worker.
  const bytes = await full.arrayBuffer();
  const size = bytes.byteLength;
  const match = range.match(/^bytes=(\d*)-(\d*)$/);
  const start = match?.[1]
    ? Number(match[1])
    : Math.max(0, size - Number(match?.[2]));
  const end = match?.[1]
    ? match[2]
      ? Math.min(Number(match[2]), size - 1)
      : size - 1
    : size - 1;
  const outputHeaders = new Headers(full.headers);
  outputHeaders.delete("Content-Encoding");
  outputHeaders.set("Accept-Ranges", "bytes");
  if (
    !match ||
    (!match[1] && !match[2]) ||
    !Number.isSafeInteger(start) ||
    !Number.isSafeInteger(end) ||
    start >= size ||
    end < start ||
    (!match[1] && Number(match[2]) === 0)
  ) {
    outputHeaders.set("Content-Range", `bytes */${size}`);
    outputHeaders.set("Content-Length", "0");
    return new Response(null, { status: 416, headers: outputHeaders });
  }
  outputHeaders.set("Content-Range", `bytes ${start}-${end}/${size}`);
  outputHeaders.set("Content-Length", String(end - start + 1));
  return new Response(bytes.slice(start, end + 1), {
    status: 206,
    headers: outputHeaders,
  });
}

type Email = { to: string; subject: string; text: string; key: string };
interface Services {
  stripe: (env: Env) => Stripe;
  email: (env: Env, message: Email) => Promise<void>;
  now: () => number;
}
const defaults: Services = {
  stripe(env) {
    if (!/^(sk|rk)_(test|live)_/.test(env.STRIPE_SECRET_KEY ?? "")) {
      throw new Error("Configure a direct Stripe API credential");
    }
    return new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-07-29.dahlia",
      httpClient: Stripe.createFetchHttpClient(),
      maxNetworkRetries: 1,
    });
  },
  async email(env, message) {
    if (!env.RESEND_API_KEY)
      throw new Error("Email delivery is not configured");
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": message.key,
      },
      body: JSON.stringify({
        from: "AiVass Guides <guides@aivass.com>",
        to: message.to,
        subject: message.subject,
        text: message.text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok)
      throw new Error(`Email provider returned ${response.status}`);
  },
  now: () => Date.now(),
};

class ApiError extends Error {
  status: number;
  code?: string;
  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}
const json = (body: unknown, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
function origin(env: Env) {
  const url = new URL(env.APP_ORIGIN);
  if (
    url.protocol !== "https:" &&
    url.hostname !== "localhost" &&
    url.hostname !== "127.0.0.1"
  ) {
    throw new Error("APP_ORIGIN must use HTTPS");
  }
  return url.origin;
}
function emailAddress(value: unknown) {
  if (
    typeof value !== "string" ||
    value.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  ) {
    throw new ApiError(400, "A valid email address is required.");
  }
  return value.trim().toLowerCase();
}
async function body(request: Request): Promise<Record<string, unknown>> {
  // Bound incoming checkout/recovery payloads independently of Content-Length.
  const reader = request.body?.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  if (reader) {
    while (true) {
      const result = await reader.read();
      if (result.done) break;
      size += result.value.byteLength;
      if (size > 8192) {
        await reader.cancel();
        throw new ApiError(413, "Request too large");
      }
      chunks.push(result.value);
    }
  }
  try {
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    const result: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!result || typeof result !== "object" || Array.isArray(result))
      throw new Error();
    return result as Record<string, unknown>;
  } catch {
    throw new ApiError(400, "Invalid JSON body");
  }
}
async function hashCode(env: Env, email: string, code: string) {
  if (!env.ACCESS_CODE_SECRET || env.ACCESS_CODE_SECRET.length < 32) {
    throw new Error(
      "Configure ACCESS_CODE_SECRET with at least 32 random characters",
    );
  }
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(env.ACCESS_CODE_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${email}:${code}`),
  );
  return Array.from(new Uint8Array(signature), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}
function equal(a: string, b: string) {
  let difference = a.length ^ b.length;
  for (let i = 0; i < a.length; i++)
    difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
}
function randomCode() {
  const values = new Uint32Array(1);
  // Rejection sampling avoids modulo bias.
  do {
    crypto.getRandomValues(values);
  } while (values[0] >= 4294000000);
  return String(values[0] % 1000000).padStart(6, "0");
}
const downloadView = (row: DownloadToken) => ({
  token: row.token,
  guideSlug: row.guide_slug,
  guideName: GUIDE_NAMES[row.guide_slug] ?? row.guide_slug,
  attemptsRemaining: row.attempts_remaining,
});

export function createWorker(overrides: Partial<Services> = {}) {
  const services = { ...defaults, ...overrides };

  async function sendDownload(env: Env, store: Store, row: DownloadToken) {
    const lease = await store.emailClaim(row.token, services.now());
    if (lease.status === "sent") return;
    if (lease.status === "busy")
      throw new ApiError(503, "Email delivery in progress; retry later");
    try {
      const name = GUIDE_NAMES[row.guide_slug] ?? row.guide_slug;
      await services.email(env, {
        to: row.buyer_email,
        subject: `Your guide is ready — ${name}`,
        text: `Thank you for your purchase.\n\n${name}\n${origin(env)}/download/${row.token}\n\nThis link allows 3 downloads within 72 hours. You can recover access at ${origin(env)}/my-downloads.\n\nAiVass · connect@aivass.com`,
        key: `guide-download-${row.token}`,
      });
      await store.markEmail(row.token, lease.claim, services.now());
    } catch (error) {
      await store.releaseEmail(row.token, lease.claim);
      throw error;
    }
  }

  async function fulfill(env: Env, sessionId: string, withEmail: boolean) {
    const stripe = services.stripe(env);
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price.product"],
    });
    if (session.mode !== "payment" || session.payment_status !== "paid")
      throw new ApiError(402, "Payment not completed");
    const email = emailAddress(session.customer_details?.email);
    const entries = catalog(env.STRIPE_CATALOG_JSON);
    const slugs = new Set<string>();
    for (const item of session.line_items?.data ?? []) {
      const price = item.price;
      const product = price?.product;
      const productId = typeof product === "string" ? product : product?.id;
      const selected =
        productId && price
          ? purchaseSlugs(entries, {
              productId,
              priceId: price.id,
              unitAmount: price.unit_amount,
              currency: price.currency,
            })
          : [];
      if (selected.length === 0 || item.quantity !== 1)
        throw new ApiError(422, "Unrecognized purchase configuration");
      selected.forEach((slug) => slugs.add(slug));
    }
    if (!slugs.size || session.line_items?.has_more)
      throw new ApiError(422, "No downloadable guides found for this purchase");
    const store = new Store(env.DB);
    const rows: DownloadToken[] = [];
    for (const slug of slugs) {
      rows.push(
        await store.checkoutToken(session.id, slug, email, services.now()),
      );
    }
    // The success page may win the token race, but webhook email remains retryable.
    if (withEmail) for (const row of rows) await sendDownload(env, store, row);
    return rows.map(downloadView);
  }

  async function api(request: Request, env: Env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, "");
    const store = new Store(env.DB);
    const now = services.now();
    if (path === "/api/healthz" && request.method === "GET") {
      await env.DB.prepare("SELECT 1 FROM download_tokens LIMIT 1").first();
      return json({ status: "ok" });
    }
    if (path === "/api/checkout-session" && request.method === "POST") {
      if (
        !env.RESEND_API_KEY ||
        !env.STRIPE_WEBHOOK_SECRET ||
        !env.ACCESS_CODE_SECRET
      ) {
        throw new ApiError(503, "Checkout setup is not complete");
      }
      const input = await body(request);
      const slug = typeof input.guideSlug === "string" ? input.guideSlug : "";
      const entries = catalog(env.STRIPE_CATALOG_JSON);
      const guide = Object.hasOwn(entries, slug) ? entries[slug] : undefined;
      if (!guide) throw new ApiError(400, "Please select a valid guide.");
      // Verify private files exist before accepting money (including every bundle file).
      const slugs = purchaseSlugs(entries, {
        productId: guide.productId,
        priceId: guide.priceId,
        unitAmount: guide.expectedAmount,
        currency: "usd",
      });
      for (const selected of slugs)
        if (!(await env.GUIDES.head(`guides/${selected}.pdf`))) {
          throw new ApiError(
            503,
            "This guide is temporarily unavailable. Please try again later.",
          );
        }
      const stripe = services.stripe(env);
      const price = await stripe.prices.retrieve(guide.priceId);
      const product =
        typeof price.product === "string" ? price.product : price.product.id;
      if (
        !price.active ||
        price.type !== "one_time" ||
        price.id !== guide.priceId ||
        product !== guide.productId ||
        price.unit_amount !== guide.expectedAmount ||
        price.currency !== "usd"
      ) {
        throw new Error("Stripe catalog does not match configured guide");
      }
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [{ price: guide.priceId, quantity: 1 }],
        success_url: `${origin(env)}/order-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin(env)}/order-cancel`,
        client_reference_id: slug,
        metadata: { guide_slug: slug, checkout_source: "aivass_web" },
      });
      if (!session.url) throw new Error("Checkout URL unavailable");
      return json({ url: session.url }, 201);
    }
    if (path === "/api/webhooks/stripe" && request.method === "POST") {
      if (!env.STRIPE_WEBHOOK_SECRET)
        throw new ApiError(503, "Webhook verification is unavailable");
      const signature = request.headers.get("stripe-signature");
      if (!signature) throw new ApiError(400, "Invalid Stripe signature");
      // Limit the raw body without parsing/re-serializing it before authentication.
      const raw = await request.text();
      if (raw.length > 1_000_000) throw new ApiError(413, "Request too large");
      let event: Stripe.Event;
      try {
        const verifier = new Stripe("sk_test_local_signature_verifier");
        event = await verifier.webhooks.constructEventAsync(
          raw,
          signature,
          env.STRIPE_WEBHOOK_SECRET,
          300,
          Stripe.createSubtleCryptoProvider(),
        );
      } catch {
        throw new ApiError(400, "Invalid Stripe signature");
      }
      if (
        event.type === "checkout.session.completed" ||
        event.type === "checkout.session.async_payment_succeeded"
      ) {
        const session = event.data.object as Stripe.Checkout.Session;
        try {
          await fulfill(env, session.id, true);
        } catch (error) {
          if (!(error instanceof ApiError && error.status === 402)) throw error;
          // Asynchronous payments fulfill only after async_payment_succeeded.
        }
      }
      return json({ received: true });
    }
    if (path === "/api/order-complete" && request.method === "GET") {
      const id = url.searchParams.get("session_id");
      if (
        !id ||
        !/^cs_(test_|live_)?[A-Za-z0-9_]+$/.test(id) ||
        id.length > 255
      )
        throw new ApiError(400, "Missing or invalid session_id");
      return json({ downloads: await fulfill(env, id, false) });
    }
    if (path.startsWith("/api/download/")) {
      if (request.method !== "GET")
        return new Response(null, {
          status: 405,
          headers: { Allow: "GET", "Cache-Control": "no-store" },
        });
      const token = path.slice("/api/download/".length);
      const row = await store.token(token);
      if (!row) throw new ApiError(404, "Download link not found", "invalid");
      if (row.expires_at <= now)
        throw new ApiError(410, "Download link has expired", "expired");
      if (row.attempts_remaining <= 0)
        throw new ApiError(410, "Download limit reached", "exhausted");
      const file = await env.GUIDES.get(`guides/${row.guide_slug}.pdf`);
      if (!file)
        throw new ApiError(
          503,
          "Guide file not available. Please contact connect@aivass.com",
        );
      const claimed = await store.claimDownload(token, services.now());
      if (!claimed) {
        await file.body.cancel();
        throw new ApiError(
          410,
          "Download link expired or exhausted",
          "exhausted",
        );
      }
      const reader = file.body.getReader();
      const stream = new ReadableStream<Uint8Array>({
        async pull(controller) {
          try {
            const result = await reader.read();
            if (result.done) controller.close();
            else controller.enqueue(result.value);
          } catch (error) {
            await store.refundDownload(token);
            controller.error(error);
          }
        },
        cancel(reason) {
          return reader.cancel(reason);
        },
      });
      const name = GUIDE_NAMES[row.guide_slug] ?? row.guide_slug;
      const filename = `${name.replace(/[^\w .-]/g, "")}.pdf`;
      return new Response(stream, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Length": String(file.size),
          "X-Guide-Name": name,
          "X-Filename": filename,
          "X-Attempts-Remaining": String(claimed.attempts_remaining),
          "Cache-Control": "private, no-store",
          "X-Content-Type-Options": "nosniff",
          "Referrer-Policy": "no-referrer",
        },
      });
    }
    if (
      path === "/api/my-downloads/request-code" &&
      request.method === "POST"
    ) {
      const input = await body(request);
      const email = emailAddress(input.email);
      if (!env.RESEND_API_KEY)
        throw new ApiError(503, "Email delivery is not configured");
      const code = randomCode();
      const row = await store.requestCode(
        email,
        await hashCode(env, email, code),
        now,
      );
      if (!row)
        throw new ApiError(
          429,
          "Too many codes requested. Please wait 15 minutes.",
        );
      try {
        await services.email(env, {
          to: email,
          subject: `Your AiVass access code: ${code}`,
          text: `Your AiVass access code is ${code}. It expires in 15 minutes.\nIf you did not request this code, ignore this email.`,
          key: `access-code-${row.id}`,
        });
      } catch {
        throw new ApiError(
          502,
          "We couldn't send the email right now. Please try again later.",
        );
      }
      return json({
        ok: true,
        message: "If this address has purchases, a code is on its way.",
      });
    }
    if (path === "/api/my-downloads/verify-code" && request.method === "POST") {
      const input = await body(request);
      const email = emailAddress(input.email);
      if (typeof input.code !== "string" || !/^\d{6}$/.test(input.code))
        throw new ApiError(
          400,
          "Enter the 6-digit code from your email.",
          "bad_input",
        );
      const hash = await hashCode(env, email, input.code);
      const row = await store.claimCodeAttempt(email, now);
      if (!row)
        throw new ApiError(
          410,
          "This code has expired. Request a new one.",
          "expired",
        );
      if (!equal(row.code_hash, hash))
        throw new ApiError(
          401,
          "That code doesn't match.",
          row.attempts_remaining > 0 ? "wrong_code" : "attempts_exhausted",
        );
      const session = await store.consumeCode(row.id, now);
      if (!session)
        throw new ApiError(410, "This code has already been used.", "expired");
      return json(session);
    }
    if (
      (path === "/api/my-downloads" && request.method === "GET") ||
      (path === "/api/my-downloads/refresh" && request.method === "POST")
    ) {
      const email = await store.session(
        request.headers.get("X-Access-Token") ?? "",
        now,
      );
      if (!email)
        throw new ApiError(401, "Verification required.", "unverified");
      const rows = await store.purchases(email);
      if (path.endsWith("/refresh")) {
        const input = await body(request);
        const slug = typeof input.guideSlug === "string" ? input.guideSlug : "";
        if (!getGuideCatalogEntry(slug))
          throw new ApiError(400, "guideSlug is required.");
        const existing = rows.filter((row) => row.guide_slug === slug);
        if (!existing.length)
          throw new ApiError(
            404,
            "No purchase found for this email and guide.",
          );
        if (
          existing.some(
            (row) => row.expires_at > now && row.attempts_remaining > 0,
          )
        )
          throw new ApiError(
            409,
            "You already have an active download link for this guide.",
          );
        if (existing.length >= 10)
          throw new ApiError(
            429,
            "Download refresh limit reached. Please contact connect@aivass.com.",
          );
        const refreshed = await store.refresh(email, slug, now);
        if (!refreshed)
          throw new ApiError(
            409,
            "Another request has already refreshed this link.",
          );
        // Email failure cannot revoke the valid token returned to the verified buyer.
        try {
          await sendDownload(env, store, refreshed);
        } catch {
          console.error("Refresh email delivery failed");
        }
        return json({
          ...downloadView(refreshed),
          expiresAt: new Date(refreshed.expires_at).toISOString(),
        });
      }
      const bySlug = new Map<string, DownloadToken>();
      const rank = (row: DownloadToken) =>
        row.expires_at <= now ? 0 : row.attempts_remaining <= 0 ? 1 : 2;
      for (const row of rows) {
        const current = bySlug.get(row.guide_slug);
        if (!current || rank(row) > rank(current))
          bySlug.set(row.guide_slug, row);
      }
      const purchases = [...bySlug.values()]
        .map((row) => ({
          ...downloadView(row),
          expiresAt: new Date(row.expires_at).toISOString(),
          expired: row.expires_at <= now,
          exhausted: row.attempts_remaining <= 0,
          canDownload: rank(row) === 2,
        }))
        .sort(
          (a, b) =>
            Number(b.canDownload) - Number(a.canDownload) ||
            a.guideName.localeCompare(b.guideName),
        );
      return json({ email, purchases });
    }
    throw new ApiError(404, "API route not found");
  }

  return {
    async fetch(request: Request, env: Env): Promise<Response> {
      const url = new URL(request.url);
      const path = url.pathname;
      if (path.startsWith("/samples/")) return sampleResponse(request, env);
      if (/^\/(articles|blog)(\/|$)/.test(path)) {
        const match = path.match(/^\/(articles|blog)(?:\/([^/]+))?\/?$/);
        if (
          match &&
          ((!match[2] && match[1] === "articles") || articleSlugs.has(match[2]))
        ) {
          return new Response(null, {
            status: 301,
            headers: {
              Location: `/insights/articles${match[2] ? `/${match[2]}` : ""}${url.search}`,
            },
          });
        }
        return new Response(
          '<!doctype html><html lang="en"><title>Article not found — AiVass</title><h1>Article not found.</h1><a href="/insights/articles">Browse articles</a></html>',
          {
            status: 404,
            headers: {
              "Content-Type": "text/html; charset=utf-8",
              "X-Robots-Tag": "noindex",
            },
          },
        );
      }
      if (path.startsWith("/insights/articles/")) {
        const slug = path
          .slice("/insights/articles/".length)
          .replace(/\/$/, "")
          .replace(/\.html$/, "");
        if (!articleSlugs.has(slug))
          return new Response("Article not found", {
            status: 404,
            headers: { "X-Robots-Tag": "noindex" },
          });
      }
      if (!path.startsWith("/api/") && path !== "/api")
        return env.ASSETS.fetch(request);
      try {
        return await api(request, env);
      } catch (error) {
        if (error instanceof ApiError)
          return json(
            {
              error: error.message,
              ...(error.code ? { code: error.code } : {}),
            },
            error.status,
          );
        // Never log URLs, tokens, buyer details, credentials or raw webhook bodies.
        console.error("AiVass API operation failed");
        return json(
          { error: "Service temporarily unavailable. Please try again." },
          503,
        );
      }
    },
    async scheduled(_event: ScheduledEvent, env: Env) {
      await new Store(env.DB).prune(services.now());
    },
  };
}

export default createWorker();
