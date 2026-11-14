# auto-native-r56 — DECISION

**Round budget deviation (recorded first, per SKILL.md §0-0-1):** the scheduled prompt asked for N=2 consecutive rounds. `node scripts/round-budget.mjs --explain 2` returned `1  미채움 0종 — N≥2 의 근거(커버리지)가 없다` — all 18 `PAGE_TYPES` in `app/src/lib/works.ts` are already filled, so the coverage rationale for N≥2 does not apply. Per the skill, this means **only 1 round runs**, and that fact is recorded here rather than silently running 2. This matches established disposition for this exact scheduled prompt in recent runs (see `auto-native-r55`'s ledger entry, and the `r44/r48/r49/r51-r54` precedent cited there).

**Target**: `native/src/lib/works.ts` has 0 unfilled `PAGE_TYPES`, and today (2026-11-14, UTC Saturday) is not the native-day-anchor Monday, so target selection fell to the dash/landing/native equal-random draw per SKILL.md §0 — result: **native**.

**Round number**: `auto-native-r56` (max prior native round in `auto-ledger.jsonl` was r55).

## Candidates

| v | domain | macro-layout | band mechanic |
|---|---|---|---|
| a | Schedule a local meetup (buyer/seller hand-off) | day×time 2D grid + short fixed location list | blocked-workflow band, 2 independent conditions, deterministic jump tie-break |
| b | Price drop alert settings | pure settings form, no list | dirty-state-vs-saved-snapshot derived band |
| c | Seller tier progress & badges | hero progress meter + FlatList of milestones w/ working filter | persistent always-visible action bar, one real one-time action |

All three were explicitly assigned distinct domain + macro-layout + band-mechanic triangulation by the orchestrator before GENERATE, per the macro-bucket/variety-forcing lesson from `auto-native-r37`/`r38`.

## Hard gate

Freeze hash: `50dd23cfcbcb2724a2bdd0c282b5d009212c22f4` (`cat native/src/evolve/r56/*/*.tsx native/src/evolve/r56/*/*.ts | shasum`).

First gate attempt failed with 7376 cascading `tsc` errors, 100% attributable to `native/node_modules` never having been installed in this session (the scheduled-task bootstrap instructions only covered root + `app/`, not `native/`) — not caused by any candidate. Ran `npm install` in `native/`, confirmed `tsc --noEmit` clean project-wide, then re-ran the gate. **12/12 clean on the real attempt, no 1-fix needed for any candidate.** Full detail: `SCORES.md`.

## Judge panel (3 blind lenses, native table: lens1=DNA/a11y compliance, lens2=mobile completeness, lens3=screen-type differentiation)

### Lens 1 (DNA/accessibility) — ranking: **c > a > b**
All three clean on tokens/RN-idioms/determinism/English-only. Decided by the 8-point accessibility doctrine plus an architecture-duplication check lens1 ran on its own initiative:
- **c**: clean on every doctrine point (band validity, single live region, fresh derivation, expand/collapse a11y pairing). No duplication found against r45/c, r48/b.
- **a**: fully doctrine-compliant, but crosses into **literal cloning** against `r53/a/BoothRegistrationGateScreen.tsx` — `focusOn` is a byte-identical function body to r53/a's `focusNode` (renamed only); `bandFinalizedRow`/`bandFinalizedText` are byte-identical style objects (renamed only); `confirmButton`/`confirmButtonPressed`/`confirmButtonText` match r53/a **in both name and value** (not even renamed); `band`/`safe`/`scroll`/`scrollContent` match almost verbatim.
- **b**: one accessibility-doctrine shortfall (its "dirty-blocked" band explains why but has no jump-to-blocking-control action — a partial, not worst-case, violation of rule 1a). Plus **more severe cloning than a**: `bandButton`/`bandButtonGhost`/`bandButtonSolid`/`bandButtonPressed`/`bandButtonGhostText`/`bandButtonSolidText` are byte-identical (name AND value) to `r39/b/VacationModeScreen.tsx`'s band styles; `dirtyBand`/`confirmationBand` etc. likewise; the `draftMatchesBaseline` helper mirrors r39/b's `vacationSnapshotsEqual` in role/shape.

### Lens 2 (mobile polish) — ranking: **a > b > c**
All three avoid the worst "decorative CTA" anti-pattern. Hand-traced logic in each:
- **a**: bug-free in every traced path (`getMissingPick`/`jumpTargetFor`/`finalizeHandoff` all correct against `data.ts`), best touch targets (60×60 grid cells, 44pt everything else).
- **b**: correct clamping/dirty-comparison logic, but a real quality nit — `LAST_SAVED_AT_LABEL` stays frozen/stale after a successful Save (two sources of truth disagree).
- **c**: a real **correctness bug** on the single most prominent stat — the hero caption "134 of 250 sales toward Veteran" mixes a *relative* count (134 = sales since entering current tier) with an *absolute* threshold (250), producing an internally-inconsistent number that contradicts the milestone list's own correct phrasing of the same fact ("184 of 250 sales — 66 more sales to unlock").
Noted and explicitly not held against any candidate: b's `Switch` toggles render with a greenish thumb in screenshots despite `trackColor`/`thumbColor` being correctly wired to tokens — a react-native-web rendering quirk in this headless-Chromium environment, not a code defect.

### Lens 3 (screen-type differentiation) — ranking: **a > c > b**
Ran the mandated full-file neighbor reads plus independent catalog greps:
- **a**: macro-layout (day×time grid + fixed spot list) is genuinely novel against both mandated neighbors (r43/b, r53/a — neither uses a grid). Confirms the same `focusOn`/`jumpToMissingControl` vs r53/a's `focusNode`/`handleReviewPress` overlap lens1 found (same `scrollTo` + hardcoded `setTimeout(..., 350)` + `AccessibilityInfo` shape), calling it a "minor clone risk" confined to incidental chrome, not the domain/interaction model. Confirms the domain itself (scheduling a 1:1 meetup time) was explicitly flagged as *not yet built* in a neighbor's own doc comment (`r45/b/LocalMeetupEventsScreen.tsx`).
- **c**: mandated-neighbor comparison (r45/c, r48/b) clean — no code-surface overlap. But flags a **domain/macro-layout echo** found via broader catalog search: `r44/c/SellerBadgeTrackerScreen.tsx` is, at the archetype level, essentially the same shape (hero tier/progress card + badge collection + one persistent action-bar action) — no identifier/style-key clone, but the archetype slot was already occupied; c's filter+expand additions are real but sit on an existing archetype rather than a new one.
- **b**: ranked last for colliding at **both** levels simultaneously — (1) code-surface: `bandButton*` style-key family verbatim-identical (name-for-name) across b, `r39/b`, and a third file `r45/a/WantListScreen.tsx` (grep-confirmed — these exact 6 keys occur in only these 3 files in the whole `evolve/` tree), which is exactly the failure mode this repo's own `r43/b` doc comment explicitly warns against; (2) **domain-name duplicate**: `native/src/evolve/r31/c/PriceDropAlertSettingsScreen.tsx` already exists in the catalog under the literal same screen name and domain ("Price Drop Alerts"), mechanically different (r31/c is a per-listing FlatList, b is a global-preferences form) but the domain slot this round assigned to b was already filled.

## Tally

First-place votes: **a = 2** (lens2, lens3), c = 1 (lens1), b = 0. This is a clean 2:1 majority, **not** a complete 3-way tie (lens1: c/a/b, lens2: a/b/c, lens3: a/c/b — no tie-break procedure applies). **Winner: a ("Schedule a Meetup" / LocalMeetupScheduleScreen).**

Both lenses that flagged architecture-level cloning against a (lens1, lens3) still placed a ahead of b and/or c after weighing it — lens3 (the differentiation lens itself, whose explicit mandate this is) ranked a 1st while characterizing the overlap as "minor"/localized to incidental chrome (a focus-helper and a couple of style blocks), in contrast to b's overlap which both lenses independently characterized as far more extensive (entire named style-key families, copied helper-function shape, plus the domain-name collision). The majority holds with full awareness of the finding, not despite missing it.

## §3-1 (판정 후 수정) — not invoked
No hard-gate rule violation was found in any candidate (12/12 clean, no 1-fix cycle run). The cloning and domain-collision findings are differentiation-lens judgment matters, not gate rule violations — `gate.mjs` has no architecture-duplication check, so §3-1 (which is scoped to resolving rule violations in the winner, not re-litigating judgment calls) does not apply. The winner's source is left unmodified.

## LEARN (§5)
One new delta appended to `native-deltas-provisional.jsonl` (see commit) — the cloning-severity-spectrum calibration this round newly surfaces: localized/incidental-chrome overlap (a candidate reusing a focus-helper body and a couple of style blocks) did not cost a's differentiation vote, while extensive, multi-file verbatim style-key-family overlap plus a domain-name collision (b) did. This refines, without contradicting, the established `r46/a → r47/c` L2 doctrine ("a band shape can be correctly chosen and still lose on differentiation if the code surface is a near-clone") by adding a severity axis the prior two rounds' binary framing didn't need to articulate.

## Questions queue (§6)
Appended a second-reproduction note to the existing **Q63** (native RETRIEVE missing full-archive domain checks before assignment) — this round's orchestrator assigned candidate b's domain ("price drop alert settings") without grepping the full `native/src/evolve/` archive first, and it turned out to collide by literal name with an existing screen (`r31/c`). Q63 already recommended this grep step as advisory after its first native reproduction (`r34`); this is now the second native-target reproduction of the same root failure (on top of the dash/landing analogues Q58/Q66), which the appended note uses to recommend promoting the grep step from advisory to a mandatory pre-assignment step the next time this skill file is revised by a maintenance session (not something this autonomous round can do itself — SKILL.md edits are out of scope for `/dash-evolve`).

No conflicting delta pairs found this round. No reassign-queue entry: neither losing candidate (b, c) failed the hard gate — both lost purely on judgment, which is not a reassign-queue-eligible disposition per established practice.

## Canon invariant check
`dash-brief-v3.md`, `design-principles.md`, `page-brief-core.md`, `page-brief-repo.md`, all `brief-*.md` type profiles, the `/dash` gallery, `/v1-v5`, and `native/GENERATION.md` + `native/src/tokens.ts` — all unchanged. Only `native-deltas-provisional.jsonl` (append-only) and `questions-queue.md` (append-only) were added to. No commits to `main`.
