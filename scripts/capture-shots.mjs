// scripts/capture-shots.mjs — judge screenshot capture.
//
// Replaces the one-shot `npx playwright screenshot` call the loop used to run per width. Two things
// that call could not do:
//   1. Scroll. A single frame at scroll 0 cannot show a work whose value is below the fold, and it
//      cannot show a scene that morphs with scroll position at all — judges were rating the first
//      viewport and nothing else.
//   2. Notice an empty page. A candidate can clear every hard gate (static / sweep / a11y / perf)
//      while painting nothing — e.g. a background layer covering the canvas. Nothing in the pipeline
//      looked at the pixels, so this shipped silently.
//
// The capture therefore does a scroll-through pass first (to trigger in-view reveals), then captures
// each requested scroll position, and reports a blankness verdict per frame.

import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

export const DEFAULT_WIDTHS = [1280, 1440, 1920, 390];
export const DEFAULT_SCROLLS = [0, 0.35, 0.7, 1];

export function parseArgs(argv) {
  const out = {
    base: "http://localhost:3100", route: null, name: null, out: null,
    widths: [...DEFAULT_WIDTHS], scrolls: [...DEFAULT_SCROLLS], height: 900,
  };
  const list = (i) => {
    const vals = [];
    while (argv[i + 1] && !argv[i + 1].startsWith("--")) vals.push(Number(argv[++i]));
    return { vals, i };
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--base") out.base = argv[++i];
    else if (a === "--route") out.route = argv[++i];
    else if (a === "--name") out.name = argv[++i];
    else if (a === "--out") out.out = argv[++i];
    else if (a === "--height") out.height = Number(argv[++i]);
    else if (a === "--widths") { const r = list(i); out.widths = r.vals; i = r.i; }
    else if (a === "--scrolls") { const r = list(i); out.scrolls = r.vals; i = r.i; }
  }
  return out;
}

/**
 * Frame 0 keeps the historical `<name>-<width>.png` filename so existing DECISION notes and the
 * falsify PR's "승자 대표샷" links keep resolving; extra scroll frames get an `-sNN` suffix.
 */
export function shotName(name, width, fraction, index) {
  if (index === 0) return `${name}-${width}.png`;
  return `${name}-${width}-s${Math.round(fraction * 100)}.png`;
}

/** Fractions → absolute scroll offsets. A page shorter than the viewport yields all zeros. */
export function scrollPlan(fractions, pageHeight, viewportHeight) {
  const max = Math.max(0, pageHeight - viewportHeight);
  return fractions.map((f) => Math.round(max * f));
}

/**
 * Blankness verdict for one captured frame.
 * `distinct` = number of distinct sampled colours, `nonBgRatio` = share of samples differing from
 * the most common colour. A frame that is one flat colour is almost certainly a rendering failure.
 */
export function classifyFrame({ distinct, nonBgRatio }) {
  const blank = distinct <= 4 || nonBgRatio < 0.01;
  return { blank, distinct, nonBgRatio };
}

/**
 * Measures the captured frame's actual pixels by decoding the PNG back inside the browser.
 *
 * An earlier version sampled `elementFromPoint` + computed styles instead. That reads DOM structure,
 * not paint — it is blind to canvas/WebGL output, which is precisely the case this check exists for,
 * and it false-flagged text-sparse frames. Pixels are the only honest signal here.
 */
export async function measureFrame(page, pngBuffer) {
  const dataUrl = `data:image/png;base64,${pngBuffer.toString("base64")}`;
  return page.evaluate(async (url) => {
    const img = new Image();
    img.src = url;
    await img.decode();
    const W = 120, H = 68;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, W, H);
    const d = ctx.getImageData(0, 0, W, H).data;
    const counts = new Map();
    for (let i = 0; i < d.length; i += 4) {
      // Quantise to 5 bits per channel so compression noise does not read as colour variety.
      const key = ((d[i] >> 3) << 10) | ((d[i + 1] >> 3) << 5) | (d[i + 2] >> 3);
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    const total = (d.length / 4) | 0;
    let top = 0;
    for (const n of counts.values()) if (n > top) top = n;
    return { distinct: counts.size, nonBgRatio: total ? 1 - top / total : 0 };
  }, dataUrl);
}

export async function capture(opts, chromium) {
  const { base, route, name, out, widths, scrolls, height } = opts;
  mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({
    executablePath: process.env.PW_CHROMIUM_PATH || undefined,
    args: ["--no-sandbox", "--use-gl=angle", "--enable-unsafe-swiftshader"],
  });
  const frames = [];
  const errors = [];
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height } });
    // Pin any clock-driven idle motion before the page's first frame. A scene may animate at rest
    // for a visitor, but a judge compares screenshots across rounds — two captures of the same
    // commit have to be byte-identical, so the clock is frozen here rather than left running.
    await page.addInitScript(() => { window.__SPECIMEN_FREEZE__ = true; });
    page.on("pageerror", (e) => errors.push(`${width}: ${e.message.slice(0, 120)}`));
    await page.goto(base + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);

    // Scroll-through pass: walk the page once so in-view reveals fire before any frame is captured.
    // `document.body.scrollHeight`, not `document.documentElement.scrollHeight` — on a viewport-locked
    // shell (`h-dvh overflow-hidden` root, only an inner region scrolls) this Chromium build has been
    // observed reporting `documentElement.scrollHeight` well beyond the page's real, rendered extent
    // (offsetHeight/clientHeight/computed height all agree on the true size; only that one metric
    // diverges) while `body.scrollHeight` matches the true size correctly. Scrolling to a fraction of
    // the inflated value scrolls the window past all real content into blank space, which the
    // blank-frame check then (correctly) flags — but the page itself has no defect. `body.scrollHeight`
    // is the reliable source for both this and the ordinary long-scrolling case, where the two agree.
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < pageHeight; y += Math.round(height * 0.6)) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(90);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    const offsets = scrollPlan(scrolls, pageHeight, height);
    for (let i = 0; i < offsets.length; i++) {
      // Identical offsets (short page) would produce duplicate frames — capture the top one only.
      if (i > 0 && offsets[i] === offsets[i - 1]) continue;
      await page.evaluate((v) => window.scrollTo(0, v), offsets[i]);
      await page.waitForTimeout(700);
      const file = join(out, shotName(name, width, scrolls[i], i));
      const buf = await page.screenshot({ path: file });
      const stats = await measureFrame(page, buf);
      frames.push({ file, width, scroll: scrolls[i], ...classifyFrame(stats) });
    }
    await page.close();
  }
  await browser.close();
  const blanks = frames.filter((f) => f.blank);
  return { pass: blanks.length === 0 && errors.length === 0, frames, blanks, errors };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.route || !opts.name || !opts.out) {
    console.error("usage: node scripts/capture-shots.mjs --route <url path> --name <a|b|c> --out <dir> [--widths ...] [--scrolls ...]");
    process.exit(2);
  }
  const { chromium } = await import(join(dirname(fileURLToPath(import.meta.url)), "..", "app", "node_modules", "playwright", "index.mjs"))
    .catch(() => import("playwright"));
  const verdict = await capture(opts, chromium);
  console.log(JSON.stringify(verdict, null, 2));
  process.exit(verdict.pass ? 0 : 1);
}
