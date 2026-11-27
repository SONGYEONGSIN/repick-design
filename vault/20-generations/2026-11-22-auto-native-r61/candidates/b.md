# Candidate b — Manage Saved Payment Methods

One-line concept: A `FlatList` of a buyer's 4 saved payment methods (2 cards, a bank account, a repick Wallet balance) with exactly one "Default" indicator, where pressing "Remove" on any row turns that row itself into a live-region `Cancel`/`Confirm` pair — no persistent bottom band anywhere — and confirming removal of the current default auto-promotes the next remaining row, while removing the last method left is blocked by simply not rendering the control.

File: `native/src/evolve/r61/b/ManageSavedPaymentMethodsScreen.tsx` (default export), data in `native/src/evolve/r61/b/data.ts`.

For the orchestrator: import as
```ts
import ManageSavedPaymentMethodsScreen from "./evolve/r61/b/ManageSavedPaymentMethodsScreen";
```
and register under a key such as `"evolve-r61-b": ManageSavedPaymentMethodsScreen`. Suggested gate check-string: `"Saved Payment Methods"` (the screen's `accessibilityRole="header"` heading) or `"Remove"` (present on every removable row's affordance).

## Mechanism notes (why this satisfies the brief + open deltas)

- **No persistent bottom band.** The screen is a single `FlatList` with a `ListHeaderComponent` (title + subtitle) and a `ListEmptyComponent`; nothing is pinned outside the scroll content, and nothing resembling a state-machine band, a selection-count band, or a status action bar exists anywhere on screen.
- **Row-level destructive confirm, not a band and not an `Alert`/modal.** Pressing "Remove" sets a single `confirmingId` piece of state; the matching row re-renders its own body as a `Cancel`/`Confirm` pair in place. This is `GENERATION.md` §4's named banded→row generalization ("전역 게이트가 자연스럽지 않은 화면... 행 단위로 같은 전환을 쓴다"), applied fresh to this domain rather than reusing `r22/b`'s (Active Sessions) or `r58/b`'s (Mis-description Review Queue) code surface — different style-key vocabulary (`entry`/`entryConfirming`/`typeChip`/`defaultChip`/`confirmPanel`/`confirmMessage`/`confirmButtons`/`btnCancel`/`btnConfirm` vs. those screens' own names), different copy, different data shape, different edge-case policy.
- **Live-region singularity.** `confirmingId: string | null` is the only state that decides which row (if any) carries `accessibilityLiveRegion="polite"`. Requesting removal on a second row while a first is still mid-confirmation does not create two active live regions — it reassigns the single id, which silently reverts the first row and activates the live region on the new row. Documented explicitly in the screen's header comment as the chosen resolution of "decide and document whether you allow more than one row confirming simultaneously."
- **Live-region pairing.** The confirming row's container gets `accessibilityLiveRegion="polite"`; only the confirmation sentence `Text` inside it gets `accessibilityRole="alert"`. Nothing else on the screen claims a live region, satisfying "never more than one live region active at once across the whole screen."
- **No `accessible={true}` wrapper trap.** No `View`/`Pressable` wrapper anywhere sets `accessible={true}`; every row's buttons remain independently reachable leaf nodes.
- **No `accessibilityHint` no-op trap.** Every hint describes exactly what its handler does and nothing more: the plain Remove button's hint ("Opens a confirmation before removing this payment method") matches `requestRemove`, which only sets `confirmingId`; Cancel's hint matches `cancelRemove`, which only clears it; Confirm's hint ("Permanently removes this payment method from your account") matches `confirmRemove`, which filters the method out of state for real (and, for the default row, also promotes the next one — an additional real effect, never a contradicted promise).
- **State reachability is real, not styled-but-inert.** `confirmRemove` performs an actual `Array.filter` plus (conditionally) an actual `isDefault` reassignment via `.map`; `cancelRemove` performs an actual `setConfirmingId(null)` that is the exact state the confirming view reads. Both paths are exercised by normal taps, not dead code.
- **Determinism.** All payment-method data in `data.ts` is literal; no `Math.random`, `Date.now`, or argumentless `new Date()`. The "next default" promotion always picks the first remaining row in fixed seed order, not any runtime-derived choice.
- **Currency rendering.** Follows `GENERATION.md` §1's resolved guidance: the wallet balance is written `KRW 48,000` (Latin "KRW" prefix) rather than using the `₩` glyph, sidestepping the glyph-collision issue entirely rather than relying on spacing/nesting workarounds that were twice falsified.
- **Tokens only.** All colors come from `tokens.color.*` (including `tokens.color.danger`/`dangerBg`/`dangerBorder` for the destructive styling), spacing from `tokens.space(n)`, radii from `tokens.radius.*`. No hardcoded hex.
- **RN core only, no Expo/navigation APIs.** Imports are limited to `View`, `Text`, `Pressable`, `FlatList`, `SafeAreaView`, `StyleSheet` from `react-native`, matching this screen's isolated/non-navigator rendering context.

