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
  const browser = await chromium.launch({
    executablePath: process.env.PW_CHROMIUM_PATH || undefined,
    args: process.env.PW_NO_SANDBOX ? ['--no-sandbox'] : [],
  });
  const page = await browser.newPage();
  // 콘솔은 sweep이 이미 도는 페이지 로드에 얹는다 — 별도 브라우저 기동 없이 공짜다.
  // 판정(무엇이 결함인가)은 여기서 하지 않는다. gate.mjs `normalizeConsole`이 패턴을 안다.
  const consoleMessages = [];
  page.on('console', (m) => {
    const type = m.type();
    if (type === 'error' || type === 'warning') consoleMessages.push({ type, text: m.text().slice(0, 300) });
  });
  page.on('pageerror', (e) => consoleMessages.push({ type: 'pageerror', text: String(e).slice(0, 300) }));
  const measurements = [];
  for (const route of routes) {
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(baseUrl + route, { waitUntil: 'load' });
      await page.waitForTimeout(500); // 차트/폰트 렌더 안정화 (dev HMR 소켓 때문에 networkidle 대신 load 사용)
      const m = await page.evaluate(() => {
        const doc = document.documentElement;
        const els = [...document.querySelectorAll('table, [class*="overflow-x"]')];
        // 텍스트를 직접 가진 요소의 계산된 굵기 — 클래스가 없어 preflight 400으로 그려지는
        // 본문까지 포함된다. 소스에서 클래스를 세는 방식이 놓치던 바로 그 값이다.
        //
        // SVG 안은 뺀다. `/catalog`을 재보니 700이 하나 더 잡혔는데 출처가 생성형 로고의
        // `<text>` 글자꼴이었다 — `font-weight` 속성을 자기가 들고 있다. 정본 §3의 "웨이트
        // 정확히 3종"은 "위계는 크기·자간·색으로 만든다"는 맥락이라 **타이포 위계**를 말하고,
        // 로고 글자꼴은 일러스트다. 안 빼면 SVG를 그린 작품만 규칙을 어긴 것처럼 읽힌다.
        const weights = [...document.querySelectorAll('body *')]
          .filter((el) => !el.closest('svg'))
          .filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()))
          .map((el) => Number(getComputedStyle(el).fontWeight))
          .filter((n) => Number.isFinite(n));
        return {
          fontWeights: [...new Set(weights)],
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
  // 배열에 부가 채널을 얹는다 — `evaluateSweep(measurements)` 시그니처를 그대로 두기 위해서다.
  // 소비처는 gate.mjs 하나이고, 거기서 `.consoleMessages`를 읽어 별도 관문으로 정규화한다.
  measurements.consoleMessages = consoleMessages;
  measurements.fontWeights = [...new Set(measurements.flatMap((m) => m.fontWeights ?? []))];
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
