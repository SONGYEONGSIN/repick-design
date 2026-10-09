# Candidate c — Arcway Growth: conversion funnel

## 1. Concept

**Arcway** (invented B2B SaaS workflow-automation product) — an internal **Growth** dashboard tracking the self-serve pipeline **Visitors → Signups → Activated → Paid → Retained (90-day)**. Pinning a stage scopes the cohort table below it to that stage's **drop-off reasons** (for the first four stages — e.g. "Visitors → Signups" shows why 126,850 people left before signing up, broken down by reason + acquisition channel); pinning the terminal **Retained** stage instead shows the **retention-driver composition** of the retained cohort. Stated and enforced exclusion: pinning drives *only* this one table — it does not touch the hero stats, the trend sparkline, or the funnel's own printed numbers (see the comment block at the top of `dashboard-client.tsx`).

## 2. Implemented interactions (5 — 4 required + 1 bonus)

1. **Hover/focus tooltip on the funnel** (`funnel.tsx`) — keyboard-accessible (triggers on `onFocus`/`onBlur` as well as mouse), shows cumulative conversion-from-visitors and the absolute user loss for that step. Purely supplementary: the stage's count and drop-off % are already always-visible text at rest.
2. **Real sort + filter on the cohort table** (`cohort-table.tsx`) — every column sortable (`aria-sort` kept in sync, ascending/descending toggle), plus a channel filter (`SelectMenu`) that narrows the rows while keeping "share of total" computed against the *unfiltered* total.
3. **Period toggle** (`SegmentedControl` in `dashboard-client.tsx`) — "This period" / "Last period" swaps the entire funnel dataset, hero stats, deltas and cohort data to a second, independently-authored period of numbers.
4. **Stage-click → pin → scoped cohort detail** (`funnel.tsx` → `dashboard-client.tsx` → `cohort-table.tsx`) — click or Enter/Space on any of the 5 stage rows pins it (`aria-pressed`), driving the cohort table's scope/heading/rows.
5. **Bonus — working ⌘K command palette** (`command-palette.tsx`) — opens via trigger button or Cmd/Ctrl+K, arrow-key navigable, filters a live command list (switch period, pin any stage), full focus return on close, `combobox`/`listbox`/`aria-activedescendant` pattern.

Also present, not counted toward the minimum: tabbed mini-trend (`Tabs`/`TabPanel`, 3 metrics) next to the hero number, a quarterly-goal `Progress` bar, a notifications popover, and a workspace-switcher popover.

## 3. Font / typography confirmation

- Body, UI copy and all labels: `--font-sans` (Pretendard) only — no other sans/body face anywhere.
- Display face: `var(--font-display-grotesk)` via inline `style`, used in exactly **3 places**, all pure Latin: the hero conversion-rate number (`hero-stats.tsx`), the page `<h1>` "Conversion funnel" (`dashboard-client.tsx`), and the "Arcway" sidebar wordmark (`shell.tsx`). No second display face used anywhere.
- Rendered weights: exactly **3** across the whole route — inherited regular (400, never written explicitly), `font-medium` (500, for labels/buttons/nav/table headers), `font-bold` (700, for headings and headline numbers). Every `<th>` gets an explicit `font-medium` to override the browser's UA-bold default. No `font-semibold`/`font-light`/etc. anywhere.
- `tabular-nums` applied to every count, percentage and currency-like figure (funnel counts, drop-off %, hero %, deltas, table Users/Share columns, progress value text).

## 4. Completeness vs. the SaaS reference bar

