import { useEffect, useRef } from "react";
import { STRATEGIC_ASSESSMENT_URL } from "@/config/booking";
import { useSeoMeta } from "@/lib/seo";
import { trackAssessmentClick, trackDiscussPartnership } from "@/lib/analytics";

/* ─── Ambient star field ─────────────────────────────────────────── */
function StarField() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.4 + 0.4,
    delay: Math.random() * 6,
    dur: Math.random() * 4 + 3,
  }));

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 100 100"
    >
      {stars.map((s) => (
        <circle key={s.id} cx={s.x} cy={s.y} r={s.size * 0.012} fill="#D9A39B">
          <animate
            attributeName="opacity"
            values="0;0.55;0"
            dur={`${s.dur}s`}
            begin={`${s.delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
}

/* ─── Constellation triad drawn in ──────────────────────────────── */
function ConstellationMark() {
  return (
    <svg
      viewBox="0 0 120 110"
      className="w-[90px] md:w-[110px] text-oxblood"
      aria-hidden="true"
      fill="none"
    >
      {/* Triangle lines */}
      <line x1="60" y1="10" x2="12" y2="95" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.6">
        <animate attributeName="stroke-dasharray" from="0 200" to="200 0" dur="1.4s" fill="freeze" />
      </line>
      <line x1="60" y1="10" x2="108" y2="95" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.6">
        <animate attributeName="stroke-dasharray" from="0 200" to="200 0" dur="1.4s" begin="0.3s" fill="freeze" />
      </line>
      <line x1="12" y1="95" x2="108" y2="95" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.6">
        <animate attributeName="stroke-dasharray" from="0 200" to="200 0" dur="1.2s" begin="0.6s" fill="freeze" />
      </line>
      {/* Stars at vertices */}
      {[
        { cx: 60, cy: 10 },
        { cx: 12, cy: 95 },
        { cx: 108, cy: 95 },
      ].map(({ cx, cy }, i) => (
        <g key={i}>
          <line x1={cx} y1={cy - 5} x2={cx} y2={cy + 5} stroke="currentColor" strokeWidth="1.2">
            <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin={`${0.9 + i * 0.15}s`} fill="freeze" />
          </line>
          <line x1={cx - 5} y1={cy} x2={cx + 5} y2={cy} stroke="currentColor" strokeWidth="1.2">
            <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin={`${0.9 + i * 0.15}s`} fill="freeze" />
          </line>
          <line x1={cx - 3.5} y1={cy - 3.5} x2={cx + 3.5} y2={cy + 3.5} stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5">
            <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin={`${1.1 + i * 0.15}s`} fill="freeze" />
          </line>
          <line x1={cx + 3.5} y1={cy - 3.5} x2={cx - 3.5} y2={cy + 3.5} stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5">
            <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin={`${1.1 + i * 0.15}s`} fill="freeze" />
          </line>
        </g>
      ))}
    </svg>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */
export default function Contact() {
  useSeoMeta({
    title: "Connect — Begin the Architecture",
    description: "Start a conversation with AiVass. Book a Strategic Profile Assessment for individuals, or discuss a partnership for businesses and organizations.",
    canonical: "https://aivass.com/connect",
  });

  return (
    <div className="relative bg-navy min-h-screen flex flex-col overflow-hidden">
      {/* Ambient background */}
      <StarField />

      {/* Soft radial glow behind the heading */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(126,48,51,0.13) 0%, transparent 70%)",
        }}
      />

      {/* ── Hero heading ─────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center pt-[110px] pb-[70px] px-6">
        <ConstellationMark />

        <h1
          className="font-serif text-[64px] md:text-[96px] leading-none tracking-[-0.05em] text-cream mt-8 mb-5"
          style={{ textShadow: "0 2px 40px rgba(217,163,155,0.18)" }}
        >
          Connect<span className="text-oxblood">.</span>
        </h1>

        <p className="text-[15px] md:text-[17px] text-cream/60 max-w-[480px] leading-[1.7]">
          Whether you are seeking a pathway for yourself, or building something larger —
          the right conversation changes everything.
        </p>

        {/* Email shown openly */}
        <a
          href="mailto:connect@aivass.com"
          className="mt-7 text-[13px] tracking-[0.14em] uppercase text-ox-light/70 hover:text-ox-light transition-colors border-b border-ox-light/20 pb-0.5"
        >
          connect@aivass.com
        </a>
      </div>

      {/* ── Two pathways ─────────────────────────────────────── */}
      <div className="relative z-10 wrap w-full grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 pb-[90px]">

        {/* Card 1 — Individuals */}
        <div className="group relative border border-cream/10 hover:border-ox-light/40 transition-all duration-500 p-9 md:p-11 flex flex-col"
          style={{ background: "rgba(44,64,93,0.35)", backdropFilter: "blur(8px)" }}
        >
          {/* ox-light top accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-ox-light/50 to-transparent" />

          {/* Star mark */}
          <svg viewBox="0 0 20 20" className="w-5 h-5 text-oxblood mb-7" fill="none" aria-hidden="true">
            <line x1="10" y1="0" x2="10" y2="20" stroke="currentColor" strokeWidth="1.2" />
            <line x1="0" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="1.2" />
            <line x1="2.9" y1="2.9" x2="17.1" y2="17.1" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.5" />
            <line x1="17.1" y1="2.9" x2="2.9" y2="17.1" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.5" />
          </svg>

          <div className="text-[10px] tracking-[0.16em] uppercase text-ox-light/50 mb-4">
            For individuals
          </div>
          <h2 className="font-serif text-[30px] md:text-[34px] text-cream leading-tight mb-4">
            Start a Conversation
          </h2>
          <p className="text-[14px] text-cream/55 leading-[1.7] mb-9 max-w-[340px]">
            For individuals exploring their pathway, ready to understand their profile, and begin building what comes next.
          </p>

          <div className="mt-auto">
            <a
              href={STRATEGIC_ASSESSMENT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[11px] tracking-[0.14em] uppercase text-cream border border-cream/30 hover:border-cream/70 hover:bg-cream/8 px-7 py-3.5 transition-all duration-300"
              onClick={() => trackAssessmentClick("connect-page")}
            >
              Book Assessment →
            </a>
          </div>

          {/* Hover glow */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{ background: "radial-gradient(ellipse at 30% 60%, rgba(126,48,51,0.08) 0%, transparent 70%)" }}
          />
        </div>

        {/* Card 2 — Partnerships */}
        <div className="group relative border border-cream/10 hover:border-ox-light/40 transition-all duration-500 p-9 md:p-11 flex flex-col"
          style={{ background: "rgba(18,35,63,0.55)", backdropFilter: "blur(8px)" }}
        >
          {/* ox-light top accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-oxblood/60 to-transparent" />

          {/* Star mark */}
          <svg viewBox="0 0 20 20" className="w-5 h-5 text-ox-light/60 mb-7" fill="none" aria-hidden="true">
            <line x1="10" y1="0" x2="10" y2="20" stroke="currentColor" strokeWidth="1.2" />
            <line x1="0" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="1.2" />
            <line x1="2.9" y1="2.9" x2="17.1" y2="17.1" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.5" />
            <line x1="17.1" y1="2.9" x2="2.9" y2="17.1" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.5" />
          </svg>

          <div className="text-[10px] tracking-[0.16em] uppercase text-ox-light/50 mb-4">
            For businesses &amp; organisations
          </div>
          <h2 className="font-serif text-[30px] md:text-[34px] text-cream leading-tight mb-4">
            Discuss a Partnership
          </h2>
          <p className="text-[14px] text-cream/55 leading-[1.7] mb-9 max-w-[340px]">
            For businesses and organisations requiring strategic enablement, system architecture, or embedded capability building.
          </p>

          <div className="mt-auto">
            <a
              href="mailto:connect@aivass.com"
              className="inline-block text-[11px] tracking-[0.14em] uppercase text-ox-light border border-ox-light/30 hover:border-ox-light/70 hover:bg-ox-light/8 px-7 py-3.5 transition-all duration-300"
              onClick={() => trackDiscussPartnership("connect-page")}
            >
              Email Our Team →
            </a>
          </div>

          {/* Hover glow */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{ background: "radial-gradient(ellipse at 70% 60%, rgba(217,163,155,0.07) 0%, transparent 70%)" }}
          />
        </div>
      </div>

      {/* ── Bottom rule + instagram ──────────────────────────── */}
      <div className="relative z-10 border-t border-cream/10 mt-auto py-8">
        <div className="wrap flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] tracking-[0.12em] uppercase text-cream/30">
          <span>AiVass · Building Extraordinary Futures</span>
          <a
            href="https://instagram.com/aiva.ss"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ox-light transition-colors"
          >
            @aiva.ss
          </a>
        </div>
      </div>
    </div>
  );
}
