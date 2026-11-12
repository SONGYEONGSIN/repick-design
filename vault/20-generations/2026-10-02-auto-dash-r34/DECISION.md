# auto-dash-r34 — DECISION

**§0 note**: round-budget.mjs returned N=1 for this invocation (0 unfilled PAGE_TYPES — all 18 types already have at least one catalog entry, so the coverage rationale for N≥2 does not apply). Target drawn uniformly at random from [dash, landing, native] (not a Monday, so the native weekly-cadence rule did not force a target) → **dash**. This is round 1 of this scheduled session's 2 independent back-to-back `/dash-evolve` executions. Agent-tool availability was confirmed present before starting; this environment only exposes generic agent types (no named `designer`/`comparator` personas), so 3 independent `general-purpose` agents were used for GENERATE and 3 more independent `general-purpose` agents for JUDGE — each dispatched blind to the others' output, which preserves the independence invariant the skill's self-check cares about. No `self_judged` flag.

**reassign-queue.md consumed**: item #7 (`auto-dash-r33/c` "Arcway" 5-stage funnel, dropped for a `react-hooks/refs` violation in a `Popover` render-prop call) was assigned to candidate **a** this round, with the exact fix instruction from the queue entry carried into its brief verbatim.

## Candidates
- **a** "Portway" — 5-stage buyer-activation conversion funnel (trapezoid bars), stage-pin → cohort table (first stage pre-pinned, non-empty at first paint). Dark / violet / mono.
- **b** "Vantage" — vendor radar/spider scorecard (new chart type to this catalog), toggle-chip vendor overlay + mandatory always-visible fallback table. Light / lime / grotesk.
- **c** "Verbatim" — word-cloud + sentiment console (new chart type to this catalog), sentiment-filter segmented control + mandatory always-visible frequency table. Dark / emerald(green) / pretendard (no display font).

## Hard gate
See `SCORES.md` for the full table. All 3 failed on first attempt (a: 5× `react-hooks/static-components` + 2× `react-hooks/set-state-in-effect`; b: 2× `react-hooks/set-state-in-effect` + 6× `cell-overlap` at 390px; c: 2× `react-hooks/set-state-in-effect` + 1× `page-overflow` 101px at 390px). All 3 cleared their one allowed fix and re-gated 100% clean (`pass:true`, `violations:[]`). Frozen-source hash at judging time: `3fc3fe73c9a2673a992737a987d603ae5c01a2a2`.

All 3 independently hit the identical `react-hooks/set-state-in-effect` pattern in their own command-palette component (reset `query`/`activeIndex` on open, in a `useEffect`) — convergent idiom mistake across 3 isolated agents, not shared code. Worth remembering as a generation-stage pitfall: resetting local UI state reactively to an `open` prop in `useEffect` is a near-default instinct that this repo's lint config specifically forbids.

## Judge panel (3 independent blind lenses, screenshots + source only, no candidate concept docs, no cross-lens visibility)

| | lens1 (brief compliance) | lens2 (commercial polish) | lens3 (differentiation) |
|---|---|---|---|
| 1st | c | c | b |
| 2nd | b | a | c |
| 3rd | a | b | a |

**Majority: c wins 2:1** (lens1 + lens2 vs lens3). Not a 3-way tie, no tie-break procedure needed, no no-winner votes from any lens.

- **lens1** ranked c > b > a on concrete, cited evidence: a has a real mobile defect (KPI tile values ellipsize to illegibility — "18,...", "22....", "1,0...", "46...." — confirmed in `a-390.png`, traced to `funnel-console.tsx:86-99`'s fixed-width sparkline crowding the value out at `col-span-6`/390px) and a measurable KPI-subordination inversion (KPI value `text-xl`/20px rendered *larger* than the funnel's own per-stage readout at `text-lg`/18px, `funnel-console.tsx:91` vs `:167`). c's own KPI strip is explicitly thin/non-interactive by design comment (`kpi-strip.tsx:1-3`) and measurably subordinate (`text-2xl` KPI vs `text-3xl` top word-cloud tile). Data-integrity check on c's sentiment counts reconciled exactly to 100.0% by hand computation.
- **lens2** ranked c > a > b on one decisive, reproducible rendering defect in b: the radar chart's "Compliance" axis label clips to "npliance"/"mpliance" across all three 1440px frames (`radar-chart.tsx:120-148,210` — text anchored at `textAnchor="end"` near the SVG's left edge, extending past x=0 into the default clip region; viewport-independent, so deterministic, not a one-off capture artifact) — "a clipped label on the dominant, centerpiece visualization is exactly the class of defect real QA would catch before shipping." a's density/completeness was otherwise strong but lens2 flagged not being able to see a's Cohort Breakdown section rendered in any frame (cut off at the header in both `a-1440.png` and `a-1920.png`) as an unseen-scope caveat, not a defect per se.
- **lens3 dissented for b** on structural grounds: b's selection-fan-out mechanism is **tier 4** ("no separate detail pane — selection recomputes the dominant viz itself in place"), explicitly self-documented in source (`entity-toggle.tsx:13-19`) and verified in the actual wiring (`dashboard.tsx:70-84`) — the single most-rewarded tier in this catalog's history — on top of a genuinely new-to-catalog chart type (radar). c also introduces a new chart type but its own item-level word tiles have **no click/selection handler at all**, only ephemeral hover (`word-cloud.tsx:57-88`) — its one real selection axis is a page-level sentiment filter (tier 2, "single filter → partial multi-widget recompute", self-documented at `feedback-explorer.tsx:35-40`), a weaker/more generic mechanism than b's. a reuses an already-catalogued chart type (funnel) and, despite a well-executed tier-3 hover/pin split, its persistent-pin→single-dedicated-detail-panel structure reads as "a soft echo of the catalogued master-detail skeleton... stacked vertically instead of side-by-side."

## Post-judgment fix (§3-1)
None needed. No lens's decisive reasoning for the winner (c) cited an unresolved rule violation — lens1 and lens2 both credited c cleanly; lens3's dissent was a differentiation/taste judgment (item-level selection mechanism being less ambitious than b's), not a rule violation. c's one shared gap with b (an unwired "Export report"/"Add vendor" primary-action button) was explicitly noted by lens1 as symmetric and non-decisive. Ranking is not recalculated.

## LEARN
1 new L1 delta appended to `dash-deltas-provisional.jsonl` (see below) — refines the r27/r28 KPI-subordination lineage with a concrete, measurable sub-check (compare rendered font-size of any persistent KPI/context number against the dominant visualization's own on-chart numeric readout) that two independent lenses both cited as real, screenshot-and-source-backed evidence rather than impression.

## reassign-queue.md
Item #7 (candidate a's funnel reassignment) is archived regardless of outcome per the queue's own protocol. Disposition: the original reassignment reason (a `Popover` render-prop `react-hooks/refs` violation) was fully resolved — candidate a's `menu.tsx` avoided the render-prop pattern entirely this time, and the fix held through both gate passes. The candidate did reach judging (unlike the original r33/c attempt) and lost 3rd/3 on genuine, cited defects (mobile KPI truncation, a measurable KPI-subordination inversion, and lens3's "soft echo of master-detail" structural note) — a mixed but mostly merits-based loss, not a pure rule-violation drop. Whether to attempt a third reassignment of this concept is left open for future judgment, per this queue's own precedent for mixed dispositions (see archive #5).

## Canon
`dash-brief-v3.md`, `design-principles.md`, `page-brief-core.md`, `page-brief-repo.md`, type profiles, `/dash` gallery, `/v1-v5` — all unchanged.
