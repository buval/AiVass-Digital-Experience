/**
 * ConsentBanner — Analytics consent notice for Google Analytics 4 / Consent Mode v2.
 *
 * Only reveals itself when VITE_GA_MEASUREMENT_ID is present (analyticsActive).
 * When no Measurement ID is configured, visible stays false permanently — the
 * banner never mounts, no cookies are set, and no GA requests are made.
 *
 * Adds body padding-bottom while visible so the fixed banner never
 * obscures the footer or any other bottom-anchored content.
 *
 * All hooks are called unconditionally (Rules of Hooks compliant).
 */

import { useEffect, useState } from "react";
import {
  grantAnalyticsConsent,
  denyAnalyticsConsent,
  getStoredConsent,
  analyticsActive,
} from "@/lib/analytics";

const BANNER_HEIGHT_PX = "84px";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  // Only activate when GA is configured AND no prior consent stored
  useEffect(() => {
    if (!analyticsActive) return; // no-op; visible stays false
    const t = setTimeout(() => {
      if (getStoredConsent() === null) setVisible(true);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  // Pad body so footer is never hidden behind the fixed banner
  useEffect(() => {
    document.body.style.paddingBottom = visible ? BANNER_HEIGHT_PX : "";
    return () => {
      document.body.style.paddingBottom = "";
    };
  }, [visible]);

  if (!visible) return null;

  function handleAccept() {
    grantAnalyticsConsent();
    setVisible(false);
  }

  function handleDecline() {
    denyAnalyticsConsent();
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Analytics consent"
      className="fixed bottom-0 left-0 right-0 z-[9999] bg-navy text-cream px-[6vw] py-4 md:py-5 border-t border-cream/10 shadow-xl"
      style={{ animation: "reveal-fade 0.4s ease both" }}
    >
      <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8">
        <p className="text-[12px] md:text-[13px] text-ox-light leading-[1.6] max-w-[640px]">
          AiVass uses Google Analytics to understand how people use this website.
          Analytics does not collect your name, email, assessment responses, or
          other personal information.{" "}
          <a
            href="/privacy#cookies"
            className="underline underline-offset-2 hover:text-cream transition-colors"
            onClick={handleDecline}
          >
            Privacy Policy
          </a>
        </p>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleDecline}
            className="text-[10px] tracking-[0.12em] uppercase text-ox-light hover:text-cream transition-colors px-4 py-2 border border-ox-light/30 hover:border-cream/50"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="text-[10px] tracking-[0.12em] uppercase bg-cream text-navy hover:bg-ox-light px-4 py-2 transition-colors"
          >
            Accept Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
