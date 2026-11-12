# Candidate b — Saved Shipping Addresses

**One-line concept:** A seller's saved shipping addresses list where each row independently shows normal / pending-verification / locked-primary status, and tapping "Remove" turns the row itself into an inline Cancel/Confirm pair (or, for the primary address, into a plain-language explanation) instead of popping a native alert.

## 브리프에 없던 것

- **Domain details for the 6 addresses:** label, recipient name, street line, city/state/zip, and phone for each of the 6 entries were invented (Home/locked, Office/normal, Weekend Studio/verifying, Parents' House/normal, Warehouse Pickup/verifying, Old Apartment/normal). Chose a consistent recipient ("Priya Natarajan") across most rows plus one different recipient ("Anand Natarajan") on "Parents' House" to make the data feel like a real saved-address book rather than a single-person toy set, while keeping every value a fixed literal (no randomness).
- **What "verifying" looks like visually:** gave it a distinct pending badge (`warning` token family: `warningBg`/`warningBorder`/`warning` text) reading "Verifying", separate from the `locked` row's "Primary" badge (`accentBg`/`accent`). The brief said "show a pending/in-progress treatment" but not its exact look.
- **Per-row live-region copy:** the brief forbids copying an existing screen's exact hint/explanation templates, so I wrote fresh sentences for all three states:
  - locked base: "Primary address. New orders ship here unless a different address is chosen at checkout."
  - verifying base: "This address was recently changed and is pending verification. Delivery confirmations are on hold until it clears."
  - normal base: "Saved address. No pending changes."
  - locked delete-attempt: "This is your primary address, so it can't be removed from here. Set a different saved address as primary first, then return to remove this one."
  - normal/verifying delete-confirm prompt: "Remove {label}? This can't be undone."
  - cancel: "Removal canceled. This address was kept."
- **Edit button behavior:** the brief only specified the delete/3-state logic. I kept "Edit" present on every row (including the locked one, since editing the primary address is reasonable — only *deleting* it directly is restricted) but gave it an empty `onPress={() => {}}` and no `accessibilityHint`, so it doesn't falsely promise a navigation flow that doesn't exist in this static candidate.
- **Header "Add address" action:** not specified in the brief at all beyond "a header-level 'Add address' action is fine and expected." Made it actually functional — it appends one new deterministic address (fixed template: "100 Harbor Way, Seattle, WA 98101", recipient "Jordan Lee") to the list each press, with the label suffix ("New Address", "New Address 2", …) derived only from the current row count — so it stays fully deterministic (no `Date.now`/`Math.random`) while still demonstrating the action does something.
- **What happens on confirmed delete:** rather than leaving a lingering "removed" message, the row is filtered out of the list immediately on Confirm. The brief didn't specify end-state behavior after a successful delete.
- **Minimum-one-row edge case:** since the locked/primary row can never be removed directly, the list can never go fully empty, so no empty-state UI was needed — left unhandled intentionally rather than building a speculative empty state the brief never asked for.

## Render-check string confirmation

Exact string **"Saved Shipping Addresses"** appears verbatim as the screen's `accessibilityRole="header"` title text, so it is present in `document.body.innerText`.

## Export

- Path: `native/src/evolve/r34/b/SavedAddressesScreen.tsx`
- Named export: `SavedAddressesScreen` (also re-exported as the module's `default` export)
- Supporting data: `native/src/evolve/r34/b/data.ts` (`initialAddresses`, `newAddressTemplate`, `AddressRecord`, `AddressStatus` types)
