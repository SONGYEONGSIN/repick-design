# auto-native-r32 — DECISION

Target: native · Round: auto-native-r32 (second of 2 sequential rounds in this scheduled run) · Date: 2026-10-06

## Orchestration notes

- Second of two independent, sequential `/dash-evolve` executions requested by this scheduled run. Started after round 1 (`auto-native-r31`) fully completed and its commits landed on `evolve/dash` — this round's §1 RETRIEVE reads the delta `auto-native-r31` appended (the conditional-alert-role refinement) and the updated ledger.
- `node scripts/round-budget.mjs "2"` again returned **N=1** (still 0 unfilled `PAGE_TYPES`). Target draw: uniform random over `[dash, landing, native]` → **native** again (2026-10-06 is a Tuesday, no weekly-cadence forcing — this is an independent draw landing on the same target twice, not a forced repeat).
- `reassign-queue.md` had no native entry — no reassignment.
- Per the continuous-round rule, this round's 3 candidates were assigned band forms and domains deliberately distinct from round 1's (r31 used blocked-workflow / persistent-action-bar / no-fixed-chrome-with-top-counter): **a**=selection-driven contextual bar, **b**=no-fixed-chrome per-row 3-state, **c**=blocked-workflow (same high-level form as r31/a, but a different domain and explicitly instructed to invent fresh vocabulary/mechanics — see lens3's finding below on how well that held up).
- Each designer was given the fresh accessibility refinement from `auto-native-r31`'s LEARN delta (conditional `accessibilityRole="alert"`) as a prose instruction to apply.

## GENERATE

- **a — Archive Conversations**: selection-driven contextual bar + a mutually-exclusive post-action undo bar. Domain logic: threads with an unread reply and/or an open offer are excluded from bulk-archive with a visible per-row reason; undo restores archived threads to their original list position within a countdown window.
- **b — Linked Social Accounts**: no fixed band at all — per-row three-way state (normal/confirming/permanently-locked-primary), single persistently-mounted screen-level live region. A "Make primary" action reassigns which row is locked.
- **c — Appeal This Review**: blocked-workflow state machine (forming → under Trust & Safety review → settled) with auto-retract-on-edit-after-submit and a live-recomputed "what the moderation team will see" preview card.

Source hash (frozen before gate): `905ff84ee062b3d623279317c2952ac4535966f6`. Unchanged through judging.

## HARD GATE

`node scripts/gate.mjs --target native --screens evolve-r32-a evolve-r32-b evolve-r32-c` → **12/12 clean on first attempt, no 1-fix needed.** See `SCORES.md`.

## JUDGE PANEL

3 independent blind judges (390px + 768px screenshots + source, no concept docs, no cross-lens visibility — each was also given read access to prior rounds' screens for structural-overlap comparison where relevant):

| Lens | Focus | Ranking |
|---|---|---|
| lens1 | DNA/a11y compliance | a > b > c |
| lens2 | mobile completeness/polish | c > a > b |
| lens3 | screen-type differentiation | a > c > b |

**Clean 2:1 majority — winner: a (Archive Conversations)** (lens1 + lens3 both rank a first; lens2 ranks a second). Not a complete tie, no tie-break procedure needed. b is ranked last by all three lenses unanimously.

### Why each lens landed where it did
- **lens1** found zero rule violations in **a** and specifically credited it as the only candidate that pairs the new conditional-`alert`-role expression with an actual self-clearing mechanism (a 5s timeout resetting the live-region message back to empty) — both **b** and **c** wrote the conditional expression correctly but never reset their message state anywhere in the file, so in practice the alert role becomes permanently "on" after the first event rather than transient. **c** additionally had two concrete bare-numeric-spacing violations (`marginTop: 2`, `marginBottom: 2` instead of `tokens.space(n)`) and a silent (unannounced) arm/cancel step in its withdraw flow.
- **lens2** ranked **c** first for having the richest, most fully-traced business logic (a live-derived review-time estimate and live-derived moderation preview, both genuinely recomputed from current form state, plus a correctly-verified auto-retract rule) and ranked **b** last not for anything broken, but because the screen's own subtitle promises "Connect accounts to cross-post listings" while no connect/add-account control exists anywhere in the file — a real completeness gap, not a cosmetic one.
- **lens3** ranked **a** first for combining its selection-bar mechanism with a second genuinely new mechanic (a position-restoring, auto-expiring undo window) and domain-specific lock logic. It did real comparative diligence: it opened and read `native/src/evolve/r30/b/LinkedMarketplacesSync.tsx` and `native/src/evolve/r27/c/BlockedAccountsScreen.tsx` and found **b**'s per-row 3-state mechanism, exclusivity invariant, and locked-row copy template ("it can't be X directly... use/first") match `r30/b` closely enough to read as the same execution reused a second time (only the "Make primary" reassignment action is genuinely new in b). It also opened `native/src/evolve/r31/a/AccountDataExportScreen.tsx` and found **c**'s phase topology, auto-retract mechanic, scroll-to-first-unmet mechanic, and arm/cancel/confirm withdraw shape structurally mirror r31/a closely (renamed, not re-architected) — a real, citable catalog-overlap finding worth logging even though it didn't change the majority outcome.

### Post-judgment fix (§3-1)
None needed. No lens found a rule violation in the winner **a** — all three lenses' only criticisms of a were either nonexistent (lens1, lens2: none) or an inferred-but-unconfirmed risk of partial overlap with the `relist` screen that the judge explicitly could not verify without reading `relist`'s source (lens3), which is not a confirmed finding.

## LEARN

1 new L1 delta appended to `vault/00-principles/native-deltas-provisional.jsonl` (round: auto-native-r32, variant: a), sharpening the `auto-native-r31` delta: the conditional `accessibilityRole="alert"` expression is necessary but not sufficient — it only produces a transient, correctly-idling live region if the underlying message state is also actively reset to empty after the announcement window, which 2 of 3 candidates this round omitted.

## Observation carried forward (not a delta — a differentiation finding worth future attention)

Lens3's structural-overlap finding (candidate b closely matching `r30/b`; candidate c closely matching `r31/a`) is recorded here rather than as a delta because it's a judge's comparative observation about these specific candidates, not a generalizable rule. It did not change the round's outcome (the overlap was found in 2nd/3rd-place candidates, not the winner), so no reassignment-queue action is triggered by this round — `b` and `c` are simply not promoted. If this repo's `/dash-falsify` or a future round's RETRIEVE wants to dig further into the r30/b and r31/a overlaps specifically, this DECISION is the pointer.

## Canon

Unchanged — `dash-brief-v3.md`, `design-principles.md`, `page-brief-core.md`, type profiles, `native/GENERATION.md`, `native/src/tokens.ts` all untouched. `/dash` gallery and `/v1–v5` untouched. jsonl files only appended to.

## Scheduled-run summary (both rounds)

- Round 1: `auto-native-r31` — winner **b** (Security Activity Log), decided by tie-break default after a complete 1-1-1 split.
- Round 2: `auto-native-r32` — winner **a** (Archive Conversations), clean 2:1 majority.
- No no-winner rounds. Both rounds ran sequentially (round 2 started only after round 1's commits landed), reading round 1's own LEARN delta during round 2's RETRIEVE, per the skill's continuous-round accumulation requirement.
- Canon (both principle docs, both type-profile briefs used, `page-brief-core`/`page-brief-repo`, `native/GENERATION.md`, `native/src/tokens.ts`) untouched across both rounds. `/dash` gallery and `/v1–v5` untouched. All ledger/delta writes were append-only.
