// Run against the running preview: SAMPLE_TEST_URL=https://... node scripts/validate-guide-samples.mjs
// Chromium desktop + touch/mobile emulation; native iOS/Android PDF viewers need device testing.
import { chromium, devices } from "@playwright/test";
import assert from "node:assert/strict";

const base = process.env.SAMPLE_TEST_URL;
if (!base) throw new Error("Set SAMPLE_TEST_URL to the website preview URL (including its base path).");
const slugs = ["master", "business", "arts", "athletics", "education", "science"].map(s => `eb1a-${s}`);
const browser = await chromium.launch({ headless: true });
try {
  for (const mobile of [false, true]) {
    const context = await browser.newContext(mobile ? { ...devices["Pixel 7"] } : {});
    const page = await context.newPage();
    for (const slug of slugs) {
      const url = new URL(`samples/${slug}-sample.pdf`, base).href;
      const response = await context.request.get(url);
      assert.equal(response.status(), 200);
      assert.match(response.headers()["content-type"], /application\/pdf/);
      assert.equal((await response.body()).subarray(0, 5).toString(), "%PDF-");
      const partial = await context.request.get(url, { headers: { Range: "bytes=0-1023" } });
      assert.equal(partial.status(), 206);
    }
    // Observe native new-tab requests using small HTML responses. Do not rely
    // on headless Chromium's platform-specific built-in PDF viewer.
    let mode = "ok";
    let release;
    await context.route("**/samples/*-sample.pdf", async route => {
      if (mode === "slow") await new Promise(resolve => { release = resolve; });
      if (mode === "failed") return route.fulfill({ status: 503, contentType: "text/plain", body: "Sample temporarily unavailable" });
      await route.fulfill({ contentType: "text/html", body: "<p>PDF navigation received</p>" });
    });
    for (const path of ["guides", ...slugs.map(s => `guides/${s}`)]) {
      await page.goto(new URL(path, base).href);
      const links = page.getByRole("link", { name: "Free Sample ↗", exact: true });
      assert.equal(await links.count(), path === "guides" ? 6 : 1);
      for (let i = 0; i < await links.count(); i++) {
        const link = links.nth(i);
        const slug = path === "guides" ? slugs[i] : path.split("/")[1];
        assert.equal(await link.getAttribute("href"), new URL(`samples/${slug}-sample.pdf`, base).pathname);
        assert.equal(await link.getAttribute("target"), "_blank");
        const help = page.locator(`#sample-help-${slug}`);
        assert.match(await help.innerText(), /Slow or blank/);
        assert.equal(await help.locator("a").getAttribute("download"), "");
        const popupPromise = context.waitForEvent("page");
        if (mobile) await link.tap(); else await link.click();
        const popup = await popupPromise;
        await popup.waitForLoadState();
        assert.equal(new URL(popup.url()).pathname, new URL(`samples/${slug}-sample.pdf`, base).pathname);
        assert.equal(await link.textContent(), "Free Sample ↗");
        await popup.close();
      }
    }
    await page.goto(new URL("guides/eb1a-athletics", base).href);
    const link = page.getByRole("link", { name: "Free Sample ↗", exact: true });
    for (const activation of ["keyboard", "repeat", ...(!mobile ? ["middle", "control"] : [])]) {
      const opened = context.waitForEvent("page");
      if (activation === "keyboard") { await link.focus(); await page.keyboard.press("Enter"); }
      else if (activation === "middle") await link.click({ button: "middle" });
      else if (activation === "control") await link.click({ modifiers: ["Control"] });
      else await link.click();
      const popup = await opened;
      await popup.waitForLoadState();
      await popup.close();
    }
    mode = "slow";
    const delayed = context.waitForEvent("page");
    const requested = context.waitForEvent("request", request => request.url().endsWith("eb1a-athletics-sample.pdf"));
    await link.click();
    await requested;
    // Navigation starts while delivery is still held; no fake source spinner.
    assert.equal(await link.textContent(), "Free Sample ↗");
    assert(await page.locator("#sample-help-eb1a-athletics a").isVisible());
    while (!release) await new Promise(resolve => setTimeout(resolve, 10));
    release();
    const slowTab = await delayed;
    await slowTab.waitForLoadState();
    await slowTab.close();
    mode = "failed";
    const failed = context.waitForEvent("page");
    await link.click();
    const failedTab = await failed;
    await failedTab.waitForLoadState();
    assert.match(await failedTab.locator("body").innerText(), /unavailable/);
    await failedTab.close();
    assert.match(await page.locator("#sample-help-eb1a-athletics").innerText(), /try again/);
    // Recovery uses a real download anchor, not a popup or a JS blob.
    mode = "ok";
    const downloaded = page.waitForEvent("download");
    await page.locator("#sample-help-eb1a-athletics a").click();
    const download = await downloaded;
    assert.equal(await download.failure(), null);
    assert.equal(await page.getByRole("button", { name: "Purchase →", exact: true }).isEnabled(), true);
    console.log(`${mobile ? "Mobile touch emulation" : "Desktop"}: six PDFs, both entry points, activation, slow/failure recovery passed`);
    await context.close();
  }
} finally {
  await browser.close();
}
