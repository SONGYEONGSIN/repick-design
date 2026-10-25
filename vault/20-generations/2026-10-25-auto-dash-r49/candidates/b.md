# Candidate B — Flowline (support-ticket flow / process-map ops console)

## Concept (one line)
Flowline is a support-ops console for a SaaS helpdesk team — a real light (white/zinc-50), lime-accented hero+inline-stats shell (chart-forward, rail-free) whose dominant visualization is a hand-built process map of how tickets move between six queue stages, headlined by the period's biggest bottleneck transition.

## Structure
- **Macro shell: hero + inline-stats.** Used twice in the immediately preceding five rounds (r46/a bump chart, r46/b arc diagram) — both prior instances paired it with a positional line/arc chart. This round pairs the same shell with a flow/process-map chart, which per Q58 I verified is a new pairing (no prior hero+inline-stats + process-map collision in `app/src/app/dash-evolve/` or `/dash`).
- **Dominant chart: process map**, plain SVG, six fixed stage nodes (New/Triage/In Progress/Escalated/Resolved/Reopened — Reopened offset below as the loop-back path) connected by quadratic-curve edges whose stroke width ∝ ticket count for the active period. One edge (Triage → Escalated) is flagged as the structural bottleneck and rendered in the accent color; all others in neutral gray.
- **Required fallback** (catalog grade B — "경로 요약 테이블, top3 병목 텍스트 주석"): the Transitions table lists every stage pair with ticket count and share-of-source-outflow, sortable, plus a "Bottleneck only" filter and CSV export. One `overflow-x-auto` scroller max (there is zero on this page — `table-fixed` + % columns, card list below `sm`).
- **Always-visible headline**: "Biggest bottleneck this period: Triage → Escalated — N tickets (X% of Triage outflow)" is computed fresh from `FLOWS`/`outflowOf()` on every period toggle, not hardcoded — switching 7d↔30d changes both the ticket count and the recomputed percentage.

## Interactions (5 implemented)
1. **Hover/focus crosshair on a flow edge** — invisible hit-target buttons positioned by percentage over the SVG; ephemeral `hoveredId` local to `ProcessMap`, drives a one-line readout ("Stage → Stage: N tickets") that otherwise shows a neutral instruction string.
2. **Period toggle (7d/30d)** — recomputes every inline stat (Intake, Resolved, Resolution rate, Reopen rate), the chart's edge widths, and the headline — all derived from the same `FLOWS` array for both periods, no separate hardcoded percentage.
3. **Click a stage node → pin** — `pinnedId`, drives exactly one consumer: the Stage Spotlight card (inflow/outflow for that stage only). Single-consumer tier, deliberately not maxed to the top tier this round (see Candidate A's note on varying tier coverage across the round).
4. **Real sort + filter on the Transitions table** — 4 sortable columns, a bottleneck-only toggle, independent of the stage pin.
5. **⌘K command palette (bonus)**.

## Brief gaps — what I had to decide and how

1. **What to decide**: the brief's "히어로 숫자+보조 지표, 인라인 스탯" variant note names inline stats as an alternative to the 4-card KPI row, but doesn't specify whether inline stats should keep card borders or be a plain unboxed row.
   **What I chose**: a plain flex row of label/value pairs separated by a top/bottom border on the row itself, no individual card borders.
   **Why**: a boxed 4-card row in a shell explicitly named "rail-free, chart-forward" would just be the standard KPI-row pattern with a different label — the whole point of offering this shell variant is to differ visually from that pattern, not reproduce it inside a different macro shell.
2. **What to decide**: the process map has one node (Triage) with two outgoing edges and the brief doesn't define "bottleneck" for a process map numerically.
   **What I chose**: bottleneck = the edge with materially the highest share of its source node's total outflow among a node's multiple outgoing edges (here, Triage→Escalated at ~22-23% of Triage's outflow vs. Triage→In Progress's ~75-78%).
   **Why**: raw ticket count alone would be misleading (Triage→In Progress has 3x the raw count but is the expected/healthy path) — share-of-outflow is the number that actually identifies a disproportionate drain, and it's the same number the Transitions table's "Share" column already surfaces, so the chart and its fallback agree on what "bottleneck" means.
