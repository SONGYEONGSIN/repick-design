# r47 candidate b — Store Credit Top-Up

One-line concept: a prepaid-credit purchase-package picker — the buyer taps one fixed-price package tile ($10/$25/$50/$100, the two larger ones carrying a fixed bonus), a bottom band derived straight from `selectedPackageId !== null` appears naming that package's price and credit amount, and tapping the band advances to an inline confirm step before the (stubbed) purchase.

## 브리프에 없던 것

1. ① Exact package tiers and prices.
   ② Four tiers: $10 → $10.00 credit, $25 → $27.00 credit, $50 → $56.00 credit, $100 → $115.00 credit.
   ③ Arbitrary but modeled on a real convention: gift-card/store-credit top-ups commonly give a bonus at higher tiers to reward prepaying (same mechanic as e.g. game-store wallet top-ups). The brief only gave "e.g. $10/$25/$50/$100-equivalent" with no bonus rule, so the bonus schedule itself (0 / 8% / 12% / 15%) is my invention, kept as fixed deterministic literals in `data.ts`.

2. ① Number of tiles / grid shape.
   ② Exactly 4 tiles, laid out as a 2x2 `FlatList` grid (`numColumns={2}`).
   ③ Arbitrary, chosen to match the brief's own four example price points and to give a genuine (if small) reason to use `FlatList` with `numColumns` rather than a bare `.map()`, per the brief's "virtualize with FlatList" instruction.

3. ① What "a simple confirm step" means mechanically.
   ② Implemented as a local `step: "select" | "confirm"` state on the same screen (no navigation out). Tapping the band in `step==="select"` swaps the main content to a static confirm summary (package, price, bonus, credit added, current balance, new balance) and the band itself swaps its sentence/buttons to `Confirm & Buy` + `Change package`, reusing the one live-region container instead of mounting a second one.
   ③ Convention, reusing this codebase's already-documented destructive-confirmation idiom of "the band converts itself into a two-button row inside the same live region" (GENERATION.md §3, `r13/a`), adapted here to a non-destructive select→confirm transition rather than cancel/confirm-destructive, since the brief said "tapping it proceeds to a simple confirm step" without specifying the mechanism.

4. ① Whether "Confirm & Buy" does anything.
   ② Left as a deliberate no-op stub (no payment backend exists in this static demo) with no `accessibilityHint` attached, per §4's rule against hints that promise an action the handler doesn't perform.
   ③ Reference: GENERATION.md §4, the `r14/c` vs `r8/b` precedent — omit the hint rather than fabricate a real destination.

5. ① Whether to show any existing balance at all, given "Wallet & Transaction History" is explicitly excluded.
   ② Added one static `CURRENT_BALANCE_CENTS` constant (fixed at $4.50) shown only on the confirm step as "Current balance" / "New balance" context for the math — no transaction list, no history, no ledger.
   ③ Arbitrary value, included because a top-up screen without any sense of "balance you're adding to" reads as incomplete; kept deliberately minimal (two static lines, not a screen section) to stay clear of the excluded wallet/ledger concept.

6. ① Copy wording for headings/subtitles/tile labels/accessibility strings.
   ② "Top Up Store Credit" (header 1), "Confirm Store Credit Purchase" (header 2), tile sublabel "Get $X.XX credit", bonus badge "+$X.XX bonus", band sentences as written in the component. All written fresh for this screen.
   ③ Arbitrary, written to satisfy the required literal "Store Credit" render-check substring while staying plain/service-grade per §3 (no theatrical language, no emoji).

7. ① Style/key naming to avoid literal collision with other band-family screens (`r41/b`'s `band`/`bandLine`/`continueButton`, `r42/c`'s `selectedPlanId` family, etc).
   ② Used a distinct, screen-specific prefix throughout: `creditBand`, `creditBandSentence`, `tile`/`tileSelected`, `confirmCard`/`confirmRow`, `proceedButton`, `changeButton`. State variable named `selectedPackageId` (matches the exact name given in the assignment brief itself) and `CreditPackageTile`/`ConfirmRow` as fresh component names.
   ③ Per GENERATION.md §3's L2 rule that code-surface key-name collision (not just conceptual-pattern reuse) is what the differentiation lens flags — so names were written fresh rather than copied from sibling catalog files.
