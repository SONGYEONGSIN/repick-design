# auto-native-r40 — DECISION

## 0. Round framing
- This is round 1 of a scheduled, unattended 2-round `/dash-evolve 2` execution on `evolve/dash`
  (top-level orchestrator session, no human watching live — this is a scheduled/automated run).
- `node scripts/round-budget.mjs --explain 2` → `1\t미채움 0종 — N≥2 의 근거(커버리지)가 없다` — all 18
  `PAGE_TYPES` are filled, so this execution runs **only 1 round**, not 2, per the skill's own
  authoritative budget script (`scripts/round-budget.mjs`). The scheduling prompt's "2 consecutive
  rounds" expectation is therefore **not met this run** — this is the documented, intended behavior
  when the unfilled-type queue is empty (§0-0-1 of the skill: "호출자가 2 이상을 줬어도 스크립트가 1 을
  내면 1라운드만 돌고 그 사실을 DECISION 첫 절에 적는다").
- **Native weekly-cadence override applies**: 2026-10-19 is a Monday (`new Date().getUTCDay() === 1`),
  and per the skill's §0 native-cadence rule, when `N=1` the day's single round is forced to `native`
  (the unfilled-queue-priority logic would otherwise never pick native, since `mobile` is already in
  the catalog). So this round's target is **native**, not drawn from the unfilled-type queue.
- Round number: `auto-native-r40` (max existing native round in `auto-ledger.jsonl` was r39, +1).
- `reassign-queue.md` "대기 중" had no `target: native` entry at RETRIEVE time (queue was empty, #15
  had just been consumed by `auto-dash-r42`).
- `Agent` tool confirmed available before starting (checked per skill §0-0 — required precondition
  for a valid, non-self-judged round).

## 0-0. Agent-tool / subagent-type deviation (self-disclosed)
No custom `designer`/`comparator` agent definitions exist in this sandbox's `~/.claude/agents/`, so
`general-purpose` agents stood in for both roles across 6 independent dispatches (3 designers, 3
judges). Independence and blindness were preserved throughout: each designer worked in an isolated
folder and was explicitly told not to open the other two candidates' files; each judge was given the
same 6 screenshots + source folders but no visibility into the other judges' reasoning, and dispatched
in parallel as three separate background agents. `self_judged` is NOT set — designers and judges were
distinct dispatches from the orchestrator, not the orchestrator judging its own output.

## 0-1. Environment bootstrap (session-specific, not a skill/canon change)
This sandbox had not previously run this skill, so two one-time environment gaps surfaced and were
fixed (documented in full in `SCORES.md`, repeated briefly here since they affected round timing):
1. `native/` had never had `npm install` run — no `node_modules` at all. This made the first hard-gate
   attempt fail all 3 candidates' `tsc` step with a cascading `TS17004`/`TS7031`/etc. avalanche
   rooted in a **pre-existing, unrelated file** (`native/src/auction/LiveAuctionScreen.tsx`), not
   anything in r40's candidates. Fixed with `cd native && npm install`.
2. This sandbox's pre-installed Playwright Chromium revision (1194, at `/opt/pw-browsers/chromium`)
   does not match what `playwright@^1.61.1` expects to find by default (revision 1228), so
   `chromium.launch()` failed with "Executable doesn't exist" until `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`
   was exported before invoking `gate.mjs`/`validate.sh` (already-supported via
   `executablePath: process.env.PW_CHROMIUM_PATH || undefined` in `native/scripts/validate.sh` — no
   script changes were needed, just the env var at invocation time). The same env var was used for an
   ad hoc orchestrator-only screenshot-capture script (not a repo file) for the same reason, since the
   `npx playwright screenshot` CLI has no equivalent override flag.
Neither fix touched any canon, script, or candidate code — both are one-time sandbox setup steps.

## 1. RETRIEVE
Read in full: `native/GENERATION.md` (all 8 sections), `native/src/tokens.ts`,
`vault/20-catalog/ux-guidelines.catalog.md` (Native/Mobile section + Plat=both rows),
`vault/00-principles/curation-criteria.md` (full — tie-break rule, L2 checklist, Q6/Q21 reapplication
doctrine), `vault/00-principles/reassign-queue.md` (empty for native), `vault/00-principles/questions-queue.md`
(Q63/Q64/Q65, native-targeted, open), `vault/00-principles/native-deltas-provisional.jsonl` (all 63
entries), and the last ~6 native ledger entries (r34–r39) for macro-skeleton/band-mechanic saturation.
Per Q63's recommended fix (avoid the "only check recent ledger entries" gap that caused r34/b to
near-duplicate the unpromoted r29/c), also grepped the **full** `native/src/evolve/` archive (not just
recent rounds) and `native/screens.json`'s 76 pre-existing check-strings for keyword collisions against
3 candidate domain ideas before committing to an assignment — this ruled out "blocked/muted accounts"
(already used twice, `r27/b` and `r27/c`) and confirmed no prior "compare two items side by side",
"reorder/drag/priority-order", "nearby/map-view toggle", or "offer countdown/extend" screen exists.

