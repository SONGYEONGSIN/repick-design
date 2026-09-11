# Candidate b — Bundle Listing Builder

One-line concept: a seller picks any number (0, 1, 2, …) of their own active listings into a
combine-and-discount bundle; a bottom bar exists only while the pick is non-empty and its one
live region re-announces the running count plus the live-computed bundle price and discount every
time the selection changes — a selection-driven contextual bar (band form 3), not a
blocked-workflow state machine, since there is no sequential gate to unblock.

## Files
- `native/src/evolve/r19/b/BundleBuilderScreen.tsx` — screen component (default export
  `BundleBuilderScreen`).
- `native/src/evolve/r19/b/data.ts` — deterministic dummy data: `ACTIVE_LISTINGS` (8 items) and
  `INITIAL_PUBLISHED_BUNDLES` (1 pre-existing bundle so the "Published bundles" section isn't
  empty on first load).
- `native/src/evolve/r19/b/pricing.ts` — pure discount/pricing math, split out because it's logic
  with no React or dummy-data dependency: `tierDiscountPercent()` (the growing-discount formula),
  `computeBundleTotals()`, and `discountLadder()` (used to render the reference ladder in the
  header from the same formula instead of retyping it).

Check-string "Build a Bundle" is the screen's `accessibilityRole="header"` title, rendered
unconditionally at the top of the `FlatList`'s header — present with 0 items selected, no
scroll/interaction required.

## Brief gaps
Things the brief left for me to decide, and what I chose:

- **Discount formula shape.** The brief asks for "a real tiered discount — e.g. discount % grows
  with item count, computed not hardcoded" but doesn't specify the curve. I chose a simple linear
  formula with a cap: `0%` for 1 item, then `+6` percentage points per additional item, capped at
  `24%` (so 2→6%, 3→12%, 4→18%, 5+→24%). Chosen over a hardcoded per-count map so the same
  function generalizes to any selection size without a lookup table — arbitrary but stated as a
  named constant (`PERCENT_PER_EXTRA_ITEM`, `MAX_DISCOUNT_PERCENT`) in `pricing.ts` rather than a
  magic number, and documented inline with the exact resulting table for the first few counts.
- **Minimum cardinality to actually publish.** The brief says the bar "appears once
  selectedCount > 0" and doesn't gate the bar's existence on a minimum — I kept that literally: the
  bar mounts at 1 item. But a single item isn't a "bundle" by definition and the discount formula
  already returns 0% at count 1, so I disabled the `Publish Bundle` button (not the whole bar)
  until `pickedCount >= 2`, with the live-region text at exactly 1 item nudging
  "Add one more item to unlock a bundle discount" instead of showing a stale/zero price line. I
  judged this a real domain constraint (you can't publish a 1-item "bundle"), not an invented
  blocked-workflow gate — there's no multi-step sequence or "jump to the unresolved item"
  mechanic, just one button's enabled state following a simple, honestly-stated rule. Considered
  instead allowing publish at 1 item (a "bundle of 1" listing at 0% off) but that seemed like a
  contradiction of the screen's own name.
- **What "Publish Bundle" actually does.** The brief doesn't specify a destination screen (there
  isn't one to build in this scope). I made it a real, visible, in-screen action rather than a
  no-op or a lying hint: it computes the final totals from the current selection, prepends a new
  entry to a "Published bundles" list below (with a real `accessibilityHint` describing exactly
  that, since it's true), and clears the selection — which is what makes the bar unmount
  afterward. No undo affordance was added afterward, matching the brief's "mutually exclusive with
  any undo affordance" instruction for this band form.
- **New bundle's id/title generation.** No backend to assign these, so I used a `useRef` sequence
  counter seeded from the initial published-bundles array length, incremented on each publish
  (`bundleSeq.current`) — deterministic and stable across renders, same pattern
  `native/src/relist/BulkRelistScreen.tsx` uses for its `bumpRank` counter, not
  `Date.now()`/`Math.random()`.
- **₩ formatting.** Per GENERATION.md §1 this is an explicit free choice. I used option (a) — a
  literal space between `₩` and the digits (`` `₩ ${n.toLocaleString()}` ``) — for consistency
  with the existing `BulkRelistScreen.tsx` and `SellerStorefrontScreen.tsx`, both already in the
  repo doing the same thing.
- **"Published bundles" footer list uses `.map()`, not a nested `FlatList`.** The brief's RN-idiom
  rule reserves `.map()` for short/non-primary lists and `FlatList` for the real list; the
  screen's one genuine list is `ACTIVE_LISTINGS` (the FlatList `data`). The published-bundles
  section is a small, bounded footer (starts at 1 entry, grows only by the seller's own publish
  actions within a session) rendered inside `ListFooterComponent`, where nesting a second
  scrollable `FlatList` would trigger RN's "VirtualizedLists should never be nested inside plain
  ScrollViews" class of warning for no real benefit — so it's plain `.map()` inside a `View`,
  matching how sort-chip rows and similar short/bounded strips are handled elsewhere in the repo.
- **Item pool size / categories.** Brief didn't specify count or domain of the seller's active
  listings. Chose 8 home/kitchen items (distinct titles from `native/src/storefront/data.ts`'s
  clothing-focused `LISTINGS`) — enough to demonstrate variable-cardinality selection (well past
  a fixed 2-or-3-item bundle) without needing to virtualize/scroll-test a huge list for the gate
  check.
- **Discount ladder reference row in the header.** Not requested by the brief, but added as a
  small static strip (`2 −6% · 3 −12% · 4 −18% · 5+ −24%`) computed via `discountLadder()` from
  the same formula the live bar uses, so the seller has a reason to add a 3rd/4th item before
  seeing the number move. It's derived, not retyped, so it can't drift out of sync with the actual
  computation.
