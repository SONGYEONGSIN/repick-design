# auto-native-r47 — DECISION

target: native · round: auto-native-r47 · date: 2026-11-02 (Monday — native weekly-cadence round, forced per SKILL.md §0-0's Monday-first-round rule; round 1 of this scheduled session's two requested back-to-back standalone `/dash-evolve` invocations)

round-budget.mjs 2 returned N=1 (0 unfilled PAGE_TYPES — all 18 types already catalogued; `node scripts/round-budget.mjs --explain 2` → "미채움 0종 — N≥2 의 근거(커버리지)가 없다"). Per SKILL.md §0-0 native-cadence rule, today being Monday forces this round's target to `native` regardless of the unfilled-queue draw. Round 2 of this session will exclude `native` from its draw (already satisfied this week) and pick between `dash`/`landing`.

`reassign-queue.md` confirmed empty ("대기 중" section has no pending entries) at RETRIEVE — no reassignment consumed this round.

Agent tool confirmed available this session (used throughout, including for this very round). No custom `designer`/`comparator` agent type is configured in this environment (only `general-purpose`/`Explore`/`Plan`/`claude`/`claude-code-guide`/`statusline-setup`) — substituted `general-purpose` Agent dispatches for all 3 blind designers and all 3 blind judges, matching this project's established r53+ precedent. Generation and judgment were never performed by the same agent, nor by the orchestrator itself.

## Candidates

- **a — Instant Trade-In Offer** (`native/src/evolve/r47/a/InstantTradeInScreen.tsx`): marketplace-operated instant buyback. Condition-questionnaire blocked-workflow band (3 phases: blocked → primed → offered/accepted/declined), real `FlatList.scrollToIndex` + `AccessibilityInfo.setAccessibilityFocus` jump-to-problem, explicit stale-offer invalidation when an answer changes after reveal.
- **b — Store Credit Top-Up** (`native/src/evolve/r47/b/StoreCreditTopUpScreen.tsx`): prepaid store-credit package purchase. Single-nullable-id-derived band (`selectedPackage !== null`), select → confirm two-step flow.
- **c — Points Redemption Catalog** (`native/src/evolve/r47/c/PointsRedemptionScreen.tsx` + `RewardRow.tsx`): loyalty-points reward catalog. Persistent always-visible balance bar + per-row irreversible-redemption inline confirm (shared `(activeRewardId, rowPhase)` state).

Three distinct domains (instant cash buyback / prepaid credit purchase / points redemption), three distinct band-mechanic families (blocked-workflow state machine / single-selection-derived bar / ambient balance bar + row-level confirm) — confirmed by lens3's domain/mechanic sanity check to not collide with each other.

## Hard gate

12/12 stages pass clean on first attempt across all 3 candidates (see `SCORES.md`) — 0 candidates used their 1-fix allowance, 0 `blockedBy` cross-candidate failures on the shared global `tsc` run. Freeze hash `618734ec2a0d7cdab227a59eaed0e8665809cde8` unchanged from registration through gating through screenshot capture through judging.

## Judge panel (3 blind `general-purpose` Agent dispatches, no cross-lens visibility, `candidates/*.md` concept notes withheld from all 3)

- **lens1 (DNA/GENERATION.md compliance)**: a > c > b. a is the only candidate needing and correctly implementing the real scroll+focus jump-to-problem requirement; c correctly judges a global band to be the *wrong* shape for its independent-repeatable-spend domain and applies the row-confirm idiom instead, single-live-region structurally enforced; b's band-presence derivation is correct but its terminal "Confirm & Buy" action is a true no-op, the weakest demonstration of "the band does real work" among the three. Full detail: `DECISION-lens1.md`.
- **lens2 (mobile completeness)**: a > c > b. a: all handlers trace correctly, explicit stale-result invalidation on re-answer, math hand-verified across best/mixed/floor cases; minor nits (no `setTimeout` cleanup on unmount at `a:144-148`, no "minimum guaranteed" note shown exactly at the floor boundary). c: excellent defensive engineering (explicit `FlatList` `extraData`, proper timer cleanup — which a lacks — structurally-guaranteed single live region, correct balance math); one real gap found — no double-tap guard on `confirmRedeem` (`c:83-94`, `RewardRow.tsx:109-119`), a latent double-deduction risk on a real balance-mutating action. b: math correct, but `handleConfirmPurchase` (`b:77-81`), wired to the screen's sole terminal CTA, is confirmed a true no-op with no state change and no live-region announcement — the most material completeness gap of the three, since this screen's entire purpose is that purchase. Full detail: `DECISION-lens2.md`.
- **lens3 (screen-type differentiation)**: a > b > c, no tie. a vs its nearest neighbor `r25/a/TradeInAppraisalScreen.tsx`: clean (zero shared style keys/identifiers/prose); an unacknowledged but unproblematic architectural echo of `r34/a/IdentityReverificationScreen.tsx`'s scrollToIndex+focus sub-pattern noted as convergent idiomatic RN usage, not copying (no shared names or copy). b vs `r42/c/SplitPayPlanSelectorScreen.tsx` (same single-nullable-id band family): a real but partial finding — near-verbatim header-comment phrasing in both files and a closely-matching selection→band→confirm architecture, though b's own style-key names do not collide. **c vs `native/src/sessions/ActiveSessionsScreen.tsx` + `SessionRow.tsx`: severe collision** — 12 `StyleSheet` keys byte-for-byte identical between `RewardRow.tsx` and `SessionRow.tsx`, the state-management architecture (activeId/activeStatus pair, clear-timer pattern, request/cancel/confirm handler trio) is a near 1:1 match with only identifiers renamed, multiple doc comments are near-verbatim paraphrases including an identical `accessibilityHint` template. `r44/b/PickupWindowRow.tsx` is cited as proof this was avoidable (it builds on the same `SessionRow` idiom but explicitly renamed every style key). c's own header comments never acknowledge `SessionRow` as a neighbor. Full detail: `DECISION-lens3.md`.

