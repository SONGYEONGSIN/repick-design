# DECISION — auto-native-r42

## 0. Scheduling / deviation notice

Scheduled unattended run, intended as 2 consecutive rounds (`/dash-evolve 2`). `node scripts/round-budget.mjs --explain 2` returned `1  미채움 0종 — N≥2 의 근거(커버리지)가 없다` (all 18 `PAGE_TYPES` are filled), so per the skill's own authoritative budget script, only 1 round runs from this invocation; the second requested round is a separate `/dash-evolve` invocation (round 2 of this session, target TBD at that invocation's own RETRIEVE). 2026-10-26 is a Monday (`new Date().getUTCDay() === 1`) → native weekly-cadence forcing applies (skill §0-0 "native 주기") → this invocation's single round is forced to `native`. `Agent` tool confirmed available before starting (§0-0 gate) — this is a real blind 3-lens panel with independent `general-purpose` subagents, not self-judged.

Environment bootstrap performed before any round work: `git checkout evolve/dash` (existing remote branch), `npm install` at repo root, `app/`, and `native/` (none had been installed in this fresh container), `npx playwright install chromium --with-deps` failed (egress policy blocks `cdn.playwright.dev`) — worked around via `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium` (this sandbox's pre-installed Chromium, a different revision than `playwright@1.61.1` expects by default), which every relevant script (`native/scripts/validate.sh`, `native/scripts/iframe-check.mjs`, `scripts/shot-native.mjs`) already supports natively via `process.env.PW_CHROMIUM_PATH`. No script changes made. Smoke-tested the full native 4-gate pipeline against an existing catalog screen (`evolve-r41-a`) before generating anything, to confirm the environment actually works end-to-end.

## 1. Target & round number

`target: native`, round = `auto-native-r42` (max prior native round in ledger = 41, so N = 42).

RETRIEVE read: `native/GENERATION.md` (full), `native/src/tokens.ts` (full, literal values handed to designers), `vault/00-principles/native-deltas-provisional.jsonl` (all open deltas — most recent: r41/a's contact-field-format-validation L1, and the L2-promoted dirty-state-derived-band principle originating r39/b, reproduced r40/c), `vault/00-principles/curation-criteria.md` (full), `vault/00-principles/reassign-queue.md` ("대기 중" — empty, nothing to reassign this round), relevant open `questions-queue.md` entries (Q63 — RETRIEVE must grep the *full* native-evolve archive, not just the last ~5 ledger rounds, before assigning candidate domains; Q64 — even "don't open the comparison file" instructions can't prevent literal code-surface convergence on narrow sub-mechanisms, so JUDGE should explicitly check constants/control-flow, not just naming/copy — both directly informed this round's design, see §2 and §4 below).

## 2. Duplicate-avoidance survey (Q63 compliance — full archive, not just recent rounds)

Full native catalog surveyed before assignment: 25 production screens (`native/src/{account,auction,authentication,certificate,chat,condition,detail,disputes,handoff,listing,meetup-time,membership,notifications,offer-thread,order-status,payout,pickup,relist,review,sessions,storefront,verification,wallet,watchlist}/`) + all of `native/src/evolve/r23`–`r41` (winners and losers both, ~57 more screens — `r1`–`r22` no longer exist on disk, apparently cleaned up after past promotion cycles; their winners live on as production screens). Full one-line-per-domain list handed to each designer in their brief (not just a compressed summary) so each could independently confirm no collision.

Three domains assigned, chosen to be clearly outside every existing cluster (payments/payout, address book, notifications, offers/negotiation, protection/insurance, reviews, disputes, auctions, verification, listings, tax, shipping, security/linked-accounts, loyalty/rewards, membership, vacation/availability) and to land on three genuinely different macro-layouts per GENERATION.md §3's r37/r38 lesson (band-mechanic assignment alone doesn't guarantee macro-layout spread — macro shape was assigned explicitly alongside domain):

- **a — Listing Q&A**: public pre-purchase buyer↔seller(+other buyers) question thread on a listing. Macro: fixed item header + `FlatList` of Q&A entries. Band: always-mounted composer bar (a 4th band form for this codebase — not blocked/ready, not selection-count, not dirty-state-diff — because there is no step-gating flow to represent).
- **b — Report a Buyer**: seller complaint against a buyer's transaction conduct (no-show/non-payment/abuse — mirror direction + distinct taxonomy from the existing report-a-listing screen). Macro: 3-step wizard. Band: classic blocked/ready state machine.
- **c — Split-Pay Plan Selector**: buyer pre-checkout payment-timing choice (pay in full / 4 / 12 installments — a different axis from the existing protection-tier picker and from seller-side payout screens). Macro: 3 fixed comparison radio-cards. Band: selection-derived (`selectedPlanId !== null`) — a 3rd recognized derived-boolean band-presence trigger shape (distinct from selection-*count* and dirty-state-diff).

## 3. GENERATE

3 independent `general-purpose` Agent-tool subagents, run in parallel, each handed the literal GENERATION.md §1–§5 text + full `tokens.ts` contents + the full duplicate-avoidance survey + their specific domain/macro/band assignment, with an explicit instruction not to touch `native/src/screens.ts` or `native/screens.json` (registered centrally afterward by the orchestrator to avoid 3 agents racing on the same shared files). Each required a `candidates/<v>.md` concept write-up + mandatory "Brief gaps" self-report (not read by judges — kept for the orchestrator/future audits only).

Designer completion was confirmed via each agent's own hand-back report (not file-existence) before freezing — and this mattered: candidate b's `ReportBuyerScreen.tsx` was still being revised by its designer after candidate c's designer had already finished (the orchestrator captured an early snapshot in an intermediate WIP commit, then caught and committed the later revision before freezing/gating), consistent with the skill's own documented "designer completion ≠ file existence" warning.

## 4. Freeze + hard gate

Freeze hash (sha1 of all 3 candidates' `.tsx`+`.ts` sources, taken immediately before registration/gating): `d1f43d29e5236b46edad0f3c7d4f8db928d77557`. Unchanged throughout gating/screenshotting/judging — no re-gate needed.

`node scripts/gate.mjs --target native --screens evolve-r42-a evolve-r42-b evolve-r42-c` → **12/12 clean on the first attempt.** Zero 1-fix loops. Zero candidates dropped. See `SCORES.md` for the full gate table.

## 5. JUDGE — 3-lens blind panel

Screenshots: both widths (390px mobile, 768px tablet) for all 3 candidates via Expo Web export + `npx serve` + Playwright (`PW_CHROMIUM_PATH` override), visually spot-checked by the orchestrator before dispatch (no blank frames). 3 independent `general-purpose` Agent-tool subagents, each given all 6 screenshots + all 3 candidates' source + the design canon, explicitly instructed NOT to read `candidates/*.md` (keeps judging blind to the designers' own framing). No shared visibility between lenses.

**Rankings:**

| lens | 1st | 2nd | 3rd |
|---|---|---|---|
| lens1 (DNA/GENERATION.md compliance) | c | a | b |
| lens2 (mobile completeness) | c | b | a |
| lens3 (screen-type differentiation) | a | c | b |

**Majority: c wins 2:1** (lens1 + lens2 vs. lens3). Not a 3-way tie — curation-criteria's tie-break rule not invoked.

**lens1** found c cleanest on canon compliance (zero citable violations — correct `.map()`-over-fixed-3-array exception, correct derived-not-hand-flipped band boolean, single-accent discipline). Found one real §3 DNA deviation in b: step 3's "Submit Report" button uses `tokens.color.danger` for a plain forward-progress action, not a destructive-confirmation moment (`tokens.ts` itself labels that token "destructive-red" — narrower intended use than "serious-feeling submit"). Ranked a 2nd (clean, only a trivial arguable token-semantics nitpick on a decorative avatar swatch).

**lens2** found c cleanest on mobile completeness (handles the plan-switch-after-confirm edge case correctly, tightest live-region design, best information density for a compare-3-options task, correct fee math). **Found a real, confirmed bug in a**: `handlePost` clears the draft and shows a 4-second "Question posted..." toast, but never appends to or otherwise mutates the `qaEntries` list the `FlatList` renders — the screen's own copy promises an outcome ("Sellers and other buyers can now answer") the code never delivers. The orchestrator independently re-read `ListingQAScreen.tsx:69-78` and confirmed this is accurate: `qaEntries` is the static imported const from `data.ts`, never touched by any state setter. This is exactly the "dishonest affordance" class this codebase's doctrine already prohibits (accessibilityHint-promises-unfulfilled-outcome, generalized here to a *visible success state* promising an outcome that doesn't happen). Ranked b 2nd (most complete implementation of the three, with two real but minor polish gaps: an intra-step readiness change in b that isn't announced via the live region, and a counter/gate semantic mismatch between raw vs. trimmed character length).

**lens3** found a and c both genuinely, structurally distinct from their nearest-neighbor catalog screens (a vs. offer-thread/chat: non-overlapping data models and macro shape; c vs. the protection-tier picker and the two prior dirty-state-band screens: `selectedPlanId !== null` is a genuinely new single-nullable-selection-presence trigger shape, no second "saved" state to diff against unlike r39/b/r40/c's two-state diff helpers). **Found a serious, independently-verified literal-duplication problem in b**, from its own supplementary catalog sweep beyond the brief's named comparison file: `ReportBuyerScreen.tsx`'s step-wizard engine (type/constant shape, `getStepName`, `handleBack`, the per-step `announce()` template strings, verbatim `accessibilityHint="Returns to the previous step."`, and the button-row style-key declaration order/values) is a near line-for-line match against `native/src/evolve/r38/c/ReturnShippingLabelScreen.tsx`'s wizard engine — differing only in copy and step names. **The orchestrator independently re-read both files side-by-side and confirms this finding is accurate** (see excerpts below). This is exactly the class of violation GENERATION.md §3 already names as penalty-worthy under its established "separate form-choice from implementation — key names/phrasing/control-flow must be freshly written for that screen's domain" doctrine (the r18/c precedent). Ranked a 1st (cleanest differentiation of the three), c 2nd.

Orchestrator-verified excerpt (b vs. r38/c):
```
r38/c: type StepNumber = 1 | 2 | 3; const TOTAL_STEPS = 3;
b:     type FormStep    = 1 | 2 | 3; const TOTAL_STEPS = 3;

r38/c: const previousStep = (currentStep - 1) as StepNumber;
       setCurrentStep(previousStep);
       announce(`Step ${previousStep} of ${TOTAL_STEPS}: ${getStepName(previousStep)}.`);
b:     const previousStep = (step - 1) as FormStep;
       setStep(previousStep);
       announce(`Step ${previousStep} of ${TOTAL_STEPS}: ${getStepName(previousStep)}.`);

r38/c: accessibilityLabel="Back" accessibilityHint="Returns to the previous step."
b:     accessibilityLabel="Back" accessibilityHint="Returns to the previous step."
```

**Disposition of b**: b was never any lens's 1st place (lens1=3rd, lens2=2nd, lens3=3rd) — it loses the round on ordinary 2:1-style aggregate grounds regardless of the duplication finding, so the finding does not need to void or reshape the majority. It is recorded here in full because it is real, confirmed, and directly relevant should this screen's *form* (seller-reports-buyer, behavioral taxonomy, 3-step wizard) be considered for reassignment in a future round — any reassignment must explicitly instruct the next designer to write the wizard engine fresh rather than reuse `r38/c`'s implementation. (Per this codebase's convention, `reassign-queue.md` entries are populated at `/dash-falsify apply` time, not by `/dash-evolve` itself, so no queue edit was made here — this DECISION is the record that feeds that later process.)

**Disposition of a**: a's confirmed dishonest-affordance bug (§ above) is additional, independent grounds beyond lens3's differentiation ranking for why a correctly did not win. No §3-1 fix applies (a is not the winner, and §3-1 is winner-scoped).

## 6. Post-judgment fixes (§3-1)

None needed. Zero rule violations found in winner c by any of the 3 lenses (lens1: clean; lens2: clean, only a non-rule-violating code-quality nit on an updater's purity, harmless/idempotent in practice; lens3: clean). Freeze hash unchanged throughout judging.

## 7. LEARN

One L1 delta extracted from the winner's judging rationale — see `native-deltas-provisional.jsonl` append: c's band-presence boolean (`selectedPlanId !== null`) generalizes this codebase's established "band presence must be a derived, not hand-flipped, boolean" principle to a **third trigger shape** (single-nullable-selection presence), distinct from both prior recognized shapes (selection-*count*-derived, r16/b; dirty-state-vs-saved-snapshot-diff, r39/b→L2 via r40/c) — confirmed structurally distinct by lens3's explicit side-by-side code comparison against both prior mechanisms.

## 8. Refinement gate

No level changes this round — the new delta is L1 (single occurrence). No existing provisional delta met a 2-round reproduction bar this round. No conflicting delta pairs found requiring a forced question (§6 question-generation is conditional on a conflict pair or a meta-criteria-unjustifiable finding; neither applies here — both of this round's notable findings (a's dishonest affordance, b's literal duplication) are already fully governed by this codebase's existing, cited doctrine, so no new questions-queue entry was needed).

## 9. Invariants confirmed

`vault/00-principles/dash-brief-v3.md`, `vault/00-principles/design-principles.md`, `/dash` gallery, `/v1`–`/v5` — untouched. `native/GENERATION.md`, `native/src/tokens.ts` — untouched (read-only canon). jsonl append-only. No commits to `main` — all work on `evolve/dash`.
