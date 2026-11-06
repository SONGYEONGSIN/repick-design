# auto-native-r27 — DECISION

Target: native. Round: auto-native-r27. Date: 2026-09-30.

First of two independent /dash-evolve executions in this scheduled 2-round-back-to-back run
(top-level orchestrator session, Agent tool confirmed available before starting — no self_judged
flag). `round-budget.mjs` returned N=1 for input "2" (0 unfilled PAGE_TYPES — all 18 types have at
least one catalog entry, 2026-09-12 rule). 2026-09-30 is a Wednesday (not Monday), so the native
weekly-cadence forcing rule did not apply; target was selected by the dash/landing/native random
draw at §0 (`node -e` snippet in SKILL.md §0), which returned **native**.
`reassign-queue.md` had no native entry under "대기 중" — no reassignment this round.

## §0 target/round resolution
- Unfilled PAGE_TYPES: `[]` (0 of 18) → round-budget forced N=1 for this outer call.
- Native weekly cadence: not Monday → no forcing.
- Random draw (dash/landing/native): **native**.
- Round number: max existing `auto-native-r*` + 1 = **27** (last was r26, 2026-09-28).
- `catalog-variety.mjs` not run — native's theme/accent/face are fixed DNA constants
  (`light` / `indigo #4f46e5` / `system`), not variable axes, per established native-round
  practice (ledger entries r21–r26 all record the same fixed values).

## §2 GENERATE
Three designer agents (general-purpose, dispatched via Agent tool, fully blind to each other)
were each assigned a distinct bottom-band doctrinal form, deliberately **excluding the
blocked-workflow state machine** since r25 and r26 both won with that form (macro-bucket
diversification per curation-criteria "Q7 판정"):

- **a — Purchase Archive**: persistent always-visible action bar (read-only completed-record).
- **b — Blocked Users**: selection-driven contextual bar.
- **c — Blocked Accounts**: no fixed band; per-row destructive confirm.

**Observed domain convergence (orchestration note, not a rule violation)**: candidates b and c
independently arrived at a near-identical domain — a list of blocked marketplace users/accounts —
despite being generated blind, in parallel, with zero visibility into each other. Root cause,
identified by lens3: the orchestrator's own brief listed "a blocked-users list" as one of several
*example* domain suggestions in the duplicate-avoidance section, and two of three designers
gravitated to it independently. This is an orchestration-brief defect, not a designer error.
**Correction applied for round 2 of this session**: the example-domain list will either be
removed or explicitly marked "pick at most one, and do not let more than one candidate choose the
same suggested example" to prevent recurrence.

Freeze hash (candidate sources concatenated, SHA-1, computed before gating):
`294c17ccdc90854167d3c0e9fc5c859e5b6130ba`

## §3 HARD GATE
`node scripts/gate.mjs --target native --screens evolve-r27-a evolve-r27-b evolve-r27-c`

12/12 gates pass on first attempt (tsc/export/render/iframe × 3 candidates). **No 1-fix loop
needed.** See `SCORES.md`.

## §4 JUDGE PANEL
Screenshots: 390px + 768px per candidate (6 frames total, 0 blank), Expo Web export → serve on
8091 → Playwright capture. Given native's smaller catalog and no sweep/interaction-state
automation, judges were given both static frames per candidate plus full source and asked to
verify dynamic/interaction states from source reasoning (self-reported as unseen-but-verified in
each report).

Three independent judge agents (general-purpose, blind to each other and to this DECISION until
after their own verdict):

| Lens | Focus | Ranking |
|---|---|---|
| lens1 | DNA / accessibility compliance | **c** > b > a |
| lens2 | Mobile completeness / commercial polish | **b** > c > a |
| lens3 | Screen-type differentiation | **a** > c > b |

**Complete 1-1-1 three-way tie on first place.** Per curation-criteria "주간 반증 판정 기준 ②"
(3파전 완전 동률 tie-break): default to lens1 (brief/DNA-compliance lens) priority, *unless*
lens3 (archetype/differentiation lens) explicitly ranks lens1's pick **last** — in which case
exclude that pick and reapply lens1's ranking among the remainder.

