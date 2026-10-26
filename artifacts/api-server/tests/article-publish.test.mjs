import assert from "node:assert/strict";
import { test } from "node:test";
import express from "express";
import {
  checkArticlesAfterPublish, installArticleReleaseProbe, articleReleasePath,
  articleStaticReleasePath, articleReleaseId,
} from "../dist/testing.mjs";

function harness(overrides = {}) {
  const logs = [];
  let runs = 0;
  const deps = {
    production: true,
    fetch: async (url) => url.pathname === articleStaticReleasePath
      ? Response.json({ release: articleReleaseId })
      : new Response(null, { status: 204 }),
    wait: async () => {},
    validate: async () => { runs++; return { code: 0, output: "PASS live articles" }; },
    log: {
      info: (data, message) => logs.push({ level: "info", data, message }),
      error: (data, message) => logs.push({ level: "error", data, message }),
    },
    promotionAttempts: 2,
    validationAttempts: 2,
    ...overrides,
  };
  return { deps, logs, runs: () => runs };
}

test("development never checks production; promotion must precede validation", async () => {
  const dev = harness({ production: false, fetch: () => { throw Error("must not fetch"); } });
  await checkArticlesAfterPublish(dev.deps);
  assert.equal(dev.runs(), 0);
  assert.equal(dev.logs.length, 0);
  let requests = 0;
  const live = harness({
    fetch: async (url, options) => {
      assert.equal(url.origin, "https://aivass.com");
      assert.equal(options.redirect, "error");
      assert.equal(options.cache, "no-store");
      if (url.pathname === articleStaticReleasePath) {
        assert.equal(requests, 2);
        assert.equal(live.runs(), 0);
        return Response.json({ release: articleReleaseId });
      }
      assert.equal(url.pathname, articleReleasePath);
      requests++;
      assert.equal(live.runs(), 0);
      return new Response(null, { status: requests === 1 ? 404 : 204 });
    },
  });
  await checkArticlesAfterPublish(live.deps);
  assert.equal(live.runs(), 1);
  assert.match(live.logs.at(-1).message, /ARTICLE CHECK PASSED/);
});

test("current API cannot pass against the previous static website release", async () => {
  for (const oldWebsite of [
    () => Response.json({ release: "previous-static-release" }),
    () => new Response("<html>old SPA fallback</html>", { headers: { "Content-Type": "text/html" } }),
    () => new Response(null, { status: 404 }),
  ]) {
    const h = harness({
      fetch: async (url) => url.pathname === articleReleasePath
        ? new Response(null, { status: 204 }) : oldWebsite(),
    });
    await checkArticlesAfterPublish(h.deps);
    assert.equal(h.runs(), 0, "validator must not accept healthy articles from the old static service");
    assert.match(h.logs.at(-1).message, /ARTICLE CHECK NOT RUN.*static website release markers/);
    assert.ok(!h.logs.some((log) => /CHECK PASSED/.test(log.message)));
  }
  let staticRequests = 0;
  const promotedLater = harness({
    fetch: async (url) => {
      if (url.pathname === articleReleasePath) return new Response(null, { status: 204 });
      assert.equal(promotedLater.runs(), 0);
      staticRequests++;
      return Response.json({ release: staticRequests === 1 ? "previous-release" : articleReleaseId });
    },
  });
  await checkArticlesAfterPublish(promotedLater.deps);
  assert.equal(staticRequests, 2);
  assert.equal(promotedLater.runs(), 1);
  assert.match(promotedLater.logs.at(-1).message, /CHECK PASSED/);
});

test("failed or unpromoted publish cannot validate an older live release", async () => {
  for (const fetch of [
    async () => new Response(null, { status: 404 }),
    async () => { throw Error("domain unavailable"); },
  ]) {
    const h = harness({ fetch });
    await checkArticlesAfterPublish(h.deps);
    assert.equal(h.runs(), 0);
    assert.match(h.logs.at(-1).message, /ARTICLE CHECK NOT RUN.*Check publish status/);
  }
});

test("propagation retries preserve route-level errors and provide a rerun command", async () => {
  let runs = 0;
  const h = harness({ validate: async () => {
    runs++;
    return { code: 1, output: "FAIL live /insights/articles/example/ canonical — expected article; got homepage" };
  } });
  await checkArticlesAfterPublish(h.deps);
  assert.equal(runs, 2);
  const final = h.logs.at(-1);
  assert.equal(final.data.final, true);
  assert.match(final.data.report, /example\/ canonical/);
  assert.match(final.message, /ARTICLE CHECK FAILED.*validate:article-sharing:live/);
  const recovered = harness({ validate: async () => ({ code: 0, output: "PASS" }) });
  await checkArticlesAfterPublish(recovered.deps);
  assert.match(recovered.logs.at(-1).message, /PASSED/);
});

test("worker launch errors are reported, not silent successes", async () => {
  const h = harness({ validate: async () => { throw Error("missing validator bundle"); } });
  await checkArticlesAfterPublish(h.deps);
  assert.match(h.logs.at(-1).data.report, /missing validator bundle/);
  assert.match(h.logs.at(-1).message, /ARTICLE CHECK FAILED/);
});

test("only this build's public probe succeeds and it cannot be cached", async (t) => {
  const app = express();
  installArticleReleaseProbe(app);
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.on("listening", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const current = await fetch(`${base}${articleReleasePath}`);
  assert.equal(current.status, 204);
  assert.equal(current.headers.get("cache-control"), "no-store");
  const previous = await fetch(`${base}/api/_article-release/old-build`);
  assert.equal(previous.status, 404);
});
