# auto-native-r58 — DECISION

## 0. Round budget (§0-0-1) and target

```
$ node scripts/round-budget.mjs 2
1
$ node scripts/round-budget.mjs --explain 2
미채움 0종 — N≥2 의 근거(커버리지)가 없다
```

`N=1` confirmed. This is **round 1 of 2** of this scheduled session's outer request ("perform 2
sequential rounds, equivalent to `/dash-evolve 2`"). 0 of 18 `PAGE_TYPES` are unfilled, so the budget
script forces `N=1` regardless of the requested value — the 2nd requested round is deferred to the
next scheduled firing, per the established disposition (same pattern as r44/r48/r49/r51-r57).

Today (2026-11-16) is UTC **Monday**. Per SKILL.md §0's native weekly-cadence rule: *"N이 2 이상인
실행에서 월요일이면 첫 라운드의 타깃을 무조건 native로... N=1이면 그날은 native 한 라운드만 돈다."*
Since the budget script returned `N=1` and today is Monday, this single round's target is **forced to
`native`** — not drawn by the ordinary uniform `[dash, landing, native]` random choice.

Round number: `auto-native-r58` — max existing `auto-native-r*` in the ledger was r57 (no-round), so
this run is r58.

`reassign-queue.md` "대기 중" had no `target: native` entry at RETRIEVE time, so no candidate slot was
pre-assigned.

## 1. Agent-tool availability

Confirmed available this session (the `Agent` tool is present and functional) — proceeded past §0-0.
Not self-judged: 6 independent subagent dispatches (3 blind `general-purpose` designers for GENERATE,
3 blind `general-purpose` judges for the panel), no cross-visibility between any of the 6.

## 2. GENERATE

Three candidates assigned deliberately distinct macro-shapes, chosen to avoid the last 4 rounds'
buckets (r53 blocked-workflow state machine + row-confirm + bandless browse; r54 bandless calculator +
ordered stepper + read-only accordion; r55 branching conditional flow + shared-state proposal editor +
drill-down navigator; r56 dual-pick pending band + dirty-diff save band + share-once persistent bar):

- **a — "Search Preset Priority"**: explicit list reordering via up/down `Pressable` arrows on each
  row (no drag), with a dirty-diff save/reset band that appears only when the working order differs
  from the saved order.
- **b — "Mis-description Review Queue"**: sticky TOP progress counter ("X of 5 reviewed"), no bottom
  band at all; each row independently flips in place into a `Cancel`/`Confirm` pair for the destructive
  "Relist with corrections" choice.
- **c — "Select a Pickup Locker"**: single-select (radio) locker list with one selectable-disabled
  ("Currently full") row, and an always-visible persistent band whose text/action is derived fresh from
  selection state, ending in a one-way read-only "reserved" phase.

All three designers were given the full `native/GENERATION.md` brief body (not a path), the native
Mobile/Native catalog table, the open-delta directives current as of r56/r57 (accordion
`accessibilityState`/`accessibilityElementsHidden` pairing; fresh-derived band/gate state on reversal;
finalized-phase must also gate per-item reversal controls; single-derived-source gate architecture for
linear vs. non-linear/set gates; mutual exclusivity of bottom surfaces via shared state; no-op
`Pressable` + `accessibilityHint` rule; terminal CTA must never be a no-op; the
architecture-level-code-surface-cloning severity spectrum), the "satisfy all 3 lenses at once"
instruction, and a dedup list (25 production + ~100 evolve-round check strings/domains + last-4-round
macro-bucket summary). Each produced its own `candidates/<v>.md` with a required "Brief gaps" section
(confirmed present in all three before gating).

## 3. Hard gate

Freeze hash (pre-gate, computed from `cat native/src/evolve/r58/*/*.tsx native/src/evolve/r58/*/*.ts |
shasum`): `48ed5bc164f6e51c23b9291218f2e099435acdd5`. Re-verified identical immediately after the gate
run and again before screenshot capture — unchanged throughout.

```
$ PW_CHROMIUM_PATH=/opt/pw-browsers/chromium node scripts/gate.mjs --target native \
    --screens evolve-r58-a evolve-r58-b evolve-r58-c
```

| Candidate | tsc | export | render | iframe |
|---|:--:|:--:|:--:|:--:|
| a — Search Preset Priority | ✅ | ✅ | ✅ | ✅ |
| b — Mis-description Review Queue | ✅ | ✅ | ✅ | ✅ |
| c — Select a Pickup Locker | ✅ | ✅ | ✅ | ✅ |

**12/12 pass on the first attempt.** `violations: []`. No `blockedBy` cross-candidate failures (global
`tsc` was clean on the first run across all three). No 1-fix used by any candidate.

