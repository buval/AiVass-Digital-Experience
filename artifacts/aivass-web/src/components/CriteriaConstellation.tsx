import { useState } from "react";

/**
 * Interactive constellation of the 10 EB-1A extraordinary-ability criteria.
 * Stars connected by faint lines — hover/tap a star to explore the criterion.
 * Mirrors the AiVass triad brand mark (4-pointed stars + thin lines on navy).
 */

interface Criterion {
  id: number;
  label: string;
  title: string;
  body: string;
  x: number; // % position in the constellation field
  y: number;
}

const CRITERIA: Criterion[] = [
  { id: 1,  label: "Awards",        title: "Nationally recognized awards",     body: "Prizes or awards of national or international recognition for excellence in your field.", x: 14, y: 22 },
  { id: 2,  label: "Membership",    title: "Selective memberships",            body: "Membership in associations that demand outstanding achievement, judged by recognized experts.", x: 34, y: 10 },
  { id: 3,  label: "Press",         title: "Published material about you",     body: "Coverage of you and your work in professional publications or major media.", x: 57, y: 16 },
  { id: 4,  label: "Judging",       title: "Judging the work of others",       body: "Serving as a judge of others' work — review panels, juries, referee roles.", x: 79, y: 10 },
  { id: 5,  label: "Contributions", title: "Original contributions",           body: "Original scientific, scholarly, artistic or business contributions of major significance.", x: 87, y: 30 },
  { id: 6,  label: "Articles",      title: "Scholarly articles",               body: "Authorship of scholarly articles in professional journals or major media.", x: 76, y: 52 },
  { id: 7,  label: "Exhibitions",   title: "Artistic exhibitions",             body: "Display of your work at artistic exhibitions or showcases.", x: 57, y: 66 },
  { id: 8,  label: "Critical role", title: "Critical role",                    body: "A leading or critical role for organizations with a distinguished reputation.", x: 36, y: 58 },
  { id: 9,  label: "High salary",   title: "High remuneration",                body: "A salary or remuneration high relative to others in your field.", x: 17, y: 68 },
  { id: 10, label: "Commercial",    title: "Commercial success",               body: "Commercial success in the performing arts — box office, sales, streams.", x: 12, y: 44 },
];

/** Edges connecting the stars into one constellation (by criterion id) */
const EDGES: Array<[number, number]> = [
  [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 1],
  [2, 8], [3, 7],
];

const STAR = "M0 -7 L1.9 -1.9 L7 0 L1.9 1.9 L0 7 L-1.9 1.9 L-7 0 L-1.9 -1.9 Z";

export function CriteriaConstellation() {
  const [active, setActive] = useState<Criterion | null>(null);
  const shown = active ?? CRITERIA[4]; // default: Original contributions

  const byId = (id: number) => CRITERIA.find((c) => c.id === id)!;

  return (
    <section className="bg-navy text-cream py-[70px] md:py-[100px] relative overflow-hidden">
      <div className="wrap">
        <div className="eyebrow text-ox-light mb-6">
          The extraordinary ability framework
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-10 md:gap-[6vw] items-center">
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
              className="border-l-2 border-ox-light/60 pl-5 min-h-[110px] transition-opacity"
              aria-live="polite"
            >
              <div className="text-[10px] tracking-[0.16em] uppercase text-ox-light/70 mb-1">
                Criterion {shown.id} of 10
              </div>
              <h3 className="font-serif text-[20px] md:text-[22px] mb-2">{shown.title}</h3>
              <p className="text-ox-light text-[13px] leading-[1.6] max-w-[360px] opacity-85">
                {shown.body}
              </p>
            </div>
          </div>

          {/* Constellation field */}
          <div className="relative w-full aspect-[10/7] select-none">
            <svg viewBox="0 0 100 70" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-label="Constellation of the ten EB-1A criteria">
              {/* Connecting lines */}
              {EDGES.map(([a, b]) => {
                const ca = byId(a);
                const cb = byId(b);
                const isLit = active != null && (active.id === a || active.id === b);
                return (
                  <line
                    key={`${a}-${b}`}
                    x1={ca.x} y1={ca.y * 0.7} x2={cb.x} y2={cb.y * 0.7}
                    stroke="#D9A39B"
                    strokeWidth={isLit ? 0.35 : 0.18}
                    opacity={isLit ? 0.75 : 0.25}
                    style={{ transition: "opacity .3s, stroke-width .3s" }}
                  />
                );
              })}

              {/* Stars */}
              {CRITERIA.map((c) => {
                const isActive = active?.id === c.id;
                return (
                  <g
                    key={c.id}
                    transform={`translate(${c.x} ${c.y * 0.7})`}
                    onMouseEnter={() => setActive(c)}
                    onClick={() => setActive(c)}
                    style={{ cursor: "pointer" }}
                    role="button"
                    aria-label={c.title}
                    aria-pressed={isActive}
                    tabIndex={0}
                    onFocus={() => setActive(c)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActive(c);
                      }
                    }}
                  >
                    {/* generous invisible hit area */}
                    <circle r="6.5" fill="transparent" />
                    {/* halo when active */}
                    <circle
                      r={isActive ? 5 : 0}
                      fill="#D9A39B"
                      opacity="0.14"
                      style={{ transition: "r .3s" }}
                    />
                    <path
                      d={STAR}
                      fill="#D9A39B"
                      opacity={isActive ? 1 : 0.75}
                      transform={`scale(${isActive ? 0.62 : 0.42})`}
                      style={{ transition: "transform .3s, opacity .3s" }}
                    />
                    <text
                      y={c.y > 35 ? 8.5 : -6}
                      textAnchor="middle"
                      fontFamily="DM Sans, sans-serif"
                      fontSize="2.6"
                      letterSpacing="0.4"
                      fill="#D9A39B"
                      opacity={isActive ? 1 : 0.65}
                      style={{ textTransform: "uppercase", transition: "opacity .3s" }}
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
