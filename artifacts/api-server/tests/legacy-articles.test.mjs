import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import http from "node:http";
import { test } from "node:test";
import express from "express";
import { ARTICLES } from "../../aivass-web/src/data/articles.ts";
import { legacyArticlesRouter } from "../dist/testing.mjs";

test("legacy namespaces are routed to the API without changing static article mappings", () => {
  const api = readFileSync(new URL("../.replit-artifact/artifact.toml", import.meta.url), "utf8");
  assert.match(api, /paths = \["\/api", "\/articles", "\/blog"\]/);
  const web = readFileSync(new URL("../../aivass-web/.replit-artifact/artifact.toml", import.meta.url), "utf8");
  assert.match(web, /serve = "static"/);
  for (const { slug } of ARTICLES) {
    for (const suffix of ["", "/"]) {
      assert.ok(web.includes(`from = "/insights/articles/${slug}${suffix}"\nto = "/insights/articles/${slug}.html"`));
    }
  }
});

test("legacy article HTTP responses work for browsers and crawlers without JavaScript", async (t) => {
  const app = express();
  app.use(legacyArticlesRouter);
  // Stand in only for the unchanged static host's clean article mappings.
  app.get("/insights/articles/:slug", (req, res) => {
    res.type("text").send(req.params.slug);
  });
  app.get("/api/healthz", (_req, res) => res.json({ status: "ok" }));
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const agents = [
    "Mozilla/5.0",
    "facebookexternalhit/1.1",
    "Twitterbot/1.0",
    "LinkedInBot/1.0",
  ];
  for (const { slug } of ARTICLES) {
    for (const prefix of ["/articles", "/blog"]) {
      for (const suffix of ["", "/"]) {
        for (const agent of agents) {
          const path = `${prefix}/${slug}${suffix}`;
          for (const method of ["GET", "HEAD"]) {
            const response = await fetch(`${base}${path}?utm_source=legacy&x=1`, {
              method, redirect: "manual", headers: { "user-agent": agent },
            });
            assert.equal(response.status, 301, `${method} ${path} ${agent}`);
            assert.equal(response.headers.get("location"), `/insights/articles/${slug}?utm_source=legacy&x=1`);
            await response.text();
          }
        }
        const final = await fetch(`${base}${prefix}/${slug}${suffix}`, {
          headers: { "user-agent": "facebookexternalhit/1.1" },
        });
        assert.equal(final.status, 200);
        assert.equal(new URL(final.url).pathname, `/insights/articles/${slug}`);
        assert.equal(await final.text(), slug);
      }
    }
  }
  for (const path of ["/articles", "/articles/"]) {
    const response = await fetch(`${base}${path}`, { redirect: "manual" });
    assert.equal(response.status, 301);
    assert.equal(response.headers.get("location"), "/insights/articles");
    await response.text();
  }
  for (const path of [
    "/articles/not-a-real-article", "/blog/not-a-real-article",
    "/articles/not-a-real-article/", "/blog/not-a-real-article/",
    "/blog", "/articles/unknown/deeper", "/blog/%3Cscript%3E",
  ]) {
    for (const method of ["GET", "HEAD"]) {
      const response = await fetch(`${base}${path}`, { method, redirect: "manual" });
      assert.equal(response.status, 404, `${method} ${path}`);
      assert.equal(response.headers.get("location"), null);
      assert.equal(response.headers.get("x-robots-tag"), "noindex");
      const html = await response.text();
      if (method === "GET") assert.ok(html.includes("Article not found."));
    }
  }
  assert.equal((await fetch(`${base}/api/healthz`)).status, 200);
});
