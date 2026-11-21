# Candidate c — Locker Pick

Check string: "Select a Pickup Locker"

A buyer who bought a secondhand item chooses exactly one secure locker, from a
short list of ~5 nearby options, to pick it up from. Each row is a
radio-style choice (name, address, distance, hours, live availability); one
row is deliberately "Currently full" to exercise a selectable-disabled state.
The screen is anchored by a persistent bottom band that is always on screen —
unlike a selection-count bar, which only appears once something is picked —
because exactly one locker must eventually be chosen no matter what. Before
any pick, the band is a plain, non-actionable sentence telling the buyer a
locker must be chosen below. The moment a locker is tapped, the SAME band
flips to a real "Confirm pickup at <name>" button, computed fresh every
render from `selectedLockerId` (never a second "confirmed" flag). Pressing
Confirm sets `reservedLockerId`, which finalizes the screen: the band becomes
a read-only "Pickup locker reserved" summary with no button, and every row —
including the one that was reserved — becomes non-interactive, signaled by
`accessibilityState.disabled` plus a changed accessible label ("Reserved for
this pickup" / "Unavailable — a locker has already been reserved for this
order") instead of a bare dimmed look. A single `accessibilityLiveRegion="polite"`
container around the band, paired with `accessibilityRole="alert"` on the one
headline `Text` inside it, announces every transition: none → selected →
switched → reserved.

## Brief gaps

- **Gap:** GENERATION.md names three band forms (state-machine, persistent
  action bar, selection-count bar, destructive-confirm) but none of them is
  "always-visible single-choice band that later locks into a read-only
  receipt." I had to decide which family this belongs to and how its
  terminal phase should look.
  **Decision:** Built it as its own fourth variant: always-visible from the
  start (like the persistent action bar), content-reactive to a single id
  (unlike the count bar, which is absent at zero), and ends in a read-only
  terminal phase that is NOT a state-machine (no "jump to next unresolved
  point" — there is nothing left unresolved after one confirm) and NOT the
  completed-record persistent bar (that bar stays actionable forever; this
  one permanently retires its action after one use).
  **Why:** Directly instructed by the assignment text itself ("document this
  distinction explicitly... since GENERATION.md doesn't name this exact band
  variant") — this is an arbitrary-but-reasoned synthesis of the existing
  rules rather than a copy of any one of them.

- **Gap:** How to signal that list rows are "read-only" after confirmation,
  since GENERATION.md requires this be decided and documented but doesn't
  specify the mechanism.
  **Decision:** Every row's `Pressable` gets `disabled={true}` (so `onPress`
  cannot fire at all, not just visually) plus `accessibilityState.disabled`,
  and each row's `accessibilityLabel` is rewritten per row — the reserved row
  says "Reserved for this pickup", every other row says "Unavailable — a
  locker has already been reserved for this order" — rather than leaving the
  original selection-phase label in place under a disabled flag.
  **Why:** Matches the DNA rule that a label must change the instant an
  affordance becomes unavailable, not just dim while keeping old text —
  applied here to every row, not only the single always-available action it
  was originally written for.

- **Gap:** Whether the "Currently full" row needs its own distinct visual
  treatment from a normal disabled-after-confirmation row, since both end up
  non-interactive.
  **Decision:** Kept them visually identical (same dimmed card style) but
  accessibility-distinct: the full row's label/hint always says "full" and
  never changes with screen phase, while post-confirmation rows' labels
  change specifically to reference the reservation. The reserved row itself
  gets an accent-tinted treatment distinct from both.
  **Why:** Arbitrary but deliberate choice to keep visual language minimal
  (single accent, near-monochrome DNA) while keeping the two different
  "why can't I pick this" reasons distinguishable only where it matters —
  to a screen reader, not visually.

- **Gap:** Units/format for distance (no currency involved, so the Won-sign
  rule doesn't apply, but GENERATION.md gives no guidance on numeric
  locker-distance formatting).
  **Decision:** Plain decimal miles ("0.4 mi away") with `fontVariant:
  ["tabular-nums"]` for column alignment across rows.
  **Why:** `tabular-nums` is explicitly called out as safe to use freely in
  GENERATION.md §1 for any numeric column, not just currency — arbitrary
  formatting choice, no existing screen to pattern-match against.

- **Gap:** Whether switching the selection before confirming should reuse a
  Set (as a multi-select list might) or a single scalar.
  **Decision:** Single `string | null` for `selectedLockerId`; selecting a
  new row simply overwrites it, which automatically deselects the previous
  row with no extra bookkeeping.
  **Why:** Directly follows the assignment's explicit instruction ("plain
  single id in state, not a Set") for this domain, since the choice is
  inherently single-select (exactly one locker, not a set of lockers).
