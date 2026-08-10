export default function About() {
  return (
    <div className="bg-cream min-h-screen pt-[60px] pb-[100px]">
      <div className="wrap max-w-[900px]">
        <div className="eyebrow mb-6 text-center">About AiVass</div>
        <blockquote className="font-serif italic text-[36px] md:text-[54px] leading-[1.1] text-center text-navy mb-16 max-w-[800px] mx-auto">
          “Build the capability to meet the future with clarity.”
        </blockquote>

        <div className="prose prose-lg prose-aivass mx-auto text-navy-mid leading-[1.8]">
          <p className="text-[18px]">
            AiVass is a boutique technology-enabled transformation studio working at the intersection of intelligent systems, strategy, and human potential.
          </p>
          <p>
            We believe that the future should become more intelligent without becoming less human. This operating philosophy—Automation with Soul—guides every architecture we design, whether for an individual building an extraordinary ability profile, or a global enterprise deploying AI infrastructure.
          </p>
          <div className="my-12 py-8 border-y border-navy/20 text-center">
            <h3 className="font-serif text-[24px] text-navy mb-2">Purpose · Proof · Permanence</h3>
            <p className="text-[14px] text-grey">The strategic framework behind all our engagements.</p>
          </div>
          <p>
            Transformation is often treated as a temporary intervention. We build it as permanent capability. By focusing on coherent systems, deep evidence generation, and architectural thinking, we ensure that the value created remains long after the engagement concludes.
          </p>

          <div className="mt-20 pt-8 border-t border-navy/20">
            <p className="text-[12px] text-grey leading-[1.6]">
              <strong>Disclosure:</strong> AiVass provides strategic, educational, organizational, coaching, and project-management support. We are an architecture and transformation studio, not a law firm. Our services do not constitute legal advice or representation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
