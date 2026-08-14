import { Link } from "wouter";
import { ARTICLES } from "@/data/articles";

/**
 * Full article body — "From Surviving to Thriving"
 * Author: Maria Boukhval | Published: 2026-08-05
 * Migrated from aivass.com/blog/from-surviving-to-thriving (2026-08-10)
 * Source: https://aivass.com/api/posts/from-surviving-to-thriving
 *
 * DO NOT edit substance without owner approval.
 */

// Single source of truth for key takeaways — also consumed by prerender for crawler-visible HTML.
const ARTICLE_DATA = ARTICLES.find((a) => a.slug === "from-surviving-to-thriving")!;

export default function FromSurvivingToThrivingBody() {
  return (
    <div className="max-w-[680px]">
      {/* Opening */}
      <p className="text-[16px] md:text-[17px] text-navy leading-[1.9] mb-5">
        If you want a different life, you don't begin with pressure. You don't begin by forcing new
        habits onto an old self, or by cranking your goals higher and hoping willpower holds long enough
        to matter.
      </p>
      <p className="text-[16px] md:text-[17px] text-navy leading-[1.9] mb-5">
        You begin with a picture. A picture of who you are becoming.
      </p>
      <p className="text-[16px] md:text-[17px] text-navy-mid leading-[1.9] mb-5">
        Because the moment that inner picture changes, everything downstream of it changes too. Your
        decisions change. Your habits change. Your expectations change. And slowly — almost without your
        noticing — the world around you begins to rearrange itself to match the person you've decided to
        be.
      </p>
      <p className="text-[16px] md:text-[17px] text-navy-mid leading-[1.9] mb-10">
        This is the quiet mechanism behind every real transformation. Not louder effort. A truer
        self-image.
      </p>

      {/* Key takeaways — direct-answer block for readers and answer engines.
          Content sourced from ARTICLE_DATA.keyTakeaways (shared with prerender). */}
      <section aria-label="Key takeaways" className="bg-paper border border-navy/15 p-6 md:p-8 my-10">
        <div className="text-[10px] tracking-[0.18em] uppercase text-oxblood mb-4">Key Takeaways</div>
        <p className="text-[14px] md:text-[15px] text-navy leading-[1.75] mb-4">
          <strong>{ARTICLE_DATA.keyTakeaways![0]}</strong>
        </p>
        <ul className="space-y-3">
          {ARTICLE_DATA.keyTakeaways!.slice(1).map((item, i) => (
            <li key={i} className="flex items-start gap-4 text-[14px] md:text-[15px] text-navy-mid leading-[1.65]">
              <span className="flex-shrink-0 w-[5px] h-[5px] rounded-full bg-oxblood mt-[10px]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Section 1 */}
      <h2 className="font-serif text-[28px] md:text-[36px] tracking-[-0.03em] text-navy mb-5 mt-12" id="transformation">
        So what is transformation, really?
      </h2>
      <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-5">
        Most people treat transformation as a logistics problem. A better schedule. A stricter diet. A
        more ambitious plan. They rearrange the surface and wait for their life to follow.
      </p>
      <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-5">
        It rarely does. The new routine grows heavy. The motivation thins out. And within a few weeks
        they've slid back to exactly where they started — not because they lacked discipline, but because
        the person inside never actually changed.
      </p>
      <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-5">
        You've seen this. The friend who reorganizes their entire kitchen for a new diet and is ordering
        takeout again by the third week. The colleague whose pristine new planner is abandoned by
        February. Nothing was wrong with the plan. The plan was simply heavier than the identity asked to
        carry it.
      </p>
      <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-5">
        Here is the distinction that changes everything: transformation is not a change in your behavior.
        It is a change in your identity — the internal picture you hold of who you are. Behavior is what
        you can see. Identity is what's carrying it.
      </p>
      <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-12">
        And your life cannot rise above the identity carrying it. You can push, borrow motivation, and
        force a season of effort — but you will always drift back to the boundaries drawn by how you see
        yourself. That inner boundary has a name.
      </p>

      {/* Section 2 */}
      <h2 className="font-serif text-[28px] md:text-[36px] tracking-[-0.03em] text-navy mb-5 mt-12" id="ceiling">
        Your identity is your ceiling
      </h2>
      <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-5">
        Think of your self-image as a thermostat.
      </p>
      <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-5">
        A thermostat doesn't care how hot the day is or how high you've set your ambitions. It has a
        number it's set to, and it works, quietly and constantly, to return the room to that number. Open
        a window and it compensates. Fight it and it wins by default, because it never gets tired.
      </p>
      <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-5">
        Your identity works the same way. No matter how high you crank your goals, your behavior drifts
        back to the level your self-image is set to. This is why progress so often evaporates the moment
        enthusiasm does. Willpower is a momentary lift. Identity is a lifetime carry.
      </p>
      <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-5">
        Most people spend years polishing the outer structure — new systems, new goals, new plans — while
        the inner foundation stays exactly as it was. They never touch the thermostat. So the room always
        cools back down. If you want a warmer room, you don't battle the air. You reset the setting.
      </p>
      <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-12">
        That setting is written in rules you may never say aloud:{" "}
        <em>I go this far. This is my level. This is what people like me can and cannot do.</em> They
        feel like facts, but they are only sentences — and you don't break them by force. You break them
        by refusing to keep repeating the story that holds them in place.
      </p>

      {/* The Self-Image Sun Diagram */}
      <figure className="my-12 bg-paper border border-navy/10 p-8 md:p-12">
        <div className="text-[10px] tracking-[0.18em] uppercase text-grey mb-6">Figure 1 · The Self-Image Sun</div>

        {/* Diagram */}
        <div className="flex flex-col items-center gap-0 mb-8">
          {/* Top label */}
          <div className="text-center mb-3">
            <div className="inline-block bg-navy/5 border border-navy/15 px-4 py-2 text-[11px] tracking-[0.15em] uppercase text-navy-mid">
              BELIEF<br/><span className="text-grey normal-case tracking-normal text-[10px]">what you think</span>
            </div>
          </div>
          {/* Middle row */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="inline-block bg-navy/5 border border-navy/15 px-4 py-2 text-[11px] tracking-[0.15em] uppercase text-navy-mid">
                EVIDENCE<br/><span className="text-grey normal-case tracking-normal text-[10px]">what you prove</span>
              </div>
            </div>
            {/* Center */}
            <div className="flex-shrink-0 w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-full border-[2px] border-navy flex flex-col items-center justify-center text-center">
              <div className="font-serif text-[14px] md:text-[16px] text-navy font-medium tracking-[-0.03em]">IDENTITY</div>
              <div className="text-[9px] text-grey tracking-[0.1em] uppercase mt-0.5">who you are</div>
            </div>
            <div className="text-center">
              <div className="inline-block bg-navy/5 border border-navy/15 px-4 py-2 text-[11px] tracking-[0.15em] uppercase text-navy-mid">
                BEHAVIOR<br/><span className="text-grey normal-case tracking-normal text-[10px]">what you do</span>
              </div>
            </div>
          </div>
          {/* Bottom arrow */}
          <div className="mt-4 text-[10px] tracking-[0.2em] uppercase text-oxblood">
            TIME &nbsp;·&nbsp; CONSISTENCY
          </div>
        </div>

        <figcaption className="text-[13px] text-navy-mid leading-[1.65] border-t border-navy/10 pt-5">
          Belief, behavior, and evidence orbit a single center. When they align, they don't merely
          support your identity — they become it.
        </figcaption>
      </figure>

      <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-5">
        Small actions, repeated over time, become an identity — and an identity, given enough time and
        consistency, becomes a destiny.
      </p>
      <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-12">
        That's the entire roadmap, and it's quieter than people expect. Destiny isn't handed down by
        fate. Destiny is identity given enough time and consistency. If you want a wider horizon, you
        don't force new actions first. You loosen your grip on the small identity that's held you in
        place, and you step — deliberately, repeatedly — into a larger one.
      </p>

      {/* Section 3 */}
      <h2 className="font-serif text-[28px] md:text-[36px] tracking-[-0.03em] text-navy mb-5 mt-12" id="question">
        The question that moves the gate
      </h2>
      <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-8">
        There is a single question that does most of this work for you. When a choice feels heavy, ask:
      </p>

      {/* Pull quote */}
      <blockquote className="font-serif italic text-[22px] md:text-[27px] text-navy leading-[1.45] border-l-[3px] border-oxblood pl-7 my-10">
        "What would the person I'm becoming do right now?"
        <cite className="block mt-3 text-[10px] not-italic tracking-[0.15em] uppercase text-grey font-sans">
          The anchoring question
        </cite>
      </blockquote>

      <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-5">
        It's a strategist's tool because it bypasses how you feel. It doesn't ask whether you're
        motivated or ready. It goes straight to identity.
      </p>

      <ul className="mb-8 space-y-4">
        {[
          "When the workout feels like too much, a healthy person doesn't debate it — they're becoming someone who honors their body.",
          "When the work is tedious, a professional doesn't wait to feel inspired — they're becoming someone who handles responsibility well.",
          "When the room is intimidating, a capable person doesn't wait for perfect conditions — they move, because moving is simply what they do.",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-4 text-[15px] text-navy-mid leading-[1.7]">
            <span className="flex-shrink-0 w-[5px] h-[5px] rounded-full bg-oxblood mt-[10px]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-12">
        Ask the question often enough and the answer stops being a decision. It becomes a reflex. That
        reflex is your new identity, arriving.
      </p>

      {/* Section 4 */}
      <h2 className="font-serif text-[28px] md:text-[36px] tracking-[-0.03em] text-navy mb-5 mt-12" id="shift">
        The quiet shift
      </h2>
      <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-5">
        Real transformation is a negotiation, not a battle. You don't have to defeat your old self. You
        let it fade — by withdrawing your attention from it and feeding the new identity with evidence,
        day after ordinary day.
      </p>
      <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-5">
        It won't feel like lightning. It will feel like a sunrise: gradual, steady, easy to miss while
        it's happening — until you look up one morning and the entire landscape has changed. That is what
        Building Extraordinary Futures actually means. Not one dramatic leap, but a thousand quiet
        mornings of becoming.
      </p>
      <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-10">
        Your life cannot grow wider than the self-image that leads it. So the only question that truly
        matters is the one you answer with your choices, every single day:
      </p>

      {/* Closing pull quote */}
      <blockquote className="font-serif italic text-[22px] md:text-[27px] text-navy leading-[1.45] border-l-[3px] border-oxblood pl-7 my-10">
        "Who do you believe yourself to be?"
      </blockquote>

      {/* CTA box */}
      <div className="mt-12 bg-navy text-cream p-8 md:p-10">
        <div className="eyebrow text-ox-light mb-4">Your Next Small Action</div>
        <h3 className="font-serif text-[24px] md:text-[30px] leading-[1.2] mb-4">
          Start collecting your evidence.
        </h3>
        <p className="text-[14px] text-cream/80 leading-[1.7] mb-8 max-w-[480px]">
          Identity changes one receipt at a time. Build a simple daily ledger of the small promises you
          keep — the two-minute proof that you're becoming who you say you are. Then watch the loop
          tighten.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/guides" className="btn-fill !bg-cream !text-navy hover:!bg-paper">
            Explore Our Guides
          </Link>
          <Link href="/solutions/individuals" className="btn-outline !border-cream/40 !text-cream hover:!border-cream">
            Learn About AiVass Rise &amp; Shine
          </Link>
        </div>
        <p className="text-[10px] tracking-[0.1em] text-cream/40 mt-6 uppercase">
          A Field Note from AiVass — No. 01
        </p>
      </div>
    </div>
  );
}
