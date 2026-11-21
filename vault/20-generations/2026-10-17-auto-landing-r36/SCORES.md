# auto-landing-r36 — SCORES

Target: landing. Round number from ledger (max `auto-landing-r*` + 1) = 36. This is round 2 of this scheduled run's two back-to-back `/dash-evolve` executions — round 1 was `auto-dash-r42` (winner c "Varia"), committed+pushed before this round's RETRIEVE began. `round-budget.mjs` returned N=1 again (0 unfilled `PAGE_TYPES`).

Target draw: unfilled-queue empty → uniform random `[dash, landing, native]` → **landing**.

No reassign-queue entry for landing ("대기 중" is empty) — all 3 candidates are free-exploration slots.

Freeze hash (post 1-fix on a, before fix): `b62bb338b96df4fd255507899500cac26980aaa0` (pre-fix state — superseded by the fix, same reasoning as r42's note: the 1-fix legitimately changed a's source after this hash was taken).

## Hard gate results

| Candidate | Concept | 1st pass | 1-fix | Final |
|---|---|---|---|---|
| a | A grading-confidence slope/ladder chart — condition-grade slider + category select drives a slope chart comparing listed price vs. repick AI price across 4 grade-tier comparables | a11y hard-fail: `label-content-name-mismatch` on 4 slope-chart row buttons (custom `aria-label` paraphrased the visible text instead of containing it verbatim) | Removed the custom `aria-label`, un-hid the visible text spans (removed `aria-hidden`), added the richer sentence as an additional trailing `sr-only` span | **PASS** (re-gate clean, a11y 100) |
| b | "Covera" — a multi-factor trust angle: 5 toggleable concern chips (authenticity/condition/ship speed/seller reliability/price fairness) drive a concentric ring cluster, center readout = live match confidence for selected concerns | **Clean, 10/10** | not needed | **PASS** |
| c | "repick for sellers" — category multi-select chip cloud drives a packed-circle bubble cluster sized by real sell-through-rate/days-to-sell per category | **Clean, 10/10** | not needed | **PASS** |

### Gate detail (final, post-fix state)

| Candidate | static | lint | types | weights | sweep | focus | console | a11y | perf |
|---|---|---|---|---|---|---|---|---|---|
| a | 위반 0 | 위반 0 | 에러 0 | 3종 | 오버플로 0 | 0건 누락 | 결함 0 | 100 (bf-cache만) | 51 |
| b | 위반 0 | 위반 0 | 에러 0 | 3종 | 오버플로 0 | 0건 누락 | 결함 0 | 100 (bf-cache만) | 55 |
| c | 위반 0 | 위반 0 | 에러 0 | 3종 | 오버플로 0 | 0건 누락 | 결함 0 | 100 (bf-cache만) | 57 |

All 3 candidates survive to the judge panel.

## Variety axes applied this round
- a: theme=light, accent=teal, face=`--font-display-wide`
- b: theme=light, accent=emerald, face=`--font-display-grotesk`
- c: theme=light, accent=blue, face=`--font-display-wide`

**Theme ban applied**: prior 2 landing winners (r34, r35) were both dark — a 2-run streak. `catalog-variety.mjs`'s `banList([r35,r34,r33,...], window=3, themeRun=2)` returns `theme: ["dark"]`. All 3 candidates this round assigned **light** to guarantee the streak breaks regardless of which wins.

## Macro-device / copy-template diversity check (pre-GENERATE)
This catalog's landing history has an established, repeatedly-reproduced finding (L3, 5 independent reproductions: r28/c, r29 tie-break, r31, r32, plus the general doctrine) that assigning distinct visualization devices does NOT by itself stop convergence one layer down, in hero narrative skeleton and closing-CTA copy templates. This round's briefs explicitly named and banned the specific recurring templates on record (the "Watch the ___" headline skeleton, the "Buyers trust the ___" subhead, "Three ___s" 3-pillar heading, "List your first item" CTA, the pipeline-narrowing narrative + "$X paid out"/"72 hrs" stat pair + "Create your free account"/"No card required" CTA, "Each/every card carries its own evidence/proof," and the literal `col-span-7`+`col-span-5`+full-width-device-below grid skeleton) and assigned 3 genuinely distinct devices: a = slope/ladder chart (paired before/after comparables), b = concentric ring cluster (nested arc rings, not a radar polygon), c = packed-circle bubble cluster (not a treemap). All 3 also assigned distinct accent hues and 2 of 3 distinct framings (a/b buyer-facing, c seller-facing) to further reduce one-layer-down convergence risk.

Also pre-briefed on 3 specific previously-measured bugs: the `useReducedMotion()`-only mount-gating hydration bug (must use `useSyncExternalStore` for `whileInView` reveals), the nested-`overflow-x-auto`-in-grid-item `scrollWidth` leak (fix: `[contain:layout]` on the wrapping section), and the `aria-hidden`-does-not-exempt-visible-text-from-`label-content-name-mismatch` finding (candidate a's gate failure shows this lesson didn't fully transfer on the first attempt — see LEARN).
