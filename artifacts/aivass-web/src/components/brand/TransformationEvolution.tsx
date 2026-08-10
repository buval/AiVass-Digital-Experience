import { useEffect, useRef, useState } from "react";

/**
 * TransformationEvolution
 * Visualises the AiVass transformation arc in three acts:
 *   Seed → Emergence → Full Triad
 * Rendered as an animated SVG constellation, designed to sit
 * inside the navy "The Strategist" card in the Insights section.
 */

function fourPointedStar(cx: number, cy: number, r: number): string {
  const i = r * 0.36;
  return `M${cx} ${cy-r} L${cx+i} ${cy-i} L${cx+r} ${cy} L${cx+i} ${cy+i} L${cx} ${cy+r} L${cx-i} ${cy+i} L${cx-r} ${cy} L${cx-i} ${cy-i}Z`;
}

const OX = "#D9A39B";

// Act I: Seed — single dim star
const SEED = { cx: 52, cy: 150, r: 5.5, pulse: 0.7, speed: 0.9 };

// Act II: Emergence — two stars + connecting line
const EMG_A = { cx: 138, cy: 80,  r: 7,   pulse: 0.3, speed: 1.05 };
const EMG_B = { cx: 170, cy: 128, r: 5.5, pulse: 1.4, speed: 0.88 };

// Act III: Full Triad
const TRI_TOP = { cx: 252, cy: 45,  r: 10,  pulse: 0.0, speed: 0.95 };
const TRI_BL  = { cx: 218, cy: 148, r: 8,   pulse: 1.2, speed: 0.82 };
const TRI_BR  = { cx: 282, cy: 148, r: 8,   pulse: 2.1, speed: 1.0  };

