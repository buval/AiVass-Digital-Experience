import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const args = process.argv.slice(2);
const remote = args.includes("--remote");
const bucket =
  args.find((arg) => arg.startsWith("--bucket="))?.slice("--bucket=".length) ??
  "aivass-guides";
const sourceDir = args
  .find((arg) => arg.startsWith("--source-dir="))
  ?.slice("--source-dir=".length);
const filenames = {
  "eb1a-master": "eb1a-master_1786386996458.pdf",
  "eb1a-business": "eb1a-business_1786386996457.pdf",
  "eb1a-arts": "eb1a-arts_1786386996458.pdf",
  "eb1a-athletics": "eb1a-athletics_1786386996457.pdf",
  "eb1a-education": "eb1a-education_1786386996457.pdf",
  "eb1a-science": "eb1a-science_1786386996458.pdf",
};
// Validate every file before making any remote changes. The bundle delivers
// these six PDFs individually; there is no eb1a-complete.pdf to upload.
for (const filename of Object.values(filenames)) {
  const slug = Object.entries(filenames).find(
    ([, name]) => name === filename,
  )[0];
  const path = sourceDir
    ? resolve(sourceDir, `${slug}.pdf`)
    : resolve(root, "attached_assets", filename);
  if (
    !existsSync(path) ||
    readFileSync(path).subarray(0, 5).toString() !== "%PDF-"
  )
    throw new Error(`Guide PDF missing or invalid: ${path}`);
}
for (const [slug, filename] of Object.entries(filenames)) {
  const command = [
    "wrangler",
    "r2",
    "object",
    "put",
    `${bucket}/guides/${slug}.pdf`,
    "--file",
    sourceDir
      ? resolve(sourceDir, `${slug}.pdf`)
      : resolve(root, "attached_assets", filename),
    "--content-type",
    "application/pdf",
    remote ? "--remote" : "--local",
  ];
  console.log(`${remote ? "Uploading" : "Local upload"}: guides/${slug}.pdf`);
  const result = spawnSync("pnpm", command, { cwd: root, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
