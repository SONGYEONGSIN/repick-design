# auto-dash-r36 — DECISION

## §0 — Round budget / deviation disclosure

This execution is round 1 of a scheduled task's "2회 연속" (2 back-to-back) `/dash-evolve` run. `node scripts/round-budget.mjs "2"` returned **1** with explain-reason *"미채움 0종 — N≥2 의 근거(커버리지)가 없다"* — `PAGE_TYPES`(18종) is fully covered in `app/src/lib/works.ts`, so the unfilled-queue basis for N≥2 does not currently hold. Per skill §0-0-1, this single `/dash-evolve` invocation runs exactly 1 round regardless of the caller's N=2 request, and that fact is logged here as required. The scheduling prompt's own 2-round request is satisfied by running this skill **twice independently** within the same session (this is round 1 of 2; round 2 will re-run §0-7 from scratch, excluding `dash` from its target draw if `dash` is drawn again this session per the "already produced this execution" exclusion convention established by this repo's prior multi-round sessions).

Agent-tool availability confirmed (general-purpose subagent type, via `Agent` tool) — **not** a self_judged round; GENERATE and JUDGE both used independent, blind subagents.

Day-of-week check: 2026-10-07 is `getUTCDay()===3` (Wednesday) — the native weekly-cadence override (Monday-only) does not apply.

Target draw: `PAGE_TYPES` unfilled queue computed from `app/src/lib/works.ts` = `[]` (all 18 types have ≥1 `category` entry) → fell through to uniform random among `[dash, landing, native]` → **dash**. Round number for `dash` = (max existing `auto-dash-r*` in `vault/30-ledger/auto-ledger.jsonl`) + 1 = **36**.

**Infra discovery this round, logged for future executions**: this sandbox's pinned `@playwright/test` Chromium download is blocked by the egress proxy; the pre-installed `/opt/pw-browsers/chromium` was used instead via `PW_CHROMIUM_PATH`/`CHROME_PATH`. Additionally, **`PW_NO_SANDBOX=1` is required** for `lighthouse`'s spawned Chrome to launch in this container — without it, `gate.mjs`'s a11y/perf gates silently report `unavailable` (a pass, by design, same "missing tool" vs "missing page" ambiguity this repo has hit before) rather than a real score, for every candidate. This was caught mid-round when candidates a/b/c's first gate passes all showed `a11y: unavailable`/`perf: unavailable` despite `CHROME_PATH` being set — re-running `npx lighthouse` manually surfaced the real Chrome-launch failure, fixed by adding `PW_NO_SANDBOX=1`. All affected gate runs were redone with the corrected env. This is in addition to the already-known `CHROME_PATH` requirement noted in `auto-dash-r35`'s ledger entry.

## §1 RETRIEVE — reassignment consumed

`reassign-queue.md` "대기 중" had exactly one `dash`-target item: **#8, `auto-dash-r35/c` "Quadrant"** (campaign spend×conversion scatter chart), dropped 2026-10-04 for a 4-part hard-gate failure (Intl compact-notation zero hydration mismatch, scatter points as focusable `<button>`s failing `target-size`, under-height sortable header buttons, and a colgroup rebalance that introduced mobile `cell-overlap`). Per the queue's "최대 1개" rule, candidate **c** this round was assigned exactly this form, with all 4 documented fix instructions carried into its brief verbatim. It passed the hard gate clean on its **first** attempt (no 1-fix needed) — the reassignment succeeded at the implementation level. Queue item #8 is archived (see reassign-queue.md edit this round) with outcome "reassignment succeeded — reached judging, placed 2nd of 2 by unanimous-leaning 3-lens panel (not a rule-violation loss)."

Candidates **a** and **b** were freely explored, assigned fresh dominant-visualization types absent from this catalog by chart-type (`a` = bullet/gauge grid, `b` = network/dependency graph) and from `catalog-variety.mjs`'s current ban-list (empty this round — no theme/accent/face axis banned; last 2 dash winners' themes didn't run 2-consecutive, no accent/face hit the ≥2-in-window-3 threshold). Macro-skeletons were explicitly assigned outside this catalog's four most-converged shapes (master-detail / 3-pane rail+chart+feed / feed-centric / calendar-board), per this target's accumulated L1/L2 deltas on that axis.

## §2 GENERATE

