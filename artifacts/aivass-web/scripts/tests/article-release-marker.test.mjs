import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { promisify } from "node:util";
import {
  getArticlePublishRelease, writeArticlePublishMarker,
} from "../../../../scripts/article-publish-release.mjs";

test("parallel artifact builds share one complete release identity; fresh uploads get a new one", async (t) => {
  const root = mkdtempSync(join(tmpdir(), "article-release-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const build = join(root, "upload-one");
  const moduleUrl = new URL("../../../../scripts/article-publish-release.mjs", import.meta.url).href;
  const exec = promisify(execFile);
  const builds = await Promise.all(Array.from({ length: 8 }, () =>
    exec(process.execPath, ["--input-type=module", "-e",
      `import {getArticlePublishRelease} from ${JSON.stringify(moduleUrl)}; console.log(getArticlePublishRelease(${JSON.stringify(build)}));`]),
  ));
  const ids = builds.map(({ stdout }) => stdout.trim());
  assert.equal(new Set(ids).size, 1);
  assert.match(ids[0], /^[0-9a-f-]{36}$/);
  const output = join(root, "dist", "public");
  assert.equal(writeArticlePublishMarker(output, build), ids[0]);
  const marker = join(output, `article-publish-release-${ids[0]}.json`);
  assert.deepEqual(JSON.parse(readFileSync(marker, "utf8")), { release: ids[0] });
  assert.deepEqual(readdirSync(build), ["release-id"]);
  assert.equal(getArticlePublishRelease(build), ids[0]);
  assert.notEqual(getArticlePublishRelease(join(root, "upload-two")), ids[0]);
});
