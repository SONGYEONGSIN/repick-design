// scripts/extract-palette.mjs — deterministic palette extractor (authoring aid for G2 rich specs).
// Reads Tailwind v4 OKLCH theme + a work's source, emits ranked hex swatches.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const THEME_CSS = join(dirname(fileURLToPath(import.meta.url)), "..", "app", "node_modules", "tailwindcss", "theme.css");

// Utilities that carry a color value: bg-, text-, border-, ring-, from-, via-, to-, fill-, stroke-, outline-, decoration-, divide-, placeholder-, accent-, caret-, shadow-
const CLASS_RE = /\b(?:bg|text|border|ring|from|via|to|fill|stroke|outline|decoration|divide|placeholder|accent|caret|shadow)-([a-z]+)-(\d{2,3})\b/g;
const HEX_RE = /#[0-9a-fA-F]{6}\b/g;

function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
function gamma(c) { return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055; }
function toHex2(c) { return Math.round(clamp01(c) * 255).toString(16).padStart(2, "0"); }

export function oklchToHex(oklchStr) {
  const m = /oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)/i.exec(oklchStr);
  if (!m) throw new Error(`bad oklch: ${oklchStr}`);
  const L = parseFloat(m[1]) / 100, C = parseFloat(m[2]), H = (parseFloat(m[3]) * Math.PI) / 180;
  const a = C * Math.cos(H), b = C * Math.sin(H);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const l = l_ ** 3, mm = m_ ** 3, s = s_ ** 3;
  const r = 4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * mm + 1.7076147010 * s;
  return `#${toHex2(gamma(r))}${toHex2(gamma(g))}${toHex2(gamma(bl))}`;
}

function normHex(h) {
  const s = h.toLowerCase();
  if (/^#[0-9a-f]{3}$/.test(s)) return `#${s[1]}${s[1]}${s[2]}${s[2]}${s[3]}${s[3]}`;
  return s;
}

export function buildTailwindHexMap(themeCss) {
  const map = {};
  const re = /--color-([a-z]+(?:-\d{2,3})?):\s*(oklch\([^)]*\)|#[0-9a-fA-F]{3,6})/g;
  let m;
  while ((m = re.exec(themeCss))) {
    const name = m[1], val = m[2];
    map[name] = val.startsWith("#") ? normHex(val) : oklchToHex(val);
  }
  return map;
}

export function extractPalette(sourceText, hexMap) {
  const counts = new Map(); // token -> { hex, count }
  let m;
  CLASS_RE.lastIndex = 0;
  while ((m = CLASS_RE.exec(sourceText))) {
    const token = `${m[1]}-${m[2]}`;
    const hex = hexMap[token];
    if (!hex) continue;
    const e = counts.get(token) || { hex, count: 0 };
    e.count++; counts.set(token, e);
  }
  HEX_RE.lastIndex = 0;
  while ((m = HEX_RE.exec(sourceText))) {
    const token = normHex(m[0]);
    const e = counts.get(token) || { hex: token, count: 0 };
    e.count++; counts.set(token, e);
  }
  return [...counts.entries()]
    .map(([token, { hex, count }]) => ({ token, hex, count }))
    .sort((a, b) => b.count - a.count || a.token.localeCompare(b.token))
    .slice(0, 12);
}

function readSourceRecursive(dir) {
  let out = "";
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out += readSourceRecursive(p);
    else if (/\.(tsx|css)$/.test(name)) out += "\n" + readFileSync(p, "utf8");
  }
  return out;
}

// CLI
const scriptPath = fileURLToPath(import.meta.url);
const argv1Absolute = process.argv[1].startsWith('/') ? process.argv[1] : new URL(process.argv[1], import.meta.url).pathname;
if (scriptPath === argv1Absolute || scriptPath === process.argv[1]) {
  const dir = process.argv[2];
  if (!dir) { console.error("usage: node scripts/extract-palette.mjs <sourceDir>"); process.exit(1); }
  const hexMap = buildTailwindHexMap(readFileSync(THEME_CSS, "utf8"));
  console.log(JSON.stringify(extractPalette(readSourceRecursive(dir), hexMap), null, 2));
}
