import { useEffect, useState } from "react";
import { Link, useSearch } from "wouter";
import { Triad } from "@/components/brand/Triad";
import { useSeoMeta } from "@/lib/seo";

interface DownloadItem {
  token: string;
  guideSlug: string;
  guideName: string;
  attemptsRemaining: number;
}

type State =
  | { status: "loading" }
  | { status: "downloading"; items: DownloadItem[] }
  | { status: "done"; items: DownloadItem[] }
  | { status: "error"; message: string };

type RetryState = Record<string, "idle" | "working" | "done" | "failed">;

async function triggerDownload(token: string, filename: string) {
  const res = await fetch(`/api/download/${token}`);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function OrderSuccess() {
  useSeoMeta({ title: "Purchase Confirmed", noIndex: true });

  const search = useSearch();
  const params = new URLSearchParams(search);
  const sessionId = params.get("session_id");

  const [state, setState] = useState<State>({ status: "loading" });
  const [activeToken, setActiveToken] = useState<string | null>(null);
  const [completedTokens, setCompletedTokens] = useState<Set<string>>(new Set());
  const [failedTokens, setFailedTokens] = useState<Set<string>>(new Set());
  const [retryState, setRetryState] = useState<RetryState>({});
  const [slowHint, setSlowHint] = useState(false);
  const [retryNonce, setRetryNonce] = useState(0);

  // Gentle reassurance if verification takes a while
  useEffect(() => {
    if (state.status !== "loading") return;
    const t = setTimeout(() => setSlowHint(true), 8000);
    return () => clearTimeout(t);
  }, [state.status]);

  useEffect(() => {
    if (!sessionId) {
      setState({ status: "error", message: "No session found. If you completed a purchase, check your email or contact connect@aivass.com." });
      return;
    }

    setState({ status: "loading" });
    setSlowHint(false);
    setCompletedTokens(new Set());
    setFailedTokens(new Set());

    fetch(`/api/order-complete?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `Error ${res.status}`);
        }
        return res.json() as Promise<{ downloads: DownloadItem[] }>;
      })
      .then(async ({ downloads }) => {
        setState({ status: "downloading", items: downloads });

        // Download all guides (usually 1, or 6 for the complete collection)
        for (const item of downloads) {
          const filename = `${item.guideName}.pdf`;
          setActiveToken(item.token);
          try {
            await triggerDownload(item.token, filename);
            setCompletedTokens((prev) => new Set([...prev, item.token]));
            // Small delay between multiple downloads so browser doesn't block them
            await new Promise((r) => setTimeout(r, 800));
          } catch {
            // Mark as failed so the user sees it and can retry below
            setFailedTokens((prev) => new Set([...prev, item.token]));
          }
        }

        setActiveToken(null);
        setState({ status: "done", items: downloads });
      })
      .catch((err: Error) => {
        const offline = typeof navigator !== "undefined" && !navigator.onLine;
        setState({
          status: "error",
          message: offline
            ? "You appear to be offline. Reconnect and try again — your purchase is safe."
            : err.message,
        });
      });
  }, [sessionId, retryNonce]);

  function handleManualDownload(item: DownloadItem) {
    setRetryState((s) => ({ ...s, [item.token]: "working" }));
    triggerDownload(item.token, `${item.guideName}.pdf`)
      .then(() => {
        setRetryState((s) => ({ ...s, [item.token]: "done" }));
        setFailedTokens((prev) => {
          const next = new Set(prev);
          next.delete(item.token);
          return next;
        });
      })
      .catch(() => setRetryState((s) => ({ ...s, [item.token]: "failed" })));
  }

  return (
    <div className="bg-navy text-cream min-h-screen pt-[120px] pb-[100px] flex flex-col items-center text-center px-6">
      <div className="wrap flex flex-col items-center max-w-[560px] w-full">
        <Triad className="w-[60px] text-ox-light mb-8" />

        {state.status === "loading" && (
          <>
            <h1 className="text-[40px] md:text-[60px] font-serif leading-none tracking-[-0.05em] mb-6">
              Purchase confirmed.
            </h1>
            <p className="text-[15px] text-ox-light leading-[1.65] mb-8">
              Verifying your purchase and preparing your download…
            </p>
            <div className="w-8 h-8 border-2 border-ox-light/30 border-t-ox-light rounded-full animate-spin" />
            {slowHint && (
              <p className="text-[12px] text-cream/40 leading-[1.6] mt-8 max-w-[380px]">
                This is taking a little longer than usual — your payment is confirmed
                and your guides are safe. If nothing happens in the next minute,{" "}
                <Link href="/my-downloads" className="underline hover:text-cream">
                  visit My Downloads
                </Link>{" "}
                with your checkout email.
              </p>
            )}
          </>
        )}

        {state.status === "downloading" && (
          <>
            <h1 className="text-[40px] md:text-[60px] font-serif leading-none tracking-[-0.05em] mb-6">
              Downloading now.
            </h1>
            <div className="space-y-3 mb-8 w-full text-left border border-cream/10 p-6">
              {state.items.map((item) => {
                const isDone = completedTokens.has(item.token);
                const isFailed = failedTokens.has(item.token);
                const isActive = activeToken === item.token;
                const isPending = !isDone && !isActive && !isFailed;
                return (
                  <div key={item.token} className="flex items-center justify-between gap-4">
                    <p className={`text-[14px] leading-[1.65] transition-colors ${isDone ? "text-cream/50" : isActive ? "text-cream" : "text-ox-light/50"}`}>
                      {item.guideName}
                    </p>
                    <span className="shrink-0 w-4 h-4 flex items-center justify-center">
                      {isDone && (
                        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-cream/40">
                          <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {isFailed && (
                        <span className="text-ox-light text-[12px] leading-none" title="Will offer retry">
                          !
                        </span>
                      )}
                      {isActive && (
                        <div className="w-3.5 h-3.5 border border-ox-light/30 border-t-cream rounded-full animate-spin" />
                      )}
                      {isPending && (
                        <div className="w-1.5 h-1.5 rounded-full bg-cream/20" />
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-[12px] text-cream/40 leading-[1.6]">
              Your download should start automatically. Check your downloads folder.
            </p>
          </>
        )}

        {state.status === "done" && (
          <>
            <h1 className="text-[40px] md:text-[60px] font-serif leading-none tracking-[-0.05em] mb-6">
              {failedTokens.size > 0
                ? "Almost there."
                : state.items.length > 1 ? "Your guides are ready." : "Your guide is ready."}
            </h1>
            {failedTokens.size > 0 && (
              <p className="text-[13px] text-ox-light leading-[1.65] mb-6 max-w-[420px]">
                {failedTokens.size === 1
                  ? "One download didn't start automatically — use the button below to try it again."
                  : "Some downloads didn't start automatically — use the buttons below to try them again."}
              </p>
            )}
            <div className="space-y-3 mb-8 w-full text-left border border-cream/10 p-6">
              {state.items.map((item) => {
                const rs = retryState[item.token] ?? "idle";
                const isFailed = failedTokens.has(item.token);
                return (
                  <div key={item.token} className="flex items-center justify-between gap-4">
                    <p className="text-[14px] text-ox-light">{item.guideName}</p>
                    <button
                      type="button"
                      disabled={rs === "working"}
                      className={`text-[11px] tracking-[0.08em] uppercase transition-colors whitespace-nowrap disabled:opacity-60 ${
                        isFailed ? "text-cream border border-ox-light/50 px-3 py-1.5 hover:bg-ox-light/10" : "text-cream/60 hover:text-cream"
                      }`}
                      onClick={() => handleManualDownload(item)}
                    >
                      {rs === "working"
                        ? "Downloading…"
                        : rs === "failed"
                          ? "Failed — try again"
                          : isFailed
                            ? "Retry download →"
                            : "Download again →"}
                    </button>
                  </div>
                );
              })}
            </div>
            {Object.values(retryState).includes("failed") && (
              <p className="text-[12px] text-ox-light leading-[1.6] mb-6 max-w-[420px]">
                Still not working? Your links stay valid —{" "}
                <Link href="/my-downloads" className="underline hover:text-cream">
                  My Downloads
                </Link>{" "}
                always has them, or write to{" "}
                <a href="mailto:connect@aivass.com" className="underline hover:text-cream">
                  connect@aivass.com
                </a>.
              </p>
            )}
            <p className="text-[12px] text-cream/40 leading-[1.6] mb-8">
              Each link works for <strong className="text-cream/60">3 downloads</strong> and expires in 72 hours.
              Need it again later?{" "}
              <Link href="/my-downloads" className="underline hover:text-cream">
                Visit My Downloads
              </Link>{" "}
              or contact{" "}
              <a href="mailto:connect@aivass.com" className="underline hover:text-cream">
                connect@aivass.com
              </a>.
            </p>
            <Link href="/guides" className="btn-outline-light">
              Explore More Guides →
            </Link>
          </>
        )}

        {state.status === "error" && (
          <>
            <h1 className="text-[36px] font-serif leading-tight mb-6">
              Something went wrong.
            </h1>
            <p className="text-[15px] text-ox-light leading-[1.65] mb-8">
              {state.message}
            </p>
            <div className="flex flex-col items-center gap-4">
              {sessionId && (
                <button
                  type="button"
                  onClick={() => setRetryNonce((n) => n + 1)}
                  className="btn-outline-light"
                >
                  Try Again
                </button>
              )}
              <a
                href={`mailto:connect@aivass.com?subject=Download issue&body=Session: ${sessionId ?? "unknown"}`}
                className="text-[12px] text-cream/60 hover:text-cream underline"
              >
                Contact Support
              </a>
              <Link href="/guides" className="text-[12px] text-cream/50 hover:text-cream">
                Back to Guides
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
