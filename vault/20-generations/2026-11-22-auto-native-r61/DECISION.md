# DECISION — auto-native-r61

Round 2 of this scheduled session's 2 requested back-to-back `/dash-evolve` rounds; round 1 was `auto-landing-r58` (target landing, winner b, 2:1), committed+pushed (`e5f10ca`) before this round began. `round-budget.mjs "2"` → N=1 again (0 unfilled `PAGE_TYPES`). Not Monday (Sunday), no native-cadence forcing. Target drawn uniformly from `[dash, native]` (landing excluded — already drawn by round 1, per this repo's established continuity precedent for same-day round pairs, e.g. `auto-native-r59`/`auto-landing-r55`) → **native**. `reassign-queue.md` had no target:native entry.

Environment bootstrap (session-specific, not a SKILL.md procedure): `native/node_modules` had never been installed this session — fixed with `npm install`. Chromium/Lighthouse workaround (same as round 1): `CHROME_PATH`/`PW_CHROMIUM_PATH`/`PW_NO_SANDBOX` pointed at the pre-staged `/opt/pw-browsers/chromium`, already read by `gate.mjs`'s native branch and `validate.sh` — no script changes.

Sub-agent note: same as round 1 — no custom `designer`/`comparator` types in this environment, nested subagents can't call Agent themselves, so the main session drove all 6 `general-purpose` dispatches (3 designers, 3 blind judges) directly.

## Candidates

- **a — "Seller Identity Re-verification"**: 4-step blocked-workflow state machine (confirm legal name / re-upload gov ID / re-upload selfie-with-ID / confirm payout bank account); band names the specific blocking step and jumps to it; becomes "Submit for Review" once all 4 complete.
- **b — "Manage Saved Payment Methods"**: `FlatList` of 4 saved methods (2 cards, bank account, wallet), no persistent band at all; "Remove" converts that row in place into a Cancel/Confirm pair (destructive-confirm row generalization), with default-method auto-promotion on removal.
- **c — "Dispute Resolution Outcome"**: read-only closed-dispute record (fact card, rationale, 4-step timeline) + a single persistent "Download Decision PDF" action bar that flips to a confirmed "Downloaded" state on press.

## §3 Hard gate

12/12 clean on the first attempt across all three — 0 violations, no 1-fix needed.

## Dedup gap found during GENERATE (orchestrator process note, not a candidate defect)

The orchestrator's duplication-avoidance list only covered recent rounds r56–r60. Both designer a and designer b independently self-disclosed, while writing, that their assigned domain+mechanism already exists further back in the catalog: a found `native/src/evolve/r34/a/IdentityReverificationScreen.tsx`, b found `native/src/evolve/r23/b/PaymentMethodsScreen.tsx`. Lens 3 was explicitly instructed to verify both from source directly rather than trust the self-reports (see below).

## §4 Judge panel (blind, independent, 3 general-purpose dispatches)

**Lens 1 — DNA/a11y compliance.** Ranking: **b > a > c**. All three fully compliant on every hard GENERATION.md §4 rule (no `accessible={true}` trap, single live region per transition, no hex, no `Math.random`/`Date.now`/bare `new Date()`, English-only). b ranked highest for the most sophisticated live-region handling (N possible row sites, correctly collapsed to at most one active via a single `confirmingId`) and hints that match handlers exactly. a close 2nd, equally rule-clean, real state machine traced end to end. c 3rd on one soft issue: its Download button's `accessibilityHint` claims a literal device-save that the handler doesn't actually perform (only a state flip) — not a hard no-op-hint violation (sighted and screen-reader users get the same consistent story, unlike the established `r14/c` precedent), but the one candidate whose hint makes an unfulfilled external-world claim rather than describing only its own state mutation.

**Lens 2 — mobile completeness.** Ranking: **a > c > b**. All three are reachable, correctly-wired screens (terminal states traced and confirmed non-decorative in all 3) — the separator was touch-target sizing. a explicitly engineered `minHeight: 44`/`48` + `hitSlop` into every Pressable. c's single Download button comfortably clears 44pt via generous padding. **b's Remove/Cancel/Confirm buttons compute to ≈34px** (`tokens.space(2)`=8px padding, no `minHeight`, no `hitSlop`) — under this catalog's own 44×44pt floor (`vault/20-catalog/ux-guidelines.catalog.md:110`) — a systemic defect across every row, visually corroborated in `b-390.png`/`b-768.png` against a's/c's visibly taller primary buttons.

