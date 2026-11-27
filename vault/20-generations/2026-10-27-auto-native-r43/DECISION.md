# DECISION — auto-native-r43

target: native · round 1 of this scheduled session's two back-to-back `/dash-evolve` executions (round 2 follows as an independent invocation, excluding `native` from its target draw).

## 0. Round budget + Agent-tool availability

`node scripts/round-budget.mjs --explain 2` returned `1  미채움 0종 — N≥2 의 근거(커버리지)가 없다` — all 18 `PAGE_TYPES` are filled (verified directly against `app/src/lib/works.ts`), so only 1 round runs this invocation regardless of the requested 2; the session's second requested round is a separate, sequential invocation (round 2 of 2).

`Agent` tool confirmed available and used for real: 3 independent `general-purpose` subagents for GENERATE, 3 independent `general-purpose` subagents (blind, no cross-lens visibility, no access to `candidates/*.md`) for JUDGE. `self_judged: false`.

2026-10-27 is a Tuesday (`new Date().getUTCDay() === 2`) — not Monday, so the native weekly-cadence forcing rule does not apply here; `native` was reached by the ordinary uniform draw over `[dash, landing, native]` (unfilled-type queue is empty).

`reassign-queue.md` "대기 중" was empty at RETRIEVE — no reassignment this round.

## 0a. Environment bootstrap (session-specific, not part of the skill)

Fresh container: ran `npm install` at repo root, `app/`, and `native/`. Playwright's own Chromium download is blocked by the sandbox egress policy (`cdn.playwright.dev` → 403); used the pre-installed Chromium at `/opt/pw-browsers/chromium` via `PW_CHROMIUM_PATH` (+ `PW_NO_SANDBOX=1`, `CHROME_PATH`) for `gate.mjs`/`shot-native.mjs` — no script changes, both already supported these env vars. Dev server (`cd app && npm run dev`, port 3100) started for completeness though this round doesn't gate a web route. `npx playwright screenshot` (the raw CLI) does **not** honor `PW_CHROMIUM_PATH` — switched to the repo's own `scripts/shot-native.mjs` helper, which does.

## 1. RETRIEVE / target survey

Full native catalog survey (production screens via `native/src/screens.ts` + all `native/src/evolve/r23`–`r42`, 60 prior candidates, winner/loser both counted per the skill's cumulative-archetype dedup rule) delegated to a fork sub-agent for efficiency. ~85 distinct domains already covered; confirmed group-buy/split-purchase, return-deadline-extension, and collection-sharing are all genuinely absent. Confirmed the `bandBlocked*/bandReady*/bandDone*` style-key family is used verbatim by 6 production screens — flagged as the literal-naming trap to avoid regardless of domain (GENERATION.md §3's repeatedly-documented "form choice right, code-surface copying still loses" doctrine).

