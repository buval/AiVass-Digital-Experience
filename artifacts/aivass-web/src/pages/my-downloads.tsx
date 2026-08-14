import { useRef, useState } from "react";
import { Triad } from "@/components/brand/Triad";
import { useSeoMeta } from "@/lib/seo";

interface Purchase {
  guideSlug: string;
  guideName: string;
  token: string;
  attemptsRemaining: number;
  expiresAt: string;
  expired: boolean;
  exhausted: boolean;
  canDownload: boolean;
}

type Step =
  | { step: "email" }
  | { step: "code"; email: string }
  | { step: "purchases"; email: string; accessToken: string; purchases: Purchase[] };

type Busy = "idle" | "sending" | "verifying" | "loading";

type RefreshState = Record<string, "loading" | "done" | "error">;
type DownloadState = Record<string, "loading" | "error">;

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

async function readError(res: Response): Promise<{ message: string; code?: string }> {
  const body = await res.json().catch(() => ({}) as Record<string, unknown>);
  return {
    message: (body as { error?: string }).error ?? `Error ${res.status}`,
    code: (body as { code?: string }).code,
  };
}

export default function MyDownloads() {
  useSeoMeta({ title: "My Downloads", noIndex: true });

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [flow, setFlow] = useState<Step>({ step: "email" });
  const [busy, setBusy] = useState<Busy>("idle");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [refreshState, setRefreshState] = useState<RefreshState>({});
  const [downloadState, setDownloadState] = useState<DownloadState>({});
  const [refreshedPurchases, setRefreshedPurchases] = useState<Record<string, Purchase>>({});
  // Monotonic id so responses from superseded requests are ignored
  const requestIdRef = useRef(0);

  function offlineMessage(fallback: string) {
    return typeof navigator !== "undefined" && !navigator.onLine
      ? "You appear to be offline. Reconnect and try again."
      : fallback;
  }

  /* ── Step 1: request a code ─────────────────────────────── */
  function handleRequestCode(e?: React.FormEvent, resend = false) {
    e?.preventDefault();
    const trimmed = (flow.step === "code" ? flow.email : email).trim().toLowerCase();
    if (!trimmed) return;

    const rid = ++requestIdRef.current;
    setBusy("sending");
    setError(null);
    setNotice(null);

    fetch("/api/my-downloads/request-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: trimmed }),
    })
      .then(async (res) => {
        if (rid !== requestIdRef.current) return;
        if (!res.ok) {
          const { message } = await readError(res);
          setError(message);
          setBusy("idle");
          return;
        }
        setBusy("idle");
        setCode("");
        setFlow({ step: "code", email: trimmed });
        setNotice(resend ? "A fresh code is on its way. Use the newest one." : null);
      })
      .catch(() => {
        if (rid !== requestIdRef.current) return;
        setBusy("idle");
        setError(offlineMessage("We couldn't send the code. Please try again."));
      });
  }

  /* ── Step 2: verify the code, then load purchases ───────── */
  function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (flow.step !== "code") return;
    const trimmedCode = code.trim();
    if (!/^\d{6}$/.test(trimmedCode)) {
      setError("Enter the 6-digit code from your email.");
      return;
    }

    const rid = ++requestIdRef.current;
    setBusy("verifying");
    setError(null);
    setNotice(null);

    fetch("/api/my-downloads/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: flow.email, code: trimmedCode }),
    })
      .then(async (res) => {
        if (rid !== requestIdRef.current) return;
        if (!res.ok) {
          const { message } = await readError(res);
          setError(message);
          setBusy("idle");
          return;
        }
        const { accessToken } = (await res.json()) as { accessToken: string };
        setBusy("loading");
        return loadPurchases(flow.email, accessToken, rid);
      })
      .catch(() => {
        if (rid !== requestIdRef.current) return;
        setBusy("idle");
        setError(offlineMessage("Verification failed. Please try again."));
      });
  }

  async function loadPurchases(verifiedEmail: string, accessToken: string, rid: number) {
    try {
      const res = await fetch("/api/my-downloads", {
        headers: { "X-Access-Token": accessToken },
      });
      if (rid !== requestIdRef.current) return;
      if (!res.ok) {
        const { message, code: errCode } = await readError(res);
        if (errCode === "session_expired" || errCode === "unverified") {
          setFlow({ step: "code", email: verifiedEmail });
          setError("Your session expired — request a new code.");
        } else {
          setError(message);
        }
        setBusy("idle");
        return;
      }
      const { purchases } = (await res.json()) as { purchases: Purchase[] };
      setRefreshState({});
      setDownloadState({});
      setRefreshedPurchases({});
      setBusy("idle");
      setFlow({ step: "purchases", email: verifiedEmail, accessToken, purchases });
    } catch {
      if (rid !== requestIdRef.current) return;
      setBusy("idle");
      setError(offlineMessage("We couldn't load your purchases. Please try again."));
    }
  }

  /* ── Downloads & refreshes (verified) ───────────────────── */
  function handleDownload(p: Purchase) {
    setDownloadState((s) => ({ ...s, [p.token]: "loading" }));
    triggerDownload(p.token, `${p.guideName}.pdf`)
      .then(() =>
        setDownloadState((s) => {
          const next = { ...s };
          delete next[p.token];
          return next;
        }),
      )
      .catch(() => setDownloadState((s) => ({ ...s, [p.token]: "error" })));
  }

  function handleRefresh(purchase: Purchase) {
    if (flow.step !== "purchases") return;
    const { accessToken, email: verifiedEmail } = flow;
    const rid = requestIdRef.current;
    setRefreshState((s) => ({ ...s, [purchase.guideSlug]: "loading" }));

    fetch("/api/my-downloads/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Access-Token": accessToken },
      body: JSON.stringify({ guideSlug: purchase.guideSlug }),
    })
      .then(async (res) => {
        if (rid !== requestIdRef.current) return;
        if (!res.ok) {
          const { code: errCode } = await readError(res);
          if (errCode === "session_expired" || errCode === "unverified") {
            setFlow({ step: "code", email: verifiedEmail });
            setError("Your session expired — request a new code to continue.");
            return;
          }
          setRefreshState((s) => ({ ...s, [purchase.guideSlug]: "error" }));
          return;
        }
        const refreshed = (await res.json()) as {
          token: string; attemptsRemaining: number; expiresAt: string;
        };
        setRefreshState((s) => ({ ...s, [purchase.guideSlug]: "done" }));
        setRefreshedPurchases((prev) => ({
          ...prev,
          [purchase.guideSlug]: {
            ...purchase,
            token: refreshed.token,
            attemptsRemaining: refreshed.attemptsRemaining,
            expiresAt: refreshed.expiresAt,
            expired: false,
            exhausted: false,
            canDownload: true,
          },
        }));
      })
      .catch(() => {
        if (rid !== requestIdRef.current) return;
        setRefreshState((s) => ({ ...s, [purchase.guideSlug]: "error" }));
      });
  }

  const displayedPurchases =
    flow.step === "purchases"
      ? flow.purchases.map((p) => refreshedPurchases[p.guideSlug] ?? p)
      : [];

  return (
    <div className="bg-navy text-cream min-h-screen pt-[120px] pb-[100px] flex flex-col items-center px-6">
      <div className="flex flex-col items-center max-w-[560px] w-full">
        <Triad className="w-[60px] text-ox-light mb-8" />

        <h1 className="text-[40px] md:text-[56px] font-serif leading-none tracking-[-0.05em] mb-4 text-center">
          My Downloads
        </h1>

        {/* ── Step 1: email ─────────────────────────────── */}
        {flow.step === "email" && (
          <>
            <p className="text-[15px] text-ox-light leading-[1.65] mb-10 text-center max-w-[420px]">
              Enter the email address you used at checkout. We'll send you a
              one-time code to unlock your guides.
            </p>
            <form onSubmit={handleRequestCode} className="w-full flex flex-col gap-3 mb-6">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border border-cream/20 text-cream placeholder:text-cream/30 px-4 py-3 text-[14px] focus:outline-none focus:border-cream/50 transition-colors"
              />
              <button
                type="submit"
                disabled={busy === "sending"}
                className="btn-primary w-full disabled:opacity-50"
              >
                {busy === "sending" ? "Sending code…" : "Email me a code"}
              </button>
            </form>
          </>
        )}

        {/* ── Step 2: code entry ────────────────────────── */}
        {flow.step === "code" && (
          <>
            <p className="text-[15px] text-ox-light leading-[1.65] mb-2 text-center max-w-[420px]">
              We've sent a 6-digit code to{" "}
              <span className="text-cream">{flow.email}</span>.
            </p>
            <p className="text-[12px] text-cream/40 leading-[1.6] mb-8 text-center">
              It expires in 15 minutes. Check spam if you don't see it.
            </p>
            <form onSubmit={handleVerify} className="w-full flex flex-col gap-3 mb-6">
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                placeholder="······"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-transparent border border-cream/20 text-cream placeholder:text-cream/30 px-4 py-3 text-[24px] tracking-[0.5em] text-center font-serif focus:outline-none focus:border-cream/50 transition-colors"
              />
              <button
                type="submit"
                disabled={busy === "verifying" || busy === "loading"}
                className="btn-primary w-full disabled:opacity-50"
              >
                {busy === "verifying"
                  ? "Verifying…"
                  : busy === "loading"
                    ? "Unlocking your guides…"
                    : "Unlock my downloads"}
              </button>
            </form>
            <div className="flex items-center gap-6 mb-4 text-[12px]">
              <button
                type="button"
                disabled={busy === "sending"}
                onClick={() => handleRequestCode(undefined, true)}
                className="text-cream/50 hover:text-cream underline disabled:opacity-40"
              >
                {busy === "sending" ? "Sending…" : "Resend code"}
              </button>
              <button
                type="button"
                onClick={() => { setFlow({ step: "email" }); setError(null); setNotice(null); }}
                className="text-cream/50 hover:text-cream underline"
              >
                Use a different email
              </button>
            </div>
          </>
        )}

        {/* Notices & errors */}
        {notice && (
          <p role="status" className="text-[12px] text-ox-light text-center mb-4">{notice}</p>
        )}
        {error && flow.step !== "purchases" && (
          <div role="alert" className="w-full text-center border border-ox-light/30 px-6 py-5 mb-4">
            <p className="text-[14px] text-ox-light mb-1">{error}</p>
            <p className="text-[12px] text-cream/40">
              Need help? Contact{" "}
              <a href="mailto:connect@aivass.com" className="underline hover:text-cream">
                connect@aivass.com
              </a>.
            </p>
          </div>
        )}

        {/* ── Step 3: purchases ─────────────────────────── */}
        {flow.step === "purchases" && displayedPurchases.length === 0 && (
          <div className="w-full text-center">
            <p className="text-[14px] text-ox-light mb-4">
              No purchases found for <span className="text-cream">{flow.email}</span>.
            </p>
            <p className="text-[12px] text-cream/40 leading-[1.6] mb-6">
              If you completed a purchase with a different address, try that email.
              Otherwise, contact{" "}
              <a href="mailto:connect@aivass.com" className="underline hover:text-cream">
                connect@aivass.com
              </a>
              .
            </p>
            <button
              type="button"
              onClick={() => { setFlow({ step: "email" }); setEmail(""); setError(null); }}
              className="text-[12px] text-cream/50 hover:text-cream underline"
            >
              Try a different email
            </button>
          </div>
        )}

        {flow.step === "purchases" && displayedPurchases.length > 0 && (
          <div className="w-full">
            <p className="text-[12px] text-cream/40 mb-5 text-center tracking-[0.06em] uppercase">
              {displayedPurchases.length} guide{displayedPurchases.length !== 1 ? "s" : ""} purchased
            </p>

            <div className="border border-cream/10 divide-y divide-cream/10">
              {displayedPurchases.map((p) => {
                const rState = refreshState[p.guideSlug];
                const dState = downloadState[p.token];
                const expiresDate = new Date(p.expiresAt);
                const expiresLabel = p.expired
                  ? "Expired"
                  : `Expires ${expiresDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;

                return (
                  <div key={p.guideSlug} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <p className="text-[14px] text-cream leading-snug truncate">{p.guideName}</p>
                      <p className="text-[11px] text-cream/40">
                        {p.canDownload
                          ? `${p.attemptsRemaining} download${p.attemptsRemaining !== 1 ? "s" : ""} left · ${expiresLabel}`
                          : p.expired
                            ? "Expired"
                            : "Download limit reached"}
                      </p>
                    </div>

                    <div className="shrink-0 flex flex-col items-end gap-1">
                      {p.canDownload && (
                        <button
                          onClick={() => handleDownload(p)}
                          disabled={dState === "loading"}
                          className="text-[11px] tracking-[0.08em] uppercase text-cream/60 hover:text-cream transition-colors whitespace-nowrap disabled:opacity-50"
                        >
                          {dState === "loading"
                            ? "Downloading…"
                            : dState === "error"
                              ? "Failed — try again →"
                              : "Download →"}
                        </button>
                      )}

                      {!p.canDownload && (
                        <button
                          onClick={() => handleRefresh(p)}
                          disabled={rState === "loading"}
                          className="text-[11px] tracking-[0.08em] uppercase text-ox-light hover:text-cream transition-colors whitespace-nowrap disabled:opacity-40"
                        >
                          {rState === "loading" ? "Refreshing…" : rState === "error" ? "Failed — retry →" : "Refresh link →"}
                        </button>
                      )}
                      {rState === "error" && !p.canDownload && (
                        <span className="text-[10px] text-ox-light/70">
                          Couldn't refresh — try again or email connect@aivass.com
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {error && (
              <p role="alert" className="text-[12px] text-ox-light text-center mt-4">{error}</p>
            )}

            <p className="text-[12px] text-cream/30 leading-[1.6] mt-6 text-center">
              Each download link works for 3 downloads and 72 hours. Refreshed links reset both.
              If you need help, contact{" "}
              <a href="mailto:connect@aivass.com" className="underline hover:text-cream/60">
                connect@aivass.com
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