3 designer agents (general-purpose subagent type, independent, no cross-visibility — verified each was launched in a separate background Agent call with no shared context) produced:
- **a** "Setpoint" — OKR console, bullet/gauge-grid hero (first-of-catalog chart type), inline-accordion-in-grid expand (no persistent pane), independent sortable/filterable metrics table, ⌘K palette. light/violet/`--font-display-wide`.
- **b** "Meshwire" — service-dependency graph console (network/dependency graph, first-of-catalog chart type), full-width graph hero, dismissible node-inspector popover, independent bottom incident timeline, mandatory adjacency-list fallback table. dark/green/`--font-display-mono`.
- **c** "Quadrant" (reassigned, see §1) — campaign spend×conversion scatter/bubble command-deck, filter-rail → aggregate-recompute + chart-local-only pin. dark/orange/no-display-face.

State frozen before gating; source hashes recorded in SCORES.md.

## §3 HARD GATE

Full detail and gate-by-gate table in `SCORES.md`. Summary:
- **a**: failed pass 1 on `console` (13 hydration-mismatch errors — `Intl.NumberFormat(..., {notation:"compact"})` trims trailing zeros inconsistently between Node's ICU and Chromium's ICU for non-zero values, e.g. "$3.2M" server vs "$3.20M" client; broader than the zero-only case this candidate had already defended against). **1-fix**: hand-rolled the K/M/B compact-currency formatter with plain `toFixed`+regex trim, no `Intl` compact path at all → re-gate clean on that gate. Once the `PW_NO_SANDBOX` env fix (see §0) was applied and a11y/perf became real measurements, a **newly-surfaced** `label-content-name-mismatch` hard-fail appeared (topbar account-menu button: `aria-label="Account menu"` vs. visible text "MB"). Per the same reasoning as candidate A's own §0 infra note — this is the first *real* a11y measurement, not a second strike on an already-passed gate — one further fix was permitted: `aria-label` changed to include the visible text (`"MB — Account menu"`). Final: **PASS clean**, a11y 100, perf 61.
- **b**: failed pass 1 on `lint` (`react-hooks/set-state-in-effect`, command-palette reset-on-open) + `sweep` (`cell-overlap` ×2, 27px/16px, header-sort-buttons overflowing their `table-fixed` columns). **1-fix**: palette switched to conditional-mount (removes the effect-driven setState entirely), header buttons switched to `flex w-full min-w-0 truncate` + responsive short labels + colgroup rebalance. Re-gate: lint clean, but `cell-overlap` **persisted** (reduced to 2px, not eliminated) and a **new** `target-size` hard-fail appeared (graph nodes positioned on a fixed concentric-ring layout have as little as 1.4px of neighbor spacing — the same "data-density defeats 24px touch target" defect class the reassigned Quadrant concept already hit once). Per skill §3 "재실패 시 탈락" (repeat failure after the one fix → drop), **candidate b is dropped**. Logged to `reassign-queue.md` as new item #9 with precise diagnosis (node markers must become pointer-only/`aria-hidden`, same fix as Quadrant's scatter points; colgroup rebalancing must account for cell padding, not just label character count).
- **c**: **PASS clean on first attempt**, no 1-fix needed. a11y 100, perf 57.

Survivors: **a, c** (2 candidates → blind 3-lens panel per §4, no tie-break scaffolding needed).

## §4 JUDGE — 3-lens blind panel

Screenshots captured via `capture-shots.mjs` (no blanks, 0 errors). a's content fits one viewport height at every tested width (1280/1440/1920/390) — no scroll-position variants generated for it (a layout fact, not a capture failure; confirmed 0 scroll frames is correct given its single-screen grid). c generated full scroll-position variants at all 4 widths (0/35/70/100%) since its filter-rail+chart+table stack exceeds one viewport.

