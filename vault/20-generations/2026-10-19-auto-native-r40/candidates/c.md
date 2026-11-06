# Candidate c — Payout Method Order

A seller-side settings screen listing the seller's three linked payout methods
(bank, card, digital wallet) in a compact `FlatList`, each row showing a
masked identifier, a type tag, and — derived purely from position-in-array,
never a hand-set flag — a "Primary" badge on whichever method currently sits
first. Each row has explicit "Move Up"/"Move Down" buttons (disabled with a
visible disabled look at the ends of the list) instead of drag gesture
reordering. The screen applies the dirty-state band doctrine to this new
domain: no band is shown while the working order structurally matches the
last-saved order; the instant a reorder makes them diverge, a bottom band
mounts with an explanatory sentence, a primary "Save Order" action, and a
secondary "Reset" action — both of which actually mutate the working/saved
snapshots rather than just visually dismissing the band. A single shared
`accessibilityLiveRegion="polite"` status line near the top announces every
reorder, save, and reset, auto-clearing after a few seconds. A static
read-only explainer sentence sits beneath the list.

## Render-check string

Confirmed: the screen's top-level heading, rendered via
`accessibilityRole="header"` and visible on first paint with no scrolling or
interaction required, is the exact literal text `Payout Method Order`.

## 브리프에 없던 것 (What the brief didn't specify)

1. ① Whether "Reset" should announce anything at all, given the brief says
   Reset is a silent revert but leaves the lightweight-announcement call to
   me. ② I decided to announce "Reverted to last saved order" through the
   same shared live region. ③ For parity with Save Order's confirmation and
   with every reorder action already announcing — a sighted user sees the
   band disappear and the rows snap back, but a screen-reader user gets no
   equivalent signal unless something is announced; staying fully silent
   would make Reset the one state-changing action in the whole screen with
   no auditory feedback at all, which felt like an accessibility gap bigger
   than the minor redundancy of one extra phrase.

2. ① What literal masked-identifier strings and "kind" labels to invent for
   the three fixed payout methods (the brief only says "invent plausible
   masked identifiers... each with a type tag"). ② I used "Bank •••• 4821"
   / "Card •••• 7734" / "Wallet •••• 2290" with kind tags "Bank"/"Card"/
   "Wallet" and separate human-readable display names ("Primary Bank
   Account", "Debit Card", "Digital Wallet") used in copy and live-region
   announcements. ③ Splitting the terse on-row tag from a fuller display
   name let the live-region sentence read naturally ("Debit Card moved to
   position 2 of 3") instead of announcing a masked digit string, which
   would be harder to parse by ear.

3. ① Where exactly to draw the line between "Move Up"/"Move Down" being
   hidden vs. disabled-with-visible-look at the list ends (brief says
   "disabled/hidden appropriately... should be disabled with a visible
   disabled look, not just silently no-op" — slightly ambiguous about
   whether to hide one of the two buttons or show both, disabled). ② I
   always render both buttons on every row and simply disable (with a
   visibly dimmed/flat style, `accessibilityState={{ disabled: true }}`,
   and no promising `accessibilityHint`) whichever one doesn't apply at an
   end. ③ Keeping both controls always present keeps the row layout
   structurally identical across all three rows (no layout shift as items
   move to the ends), which reads as more stable/predictable for both
   sighted and screen-reader users than buttons that appear/disappear.

4. ① Exactly how long the live-region announcement should stay visible
   before auto-clearing (brief says only "a few seconds"). ② I used a fixed
   4000ms timeout, cleared and restarted on every new announcement, with
   cleanup on unmount. ③ Four seconds is long enough to be read by most
   screen readers/sighted users for a short sentence like "Primary Bank
   Account moved to position 1 of 3" without lingering stale state if the
   user reorders again quickly (the restart-on-new-announcement logic
   handles that case either way).

5. ① Where to place the static read-only explainer sentence relative to the
   list (brief explicitly left this as "your layout call"). ② I placed it
   as the `FlatList`'s `ListFooterComponent`, beneath the three rows, above
   where the band would mount. ③ Putting it after the actionable rows
   keeps the top of the screen focused on the thing the user can act on
   (reordering) and treats the explainer as supporting/contextual copy you
   read on the way out, which matches the "compact settings-style list,
   band as the only chrome" macro-layout note in the assignment.
