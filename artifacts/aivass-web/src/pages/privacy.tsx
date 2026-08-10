import { useSeoMeta } from "@/lib/seo";

/**
 * PRIVACY AUDIT — Updated August 10, 2026
 *
 * Analytics tools active:         Google Analytics 4 (GA4) — Consent Mode v2, deny-by-default.
 *                                 GA4 only activates when VITE_GA_MEASUREMENT_ID is configured
 *                                 with a valid G-XXXXXXXXXX measurement ID.
 *                                 Consent is requested via on-site ConsentBanner before any
 *                                 analytics data is collected.
 * Advertising pixels active:      None
 * Cookies set by this site:       localStorage key "aivass_analytics_consent" — stores consent choice
 * Third-party embedded services:  None embedded; all external services require user action to reach
 * Third-party requests on load:   Google Fonts (fonts.googleapis.com, fonts.gstatic.com) — loaded
 *                                 on every page render to serve Playfair Display and DM Sans typefaces
 * Personal data before user action: The Google Fonts request transmits the visitor's IP address and
 *                                 browser information to Google's servers automatically on page load.
 *                                 No other personal data is transmitted before user consent is granted.
 */

const SECTIONS = [
  { id: "collect", num: "1", title: "Information We May Collect" },
  { id: "how-collected", num: "2", title: "How Information Is Collected" },
  { id: "how-used", num: "3", title: "How We Use Information" },
  { id: "professional", num: "4", title: "Professional Profile Information" },
  { id: "providers", num: "5", title: "Service Providers" },
  { id: "sharing", num: "6", title: "Sale and Sharing of Personal Information" },
  { id: "cookies", num: "7", title: "Cookies and Analytics" },
  { id: "retention", num: "8", title: "Data Retention" },
  { id: "security", num: "9", title: "Data Security" },
  { id: "choices", num: "10", title: "Privacy Choices and Requests" },
  { id: "california", num: "11", title: "California Privacy" },
  { id: "dnt", num: "12", title: "Do Not Track / Privacy Signals" },
  { id: "children", num: "13", title: "Children" },
  { id: "international", num: "14", title: "International Users" },
  { id: "links", num: "15", title: "External Links and Social Media" },
  { id: "policy-changes", num: "16", title: "Changes to This Policy" },
  { id: "priv-contact", num: "17", title: "Contact" },
];

