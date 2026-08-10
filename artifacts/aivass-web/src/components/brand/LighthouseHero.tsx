/**
 * LighthouseHero — SVG brand illustration.
 * Matches the visual language of MagicConstellation and Triad:
 * navy field, ox-light 4-pointed stars, geometric forms, SVG <animate>.
 * The beam rotates 360° continuously (real lighthouse motion).
 */

const LX = 240; // lantern centre x
const LY = 166; // lantern centre y

/* ── 4-pointed brand star ─────────────────────────────────────────── */
function BrandStar({
  cx, cy, r = 5, opacity = 0.65, delay = 0, dur = 3.5,
}: {
  cx: number; cy: number; r?: number; opacity?: number; delay?: number; dur?: number;
}) {
  const d = r * 0.65;
  return (
    <g transform={`translate(${cx},${cy})`} opacity={opacity}>
      <line x1={0} y1={-r} x2={0} y2={r} stroke="#D9A39B" strokeWidth="0.9" />
      <line x1={-r} y1={0} x2={r} y2={0} stroke="#D9A39B" strokeWidth="0.9" />
      <line x1={-d} y1={-d} x2={d} y2={d} stroke="#D9A39B" strokeWidth="0.55" strokeOpacity="0.5" />
      <line x1={d} y1={-d} x2={-d} y2={d} stroke="#D9A39B" strokeWidth="0.55" strokeOpacity="0.5" />
      <animate attributeName="opacity" values={`${opacity * 0.45};${opacity};${opacity * 0.45}`}
        dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
    </g>
  );
}

/* ── Ambient micro-dot ────────────────────────────────────────────── */
function Dot({ cx, cy, delay = 0, dur = 4 }: { cx: number; cy: number; delay?: number; dur?: number }) {
  return (
    <circle cx={cx} cy={cy} r="0.9" fill="#D9A39B">
      <animate attributeName="opacity" values="0.15;0.55;0.15" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
    </circle>
  );
}

/* ── Tower stripe (horizontal architectural band) ─────────────────── */
function TowerBand({ y, x1, x2, h = 3 }: { y: number; x1: number; x2: number; h?: number }) {
  return <rect x={x1} y={y} width={x2 - x1} height={h} fill="#B8B4AB" fillOpacity="0.7" />;
}

