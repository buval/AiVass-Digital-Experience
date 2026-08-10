import { useSeoMeta } from "@/lib/seo";

const SECTIONS = [
  { id: "nature", num: "1", title: "Nature of AiVass Services" },
  { id: "eb1a", num: "2", title: "Extraordinary-Ability / Global-Mobility Content" },
  { id: "assessment", num: "3", title: "Strategic Profile Assessment" },
  { id: "programs", num: "4", title: "Rise, Shine and Signature" },
  { id: "guides", num: "5", title: "Digital Guides and Products" },
  { id: "ip", num: "6", title: "Intellectual Property" },
  { id: "partnerships", num: "7", title: "Partnerships and Licensing" },
  { id: "payments", num: "8", title: "Payments and Third-Party Services" },
  { id: "results", num: "9", title: "No Guarantee of Results" },
  { id: "user", num: "10", title: "User Responsibilities" },
  { id: "availability", num: "11", title: "Website Availability and Accuracy" },
  { id: "liability", num: "12", title: "Limitation of Liability" },
  { id: "indemnification", num: "13", title: "Indemnification" },
  { id: "law", num: "14", title: "Governing Law" },
  { id: "changes", num: "15", title: "Changes to These Terms" },
  { id: "contact", num: "16", title: "Contact" },
];

