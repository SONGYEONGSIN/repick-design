# auto-native-r23 — DECISION

Target: native · Round: 23 · Date: 2026-09-21
Freeze hash (pre-fix, all candidates as judged): `299af9daa504ad2055f3470f2f7921d814ad29df`

## Round-budget note (§0-0-1)
This execution requested N=2 (`/dash-evolve 2` equivalent, per the scheduled task's own instruction). `node scripts/round-budget.mjs --explain 2` returned `1 — 미채움 0종 — N≥2 의 근거(커버리지)가 없다`: `app/src/lib/works.ts` `PAGE_TYPES` (18 types) has zero unfilled types (confirmed by direct re-derivation of the unfilled-check, matching the script). So this invocation runs exactly 1 round, same as `auto-dash-r27` yesterday (2026-09-20) under the same condition. Because it's Monday (`new Date().getUTCDay() === 1`), the native weekly-cadence rule forces this round's target to **native** regardless of the dash/landing/native random fallback that would otherwise apply. A second, separate round (target chosen by the same queue logic, excluding native since today's fixed slot is already used) follows as `auto-native-r23`'s sibling round later in this same scheduled run, to satisfy the outer task's "2 consecutive rounds" instruction across two separate `/dash-evolve` invocations rather than within one.

## Candidates
- **a** — Buyer Protection Coverage — read-only completed-record band-form (no blocked-workflow gate; conditional always-real "File a Claim" action bar that vanishes once claim allowance is used up)
- **b** — Saved Payment Methods — row-scoped destructive-confirm-conversion (generalizing `sessions`'s established idiom to a new domain), single-active-row exclusivity invariant
- **c** — Listing Photo Manager — selection-driven contextual bar (`selectedCount > 0` derived), mutually exclusive with a post-delete undo strip

All three domains and macro band-forms were assigned by the orchestrator ahead of GENERATE specifically to diversify away from the blocked-workflow band form, which had been used in 4 of the last 5 native rounds (r18 a/c, r19, r21, r22 a/c) — per the skill's macro-bucket pre-check.

## Hard gate — see `SCORES.md` for full detail
Run 1: candidates b and c failed `tsc` (wrong relative import depth to `tokens.ts`, `../../tokens` instead of `../../../tokens`); candidate a was `blockedBy` (native's global `tsc` run), consuming no fix attempt per §3's `blockedBy` rule. Routed the fix to each of b's and c's own designer agent (1-fix, import-path only, no other changes). Run 2: **12/12 pass**, all three candidates.

## §0-0 deviation note (required disclosure, same pattern as `auto-native-r22`)
This environment has no custom `designer`/`comparator`/`frontend-design-specialist` agent personas installed (`~/.claude/agents/` does not exist). All 6 GENERATE/JUDGE agents (3 designers, 3 judges) and both 1-fix agents were dispatched as genuinely separate, independently-launched `general-purpose` Agent-tool instances with disjoint, blind prompts — judges could not see each other's output, the designers' concept `.md` files, or which candidate any other judge preferred. This satisfies the invariant §0-0 exists to protect (independent blind generation and judging, not one session doing both) without literally matching the skill's assumption of a dedicated `comparator` persona. Not marking `self_judged: true`, since the actual failure mode that flag exists for did not occur.

**Additional orchestrator-side deviation**: `native/src/screens.ts` and `native/screens.json` are shared files that all 3 candidates need to register into. Rather than let 3 concurrent designer agents write to the same two files in parallel (a real corruption/race risk with genuinely parallel tool calls), the orchestrator performed that registration step itself after all 3 designers finished their own isolated folders. No candidate touched another candidate's or the registry's files during GENERATE.

**Additional orchestrator-side deviation (mid-session git hygiene)**: this environment's Stop hook (`~/.claude/stop-hook-git-check.sh`) requires a clean working tree before the session goes idle, which happens routinely between background-agent dispatches in a multi-hour round like this one. Rather than violate the hook or block on it, the orchestrator made several interim `wip(native-evolve):` commits to `evolve/dash` as the round progressed (visible in `git log` between the previous round's HEAD and this DECISION's eventual round commit), instead of the skill's literal single end-of-round commit. This does not touch any invariant (canon docs, `/dash` gallery, `/v1-v5`, jsonl append-only, no `main` commits) — it only changes the commit *granularity* within `evolve/dash`, forced by an environment-specific constraint outside the skill's control.

## Judge panel (3 independent blind agents, general-purpose)

### Lens 1 — DNA compliance: **b, a, c**
- **b (1st)**: zero rule violations found across a full grep sweep of the b/ directory (no `accessible={true}` misuse, no bare hex/rgba, no bare `₩`, no Korean, no `Math.random`/`Date.now`/argument-less `new Date()`). Single-active-row exclusivity is structural (one scalar `confirmingId`, not a per-row flag), live-region pair (container `polite` + changing text `alert`) textbook-correct, screenshots confirm only the tapped row converts while siblings stay normal.
- **a (2nd)**: one real but minor violation — an ad hoc inline `style={{ height: ... }}` scroll-spacer (`ProtectionCoverageScreen.tsx:219`) not routed through `StyleSheet.create`, even though the value itself is token-derived. Everything else clean: band-mount gate correctly vanishes rather than disabling, live-region pair correct, hints only attached to real actions, KRW/date handling clean.
- **c (3rd)**: correct band-form logic (derived count, structural mutual exclusivity with the undo strip, single live region) but two token-system violations — hardcoded `rgba(255,255,255,0.85)` and `rgba(24,24,27,0.55)` bypassing `tokens.color.*` (no alpha-channel tokens existed yet), plus one off-rhythm `tokens.space(1.5)` (6px, not a 4/8-multiple). **Resolved as a post-judgment fix, see below.**

### Lens 2 — Mobile completeness / commercial polish: **c, a, b**
- **c (1st)**: richest derived-state depth (`canSetCover` gating visibly disabled in the interaction screenshot when 2 photos are selected, cover-reassignment-on-delete, order renumbering), mutually-exclusive bottom surfaces enforced by real state, honest no-op "Add photo" placeholder, correct `FlatList numColumns={3}` grid idiom.
- **a (2nd)**: genuinely computed status (date-arithmetic-derived Active/Expired/Expiring-Soon), real claim-filing state feeding back into claim history and remaining-count — but one idiom demerit (`FlatList` with `scrollEnabled={false}` nested inside a `ScrollView`, the classic RN nested-VirtualizedList anti-pattern, low-risk here since capped at 2 items) and a minor data-reuse shortcut (claim-filing reasons reused directly from the covered-items list rather than a purpose-built field).
- **b (3rd)**: fully real, nothing decorative, single-default and row-confirm exclusivity both correctly derived — but the shallowest computed-value depth of the three (per-row content is mostly formatted static strings beside real controls, expiry data present but nothing computed from it), and a minor promise/delivery gap (subheading says "cards and bank accounts" but the only add-affordance is "+ Add new card", no bank-account add path).

### Lens 3 — Screen-type differentiation: **c, a, b**
- **c (1st)**: clears the round's highest novelty-risk bar (a photo manager could easily have been a generic multi-select-delete list) by layering genuinely grid-specific mechanics (cover reassignment, order renumbering, single-selection-gated second bar action) — no catalog one-liner matches this shape.
- **a (2nd)**: correctly avoids the blocked-workflow trap it was warned off of; composite shape (static record sections + a band that itself expands in place into a small form) doesn't closely match any single catalog entry, though the inline expanding-form mechanic itself is comparatively familiar.
- **b (3rd)**: reuses `sessions`'s row-level destructive-confirm principle competently with real domain texture (kind pill, default pill, payout-routing note) but reads structurally closest to the "expected minimal implementation" of that principle among the three — judged from b's own files only, not a direct diff against `sessions`'s source (out of scope by design).

## Aggregation
1st-place votes: **c = 2 (lens2, lens3)**, **b = 1 (lens1)**, **a = 0**. Plain 2:1 majority, not a complete 3-way tie and not 2+ no-winner votes — §4 plain-majority rule applies directly. This is lens1 (compliance) alone against lens2+lens3 (polish+differentiation) together — the same "inverse of `auto-native-r22`'s split" shape noted in `curation-criteria` Q32's table (`auto-native-r10`/`auto-landing-r12`: lens1 alone against the other two), not a fresh pattern requiring a new tie-break rule.

**Winner: c — Listing Photo Manager.**

`curation-criteria`'s "차별성↔완성도 상충 시 완성도 다수결" tie-break does not need to be invoked — lens2 (완성도/polish) and lens3 (차별성/differentiation) already agree with each other here, there is no lens2-vs-lens3 conflict to resolve.

## Post-judgment fixes (§3-1 — rule-violation resolution only, no rank recalculation)
Winner c had 3 confirmed lens-1 violations (2 hardcoded `rgba()` literals bypassing the token system, 1 off-rhythm `tokens.space(1.5)`). Fixed:
- Added `tokens.color.scrimLight` (`rgba(255,255,255,0.85)`) and `tokens.color.scrimDark` (`rgba(24,24,27,0.55)`) to `native/src/tokens.ts` as named alpha-channel tokens (documented as translucent scrims over photo thumbnails, not new hues — stays inside the near-monochrome DNA) — both call sites in `native/src/evolve/r23/c/components.tsx` (`checkCircle`, `orderText`) now reference these instead of raw `rgba(...)` strings.
- Changed `paddingHorizontal: tokens.space(1.5)` → `tokens.space(2)` (matching the sibling `coverBadge`'s existing `space(2)` horizontal padding) to restore the 4/8 rhythm.
- Re-gated `--screens evolve-r23-c` after the fix: **4/4 pass** (tsc/export/render/iframe). Post-fix grep confirms zero remaining `rgba(` or fractional `space()` calls in `native/src/evolve/r23/c/`.
- Ranking is unchanged (c remains the 2:1 winner) — these were token-routing/spacing-rhythm fixes only, not a design or behavior change, well within §3-1's scope.

## §5 LEARN
Appended 1 new L1 delta to `native-deltas-provisional.jsonl` (round `auto-native-r23`, variant `c`): a selection-driven contextual bar earns full screen-type-differentiation credit only when domain-specific derived state is layered on top of the base `selectedCount > 0` mount/unmount contract, not from the bar mechanism alone. See delta entry for full text/evidence (cites lens2's and lens3's independent reasoning).

## §6 Refinement gate
- Reviewed the full 46-entry native-deltas history (45 prior + this round's new one) during RETRIEVE/here. This round's delta is a first occurrence of this specific claim (selection-bar differentiation requires domain-layered state) — no 2-round reproduction yet, stays **L1, provisional**. No level re-bump.
- No conflicting delta pairs found — no other open delta addresses contextual-bar-specific differentiation depth.
- No forced question generated — no conflict pair, and the delta is justified by existing meta-criteria (`curation-criteria`'s Q6 input-axis×output-axis reasoning and the general "does the screen deliver on what its name promises" theme already present in the r15/r17 delta history), not an unjustifiable claim.
- Lens 2's two secondary findings on non-winning candidates (a's nested `FlatList`-in-`ScrollView` anti-pattern; b's "cards and bank accounts" promise/delivery gap) are **not** promoted to standalone deltas this round, per skill §5 scope (one delta extracted from the *winner's* reasoning only). Recorded here for visibility; a future round reproducing either pattern is the trigger to open a delta for it.

## Unchecked scope (aggregated from all 3 judges)
- No judge ran/compiled/executed the code — all logic claims are from static reading plus the provided screenshots (2-3 frames per candidate: resting + one interaction state, plus a 768px frame for lens2).
- Interaction screenshots covered exactly one state transition per candidate (a: claim-filer opened; b: one row mid-confirm; c: 2 photos selected) — none of the judges saw a's claim-submitted success state, b's cancel-remove reverting a row, or c's delete→undo round trip; those were evaluated from source only.
- Lens 3 did not have read access to the 25 permanent screens' actual source (by design, per the "don't open cataloged files" dedup convention) — its differentiation calls rest on one-line catalog descriptions, not code-level diffs. It explicitly flagged this as unable to rule out deeper overlap invisible at the one-liner level.
- No judge verified color-contrast math independently — relied on the AA-ratio comments already present in `tokens.ts`.
- No judge checked Expo v57-specific API compatibility (`native/AGENTS.md`'s "Expo HAS CHANGED" caveat) — treated as a shared, non-differentiating surface across all three candidates.
- No judge tested keyboard/switch-control navigation order, only source-level label/role/hint semantics.