3 candidates assigned 3 distinct macro layouts (sticky-header+roster-list / single-focus-countdown-card+form / 2-col card grid) **and** 3 distinct band-mechanic shapes (new sum-threshold-derived gate / reused state-machine blocked-ready-done with a date-threshold twist / reused dirty-state-snapshot-diff), each with an explicit naming-collision warning in its designer prompt — applying the `auto-native-r37`→`r38` lesson (band-mechanic assignment alone doesn't guarantee macro-layout spread; assign both axes explicitly).

- **a** — Group Buy Roster (Group Buy / Split Purchase Roster): multiple buyers pool contributions toward one listing; sticky progress header + FlatList roster; band = `poolReady = totalPooled >= targetPrice` (new numeric-sum-threshold-derived shape).
- **b** — Return Window Extension Request ("Request more time"): buyer requests extra days before a purchase's return-eligibility deadline closes; single-focus countdown card + reason form (ScrollView, not FlatList — justified in-file: no record collection to virtualize); band = reused blocked/ready/done state machine with two distinct blocked sub-reasons (`closed` = deadline already passed, terminal; `incomplete` = reason too short), each with its own jump-to-problem handler.
- **c** — Collaborative Watchlist Share ("Shared Collections"): buyer sets per-friend view/edit permission on saved collections, shares a link; 2-col FlatList card grid; band = reused dirty-state/snapshot-diff shape (`shareSync*` keys).

## 2. GENERATE

3 real independent `general-purpose` Agent-tool subagents, run in background, each given the assembled brief (GENERATION.md full text, tokens.ts, native/AGENTS.md's "Expo HAS CHANGED" notice, the UX catalog's Native/Mobile row, the specific domain+macro+band assignment with its naming-collision warning, and the project's own accumulated, judge-verified accessibility idioms: conditional `accessibilityRole="alert"` + self-clearing timeout for transient messages (r31→r32→r35, L2) vs. no-clearing-needed for purely re-derived values, the `accessible={true}` wrapper-collapse trap (r21, L2), the accessibilityHint-honesty rule (r14→r26)). No Bash tool given to designers (established constraint — they can't run tsc/validate.sh, a separate orchestrator pass gates afterward). Each produced a `candidates/<v>.md` with a `## Brief gaps` section and a stated `Check string`.

Registration (`native/src/screens.ts` imports + `COMPONENTS` map, `native/screens.json` check strings) done centrally by the orchestrator after all 3 designers finished, to avoid 3 parallel agents racing on the same shared files — standard per-round registration, not a canon edit.

**Freeze hash** (`cat native/src/evolve/r43/*/*.tsx native/src/evolve/r43/*/*.ts | shasum`): `c00c4f1f6c87bbeb1b8ebf0b144a131d9806c451` — verified unchanged from registration through gate through judging.

## 3. HARD GATE

`node scripts/gate.mjs --target native --screens evolve-r43-a evolve-r43-b evolve-r43-c` → **12/12 clean on the first attempt, zero 1-fix loops, zero candidates dropped.** Full table in `SCORES.md`.

Screenshots: `scripts/shot-native.mjs` at 390×844 and 768×844 (mobile + tablet widths, per the native block's own convention — Expo Web export + Playwright, not desktop widths) for all 3 candidates. Spot-checked all 6 by eye for blank frames: none — every candidate renders its real content, not a blank canvas.

## 4. JUDGE (3 lenses, blind, independent `general-purpose` Agent-tool subagents, no cross-lens visibility, `candidates/*.md` withheld from all 3)

**Ranking: 1st=a 2nd=b 3rd=c** (lens1, DNA compliance). Clean on every checked axis for a (FlatList used correctly, fresh `poolBand*` keys, correct conditional/cleared alert pattern). b docked only a "soft" letter-of-the-rule deviation (`.map()`+`ScrollView` instead of `FlatList` for the 4-item, non-virtualizable extension-day chip row — a reasoned, in-file-justified exception, not a gate-dodge). c docked a **real, citable** violation: `CollectionShareScreen.tsx:220` applies `accessibilityRole="alert"` **unconditionally** to a continuously re-derived pending-count headline, inconsistent with the same file's own correct conditional use 150 lines later for its transient post-sync toast (`:370`) — exactly the anti-pattern the r31→r32→r35 L2 rule warns against, and the inconsistency shows the author knew the right pattern and simply didn't apply it there.

**Ranking: 1st=b 2nd=a 3rd=c** (lens2, mobile completeness). b's 4-phase state machine (including a genuinely distinct terminal "deadline already passed" edge case) and its `handleDockPress` performing a real scroll+focus to the *specific* blocking field were the decisive mechanisms. a's one completeness ding: a hardcoded `"fifty thousand won"` a11y hint string that isn't derived from `YOU_STEP` (today they agree, but it's a drift risk). c's decisive gap: its initial dummy-data state (`PERMISSIONS_SHARED_LAST` used as both the draft and the "last synced" snapshot) boots perfectly in sync, so **both screenshots show zero evidence the sync mechanism exists at all** — no demonstrated mid-flow state, unlike a and b.

**Ranking: 1st=b 2nd=a 3rd=c** (lens3, differentiation). No StyleSheet-key collisions against the `bandBlocked*/bandReady*/bandDone*` family or against each other for any of the 3 — all three domains confirmed genuinely absent from the catalog (grep-verified against production + all 60 prior evolve candidates, with full reads of the closest domain-adjacent files: r42/c split-pay, r36/c·r38/c·r40/b return-logistics trio, r41/c dirty-diff precedent). b ranked 1st on the strength of its domain+macro+mechanic triangulation with zero collision risk. a ranked 2nd — genuinely novel domain and band shape, but its macro layout (sticky-header+FlatList-of-rows) is the single most common skeleton in this catalog (shared with disputes/sessions/chat/blocked-users/purchase-archive), the least-surprising of the three. c ranked 3rd on a **real finding**, not domain/macro: its own header comment explicitly names r41/c (`NotificationPreferencesScreen`) as the mechanic-reuse source (legitimate per doctrine), but the dirty-diff function's docstring and its Discard-button `accessibilityLabel` are reused **near-verbatim, nouns swapped** — exactly the literal-phrasing collision GENERATION.md §3 flags as losing even when the underlying mechanic-reuse is legitimate. Cited verbatim in both files at the quoted line numbers.

**Aggregate: clean 2:1 majority for b** (lens2 + lens3; lens1 alone preferred a). Not a tie, no tie-break rule invoked, no no-winner votes. Per this project's own accumulated reading of its judgment history (`curation-criteria` "Q32 판정"), a 2-1 split with the dissenting lens rotating round to round is the modal, not an anomalous, outcome — no action needed beyond recording it.

**No post-judgment §3-1 fix needed on winner b** — neither dissenting lens1 nor any lens found a hard rule violation in b itself; the one soft letter-of-the-rule note (ScrollView vs FlatList) was explicitly read as a reasoned, defensible exception, not a violation, by the lens that raised it, and did not change its ranking.

c's confirmed accessibilityRole="alert" violation and its near-verbatim docstring/label-phrasing collision with r41/c are **not** fixed here — c is not the winner and §3-1 is winner-scoped (matching the established `auto-native-r41`/`auto-landing-r42` precedent that a losing candidate's flaws are recorded, not patched). Both are fully governed by existing, already-L2-promoted doctrine, so no new `questions-queue` entry is warranted.

