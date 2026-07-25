# Specimen G3 — Main Landing (tasteskill-style hero + carousel) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/gallery` into a tasteskill-style Specimen landing — a hero (wordmark + headline + positioning + CTA) and a continuous live-iframe showcase marquee, above the existing search/filter/grid browse.

**Architecture:** One page. `gallery-client.tsx` gains a hero `<section>` and a full-bleed `<Showcase>` marquee (new `showcase.tsx`) prepended above the existing browse block (which gets an `id="browse"` anchor for the CTA). The marquee duplicates a curated 6-work set and scrolls via a CSS `@keyframes marquee` (in globals.css), paused on hover and disabled under `prefers-reduced-motion`; tiles are lazy live iframes reusing the WorkCard scaling technique. Hero copy is bilingual via a new `hero` group in `gallery-i18n.ts`.

**Tech Stack:** Next.js 16 / React 19 client components, Tailwind v4 (arbitrary animation + globals keyframe), live `<iframe>` previews.

## Global Constraints

- Bilingual chrome (EN default + KO toggle) — hero copy added to `gallery-i18n.ts` for both `en` and `ko`. Deep-spec content stays English (unaffected here).
- Performance/a11y: showcase iframes `loading="lazy"`, `tabIndex={-1}`, `pointer-events-none` (the tile `<a>` is the click target); duplicated tiles `aria-hidden`; marquee `motion-reduce:animate-none` and pause on hover; the tile link goes to `/gallery/<id>`.
- The existing browse block (search + filter chips + results count + grid) is preserved unchanged in behavior; only its surrounding layout moves below the hero, and it gets `id="browse"`.
- Determinism: no `Date.now()`/`Math.random()`/`new Date()`.
- Verification: `cd app && npx next build`; curl/inspect `/gallery`; `node --test "scripts/**/*.test.mjs"` stays green. No component test harness exists — verify via build + curl + visual.
- Surgical: touch only `gallery-i18n.ts`, `globals.css`, new `showcase.tsx`, `gallery-client.tsx`. Web works' rendering + the grid + WorkCard unchanged.
- **Showcase set (6, curated diverse):** `d29` (project, light), `d32` (finance, dark), `d37` (analytics, Sankey), `d38` (ops, radial-dial dark), `v8` (landing, dial gauge), `n2` (mobile, live native).

---

### Task 1: Hero i18n strings + marquee keyframe

**Files:**
- Modify: `app/src/app/gallery/gallery-i18n.ts` (add `hero` to `Strings` + both dicts)
- Modify: `app/src/app/globals.css` (add `@keyframes marquee`)

**Interfaces:**
- Produces: `STRINGS[lang].hero.{headline,subcopy,browseCta,showcaseLabel}`; a `marquee` CSS animation.

- [ ] **Step 1: Add the `hero` group to the `Strings` type**

