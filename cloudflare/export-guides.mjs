import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

// The latest Replit sync correctly removed private source PDFs from the tree.
// Recover the existing copies from local Git history into an ignored directory,
// without re-adding them to the repository or the public web build.
const root = fileURLToPath(new URL("../", import.meta.url));
const target = resolve(root, ".local/cloudflare-guides");
const files = {
  "eb1a-master": "eb1a-master_1786386996458.pdf",
  "eb1a-business": "eb1a-business_1786386996457.pdf",
  "eb1a-arts": "eb1a-arts_1786386996458.pdf",
  "eb1a-athletics": "eb1a-athletics_1786386996457.pdf",
  "eb1a-education": "eb1a-education_1786386996457.pdf",
  "eb1a-science": "eb1a-science_1786386996458.pdf",
};
const recovered = [];
for (const [slug, filename] of Object.entries(files)) {
  const result = spawnSync(
    "git",
    ["show", `ecb74bb:attached_assets/${filename}`],
    { cwd: root, maxBuffer: 20 * 1024 * 1024 },
  );
  if (
    result.status !== 0 ||
    result.stdout.subarray(0, 5).toString() !== "%PDF-"
  ) {
    throw new Error(
      `Could not recover ${slug}. Use a full Git clone or export the current guide from Replit storage instead.`,
    );
  }
  recovered.push([slug, result.stdout]);
}
mkdirSync(target, { recursive: true });
for (const [slug, bytes] of recovered)
  writeFileSync(resolve(target, `${slug}.pdf`), bytes, { mode: 0o600 });
console.log(
  `Recovered six guide PDFs into ${target}. Review these versions before uploading; they are from the pre-migration Git history.`,
);
