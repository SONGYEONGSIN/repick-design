Check string: "Negotiation History"

# Candidate c — Negotiation History

`native/src/evolve/r45/c/NegotiationHistoryScreen.tsx` (default export) +
`native/src/evolve/r45/c/data.ts` + `native/src/evolve/r45/c/components.tsx`

## Concept

A read-only, chronological ledger of every past price offer/counteroffer
the current user has sent as buyer, across *different* items — distinct
from `offer-thread` (a single still-live back-and-forth negotiation on one
item) and from the evolve catalog's `offer status` screen (the current
status of one offer): this is the aggregate historical record across many
already-resolved negotiations, not a workspace for any one of them. Macro
layout is a flat, most-recent-first `FlatList`, one row per negotiation —
no grouping, no filter UI, since this is a record screen rather than a
management tool. Each row shows the item name, "Your offer," "Seller
countered" (or "No counteroffer from seller" when none came back), "Final
price" when the deal closed, a status badge (text-labeled, success/danger/
warning/neutral token families only), and the offered/resolved dates.

Band mechanic: per GENERATION.md §3's read-only-record carve-out, nothing
here is a blocked workflow waiting on the user (every row already carries
a final status), so there is no `statusFor()`/`jumpTo()` state machine and
no `bandBlocked*`/`bandReady*` family. The bottom `ActionBar` is always
mounted and does one genuinely working thing: it toggles the ledger's sort
order between "Most recent first" (default) and "Highest offer first,"
re-sorting the on-screen `FlatList` data via `useMemo` — a real, visible
state change, not a decorative label. See brief-gap #4 below for why this
action was chosen over the brief's other suggested example (jumping to a
currently-open live negotiation).

No wrapper has `accessible={true}`; rows contain no nested `Pressable` at
all (they are plain record cards — the spec's "don't imply history is
editable" rule), so the hazard the brief warns about does not arise. The
action bar's `accessibilityHint` names only the sort mode a press will
actually switch to, never a promise the handler doesn't keep. The action
button is 44pt-tall with `hitSlop={8}`. All item names, offer amounts,
counter amounts, final prices, statuses and date labels are literals in
`data.ts`; no `Math.random`, no `Date.now()`, no bare `new Date()` —
`offerDateLabel`/`resolvedDateLabel` are pre-formatted strings.

## Brief gaps

1. **① What the bottom action bar's one real action should be, given the
   brief's own example ("jump to your currently-open/live negotiation if
   one exists") assumes cross-screen navigation.** ② Implemented a local,
   self-contained action instead: a sort-order toggle (recency ↔ highest
   offer) that re-sorts the already-rendered `FlatList`. ③ This screen
   component takes no navigation prop and is rendered standalone (same as
   every other evolve screen in this catalog, per `r44/a`/`r44/c`'s own
   shape) — faking a "jump to offer-thread" button with no actual
   navigation target to call would be exactly the no-op/decorative action
   §3 forbids. A sort toggle is real, local, and verifiably changes the
   screen's rendered output, so it satisfies "one real, functional action"
   without pretending to have a nav stack this component doesn't own.

2. **① Which five statuses map to which of the four token color
   families (success/danger/warning/neutral), since there are five
   statuses but only four families.** ② `accepted`→success, `declined`→
   danger, `expired`→warning, `countered-then-expired`→warning (same
   family as `expired`, different label), `withdrawn`→neutral (plain
   `border`/`muted`, no dedicated "neutral" token exists in `tokens.ts`).
   ③ The brief explicitly requires pairing every badge with a text label
   and says color need not be unique per status as long as it's never
   color-only; `expired` and `countered-then-expired` are semantically
   siblings (both end with no deal and no further seller action), so
   sharing warning-family color while keeping distinct text ("Expired" vs.
   "Countered, then expired") was the closest fit to the existing
   success/danger/warning palette rather than inventing a new hue.

3. **① Whether "seller never countered" rows (declined outright,
   expired, withdrawn) should render a blank/omitted line or an explicit
   one.** ② Render an explicit "No counteroffer from seller" line instead
   of silently omitting the row. ③ A missing line next to rows that do
   show "Seller countered: $X" would read as a layout glitch rather than a
   deliberate state; an explicit line keeps every row's shape predictable
   for a ledger that's meant to be scanned chronologically.

4. **① Currency formatting, given the brief's ₩/tabular-nums warning.**
   ② Used plain `$` (USD) throughout, never `₩`, so the warning's hazard
   doesn't apply and `tabular-nums` could be used freely on every amount.
   ③ Simplest way to sidestep a documented rendering artifact entirely
   rather than work around it mid-text-run.

5. **① How many past negotiations to seed and what status mix.** ② 8
   records: 3 accepted, 2 declined, 1 expired, 1 withdrawn, 1
   countered-then-expired, spanning Jul–Oct 2026. ③ Brief asked for 6-8
   spanning "a few different statuses"; used the maximum of that range and
   covered all 5 named statuses at least once so every badge/label
   variant is exercised by the gate's rendered output.
