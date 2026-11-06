# Candidate c — Bundle Deal Builder

A seller taps 2+ of their own active listings in a two-column grid to combine them into one discounted bundle offer, watching the selected count and the live-computed bundle price update together in a contextual bar that only exists once at least one item is selected.

## Brief gaps

1. ① The ₩-glyph treatment to pick. ② Used a plain space between ₩ and the digits (`₩ 42,000`) via a shared `formatWon` helper, rather than sibling-node separation or nesting-depth (both already falsified) or switching to `KRW` notation. ③ Brief §1 explicitly lists this as one of three acceptable deliberate choices; a bare space is the simplest one that still keeps the familiar ₩ symbol for the Korean marketplace audience.

2. ① How the bundle discount itself should scale, since the brief only says "sum minus a discount" without specifying the schedule. ② Made it a step function of the selected item count — 10% at 2 items, 14% at 3, 18% at 4+, 0% below 2 — implemented as `bundleDiscountRateForCount(count)` in `data.ts`, consumed by `computeBundleQuote`. ③ Arbitrary but deliberately *not* a flat rate, so the live-updating price visibly reflects more than just a sum changing, and it's a pure function of fixed inputs (never a hand-typed number equal to a precomputed sum) per brief §5.

3. ① What "Create Bundle" should actually do, since no bundle-review/checkout screen exists yet for it to navigate to. ② Made it a real local action: pressing it increments a session "drafts started" tally (shown in the header once > 0) and raises a cleared live-region cue naming the exact item count and price, but does NOT clear the current selection or navigate anywhere. ③ Brief §4 forbids an `accessibilityHint` promising navigation that won't happen; keeping the action's effect fully truthful (and non-destructive to the in-progress selection) was safer than fabricating a hint or a no-op button.

4. ① Whether the persistent count/price line and the transient alert cue should share one live region or two. ② Put both inside the single `quoteBar` View's one `accessibilityLiveRegion="polite"` container — the status line always narrates current count/price, and the alert-role cue only appears at the exact moment the 2-item eligibility threshold is crossed (in either direction), then self-clears after ~4.2s. ③ Brief §3/§4 require exactly one live region with the transition sentence carrying the `alert` role inside it, never two competing regions.

5. ① Grid layout vs. single-column list for the listing picker, since the brief only said "a FlatList of their listing cards." ② Chose a 2-column `numColumns` grid with a compact tile (swatch block + checkbox ring overlay) instead of a single-column list. ③ Deliberate differentiation per the judging brief (lens3) from the r36 payout-review screen's single-column requirement-card list and from the catalog's generic list patterns — a picker grid reads structurally differently while still being a real FlatList.

CHECK_STRING: Bundle Deal Builder
