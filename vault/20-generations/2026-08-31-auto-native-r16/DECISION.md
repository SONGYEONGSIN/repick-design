# auto-native-r16 — DECISION

target: native · round: auto-native-r16 · date: 2026-08-31
frozen-state hash: `ae8872fe2e1c5cfe1859de2f1736422db9ece751` (unchanged from pre-gate freeze through judging)

Native cadence note: today is Monday (UTC), and this is the first round of a 2-round sequential `/dash-evolve 2` run — per SKILL.md §0 native weekly cadence, the first round of a multi-round weekday-Monday run is forced to `native` regardless of the unfilled-page-type queue (which was empty — all 18 `PAGE_TYPES` already have catalog entries).

## Candidates

- **a — Offer Comparison**: seller reviews 5 simultaneous buyer offers on one listing, sorts them, accepts exactly one (destructive — implicitly declines the rest) via a per-card inline Cancel/Confirm step.
- **b — Bulk Relist**: seller's stale-inventory list; multi-select via checkbox, batch "Drop price 10%" / "Bump to top" actions via a selection-driven contextual bottom bar (absent at 0 selected, appears with a live-region count announcement once selection > 0), followed by an undo affordance.
- **c — Report Listing**: buyer flags a problematic listing pre-purchase; single-select reason + optional detail text + submit, deliberately the lightest of the three (no multi-step band).

## Hard gate (§3)

`node scripts/gate.mjs --target native --screens evolve-r16-a evolve-r16-b evolve-r16-c` — **12/12 pass on first attempt, no 1-fix consumed.** See `SCORES.md`.

**Environment note (orchestration, not a skill/candidate issue)**: this sandbox had no cached `native/node_modules` at session start (installed via `npm install`), and the root `playwright-core@1.61.1` requests Chromium revision 1228 while the sandbox's pre-cached browser is revision 1194. `native/scripts/validate.sh` already supports a `PW_CHROMIUM_PATH` override, so gate + screenshot capture were run with `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`. No change to the skill or gate script was needed or made.

## Judge panel (§4) — screenshots at 390px/768px (single frame each — native screens, not scrolling pages), blind to concept notes

**Lens 1 (DNA / accessibility compliance) — ranking: c > b > a.** No hard violations in any candidate (no Korean copy, no hardcoded hex outside `tokens.ts`, no web `aria-*`, no non-determinism). All three correctly implemented a *different* bottom-band form matched to their own screen's need (a: per-card destructive Cancel/Confirm; b: selection-driven contextual bar; c: plain disabled→enabled submit, no manufactured multi-step). c ranked 1st for the cleanest live-region hygiene (exactly one, firing only on submit), for conditionally gating its `accessibilityHint` on the submit button's disabled state (a's equivalent hint is unconditional — a friction point), and for using zero glyph icons (a and b use `✓`/`–`/`✕` glyphs, which the lens flagged as friction under a literal "no emoji" reading, though GENERATION.md §3 explicitly permits vector/text icons — this reads as the lens being conservative, not a real violation). Lens1 also surfaced a real gap in **a**: sort controls stay enabled during the `"confirming"` stage, letting a user re-sort the list while a destructive per-card decision is pending — an interaction-lockout gap neither b nor c has an equivalent of. Not disqualifying (a still passed hard gate and this wasn't judged severe enough to move a below c), but worth carrying forward as a possible future delta if it reproduces.

**Lens 2 (commercial mobile-app completeness) — ranking: b > a > c.** All three are fully real end-to-end (no dead-end taps, no console.log-only handlers). b ranked 1st for the deepest, most mutually-consistent interaction surface: selection state is a genuine `Set`, sort actually reorders data (visually confirmed against the 768px frame's descending-days-listed order), both batch actions durably mutate the rendered list (strikethrough+badge / bumped-to-top), and undo restores exact prior values with the selection/undo bars kept strictly mutually exclusive. a ranked 2nd for its rigorous two-step destructive confirm with full state propagation (accepted/declined pills, disabled controls post-resolution) but has less interaction depth than b (one confirm flow vs. b's selection+two actions+undo). c ranked 3rd — also fully real (submit button label itself explains why it's disabled; confirmation echoes the actually-submitted reason/detail) but intentionally the shallowest, and its 768px layout leaves the most unused whitespace of the three.

**Lens 3 (screen-type / mechanism differentiation) — ranking: b > a > c.** b ranked 1st as the strongest new mechanism in the catalog: multi-select-then-batch-action with a bar that is a structurally exclusive state (not a boolean-toggled persistent bar) alongside a second, mutually-exclusive undo overlay — a real third bottom-band form beyond the established blocked-workflow state machine (verification/disputes) and persistent action bar (certificate). a ranked 2nd: genuinely different from the catalog's `offer-thread` (N-parallel-competing-offers-with-fan-out-decline vs. a single evolving 1:1 thread), and its per-card inline confirm relocates (rather than copies) the `payout` Cancel/Confirm vocabulary to a per-entity, in-a-list-of-competitors context — ranked below b only because the confirm micro-interaction itself is still recognizably built from that established vocabulary. c ranked 3rd: its own header comment frames its novelty entirely as what it *omits* (no blocked-workflow band) rather than a new mechanism it introduces; structurally it reads as a shorter version of the same radio-select+textarea+submit shape used elsewhere for user-authored feedback. Lens3 also flagged a shallow visual-shell convergence between **a and c** (both open with an near-identical non-interactive "listing preview" hero card) — noted but not weighted heavily since it's a shared card shell, not a shared mechanism.

## Aggregation

1st-place votes: **b = 2 (lens2, lens3)**, **c = 1 (lens1)**, **a = 0**. Majority (2 of 3) → **winner = b**, no tie-break exception needed (no complete 3-way split, no 2-way tie at 1st).

## 3-1 post-decision remediation

None needed — b passed hard gate 12/12 on first attempt and no lens flagged a rule violation in b (only the minor "friction" notes above, none of which are documented hard rules). No source changes made after judging; the judged artifact is the promoted artifact (hash unchanged: `ae8872fe2e1c5cfe1859de2f1736422db9ece751`).

## LEARN (§5)

See `auto-ledger.jsonl` append and `vault/00-principles/native-deltas-provisional.jsonl` append: the selection-driven contextual bottom bar is documented as a third valid bottom-band form (L1, provisional — first occurrence, no prior round established this pattern).

## Refinement gate (§6)

Loaded `native-deltas-provisional.jsonl` in full (29 prior entries, latest promoted item is the `auto-native-r14` accessibilityHint delta). No cluster or conflict with the new r16 delta — this is the first delta describing a selection-driven contextual bar; no reproduction yet, so it stays L1/provisional (reproduction threshold per `curation-criteria` "L2 패턴" is 2+ rounds). No conflicting delta pairs identified this round, so no new entry to `questions-queue.md`.

## Registration

Winner **b** registered as `evolve-r16-b` in `native/screens.ts` (`BulkRelistScreen`) and `native/screens.json` (`check: "Bulk Relist"`) on the `evolve/dash` branch — promotion to the permanent catalog slug happens only at `/dash-falsify apply`, per skill convention (this loop leaves it under the `evolve-r16-*` slugs).
