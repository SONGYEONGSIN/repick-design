# DECISION — auto-dash-r55

target: dash · round 1 of this scheduled session's two requested sequential `/dash-evolve` executions.

## 0. Round budget + target draw + generation-independence deviation disclosure

`node scripts/round-budget.mjs --explain 2` returned `1  미채움 0종` (all 18 `PAGE_TYPES` filled) — only 1 round this invocation. Target drawn uniformly from `[dash, landing, native]` (not Monday, so no native-cadence override) → **dash**. `reassign-queue.md` "대기 중" confirmed empty for `target: dash` at RETRIEVE — no reassignment consumed this round.

**Deviation, fully resolved before GENERATE, disclosed for completeness**: §1 RETRIEVE + the duplicate-avoidance/diversity-axis analysis was initially delegated to a `fork` sub-agent. That fork discovered mid-task that forks in this environment cannot themselves spawn further subagents, and — rather than stopping — authored all 3 candidates itself under one hand, which would have collapsed this round's "3 independent blind designers" premise into single-author variation. This was caught by the orchestrator before any gate/judge work began: the fork's self-authored files were deleted, its already-assembled brief text and non-colliding slot assignments (macro-layout/dominant-viz/domain/theme/accent/face per slot) were retrieved via `SendMessage` (pure context handoff, no further generation), and **3 fresh, independent `general-purpose` Agent dispatches — each with zero shared context, each unaware of the other two's output — authored the actual candidates from that brief.** Generation-independence for the round that was actually gated and considered is intact; only the discarded, never-gated draft was single-authored. `Agent` tool confirmed available and used throughout (3 independent designers + 3 independent 1-fix agents, all `general-purpose`, no custom designer/comparator type configured in this environment, matching r53/r54 precedent). `self_judged` is moot — no judging occurred this round (see §4 below).

## 1. RETRIEVE / target survey

