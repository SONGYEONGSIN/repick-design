# Specimen Gallery G2 — Work Detail Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add refero-style per-work detail pages at `/gallery/[id]` — hero preview + design-system spec (palette, typography, Do/Don't) + Agent Prompt/DESIGN.md + More like this — powered by a hybrid pipeline (deterministic palette extractor + authored rich specs for a 15-work subset).

**Architecture:** A tested plain-JS palette extractor (`scripts/extract-palette.mjs`) parses Tailwind's OKLCH theme and a work's source files into hex swatches — used as an authoring aid. Authored rich specs (palette roles, philosophy, typography, Do/Don't, agent prompt) live in a JSON data file gated by a completeness test. A Next.js 16 dynamic server route (`/gallery/[id]`) looks each work up in a shared `catalogWorks()`, renders rich sections when a spec exists and a "Full spec coming soon" state otherwise, and hands lang/Copy interactivity to a client component that mirrors the existing gallery i18n pattern.

**Tech Stack:** Next.js 16.2.10 (App Router, React 19), Tailwind CSS v4 (default palette, OKLCH), TypeScript, Node.js built-in test runner (`node --test`).

## Global Constraints

- **Next.js 16 dynamic params are async:** `export default async function Page({ params }: { params: Promise<{ id: string }> })` then `const { id } = await params`. Same for `generateMetadata`. Read `app/node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md` before editing the route. (`app/AGENTS.md`: "This is NOT the Next.js you know.")
- **Tailwind v4 uses the default palette in OKLCH.** `app/src/app/globals.css` only overrides `--color-background`/`--color-foreground` + Pretendard fonts. Color classes (`bg-zinc-900`, `text-indigo-600`, …) resolve via `app/node_modules/tailwindcss/theme.css` (`--color-<name>-<shade>: oklch(...)`). Render palette swatches with inline `style={{ background: hex }}` — dynamically-constructed Tailwind classes are NOT generated at build.
- **Deep-spec content is English-only** (`philosophy`, `typography`, `dosDonts`, `agentPrompt`, palette `role`/`usage`). Page chrome (section headers, labels) is bilingual via `gallery-i18n.ts` (EN default + KO toggle, `localStorage` key `specimen-lang`).
- **Subset (exactly these 15 ids) get rich specs:** `d29 d30 d31 d32 d33 d34 d35 d36 d37 d38 v0 v6 v7 v8 n1`. All other catalog works render the "coming soon" state.
- **Determinism:** no `Date.now()`/`Math.random()`/`new Date()` in scripts. `LAST_UPDATED` in `works.ts` is edited by hand.
- **Tests:** `node --test "scripts/**/*.test.mjs"` from repo root (uses `node:test` + `node:assert`). Page/route correctness is verified with `cd app && npx next build` (no React component unit-test harness exists in this repo — do not add one).
- **Surgical scope:** touch only the files this plan names. Do NOT modify individual work routes (`app/src/app/dash/*`, `(marketing)/v*`, `free/*`), `scripts/gate.mjs`, `native/*`, or any `.claude/skills`. Do NOT restyle untouched files.
- **Copy rule:** all new user-facing copy in code/data is English (KO only where `gallery-i18n.ts` already pairs it).

---

### Task 1: Palette extractor (`scripts/extract-palette.mjs`)

A deterministic, tested extractor: OKLCH→hex conversion, a Tailwind color map built from `theme.css`, and palette extraction from source text. Pure functions + a thin CLI. This is an authoring aid for Tasks 5–8 (gives accurate hex per work); it is not imported by the app.

**Files:**
- Create: `scripts/extract-palette.mjs`
- Test: `scripts/extract-palette.test.mjs`

**Interfaces:**
- Produces (all exported from `scripts/extract-palette.mjs`):
  - `oklchToHex(oklchStr: string): string` — `"oklch(21% 0.006 285.885)"` → `"#18181b"`. Lowercase 6-digit hex.
  - `buildTailwindHexMap(themeCss: string): Record<string,string>` — keys like `"zinc-900"`, `"indigo-600"`, `"black"`, `"white"` → hex.
  - `extractPalette(sourceText: string, hexMap: Record<string,string>): { token: string; hex: string; count: number }[]` — Tailwind color classes + raw `#rrggbb` literals, deduped, sorted by `count` desc, capped at 12.
  - CLI: `node scripts/extract-palette.mjs <sourceDir>` reads `theme.css`, recursively reads `*.tsx`/`*.css` under `<sourceDir>`, prints `JSON.stringify(extractPalette(...), null, 2)`.

- [ ] **Step 1: Write the failing test**

Create `scripts/extract-palette.test.mjs`:

```js
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
  // within ±3 per channel of the canonical indigo-600 (#4f46e5)
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  assert.ok(Math.abs(r - 0x4f) <= 3 && Math.abs(g - 0x46) <= 3 && Math.abs(b - 0xe5) <= 3, `got ${hex}`);
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/extract-palette.test.mjs`
Expected: FAIL — `Cannot find module './extract-palette.mjs'`.

- [ ] **Step 3: Write the implementation**

Create `scripts/extract-palette.mjs`:

```js
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
if (import.meta.url === `file://${process.argv[1]}`) {
  const dir = process.argv[2];
  if (!dir) { console.error("usage: node scripts/extract-palette.mjs <sourceDir>"); process.exit(1); }
  const hexMap = buildTailwindHexMap(readFileSync(THEME_CSS, "utf8"));
  console.log(JSON.stringify(extractPalette(readSourceRecursive(dir), hexMap), null, 2));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/extract-palette.test.mjs`
Expected: PASS (5 tests).

- [ ] **Step 5: Smoke the CLI on a real work**

Run: `node scripts/extract-palette.mjs app/src/app/dash/d29`
Expected: JSON array of `{token,hex,count}` (e.g. `zinc-900`/`indigo-600` entries with valid hex). Non-empty.

- [ ] **Step 6: Commit**

```bash
git add scripts/extract-palette.mjs scripts/extract-palette.test.mjs
git commit -m "feat(g2): 결정론 팔레트 추출기 — OKLCH→hex + Tailwind 클래스/raw hex 스캔"
```

---

### Task 2: Spec schema, data model, shared catalog

The completeness gate (plain JS, testable) + the typed data surface the page imports + a shared `catalogWorks()` so the gallery and the detail route agree on the work list and category tagging.

**Files:**
- Create: `scripts/specimen-spec-schema.mjs`
- Test: `scripts/specimen-spec-schema.test.mjs`
- Create: `app/src/lib/specimen-specs.data.json`
- Create: `app/src/lib/specimen-specs.ts`
- Modify: `app/src/lib/works.ts` (append `catalogWorks()`)

**Interfaces:**
- Consumes: `Work` from `@/lib/works`.
- Produces:
  - `scripts/specimen-spec-schema.mjs`: `export const SUBSET_IDS = ["d29","d30","d31","d32","d33","d34","d35","d36","d37","d38","v0","v6","v7","v8","n1"];` and `export function validateSpec(spec): string[]` (returns list of problem strings; empty = valid).
  - `app/src/lib/specimen-specs.ts`: `export type Swatch = { token: string; hex: string; role: string; usage: string };` · `export type WorkSpec = { id: string; palette: Swatch[]; typography: string; spacing: string; philosophy: string; dosDonts: { do: string; dont: string }[]; agentPrompt: string };` · `export const SPECS: Record<string, WorkSpec>` · `export function getSpec(id: string): WorkSpec | undefined`.
  - `app/src/lib/works.ts`: `export function catalogWorks(): Work[]` — the four static arrays with `category` tagging (same as `gallery/page.tsx` inline, minus `evolveWorks()`).

- [ ] **Step 1: Write the failing schema test**

Create `scripts/specimen-spec-schema.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { SUBSET_IDS, validateSpec } from "./specimen-spec-schema.mjs";
import data from "../app/src/lib/specimen-specs.data.json" with { type: "json" };

test("SUBSET_IDS is exactly the 15 approved ids", () => {
  assert.equal(SUBSET_IDS.length, 15);
  assert.ok(SUBSET_IDS.includes("d29") && SUBSET_IDS.includes("v0") && SUBSET_IDS.includes("n1"));
});

test("validateSpec rejects an incomplete spec", () => {
  assert.ok(validateSpec({ id: "x", palette: [], dosDonts: [] }).length > 0);
});

test("validateSpec accepts a well-formed spec", () => {
  const good = {
    id: "x",
    palette: [{ token: "zinc-900", hex: "#18181b", role: "Ink", usage: "Primary text" },
      { token: "indigo-600", hex: "#4f46e5", role: "Accent", usage: "Primary actions" },
      { token: "zinc-200", hex: "#e4e4e7", role: "Border", usage: "Hairlines" }],
    typography: "Pretendard; oversized numeric KPIs.",
    spacing: "4/8 rhythm; 12px card radius.",
    philosophy: "Pure-white service-grade calm.",
    dosDonts: [{ do: "Keep one accent", dont: "Add a second hue" }, { do: "a", dont: "b" }, { do: "c", dont: "d" }],
    agentPrompt: "# Recreate\nBuild a pure-white dashboard...",
  };
  assert.deepEqual(validateSpec(good), []);
});

test("every spec present in the data file is well-formed", () => {
  for (const [id, spec] of Object.entries(data)) {
    assert.deepEqual(validateSpec(spec), [], `${id}: ${validateSpec(spec).join("; ")}`);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/specimen-spec-schema.test.mjs`
Expected: FAIL — cannot find `./specimen-spec-schema.mjs` (and the JSON).

- [ ] **Step 3: Create the empty data file**

Create `app/src/lib/specimen-specs.data.json`:

```json
{}
```

- [ ] **Step 4: Write the schema module**

Create `scripts/specimen-spec-schema.mjs`:

```js
// scripts/specimen-spec-schema.mjs — G2 rich-spec completeness gate (shared by tests).
export const SUBSET_IDS = ["d29", "d30", "d31", "d32", "d33", "d34", "d35", "d36", "d37", "d38", "v0", "v6", "v7", "v8", "n1"];

export function validateSpec(spec) {
  const errs = [];
  if (!spec || typeof spec !== "object") return ["not an object"];
  if (!Array.isArray(spec.palette) || spec.palette.length < 3) errs.push("palette needs >=3 swatches");
  else for (const s of spec.palette) {
    if (!/^#[0-9a-f]{6}$/.test(s?.hex || "")) errs.push(`bad hex: ${s?.hex}`);
    if (!s?.token || !s?.role || !s?.usage) errs.push("swatch missing token/role/usage");
  }
  for (const f of ["typography", "spacing", "philosophy", "agentPrompt"]) {
    if (typeof spec[f] !== "string" || spec[f].trim().length < 10) errs.push(`${f} too short`);
  }
  if (!Array.isArray(spec.dosDonts) || spec.dosDonts.length < 3) errs.push("dosDonts needs >=3");
  else for (const d of spec.dosDonts) if (!d?.do || !d?.dont) errs.push("dosDont missing do/dont");
  return errs;
}
```

- [ ] **Step 5: Run schema test to verify it passes**

Run: `node --test scripts/specimen-spec-schema.test.mjs`
Expected: PASS (4 tests; the "every spec present" test passes vacuously over `{}`).

- [ ] **Step 6: Write the typed data surface**

Create `app/src/lib/specimen-specs.ts`:

```ts
// app/src/lib/specimen-specs.ts — G2 per-work design-system specs (authored, English-only content).
import data from "./specimen-specs.data.json";

export type Swatch = { token: string; hex: string; role: string; usage: string };
export type WorkSpec = {
  id: string;
  palette: Swatch[];
  typography: string;
  spacing: string;
  philosophy: string;
  dosDonts: { do: string; dont: string }[];
  agentPrompt: string;
};

export const SPECS: Record<string, WorkSpec> = data as Record<string, WorkSpec>;

export function getSpec(id: string): WorkSpec | undefined {
  return SPECS[id];
}
```

- [ ] **Step 7: Add `catalogWorks()` to works.ts**

In `app/src/lib/works.ts`, append at end of file:

```ts
/** 정적 카탈로그(진화 후보 제외) — 갤러리 그리드 + 상세 라우트 공용. category 태깅 단일 출처. */
export function catalogWorks(): Work[] {
  return [
    ...LANDING_WORKS.map((w) => ({ ...w, category: "landing" as const })),
    ...DASH_WORKS.map((w) => ({ ...w, category: "dashboard" as const })),
    ...FREE_WORKS.map((w) => ({ ...w, category: "free" as const })),
    ...NATIVE_WORKS.map((w) => ({ ...w, category: "native" as const })),
  ];
}
```

- [ ] **Step 8: Rewire gallery/page.tsx to use `catalogWorks()`**

In `app/src/app/gallery/page.tsx`, change the import to add `catalogWorks` and replace the four inline `.map(...)` spreads. Replace:

```tsx
import { DASH_WORKS, FREE_WORKS, LANDING_WORKS, NATIVE_WORKS, LAST_UPDATED, type Work } from "@/lib/works";
```
with:
```tsx
import { catalogWorks, LAST_UPDATED, type Work } from "@/lib/works";
```
and replace the `works` assembly in `GalleryPage`:
```tsx
  const works: Work[] = [...catalogWorks(), ...evolveWorks()];
```
(Leave `evolveWorks()` and everything else unchanged. `evolveWorks` still references `parseLedger`/`candidateStatus`/fs — keep those imports.)

- [ ] **Step 9: Verify build + gallery unchanged**

Run: `cd app && npx next build`
Expected: build succeeds; `/gallery` still lists all works (catalog assembly is identical output to before).

- [ ] **Step 10: Commit**

```bash
git add scripts/specimen-spec-schema.mjs scripts/specimen-spec-schema.test.mjs app/src/lib/specimen-specs.data.json app/src/lib/specimen-specs.ts app/src/lib/works.ts app/src/app/gallery/page.tsx
git commit -m "feat(g2): 스펙 스키마·데이터 모델·공용 catalogWorks() — 갤러리 조립 일원화"
```

---

### Task 3: Detail route skeleton + i18n (coming-soon path)

The `/gallery/[id]` server route (lookup, static params, metadata, 404, More-like-this) and a client component rendering breadcrumb + hero preview + View live + the "coming soon" state. Rich sections come in Task 5. Every catalog work gets a working page now.

**Files:**
- Create: `app/src/app/gallery/[id]/page.tsx`
- Create: `app/src/app/gallery/[id]/detail-client.tsx`
- Modify: `app/src/app/gallery/gallery-i18n.ts` (add `detail` strings)

**Interfaces:**
- Consumes: `catalogWorks`, `Work` (`@/lib/works`); `getSpec`, `WorkSpec` (`@/lib/specimen-specs`); `STRINGS`, `DEFAULT_LANG`, `categoryLabel`, `Lang` (`./gallery-i18n` — one level up: `../gallery-i18n`); `WorkCard` (`../work-card`).
- Produces: `DetailClient({ work, spec, similar }: { work: Work; spec: WorkSpec | null; similar: Work[] })` (default export from `detail-client.tsx`).

- [ ] **Step 1: Add detail i18n strings**

In `app/src/app/gallery/gallery-i18n.ts`, extend the `Strings` type and both `STRINGS.en`/`STRINGS.ko`. Add to the `Strings` type (after `status`):

```ts
  detail: {
    home: string; viewLive: string; copy: string; copied: string;
    palette: string; typography: string; spacing: string; guidelines: string;
    do: string; dont: string; agentPrompt: string; moreLikeThis: string;
    comingSoon: string; comingSoonBody: string;
  };
```

Add to `STRINGS.en` (after the `status` line):

```ts
    detail: {
      home: "Specimen", viewLive: "View live ↗", copy: "Copy", copied: "Copied",
      palette: "Color palette", typography: "Typography", spacing: "Spacing & shape", guidelines: "Guidelines",
      do: "Do", dont: "Don't", agentPrompt: "Agent prompt", moreLikeThis: "More like this",
      comingSoon: "Full spec coming soon",
      comingSoonBody: "This design's palette, guidelines, and agent prompt haven't been documented yet.",
    },
```

Add to `STRINGS.ko` (after its `status` line):

```ts
    detail: {
      home: "Specimen", viewLive: "라이브 보기 ↗", copy: "복사", copied: "복사됨",
      palette: "컬러 팔레트", typography: "타이포그래피", spacing: "간격 · 형태", guidelines: "가이드라인",
      do: "권장", dont: "지양", agentPrompt: "에이전트 프롬프트", moreLikeThis: "비슷한 작품",
      comingSoon: "상세 스펙 준비 중",
      comingSoonBody: "이 디자인의 팔레트·가이드라인·에이전트 프롬프트는 아직 문서화되지 않았습니다.",
    },
```

- [ ] **Step 2: Write the server route**

Create `app/src/app/gallery/[id]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { catalogWorks, type Work } from "@/lib/works";
import { getSpec } from "@/lib/specimen-specs";
import DetailClient from "./detail-client";

export function generateStaticParams(): { id: string }[] {
  return catalogWorks().map((w) => ({ id: w.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const work = catalogWorks().find((w) => w.id === id);
  if (!work) return { title: "Specimen" };
  return { title: `${work.brand} — Specimen`, description: work.desc.en };
}

export default async function WorkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const all = catalogWorks();
  const work = all.find((w) => w.id === id);
  if (!work) notFound();
  const spec = getSpec(id) ?? null;
  const similar: Work[] = all
    .filter((w) => w.category === work.category && w.id !== work.id)
    .slice(0, 4);
  return <DetailClient work={work} spec={spec} similar={similar} />;
}
```

- [ ] **Step 3: Write the client component (skeleton + coming-soon)**

Create `app/src/app/gallery/[id]/detail-client.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import type { Work } from "@/lib/works";
import type { WorkSpec } from "@/lib/specimen-specs";
import { STRINGS, DEFAULT_LANG, categoryLabel, type Lang } from "../gallery-i18n";
import { WorkCard } from "../work-card";

export default function DetailClient({ work, spec, similar }: { work: Work; spec: WorkSpec | null; similar: Work[] }) {
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);
  useEffect(() => {
    const saved = localStorage.getItem("specimen-lang");
    if (saved === "en" || saved === "ko") setLang(saved);
  }, []);
  function pickLang(l: Lang) { setLang(l); localStorage.setItem("specimen-lang", l); }
  const t = STRINGS[lang];
  const d = t.detail;

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <main className="mx-auto max-w-5xl px-6 py-12 md:px-10">
        <div className="flex items-center justify-between gap-4">
          <nav className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400">
            <a href="/gallery" className="hover:text-zinc-700">{d.home}</a>
            <span className="px-1.5">/</span>
            <span className="text-zinc-600">{categoryLabel(work.category, lang)}</span>
          </nav>
          <div role="group" aria-label={t.langLabel} className="inline-flex shrink-0 rounded-lg border border-zinc-200 p-0.5">
            {(["en", "ko"] as const).map((l) => (
              <button key={l} type="button" aria-pressed={lang === l} onClick={() => pickLang(l)}
                className={`h-7 rounded-md px-2.5 text-xs font-semibold uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 ${lang === l ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-800"}`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <header className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">{work.brand}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500">{work.desc[lang]}</p>
          </div>
          <a href={work.route} target="_blank" rel="noreferrer"
            className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2">
            {d.viewLive}
          </a>
        </header>

        <HeroPreview work={work} />

        {spec ? (
          <RichSpec spec={spec} d={d} />
        ) : (
          <section className="mt-12 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center">
            <p className="text-sm font-bold text-zinc-700">{d.comingSoon}</p>
            <p className="mt-1.5 text-xs text-zinc-500">{d.comingSoonBody}</p>
          </section>
        )}

        {similar.length > 0 && (
          <section className="mt-16 border-t border-zinc-200 pt-8">
            <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500">{d.moreLikeThis}</h2>
            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {similar.map((w) => <WorkCard key={w.id} work={w} lang={lang} label={categoryLabel(w.category, lang)} />)}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function HeroPreview({ work }: { work: Work }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative mt-8 h-[480px] w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
      {!loaded && <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-zinc-100 to-zinc-50 motion-reduce:animate-none" />}
      {work.image ? (
        <img src={work.image} alt={`${work.brand} preview`} onLoad={() => setLoaded(true)}
          className={`absolute left-1/2 top-1/2 max-h-full w-auto -translate-x-1/2 -translate-y-1/2 object-contain transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`} />
      ) : (
        <iframe src={work.route} title={`${work.brand} preview`} tabIndex={-1} scrolling="no" onLoad={() => setLoaded(true)}
          className={`pointer-events-none absolute left-0 top-0 origin-top-left transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          style={{ width: "1440px", height: "2028px", transform: "scale(0.711)", border: 0 }} />
      )}
    </div>
  );
}

// Placeholder — replaced with the full implementation in Task 5.
function RichSpec({ spec, d }: { spec: WorkSpec; d: (typeof STRINGS)["en"]["detail"] }) {
  return <section className="mt-12" data-spec-id={spec.id} data-agent-prompt-label={d.agentPrompt} />;
}
```

Note: `RichSpec` is a minimal stub here so the skeleton compiles and the coming-soon path is verifiable; Task 5 replaces its body. (It references `spec.id` and `d.agentPrompt` so both params are used — no unused-var lint error.)

- [ ] **Step 4: Verify build + routes**

Run: `cd app && npx next build`
Expected: build succeeds; output shows `/gallery/[id]` prerendered for all catalog ids.

- [ ] **Step 5: Smoke the coming-soon page + 404**

Run: `cd app && (npx next start -p 3100 &) && sleep 4 && curl -s -o /dev/null -w "%{http_code}\n" localhost:3100/gallery/d7 && curl -s -o /dev/null -w "%{http_code}\n" localhost:3100/gallery/nonexistent-xyz && kill %1 2>/dev/null`
Expected: `200` for `/gallery/d7` (coming-soon), `404` for the unknown id.

- [ ] **Step 6: Commit**

```bash
git add app/src/app/gallery/gallery-i18n.ts app/src/app/gallery/\[id\]/page.tsx app/src/app/gallery/\[id\]/detail-client.tsx
git commit -m "feat(g2): /gallery/[id] 상세 라우트 스켈레톤 — 히어로 미리보기·coming-soon·More like this·i18n"
```

---

### Task 4: Card routing → detail page

Gallery cards (and More-like-this cards) link to the detail page for catalog works; evolve candidates (ids containing `/`, branch-only, no detail page) keep linking to the live route.

**Files:**
- Modify: `app/src/app/gallery/work-card.tsx:12`

**Interfaces:**
- Consumes: `Work` (unchanged signature). No new exports.

- [ ] **Step 1: Change the card href**

In `app/src/app/gallery/work-card.tsx`, inside `WorkCard`, add before the `return` (after `const t = STRINGS[lang];`):

```tsx
  // Catalog works route to their detail page; evolve candidates (id has "/") have no detail page.
  const href = work.id.includes("/") ? work.route : `/gallery/${work.id}`;
```

Then change the anchor's `href={work.route}` to `href={href}`.

- [ ] **Step 2: Verify build**

Run: `cd app && npx next build`
Expected: build succeeds.

- [ ] **Step 3: Smoke the link target**

Run: `cd app && (npx next start -p 3100 &) && sleep 4 && curl -s localhost:3100/gallery | grep -o 'href="/gallery/d29"' | head -1 && kill %1 2>/dev/null`
Expected: prints `href="/gallery/d29"` (a catalog card now points at the detail page).

- [ ] **Step 4: Commit**

```bash
git add app/src/app/gallery/work-card.tsx
git commit -m "feat(g2): 갤러리 카드 → 상세 페이지 라우팅 (진화 후보는 라이브 유지)"
```

---

### Task 5: Rich spec rendering + author d29

Replace the `RichSpec` stub with the full rendering (palette swatches + Copy, typography/spacing, Do/Don't, Agent Prompt + Copy), and author the first rich spec (`d29` — Waypoint) so the rich path is verifiable end-to-end.

**Files:**
- Modify: `app/src/app/gallery/[id]/detail-client.tsx` (replace `RichSpec`)
- Modify: `app/src/lib/specimen-specs.data.json` (add `d29`)

**Interfaces:**
- Consumes: `WorkSpec`, `Swatch` from `@/lib/specimen-specs`; the `detail` strings shape.

- [ ] **Step 1: Author d29's rich spec**

Get the accurate palette:

Run: `node scripts/extract-palette.mjs app/src/app/dash/d29`

Read `app/src/app/dash/d29/page.tsx` (and 1–2 key components) to ground the description. d29 = "Waypoint", Asana-grade project collaboration, pure-white light, indigo accent, sortable table + gantt + workload + ⌘K.

Set `app/src/lib/specimen-specs.data.json` content to (adjust hex/roles to the extractor output; keep English-only; palette ≥3, dosDonts ≥3; `agentPrompt` is a markdown DESIGN.md):

```json
{
  "d29": {
    "id": "d29",
    "palette": [
      { "token": "zinc-900", "hex": "#18181b", "role": "Ink", "usage": "Primary text, table headers, ⌘K" },
      { "token": "indigo-600", "hex": "#4f46e5", "role": "Accent", "usage": "Primary actions, active filter, links" },
      { "token": "zinc-500", "hex": "#71717a", "role": "Muted", "usage": "Secondary labels, metadata" },
      { "token": "zinc-200", "hex": "#e4e4e7", "role": "Border", "usage": "Hairlines, table rules, card edges" },
      { "token": "zinc-50", "hex": "#fafafa", "role": "Surface", "usage": "Row hover, subtle fills" }
    ],
    "typography": "Pretendard throughout; tabular-nums for counts and dates. Bold, compact headers; regular body at 13–14px. No display face — hierarchy comes from weight and size, not decoration.",
    "spacing": "4/8 spacing rhythm. 12px card radius, 6px controls. Dense but breathable: generous row height, tight control padding.",
    "philosophy": "Pure-white, service-grade calm modeled on Asana. A single indigo accent carries every interactive signal; everything else is a neutral zinc scale. One project filter drives every widget in sync, so the surface feels like one instrument rather than a set of panels.",
    "dosDonts": [
      { "do": "Reserve indigo for the one active/primary signal per view.", "dont": "Introduce a second accent hue for secondary actions." },
      { "do": "Use a true white (#ffffff) canvas.", "dont": "Warm the background to cream or paper — that reads as a different product." },
      { "do": "Keep tables on a fixed layout with tabular-nums.", "dont": "Let numeric columns reflow or misalign on sort." },
      { "do": "Drive all widgets from the shared project filter.", "dont": "Let panels hold independent, unsynced state." }
    ],
    "agentPrompt": "# Recreate: Waypoint (Asana-grade project collaboration)\n\nBuild a pure-white project dashboard.\n\n**Palette:** zinc neutrals (`zinc-900` ink, `zinc-500` muted, `zinc-200` borders, `zinc-50` hover) on a `#ffffff` canvas, with `indigo-600` as the *only* accent — used for primary actions, the active filter, and links.\n\n**Type:** Pretendard, `tabular-nums` for all counts/dates. Hierarchy via weight + size, never a display face.\n\n**Layout:** a global project filter at top that syncs every widget; a sortable task table (fixed layout), a gantt strip, a workload-by-assignee panel, and a ⌘K command palette.\n\n**Feel:** dense but breathable, 4/8 spacing, 12px card radius. Service-grade restraint — no decoration, one accent, everything aligned."
  }
}
```

- [ ] **Step 2: Verify the schema gate passes for d29**

Run: `node --test scripts/specimen-spec-schema.test.mjs`
Expected: PASS — the "every spec present is well-formed" test now covers `d29` and passes.

- [ ] **Step 3: Replace the `RichSpec` stub**

In `app/src/app/gallery/[id]/detail-client.tsx`, replace the entire `RichSpec` function (the placeholder) with:

```tsx
function CopyButton({ text, d }: { text: string; d: (typeof STRINGS)["en"]["detail"] }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button"
      onClick={() => { navigator.clipboard?.writeText(text); setDone(true); setTimeout(() => setDone(false), 1200); }}
      className="rounded-md border border-zinc-200 px-2 py-0.5 text-[11px] font-semibold text-zinc-600 transition-colors hover:border-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900">
      {done ? d.copied : d.copy}
    </button>
  );
}

function RichSpec({ spec, d }: { spec: WorkSpec; d: (typeof STRINGS)["en"]["detail"] }) {
  return (
    <div className="mt-14 space-y-14">
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500">{d.palette}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600">{spec.philosophy}</p>
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {spec.palette.map((s: Swatch) => (
            <li key={s.token} className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3">
              <span aria-hidden="true" className="h-10 w-10 shrink-0 rounded-md border border-zinc-200" style={{ background: s.hex }} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-bold">{s.role}</p>
                  <CopyButton text={s.hex} d={d} />
                </div>
                <p className="font-mono text-[11px] text-zinc-500">{s.hex} · {s.token}</p>
                <p className="mt-0.5 text-xs text-zinc-500">{s.usage}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500">{d.typography}</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">{spec.typography}</p>
        </section>
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500">{d.spacing}</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">{spec.spacing}</p>
        </section>
      </div>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500">{d.guidelines}</h2>
        <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {spec.dosDonts.map((g, i) => (
            <li key={i} className="rounded-lg border border-zinc-200 p-4">
              <p className="text-sm text-zinc-800"><span className="mr-2 font-bold text-emerald-600">{d.do}</span>{g.do}</p>
              <p className="mt-2 text-sm text-zinc-800"><span className="mr-2 font-bold text-rose-500">{d.dont}</span>{g.dont}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500">{d.agentPrompt}</h2>
          <CopyButton text={spec.agentPrompt} d={d} />
        </div>
        <pre className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-50 p-5 font-mono text-xs leading-relaxed text-zinc-700 whitespace-pre-wrap">{spec.agentPrompt}</pre>
      </section>
    </div>
  );
}
```

(Add `Swatch` to the existing type import: `import type { WorkSpec, Swatch } from "@/lib/specimen-specs";`.)

- [ ] **Step 4: Verify build**

Run: `cd app && npx next build`
Expected: build succeeds.

- [ ] **Step 5: Smoke the rich page**

Run: `cd app && (npx next start -p 3100 &) && sleep 4 && curl -s localhost:3100/gallery/d29 | grep -c "Agent prompt" && kill %1 2>/dev/null`
Expected: `>=1` — the Agent Prompt section renders on d29. (Spot-check visually if possible: palette swatches, Do/Don't, prompt.)

- [ ] **Step 6: Commit**

```bash
git add app/src/app/gallery/\[id\]/detail-client.tsx app/src/lib/specimen-specs.data.json
git commit -m "feat(g2): 리치 스펙 렌더링(팔레트·Do/Don't·Agent Prompt·Copy) + d29 스펙 저작"
```

---

### Task 6: Author rich specs — dash batch (d30–d33)

Author four dashboard specs following the d29 pattern.

**Files:**
- Modify: `app/src/lib/specimen-specs.data.json` (add `d30`, `d31`, `d32`, `d33`)
- Test: `scripts/specimen-batch6.test.mjs`

**Interfaces:** none new (data + test only).

Work notes (from `works.ts`): `d30` Slotted — Calendly-grade booking, pure-white, event-type→heatmap sync. `d31` Conduit — n8n-grade workflow automation, **product dark**, crosshair chart, error-spike alerts. `d32` Meridian — Coinbase-grade asset portfolio, **product dark**, period-toggle price chart, allocation donut. `d33` Keel — collaborative kanban, viewport-locked board, draggable cards (auto dash r1 winner; DECISION at `vault/20-generations/2026-07-15-auto-dash-r1/DECISION.md`).

- [ ] **Step 1: Write the batch presence test (RED)**

Create `scripts/specimen-batch6.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateSpec } from "./specimen-spec-schema.mjs";
import data from "../app/src/lib/specimen-specs.data.json" with { type: "json" };

for (const id of ["d30", "d31", "d32", "d33"]) {
  test(`${id} rich spec present and valid`, () => {
    assert.ok(data[id], `${id} missing`);
    assert.deepEqual(validateSpec(data[id]), []);
  });
}
```

- [ ] **Step 2: Run to verify it fails**

Run: `node --test scripts/specimen-batch6.test.mjs`
Expected: FAIL — d30–d33 missing.

- [ ] **Step 3: Author the four specs**

For each id: run `node scripts/extract-palette.mjs <sourceDir>` (d30=`app/src/app/dash/d30`, d31=`app/src/app/dash/d31`, d32=`app/src/app/dash/d32`, d33=`app/src/app/dash/d33`), read its `page.tsx` (+ key components; for d33 optionally the DECISION.md), then add an entry to `specimen-specs.data.json` with the exact same shape as `d29` (see Task 5 Step 1): `palette` (≥3 swatches, hex from the extractor, English `role`+`usage`), `typography`, `spacing`, `philosophy`, `dosDonts` (≥3), `agentPrompt` (markdown DESIGN.md). Reflect each work's real character — e.g. d31/d32 are **dark** products (their palette/philosophy must say so), d30 is pure-white, d33 is a viewport-locked kanban.

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test scripts/specimen-batch6.test.mjs scripts/specimen-spec-schema.test.mjs`
Expected: PASS (batch presence + global well-formedness).

- [ ] **Step 5: Verify build**

Run: `cd app && npx next build`
Expected: succeeds; `/gallery/d30`…`/gallery/d33` render full rich specs.

- [ ] **Step 6: Commit**

```bash
git add app/src/lib/specimen-specs.data.json scripts/specimen-batch6.test.mjs
git commit -m "feat(g2): 리치 스펙 저작 — dash d30~d33"
```

---

### Task 7: Author rich specs — dash batch (d34–d38)

Author five dashboard specs (the newer falsify winners).

**Files:**
- Modify: `app/src/lib/specimen-specs.data.json` (add `d34`–`d38`)
- Test: `scripts/specimen-batch7.test.mjs`

Work notes: `d34` Pulse — SLA live-ops, dark hero + bento, rail-free density. `d35` Tessera — asset-allocation treemap cockpit. `d36` Chute — conversion funnel as page spine, trapezoid funnel. `d37` Currents — revenue-attribution Sankey. `d38` Wavelength — on-call rotation, 24h radial dial. (Winners: DECISION at `vault/20-generations/2026-07-*-auto-dash-r{2,7,8,9,10}/DECISION.md` — optional input.)

- [ ] **Step 1: Write the batch presence test (RED)**

Create `scripts/specimen-batch7.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateSpec } from "./specimen-spec-schema.mjs";
import data from "../app/src/lib/specimen-specs.data.json" with { type: "json" };

for (const id of ["d34", "d35", "d36", "d37", "d38"]) {
  test(`${id} rich spec present and valid`, () => {
    assert.ok(data[id], `${id} missing`);
    assert.deepEqual(validateSpec(data[id]), []);
  });
}
```

- [ ] **Step 2: Run to verify it fails**

Run: `node --test scripts/specimen-batch7.test.mjs`
Expected: FAIL — d34–d38 missing.

- [ ] **Step 3: Author the five specs**

Same procedure as Task 6 Step 3, sources `app/src/app/dash/d34`…`d38`. Each entry matches the d29 shape; reflect the work's dominant visualization (treemap, funnel, Sankey, radial dial) in `philosophy`/`agentPrompt`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test scripts/specimen-batch7.test.mjs scripts/specimen-spec-schema.test.mjs`
Expected: PASS.

- [ ] **Step 5: Verify build**

Run: `cd app && npx next build`
Expected: succeeds; `/gallery/d34`…`/gallery/d38` render.

- [ ] **Step 6: Commit**

```bash
git add app/src/lib/specimen-specs.data.json scripts/specimen-batch7.test.mjs
git commit -m "feat(g2): 리치 스펙 저작 — dash d34~d38"
```

---

### Task 8: Author rich specs — landing + native (v0, v6, v7, v8, n1) + final gate

Author the four landing specs and the native spec, then assert the full 15-work subset is complete.

**Files:**
- Modify: `app/src/lib/specimen-specs.data.json` (add `v0`, `v6`, `v7`, `v8`, `n1`)
- Test: `scripts/specimen-subset-complete.test.mjs`

Work notes & sources: `v0` (route `/`) source = `app/src/app/(marketing)/page.tsx` + `(marketing)/landing-client.tsx` (top-level `(marketing)/*.tsx`, NOT the `vN` subdirs) — champion editorial split hero. `v6` = `(marketing)/v6` before/after drag-reveal slider. `v7` = `(marketing)/v7` comparison-table hero. `v8` = `(marketing)/v8` match-accuracy dial (SVG gauge). `n1` = native notification center — **palette from `native/src/tokens.ts`** (bg `#ffffff`, accent `#4f46e5`, ink `#18181b`, ink2 `#27272a`, muted `#52525b`, faint `#71717a`, border `#e4e4e7`); render context is the screenshot `app/public/native/notification-center.png`; describe it as a mobile RN screen (single accent for unread, date grouping).

- [ ] **Step 1: Write the FINAL completeness test (RED)**

Create `scripts/specimen-subset-complete.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { SUBSET_IDS, validateSpec } from "./specimen-spec-schema.mjs";
import data from "../app/src/lib/specimen-specs.data.json" with { type: "json" };

test("all 15 subset ids have a valid rich spec", () => {
  const missing = SUBSET_IDS.filter((id) => !data[id]);
  assert.deepEqual(missing, [], `missing: ${missing.join(", ")}`);
  for (const id of SUBSET_IDS) assert.deepEqual(validateSpec(data[id]), [], `${id}: ${validateSpec(data[id]).join("; ")}`);
});

test("data file contains only subset ids (no strays)", () => {
  const strays = Object.keys(data).filter((id) => !SUBSET_IDS.includes(id));
  assert.deepEqual(strays, [], `unexpected ids: ${strays.join(", ")}`);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `node --test scripts/specimen-subset-complete.test.mjs`
Expected: FAIL — v0/v6/v7/v8/n1 missing.

- [ ] **Step 3: Author the five specs**

For `v0`/`v6`/`v7`/`v8`: run `node scripts/extract-palette.mjs <sourceDir>` on the sources above (for `v0` run it on `app/src/app/(marketing)` — the extractor recurses, so manually favor colors from `page.tsx`/`landing-client.tsx` and ignore obvious vN-only hues), read the source, author per the d29 shape. For `n1`: use the `tokens.ts` hex list above as the palette (assign English roles/usage), describe the notification-center screen. All entries English-only, `dosDonts` ≥3, `agentPrompt` a markdown DESIGN.md.

- [ ] **Step 4: Run the full test suite**

Run: `cd /Users/yss/개발/build/repick-design && node --test "scripts/**/*.test.mjs"`
Expected: PASS — including `specimen-subset-complete` (all 15 present, no strays) and all prior batches. Report the total pass count.

- [ ] **Step 5: Verify build + spot-check across categories**

Run: `cd app && npx next build && (npx next start -p 3100 &) && sleep 4 && for id in v0 v8 n1 d31; do curl -s -o /dev/null -w "$id %{http_code}\n" localhost:3100/gallery/$id; done && kill %1 2>/dev/null`
Expected: all `200`. Visually confirm v0/v8/n1 render palette + Do/Don't + Agent Prompt; n1 shows the screenshot hero.

- [ ] **Step 6: Commit**

```bash
git add app/src/lib/specimen-specs.data.json scripts/specimen-subset-complete.test.mjs
git commit -m "feat(g2): 리치 스펙 저작 — landing v0/v6/v7/v8 + native n1, 서브셋 15 완주"
```

---

## Self-Review

**1. Spec coverage:**
- Hybrid pipeline (machine extract + LLM interpret) → Task 1 (extractor) + Tasks 5–8 (authoring using the extractor). ✅
- `specimen-specs.ts` static store → Task 2 (`specimen-specs.ts` + `.data.json`). ✅
- Detail page `/gallery/[id]` with hero, palette+Copy, type/spacing, Do/Don't, Agent Prompt, More-like-this → Tasks 3 + 5. ✅
- Coming-soon for non-subset → Task 3. ✅
- Card → detail routing (evolve exception) → Task 4. ✅
- i18n chrome bilingual, deep content English → Task 3 (strings) + Global Constraints + authoring tasks (English content). ✅
- Subset = the 15 ids → `SUBSET_IDS` (Task 2) + Tasks 5–8, final gate Task 8. ✅
- **Deviation from spec §5** (flag for the executor/user): the spec said non-subset works show a *baseline machine-extracted palette*; this plan renders non-subset works as preview + "coming soon" **without** a baseline palette. Rationale: the extractor is used as an authoring aid rather than a committed runtime baseline for all 61 — this keeps the MVP focused on the subset and avoids a generated-data-in-git surface. Baseline-palette-for-all is deferred to the follow-up batch (spec §8 already defers the remaining ~46 works). This is a scope reduction, not a contradiction.

**2. Placeholder scan:** The `RichSpec` stub in Task 3 is an intentional, compiling, minimal component that Task 5 replaces (documented inline). Authoring Tasks 6–8 do not inline creative prose (that is the deliverable), but each provides the exact source dir, the extractor command, the d29 shape reference, and a completeness test gating shape + presence — the mechanical contract is complete. No `TBD`/`TODO`/"handle edge cases".

**3. Type consistency:** `WorkSpec`/`Swatch` field names (`token`,`hex`,`role`,`usage`,`typography`,`spacing`,`philosophy`,`dosDonts`,`agentPrompt`) are identical across `specimen-specs.ts` (Task 2), `validateSpec` (Task 2), the d29 JSON (Task 5), and `RichSpec` (Task 5). `detail` i18n keys used in `detail-client.tsx` (`home`,`viewLive`,`copy`,`copied`,`palette`,`typography`,`spacing`,`guidelines`,`do`,`dont`,`agentPrompt`,`moreLikeThis`,`comingSoon`,`comingSoonBody`) match the `Strings.detail` type (Task 3). `catalogWorks()` returns `Work[]` consumed by both `page.tsx` files. `params: Promise<{id}>` consistent in `generateMetadata` + `WorkDetailPage`.
