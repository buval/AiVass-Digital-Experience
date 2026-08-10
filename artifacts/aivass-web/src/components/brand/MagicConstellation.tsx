import { useEffect, useRef, useState } from "react";

/**
 * MagicConstellation
 * Animated SVG constellation with glowing 4-pointed stars and drawing lines.
 * Uses RAF for smooth, zero-jank animation.
 */

interface Star {
  cx: number;
  cy: number;
  size: number;
  pulseOffset: number;
  pulseSpeed: number;
}

// Triad star positions (top apex, bottom-left, bottom-right) — percentage of 300×260 viewBox
const NODES: Star[] = [
  { cx: 150, cy:  30, size: 11, pulseOffset: 0,      pulseSpeed: 1.0 },
  { cx:  42, cy: 220, size:  9, pulseOffset: 1.1,    pulseSpeed: 0.85 },
  { cx: 258, cy: 220, size:  9, pulseOffset: 2.2,    pulseSpeed: 0.92 },
];

// Ambient micro-stars
const AMBIENTS: Array<{ cx: number; cy: number; size: number; pulseOffset: number }> = [
  { cx:  22, cy:  55, size: 3.5, pulseOffset: 0.3 },
  { cx: 272, cy:  80, size: 2.8, pulseOffset: 1.4 },
  { cx:  68, cy: 148, size: 2.2, pulseOffset: 2.6 },
  { cx: 238, cy: 152, size: 3.0, pulseOffset: 0.9 },
  { cx: 120, cy: 260, size: 2.5, pulseOffset: 1.7 },
  { cx: 192, cy: 255, size: 2.0, pulseOffset: 3.1 },
  { cx: 150, cy: 140, size: 2.8, pulseOffset: 2.0 },
  { cx:  40, cy: 175, size: 2.0, pulseOffset: 0.6 },
  { cx: 265, cy: 170, size: 2.4, pulseOffset: 1.2 },
];

// Edge line endpoints (pairs of NODES indices)
const EDGES = [[0, 1], [0, 2], [1, 2]] as const;

function fourPointedStar(cx: number, cy: number, r: number): string {
  const inner = r * 0.38;
  return [
    `M${cx} ${cy - r}`,
    `L${cx + inner} ${cy - inner}`,
    `L${cx + r} ${cy}`,
    `L${cx + inner} ${cy + inner}`,
    `L${cx} ${cy + r}`,
    `L${cx - inner} ${cy + inner}`,
    `L${cx - r} ${cy}`,
    `L${cx - inner} ${cy - inner}`,
    "Z",
  ].join(" ");
}

export function MagicConstellation({ className = "" }: { className?: string }) {
  const rafRef = useRef<number | null>(null);
  const [t, setT] = useState(0);

  // Animate draw-in of lines on mount
  const [lineProgress, setLineProgress] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const DRAW_MS = 1800;
    function tick(now: number) {
      const elapsed = now - start;
      setLineProgress(Math.min(1, elapsed / DRAW_MS));
      if (elapsed < DRAW_MS) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  // Continuous pulse tick
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    function loop(now: number) {
      setT((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const LINE_LENGTH = 230; // approximate max edge length in the 300×260 viewbox

  return (
    <svg
      viewBox="0 0 300 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Glow filter for main nodes */}
        <filter id="mc-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="4.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Softer glow for ambient micro-stars */}
        <filter id="mc-glow-sm" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Line fade gradient */}
        <linearGradient id="line-fade-a" x1="150" y1="30" x2="42" y2="220" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#D9A39B" stopOpacity="0.55" />
          <stop offset="1" stopColor="#D9A39B" stopOpacity="0.28" />
        </linearGradient>
        <linearGradient id="line-fade-b" x1="150" y1="30" x2="258" y2="220" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#D9A39B" stopOpacity="0.55" />
          <stop offset="1" stopColor="#D9A39B" stopOpacity="0.28" />
        </linearGradient>
        <linearGradient id="line-fade-c" x1="42" y1="220" x2="258" y2="220" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#D9A39B" stopOpacity="0.30" />
          <stop offset="0.5" stopColor="#D9A39B" stopOpacity="0.20" />
          <stop offset="1" stopColor="#D9A39B" stopOpacity="0.30" />
        </linearGradient>
        {/* Radial bloom behind top node */}
        <radialGradient id="bloom-top" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#D9A39B" stopOpacity="0.18" />
          <stop offset="1" stopColor="#D9A39B" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── Ambient bloom behind top star ── */}
      <ellipse cx="150" cy="30" rx="52" ry="42" fill="url(#bloom-top)"
        style={{ opacity: 0.7 + 0.3 * Math.sin(t * 0.8) }} />

      {/* ── Constellation edges — draw in on mount ── */}
      {EDGES.map(([a, b], i) => {
        const na = NODES[a], nb = NODES[b];
        const dx = nb.cx - na.cx, dy = nb.cy - na.cy;
        const len = Math.sqrt(dx * dx + dy * dy);
        const dashLen = len * lineProgress;
        const gradients = ["url(#line-fade-a)", "url(#line-fade-b)", "url(#line-fade-c)"];
        return (
          <line
            key={i}
            x1={na.cx} y1={na.cy}
            x2={nb.cx} y2={nb.cy}
            stroke={gradients[i]}
            strokeWidth="0.9"
            strokeLinecap="round"
            strokeDasharray={`${dashLen} ${len}`}
            strokeDashoffset="0"
          />
        );
      })}

      {/* ── Ambient micro-stars ── */}
      {AMBIENTS.map((s, i) => {
        const pulse = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 0.9 + s.pulseOffset));
        return (
          <path
            key={i}
            d={fourPointedStar(s.cx, s.cy, s.size)}
            fill="#D9A39B"
            filter="url(#mc-glow-sm)"
            style={{ opacity: pulse * lineProgress }}
          />
        );
      })}

      {/* ── Main triad nodes ── */}
      {NODES.map((s, i) => {
        const pulse = 0.78 + 0.22 * Math.sin(t * s.pulseSpeed + s.pulseOffset);
        const scaledR = s.size * pulse;
        return (
          <path
            key={i}
            d={fourPointedStar(s.cx, s.cy, scaledR)}
            fill="#D9A39B"
            filter="url(#mc-glow)"
            style={{ opacity: lineProgress }}
          />
        );
      })}

      {/* ── Traveling light on edges (one dot per edge, looping) ── */}
      {EDGES.map(([a, b], i) => {
        const na = NODES[a], nb = NODES[b];
        const phase = (t * 0.28 + i * 0.33) % 1;
        const px = na.cx + (nb.cx - na.cx) * phase;
        const py = na.cy + (nb.cy - na.cy) * phase;
        const fade = Math.sin(phase * Math.PI);
        return (
          <circle
            key={i}
            cx={px}
            cy={py}
            r={2.2}
            fill="#D9A39B"
            filter="url(#mc-glow-sm)"
            style={{ opacity: fade * 0.65 * lineProgress }}
          />
        );
      })}
    </svg>
  );
}
