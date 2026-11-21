# auto-native-r41 — DECISION

**0. Round-budget deviation disclosure.** This is the second of this scheduled task's two requested `/dash-evolve` rounds, run as a second, independent single-round invocation (round 1 was `auto-landing-r40`, winner b "Window, Not a Point", committed+pushed before this round began). `scripts/round-budget.mjs --explain 2` again returned `1	미채움 0종 — N≥2 의 근거(커버리지)가 없다` — `PAGE_TYPES` still has zero unfilled types, so this invocation also runs exactly 1 round.

**Target draw**: unfilled queue empty, not Monday (no weekly native-cadence force applies either way) → uniform random among `[dash, landing, native]` → **native**, landing from round 1 was not artificially excluded (no scheduling-prompt instruction asked for cross-round target variety this time — unlike some prior sessions' own explicit requests — so this was a plain independent draw, which happened to land on a different target by chance).

**Agent availability**: the `Agent` tool is present and was used for all 3 GENERATE designer subagents and all 3 JUDGE lenses — real independent blind subagents throughout, `self_judged: false`.

**Environment bootstrap for this target**: `native/` had never had `npm install` run in this container — ran it fresh (503 packages) before anything else, since the scheduled task's bootstrap step only covered the repo root and `app/`.

**Reassign-queue**: empty for `native` at RETRIEVE time (the only current "대기 중" entry, #16, is tagged `target: landing` from round 1 of this same session) — no candidate reassigned this round; all 3 were free exploration.

## 1. Targets assigned

Native has a fixed, non-variable DNA (light theme, single indigo accent `#4f46e5`, system font) — there is no theme/accent/face variety axis to assign, unlike web targets. 3 fresh screen concepts were chosen after grepping the full existing catalog (`native/screens.json`'s ~76 `check` strings across `r23`–`r40`, plus the handful of non-evolve core screens) to avoid domain duplication:
- **a** — "Gift This Item": buyer-side, sending a listed/purchased item as a gift (recipient form + delivery-method choice + validation-gated send band).
- **b** — "Protection Plan Picker": buyer-side, pre-purchase comparison of 3 protection-plan tiers (deliberately checked against the existing, structurally distinct `r23/a` "Protection Coverage" — that screen is a read-only, already-attached, past-order record; this one is a live, undecided, pre-purchase selection).
- **c** — "Notification Preferences": a settings screen for which notification categories a user receives (deliberately checked against the existing, distinct standalone "Notifications" feed screen, which shows notification history, not preferences) — explicitly assigned this round's generalization test of the catalog's established "dirty-state-derived band" mechanic (already used in two prior rounds, a settings-toggle screen and a list-reorder screen) in a third, structurally different domain, with the explicit instruction to use fresh variable/helper naming rather than reusing the prior implementations' code surface.

Macro-layouts were assigned to be mutually distinct regardless of band mechanic: a = pinned-preview + scrolling form, b = FlatList of comparison cards + always-mounted summary band, c = grouped SectionList of toggle rows + dirty-state band.

## 2. GENERATE

3 independent `general-purpose` Agent-tool subagents, run in parallel background, each given the full assembled brief (RN idioms, tokens, DNA, accessibility rules, and the bottom-band doctrine verbatim/summarized from [[GENERATION.md]], told explicitly to read the full source document themselves rather than trust only the summary), never pointed at bare file paths without the actual rule text inline. Each forbidden from reading sibling candidates' folders. No icon library is installed in this project — all 3 were told to use Unicode punctuation or geometric `View`s instead, never emoji.

Concept + brief-gaps files: `candidates/a.md`, `candidates/b.md`, `candidates/c.md`.

Freeze hash after GENERATE, before registration: `05de51ab38be663be2db5c454a454816140f5b9f`.

**Registration** (orchestrator, after all 3 designers completed, to avoid 3 parallel agents editing the same shared files): added imports + `COMPONENTS["evolve-r41-<v>"]` entries to `native/src/screens.ts`, and `check` strings to `native/screens.json` (`evolve-r41-a` → "Gift This Item", `evolve-r41-b` → "Protection Plan Picker", `evolve-r41-c` → "Notification Preferences").

## 3. HARD GATE

`node scripts/gate.mjs --target native --screens evolve-r41-a evolve-r41-b evolve-r41-c` — **12/12 clean on the first attempt for all 3 candidates, zero 1-fix loops, zero candidates dropped at this stage.** See `SCORES.md` for the full per-gate table and environment notes (this sandbox's `npx expo export` attempts a `cdp.expo.dev` telemetry connection the egress proxy refuses — non-fatal, the export itself completes successfully every time; `pkill` between candidates produced an anomalous shell exit code in this sandbox, worked around by using separate `dist-b`/`dist-c` output directories and separate ports instead of a kill-and-restart cycle).

Screenshots captured via Expo Web export + Playwright at 390×844 and 768×844 for all 3 candidates (no blank-frame detector exists for native, unlike the web pipeline's pixel-sampling check — file sizes spot-checked as a proxy, all non-trivial).

## 4. JUDGE PANEL

3 independent `general-purpose` Agent-tool subagents, blind (no access to concept files, SCORES.md, DECISION.md, or each other's reasoning), each given both 390px and 768px screenshots for all 3 candidates + full source paths + lens-specific criteria assembled from `GENERATION.md`.

### Lens 1 (DNA / GENERATION.md compliance) — full verdict
Ranking: **1st c, 2nd a, 3rd b.** Found **one confirmed rule violation**: candidate **a**'s delivery-method selection list (its primary, directly-selectable list — not a decorative sub-list) was rendered via `.map()` inside a `ScrollView` instead of `FlatList`, a direct violation of `GENERATION.md` §1's unconditional "리스트 → FlatList(.map() 대신 data/renderItem)" rule (`GiftThisItemScreen.tsx:265`, pre-fix). Everything else about a was judged clean: a genuine, well-fitted blocked-workflow-style validity-gated band, mutually-exclusive live regions, accurate `accessibilityHint`s, no hardcoded hex, no `₩`, no `accessible={true}` misuse. For **b**, found a doctrine *tension* (not a clean rule-text violation, since GENERATION.md doesn't explicitly forbid it): the screen's self-claimed "5th band form" is always-mounted with a live-updating label, but its sole primary action (`handleContinue`) is a literal no-op with zero observable effect — weighted heavily against b given §3's central test ("밴드는 개수가 아니라 그 밴드가 일을 하는지로 판정한다"). For **c**, found zero rule violations — correctly identified as the cleanest-fitting reuse of the established dirty-state band doctrine (the exact settings-toggle case the mechanic was already proven on), correct `SectionList` usage, single correctly-scoped live region. Lens1 also flagged, as a visual-only (non-sourceable) observation on c, that the rendered `Switch` thumb appears green in both screenshots despite the source correctly setting `thumbColor: tokens.color.bg` (white) — inferred as a react-native-web `Switch` polyfill limitation, not a code-level token violation, so not counted as a rule violation.

### Lens 2 (mobile app completeness) — full verdict
Ranking: **1st a, 2nd c, 3rd b.** All three judged to have believable flows and non-trivial default states. Strongest-defect-per-candidate: **a** — `recipientEmailIsFilled` only checks non-emptiness with zero email-format validation, even though the field's own accessibility hint promises the email will be used to notify the recipient / deliver a digital gift card — a real content-logic gap (garbage input like "asdf" passes validation and "sends" successfully) — **this became the round's LEARN delta**. **c** — the rendered `Switch` thumb renders green against the app's stated near-monochrome/indigo-accent DNA (same visual observation lens1 made, independently reached). **b** — `handleContinue` is a literal empty function; tapping the screen's one full-width, high-contrast primary CTA produces zero visible effect, which (independently of lens1's doctrine framing) lens2 judged as the single most serious "honesty of interaction" problem among the three candidates, since it's the screen's sole call to action and gives a sighted user no feedback at all.

### Lens 3 (screen-type differentiation) — full verdict
Ranking: **1st a, 2nd b, 3rd c.** Ran the mandated grep sweep over the full `native/src/evolve/` history and `screens.json`'s ~76-entry catalog before judging. **a**: clean — no "gift" screen exists anywhere in the catalog; its validity-derived band is a correct, domain-fresh application of an already-proven mechanic (3-round-independently-reproduced per GENERATION.md), not over-claimed as novel. **b**: confirmed, by directly reading `r23/a/ProtectionCoverageScreen.tsx`, that this round's "Protection Plan Picker" is genuinely distinct in kind (live pre-purchase decision vs. read-only past-order record) — the domain-overlap risk the brief flagged was handled correctly; judged the screen's self-claimed "5th band form" argument as not fully holding up under scrutiny (a modest variant of the documented "always-exposed action bar" form, not structurally distinct). **c**: found a real, **unacknowledged** partial domain overlap the candidate did not surface — `native/src/account/Preferences.tsx` already contains a "Notifications" section letting users configure push/email/new-match-alert settings, i.e. a less granular version of the same sub-domain under a different interaction model (apply-immediately vs. this round's batched dirty-state save/discard); correctly distinguished from the unrelated standalone "Notifications" feed screen, but did not address the much closer `account/Preferences.tsx` precedent. Band-mechanic legitimacy for c was otherwise judged clean (zero code-surface/variable-name overlap with either of the two prior dirty-state-band implementations, confirmed by grep).

### Aggregation
First-place votes: **a** 2 (lens2, lens3), **c** 1 (lens1), **b** 0. **Clean 2:1 majority for a** ("Gift This Item") — not a tie, no tie-break rule invoked, no no-winner votes from any lens.

## 3-1. Post-judgment fix (applied)

Lens1 found a **confirmed, machine-category rule violation** in winner **a**: the delivery-method option list was rendered via `.map()` inside a `ScrollView` instead of `FlatList`, directly violating `GENERATION.md` §1. Per skill §3-1 ("규칙 위반 해소에 한정"), this is squarely in scope for a post-judgment fix — it is a clean rule-text violation (not a taste/polish call like lens2's or lens1's own flagged tension on b), and the fix does not change any ranking-relevant behavior or copy.

**Fix applied**: converted the 3-item delivery-method list from inline `.map()` to a proper `FlatList` with `data`/`renderItem`/`keyExtractor`, using `scrollEnabled={false}` (the standard, documented pattern for a short, non-independently-scrolling `FlatList` nested inside the screen's single outer `ScrollView` — avoids the "nested VirtualizedLists" conflict a second independently-scrolling list would cause) and `contentContainerStyle` (not `style`) for the existing `gap` spacing, since `FlatList`'s `style` prop targets the outer wrapper while `contentContainerStyle` targets the actual flex container the rows render into. No visual, textual, or behavioral change — the `renderItem` body is byte-identical to the prior `.map()` callback body.

**Re-gated**: `node scripts/gate.mjs --target native --screens evolve-r41-a evolve-r41-b evolve-r41-c` → **12/12 clean** (new freeze hash: `4ca64da14302bc35344c0d5ad51a024ce37c7382`). Re-captured `a`'s screenshots at 390/768px and confirmed via direct `document.body.innerText` inspection that both the required render-check string ("Gift This Item") and all 3 delivery-option labels ("Ship directly to recipient", etc.) still render correctly post-fix.

**Ranking not recomputed**, per §3-1's explicit scope limit — the fix resolves a rule violation only and does not touch anything a ranking lens weighed.

**Not fixed** (out of §3-1's rule-violation-only scope, left as shipped, recorded as this round's LEARN delta instead): the email-format-validation gap lens2 found in winner a (a quality/content-logic finding, not a brief rule violation).

## 5. LEARN

One delta extracted from the winning candidate's own judging record (lens2's strongest-defect finding on the winner, independently reachable as a generalization of this catalog's existing web-side "copy must not overclaim beyond what's threaded" doctrine):

> A required contact field (e.g. email) that gates a band's primary action should be validated against its actual expected format whenever the screen's own copy or accessibility hint promises a concrete functional *use* of that field (e.g. "we'll use this to notify them" / "to deliver a digital gift card") — checking only non-emptiness while the UI claims the field will be programmatically used is a content-logic gap, not just a missing nice-to-have. The gate becomes fully satisfiable with garbage input, silently breaking the promised downstream behavior.

Appended as `auto-native-r41/a`, L1, provisional, confidence high — see `native-deltas-provisional.jsonl`.

A second finding — candidate b's `handleContinue` no-op primary CTA, independently flagged by both lens1 (as a §3 doctrine tension) and lens2 (as the round's most serious honesty-of-interaction problem) — is **not** appended as a separate delta, since b lost this round and the skill's LEARN step extracts specifically from the *winning* candidate's judging reasoning; it remains available as DECISION-only record for a future round if b's form is ever reassigned.

A third finding — lens3's confirmation that candidate c has a real, unacknowledged partial domain overlap with `account/Preferences.tsx`'s existing "Notifications" sub-section — is also not appended as a delta (c did not win, and the finding is specific to this round's candidate rather than a generalizable principle).

## 6. Reassign-queue
No entry added. Neither losing candidate (b or c) failed on a hard-gate rule violation — both lost on pure judgment grounds with a clean 12/12 hard gate, matching this project's established disposition that pure judgment losses (as opposed to hard-gate rule violations) are not reassign-queue candidates.

## 7. Questions-queue
No new entry this round.

## Canon integrity
`vault/00-principles/dash-brief-v3.md`, `design-principles.md`, `page-brief-core.md`, `page-brief-repo.md`, all type-profile briefs, `native/GENERATION.md`, `native/src/tokens.ts`, `/dash` gallery, `/v1`–`/v5` (and the real production catalog) — **untouched** throughout this round. `native-deltas-provisional.jsonl` — append-only, 1 new entry. `native/src/screens.ts` and `native/screens.json` were edited (registration of the 3 new evolve-round screens — this is the standard, expected per-round registration step for native, explicitly authorized by the skill's native-target parameters, not a canon edit). No commits to `main`; all work on `evolve/dash`.

## This completes both of this scheduled session's two requested rounds
Round 1: `auto-landing-r40`, winner b "Window, Not a Point" (2:1). Round 2 (this one): `auto-native-r41`, winner a "Gift This Item" (2:1, with one post-judgment rule-violation fix applied, ranking unchanged). 1 candidate dropped total across both rounds (round 1's landing candidate c, a hard-gate re-fail, queued to reassign-queue #16 with the exact fix). 0 no-winner rounds. Canon fully unchanged throughout both rounds.
