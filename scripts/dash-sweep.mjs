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

/**
 * Focus must be visible, and only a render can say whether it is.
 *
 * `page-brief-core` §2 forbids a bare `outline-none`, and nothing measured it: the static rules do
 * not know the class, and Lighthouse does not audit focus visibility (it is a manual check). Eleven
 * works shipped a search input that removed the outline and put nothing back — `/dash/d32`'s topbar
 * field scored a11y 100 while a keyboard user had no way to tell it was focused.
 *
 * A static rule cannot settle this. The indicator is frequently on an **ancestor** (`focus-within`
 * on the search row) or drawn from **component state** (an SVG segment that paints its own highlight
 * from an `onFocus` handler). Both are correct, and both are invisible to a check that reads one
 * element's class list — the first attempt at exactly that reported fourteen violations of which
 * three were false. So the question is asked of the browser instead, which sweep already has open.
 *
 * `before`/`after` are a *signature of visible paint* — outline plus the non-transparent box-shadow
 * segments — across the element and three ancestors. Two earlier shapes of this check were wrong and
 * both failed the same way, by scoring something that does not depend on focus:
 *
 * - **"is a ring present?"** passed every palette input on the dialog's own `shadow-xl`.
 * - **"did any computed value change?"** failed working buttons, because `outline-width` flips
 *   3px→1px on focus while `outline-style` stays `none` — a change that paints nothing.
 * - **"is a ring present *now* but not before?"** still failed buttons carrying `shadow-sm`, whose
 *   permanent drop shadow reads as a ring at both ends.
 *
 * Signatures fix all three: the drop shadow appears in `before` and `after` alike and cancels, while
 * a focus ring adds a segment that was not there. The rule is that the visible paint must *differ*
 * and the focused state must be non-empty.
 */
