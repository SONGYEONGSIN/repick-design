# auto-native-r28 · candidate c

## Concept

A **Shipping Protection Claim Receipt** — a read-only record of an already-resolved
shipping-damage insurance claim (partially approved), showing the final payout, the
per-finding adjuster ruling, and a reconciled damage-assessment ledger, with a
persistent bottom action dock (`Email Receipt` / `Contact Support`) instead of a
blocked-workflow state machine.

Files:
- `native/src/evolve/r28/c/ShippingProtectionClaimScreen.tsx`
- `native/src/evolve/r28/c/data.ts`

## Render-check string

```
Shipping Protection Claim
```
This is the screen's `accessibilityRole="header"` title text, always visible in the
default render (no interaction required).

## Rules applied

- **Read-only completed-record band form (§3)**: no state-machine "why blocked" band —
  the claim is already closed, so the fixed bottom dock is a persistent action bar with
  two real actions, not a disabled/blocked gate.
- **Both dock actions are genuinely implemented, not toasts**:
  - `Email Receipt` → `setReceiptSent(true)` renders an honest confirmation sentence
    ("Receipt sent to j***n@example.com") backed by real component state; label flips to
    `Resend Receipt` afterward, reflecting the new state truthfully.
  - `Contact Support` → `setSupportOpen` toggle expands a real panel of support contact
    rows (phone/email/hours) — not a no-op, and no accessibilityHint claims anything the
    handler doesn't do.
- **Exactly one live region**: `accessibilityLiveRegion="polite"` is on the dock's message
  area only (the hero figure never changes on user action, so it is not wired as a live
  region); `accessibilityRole="alert"` is only on the post-send confirmation `<Text>`.
- **No `accessible={true}` on any wrapper with interactive children** — the dock, button
  row, and support panel are plain `View`s; the one `accessible` flag used (`outcomeChip`)
  wraps only a `<Text>`, no nested `Pressable`.
- **Live-recomputed hero value**: `computeApprovedAmount(claim)` in `data.ts` sums each
  finding's `findingCoveredAmount` (assessedValue × coverageRate), subtracts the
  deductible, floors at zero. The same functions back the itemized ledger below the
  hero, the "Covered subtotal" line, and the "Approved coverage" total line, so the
  headline figure ($675) and the breakdown arithmetic ($420+$260+$70+$0 = $750, −$75 =
  $675) are provably the same computation, not independently hand-typed strings.
- **Tokens only**: all colors/spacing/radius via `tokens.color.*` / `tokens.space()` /
  `tokens.radius.*`; outcome/ruling tone colors use `tokens.color.success/warning/danger`
  (+ `*Bg`/`*Border`) rather than inventing hex values.
- **Determinism**: no `Math.random`, `Date.now`, or bare `new Date()` — all dates/amounts
  are fixed labels/values in `data.ts`, with the payout figure computed deterministically.
- **RN idioms**: `SafeAreaView` → `ScrollView` + fixed bottom dock `View`; all text in
  `<Text>`; `Pressable` for both dock actions with visible pressed-state styling
  (`dockButtonPressed`); touch targets ≥44×44 (`minHeight: 48`, `hitSlop`).
- **Own vocabulary**: style keys (`dock`, `ledgerCard`, `ledgerRow`, `heroPanel`,
  `outcomeChip`, `supportPanel`, `dockMessageArea`, …) and function names
  (`computeApprovedAmount`, `findingCoveredAmount`, `outcomeTone`, `rulingTone`) are
  original to this screen, not reused key-for-key from `certificate/` or any other
  catalog screen.

## Brief gaps

- **① No named adjuster/claimant identity was specified.** ② Decided to keep the
  reviewer field generic ("Loss & Damage Review Desk") and mask the on-file email
  (`j***n@example.com`) rather than inventing a realistic-looking full name or account
  number, since this is dummy data for a design mock and masking avoids it reading as a
  real person's PII.
- **① The brief didn't specify how many damage findings or what deductible logic to use.**
  ② Chose 4 findings spanning all three ruling states (fully covered, 50% partial,
  excluded) plus a flat $75 deductible subtracted once from the covered subtotal, so the
  screen demonstrates the full reconciliation story (why the hero figure isn't simply the
  declared value) rather than a trivial single-line claim.
- **① Brief allowed either "Email Receipt + real confirmation" or "Contact Support +
  real panel" as the required real action, plus optionally a genuine no-op second
  affordance.** ② Implemented both actions as fully real (state-backed confirmation, and
  a real expanding content panel) rather than leaving a no-op placeholder, since a second
  genuine affordance seemed stronger than an intentionally non-functional one here.
- **① No icon library is installed (`package.json` has no vector-icon package).** ②
  Used no icons at all — status is communicated via the `outcomeChip` tone color (always
  paired with explicit text) and section labels, avoiding both emoji and homemade glyph
  substitutes.
