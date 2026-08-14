import { useState } from "react";

/**
 * Interactive diagram components for "Mastering Your Field of Endeavor".
 * All diagrams are rebuilt from the source article's ASCII art / missing
 * images as accessible, keyboard-operable, on-brand React components.
 */

/* ────────────────────────────────────────────────────────────────
 * The Coherence Pyramid — Past → Present → Future
 * ──────────────────────────────────────────────────────────────── */
const PYRAMID_LAYERS = [
  {
    key: "future",
    label: "Future",
    width: "w-[62%]",
    summary: "Where you're going in the U.S.",
    detail:
      "Concrete plans — a role, a venture, a research agenda — that extend your established expertise onto American soil. USCIS asks: will this person keep contributing in this field?",
  },
  {
    key: "present",
    label: "Present",
    width: "w-[80%]",
    summary: "Current expertise & recognition",
    detail:
      "What you're known for right now: awards, media coverage, invitations, major projects. The proof that you have risen to the top of your specific field.",
  },
  {
    key: "past",
    label: "Past",
    width: "w-full",
    summary: "Foundation of achievements",
    detail:
      "The base of the pyramid: early achievements, publications, competition wins, and the first recognition that set your trajectory. Everything above rests on this.",
  },
] as const;

export function CoherencePyramid() {
  const [active, setActive] = useState<string>("past");
  const layer = PYRAMID_LAYERS.find((l) => l.key === active)!;

  return (
    <figure className="my-10 bg-paper border border-navy/15 p-6 md:p-10">
      <figcaption className="text-[10px] tracking-[0.18em] uppercase text-oxblood mb-6">
        The Coherence Pyramid — tap a layer
      </figcaption>
      <div className="flex flex-col items-center gap-[6px]" role="group" aria-label="Coherence Pyramid layers">
        {PYRAMID_LAYERS.map((l, i) => (
          <button
            key={l.key}
            aria-pressed={active === l.key}
            aria-expanded={active === l.key}
            aria-controls="pyramid-detail"
            onClick={() => setActive(l.key)}
            onMouseEnter={() => setActive(l.key)}
            className={`${l.width} px-4 py-4 md:py-5 text-center transition-all duration-300 border focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood ${
              active === l.key
                ? "bg-navy text-cream border-navy"
                : "bg-cream text-navy border-navy/25 hover:border-navy/60"
            }`}
          >
            <span className="block text-[10px] tracking-[0.2em] uppercase mb-1 opacity-70">
              {i === 0 ? "▲ " : ""}{l.label}
            </span>
            <span className="block font-serif text-[15px] md:text-[17px] leading-snug">{l.summary}</span>
          </button>
        ))}
      </div>
      <div id="pyramid-detail" className="mt-6 min-h-[72px] border-t border-navy/10 pt-5" aria-live="polite">
        <p className="text-[13px] md:text-[14px] text-navy-mid leading-[1.7]">
          <span className="text-[10px] tracking-[0.15em] uppercase text-oxblood mr-3">{layer.label}</span>
          {layer.detail}
        </p>
      </div>
      <p className="mt-5 text-[12px] text-navy font-medium border-l-2 border-oxblood pl-4">
        The Golden Rule: all three levels must align within the same field of endeavor.
      </p>
    </figure>
  );
}

/* ────────────────────────────────────────────────────────────────
 * The Broad-to-Narrow Funnel
 * ──────────────────────────────────────────────────────────────── */
const FUNNEL_LEVELS = [
  {
    label: "Sector",
    verdict: "Too broad",
    tone: "bad",
    width: "w-full",
    example: "\u201CTechnology\u201D — no one is extraordinary at all of technology.",
  },
  {
    label: "Industry",
    verdict: "Still too broad",
    tone: "bad",
    width: "w-[85%]",
    example: "\u201CSoftware\u201D — an entire economy, not a domain of mastery.",
  },
  {
    label: "Specialization",
    verdict: "Getting warmer",
    tone: "warm",
    width: "w-[70%]",
    example: "\u201CMachine learning\u201D — closer, but still a crowd of millions.",
  },
  {
    label: "Field of Endeavor",
    verdict: "Just right",
    tone: "good",
    width: "w-[55%]",
    example: "\u201CMachine learning infrastructure for production AI systems\u201D — specific enough to lead, broad enough to grow.",
  },
  {
    label: "Specific Technique",
    verdict: "Too narrow",
    tone: "bad",
    width: "w-[40%]",
    example: "\u201CImplementing OAuth 2.0 in React apps\u201D — a task, not a field. Not enough peers, evidence, or room to grow.",
  },
] as const;

