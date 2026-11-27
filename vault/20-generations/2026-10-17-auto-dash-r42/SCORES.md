# auto-dash-r42 — SCORES

Target: dash. Round number derived from ledger (max `auto-dash-r*` + 1) = 42.
Round budget: `round-budget.mjs` returned N=1 (0 unfilled `PAGE_TYPES` — all 18 types already have at least one catalog entry), despite the scheduling prompt's outer request for N=2. This is this round. A second, independent `/dash-evolve` invocation follows per the skill's sequential-rounds rule, re-reading this round's ledger/delta/reassign-queue state.

Target draw: unfilled-queue empty → uniform random among `[dash, landing, native]` → **dash**. Not a Monday (2026-10-17 is Saturday), so no native-weekly-cadence override applies.

Freeze hash (candidates a+b+c, after both 1-fixes, before judging): `d2de117017afb03d3167608468af3735ee8ae42b` (taken before the 1-fix round, see note below) — **superseded**: see re-freeze note.

> Note: the freeze hash above was computed right after GENERATE, before the 1-fix round touched b and c. Per skill §2 "판정 중 이 해시가 바뀌면 그 라운드는 무효다" — a hash recomputed now (post-fix) will differ, which is expected and correct, because the 1-fix round legitimately changed b and c's source. The judge panel will see the POST-FIX state, which is the frozen state for judging purposes. Re-verifying no file changed between re-gate and screenshot/judge dispatch is the operative invariant, not matching the pre-fix hash.

## Reassignment
`reassign-queue.md` item #15 (`auto-dash-r41/a` "Fathom" OHLC candlestick, dropped for a diagnostic error — `table#1` was misidentified as the unrendered `ohlc-table.tsx` instead of the actually-rendered `trades-table.tsx`) assigned to **candidate a** verbatim, with both corrected root causes (SVG `fontSize` as attribute not CSS style; verify which table is actually rendered before touching colgroup widths).

## Hard gate results

| Candidate | Concept | 1st pass | 1-fix | Final |
|---|---|---|---|---|
| a | "Fathom" — OHLC candlestick trading console, watchlist rail + chart + on-demand order-ticket drawer (no permanent 3rd pane) | **Clean, 10/10** | not needed | **PASS** |
| b | "Shiftcast" — workforce capacity-planning simulator (live control-rail sliders drive a recomputed demand/capacity projection; no selection to speak of, inputs not a selection) | a11y hard-fail: `label-content-name-mismatch` on 12 mobile week-card expand/collapse buttons (custom `aria-label` omitted the visible date/count/status-badge text) | Removed the competing custom `aria-label`; visible content is now the accessible name; `aria-expanded` kept for toggle state | **PASS** (re-gate clean, a11y 100) |
| c | "Varia" — A/B-test experiment-comparison lab bench (pin → full side-by-side run card on the bench itself, no separate detail/consumer panel at all) | sweep hard-fail: `cell-overlap` 6px at 390px, `"Trend" ↔ "Samples"` header text spill (colgroup gave `Samples` only 8%=57.6px of the table's 720px min-width baseline, too narrow for its `SortableHead` label+icon) | Rebalanced `<colgroup>`: `Samples` 8%→10% (matching the already-safe `Confid.` column's proven-sufficient width), funded by trimming `Owner` 16%→14% (has slack — avatar + truncating name) | **PASS** (re-gate clean, a11y 100) |

### Gate detail (final, post-fix state)

| Candidate | static | lint | types | weights | sweep | focus | console | a11y | perf |
|---|---|---|---|---|---|---|---|---|---|
| a | 위반 0 | 위반 0 | 에러 0 | 3종 | 오버플로 0 | 0건 누락 | 결함 0 | 100 (bf-cache만) | 58 |
| b | 위반 0 | 위반 0 | 에러 0 | 3종 | 오버플로 0 | 0건 누락 | 결함 0 | 100 (bf-cache만) | 62 |
| c | 위반 0 | 위반 0 | 에러 0 | 3종 | 오버플로 0 | 0건 누락 | 결함 0 | 100 (bf-cache만) | 62 |

`bf-cache` is not among the promoted hard-fail audit ids (`heading-order`/`definition-list`/`target-size`/`skip-link`/`color-contrast`/`button-name`/`label-content-name-mismatch`) — record-only, does not affect pass/fail. perf is record-only per skill §3 gate criteria (dev-server measurements, no drop threshold applied).

All 3 candidates survive to the judge panel (3 ≥ 2, normal judging per skill §4).

## Variety axes applied this round
- a: theme=dark, accent=violet, face=`--font-display-wide`
- b: theme=light, accent=green, face=`--font-display-mono`
- c: theme=dark, accent=lime, face=`--font-display-wide`

Prior 3 dash winners (ledger): r39=light/orange/pretendard(no-override), r40=dark/cyan/pretendard(no-override), r41=light/sky/grotesk. No 2-run theme streak was active entering this round; this round explores violet/green/lime (all previously under-represented accents per `catalog-variety.mjs`: green 1, lime 2, violet 3, vs. amber/teal at 8).

## Macro-bucket / behavior diversity check (pre-GENERATE)
Avoided buckets (compiled from catalog + full evolve history): KPI-row+8/4-chart-split as dual main event, classic master-detail, always-on 3-pane trading terminal, generic rail+chart+feed, calendar/board-centric, feed-centric activity stream, hub-and-spoke radial map, twin-pane region comparison, small-multiples grid, bento/rail-free dense grid, drilldown+breadcrumb, nested-disclosure tree, node-graph canvas, vertical chronology timeline, Gantt/roadmap board.

This round's three shells: a = rail+chart+on-demand-drawer (explicitly NOT a permanent 3rd pane, matching the previously-rewarded "self-contained + nullable selection + on-demand dismissible overlay" differentiation pattern); b = control-rail simulator (inputs, not a selection axis at all — genuinely outside every bucket above); c = lab-notebook comparison bench (pin places full detail ON the bench itself, no separate consumer panel — also outside every bucket above). All three mutually distinct.
