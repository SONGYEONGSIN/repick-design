import { pathToFileURL } from 'node:url';

export const DESKTOP_WIDTHS = [1280, 1366, 1440, 1536, 1680, 1920];
export const MOBILE_WIDTHS = [390];
export const SLACK = 16; // 클래식 스크롤바(-15px) + 여유폭 ≥16px 규칙

export function sweepWidths() {
  const set = new Set(MOBILE_WIDTHS);
  for (const w of DESKTOP_WIDTHS) {
    set.add(w);
    set.add(w - SLACK);
  }
  return [...set].sort((a, b) => a - b);
}

export function evaluateSweep(measurements) {
  const failures = [];
  for (const m of measurements) {
    const mobile = m.width < 768;
    if (m.scrollWidth > m.clientWidth) {
      failures.push({ route: m.route, width: m.width, kind: 'page-overflow', by: m.scrollWidth - m.clientWidth, sel: null });
    }
    if (!mobile) {
      for (const t of m.tables ?? []) {
        if (t.scrollWidth > t.clientWidth) {
          failures.push({ route: m.route, width: m.width, kind: 'table-overflow', by: t.scrollWidth - t.clientWidth, sel: t.sel });
        }
      }
    }
  }
  return { pass: failures.length === 0, failures };
}

export async function runSweep(baseUrl, routes, widths = sweepWidths()) {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined });
  const page = await browser.newPage();
  const measurements = [];
  for (const route of routes) {
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(baseUrl + route, { waitUntil: 'load' });
      await page.waitForTimeout(500); // 차트/폰트 렌더 안정화 (dev HMR 소켓 때문에 networkidle 대신 load 사용)
      const m = await page.evaluate(() => {
        const doc = document.documentElement;
        const els = [...document.querySelectorAll('table, [class*="overflow-x"]')];
        return {
          scrollWidth: doc.scrollWidth,
          clientWidth: doc.clientWidth,
          tables: els.map((el, i) => ({
            sel: `${el.tagName.toLowerCase()}#${i}`,
            scrollWidth: el.scrollWidth,
            clientWidth: el.clientWidth,
          })),
        };
      });
      measurements.push({ route, width, ...m });
    }
  }
  await browser.close();
  return measurements;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const args = process.argv.slice(2);
  const baseIdx = args.indexOf('--base');
  const routesIdx = args.indexOf('--routes');
  const base = baseIdx !== -1 ? args[baseIdx + 1] : undefined;
  const routes = routesIdx !== -1 ? args.slice(routesIdx + 1) : [];
  if (!base || base.startsWith('--') || routes.length === 0) {
    console.error('usage: node scripts/dash-sweep.mjs --base <url> --routes <route...>');
    process.exit(2);
  }
  const result = evaluateSweep(await runSweep(base, routes));
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.pass ? 0 : 1);
}
