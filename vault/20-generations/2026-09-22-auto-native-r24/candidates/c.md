# auto-native-r24 · candidate c

**Concept:** "Following Feed" — a buyer manages which sellers they follow (per-seller
Follow/Unfollow toggle rows) and scrolls one feed of new listings drawn only from currently
followed sellers, filterable by All / New Arrivals / Ending Soon. A social-graph screen (who you
follow → what you see), distinct from `watchlist` (saved individual items) and `storefront` (one
seller's own page).

**Render-check string:** `Following Feed`
(top-level heading, `accessibilityRole="header"`, inside the FlatList's `ListHeaderComponent` —
always visible in the default render, before any interaction.)

**Export:** `FollowingFeedScreen` (named export; also the default export) —
`native/src/evolve/r24/c/FollowingFeedScreen.tsx`

## Brief gaps

1. **What:** Band form — the brief said "none" and explained why, but didn't say whether any
   secondary lightweight feedback mechanism (e.g. a toast-like line) should exist for the Follow
   toggle.
   **Decided:** No feedback strip anywhere. The Follow/Unfollow Pressable's own label text
   changing ("Follow" ↔ "Following") *is* the confirmation, and the header subtitle count
   (`N sellers followed · M listings in your feed`) updates live as a second, ambient
   confirmation that doesn't require any band or overlay.
   **Why:** The brief explicitly frames the Follow toggle as "not a blocked-workflow
   transition," so the alert+liveRegion pairing doesn't apply (per GENERATION.md §4); adding an
   unrequested toast/live-region on top would have reintroduced exactly the kind of ceremony the
   "no band" instruction was trying to avoid.

2. **What:** Whether unfollowing a seller should hide their listings from the feed immediately,
   or just visually mark the seller as unfollowed while leaving their items visible.
   **Decided:** Immediate hide — the feed's FlatList `data` is derived as
   `FEED_ITEMS.filter(item => followed[item.sellerId] && filterMatches(item))`, so unfollowing a
   seller removes their cards from the feed on the same render, and re-following brings them
   back.
   **Why:** The brief's concept description is literally "sees new listings from followed
   sellers" — the feed's actual identity is "what your following graph produces," not a static
   list with follow badges bolted on. This also makes the two required interactions
   (follow-toggle, filter-tabs) compose into one real, non-decorative dependent state rather than
   two isolated demos.

3. **What:** Which sellers are followed by default (brief gave no seed state).
   **Decided:** 3 of 5 sellers followed by default, 2 not — so the screen opens showing both a
   populated feed and at least one visible "Follow" (not yet following) row, exercising both
   toggle directions without requiring interaction first.
   **Why:** An all-followed or all-unfollowed default would hide one of the two button states
   (and, in the all-unfollowed case, the feed) from the initial screenshot/gate render.

4. **What:** What the feed should show when a filter tab matches zero visible items (e.g. "Ending
   Soon" after unfollowing every seller with an ending-soon item), and separately when the user
   has unfollowed every seller.
   **Decided:** One `ListEmptyComponent` with two distinct fixed message strings chosen by
   `followedCount === 0` vs. not — "You aren't following any sellers yet..." vs. "No listings
   from your followed sellers match this filter right now."
   **Why:** The two empty causes have different correct next actions (follow a seller, vs. try a
   different tab); a single generic "No results" string would be honest but less useful, and the
   brief's accessibility rules elsewhere in this repo's DNA favor concrete, non-vague copy over
   placeholder text.

5. **What:** Currency/price formatting convention (brief didn't specify a currency for this
   screen).
   **Decided:** Reused the existing repo convention from `SellerStorefrontScreen` — a fixed
   literal `₩` glyph in its own sibling `<Text>` with `marginRight`, followed by a separate
   tabular-nums digits `<Text>`, per GENERATION.md §1's documented ₩-glyph spacing guidance.
   **Why:** This is a resale-marketplace screen already sharing a design language with the
   storefront/watchlist screens; matching their price-formatting idiom exactly (rather than
   inventing USD or a different treatment) keeps the screen visually consistent with the rest of
   the app and avoids re-triggering the ₩-glyph rendering issue GENERATION.md warns has been
   mis-diagnosed twice before.

6. **What:** Photo-thumbnail label legibility across three different swatch tones (swatch1 is
   light, swatch3 is mid-dark) — a single fixed text color wouldn't have safe contrast against
   all three.
   **Decided:** Wrapped the brand label in a small opaque `scrimLight` badge (not text-color-only)
   sitting on top of the swatch, with fixed `ink`-colored text inside the badge, so contrast is
   guaranteed regardless of which swatch index the item cycles to.
   **Why:** The brief's swatch-cycling instruction only specifies the background block, not how
   to keep overlaid text legible across all three cycled tones; the scrim-badge pattern was
   already established in this repo's tokens (`scrimLight`/`scrimDark`, "translucent scrims for
   legibility over photo-swatch thumbnails") for exactly this situation, so reused rather than
   inventing a new mechanism.