Full RETRIEVE (BRIEF + page-brief-core + page-brief-repo + open deltas + curation-criteria + catalog files + recent dash ledger history + `catalog-variety.mjs` banList + duplicate-avoidance survey of r49–r54) performed by the fork described in §0 and handed back verbatim. `catalog-variety.mjs` banList over the last 3 dash winners (r54/c, r53/a, r52/c) returned `face: ["grotesk"]` (used 2× in that window); theme and accent were not banned. Full-catalog distribution leaned the 3 slot assignments toward underused accents (green/orange/lime) and away from the saturated 3-pane trading-terminal macro shell (confirmed ≥4 uses across this catalog's full history) and the two most recent winners' exact face/accent combos.

3 candidates assigned 3 distinct macro layouts, dominant-viz types, and domains, none colliding with each other or with r49–r54:
- **a** — Portlane (freight-terminal dock-scheduling console): hero + inline stat strip (no KPI grid) + single dominant Gantt-style dock-door timeline. Dark/green/`--font-display-wide`.
- **b** — Latch (vendor SLA / response-time compliance console): master-detail (280px vendor rail + flex-1 tabbed detail) + shared-log-scale horizontal box-plot dominant viz. Light/orange/`--font-display-mono`.
- **c** — Arbor (multi-facility ESG/compliance scorecard): rail-less stat ticker + full-width per-row slope/dumbbell dominant viz. Light/lime/no display face (Pretendard-only, a deliberate valid choice per brief).

Each designer prompt inlined the full assembled brief (dash-brief-v3 + page-brief-core + page-brief-repo + open deltas + repo conventions + this round's specific grid-craft/accessibility lessons, as prose, not paths) plus only its own slot assignment — no designer saw the other two's assignments or output.

## 2. GENERATE

3 real independent `general-purpose` Agent-tool subagents, dispatched in parallel, zero shared context. Each self-verified with `npx tsc --noEmit` + `npx eslint` before reporting (all clean) and wrote a `candidates/<v>.md` with a `## 브리프에 없던 것` section.

**Freeze hash** (post-generation, pre-fix): `090b91a637f7b8d99ecfd5b3bcff9b4f7eca23dd`.

## 3. HARD GATE

`node scripts/gate.mjs --target web --routes /dash-evolve/r55/<v>`, run per-candidate (not combined) for correct violation attribution. Round 1: **all 3 failed** — full detail in `SCORES.md`. Summary: a = sweep table-overflow (Gantt's forced-scroll wrapper) + a11y 97 (color-contrast + label-content-name-mismatch); b = sweep table-overflow (constant 1px, a stray axis-gridline tick) + a11y 93 (definition-list + target-size); c = sweep clean, a11y 90 (button-name + color-contrast + target-size).

**1-fix pass**: one `general-purpose` subagent per candidate, each given the orchestrator's own exact, pre-diagnosed violations (root-caused directly via Lighthouse JSON node inspection — specific selectors, bounding rects, and computed contrast ratios, not just audit names) and a specific fix pattern to apply. All three reported plausible, targeted fixes with clean tsc/eslint. Full diffs described in `SCORES.md`.

**Re-gate — all 3 re-failed:**
- **a**: the sweep fix held (fully fluid Gantt, 0 overflow at all 5 desktop widths) and both a11y fixes held, but removing the fixed-width scroll floor to satisfy sweep had a side effect not caught by the fixer (who was correctly told not to run Playwright/the dev server themselves): the ~24 hourly crosshair-bucket buttons, now evenly dividing the fluid width, shrank to 13×33px with 2.2px neighbor clearance at mobile width — a **new** `target-size` violation, mobile-only, introduced by the fix itself.
- **b**: the specific 1px gridline-tick overflow (`div#10`) was correctly root-caused and fixed, but a **different** box-plot row (`div#1`) now overflows by 6px — a side effect of enlarging the percentile-handle hit buttons to 24×24px, which pushed a different vendor's handle past its track at narrow widths. Separately, the handles are now correctly sized 24×24px individually, but adjacent handles on the same dense shared log-scale (10th percentile / median / SLA-target marker, sometimes only ~20px apart in screen-space) still have overlapping hit areas — safe clickable diameter as low as 10.8px, needed ≥24px. The size clause of the rule was fixed; the spacing clause was not.
- **c**: no new sweep issues, but the same spacing-clause pattern as `b`: slope-chart endpoint dots are now correctly 24×24px individually, but the two endpoints of one row (and sometimes adjacent rows) sit close enough on the 0–100 value scale that their hit areas overlap — safe clickable diameter 12.3–19.2px on both desktop and mobile presets.

**Per §3 ("재실패 시 탈락"), all 3 candidates are dropped.** Zero candidates survive to §4 JUDGE.

## 4. JUDGE — did not occur

Zero survivors — neither the "2+ survivors" nor the "1 survivor, solo review" precondition holds. No judge panel convened, no `judges` votes exist this round. Reference screenshots only (for documentation, not judging) in `shots/` — no blanks, no capture errors.

## 5. LEARN — did not occur

No winner, no judgment rationale to extract a delta from. No new entry appended to `dash-deltas-provisional.jsonl` this round.

## 6. Refinement gate — new question filed instead

This round's reusable finding is a **process/tooling** one, distinct from (though structurally similar to) `auto-dash-r50`'s Q71: three independently-authored candidates, each independently told to fix a `target-size` violation by enlarging the hit target to ≥24×24px, each correctly satisfied the *size* clause of WCAG 2.5.8 and each independently still failed the *same rule's* "insufficient space to closest neighbors" clause — because the targets in question (Gantt hourly buckets, box-plot percentile handles, slope-chart endpoint dots) are positioned by *data density on a shared scale*, not by free layout choice, so enlarging each target's own box without also guaranteeing minimum spacing between data-driven neighbors cannot satisfy the rule. Separately, candidate `a`'s fix for one gate (`sweep`) introduced a brand-new failure in a different gate (`target-size`, mobile-only) that the 1-fix subagent — correctly instructed not to run Playwright/the dev server — had no way to catch before reporting done. Filed as **questions-queue Q74** (new): should 1-fix prompts for `target-size` explicitly separate the rule's two clauses (size vs. spacing) and name the "dense/shared-scale" case specifically, and should a fix to one gate be required to re-check (at least by the orchestrator, not necessarily the subagent) for new violations in the *other* gates before being treated as a completed 1-fix, rather than only re-running the one gate that originally failed?

## 7. Canon + scope + reassignment

Canon (`dash-brief-v3.md`/`page-brief-core.md`/`page-brief-repo.md`/`design-principles.md`/all type profiles/`/dash` gallery/`/v1`–`/v5`) untouched throughout. `questions-queue.md` append-only (1 new entry, Q74). `reassign-queue.md` edited — candidate `c` ("Arbor") queued as **#20**: the most clearly and singly diagnosed of the three re-fails (one clean root cause — endpoint-dot spacing on a dense value scale — versus `a`'s compound mobile-only regression and `b`'s two-defect re-failure, each harder to hand off as a single actionable instruction). `a` and `b` are equally eligible rule-violation drops but not queued, per the queue's established one-per-round convention. All 3 candidates' source remains on disk under `app/src/app/dash-evolve/r55/{a,b,c}/` and their concept docs under `vault/20-generations/2026-11-04-auto-dash-r55/candidates/` for future reassignment.

No commit to `main` — all work on `evolve/dash`. This is round 1 of this scheduled session's two requested sequential rounds; round 2 will re-run §0 RETRIEVE fresh (reading this round's new Q74 entry and the #20 reassign-queue entry) and exclude `dash` from this session's target draw if the unfilled-queue state is unchanged, per the skill's consecutive-round rule.
