# auto-dash-r12 — DECISION

target: dash · round: auto-dash-r12 · date: 2026-07-27 · run: `vault/20-generations/2026-07-27-auto-dash-r12`

## Candidates
- **a — Cadence** (Release & Reliability Console): hero DORA stats (deploy frequency / change-failure rate / MTTR / lead time) + dominant GitHub-style 14-week×7-day deploy/incident calendar heatmap (every cell always shows its deploy count as text, incident days get a distinct icon+color ring) + below-grid day-detail panel + sortable/filterable deploy table. DevOps/platform-engineering domain.
- **b — Covenant** (Contract Review & Redlining): master-detail — left sortable/filterable contract-list rail grouped by status (In Review/Redlining/Countersigning/Executed/Expiring Soon) with radial risk-score gauges, right detail pane with a segmented Clause-risk/Redline toggle (real `<ins>`/`<del>` diff markup for 2 clauses). Legal-ops domain.
- **c — Nudge** (Survey/Form Builder): split workbench — left question rail (accordion settings, inline completion-rate/drop-off bars, always-visible %) + right live respondent-preview pane with a segmented Preview/Logic-map toggle (generative SVG branch diagram). Survey-builder domain.

## Hard gate
All three passed on the first attempt, no 1-fix loop needed. See `SCORES.md` for full detail (static 위반 0 / sweep 오버플로 0 all three; gate-dispatched a11y/perf `unavailable` per this sandbox's root/no-sandbox constraint, real Lighthouse re-measured manually: a11y 100/100/100, perf 96/97/96 for a/b/c).

## Judge panel (3 lenses, blind — screenshots + source only, no authorial framing)

### Lens 1 — Brief compliance
**Ranking: a > b > c**
- a: zero violations found — every named interaction (5/5) present, all header controls literally `h-11`, contrast tokens correct in every state, table `min-w` correctly mobile-gated, sr-only correctly wrapped, seeded-PRNG deterministic data reconciles.
- b: one concrete violation — `ContractList.tsx:169` unpressed status-filter chip uses `text-zinc-400 dark:text-zinc-500` (wrong on both floors), reachable only via deselecting a filter — exactly the "toggle-gated state" contrast defect class the brief calls out by name (L3 principle). Otherwise clean, meets the 4-interaction floor.
- c: no disqualifying defect, but the largest compliance gap — **zero `<table>` elements** in the route (component-system checklist requires a sortable data table) and only 3/5 named interaction types present against the brief's explicit "≥4" floor.

### Lens 2 — Commercial SaaS polish
**Ranking: a > b > c**
- a: clean across all four widths, zero truncation, no dead space, KPI values always legible without hover, deepest verified state-wiring (period cascade recomputes stats/heatmap/day-detail, ⌘K wired to day-jump + service-filter).
- b: highest single-screen sophistication (risk rings, reconciling detail panel) but two concrete, screenshot-verified defects: persistent ellipsis-truncated counterparty names at every desktop width (1280/1440/1920), and a **mobile-only regression** — `ContractList.tsx` `min-w-[560px]` scrolls the Risk and Expiry columns (the single most decision-critical data in a contract-risk tool) entirely off-screen at 390px with no scroll affordance.
- c: cleverest generative asset (deterministic `LogicMap.tsx` branch diagram) and a genuinely working preview stepper, but the "Live preview" card hard-caps at `max-w-[380px]` (mobile-locked default) regardless of viewport — at 1920px this leaves a ~350-400px blank void beside the mockup, a visible first-impression defect at a mainstream desktop width.

### Lens 3 — Archetype differentiation
**Ranking: a > b > c**
- a: newest core visualization of the three — a calendar-heatmap deploy/incident tracker not present anywhere in the 33-candidate history — cleanly load-bearing, best domain fit (release cadence maps naturally to a calendar mental model).
- b: container skeleton (grouped/sortable record list + synced detail pane) is structurally a reskin of the prior "master-detail issue tracker" pattern, but the redline `<ins>`/`<del>` diff view is a genuinely new interaction/visualization absent from all 33 prior candidates.
- c: reads as a recombination of three pre-existing patterns under a survey-builder skin (split-editor+live-preview email-builder shell, linearized stepped-funnel drop-off bars, DAG/node-edge logic map) rather than a new archetype in its own right.
- **Flag (real defect, not decisive to the ranking but recorded for LEARN)**: b and c secretly share a macro skeleton — both drop the hero-card row entirely and open into a fixed-width left rail (~420-460px) + flexible right pane governed by a two-option segmented toggle that swaps which visualization renders in the same pane (b: Clause-risk↔Redline; c: Preview↔Logic-map). Left-pane *content type* differs (independent-record data table vs single-document accordion editor), so it isn't a pixel-identical clone, but the coarse shape (fixed rail + flexible pane + segmented-toggle-driven right side, no hero row) repeats twice in one round.

## Aggregate
All three lenses independently rank **a (Cadence) 1st, b (Covenant) 2nd, c (Nudge) 3rd** — a unanimous 3-0 decision. No tie-break rule needed.

**Winner: a — Cadence.**

## No-winner check
Not applicable — 0 of 3 lenses cast a no-winner vote.
