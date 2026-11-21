# auto-native-r39 — DECISION

## 0. Round framing
- Round 1 of a scheduled 2-round sequential `/dash-evolve 2` execution (unattended, top-level
  orchestrator session, `Agent` tool confirmed available before starting).
- `round-budget.mjs --explain 2` → `1\t미채움 0종 — N≥2 의 근거(커버리지)가 없다` (all 18 `PAGE_TYPES`
  filled). This execution therefore runs 1 round per `/dash-evolve` invocation; the scheduled "2
  consecutive rounds" requirement is satisfied by running the whole §0–7 playbook twice in sequence
  (this round, then `auto-native-r40`), per the skill's own consecutive-round section.
- Target draw: unfilled-type queue is empty → equal random draw among `[dash, landing, native]` landed
  on **native**. 2026-10-14 is a Wednesday, not Monday — no weekly native-cadence override in play.
- Round number: `auto-native-r39` (max existing native round + 1, from the ledger before this round).
- `reassign-queue.md` "대기 중" has no `target: native` entry.
- RETRIEVE also grepped `native/src/evolve/` for the three candidate domains (per Q63's recommended
  practice) before assignment — see §2.

## 0-0. Agent-tool / subagent-type deviation (self-disclosed)
No custom `designer`/`comparator` agent definitions exist in this sandbox, so `general-purpose` agents
stood in for both roles across 6 independent, blind invocations (3 designers, 3 judges). Independence
and blindness preserved — no agent was shown another candidate's files or another judge's reasoning.
`self_judged` is NOT set (judges and designers were distinct dispatches, not the orchestrator itself).

## 1. RETRIEVE
Read in full: `native/GENERATION.md` (all 8 sections), `native/src/tokens.ts`, `native/screens.ts` +
`native/screens.json` (58 existing domains), `vault/00-principles/curation-criteria.md` (full, incl.
tie-break rule and Q21/Q30 "assignment only blocks convergence at the assigned layer"),
`vault/00-principles/reassign-queue.md` (no native entry), `vault/00-principles/questions-queue.md`
Q63/Q64/Q65 (native-targeted, open), `vault/00-principles/native-deltas-provisional.jsonl` tail, last 5
native ledger entries (r34–r38) for macro-skeleton/band-mechanic saturation, and
`vault/20-catalog/ux-guidelines.catalog.md` Native/Mobile + Plat=both rows.
`grep -rliE "price match|vacation|two-factor|backup code" native/src/evolve/ native/src/` returned
zero hits before assignment — confirmed no existing precedent for any of the three chosen domains.

## 2. GENERATE
Per Q65's open finding (r38 supported the hypothesis that band-mechanic assignment alone does not
guarantee macro-layout variety — macro-layout must be assigned as its own axis), this round assigns
**domain + macro-layout + band-mechanic independently** for all three candidates, and deliberately
avoids the two most-recently-saturated band forms (destructive-confirm used r36/c, r38/c was
blocked-workflow) by spreading across three different mechanisms entirely:

