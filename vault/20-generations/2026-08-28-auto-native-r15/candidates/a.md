# auto-native-r15 · candidate a — Seller Storefront

A public-facing profile page for browsing one seller: an identity header (name, handle, location,
member-since), a proof-style reputation summary (4.9 avg rating, 312 reviews, 428 orders sold,
98% on-time ship rate, "replies within 2 hours" — real stats, not vague praise), a static
Verified Seller badge reusing the *meaning* of the app's verification concept as a completed fact
rather than the step-by-step in-progress flow that screen already owns, and a two-column `FlatList`
grid of the seller's active listings (match%, condition grade, before/after price with a computed
discount%). The one interactive control beyond scrolling is a three-way sort row (price low-to-high
/ newest / best condition) that re-sorts the same `FlatList` data via `useMemo`, with the result
count and active sort label in its own `accessibilityLiveRegion="polite"` container so the change
is announced without touching the bottom band's separate live region.

**(a) Component**: exported `SellerStorefrontScreen` in
`native/src/evolve/r15/a/SellerStorefrontScreen.tsx` (data in
`native/src/evolve/r15/a/data.ts`).

**(b) Gate render-check string**: `"Active Listings"` (the section heading,
`accessibilityRole="header"`, unique to this screen) — the seller name `"Mira Novak"`
(`accessibilityRole="header"` in the identity row) also works as a second unique anchor.

**(c) ₩ handling**: Option 1 — a literal space between the ₩ sign and the digits. Implemented as
two sibling `Text` nodes (`wonSign` with `marginRight: 3`, then the digit string), so the glyph's
horizontal stroke never sits adjacent to a digit at body-text size. `fontVariant: ["tabular-nums"]`
is used freely on the digit and on the struck-through original-price text, per the retracted false
lead — it is unrelated to the glyph issue.

**(d) Bottom band**: deliberately a persistent action bar, not a state machine — this is a
read-mostly browsing screen with nothing blocked or partway-through. It holds two real buttons:
**Follow** (the screen's actual primary action — toggles real local state, swaps label/style
between "Follow" and "Following ✓", and updates the band's live-region text; never a no-op) and
**Message seller** (secondary scaffolding for the not-yet-wired chat-open flow, carries no
`accessibilityHint` promising navigation it doesn't do, but still produces a real visible
confirmation in the band on press rather than doing nothing). Per-item actions were considered
insufficient alone because "follow this seller" and "message this seller" are storefront-level,
not listing-level, decisions — so a fixed band earns its place here rather than being forced in.
