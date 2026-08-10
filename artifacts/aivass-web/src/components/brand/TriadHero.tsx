import { useEffect, useState } from "react";

/**
 * TriadHero — elevated atmospheric hero art.
 * Arch / portal motif with warm dawn light bloom, dual-ring orbital,
 * horizon vista line, and gently floating Triad geometry.
 * All motion is CSS-only — no heavy libraries.
 */
export function TriadHero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // One-frame delay so CSS transitions fire after first paint
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const t = (delay: string) => ({ transition: `opacity 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}` });

  return (
    <div className="relative h-[500px] md:h-[620px] w-full flex items-center justify-center overflow-hidden">

      {/* ── Warm dawn bloom — radial ox-light glow, pulses slowly ── */}
      <div
        className="absolute rounded-full pointer-events-none animate-bloom-pulse"
        style={{
          width: "72%",
          height: "62%",
          top: "14%",
          left: "50%",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(217,163,155,0.22) 0%, rgba(247,243,233,0.06) 55%, transparent 75%)",
        }}
      />

      {/* ── Outer atmospheric halo — barely-there ── */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "97%",
          height: "97%",
          border: "1px solid rgba(18,35,63,0.06)",
          ...t("0ms"),
          opacity: mounted ? 1 : 0,
        }}
      />

      {/* ── Outer orbital ring — slow axial spin ── */}
      <div
        className="absolute rounded-full pointer-events-none animate-spin-slow"
        style={{
          width: "88%",
          height: "88%",
          border: "1px solid rgba(126,48,51,0.13)",
          ...t("120ms"),
          opacity: mounted ? 1 : 0,
        }}
      />

      {/* ── Inner orbital ring — counter-spin, ox-light tint ── */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "68%",
          height: "68%",
          border: "1px solid rgba(217,163,155,0.18)",
          animation: "spin-slow 50s linear infinite reverse",
          ...t("200ms"),
          opacity: mounted ? 1 : 0,
        }}
      />

      {/* ── Outer architectural arch — the portal / threshold ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "64%",
          height: "80%",
          border: "1px solid rgba(18,35,63,0.20)",
          borderBottom: "none",
          borderRadius: "300px 300px 0 0",
          ...t("400ms"),
          opacity: mounted ? 1 : 0,
        }}
      />

      {/* ── Inner arch — intimate threshold within ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "42%",
          height: "54%",
          border: "1px solid rgba(217,163,155,0.28)",
          borderBottom: "none",
          borderRadius: "200px 200px 0 0",
          ...t("650ms"),
          opacity: mounted ? 1 : 0,
        }}
      />

      {/* ── Horizon line — the vista of possibility ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "24%",
          left: "8%",
          right: "8%",
          height: "1px",
          background:
            "linear-gradient(to right, transparent, rgba(18,35,63,0.18) 30%, rgba(18,35,63,0.18) 70%, transparent)",
          ...t("900ms"),
          opacity: mounted ? 1 : 0,
        }}
      />

      {/* ── Triad geometry — floats gently after mount ── */}
      <svg
        viewBox="0 0 300 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-[78%] max-w-[440px] text-navy-mid"
        style={{
          opacity: mounted ? 1 : 0,
          transition: "opacity 1s ease 0.3s",
          animation: mounted ? "ambient-float 9s ease-in-out 1.2s infinite" : "none",
        }}
      >
        {/* Left line */}
        <line
          x1="150" y1="40" x2="40" y2="210"
          stroke="currentColor" strokeWidth="0.75" opacity="0.45"
          strokeDasharray="310"
          strokeDashoffset={mounted ? 0 : 310}
          style={{ transition: "stroke-dashoffset 1.9s cubic-bezier(0.22,1,0.36,1) 0.5s" }}
        />
        {/* Right line */}
        <line
          x1="150" y1="40" x2="260" y2="210"
          stroke="currentColor" strokeWidth="0.75" opacity="0.45"
          strokeDasharray="310"
          strokeDashoffset={mounted ? 0 : 310}
          style={{ transition: "stroke-dashoffset 1.9s cubic-bezier(0.22,1,0.36,1) 0.7s" }}
        />
        {/* Base line */}
        <line
          x1="40" y1="210" x2="260" y2="210"
          stroke="currentColor" strokeWidth="0.75" opacity="0.45"
          strokeDasharray="310"
          strokeDashoffset={mounted ? 0 : 310}
          style={{ transition: "stroke-dashoffset 1.9s cubic-bezier(0.22,1,0.36,1) 0.9s" }}
        />

        {/* Four-pointed star nodes — oxblood, staggered reveal */}
        <g>
          {/* Top apex */}
          <path
            d="M150 28 L153 37 L162 40 L153 43 L150 52 L147 43 L138 40 L147 37Z"
            fill="#7E3033"
            style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.6s ease 1.7s" }}
          />
          {/* Bottom-left */}
          <path
            d="M40 198 L43 207 L52 210 L43 213 L40 222 L37 213 L28 210 L37 207Z"
            fill="#7E3033"
            style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.6s ease 1.9s" }}
          />
          {/* Bottom-right */}
          <path
            d="M260 198 L263 207 L272 210 L263 213 L260 222 L257 213 L248 210 L257 207Z"
            fill="#7E3033"
            style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.6s ease 2.1s" }}
          />
        </g>
      </svg>

      {/* ── Ground shadow — anchors the floating art ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "6%",
          left: "25%",
          right: "25%",
          height: "1px",
          background:
            "linear-gradient(to right, transparent, rgba(18,35,63,0.10) 40%, rgba(18,35,63,0.10) 60%, transparent)",
          ...t("1100ms"),
          opacity: mounted ? 1 : 0,
        }}
      />
    </div>
  );
}