export function FieldFunnel() {
  const [active, setActive] = useState(3);
  const level = FUNNEL_LEVELS[active];

  return (
    <figure className="my-10 bg-navy p-6 md:p-10">
      <figcaption className="text-[10px] tracking-[0.18em] uppercase text-ox-light mb-6">
        Start broad, then narrow — tap each level
      </figcaption>
      <div className="flex flex-col items-center gap-[5px]">
        {FUNNEL_LEVELS.map((l, i) => (
          <button
            key={l.label}
            onClick={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
            aria-pressed={active === i}
            className={`${l.width} px-3 py-3 text-center border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ox-light ${
              active === i
                ? l.tone === "good"
                  ? "bg-cream text-navy border-cream"
                  : "bg-oxblood/30 text-cream border-ox-light/60"
                : "bg-transparent text-cream/70 border-cream/20 hover:border-cream/50"
            }`}
          >
            <span className="block text-[11px] md:text-[12px] tracking-[0.12em] uppercase">{l.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-6 border-t border-cream/15 pt-5" aria-live="polite">
        <span
          className={`inline-block text-[10px] tracking-[0.18em] uppercase px-3 py-1 mb-3 ${
            level.tone === "good"
              ? "bg-cream text-navy"
              : level.tone === "warm"
                ? "bg-ox-light/20 text-ox-light"
                : "bg-oxblood/40 text-cream"
          }`}
        >
          {level.verdict}
        </span>
        <p className="text-[13px] md:text-[14px] text-cream/80 leading-[1.7]">{level.example}</p>
      </div>
    </figure>
  );
}

/* ────────────────────────────────────────────────────────────────
 * The Three-Circle Test — Venn diagram
 * ──────────────────────────────────────────────────────────────── */
const CIRCLES = [
  {
    key: "expertise",
    label: "Expertise",
    caption: "What you know deeply",
    detail: "The domain you could teach, defend, and advance — not just tools you use.",
    cx: 100, cy: 90,
  },
  {
    key: "recognition",
    label: "Recognition",
    caption: "What you're known for",
    detail: "Awards, citations, press, invitations — the external record of your acclaim.",
    cx: 200, cy: 90,
  },
  {
    key: "future",
    label: "Future Work",
    caption: "What you'll do in the U.S.",
    detail: "The contribution you will keep making — the reason America benefits from your expertise.",
    cx: 150, cy: 172,
  },
] as const;

export function ThreeCircleTest() {
  const [active, setActive] = useState<string | null>(null);
  const activeCircle = CIRCLES.find((c) => c.key === active);

  return (
    <figure className="my-10 bg-paper border border-navy/15 p-6 md:p-10">
      <figcaption className="text-[10px] tracking-[0.18em] uppercase text-oxblood mb-4">
        The Three-Circle Test — tap a circle
      </figcaption>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <svg viewBox="0 0 300 270" className="w-full max-w-[340px] flex-shrink-0" role="group" aria-label="Venn diagram: Expertise, Recognition and Future Work overlap at your field of endeavor">
          {CIRCLES.map((c) => (
            <circle
              key={c.key}
              cx={c.cx}
              cy={c.cy}
              r={70}
              className={`cursor-pointer transition-all duration-300 ${
                active === c.key ? "fill-oxblood/25 stroke-oxblood" : "fill-navy/[0.06] stroke-navy/40"
              }`}
              strokeWidth={1.5}
              tabIndex={0}
              role="button"
              aria-label={`${c.label}: ${c.caption}`}
              onClick={() => setActive(active === c.key ? null : c.key)}
              onMouseEnter={() => setActive(c.key)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActive(active === c.key ? null : c.key);
                }
              }}
            />
          ))}
          <text x={72} y={52} textAnchor="middle" className="fill-navy text-[12px] font-medium pointer-events-none">Expertise</text>
          <text x={228} y={52} textAnchor="middle" className="fill-navy text-[12px] font-medium pointer-events-none">Recognition</text>
          <text x={150} y={256} textAnchor="middle" className="fill-navy text-[12px] font-medium pointer-events-none">Future Work</text>
          {/* Center intersection */}
          <circle cx={150} cy={116} r={5} className="fill-oxblood pointer-events-none" />
          <text x={150} y={136} textAnchor="middle" className="fill-oxblood text-[9px] tracking-[0.08em] uppercase font-medium pointer-events-none">
            Your Field
          </text>
        </svg>
        <div className="flex-1 min-h-[100px]" aria-live="polite">
          {activeCircle ? (
            <>
              <div className="text-[10px] tracking-[0.15em] uppercase text-oxblood mb-2">{activeCircle.label}</div>
              <p className="font-serif text-[17px] text-navy mb-2">{activeCircle.caption}</p>
              <p className="text-[13px] text-navy-mid leading-[1.7]">{activeCircle.detail}</p>
            </>
          ) : (
            <p className="text-[13px] text-navy-mid leading-[1.7]">
              Your field of endeavor sits at the intersection of all three circles. If any circle is
              missing — deep expertise without recognition, or recognition without a future plan — the
              definition collapses under scrutiny.
            </p>
          )}
        </div>
      </div>
    </figure>
  );
}

/* ────────────────────────────────────────────────────────────────
 * Career timeline — step-through
 * ──────────────────────────────────────────────────────────────── */
export interface TimelineStop {
  period: string;
  role: string;
  note?: string;
}

export function CareerTimeline({
  title,
  field,
  takeaway,
  stops,
}: {
  title: string;
  field: string;
  takeaway: string;
  stops: TimelineStop[];
}) {
  const [step, setStep] = useState(0);
  const atEnd = step >= stops.length - 1;

  return (
    <figure className="my-8 border border-navy/15 bg-cream">
      <div className="px-6 md:px-8 pt-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <figcaption className="text-[10px] tracking-[0.18em] uppercase text-grey mb-1">{title}</figcaption>
          <div className="text-[12px] text-oxblood font-medium">Field: {field}</div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            aria-label="Previous step"
            className="w-9 h-9 border border-navy/25 text-navy hover:border-navy disabled:opacity-30 transition-colors"
          >
            ←
          </button>
          <button
            onClick={() => setStep((s) => Math.min(stops.length - 1, s + 1))}
            disabled={atEnd}
            aria-label="Next step"
            className="w-9 h-9 border border-navy/25 text-navy hover:border-navy disabled:opacity-30 transition-colors"
          >
            →
          </button>
        </div>
      </div>

      <div className="px-6 md:px-8 py-6">
        {/* Progress track */}
        <div className="flex items-center mb-6" role="list" aria-label={`${title} career steps`}>
          {stops.map((s, i) => (
            <div key={i} role="listitem" className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => setStep(i)}
                aria-label={`${s.period}: ${s.role}`}
                aria-current={i === step ? "step" : undefined}
                className={`w-[14px] h-[14px] rounded-full border-2 flex-shrink-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood ${
                  i <= step ? "bg-oxblood border-oxblood" : "bg-cream border-navy/30"
                }`}
              />
              {i < stops.length - 1 && (
                <div className={`h-[2px] flex-1 transition-colors duration-300 ${i < step ? "bg-oxblood" : "bg-navy/15"}`} />
              )}
            </div>
          ))}
        </div>

        <div aria-live="polite" className="min-h-[84px]">
          <div className="text-[11px] tracking-[0.12em] uppercase text-grey mb-1">{stops[step].period}</div>
          <p className="font-serif text-[19px] md:text-[22px] text-navy leading-tight mb-2">{stops[step].role}</p>
          {stops[step].note && (
            <p className="text-[13px] text-navy-mid leading-[1.65]">{stops[step].note}</p>
          )}
        </div>

        {atEnd && (
          <p className="mt-4 text-[13px] text-navy leading-[1.65] border-l-2 border-oxblood pl-4">
            {takeaway}
          </p>
        )}
      </div>
    </figure>
  );
}

/* ────────────────────────────────────────────────────────────────
 * Interactive self-assessment checklist with progress
 * ──────────────────────────────────────────────────────────────── */
export function SelfAssessmentChecklist({
  groups,
}: {
  groups: { heading: string; items: string[] }[];
}) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const done = checked.size;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="my-10 border border-navy/15 bg-paper">
      {/* Progress header */}
      <div className="px-6 md:px-8 py-5 border-b border-navy/10 flex items-center gap-5">
        <div className="flex-1">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-[10px] tracking-[0.18em] uppercase text-oxblood">Your readiness</span>
            <span className="text-[12px] text-navy font-medium" aria-live="polite">
              {done} of {total} · {pct}%
            </span>
          </div>
          <div className="h-[6px] bg-navy/10" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Checklist progress">
            <div className="h-full bg-oxblood transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {groups.map((group) => (
        <div key={group.heading} className="px-6 md:px-8 py-5 border-b border-navy/10 last:border-b-0">
          <h4 className="font-serif text-[17px] text-navy mb-3">{group.heading}</h4>
          <div>
            {group.items.map((item) => {
              const id = `${group.heading}::${item}`;
              const isDone = checked.has(id);
              return (
                <label key={id} className="flex items-start gap-4 py-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => toggle(id)}
                    className="sr-only peer"
                  />
                  <span
                    aria-hidden="true"
                    className={`flex-shrink-0 w-[18px] h-[18px] border mt-[2px] flex items-center justify-center transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-oxblood peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-paper ${
                      isDone ? "bg-oxblood border-oxblood text-cream" : "border-navy/30 group-hover:border-navy/60"
                    }`}
                  >
                    {isDone && (
                      <svg viewBox="0 0 10 8" className="w-[10px] h-[8px]" fill="none" stroke="currentColor" strokeWidth={1.8}>
                        <path d="M1 4 L3.5 6.5 L9 1" />
                      </svg>
                    )}
                  </span>
                  <span className={`text-[14px] leading-[1.6] transition-colors ${isDone ? "text-grey line-through decoration-navy/30" : "text-navy-mid"}`}>
                    {item}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {pct === 100 && (
        <div className="px-6 md:px-8 py-5 bg-navy text-cream text-[13px] leading-[1.6]">
          Every box checked — your field of endeavor definition is petition-ready. The next step is
          pressure-testing it with an immigration attorney.
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
 * FAQ accordion
 * ──────────────────────────────────────────────────────────────── */
export function FaqAccordion({
  items,
}: {
  items: { q: string; a: React.ReactNode }[];
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="my-8 border-t border-navy/15">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="border-b border-navy/15">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-start justify-between gap-6 py-5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-oxblood"
            >
              <span className={`font-serif text-[16px] md:text-[18px] leading-snug transition-colors ${isOpen ? "text-oxblood" : "text-navy group-hover:text-oxblood"}`}>
                {item.q}
              </span>
              <span aria-hidden="true" className={`flex-shrink-0 text-[18px] leading-none mt-1 transition-transform duration-300 ${isOpen ? "rotate-45 text-oxblood" : "text-navy/40"}`}>
                +
              </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[600px] pb-6" : "max-h-0"}`}>
              <div className="text-[14px] text-navy-mid leading-[1.75]">{item.a}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
 * Good / Bad statement callout pair
 * ──────────────────────────────────────────────────────────────── */
export function GoodBadPair({
  bad,
  good,
  why,
}: {
  bad: string;
  good: string;
  why: string;
}) {
  return (
    <div className="my-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-navy/10">
        <div className="bg-paper p-5">
          <div className="text-[10px] tracking-[0.15em] uppercase text-grey mb-2">Wrong</div>
          <p className="text-[13px] text-navy-mid leading-[1.7] italic">{bad}</p>
        </div>
        <div className="bg-navy p-5">
          <div className="text-[10px] tracking-[0.15em] uppercase text-ox-light mb-2">Right</div>
          <p className="text-[13px] text-cream/85 leading-[1.7] italic">{good}</p>
        </div>
      </div>
      <p className="mt-3 text-[12px] text-grey leading-[1.6]">
        <span className="text-oxblood font-medium">Why: </span>{why}
      </p>
    </div>
  );
}