- lens1's top pick: **c**.
- lens3's ranking of c: **2nd place** (not last — lens3 ranked **b** last).
- Exclusion condition (lens3 ranks lens1's pick last) does **not** hold for c.

**→ Tie-break default applies. Winner: c (Blocked Accounts).**

### Why each lens ranked as it did (condensed — full reports held by orchestrator, not persisted
verbatim per lens-blindness discipline; key evidence below)
- **lens1** (picked c): c is the most literal, cleanest execution of its assigned form — single
  persistently-mounted live region, `confirmingId: string | null` making the one-row-confirming
  invariant structurally unconditional (not just conventionally true), a real non-destructive
  business rule (permanently-locked Trust & Safety blocks) with no button promising an action it
  can't perform. b is also compliant but structurally busier (two separately-mounted live-region
  containers that are never simultaneously mounted, vs. c's one persistent container). a lost 2
  places specifically because of a **confirmed real layout defect**: at 390px, the "Total spent"
  summary-card value visually collides with the "Items purchased" column
  (`PurchaseArchiveScreen.tsx:186-203`, three `flex:1` columns with no `flexShrink`/wrap handling
  on the value text) — independently confirmed by lens2 as well.
- **lens2** (picked b): b has the richest set of *real*, non-decorative interactions — a bulk
  action gated by an actual business rule (not just selection count: `canUnblock` false if
  selection includes any platform-enforced block), a genuine second distinct action ("Tag as
  Noted", not a twin of the primary action), and honest post-action reversibility (Undo actually
  restores prior state, not a cosmetic toast). c is solid but functionally thinner (one action
  type only, no bulk operation, no undo). a's Export is genuinely real (`Share.share` with a
  composed digest, three handled outcome branches) but the confirmed 390px layout collision in
  the summary card is a real completeness defect that costs it the top spot.
- **lens3** (picked a, but recommend weighing this pick cautiously — see below): a's exact
  bottom-band *form* already has two catalog precedents (`certificate`, promoted
  `evolve-r25-b` Delivery Receipt), but a is the **only** file in the entire `native/src` tree
  that calls the real `Share.share()` API (grep-confirmed) — both prior "Share" features in the
  catalog are simulated/decorative — and its multi-record archive-with-aggregate-stats shell is a
  new sub-archetype within the read-only-record family (prior instances were single-record detail
  views). lens3 flagged genuine, specific code-surface overlap for **b** against the permanent
  `relist`/BulkRelistScreen.tsx (identical `clearSelection()` name, identical derived
  `barVisible`/`undoVisible`-shaped boolean logic, same live-region placement convention) —
  exactly the "form correct, code surface copied" anti-pattern GENERATION.md warns against citing
  r18/c and r19/b — which is why lens3 ranked b last despite b's functional richness. lens3 also
  independently confirmed the b/c domain-overlap finding with concrete evidence (shared field
  names `blockedOnLabel`, near-identical restoration copy, same two-kind block taxonomy).

**Orchestrator's read on the tie**: the tie-break rule is mechanical and was applied as written.
Separately, on the merits, lens1 and lens2's shared critique of candidate a (a real, confirmed
layout defect at a primary supported width) is a concrete, verifiable objection that both
compliance-oriented lenses converged on independently — that convergence is part of why the
tie-break outcome (c) also reads as substantively reasonable, not just mechanically correct.

## §3-1 판정 후 수정 (정제 조치)
None needed — winner c had zero rule violations cited by any lens. No post-judgment fix applied.

## §5 LEARN
See `native-deltas-provisional.jsonl` append: the per-row destructive-confirm doctrine generalizes
to a three-way per-row state (normal / confirming / permanently-locked-non-removable) when some
rows are administratively locked and never actionable from the screen, and the single-live-region
requirement is satisfiable by hoisting one persistently-mounted screen-level region that every row
handler writes into, rather than per-row regions — both drawn from winner c's structural departure
from the `sessions`/`ActiveSessionsScreen` precedent (lens1 + lens3 both independently cited this).

## §6 지식 정제 게이트
No conflicting delta pairs found in `native-deltas-provisional.jsonl` this round requiring
cross-target reconciliation. No re-level (L1→L2/L3) claim this round — this is a first
observation of the three-way locked-row state, not yet a 2-round reproduction.
**Question queued**: see `questions-queue.md` append — whether orchestrator-authored example
domain lists in designer briefs should be banned outright (vs. just de-duplicated) to prevent
future within-round convergence.

## §7 Canon
Unchanged — `dash-brief-v3.md`, `design-principles.md`, `page-brief-core.md`,
`native/GENERATION.md` all untouched. No L3-worthy claim this round.
