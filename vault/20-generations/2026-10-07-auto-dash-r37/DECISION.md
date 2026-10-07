# auto-dash-r37 — DECISION

## §0 — Round budget / sequencing note

Second of two independent `/dash-evolve` executions in this scheduled "2회 연속" session (first was `auto-dash-r36`, winner a "Setpoint", committed and pushed to `evolve/dash` before this round began — this round's RETRIEVE read that commit's updated `dash-deltas-provisional.jsonl` and `reassign-queue.md` state). `round-budget.mjs` again returned N=1 (0 unfilled PAGE_TYPES) with the same explain-reason as round 1. Agent-tool availability reconfirmed — not self_judged.

Target draw: uniform random among [dash, landing, native] → **dash** again (same target as round 1 of this session). This repo's own history is split on whether to exclude an already-drawn-this-session type from the random fallback (`auto-dash-r33` excluded `landing`; `auto-dash-r35` did not exclude `native`) — the skill's explicit exclusion instruction ("이번 실행에서 이미 생성한 타입은 제외") is textually scoped to the `PAGE_TYPES`-unfilled-queue case specifically ("큐의 다음 항목으로 내려간다"), which does not apply here since that queue is empty both rounds. Absent a textual basis for excluding from the 3-way random fallback, this round followed the literal reading and redrew independently, landing on dash again. Round number 37 (max existing `auto-dash-r*` + 1).

Diversity enforcement: `catalog-variety.mjs`'s `banList()` over the last 3 dash ledger entries flagged **theme=light as a 2-consecutive-round streak** (r35, r36 both light) → **dark required this round**, applied to all 3 candidates.

## §1 RETRIEVE — reassignment consumed

`reassign-queue.md` "대기 중" had exactly one `dash`-target item: **#9, `auto-dash-r36/b` "Meshwire"** (network-dependency-graph console), dropped same-session for a repeat hard-gate failure (residual mobile cell-overlap after a 1-fix + a newly-surfaced `target-size` failure on densely-packed graph nodes). Candidate **c** this round was assigned exactly this form, with both documented fix instructions (pointer-only `aria-hidden` nodes routing all keyboard actions through the mandatory adjacency table; padding-aware colgroup math) carried into its brief verbatim. **c passed the hard gate clean on the first attempt** — the reassignment succeeded completely.

(Note: `reassign-queue.md`'s bookkeeping for items #8 and #9 being properly moved to the archive section — rather than left under a renamed "대기 중 (계속)" subheading, which is what round 1's edit actually did, an oversight caught while preparing this round's §7 — is corrected as part of this round's §7 edit, consolidating both outcomes at once.)

Candidates **a** and **b** were freely explored on fresh dominant-visualization/macro-skeleton combinations: `a` = a single large anomaly-flagged timeline (distinct from the catalog's existing small-multiples-anomaly-wall attempt, which used many small charts), `b` = a box-plot vendor-quality strip (distinct from the catalog's one prior box-plot attempt, which used a 3-pane shell this round deliberately avoided). Both assigned macro-skeletons outside this catalog's four most-converged shapes (master-detail / 3-pane rail+chart+feed / feed-centric / calendar-board).

## §2 GENERATE

3 designer agents (general-purpose subagent type, independent, no cross-visibility):
- **a** "Northbound" — Incident Response Console, single full-width anomaly timeline hero + independent runbook checklist + ephemeral tooltip. dark/cyan/`--font-display-mono`.
- **b** "Baseline" — Vendor Quality Scorecard, full-width box-plot strip hero + independent vendor directory table + ephemeral tooltip. dark/indigo/`--font-display-grotesk`.
- **c** "Fluxgraph" (reassigned, see §1) — service-dependency graph console, full-width graph hero + dismissible node-inspector popover + independent incident timeline + mandatory adjacency-list fallback table. dark/amber/`--font-display-mono`.

State frozen before gating; source hashes recorded in SCORES.md.

## §3 HARD GATE

Full detail in SCORES.md. Summary:
- **a**: **passed clean on the first attempt**, no fix needed. a11y 100, perf 59.
- **b**: failed pass 1 on `sweep` (`table-overflow` 6px at 1264px — the "16px-slack-under-1280" probe width) and `a11y` (`label-content-name-mismatch` on every box-plot column button — visible "median / outlier-count / vendor-code" text not reproduced contiguously inside a longer descriptive `aria-label`). **1-fix**: the a11y fix (removing the custom `aria-label` in favor of content-derived accessible name + an `sr-only` suffix span) worked cleanly — re-gate confirmed a11y 100. The sweep fix (removing the table's `min-w-[720px]`) did **not** resolve the original 6px table-overflow (unchanged on re-gate) and additionally introduced a **severe new regression**: a 520px `page-overflow` at 390px, almost certainly from the box-plot strip's `overflow-x-auto` horizontal scroller losing effective containment once an ancestor's width-forcing element (the table's old `min-w`) was removed — consistent with this catalog's standing "give every flex/grid ancestor of an `overflow-x-auto` child a `min-w-0`" rule, which this candidate's layout evidently violates somewhere up the tree. Per skill §3 "재실패 시 탈락" (repeat failure after the one fix → drop), **candidate b is dropped**. Logged to `reassign-queue.md` as a new item with this precise diagnosis.
- **c**: **passed clean on the first attempt**, no fix needed. a11y 100, perf 57. The reassignment (§1) succeeded completely — both prior failure modes (dense-node target-size, colgroup padding math) did not recur.

