# auto-native-r38 — DECISION

## 0. Round framing
- Round 2 of this scheduled run's 2 consecutive `/dash-evolve` executions. Round 1 (`auto-native-r37`, winner c) was fully committed and pushed before this round's RETRIEVE began — sequential, not parallel, reading r37's own LEARN delta and the Q65 it opened during this round's RETRIEVE.
- `round-budget.mjs --explain 2` re-run fresh after r37's commit → still `1\t미채움 0종 — N≥2 의 근거(커버리지)가 없다` (PAGE_TYPES unchanged by a single evolve round — promotion only happens at `/dash-falsify apply`). This round runs exactly 1 of §0–7, per precedent.
- Target re-draw (unfilled queue still empty → equal random dash/landing/native): **native again** — a legitimate repeat of an independent draw (same thing happened 2026-10-12 with r35/r36). Not a Monday, no weekly-cycle override.
- Round number: `auto-native-r38` (max existing native round + 1, from the ledger updated by r37's commit).
- `reassign-queue.md` "대기 중" still has no `target: native` entry — r37 had 12/12 clean, nothing rejected into the queue.
- `native-deltas-provisional.jsonl` tail now includes r37's macro-layout-convergence L1 delta; last 6+1 native ledger entries read fresh. `variety` still constant (fixed RN DNA tokens), no `catalog-variety.mjs` run, matching all prior native rounds.

## 0-0. Agent-tool / subagent-type deviation (self-disclosed, same as r37)
Same substitution as round 1: no `designer`/`comparator` custom agent definitions exist in this
sandbox, so `general-purpose` agents stood in for both roles across 6 independent, blind
invocations (3 designers, 3 judges). Independence and blindness preserved; `self_judged` not set.

## 1. RETRIEVE (summary)
Re-read: `native/GENERATION.md`, `native/src/tokens.ts`, `native/screens.ts`/`screens.json` (now 58
existing domains including r37's 3), `native-deltas-provisional.jsonl` tail (r37's new delta),
`questions-queue.md` (now including Q65, opened by r37), `reassign-queue.md` (still empty for
native), last 6 native ledger entries (now including r37/c winner), and r37's own three source files
as code-convention references for this round's three designer agents.

## 2. GENERATE — this round's explicit test of Q65
Q65 (opened by r37) asked whether assigning only bottom-band mechanics is sufficient to produce
macro-layout variety, after two "no band" candidates converged on the same vertical-list-with-header
skeleton. This round was designed as the direct experiment: **each candidate was assigned both a
domain AND an explicit, distinct macro-layout**, independent of band-mechanic:

| v | screen | macro-layout | band mechanic |
|---|---|---|---|
| a | Help Center | search-input-driven single list with per-item accordion expand/collapse | no band |
| b | Seller Annual Tax Documents | two-level year-grouped sectioned list (`stickyHeaderIndices`) | no band |
| c | Return Shipping Label Generator | multi-step wizard, one pane visible at a time, step indicator | blocked-workflow state machine (step-gated) |

a and b deliberately share the same band-mechanic (no band) specifically to isolate whether
macro-layout assignment alone — not band-mechanic variety — is what prevents convergence.

Screen registration (`screens.ts`/`screens.json`) done centrally by the orchestrator after all three
candidates finished, same race-avoidance reasoning as r37. All three `CHECK_STRING`s verified
literally present in each screen's `accessibilityRole="header"` title before registration.

Source hash frozen before screenshot capture: `300b3129ccee0f3e97168b7b724029a0285aa331`. Verified
unchanged immediately before this DECISION was written — round is valid.

## 3. HARD GATE
`node scripts/gate.mjs --target native --screens evolve-r38-a evolve-r38-b evolve-r38-c`

**12/12 clean on first pass** (`verdict.pass: true`, `violations: []`) — no 1-fix loop needed. Full
table in `SCORES.md`. Same `PW_CHROMIUM_PATH`/`CHROME_PATH` environment workaround as r37 (no
scripts changed).

## 3-1. Post-judgment refinement
Not applicable — no rule violation found by any lens on any candidate.

## 4. JUDGE PANEL
3 parallel blind `general-purpose` agents (lens roles substituted per §0-0), each given both
screenshots (390/768, with candidate c's wizard screenshots covering step 1 only — steps 2-3 traced
via source per the multi-frame rule for state-driven screens) and full source for all three
candidates, canon docs, and the 58-screen duplicate-avoidance list. Lens 3 was additionally asked to
answer this round's Q65 test directly. All three completed with full rankings, reasoning, evidence,
and self-reported unchecked scope — no abstentions.

### Lens 1 — DNA / profile compliance
**Ranking: c > b > a.** All three clean, no disqualifying violations. c traced as the most
rule-dense: genuine (not cosmetic) step-gating via `canProceedNow()`/`disabled` prop/redundant guard
returns, a single live region correctly handling both step-transition and in-step blocked↔possible
announcements without double-firing (verified via `stepUnchanged` ref bookkeeping), and an explicit
code-surface check against r36/a's blocked-workflow band confirming zero literal style-key or phrase
overlap despite reusing the same validated principle. b matched c's live-region/clearing-timer rigor
and made a well-reasoned, explicitly-commented "no band" call extending the read-only-archive
exception to per-row terminal actions. a is fully compliant but the least rule-dense — no gated
action, no destructive flow, so it doesn't positively exercise the harder mechanics this lens checks
(not a flaw, just less surface engaged).

### Lens 2 — mobile app production polish
**Ranking: c > b > a.** Required traces for all three passed: a's live search+category filter is
genuinely functional (`useMemo`-derived `filteredEntries`, result count derived not hardcoded,
confirmed against the 16-entry `data.ts` array matching the unfiltered screenshot count); b's
per-row Download→"Downloaded" state is a real, independently-tracked transition per row (not shared/
decorative); c's steps 2-3 (unseen in static screenshots) were traced in source and found
production-complete — a specific real address, a realistic tracking number, a genuinely dense
deterministic 80-cell mock barcode (not a placeholder rectangle), and correct `FlatList`-inside-
`ScrollView` nesting (`scrollEnabled={false}`) avoiding the nested-VirtualizedList warning. Deciding
margin: touch-target discipline — c is the only candidate with zero sub-44pt primary controls; b's
single repeated Download CTA is 40pt; a has two secondary sub-44pt controls (clear button, category
chips). b's tax-domain content realism (an accurate 1099-K filing-deadline edge case, a below-
threshold year, an original+corrected-form pair) was called out as the strongest content fidelity of
the three, keeping it close behind c.