## 브리프에 없던 것

1. **① Which 4 payment methods to use, and in what order.**
   ② 2 cards (Visa ending 4471 — default, expires 08/28; Mastercard ending 2290, expires 02/27), 1 bank account (Kookmin Bank account ending 7730, checking account), and 1 repick Wallet balance (KRW 48,000, "Available balance").
   ③ Matches the brief's own suggested shape ("2 cards + a bank account + a wallet balance") while giving the wallet a name consistent with the rest of the codebase's brand ("repick"), and choosing masked numbers that don't collide with any specific real-looking sequence.

2. **① What happens when the row being removed is the current default — the brief explicitly leaves this as "your call."**
   ② Auto-promote: the confirmation sentence itself names which remaining method will become the new default (the first one left in list order), and pressing Confirm performs exactly that promotion in the same state update that removes the row. Removing a non-default row never touches `isDefault` on any other row.
   ③ Chose auto-promotion over "block removal of the default" because blocking would require either a disabled button (risking the "inert styled button" trap the open deltas explicitly warn about) or an extra forced step ("pick a new default first") that the brief doesn't ask for and that would reintroduce a blocked-workflow state machine — which this screen's band-form explicitly must NOT be. Auto-promotion keeps every action real and keeps the screen a flat list with no gating step.

3. **① What to do about removing the very last remaining payment method, since auto-promotion has nothing to promote to.**
   ② Blocked, but not via a disabled/inert button: when only one method remains, that row's "Remove" control is not rendered at all, and is replaced by a static explanatory note ("This is your only saved payment method. Add another before you can remove it.").
   ③ Chose "don't render the control" over "render it disabled" specifically because of this target's own open delta about declared-but-unreachable states and about never leaving a styled-but-inert `Pressable` for the user to puzzle over — removing the affordance entirely when it genuinely cannot act is more honest than disabling it.

4. **① Whether more than one row should be allowed to sit in a confirming state at the same time, since the brief raises this as an open question.**
   ② Restricted to exactly one row confirming at a time: a single `confirmingId` is the only state that drives which row shows its Cancel/Confirm pair, so requesting removal on a new row implicitly and silently cancels whichever row was previously confirming.
   ③ The simplest resolution that guarantees, by construction rather than by extra guard logic, that at most one `accessibilityLiveRegion="polite"` container is ever active screen-wide — directly satisfies the "never more than one live region at once" rule without needing to reason about edge cases where two rows might both be mid-confirmation.

5. **① What each row's "type chip" and secondary line should say for a wallet, which has no card network or expiry.**
   ② Wallet row uses `kindLabel: "Wallet"`, title `"repick Wallet"` (no masked number, since a wallet has nothing to mask), and a `meta`/`balance` pair ("Available balance" / "KRW 48,000") rendered as a distinct two-part baseline-aligned line with `tabular-nums`, instead of forcing it into the same "title + masked last-4" shape used by the card/bank rows.
   ③ The brief itself distinguishes "last-4 or balance" as alternatives, so the data model and row layout treat them as genuinely different row shapes (`balance?: string` optional field) rather than faking a last-4 for the wallet or faking a balance for the cards.

6. **① Copy tone for the confirmation sentence and for the header subtitle.**
   ② Plain, factual, second person ("Remove Visa ending 4471 from your saved payment methods?" / "Manage the cards, bank account, and wallet balance saved to your repick account."). No urgency language, no exclamation points, no "Are you sure?" filler.
   ③ Matches the DNA's "service-grade restraint" instruction and the existing catalog's tone (e.g. `ActiveSessionsScreen`'s subtitle), and keeps the sentence short enough to read naturally as a screen-reader alert without sounding alarmist for what is, for 3 of the 4 rows, a low-stakes removal.

7. **① Whether to add any footer affordance (e.g. an "Add new method" row) below the list, since several catalog screens in this domain include one.**
   ② Omitted entirely — the list simply ends after the last row.
   ③ The brief's hard requirement is "NO persistent bottom band at all," and while a scrolling (non-pinned) footer technically isn't a "band," adding an "Add new card" `Pressable` with no real add-flow behind it would recreate exactly the kind of no-op-affordance risk the open deltas warn about. Leaving it out keeps every interactive element on the screen real.
