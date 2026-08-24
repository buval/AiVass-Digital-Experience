import { useState, useMemo, useRef } from "react";
import { Link } from "wouter";
import { useSeoMeta } from "../lib/seo";

// ── DATA ──────────────────────────────────────────────────────────────────────

const SPHERES = [
  { key: "family", label: "Private life & family", short: "Family", hint: "Closeness with the people you call yours. Not how often you speak — how known you feel.", low: "Give one person a fixed slot — same day, same time, every week. Unscheduled love does not survive time zones." },
  { key: "work", label: "Work, career & business", short: "Work", hint: "Would you choose this work again today, knowing what you now know?", low: "Name the one part you are genuinely curious about and move an hour toward it. Curiosity is what keeps work from becoming a job." },
  { key: "money", label: "Money & income", short: "Money", hint: "Stability, not ambition. Can you breathe?", low: "Write down your real monthly floor. Anxiety shrinks the moment it has a figure attached to it." },
  { key: "learning", label: "Education & learning", short: "Learning", hint: "Still growing, or performing what you already know how to do?", low: "One skill, two hours a week, one month. Growth compounds; motivation does not." },
  { key: "social", label: "Relationships & connection", short: "People", hint: "Being known — which is not the same as being busy with people.", low: "Go where your values already gather — a class, a conference, a community for the thing you actually care about." },
  { key: "health", label: "Health, body & wellness", short: "Body", hint: "Sleep, movement, food, how you feel inside your own skin.", low: "Sleep first, then movement. Every other sphere is being scored by a body, and a tired one scores everything low." },
  { key: "self", label: "Self-esteem & self-growth", short: "Self", hint: "How you speak to yourself when no one is listening.", low: "Write three things you did well this month. People building abroad measure themselves against the finish line, never the distance covered." },
  { key: "play", label: "Rest, hobby & play", short: "Play", hint: "What you do purely because you like it.", low: "Book one thing this week with no outcome attached. Rest is not the reward for finishing — it is part of the machine." }
] as const;

const RINGS = [
  { key: "kin", label: "Ring 1 · Kin", short: "Kin", hint: "Unconditional love. Presence you can reach.", low: "Stop treating a video call as the same thing, and build a second anchor where you live: a chosen-family person nearby, or an animal at home who needs you daily. Presence has to come from somewhere." },
  { key: "chosen", label: "Ring 2 · Chosen", short: "Chosen", hint: "Friends and mentors who share your values.", low: "Stop counting friends and start filtering for values. Two people who want a similar life beat twenty pleasant acquaintances." },
  { key: "craft", label: "Ring 3 · Craft", short: "Craft", hint: "Work, colleagues, collaborators.", low: "Find one collaborator, not one job. A single person building something adjacent to yours changes the texture of the entire week." },
  { key: "ground", label: "Ring 4 · Ground", short: "Ground", hint: "Place, routine, home, community.", low: "Put one repeating place into your week — the same gym, café, class, congregation. Belonging is mostly repetition in one location." }
] as const;

const LAYERS = [
  { tag: "Core", title: "You", desc: "Body and inner life: sleep, movement, food, silence, and a working knowledge of what you actually want. Every outer ring is anchored here." },
  { tag: "Ring 1", title: "Kin", desc: "The people who love you without conditions — family by blood or by choice. What only this ring provides: physical presence. A video call carries the love. It does not carry the weight." },
  { tag: "Ring 2", title: "Chosen", desc: "Friends and mentors who run on the same values you do. What this ring provides: being known. The friendships that last are almost always the ones aimed at a similar kind of life." },
  { tag: "Ring 3", title: "Craft", desc: "Work, colleagues, collaborators. What this ring provides: contribution and momentum. It only holds if the work is something you are genuinely curious about." },
  { tag: "Ring 4", title: "Ground", desc: "Place, routine, home, culture, community, an animal who needs you daily. What this ring provides: belonging to a location." }
];

type SupportState = {
  family: number; work: number; money: number; learning: number;
  social: number; health: number; self: number; play: number;
  core: number; kin: number; chosen: number; craft: number; ground: number;
};

const INITIAL_STATE: SupportState = {
  family: 5, work: 5, money: 5, learning: 5, social: 5, health: 5, self: 5, play: 5,
  core: 5, kin: 5, chosen: 5, craft: 5, ground: 5
};