| v | screen | macro-layout | band mechanic |
|---|---|---|---|
| a | Price Match Request | form (reason/evidence/note) + submission-history list, same screen, one `FlatList` | blocked-workflow 5-state gate (`SubmissionGateState`) |
| b | Vacation Mode | pure settings form — zero `FlatList`, zero lists of any kind | dirty-state derived-boolean save band (extends r16/b's "selection-count>0" principle to a snapshot-diff trigger) |
| c | Two-Factor Backup Codes | fixed 2-column wrapped grid of code cells — zero `FlatList` | destructive-confirm self-transforming band (global, one-shot, all-codes) |

Named-precedent anti-duplication instructions given to designers (not opened by them, principle-reuse
only): a vs `r34/a IdentityReverificationScreen.tsx` + `r36/a SellerPayoutHoldReviewScreen.tsx`
(blocked-workflow); c vs `r34/c CloseSellerAccountScreen.tsx` + `r36/c ReturnInspectionDecisionScreen.tsx`
(destructive-confirm). b has no exact macro-form precedent in this catalog.

Each designer completed a mandatory "브리프에 없던 것" self-report (`candidates/{a,b,c}.md`) — not
read by judges (blind).

Screen registration (`screens.ts`/`screens.json`, slugs `evolve-r39-{a,b,c}`) done centrally by the
orchestrator after all three candidates finished and render-check strings were verified literally
present via grep: a=`"Price Match Request"`, b=`"Vacation Mode"`, c=`"Two-Factor Backup Codes"`.

Source hash at freeze (before the registration/export fix below): `78977036af747741cc7c118bb3a8a520bbe5e6fb`.
Hash after the one-line fix (see §3): `377afe236c4565a1f0a2b0ea4a52685ff79bdd0f`. Verified unchanged
from that point through screenshot capture and judging — round is valid.

## 3. HARD GATE
Environment bootstrap required before any gate could run (not a skill step, an environment-specific
fix): `native/node_modules` did not exist — `native/` carries its own `package.json`, separate from
the repo root and `app/`, and had never been installed in this sandbox. Ran `npm install` inside
`native/`. Also set `PW_CHROMIUM_PATH`/`CHROME_PATH` to the sandbox's pre-installed Chromium
(`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`) since `playwright install` cannot reach
`cdn.playwright.dev` through this sandbox's network policy — both scripts already supported this via
`process.env.PW_CHROMIUM_PATH`, no script changes made.

`node scripts/gate.mjs --target native --screens evolve-r39-a evolve-r39-b evolve-r39-c`

**First pass**: global block, all 12/12 `blockedBy: tsc 실패` — single root cause, `evolve-r39-c`'s
`BackupCodesScreen.tsx` exported its component as a named export only; `screens.ts` imports it as
default. Per skill §3 `blockedBy` rule this is attributable to candidate c alone and consumed no
candidate's 1-fix budget (a/b were never themselves broken). Fix: added `export default
BackupCodesScreen;` (one line, no other change).

**Second pass**: 12/12 clean, `verdict.pass: true`, `violations: []`. Full table in `SCORES.md`.

## 3-1. Post-judgment refinement
Not applicable — winner (b) was flagged with zero rule violations by any lens.

## 4. JUDGE PANEL
Screenshots: `node`+Playwright at 390/768px for each candidate's idle render (all 6 files in
`shots/`), via per-candidate `expo export --platform web --clear` → `serve` → screenshot → kill,
run serially since `dist/` is overwritten per export. Candidate c's 3-phase band
(idle→confirming→justRegenerated) and candidate a's post-submit gate states were NOT screenshotted
(only each screen's default/idle render was) — all three judges were told this explicitly and
instructed to trace those states via source reading instead, which all three did and self-reported.

3 parallel blind `general-purpose` agents (lens roles substituted per §0-0), each given both
screenshots and full source for all three candidates, `GENERATION.md`+`tokens.ts`, the 58-screen
duplicate-avoidance list, and (for lens 1 and lens 3) the same mandatory named-comparison instructions
given to the designers. All three completed with full rankings, reasoning, `file:line` evidence, and
self-reported unchecked scope — no abstentions, no re-dispatch needed.

### Lens 1 — DNA / profile compliance
**Ranking: b > a > c.** No disqualifying violations in any candidate (clean tokens, determinism,
English-only, no emoji, correctly-scoped single live region in all three). b ranked first for the
cleanest match to GENERATION.md §3's "no band is a valid choice" doctrine — the band's container
renders `null` entirely when `hasUnsavedVacationChanges` is false, a structural consequence of the
derived-boolean rather than a separately-coded empty state. a ranked second, cleared on both named
comparisons (r34/a, r36/a) — no overlapping style-key or state-variable names, and correctly avoided
literally reusing the "scrollToIndex to next incomplete row" interaction both references share. c
ranked **last** on a real code-surface finding against the required r34/c comparison: matching style
key names (`confirmRow`, `confirmButton`/`confirmButtonPressed`), an identical handler name
(`handleCancel`), identical phase-string literals (`"idle"`/`"confirming"`) serving the same
structural role, and near-identical `accessibilityHint` phrasing templates. Lens 1 explicitly found
this **not disqualifying** (the underlying destructive-confirm-self-transform principle is the
objectively correct choice for this domain) but decisive enough to place c third — the exact
"right band form, duplicated code surface" anti-pattern GENERATION.md §3's 2026-09-12 entry warns
against.

### Lens 2 — mobile app completeness
**Ranking: a > c > b.** All three free of dead affordances and broken token references. a ranked
first for the fullest realized state space (traced the un-screenshotted `readyToSubmit`/
`requestConfirmed` states via source and confirmed they're real, not shortcut) and the most
domain-plausible varied dummy data (4 history records, distinct denial reasons, mixed evidence
types). c ranked second — its 3-phase band is equally real (codes array is genuinely replaced on
confirm, not a flag flip) and its non-interactive `CodeCell` a11y pattern was called out as a
thoughtful native idiom, but the screen has less surface area (no text inputs, no FlatList/
virtualization decision exercised). b ranked **last** specifically because its two "away date" rows
only cycle a fixed 6-item preset array rather than opening a real date picker — flagged as the
"shallowest interaction of the bunch," reading more like a placeholder/demo mechanic than a shipped
control, plus more unfilled vertical whitespace in both screenshots than a or c.

### Lens 3 — screen-type / archetype differentiation
**Ranking: b > c > a.** `grep -rliE "price match|vacation|two-factor|backup code"` confirmed zero
existing-catalog hits for all three domains before judging began; both named comparisons (a vs
r34/a+r36/a, c vs r34/c+r36/c) were cleared on real structural grounds, not asserted — a's gate is a
2-field global condition vs. the precedents' N-resolvable-row checklists (no `scrollToIndex`, no
per-row resolve anywhere in a); c's `justRegenerated` state loops back to idle via a "Done" button
(a repeatable action) where r34/c's terminal "closed" state has no reset (a true one-way terminal) —
a genuine behavioral difference despite the closest structural-shape proximity of the three
comparisons. b ranked first as "the boldest, cleanest break from the catalog's dominant FlatList+
bottom-band template" — a true zero-list settings screen with a snapshot-diff state technique not
reused anywhere else in the catalog. c ranked second: equally bold on macro-layout (the only
zero-FlatList, fixed-grid screen of the three) but sat structurally closer to its named precedent
than b sat to anything, even though it clears on inspection. a ranked third: clears its precedents on
real mechanics but its overall FlatList+`ListHeaderComponent`-form+bottom-band silhouette is the
single most-repeated macro shape in this catalog's blocked-workflow lineage.

### Aggregation
| lens | ranking | no-winner votes |
|---|---|---|
| lens1 (DNA) | b > a > c | none |
| lens2 (mobile completeness) | a > c > b | none |
| lens3 (differentiation) | b > c > a | none |

1st-place votes: **b×2** (lens1, lens3), a×1 (lens2). **Not** a complete 3-way tie (two lenses agree
on 1st) — majority applies directly, no tie-break-exception machinery needed. **Winner: b** (Vacation
Mode).

## 5. LEARN — isolated append
Extracted 1 new L1 delta from the reasoning that decided the winner (both lens1 and lens3 independently
cited the same mechanism as decisive): a pure state-snapshot-equality-derived boolean generalizes the
established "derived-boolean (not a manually-toggled flag) controls band presence" principle (first
established at `auto-native-r16/b`, selection-count>0) to non-list, pure-settings-form screens, using
a dirty-state/snapshot-diff trigger instead of a selection-count trigger — and, because the band's
presence is a direct render-time consequence of that boolean rather than a separately-coded empty
state, it also satisfies GENERATION.md §3's "no band is a valid choice" doctrine as a structural
side-effect rather than a second design decision. This is the first native round to use a
snapshot-diff (vs. a count) as the band-presence trigger, and the first to apply the derived-boolean
band principle on a screen with zero lists/FlatLists at all. Appended to
`vault/00-principles/native-deltas-provisional.jsonl` with `level: 'L1'`, `status: 'provisional'`,
`confidence: 'medium'` (extends an already 2+-round-reproduced principle to a new trigger/domain, but
this specific extension is itself only observed once).

## 6. 지식 정제 게이트
- Clustering: no conflicting delta pairs found against the existing provisional tail. No supersedes
  relationship — this is an extension of the r16/b principle, not a contradiction or a re-statement of
  it, so it stands as its own L1 entry rather than overwriting/superseding r16/b's original.
- No reproduction claim is made in this round's delta text, so no 2-round-reproduction verification was
  needed and none is claimed.
- No new `questions-queue.md` entry — lens1's c-vs-r34/c duplication finding reproduces (does not
  contradict) the already-L2 GENERATION.md §3 entry ("형태를 맞게 골라도 코드 표면까지 닮으면
  진다", 2026-09-12) rather than raising a new question; no action needed beyond this round's own
  ranking (c did not win, so §3-1 refinement does not apply to it).
- Q65 note (not a formal update, informational): this round's independent macro-layout assignment
  (one FlatList-based, one zero-list settings form, one zero-FlatList grid) again produced real
  structural variety confirmed by lens3 — a third data point alongside r37 (problem) and r38
  (solution), though from a different orchestrator session than r38's, which is the independent
  replication Q65 was waiting on. Left as informational here rather than editing Q65 directly, since
  this round was not designed as a deliberate repeat of r38's exact intervention.

## 7. 기록 + 커밋
- `auto-ledger.jsonl` entry appended: `target: 'native'`, `round: 'auto-native-r39'`,
  `date: '2026-10-14'`, `winner: 'b'`, `no_winner: false`, `hardgate: {tsc: '12/12 pass (1-line fix,
  blockedBy, no candidate 1-fix consumed)', export: '12/12 pass', render: '12/12 pass', iframe: '12/12
  pass'}`, `judges: {lens1: 'b', lens2: 'a', lens3: 'b'}`, `refuted: null`, `variety: {theme: 'light
  (RN fixed DNA)', accent: 'indigo #4f46e5 (RN fixed DNA)', face: 'system (RN fixed DNA)'}`.
- `vault/index.md` "세대 기록" updated with this run.
- Canon unchanged throughout (`dash-brief-v3`/`design-principles`/`page-brief-core`/
  `native/GENERATION.md`/`tokens.ts` all untouched — append-only jsonl additions only, no
  `questions-queue.md` edit this round).
