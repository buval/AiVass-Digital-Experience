import { useMemo, useState } from "react";

/**
 * Interactive constellation of the 10 EB-1A extraordinary-ability criteria.
 * Stars connected by fine lines — hover / tap / focus a star to explore it.
 * Brand triad language: 4-pointed stars + thin lines on deep navy, with a
 * gold "lit" state and drifting star-dust for depth.
 */

interface Criterion {
  id: number;
  label: string;
  title: string;
  body: string;
  x: number; // viewBox coords (0–100 field, padded viewBox prevents any clipping)
  y: number; // 0–70 field
}

const CRITERIA: Criterion[] = [
  { id: 1,  label: "Awards",        title: "Nationally recognized awards",  body: "Prizes or awards of national or international recognition for excellence in your field.", x: 14, y: 16 },
  { id: 2,  label: "Membership",    title: "Selective memberships",         body: "Membership in associations that demand outstanding achievement, judged by recognized experts.", x: 34, y: 7 },
  { id: 3,  label: "Press",         title: "Published material about you",  body: "Coverage of you and your work in professional publications or major media.", x: 57, y: 12 },
  { id: 4,  label: "Judging",       title: "Judging the work of others",    body: "Serving as a judge of others' work — review panels, juries, referee roles.", x: 79, y: 7 },
  { id: 5,  label: "Contributions", title: "Original contributions",        body: "Original scientific, scholarly, artistic or business contributions of major significance.", x: 87, y: 22 },
  { id: 6,  label: "Articles",      title: "Scholarly articles",            body: "Authorship of scholarly articles in professional journals or major media.", x: 76, y: 38 },
  { id: 7,  label: "Exhibitions",   title: "Artistic exhibitions",          body: "Display of your work at artistic exhibitions or showcases.", x: 57, y: 47 },
  { id: 8,  label: "Critical role", title: "Critical role",                 body: "A leading or critical role for organizations with a distinguished reputation.", x: 36, y: 41 },
  { id: 9,  label: "High salary",   title: "High remuneration",             body: "A salary or remuneration high relative to others in your field.", x: 17, y: 48 },
  { id: 10, label: "Commercial",    title: "Commercial success",            body: "Commercial success in the performing arts — box office, sales, streams.", x: 12, y: 31 },
];

/** Edges connecting the stars into one constellation (by criterion id) */
const EDGES: Array<[number, number]> = [
  [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 1],
  [2, 8], [3, 7],
];

const STAR = "M0 -7 L1.9 -1.9 L7 0 L1.9 1.9 L0 7 L-1.9 1.9 L-7 0 L-1.9 -1.9 Z";

const BLUSH = "#D9A39B";
const GOLD = "#E8C87E";

/** Deterministic star-dust points (no Math.random — stable across renders) */
const DUST = Array.from({ length: 26 }, (_, i) => ({
  x: ((i * 37.3) % 100),
  y: ((i * 23.7 + 11) % 58),
  r: 0.28 + ((i * 7) % 3) * 0.12,
  delay: (i % 9) * 0.55,
}));

