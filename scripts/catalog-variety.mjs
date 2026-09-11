/**
 * Measures the axes the loop was quietly holding constant.
 *
 * A 2026-08-01 audit found the catalogue varying page type, layout archetype and (for dashboards)
 * hue, while three axes barely moved: every one of 22 works used the same typeface, the landing
 * lineage reused one violet across six works, and dashboards were 11/12 light against landings at
 * 4/5 dark. None of that was visible from any single round — it only shows when you count across
 * the catalogue, which is what this does.
 *
 * The point is not to force variety for its own sake. It is to make "everything looks the same"
 * a number a round can read *before* it generates, instead of an impression someone reports weeks
 * later.
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Tailwind hue families we treat as an accent signal. Neutrals are excluded — they are the canvas. */
const HUES = ['indigo', 'violet', 'purple', 'blue', 'sky', 'cyan', 'teal', 'emerald', 'green',
  'lime', 'yellow', 'amber', 'orange', 'red', 'rose', 'pink', 'fuchsia'];

/** Hex accents in the house palette, mapped to a family so they compare against Tailwind hues. */
const HEX_FAMILIES = [
  [/#(6e56cf|7d67d6|a894f7|8052ff|9169ff)/i, 'violet-hex'],
  [/#(0369a1|2563eb)/i, 'blue-hex'],
  [/#(2dd4bf|34d399)/i, 'teal-hex'],
];

/**
 * 캔버스가 밝은가 어두운가.
 *
 * **불투명도 모디파이어가 붙은 배경은 세지 않는다.** `\b`는 `/` 앞에서 성립하므로 예전 정규식은
 * `bg-white/5`를 "라이트 캔버스"로 셌는데, 그건 다크 UI의 반투명 보더·호버 오버레이 관용구다
 * (`border-white/10`은 dash 브리프가 다크 테마에 명시한 것이다). 반대쪽도 같아서 `bg-black/20`
 * 류가 다크로 셌다 — **오버레이는 어느 쪽이든 캔버스가 아니다.**
 *
 * 2026-08-14 실측으로 잡았다: 스크린샷 픽셀 평균 휘도를 진실로 두고 41작품을 채점하니 옛 정규식이
 * **36/41**, 이 정규식이 **40/41**이었다(나머지 1건은 아래 `walk`의 스코프 결함이었다). 계측이
 * 틀린 채로 `banList`가 다음 라운드의 회피 축을 계산하고 있었다 — [[questions-queue]] Q26.
 */
export function themeOf(src) {
  const dark = (src.match(/bg-(?:zinc|neutral|slate|gray|stone)-(?:900|950)(?![\w/])|bg-black(?![\w/])|bg-\[#0[0-9a-f]{5}\]/gi) || []).length;
  const light = (src.match(/bg-white(?![\w/])|bg-(?:zinc|neutral|slate|gray|stone)-(?:50|100)(?![\w/])/gi) || []).length;
  if (dark === 0 && light === 0) return 'unknown';
  return dark > light ? 'dark' : 'light';
}

/* ───────── 임의 hex → Tailwind 계열 (2026-09-12 신설) ─────────
 *
 * **액센트 축이 과소 계수되고 있었다.** 판별이 Tailwind 클래스명과 hex 허용목록 3줄만 봤는데,
 * designer 가 **정확한 Tailwind 값을 임의 hex 로** 쓰면(`text-[#0F766E]`) 하나도 못 잡아 `none`
 * 으로 읽혔다 — 2026-09-01 실측에서 `none` 4건 중 **3건이 오판**이었다(`v13` `#0F766E`=teal-700 ·
 * `v14` `#22d3ee`=cyan-400 · `v17` `#047857`=emerald-700). 이 분포에서 designer 에게 주는
 * **금지 축이 계산되므로**, 틀린 수치 위에서 라운드가 돌고 있었다.
 *
 * 팔레트를 손으로 옮겨 적으면 Tailwind 가 바뀔 때 조용히 갈라지므로 **설치된 패키지의
 * `theme.css` 에서 읽는다**(286 토큰). 비교는 OKLab 최근접 — Tailwind v4 가 색을 OKLCH 로
 * 정의하므로 같은 공간에서 재는 것이 맞고, 톤이 달라도 계열은 안 흔들린다.
 * 집 색(`HEX_FAMILIES`)은 그대로 우선한다 — 역사 계열(`violet-hex` 등)을 보존해 주간 비교가
 * 끊기지 않게 한다.
 */
const NEUTRAL = new Set(['gray', 'zinc', 'neutral', 'slate', 'stone', 'black', 'white']);

function loadTailwindPalette() {
  const out = [];
  try {
    const dir = dirname(createRequire(import.meta.url).resolve('tailwindcss/package.json', { paths: [join(ROOT, 'app')] }));
    const css = readFileSync(join(dir, 'theme.css'), 'utf8');
    for (const m of css.matchAll(/--color-([a-z]+)-(\d+):\s*oklch\(([\d.]+)%?\s+([\d.]+)\s+([\d.]+)/gi)) {
      const [, hue, , L, C, H] = m;
      if (NEUTRAL.has(hue) || !HUES.includes(hue)) continue;
      const rad = (Number(H) * Math.PI) / 180;
      out.push({ hue, L: Number(L) / 100, a: Number(C) * Math.cos(rad), b: Number(C) * Math.sin(rad) });
    }
  } catch { /* 팔레트를 못 읽으면 hex 매칭을 건너뛴다 — 기존 동작으로 안전하게 물러난다 */ }
  return out;
}
const PALETTE = loadTailwindPalette();

/** sRGB hex → OKLab. Björn Ottosson 공식. */
function hexToOklab(hex) {
  const v = (i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const r = v(1), g = v(3), b2 = v(5);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b2);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b2);
  const s2 = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b2);
  return {
    L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s2,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s2,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s2,
  };
}

/** 임의 hex 가 어느 Tailwind 계열인가. 채도가 낮으면 액센트가 아니다(중립 표면). */
export function hueOfHex(hex) {
  if (!PALETTE.length) return null;
  const c = hexToOklab(hex);
  if (Math.hypot(c.a, c.b) < 0.04) return null;
  let best = null, bestD = Infinity;
  for (const p of PALETTE) {
    const d = (p.L - c.L) ** 2 + (p.a - c.a) ** 2 + (p.b - c.b) ** 2;
    if (d < bestD) { bestD = d; best = p.hue; }
  }
  return best;
}

export function accentOf(src) {
  const counts = new Map();
  for (const hue of HUES) {
    const n = (src.match(new RegExp(`\\b(?:bg|text|border|ring|fill|stroke)-${hue}-\\d{3}\\b`, 'g')) || []).length;
    if (n) counts.set(hue, n);
  }
  const houseHit = new Set();
  for (const [re, family] of HEX_FAMILIES) {
    const hits = src.match(new RegExp(re.source, 'gi')) || [];
    if (hits.length) { counts.set(family, (counts.get(family) || 0) + hits.length); for (const h of hits) houseHit.add(h.toLowerCase()); }
  }
  // 집 색 목록에 없는 임의 hex 는 팔레트 최근접으로 계열을 매긴다.
  for (const m of src.matchAll(/#[0-9a-f]{6}\b/gi)) {
    if (houseHit.has(m[0].toLowerCase())) continue;
    const hue = hueOfHex(m[0]);
    if (hue) counts.set(hue, (counts.get(hue) || 0) + 1);
  }
  if (!counts.size) return 'none';
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

export function displayFaceOf(src) {
  const m = src.match(/--font-display-(grotesk|wide|mono)/);
  return m ? m[1] : 'pretendard';
}

/**
 * What the next round should avoid, given the recent ones.
 *
 * A theme is banned after `themeRun` consecutive uses. That was three, and three never fired: the
 * `variety` field only started being recorded on 2026-08-01, so a three-round history did not exist
 * yet and two dark works shipped back to back with nothing in the way. Two is the right number
 * regardless — with essentially two themes in play, a third round is not evidence of a rut, it *is*
 * the rut. Consecutive, not a tally: a theme that alternates is doing its job.
 *
 * Accents and faces are banned at two or more uses in the window rather than consecutively, because
 * there are many of each and repeating one at all already narrows the field.
 */
export function banList(recent, window = 3, themeRun = 2) {
  const slice = recent.slice(0, window);
  const tally = (key) => slice.reduce((m, r) => m.set(r[key], (m.get(r[key]) || 0) + 1), new Map());
  // Rounds from before the field existed carry no theme. Reading two of those as "the same theme
  // twice" would ban `undefined` and leave the real axis unconstrained.
  const run = recent.slice(0, themeRun);
  const first = run[0]?.theme;
  const theme = run.length >= themeRun && first && first !== 'unknown' && run.every((r) => r.theme === first)
    ? [first]
    : [];
  const pick = (key, min) => [...tally(key).entries()].filter(([k, n]) => n >= min && k !== 'none').map(([k]) => k);
  return { theme, accent: pick('accent', 2), face: pick('face', 2) };
}

/** Reads one work directory into its three axes. */
export function readWork(dir) {
  const src = walk(dir).map((f) => readFileSync(f, 'utf8')).join('\n');
  return { theme: themeOf(src), accent: accentOf(src), face: displayFaceOf(src) };
}

/**
 * 이 라우트에 **속한** 파일만 모은다.
 *
 * 하위 라우트 디렉토리(자기 `page.tsx`를 가진 것)로 내려가지 않는다. 예전에는 무조건 재귀해서
 * 챔피언 `/`(= `app/src/app/(marketing)`)가 **v6~v11 여섯 개 다크 형제의 소스를 함께 읽었고**,
 * `/dash`는 13개를 읽었다 — 부모의 판독이 자식들로 오염된다. 2026-08-14 실측에서 `/`가 픽셀
 * 휘도 0.862(명백한 라이트)인데 dark 로 읽힌 원인이 이것이었다.
 */
function walk(dir, isRoot = true) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      // 라우트 그룹 `(x)`·비공개 `_x` 는 URL 세그먼트를 만들지 않으므로 이 라우트의 일부다.
      const ownsRoute = existsSync(join(p, 'page.tsx')) && !name.startsWith('(') && !name.startsWith('_');
      if (!ownsRoute) out.push(...walk(p, false));
    } else if (/\.tsx?$/.test(p)) out.push(p);
  }
  return out;
}

/**
 * Every route the app serves, mapped to the directory that implements it.
 *
 * Route groups (`(marketing)`) and private folders (`_x`) contribute no URL segment, which is why
 * the champion at `/` lives under `app/src/app/(marketing)/page.tsx`.
 */
export function routeMap(appRoot = 'app/src/app') {
  const out = new Map();
  const descend = (dir, segs) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (!statSync(p).isDirectory()) continue;
      const next = name.startsWith('(') || name.startsWith('_') ? segs : [...segs, name];
      if (existsSync(join(p, 'page.tsx'))) out.set('/' + next.join('/'), p);
      descend(p, next);
    }
  };
  descend(appRoot, []);
  return out;
}

if (process.argv[1] && process.argv[1].endsWith('catalog-variety.mjs')) {
  // The set of works comes from `works.ts`, never from a list kept here. The hand-kept version
  // silently went stale the moment a new page type was promoted: on 2026-08-02 it was still
  // reporting 20 works with `face: pretendard 20` while `/catalog` (grotesk) and `/scene` (wide)
  // were already live, and it was counting `/motion-pilot`, which is a reference and not in the
  // catalogue at all. A diversity number that cannot see the newest work is worse than none —
  // every judgement built on it is wrong in the direction of "nothing changed".
  const src = readFileSync('app/src/lib/works.ts', 'utf8');
  const routes = [...src.matchAll(/route: "([^"]+)"/g)].map((m) => m[1]);
  const map = routeMap();
  const works = [];
  for (const r of routes) {
    const d = map.get(r);
    // Native works are React Native under `native/`, not app routes — they have no directory here
    // and are measured by the native loop instead.
    if (d && walk(d).length) works.push([r === '/' ? '(champion)' : r.replace(/^\//, ''), d]);
  }
  const rows = works.map(([name, d]) => ({ name, ...readWork(d) }));
  const count = (k) => rows.reduce((m, r) => m.set(r[k], (m.get(r[k]) || 0) + 1), new Map());
  const fmt = (m) => [...m.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · ');
  console.log(JSON.stringify({
    works: rows.length,
    theme: Object.fromEntries(count('theme')),
    accent: Object.fromEntries(count('accent')),
    face: Object.fromEntries(count('face')),
    summary: { theme: fmt(count('theme')), accent: fmt(count('accent')), face: fmt(count('face')) },
    rows,
  }, null, 1));
}
