import { useEffect, useRef } from "react";

/**
 * LighthouseHero — animated 360° cinematic sweep effect.
 * The image slowly orbits/pans horizontally (Ken Burns + sweep),
 * giving a living, dynamic feel without any JS library.
 */
export function LighthouseHero({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* ── Animated image ── */}
      <div className="absolute inset-0 lighthouse-sweep">
        <img
          src={`${import.meta.env.BASE_URL}images/hero-lighthouse.jpg`}
          alt="A lighthouse beacon sweeping across dark ocean waters — hope, guidance, clarity"
          className="w-full h-full object-cover object-center"
          style={{ transform: "scale(1.25)", transformOrigin: "center center" }}
        />
      </div>

      {/* ── Rotating beacon light ray overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none lighthouse-beacon-ray"
        style={{
          background:
            "conic-gradient(from 0deg at 55% 35%, transparent 0deg, rgba(247,243,233,0.06) 8deg, transparent 16deg, transparent 360deg)",
        }}
      />

      {/* ── Left-edge cream fade into text column ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(247,243,233,0.62) 0%, rgba(247,243,233,0.18) 22%, transparent 42%), linear-gradient(to bottom, transparent 60%, rgba(247,243,233,0.5) 100%)",
        }}
      />

      {/* ── Subtle vignette to deepen depth ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(18,35,63,0.35) 100%)",
        }}
      />
    </div>
  );
}
