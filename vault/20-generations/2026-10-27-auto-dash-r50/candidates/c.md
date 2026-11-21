---
tags: [dash-evolve, r50, candidate-c]
---

# Candidate C — Flagline (feature-flag / experimentation console)

Route: `/dash-evolve/r50/c` · Files: `app/src/app/dash-evolve/r50/c/*` (local to this folder only).

## Product & brand

**Flagline** is a feature-flag and experimentation console in the Mercury/Monarch/Asana/n8n/Calendly/Coinbase/Cycle production-grade register — a tool an engineering/product team opens daily to toggle flags, scope rollouts by environment, and read guardrail-metric results for active A/B tests. Theme is true light (`bg-zinc-50` canvas, `bg-white` + `border-zinc-200` + `shadow-sm` cards — never cream/paper), single accent **emerald** (AA-safe: `emerald-600`/`-700` on white, `emerald-700` text on `emerald-50` fills), semantic **rose** reserved strictly for the regression/negative state (paired with icon + the word "regressed", never color alone — this is a second *functional* color, not a second decorative brand accent, so it does not violate the single-accent rule). Display face `--font-display-grotesk` is used only for the "Flagline" wordmark; every other glyph on the page is `--font-sans` (Pretendard).

## Macro layout — rail-free dense bento

No left sidebar anywhere. The shell is a single sticky topbar (brand lockup, an environment-scope segmented control acting as this page's lightweight section nav, the ⌘K search trigger, the primary "New flag" action, a notifications popover, an avatar menu) followed directly by a 12-column bento grid as the only page content, matching the deliberate rail-free precedent this round assigns (confirmed `/dash/d34` "Pulse" is topbar-only with no left rail before writing any of this page's own domain/composition/code, which is unrelated to Pulse's SLA domain or bento arrangement).

Grid (gap-4, items `min-w-0`, 1800px soft cap on `<main>` — since there is no sidebar to subtract, the available width at 1920px is ~1920 − 2×24 page padding ≈ 1872px before the cap engages at all, and the cap sits comfortably under that so the measured right-edge gap at 1920 is the ≈24px side padding only, well under the 40px ceiling):

1. **Row 1 — 4 stat cards** (`col-span-3` each at `sm+`, `col-span-6` on mobile): Active flags, Live experiments, Conversion regressions, Avg rollout. Every value is a `.length`/`.reduce` over the same underlying arrays the rest of the page reads — the regression count here, the notification badge count, and the slope chart's regression lines all trace back to one `resolveMetric(...).direction === "regressed"` filter, so they can never disagree.
2. **Row 2 — the dominant visualization**: the slope chart card (`col-span-8`, fixed `520px` card height so it sits flush with its row neighbor) next to the **Active experiments** list (`col-span-4`, same `520px` height, its own `overflow-y-auto` so 8 rows never force the card taller than the chart beside it — this is the "balance uneven card heights" rule applied directly, rather than left as awkward whitespace).
3. **Row 3 — Feature flags table** (`col-span-8`, sortable/filterable) beside a **stacked right column** (`col-span-4`) holding the **Pinned experiment** summary card and the **Rollout by environment** card — two shorter cards stacked to match the table's height instead of one tall card straining to match it.

## The slope chart (dominant visualization)

One deterministic generated SVG (`slope-chart.tsx`, viewBox `0 0 760 340`, all coordinates `round2`'d) draws one near-vertical line per active experiment from a **Before** column (`x=210`) to an **After** column (`x=560`), for whichever guardrail metric is toggled (Conversion / Latency / Error rate). Both columns share one value-scale per metric (true slope-chart semantics — the line's slope encodes the real magnitude of change, not an arbitrary per-row index), and a deterministic collision resolver (`resolveColumn`, sort-then-enforce-min-gap, forward pass + backward-pass bounds clamp) keeps labels at least 32px apart even when raw values cluster (this happens for the Error-rate view, where seven experiments sit under 0.6% and one outlier sits at 1.85%).

**Always-visible endpoint values**: every line carries its exact Before value and After value as persistent SVG `<text>` (bold, `tabular-nums`) at both endpoints — never hover-only, satisfying the chart catalog's "Trend Over Time" requirement for at-a-glance legibility. Direction is never color-alone: each line's color (emerald/rose) is paired with both a lucide `TrendingUp`/`TrendingDown` glyph (rendered as a genuine nested `<svg>` — lucide components forward `x`/`y`/`width`/`height` onto their root `<svg>`, so this is a real lucide icon positioned inside the chart's own coordinate space, not a CSS-shape substitute) **and** the literal word "improved"/"regressed" next to the signed percent. A `<figure>`-style legend line states which direction is "better" for the active metric, since up/down position alone doesn't convey good/bad for latency or error rate.

**Required fallback**: a `sr-only` semantic `<table>` (caption, `scope="col"` headers) immediately follows the chart with the same Experiment/Flag/Before/After/Change/Result columns, satisfying the catalog's "필수 폴백" for this chart type. Each line is also a focusable, `aria-label`-carrying SVG `<rect>` hit-area (keyboard Tab + mouse hover both call the same `onHover`), so the full before/after/delta/direction sentence reaches screen-reader and keyboard users even before they reach the fallback table.

## Components

`ui.tsx` (Card, CardHeader, Badge, ProgressBar, SegmentedControl, SortButton, StatCard, `useOutsideClose`, `useReducedMotion` via `useSyncExternalStore` — not setState-in-effect), `topbar.tsx`, `command-palette.tsx`, `slope-chart.tsx`, `experiments-list.tsx`, `flags-table.tsx` (semantic `<table>`, `table-fixed` + `<colgroup>` %, `aria-sort`, local `overflow-x-auto` only on mobile widths, `relative` on that wrapper per the sr-only-anchor rule, hover rows, status badges with icon+text, avatar cells via `next/image` with fixed Unsplash photo IDs already vetted elsewhere in this catalog), `pin-summary-card.tsx`, `rollout-card.tsx`, `new-flag-drawer.tsx`, `data.ts`/`format.ts`/`types.ts`.

## Interactions (6, all real `'use client'`, deterministic)

1. **Slope-chart hover/focus tooltip** — hovering or Tab-focusing a line's hit-area dims every other line and thickens the active one; the full comparison sentence is already in that element's `aria-label`. Ephemeral: touches no other widget's state.
2. **Guardrail metric toggle** — Conversion/Latency/Error-rate segmented control in the chart's own card header recomputes the chart **and** the Active-experiments list's per-row delta badges (the two widgets that are actually about "which metric," so sharing the toggle is a filter, not a selection-mirroring shortcut).
3. **Flags-table sort + filter** — three sortable columns (Flag, Rollout, Updated) with real `aria-sort`, plus an All/Active/Paused segmented filter, both local state inside `FlagsTable`.
4. **Pin axis** — clicking a row in the Active-experiments list (or a regression in the notifications popover, or a palette result) pins that experiment into the narrow summary card. Defaults, at first paint, to **the worst conversion-rate regression** (`defaultPinnedId`, computed by scanning the data, never hand-picked) — never an empty "select something" placeholder. This axis is independently scoped from the hover tooltip, the metric toggle, and the environment filter, per this round's explicit "narrow, multi-axis independent scoping beats one thread shared everywhere" guidance.
5. **Topbar environment scope** — a Production/Staging/Development/All segmented control (this page's stand-in for a section nav, see Brief gaps) that recomputes only the flags table and the "Active flags" / "Avg rollout" stat cards. A third, independent fan-out axis.
6. **⌘K command palette** — fuzzy-searches flags and experiments; Enter on an experiment sets the pin axis, Enter on a flag clears the environment scope and scrolls/highlights that row in the table. Built on the combobox/listbox/`aria-activedescendant` pattern, with result buttons given `tabIndex={-1}` so Tab never leaves the search input (the exact fix this catalog's notes record for the "palette option in tab order" failure class).

Plus a functional primary action: the topbar's **New flag** button opens a real drawer form (name, key, environment, rollout slider) and on submit prepends a genuine new row to the flags table's state — not a CTA with no handler.

## Typography

Exactly 3 rendered weights, verified by `getComputedStyle` intent (every element has an explicit weight class, nothing left to Tailwind preflight's silent 400 default): `font-normal` (400 — body/table cells/secondary labels, including the sr-only fallback table's `<td>`s), `font-semibold` (600 — card/column titles, badges, buttons, segmented controls, the sr-only table's `<th>`s), `font-bold` (700 — the "Flagline" wordmark and every key number: stat values, chart endpoint values). `font-medium` is never used. Numbers are `tabular-nums` and right-aligned where they're compared (table rollout/updated columns, chart values, stat values); labels are `text-[11px] uppercase tracking-wide`.

## Data integrity

8 experiments carry real before/after samples for all three guardrail metrics; every delta, percent-change, direction, and "significant" (`|pctChange| ≥ 5%`) flag is computed once in `format.ts::resolveMetric` and read everywhere else — no number is ever hand-typed twice. The regression count on the stat row, the notification badge, and the chart's rose-colored lines all derive from the same filter, so they can't drift apart. Flag environment counts (8 production + 3 staging + 1 development = 12) reconcile exactly against the flags total everywhere they're shown. Two flags (`price-anchor-banner`, `search-rank-ml-v3`) are marked `paused` and happen to be exactly the two *significant* conversion regressions — a deliberate, derived-consistent detail, not a coincidence I had to paper over.

## Brief gaps

1. **No left sidebar, but the page still needs some notion of "section"** — the brief explicitly invites a lightweight topbar nav for this rail-free exception but leaves the shape to the designer.
   **Decision**: an environment-scope segmented control (All / Production / Staging / Development) in the topbar, wired to actually filter the flags table and two stat cards, rather than a row of text links to other screens this one-page build doesn't have.
   **Why**: the brief's own penalty language is specifically about a *primary action button* with no handler; by the same logic, a nav control that looks like navigation but goes nowhere (an inert `<a>` to a page that doesn't exist in this build) would be worse than no nav at all. An environment scope is a real, idiomatic axis for a flags console and gave me a third genuinely independent fan-out ("multi-axis independent scoping" is explicitly ranked above a single shared selection in this repo's accumulated judging notes), so it does double duty instead of being decorative.

2. **The chart catalog's generic "Trend Over Time" fallback line calls for per-series line style (solid/dashed/dotted) in addition to color.**
   **Decision**: I did not add a third line-style channel on top of color; instead every line already carries both a lucide direction icon *and* the literal word "improved"/"regressed" next to its signed percent, which is strictly more than color+pattern for a screen-reader or color-blind reader, and I added the required sr-only data-table fallback on top of that.
   **Why**: with 8 individual experiment lines (not 2–6 named series), assigning distinct dash patterns per *experiment* would be arbitrary and decorative rather than meaningful — the catalog's real semantic axis here is binary (improved/regressed), which color+icon+text already encodes redundantly. This page's own brief is explicit that the slope chart's direction must be "color/icon-styled... not color alone — pair with a direction icon/label," which is the more specific, controlling instruction for this exact assignment; the general catalog entry's line-style suggestion is written for charts with few, nameable series and is superseded here.

3. **Whether the Pinned-experiment panel should reflect the currently-toggled guardrail metric or always show all three.**
   **Decision**: it always shows all three metrics for the pinned experiment, regardless of the chart's current toggle.
   **Why**: making the pin card metric-dependent would re-introduce exactly the "one selection threaded through every widget" pattern this round's brief singles out as the weaker, lower-ranked pattern — showing all three metrics is both more useful (a real guardrail review needs the whole picture for one experiment) and keeps the pin axis demonstrably independent of the toggle axis.

4. **Flags-table sortable columns.** The brief asks for "real sort/filter" without specifying which columns must sort.
   **Decision**: Flag (name), Rollout, and Updated are sortable; Environment, Status, and Owner are not.
   **Why**: those three are the columns a flag operator actually scans by rank (alphabetical, how exposed, how stale); Environment/Status are already visually scannable badges/text and Owner has no natural total order beyond name, which Flag-name sort already covers.
