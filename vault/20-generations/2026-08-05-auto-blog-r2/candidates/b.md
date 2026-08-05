---
tags: [generation, blog, auto-blog-r2]
---

# auto-blog-r2 / b — "Baseline"

Route: `/blog-evolve/r2/b` · files in `app/src/app/blog-evolve/r2/b/`
(`page.tsx`, `report-explorer.tsx`, `compare-table.tsx`, `feed-card.tsx`, `metric-panel.tsx`,
`badges.tsx`, `avatar.tsx`, `site-header.tsx`, `site-footer.tsx`, `nav-links.ts`, `data.ts`)

## Product / brand / trigger

**Baseline** — an independent benchmark journal for infrastructure engineers: databases,
networking, caching, compute, storage. Each "post" is a **report**: a specific benchmark claim
(e.g. "columnar compaction cuts P99 read latency 42%") that ships with its baseline value, its
result value, its sample size, its confidence level and its methodology. No sponsored content, no
vendor-supplied numbers — the framing device for why every finding is shown, not just teased.

This is `page-brief-core`-only generation (blog has no dedicated profile yet, per §"타입 프로파일
목록") — no dedicated brief to consult beyond the core. Assignment for this round: dark theme,
`emerald` accent, `--font-display-mono` display face, and a macro-skeleton distinct from all three
`auto-blog-r1` archetypes (hero+filtered-card-grid / sticky-rail+dense-list /
month-grouped-alternating-timeline). Also carrying forward two lessons from r1: never load images
from a random-content host (r1/c's `picsum.photos` alt-text overflow), and never hide primary nav on
mobile with nothing to replace it (all three r1 candidates did this, unpenalized only because it was
universal).

## Macro structure — evidence-forward index: Feed / Compare toggle over one filtered pipeline

Not a hero+card-grid, not a sticky-rail+list, not a month-timeline. The structural device: **every
report's headline metric is visible in the index itself** (baseline-vs-result bars in Feed mode, a
sortable numeric column in Compare mode), so a reader can judge findings against each other without
opening any report.

1. **`SiteHeader`** (`site-header.tsx`, client, sticky, outside `<main>`) — wordmark, desktop nav
   (`nav aria-label="Primary"`, `md:flex`), and a hamburger button below `md` that toggles a real
   in-flow disclosure `<nav>` panel (see "Mobile nav" below).
2. **Intro block** — kicker + single `h1` (display-mono) + subhead framing the page as evidence-first,
   then a `<dl>` stat row (reports / categories / contributing engineers, `tabular-nums`, icons
   inside `dt`).
3. **`ReportExplorer`** (`report-explorer.tsx`, client) — the interactive core:
   - Category filter chips + search box + a Feed/Compare segmented toggle, all above one derived
     `filtered` list (`useMemo` over `REPORTS`).
   - **Feed mode** → `FeedCard` list (`feed-card.tsx`): single-column "evidence panel" cards — a
     metric column (big `+N%`/`-N%` stat + two-bar baseline/result comparison, both driven by
     `MetricStat`/`MetricBars` in `metric-panel.tsx`) beside an editorial column (category badge,
     confidence badge, title, excerpt, byline). Deliberately *not* a 3-col photo grid and *not* a
     plain text row — the comparison bars are the primary visual unit.
   - **Compare mode** → `CompareTable` (`compare-table.tsx`): a real `<table>` — `caption`, `scope`
     on every `<th>`, `table-fixed` + `%`-width columns, `aria-sort` on the three sortable headers
     (Effect size / Sample / Published), click-to-sort with a visible `ArrowUp`/`ArrowDown`/
     `ArrowUpDown` icon (never color-only), and a per-row disclosure button that expands an inline
     methodology row.
4. **Methodology / Datasets / About** — three short static sections (`h2` each, id-anchored,
   matched to the header's nav targets) plus a subscribe callout (`#subscribe`), so every nav link
   resolves to a real destination.
5. **`SiteFooter`** (`site-footer.tsx`, sibling of `<main>`, keeps its `contentinfo` role) — echoes
   the same `NAV_LINKS` as a second always-visible path to primary navigation, plus resource/company
   columns and social icons.

All 9 reports render at rest with no filters applied, sorted newest-first in Feed mode — nothing
requires an interaction to see real content.

## Interactions (6, all information-bearing)

1. **Search** (`report-explorer.tsx`) — `<input type="search">` with a `sr-only`-labelled `<label>`
   filters by title, dek, excerpt, author name and category label substring; drives both view modes
   from one `filtered` array.
2. **Category filter** — `role="group"` of toggle chips (`aria-pressed` per chip, multi-select),
   narrows `filtered` to the selected categories (empty selection = all).
3. **Feed/Compare view toggle** — `role="group"` segmented control (`aria-pressed`) swaps the
   rendering of `filtered` between the chart-forward card list and the sortable table — the core
   structural device of this candidate, not a cosmetic layout switch.
4. **Feed sort** — native `<select aria-label="Sort feed">` (Newest first / Largest effect size /
   Most sampled) re-orders `feedOrdered` independently of the table's own ordering.
5. **Compare-table column sort** — clicking the Effect-size / Sample / Published `<th>` buttons
   toggles `aria-sort` (`ascending`/`descending`) and re-sorts the table rows; effect-size sort uses
   the cross-report-comparable normalized percentage delta (`metricDelta`), so reports with different
   native units (ms, %, x) can still be ranked against each other.
6. **Row-level methodology expand** — each table row's chevron button (`aria-expanded` +
   `aria-controls`) reveals an inline row with the full methodology paragraph and a "Read the full
   report" link, without navigating away from the comparison.

Search, category filter, view toggle, feed sort, table sort and row-expand are all real component
state — nothing is decorative. (Exceeds the instructed minimum of 4 by 2.)

## Palette / AA contrast math

Dark theme, single `emerald` accent family, `zinc` neutrals. Computed via a small Node script using
the WCAG relative-luminance formula (not eyeballed) — see pairs below, all ≥ 4.5:1 (AA normal text)
except the two explicitly marked large-text/UI-only:

| pair | ratio | floor | pass |
|---|---|---|---|
| `zinc-50` (#fafafa) text / `zinc-950` (#09090b) bg | 19.06:1 | primary text | yes |
| `zinc-50` / `zinc-900` (#18181b) | 16.97:1 | primary text on card | yes |
| `zinc-400` (#a1a1aa) / `zinc-950` | 7.76:1 | dark-surface secondary-text floor (zinc-400) | yes |
| `zinc-400` / `zinc-900` (card surface) | 6.91:1 | dark-surface floor | yes |
| `zinc-400` / `zinc-800` (#27272a, chip track) | 5.81:1 | dark-surface floor | yes |
| `zinc-300` (#d4d4d8) / `zinc-950` | 13.46:1 | table body text | yes |
| `emerald-400` (#34d399) / `zinc-950` | 10.35:1 | links, accent text, active nav | yes |
| `emerald-400` / `zinc-900` | 9.22:1 | accent on card surface | yes |
| `emerald-300` (#6ee7b7) / `zinc-950` | 13.05:1 | headline stat accent | yes |
| `zinc-950`-tone text (#022c22) / `emerald-400` fill | 7.88:1 | active chip/segmented-control label (dark text on light fill) | yes |
| `emerald-300` / `emerald-950`-tone bg (#022c22) | 9.94:1 | confidence badge tint (unused fill variant, kept for reference) | yes |

No `dark:text-{zinc,neutral,gray,slate,stone}-{500,600}` anywhere — verified by grep (see below) —
so the token-level hard gate (`no-dark-dim-text`) is satisfied structurally, not just at the
default render. All secondary text is `text-zinc-400` (the dark-surface floor), never `-500`/`-600`.

Meaning is never color-alone: confidence badges pair an icon (`ShieldCheck`/`Shield`/
`FlaskConical`) with its own text label; metric direction pairs `TrendingUp`/`TrendingDown` icons
with the words "improvement"/"regression" and "better"/"worse"; table sort state pairs an
`ArrowUp`/`ArrowDown`/`ArrowUpDown` icon with `aria-sort` (not just an emerald highlight).

## Font usage confirmation

`--font-display-mono` applied only to `h1`, report/post titles (`FeedCard` `h3`, table row titles
via font-medium — title cells use body weight/face per table density norms, `FeedCard` titles and
the page `h1` and stat numbers carry the display face), and numeric stat callouts (`MetricStat`'s
big `±N%`, the intro `<dl>` stat numbers). Body copy, nav, badges and table cells otherwise stay on
`--font-sans` (Pretendard). No `next/font` import; no `font-serif`; no unlisted font family (only
`var(--font-sans)`/`var(--font-display-mono)` used inline).

Exactly 3 Tailwind font-weight classes route-wide, confirmed via grep over every file in the route:

```
$ grep -ohE "font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b" *.tsx *.ts | sort | uniq -c
     24 font-medium
     18 font-normal
     14 font-semibold
```

`font-bold`/`font-light`/etc. all count 0.

## Mobile-nav accessibility (390px)

At 390px the desktop `<nav aria-label="Primary">` (`hidden md:flex`) is not replaced by nothing —
the header instead shows a labelled hamburger `<button>` (`aria-expanded`, `aria-controls`
pointing at the panel's `id`, visible focus ring, `sr-only` "Open/Close menu" text alongside the
`Menu`/`X` icon swap). Activating it toggles `hidden` on a second `<nav aria-label="Primary,
mobile">` that sits in normal document flow directly below the header row — not a modal, no focus
trap needed, fully reachable by keyboard (Tab reaches the button, Enter/Space toggles it, Tab
continues into the now-unhidden links) and by screen readers (the panel is real DOM, not
`display:none`-then-`aria-hidden` juggling beyond the native `hidden` attribute, which browsers and
AT already treat correctly). The footer additionally echoes the same `NAV_LINKS` list as a second,
always-visible path to every primary destination, so mobile navigation never depends on the
disclosure alone. This directly answers Q16 in `questions-queue.md` — all three `auto-blog-r1`
candidates hid nav on mobile with no alternative; this candidate has two.

## Images

No `<img>`, no `next/image`, no remote host of any kind. All visual art is inline, deterministic
SVG: `Avatar` (`avatar.tsx`) is a monogram circle whose hue is derived from the author's integer
seed via plain arithmetic (`150 + seed % 24`, a narrow emerald/teal band so every avatar reads as
part of the same accent system), and the report "cover" is replaced entirely by the
`MetricBars`/`MetricStat` comparison panel (`metric-panel.tsx`) — for a benchmark journal, the
evidence chart *is* the visual, not a decorative stand-in for one. No percentages/coordinates need
trig, but the bar-width percentages are still rounded to 2 decimals (`round2`) per the SVG-coordinate
convention.

## Verification run for real

```
$ cd app && npx tsc --noEmit
(only pre-existing error reported, in src/app/blog-evolve/r2/c/site-footer.tsx — a different, blind
candidate's file outside this folder's scope; zero errors anywhere under blog-evolve/r2/b)

$ cd app && npx eslint src/app/blog-evolve/r2/b
(clean, 0 problems — an earlier react-hooks/static-components violation from a component
defined inside CompareTable's render body was found and fixed by hoisting `SortIcon` to module
scope with `sortKey`/`sortDir` passed as props)

$ cd app && npx next build
(full production build succeeds; /blog-evolve/r2/b prerenders as a static route alongside its a/c
siblings. One real bug was caught and fixed here during development: NAV_LINKS was originally a
named export of the "use client" site-header.tsx, and site-footer.tsx — a Server Component —
imported it; Next's client-reference boundary replaced the array with an opaque reference at
prerender, throwing "NAV_LINKS.map is not a function". Fixed by moving NAV_LINKS to its own plain
nav-links.ts module imported by both.)

$ node scripts/dash-static-check.mjs src/app/blog-evolve/r2/b/*.tsx src/app/blog-evolve/r2/b/*.ts
[]   ← 0 violations, run against the actual gate script (not just hand-grepped)
```

Hand-verified static gate rules, 0 violations, each also confirmed by running the real
`dash-static-check.mjs` above rather than eyeballing:

- No raw `<img>` — none in the route; no images at all, only inline SVG.
- No `unoptimized` — not present (no `next/image` usage to begin with).
- No `Math.random(`/`Date.now(`/`new Date()` — none in executable code (the phrase appears once,
  inside a `//` line comment explaining the constraint, which the checker's own comment-stripping
  confirms is not flagged).
- No emoji — none; all iconography is `lucide-react`.
- No `next/font` import — none.
- No `font-serif` — none.
- No unlisted font — only `var(--font-sans)` and `var(--font-display-mono)` used inline; no raw
  family names.
- No `dark:text-{zinc,neutral,gray,slate,stone}-{500,600}` — none (route is dark-only via explicit
  `zinc-*`/`emerald-*` classes, not `dark:` variants, so this is trivially satisfied).
- No random image host (`picsum`/`loremflickr`/`source.unsplash`/etc.) — none; zero remote image
  hosts of any kind.

Also confirmed by hand: single `<h1>` (page intro) with `<h2>`s for every section and `<h3>`s only
for individual report titles nested under the "Report index" `<h2>` (no level skips); every `<dl>`
(`page.tsx` stat row, `metric-panel.tsx` baseline/result bars) keeps `dt`/`dd` as direct children of
a `dl > div` group, icon inside `dt` where present; every `outline-none` is paired with a
`focus-visible:ring-2` (grep-confirmed, 0 bare occurrences); grid/flex items carry `min-w-0` (18
occurrences) where truncation matters; the Compare table is wrapped in a `relative
overflow-x-auto` container with `table-fixed` + `%` columns (no desktop scrollbar at 1280+, local
horizontal scroll only below the table's `min-w-[760px]` on mobile).