export function LighthouseHero({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full h-full ${className}`} style={{ background: "#12233F" }}>
      <svg
        viewBox="0 0 480 680"
        className="w-full h-full"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
        fill="none"
      >
        <defs>
          {/* Beam: radial from lantern outward */}
          <radialGradient id="lh-beam" cx="0" cy="0.5" r="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="#F7F3E9" stopOpacity="0.28" />
            <stop offset="55%" stopColor="#F7F3E9" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#F7F3E9" stopOpacity="0" />
          </radialGradient>
          {/* Lantern point glow */}
          <radialGradient id="lh-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDFBF6" stopOpacity="1" />
            <stop offset="30%" stopColor="#D9A39B" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#D9A39B" stopOpacity="0" />
          </radialGradient>
          {/* Ambient halo around lantern */}
          <radialGradient id="lh-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D9A39B" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#D9A39B" stopOpacity="0" />
          </radialGradient>
          {/* Tower face (subtle highlight on lit side) */}
          <linearGradient id="lh-tower" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#A8A49B" />
            <stop offset="38%" stopColor="#DEDAD2" />
            <stop offset="100%" stopColor="#9C988F" />
          </linearGradient>
          <linearGradient id="lh-tower-upper" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#B0ACA3" />
            <stop offset="42%" stopColor="#E8E4DC" />
            <stop offset="100%" stopColor="#A4A098" />
          </linearGradient>
          {/* Horizon fade for ocean */}
          <linearGradient id="lh-ocean" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#162A42" />
            <stop offset="100%" stopColor="#0B1825" />
          </linearGradient>
          {/* Constellation line fade */}
          <linearGradient id="lh-constell" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D9A39B" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#D9A39B" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* ── Sky ──────────────────────────────────────────────── */}
        <rect width="480" height="680" fill="#12233F" />

        {/* ── Rotating beacon beam ─────────────────────────────── */}
        {/* Single-direction beam cone emanating from lantern */}
        <g>
          <path
            d={`M ${LX},${LY} L ${LX - 230},${LY - 420} L ${LX + 230},${LY - 420} Z`}
            fill="url(#lh-beam)"
          />
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${LX} ${LY}`}
            to={`360 ${LX} ${LY}`}
            dur="20s"
            repeatCount="indefinite"
          />
        </g>

        {/* ── Constellation — three stars (Triad echo) ─────────── */}
        {/* Three stars loosely positioned upper left, upper right, right-mid */}
        <line x1="75" y1="110" x2="160" y2="290" stroke="url(#lh-constell)" strokeWidth="0.5">
          <animate attributeName="strokeOpacity" values="0.25;0.55;0.25" dur="5s" repeatCount="indefinite" />
        </line>
        <line x1="160" y1="290" x2="390" y2="210" stroke="url(#lh-constell)" strokeWidth="0.5">
          <animate attributeName="strokeOpacity" values="0.25;0.55;0.25" dur="5s" begin="1s" repeatCount="indefinite" />
        </line>
        <line x1="75" y1="110" x2="390" y2="210" stroke="url(#lh-constell)" strokeWidth="0.5">
          <animate attributeName="strokeOpacity" values="0.25;0.55;0.25" dur="5s" begin="2s" repeatCount="indefinite" />
        </line>

        {/* ── Brand stars (4-pointed) ───────────────────────────── */}
        <BrandStar cx={75}  cy={110} r={6}   opacity={0.7} delay={0}   dur={4.2} />
        <BrandStar cx={160} cy={290} r={4.5} opacity={0.5} delay={1.2} dur={3.8} />
        <BrandStar cx={390} cy={210} r={5.5} opacity={0.65} delay={0.6} dur={5.0} />
        <BrandStar cx={420} cy={80}  r={4}   opacity={0.5} delay={2.1} dur={3.5} />
        <BrandStar cx={50}  cy={320} r={3.5} opacity={0.4} delay={1.8} dur={4.5} />
        <BrandStar cx={435} cy={370} r={4}   opacity={0.4} delay={3.0} dur={3.8} />

        {/* ── Ambient micro-star field ──────────────────────────── */}
        <Dot cx={30}  cy={60}  delay={0}   dur={3.5} />
        <Dot cx={110} cy={45}  delay={0.8} dur={4.2} />
        <Dot cx={195} cy={80}  delay={1.5} dur={3.8} />
        <Dot cx={310} cy={55}  delay={0.4} dur={5.0} />
        <Dot cx={355} cy={130} delay={2.2} dur={3.3} />
        <Dot cx={455} cy={155} delay={1.0} dur={4.5} />
        <Dot cx={28}  cy={185} delay={3.1} dur={3.8} />
        <Dot cx={95}  cy={220} delay={0.5} dur={4.8} />
        <Dot cx={325} cy={300} delay={1.8} dur={3.6} />
        <Dot cx={455} cy={290} delay={2.5} dur={4.0} />
        <Dot cx={68}  cy={400} delay={0.9} dur={4.2} />
        <Dot cx={420} cy={450} delay={1.6} dur={3.7} />
        <Dot cx={145} cy={470} delay={3.3} dur={5.0} />
        <Dot cx={370} cy={480} delay={0.3} dur={3.9} />

        {/* ── Horizon line ──────────────────────────────────────── */}
        <line
          x1="0" y1="508" x2="480" y2="508"
          stroke="#F7F3E9" strokeWidth="0.5" strokeOpacity="0.1"
        />

        {/* ── Ocean ─────────────────────────────────────────────── */}
        <rect x="0" y="508" width="480" height="172" fill="url(#lh-ocean)" />

        {/* Ocean wave suggestions */}
        <path d="M 0,522 Q 60,517 120,522 T 240,522 T 360,522 T 480,522"
          stroke="#F7F3E9" strokeOpacity="0.05" strokeWidth="0.8" />
        <path d="M 0,535 Q 80,530 160,535 T 320,535 T 480,535"
          stroke="#F7F3E9" strokeOpacity="0.04" strokeWidth="0.6" />

        {/* Beam ocean reflection (vertical shimmer lines below horizon) */}
        <g opacity="0.12">
          <line x1={LX - 4} y1="510" x2={LX - 8} y2="620" stroke="#F7F3E9" strokeWidth="1.5" />
          <line x1={LX}     y1="510" x2={LX}     y2="650" stroke="#F7F3E9" strokeWidth="2.5" />
          <line x1={LX + 4} y1="510" x2={LX + 8} y2="620" stroke="#F7F3E9" strokeWidth="1.5" />
          <animate attributeName="opacity" values="0.08;0.18;0.08" dur="3.5s" repeatCount="indefinite" />
        </g>

        {/* ── Rocky cliff base ─────────────────────────────────── */}
        <polygon
          points="160,540 200,508 280,505 300,508 340,520 360,540 300,548 200,548"
          fill="#0C1A2B"
        />
        <polygon
          points="195,510 240,498 285,505 260,512 230,512"
          fill="#101F32"
        />

        {/* ── LIGHTHOUSE TOWER ──────────────────────────────────── */}

        {/* Base pedestal / wide foundation */}
        <polygon
          points={`${LX - 26},508 ${LX + 26},508 ${LX + 22},488 ${LX - 22},488`}
          fill="url(#lh-tower)"
        />

        {/* Main tower body — tapers slightly toward top */}
        <polygon
          points={`${LX - 22},488 ${LX + 22},488 ${LX + 14},242 ${LX - 14},242`}
          fill="url(#lh-tower)"
        />

        {/* Tower architectural bands (horizontal stripe lines) */}
        <TowerBand y={430} x1={LX - 20} x2={LX + 20} h={2} />
        <TowerBand y={375} x1={LX - 19} x2={LX + 19} h={2} />
        <TowerBand y={320} x1={LX - 17} x2={LX + 17} h={2} />
        <TowerBand y={280} x1={LX - 16} x2={LX + 16} h={2} />

        {/* ── Gallery / balcony ────────────────────────────────── */}
        <rect x={LX - 24} y={236} width={48} height={6} fill="#B0ACA3" />
        {/* Gallery railing top line */}
        <line x1={LX - 24} y1={236} x2={LX + 24} y2={236} stroke="#C8C4BB" strokeWidth="0.8" />

        {/* ── Upper tower section ──────────────────────────────── */}
        <rect x={LX - 14} y={192} width={28} height={44} fill="url(#lh-tower-upper)" />

        {/* ── Second gallery ───────────────────────────────────── */}
        <rect x={LX - 20} y={188} width={40} height={4} fill="#B0ACA3" />
        <line x1={LX - 20} y1={188} x2={LX + 20} y2={188} stroke="#C8C4BB" strokeWidth="0.8" />

        {/* ── Lantern room ─────────────────────────────────────── */}
        <rect x={LX - 18} y={150} width={36} height={38} fill="#C4C0B7" />
        {/* Vertical glazing bars */}
        <line x1={LX - 9} y1={150} x2={LX - 9} y2={188} stroke="#A8A49B" strokeWidth="0.7" />
        <line x1={LX}     y1={150} x2={LX}     y2={188} stroke="#A8A49B" strokeWidth="0.7" />
        <line x1={LX + 9} y1={150} x2={LX + 9} y2={188} stroke="#A8A49B" strokeWidth="0.7" />
        {/* Horizontal glazing bar */}
        <line x1={LX - 18} y1={169} x2={LX + 18} y2={169} stroke="#A8A49B" strokeWidth="0.7" />

        {/* Lantern glass panes — warm ox-light glow */}
        <rect x={LX - 17} y={151} width={8} height={17} fill="#D9A39B" fillOpacity="0.55" />
        <rect x={LX - 8}  y={151} width={7} height={17} fill="#F7F3E9" fillOpacity="0.3" />
        <rect x={LX + 1}  y={151} width={7} height={17} fill="#D9A39B" fillOpacity="0.55" />
        <rect x={LX + 9}  y={151} width={8} height={17} fill="#F7F3E9" fillOpacity="0.25" />
        {/* Lower panes */}
        <rect x={LX - 17} y={170} width={8} height={17} fill="#F7F3E9" fillOpacity="0.2" />
        <rect x={LX + 9}  y={170} width={8} height={17} fill="#D9A39B" fillOpacity="0.4" />

        {/* Lantern cap border */}
        <rect x={LX - 18} y={148} width={36} height={3} fill="#9C988F" />

        {/* ── Dome ─────────────────────────────────────────────── */}
        <path
          d={`M ${LX - 18},148 Q ${LX - 10},126 ${LX},122 Q ${LX + 10},126 ${LX + 18},148 Z`}
          fill="#B0ACA3"
        />
        <path
          d={`M ${LX - 18},148 Q ${LX - 10},126 ${LX},122 Q ${LX + 10},126 ${LX + 18},148`}
          stroke="#9C988F" strokeWidth="0.6" fill="none"
        />

        {/* ── Finial (top spire) ────────────────────────────────── */}
        <line x1={LX} y1={122} x2={LX} y2={110} stroke="#B0ACA3" strokeWidth="1.5" />
        <circle cx={LX} cy={109} r="2.5" fill="#C8C4BB" />

        {/* ── Keeper's cottage ─────────────────────────────────── */}
        <rect x={LX + 28} y={468} width={46} height={32} fill="#162840" stroke="#C8C4BB" strokeWidth="0.4" strokeOpacity="0.35" />
        {/* Roof */}
        <polygon
          points={`${LX + 25},468 ${LX + 77},468 ${LX + 51},452`}
          fill="#111F33" stroke="#C8C4BB" strokeWidth="0.4" strokeOpacity="0.25"
        />
        {/* Cottage window (warm glow — flickers slightly) */}
        <rect x={LX + 38} y={478} width={11} height={9} rx="0.5" fill="#D9A39B" fillOpacity="0.75">
          <animate attributeName="fill-opacity" values="0.6;0.85;0.6" dur="4.8s" repeatCount="indefinite" />
        </rect>
        {/* Cottage door */}
        <rect x={LX + 55} y={482} width={8} height={18} fill="#0e1b2c" stroke="#C8C4BB" strokeWidth="0.3" strokeOpacity="0.3" />

        {/* ── Lantern halo / ambient glow ───────────────────────── */}
        <circle cx={LX} cy={LY} r="60" fill="url(#lh-halo)">
          <animate attributeName="r" values="55;75;55" dur="3.2s" repeatCount="indefinite" />
        </circle>

        {/* ── Lantern point (bright centre) ────────────────────── */}
        <circle cx={LX} cy={LY} r="6" fill="url(#lh-glow)">
          <animate attributeName="r" values="5;8;5" dur="3.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;1;0.8" dur="3.2s" repeatCount="indefinite" />
        </circle>

        {/* ── Ox-light horizon glow (hope on the horizon) ───────── */}
        <ellipse cx={LX} cy={508} rx="80" ry="6" fill="#D9A39B" fillOpacity="0.07">
          <animate attributeName="rx" values="70;95;70" dur="4s" repeatCount="indefinite" />
        </ellipse>

      </svg>
    </div>
  );
}