In `gallery-i18n.ts`, add to the `Strings` type (after the `detail` block's closing `};`):
```ts
  hero: { headline: string; subcopy: string; browseCta: string; showcaseLabel: string };
```

- [ ] **Step 2: Add `hero` to `STRINGS.en`**

After the `en` `detail: { ... },` block, add:
```ts
    hero: {
      headline: "Interface design systems, auto-evolved for AI agents.",
      subcopy: "Every specimen is a production-grade interface — generated nightly, gated for craft, and judged. Each ships with a copy-paste DESIGN.md so an agent can rebuild it.",
      browseCta: "Browse the gallery",
      showcaseLabel: "Featured design systems",
    },
```

- [ ] **Step 3: Add `hero` to `STRINGS.ko`**

After the `ko` `detail: { ... },` block, add:
```ts
    hero: {
      headline: "AI 에이전트를 위한 인터페이스 디자인 시스템 — 매일 스스로 진화.",
      subcopy: "모든 표본은 상용급 인터페이스입니다 — 매일 생성되고, 크래프트 게이트를 통과하고, 심사됩니다. 각 작품에는 에이전트가 그대로 재현할 수 있는 DESIGN.md가 포함됩니다.",
      browseCta: "갤러리 둘러보기",
      showcaseLabel: "대표 디자인 시스템",
    },
```

- [ ] **Step 4: Add the marquee keyframe to globals.css**

In `app/src/app/globals.css`, after the existing `@keyframes gallery-fade { ... }` block, add:
```css
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
```

- [ ] **Step 5: Verify build**

Run: `cd app && npx next build`
Expected: succeeds (i18n type + both dicts consistent; CSS valid).

- [ ] **Step 6: Commit**

```bash
git add app/src/app/gallery/gallery-i18n.ts app/src/app/globals.css
git commit -m "feat(gallery): G3 히어로 i18n 문자열(EN/KO) + 마퀴 keyframe"
```

---

### Task 2: Hero section + Showcase marquee + gallery-client restructure

**Files:**
- Create: `app/src/app/gallery/showcase.tsx`
- Modify: `app/src/app/gallery/gallery-client.tsx` (hero section + `<Showcase>` + `id="browse"` on the browse block)

**Interfaces:**
- Consumes: `Work` (`@/lib/works`); `STRINGS`/`Lang` hero strings (Task 1).
- Produces: `Showcase({ works, label }: { works: Work[]; label: string })` default-exported (or named) from `showcase.tsx`.

- [ ] **Step 1: Create the Showcase marquee**

Create `app/src/app/gallery/showcase.tsx`:
```tsx
"use client";

import type { Work } from "@/lib/works";

/** Full-bleed continuous marquee of live work previews (duplicated set for a seamless loop). */
export function Showcase({ works, label }: { works: Work[]; label: string }) {
  const tiles = [...works, ...works];
  return (
    <section aria-label={label} className="group relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden border-y border-zinc-200 bg-zinc-50 py-6">
      <ul className="flex w-max gap-5 pl-5 animate-[marquee_60s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {tiles.map((w, i) => (
          <ShowcaseTile key={`${w.id}-${i}`} work={w} duplicate={i >= works.length} />
        ))}
      </ul>
    </section>
  );
}

function ShowcaseTile({ work, duplicate }: { work: Work; duplicate: boolean }) {
  const mobile = work.category === "mobile";
  return (
    <li aria-hidden={duplicate || undefined} className="shrink-0">
      <a href={`/gallery/${work.id}`} tabIndex={duplicate ? -1 : 0}
        className="relative block h-[200px] w-[320px] overflow-hidden rounded-xl border border-zinc-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2">
        <span aria-hidden="true" className="absolute inset-0 block">
          {mobile ? (
            <iframe src={work.route} loading="lazy" tabIndex={-1} title=""
              className="pointer-events-none absolute left-1/2 top-1/2"
              style={{ width: "390px", height: "844px", transform: "translate(-50%, -50%) scale(0.237)", border: 0 }} />
          ) : (
            <iframe src={work.route} loading="lazy" tabIndex={-1} scrolling="no" title=""
              className="pointer-events-none absolute left-0 top-0 origin-top-left"
              style={{ width: "1440px", height: "900px", transform: "scale(0.2223)", border: 0 }} />
          )}
        </span>
        <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-white via-white/85 to-transparent px-3 pb-2 pt-8">
          <span className="truncate text-xs font-bold text-zinc-900">{work.brand}</span>
        </span>
      </a>
    </li>
  );
}
```
(Web: 1440×900 scaled 0.2223 → 320×200. Mobile: 390×844 scaled 0.237 → ~92×200 phone centered.)

- [ ] **Step 2: Restructure gallery-client — hero + Showcase + browse anchor**

In `app/src/app/gallery/gallery-client.tsx`:

(a) Add imports at top (with the existing imports):
```tsx
import { Showcase } from "./showcase";
```

(b) Add the curated showcase list + derived works, right after `const t = STRINGS[lang];` (near the top of the component):
```tsx
  const SHOWCASE_IDS = ["d29", "d32", "d37", "d38", "v8", "n2"];
  const showcaseWorks = SHOWCASE_IDS.map((id) => works.find((w) => w.id === id)).filter((w): w is NonNullable<typeof w> => Boolean(w));
```

(c) Replace the existing `<header className="flex flex-col gap-6">…</header>` block. The current header holds: (i) the wordmark eyebrow + S-mark + `<h1>Specimen</h1>` + tagline + EN/KO toggle, and (ii) the search + filter row. Split it into a **hero** (wordmark strip + big headline + subcopy + CTA + toggle) and keep the **browse** row. Replace that `<header>…</header>` with:
```tsx
        <section className="flex flex-col gap-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-lg bg-zinc-900 font-mono text-lg font-bold text-white">S</span>
              <span className="text-lg font-extrabold tracking-tight">Specimen</span>
            </div>
            <div role="group" aria-label={t.langLabel} className="inline-flex shrink-0 rounded-lg border border-zinc-200 p-0.5">
              {(["en", "ko"] as const).map((l) => (
                <button key={l} type="button" aria-pressed={lang === l} onClick={() => pickLang(l)}
                  className={`h-8 rounded-md px-3 text-xs font-semibold uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 ${lang === l ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-800"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">{t.hero.headline}</h1>
            <p className="max-w-2xl text-base leading-relaxed text-zinc-600">{t.hero.subcopy}</p>
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400">
              <a href="#browse" className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold normal-case tracking-normal text-white transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2">
                {t.hero.browseCta} ↓
              </a>
              <span>· <span className="tabular-nums">{works.length}</span> {t.worksLabel} · Rev <span className="tabular-nums">{lastUpdated}</span></span>
            </div>
          </div>
        </section>
```

(d) Immediately AFTER that `</section>` (and before the results-count `<p aria-live>`), add the showcase, then wrap the browse row + results + grid in a `#browse` region. Insert the Showcase and a browse wrapper:
```tsx
        <Showcase works={showcaseWorks} label={t.hero.showcaseLabel} />

        <div id="browse" className="mt-12 flex flex-col gap-4 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <input type="search" aria-label={t.searchLabel} value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="h-10 w-full rounded-lg border border-zinc-200 px-3.5 text-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 sm:max-w-xs" />
          <div role="group" aria-label={t.filterLabel} className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}
                className={`h-8 rounded-full border px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 ${filter === f ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 text-zinc-600 hover:border-zinc-400"}`}>
                {t.filters[f]}
              </button>
            ))}
          </div>
        </div>
