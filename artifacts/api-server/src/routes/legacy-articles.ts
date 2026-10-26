import { Router, type IRouter } from "express";

// Injected from the website's article catalog by build.mjs.
declare const __ARTICLE_SLUGS__: string[];
const articleSlugs = new Set(__ARTICLE_SLUGS__);
const router: IRouter = Router();

router.get(["/articles", "/articles/:slug", "/blog/:slug"], (req, res, next) => {
  const slug = req.params.slug;
  if (slug !== undefined && (typeof slug !== "string" || !articleSlugs.has(slug))) return next();

  // Keep campaign/search parameters without letting them select the destination.
  const queryIndex = req.originalUrl.indexOf("?");
  const query = queryIndex < 0 ? "" : req.originalUrl.slice(queryIndex);
  res.redirect(301, `/insights/articles${slug ? `/${slug}` : ""}${query}`);
});

// Own these legacy namespaces, including malformed/deeper paths. Never turn an
// unknown article into a successful homepage response for non-JS crawlers.
router.use(["/articles", "/blog"], (_req, res) => {
  res.status(404).set("X-Robots-Tag", "noindex").type("html").send(
    '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>Article not found — AiVass</title></head><body>' +
    '<h1>Article not found.</h1><p>The article you requested could not be found.</p>' +
    '<a href="/insights/articles">Browse articles</a></body></html>',
  );
});

export default router;
