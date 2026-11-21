---
round: auto-native-r25
candidate: a
domain: Trade-In Appraisal
files:
  - native/src/evolve/r25/a/TradeInAppraisalScreen.tsx
  - native/src/evolve/r25/a/data.ts
export: named `TradeInAppraisalScreen` + `export default TradeInAppraisalScreen` (same file also default-exports it, matching r24/c convention)
heading: "Trade-In Appraisal"
---

# Concept

A buyer hands an item (photos already taken elsewhere in the app) to Repick itself for
trade-in credit instead of listing it for peer-to-peer sale — a live, pre-submission appraisal
intake screen with a running estimated-credit readout, gated by a blocked-workflow bottom band
that names and jumps to the exact unresolved item (down to a single disclosure question, not
just "the condition section").

# 브리프에 없던 것 (decisions the brief didn't specify)

1. **Which item is being appraised, and its category.**
   ① Decided: a Sony WH-1000XM4 headphones unit, with a Brand/Category line and 4 read-only
   photo thumbnails already "synced from your listing draft."
   ② Why: the brief explicitly says photos were "already taken elsewhere in the app" — I treated
   that as the photo-manager/listing-draft flow upstream of this screen, so this screen only
   *displays* them (no capture/retake affordance), avoiding re-implementing `photo-manager`
   (r23/c) or `listing`'s photo step. Headphones gave me a natural, concrete set of
   functional-vs-cosmetic disclosure questions (power on, ANC/audio, physical damage, missing
   cable) rather than a generic "item," which is what actually drives an appraisal disclosure
   flow.

2. **What exactly blocks submission, and in what order.**
   ① Decided: three ordered checkpoints — (a) all 4 condition-disclosure questions answered
   (yes/no, not a must-be-true checklist), (b) a drop-off method chosen (mail-in kit vs. store
   drop-off), (c) a payout preference chosen (store credit vs. bank transfer) — checked in that
   order so the band always points at the single most-upstream unresolved item.
   ② Why: this is the "blocked-workflow bottom band state machine" the assignment mandates
   (GENERATION.md §3). I modeled the ordering the same way `SellerVerificationScreen`
   (`native/src/verification/SellerVerificationScreen.tsx`) orders its 3 steps, but rebuilt the
   state names/control-flow from scratch (`holdUp` not `blocking`, `revealCheckpoint` not
   `jumpTo`, `dockedBar*` not `band*`) per the explicit instruction not to reuse those exact
   identifiers, since GENERATION.md documents that literal code-surface reuse (not just
   conceptual reuse) is what gets a screen penalized (r18/c).

3. **How "jump to the specific unresolved item" is implemented mechanically.**
   ① Decided: a plain `ScrollView` + per-row `onLayout` offset capture (`checkpointY` ref map) +
   `scrollTo`, rather than `FlatList.scrollToIndex` (which the verification screen uses for its
   3 top-level step cards).
   ② Why: my "items" are not uniform top-level list rows — one checkpoint is a single question
   nested a few sections down, so a flat list index doesn't address it. `onLayout` on each
   candidate row, as a *direct* child of the ScrollView's own content (rows/section-groups are
   siblings in the tree, not wrapped in an extra padded card), keeps the reported `y` in the same
   coordinate space as `scrollTo`'s target, without needing `measureLayout`/`findNodeHandle`
   (avoided due to new-architecture ref-typing uncertainty I couldn't verify without `tsc`).

4. **Estimate math (how condition answers translate to a credit number).**
   ① Decided: a fixed base range (₩81,000–96,000), with a fixed KRW deduction per unfavorable
   answer (₩40,000 / ₩15,000 / ₩12,000 / ₩6,000, largest for "doesn't power on"), floored at
   ₩15,000, and a 10% multiplier if the buyer picks store credit over bank transfer.
   ② Why: needed *some* deterministic, non-random function of the disclosure answers so the hero
   "Estimated Credit" readout is genuinely live/derived state (not decorative), per the "rich,
   complete, production-feeling screen" requirement. All constants are literals in `data.ts`
   (`estimateRangeKrw`), no `Math.random`.

5. **₩ glyph handling.**
   ① Decided: in the prominent hero figure (`CreditFigure`), split `₩` and the digits into
   sibling `Text` nodes with `marginRight: 3` on the `₩` node, `fontVariant: ["tabular-nums"]`
   only on the digits node. Everywhere else (band subtitle, per-question deduction line) I wrote
   `KRW 40,000` instead of the symbol.
   ② Why: GENERATION.md's own corrected note (2026-08-24) says the earlier "sibling node" and
   "nesting depth" theories were both falsified by a controlled experiment (`r11`) — the actual
   fix is *visual space* between `₩` and the digits (a marginRight gap or the literal `KRW`
   spelling), and `tabular-nums` was cleared as unrelated. I followed `r24/c`'s existing
   `Price` component pattern for that spacing convention (same technique, new component name
   `CreditFigure`, extended to a low–high range) since it already demonstrates the validated gap.

6. **Whether a destructive/undo action belongs on this screen at all.**
   ① Decided: yes — once filed, a "Withdraw request" link converts the docked bar into a
   Cancel/Confirm (`Keep it` / `Withdraw`) two-button row in place, inside the same
   `accessibilityLiveRegion="polite"` container, rather than a native `Alert`.
   ② Why: GENERATION.md §4 generalizes this pattern beyond the band it was first validated on
   (`r13/a`) to "any surface needing confirmation," and the catalog's `both`-platform row
   "확인 다이얼로그 — 파괴적 행동 전 확인" applies here (withdrawing a submitted appraisal is the
   one destructive action this domain has). Reusing the *band* as the confirm surface (rather
   than inventing a separate confirm banner) keeps a single live region on screen.

7. **Accordion vs. flat scroll for the multi-section form.**
   ① Decided: a flat, always-expanded `ScrollView` of sections (no collapse/expand), unlike
   `SellerVerificationScreen`'s accordion-of-cards structure.
   ② Why: partly to keep the direct-children `onLayout` offset math simple and correct (see #3),
   and partly to keep this screen's code surface visibly different in shape from the existing
   verification screen it otherwise shares a "blocked workflow" doctrine-form with — same *kind*
   of band, different screen structure around it.