**Lens 3 — screen-type/archetype differentiation.** Ranking: **c > b > a**. Directly compared source, not self-reports, per the orchestrator's explicit instruction:
- **a vs. `r34/a`: severe, code-surface clone.** Identical rendered heading text; near-identical derivation function + doc comment (`findBlockingStep` ↔ `nextBlockingStep`); near-verbatim a11y hint copy; two unrenamed style keys (`stepCard`, `stepCardHighlighted`); roughly a dozen more 1:1-renamed style keys; identical live-region pattern placement. This is the exact violation class `GENERATION.md` §3 itself names (`r6/a`'s `statusFor()`→`jumpTo()` precedent). a's other flagged overlap, with `r60/a` (shared band *form* only), is legitimate — no style-key or logic overlap there.
- **b vs. `r23/b`: severe, but with real incremental differentiation.** Unrenamed `confirmingId` state variable; identical 3-handler control-flow shape; byte-for-byte identical live-region expression; near-verbatim confirm-sentence template; word-for-word accessibility-label templates; one unrenamed style key (`btnPressed`). This goes beyond legitimate reuse of the sanctioned row-confirm *form* (whose named precedent, `r22/b`, could not be directly verified — it appears to have been pruned from the repo). What keeps b from ranking last: genuine new control flow absent from `r23/b` — default-method auto-promotion on removal (with the confirm sentence dynamically naming it) and a last-remaining-method guard that removes the control entirely rather than disabling it.
- **c: differentiation claims verified, no severe overlap** against either `r60/c` (different band form, different interaction model) or `r56/c` (same sanctioned form, but genuinely distinct code surface, state names, and content architecture).

## Tally — complete 3-way tie, resolved per established policy

1st-place votes: lens1→b, lens2→a, lens3→c — each candidate received exactly one 1st-place vote (a "3파전 완전 동률" in this repo's own terms). Per `vault/00-principles/curation-criteria.md`'s standing tie-break rule for exactly this situation (2026-07-25, "② 3파전 동률 tie-break 예외"): *default to the brief/DNA lens's (lens1) pick, unless the archetype/differentiation lens (lens3) explicitly ranked that candidate LAST — in which case exclude it and reapply the brief lens's top pick among the rest.* Lens1's pick is **b**. Lens3 ranked b **2nd**, not last (a is lens3's last place) — so the exclusion does not trigger, and lens1's pick stands.

**Winner: b — "Manage Saved Payment Methods."** Not a forced/invented winner — this is the repo's own documented resolution procedure for a genuine complete tie, applied mechanically and transparently.

This result sits uncomfortably next to lens3's confirmed finding that b's implementation closely mirrors `r23/b` — the tie-break rule's threshold ("ranked last") is binary and doesn't scale by severity of a confirmed-but-not-dead-last defect. Recorded as a new open question below rather than silently resolved, since the existing rule technically applies but may not be fitting it well.

No rule violation (in the §3-1 sense — a mechanically fixable GENERATION.md/gate rule breach) was raised against winner b by any lens; the code-surface-duplication finding is a judgment-stage differentiation concern already reflected in lens3's 2nd-place ranking, not a correctable violation, so §3-1 does not apply.

## §5 LEARN (append 1 delta)

Delta (winner-scoped, from lens 2's finding): a button's 44×44pt touch-target compliance cannot be inferred by eye from padding+text size — it must be either computed (padding×2 + line-box height against the 44pt floor) or secured with an explicit `minHeight`/`hitSlop`. The winner has excellent interaction logic (single-live-region exclusivity via `confirmingId`, handler-accurate hints, real state mutation) but every repeatable button computes to ≈34px because it relies on 8px padding with no `minHeight` safeguard — while a sibling candidate in the same round explicitly engineered `minHeight`+`hitSlop` into an otherwise structurally similar button pattern and passed clean. Confidence: high (quantitative, directly actionable, a same-round A/B).

## §6 Refinement gate

- No reproduction claim in the delta text (first occurrence of this specific touch-target-floor-by-padding-assumption framing), so it stays L1/provisional — no reproduction check needed.
- No conflicting delta pair identified against the current open native deltas.
- **New `questions-queue.md` entry (Q78)** for the tie-break-threshold-vs-severity gap identified above — a genuine meta-criteria ambiguity the existing rule doesn't cleanly resolve, not something to silently decide here.

## §7 Record

Ledger, `vault/index.md`, `screens.ts`/`screens.json` registration (already done pre-gate), and commit/push follow this file.