Environment note (session-specific, not a SKILL.md procedure): this container had no
`native/node_modules` and no Playwright Chromium reachable (sandbox egress blocks
`cdn.playwright.dev` with a 403). Worked around with a plain `npm install` in `native/` and
`PW_CHROMIUM_PATH=/opt/pw-browsers/chromium` (an env var the repo's own scripts — `gate.mjs`,
`capture-shots.mjs`, `shot-native.mjs`, `native/scripts/validate.sh`, `native/scripts/shot-evolve.mjs`
— already read; no script changes made).

## 4. Screenshots

`native/scripts/shot-evolve.mjs` (PW_CHROMIUM_PATH-aware) via `expo export --platform web` + `serve` +
Playwright, at 390×844 and 768×1024, one export/serve cycle per candidate. 6 frames total, 0 blanks —
orchestrator visually confirmed all 6 render real, distinct content (not placeholder/blank) before
dispatching judges.

## 5. Judge panel (3 independent blind `general-purpose` subagents, no cross-lens visibility)

Each judge was given: the relevant source files for all 3 candidates (blind-labeled X/Y/Z, mapped to
a/b/c only in the orchestrator's own bookkeeping, never disclosed to the judges), both screenshot
widths, and an instruction not to open `screens.ts`/`screens.json`/`candidates/*.md`. Lens 3 was also
given explicit nearest-neighbor file paths to open for a genuine side-by-side comparison (not a
regex/identifier scan), per the established "a full side-by-side read is the only way to catch
architecture-level cloning" doctrine.

**Lens 1 (DNA/brief compliance): b > c > a.**
- b: "cleanest, most textbook-correct application of the brief's band rules... zero rendering
  defects." Zero rule violations found.
- c: correctly implements the brief's hardest rule (finalized phase must gate the per-item reversal
  control itself, not just the summary) almost verbatim — but a real 390px-only text-wrap defect in the
  "Civic Plaza Lockers" row meta line was caught by screenshot, not source (the brief's own stated
  lesson: verify visually).
- a: technically-correct derived `isDirty`, but its live-region container is only mounted
  *conditionally* (inside `{isDirty && (<View accessibilityLiveRegion="polite">...)}`), unlike b and c
  which both keep their live-region containers permanently mounted — risking the announcement being
  read as an insertion rather than an update on Android. This is this round's LEARN delta (see §6).
  Also, a's band form doesn't cleanly match any of the brief's four enumerated valid forms (though it
  passes the brief's overarching "judged by whether it does work" test).

**Lens 2 (mobile completeness / iOS & Android idiom): a > c > b.**
- a: clean hand-traced state logic, correct boundary handling on first/last row arrows, full
  `({pressed}) => [...]` press feedback everywhere, appropriate (non-modal) confirmation weight for a
  non-destructive action.
- c: coherent state logic and genuine in-surface confirmation, but a real narrow-width text-wrap defect
  (same one lens 1 independently found) at 390px.
- b: **zero `({pressed}) => [...]` press-feedback styling anywhere in the file** — every interactive
  element (Dismiss/Relist/Cancel/Confirm) uses a static style object with no pressed-state treatment, a
  screen-wide (not just one-row) responsiveness gap. Idiomatically correct confirmation weighting
  (non-destructive Dismiss needs no confirm; destructive Relist flips to Cancel/Confirm) and a correctly
  live-recomputed counter were both praised, but did not outweigh the screen-wide press-feedback gap for
  this lens.

**Lens 3 (screen-type/architecture differentiation): b > c > a.**
- **a — severe clone.** Side-by-side read against `native/src/evolve/r40/c/PayoutMethodOrderScreen.tsx`
  (an existing screen, check string "Payout Method Order") found its `swap()`/`ordersEqual()` helpers are
  near-line-for-line identical to r40/c's `withAdjacentPairSwapped()`/`sequencesHoldSameOrder()` with only
  cosmetic renaming, the same `workingOrder`/`savedOrder` + dirty-band architecture, and Reset/Save button
  style-key names matching r40/c's `resetOrderButton`/`saveOrderButton` family minus the "Order" infix.
  Lens 3's own words: *"X is effectively Payout Method Order reskinned from payout methods to search
  presets."* The row-level visual presentation (rank column + vertical arrow icons vs. r40/c's
  horizontal text buttons + live-announcement region) was NOT copied — only the screen-level
  state/handler/band logic.
