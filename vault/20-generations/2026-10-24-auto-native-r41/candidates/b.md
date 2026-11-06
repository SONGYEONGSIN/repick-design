# Candidate b — "Protection Plan Picker"

## Concept

A buyer-side, pre-purchase screen shown before an order is finalized. A fixed
item-summary card at the top (name + base price) gives context but is not
part of the decision. Below it, a single-select list of four mutually
exclusive options — "No protection plan" (the explicit, always-valid
baseline) plus three escalating paid add-on tiers, Basic / Plus / Premium —
lets the buyer compare coverage and pick exactly one. The "No protection
plan" option is both an *explicit 4th row* in the list (so it reads and
compares the same as the paid tiers, not as an absence) *and* the initial
selected state (so the screen opens in a valid, fully-decided state with no
forced choice). Selecting any row updates a bottom band that states the live
cost impact of continuing with the current pick.

## Band-form justification

The brief's four documented forms are: (1) blocked-workflow state machine,
(2) read-only completed-record action bar, (3) destructive-confirmation
band, (4) selection-count-derived contextual bar (mounts only once
`selectedCount > 0`). This screen's band fits none of them cleanly, and I
argue it is a **5th, distinct form: a selection-VALUE-derived, always-mounted
band.**

- Not (1): nothing is ever blocked. Continuing with "No protection plan" is
  always a complete, valid decision — there is no "why can't I proceed"
  sentence to write, so there's no state machine to build.
- Not (2): this is not a finished record to display. The selection is live
  and reversible until the buyer taps Continue.
- Not (3): nothing here is destructive; there's no delete/withdraw/cancel
  action to convert the band into a Cancel/Confirm pair.
- Not (4), and this is the one worth spelling out: form (4) mounts/unmounts
  on a *count* crossing a threshold (0 vs. >0) in a multi-select list where
  "nothing selected" is a real, distinct, bandless state. Here there is no
  such threshold and no bandless state — because "No protection plan" is
  itself a selected row, exactly one option is selected at all times, so
  `selectedCount` is always 1 and never 0. A band that mounted only when
  count > 0 would never unmount here, which makes "mounts on count > 0" the
  wrong description of what's happening. What actually varies is not
  *whether* a decision exists but *which* one does — the band's text and
  dollar amount are a pure function of the live selected option
  (`continueBandLabel(selectedOption)` in `data.ts`), re-evaluated on every
  selection, with no "saved" snapshot to diff against (ruling out the
  dirty-state-derived save/discard form too — there is nothing previously
  persisted here to be dirty relative to). So: always mounted (a decision
  always exists), content always live (which decision it is can always
  change) — a shape distinct from all five forms named in the brief.

## Tier bullet lists (escalating ladder)

- **No protection plan** — $0
  - Covered only by repick's standard buyer guarantee
  - No accidental-damage or loss coverage
- **Basic** — $4.99
  - 90 days of accidental damage coverage
  - 1 claim per coverage term
  - Standard repair turnaround
- **Plus** — $9.99
  - 1 year of accidental damage coverage
  - 2 claims per coverage term
  - Priority repair turnaround
  - Free return shipping on approved claims
- **Premium** — $19.99
  - 2 years of accidental damage coverage
  - Unlimited claims per coverage term
  - Priority repair turnaround
  - Free return shipping on approved claims
  - One-time no-questions-asked replacement

Each tier's bullets escalate the one below it on the same axes (coverage
window, claim count, turnaround), and each new tier strictly adds the
previous tier's bullets plus at least one new benefit — Plus adds free
return shipping on top of everything Basic has (at longer/more-generous
values), Premium adds a one-time replacement on top of everything Plus has.

## 브리프에 없던 것 (Brief gaps)

1. **Decide:** whether "No protection plan" should be an explicit 4th row,
   the implicit initial/deselected state, or both.
   **Decided:** both — an explicit row *and* the initial selection.
   **Why:** an explicit row lets it be compared on equal visual footing with
   the paid tiers (same card shape, same bullet format) instead of reading as
   "nothing happened yet"; making it the initial selection means the screen
   opens already in a complete, valid state, which keeps the single-select
   list a true radio group (always exactly one checked) rather than a
   three-item list with an ambiguous null state.

2. **Decide:** what `accessibilityState` key to put on each radio row
   (`selected` vs. `checked`), since RN's AccessibilityState type has both
   and ARIA convention for role="radio" is `aria-checked`.
   **Decided:** set both `selected: selected` and `checked: selected` on the
   same row.
   **Why:** the brief's own instructions explicitly asked for
   `accessibilityState={{ selected: ... }}`, but `checked` is the
   value assistive tech conventionally reads for a radio's on/off state —
   setting both satisfies the literal instruction while not giving up the
   more conventional semantic for screen readers.

3. **Decide:** how to represent the add-on price's accessibility semantics
   adjacent to the live band, given the repo's rule capping live regions at
   one active at a time.
   **Decided:** the band container alone carries
   `accessibilityLiveRegion="polite"`; only the one line of text that changes
   with selection carries `accessibilityRole="alert"`; the Continue button
   underneath gets its own static `accessibilityLabel`
   (`continueAccessibilityLabel`) computed from the same selection but is not
   itself the live region or the alert.
   **Why:** this keeps exactly one live-announcing element per interaction
   (the alert line), while still giving VoiceOver/TalkBack users the full
   "Continue with X plan added, $Y.YY" context when they land on the button
   by swiping, without stacking two simultaneously-announcing regions.
