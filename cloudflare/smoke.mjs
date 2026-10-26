import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdirSync, mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { createServer } from "node:net";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const root = fileURLToPath(new URL("../", import.meta.url));
const cli = join(root, "node_modules/wrangler/bin/wrangler.js");
mkdirSync(join(root, ".wrangler"), { recursive: true });
const temp = mkdtempSync(join(root, ".wrangler/smoke-"));
const state = join(temp, "state");
const fixture = join(temp, "guide.pdf");
writeFileSync(fixture, "%PDF-1.7\nLocal runtime test fixture");
const options = {
  cwd: root,
  env: { ...process.env, CI: "true", WRANGLER_SEND_METRICS: "false" },
};
async function run(args) {
  const child = spawn(process.execPath, args, options);
  let output = "";
  child.stdout.on("data", (data) => {
    output += data;
  });
  child.stderr.on("data", (data) => {
    output += data;
  });
  const [code] = await once(child, "exit");
  assert.equal(code, 0, output);
  return output;
}
await run([
  cli,
  "d1",
  "migrations",
  "apply",
  "aivass-store",
  "--local",
  "--persist-to",
  state,
]);
await run([
  cli,
  "r2",
  "object",
  "put",
  "aivass-guides/guides/eb1a-master.pdf",
  "--file",
  fixture,
  "--local",
  "--persist-to",
  state,
]);
await run([
  cli,
  "d1",
  "execute",
  "aivass-store",
  "--local",
  "--persist-to",
  state,
  "--command",
  `INSERT INTO download_tokens(token,guide_slug,buyer_email,expires_at,created_at) VALUES ('runtime-smoke','eb1a-master','test@example.com',${Date.now() + 3600000},${Date.now()})`,
]);
const socket = createServer();
socket.listen(0, "127.0.0.1");
await once(socket, "listening");
const port = socket.address().port;
await new Promise((resolve) => socket.close(resolve));
const server = spawn(
  process.execPath,
  [
    cli,
    "dev",
    "--local",
    "--ip",
    "127.0.0.1",
    "--port",
    String(port),
    "--persist-to",
    state,
  ],
  { ...options, detached: true },
);
let logs = "";
server.stdout.on("data", (data) => {
  logs = (logs + data).slice(-20000);
});
server.stderr.on("data", (data) => {
  logs = (logs + data).slice(-20000);
});
const base = `http://127.0.0.1:${port}`;
try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null) throw new Error(logs);
    try {
      const response = await fetch(`${base}/api/healthz`, {
        signal: AbortSignal.timeout(1000),
      });
      if (response.status === 200) {
        ready = true;
        break;
      }
    } catch {}
    await delay(300);
  }
  assert.ok(ready, logs);
  const home = await fetch(base);
  assert.equal(home.status, 200);
  assert.match(await home.text(), /AiVass/);
  const sample = await fetch(`${base}/samples/eb1a-master-sample.pdf`, {
    headers: { Range: "bytes=0-1023" },
  });
  assert.equal(sample.status, 206);
  assert.match(sample.headers.get("content-type"), /pdf/);
  assert.equal(
    new TextDecoder().decode((await sample.arrayBuffer()).slice(0, 5)),
    "%PDF-",
  );
  const tokenPath = `${base}/api/download/runtime-smoke`;
  const pdf = await fetch(tokenPath);
  assert.equal(pdf.status, 200);
  assert.equal(await pdf.text(), readFileSync(fixture, "utf8"));
  assert.equal(pdf.headers.get("x-attempts-remaining"), "2");
  assert.match(pdf.headers.get("cache-control"), /no-store/);
  const concurrent = await Promise.all(
    Array.from({ length: 5 }, () => fetch(tokenPath)),
  );
  assert.equal(
    concurrent.filter((response) => response.status === 200).length,
    2,
  );
  assert.equal(
    concurrent.filter((response) => response.status === 410).length,
    3,
  );
  for (const response of concurrent) await response.arrayBuffer();
  const missing = await fetch(`${base}/api/missing`);
  assert.equal(missing.status, 404);
  assert.match(missing.headers.get("content-type"), /json/);
  const route = await fetch(`${base}/articles/not-a-real-article`);
  assert.equal(route.status, 404);
  await run([
    join(root, "artifacts/aivass-web/scripts/validate-article-sharing.mjs"),
    "--live-only",
    `--base-url=${base}`,
  ]);
  console.log(
    "Cloudflare runtime smoke passed: static site, sample range requests, article HTTP/metadata checks, D1, R2 and concurrent download limits.",
  );
} finally {
  try {
    process.kill(-server.pid, "SIGTERM");
  } catch {}
  const killTimer = setTimeout(() => {
    try {
      process.kill(-server.pid, "SIGKILL");
    } catch {}
  }, 3000);
  killTimer.unref();
}
