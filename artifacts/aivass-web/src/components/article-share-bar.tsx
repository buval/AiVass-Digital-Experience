import { useEffect, useRef, useState } from "react";

type ArticleShareBarProps = {
  title: string;
  description: string;
  canonicalUrl: string;
};

const actionClass =
  "inline-flex min-h-11 items-center justify-center border border-navy/15 bg-paper px-3 py-2 text-[10px] tracking-[0.13em] uppercase text-navy transition-colors hover:bg-navy hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.className = "fixed opacity-0 pointer-events-none";
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  textarea.remove();

  if (!copied) {
    throw new Error("Clipboard access is unavailable.");
  }
}

export function ArticleShareBar({ title, description, canonicalUrl }: ArticleShareBarProps) {
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nativeShareAvailable = typeof navigator !== "undefined" && typeof navigator.share === "function";
  const xShareUrl = new URL("https://twitter.com/intent/tweet");
  xShareUrl.searchParams.set("url", canonicalUrl);
  xShareUrl.searchParams.set("text", `${title}\n\n${description}`);
  const linkedInShareUrl = new URL("https://www.linkedin.com/sharing/share-offsite/");
  linkedInShareUrl.searchParams.set("url", canonicalUrl);

  useEffect(() => {
    return () => {
      if (noticeTimer.current) {
        clearTimeout(noticeTimer.current);
      }
    };
  }, []);

  const announce = (message: string) => {
    setNotice(message);
    if (noticeTimer.current) {
      clearTimeout(noticeTimer.current);
    }
    noticeTimer.current = setTimeout(() => setNotice(""), 3200);
  };

  const copyLink = async () => {
    try {
      await copyText(canonicalUrl);
      announce("Link copied.");
    } catch {
      announce("Unable to copy the link. Please copy it from your browser.");
    }
  };

  const shareNatively = async () => {
    try {
      await navigator.share({ title, text: description, url: canonicalUrl });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      announce("Unable to open the share menu.");
    }
  };

  return (
    <nav aria-label="Share this article" className="mb-10 flex flex-wrap items-center gap-2">
      <span className="mr-1 text-[10px] tracking-[0.18em] uppercase text-grey">Share</span>
      <a
        href={linkedInShareUrl.toString()}
        target="_blank"
        rel="noopener noreferrer"
        className={actionClass}
        aria-label={`Share “${title}” on LinkedIn`}
      >
        LinkedIn
      </a>
      <a
        href={xShareUrl.toString()}
        target="_blank"
        rel="noopener noreferrer"
        className={actionClass}
        aria-label={`Share “${title}” on X`}
      >
        X
      </a>
      <button type="button" className={actionClass} onClick={copyLink}>
        Copy link
      </button>
      {nativeShareAvailable && (
        <button type="button" className={actionClass} onClick={shareNatively}>
          More
        </button>
      )}
      <span className="sr-only" role="status" aria-live="polite">
        {notice}
      </span>
    </nav>
  );
}