# auto-dash-r33 — DECISION

Target: **dash** · Round: **auto-dash-r33** · Date: 2026-10-01
First of two independent `/dash-evolve` executions in this scheduled 2-round-back-to-back run (per the scheduled prompt, this prompt does not hardcode the target-selection rule — SKILL.md §0's unfilled-PAGE_TYPES-first logic is the sole source).

## §0 Target selection

- `round-budget.mjs "2"` → **N=1** (0 unfilled `PAGE_TYPES` — all 18 types have catalog entries; coverage-based N≥2 has no basis). Logged per SKILL.md §0-0-1: caller requested 2, script forced 1 this execution; the scheduled-task's "2 consecutive rounds" requirement is satisfied by running two independent single-round executions sequentially (this is `r33`; the second is `r34`, started after this round's delta/questions are appended, per SKILL.md's consecutive-round section).
- Today (2026-10-01) is a Thursday — no Monday native-cadence forcing.
- Unfilled-type queue is empty → target drawn from `[dash, landing, native]` uniform random → **dash**.
- Round number: `auto-dash-r33` (max existing dash round 32 + 1).
- Agent-tool availability confirmed before starting (per §0-0) — this round is NOT `self_judged`.

## §1 RETRIEVE (summary)

Read in full: `dash-brief-v3.md`, `page-brief-core.md`, `page-brief-repo.md`, `curation-criteria.md`, `dash-deltas-provisional.jsonl` (71 entries — open/non-superseded L1/L2 items identified and folded into the designer briefs as directives, not links), `charts.catalog.md`, `colors.catalog.md`, `motion.catalog.md`, `ux-guidelines.catalog.md`, last 5 dash ledger entries (r28–r32), `reassign-queue.md` (1 pending dash item — see below).

- `catalog-variety.mjs` banList (window=3, recent dash: r32 light/rose/grotesk, r31 dark/indigo/pretendard, r30 dark/emerald/pretendard) → `{theme: [], accent: [], face: ['pretendard']}`. All three candidates assigned distinct non-Pretendard display faces (wide/mono/grotesk) accordingly.
- Reassign-queue: item #6, `auto-dash-r32/b` ("Census" waffle grid), pending with a precise root-cause diagnosis (drawer-table `min-width` exceeding the drawer's real usable width, only visible with the drawer open). Assigned to candidate **a** this round, with the exact diagnosis carried into its brief verbatim (per reassign-queue's own rule: cite the failure reason or it recurs).
- Macro-bucket avoidance: recent dash macros (hero+ARR-bridge, hero+bullet-grid, 3-pane market ×2, feed-centric, calendar-board, kanban-board, pure-drilldown, tree/decomposition ×2, small-multiples-wall, process-map-graph, node-link-graph, box-plot, sunburst) given to all three designers as a do-not-repeat list. Candidates b (geographic/hex-choropleth map) and c (vertical conversion funnel) assigned genuinely unused chart types from `charts.catalog.md`'s 25-type table.

## §2 GENERATE

Three designer agents dispatched in parallel, each given the full assembled brief (brief text inline, not links — per SKILL.md's "give the assembled brief, not paths" lesson), each isolated from the other two candidates' folders and from the `/dash` gallery.

- **a — "Census"** (reassigned): light theme, amber accent, `--font-display-wide`. Support-ticket-triage console: 10×10 waffle grid (largest-remainder/Hare–Niemeyer allocation guaranteeing exact 100-cell sum) reading backlog composition at a glance, category click opens an on-demand slide-over drawer (closed/no-selection by default) with a real sortable ticket table. 5 interactions: CSS-only hover tooltip, click-to-select→drawer, status filter + sort in drawer, Today/7d/30d period toggle, ⌘K command palette.
- **b — "Routeline"** (free): dark theme, teal accent, `--font-display-mono`. Logistics/delivery-ops console for a fictional parcel carrier: hand-built SVG flat-top hex-grid (12 zones, fixed-formula geometry) as the catalog's first geographic/choropleth-style dominant visualization, dual-channel encoding (hue=status, intensity=selected metric), classic master-detail macro (fixed rail + map + **permanently-reserved, non-null-default** detail pane). 5 interactions: keyboard-accessible hover/focus map tooltip, rail sort/filter, metric toggle, region-select→detail panel, ⌘K palette. Selection fan-out explicitly scoped: persistent `selectedId` vs. a structurally separate, never-persisted `hoverId`/`focusId` preview pair.
- **c — "Arcway"** (free): dark theme, violet accent, `--font-display-grotesk`. B2B SaaS conversion-funnel console: 5-stage vertical funnel (Visitor→Signup→Activated→Paid→Retained), every stage prints count + drop-off % as standing text (never hover-gated), stage-click→pin→scoped cohort table (explicitly, in-code-commented, does not drive any other widget). Hero+inline-stats (no 4-card KPI row).

Each candidate wrote its required self-report + "Brief gaps" section to `candidates/{a,b,c}.md`.

## §3 HARD GATE

See `SCORES.md` for the full gate tables. Summary: **all three candidates failed pass 1** on lint, independently hitting the identical `react-hooks/set-state-in-effect` idiom in their command-palette reset-on-open logic (a convergent bug, not shared code — three isolated agents, same mistake). a also failed `a11y` (96, `color-contrast`). Each received its one allowed fix:

- **a**: fixed. Moved `SortIcon` out of render (was `react-hooks/static-components`), moved the index-reset into the search input's `onChange`, darkened `amber-600`→`amber-700` CTA/badge and bumped several default-view `zinc-500`→`zinc-600` instances for contrast. Re-gate: **lint 0, a11y 100, pass.**
- **b**: fixed. Split `CommandPalette` into an always-mounted trigger + an inner dialog component that only mounts while open, so state resets for free via initial `useState` rather than an imperative effect. Re-gate: **lint 0, a11y 100, pass.**
- **c**: fix attempted (wrapped `Popover`'s `close` in `useCallback`) but the `react-hooks/refs` violation re-triggered identically on re-gate (same file, same line — `children({ close })` is invoked during the parent's own render pass, so memoizing the function itself doesn't defer the implicit ref read that flows through it). Per SKILL.md §3 ("재실패 시 탈락" — one fix only, re-failure drops the candidate), **c is dropped before judging.**

This is a rule-violation drop, not a form-level rejection — c's funnel concept, stage-pin exclusion comment, and always-visible drop-off text were never evaluated by any lens and remain untested. Logged to `reassign-queue.md` (new item, see below) per curation-criteria's "게이트 탈락은 형태 판정이 아니다" standing rule.

Source hash at freeze (all 3, pre-gate): `451e62d6cfae1d0102b9547ca14c1eaee0dd3706`. Hash held through both gate passes and both screenshot captures (no re-generation after freeze).

## §4 JUDGE PANEL (2 survivors: a, b)

Three lenses dispatched in parallel and fully blind to each other (and to c, and to the `/dash` gallery). Each given 3–4 frames per candidate (within the stated frame budget) plus full source for a and b only.

**Lens 1 — brief/profile compliance → 1st: a, 2nd: b.**
Both pass nearly everything cleanly (real light theme on a, real product dark on b; font discipline — one display face each, exactly 3 rendered weights each, confirmed by grep; 100% English copy; 44px shell controls individually verified; ≥4 real interactions each; 1920px edge-gap rule satisfied by both; deterministic data with subtotals-equal-totals; selection fan-out properly scoped in both, with b's being the more explicitly-commented of the two). Decisive, citable difference: **b has 4 unguarded `sr-only` elements inside `overflow-y-auto`-clipped containers** (`detail-panel.tsx:64,108`, `region-rail.tsx:116,213`) with no `position:relative` anchor — a verbatim brief rule (`page-brief-core` §2 / `dash-brief-v3` grid-craft) that a visibly engineered around (`ticket-table.tsx:106`, `ui.tsx:207`, both correctly `sr-only relative`, with an in-source comment documenting the deliberate fix). Lens 1 did not pixel-measure computed font weights (grep-only) and did not visually confirm no-cell-overlap at 390px for either candidate (both mobile screenshots were cut off above the relevant content — an equal gap, not a differentiator).

**Lens 2 — commercial polish → 1st: b, 2nd: a.**
Both candidates clear the "at-a-glance, no-hover-required" bar (a's values live in the always-visible category-legend panel beside the mouse-only waffle grid; b's hex labels print code+value permanently). Decisive factors for b: its detail panel is never empty on load (`DEFAULT_SELECTED_ID` seeded to the worst-performing zone, with an in-code comment explaining why), its scrolled sections add genuinely new information (depot table, incident table) rather than repeating the fold, and its dual hue+intensity map encoding reads as a more bespoke domain instrument. Against b: its top-level network-volume KPI and all 12 per-zone weekly-volume figures are suspiciously round (multiples of 100) — a concrete data-realism ding, though depot-level and revenue figures are textured enough to avoid feeling fully synthetic. a's data has no round-number smell anywhere checked. Lens 2 did not independently re-verify every subtotal arithmetic by hand (relied on the `reduce`-derived construction) and did not test any interaction live (source-code read only, no running app).

**Lens 3 — archetype differentiation → 1st: a, 2nd: b.**
Both dominant-visualization types are genuinely novel and verified as their claimed type from the screenshots (a's grid is discrete unit cells, not a disguised bar chart; b's hex tessellation is real `<polygon>` geometry, not a disguised table) — though lens 3 flagged that b's own source comments describe its hex layout as "a deliberately abstracted instrument layout... not a literal map of any real territory," a nuance on the "geographic" framing that doesn't undermine its catalog novelty. Below the surface, the two candidates' selection architectures diverge meaningfully (a: nullable selection, dismissible modal overlay, no space permanently reserved for detail; b: non-null default selection, permanently-reserved third pane, plus a structurally separate hover/focus preview state a has no counterpart for) — ruled NOT a collapse into the same master-detail pattern, since the actual state lifecycle differs in the way the brief's own test cares about. No within-round domain/copy/template collision found (different industries, different branding, different metrics; the only shared element — a 4-up stat-card row with icon+number+caption — is explicitly brief-mandated shell convention, ruled neutral). Deciding factor: b's fixed rail+center+always-populated-detail-pane skeleton structurally resembles the catalog's already-used 3-pane trading-terminal shells (candlestick/scatter rounds), even though the pane's *content* (a hex map) has no precedent; a's skeleton (no persistent third pane at all) has no match anywhere in the catalog's history and is explicitly the shape that has never been successfully promoted before. Lens 3 did not run the app or exercise any interaction live, and did not check gate/lint/a11y status for either candidate (explicitly out of scope for this lens).

**Aggregate: 1st-place votes — a: lens1, lens3 (2) · b: lens2 (1). Majority 2:1 for a. No no-winner votes. Not a complete tie — no tie-break procedure needed.**

## Winner: a ("Census")

No lens found an unresolved rule violation in a (lens 1 explicitly passed every checked rule; the only note — `SectionLabel` using a `<p>` rather than an `<h2>` — was explicitly ruled not a heading-skip violation). **No §3-1 post-judgment fix required.**

## §5 LEARN

One delta extracted from judge reasoning (lens 3's decisive finding) and appended to `dash-deltas-provisional.jsonl`:

> A macro skeleton with a permanently-reserved, non-null-default third pane (fixed rail + center visualization + always-populated detail pane) reads as structurally close to this catalog's existing 3-pane trading-terminal archetype — even when the center visualization itself is genuinely novel and has zero catalog precedent. A self-contained visualization + nullable selection + on-demand dismissible overlay (no persistent third pane, no default selection) differentiates further, independent of what fills either shape. For archetype-differentiation judging, the information-architecture skeleton (does a pane always exist? is a selection always non-null?) is itself a convergence axis, separate from the dominant-visualization type.

Level: L1 (single-round observation from a 2-candidate comparison — not yet reproduced across rounds). `judge_votes: {lens1: "a", lens2: "b", lens3: "a"}`, `confidence: high`.

No new `questions-queue.md` entry this round — no sharp principle conflict or meta-criteria-unjustifiable item surfaced (lens 3's "abstracted, not literal geography" nuance on b is a candidate-level observation, not a cross-principle conflict).

## Reassign-queue update

**Dropped and newly queued**: `auto-dash-r33/c` ("Arcway" conversion-funnel console) — dropped at the hard gate, not by judging, for a `react-hooks/refs` violation in a shared `Popover`/dismissable-menu utility component (`ui.tsx`) unrelated to the funnel concept itself. Root cause: the component's render-prop call `children({ close })` executes `close` (a function that reads `triggerRef.current`) synchronously during the parent's own render pass; wrapping `close` in `useCallback` does not fix this, since the lint rule objects to the ref-reachable call happening during render, not to the function's identity stability. **Reassignment instruction for a future round**: do not call `close()` (or any ref-touching callback) directly inside the render-prop invocation; instead pass the stable `useCallback`-wrapped function reference itself to `children` without invoking anything that touches a ref until the actual consumer (e.g. a button's `onClick`) fires it as a real event. The funnel's dominant-visualization design (5-stage, always-visible count+drop-off%, stage-pin→explicitly-scoped cohort table) was never evaluated by any lens and remains a live, untested candidate shape.

**Consumed**: item #6 (`auto-dash-r32/b`, the original "Census" waffle-grid drop) — this round's candidate `a` is its rebuild. Per reassign-queue convention, moving to archive regardless of this round's outcome (a won, so this is now a full promotion-eligible candidate, not just a surviving reassignment).

## Canon

Unchanged: `vault/00-principles/dash-brief-v3.md`, `vault/00-principles/design-principles.md` untouched. `/dash` gallery and `/v1`–`/v5` untouched. `dash-deltas-provisional.jsonl` append-only (+1 entry). No commits to `main`.
