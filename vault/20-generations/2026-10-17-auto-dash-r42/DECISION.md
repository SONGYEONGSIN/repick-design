# auto-dash-r42 — DECISION

**Deviation disclosure (first section, per skill §0-0)**: the `Agent` tool is available in this environment, but only generic agent types (no named `designer`/`comparator` personas) — matching this exact repo's precedent from the immediately preceding scheduled session (`auto-dash-r39`/`r40`/`r41`). Used 3 independent `general-purpose` Agent-tool subagents for GENERATE, 2 more for the 1-fix round, and 3 more (opus model) for JUDGE — each blind to the others and to candidate concept notes, preserving the independence invariant. No `self_judged` flag needed.

**Round-budget deviation**: `round-budget.mjs` returned N=1 (0 unfilled `PAGE_TYPES` — all 18 types already have ≥1 catalog entry), despite the scheduling prompt's outer request for N=2. This is correct per skill §0-0-1 — the scheduling prompt's request is advisory, the script's output is binding. This is round 1 of 2; round 2 is a separate, sequential `/dash-evolve` invocation that will read this round's fresh ledger/delta/reassign-queue state before starting.

## Target & round number
Target drawn: unfilled-queue empty → uniform random `[dash, landing, native]` → **dash**. Not a Monday (2026-10-17 = Saturday), no native-weekly-cadence override. Round number 42 = max existing `auto-dash-r*` (41) + 1, from `vault/30-ledger/auto-ledger.jsonl`.

## Reassignment consumed
`reassign-queue.md` item #15 (`auto-dash-r41/a` "Fathom" OHLC candlestick, dropped for an orchestrator diagnostic error — misidentified which `<table>` the gate's `table#1` selector pointed at) assigned verbatim to **candidate a**, with both corrected root causes explicit in the brief (SVG `fontSize` as attribute not CSS style; confirm which table is actually rendered before touching colgroup widths). **Reassignment succeeded at the implementation level**: candidate a passed the hard gate clean on the first attempt (10/10, no 1-fix needed) — both original failure modes did not recur. It did not win judging (see below) — a pure judgment loss, not a reassignment failure. Per this repo's established precedent (e.g. `auto-dash-r33/c`→`r34/a`, `auto-dash-r37/b`→`r38/c`), the reassignment's purpose — getting the form past the hard gate to a real judge panel — is fulfilled regardless of win/loss. **Archived, not re-queued a third time** (default per precedent; a third attempt is left to future judgment, same as the `r38/c`→`r40/a` case).

## Candidates
- **a** "Fathom" — OHLC candlestick trading console. Watchlist rail + candlestick chart (5-period MA overlay) + on-demand order-ticket drawer, no permanent third pane.
- **b** "Shiftcast" — workforce capacity-planning simulator. Control-rail sliders/presets drive a live-recomputed demand-vs-capacity projection (chart + sortable week table). No selection axis at all — inputs, not a pick.
- **c** "Varia" — A/B-test experiment-comparison lab. Pin up to 3 experiments onto a side-by-side bench; pinning places the full run detail directly on the bench itself, no separate consumer panel.

