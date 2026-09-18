# auto-native-r22 — DECISION

Target: native · Round: 22 · Date: 2026-09-18
Freeze hash: `8f4247e29f736462b94d4041224e77cb031b179a` (unchanged since hard gate — no post-freeze edits before judging)

## Candidates
- **a** — Return & Refund Request (buyer-facing) — blocked-workflow band (items → reason → photos)
- **b** — Active Sessions (account security) — no fixed band, per-row inline destructive-confirm
- **c** — Consignment Drop-off Scheduling (seller-facing) — blocked-workflow band, open-hours-derived slots

All 3 candidates survived the hard gate (12/12, see SCORES.md — c needed one blockedBy-exempt 1-fix for a `RefObject<View|null>` tsc error; a/b were never at fault).

## Judge panel (3 independent blind agents, general-purpose — see §0-0 deviation note below)

### Lens 1 — DNA compliance: **b, a, c**
All three are RN-idiom-clean, token-clean, English-only, deterministic, and implement a valid band-form. Ranking driven by accessibility-content completeness:
- **b (1st)**: destructive-confirm rule implemented almost verbatim (no `Alert`, row converts in place, single live region enforced by a global `activeId`/`activeStatus` invariant), explicit in-file rationale for the no-band choice and for avoiding `accessible={true}` on nested-Pressable rows, no hint/label mismatches found.
- **a (2nd)**: clean blocked-workflow implementation, one minor gap — `ItemRow`'s `accessibilityLabel` omits the visible `Qty {item.qty}` text (low severity here since all qty=1 in the fixture, but a citable content-loss omission, `ReturnRequestScreen.tsx:430` vs `:449-451`).
- **c (3rd)**: clean determinism/tokens/copy, but `StatusBand`'s `Pressable` sets an explicit `accessibilityLabel` while a sibling `detail` Text — which in the `confirmed` phase carries the confirmation code itself — is a separate child of that same accessible Pressable, so RN's default subtree-collapse under an explicit label likely hides the code from screen readers (`StatusBand.tsx:39,43,55,64-79`). Judge flagged this as a reasoned inference from documented RN/VoiceOver/TalkBack behavior, not a runtime-verified defect (this exact Expo/RN version wasn't cross-checked against `native/AGENTS.md`'s "Expo HAS CHANGED" pointer).

### Lens 2 — Mobile completeness / commercial polish: **a, c, b**
All three fully real, no decorative dead controls anywhere.
- **a (1st)**: fullest state lifecycle of the three — a genuine three-dimensional gate (items/reason/photos) with a live computed refund estimate (`estimateRefundFor`, sums price×qty over only selected items), a real jump-to-unresolved affordance, and the *only* candidate modeling a submitting→success loading cycle (spinner then success message).
- **c (2nd)**: slot derivation (`deriveSlots`) is a genuinely computed pure function (open-hours ÷ slot length, minus booked slots) not a hardcoded list; closed/full states are truly non-tappable, not just dimmed; confirmation code is a real deterministic derivation from the selections. Loses a notch to a only because confirmation is instantaneous — no loading/submitting state before the code appears.
- **b (3rd)**: everything present works correctly (real state removal, non-removable current device, careful exclusivity/unmount edge cases), but narrowest scope of the three — a single interactive verb with no computed/aggregate value comparable to a's refund estimate or c's slot math, and no loading state anywhere.

