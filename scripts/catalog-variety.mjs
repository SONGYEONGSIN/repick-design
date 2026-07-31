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
import { join } from 'node:path';

/** Tailwind hue families we treat as an accent signal. Neutrals are excluded — they are the canvas. */
const HUES = ['indigo', 'violet', 'purple', 'blue', 'sky', 'cyan', 'teal', 'emerald', 'green',
  'lime', 'yellow', 'amber', 'orange', 'red', 'rose', 'pink', 'fuchsia'];

/** Hex accents in the house palette, mapped to a family so they compare against Tailwind hues. */
const HEX_FAMILIES = [
  [/#(6e56cf|7d67d6|a894f7|8052ff|9169ff)/i, 'violet-hex'],
  [/#(0369a1|2563eb)/i, 'blue-hex'],
  [/#(2dd4bf|34d399)/i, 'teal-hex'],
];

export function themeOf(src) {
  const dark = (src.match(/bg-(?:zinc|neutral|slate|gray|stone)-(?:900|950)\b|bg-black\b|bg-\[#0[0-9a-f]{5}\]/gi) || []).length;
  const light = (src.match(/bg-white\b|bg-(?:zinc|neutral|slate|gray|stone)-(?:50|100)\b/gi) || []).length;
  if (dark === 0 && light === 0) return 'unknown';
  return dark > light ? 'dark' : 'light';
}

export function accentOf(src) {
  const counts = new Map();
  for (const hue of HUES) {
    const n = (src.match(new RegExp(`\\b(?:bg|text|border|ring|fill|stroke)-${hue}-\\d{3}\\b`, 'g')) || []).length;
    if (n) counts.set(hue, n);
  }
  for (const [re, family] of HEX_FAMILIES) {
    const n = (src.match(new RegExp(re.source, 'gi')) || []).length;
    if (n) counts.set(family, (counts.get(family) || 0) + n);
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
 * A theme is banned only when it has run `window` times unbroken — one repeat is a coincidence, a
 * clean sweep is a rut. Accents and faces are banned at two or more uses in the window, because
 * there are many of each and repeating one already narrows the field.
 */
export function banList(recent, window = 3) {
  const slice = recent.slice(0, window);
  const tally = (key) => slice.reduce((m, r) => m.set(r[key], (m.get(r[key]) || 0) + 1), new Map());
  const themes = tally('theme');
  const theme = slice.length >= window
    ? [...themes.entries()].filter(([, n]) => n === window).map(([t]) => t)
    : [];
  const pick = (key, min) => [...tally(key).entries()].filter(([k, n]) => n >= min && k !== 'none').map(([k]) => k);
  return { theme, accent: pick('accent', 2), face: pick('face', 2) };
}

/** Reads one work directory into its three axes. */
export function readWork(dir) {
  const src = walk(dir).map((f) => readFileSync(f, 'utf8')).join('\n');
  return { theme: themeOf(src), accent: accentOf(src), face: displayFaceOf(src) };
}

function walk(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (/\.tsx?$/.test(p)) out.push(p);
  }
  return out;
}

if (process.argv[1] && process.argv[1].endsWith('catalog-variety.mjs')) {
  const roots = ['app/src/app/dash', 'app/src/app/(marketing)'];
  const works = [];
  for (const r of roots) {
    if (!existsSync(r)) continue;
    for (const n of readdirSync(r)) {
      const d = join(r, n);
      if (statSync(d).isDirectory() && walk(d).length) works.push([n, d]);
    }
  }
  for (const extra of ['app/src/app/login', 'app/src/app/not-found-page', 'app/src/app/motion-pilot']) {
    if (existsSync(extra)) works.push([extra.replace('app/src/app/', ''), extra]);
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
