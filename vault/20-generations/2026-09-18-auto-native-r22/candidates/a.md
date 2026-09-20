# Candidate A — Return & Refund Request

## Concept

A buyer-facing "Return & Refund Request" screen for a past order, built as a single
scrollable `FlatList` (item checklist → reason picker → per-item photo evidence)
capped by a fixed bottom band that implements the blocked-workflow state machine:
while any of the three requirements is unresolved, the band shows a real sentence
naming exactly what's missing (e.g. `Add a photo of the issue for "Leather jacket ·
Schott 618" before you can submit.`) and tapping it calls `scrollToIndex` to jump the
buyer straight to that unresolved row, with a 2.4s highlight ring so they can find it.
Photo evidence is a genuine gate, not cosmetic: `itemsMissingPhoto` is derived every
render from `photosByItemId`, and the band's `status` literally cannot become
`"ready"` while any selected item has zero attached photos. Above the checklist, a
proof card is visible from the very first render, before any interaction: estimated
refund (recomputed live per selected item), days left in the 14-day return window
(fixed at 5, computed from fixed order dates, no `Date.now()`), and an "N/M items
have photo evidence" counter — so the screen's core value (what you'd get back, how
urgent it is, how much evidence is still owed) is never gated behind filling out the
form. Tapping "Submit return" when ready plays a fixed 700ms `submitting` state with
a spinner, then a `submitted` success state that locks every row and reads back a
confirmation sentence, all announced through one `accessibilityLiveRegion="polite"`
wrapping the band's message text.

## 브리프에 없던 것

**1. Exact return reason list (5 options + their one-line hints)**
① The brief named 5 reason *categories* loosely ("e.g. not as described, wrong item,
damaged/defective, changed mind, counterfeit concern") but not final labels or the
explanatory hint text under each.
② Kept the 5 categories verbatim as labels and wrote one hint sentence per reason
(e.g. "You suspect the item may not be authentic" for counterfeit concern).
③ Arbitrary choice, staying literally inside the brief's own example list rather than
inventing a 6th reason or renaming any of them.

**2. Per-item photo requirement (one photo per selected item, not one photo total)**
① The brief said "attach required photo evidence" but not whether evidence is
one-photo-per-order or one-photo-per-returned-item.
② Chose per-item: each selected line item gets its own photo slot and must reach
≥1 photo before the band can go ready.
③ Arbitrary choice, made to maximize realism (a multi-item damaged/defective claim
plausibly needs separate photographic proof per item) and to give the "jump to first
unresolved" band mechanic a concrete, per-item target to scroll to.

**3. Photo cap of 3 per item and the "Add photo"/counter simulation mechanic**
① The brief allowed a deterministic placeholder for "attach photo" but didn't specify
a max count or what state it flips.
② Modeled it as `photosByItemId: Record<itemId, number>`, capped at 3, incremented by
tapping "Add photo" and decremented by a per-chip "Remove" button; the button
disappears once the cap is hit.
③ Arbitrary choice — 3 felt like a realistic upper bound for a returns claim (front,
back, defect close-up) without needing a real max-count decision engine.

**4. Return window numbers (14-day window, delivered Sep 9, "today" Sep 18, 5 days left)**
① The brief didn't give an order, a delivery date, or a return-window length.
② Fixed all of it as constants in `data.ts`: 14-day window, delivered Sep 9 2026,
today pinned at Sep 18 2026 (matches the session date), giving 5 days left, computed
as `returnWindowDays - daysElapsedSinceDelivery` rather than hardcoding "5" directly.
③ Arbitrary choice, kept deterministic per the brief's ban on `Date.now()`/argumentless
`new Date()` — used fixed labels and a pure subtraction instead of any date math.

**5. Currency rendering: "KRW 480,000" instead of "₩480,000"**
① The brief's ₩-glyph section offered three explicit options (gap-before-digits,
"KRW" label, or accept as-is) and left the choice to me.
② Chose option (b), the "KRW" label, for every price on this screen.
③ Followed the brief's own listed option directly — avoids the glyph-crowding
question entirely and reads unambiguously in an English-only screen.

**6. "Estimated refund" is price × qty per selected item, no restocking/fee deduction**
① The brief didn't say whether the refund estimate should net out any return
shipping cost, restocking fee, or condition-based deduction.
② Computed it as a straight sum of `price * qty` over selected items, and added the
caption "before any restocking check" so it doesn't overpromise the deducted amount.
③ Arbitrary choice for scope control — modeling a fee/deduction schedule wasn't asked
for, and the disclaimer text keeps the number honest rather than silently wrong.

**7. Bottom-band copy, priority order among the three blockers, and style-key names**
① The brief mandates the state-machine *principle* but explicitly forbids reusing
other screens' style key names or stock phrasing like "Tap to go there," and doesn't
say which of the three unresolved conditions (no items / no reason / missing photos)
should take priority when more than one is true at once.
② Wrote fresh copy per state (e.g. "Check off at least one item below before you can
request a return.", "Ready to submit — review the N item(s) above, then send your
request."), named styles `bandBlockedState`/`bandReadyState`/`bandSubmittedState`
(deliberately different from the forbidden `bandBlocked`/`bandBlockedTitle`/etc.), and
ordered priority as items → reason → photos (the natural order the buyer fills the
form in, top to bottom).
③ Arbitrary choice for both copy and priority order, constrained by the brief's
explicit "don't copy verbatim" instruction; top-to-bottom priority was chosen so the
jump target always matches the next thing the buyer would naturally reach anyway.

**8. Submit flow: 700ms simulated "submitting" spinner, then a locked "submitted" state**
① The brief's blocked-workflow form only specifies the band's blocked and
ready/submit states, not what happens visually after the buyer taps "Submit."
② Added a `submitting` state (fixed 700ms via `setTimeout`, not random) with an
`ActivityIndicator`, then a `submitted` state that disables all rows (visually via
`rowDisabled`/opacity) and shows a confirmation sentence through the same live region.
③ Followed the general a11y checklist elsewhere in the brief ("loading states are a
spinner, never a frozen UI"; "success gives visible feedback"), which implied this
even though the return-specific section didn't spell it out.

**9. Highlight-ring duration (2.4s) and jump `viewPosition` (0.25) on band tap**
① The brief says the band "jumps to" the first unresolved item but not how long any
visual cue should persist or where onscreen the target row should land.
② Set the highlight ring to auto-clear after 2.4s (or immediately on user interaction
with that row) and `viewPosition: 0.25` so the jumped-to row lands a quarter of the
way down the visible list, clear of the band.
③ Arbitrary choice, picked so the highlight reads as a temporary "here's your answer"
cue rather than a permanent marker, and so the row doesn't land hidden behind the
band or scrolled clean off the top.
