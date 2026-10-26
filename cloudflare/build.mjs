import { spawnSync } from "node:child_process";
import { readdirSync, statSync, rmSync, readFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const result = spawnSync(
  "pnpm",
  ["--filter", "@workspace/aivass-web", "run", "build"],
  {
    cwd: root,
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: "production",
      PORT: "5173",
      BASE_PATH: "/",
    },
  },
);
if (result.status !== 0) process.exit(result.status ?? 1);
const output = resolve(root, "artifacts/aivass-web/dist/public");
// The homepage uses hero-arch-living-web.mp4. The original 41 MB source
// video is unused and exceeds Cloudflare's per-asset 25 MiB limit.
rmSync(join(output, "videos/hero-arch-living.mp4"), { force: true });

function check(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      check(path);
      continue;
    }
    if (statSync(path).size > 25 * 1024 * 1024)
      throw new Error(`Cloudflare asset exceeds 25 MiB: ${path}`);
    if (
      entry.name.endsWith(".pdf") &&
      !path.startsWith(join(output, "samples") + "/") &&
      !path.startsWith(join(output, "downloads") + "/")
    ) {
      throw new Error(`Unexpected public PDF in deployment: ${path}`);
    }
    if (
      statSync(path).size < 1024 &&
      readFileSync(path, "utf8").startsWith(
        "version https://git-lfs.github.com/spec/v1",
      )
    ) {
      throw new Error(`Unresolved Git LFS pointer in deployment: ${path}`);
    }
  }
}
check(output);
console.log(
  "Cloudflare assets ready; private paid guides are not part of this directory.",
);