- App shell: sidebar (brand + workspace switcher popover + 6-item nav with active pill + avatar/user popover) and top bar (⌘K search, primary "Export report" action, notifications popover with unread badge, settings icon) — all top-bar controls are a uniform 44px (`h-11`/`h-11 w-11`). Mobile collapses to a drawer with its own focus-trapped dialog semantics.
- Component system: `Card`, `Badge` (4 tones), `SegmentedControl`, `Tabs`/`TabPanel` (real ARIA tablist pattern with roving tabindex), `Popover`/`SelectMenu` (outside-click, Escape, focus-return, focus-on-open), `Progress`, `Sparkline`, sortable semantic `<table>` (caption, colgroup, `scope="col"`, `aria-sort`).
- Macro skeleton deliberately avoids the "KPI row + chart" shape: one hero number (end-to-end conversion %) with 3 inline supporting stats (retained customers, paid→retained rate, median time-to-activate) and a goal progress bar, all inside a single card — no 4-card row anywhere.
- Every funnel stage prints its count and (for non-first stages) its stage-over-stage drop-off % as standing text; nothing load-bearing is hover-only.
- Dark theme is "always dark" via plain `zinc-950/900`/`white/10`/`zinc-50/400` classes (no reliance on `prefers-color-scheme`, so it reads the same for every reviewer regardless of OS theme). Single violet accent (`violet-400`/`-500`/`-600`) for interactive/selected state; `emerald`/`rose` reserved strictly for semantic positive/negative deltas, always paired with an icon + text, never color alone.
- No registration marks, crop marks, stamps, bezels, glow, scanlines or grain — the funnel is drawn as plain bordered rows with a crisp SVG trapezoid, not an illustration.

## Brief gaps

Things the brief left open that I had to decide, and why:

- **Exact stage count / names**: brief offered three example pipelines (sales, hiring, lending) without mandating a stage count. Chose 5 stages (Visitor → Signup → Activated → Paid → Retained) as the canonical PLG funnel shape — long enough to make drop-off comparisons interesting, short enough that every stage's row stays legible at 390px.
- **Exact violet hex**: brief said "a single violet accent (desaturated, service-grade)" without a hex. Used Tailwind's built-in `violet` scale as-is (`violet-400 #a78bfa` for text/icon/sparkline accents, `violet-500`/`-600` for solid fills and the active segmented/tab state) rather than inventing a custom hex — it's already closer to a muted blue-violet than saturated pure purple, and staying on-scale keeps every shade AA-contrast-checked against the zinc-950/900 surfaces it sits on.
- **Exact funnel shape math**: brief required "SVG coordinates rounded to 2 decimals, computed from fixed formulas" but not the formula itself. Used `ratio = 0.24 + 0.76 * (count / firstStageCount)` mapped to a 500-unit-wide plot area, with each band's top width driven by its own count and its bottom width driven by the *next* stage's count (so adjacent bands visually taper into each other); the terminal stage renders as a plain rectangle rather than inventing a fake taper. The 0.24 floor exists purely so the smallest stage (Retained, ~1.7% of Visitors) still renders a legible band — documented in `funnel.tsx` as a visual-only compression, since the actual count and % are always given as exact text beside it, which is the real source of truth.
- **"Hover crosshair" vs. a stage tooltip**: the brief's literal phrase was "hover crosshair/tooltip on the funnel." A classic shrinking-stage funnel has no continuous axis for a crosshair to run along (unlike a line/bar chart), so I implemented the alternative the brief itself offers — a per-stage tooltip, triggered by hover *or* focus, carrying information genuinely supplementary to the always-visible text.
- **Where the period toggle lives**: brief said "a period/view toggle" without specifying placement. Put it in the page header (next to the `<h1>`) since it's the one control that re-scopes nearly everything below it (hero stats, funnel, and — because `COHORT_DATA` is also period-keyed — the cohort table), rather than attaching it to any single widget.
- **Cohort table's empty/terminal-stage semantics**: the brief's example was "a cohort breakdown table scoped to that stage's drop-off reasons," which has no obvious meaning for the funnel's *last* stage (there is no further drop-off to explain). Decided pinning the terminal stage instead shows "what the retained cohort is doing right" (retention drivers) using the exact same table shape, so all 5 stages stay uniformly pinnable instead of disabling the last one.
