// native/scripts/shot-evolve.mjs — ad-hoc screenshot helper for evolve rounds.
// The bare `npx playwright screenshot` CLI ignores PW_CHROMIUM_PATH and looks for its own
// pinned revision, which isn't installed in this sandbox. gate.mjs/capture-shots.mjs already
// launch via `chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH })` — this does
// the same, for the two native screenshot widths (390, 768).
import { chromium } from "playwright";

const url = process.argv[2];
const outPath = process.argv[3];
const width = Number(process.argv[4]);
const height = Number(process.argv[5] ?? 844);

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM_PATH || undefined,
  args: process.env.PW_NO_SANDBOX ? ["--no-sandbox"] : [],
});
const page = await browser.newPage({ viewport: { width, height } });
await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(1200);
await page.screenshot({ path: outPath });
await browser.close();
