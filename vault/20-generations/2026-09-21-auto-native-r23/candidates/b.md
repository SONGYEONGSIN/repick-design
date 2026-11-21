# Candidate b — Saved Payment Methods (row-scoped destructive-confirm)

A settings screen listing the buyer's saved cards and linked payout bank account, letting them set a default and remove an instrument. Removal uses the row-level destructive-confirm-conversion idiom: tapping "Remove" on a row converts that row in place into a Cancel/Confirm pair (no native `Alert`), since the screen has no single natural bottom-band gate — each row is its own removable unit, same principle `sessions` established for login sessions, adapted here to payment instruments with fresh copy and a payout-specific empty/default-missing state.

Default export component: PaymentMethodsScreen (file: PaymentMethodsScreen.tsx)
Check string (exact visible text on initial render): "Payment Methods"

## 브리프에 없던 것

① Whether removing the current default payment method should auto-promote another method to default.
② Decided not to auto-promote: instead, when no method is marked default, a small dismissible-free notice banner ("No default payment method is set…") appears above the list, and the user must explicitly tap "Set as default" on another row.
③ Auto-promoting silently would hide a state change from the user (their money-moving default) without confirmation, which conflicts with the deliberate, visible-confirmation spirit of the destructive-confirm idiom this screen is built around; an explicit notice keeps the choice visible and user-driven instead of an invisible side effect of a delete action.
