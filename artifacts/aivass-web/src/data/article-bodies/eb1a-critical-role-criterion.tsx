import { Link } from "wouter";

/**
 * Full article body — "EB-1A Criterion 8: Leading or Critical Role — The Complete Evidence Guide"
 * Author: AiVass Editorial | Published: 2026-02-27
 * Migrated from aivass.com/blog/eb1a-critical-role-criterion (2026-08-10)
 * Source: https://aivass.com/api/posts/eb1a-critical-role-criterion
 *
 * DO NOT edit substance without owner approval.
 */

export default function Eb1aCriterion8Body() {
  return (
    <div className="max-w-[720px]">

      {/* SECTION 1 */}
      <h2 className="font-serif text-[28px] md:text-[36px] tracking-[-0.03em] text-navy mb-5 mt-2" id="what-is">
        What Is EB-1A Criterion 8?
      </h2>
      <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-5">
        Criterion 8 of the EB-1A extraordinary ability classification requires evidence that the
        petitioner has performed in a leading or critical role for organizations or establishments that
        have a distinguished reputation.
      </p>
      <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-5">
        This criterion is one of the most powerful in the EB-1A framework — and one of the most
        frequently misunderstood. Unlike criteria that focus on external recognition (awards, press
        coverage), Criterion 8 centers on your functional impact within organizations. It asks:{" "}
        <em>did you matter?</em>
      </p>

      {/* Legal standard callout */}
      <div className="bg-paper border border-navy/15 p-6 md:p-8 my-8">
        <div className="text-[10px] tracking-[0.18em] uppercase text-oxblood mb-3">Legal Standard</div>
        <p className="text-[14px] text-navy leading-[1.7] font-medium">
          8 C.F.R. § 204.5(h)(3)(viii) — "Evidence that the alien has performed in a leading or
          critical role for organizations or establishments that have a distinguished reputation."
        </p>
      </div>

      {/* SECTION 2 */}
      <h2 className="font-serif text-[28px] md:text-[36px] tracking-[-0.03em] text-navy mb-5 mt-14" id="leading-vs-critical">
        Leading Role vs. Critical Role
      </h2>
      <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-6">
        USCIS distinguishes between "leading" and "critical" roles — and you only need to prove one.
        Understanding the difference is essential for choosing your strongest evidentiary path.
      </p>

      {/* Comparison table */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr className="bg-navy text-cream">
              <th className="text-left p-4 font-sans font-medium text-[10px] tracking-[0.15em] uppercase">Dimension</th>
              <th className="text-left p-4 font-sans font-medium text-[10px] tracking-[0.15em] uppercase">Leading Role</th>
              <th className="text-left p-4 font-sans font-medium text-[10px] tracking-[0.15em] uppercase">Critical Role</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Definition", "A position of leadership, authority, or direction within the organization", "A role that is essential to the organization's outcomes, regardless of title"],
              ["Key Evidence", "Title, reporting structure, decision-making authority, team size managed", "Specific contributions, outcomes tied to role, uniqueness of expertise"],
              ["Common For", "Directors, VPs, department heads, principal investigators", "Senior engineers, lead researchers, key architects, founding team members"],
              ["Risk Factor", "Title alone is insufficient — must show actual leadership impact", "Must demonstrate the role was critical, not merely participatory"],
            ].map(([dim, leading, critical], i) => (
              <tr key={i} className="border-b border-navy/10">
                <td className="p-4 align-top font-medium text-navy text-[12px] tracking-[0.05em] uppercase">{dim}</td>
                <td className="p-4 align-top text-navy-mid leading-[1.6]">{leading}</td>
                <td className="p-4 align-top text-navy-mid leading-[1.6]">{critical}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Common mistake callout */}
      <div className="bg-oxblood/5 border border-oxblood/20 p-6 md:p-8 my-8">
        <div className="text-[10px] tracking-[0.18em] uppercase text-oxblood mb-3">Common Mistake</div>
        <p className="text-[14px] text-navy leading-[1.7]">
          Many petitioners claim a "critical role" without distinguishing their contributions from those
          of peers in similar positions. USCIS adjudicators look for evidence that your specific role was
          critical — not that the department or function was important.
        </p>
      </div>

      {/* SECTION 3 */}
      <h2 className="font-serif text-[28px] md:text-[36px] tracking-[-0.03em] text-navy mb-5 mt-14" id="distinguished-reputation">
        Proving Distinguished Organizational Reputation
      </h2>
      <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-5">
        It's not enough to show you held a leading or critical role — the organization itself must have a
        distinguished reputation. This is a separate evidentiary burden that many petitioners overlook.
      </p>
      <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-4">
        Evidence of distinguished reputation can include:
      </p>
      <ul className="mb-6 space-y-3">
        {[
          "Industry rankings (Fortune 500, Inc. 5000, World University Rankings)",
          "Media coverage of the organization's achievements",
          "Awards or recognitions received by the organization",
          "Market position (revenue, market share, user base)",
          "Partnerships with other prestigious entities",
          "Peer recognition within the industry",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-4 text-[14px] md:text-[15px] text-navy-mid leading-[1.65]">
            <span className="flex-shrink-0 w-[5px] h-[5px] rounded-full bg-oxblood mt-[10px]" />
            {item}
          </li>
        ))}
      </ul>

      <div className="bg-paper border border-navy/15 p-6 my-8">
        <div className="text-[10px] tracking-[0.18em] uppercase text-navy mb-2">Tip</div>
        <p className="text-[14px] text-navy-mid leading-[1.7]">
          If your organization is a startup or lesser-known entity, focus on specific distinguishing
          factors — such as prestigious investors, groundbreaking technology, or notable clients — rather
          than general size or revenue.
        </p>
      </div>

      {/* SECTION 4 */}
      <h2 className="font-serif text-[28px] md:text-[36px] tracking-[-0.03em] text-navy mb-5 mt-14" id="evidence-breakdown">
        Complete Evidence Breakdown
      </h2>
      <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-6">
        Strong Criterion 8 petitions present evidence across four categories. Each category reinforces
        the others to build an airtight narrative.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-navy/10 mb-12">
        {[
          {
            num: "1",
            title: "Organizational Documentation",
            items: [
              "Organizational charts showing your position",
              "Offer letters and employment contracts",
              "Job descriptions with scope of responsibility",
              "Internal communications documenting your authority",
            ],
          },
          {
            num: "2",
            title: "Impact Documentation",
            items: [
              "Revenue or growth metrics tied to your work",
              "Product launches or initiatives you led",
              "Before/after comparisons showing your impact",
              "Performance reviews highlighting exceptional results",
            ],
          },
          {
            num: "3",
            title: "External Validation",
            items: [
              "Expert recommendation letters",
              "Press coverage mentioning your contributions",
              "Industry awards for projects you led",
              "Client or partner testimonials",
            ],
          },
          {
            num: "4",
            title: "Organizational Reputation Evidence",
            items: [
              "Company rankings, funding announcements",
              "Named media coverage in recognized publications",
              "Industry association recognition or accreditation",
              "Notable customers, investors, or partners",
            ],
          },
        ].map(({ num, title, items }) => (
          <div key={num} className="bg-cream p-6 md:p-8">
            <div className="text-[10px] tracking-[0.2em] text-oxblood mb-3">{num}.</div>
            <h3 className="font-serif text-[18px] md:text-[20px] text-navy mb-4">{title}</h3>
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

      {/* SECTION 5 — Real-World Examples */}
      <h2 className="font-serif text-[28px] md:text-[36px] tracking-[-0.03em] text-navy mb-5 mt-14" id="examples">
        Real-World Examples
      </h2>
      <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-8">
        These case studies illustrate how different professionals have successfully documented Criterion 8
        claims across industries and role types.
      </p>

      <div className="space-y-6 mb-12">
        {[
          {
            label: "SaaS · VP of Engineering at a Series A Startup",
            body: "A VP of Engineering at a Series A SaaS startup (ARR: $8M, 120 employees) demonstrated a critical role by architecting and deploying an AI-driven QA automation system that reduced engineering bugs by 78% across the full product suite. No other engineer in the organization possessed the expertise to build the system at the required scale.",
            strength: "Quantified impact — the system generated $12M in new revenue over 18 months.",
          },
          {
            label: "Consumer Tech · Product Lead at a Series B Startup",
            body: "A product lead at a well-funded consumer tech startup (backed by Sequoia and a16z) argued a leading role by demonstrating oversight of a 15-person cross-functional team, direct reporting to the CEO, and ownership of the product roadmap that drove the company from 50K to 2M users.",
            strength: "Distinguished reputation established through investor prestige and press coverage in TechCrunch and Wired.",
          },
          {
            label: "Academic Medicine · Associate Professor & Lab Director",
            body: "An associate professor at a top-20 medical school demonstrated a leading role as director of a research lab with $4M in NIH funding, supervision of 8 postdoctoral researchers, and editorial board membership at two top-tier journals.",
            strength: "Multiple overlapping roles at a single distinguished institution, each independently verifiable.",
          },
          {
            label: "Fintech · Head of Risk Engineering",
            body: "A head of risk engineering at a publicly traded fintech company demonstrated a critical role by showing that their fraud detection system reduced chargebacks by 67% and was cited in the company's SEC filings as a material competitive advantage.",
            strength: "SEC filing reference provided objective, third-party documentation of the role's criticality.",
          },
        ].map(({ label, body, strength }, i) => (
          <div key={i} className="border-t border-navy/10 pt-6">
            <div className="text-[10px] tracking-[0.15em] uppercase text-grey mb-3">{label}</div>
            <p className="text-[14px] md:text-[15px] text-navy-mid leading-[1.7] mb-3">{body}</p>
            <div className="flex items-start gap-3">
              <span className="text-[10px] tracking-[0.15em] uppercase text-oxblood mt-0.5 flex-shrink-0">Key strength:</span>
              <span className="text-[13px] text-navy-mid leading-[1.6]">{strength}</span>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 6 — Expert Letter Strategy */}
      <h2 className="font-serif text-[28px] md:text-[36px] tracking-[-0.03em] text-navy mb-5 mt-14" id="expert-letters">
        Expert Letter Strategy for Criterion 8
      </h2>
      <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-6">
        Expert recommendation letters are often the most persuasive evidence for Criterion 8. But not
        all letters are created equal. USCIS adjudicators read hundreds of recommendation letters —
        generic praise is immediately discounted.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-navy/10 mb-6">
        <div className="bg-paper p-6">
          <div className="text-[10px] tracking-[0.15em] uppercase text-grey mb-3">Weak Language</div>
          <p className="text-[13px] text-navy-mid leading-[1.7] italic mb-3">
            "Dr. Smith is an excellent researcher who has made important contributions to our department.
            I highly recommend her for this petition."
          </p>
          <div className="text-[11px] text-grey leading-[1.5]">
            <span className="text-oxblood font-medium">Why it fails:</span> Generic, no specifics, could
            describe any competent employee.
          </div>
        </div>
        <div className="bg-navy text-cream p-6">
          <div className="text-[10px] tracking-[0.15em] uppercase text-ox-light mb-3">Strong Language</div>
          <p className="text-[13px] text-cream/80 leading-[1.7] italic mb-3">
            "Dr. Smith's development of the XR-7 protein folding algorithm was the single most
            significant technical contribution to our Cancer Genomics Initiative during the 2023–2025
            period. Without her specific expertise in computational biology, the initiative — which has
            since received $8M in NIH R01 funding — would not have been feasible. No other researcher in
            our department possessed the combination of skills required to build this system."
          </p>
          <div className="text-[11px] text-cream/50 leading-[1.5]">
            <span className="text-ox-light font-medium">Why it works:</span> Specific contribution,
            named project, quantified impact, uniqueness of expertise.
          </div>
        </div>
      </div>

      <div className="bg-paper border border-navy/15 p-6 md:p-8 my-8">
        <div className="text-[10px] tracking-[0.18em] uppercase text-navy mb-3">Best Practice</div>
        <p className="text-[14px] text-navy-mid leading-[1.7]">
          Each expert letter should address at least three specific elements: (1) the writer's
          qualifications to evaluate your work, (2) your specific contributions and their impact, and (3)
          why those contributions were <em>critical</em> — not merely helpful — to the organization's
          mission.
        </p>
      </div>

      {/* SECTION 7 — 5 Common Mistakes */}
      <h2 className="font-serif text-[28px] md:text-[36px] tracking-[-0.03em] text-navy mb-5 mt-14" id="common-mistakes">
        5 Common Mistakes That Sink Criterion 8 Claims
      </h2>

      <div className="space-y-6 mb-8">
        {[
          {
            num: "01",
            title: "Relying on job title alone.",
            body: '"Director" or "Lead" in your title is a starting point, not proof. USCIS requires evidence of actual leadership activities and impact, not just hierarchical position.',
          },
          {
            num: "02",
            title: "Failing to distinguish your role from peers.",
            body: "If five other people held the same title, what made your specific contributions critical? Without differentiation, the claim collapses.",
          },
          {
            num: "03",
            title: 'Ignoring the "distinguished reputation" requirement.',
            body: "You can prove the most critical role in the world, but if the organization lacks distinguished reputation, the criterion fails. Always document both elements.",
          },
          {
            num: "04",
            title: "Using vague expert letters.",
            body: 'Letters that describe you as "talented" or "hardworking" without specific examples of critical contributions are effectively worthless to adjudicators.',
          },
          {
            num: "05",
            title: "Conflating departmental importance with role criticality.",
            body: "The fact that your department was important doesn't mean your role was critical. You must show that you specifically — not your team or department — performed a critical function.",
          },
        ].map(({ num, title, body }) => (
          <div key={num} className="flex gap-5 border-t border-navy/10 pt-5">
            <span className="text-[11px] tracking-[0.15em] uppercase text-oxblood flex-shrink-0 mt-[2px]">
              {num}
            </span>
            <div>
              <p className="text-[14px] md:text-[15px] text-navy font-medium mb-2">{title}</p>
              <p className="text-[14px] md:text-[15px] text-navy-mid leading-[1.7]">{body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* RFE Alert */}
      <div className="bg-oxblood/5 border border-oxblood/20 p-6 md:p-8 my-8">
        <div className="text-[10px] tracking-[0.18em] uppercase text-oxblood mb-3">RFE Alert</div>
        <p className="text-[14px] text-navy leading-[1.7]">
          The most common Request for Evidence on Criterion 8 asks petitioners to explain how their role
          differed from others with similar titles. Prepare this distinction proactively — don't wait for
          the RFE.
        </p>
      </div>

      {/* SECTION 8 — Final Merits */}
      <h2 className="font-serif text-[28px] md:text-[36px] tracking-[-0.03em] text-navy mb-5 mt-14" id="final-merits">
        Criterion 8 in the Final Merits Determination
      </h2>
      <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-5">
        Under the Kazarian two-step framework, meeting Criterion 8 at step one (the initial evidentiary
        review) is necessary but not sufficient. At step two — the final merits determination — USCIS
        evaluates whether your evidence, considered in totality, demonstrates sustained national or
        international acclaim.
      </p>
      <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-4">
        For Criterion 8, this means your leading or critical role evidence should connect to your broader
        narrative of extraordinary ability:
      </p>
      <ul className="mb-6 space-y-3">
        {[
          "Does the role demonstrate sustained excellence, or was it a one-time achievement?",
          "Does the role connect to your other claimed criteria (publications, awards, original contributions)?",
          "Does the evidence show that your abilities are recognized beyond a single organization?",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-4 text-[14px] md:text-[15px] text-navy-mid leading-[1.65]">
            <span className="flex-shrink-0 w-[5px] h-[5px] rounded-full bg-oxblood mt-[10px]" />
            {item}
          </li>
        ))}
      </ul>

      <div className="bg-paper border border-navy/15 p-6 md:p-8 my-8">
        <div className="text-[10px] tracking-[0.18em] uppercase text-navy mb-3">Strategic Insight</div>
        <p className="text-[14px] text-navy-mid leading-[1.7]">
          Criterion 8 is most powerful when combined with Criterion 5 (original contributions) and
          Criterion 6 (scholarly articles). Together, they paint a picture of someone who not only leads
          within organizations but also shapes the broader field.
        </p>
      </div>

      {/* SECTION 9 — Readiness Checklist */}
      <h2 className="font-serif text-[28px] md:text-[36px] tracking-[-0.03em] text-navy mb-5 mt-14" id="checklist">
        Criterion 8 Readiness Checklist
      </h2>
      <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-8">
        Use this checklist to evaluate whether your Criterion 8 evidence package is complete:
      </p>

      <div className="border-t border-navy/10 mb-12">
        {[
          "Identified whether you're arguing a leading role, critical role, or both",
          "Organizational chart showing your position relative to leadership",
          "Detailed job description or scope of work document",
          "At least 3 quantified impact metrics tied to your role",
          "At least 2 expert recommendation letters addressing your specific contributions",
          "Evidence of the organization's distinguished reputation (rankings, press, awards)",
          "Documentation distinguishing your contributions from peers in similar roles",
          "Internal communications or performance reviews demonstrating authority",
          "Connection to at least one other EB-1A criterion in your narrative",
          "Prepared response to potential RFE on role differentiation",
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-5 border-b border-navy/10 py-4">
            <span className="flex-shrink-0 w-[20px] h-[20px] border border-navy/25 mt-[1px]" />
            <span className="text-[14px] md:text-[15px] text-navy-mid leading-[1.6]">{item}</span>
          </div>
        ))}
      </div>

      {/* CTA box */}
      <div className="bg-navy text-cream p-8 md:p-10">
        <div className="eyebrow text-ox-light mb-4">Go Deeper</div>
        <h3 className="font-serif text-[24px] md:text-[30px] leading-[1.2] mb-4">
          The complete evidence guide is waiting.
        </h3>
        <p className="text-[14px] text-cream/80 leading-[1.7] mb-8 max-w-[480px]">
          The EB-1A Master Guide covers all 10 criteria — including Criterion 8 — with the full
          evidentiary framework, petition checklist, and narrative architecture used by petitioners at
          the highest levels.
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