export default function Legal() {
  useSeoMeta({
    title: "Legal, Terms of Use & Disclaimers — AiVass",
    description: "AiVass Terms of Use and Disclaimers. AiVass provides strategic, educational and coaching support — not legal advice or representation.",
    canonical: "https://aivass.com/legal",
    noIndex: true,
  });

  return (
    <div className="bg-cream min-h-screen">
      {/* Page header */}
      <div className="bg-navy text-cream py-[60px] md:py-[90px]">
        <div className="wrap max-w-[900px]">
          <div className="eyebrow text-ox-light mb-5">Legal</div>
          <h1 className="font-serif text-[42px] md:text-[64px] leading-none tracking-[-0.05em] mb-6">
            Terms of Use<br />
            <em className="text-ox-light italic">&amp; Disclaimers</em>
          </h1>
          <p className="text-ox-light text-[13px] tracking-[0.05em] mt-4">
            Effective date: August 9, 2026 &nbsp;·&nbsp; AiVass LLC &nbsp;·&nbsp; California, United States
          </p>
        </div>
      </div>

      <div className="wrap max-w-[900px] py-[60px] md:py-[90px]">
        {/* Jump navigation */}
        <nav className="mb-[60px] p-6 md:p-8 bg-paper border border-navy/10" aria-label="Section navigation">
          <p className="text-[10px] tracking-[0.15em] uppercase text-grey mb-4">Jump to section</p>
          <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            {SECTIONS.map(({ id, num, title }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="text-[12px] text-navy-mid hover:text-oxblood transition-colors flex gap-2"
                >
                  <span className="text-grey w-5 shrink-0">{num}.</span>
                  <span>{title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Introduction */}
        <div className="mb-[50px]">
          <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.8] max-w-[720px]">
            These Terms of Use and Disclaimers govern use of aivass.com and the services, digital products, assessments,
            programs and materials offered by AiVass LLC ("AiVass," "we," "us," or "our").
          </p>
          <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.8] max-w-[720px] mt-4">
            By accessing the website, purchasing a digital product, booking an assessment, submitting information, or
            engaging AiVass for services, you agree to these terms and to any additional written agreement that applies
            to the specific product or engagement.
          </p>
          <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.8] max-w-[720px] mt-4">
            If a separately signed services agreement conflicts with these website terms, the signed agreement controls
            for that engagement.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-0">
          <Section id="nature" num="1" title="Nature of AiVass Services">
            <p>
              AiVass is a technology-enabled transformation studio providing strategic, educational, organizational,
              coaching, project-management, business-transformation, capability-development and related non-legal
              services.
            </p>
            <p className="mt-4">
              AiVass may provide frameworks, systems, templates, educational materials, evidence-organization methods,
              strategic assessments, workflow support, coaching and project-management guidance.
            </p>
            <p className="mt-4 font-medium text-navy">AiVass is not a law firm.</p>
            <p className="mt-4">AiVass does not provide:</p>
            <ul className="mt-2 space-y-1">
              <li>Legal advice</li>
              <li>Legal representation</li>
              <li>Attorney services</li>
              <li>Legal opinions</li>
              <li>Immigration representation</li>
              <li>Guarantees regarding eligibility, filings, petitions, visas, immigration status or government decisions</li>
            </ul>
            <p className="mt-4">Nothing on this website creates an attorney-client relationship.</p>
            <p className="mt-4">
              Individuals should consult a qualified licensed attorney regarding legal questions, filing strategy, legal
              interpretation or legal rights.
            </p>
          </Section>

          <Section id="eb1a" num="2" title="Extraordinary-Ability / Global-Mobility Content">
            <p>
              AiVass materials relating to EB-1A, extraordinary ability, evidence, professional profiles or future
              global-mobility pathways are provided for strategic, educational, organizational and project-management
              purposes.
            </p>
            <p className="mt-4">AiVass may help users:</p>
            <ul className="mt-2 space-y-1">
              <li>Understand evidence categories</li>
              <li>Organize professional information</li>
              <li>Identify potential evidence gaps</li>
              <li>Strengthen professional positioning</li>
              <li>Structure projects and documentation</li>
              <li>Develop narratives from a strategic or communication perspective</li>
              <li>Build systems for managing evidence and progress</li>
            </ul>
            <p className="mt-4">
              AiVass does not determine legal eligibility and does not guarantee that any government agency will accept
              an interpretation, document, petition, argument or filing.
            </p>
            <p className="mt-4">Government rules, policies and interpretations may change.</p>
            <p className="mt-4">
              Users remain responsible for obtaining appropriate legal advice and for all legal filing decisions.
            </p>
          </Section>

          <Section id="assessment" num="3" title="Strategic Profile Assessment">
            <p>The AiVass Strategic Profile Assessment is a paid strategic and educational assessment.</p>
            <p className="mt-4">The assessment may consider information such as:</p>
            <ul className="mt-2 space-y-1">
              <li>Résumé or CV</li>
              <li>LinkedIn profile</li>
              <li>Professional history</li>
              <li>Evidence</li>
              <li>Goals</li>
              <li>Readiness</li>
              <li>Gaps</li>
              <li>Potential development paths</li>
            </ul>
            <p className="mt-4">The assessment does not guarantee:</p>
            <ul className="mt-2 space-y-1">
              <li>Acceptance into an AiVass premium program</li>
              <li>Immigration eligibility</li>
              <li>Petition approval</li>
              <li>Any legal outcome</li>
              <li>Any professional or financial result</li>
            </ul>
            <p className="mt-4">Following an assessment, AiVass may recommend:</p>
            <ul className="mt-2 space-y-1">
              <li>Additional self-directed preparation</li>
              <li>Guides</li>
              <li>RISE</li>
              <li>SHINE</li>
              <li>SIGNATURE</li>
              <li>Another solution</li>
              <li>Or no further AiVass engagement</li>
            </ul>
            <p className="mt-4">
              AiVass retains discretion regarding whether a prospective client is an appropriate fit for a premium
              engagement.
            </p>
          </Section>

          <Section id="programs" num="4" title="Rise, Shine and Signature">
            <p>RISE, SHINE and SIGNATURE are selective premium AiVass engagements.</p>
            <p className="mt-4">Website descriptions are informational summaries only.</p>
            <p className="mt-4">
              Specific scope, duration, fees, session cadence, deliverables, responsibilities, payment terms,
              intellectual-property rights, cancellation and termination provisions are governed by the applicable
              written client agreement.
            </p>
            <p className="mt-4">No website description constitutes an offer or guarantee of admission.</p>
          </Section>

          <Section id="guides" num="5" title="Digital Guides and Products">
            <p>
              AiVass sells digital Guides, templates, frameworks and other digital materials.
            </p>
            <p className="mt-4">Unless otherwise stated at the time of purchase:</p>
            <ul className="mt-2 space-y-1">
              <li>Products are licensed for the purchaser's personal use</li>
              <li>
                Products may not be reproduced, resold, distributed, sublicensed, uploaded to shared libraries or
                commercially exploited
              </li>
              <li>Copyright and intellectual-property ownership remain with AiVass LLC</li>
            </ul>
            <p className="mt-4">
              Purchase terms displayed on the applicable product or checkout page form part of these Terms.
            </p>
            <p className="mt-4">Digital products are educational resources and are not legal advice.</p>
          </Section>

          <Section id="ip" num="6" title="Intellectual Property">
            <p>
              The AiVass name, AiVass branding, T1 Triad, visual systems, Automation with Soul, Building Extraordinary
              Futures, methodologies, frameworks, program materials, written content, designs, templates, Guides,
              workflows and other proprietary materials are owned by or licensed to AiVass LLC unless otherwise stated.
            </p>
            <p className="mt-4">
              No rights are transferred except the limited rights expressly granted for the relevant product or
              engagement.
            </p>
            <p className="mt-4">
              Commercial use, training use, professional-practice use, sublicensing or methodology licensing requires
              separate written authorization from AiVass LLC.
            </p>
          </Section>

          <Section id="partnerships" num="7" title="Partnerships and Licensing">
            <p>
              References to partnerships, methodology licensing, professional practice implementations or organizational
              collaborations are invitations to discuss a potential business relationship only.
            </p>
            <p className="mt-4">
              No license, partnership, agency, franchise, joint venture or other legal relationship exists unless
              established by a separate written agreement executed by authorized parties.
            </p>
          </Section>

          <Section id="payments" num="8" title="Payments and Third-Party Services">
            <p>
              AiVass may use third-party providers including Stripe, Google Calendar, Google Meet and other service
              providers to facilitate payments, scheduling and service delivery.
            </p>
            <p className="mt-4">
              Transactions may also be governed by the applicable third party's terms and privacy practices.
            </p>
            <p className="mt-4">AiVass does not control third-party service availability.</p>
            <p className="mt-4">
              Assessment cancellation/refund terms displayed in the booking flow apply to the relevant appointment.
            </p>
            <p className="mt-4">
              Digital-product refund or download terms displayed at checkout apply to the relevant purchase.
            </p>
          </Section>

          <Section id="results" num="9" title="No Guarantee of Results">
            <p>AiVass does not guarantee:</p>
            <ul className="mt-2 space-y-1">
              <li>Immigration outcomes</li>
              <li>Government approvals</li>
              <li>Professional recognition</li>
              <li>Awards</li>
              <li>Publications</li>
              <li>Employment</li>
              <li>Promotions</li>
              <li>Revenue</li>
              <li>Business performance</li>
              <li>Investment returns</li>
              <li>Specific transformation outcomes</li>
            </ul>
            <p className="mt-4">
              Examples, case studies, testimonials and illustrations describe individual experiences and are not
              promises of future results.
            </p>
            <p className="mt-4">Transformation depends on numerous factors outside AiVass's control.</p>
          </Section>

          <Section id="user" num="10" title="User Responsibilities">
            <p>
              Users agree to provide information that is accurate to the best of their knowledge and to use AiVass
              materials lawfully.
            </p>
            <p className="mt-4">Users remain responsible for:</p>
            <ul className="mt-2 space-y-1">
              <li>Reviewing their own documents</li>
              <li>Confirming factual accuracy</li>
              <li>Obtaining legal, tax, financial or other regulated professional advice when appropriate</li>
              <li>Protecting confidential credentials</li>
              <li>Complying with applicable laws and third-party terms</li>
            </ul>
          </Section>

          <Section id="availability" num="11" title="Website Availability and Accuracy">
            <p>
              AiVass seeks to keep website information accurate and current but cannot guarantee that every page is
              complete, error-free or continuously available.
            </p>
            <p className="mt-4">
              Information may be updated, corrected, removed or changed without notice.
            </p>
            <p className="mt-4">
              External links are provided for convenience and do not constitute endorsement unless expressly stated.
            </p>
          </Section>

          <Section id="liability" num="12" title="Limitation of Liability">
            <p>
              To the maximum extent permitted by applicable law, AiVass LLC and its owners, contractors and
              representatives will not be liable for indirect, incidental, special, consequential or punitive damages
              arising from use of the website, digital products or third-party services.
            </p>
            <p className="mt-4">
              Nothing in these Terms excludes liability that cannot lawfully be excluded or limited.
            </p>
            <p className="mt-4">
              For paid services, any additional limitation-of-liability terms in the applicable signed agreement
              control.
            </p>
          </Section>

          <Section id="indemnification" num="13" title="Indemnification">
            <p>
              To the extent permitted by law, users agree to be responsible for claims or losses arising from their
              unlawful misuse of the website, AiVass intellectual property or materials, or violation of these Terms.
            </p>
          </Section>

          <Section id="law" num="14" title="Governing Law">
            <p>
              These website Terms are governed by the laws of the State of California, without regard to
              conflict-of-law principles, except where applicable law requires otherwise.
            </p>
            <p className="mt-4">
              Any specific dispute-resolution terms contained in a signed client agreement control for that engagement.
            </p>
          </Section>

          <Section id="changes" num="15" title="Changes to These Terms">
            <p>
              AiVass may update these Terms as the website, services and business model evolve.
            </p>
            <p className="mt-4">
              The current version and effective date will be posted on this page.
            </p>
            <p className="mt-4">
              Continued use of the website after an update constitutes acceptance of the revised website terms to the
              extent permitted by law.
            </p>
          </Section>

          <Section id="contact" num="16" title="Contact">
            <p>Questions regarding these Terms may be sent to:</p>
            <address className="not-italic mt-4 text-navy">
              <strong className="font-medium">AiVass LLC</strong><br />
              Email:{" "}
              <a href="mailto:connect@aivass.com" className="link-under text-oxblood">
                connect@aivass.com
              </a>
            </address>
          </Section>
        </div>
      </div>
    </div>
  );
}

// Reusable section component — number, ruled title, body
function Section({
  id,
  num,
  title,
  children,
}: {
  id: string;
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-t border-navy/10 pt-[40px] pb-[40px] scroll-mt-24">
      <div className="flex gap-4 md:gap-6 items-start mb-5">
        {/* Star node */}
        <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] mt-[6px] shrink-0 text-oxblood" fill="currentColor" aria-hidden>
          <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5Z" />
        </svg>
        <h2 className="font-serif text-[22px] md:text-[28px] leading-tight tracking-[-0.03em]">
          <span className="text-grey mr-2 font-sans text-[14px] font-normal">{num}.</span>
          {title}
        </h2>
      </div>
      <div className="pl-[30px] md:pl-[38px] text-[14px] md:text-[15px] text-navy-mid leading-[1.85] max-w-[680px]">
        <style>{`
          #${id} ul { list-style: none; padding: 0; }
          #${id} ul li { padding-left: 1.1em; position: relative; }
          #${id} ul li::before { content: "—"; position: absolute; left: 0; color: #D9A39B; }
        `}</style>
        {children}
      </div>
    </section>
  );
}
