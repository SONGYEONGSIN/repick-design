# auto-dash-r29 — SCORES

Target: dash. Round budget: requested N=2, `scripts/round-budget.mjs` forced N=1 (0 unfilled `PAGE_TYPES`
— see DECISION.md §0). Target draw (unfilled queue empty → dash/landing/native uniform random): **dash**.

Post-generation freeze hash (before gate): `e8d3f7cafb09c3eea403676f8a8af918a901e7f0`
Post-1-fix freeze hash (all three candidates, after fixes below): `1ed60729b989a26f60ac1d0e22fbf9d16317b21d`

## Candidate a — Lotwise (3-pane pricing/liquidation desk, candlestick)

| gate | 1st attempt | after 1-fix |
|---|---|---|
| route | pass | pass |
| types | pass | pass |
| static | pass | pass |
| lint | **fail** — `data.ts:163-164` `prefer-const` (`high`/`low` never reassigned) | pass (changed `let`→`const`) |
| weights | pass — 3 (rendered) | pass |
| sweep | pass — 0 overflow | pass |
| focus | pass | pass |
| console | pass — 26 messages, 0 defects | pass |
| a11y | unavailable (dev env has no Lighthouse) | unavailable |
| perf | unavailable | unavailable |

**Verdict: pass (1-fix).**

## Candidate b — Warden (feed-centric trust & safety console, network graph)

| gate | 1st attempt | after 1-fix |
|---|---|---|
| route | pass | pass |
| types | pass | pass |
| static | pass | pass |
| lint | pass | pass |
| weights | pass — 3 (rendered) | pass |
| sweep | **fail** — `cell-overlap` at 390/1280/1350/1366/1424/1440/1520/1536/1664/1680/1904/1920px, "Relationship" ↔ "Since" columns of the adjacency table inside the narrow (380px) network-graph side panel | pass — merged the 4-column table (Node/Type/Relationship/Since) into 3 columns (Node/Type/Relationship), with "Since" moved to a wrapped second line inside the Relationship cell instead of its own rigid column |
| focus | pass | pass |
| console | pass — 13 messages, 0 defects | pass |
| a11y | unavailable | unavailable |
| perf | unavailable | unavailable |

**Verdict: pass (1-fix).**

## Candidate c — Reloop (master-detail seller-quality console, scatter plot)

| gate | 1st attempt | after 1-fix |
|---|---|---|
| route | pass | pass |
| types | pass | pass |
| static | pass | pass |
| lint | pass | pass |
| weights | pass — 3 (rendered) | pass |
| sweep | pass — 0 overflow | pass |
| focus | pass | pass |
| console | **fail** — 13 hydration-mismatch pageerrors, e.g. `$209.0K` (SSR) vs `$209K` (client) for `formatCurrencyCompact` | pass — root cause: `Intl.NumberFormat({ notation: "compact" })` trailing-zero behavior is ICU-version-dependent and differed between Node (SSR) and the browser (client render) even with fully deterministic input data. Replaced with a hand-written compact-currency formatter (no `Intl` compact notation) that is byte-identical on server and client. |
| a11y | unavailable | unavailable |
| perf | unavailable | unavailable |

**Verdict: pass (1-fix).**

## Summary

All 3 candidates hard-gate-failed on the 1st attempt, on three unrelated, independent defect classes
(lint const-correctness / cell-overlap in a narrow side-panel table / SSR↔client Intl compact-notation
drift). All 3 passed cleanly on the 1-fix retry with genuine defect fixes (no scope creep — only the
failing gate's root cause was touched in each case). All 3 candidates proceed to §4 JUDGE PANEL.

The candidate-c hydration bug (Intl compact-notation ICU-version drift under fully deterministic data) is
a new failure mode not previously seen in this repo's dash-deltas — flagged as a candidate L1 delta in
DECISION.md LEARN section, since `dash-brief-v3`'s no-random rule only forbids `Math.random`/`Date.now`,
and this defect occurs with neither.