export function CriteriaConstellation() {
  const [active, setActive] = useState<Criterion | null>(null);
  const [visited, setVisited] = useState<Set<number>>(() => new Set());
  const shown = active ?? CRITERIA[0];

  const byId = (id: number) => CRITERIA.find((c) => c.id === id)!;

  const activate = (c: Criterion) => {
    setActive(c);
    setVisited((prev) => {
      if (prev.has(c.id)) return prev;
      const next = new Set(prev);
      next.add(c.id);
      return next;
    });
  };

  const visitedCount = visited.size;

  const litEdges = useMemo(
    () => new Set(
      active
        ? EDGES.filter(([a, b]) => a === active.id || b === active.id).map(([a, b]) => `${a}-${b}`)
        : []
    ),
    [active]
  );

  return (
    <section className="bg-navy text-cream py-[70px] md:py-[100px] relative overflow-hidden">
      {/* Ambient glow behind the constellation */}
      <div
        className="absolute inset-y-0 right-0 w-[62%] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 60% 45%, rgba(217,163,155,0.10), rgba(232,200,126,0.05) 45%, transparent 72%)",
        }}
      />
      <style>{`
        @keyframes cc-twinkle {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.7; }
        }
        @keyframes cc-halo {
          0%, 100% { transform: scale(1); opacity: 0.22; }
          50% { transform: scale(1.35); opacity: 0.08; }
        }
        @keyframes cc-detail-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cc-dust { animation: cc-twinkle 4.5s ease-in-out infinite; }
        .cc-halo-pulse { animation: cc-halo 2.6s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
        .cc-detail { animation: cc-detail-in .35s ease both; }
        @media (prefers-reduced-motion: reduce) {
          .cc-dust, .cc-halo-pulse { animation: none; }
          .cc-detail { animation: none; }
        }
      `}</style>

      <div className="wrap relative">
        <div className="eyebrow text-ox-light mb-6">
          The extraordinary ability framework
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-10 md:gap-[5vw] items-center">
          <div>
            <h2 className="text-[34px] md:text-[clamp(36px,4.2vw,56px)] leading-[1.0] tracking-[-0.05em] mb-5">
              Ten criteria.<br />
              <span className="text-ox-light italic">You need three.</span>
            </h2>
            <p className="text-ox-light text-[14px] md:text-[15px] leading-[1.65] max-w-[380px] mb-8">
              USCIS recognizes ten ways to demonstrate extraordinary ability.
              Explore the constellation — every guide shows you how to evidence
              the criteria that fit your story.
            </p>

            {/* Active criterion detail */}
            <div
              key={shown.id}
              className="cc-detail border-l-2 border-[#E8C87E]/70 pl-5 min-h-[130px]"
              aria-live="polite"
            >
              <div className="flex items-baseline gap-3 mb-1">
                <span className="font-serif text-[34px] leading-none" style={{ color: GOLD }}>
                  {String(shown.id).padStart(2, "0")}
                </span>
                <span className="text-[10px] tracking-[0.16em] uppercase text-ox-light/70">
                  of ten criteria
                </span>
              </div>
              <h3 className="font-serif text-[20px] md:text-[22px] mb-2">{shown.title}</h3>
              <p className="text-ox-light text-[13px] leading-[1.6] max-w-[360px] opacity-85">
                {shown.body}
              </p>
            </div>

            {/* Exploration progress */}
            <div className="mt-7 flex items-center gap-3">
              <div className="flex gap-[5px]">
                {CRITERIA.map((c) => (
                  <span
                    key={c.id}
                    className="block w-[14px] h-[3px] transition-colors duration-300"
                    style={{
                      background: visited.has(c.id) ? GOLD : "rgba(217,163,155,0.25)",
                    }}
                  />
                ))}
              </div>
              <span className="text-[10px] tracking-[0.14em] uppercase text-ox-light/60">
                {visitedCount === 0
                  ? "Tap a star to begin"
                  : visitedCount >= 10
                    ? "All ten explored"
                    : `${visitedCount} of 10 explored`}
              </span>
            </div>
          </div>

          {/* Constellation field — padded viewBox so labels never clip */}
          <div className="relative w-full aspect-[10/7] select-none">
            <svg
              viewBox="-8 -9 116 78"
              className="w-full h-full overflow-visible"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Constellation of the ten EB-1A criteria"
            >
              {/* Star dust */}
              {DUST.map((d, i) => (
                <circle
                  key={i}
                  cx={d.x}
                  cy={d.y}
                  r={d.r}
                  fill={BLUSH}
                  className="cc-dust"
                  style={{ animationDelay: `${d.delay}s` }}
                  opacity="0.2"
                />
              ))}

              {/* Connecting lines */}
              {EDGES.map(([a, b]) => {
                const ca = byId(a);
                const cb = byId(b);
                const isLit = litEdges.has(`${a}-${b}`);
                return (
                  <line
                    key={`${a}-${b}`}
                    x1={ca.x} y1={ca.y} x2={cb.x} y2={cb.y}
                    stroke={isLit ? GOLD : BLUSH}
                    strokeWidth={isLit ? 0.4 : 0.16}
                    opacity={isLit ? 0.9 : 0.25}
                    style={{ transition: "opacity .35s, stroke .35s, stroke-width .35s" }}
                  />
                );
              })}

              {/* Stars */}
              {CRITERIA.map((c) => {
                const isActive = active?.id === c.id;
                const wasVisited = visited.has(c.id);
                const color = isActive ? GOLD : wasVisited ? "#E3B9A9" : BLUSH;
                return (
                  <g
                    key={c.id}
                    transform={`translate(${c.x} ${c.y})`}
                    onMouseEnter={() => activate(c)}
                    onClick={() => activate(c)}
                    style={{ cursor: "pointer" }}
                    role="button"
                    aria-label={c.title}
                    aria-pressed={isActive}
                    tabIndex={0}
                    onFocus={() => activate(c)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        activate(c);
                      }
                    }}
                  >
                    {/* generous invisible hit area */}
                    <circle r="7" fill="transparent" />
                    {/* pulsing halo when active */}
                    {isActive && (
                      <circle r="5.2" fill={GOLD} className="cc-halo-pulse" opacity="0.2" />
                    )}
                    <path
                      d={STAR}
                      fill={color}
                      opacity={isActive ? 1 : 0.8}
                      transform={`scale(${isActive ? 0.68 : 0.42})`}
                      style={{ transition: "transform .3s, fill .3s, opacity .3s" }}
                    />
                    <text
                      y={c.y > 27 ? 9 : -6.2}
                      textAnchor="middle"
                      fontFamily="DM Sans, sans-serif"
                      fontSize="2.7"
                      letterSpacing="0.4"
                      fill={isActive ? GOLD : BLUSH}
                      opacity={isActive ? 1 : 0.7}
                      style={{ textTransform: "uppercase", transition: "opacity .3s, fill .3s" }}
                    >
                      {c.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