### Lens 3 — Screen-type differentiation: **b, a, c**
- **b (1st)**: clearest structural departure — deliberately no bottom band at all (band-shaped gating relocated to a per-row 3-state machine with an exclusivity rule bands don't need), reuses the *principle* from `payout`'s Cancel/Confirm-conversion but relocates it from band-level to row-level, and is explicitly differentiated in its own header comment from the chrome-less "Saved Searches" pattern (that one has no destructive-confirm mechanic at all).
- **a (2nd)**: reuses the blocked-workflow band *principle* (shared with verification/disputes/condition/pickup) but composes it from a genuinely new heterogeneous row-type mix (checkbox → radio → dynamic photo-chip list) plus domain-specific live-refund math not present in any checklist-gate screen in the catalog.
- **c (3rd, flagged as the round's highest novelty risk — as the GENERATE brief anticipated)**: the slot-derivation math is genuinely new, but the felt interaction shell — pick-primary-option → pick-secondary-option, both gated by an explain-and-jump band, then confirm — reads very close to `pickup` (carrier/window selection, itself a physical-logistics scheduling flow). The judge noted this as the closest call in the round and could not directly diff c's band against pickup's actual source (out of scope per the blind-judging read list), so the verdict rests on the one-line catalog description of pickup's shape, not a code-level comparison.

## Aggregation
1st-place votes: **b = 2 (lens1, lens3)**, **a = 1 (lens2)**, **c = 0**.
Not a complete 3-way tie (no 1-1-1 split, no 2+ no-winner votes) — plain majority applies per §4. `curation-criteria`'s "차별성↔완성도 상충 시 완성도 다수결" tie-break does **not** apply here: that rule covers archetype-lens-alone vs. a united brief+polish majority; this round's split is brief(lens1)+archetype(lens3) together against polish(lens2) alone — the inverse combination, not covered by that precedent.

**Winner: b — Active Sessions.**

## §0-0 deviation note (self-judged flag — required disclosure)
This environment has no custom `designer`/`comparator`/`frontend-design-specialist` agent personas installed (`~/.claude/agents/` does not exist). All 6 generation/judging agents (3 designers, 3 judges) were dispatched as genuinely separate, independently-launched `general-purpose` Agent-tool instances with disjoint, blind prompts (judges could not see each other's output or the designers' concept `.md` files). This satisfies the invariant the skill's §0-0 check exists to protect — independent blind agents producing and separately judging the candidates, not one session doing both — but does not literally match the skill's assumption of a dedicated `comparator` persona. Not marking `self_judged: true` in the ledger, since the actual failure mode that flag exists for (one session generating AND judging with no separation) did not occur; recorded here for transparency in case a future reviewer weighs this differently.

## Post-judgment fixes
None needed — winner b had no rule violations flagged by any lens (hard-gate 1-fix on candidate c during §3 does not affect judging, since c did not win).

## §5 LEARN
Appended 1 new L1 delta to `native-deltas-provisional.jsonl` (round `auto-native-r22`, variant `b`): the destructive-confirm-conversion idiom (established at band level by `auto-native-r13`) generalizes to per-row scope on screens with no natural global gate, provided an explicit single-active-row exclusivity invariant is added to preserve the existing single-live-region rule. See delta entry for full text/evidence.

## §6 Refinement gate
- Clustered against the full native-deltas history (41 prior entries reviewed during RETRIEVE). This round's new delta is a genuine extension of the existing band-level Cancel/Confirm-conversion pattern (r13, L2/promoted) to a new placement scope (row-level) — it does not contradict or duplicate any existing entry, and is a first occurrence (not yet a 2-round reproduction), so it stays **L1, provisional**. No level re-bump this round.
- No conflicting delta pairs found (this round's delta touches destructive-confirm placement; no other open delta addresses row-level confirm scope).
- No forced question generated — no conflict pair and no meta-criteria-unjustifiable claim in this round's delta or DECISION.
- Lens1's `c`-candidate accessibility finding (StatusBand `accessibilityLabel` likely collapsing sibling `detail` text, including the confirmation code, from screen readers) is **not** promoted to a standalone delta this round, per skill §5's scope (one delta extracted from the *winner's* reasoning only). It is recorded above in this DECISION for visibility; if a future round reproduces a `Pressable` explicit-`accessibilityLabel` + sibling-Text-with-consequential-content pattern, that reproduction is the trigger to open a delta/question for it.

## Unchecked scope (aggregated from all 3 judges)
- No judge ran/compiled the code — all logic claims are from static reading.
- Screenshots only captured each screen's default/initial state at 390/768px — mid-interaction states (confirming rows, highlighted jump targets, filled photo slots, confirmed bands) were read from source, not rendered pixels.
- Lens3 did not have read access to `verification`/`disputes`/`condition`/`pickup`/`payout` source (by design, to avoid breaking the "don't open cataloged files" instruction) — its c-vs-pickup shell comparison rests on the one-line catalog description, not a direct diff.
- Lens1's c-band accessibility-collapse finding is a reasoned inference from documented RN default-accessibility behavior, not a live VoiceOver/TalkBack verification against this repo's pinned Expo/RN version.
- No judge verified runtime performance/re-render behavior beyond noting `useMemo`/`useCallback` presence.
