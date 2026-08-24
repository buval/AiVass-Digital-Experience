/**
 * useSeoMeta — Per-page SEO and Open Graph management.
 *
 * Updates <title>, meta description, canonical, robots, og:*, and twitter:*
 * tags dynamically on each page mount. Restores homepage defaults on unmount.
 *
 * STAGING NOINDEX: When running on any domain other than aivass.com the robots
 * tag is automatically set to "noindex, nofollow" so Replit preview URLs never
 * compete with the production domain in search.
 */

import { useEffect } from "react";

const PROD_HOST = "aivass.com";
const BRAND_SUFFIX = " — AiVass";
const DEFAULT_OG_IMAGE = "https://aivass.com/opengraph.jpg";
const TWITTER_CARD = "summary_large_image";

// ── DOM helpers ───────────────────────────────────────────────────────────────
function setMeta(attr: string, value: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${CSS.escape(value)}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, value);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function removeMeta(attr: string, value: string) {
  document.querySelector(`meta[${attr}="${CSS.escape(value)}"]`)?.remove();
}

function replaceMetaList(attr: string, value: string, contents: string[]) {
  document.querySelectorAll(`meta[${attr}="${CSS.escape(value)}"]`).forEach((el) => el.remove());
  contents.forEach((content) => {
    const el = document.createElement("meta");
    el.setAttribute(attr, value);
    el.setAttribute("content", content);
    document.head.appendChild(el);
  });
}

// ── Public API ────────────────────────────────────────────────────────────────
export interface SeoMeta {
  /** Page title, WITHOUT "— AiVass" suffix (added automatically). */
  title: string;
  description?: string;
  /** Full production URL, e.g. "https://aivass.com/guides". */
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  /** Full URL to og:image. Defaults to the brand OG image. */
  ogImage?: string;
  ogImageAlt?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogType?: "website" | "article";
  article?: {
    publishedTime: string;
    modifiedTime: string;
    author: string;
    section: string;
    tags: string[];
  };
  /** Force noindex (in addition to the automatic staging noindex). */
  noIndex?: boolean;
}

export function useSeoMeta(meta: SeoMeta) {
  useEffect(() => {
    const fullTitle = meta.title.endsWith("AiVass")
      ? meta.title
      : meta.title + BRAND_SUFFIX;

    // Title
    document.title = fullTitle;

    // Description
    if (meta.description) {
      setMeta("name", "description", meta.description);
    }

    // Canonical — strip the Replit base-path prefix if present
    const cleanPath = window.location.pathname.replace(/^\/aivass-web/, "");
    const canonical = meta.canonical ?? `https://aivass.com${cleanPath}`;
    setLink("canonical", canonical);

    // Robots — noindex on ANY non-production hostname
    const isProduction = window.location.hostname === PROD_HOST;
    setMeta("name", "robots", isProduction && !meta.noIndex ? "index, follow" : "noindex, nofollow");

    // Open Graph
    setMeta("property", "og:title", meta.ogTitle ?? fullTitle);
    setMeta("property", "og:description", meta.ogDescription ?? meta.description ?? "");
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:type", meta.ogType ?? "website");
    setMeta("property", "og:image", meta.ogImage ?? DEFAULT_OG_IMAGE);
    setMeta("property", "og:site_name", "AiVass");
    setMeta("property", "og:locale", "en_US");
    if (meta.ogImageAlt) setMeta("property", "og:image:alt", meta.ogImageAlt);
    else removeMeta("property", "og:image:alt");
    if (meta.ogImageWidth) setMeta("property", "og:image:width", String(meta.ogImageWidth));
    else removeMeta("property", "og:image:width");
    if (meta.ogImageHeight) setMeta("property", "og:image:height", String(meta.ogImageHeight));
    else removeMeta("property", "og:image:height");

    if (meta.article) {
      setMeta("property", "article:published_time", meta.article.publishedTime);
      setMeta("property", "article:modified_time", meta.article.modifiedTime);
      setMeta("property", "article:author", meta.article.author);
      setMeta("property", "article:section", meta.article.section);
      replaceMetaList("property", "article:tag", meta.article.tags);
    } else {
      ["article:published_time", "article:modified_time", "article:author", "article:section"]
        .forEach((name) => removeMeta("property", name));
      replaceMetaList("property", "article:tag", []);
    }

    // Twitter
    setMeta("name", "twitter:card", TWITTER_CARD);
    setMeta("name", "twitter:title", meta.ogTitle ?? fullTitle);
    setMeta("name", "twitter:description", meta.ogDescription ?? meta.description ?? "");
    setMeta("name", "twitter:image", meta.ogImage ?? DEFAULT_OG_IMAGE);
    setMeta("name", "twitter:site", "@AiVass_com");
    if (meta.ogImageAlt) setMeta("name", "twitter:image:alt", meta.ogImageAlt);
    else removeMeta("name", "twitter:image:alt");

    // Cleanup — restore homepage defaults on unmount
    return () => {
      document.title = "AiVass — Building Extraordinary Futures";
      setMeta("name", "robots", "index, follow");
    };
  }, [
    meta.title,
    meta.description,
    meta.canonical,
    meta.ogTitle,
    meta.ogDescription,
    meta.ogImage,
    meta.ogImageAlt,
    meta.ogImageWidth,
    meta.ogImageHeight,
    meta.ogType,
    meta.noIndex,
    meta.article?.publishedTime,
    meta.article?.modifiedTime,
    meta.article?.author,
    meta.article?.section,
    meta.article?.tags.join("|"),
  ]);
}