```
(This moves the existing search + filter row out of the old `<header>` into the `#browse` block. The results-count `<p aria-live>` and the grid `<div className="mt-4 grid …">` that follow stay exactly as they are.)

- [ ] **Step 3: Verify build**

Run: `cd app && npx next build`
Expected: succeeds.

- [ ] **Step 4: Smoke the landing**

Run: `cd app && (npx next start -p 3100 &) ; sleep 5 ; echo -n "headline: "; curl -s localhost:3100/gallery | grep -c "auto-evolved for AI agents"; echo -n "showcase iframes (6 works ×2): "; curl -s localhost:3100/gallery | grep -oE 'src="/(dash/d32|dash/d37|native-app[^"]*|v8)"?' | wc -l; echo -n "browse anchor: "; curl -s localhost:3100/gallery | grep -c 'id="browse"'; echo -n "grid works: "; curl -s localhost:3100/gallery | grep -oE 'href="/gallery/[a-z0-9]+"' | sort -u | wc -l ; kill %1 2>/dev/null`
Expected: headline ≥1; showcase iframe srcs present (>0); browse anchor =1; grid works =17 (all catalog cards still render). Visually confirm the marquee scrolls and pauses on hover.

- [ ] **Step 5: Commit**

```bash
git add app/src/app/gallery/showcase.tsx app/src/app/gallery/gallery-client.tsx
git commit -m "feat(gallery): G3 메인 랜딩 — 히어로 + 라이브 쇼케이스 마퀴 + browse 앵커"
```

---

## Self-Review

**1. Design coverage:** Hero (wordmark + headline + subcopy + CTA + toggle) → Task 2 Step 2. Live-iframe showcase marquee (6 curated, duplicated, lazy, hover-pause, reduced-motion) → `showcase.tsx` + globals keyframe. Browse (search/filter/grid) preserved + `#browse` anchor for the CTA → Task 2 Step 2(d). Bilingual hero copy → Task 1. ✅

**2. Placeholder scan:** All JSX/CSS/i18n is concrete. The showcase iframe scales are exact numbers. Task 2 Step 2 gives the full replacement blocks (the search/filter markup is repeated verbatim from the current header so the engineer doesn't have to reconstruct it). No `TBD`/vague directives.

**3. Type consistency:** `Showcase({ works, label })` signature matches its call site (Task 2 Step 2d). `t.hero.{headline,subcopy,browseCta,showcaseLabel}` (Task 2) match the `hero` group defined in `Strings` + both dicts (Task 1). `SHOWCASE_IDS` ids (d29,d32,d37,d38,v8,n2) all exist in the 17-work catalog. `work.category === "mobile"` matches the existing union. `animate-[marquee_60s_linear_infinite]` references the `@keyframes marquee` added in Task 1.
