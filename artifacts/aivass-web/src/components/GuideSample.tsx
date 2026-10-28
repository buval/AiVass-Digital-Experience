import { guideSampleUrl } from "@/data/guides";
import { trackGuideSampleClick } from "@/lib/analytics";

type SampleProps = {
  slug: string;
  sampleSlug: string;
  className?: string;
};

/** Use normal same-tab navigation; modified clicks can still open a new tab. */
export function GuideSampleLink({ slug, sampleSlug, className }: SampleProps) {
  return (
    <a
      href={guideSampleUrl(sampleSlug)}
      aria-describedby={`sample-help-${slug}`}
      className={className}
      onClick={() => trackGuideSampleClick(slug)}
    >
      Free Sample →
    </a>
  );
}

export function GuideSampleHelp({ slug, sampleSlug, className }: SampleProps) {
  return (
    <p id={`sample-help-${slug}`} className={`mt-3 text-[11px] leading-[1.5] ${className ?? ""}`}>
      PDF opens in this tab. Prefer to save it?{" "}
      <a href={guideSampleUrl(sampleSlug)} download className="underline underline-offset-2">
        Download the sample
      </a>{" "}
      to read it on your device. If the request fails, check your connection and try again.
    </p>
  );
}
