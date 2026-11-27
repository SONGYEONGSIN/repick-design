# auto-dash-r36 — SCORES

Target: dash. Round number derived from auto-ledger.jsonl (max dash round + 1) = 36.
N: round-budget.mjs returned 1 for the requested N=2 (0 unfilled PAGE_TYPES — see DECISION.md §0). This is round 1 of this scheduled run's 2 independent /dash-evolve executions.
Target draw: PAGE_TYPES unfilled queue = [] (all 18 types have ≥1 catalog entry) → uniform random among [dash, landing, native] → **dash**.
Agent tool availability: confirmed present (general-purpose subagent type) — not a self_judged round.
Dev server: started on 3100 for this round, used for all gate/screenshot calls.
Lighthouse harness note: `PW_CHROMIUM_PATH` and `CHROME_PATH` both set to `/opt/pw-browsers/chromium` (pre-installed Chromium in this sandbox; the pinned `@playwright/test` download is blocked by the egress proxy). **`PW_NO_SANDBOX=1` was additionally required** — without it, Chrome fails to launch under `lighthouse`'s spawned process in this container and `gate.mjs` silently records a11y/perf as `unavailable` (a pass, by design) instead of a real score. This was discovered mid-round (first gate passes for a/b/c all showed `a11y: unavailable`); all gate runs were redone with the full env (`PW_CHROMIUM_PATH` + `CHROME_PATH` + `PW_NO_SANDBOX=1`) once discovered. Logged to DECISION.md and will be carried into round 2 of this session and reported for future dash-evolve executions.

## Candidates

- **a** — "Setpoint": OKR console, hero = hand-built bullet-chart grid (8 departments), inline-accordion expand (no persistent pane), independent sortable/filterable metrics table below (deliberately non-synced), ⌘K command palette. light/violet/wide.
- **b** — "Meshwire": service-dependency graph console (network/dependency graph — first-of-catalog chart type), full-width graph hero, dismissible node-inspector popover, independent bottom incident timeline, mandatory adjacency-list fallback table. dark/green/mono. **DROPPED** (see below).
- **c** — "Quadrant": campaign spend × conversion-rate scatter/bubble chart command-deck. **Reassignment of `reassign-queue.md` #8** (`auto-dash-r35/c`, dropped 2026-10-04 for a 3-part hard-gate failure) — rebuilt from scratch applying all 4 documented fix instructions verbatim. dark/orange/no-display-face.

## Hard gate (`gate.mjs --target web --routes /dash-evolve/r36/<v>`)

| Candidate | route | static | lint | types | weights | sweep | focus | console | a11y | perf | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| a (pass 1) | /dash-evolve/r36/a | 0 | 0 | 0 | 3종 | 0 | 0건 누락 | **13건 hydration** | unavailable | unavailable | **FAIL** (console) |
| a (pass 2, 1-fix: hand-rolled compact-currency, no Intl compact path) | same | 0 | 0 | 0 | 3종 | 0 | 0건 누락 | 0 | unavailable* | unavailable* | pass (env not yet fixed) |
| a (pass 3, real a11y/perf after env fix) | same | 0 | 0 | 0 | 3종 | 0 | 0건 누락 | 0 | **96 · label-content-name-mismatch** | 68 | **FAIL** (a11y promoted audit) — newly surfaced by the env fix, not a repeat of pass 1's issue |
| a (pass 4, fix: aria-label now contains visible "MB" text) | same | 0 | 0 | 0 | 3종 | 0 | 0건 누락 | 0 | **100** | 61 | **PASS** |
| b (pass 1) | /dash-evolve/r36/b | 0 | **1 (react-hooks/set-state-in-effect)** | 0 | 3종 | **5 (cell-overlap ×2 real + sr listed, see violations)** | 0건 누락 | 0 | unavailable | unavailable | **FAIL** (lint + sweep) |
| b (pass 2, 1-fix: palette conditional-mount instead of effect-reset; header-button flex/truncate + colgroup rebalance) | same | 0 | 0 | 0 | 3종 | **2 (residual cell-overlap, "ms"↔"5,100", 2px)** | 0건 누락 | 0 | **96 · target-size (new)** | 67 | **FAIL again (sweep residual + new a11y)** → **DROPPED per skill §3 "재실패 시 탈락"**, logged to `reassign-queue.md` #9 |
| c (pass 1) | /dash-evolve/r36/c | 0 | 0 | 0 | 4종 (기록만) | 0 | 0건 누락 | 0 | unavailable | unavailable | pass (env not yet fixed) |
| c (pass 2, real a11y/perf after env fix) | same | 0 | 0 | 0 | 4종 | 0 | 0건 누락 | 0 | **100** | 57 | **PASS**, no fix needed |

Source hashes at final judged state (candidates folder, `.tsx`+`.ts` concatenated, `shasum`):
- a: `078816b49c13988ff24e2a97eb1ef06acce0da7b`
- c: `5808ca68a175b0bda699aac724a2ee847c1f52d6`

Survivors proceeding to §4 JUDGE: **a, c** (2 candidates — blind panel, no tie-break scaffolding needed per skill §4 "생존 후보 2개 이상일 때").
