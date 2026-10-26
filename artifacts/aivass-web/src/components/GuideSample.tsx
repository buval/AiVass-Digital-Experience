import { guideSampleUrl } from "@/data/guides";
import { trackGuideSampleClick } from "@/lib/analytics";

type SampleProps = {
  slug: string;
  sampleSlug: string;
  className?: string;
};

/** Let the browser navigate immediately, including modified clicks and Enter.
 * A cross-tab PDF's loading/rendering state cannot be inferred here.
 */
export function GuideSampleLink({ slug, sampleSlug, className }: SampleProps) {
  return (
    <a
      href={guideSampleUrl(sampleSlug)}
      target="_blank"
      rel="noopener noreferrer"
      aria-describedby={`sample-help-${slug}`}
      className={className}
      onClick={() => trackGuideSampleClick(slug)}
    >
      Free Sample ↗
    </a>
  );
}

export function GuideSampleHelp({ slug, sampleSlug, className }: SampleProps) {
  return (
    <p id={`sample-help-${slug}`} className={`mt-3 text-[11px] leading-[1.5] ${className ?? ""}`}>
      PDF opens in a new tab. Slow or blank?{" "}
      <a href={guideSampleUrl(sampleSlug)} download className="underline underline-offset-2">
        Download the sample
      </a>{" "}
      to read it on your device. If the request fails, check your connection and try again.
    </p>
  );
}