export function evaluateFocus(measurements) {
  const failures = [];
  for (const m of measurements) {
    // 포커스 링은 뷰포트 폭에 걸리지 않는다. 폭마다 재면 같은 결함을 여섯 번 보고한다.
    if (m.width !== 1440) continue;
    for (const f of m.focusables ?? []) {
      const painted = String(f.after ?? '').replace(/[#~]/g, '') !== '';
      if (painted && f.after !== f.before) continue;
      // `button#10` 같은 DOM 순서만 주면 designer 가 소스에서 그 요소를 못 찾는다 — 1-fix 루프에
      // 넘어가는 값은 행동으로 옮길 수 있어야 한다. 라벨과 클래스 앞머리를 함께 싣는다.
      const state = f.state ?? 'default';
      const hint = [f.label && `"${f.label}"`, f.cls && `class="${f.cls}"`].filter(Boolean).join(' ');
      // 상태를 열어 재기 시작하면 "어디서 났나"가 없으면 designer 가 재현을 못 한다.
      failures.push({ route: m.route, width: m.width, kind: 'focus-invisible', sel: f.sel, state, label: f.label, cls: f.cls,
        detail: `[${state}] 포커스해도 보이는 표시가 생기지 않는다${hint ? ` — ${hint}` : ''} · outline-none 을 걸었으면 링을 함께 준다 (page-brief-core §2)` });
    }
  }
  return { pass: failures.length === 0, failures };
}

/**
 * 상태를 하나 열고, **그 상태에서 새로 나타난** 포커스 가능 요소만 잰다.
 *
 * 기존 요소를 다시 재지 않는 것이 핵심이다 — 기본 뷰에서 이미 통과한 것을 상태마다 반복 보고하면
 * 같은 결함이 여러 줄로 불어나 어느 것이 새 정보인지 알 수 없게 된다.
 *
 * 되돌리기(`revert`)는 팔레트처럼 닫을 수 있는 상태에만 준다. 뷰 토글은 되돌리지 않는다 — 다음
 * 토글이 그 위에서 열리는 것이 실제 사용 경로에 가깝고, 되돌리려다 클릭을 두 배로 늘릴 이유가 없다.
 */
async function probeState(page, state, open, revert) {
  const opened = await open();
  if (!opened) { if (revert) await revert(); return []; }
  await page.waitForTimeout(250);
  const fresh = await page.evaluate(() => {
    const F = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
    const out = [];
    let n = Number(document.body.getAttribute('data-sweep-next') || '1000');
    for (const el of document.querySelectorAll(F)) {
      if (el.hasAttribute('data-sweep-i')) continue;               // 기본 뷰에서 이미 잰 것
      if (!(el.offsetParent !== null || getComputedStyle(el).position === 'fixed')) continue;
      if (out.length >= 20) break;
      el.setAttribute('data-sweep-i', String(n));
      out.push({ sel: `${el.tagName.toLowerCase()}#${n}`,
        label: (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 44),
        cls: (el.getAttribute('class') || '').slice(0, 72),
        before: window.__sweepSig(el), after: null });
      n++;
    }
    document.body.setAttribute('data-sweep-next', String(n));
    return out;
  });
  if (!fresh.length) { if (revert) await revert(); return []; }
  const seen = new Map();
  for (let i = 0; i < fresh.length + 10 && seen.size < fresh.length; i++) {
    await page.keyboard.press('Tab');
    const hit = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const idx = el.getAttribute('data-sweep-i');
      return idx === null ? null : { idx: Number(idx), sig: window.__sweepSig(el) };
    });
    if (hit && !seen.has(hit.idx)) seen.set(hit.idx, hit.sig);
  }
  const out = fresh
    .map((f) => { const i = Number(f.sel.split('#')[1]); return seen.has(i) ? { ...f, after: seen.get(i), state } : null; })
    .filter(Boolean);
  if (revert) await revert();
  return out;
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
      const m = await page.evaluate(async () => {
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
        // 포커스 표시 실측. 요소를 실제로 포커스해 보고 **보이는** 링이 자기 자신이나 가까운
        // 조상에 새로 생기는지 본다. 판정은 여기서 하지 않는다 — `evaluateFocus`가 안다.
        const ringSig = (el) => {
          const paint = (n) => {
            const st = getComputedStyle(n);
            const ol = st.outlineStyle !== 'none' && parseFloat(st.outlineWidth) > 0
              ? `o:${st.outlineStyle}:${st.outlineWidth}:${st.outlineColor}` : '';
            // 보이는 그림자 조각만. 투명 조각과 0폭 조각은 서명에서 뺀다 — 그것들은 늘 있다.
            const sh = (st.boxShadow && st.boxShadow !== 'none' ? st.boxShadow : '')
              .split(/,(?![^(]*\))/)
              .filter((x) => !/rgba\(0, 0, 0, 0\)/.test(x) && !/0px 0px 0px 0px/.test(x))
              .join('|');
            // 포커스 표시는 링만이 아니다. 스킵 링크는 `sr-only`에서 풀려 **보이게** 되고, SVG 세그먼트는
            // `onFocus`가 세운 상태로 채움을 바꿔 그린다. 둘 다 정당한 표시인데 outline·box-shadow 만
            // 보면 거짓 위반이 된다 — 소급 스캔 39건 중 33건이 이 둘이었다. 포커스로 달라지는 픽셀을
            // 넓게 서명한다: 크기·위치·클립·배경·불투명도·변형, 그리고 SVG 채움까지.
            const box = n.getBoundingClientRect();
            return [ol, sh, st.backgroundColor, st.opacity, st.clipPath, st.position, st.transform,
              st.fill, st.stroke, st.strokeWidth, Math.round(box.width), Math.round(box.height)].join(':');
          };
          let n = el, out = [];
          for (let i = 0; i < 4 && n; i++, n = n.parentElement) out.push(paint(n));
          // 자식이 대신 그리는 경우(SVG 세그먼트 하이라이트)까지 본다.
          const kids = [...el.querySelectorAll('*')].slice(0, 20).map((k) => {
            const s2 = getComputedStyle(k);
            return [s2.fill, s2.stroke, s2.strokeWidth, s2.opacity, s2.backgroundColor].join(':');
          });
          return out.join('~') + '||' + kids.join('~');
        };
        // 여기서는 **미포커스 서명만** 뜬다. 포커스는 아래 Playwright 쪽에서 실제 Tab 으로 준다.
        const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
        const focusables = [];
        if (innerWidth === 1440) {
          [...document.querySelectorAll(FOCUSABLE)]
            .filter((el) => el.offsetParent !== null || getComputedStyle(el).position === 'fixed')
            .slice(0, 40)
            .forEach((el, i) => {
              el.setAttribute('data-sweep-i', String(i));
              focusables.push({
                sel: `${el.tagName.toLowerCase()}#${i}`,
                label: (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 44),
                cls: (el.getAttribute('class') || '').slice(0, 72),
                before: ringSig(el), after: null,
              });
            });
          window.__sweepSig = ringSig;
        }
        return {
          focusables,
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
      // 포커스는 **실제 Tab 으로** 준다. 스크립트 `el.focus()` 는 같은 요소에서도 `:focus-visible`
      // 스타일을 안 켜는 경우가 있어(`/dash/d31` 버튼과 `/dash/d37` SVG 가 그랬다 — Tab 으로는
      // `outline: solid 2px` 가 멀쩡히 나온다) 정상 작품을 위반으로 보고한다. 키보드 사용자가 하는
      // 그대로가 유일하게 믿을 수 있는 계측이다.
      if (width === 1440 && m.focusables?.length) {
        const seen = new Map();
        for (let i = 0; i < m.focusables.length + 8 && seen.size < m.focusables.length; i++) {
          await page.keyboard.press('Tab');
          const hit = await page.evaluate(() => {
            const el = document.activeElement;
            if (!el || el === document.body) return null;
            const idx = el.getAttribute('data-sweep-i');
            return idx === null ? null : { idx: Number(idx), sig: window.__sweepSig(el) };
          });
          if (hit && !seen.has(hit.idx)) seen.set(hit.idx, hit.sig);
        }
        // Tab 으로 도달 못 한 요소는 판정 대상이 아니다 — 키보드로 못 가는 것은 다른 결함이고,
        // 이 계측이 답할 질문이 아니다.
        m.focusables = m.focusables
          .map((f, i) => (seen.has(i) ? { ...f, after: seen.get(i), state: 'default' } : null))
          .filter(Boolean);

        // 기본 렌더 뷰만 스캔하면 **토글 뒤의 컨트롤은 영영 안 본다.** 2026-08-15·16 이틀 연속,
        // 서로 다른 경로로 그게 샜다 — `r14` 는 커맨드 팔레트 입력, `r15` 는 뷰 토글 뒤의 Table 필터.
        // 둘 다 게이트를 통과하고 judge 가 소스에서 잡았다. 그래서 상태를 열어서도 잰다.
        // 여는 것은 두 가지로 좁힌다: ⌘K 팔레트(Escape 로 되돌아온다)와 **켜는 방향의 토글**
        // (`aria-pressed="false"` / 선택 안 된 탭). 뷰를 바꾸는 컨트롤이라 파괴적이지 않다.
        m.focusables.push(...(await probeState(page, 'palette', async () => {
          await page.keyboard.press('Meta+k');
          await page.waitForTimeout(400);
          return page.evaluate(() => !!document.querySelector('[role="dialog"],[aria-modal="true"]'));
        }, () => page.keyboard.press('Escape'))));

        for (let t = 0; t < 6; t++) {
          const got = await probeState(page, `toggle:${t}`, async () => {
            return page.evaluate((t) => {
              // `.click()` 이 없는 요소가 있다 — `/dash/d37` 의 Sankey 는 SVG `rect`·`path` 에
              // `aria-pressed` 를 달아서, 거르지 않으면 프로브가 그 라우트에서 통째로 죽는다.
              const cands = [...document.querySelectorAll('[aria-pressed="false"],[role="tab"][aria-selected="false"]')]
                .filter((el) => el.offsetParent !== null && typeof el.click === 'function');
              const el = cands[0];
              if (!el) return false;
              el.setAttribute('data-sweep-toggled', String(t));
              el.click();
              return true;
            }, t);
          });
          if (!got.length && !(await page.evaluate(() => !!document.querySelector('[data-sweep-toggled]')))) break;
          m.focusables.push(...got);
        }
      }
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
