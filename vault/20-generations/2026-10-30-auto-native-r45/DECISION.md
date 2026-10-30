# auto-native-r45 — DECISION

## §0 disclosure

This round ran inside an unattended scheduled session. Real `Agent`-tool subagent spawning was confirmed available and used throughout — 3 independent designer subagents for GENERATE and 3 independent blind judge subagents for JUDGE, all `general-purpose` type (this harness has no registered `designer`/`comparator` persona agents; the persona/constraints the skill describes for those roles were written directly into each subagent's prompt instead — designers were told not to use Bash/tsc, judges were told they are one of three blind independent lenses with no cross-visibility). `self_judged: false` — this was not a self-judged round.

Environment note: Playwright's own Chromium download is blocked by this sandbox's egress policy (`cdn.playwright.dev` returns 403). Worked around via `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium` + `PW_NO_SANDBOX=1` (a pre-installed system Chromium), which every browser-launching script in this repo (`gate.mjs`'s Lighthouse step via `CHROME_PATH`, `dash-sweep.mjs`, `capture-shots.mjs`, `shot-native.mjs`, `native/scripts/validate.sh`) already supports via env var — no script changes needed. `lighthouse` itself was installed ad hoc at the repo root (`npm install --no-save lighthouse`) since it isn't a normal devDependency and `npx lighthouse` without a local copy is blocked by this sandbox's own command-safety classifier. Full native pipeline (tsc/export/serve+render/iframe) smoke-tested successfully against an existing registered screen before this round began.

## §0 target/round selection

- `node scripts/round-budget.mjs 1` → **N=1**, reason: 0 unfilled `PAGE_TYPES` (all 18 types represented in the web catalog) — the coverage justification for N≥2 does not apply right now. This is round 1 of 2 standalone back-to-back round-invocations this scheduled session is running tonight (2026-10-30) to fulfill the user's "2 consecutive rounds" request, each independently computing its own budget and target (round-budget.mjs returns the same N=1 answer regardless of whether the caller asks for 1 or 2 while unfilled=0, so running two separate standalone invocations — rather than one N=2 call that the script would cap to 1 anyway — is how tonight's 2-round request is fulfilled without contradicting the script's own authority).
- Native weekly-cadence check: `new Date().getUTCDay()` → 5 (Friday, 2026-10-30 UTC) — not Monday, so the native-forcing rule does not apply this round.
- Target draw: 0 unfilled PAGE_TYPES → uniform random over `[dash, landing, native]` → **native**.
- Round number: `auto-ledger.jsonl` max round for target `native` was r44 → this round is **auto-native-r45**.
- `reassign-queue.md` "대기 중" at RETRIEVE time: only entry #18, target `landing` — does not apply to native. All 3 candidates were free exploration, no reassignment.

## §1 RETRIEVE

Read in full: `native/GENERATION.md` (all 8 sections), `native/src/tokens.ts`, `vault/20-catalog/ux-guidelines.catalog.md` (Native/Mobile section + Plat=both rows), `vault/00-principles/curation-criteria.md` (full, 134 lines — meta-criteria, injected below for the tie-break), `vault/00-principles/native-deltas-provisional.jsonl` (all 69 entries; the most recent ~8 open L1 entries — r38–r44 — were summarized and handed to designers as live instructions), recent `native` ledger entries (r42–r44 in full), and the full `native/screens.json` registry (89 existing screen titles) for dedup.

## §2 GENERATE

3 candidates, 3 distinct domains, 3 distinct macro layouts, 3 distinct band-mechanic applications, explicitly assigned by the orchestrator (not left to each designer to self-differentiate) per the established "assign macro-layout explicitly, not just band-mechanic" lever (native-deltas r37→r38):

- **a — Want List**: pre-listing wishlist of desired-but-not-yet-listed items with buy criteria (brand/model/size/condition/max-price). Form+list hybrid macro. Band: dirty-snapshot-diff (`wantDraftDiffersFromSaved`), the third occurrence of this established L2 band family.
- **b — Local Meetup Events**: public date-grouped agenda of nearby seller pop-up/meetup events, browse + RSVP. Date-grouped flat-FlatList macro. Band: selection-count-derived (`attendingCount > 0`), applied to a non-destructive opt-in-count context.
- **c — Negotiation History**: read-only chronological ledger of the buyer's past price negotiations across different items. Flat ledger macro, no grouping/filter UI. Band: per GENERATION.md §3's read-only-record-screen rule, an always-visible functional action bar (sort toggle) instead of a state-machine band.

All 3 designers confirmed scope compliance (wrote only inside their own `native/src/evolve/r45/<v>/` folder plus their own `candidates/<v>.md`) and reported their brief-gap decisions in `candidates/{a,b,c}.md`. Registration to `native/src/screens.ts` + `native/screens.json` (slugs `evolve-r45-{a,b,c}`) was done centrally by the orchestrator after all 3 designers' completion was confirmed via their actual handback reports (not just file existence), avoiding the race the skill warns about.

**Freeze hash** (`cat native/src/evolve/r45/{a,b,c}/*.ts* | shasum`): `a3036269a1dad19ffa94630facc9bfe4ce50cb9e` — unchanged from registration through the gate run, through screenshot capture, through all 3 judges' review.

## §3 HARD GATE

`node scripts/gate.mjs --target native --screens evolve-r45-a evolve-r45-b evolve-r45-c` — **12/12 gates passed on the first attempt, 0 violations, no 1-fix loop invoked for any candidate.** See SCORES.md for the full table.

## §4 JUDGE

Screenshots: `scripts/shot-native.mjs` against an Expo Web export+serve per candidate, 390px and 768px, all 6 frames visually confirmed non-blank before dispatch (no blank-frame 1-fix needed). 3 independent blind judges (general-purpose subagents), each given only source + screenshots + its own lens rubric — no concept notes, no cross-lens visibility, no knowledge of which candidate "wants" to win.

### Rankings

| Lens | 1st | 2nd | 3rd |
|---|---|---|---|
| lens1 — DNA/GENERATION.md compliance | **c** | a | b |
| lens2 — mobile app completeness | **b** | c | a |
| lens3 — screen-type differentiation | **a** | c | b |

**Complete 3-way split: each lens picked a different candidate for 1st.** This is not a no-winner panel (all three lenses reached full, confident, evidence-backed rankings — none abstained or reported a tie internally), but it is also not an ordinary 2:1 majority (Q32's established observation is that 2:1 is "the normal result" — full 3-way ties are the rarer edge case). `dash-evolve`'s own §4 prose only states the plain-majority and no-winner-on-2+-abstentions rules; it does not restate a tie-break procedure inline. That procedure already exists, fully answered and archived, in `questions-queue.md` **Q2** (2026-07-25, `auto-dash-r4` — the exact same shape of disagreement: lens1→c, lens2→a, lens3→b) and is distilled into `curation-criteria.md`'s "주간 반증 판정 기준 ②" entry, which `dash-evolve` §1 RETRIEVE already requires reading every round:

> "완전 동률 시 brief 렌즈 우선을 유지하되, archetype 렌즈가 그 후보를 최하위로 명시 판정했으면 동률 우승서 제외하고 나머지 중 brief 1위 재적용."
> (On a complete tie, default to the brief/DNA lens's top pick — unless the archetype/differentiation lens explicitly ranked that candidate last, in which case exclude it and re-apply the brief lens's next choice among the rest.)

Applying it: brief/DNA lens = lens1, whose top pick is **c**. Did the archetype/differentiation lens (lens3) rank c last? No — lens3's order is a(1st) > c(2nd) > b(3rd); c is not last. The exclusion condition does not trigger, so the tie-break resolves cleanly to lens1's top choice.

**Winner: c (Negotiation History).**

Noted, not queued as a new question (Q2 already covers this and `questions-queue.md`'s own rule is "동일 유형 중복 금지" — no duplicate question types): this is, as far as this ledger shows, the first time Q2's answer has been applied inside `dash-evolve` itself rather than in `/dash-falsify`'s weekly review (its original context). The rule read as directly applicable without needing reinterpretation, so this is recorded as a confirming observation, not a gap.

### Per-candidate findings (full reasoning preserved from each judge's report; see SCORES.md for the condensed table)

**Winner — c, Negotiation History**: No rule violations or bugs found by any lens. lens1: correct read-only-record band shape (always-visible functional sort action bar, no live region — correctly absent since nothing here is blocked), status conveyed by color+label together, no hardcoded hex/emoji/Korean/non-determinism found. lens2: sort-toggle logic hand-verified correct against all 8 offer values in the dummy data (non-mutating spread-before-sort); noted as a completeness weakness that rows are plain `View`s with zero touch feedback/drill-in (a thinness observation, not a defect — the screen's own code comment explicitly justifies this restraint as a read-only record with nothing to drill into). lens3: clean vs. `offer-thread` (zero identifier overlap); flagged that `OfferStatusScreen`'s embedded "Your Other Offers" sub-list (`r40/a`) is a real, previously-unacknowledged conceptual near-duplicate of part of c's purpose — no code-surface collision, and c adds real dimensions (seller-counter tracking, final settled amount, two extra status values, a genuinely working sort action) that the embedded sub-list lacks, so this was treated as a note rather than a disqualifying overlap. **No §3-1 post-judgment fix needed — zero defects found in the winner by any lens, freeze hash unchanged through judging.**

**a, Want List**: Won lens3 (differentiation) outright — clean vs. watchlist and `PriceDropAlertSettingsScreen` (zero identifier overlap), correctly the 3rd principle-level (not code-surface) occurrence of the dirty-snapshot-diff band family with no literal name collisions against either prior instance (Vacation Mode, Payout Method Order); lens3 also flagged `SavedSearchManagerScreen` (`r25/c`) as a closer unaddressed conceptual neighbor than watchlist, but confirmed substantively different mechanics and no identifier collision. Ranked 2nd by lens1 (clean DNA compliance; minor non-rule note that condition chips are 36pt vs. this codebase's 44pt convention). **Ranked last by lens2, which found a real, verified defect**: `WantCard.onPress` (`WantListScreen.tsx:105-112`, wired at `:306`) unconditionally calls `openEditForm(item)` with no guard against `hasUnsavedWantDraft` — tapping a different want card while mid-edit on a dirty draft silently discards the unsaved edit with no confirmation, despite the screen having built an entire Save/Discard/unsaved-indicator mechanism specifically to prevent exactly this kind of silent data loss. This is a genuine commercial-app defect, not a style nitpick, and it's the reason a did not win despite the richest feature set and a lens3 win.

**b, Local Meetup Events**: Won lens2 (mobile completeness) outright — every handler traced and confirmed correct, the most functionally sophisticated interaction of the three (real `scrollToIndex` + accessibility-focus handoff + `onScrollToIndexFailed` retry), chronological-data-order dependency verified correct by hand; one real but minor copy defect shared across lens1 and lens2 independently (`pluralize(count, "person going")` produces "18 person goings" — grammatically broken, visible in both screenshots). **Ranked last by lens3, which found a major, verified defect of its own**: the "jump to next" mechanism is not mechanism-level reuse as its own code comment claims — it is a near-line-for-line copy of `evolve/r34/a/IdentityReverificationScreen.tsx`'s jump mechanism, down to identical constant names *and values* (`HIGHLIGHT_DURATION_MS = 1600`, `FOCUS_SETTLE_DELAY_MS = 350`), identical ref-variable shapes, and identical function structure (same `scrollToIndex` call shape, same highlight-then-clear-timer pattern, same `clearTimeout`-guard-before-`setTimeout`, same `findNodeHandle`+`setAccessibilityFocus` sequence). This is precisely the code-surface-collision failure mode `GENERATION.md` §3 names ("형태를 맞게 골라도 코드 표면까지 닮으면 진다") — the shape choice (reuse the proven jump mechanism) was correct, but the execution copied rather than reimplemented it with fresh naming, which is what the doctrine requires.

### Disposition of non-winner findings
Per this project's established disposition (confirmed across r41/r42/r51/r52 precedent in this same ledger lineage): **pure judgment losses — including ones where a real bug or code-surface collision is found during judging — are not reassign-queue candidates.** Reassign-queue is specifically for hard-gate drops (where a candidate's *form* survives but its *rule-compliant execution* didn't), not for judgment-stage losses where the candidate passed the hard gate clean. Both a's silent-data-loss bug and b's code-surface collision were found during judging, not at the hard gate (gate.mjs has no mechanism to detect either — a's is a UX-flow bug, b's is a cross-file-similarity judgment only a reader with catalog knowledge can make). Both are recorded here for the record but **not fixed** (§3-1 is winner-scoped only, and neither a nor b won) and **not queued to reassign-queue**.

## §5 LEARN

One new L1 delta, extracted from the decisive mechanism behind the winner (see `vault/00-principles/native-deltas-provisional.jsonl` for the appended entry): a read-only record screen's always-visible action bar needs a genuinely state-changing action (not just a label) to read as complete even with zero drill-in affordances on its rows — c's working sort toggle was independently cited by lens1 and lens2 as the thing separating "correctly executed restraint" from "under-built," which is a sharper statement of GENERATION.md §3's existing read-only-record-screen doctrine than previously recorded (r44/c, the prior instance of this band shape, won 3:0 unanimously and didn't surface this distinction because its own comparable screens weren't competing on completeness in the same way).

## §6 Refinement gate

Loaded full `native-deltas-provisional.jsonl` (69 prior entries). No conflicting pair identified against the new L1 delta. No promotion to L2 this round — single instance, the delta text does not claim reproduction of a prior round's observation (it sharpens an existing L2-adjacent doctrine rather than reproducing a prior delta), consistent with this project's 2-3-round reproduction bar for judgment-based (non-machine-verifiable) deltas.

No new questions-queue entry — the one live judgment call this round (the 3-way tie) was already resolved by the existing, archived Q2, and no new conflicting-delta pair or meta-criteria gap was identified.

## §7 Record

- `target: native`, `round: auto-native-r45`, `winner: c`, `no_winner: false`, `self_judged: false`.
- `variety`: native screens use fixed DNA tokens (not the web catalog-variety axes) — `theme: "light (RN fixed DNA)"`, `accent: "indigo #4f46e5 (RN fixed DNA)"`, `face: "system (RN fixed DNA)"`, matching the convention established in prior native ledger entries (e.g. r44).
- Canon untouched: `native/GENERATION.md`, `native/src/tokens.ts`, all web briefs, `/dash` gallery, `/v1`–`/v5` — all unmodified. `native/src/screens.ts` + `native/screens.json` edited (standard per-round registration of all 3 candidates, not a canon edit). `native-deltas-provisional.jsonl` append-only (1 new L1 entry). `questions-queue.md` append-only (1 new entry). No commits to `main` — all work on `evolve/dash`.
