import { Link } from "wouter";
import {
  CoherencePyramid,
  FieldFunnel,
  ThreeCircleTest,
  CareerTimeline,
  SelfAssessmentChecklist,
  FaqAccordion,
  GoodBadPair,
} from "./field-of-endeavor-interactives";

/**
 * Full article body — "Mastering Your Field of Endeavor: The Story That USCIS Needs to Hear"
 * Author: AiVass Editorial | Reviewed by Maria Boukhval
 * Source: user-supplied manuscript (attached_assets, 2026-08-14). ASCII diagrams and
 * missing images rebuilt as interactive components.
 */

const H2 = "font-serif text-[28px] md:text-[36px] tracking-[-0.03em] text-navy mb-5 mt-14";
const H3 = "font-serif text-[20px] md:text-[24px] text-navy mb-4 mt-10";
const P = "text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-5";

function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mb-6 space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-4 text-[14px] md:text-[15px] text-navy-mid leading-[1.65]">
          <span className="flex-shrink-0 w-[5px] h-[5px] rounded-full bg-oxblood mt-[10px]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function MasteringYourFieldOfEndeavorBody() {
  return (
    <div className="max-w-[720px]">
      <p className={P}>
        If you're pursuing an EB-1A green card (the "extraordinary ability" category), you've likely
        encountered the phrase <em>"field of endeavor"</em> dozens of times. It appears in USCIS
        guidance, petition letters, and RFE responses — and yet it remains one of the most
        misunderstood concepts in immigration law.
      </p>

      {/* Pull quote */}
      <blockquote className="my-10 border-l-2 border-oxblood pl-6 md:pl-8">
        <p className="font-serif italic text-[20px] md:text-[24px] leading-[1.5] text-navy">
          Your field of endeavor is not your job title. It's not your SOC code. It's not even your
          industry. It's the narrative thread that connects your past achievements, current work, and
          future contributions to the United States.
        </p>
      </blockquote>

      <p className={P}>
        This guide breaks down everything you need to know — whether you're a machine learning
        engineer, a classical violinist, a biotech researcher, a product marketer, or a professional
        athlete. By the end, you'll know exactly how to identify, articulate, and defend your field of
        endeavor.
      </p>

      {/* ── PART 1 ── */}
      <h2 className={H2} id="what-is">
        What Is a "Field of Endeavor"?
      </h2>
      <p className={P}>
        <strong className="text-navy">The official definition:</strong> according to USCIS guidance,
        your field of endeavor is the specific area of expertise in which you have demonstrated
        extraordinary ability — the domain where you've achieved sustained national or international
        acclaim.
      </p>
      <p className={P}>
        <strong className="text-navy">The real definition:</strong> your field is the intersection of
        three things —
      </p>
      <Bullets
        items={[
          <><strong className="text-navy">What you're exceptionally good at</strong> (your expertise)</>,
          <><strong className="text-navy">What you've been recognized for</strong> (your achievements)</>,
          <><strong className="text-navy">What you'll continue contributing</strong> (your future impact)</>,
        ]}
      />
      <div className="bg-oxblood/5 border border-oxblood/20 p-6 md:p-8 my-8">
        <div className="text-[10px] tracking-[0.18em] uppercase text-oxblood mb-3">It Is Not</div>
        <p className="text-[14px] text-navy leading-[1.8]">
          Your current job title. Your college major. Your company's industry classification. Or a
          single skill or tool you use.
        </p>
      </div>
      <p className={P}>USCIS uses your field of endeavor to evaluate four things:</p>
      <Bullets
        items={[
          <><strong className="text-navy">Consistency</strong> — do your achievements tell a coherent story?</>,
          <><strong className="text-navy">Extraordinary ability</strong> — have you risen to the top of this specific field?</>,
          <><strong className="text-navy">Future benefit</strong> — will you continue working in this field in the U.S.?</>,
          <><strong className="text-navy">Qualification</strong> — do you meet the criteria within this field?</>,
        ]}
      />

      {/* ── PART 2 ── */}
      <h2 className={H2} id="framework">
        The Field of Endeavor Framework
      </h2>
      <p className={P}>
        Your EB-1A petition should demonstrate a clear progression from foundation to future. Explore
        each layer of the pyramid:
      </p>
      <CoherencePyramid />

      {/* ── PART 3 ── */}
      <h2 className={H2} id="identify">
        How to Identify Your Field
      </h2>
      <h3 className={H3}>Step 1: Start broad, then narrow</h3>
      <p className={P}>
        Most applicants define their field either far too broadly or far too narrowly. Use the funnel
        to find the level that is "just right":
      </p>
      <FieldFunnel />

      <h3 className={H3}>Step 2: The Three-Circle Test</h3>
      <p className={P}>Your field of endeavor should sit at the intersection of three circles:</p>
      <ThreeCircleTest />

      <h3 className={H3}>Step 3: The "one-sentence" test</h3>
      <p className={P}>
        Complete this sentence clearly and specifically:{" "}
        <em className="text-navy">"My field of endeavor is ___________________."</em>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-navy/10 mb-8">
        <div className="bg-navy p-6">
          <div className="text-[10px] tracking-[0.15em] uppercase text-ox-light mb-4">Good Examples</div>
          <ul className="space-y-3">
            {[
              "Computational biology, specifically applying machine learning to protein structure prediction.",
              "Growth marketing for enterprise SaaS products.",
              "Contemporary dance, specializing in choreography that integrates multimedia technology.",
              "Renewable energy systems, with expertise in large-scale solar installations.",
              "AI-driven business transformation and strategic product and program management.",
            ].map((t, i) => (
              <li key={i} className="text-[13px] text-cream/85 leading-[1.6] italic">"{t}"</li>
            ))}
          </ul>
        </div>
        <div className="bg-paper p-6">
          <div className="text-[10px] tracking-[0.15em] uppercase text-grey mb-4">Bad Examples</div>
          <ul className="space-y-3">
            {[
              ["Technology.", "Too broad"],
              ["Being a data scientist at Google.", "Job title, not a field"],
              ["Python programming.", "Tool, not a field"],
              ["Business development in the AI space using Salesforce CRM for Series B startups in the San Francisco Bay Area.", "Too specific and scattered"],
            ].map(([t, why], i) => (
              <li key={i} className="text-[13px] text-navy-mid leading-[1.6]">
                <span className="italic">"{t}"</span>{" "}
                <span className="text-oxblood text-[11px] uppercase tracking-[0.08em]">— {why}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── PART 4 ── */}
      <h2 className={H2} id="career-evolution">
        Career Evolution Within Your Field
      </h2>
      <p className={P}>
        The critical question: <strong className="text-navy">can your job title change?</strong> Yes.
        Your job title can change. Your company can change. Your industry can even shift.
      </p>
      <blockquote className="my-8 border-l-2 border-oxblood pl-6">
        <p className="font-serif italic text-[18px] md:text-[21px] leading-[1.5] text-navy">
          What cannot change: the core expertise and type of contribution you make.
        </p>
      </blockquote>

      {/* Replaces missing "Job Evolution vs. Field Consistency" image */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr className="bg-navy text-cream">
              <th className="text-left p-4 font-sans font-medium text-[10px] tracking-[0.15em] uppercase">Can Evolve</th>
              <th className="text-left p-4 font-sans font-medium text-[10px] tracking-[0.15em] uppercase">Must Stay Consistent</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Job title (Engineer → Architect → CTO)", "The domain of your expertise"],
              ["Employer (startup → enterprise → your own company)", "The type of contribution you make"],
              ["Industry vertical (HR tech → fintech → security)", "The methodology you're recognized for"],
              ["Seniority and scope of responsibility", "The narrative thread connecting each move"],
            ].map(([evolve, consistent], i) => (
              <tr key={i} className="border-b border-navy/10">
                <td className="p-4 align-top text-navy-mid leading-[1.6]">{evolve}</td>
                <td className="p-4 align-top text-navy leading-[1.6] font-medium">{consistent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className={H3}>The career pivot map</h3>
      <p className={P}>
        Some pivots are natural within a field; others require careful explanation. Step through two
        real trajectories:
      </p>
      <CareerTimeline
        title="Natural pivot — biotech scientist"
        field="Drug Discovery for Rare Diseases"
        takeaway="Consistency: deepening expertise and expanding leadership in the same domain. No explanation needed — the field never changed."
        stops={[
          { period: "2018–2020", role: "Lab Researcher", note: "Academia — building the scientific foundation." },
          { period: "2020–2022", role: "Senior Scientist", note: "Biotech startup — applying the research commercially." },
          { period: "2023–2025", role: "Director of R&D", note: "Pharmaceutical company — leading teams in the same domain." },
          { period: "2025+", role: "VP of Research (U.S.)", note: "U.S. biotech firm — the future contribution USCIS wants to see." },
        ]}
      />
      <CareerTimeline
        title="Pivot requiring explanation — engineer to founder"
        field="Distributed Database Systems"
        takeaway={'The narrative: "I\'ve consistently worked on making databases faster and more reliable — first as an individual contributor, then leading teams, now building a company around this expertise."'}
        stops={[
          { period: "2019–2021", role: "Backend Engineer", note: "FAANG company — individual contributor on database infrastructure." },
          { period: "2021–2023", role: "Technical Lead", note: "Series B startup — leading teams on the same class of problems." },
          { period: "2023–2024", role: "CTO & Co-founder", note: "Own startup — job function changed dramatically; the field did not." },
          { period: "2025+", role: "Building an infrastructure company (U.S.)", note: "The challenge: titles changed. The solution: anchor everything to the field." },
        ]}
      />

      {/* ── PART 5 ── */}
      <h2 className={H2} id="examples">
        Real-World Examples Across Industries
      </h2>
      <p className={P}>
        Six professionals, six industries — one pattern: a field specific enough to demonstrate
        expertise, broad enough to survive title changes, and connected to future U.S. work.
      </p>
      <div className="space-y-6 mb-10">
        {[
          {
            label: "Tech & Business · Product Marketing Professional",
            field: "B2B SaaS Product Marketing and Go-to-Market Strategy",
            path: "Marketing Manager (B2B SaaS) → Head of Product Marketing (Series C) → VP of Marketing (enterprise software) → future CMO in the U.S.",
            evidence: "Published PLG articles, conference talks, campaign awards tied to revenue, advisory roles.",
          },
          {
            label: "Tech · Machine Learning Engineer",
            field: "Machine Learning Infrastructure for Production AI Systems",
            path: "ML Engineer (autonomous vehicles) → Senior ML Engineer (big tech) → ML Architect (research lab) → leading ML infrastructure in the U.S.",
            evidence: "Patents on ML optimization, publications on deployment and scalability, open-source contributions, citations.",
          },
          {
            label: "Science · Cancer Researcher",
            field: "Cancer Immunotherapy and Translational Medicine",
            path: "Postdoc (breast cancer immunology) → Assistant Professor (immunotherapy) → Associate Professor → running a translational research lab in the U.S.",
            evidence: "High-impact publications, national grant funding, immunotherapy patents, invited talks.",
          },
          {
            label: "Arts · UI/UX Designer",
            field: "User Experience Design for Financial Technology",
            path: "UI Designer (mobile startup) → Lead Product Designer (fintech) → Design Director (consultancy) → Head of Design in the U.S.",
            evidence: "Design awards (Webby, Red Dot), conference speaking, published case studies, judging competitions.",
          },
          {
            label: "Arts · Classical Musician",
            field: "Classical Violin Performance and Chamber Music",
            path: "Orchestra violinist → soloist and chamber musician → concertmaster → teaching and performing in the U.S.",
            evidence: "Competition wins, reviews in major publications, recordings and streaming numbers, festival invitations.",
          },
          {
            label: "Sports · Athlete to Coach",
            field: "Elite Soccer Training and Youth Development",
            path: "Professional midfielder → player-coach → academy assistant coach → youth development coach in the U.S.",
            evidence: "Playing achievements, coaching certifications, players developed to professional level, media recognition.",
          },
        ].map(({ label, field, path, evidence }, i) => (
          <div key={i} className="border-t border-navy/10 pt-6">
            <div className="text-[10px] tracking-[0.15em] uppercase text-grey mb-3">{label}</div>
            <p className="font-serif text-[17px] md:text-[19px] text-navy mb-2">"{field}"</p>
            <p className="text-[13px] text-navy-mid leading-[1.7] mb-2">{path}</p>
            <div className="flex items-start gap-3">
              <span className="text-[10px] tracking-[0.15em] uppercase text-oxblood mt-0.5 flex-shrink-0">Evidence:</span>
              <span className="text-[13px] text-navy-mid leading-[1.6]">{evidence}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── PART 6 ── */}
      <h2 className={H2} id="soc-codes">
        SOC Codes vs. Reality
      </h2>
      <p className={P}>
        Many applicants worry: <em>"My I-140 petition lists SOC code 15-1252 (Software Developer).
        Does this mean I can't become a CTO?"</em>
      </p>
      <blockquote className="my-8 border-l-2 border-oxblood pl-6">
        <p className="font-serif italic text-[18px] md:text-[21px] leading-[1.5] text-navy">
          SOC codes are administrative tools, not handcuffs.
        </p>
      </blockquote>
      {/* Replaces missing "SOC Code vs. Field of Endeavor" image */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr className="bg-navy text-cream">
              <th className="text-left p-4 font-sans font-medium text-[10px] tracking-[0.15em] uppercase">SOC Codes Do</th>
              <th className="text-left p-4 font-sans font-medium text-[10px] tracking-[0.15em] uppercase">SOC Codes Do Not</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Describe your occupation in standardized terms", "Lock you into a specific job title forever"],
              ["Verify your job exists in the U.S. labor market", "Prevent career advancement"],
              ["Help USCIS process your petition administratively", "Override your actual field of endeavor"],
              ["Classify your current role", "Define the scope of your extraordinary ability"],
            ].map(([does, doesnt], i) => (
              <tr key={i} className="border-b border-navy/10">
                <td className="p-4 align-top text-navy-mid leading-[1.6]">{does}</td>
                <td className="p-4 align-top text-navy-mid leading-[1.6]">{doesnt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-paper border border-navy/15 p-6 md:p-8 my-8">
        <div className="text-[10px] tracking-[0.18em] uppercase text-navy mb-3">The Key Principle</div>
        <p className="text-[14px] text-navy-mid leading-[1.7]">
          Your field of endeavor should be <strong className="text-navy">broader than your SOC code,
          but aligned with it</strong>. The SOC code is your current job classification; the field of
          endeavor is the domain of your expertise — and it can encompass multiple SOC codes as your
          career advances.
        </p>
      </div>

      {/* ── PART 7 ── */}
      <h2 className={H2} id="mistakes">
        Six Common Mistakes to Avoid
      </h2>
      <GoodBadPair
        bad='"My field of endeavor is marketing at Salesforce."'
        good='"My field of endeavor is enterprise software marketing, with specialization in customer retention strategies."'
        why="Your field must be portable across employers."
      />
      <GoodBadPair
        bad='"My field of endeavor is technology."'
        good='"My field of endeavor is cloud infrastructure security."'
        why='You cannot demonstrate extraordinary ability in all of "technology." You need a specific domain where you have risen to the top.'
      />
      <GoodBadPair
        bad='"My field of endeavor is implementing OAuth 2.0 authentication protocols in React applications."'
        good='"My field of endeavor is application security architecture."'
        why="Too narrow means not enough evidence, not enough peers, and not enough room to grow."
      />
      <GoodBadPair
        bad='"My field of endeavor is Tableau and data visualization."'
        good='"My field of endeavor is business intelligence and data analytics."'
        why="Tools change. Fields endure. Tableau might be replaced, but data analytics will remain relevant."
      />
      <GoodBadPair
        bad="Pretending you've always done exactly the same thing."
        good='"While my job title changed from Software Engineer to Product Manager, my field of endeavor has consistently been improving user experience in mobile applications — first through code, now through product strategy."'
        why="Ignoring a career pivot invites an RFE; explaining it demonstrates deepening expertise."
      />
      <GoodBadPair
        bad='"I\u2019m extraordinary in machine learning, classical piano, and real estate investment."'
        good="Pick the one field with the strongest evidence and clearest future path."
        why="USCIS expects sustained acclaim in one field, not scattered achievements across unrelated domains."
      />

      {/* ── PART 8 ── */}
      <h2 className={H2} id="statement">
        Crafting Your Field of Endeavor Statement
      </h2>
      <div className="bg-navy text-cream p-6 md:p-8 my-8">
        <div className="text-[10px] tracking-[0.18em] uppercase text-ox-light mb-3">The Formula</div>
        <p className="font-serif text-[17px] md:text-[20px] leading-[1.6]">
          "My field of endeavor is <span className="text-ox-light">[core domain]</span>, with
          specialization in <span className="text-ox-light">[specific expertise]</span> as applied to{" "}
          <span className="text-ox-light">[context / application]</span>."
        </p>
      </div>
      <Bullets
        items={[
          <><strong className="text-navy">Tech:</strong> "Machine learning engineering, with specialization in natural language processing as applied to healthcare applications."</>,
          <><strong className="text-navy">Business:</strong> "Digital marketing strategy, with specialization in performance marketing as applied to e-commerce brands."</>,
          <><strong className="text-navy">Science:</strong> "Structural biology, with specialization in cryo-electron microscopy as applied to drug discovery."</>,
          <><strong className="text-navy">Arts:</strong> "Documentary filmmaking, with specialization in environmental storytelling as applied to climate change narratives."</>,
          <><strong className="text-navy">Education:</strong> "Educational technology, with specialization in adaptive learning platforms as applied to K-12 mathematics."</>,
        ]}
      />
      <div className="bg-paper border border-navy/15 p-6 my-8">
        <div className="text-[10px] tracking-[0.18em] uppercase text-navy mb-2">The Elevator Test</div>
        <p className="text-[14px] text-navy-mid leading-[1.7]">
          Can you explain your field of endeavor in 30 seconds to an immigration officer, a reporter,
          your grandmother, <em>and</em> a peer in your field? If yes — you've nailed it.
        </p>
      </div>

      {/* ── PART 9 ── */}
      <h2 className={H2} id="timeline">
        Connecting Past, Present, and Future
      </h2>
      <p className={P}>Your petition should tell a clear story across time — a three-act narrative arc:</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-navy/10 mb-8">
        {[
          {
            act: "Act 1 · Foundation",
            era: "Past",
            body: '"Between 2018–2021, I built a foundation in [field] by [key achievements]. This work garnered recognition through [awards, publications, media]."',
          },
          {
            act: "Act 2 · Recognition",
            era: "Present",
            body: '"My expertise deepened from 2021–2025, leading to [major accomplishments]. I became known for [specific contributions], as evidenced by [citations, invitations, high-profile projects]."',
          },
          {
            act: "Act 3 · Future Impact",
            era: "Future",
            body: '"I plan to continue advancing [field] in the United States by [specific plans]. My future work will build directly on my established expertise."',
          },
        ].map(({ act, era, body }) => (
          <div key={era} className="bg-cream p-6">
            <div className="text-[10px] tracking-[0.15em] uppercase text-oxblood mb-1">{act}</div>
            <div className="font-serif text-[18px] text-navy mb-3">{era}</div>
            <p className="text-[13px] text-navy-mid leading-[1.7] italic">{body}</p>
          </div>
        ))}
      </div>
      <h3 className={H3}>Red flags to avoid</h3>
      <Bullets
        items={[
          <><strong className="text-navy">Past and present don't align.</strong> Past = cancer research, present = marketing analytics. Choose one field and emphasize the strongest evidence.</>,
          <><strong className="text-navy">Future work is unrelated to achievements.</strong> Achievements = graphic design, future = starting a restaurant. Explain how skills transfer, or choose a different field.</>,
          <><strong className="text-navy">A gap between present and future.</strong> "I might do consulting" is not a plan. Show concrete plans — a job offer, a research position, or entrepreneurship with clear focus.</>,
        ]}
      />

      {/* ── PART 10 ── */}
      <h2 className={H2} id="petition-letters">
        Best Practices for Petition Letters
      </h2>
      <GoodBadPair
        bad='"The beneficiary is a software engineer working in technology."'
        good='"The beneficiary is a recognized expert in machine learning infrastructure, specifically the optimization of large-scale neural networks for production environments. Her field of endeavor is ML systems engineering."'
        why="The opening frames everything that follows — lead with the field, not the job."
      />
      <p className={P}>
        Then use field-specific language consistently throughout the petition — in the opening
        ("…extraordinary recognition in the field of computational biology…"), when discussing
        criteria ("…within the field of computational biology, her 45 citations place her in the top
        5% of researchers…"), and in every recommendation letter ("…I have followed her work in
        computational biology for five years…").
      </p>

      {/* ── PART 11 ── */}
      <h2 className={H2} id="checklist">
        Self-Assessment Checklist
      </h2>
      <p className={P}>
        Work through this checklist to pressure-test your field of endeavor before filing. Your
        progress is tracked as you go:
      </p>
      <SelfAssessmentChecklist
        groups={[
          {
            heading: "My field definition is…",
            items: [
              "Specific enough to demonstrate extraordinary ability",
              "Broad enough to accommodate career growth",
              "Portable across employers and industries",
            ],
          },
          {
            heading: "My evidence…",
            items: [
              "Awards are recognized in this field",
              "Publications are relevant to this field",
              "Media coverage references this expertise",
              "Letters use consistent field language",
              "All criteria tie back to this field",
              "Critical role evidence is related to this field",
            ],
          },
          {
            heading: "My petition…",
            items: [
              "Opens with a clear field statement",
              "Maintains consistent terminology throughout",
              "Explains SOC code alignment",
              "Ties future plans explicitly to this field",
              "Addresses potential concerns proactively",
              "Contains no contradictory statements about my field",
            ],
          },
        ]}
      />

      {/* ── PART 12 ── */}
      <h2 className={H2} id="faq">
        Frequently Asked Questions
      </h2>
      <FaqAccordion
        items={[
          {
            q: "Can my field of endeavor be interdisciplinary?",
            a: (
              <>
                <p className="mb-3">
                  Yes, but frame it carefully. Choose a primary field that has an established community
                  of practitioners, recognition mechanisms (awards, conferences, publications), and
                  clear criteria for extraordinary ability.
                </p>
                <p>
                  Say "bioinformatics" or "computational biology" — not "I work in both biology and
                  computer science."
                </p>
              </>
            ),
          },
          {
            q: "I changed industries completely. Can I still make this work?",
            a: (
              <>
                <p className="mb-3">
                  Sometimes. Ask yourself: did your core expertise transfer? Can you frame both roles
                  under one broader field? Do you have recognition in the new field?
                </p>
                <p className="mb-3">
                  <strong className="text-navy">Works:</strong> Software Engineer → Product Manager,
                  under "user-centric product development for consumer applications."
                </p>
                <p>
                  <strong className="text-navy">Difficult:</strong> Chemical Engineer → Real Estate
                  Investor — no obvious field connects these.
                </p>
              </>
            ),
          },
          {
            q: "Should I use academic language or everyday language?",
            a: (
              <>
                <p className="mb-3">Use professional language that's accessible but precise.</p>
                <p className="mb-2"><em>Too academic:</em> "The sociotechnical implications of algorithmic bias in machine learning systems deployed at scale."</p>
                <p className="mb-2"><em>Too casual:</em> "I'm really good at making AI not be racist."</p>
                <p><em>Just right:</em> "Ethical AI development, specifically addressing bias in machine learning systems."</p>
              </>
            ),
          },
          {
            q: "USCIS said my field was too broad. What now?",
            a: (
              <>
                <p className="mb-3">
                  In your response: narrow the definition with specific expertise areas, provide
                  context about what the field includes and excludes, show clear boundaries by
                  referencing specific communities, journals, and conferences, and reframe your
                  evidence to emphasize depth in the narrower field.
                </p>
                <p>
                  Before: "My field is marketing." After: "My field is growth marketing for B2B SaaS
                  companies, specifically customer acquisition and retention strategies for enterprise
                  software."
                </p>
              </>
            ),
          },
          {
            q: "I have achievements in two separate fields. Which should I choose?",
            a: (
              <p>
                Choose the field where you have more recent recognition, stronger evidence across
                multiple criteria, clearer future plans in the U.S., and better recommendation
                letters. <strong className="text-navy">One strong field beats two weak fields.</strong>
              </p>
            ),
          },
          {
            q: "Can I work in a different field after my green card is approved?",
            a: (
              <p>
                Technically yes — the green card doesn't restrict your job. However, your I-140
                petition is tied to your stated field and future plans, and changing fields
                immediately after approval could raise questions. It's safest to continue in your
                field for at least 1–2 years post-approval.
              </p>
            ),
          },
          {
            q: "What if my field is very new or emerging?",
            a: (
              <>
                <p className="mb-3">
                  Emerging fields can work if you can demonstrate a community (practitioners,
                  conferences, publications), recognition mechanisms, and precedent. Fields like
                  prompt engineering for large language models, NFT art, short-form video strategy,
                  and CRISPR applications have all worked.
                </p>
                <p>
                  The key: show that it's a <em>field</em> — with practitioners and standards — not
                  just a trend or a tool.
                </p>
              </>
            ),
          },
        ]}
      />

      {/* ── PART 13 ── */}
      <h2 className={H2} id="case-study">
        Case Study: The Product Marketer's Journey
      </h2>
      <p className={P}>
        <strong className="text-navy">The challenge:</strong> Sarah Chen worked in three different
        roles across three different industries — HR tech, fintech, and cybersecurity. At first
        glance: three industries, three titles, seemingly scattered focus. How could she demonstrate
        one coherent field of endeavor?
      </p>
      <CareerTimeline
        title="Case study — Sarah Chen"
        field="B2B SaaS Marketing and Product-Led Growth Strategy"
        takeaway="The result: approved without an RFE. The field of endeavor isn't about what product you sell — it's about what expertise you bring and how you apply it."
        stops={[
          { period: "2018–2020", role: "Product Marketing Manager — HR tech startup", note: "Launched 3 products; grew the user base from 500 to 10,000 companies." },
          { period: "2020–2022", role: "Head of Growth — fintech company", note: "Different industry, different title — but the same customer-acquisition methodology." },
          { period: "2022–2025", role: "VP of Marketing — enterprise cybersecurity SaaS", note: "Third industry, elevated title; led go-to-market for enterprise clients." },
          { period: "Future", role: "CMO at a U.S. tech company", note: "The common thread: product-led growth for B2B software, at increasing scale." },
        ]}
      />
      {/* Replaces missing "Evidence Alignment" image */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr className="bg-navy text-cream">
              <th className="text-left p-4 font-sans font-medium text-[10px] tracking-[0.15em] uppercase">Surface Reading</th>
              <th className="text-left p-4 font-sans font-medium text-[10px] tracking-[0.15em] uppercase">The Thread Her Attorney Found</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Three different industries (HR, finance, security)", "All roles were in B2B SaaS — the products differed, the market did not"],
              ["Three different titles (PMM, Growth, VP Marketing)", "One consistent methodology: product-led growth and customer acquisition"],
              ["Seemingly scattered career", "A clean progression: individual contributor → department head → executive"],
              ["Expertise tied to each employer", "PLG expertise that transfers across any SaaS product — portable by design"],
            ].map(([surface, thread], i) => (
              <tr key={i} className="border-b border-navy/10">
                <td className="p-4 align-top text-navy-mid leading-[1.6]">{surface}</td>
                <td className="p-4 align-top text-navy leading-[1.6] font-medium">{thread}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-paper border border-navy/15 p-6 md:p-8 my-8">
        <div className="text-[10px] tracking-[0.18em] uppercase text-navy mb-3">From the Petition</div>
        <p className="text-[13px] text-navy-mid leading-[1.75] italic mb-3">
          "While Ms. Chen's job titles have evolved from Product Marketing Manager to Head of Growth
          to VP of Marketing, her core expertise has remained constant: driving customer acquisition
          and retention for B2B software companies through data-driven, product-led approaches. This
          progression reflects deepening mastery of her field, not a change in field."
        </p>
        <p className="text-[13px] text-navy-mid leading-[1.75] italic">
          "Her recognition comes not from expertise in HR or finance, but from expertise in marketing
          software to businesses."
        </p>
      </div>

      {/* ── PART 14 ── */}
      <h2 className={H2} id="advanced">
        Advanced Strategies
      </h2>
      <div className="space-y-6 mb-8">
        {[
          {
            num: "01",
            title: "The zooming technique.",
            body: 'When USCIS challenges your definition, zoom out if accused of being too narrow ("machine learning for fraud detection" → "applied machine learning in financial technology") or zoom in if accused of being too broad ("marketing" → "performance marketing for direct-to-consumer e-commerce brands").',
          },
          {
            num: "02",
            title: "The comparison frame.",
            body: 'Position your field by what it is NOT: "My field is computational linguistics — the intersection of computer science and language — not general software engineering or theoretical linguistics." Boundaries help adjudicators.',
          },
          {
            num: "03",
            title: "The historical anchor.",
            body: 'Reference established terminology: "My field is what the National Science Foundation classifies as Human-Computer Interaction (HCI)." Recognized frameworks add credibility.',
          },
          {
            num: "04",
            title: "The future-backward approach.",
            body: "Start with your dream U.S. role, define the field that role operates in, then work backward to show how your past fits — reframing your current role as the bridge between past and future.",
          },
        ].map(({ num, title, body }) => (
          <div key={num} className="flex gap-5 border-t border-navy/10 pt-5">
            <span className="text-[11px] tracking-[0.15em] uppercase text-oxblood flex-shrink-0 mt-[2px]">{num}</span>
            <div>
              <p className="text-[14px] md:text-[15px] text-navy font-medium mb-2">{title}</p>
              <p className="text-[14px] md:text-[15px] text-navy-mid leading-[1.7]">{body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── PART 15 ── */}
      <h2 className={H2} id="action-plan">
        Your Action Plan
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-navy/10 mb-8">
        {[
          {
            when: "This Week",
            items: ["Draft your one-sentence field definition", "Map your career trajectory", "Inventory your evidence"],
          },
          {
            when: "This Month",
            items: ["Consult with an immigration attorney", "Gather supporting documentation", "Draft your narrative"],
          },
          {
            when: "Before Filing",
            items: ["Review for consistency", "Prepare for RFE scenarios"],
          },
        ].map(({ when, items }) => (
          <div key={when} className="bg-cream p-6">
            <div className="text-[10px] tracking-[0.15em] uppercase text-oxblood mb-4">{when}</div>
            <ul className="space-y-2">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[13px] text-navy-mid leading-[1.6]">
                  <span className="flex-shrink-0 w-[4px] h-[4px] rounded-full bg-navy/30 mt-[9px]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── PART 16 ── */}
      <h2 className={H2} id="final-thoughts">
        Final Thoughts
      </h2>
      <p className={P}>
        The EB-1A process isn't just bureaucracy. It's your chance to tell the story of your
        expertise, your impact, and your potential.{" "}
        <strong className="text-navy">Your field of endeavor is the narrative spine of that story.</strong>
      </p>
      <p className={P}>A great field of endeavor definition:</p>
      <Bullets
        items={[
          "Makes intuitive sense",
          "Reflects your actual career",
          "Connects past, present, and future",
          "Shows clear boundaries",
          "Has measurable achievement",
          "Invites you to thrive in America",
        ]}
      />
      <p className={P}>
        Thousands of extraordinary professionals have successfully navigated this process. You can
        too. The key is clarity, consistency, and confidence in your expertise. For further study, see
        the USCIS Policy Manual, Volume 6, Part F, Chapter 2 (Extraordinary Ability).
      </p>

      <p className="text-[12px] text-grey leading-[1.7] mt-10 mb-12 border-t border-navy/10 pt-6">
        This article is for informational purposes only and does not constitute legal advice. Always
        consult with a qualified immigration attorney before filing any petition.
      </p>

      {/* CTA */}
      <div className="bg-navy text-cream p-8 md:p-10">
        <div className="eyebrow text-ox-light mb-4">Go Deeper</div>
        <h3 className="font-serif text-[24px] md:text-[30px] leading-[1.2] mb-4">
          Ready to define your field?
        </h3>
        <p className="text-[14px] text-cream/80 leading-[1.7] mb-8 max-w-[480px]">
          The EB-1A Master Guide covers all 10 criteria with the full evidentiary framework, petition
          checklist, and narrative architecture — including how your field of endeavor anchors every
          criterion.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/guides/eb1a-master" className="btn-fill !bg-cream !text-navy hover:!bg-paper">
            View the EB-1A Master Guide
          </Link>
          <Link href="/guides" className="btn-outline !border-cream/40 !text-cream hover:!border-cream">
            Browse All Guides
          </Link>
        </div>
      </div>
    </div>
  );
}