export default function Privacy() {
  useSeoMeta({
    title: "Privacy Policy — AiVass",
    description: "AiVass Privacy Policy. How we collect, use and protect personal information in connection with aivass.com, Guide purchases, assessments and client engagements.",
    canonical: "https://aivass.com/privacy",
    noIndex: true,
  });

  return (
    <div className="bg-cream min-h-screen">
      {/* Page header */}
      <div className="bg-navy text-cream py-[60px] md:py-[90px]">
        <div className="wrap max-w-[900px]">
          <div className="eyebrow text-ox-light mb-5">Privacy</div>
          <h1 className="font-serif text-[42px] md:text-[64px] leading-none tracking-[-0.05em] mb-6">
            Privacy<br />
            <em className="text-ox-light italic">Policy</em>
          </h1>
          <p className="text-ox-light text-[13px] tracking-[0.05em] mt-4">
            Effective date: August 10, 2026 &nbsp;·&nbsp; AiVass LLC &nbsp;·&nbsp; California, United States
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
            AiVass LLC ("AiVass," "we," "us," or "our") respects the privacy of visitors, customers, prospective
            clients and business contacts.
          </p>
          <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.8] max-w-[720px] mt-4">
            This Privacy Policy explains how information may be collected, used, disclosed and protected when people
            use aivass.com, purchase Guides, book assessments, submit information or interact with AiVass.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-0">
          <PSection id="collect" num="1" title="Information We May Collect">
            <p>Depending on how a person interacts with AiVass, we may collect:</p>

            <Subhead>Identity and Contact Information</Subhead>
            <ul className="mt-2 space-y-1">
              <li>Name</li>
              <li>Email address</li>
              <li>Telephone number</li>
              <li>Organization or company</li>
              <li>Professional contact information</li>
            </ul>

            <Subhead>Professional Information</Subhead>
            <ul className="mt-2 space-y-1">
              <li>Résumé or CV</li>
              <li>Résumé/CV link</li>
              <li>LinkedIn profile</li>
              <li>Career history</li>
              <li>Professional achievements</li>
              <li>Evidence information</li>
              <li>Goals and assessment responses</li>
            </ul>

            <Subhead>Transaction Information</Subhead>
            <ul className="mt-2 space-y-1">
              <li>Product purchased</li>
              <li>Transaction status</li>
              <li>Receipt or purchase reference</li>
              <li>Appointment/payment status</li>
            </ul>
            <p className="mt-3">
              Payment-card information is processed through payment providers such as Stripe. AiVass does not need to
              receive or store full payment-card numbers when Stripe processes the transaction.
            </p>

            <Subhead>Booking Information</Subhead>
            <ul className="mt-2 space-y-1">
              <li>Appointment date and time</li>
              <li>Assessment responses</li>
              <li>Booking details</li>
              <li>Meeting information</li>
            </ul>
            <p className="mt-3">
              Google Calendar and related Google services may process booking and meeting information.
            </p>

            <Subhead>Website and Technical Information</Subhead>
            <p className="mt-2">
              The following information may be processed in connection with website visits:
            </p>
            <ul className="mt-2 space-y-1">
              <li>IP address</li>
              <li>Browser and device type</li>
              <li>Pages viewed</li>
              <li>Referring page</li>
              <li>Interaction data</li>
              <li>General analytics information</li>
            </ul>
            <p className="mt-3">
              <strong className="font-medium text-navy">Google Fonts:</strong> This website loads typefaces from
              Google Fonts (<code className="text-[12px] bg-paper px-1 py-0.5">fonts.googleapis.com</code>,{" "}
              <code className="text-[12px] bg-paper px-1 py-0.5">fonts.gstatic.com</code>) on every page visit. This
              request may transmit your IP address and browser information to Google's servers automatically. No other
              third-party services make automatic requests when the website loads. Google's privacy practices are
              described at{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="link-under text-oxblood"
              >
                policies.google.com/privacy ↗
              </a>
              .
            </p>
            <p className="mt-3">
              <strong className="font-medium text-navy">Analytics:</strong> When you consent via the on-site analytics banner,
              AiVass activates Google Analytics 4 (GA4) under Google's Consent Mode v2. GA4 processes anonymized page-view
              events, click interactions and basic session data. No analytics data is transmitted before you grant consent.
              You may withdraw consent at any time; the preference is stored locally in your browser.
            </p>
            <p className="mt-3">
              No advertising pixels or cross-site tracking technologies are active on this website.
            </p>

            <Subhead>Communications</Subhead>
            <p>
              Information provided when contacting AiVass, requesting support, discussing a partnership or
              corresponding by email.
            </p>
          </PSection>

          <PSection id="how-collected" num="2" title="How Information Is Collected">
            <p>Information may be collected:</p>
            <ul className="mt-2 space-y-1">
              <li>Directly from the individual</li>
              <li>Through website forms</li>
              <li>Through Google Calendar booking forms</li>
              <li>Through Guide purchases</li>
              <li>Through Stripe checkout</li>
              <li>Through email communications</li>
              <li>Through submitted résumé/CV or LinkedIn links</li>
              <li>
                From publicly available professional sources when relevant to an assessment or engagement
              </li>
            </ul>
          </PSection>

          <PSection id="how-used" num="3" title="How We Use Information">
            <p>AiVass may use information to:</p>
            <ul className="mt-2 space-y-1">
              <li>Provide requested products or services</li>
              <li>Conduct Strategic Profile Assessments</li>
              <li>Evaluate potential fit for AiVass programs</li>
              <li>Deliver RISE, SHINE, SIGNATURE or other engagements</li>
              <li>Process and administer Guide purchases</li>
              <li>Schedule meetings</li>
              <li>Communicate with customers and prospective clients</li>
              <li>Provide customer support</li>
              <li>Develop and improve AiVass services</li>
              <li>Maintain security</li>
              <li>Prevent fraud or misuse</li>
              <li>Comply with legal obligations</li>
              <li>Maintain business and accounting records</li>
              <li>Understand website performance</li>
              <li>Communicate relevant AiVass information where permitted</li>
            </ul>
          </PSection>

          <PSection id="professional" num="4" title="Professional Profile Information">
            <p>
              Résumés, CVs, professional evidence and assessment information may contain sensitive or personally
              significant information.
            </p>
            <p className="mt-4">
              AiVass uses this information for the purpose for which it was submitted, such as evaluating a
              professional profile, preparing an assessment or delivering an engagement.
            </p>
            <p className="mt-4">
              Users should avoid submitting information that is not reasonably necessary for the requested service.
            </p>
            <p className="mt-4">
              Do not submit passwords, Social Security numbers, banking credentials or other unnecessary sensitive
              authentication information through general website forms.
            </p>
          </PSection>

          <PSection id="providers" num="5" title="Service Providers">
            <p>
              AiVass may use service providers that process information on its behalf or in connection with requested
              services, including providers for:
            </p>
            <ul className="mt-2 space-y-1">
              <li>Payment processing, such as Stripe</li>
              <li>Scheduling and meetings, such as Google Calendar and Google Meet</li>
              <li>Website analytics, such as Google Analytics 4 (activated only with user consent)</li>
              <li>Website hosting and infrastructure</li>
              <li>Email and business communications</li>
              <li>Document or cloud-storage tools where applicable</li>
            </ul>
            <p className="mt-4">
              These providers process information subject to their own terms, contracts and privacy obligations.
            </p>
          </PSection>

          <PSection id="sharing" num="6" title="Sale and Sharing of Personal Information">
            <p>AiVass does not sell personal information for monetary consideration.</p>
            <p className="mt-4">
              AiVass does not intentionally disclose personal information to unrelated third parties for their
              independent direct marketing.
            </p>
            <p className="mt-4">
              If future advertising, analytics or technology practices create additional rights or disclosures under
              applicable privacy law, AiVass will update this Policy and provide any legally required choices.
            </p>
          </PSection>

          <PSection id="cookies" num="7" title="Cookies and Analytics">
            <p>
              <strong className="font-medium text-navy">Local storage:</strong> When you interact with the analytics
              consent banner, AiVass stores your preference under the key{" "}
              <code className="text-[12px] bg-paper px-1 py-0.5">aivass_analytics_consent</code> in your browser's
              local storage. This value is used solely to remember your consent choice and does not itself transmit data
              to any third party.
            </p>
            <p className="mt-4">
              <strong className="font-medium text-navy">Google Analytics 4 (GA4):</strong> When you grant consent,
              AiVass activates Google Analytics 4 under Google's Consent Mode v2. GA4 sets its own first-party cookies
              (typically <code className="text-[12px] bg-paper px-1 py-0.5">_ga</code> and{" "}
              <code className="text-[12px] bg-paper px-1 py-0.5">_ga_*</code>) to support measurement of page views,
              user sessions and interaction events. Analytics storage defaults to <em>denied</em> until you grant consent.
              If you decline or withdraw consent, GA4 cookies are not set and no analytics data is transmitted.
            </p>
            <p className="mt-4">
              GA4 data is processed by Google LLC subject to Google's privacy practices:{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="link-under text-oxblood"
              >
                policies.google.com/privacy ↗
              </a>
              .
            </p>
            <p className="mt-4">
              <strong className="font-medium text-navy">Advertising:</strong> No advertising pixels or cross-site
              tracking technologies are active on this website. GA4 ad storage is permanently denied.
            </p>
            <p className="mt-4">
              <strong className="font-medium text-navy">Consent choices:</strong> You may accept or decline analytics
              via the banner displayed on your first visit. To change your choice, clear your browser's local storage
              for this domain or contact{" "}
              <a href="mailto:connect@aivass.com" className="link-under text-oxblood">
                connect@aivass.com
              </a>
              .
            </p>
          </PSection>

          <PSection id="retention" num="8" title="Data Retention">
            <p>
              AiVass retains personal information for as long as reasonably necessary for the purpose for which it was
              collected, including service delivery, business administration, transaction records, dispute resolution,
              security and legal obligations.
            </p>
            <p className="mt-4">
              Retention periods may vary depending on the type of information and the relevant relationship.
            </p>
            <p className="mt-4">
              Information may be deleted, anonymized or securely archived when it is no longer reasonably required.
            </p>
          </PSection>

          <PSection id="security" num="9" title="Data Security">
            <p>
              AiVass uses reasonable administrative, technical and organizational measures intended to protect
              information.
            </p>
            <p className="mt-4">No internet transmission or storage system can be guaranteed to be completely secure.</p>
            <p className="mt-4">
              Users are responsible for maintaining appropriate permissions on documents shared through external links
              such as Google Drive, Dropbox or OneDrive.
            </p>
          </PSection>

          <PSection id="choices" num="10" title="Privacy Choices and Requests">
            <p>
              Depending on applicable law and circumstances, individuals may request to:
            </p>
            <ul className="mt-2 space-y-1">
              <li>Access certain personal information</li>
              <li>Correct information</li>
              <li>Request deletion</li>
              <li>Obtain information about how information is used</li>
              <li>Withdraw consent where processing depends on consent</li>
              <li>Opt out of certain communications</li>
            </ul>
            <p className="mt-4">
              Requests may be sent to:{" "}
              <a href="mailto:connect@aivass.com" className="link-under text-oxblood">
                connect@aivass.com
              </a>
            </p>
            <p className="mt-4">
              AiVass may need to verify identity before responding to a privacy request.
            </p>
            <p className="mt-4">
              Some information may need to be retained where permitted or required for legal, security, contractual or
              recordkeeping reasons.
            </p>
          </PSection>

          <PSection id="california" num="11" title="California Privacy">
            <p>AiVass operates in California.</p>
            <p className="mt-4">
              Where applicable under California law, California residents may request information regarding collection,
              use, disclosure, correction or deletion of personal information and may exercise applicable opt-out
              rights.
            </p>
            <p className="mt-4">
              AiVass does not discriminate against individuals for exercising privacy rights protected by applicable
              law.
            </p>
            <p className="mt-4">
              Requests:{" "}
              <a href="mailto:connect@aivass.com" className="link-under text-oxblood">
                connect@aivass.com
              </a>
            </p>
          </PSection>

          <PSection id="dnt" num="12" title="Do Not Track / Privacy Signals">
            <p>
              Because there is not yet a uniform industry standard for all browser Do Not Track signals, the website
              may not respond to every such signal. Where applicable law requires recognition of a legally valid
              opt-out preference signal, AiVass will implement the required response.
            </p>
          </PSection>

          <PSection id="children" num="13" title="Children">
            <p>AiVass services are not directed to children under 13.</p>
            <p className="mt-4">
              AiVass does not knowingly seek to collect personal information from children under 13 through this
              website.
            </p>
            <p className="mt-4">
              If such information is believed to have been submitted, contact{" "}
              <a href="mailto:connect@aivass.com" className="link-under text-oxblood">
                connect@aivass.com
              </a>
              .
            </p>
          </PSection>

          <PSection id="international" num="14" title="International Users">
            <p>AiVass is based in the United States.</p>
            <p className="mt-4">
              Individuals accessing the website from outside the United States understand that information may be
              processed in the United States and in other locations where relevant service providers operate, subject
              to applicable law.
            </p>
          </PSection>

          <PSection id="links" num="15" title="External Links and Social Media">
            <p>
              The website may link to third-party websites and social platforms, including LinkedIn, Facebook,
              Instagram, X and YouTube.
            </p>
            <p className="mt-4">
              AiVass is not responsible for the privacy practices of third-party websites or platforms.
            </p>
            <p className="mt-4">Users should review the applicable third-party privacy policies.</p>
          </PSection>

          <PSection id="policy-changes" num="16" title="Changes to This Policy">
            <p>
              AiVass may update this Privacy Policy as services, technologies or legal requirements evolve.
            </p>
            <p className="mt-4">The effective date will be updated when material revisions are made.</p>
          </PSection>

          <PSection id="priv-contact" num="17" title="Contact">
            <p>Privacy questions and requests may be sent to:</p>
            <address className="not-italic mt-4 text-navy">
              <strong className="font-medium">AiVass LLC</strong><br />
              Email:{" "}
              <a href="mailto:connect@aivass.com" className="link-under text-oxblood">
                connect@aivass.com
              </a>
            </address>
          </PSection>
        </div>
      </div>
    </div>
  );
}

function Subhead({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-5 mb-1 text-[12px] tracking-[0.12em] uppercase text-oxblood font-medium">{children}</p>
  );
}

function PSection({
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