## Aggregate — unanimous 3-0 for a

All three lenses independently rank **a (Instant Trade-In Offer) 1st**. No tie-break procedure needed (clean unanimous majority, not a complete 3-way tie and not a 2:1 split).

## Post-judgment §3-1 fix

Not needed. Zero enumerated GENERATION.md rule violations were cited against winner a by any lens — the two nits lens2 raised (missing `setTimeout` cleanup on unmount, floor-boundary copy) are completeness observations, not rule violations, and §3-1 fixes are scoped to rule-violation resolution only, not taste/completeness polish. Freeze hash unchanged since the final gate run.

## Non-winner findings (recorded, not fixed, not reassign-queued)

Both non-winning candidates passed the hard gate clean (0/12 failures) — their losses are pure judgment-stage, matching this project's established disposition (reassign-queue is for hard-gate drops specifically, per `reassign-queue.md`'s own convention; r41/r42/r51/r52/r54 precedent). Recorded here for visibility only:
- **b**: `handleConfirmPurchase` no-op (lens1 + lens2 both independently flagged it).
- **c**: severe code-surface/architecture collision with `sessions/ActiveSessionsScreen.tsx`+`SessionRow.tsx` (lens3); no double-tap guard on a real balance-mutating action (lens2).

## LEARN — new L1 delta

See `vault/00-principles/native-deltas-provisional.jsonl` (round `auto-native-r47`, variant `a`): a band-gated computed result (an offer, a quote, any value derived from upstream answers) must invalidate itself — not just the band's presence/phase — the moment any of its upstream inputs changes after the result was already revealed/decided, not only re-derive band presence/absence. Independently cited by lens2 as the specific distinguishing strength of a's implementation (`InstantTradeInScreen.tsx:151-157`) versus the other two candidates, neither of which has an analogous revise-after-reveal scenario to invalidate.

## Refinement gate — promotion

`auto-native-r46`'s L1 delta ("architecture-level code-surface collision survives identifier/style-key renaming") is **promoted to L2**, superseding `auto-native-r46/a`. This round's candidate c independently reproduces the exact same failure mode — a genuinely different band shape and domain, yet a near-1:1 architectural/style-key clone of an existing screen (`SessionRow.tsx`) surviving despite renamed identifiers — found unprompted by lens3 via a full side-by-side file read, in a completely different domain (row-level destructive-confirm family vs r46/a's blocked-workflow scroll-jump family) and against a different neighbor file. Two independent rounds, two independent reproductions, same underlying failure mode (architecture-level reuse that identifier-level checks alone cannot catch) — meets this project's 2-round reproduction bar for L2. See the new jsonl entry for the full citation.

No new `questions-queue.md` entry — no conflict surfaced between lenses or against meta-criteria this round (the lens disagreement pattern seen in some prior rounds — e.g. complete 3-way ties — did not occur; this was a clean unanimous 3-0).

## Canon / invariants

`native/GENERATION.md`, `native/src/tokens.ts`, the production native screen catalog, `/dash` gallery, `/v1–v5`, `dash-brief-v3.md`, `design-principles.md`, `page-brief-core.md` all fully unchanged throughout. `native/src/screens.ts` + `native/screens.json` edited (standard per-round registration of all 3 candidates, not a canon edit). `native-deltas-provisional.jsonl` append-only (2 new entries: 1 new L1 + 1 L2 promotion). `reassign-queue.md` untouched (nothing pending, nothing to archive). No commits to `main`, all on `evolve/dash`.
