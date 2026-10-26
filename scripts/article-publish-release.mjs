import { randomUUID } from "node:crypto";
import { linkSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const buildDir = fileURLToPath(new URL("../generated-artifacts/article-publish-build/", import.meta.url));

// Both artifact builds run in the same uploaded source tree, possibly in
// parallel or in either order. This directory is excluded from source uploads,
// so each publish gets a fresh identity even when publishing unchanged code.
export function getArticlePublishRelease(directory = buildDir) {
  mkdirSync(directory, { recursive: true });
  const target = join(directory, "release-id");
  const candidate = join(directory, `${randomUUID()}.tmp`);
  writeFileSync(candidate, randomUUID(), { flag: "wx" });
  try {
    // A hard link publishes a complete file atomically; a concurrent build can
    // never observe an empty/partially written winning ID.
    try { linkSync(candidate, target); }
    catch (error) { if (error.code !== "EEXIST") throw error; }
    return readFileSync(target, "utf8").trim();
  } finally {
    unlinkSync(candidate);
  }
}

export function writeArticlePublishMarker(outputDirectory, directory = buildDir) {
  const release = getArticlePublishRelease(directory);
  const target = join(outputDirectory, `article-publish-release-${release}.json`);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, JSON.stringify({ release }));
  return release;
}
