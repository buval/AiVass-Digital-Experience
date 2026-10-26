import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import type { Express } from "express";
import { logger } from "./logger";

// Verified with the publishing service, not a workspace preview URL.
export const ARTICLE_PRODUCTION_URL = "https://aivass.com";
declare const __ARTICLE_RELEASE_ID__: string;
export const articleReleaseId = __ARTICLE_RELEASE_ID__;
export const articleReleasePath = `/api/_article-release/${articleReleaseId}`;
export const articleStaticReleasePath = `/article-publish-release-${articleReleaseId}.json`;

export function installArticleReleaseProbe(app: Express) {
  // No request can trigger checks. This uncacheable, build-specific response
  // only lets the worker establish that this release has actually been promoted.
  app.get(articleReleasePath, (_req, res) => {
    res.set("Cache-Control", "no-store").status(204).end();
  });
}

export function runArticleValidator(): Promise<{ code: number; output: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [
      fileURLToPath(new URL("./validate-article-sharing.mjs", import.meta.url)),
      "--live-only",
      `--base-url=${ARTICLE_PRODUCTION_URL}`,
    ], { timeout: 240_000, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    // Retain a bounded, actionable report; never capture the app environment.
    const append = (chunk: Buffer) => { output = (output + chunk.toString()).slice(-100_000); };
    child.stdout.on("data", append);
    child.stderr.on("data", append);
    child.on("error", reject);
    child.on("close", (code, signal) => resolve({
      code: code ?? 1,
      output: signal ? `${output}\nValidator terminated: ${signal}` : output,
    }));
  });
}

type Dependencies = {
  production: boolean;
  fetch: typeof fetch;
  wait: (ms: number) => Promise<unknown>;
  validate: typeof runArticleValidator;
  log: Pick<typeof logger, "info" | "error">;
  promotionAttempts: number;
  validationAttempts: number;
};

export async function checkArticlesAfterPublish(overrides: Partial<Dependencies> = {}) {
  const deps: Dependencies = {
    production: process.env.REPLIT_DEPLOYMENT === "1" && process.env.NODE_ENV === "production",
    fetch,
    wait: delay,
    validate: runArticleValidator,
    log: logger,
    promotionAttempts: 40,
    validationAttempts: 3,
    ...overrides,
  };
  if (!deps.production) return;
  const context = {
    check: "article-sharing-post-publish",
    release: articleReleaseId,
    baseUrl: ARTICLE_PRODUCTION_URL,
  };
  deps.log.info(context, "Waiting for both API and static website promotion before checking article links");
  let promoted = false;
  for (let attempt = 0; attempt < deps.promotionAttempts; attempt++) {
    try {
      const response = await deps.fetch(new URL(articleReleasePath, ARTICLE_PRODUCTION_URL), {
        redirect: "error", cache: "no-store", signal: AbortSignal.timeout(10_000),
      });
      await response.body?.cancel();
      if (response.status === 204) {
        const staticResponse = await deps.fetch(new URL(articleStaticReleasePath, ARTICLE_PRODUCTION_URL), {
          redirect: "error", cache: "no-store", signal: AbortSignal.timeout(10_000),
        });
        // A missing file can return the SPA fallback with status 200. Require
        // JSON with this exact build identity, not just a successful response.
        if (staticResponse.status === 200 &&
            staticResponse.headers.get("content-type")?.includes("application/json")) {
          const marker = await staticResponse.json() as { release?: string };
          if (marker.release === articleReleaseId) { promoted = true; break; }
        } else {
          await staticResponse.body?.cancel();
        }
      }
    } catch { /* Domain can briefly be unavailable during promotion. */ }
    await deps.wait(15_000);
  }
  if (!promoted) {
    deps.log.error(context,
      "ARTICLE CHECK NOT RUN: matching API and static website release markers were not observed on the production domain. Check publish status and domain routing; rerun pnpm --filter @workspace/aivass-web validate:article-sharing:live --base-url=https://aivass.com after confirming promotion.");
    return;
  }
  // Both release markers are public. Retry transient route/CDN failures only.
  for (let attempt = 1; attempt <= deps.validationAttempts; attempt++) {
    let result;
    try {
      result = await deps.validate();
    } catch (error) {
      result = { code: 1, output: String(error) };
    }
    if (result.code === 0) {
      deps.log.info({ ...context, attempt, report: result.output },
        "ARTICLE CHECK PASSED: live article links and crawler metadata verified");
      return;
    }
    const final = attempt === deps.validationAttempts;
    deps.log.error({ ...context, attempt, report: result.output, final },
      final
        ? "ARTICLE CHECK FAILED: review the failing paths and expected/actual values above. Fix article rewrites or prerender metadata, republish, then rerun pnpm --filter @workspace/aivass-web validate:article-sharing:live --base-url=https://aivass.com"
        : "Article check failed; retrying after static-route propagation");
    if (!final) await deps.wait(30_000);
  }
}