export function TransformationEvolution({ className = "" }: { className?: string }) {
  const [t, setT] = useState(0);
  const [lineP, setLineP] = useState(0); // 0→1 draw-in progress

  useEffect(() => {
    const start = performance.now();
    const DRAW = 2000;
    let raf: number;
    const tick = (now: number) => {
      const el = now - start;
      setLineP(Math.min(1, el / DRAW));
      setT((el) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pulse = (s: { pulse: number; speed: number }) =>
    0.75 + 0.25 * Math.sin(t * s.speed + s.pulse);

  // Seed opacity – fades slightly as transformation "moves on"
  const seedOp = 0.35 + 0.15 * Math.sin(t * 0.7);

  // Journey path total length (approx)
  const path1Len = 90;   // seed → emergence
  const path2Len = 80;   // emergence → triad

  // Draw progress per path: path1 starts at 0, path2 starts at 0.45
  const p1 = Math.min(1, lineP / 0.5);
  const p2 = Math.min(1, Math.max(0, (lineP - 0.45) / 0.55));

  // Triad edge lengths (approx)
  const triEdge = (ax: number, ay: number, bx: number, by: number) =>
    Math.sqrt((bx - ax) ** 2 + (by - ay) ** 2);
  const e1 = triEdge(TRI_TOP.cx, TRI_TOP.cy, TRI_BL.cx, TRI_BL.cy);
  const e2 = triEdge(TRI_TOP.cx, TRI_TOP.cy, TRI_BR.cx, TRI_BR.cy);
  const e3 = triEdge(TRI_BL.cx, TRI_BL.cy, TRI_BR.cx, TRI_BR.cy);

  // Traveling dot on the triad edges
  const loopPhase = (t * 0.22) % 1;
  const loopX = TRI_TOP.cx + (TRI_BL.cx - TRI_TOP.cx) * loopPhase;
  const loopY = TRI_TOP.cy + (TRI_BL.cy - TRI_TOP.cy) * loopPhase;

  return (
    <svg
      viewBox="0 0 330 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <filter id="te-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="te-glow-lg" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="te-glow-sm" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="te-bloom" cx="76%" cy="24%" r="40%">
          <stop offset="0" stopColor={OX} stopOpacity="0.12" />
          <stop offset="1" stopColor={OX} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="te-path1" x1="52" y1="150" x2="138" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={OX} stopOpacity="0.20" />
          <stop offset="1" stopColor={OX} stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="te-path2" x1="170" y1="128" x2="252" y2="45" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={OX} stopOpacity="0.35" />
          <stop offset="1" stopColor={OX} stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="te-emg" x1="138" y1="80" x2="170" y2="128" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={OX} stopOpacity="0.45" />
          <stop offset="1" stopColor={OX} stopOpacity="0.30" />
        </linearGradient>
        <linearGradient id="te-tri-a" x1={TRI_TOP.cx} y1={TRI_TOP.cy} x2={TRI_BL.cx} y2={TRI_BL.cy} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={OX} stopOpacity="0.55" />
          <stop offset="1" stopColor={OX} stopOpacity="0.32" />
        </linearGradient>
        <linearGradient id="te-tri-b" x1={TRI_TOP.cx} y1={TRI_TOP.cy} x2={TRI_BR.cx} y2={TRI_BR.cy} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={OX} stopOpacity="0.55" />
          <stop offset="1" stopColor={OX} stopOpacity="0.32" />
        </linearGradient>
        <linearGradient id="te-tri-c" x1={TRI_BL.cx} y1={TRI_BL.cy} x2={TRI_BR.cx} y2={TRI_BR.cy} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={OX} stopOpacity="0.32" />
          <stop offset="0.5" stopColor={OX} stopOpacity="0.22" />
          <stop offset="1" stopColor={OX} stopOpacity="0.32" />
        </linearGradient>
      </defs>

      {/* Bloom behind the triad */}
      <ellipse cx={252} cy={90} rx={75} ry={65} fill="url(#te-bloom)" />

      {/* ── ACT LABELS ── */}
      {[
        { x: 52,  label: "Seed" },
        { x: 154, label: "Emergence" },
        { x: 252, label: "Transform" },
      ].map(({ x, label }) => (
        <text
          key={label}
          x={x}
          y={196}
          textAnchor="middle"
          fontSize="8"
          letterSpacing="0.08em"
          fill={OX}
          style={{ opacity: 0.38 * lineP, fontFamily: "DM Sans, sans-serif", textTransform: "uppercase" }}
        >
          {label.toUpperCase()}
        </text>
      ))}

      {/* Vertical dividers between acts */}
      {[104, 200].map((x, i) => (
        <line key={i} x1={x} y1={30} x2={x} y2={178}
          stroke={OX} strokeWidth="0.6" strokeDasharray="3 5"
          style={{ opacity: 0.15 * lineP }} />
      ))}

      {/* ── ACT I: SEED ── */}
      <path d={fourPointedStar(SEED.cx, SEED.cy, SEED.r * pulse(SEED))}
        fill={OX} filter="url(#te-glow-sm)"
        style={{ opacity: seedOp * lineP }} />

      {/* ── JOURNEY PATH: Seed → Emergence ── */}
      <line
        x1={SEED.cx} y1={SEED.cy}
        x2={EMG_A.cx} y2={EMG_A.cy}
        stroke="url(#te-path1)" strokeWidth="0.8" strokeDasharray={`${path1Len * p1} ${path1Len}`}
        strokeLinecap="round"
        style={{ opacity: 0.7 }}
      />

      {/* ── ACT II: EMERGENCE ── */}
      {/* Connecting line between the two stars */}
      <line x1={EMG_A.cx} y1={EMG_A.cy} x2={EMG_B.cx} y2={EMG_B.cy}
        stroke="url(#te-emg)" strokeWidth="0.9"
        style={{ opacity: 0.6 * p1 }} />
      <path d={fourPointedStar(EMG_A.cx, EMG_A.cy, EMG_A.r * pulse(EMG_A))}
        fill={OX} filter="url(#te-glow)"
        style={{ opacity: 0.7 * p1 }} />
      <path d={fourPointedStar(EMG_B.cx, EMG_B.cy, EMG_B.r * pulse(EMG_B))}
        fill={OX} filter="url(#te-glow-sm)"
        style={{ opacity: 0.55 * p1 }} />

      {/* ── JOURNEY PATH: Emergence → Triad ── */}
      <line
        x1={EMG_B.cx} y1={EMG_B.cy}
        x2={TRI_TOP.cx} y2={TRI_TOP.cy}
        stroke="url(#te-path2)" strokeWidth="0.8"
        strokeDasharray={`${path2Len * p2} ${path2Len}`}
        strokeLinecap="round"
        style={{ opacity: 0.8 }}
      />

      {/* ── ACT III: FULL TRIAD ── */}
      {/* Triangle edges */}
      <line x1={TRI_TOP.cx} y1={TRI_TOP.cy} x2={TRI_BL.cx} y2={TRI_BL.cy}
        stroke="url(#te-tri-a)" strokeWidth="1.0"
        strokeDasharray={`${e1 * p2} ${e1}`} strokeLinecap="round" />
      <line x1={TRI_TOP.cx} y1={TRI_TOP.cy} x2={TRI_BR.cx} y2={TRI_BR.cy}
        stroke="url(#te-tri-b)" strokeWidth="1.0"
        strokeDasharray={`${e2 * p2} ${e2}`} strokeLinecap="round" />
      <line x1={TRI_BL.cx} y1={TRI_BL.cy} x2={TRI_BR.cx} y2={TRI_BR.cy}
        stroke="url(#te-tri-c)" strokeWidth="0.9"
        strokeDasharray={`${e3 * p2} ${e3}`} strokeLinecap="round" />

      {/* Triad star nodes */}
      <path d={fourPointedStar(TRI_TOP.cx, TRI_TOP.cy, TRI_TOP.r * pulse(TRI_TOP))}
        fill={OX} filter="url(#te-glow-lg)" style={{ opacity: p2 }} />
      <path d={fourPointedStar(TRI_BL.cx, TRI_BL.cy, TRI_BL.r * pulse(TRI_BL))}
        fill={OX} filter="url(#te-glow)" style={{ opacity: 0.9 * p2 }} />
      <path d={fourPointedStar(TRI_BR.cx, TRI_BR.cy, TRI_BR.r * pulse(TRI_BR))}
        fill={OX} filter="url(#te-glow)" style={{ opacity: 0.9 * p2 }} />

      {/* Traveling light on triad */}
      <circle cx={loopX} cy={loopY} r={2.0} fill={OX} filter="url(#te-glow-sm)"
        style={{ opacity: Math.sin(loopPhase * Math.PI) * 0.6 * p2 }} />
    </svg>
  );
}