## Hard gate
See `SCORES.md` for the full table. Summary: a passed clean first try (10/10). b failed 1 audit first try (`label-content-name-mismatch` on 12 mobile week-card buttons — a competing custom `aria-label` that omitted the visible date/count/status-badge text), 1-fix (removed the competing label, kept `aria-expanded`) resolved it cleanly, re-gate clean. c failed 1 audit first try (`sweep` `cell-overlap` 6px@390px, `"Trend"↔"Samples"` header spill from an under-sized `colgroup` percentage), 1-fix (rebalanced `Samples` 8%→10%, funded from `Owner` 16%→14%, matched against the already-safe sibling `Confid.` column's width) resolved it cleanly, re-gate clean. All 3 candidates survived to judging (3 ≥ 2, normal judging per skill §4).

## Judge panel (3 independent blind lenses, opus model, 3 frames/candidate + source, concept notes withheld)

| Lens | 1st | 2nd | 3rd |
|---|---|---|---|
| 1 — brief/profile compliance | **c** | a | b |
| 2 — commercial polish (vs. real SaaS references) | **c** | b | a |
| 3 — archetype differentiation | **b** | c | a |

**2:1 majority for c** (lens1 + lens2 vs. lens3). Not a tie, no tie-break invoked. Matches `curation-criteria`'s established Q32 finding — a 2:1 split with a different dissenting lens each round is this catalog's normal outcome, not a flaw requiring a new questions-queue entry.

### Why c won
Lens1 and lens2 independently converged on the same decisive grounds: c is the only candidate that passes the always-visible-dominant-value rule at every width with zero exceptions (lift %, CI bounds, rate bars, and secondary metrics all render as static text, never hover-gated), has the cleanest selection-fanout (a capped multi-pin bench, no uniform id-threading, hover explicitly suppressed against the pinned set, both pointer+keyboard wired), has no visible desktop clipping/overflow defect (unlike a, which both lenses independently caught clipping the watchlist price column and the workspace-switcher box past the sidebar's right edge in the SAME two frames), and reconciles its own numbers exactly (lens2 independently recomputed c's sample counts and lift percentages against its own dummy data and found them internally consistent). Lens2 named b's dominant-chart-vs-KPI font-size inversion (a 60px hero number next to an effectively ~8px, value-free chart) and b's two factually-wrong product-copy claims (a "recommended hiring" preset that does not actually close the cited gap; a notification overstating how many breach-weeks a preset resolves) as concrete, decisive reasons b placed below c.

### Why lens3 dissented (not a flaw, see above)
Lens3 ranked b first specifically because its control-rail/simulator interaction model (inputs drive a live recomputation, not a selection) has no precedent anywhere in this catalog's macro-shell or fanout taxonomy — a genuinely new interaction *category*, not just a new skeleton. Lens3 ranked c second, and flagged (independently, via a direct repo search) that c's domain (A/B-test comparison) and its dominant visualization (a lift-point + confidence-interval whisker chart) closely echo the **already-promoted** `/dash/d47` ("Vela": "argues with a confidence band rather than a number"), down to a near-identical `CIBracket`-style component existing in that work's source. This is a real, concrete differentiation concern on the winning candidate, logged below as a LEARN consideration even though it did not change the round's outcome.

## Post-judgment fix (§3-1) — NOT APPLIED, and correctly so
No lens cited a hard-gate-checkable *rule* violation against the winner (c). Every finding against c (the partial empty 3rd bench slot at first paint; a statistically inconsistent confidence-percentage/CI-bounds pairing in two of its dummy-data rows; minor title/chip truncation) is a commercial-completeness or data-logic finding, not a brief rule the gate enforces — per skill §3-1 these are judge findings, not eligible for post-judgment fix (scope is rule-violation-resolution only, never taste/completeness). Left on the frozen winner as-is, recorded as LEARN deltas below for a future round's designer to address, consistent with this catalog's established handling of the same category of finding on prior winners (`r39/b` sunburst fallback-tree gap, `r40/c` empty detail panel, `r41/c` icon-orientation mismatch — all left unfixed post-judgment, all recorded as deltas).

## LEARN (append to `dash-deltas-provisional.jsonl`, L1)
Two independent, citable findings this round extend existing lineages — recording the stronger/more novel one as this round's required single delta (see jsonl for full text): a fourth machine-invisible semantic-mismatch axis (a generated confidence-interval's stated confidence percentage can be numerically inconsistent with its own CI bounds excluding zero — no hard gate or axe audit catches internal statistical-copy consistency), joining this catalog's existing aria-label/visible-text-mismatch and icon-orientation-mismatch axes. The empty-bench-slot finding is a 4th reproduction of the already-L2 empty-default-consumer-panel delta (first: `r30`, 3rd: `r40/c`) and needed no new entry — it is strong enough evidence to note here that the defect class now reproduces even on a shell (c's multi-slot bench) that has *no separate detail/consumer component at all*, the previously-identified strongest escape from master-detail — but this round does not re-litigate an already-L2 finding with a new append.

## Questions-queue
No new entry. The 2:1 split matches established Q32 (normal, not a conflict). The c-vs-d47 chart/domain similarity is real but did not change the outcome and is not a conflict between lenses or against meta-criteria — it is simply evidence for a future round's reassign/dedup check, not a question.

## Reassign-queue
Item #15 archived (see above): reassignment succeeded (hard gate clean), lost judging 3-0 across all 3 lenses — pure judgment loss, not re-queued a third time by default, left to future judgment per established precedent.

## Canon
`dash-brief-v3.md`, `design-principles.md`, `page-brief-core.md`, `page-brief-repo.md`, all type profiles, `/dash` gallery, `/v1`–`/v5` — all unchanged. jsonl append-only. No commits to `main`.