// ── SVG GEOMETRY ──────────────────────────────────────────────────────────────
const CX = 400; const CY = 400; const R0 = 86; const R1 = 236; 
const BANDS = 10; const BGAP = 3; 
const BAND = (R1 - R0 - (BANDS - 1) * BGAP) / BANDS;
const RING_R = { kin: 254, chosen: 274, craft: 294, ground: 314 };
const LABEL_R = 342;

function pt(r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}

function cellPath(r0: number, r1: number, a0: number, a1: number) {
  const [p1x, p1y] = pt(r1, a0);
  const [p2x, p2y] = pt(r1, a1);
  const [p3x, p3y] = pt(r0, a1);
  const [p4x, p4y] = pt(r0, a0);
  return `M${p1x.toFixed(2)},${p1y.toFixed(2)}A${r1},${r1} 0 0 1 ${p2x.toFixed(2)},${p2y.toFixed(2)}L${p3x.toFixed(2)},${p3y.toFixed(2)}A${r0},${r0} 0 0 0 ${p4x.toFixed(2)},${p4y.toFixed(2)}Z`;
}

// ── COMPONENTS ────────────────────────────────────────────────────────────────
const SliderStyles = () => (
  <style>{`
    .worksheet-slider {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 20px;
      margin: 8px 0 0;
      background: transparent;
      cursor: pointer;
    }
    .worksheet-slider::-webkit-slider-runnable-track {
      height: 2px;
      background: linear-gradient(90deg, #7E3033 var(--pct, 50%), rgba(18,35,63,0.16) var(--pct, 50%));
    }
    .worksheet-slider::-moz-range-track {
      height: 2px;
      background: rgba(18,35,63,0.16);
    }
    .worksheet-slider::-moz-range-progress {
      height: 2px;
      background: #7E3033;
    }
    .worksheet-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background: #7E3033;
      border: 2px solid #F7F3E9;
      margin-top: -5.5px;
      box-shadow: 0 0 0 1px #7E3033;
    }
    .worksheet-slider::-moz-range-thumb {
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background: #7E3033;
      border: 2px solid #F7F3E9;
      box-shadow: 0 0 0 1px #7E3033;
    }
    .worksheet-slider:focus-visible {
      outline: 2px solid #12233F;
      outline-offset: 4px;
    }
    
    @media (prefers-reduced-motion: reduce) {
      .motion-safe-transition {
        transition: none !important;
      }
    }
    .motion-safe-transition {
      transition: all 0.25s ease;
    }
  `}</style>
);

const Slider = ({ label, hint, value, onChange, id }: any) => {
  return (
    <div className="py-[13px] border-t border-navy/15 last:border-b last:border-b-navy/15">
      <div className="flex justify-between items-baseline gap-[14px]">
        <label htmlFor={id} className="text-[15px] font-medium cursor-pointer">
          {label}
          <span className="block text-[12.5px] text-grey font-normal mt-[2px] leading-[1.45]">{hint}</span>
        </label>
        <span className="font-serif text-[24px] text-oxblood min-w-[26px] text-right tabular-nums">{value}</span>
      </div>
      <input
        type="range"
        id={id}
        min="0" max="10" step="1"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="worksheet-slider"
        style={{ "--pct": `${value * 10}%` } as React.CSSProperties}
        aria-label={label}
      />
    </div>
  );
};


// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function MandalaOfSupport() {
  useSeoMeta({
    title: "The Mandala of Support",
    description:
      "A free, private AiVass self-reflection worksheet to map the support system no one helps you build.",
    canonical: "https://aivass.com/insights/mandala-of-support",
    ogImage:
      "https://aivass.com/images/field-notes-01-support-system-1200x627.png",
    ogType: "website",
  });

  const [state, setState] = useState<SupportState>(INITIAL_STATE);
  const [copyText, setCopyText] = useState("Copy your reading");
  const svgRef = useRef<SVGSVGElement>(null);

  const stats = useMemo(() => {
    const vals = SPHERES.map(s => state[s.key as keyof SupportState]);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    const sd = Math.sqrt(vals.reduce((a, b) => a + (b - avg) * (b - avg), 0) / vals.length);
    return {
      full: Math.round(avg * 10),
      round: Math.max(0, Math.round(100 - sd * 22))
    };
  }, [state]);

  const sortedSpheres = [...SPHERES].sort((a, b) => (state[a.key as keyof SupportState] as number) - (state[b.key as keyof SupportState] as number));
  const weak = sortedSpheres.slice(0, 2);
  const strong = sortedSpheres[sortedSpheres.length - 1];

  let verdict = <></>;
  if (stats.full >= 70 && stats.round >= 70) {
    verdict = <>Round and full. The work now is <b className="font-normal italic text-oxblood">maintenance, not repair</b> — protect what is holding before you add anything new.</>;
  } else if (stats.full >= 70) {
    verdict = <>Full but lopsided. <b className="font-normal italic text-oxblood">{strong.short.toLowerCase()}</b> is carrying more than its share, and the thin spheres will eventually send the bill.</>;
  } else if (stats.round >= 70) {
    verdict = <>Evenly thin. Nothing is broken — <b className="font-normal italic text-oxblood">everything is running low</b>. Start at the core; the rest lifts with it.</>;
  } else {
    verdict = <>Uneven and stretched. Do not fix eight things. <b className="font-normal italic text-oxblood">Fix {weak[0].short.toLowerCase()} first</b> and let it pull its neighbours up.</>;
  }

  const ringVals = RINGS.map(r => ({ r, v: state[r.key as keyof SupportState] as number }));
  const thinRing = [...ringVals].sort((a, b) => a.v - b.v)[0];

  let pattern = "";
  if (state.kin <= 4 && state.ground <= 4 && state.craft >= 7) {
    pattern = "The migration pattern: kin and ground are thin, and craft is carrying both. Work can hold a great deal of weight. It cannot hug you. Build one more anchor before work becomes the only thing standing.";
  } else if (state.core <= 3) {
    pattern = "Your core is the thinnest part of the structure. Start there and nowhere else — the outer rings will not hold on a body running on empty.";
  } else {
    pattern = `Thinnest layer: ${thinRing.r.short.toLowerCase()}. ${thinRing.r.low}`;
  }

  const downloadWheel = () => {
    if (!svgRef.current) return;
    const svg = svgRef.current.cloneNode(true) as SVGSVGElement;
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    
    const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bg.setAttribute("x", "0");
    bg.setAttribute("y", "0");
    bg.setAttribute("width", "800");
    bg.setAttribute("height", "800");
    bg.setAttribute("fill", "#12233F");
    svg.insertBefore(bg, svg.firstChild);
    
    const data = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = 1600; c.height = 1600;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#12233F";
      ctx.fillRect(0, 0, 1600, 1600);
      ctx.drawImage(img, 0, 0, 1600, 1600);
      const a = document.createElement("a");
      a.download = "my-support-system.png";
      a.href = c.toDataURL("image/png");
      a.click();
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(data);
  };

  const copyReading = () => {
    const lines = [
      `My support system — ${new Date().toLocaleDateString()}`,
      "",
      `Fullness ${stats.full}/100 · Roundness ${stats.round}/100`,
      "",
      "Spheres:"
    ];
    SPHERES.forEach(s => {
      lines.push(`  ${s.short} ${state[s.key as keyof SupportState]}/10`);
    });
    lines.push("", "Rings:", `  Core ${state.core}/10`);
    RINGS.forEach(r => {
      lines.push(`  ${r.short} ${state[r.key as keyof SupportState]}/10`);
    });
    lines.push(
      "", 
      document.getElementById("verdict-text")?.textContent || "", 
      "", 
      pattern
    );
    
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopyText("Copied");
      setTimeout(() => setCopyText("Copy your reading"), 1800);
    }).catch(() => {
      setCopyText("Copy blocked");
      setTimeout(() => setCopyText("Copy your reading"), 2600);
    });
  };

  return (
    <main className="min-h-screen bg-cream text-navy font-sans antialiased">
      <SliderStyles />
      
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <header className="pt-[88px] pb-[40px] max-md:pt-[56px] max-md:pb-[28px]">
        <div className="max-w-[1160px] mx-auto px-6">
          <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-oxblood mb-5">
            AiVass Field Notes · No. 01
          </p>
          <h1 className="font-serif text-[clamp(42px,7vw,76px)] leading-[1.02] tracking-[-0.005em] mb-0">
            The Support System.
          </h1>
          <div className="my-[22px] mb-[26px]">
            <svg width="22" height="22" viewBox="-11 -11 22 22">
              <path d="M0,-11 C 1.1,-3.3 3.3,-1.1 11,0 C 3.3,1.1 1.1,3.3 0,11 C -1.1,3.3 -3.3,1.1 -11,0 C -3.3,-1.1 -1.1,-3.3 0,-11 Z" fill="#7E3033"/>
            </svg>
          </div>
          <p className="font-serif text-[clamp(19px,2.2vw,24px)] leading-[1.4] text-navy-mid max-w-[56ch]">
            A move does not shrink a life evenly. Two rings get cut first — the people who
            love you, and the place that knows you — and work quietly takes the weight of both.
            This maps what you are actually standing on.
          </p>
        </div>
      </header>
      
      <div className="max-w-[1160px] mx-auto px-6">
        <hr className="border-0 border-t border-oxblood/30 m-0" />
      </div>
      
      {/* ── SECTION 01: THE INSTRUMENT ─────────────────────────────────────── */}
      <section className="py-[60px] max-md:py-[40px]">
        <div className="max-w-[1160px] mx-auto px-6">
          <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-oxblood mb-5">01 / The instrument</p>
          <h2 className="font-serif text-[clamp(28px,3.6vw,44px)] leading-[1.1] mb-4">Draw your wheel.</h2>
          <p className="text-[14px] text-grey leading-[1.55] mb-10 max-w-[60ch]">
            Score each one as it is today — not as you intend it to be by December. 
            If you hesitate between two numbers, take the lower one.
            Eight petals for how the life is going. Four rings for who is holding it.
          </p>

          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-[56px] items-start max-md:grid-cols-1 max-md:gap-[36px]">
            <div className="sticky top-6 max-md:static">
              <div className="bg-navy rounded-[4px] px-[26px] pt-[26px] pb-[20px]">
                
                <svg ref={svgRef} className="w-full h-auto block" viewBox="0 0 800 800" role="img" aria-labelledby="wheel-title">
                  <title id="wheel-title">Your support system wheel</title>
                  {/* rings */}
                  <g id="rings">
                    {RINGS.map((ring) => {
                      const v = state[ring.key as keyof SupportState];
                      const r = RING_R[ring.key as keyof typeof RING_R];
                      const circ = 2 * Math.PI * r;
                      const seg = circ / 72;
                      const on = seg * (0.10 + 0.90 * (v / 10));
                      return (
                        <circle
                          key={ring.key}
                          cx={CX} cy={CY} r={r}
                          fill="none"
                          stroke="#D9A39B"
                          className="motion-safe-transition"
                          strokeOpacity={(0.28 + 0.052 * v).toFixed(2)}
                          strokeWidth={v >= 9 ? 1.3 : 1}
                          strokeDasharray={v >= 10 ? "none" : `${on.toFixed(2)} ${(seg - on).toFixed(2)}`}
                          strokeLinecap="butt"
                        />
                      );
                    })}
                  </g>
                  
                  {/* petals */}
                  <g id="petals">
                    {SPHERES.map((s, i) => {
                      const v = state[s.key as keyof SupportState];
                      const a0 = i * 45 + 2.4;
                      const a1 = i * 45 + 42.6;
                      return (
                        <g key={`petal-${s.key}`}>
                          {Array.from({ length: BANDS }).map((_, k) => {
                            const r0 = R0 + k * (BAND + BGAP);
                            const lit = k < v;
                            return (
                              <path
                                key={k}
                                d={cellPath(r0, r0 + BAND, a0, a1)}
                                className="motion-safe-transition"
                                fill={lit ? "#D9A39B" : "none"}
                                fillOpacity={lit ? 1 : 0}
                                stroke={lit ? "none" : "#F7F3E9"}
                                strokeOpacity={lit ? 0 : 0.16}
                                strokeWidth={0.9}
                              />
                            );
                          })}
                        </g>
                      );
                    })}
                  </g>
                  
                  {/* labels */}
                  <g id="labels">
                    {SPHERES.map((s, i) => {
                      const v = state[s.key as keyof SupportState];
                      const mid = i * 45 + 22.5;
                      const [t1x, t1y] = pt(R1 + 8, mid);
                      const [t2x, t2y] = pt(R1 + 16, mid);
                      const [lx, ly] = pt(LABEL_R, mid);
                      const anchor = (mid > 5 && mid < 175) ? "start" : ((mid > 185 && mid < 355) ? "end" : "middle");

                      return (
                        <g key={`label-${s.key}`}>
                          <line
                            x1={t1x.toFixed(2)} y1={t1y.toFixed(2)}
                            x2={t2x.toFixed(2)} y2={t2y.toFixed(2)}
                            stroke="#D9A39B" strokeOpacity="0.5" strokeWidth="1"
                          />
                          <text
                            x={lx.toFixed(2)}
                            y={ly.toFixed(2)}
                            textAnchor={anchor}
                            dominantBaseline="middle"
                            fill="#F7F3E9"
                            className="font-sans font-semibold motion-safe-transition"
                            style={{ fontSize: '15px', letterSpacing: '1.6px', fillOpacity: '0.88' }}
                          >
                            {`${s.short.toUpperCase()}  ${v}`}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                  
                  {/* core */}
                  <g id="core">
                    <circle
                      cx={CX} cy={CY}
                      r={(20 + state.core * 4.6).toFixed(1)}
                      fill="#D9A39B"
                      className="motion-safe-transition"
                    />
                  </g>
                </svg>

                <div className="flex justify-between items-baseline mt-[14px] pt-[14px] border-t border-ox-light/25">
                  <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-ox-light">AiVass · The Support System</span>
                  <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-ox-light">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5 mt-5">
                <div className="border-t border-navy/15 pt-3">
                  <div className="font-serif text-[38px] leading-none text-navy">{stats.full}</div>
                  <div className="text-[10px] font-semibold tracking-[0.16em] uppercase text-oxblood mt-[6px]">Fullness</div>
                </div>
                <div className="border-t border-navy/15 pt-3">
                  <div className="font-serif text-[38px] leading-none text-navy">{stats.round}</div>
                  <div className="text-[10px] font-semibold tracking-[0.16em] uppercase text-oxblood mt-[6px]">Roundness</div>
                </div>
              </div>
            </div>
            
            <div>
              <fieldset className="border-0 p-0 m-0 mb-10 min-w-0">
                <legend className="p-0 font-serif text-[clamp(20px,2.2vw,26px)] leading-[1.2] m-0">Eight spheres</legend>
                <p className="text-[14px] text-grey my-1 mb-5 max-w-[46ch]">How the life itself is going. 0 is empty, 10 is full.</p>
                <div>
                  {SPHERES.map(s => (
                    <Slider 
                      key={s.key} 
                      label={s.label} 
                      hint={s.hint} 
                      value={state[s.key as keyof SupportState]} 
                      onChange={(v: number) => setState(prev => ({...prev, [s.key]: v}))} 
                      id={`sl-${s.key}`} 
                    />
                  ))}
                </div>
              </fieldset>
              
              <fieldset className="border-0 p-0 m-0 mb-10 min-w-0">
                <legend className="p-0 font-serif text-[clamp(20px,2.2vw,26px)] leading-[1.2] m-0">Four rings</legend>
                <p className="text-[14px] text-grey my-1 mb-5 max-w-[46ch]">Not how much you love them — how much weight the layer can carry this month, where you live now.</p>
                <div>
                  <Slider 
                    label="Core · You" 
                    hint="Energy, clarity, contact with what you want." 
                    value={state.core} 
                    onChange={(v: number) => setState(prev => ({...prev, core: v}))} 
                    id="sl-core" 
                  />
                  {RINGS.map(r => (
                    <Slider 
                      key={r.key} 
                      label={r.label} 
                      hint={r.hint} 
                      value={state[r.key as keyof SupportState]} 
                      onChange={(v: number) => setState(prev => ({...prev, [r.key]: v}))} 
                      id={`sl-${r.key}`} 
                    />
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 02: YOUR READING ───────────────────────────────────────── */}
      <section className="py-[60px] max-md:py-[40px]">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="border-t border-oxblood/30 pt-[36px]">
            <div className="grid grid-cols-[1.1fr_1fr] gap-[52px] max-md:grid-cols-1 max-md:gap-[36px]">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-oxblood mb-5">02 / Your reading</p>
                <p id="verdict-text" className="font-serif text-[clamp(23px,2.8vw,32px)] leading-[1.28] mb-[18px]">
                  {verdict}
                </p>
                <div className="bg-paper border border-navy/15 rounded-[4px] p-5 px-[22px]">
                  <p className="text-[14px] text-grey leading-[1.55] m-0">{pattern}</p>
                </div>
                <div className="flex gap-3 flex-wrap mt-[28px]">
                  <button onClick={downloadWheel} className="font-sans text-[11.5px] font-semibold tracking-[0.14em] uppercase py-[14px] px-[24px] rounded-[4px] cursor-pointer transition-colors bg-oxblood text-paper border border-oxblood hover:bg-[#6a2629] focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy focus-visible:outline-offset-3">
                    Download your wheel
                  </button>
                  <button onClick={copyReading} className="font-sans text-[11.5px] font-semibold tracking-[0.14em] uppercase py-[14px] px-[24px] rounded-[4px] cursor-pointer transition-colors bg-transparent text-navy border border-navy/15 hover:border-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy focus-visible:outline-offset-3">
                    {copyText}
                  </button>
                  <button onClick={() => setState(INITIAL_STATE)} className="font-sans text-[11.5px] font-semibold tracking-[0.14em] uppercase py-[14px] px-[24px] rounded-[4px] cursor-pointer transition-colors bg-transparent text-navy border border-navy/15 hover:border-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy focus-visible:outline-offset-3">
                    Start over
                  </button>
                </div>
              </div>
              
              <div>
                <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-oxblood mb-5">
                  Do these three. Nothing else.
                </p>
                {weak.concat([{ short: thinRing.r.short, key: thinRing.r.key, low: thinRing.r.low } as any]).map((w, idx) => (
                  <div key={idx} className="py-4 border-t border-navy/15">
                    <div className="text-[10px] font-semibold tracking-[0.16em] uppercase text-oxblood">
                      {w.short} · {state[w.key as keyof SupportState]}/10
                    </div>
                    <p className="mt-[6px] mb-0 text-[14.5px] text-grey leading-[1.55]">
                      {w.low}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 03: THE MODEL ──────────────────────────────────────────── */}
      <section className="py-[60px] max-md:py-[40px]">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-[56px] items-start max-md:grid-cols-1 max-md:gap-[36px]">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-oxblood mb-5">03 / The model</p>
              <h2 className="font-serif text-[clamp(28px,3.6vw,44px)] leading-[1.1] mb-4">Five rings.</h2>
              <p className="text-[14px] text-grey leading-[1.55] mb-4">
                Support is not one thing you either have or don't. It is five layers,
                each carrying a weight the others cannot. When one goes thin, another compensates —
                quietly, and for longer than it should.
              </p>
              <div className="border-l-2 border-oxblood pl-[22px] py-[2px] mt-[30px] font-serif text-[21px] leading-[1.35] text-navy">
                Most people abroad do not lack support. They have four rings doing the work of five.
              </div>
            </div>
            <div>
              {LAYERS.map((layer) => (
                <div key={layer.tag} className="grid grid-cols-[76px_1fr] gap-5 py-[18px] border-t border-navy/15 last:border-b last:border-b-navy/15">
                  <div className="text-[10.5px] font-semibold tracking-[0.15em] uppercase text-oxblood pt-1">{layer.tag}</div>
                  <div>
                    <h3 className="font-sans text-[15px] font-semibold mb-1 leading-snug">{layer.title}</h3>
                    <p className="m-0 text-[14.5px] text-grey leading-[1.55]">{layer.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="bg-navy text-cream pt-[56px] pb-[64px] mt-[40px]">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="font-serif text-[30px]">AiVass</div>
          <div className="text-[10px] font-semibold tracking-[0.2em] uppercase text-ox-light mt-2">
            Building Extraordinary Futures
          </div>
          <p className="mt-[26px] text-cream/75 text-[13.5px] leading-[1.55] max-w-[62ch]">
            A boutique studio for transformation — strategy, intelligent systems
            and evidence that keep the human at the centre. <a href="https://aivass.com" className="text-ox-light no-underline hover:underline">aivass.com</a>
          </p>
          <p className="mt-[14px] text-cream/75 text-[13.5px] leading-[1.55]">
            This is a reflection tool, not a clinical assessment. Nothing here is
            medical, psychological, legal or immigration advice. If what you are carrying feels heavier than
            a worksheet can hold, speak to a qualified professional — that is a strong move, not a weak one.
          </p>
          <p className="mt-[26px] text-cream/75 text-[13.5px] leading-[1.55]">
            <Link
              href="/insights/articles/support-system-every-immigrant-needs"
              className="text-ox-light no-underline hover:underline"
            >
              Read the Field Note: The Support System No One Helps You Build
            </Link>
          </p>
          <p className="mt-[14px] text-cream/75 text-[13.5px] leading-[1.55]">
            <Link href="/insights" className="text-ox-light no-underline hover:underline">
              ← Return to Insights
            </Link>
          </p>
        </div>
      </footer>
    </main>
  );
}