## 5. LEARN

See `native-deltas-provisional.jsonl` — 1 new L1 delta extracted from the winning rationale (lens2 + lens3 both independently cited the same mechanism as decisive): a blocked-workflow band with **more than one distinct blocking condition** reads as more functionally complete when its jump-to-problem action routes to a **different target depending on which specific condition is currently blocking**, not one fixed jump target regardless of cause. This generalizes the `auto-native-r34` "functional jump beats decorative jump" doctrine (real `FlatList.scrollToIndex` + focus vs. just updating text) to screens whose jump target itself must be chosen conditionally because the blocking condition is not a single step/field.

## 6. Refinement gate

Loaded `native-deltas-provisional.jsonl` in full. The new delta's novel part (reason-specific jump-target selection) has exactly one prior supporting instance (`r34`'s single-reason functional-jump case) plus this round — by `curation-criteria`'s own 2-round-reproduction bar for judgment-dependent deltas (as applied in `r31`→`r32`→`r35`, which took 3 independently-built rounds before L2), **one round is not yet reproduction of this specific refinement**; `r34` established the simpler "functional jump" claim, not the "conditionally-routed jump target for multiple distinct causes" claim this round adds on top of it. **Not promoting to L2 this round** — left `level: 'L1'`, `status: 'provisional'`, will promote if an independent future round reproduces the same multi-cause-routing shape.

No conflict pairs found against existing deltas. No new `questions-queue` entry — c's two findings this round are both already fully governed by existing, cited doctrine (the r31/r32/r35 conditional-alert rule; the GENERATION.md §3 literal-phrasing-collision doctrine), not new tensions.

## 7. Canon + scope

Canon (`GENERATION.md`/`tokens.ts`/all web briefs/`page-brief-core`/`page-brief-repo`/`dash-brief-v3`/`design-principles`/`/dash` gallery/`/v1`–`/v5`) untouched throughout. `native/src/screens.ts` + `native/screens.json` edited (standard per-round registration, not a canon edit). `native-deltas-provisional.jsonl` append-only (1 new entry). `reassign-queue.md` not edited (populated at `/dash-falsify apply` time per convention, not by `/dash-evolve`). No commit to `main` — all work on `evolve/dash`.

This is round 1 of this scheduled session's 2 requested rounds. 0 candidates dropped at hard gate (first clean-sweep-on-first-try native round of the two session rounds so far). 0 no-winner rounds. Round 2 follows as an independent invocation, re-reading this round's delta and excluding `native` from its target draw.
