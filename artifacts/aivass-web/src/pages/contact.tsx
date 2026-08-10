import { Triad } from "@/components/brand/Triad";
import { STRATEGIC_ASSESSMENT_URL } from "@/config/booking";
import { useSeoMeta } from "@/lib/seo";
import { trackAssessmentClick, trackDiscussPartnership } from "@/lib/analytics";

export default function Contact() {
  useSeoMeta({
    title: "Contact — Begin the Architecture",
    description: "Start a conversation with AiVass. Book a Strategic Profile Assessment for individuals, or discuss a partnership for businesses and organizations.",
    canonical: "https://aivass.com/contact",
  });
  return (
    <div className="bg-cream min-h-screen flex items-center py-[100px]">
      <div className="wrap w-full grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-[10vw] items-center">
        <div>
          <div className="eyebrow mb-6">Contact</div>
          <h1 className="text-[50px] md:text-[70px] font-serif leading-none tracking-[-0.05em] mb-6">
            Begin the<br />
            <em className="text-oxblood italic">architecture.</em>
          </h1>
          <p className="text-[16px] text-navy-mid max-w-[400px] leading-[1.65] mb-10">
            Whether you are an individual seeking assessment, or an organization ready to build capability.
          </p>
          <Triad className="w-[120px] text-oxblood/80 hidden md:block" />
        </div>

        <div className="space-y-8">
          <div className="bg-paper border border-navy/10 p-8 md:p-10 hover:border-navy/30 transition-colors">
            <h2 className="font-serif text-[28px] mb-3">Start a Conversation</h2>
            <p className="text-[13px] text-grey mb-8 max-w-[300px]">
              For individuals exploring pathways or inquiring about profile assessments.
            </p>
            <a href={STRATEGIC_ASSESSMENT_URL} target="_blank" rel="noopener noreferrer" className="btn-fill w-full md:w-auto" onClick={() => trackAssessmentClick("contact-page")}>
              Book Assessment
            </a>
          </div>

          <div className="bg-paper border border-navy/10 p-8 md:p-10 hover:border-navy/30 transition-colors">
            <h2 className="font-serif text-[28px] mb-3">Discuss a Partnership</h2>
            <p className="text-[13px] text-grey mb-8 max-w-[300px]">
              For businesses and organizations requiring strategic enablement or system architecture.
            </p>
            <a href="mailto:contact@aivass.com" className="btn-outline w-full md:w-auto" onClick={() => trackDiscussPartnership("contact-page")}>
              Email Our Team
            </a>
            {/* // TODO: Update with real contact email or form link */}
          </div>
        </div>
      </div>
    </div>
  );
}
