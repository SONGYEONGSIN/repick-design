# Candidate a — Price Match Request

## Concept

A single scrollable buyer screen for requesting a price match: the top holds a
short form (pick one of four fixed reasons, paste a link/reference to the
cheaper identical listing, add an optional note), and the same screen's list
below — rendered in the same `FlatList`, via its `ListHeaderComponent` for the
form — shows the buyer's past requests with a status badge (pending /
approved / denied), surfacing the denial reason inline when one exists. A
bottom-fixed action band is driven by an explicit five-state machine
(`needsBothFields` / `needsReason` / `needsEvidence` / `readyToSubmit` /
`requestConfirmed`) rather than one disabled boolean: each blocked state has
its own one-sentence explanation of what's missing, the primary button only
enables in `readyToSubmit`, and pressing it moves the whole screen into a
`requestConfirmed` state — the new request is prepended into the visible
history list and the band swaps to a confirmation panel with a "Submit
Another Request" control that resets the machine back to its initial state.

## Render-check string

`Price Match Request`

(rendered via `accessibilityRole="header"` as the screen's top heading in
`PriceMatchRequestScreen.tsx`)

## 브리프에 없던 것 (What the brief didn't specify)

1. **What counts as the "short fixed list" of reasons, and how many.**
   Decided on exactly four: "Identical listing, lower price elsewhere",
   "Lower price plus free shipping", "Price dropped after I purchased",
   "Coupon or bundle makes it cheaper elsewhere". Arbitrary but grounded in
   how real price-match policies (e.g. retail price-match programs) actually
   carve up disputes — distinct enough to matter for a reviewer's decision,
   short enough to stay a single scannable list with no search/filter needed.

2. **Whether the gate's named states should map 1:1 to "disabled vs
   enabled" or be more granular.** The brief only requires reason-selected
   AND evidence-non-empty as the enabling condition, but explicitly asks for
   "a real state machine with named states, not a single disabled/enabled
   boolean." Decided to split the blocked condition into three distinct named
   states (`needsBothFields`, `needsReason`, `needsEvidence`) so the one
   required sentence can be precise about which field is still missing,
   rather than one generic "fill out the form" message for all three cases.
   This is a direct reading of the "real state machine" requirement, not
   something the brief spelled out numerically.

3. **What happens after a successful submit, concretely.** The brief says the
   band must "transition to a submitted/confirmation state" but doesn't say
   whether the new request should appear in the history list below, or
   whether the form should be revisitable afterward. Decided: (a) the newly
   confirmed request is prepended into the same `historyRecords` array the
   `FlatList` renders, so the buyer immediately sees their own submission
   land in the list with "Pending review" status — this closes the loop the
   form→list layout implies; (b) added a "Submit Another Request" secondary
   action in the confirmed-state band that clears the form and returns the
   machine to its initial blocked state, since a terminal screen with no way
   back felt like a dead end for a form buyers may use more than once.
   Arbitrary UX decision, not dictated by the brief.

4. **Whether evidence/reference needs a shape beyond "non-empty."** The
   brief says "non-empty" is the only validation rule for evidence. Decided
   not to add URL-format validation or require a specific prefix (e.g. must
   start with "http") — kept it a free-text reference field accepting either
   a pasted link or a plain description of a screenshot, since the brief's
   own framing ("attach a screenshot/link reference") implies either form is
   valid, and over-validating would contradict that.

5. **Whether to show a claimed/cited price value on the form or in history
   rows.** The brief's §1 ₩-glyph note hints a price might appear but also
   says "you likely won't need currency at all... it's about a reference
   link/evidence, not money." Decided to omit any price/amount field
   entirely — the evidence field and reason are the only claim made by the
   buyer, consistent with the brief's own steer, and it avoids inventing a
   number that would need its own validation story.

6. **Radio-selection visual idiom for the reason picker.** RN has no built-in
   radio control. Decided on a bordered row with a custom circular indicator
   (outer ring + filled inner dot on selection) plus `accessibilityRole=
   "button"` and `accessibilityState={{ selected }}` — following the same
   selectable-chip accessibility pattern already used elsewhere in this
   codebase for category filters, rather than attempting `accessibilityRole=
   "radio"`/`"radiogroup"`, whose cross-platform RN support is inconsistent.

7. **Where exactly the one permitted live region sits, and what text carries
   the `alert` role.** The brief says one live region on the screen container
   and `alert` only on the transition text node. Decided to put
   `accessibilityLiveRegion="polite"` on the action-band's outer `View` and
   `accessibilityRole="alert"` only on the single status-sentence `Text`
   inside it (the one line that changes meaning as the gate state changes) —
   not duplicated on the confirmation badge or button labels, which are
   static once rendered in a given state.
