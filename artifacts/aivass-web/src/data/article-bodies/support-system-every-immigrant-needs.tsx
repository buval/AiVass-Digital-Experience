import { Link } from "wouter";
import { ARTICLES } from "@/data/articles";

const ARTICLE_DATA = ARTICLES.find(
  (article) => article.slug === "support-system-every-immigrant-needs",
)!;

const bodyClass = "text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-5";
const headingClass =
  "font-serif text-[28px] md:text-[36px] tracking-[-0.03em] text-navy mb-5 mt-12";

function KeyTakeaways() {
  return (
    <section aria-label="Key takeaways" className="bg-paper border border-navy/15 p-6 md:p-8 my-10">
      <div className="text-[10px] tracking-[0.18em] uppercase text-oxblood mb-4">
        Key Takeaways
      </div>
      <p className="text-[14px] md:text-[15px] text-navy leading-[1.75] mb-4">
        <strong>{ARTICLE_DATA.keyTakeaways![0]}</strong>
      </p>
      <ul className="space-y-3">
        {ARTICLE_DATA.keyTakeaways!.slice(1).map((item) => (
          <li key={item} className="flex items-start gap-4 text-[14px] md:text-[15px] text-navy-mid leading-[1.65]">
            <span className="flex-shrink-0 w-[5px] h-[5px] rounded-full bg-oxblood mt-[10px]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function SupportSystemEveryImmigrantNeedsBody() {
  return (
    <div className="max-w-[680px]">
      <p className="text-[16px] md:text-[17px] text-navy leading-[1.9] mb-5">
        At the{" "}
        <a
          href="https://theopenatlas.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-oxblood underline underline-offset-4 hover:text-navy"
        >
          Open Atlas Summit 2026
        </a>
        , in a room full of conversations about visas, careers, funding and building a future in
        America, two young women asked me a question that had nothing to do with any of it:
      </p>
      <blockquote className="font-serif italic text-[22px] md:text-[27px] text-navy leading-[1.45] border-l-[3px] border-oxblood pl-7 my-9">
        “You have been in the United States for nine years while your family is abroad. How do you
        support yourself?”
      </blockquote>
      <p className={bodyClass}>I gave an answer. I have been thinking about the question ever since.</p>
      <p className={bodyClass}>
        We are thorough about the visible systems. Immigration, employment, healthcare, banking,
        housing, education — we learn the forms, the timelines, the vocabulary. We learn how to
        prove our value to institutions that have never met us. We become genuinely good at it.
      </p>
      <p className={`${bodyClass} mb-10`}>
        Almost no one teaches the invisible system underneath: the one that decides whether you can
        keep going.
      </p>

      <KeyTakeaways />

      <h2 id="independence" className={headingClass}>
        Independence is not the same as support
      </h2>
      <p className={bodyClass}>
        I left home at fifteen for boarding school. I was independent, but I was not alone — a
        boarding school is a support system with a timetable. People around you, a rhythm, a place
        to be, someone who notices if you do not come to dinner.
      </p>
      <p className={bodyClass}>
        Then Switzerland for university, which did not go the way it was supposed to. Partly
        because of planning. Mostly because I had no idea what a support system actually was, so I
        did not notice I had walked out of one.
      </p>
      <p className={bodyClass}>
        Then nine years here. Building a career, building a company, building dreams — often
        physically by myself.
      </p>
      <p className={`${bodyClass} mb-12`}>
        Immigrants become very strong, because we have to. But strength is good at hiding a simple
        fact: we are emotional beings, and we need each other. We need sincerity, reassurance,
        belonging. We need someone who celebrates our good news without competing with it, and who
        sits with us when nothing is resolved. We need one place where we are not performing,
        proving or producing — where we are simply loved.
      </p>

      <h2 id="distance" className={headingClass}>
        What distance actually takes
      </h2>
      <p className={bodyClass}>
        Here is the part I did not understand for years, and the reason that question landed the
        way it did.
      </p>
      <p className={bodyClass}>A move does not shrink a life evenly. It cuts two layers first.</p>
      <p className={bodyClass}>
        It cuts <strong className="text-navy">the people who love you unconditionally</strong> —
        they are on another continent now. And it cuts{" "}
        <strong className="text-navy">the ground under you</strong> — your street, your language,
        your ordinary Tuesday, the shop where they know your face.
      </p>
      <p className={bodyClass}>
        Two layers survive the flight intact: <strong className="text-navy">work</strong>, and
        whatever <strong className="text-navy">friendships</strong> are portable. So those two
        quietly absorb the load. Work expands to fill the space where family used to be, and for a
        while it works remarkably well. Work rewards you, structures your week, gives you people to
        talk to, and tells you that you are doing fine.
      </p>
      <p className={`${bodyClass} mb-12`}>
        Then something ordinary happens — a flu, a rejection, a Sunday afternoon — and the
        structure shows you what it is actually made of. That is not a personal failure. It is
        geometry. And geometry can be rebuilt.
      </p>

      <h2 id="loneliness" className={headingClass}>
        Loneliness is not boredom
      </h2>
      <p className={bodyClass}>
        You can have a full calendar and still be lonely. You can attend the conferences, hit the
        goals, exercise, travel, speak to fifty people in a week, and still feel that nobody is
        close enough to hold the unedited parts of your life.
      </p>
      <p className={bodyClass}>
        The CDC draws a useful line here: social isolation is not having relationships or support
        from others, while loneliness is the feeling of being alone, disconnected, or not close to
        others. The two are related but not the same — which is why a person can be surrounded and
        still lonely. The CDC frames connectedness as the degree to which you have the number,
        quality and variety of relationships that you want. The gap between what you have and what
        you need is where the ache lives.
      </p>
      <p className={bodyClass}>
        It is also more common than the silence around it suggests: roughly one in three U.S.
        adults report feeling lonely, and about one in four report not having social and emotional
        support.
      </p>
      <p className={bodyClass}>
        My family supports me, and that support is real. But it is mostly virtual. A call carries
        love across continents. It does not carry a hug, a shared meal, or someone beside you when
        you are sick.
      </p>
      <p className={bodyClass}>
        In February of this year, I adopted a cat. More than six months later, I am calmer and more
        grounded. I did it because I was lonely, which felt like an embarrassing reason until I said
        it out loud and watched three people nod. Luna did not replace human relationships, and no
        single relationship should be asked to carry everything. But she brought warmth, rhythm and
        living presence into a home that had been very quiet. Animals belong in the emotional
        ecosystem. They just should not be the whole of it.
      </p>
      <p className={`${bodyClass} mb-12`}>
        The real answer is not to find one person, one pet, one job or one city to hold the entire
        weight. It is to build in layers.
      </p>

      <h2 id="layers" className={headingClass}>The layers</h2>
      <div className="space-y-5 mb-12">
        {[
          ["At the center is you.", "Not your résumé, not your immigration status, not the role you perform for other people. You — as a body, a mind, a spirit. That center needs sleep, food, movement, health, financial breathing room, emotional honesty, curiosity, and a physical environment where your nervous system can settle. Everything outward is anchored here."],
          ["Layer one: love and intimate belonging.", "For many people this is family — a partner, parents, children, siblings. For others, especially where the family of origin is unavailable or unsafe, it is chosen family. A beloved animal lives close to this circle too. This layer holds tenderness, touch, home, and the freedom to be unimpressive."],
          ["Layer two: friendship and community.", "The people you can be yourself with — close friends, neighbours, a cultural or spiritual community, a sports team, people held together by shared values. Friendship deepens through repeated presence, honesty and reciprocity. The question is not how many people you know. It is who knows the real you, and who can you reliably show up for in return."],
          ["Layer three: purpose and professional belonging.", "Work takes most of our waking hours, so it inevitably shapes our emotional stability. Colleagues, mentors, professional communities and meaningful projects give structure, recognition and growth. If work is only a job, something else has to carry your aliveness — a creative practice, a sport, a business you are building, cooking, volunteering or travel."],
          ["Layer four: practical infrastructure.", "Housing, healthcare, money, legal stability, transport, and knowing where to turn for professional help. These are not separate from wellbeing. When the foundations feel fragile, every other layer carries the extra weight. Real support is emotional and logistical: a loving person matters, and so does knowing who to call at 11pm."],
        ].map(([title, copy]) => (
          <p key={title} className={bodyClass}>
            <strong className="text-navy">{title}</strong> {copy}
          </p>
        ))}
      </div>

      <h2 id="mandala" className={headingClass}>The Mandala of Support</h2>
      <p className={bodyClass}>
        This is what made me want to redraw the old “Wheel of Life.” Not as a satisfaction score,
        but as a picture of what is actually holding you — a <strong className="text-navy">Mandala
        of Support</strong>, in eight dimensions:
      </p>
      <ol className="space-y-3 mb-8">
        {[
          ["Inner Self", "self-respect, emotional grounding, values, spirituality, contact with yourself"],
          ["Family and Intimate Life", "love, partnership, family, chosen family, home"],
          ["Friendship and Community", "trusted friends, belonging, shared values"],
          ["Health and the Body", "movement, sleep, wellness, touch, restoration"],
          ["Work, Career and Purpose", "meaningful contribution, creativity, growth, impact"],
          ["Money and Stability", "income, savings, housing, legal security, the freedom to choose"],
          ["Learning and Expansion", "curiosity, skill, exploration, personal evolution"],
          ["Joy, Rest and Play", "hobbies, nature, art, travel, pleasure, doing nothing"],
        ].map(([title, copy], index) => (
          <li key={title} className="flex gap-4 text-[15px] text-navy-mid leading-[1.7]">
            <span className="font-serif text-oxblood text-[19px] leading-[1.3]">{index + 1}.</span>
            <span><strong className="text-navy">{title}</strong> — {copy}</span>
          </li>
        ))}
      </ol>
      <p className={bodyClass}>Give each one a number from one to ten. Not as a verdict. As a signal.</p>
      <ul className="space-y-3 mb-10">
        {[
          "What is genuinely supporting me today?",
          "Which area looks successful from the outside and feels empty from the inside?",
          "Who do I call when I am afraid, sick, celebrating, or stuck?",
          "Which part of my life takes energy and returns almost none?",
          "What is one relationship, ritual, resource or decision I could strengthen in the next thirty days?",
        ].map((question) => (
          <li key={question} className="flex items-start gap-4 text-[15px] text-navy-mid leading-[1.7]">
            <span className="flex-shrink-0 w-[5px] h-[5px] rounded-full bg-oxblood mt-[10px]" />
            <span>{question}</span>
          </li>
        ))}
      </ul>
      <p className={`${bodyClass} mb-12`}>
        The goal is not a perfect circle of tens. Life moves in seasons and different areas need
        attention at different times. The goal is to see the whole shape honestly, and respond to it
        with something other than self-criticism.
      </p>

      <h2 id="begin" className={headingClass}>Where to begin when your family is far away</h2>
      <div className="space-y-6 mb-12">
        {[
          ["Name the support you actually need.", "Emotional, physical, practical, professional, spiritual or financial? “I feel lonely” is true. A more precise sentence is actionable."],
          ["Turn long-distance love into dependable ritual.", "A fixed weekly call beats an affectionate intention. Share ordinary moments, not only milestones. Eat together on video sometimes. Send voice notes. Make an emergency plan, and give your family the name of one local person they can contact."],
          ["Build a small local inner circle on purpose.", "You do not need a hundred contacts. You need two or three reciprocal relationships. Trust is built by consistency: checking in, asking for help, offering help, and showing up more than once."],
          ["Choose repeated belonging over endless networking.", "A weekly class, a club, a volunteer team, a congregation, a neighbourhood group. Community rarely comes from one impressive evening. It grows when the same people keep seeing each other."],
          ["Treat work and geography as part of the ecosystem.", "A workplace can restore you or drain you. A city can settle your nervous system or keep it braced. Notice whether the pace, the climate and the people around you actually match the life you are trying to build."],
          ["Let hobbies and animals support you without asking them to carry everything.", "Hiking, tennis, meditation, art, travel, a cat. Real strands in the system. Not substitutes for human closeness."],
          ["Ask for professional support before the breaking point.", "Therapy, peer groups, community organisations and support lines are infrastructure, not evidence of failure."],
        ].map(([title, copy]) => (
          <p key={title} className={bodyClass}>
            <strong className="text-navy">{title}</strong> {copy}
          </p>
        ))}
      </div>

      <section aria-labelledby="resources" className="bg-paper border border-navy/15 p-6 md:p-8 my-12">
        <div className="text-[10px] tracking-[0.18em] uppercase text-oxblood mb-4">A few places to start</div>
        <ul className="space-y-4 text-[14px] text-navy-mid leading-[1.65]">
          {[
            ["Open Atlas", "https://theopenatlas.org/", "a community for high-skilled immigrants building their futures in the United States"],
            ["CDC: Improving Social Connectedness", "https://www.cdc.gov/social-connectedness/improving/index.html", "practical ways to build and strengthen connection"],
            ["U.S. Surgeon General: Recipes for Connection", "https://www.hhs.gov/surgeongeneral/reports-and-publications/recipes/index.html", "a free booklet on gathering people around food"],
            ["Findhelp", "https://www.findhelp.org/", "search free and reduced-cost local services"],
            ["NAMI Support Groups", "https://www.nami.org/support-groups/", "peer and family support, including many virtual groups"],
            ["988 Lifeline", "https://988lifeline.org/", "free, confidential, 24/7 support in the United States for emotional distress"],
          ].map(([label, href, description]) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-oxblood underline underline-offset-4 hover:text-navy">
                {label}
              </a>{" "}
              — {description}
            </li>
          ))}
        </ul>
      </section>

      <h2 id="success" className={headingClass}>Success has to include belonging</h2>
      <p className={bodyClass}>
        For immigrants, success is usually defined by what can be measured. A visa approval. A
        degree. A title. A salary. A company. A house.
      </p>
      <p className={bodyClass}>
        Those things matter. I have chased several of them. But what is the point of building a
        beautiful life if you are not emotionally present inside it?
      </p>
      <p className={bodyClass}>
        Success also means becoming happier. Being here for the present moment. Feeling at home in
        your own body. Having people to share the ordinary parts with.
      </p>
      <p className={bodyClass}>
        Life is a marathon, even when we organise the work into sprints. The sprint gets you to the
        next milestone. Only the vision builds a life you would actually want to live in.
      </p>
      <p className={`${bodyClass} mb-10`}>
        And the vision starts at the center — with your values, your truth, and one question:
      </p>
      <blockquote className="font-serif italic text-[22px] md:text-[27px] text-navy leading-[1.45] border-l-[3px] border-oxblood pl-7 my-10">
        “What kind of life, and what kind of support, allows me to remain fully myself?”
      </blockquote>

      <section className="mt-12 bg-navy text-cream p-8 md:p-10">
        <div className="eyebrow text-ox-light mb-4">A field note you can use</div>
        <h3 className="font-serif text-[24px] md:text-[30px] leading-[1.2] mb-4">
          Draw the shape of your support system.
        </h3>
        <p className="text-[14px] text-cream/80 leading-[1.7] mb-8 max-w-[510px]">
          Score the eight dimensions of your life and the layers around them. The Mandala of Support
          is free, private to your browser, and designed as a gentle signal — not a verdict.
        </p>
        <Link href="/insights/mandala-of-support" className="btn-fill !bg-cream !text-navy hover:!bg-paper">
          Open the interactive mandala
        </Link>
      </section>

      <p className="text-[12px] text-grey leading-[1.7] mt-8">
        This article is a personal reflection and general information, not medical, psychological or
        legal advice. If what you are carrying feels heavier than a worksheet can hold, please speak
        with a qualified professional — that is a strong move, not a weak one.
      </p>
    </div>
  );
}