Survivors: **a, c** (2 candidates → blind 3-lens panel).

## §4 JUDGE — 3-lens blind panel

Screenshots captured via `capture-shots.mjs`, no blanks, 0 errors. a fits one viewport height at every tested width (no scroll variants, a layout fact). c generated full scroll-position variants (its graph+table+timeline stack exceeds one viewport).

Frame budget: a = 1440/1920/390. c = 1440, 1440-s70, 390, 390-s70.

**Lens 1 (brief compliance)**: narrow 1st **c**, 2nd **a** — explicitly flagged as an unusually close call with no outright hard-rule violations found in either candidate. Deciding factors: c's claim of 100% keyboard-reachability for its (deliberately non-focusable) graph nodes was independently verified by cross-checking every node against the edge list, confirming each is reachable via some adjacency-table row; a's analogous claim (real focusable anomaly markers with ≥24px spacing) could only be assessed as "plausible" from indirect computation. c's focus-visible treatment used one centralized token with zero exceptions found; a had one inert decorative bare-`ring-2` sitting alongside a real focus outline on the same element (compliant with the letter of the rule, but the exact pattern the rule exists to flag, and — per this repo's own documented Tailwind v4 behavior — likely non-rendering).

**Lens 2 (commercial polish)**: 1st **a**, 2nd **c**, not a tie. a's restrained visual gestalt and always-visible-annotation discipline reads as the stronger instant "premium product" impression — but both have real, cited flaws: a's "+ New incident" primary CTA and notification bell are both fully dead (zero handlers) on the page's most prominent chrome; c's hero graph has multiple truncated node labels, a visually busy edge-crossing region, 4-of-5 sidebar nav items permanently tagged "Soon" (visible on every single frame), and a mobile caption string that still says "hover with a mouse" at 390px.

**Lens 3 (archetype differentiation)**: decisive 1st **c**, 2nd **a**. Network/dependency graph is the first chart of this type to ever reach a judge in this catalog's history — two prior attempts both died at hard-gate before any judge saw one. Per this lens's own stated hierarchy (a genuinely new chart type outweighs new interactive behavior on an already-common mark), this categorically outweighs a's secondary structural advantage (a verifiably narrower single-producer/single-consumer selection mechanism, vs. c's bare-node-id-threaded-to-many-consumers pattern, which both candidates' independent "non-synced companion widget" directives were otherwise judged to satisfy equally).

**Aggregate**: 2/3 lenses placed **c** first. **Winner: c ("Fluxgraph").** Not a tie, no tie-break procedure invoked, zero no-winner votes.

## §3-1 Post-judgment fix

None required — no lens cited an unresolved rule violation on winner **c**. Lens 2's flagged items (truncated node labels, "Soon" nav tags, mobile copy slip) are explicitly taste/completeness findings, not rule violations, and are left as-is per §3-1's scope (only confirmed rule violations trigger a post-judgment fix).

## §5 LEARN

See `dash-deltas-provisional.jsonl` append (next step): a new L1 delta on how the "chart-type novelty vs. behavior novelty" hierarchy actually resolved under a genuine 2:1 split this round (unlike r36, where all 3 lenses agreed) — the differentiation lens's stated priority (new type > new behavior) held even against a real, verified structural counter-argument (narrower selection-fanout) on the losing side, and a real, independently-confirmed accessibility-completeness edge on the winning side from a lens that wasn't even measuring differentiation.

## §6 Refinement gate

No new L2/L3 promotions this round. No conflicting delta pairs identified. No new questions-queue entry — the lens split (2:1, not unanimous, not a tie) is this catalog's established normal outcome per `curation-criteria`'s "Q32 판정," not a sharp principle conflict requiring a new question.

## §7 Record

- `auto-ledger.jsonl`: target=dash, round=auto-dash-r37, winner=c, no_winner=false, hardgate from SCORES.md, judges={lens1:c, lens2:a, lens3:c}, variety={theme:dark, accent:amber, face:mono}, self_judged=false.
- `reassign-queue.md`: consolidated — items #8 and #9 both properly moved to the archive section with their actual outcomes (both reassignments succeeded at the implementation level; #8/Quadrant placed 2nd of 2 in r36's judging; #9/Meshwire→Fluxgraph **won** this round's judging, 2:1); a new pending item added for dropped candidate b ("Baseline" box-plot).
- `vault/index.md`: this run registered under "세대 기록," alongside a consolidated note that this scheduled session's 2 rounds are now both complete.
- Canon unchanged: `dash-brief-v3.md`, `design-principles.md`, `page-brief-core.md`, `page-brief-repo.md`, and all type-profile briefs untouched. `/dash` gallery and `/v1-v5` untouched. No commits to `main` — this and all round commits go to `evolve/dash` only.
