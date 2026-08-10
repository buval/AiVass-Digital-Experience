/**
 * AiVass GA4 Analytics Module
 *
 * Initializes Google Analytics 4 via gtag.js.
 * Only activates when VITE_GA_MEASUREMENT_ID is set and starts with "G-".
 * Implements Google Consent Mode v2 — analytics_storage defaults to "denied"
 * until the user explicitly grants consent via ConsentBanner.
 *
 * PII POLICY: No name, email, phone, résumé URL, LinkedIn URL, assessment
 * responses, Stripe customer data, or other personal identifiers are ever
 * passed as event parameters.
 */

// ── Types ────────────────────────────────────────────────────────────────────
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

// ── Constants ────────────────────────────────────────────────────────────────
const GA_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined) ?? "";
const VALID_ID = /^G-[A-Z0-9]+$/.test(GA_ID);

export const CONSENT_KEY = "aivass_analytics_consent";

// ── Internal gtag wrapper ────────────────────────────────────────────────────
function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

// Expose on window so the inline script in index.html and any deferred calls
// always reference the same queue.
if (typeof window !== "undefined") {
  window.dataLayer = window.dataLayer || [];
  window.gtag = gtag;
}

// ── Initialization ───────────────────────────────────────────────────────────
let initialized = false;

export function initGA() {
  if (!VALID_ID || initialized) return;
  initialized = true;

  // Consent Mode v2: set defaults BEFORE loading gtag.js
  // Restore previously stored preference immediately so returning visitors
  // are not re-prompted unnecessarily.
  const stored = localStorage.getItem(CONSENT_KEY);
  const analyticsGranted = stored === "granted";

  gtag("consent", "default", {
    analytics_storage: analyticsGranted ? "granted" : "denied",
    ad_storage: "denied", // AiVass does not use advertising technologies
    wait_for_update: 500,
  });

  // Dynamically load the gtag.js script
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  gtag("js", new Date());
  gtag("config", GA_ID, {
    send_page_view: false,  // page_view is sent manually on route change
    anonymize_ip: true,
  });
}

// ── Consent ──────────────────────────────────────────────────────────────────
export function grantAnalyticsConsent() {
  localStorage.setItem(CONSENT_KEY, "granted");
  gtag("consent", "update", { analytics_storage: "granted" });
}

export function denyAnalyticsConsent() {
  localStorage.setItem(CONSENT_KEY, "denied");
  gtag("consent", "update", { analytics_storage: "denied" });
}

export function getStoredConsent(): "granted" | "denied" | null {
  const v = localStorage.getItem(CONSENT_KEY);
  if (v === "granted" || v === "denied") return v;
  return null;
}

// ── Page view ────────────────────────────────────────────────────────────────
export function trackPageView(path: string) {
  if (!VALID_ID) return;
  gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.origin + path,
  });
}

// ── Event helpers ─────────────────────────────────────────────────────────────
type EventParams = Record<string, string | number | boolean>;

function track(eventName: string, params?: EventParams) {
  if (!VALID_ID) return;
  gtag("event", eventName, params ?? {});
}

/** Nav "Start a Conversation" button */
export const trackStartConversation = () => track("start_conversation_click");

/** Assessment CTA clicks — does NOT include any PII */
export const trackAssessmentClick = (location: string) =>
  track("assessment_click", { click_location: location });

/** "Discuss a Partnership" CTA clicks */
export const trackDiscussPartnership = (location: string) =>
  track("discuss_partnership_click", { click_location: location });

/** Guide purchase button click — NOT a confirmed purchase event */
export const trackGuidePurchaseClick = (slug: string) =>
  track("guide_purchase_click", { guide_slug: slug });

/** Guide sample PDF click */
export const trackGuideSampleClick = (slug: string) =>
  track("guide_sample_click", { guide_slug: slug });

/** Insights / editorial stream views */
export const trackInsightView = (stream: string) =>
  track("insight_view", { stream });

/** Outbound social link clicks */
export const trackSocialClick = (platform: string) =>
  track("outbound_social_click", { platform });

// ── Status ────────────────────────────────────────────────────────────────────
export const analyticsActive = VALID_ID;
