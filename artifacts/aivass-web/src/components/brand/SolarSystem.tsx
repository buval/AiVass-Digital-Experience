/**
 * SolarSystem — pure SVG animated brand orrery.
 * Zero React hooks — fully driven by SVG animateTransform.
 * Labels counter-rotate so they always stay upright as planets orbit.
 * Inner orbits faster, outer slower — real Keplerian feel.
 */

const CX = 180;  // SVG centre x
const CY = 180;  // SVG centre y

const ORBITS = [68, 110, 148] as const;  // orbit radii

const PLANETS = [
  { label: "Intelligence", orbitIdx: 0, dur: "11s",  startDeg: -90,  color: "#D9A39B", dotR: 5.5 },
  { label: "Strategy",     orbitIdx: 1, dur: "19s",  startDeg:  27,  color: "#F7F3E9", dotR: 4.8 },
  { label: "Human",        orbitIdx: 1, dur: "19s",  startDeg: 207,  color: "#D9A39B", dotR: 4.8 },
  { label: "Evidence",     orbitIdx: 2, dur: "31s",  startDeg: 108,  color: "#F7F3E9", dotR: 4.2 },
  { label: "Permanence",   orbitIdx: 2, dur: "31s",  startDeg: 288,  color: "#D9A39B", dotR: 4.2 },
] as const;

/* ── 4-pointed brand star ─────────────────────────────────── */
function SunStar() {
  const r = 9, d = 6.5;
  return (
    <g>
      <line x1={CX}   y1={CY-r} x2={CX}   y2={CY+r} stroke="#F7F3E9" strokeWidth="1.4" />
      <line x1={CX-r} y1={CY}   x2={CX+r} y2={CY}   stroke="#F7F3E9" strokeWidth="1.4" />
      <line x1={CX-d} y1={CY-d} x2={CX+d} y2={CY+d} stroke="#F7F3E9" strokeWidth="0.8" strokeOpacity="0.55" />
      <line x1={CX+d} y1={CY-d} x2={CX-d} y2={CY+d} stroke="#F7F3E9" strokeWidth="0.8" strokeOpacity="0.55" />
    </g>
  );
}

export function SolarSystem() {
  return (
    <div className="relative w-full max-w-[420px] aspect-square mx-auto select-none">
      <svg
        viewBox="0 0 360 360"
        className="w-full h-full"
        fill="none"
        aria-label="Orbital diagram: Intelligence, Strategy, Human, Evidence and Permanence orbit the AiVass core"
      >
        <defs>
          <radialGradient id="ss-sun-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#7E3033" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7E3033" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ss-planet-ox" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#D9A39B" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#D9A39B" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ss-planet-cr" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#F7F3E9" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#F7F3E9" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Orbital rings ── */}
        {ORBITS.map((r, i) => (
          <circle
            key={r} cx={CX} cy={CY} r={r}
            stroke="#F7F3E9" strokeOpacity={0.08 + i * 0.04} strokeWidth="0.7"
          />
        ))}

        {/* ── Sun halo (breathing) ── */}
        <circle cx={CX} cy={CY} r="60" fill="url(#ss-sun-halo)">
          <animate attributeName="r" values="54;68;54" dur="4s" repeatCount="indefinite" />
          <animate attributeName="fill-opacity" values="0.8;1;0.8" dur="4s" repeatCount="indefinite" />
        </circle>

        {/* ── Sun core ── */}
        <circle cx={CX} cy={CY} r="28" fill="#7E3033" fillOpacity="0.88" />
        <circle cx={CX} cy={CY} r="28" stroke="#D9A39B" strokeWidth="0.8" strokeOpacity="0.35" />
        <SunStar />

        {/* ── Planets ── */}
        {PLANETS.map((p) => {
          const orbitR = ORBITS[p.orbitIdx];
          const isOx = p.color === "#D9A39B";
          const labelY = p.dotR + 14;

          return (
            <g key={p.label}>
              {/*
               * This <g> rotates around (CX,CY): from startDeg to startDeg+360.
               * The <animateTransform> as a child of <g> animates the <g>'s transform.
               */}
              <animateTransform
                attributeName="transform"
                type="rotate"
                from={`${p.startDeg} ${CX} ${CY}`}
                to={`${p.startDeg + 360} ${CX} ${CY}`}
                dur={p.dur}
                repeatCount="indefinite"
              />

              {/* Planet glow halo */}
              <circle
                cx={CX + orbitR} cy={CY}
                r={p.dotR * 2.6}
                fill={isOx ? "url(#ss-planet-ox)" : "url(#ss-planet-cr)"}
              />

              {/* Planet body */}
              <circle cx={CX + orbitR} cy={CY} r={p.dotR} fill={p.color} fillOpacity="0.92" />

              {/*
               * Counter-rotating label group.
               * translate(CX+orbitR, CY) sets origin to planet centre.
               * The animateTransform (additive="sum") counter-rotates by -startDeg → -startDeg-360
               * Combined with parent's +rotation, net text rotation = 0° (always upright).
               */}
              <g transform={`translate(${CX + orbitR},${CY})`}>
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from={`${-p.startDeg}`}
                  to={`${-p.startDeg - 360}`}
                  dur={p.dur}
                  repeatCount="indefinite"
                  additive="sum"
                />
                <text
                  x="0"
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="hanging"
                  fill="#F7F3E9"
                  fillOpacity="0.58"
                  fontSize="7"
                  letterSpacing="1.8"
                  fontFamily="DM Sans, ui-sans-serif, sans-serif"
                >
                  {p.label.toUpperCase()}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