### Lens 3 — screen-type differentiation + this round's Q65 test
**Ranking: b > c > a.** Directly answered this round's empirical question: **yes, explicit
macro-layout assignment produced three genuinely distinct screens this time**, unlike r37. a and b
share only the outermost `SafeAreaView > header > FlatList` skeleton — which the lens noted is
near-universal across the whole catalog and therefore not itself evidence of convergence — but
diverge concretely underneath: a's defining mechanic is a live keystroke-driven filter + per-row
accordion disclosure over a flat, homogeneous data model; b's is a two-level `stickyHeaderIndices`-
driven sectioned list over a 3-way discriminated union (including a "pending/not yet issued" branch
a flat list has no natural way to express) with per-row terminal actions and zero filtering. c is
trivially distinct from both (not list-based at all). Ranked b 1st for the most technically novel RN
mechanic (sticky two-level grouping, an edge-case data branch) plus a self-aware, explicitly-
commented differentiation from the existing "Tax Export Tagging" catalog screen. c ranked 2nd not for
any flaw but because a wizard+blocked-workflow-band is, by the lens's own framing, "the textbook
application of an already 3x-validated idiom" for this exact domain — well-executed but structurally
the least novel of the three. a ranked 3rd as the most generic domain (FAQ/help search is
near-boilerplate across consumer apps) with the single shallowest interaction branch (one
expand/collapse) relative to b's multi-branch data model or c's full gated multi-pane flow.

### Aggregate
1st-place votes: **c = 2** (lens1, lens2), **b = 1** (lens3), **a = 0**. No 3-way tie, no 2-vs-2
split requiring tiebreak. **WINNER: c — Return Shipping Label Generator.**

