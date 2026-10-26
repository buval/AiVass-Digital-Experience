import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import http from "node:http";
import { test } from "node:test";
import { ARTICLES } from "../../src/data/articles.ts";

const validator = new URL("../validate-article-sharing.mjs", import.meta.url);
const esc = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;").replaceAll('"', "&quot;");
function fixture(article) {
  const canonical = `https://aivass.com/insights/articles/${article.slug}`;
  return `<link rel="canonical" href="${canonical}">
    ${Object.entries({
      "og:url": canonical, "og:title": `${article.title} — AiVass`,
      "og:description": article.metaDescription,
      "og:image": article.heroImage ? `https://aivass.com/images/${article.heroImage}` : "https://aivass.com/opengraph.jpg",
    }).map(([name, value]) => `<meta property="${name}" content="${esc(value)}">`).join("")}
    <article><h1>${esc(article.title)}</h1><p>${"Article body text. ".repeat(40)}</p></article>`;
}
function run(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [validator.pathname, "--live-only", ...args]);
    let output = "";
    child.stdout.on("data", (chunk) => { output += chunk; });
    child.stderr.on("data", (chunk) => { output += chunk; });
    child.on("error", reject);
    child.on("close", (code) => resolve({ code, output }));
  });
}

test("live-only checks real HTTP routes without local build output", async (t) => {
  let mode = "ok";
  const seen = new Set();
  const server = http.createServer((req, res) => {
    seen.add(req.url);
    const slug = req.url.split("/")[3]?.replace(/\.html$/, "");
    const article = ARTICLES.find((a) => a.slug === slug);
    if (!article) { res.writeHead(404).end(); return; }
    if (mode === "status") { res.writeHead(503).end("down"); return; }
    if (mode === "redirect" && !req.url.endsWith(".html")) {
      res.writeHead(302, { Location: `/insights/articles/${slug}.html` }).end(); return;
    }
    let html = fixture(article);
    if (mode === "canonical") html = html.replace('rel="canonical"', 'rel="alternate"');
    if (mode === "social") html = html.replaceAll('property="og:', 'property="bad:');
    if (mode === "body") html = html.replace(/<article>[\s\S]*<\/article>/, "<article><h1>Wrong article</h1></article>");
    res.writeHead(200, { "Content-Type": "text/html" }).end(html);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const good = await run([`--base-url=${base}`]);
  assert.equal(good.code, 0, good.output);
  assert.doesNotMatch(good.output, /generated article directory/);
  for (const article of ARTICLES) {
    assert.ok(seen.has(`/insights/articles/${article.slug}`));
    assert.ok(seen.has(`/insights/articles/${article.slug}/`));
  }
  for (const [failureMode, expected] of [
    ["status", /returns 200 — got 503/],
    ["redirect", /keeps a clean article URL.*final .*\.html/],
    ["canonical", /canonical — expected .*got missing/],
    ["social", /og:description — expected .*got missing/],
    ["body", /crawler-readable article content — expected article heading/],
  ]) {
    mode = failureMode;
    const result = await run([`--base-url=${base}`]);
    assert.equal(result.code, 1, failureMode);
    assert.match(result.output, expected, failureMode);
    assert.match(result.output, new RegExp(ARTICLES[0].slug));
  }
});

test("live-only refuses to quietly substitute local assertions", async () => {
  const result = await run([]);
  assert.equal(result.code, 1);
  assert.match(result.output, /requires --base-url/);
});