**Macro-bucket/band-mechanic saturation check (r34–r39, 6 rounds × 3 = 18 candidates)**: blocked-workflow
state-machine band used 3×(r36a, r38c, r39a) and destructive-confirm self-transform band used 3×
(r34c, r36c, r39c) — both explicitly avoided this round. Selection-driven contextual bar (r35a, r37c)
and persistent-always-visible-action-bar (r35c, r23a, r12c lineage) are less recently saturated.

## 2. GENERATE — 3 parallel designers, band-mechanic + macro-layout explicitly assigned
Per the r37/r38 delta chain ("assigning band mechanics alone does not guarantee macro-layout variety
— must also explicitly assign distinct macro-layouts"), each candidate was given both a distinct
band-mechanic assignment AND a distinct macro-layout shape:

- **a — "Offer Status"** (buyer, single pending offer vs. a listing's asking price): hero stat card
  (offered/asking amounts + fixed-date-derived countdown) + history `FlatList` of past offers +
  **persistent always-visible band with a one-time-use "Extend 24 Hours" action** (permanently
  disables with a visible explanation after first use — a new sub-form, not seen before: neither the
  blocked-workflow state machine nor the destructive-confirm-transform forms it was told to avoid).
- **b — "Return Drop-off Points"** (buyer, post-return-approval physical drop-off location): **no
  fixed band at all** (pure non-destructive browse) + a real List/Map segmented view-mode toggle
  sharing one `selectedSiteId` state, where Map is a deliberately abstract/schematic pin-canvas (no
  real map library — this sandbox cannot reliably render one via Expo Web export, and there's no
  network access to add a new native dependency, so designer was explicitly told to build an abstract
  canvas instead).
- **c — "Payout Method Order"** (seller, reorders 3 linked payout methods via Move Up/Down buttons):
  **dirty-state-derived band** (mounts only while `workingSequence` structurally differs from the
  saved snapshot; Save/Reset both collapse it) — an explicit, instructed reapplication of the
  principle `auto-native-r39/b` established in a different domain (a vacation-mode settings toggle),
  with the designer told NOT to look at r39/b's code, only to reimplement the generalized principle
  with fresh naming.

All 3 designers reported full completion (code + `data.ts` + registration in `screens.ts`/`screens.json`
+ a `candidates/<v>.md` concept note with an honest "브리프에 없던 것" gap report). Two of three hit a
benign concurrent-edit race on `screens.ts`/`screens.json` (all three agents edit the same two files)
and self-resolved it correctly by re-reading the live file before each write — no entries were
clobbered, verified by the orchestrator after all three reported done (`python3 -c "json.load(...)"` on
`screens.json` confirmed all 3 of `evolve-r40-{a,b,c}` present with correct `check` strings; `screens.ts`
tail showed all 3 `COMPONENTS[...]` assignments present).

**Freeze hash** (computed after all 3 designers confirmed completion, before gating):
`cat native/src/evolve/r40/*/*.tsx native/src/evolve/r40/*/*.ts | shasum` →
`11fe064a8e103968dab135f654dfa8ebc2cc7c3b`. This hash did not change between freeze and judging.

## 3. HARD GATE
`node scripts/gate.mjs --target native --screens evolve-r40-a evolve-r40-b evolve-r40-c` (after the
two environment fixes in §0-1): **12/12 pass on the first attempt — zero 1-fix loops, zero candidates
dropped.** Full table in `SCORES.md`.

## 4. JUDGE — 3-lens blind panel
Screenshots: 390px + 768px Expo-Web renders per candidate (6 total), all visually spot-checked
non-blank by the orchestrator before dispatch (file sizes 40–66KB, confirmed real rendered content via
direct image read, not just a size heuristic). 3 independent `general-purpose` agents, each given the
same 6 screenshots + the 3 candidates' source folders, dispatched in parallel, blind to each other.

**Lens1 (DNA/`GENERATION.md` compliance)**: ranking **c > a > b**. Zero violations found in c or a.
**Two concrete, citable violations found in b**: (1) `ReturnDropoffScreen.tsx:162` uses a plain
`.map()` to render `CanvasPin` elements over the same site list that's rendered via `FlatList`
elsewhere in the same file — a direct RN-idiom violation of "lists → `FlatList`, not `.map()`". (2)
`SiteDetailPanel.tsx:18,66-71` + `ReturnDropoffScreen.tsx:62-66` — the "Get Directions" button sets
local state to show the visible text "Directions copied." but no `Clipboard`/`Linking` API call ever
executes; the `accessibilityHint` is technically accurate about the (fake) local behavior, but the
**visible on-screen copy** still asserts a real action to sighted users that never happens — flagged
as exactly the "no-op with copy claiming it does something" violation `GENERATION.md` §3 prohibits.

**Lens2 (mobile-app completeness)**: ranking **c > a > b**. Found the same "Get Directions" issue
independently (converging with lens1 without any shared visibility), citing it as the one genuine
dead/deceptive affordance across all three candidates, and ranked c highest for the richest, most
granular live-region wiring (distinct per-move announcements, not just a generic "order changed").
a's only noted gap: no `ListEmptyComponent` on the history `FlatList` (a real but minor zero-state
omission). b's abstract-map choice was explicitly NOT held against it, since it's honestly captioned
("Schematic layout, not to scale") and reflects the documented sandbox constraint (no map library).

**Lens3 (screen-type differentiation)**: ranking **b > c > a**. Ran the mandatory named side-by-side
comparisons: confirmed c's dirty-state band is a correct, non-duplicative reapplication of
`auto-native-r39/b`'s principle (fresh helper/variable names: `sequencesHoldSameOrder`/
`workingSequenceDivergesFromSaved` vs. `vacationSnapshotsEqual`/`hasUnsavedVacationChanges`, no
literal overlap); confirmed a is not a reskin of the existing `OfferThread.tsx` (no composer, no
multi-step negotiation state machine) but found a's macro-layout (hero card → section heading →
history FlatList → persistent bar) structurally close to `ListingBoostCreditsScreen.tsx` (r35/c) —
including an incidental shared style-key name, `heroCard`, in both files (flagged as "incidental
convention reuse", explicitly NOT literal duplication, since the actual styling/content differ); ranked
b highest because its List/Map toggle **swaps the macro-layout shape itself** (FlatList accordion vs.
a free-form absolutely-positioned pin canvas), which — checked against the two named no-band browse
precedents (`HelpCenterScreen.tsx`, `SellerFeeCommissionStatementScreen.tsx`) — only ever toggle *what
data fills one fixed shape*, never the shape itself. Lens3 explicitly did not weigh b's two compliance
violations (out of scope for this lens) and self-disclosed not reading the 768px shots or exhaustively
grepping the full 39-round history for `heroCard`/snapshot-equality naming beyond the named comparison
files.

**Aggregate**: 1st-place votes — c: 2 (lens1, lens2), b: 1 (lens3). **Clean 2:1 majority for c, not a
3-way tie** — the `curation-criteria` tie-break rule (lens1-pick-excluded-by-lens3) does not apply,
since this isn't a complete tie. **No no-winner votes from any lens.**

**Winner: c — "Payout Method Order".**

## 3-1. Post-judgment fix
**None needed.** The winner (c) was found clean by all 3 lenses — zero rule violations, zero
duplication findings. No §3-1 correction was applied; the promoted source is identical to what was
judged (freeze hash unchanged throughout: `11fe064a8e103968dab135f654dfa8ebc2cc7c3b`).

## Reassign-queue note for b (not added to the queue file this round)
b was **not** dropped at the hard gate (12/12 clean) — it lost at the judge panel, but 2 of 3 lenses
(the two that weigh rule compliance) independently found the SAME concrete, fixable violation (the
dishonest "Get Directions"/"Directions copied" no-op) as a significant reason for ranking it last,
while the lens that ignores compliance (lens3) ranked its underlying **form** (List/Map toggle +
abstract pin canvas) as the single most novel contribution of the round. This resembles the
`reassign-queue.md` pattern ("탈락 사유가 형태가 아니라 규칙 위반"), but per that file's own stated
protocol, entries are added at `/dash-falsify apply` time (when a human-reviewed weekly falsification
decides not to keep a candidate), not directly by `/dash-evolve` — so no entry was added to
`reassign-queue.md` this round; this paragraph is the record for that future review to draw on. If b
is revisited, the concrete fixes needed are: replace the `.map()`-over-`CanvasPin` idiom with a
FlatList-compatible approach or an explicitly justified exception, and either wire a real
`Clipboard`/`Linking` action for "Get Directions" or change the visible copy to not claim an action
that doesn't happen.

## 5. LEARN
One delta appended to `vault/00-principles/native-deltas-provisional.jsonl` (see next section) —
the dirty-state-derived-band principle's second, independent confirmation (reorder-list domain),
which is also the input to this round's refinement-gate L2 promotion below.

## 6. Refinement gate
- **L2 promotion**: `auto-native-r39/b`'s L1 delta ("pure state-snapshot-equality-derived boolean
  generalizes the derived-boolean band-presence principle") is promoted to L2 this round, `supersedes:
  'auto-native-r39/b'`. Justification: this is now independently reproduced in a **second round, in a
  genuinely different domain** (list reordering vs. a settings on/off toggle), with **zero literal
  code-surface overlap** (confirmed by lens1's and lens3's independent, explicit side-by-side checks
  against `VacationModeScreen.tsx` — different helper names, different state names, different
  secondary behavior). This meets `curation-criteria`'s L2 bar ("2개 라운드 이상 재현") cleanly — the
  delta was a judgment-dependent one (lens3 had to independently verify non-duplication), not a
  mechanically-verified one, so the 2-round threshold (rather than a same-round mechanical check) is
  the right bar here, and it is now met.
- **New questions-queue entry (Q69)**: lens1's `.map()`-vs-`FlatList` finding on b surfaces a real
  tension in `GENERATION.md` §1's literal text — "lists → `FlatList`, not `.map()`" was written for
  virtualized, scrollable lists, but b's `CanvasPin` elements are a small (6-item), fixed,
  non-scrolling set that must be absolutely positioned via per-item `top`/`left` percentages for the
  schematic-map effect — a layout `FlatList` cannot produce (it only renders a single-axis scrolling
  list). Is a small, fixed-size, absolutely-positioned overlay (map pins, badge clusters, etc.) a
  legitimate, named exception to the `.map()` prohibition, or should `GENERATION.md` be more precise
  about what counts as a "list" for this rule's purposes? Filed as open, target: native, background:
  this round's b/CanvasPin.tsx:162 finding + the rule's literal text in GENERATION.md §1.
- No conflicting delta pairs found this round. No cross-target conflicts found (nothing in this
  round's delta touches dash/landing canon).

## 7. Record + commit
- `auto-ledger.jsonl` entry appended: target=native, round=auto-native-r40, winner=c, no_winner=false,
  hardgate={tsc,export,render,iframe: all "a/b/c 전원 1차 통과"}, judges={lens1:c, lens2:c, lens3:b},
  variety={theme:"light (RN 고정 DNA)", accent:"indigo #4f46e5 (RN 고정 DNA)", face:"system (RN 고정 DNA)"}
  (native's theme/accent/face are fixed DNA, not a free variety axis — same convention as every prior
  native ledger entry).
- `vault/index.md` "세대 기록" section updated with this run.
- `reassign-queue.md` **not** touched this round (see note above — that file's entries are added at
  `/dash-falsify apply` time, not by `/dash-evolve`; b's case is recorded in this DECISION for that
  future review instead).
- `native-deltas-provisional.jsonl`: 1 new L1 entry (this round's observation) + 1 new L2 entry
  (promoting r39/b, `supersedes: 'auto-native-r39/b'`).
- `questions-queue.md`: Q69 added (대기 중).
- Canon unchanged throughout: `native/GENERATION.md` and `native/src/tokens.ts` both untouched —
  append-only jsonl + one questions-queue entry only.
- This completes the scheduled run's only round (round-budget.mjs forced N=1; see §0). The scheduled
  "2 consecutive rounds" request is not satisfied this execution — documented per skill §0-0-1.