## 5. LEARN
```
node -e "import('./scripts/design-loop.mjs').then(m=>m.appendLedger({round:'auto-native-r38',variant:'c',delta:'Follow-up to the auto-native-r37 delta (band-mechanic assignment alone does not guarantee macro-layout variety): explicitly assigning a distinct macro-layout to each candidate, independent of and in addition to band-mechanic assignment, does prevent the convergence seen in r37 -- confirmed this round by an independent blind judge (lens3) who was specifically asked to adjudicate the question and found two candidates sharing the same band-mechanic (no band) nonetheless produced genuinely distinct interaction models and data shapes (live keystroke-filter + per-row accordion over a flat list vs. a two-level sticky-grouped list with a 3-way discriminated data model and zero filtering) rather than collapsing into the same generic list-with-header shape. The lens explicitly noted the two screens share only the near-universal outer SafeAreaView>header>FlatList chrome, which it judged not to be evidence of convergence on its own -- the test is the interaction/data model underneath, and that is where this round diverged and r37 did not. If GENERATE wants to ensure macro-structural spread across a round, assigning macro-layout explicitly (not just band-mechanic) is a working, now twice-observed lever: once as the diagnosed problem (r37) and once as the applied, judge-confirmed fix (r38).',evidence:'lens3 (screen-type differentiation), directly answering this round'\''s posed test question: \"Yes -- a and b genuinely diverge structurally, not just cosmetically, despite sharing the no band mechanic... The shared element between a and b is only the outermost skeleton... That skeleton is near-universal across almost every list-bearing screen in the catalog, so it is not itself evidence of convergence -- the real test is the interaction model and data model underneath, and there they diverge concretely... The explicit macro-layout assignment appears to have worked as intended.\" Supporting, independent: lens2 separately observed (outside its primary scope) \"the three did read as structurally distinct in the frames reviewed: a = scrollable accordion list with inline filter header, b = sticky two-level year-grouped list, c = fixed-chrome single-pane wizard -- no shared skeleton observed.\"',judge_votes:{lens1:'c',lens2:'c',lens3:'b'},confidence:'medium',level:'L1',status:'provisional'},'vault/00-principles/native-deltas-provisional.jsonl'))"
```
`confidence: 'medium'` (higher than r37's `low`) — this is a direct, judge-confirmed answer to a
question the previous round raised, with a second independent lens (lens2) corroborating the
"structurally distinct" read without being asked to. Still `level: 'L1'` per curation-criteria's
2-round-reproduction bar for judgment-based (non-machine-verifiable) deltas — this round is the
first time the *fix* (explicit macro-layout assignment) has been tested, even though the *problem*
it fixes was independently observed once before (r37).

## 6. Knowledge refinement gate
Loaded `native-deltas-provisional.jsonl` in full (tail read) plus this round's new entry — the new
entry is explicitly a follow-up to r37's entry (same delta chain, not a new unrelated claim), so per
`/dash-evolve` §6's "delta 본문이 재현을 주장하면 그것이 1차 증거다" rule, that reproduction claim
is evaluated here: the claim is **not quite reproduction of the same observation** (r37 observed
convergence happening; r38 observed convergence being prevented by a specific intervention) — it's
the natural next step in the same investigation, not a duplicate data point for the same claim. So it
does not independently qualify for L2 promotion on its own (that would need a second round
reproducing *this* round's specific claim — macro-layout assignment preventing convergence — not
just a related earlier observation). Appropriately kept at L1.

**Q65 updated** (not closed — one round of confirming evidence is not the 2-round bar
curation-criteria sets for closing a judgment-based question, and Q65 itself was only opened this
same session by r37): appended an update to `vault/00-principles/questions-queue.md` Q65 recording
this round's result and its relationship to the Q22/Q30 "수렴은 배정으로 못 막는다" precedent — this
round's finding does NOT contradict that precedent, since Q22/Q30 was about assigning a macro layout
and having a *lower* layer (CTA banding) converge, whereas this round assigned the macro layout
itself and that is exactly the layer that stopped converging; the two findings are compatible
(assignment works at the layer it targets, convergence pressure moves to whatever layer is left
unassigned). No new question opened — this is a direct update to the existing one.

## 7. Record + commit
- `auto-ledger.jsonl` entry: `target: 'native'`, `round: 'auto-native-r38'`, `date: '2026-10-13'`,
  `winner: 'c'`, `no_winner: false`, `hardgate: {tsc:'12/12 pass', export:'12/12 pass',
  render:'12/12 pass', iframe:'12/12 pass'}`, `judges: {lens1:'c', lens2:'c', lens3:'b'}`,
  `refuted: null`, `variety: {theme:'light (RN fixed DNA)', accent:'indigo #4f46e5 (RN fixed DNA)',
  face:'system (RN fixed DNA)'}`.
- `vault/index.md` "세대 기록" updated with this run.
- Winner c and non-winners a/b remain registered in `screens.ts`/`screens.json`, committed to
  `evolve/dash`. Catalog promotion happens only at `/dash-falsify apply`, not here.
- No canon files modified. `native-deltas-provisional.jsonl` append-only. No commits to `main`.

## Session summary (both rounds)
This scheduled run executed 2 consecutive `/dash-evolve` invocations as requested, each
independently resolving `round-budget.mjs` to N=1 (PAGE_TYPES queue empty both times) and each
independently drawing `native` as its target (random, not forced — happened to repeat). Round 1
(`auto-native-r37`) produced winner c (Bundle Deal Builder) and surfaced a genuine process question
(Q65) about macro-layout convergence. Round 2 (`auto-native-r38`) read that question during its own
RETRIEVE, designed its GENERATE step as a direct experiment answering it, and produced winner c
(Return Shipping Label Generator) with an independent blind judge confirming the fix worked. Both
rounds: 12/12 hard-gate clean on first pass, no no-winner calls, no canon files touched, jsonl
append-only, no commits to main, all round commits pushed to `evolve/dash`.