- c: reuses an already-twice-established "always-visible band derived from single-select radio state,
  ending in a confirmed phase" mechanic (`r41/b ProtectionPlanPickerScreen`, `r42/c
  SplitPayPlanSelectorScreen`) closely, including literal matching radio-dot pixel dimensions against
  r42/c. Its one genuinely new contribution is the one-way, irrevocable list-freeze-on-finalize
  mechanic, which neither neighbor has (both of theirs remain reversible/"Change Plan"-able).
- b: best of the three. Partially resembles the twice-established row-confirm idiom
  (`ActiveSessionsScreen`/`SessionRow`, `r47/c PointsRedemptionScreen`/`RewardRow`) at the "row flips to
  inline Cancel/Confirm" level, but diverges in actual mechanism — those two neighbors share a singleton
  `activeId`+`phase` pattern with a `setTimeout` auto-revert, while b uses an independent
  `Record<id,status>` with permanent (non-reverting) resolution and no timer anywhere; this is a genuine
  control-flow difference, not a rename. b's "sticky top strip + bandless FlatList" macro layout is
  structurally close to `PointsRedemptionScreen`'s fixed balance bar + bandless list, which lens 3 noted
  as the main non-cloning differentiation ding against b.

**Aggregate: b wins an ordinary 2:1 majority (lens1=b, lens2=a, lens3=b).** This is NOT a complete
3-way split (lens 1 and lens 3 agree), so curation-criteria's tie-break-exception procedure does not
apply — the plain majority stands.

## 6. Winner: candidate b — "Mis-description Review Queue"

No rule violation was found against b by any lens — lens 2's dissenting vote was on a completeness-axis
finding (zero press/active feedback screen-wide), which the UX catalog lists as a 🟡-severity row, not
one of `GENERATION.md`'s hard DNA/a11y rules, and lens 1 (the rule-compliance lens) did not flag it as a
violation. Per §3-1, post-judgment fixes are scoped to rule-violation resolution only, never
completeness/taste improvement — so **no fix was applied**, and the freeze hash stands unchanged through
promotion.

Non-winner findings, recorded here but not fixed (§3-1 is winner-scoped only) and not reassign-queued
(both a and c passed the hard gate clean 12/12 — these are pure judgment-stage losses, matching the
established disposition from r41/r42/r44-r57):
- **a**: the conditionally-mounted live-region defect (this round's LEARN delta), and the severe
  architecture-level clone against `r40/c` described above.
- **c**: the 390px text-wrap defect (found independently by two lenses via screenshot), and the
  near-duplicate always-visible-band-derived-from-selection mechanic against `r41/b`/`r42/c`.

### A note on this orchestrator's own dedup-survey gap

Candidate a's severe clone against `r40/c` ("Payout Method Order") is partly a gap in this session's own
GENERATE-stage dedup list, not purely a designer failure: the dedup list given to all three designers
*did* flag "payout method ORDER (reordering — already exists, avoid)" by domain name, but the same
brief's candidate-a assignment separately and incorrectly asserted *"no prior round has implemented
list-item reordering via up/down controls"* — the domain-name collision was caught, but the
underlying-mechanic precedent was missed, because the dedup check was keyed on domain/title text rather
than on interaction mechanic. Recorded here for transparency. This does not meet the bar for a
`questions-queue.md` entry (no conflicting delta pair, no meta-criteria-unjustifiable finding) — it is
an assignment-writing lesson for whichever session next writes a native dedup list, not a new judgment
question.

## 7. LEARN

One new L1 delta appended to `vault/00-principles/native-deltas-provisional.jsonl` (round
`auto-native-r58`, variant `b`, confidence `low`, single-lens observation): a fixed bottom band's
`accessibilityLiveRegion="polite"` container must be permanently mounted (present before the content
change it announces), not conditionally rendered into existence in the same render as the first
announced text — generalizing `GENERATION.md` §3's existing destructive-confirmation-specific
"container that already carries `accessibilityLiveRegion='polite'`" requirement across band forms
generally, evidenced by candidate a's conditionally-mounted band vs. b/c's permanently-mounted
containers.

## 8. Refinement gate

The new delta's text does not claim to extend/reproduce any specific prior delta by round-id (it
generalizes an existing brief rule's scope, not a reproduction claim) — no reproduction-claim
verification needed. No conflicting delta pair identified this round. No new `questions-queue.md`
entry — the a/r40-c cloning finding is recorded above and does not meet the conflicting-delta-pair or
meta-criteria-unjustifiable threshold this skill reserves for that queue.

Canon (`dash-brief-v3.md`, `design-principles.md`, `page-brief-core.md`, `page-brief-repo.md`, all
`brief-*.md` type profiles, `/dash` gallery, `/v1`-`/v5`, `native/GENERATION.md`, `native/src/tokens.ts`)
fully unchanged throughout. `native/src/screens.ts` + `native/screens.json` edited (standard per-round
registration, done centrally by the orchestrator after all 3 designers confirmed completion, to avoid
merge conflicts between parallel agents). `native-deltas-provisional.jsonl` append-only (1 new entry).
No commits to `main` — all on `evolve/dash`.

## 9. Outer-task disposition

This is round 1 of this scheduled session's 2 requested rounds. Round 2 is deferred to the next
scheduled firing, per the established disposition (r44/r48/r49/r51-r57) — `round-budget.mjs` returns
`N=1` for any requested `N≥2` while 0 `PAGE_TYPES` remain unfilled, and that script's output is the sole
authority on round count (this session's outer prompt deliberately does not duplicate that logic).
