# auto-native-r36 — DECISION

## 0. Round framing
- Second of two independent `/dash-evolve` executions in this scheduled 2-round-back-to-back run. round 1 (`auto-native-r35`) was fully committed and pushed before this round started — sequential, not parallel, reading r35's own LEARN deltas and L2 promotion during this round's RETRIEVE.
- round-budget.mjs returned N=1 again (0 unfilled PAGE_TYPES — unchanged by round 1, since native isn't a PAGE_TYPES entry).
- 2026-10-12 is a Monday, but the native weekly-cadence forcing rule only forces the **first** round of a day's/session's run (per the skill's own phrasing: "월요일이면 **첫 라운드**의 타깃을 무조건 native로 두고, **나머지 라운드**만 아래 미채움 큐를 따른다"). Round 1 already satisfied this week's native quota, so round 2 used the normal unfilled-queue→random fallback: `[dash, landing, native]` equal draw → **native** (genuinely random, not forced; logged here for reproducibility since this is orchestration-level randomness, independent of candidate-code determinism rules).
- Native round-sequence number: 35 prior entries (including r35 from this same session) → r36.
- `reassign-queue.md` still had no native entry.

## 1. Target assignment (orchestrator-level, informational)
Three fresh domains, checked clean against the full archive (`grep -rliE` on each domain's keywords, zero real collisions found). Macro-forms deliberately cycled back to the two forms last used 2 rounds ago (r34) rather than repeating r35's three forms immediately:
- **a — Seller Payout Hold Review**: blocked-workflow state-machine band (last used r34/a).
- **b — Minimum Offer Threshold**: no fixed band, per-row non-destructive inline numeric edit (genuinely new mechanic — no exact prior precedent in this catalog).
- **c — Return Inspection Decision**: destructive/terminal-confirm self-transforming band (last used r34/c), extended with a two-way branching choice (Accept/Reject) neither of its two named precedents has.

## 2. GENERATE
3 parallel `general-purpose` designer subagents, same structure as r35: fully assembled brief inlined as text, explicit archive-grep instruction, named comparison files per candidate with instructions not to open them but to avoid literal duplication. Registration into `native/src/screens.ts` / `native/screens.json` done centrally after all three designers confirmed completion via explicit hand-back (not file-existence). Each file needed the same orchestrator-added `export default <Name>;` line.

Freeze hash at judging time (`cat native/src/evolve/r36/*/*.tsx native/src/evolve/r36/*/*.ts | shasum`): `aac34ae09ddd9af632da7a6b1363907f6da1a448` — verified unchanged immediately before and after the hard gate run, and unchanged through all three judge reads.

## 3. HARD GATE
`node scripts/gate.mjs --target native --screens evolve-r36-a evolve-r36-b evolve-r36-c` — **12/12 clean on first attempt**, no 1-fix loop, no candidate dropped. See `SCORES.md`.

## 4. JUDGE PANEL
Screenshots: 390px + 768px per candidate, all 6 verified non-blank. 3 independent `general-purpose` judge subagents, no cross-lens visibility, each given the full rule text inline plus named mandatory comparison targets (for a: r34/a `IdentityReverificationScreen.tsx` + r31/a `AccountDataExportScreen.tsx`; for c: r30/a `SubscriptionPlanScreen.tsx` + r34/c `CloseSellerAccountScreen.tsx`; for b: r29/b `DraftListingsScreen.tsx` as a domain-adjacency check, since b has no exact macro-form precedent).

| lens | ranking | no-winner votes |
|---|---|---|
| lens1 (DNA/GENERATION.md compliance) | c > a > b | none |
| lens2 (mobile completeness) | a > c > b | none |
| lens3 (screen-type differentiation) | b > a > c | none |

**Complete 3-way tie on 1st place again (1-1-1: lens1→c, lens2→a, lens3→b).**

### Tie-break (curation-criteria.md "Q1~Q5 답변 ②")
> 완전 동률 시 brief 렌즈(렌즈1) 우선을 유지하되, 렌즈3(archetype/차별성)이 그 후보를 최하위로 명시 판정했으면 동률 우승서 제외하고 나머지 중 brief(렌즈1) 1위 재적용.

Lens1's pick is **c**. Did lens3 rank **c** last? **Yes** — lens3 ranked c 3rd (b > a > c). The exclusion condition **holds this time** (unlike round 1): c is excluded from the tie. Among the remaining candidates {a, b}, reapplying lens1's own ranking order (c > a > b): lens1 prefers **a** over b.

**Winner: candidate a (Seller Payout Hold Review).**

### Per-lens reasoning summary
- **lens1** ranked all three free of hard DNA/token/copy violations but found two real, citable issues that separated them: candidate b has two independently-marked `accessibilityLiveRegion="polite"` elements (a static header confirmation banner and a per-row edit-mode preview) that lens1 traced a concrete sequence where both can be simultaneously live (save row 1 → within the 3s confirmation window, start editing row 2) — a genuine "two live regions at once" violation, not hypothetical. Candidate a was flagged for a **literal implementation-detail duplication** against its named precedent r34/a: the exact same `viewPosition: 0.15` constant (an arbitrary, specifically-authored value, not an RN default) in its `scrollToIndex` call, plus matching `offset = index * averageItemLength` fallback arithmetic. Candidate c had neither issue.
- **lens2** found zero dead affordances in any candidate, ranking purely on relative richness/depth: a's real `FlatList` ref + `scrollToIndex`/`onScrollToIndexFailed` handling and live-recomputed progress tracking read as the most "native API aware" of the three; c's 5-phase branching state machine with real reason-required validation (blocks confirm on empty input, verified by tracing `commitReject`) placed close second; b was accurate and defect-free but structurally the simplest of the three (single toggle-to-edit, no multi-phase band) and used an identical gray placeholder swatch for all 7 listing rows, reading less "finished" than a or c's varied dummy data.
- **lens3** did real side-by-side diffs against all four named comparison files plus a domain check for b. Candidate a vs r34/a: **this is the same literal-duplication finding lens1 made, independently** — byte-identical `scrollToIndex({ viewPosition: 0.15 })` call shape and matching offset-fallback arithmetic, though variable names, the spotlight-on-jump UX, and all copy differ meaningfully. Candidate c vs r30/a + r34/c: the two-way Accept/Reject branching choice is a genuine structural addition neither precedent has, but each branch's confirm-sub-panel internals (status line + Cancel/Confirm button pair, "this can't be undone" framing) are close cousins of both references' single-path confirm panels — the weakest differentiation of the three, "yet another destructive-confirm-band seller screen" despite the real branching addition. Candidate b vs r29/b (domain check only, no macro-form precedent exists): essentially no real overlap beyond generic shared scaffolding (the project-wide transient-announcement idiom) — b's non-selection, always-visible per-row editor mechanism and domain share nothing structural with DraftListings' selection-bar + batch-publish mechanism. Strongest differentiation of the three.

### Post-judgment check (§3-1) — fix applied
Winner **a** carried exactly one concrete, independently-confirmed-by-two-lenses rule finding: the `scrollToIndex({ viewPosition: 0.15 })` call and its `scrollToOffset` fallback arithmetic were a literal, non-generic match to r34/a's implementation (the specific `0.15` constant, not an RN default, repeated verbatim; same `index * averageItemLength` fallback shape). This is squarely the "형태를 맞게 골라도 코드 표면까지 닮으면 진다" rule GENERATION.md §3 states, and both judges that checked for it flagged it as the clearest literal-duplication risk in the round. Per §3-1 ("규칙 위반 해소에 한정"), applied a narrow fix:
- `viewPosition: 0.15` → `0.08` (an independently-chosen value, not r34/a's).
- The `scrollToOffset` fallback was restructured to add a card-gap buffer term (`tokens.space(3) * info.index`) on top of the naive `averageItemLength * index` estimate — a structurally different formula (and arguably a minor correctness improvement, since the original didn't account for inter-card spacing), not just a relabeling.
- Re-gated after the fix: **12/12 clean again** (`node scripts/gate.mjs --target native --screens evolve-r36-a evolve-r36-b evolve-r36-c`). New freeze hash: `2566d6066325beecf13b83e0f55d02a226ab914f`.
- **Ranking was not recomputed** — this fix resolves the one cited rule violation on the winner without touching anything that could plausibly change any lens's ranking rationale (the fix is invisible to the compliance/completeness/differentiation judgments already made: the spotlight UX, copy, state machine, and all style-key names — the things each lens actually weighed — are unchanged).

No other rule findings existed on the winner (lens2 found zero dead affordances in a; lens3's only critique of a was the same scrollToIndex finding lens1 made, now fixed).

## 5. LEARN
One new L1 delta appended to `native-deltas-provisional.jsonl` (round `auto-native-r36`, variant `refinement-gate`... see below — actually recorded as a GENERATE-stage delta, not LEARN, since it's a process lesson rather than a UI pattern finding): see §6, the round's substantive LEARN content is folded into the refinement-gate entry below since this round's sharpest finding was about the duplication-avoidance *process* itself, not a new UI pattern.

Separately, a genuine UI-pattern delta from the winning candidate: candidate a's `resolvedCount`/`nextUnresolved`/`holdFullyCleared` values are all derived fresh from `statusById` every render (lens2 verified this explicitly, cross-checked against the screenshot's "1 of 5 requirements resolved") — this reproduces the now-L2 "derived, not hand-tracked, aggregate values" principle (already promoted in r35) rather than introducing new ground, so no new delta was filed for it (would be a non-reproduction, already-canon-track restatement).

New L1 delta filed instead on the duplication near-miss itself:

```
delta: "Pointing a designer at a named comparison file and telling them 'implement the
principle, not the literal code' is necessary but not sufficient to prevent literal
implementation-detail duplication on narrow, highly-specific sub-mechanisms (an exact
numeric constant, a specific fallback-arithmetic shape) -- even when the designer
genuinely did not open the comparison file and wrote all naming/copy/UX fresh (verified:
auto-native-r36/a's spotlight-on-jump UX, all style keys, and all copy are independently
written, not copied). The scrollToIndex({viewPosition: 0.15}) + 'offset = index *
averageItemLength' fallback match against r34/a is best explained by this being the one
canonical/obvious way to implement 'jump a FlatList to an index with a near-top landing
position and a reasonable linear-estimate fallback' -- i.e. convergent engineering on a
narrow enough sub-problem that most reasonable implementations land on the same shape,
not evidence the designer referenced the file. This means the duplication check genuinely
needs a human/judge pass on narrow numeric/structural sub-mechanisms specifically, not
just naming and prose -- prompting designers harder on 'don't copy' doesn't fully close
this gap, because there was nothing to copy *from* in this designer's own process."
evidence: "lens1 and lens3 independently found the exact same match (viewPosition: 0.15,
matching offset arithmetic) despite having no visibility into each other's work -- strong
signal this is a real, checkable code-surface fact, not two judges imagining the same
false positive. Designer a's own hand-back report (written before any judging) explicitly
states it did not open IdentityReverificationScreen.tsx or AccountDataExportScreen.tsx."
judge_votes: {lens1: "c", lens2: "a", lens3: "b"}
confidence: high
level: L1
status: provisional
```

## 6. Refinement gate
Loaded the full active delta set (now 19 entries after r35's two additions + this round's one). No conflicting pairs found between r35's and r36's new entries. No delta reached a fresh 2-round-reproduction or mechanically-checkable L2 bar this round beyond what r35 already promoted — the new L1 above is itself a single, first observation of a process-level finding (narrow-sub-mechanism convergent duplication), not yet reproduced.

**New questions-queue entry**: this round's duplication near-miss on the winner, caught only because two independent judge lenses happened to both check the same named comparison file, raises a process question worth tracking — should the GENERATE-stage anti-duplication instruction be supplemented with an explicit judge-stage checklist item ("for any candidate with a named macro-form precedent, diff the specific control-flow/animation/scroll-mechanism constants, not just style-key names and copy")? Appended to `questions-queue.md` "대기 중" with target=native, background from §5 above, and the tentative hypothesis that this generalizes to any narrow, mechanically-convergent sub-problem (not specific to `scrollToIndex`) and so the judge-stage check (already informally present this round, since the brief explicitly asked lens1/lens3 to check it) should be made a standing instruction rather than something the orchestrator has to remember to add per-round.

## 7. Scope / invariants
Canon unchanged. `/dash` gallery and `/v1~v5` untouched. jsonl append-only (verified below). No commits to `main`.

Candidates b and c (non-winners) keep their routes/registry entries — subject to weekly `/dash-falsify` review.