Frame budget given to judges (3-4 per candidate, per skill's turn-budget guidance): a = 1440/1920/390 (no scroll variant needed). c = 1440, 1440-s70, 390, 390-s70.

**Lens 1 (brief compliance)**: tentative 1st **a**, 2nd **c** — explicitly flagged as "not a decisive gap," both candidates found substantively compliant across all core rules, dash-brief-v3, and all 3 open-delta directives (macro-skeleton escape, selection-fanout narrowness, KPI-subordination font-size check). a's edge: zero contrast-floor ambiguity vs. two minor (sub-hard-fail) nitpicks on decorative/placeholder text in a's command palette and mobile-nav-close button. c's edge: zero `zinc-500+`-floor violations found at all (dark theme, floor is zinc-400, c stayed at zinc-400-or-lighter everywhere), but carries documented (not undocumented) UX trade-offs — pointer-only scatter points, mobile table requiring an inner horizontal scroll to reach Spend/Conversions/Rate/CPA — that are rule-compliant but add judgment risk. Treated as a counted vote for **a** (not a formal no-winner vote; judge gave an explicit, if hedged, 1st/2nd ranking).

**Lens 2 (commercial polish)**: 1st **a**, 2nd **c**, not a tie. Decisive factors: (1) at-a-glance legibility — a's full value set (current/target/status, all 8 goals) is readable with zero interaction at every width tested, while c's own documented headline metric (the Pearson correlation coefficient, explicitly sized as the page's largest number in source) sits below the fold on first paint at 1440 and the dominant chart itself is never visible in either mobile frame supplied; (2) mobile information architecture — a leads with data on mobile, c leads with a long filter-checkbox stack pushing the chart down and requiring a second inner-scroll on the fallback table for key metrics. Both candidates verified free of dead controls, fake-looking data, or leaked debug copy.

**Lens 3 (archetype/structural differentiation)**: 1st **a**, 2nd **c**, close but not a tie. a wins on chart-type-novelty baseline (first-ever bullet chart in this catalog's history, vs. c's scatter/bubble type having one prior winning-but-unpromoted attempt) and on the selection-fanout tier (a's "no separate detail component at all" is tier-1/strongest per this catalog's established ranking; c's narrow-but-real single-consumer pin/hover fan-out is tier-2). c's compensating strength is on the behavior-novelty axis — a live-computed Pearson correlation + dynamic quadrant re-bucketing on every filter change is more computationally/statistically sophisticated than a's static per-period lookup swap — but this was judged not to fully offset the other two axes. Both confirmed to avoid all four flagged converged macro-shapes (master-detail / 3-pane rail+chart+feed / feed-centric / calendar-board) and to have no permanently-reserved third pane.

**Aggregate**: 3/3 lenses placed **a** first (lens 1's vote counted despite its hedged framing, per above). **Winner: a ("Setpoint").** Not a tie, no tie-break procedure invoked, zero no-winner votes cast.

## §3-1 Post-judgment fix

None required — no lens cited an unresolved rule violation on winner **a**. Lens 1's two flagged items (command-palette decorative-text contrast, mobile-nav-close hover-state contrast) were explicitly characterized as "minor, sub-violation-tier, not confirmed hard failures," not an unresolved rule violation, and are left as-is per §3-1's scope (taste/completeness items don't trigger post-judgment fixes; only confirmed rule violations do, and no lens confirmed one here).

## §5 LEARN

See `dash-deltas-provisional.jsonl` append (next step) for the extracted L1 delta: KPI-row subordination's font-size check and the chart-type-novelty-baseline-vs-selection-fanout-tier combination were both independently decisive across 2+ lenses this round, refining the existing r27/r28/r33/r34 lineages on those two axes with this round's concrete evidence (a's tier-1 "no detail component" + first-ever chart type beat c's tier-2 fan-out + one-prior-unpromoted-attempt chart type, on lens 3's explicit accounting).

## §6 Refinement gate

No new L2/L3 promotions this round (all 5 most-recent L1 deltas, including this round's, are single-round observations without the 2-round reproduction threshold or independent mechanical verification needed for L2). No conflicting delta pairs identified across dash's provisional DELTAS this round. No new questions-queue entry — no sharp principle conflict surfaced (all 3 lenses agreed on direction, even where lens 1 hedged).

## §7 Record

- `auto-ledger.jsonl`: target=dash, round=auto-dash-r36, winner=a, no_winner=false, hardgate sourced from SCORES.md's final per-gate state, judges={lens1:a, lens2:a, lens3:a}, variety={theme:light, accent:violet, face:wide}, self_judged=false.
- `reassign-queue.md`: item #8 archived (reassignment succeeded, reached judging, placed 2nd on merit not rule-violation); new item #9 added for dropped candidate b ("Meshwire").
- `vault/index.md`: this run registered under "세대 기록".
- Canon unchanged: `dash-brief-v3.md`, `design-principles.md`, `page-brief-core.md`, `page-brief-repo.md`, and all type-profile briefs untouched. `/dash` gallery and `/v1-v5` untouched. No commits to `main` — this and all round commits go to `evolve/dash` only.
