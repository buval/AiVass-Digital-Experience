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
  ogType?: "website" | "article";
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

    // Twitter
    setMeta("name", "twitter:card", TWITTER_CARD);
    setMeta("name", "twitter:title", meta.ogTitle ?? fullTitle);
    setMeta("name", "twitter:description", meta.ogDescription ?? meta.description ?? "");
    setMeta("name", "twitter:image", meta.ogImage ?? DEFAULT_OG_IMAGE);

    // Cleanup — restore homepage defaults on unmount
    return () => {
      document.title = "AiVass — Building Extraordinary Futures";
      setMeta("name", "robots", "index, follow");
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
