# Candidate b — Mis-description Review Queue

Check string: "Mis-description Review Queue"

A seller-side triage screen for a short queue of their own listings that buyers have flagged as
"doesn't match description." Each of the five rows carries the listing's title, price, the buyer's
flag-reason snippet, and the date it was flagged. There is no bottom band of any kind: above the
`FlatList`, a sticky counter band ("X of 5 reviewed") sits fixed under the screen title and never
scrolls, reporting live progress but never becoming an action surface. The real work happens entirely
inside each row. "Dismiss" resolves the row immediately (non-destructive — nothing is lost, the
listing stands as-is). "Relist with corrections" is the consequential, destructive-feeling path: it
flips the row itself, in place, into a local `Cancel`/`Confirm` pair with its own `polite` live region,
so the archiving warning is announced scoped to that single row — never a native `Alert`, never a
screen-wide announcement. Once every row is dismissed or relisted, the counter band's text changes to
"All reviewed" and stays inert: there is no further screen-level action to gate, because the per-row
buttons already did all the work. This is a deliberate test of two underused shapes together: a sticky
*top* progress readout (not a bottom band) paired with a genuinely band-less terminal state.

## Brief gaps

- **① Which Won-rendering option to pick.** ② Used latin `KRW` notation ("KRW 45,000") for every
  price. ③ Arbitrary choice among the three brief-sanctioned options; picked `KRW` because the
  snippet-heavy rows already carry dense quoted text, and a bare `₩` glyph next to another number
  (the flag count) risked visual clutter — not because of any rendering defect.

- **① Whether "Dismiss" needs its own Cancel/Confirm flip like "Relist" does.** ② Only "Relist with
  corrections" gets the row-flip confirmation; "Dismiss" resolves on a single tap. ③ The brief's
  destructive-confirmation rule targets actions that are "destructive-feeling" (withdrawing funds,
  deleting); dismissing a flag changes nothing about the listing itself, so treating it as equally
  destructive would manufacture friction the brief doesn't ask for. Only the archiving action — which
  removes the live listing — gets the confirmation surface.

- **① Whether multiple rows can be mid-confirmation at once.** ② Chose independent per-row state (any
  number of rows may be in `confirming_relist` simultaneously; opening one doesn't collapse another).
  ③ Arbitrary implementation choice explicitly left open by the assignment; a single shared
  `Record<id, status>` already gives each row independent state for free, so constraining it to "only
  one open at a time" would have added logic with no stated benefit.

- **① Whether the sticky counter band needs its own live region.** ② Left it as a plain reactive
  `Text`, with no `accessibilityLiveRegion`/`alert` on the counter itself. ③ The brief caps live
  regions to avoid redundant/competing announcements, and the per-row confirmation text is already the
  announced transition point; the counter is a passive readout, not a gate or a state-machine
  transition, so a second announcement source would be surplus to the brief's a11y intent.

- **① What counts as "reviewed" for the header tally.** ② Both `dismissed` and `relisted` count;
  `needs_review` and `confirming_relist` do not. ③ Matches the assignment text verbatim ("dismissed or
  relisted both count as reviewed"); `confirming_relist` is excluded because the decision isn't final
  until `Confirm` is pressed — counting it early would let the header claim progress that could still
  be cancelled.
