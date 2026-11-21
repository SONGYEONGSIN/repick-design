# auto-dash-r37 — SCORES

Target: dash (second of two independent `/dash-evolve` executions in this scheduled session). `round-budget.mjs` returned N=1 again (0 unfilled PAGE_TYPES). Target drawn independently via uniform random among [dash, landing, native] (not excluding dash despite round 1 of this session also drawing dash — this repo's established convention is ambiguous between "exclude already-produced type" and "independent redraw" across its own history; the skill text's exclusion clause is textually scoped to the unfilled-PAGE_TYPES-queue case specifically, which is moot here since that queue is empty, so the literal reading is an independent redraw each time — same as `auto-dash-r35`'s precedent). Round number = 37 (max existing `auto-dash-r*` + 1, now that r36 is recorded).

Diversity ban-list recomputed from `catalog-variety.mjs`'s `banList()` over the last 3 dash ledger entries (r34 dark/green/pretendard, r35 light/lime/grotesk, r36 light/violet/wide): **theme=['light'] banned this round** (2-consecutive-same-theme rule triggered — r35 and r36 both light). No accent/face banned (none hit the ≥2-in-window-3 threshold). All 3 candidates assigned **dark** theme this round accordingly.

`reassign-queue.md` had one pending dash item, #9 (`auto-dash-r36/b` "Meshwire" network-dependency-graph console, dropped for a 2nd hard-gate failure: residual cell-overlap + new target-size on densely-packed nodes). Assigned to candidate **c** this round with both documented fix instructions carried verbatim.

## Candidates

- **a** — "Northbound": Incident Response Console, single full-width anomaly-flagged timeline (Line+Highlights, NOT a small-multiples wall) as hero, independent runbook checklist below, ephemeral per-anomaly tooltip. Real focusable anomaly markers (spacing verified ≥24px by construction). dark/cyan/mono.
- **b** — "Baseline": Vendor Quality Scorecard, full-width horizontal box-plot strip (12 vendors) as hero, independent vendor directory table below, ephemeral per-box tooltip. dark/indigo/grotesk. **DROPPED** (see below).
- **c** — "Fluxgraph": Service-dependency/API-topology graph console. **Reassignment of `reassign-queue.md` #9** (`auto-dash-r36/b` "Meshwire", dropped 2026-10-07 same-session for a repeat hard-gate failure) — rebuilt from scratch applying both fix instructions (pointer-only aria-hidden nodes + padding-aware colgroup math). dark/amber/mono.

## Hard gate (`gate.mjs --target web --routes /dash-evolve/r37/<v>`, env: `PW_CHROMIUM_PATH`/`CHROME_PATH`=`/opt/pw-browsers/chromium` + `PW_NO_SANDBOX=1`)

| Candidate | static | lint | types | weights | sweep | focus | console | a11y | perf | verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| a (pass 1) | 0 | 0 | 0 | 3종 | 0 | 0건 누락 | 0 | **100** | 59 | **PASS clean, no fix needed** |
| b (pass 1) | 0 | 0 | 0 | 3종 | **1 (table-overflow 6px @1264)** | 0건 누락 | 0 | **100·label-content-name-mismatch** | 64 | **FAIL** (sweep + a11y) |
| b (pass 2, 1-fix: removed custom aria-label on box buttons in favor of content-derived name + sr-only suffix; removed table's `min-w-[720px]`) | 0 | 0 | 0 | 3종 | **2 (page-overflow 520px @390 — new regression · table-overflow 6px @1264 — unresolved)** | 0건 누락 | 0 | 100 | 68 | **FAIL again** → **DROPPED per skill §3 "재실패 시 탈락"**. a11y fix held; sweep fix did not resolve the original violation and introduced a severe new one. Logged to `reassign-queue.md` (new item). |
| c (pass 1) | 0 | 0 | 0 | 3종 | 0 | 0건 누락 | 0 | **100** | 57 | **PASS clean, no fix needed** |

Source hashes at final judged state:
- a: `fc4107b77f0ed60a1de8ea1d52213f57a0cc5369`
- c: `3128cba78a1b5cc82d86a5d150ba177fdbabd7c0`

Survivors proceeding to §4 JUDGE: **a, c**.

## Judge panel (3-lens blind, general-purpose subagents, independent)

| Lens | Winner | Margin |
|---|---|---|
| 1 (brief compliance) | **c** | narrow — no hard-rule violations found in either; c's target-size/node-reachability claim was independently cross-checked (every node reachable via some table row, verified against the edge list) while a's marker-spacing claim could only be assessed as "plausible"; c's single centralized FOCUS token had zero exceptions while a had one inert decorative bare-`ring-2` riding alongside a real focus outline |
| 2 (commercial polish) | **a** | a's visual gestalt/restraint reads as the stronger "real premium product," but both have real flaws: a's "+ New incident" CTA and notification bell are both dead (no handler at all) on the page's most prominent chrome; c's hero graph has several truncated node labels, a hard-to-read busy-edge crossing, 4-of-5 sidebar nav items permanently tagged "Soon," and a mobile copy string ("hover with a mouse") that doesn't adapt to touch context |
| 3 (differentiation) | **c** | decisive — network/dependency graph is the first chart of its type to ever reach a judge in this catalog (two prior attempts died at hard-gate pre-judging); this categorically outweighs a's secondary advantage (a narrower single-producer/single-consumer selection mechanism vs. c's bare-id-to-many-consumers pattern), per the lens's own stated hierarchy (new chart type > new behavior on an old mark) |

**Aggregate: 2:1 majority for c ("Fluxgraph").** Not a tie, no tie-break procedure invoked, zero no-winner votes.
