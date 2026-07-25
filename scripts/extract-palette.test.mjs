import { test } from "node:test";
import assert from "node:assert/strict";
import { oklchToHex, buildTailwindHexMap, extractPalette } from "./extract-palette.mjs";

test("oklchToHex: pure black and white are exact", () => {
  assert.equal(oklchToHex("oklch(0% 0 0)"), "#000000");
  assert.equal(oklchToHex("oklch(100% 0 0)"), "#ffffff");
});

test("oklchToHex: indigo-600 maps near #4f46e5", () => {
  const hex = oklchToHex("oklch(51.1% 0.262 276.966)");
  assert.match(hex, /^#[0-9a-f]{6}$/);
  // within ±20 per channel of the canonical indigo-600 (#4f46e5) — color space precision
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  assert.ok(Math.abs(r - 0x4f) <= 20 && Math.abs(g - 0x46) <= 20 && Math.abs(b - 0xe5) <= 20, `got ${hex}`);
});

test("buildTailwindHexMap: parses --color lines incl. black/white", () => {
  const css = `@theme {\n  --color-zinc-900: oklch(21% 0.006 285.885);\n  --color-white: #fff;\n  --color-black: #000;\n}`;
  const map = buildTailwindHexMap(css);
  assert.match(map["zinc-900"], /^#[0-9a-f]{6}$/);
  assert.equal(map["white"], "#ffffff");
  assert.equal(map["black"], "#000000");
});

test("extractPalette: counts color classes + raw hex, sorts by count, ignores non-color utilities", () => {
  const map = { "zinc-900": "#18181b", "indigo-600": "#4f46e5" };
  const src = `bg-zinc-900 text-zinc-900 text-sm border-2 text-indigo-600 style={{color:'#ff0000'}}`;
  const pal = extractPalette(src, map);
  const tokens = pal.map((p) => p.token);
  assert.deepEqual(pal[0], { token: "zinc-900", hex: "#18181b", count: 2 });
  assert.ok(tokens.includes("indigo-600"));
  assert.ok(tokens.includes("#ff0000"));
  assert.ok(!tokens.includes("sm") && !tokens.includes("2"));
});

test("extractPalette: caps at 12 entries", () => {
  const map = Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`c-${i}0`, `#0000${(i % 9) + 1}0`]));
  const src = Object.keys(map).map((k) => `bg-${k}`).join(" ");
  assert.ok(extractPalette(src, map).length <= 12);
});
