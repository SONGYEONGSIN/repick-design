# Candidate a — Offer Status

A buyer-side "Offer Status" screen for a single pending offer: a hero stat card
anchors the page with the offered-vs-asking amounts, a plain-tinted listing
mini-preview, a status readout and the fixed offered/expires dates; below it a
FlatList surfaces the buyer's past offers on other listings (accepted/declined/
expired, each with its own resolved date); a persistent, always-visible bottom
rail shows a derived "time remaining" countdown (computed purely by
subtracting two fixed Date constants, no live clock) plus a single
"Extend 24 Hours" action that is usable exactly once — tracked with a boolean
`extensionUsed` state rather than time, announced through a conditional,
auto-clearing live region on first use, and permanently disabled with an
explanatory line on any further attempt.

## Render-check string

`Offer Status` — rendered via `accessibilityRole="header"` as the first
`<Text>` in the hero stage (top of the `FlatList`'s `ListHeaderComponent`),
visible on first paint with no scrolling or interaction required.

## 브리프에 없던 것 (What the brief didn't specify)

① What: the actual currency symbol/convention to use for amounts.
② Decided: plain `$` with `toLocaleString` thousands separators (e.g. `$185`,
   `$240`), no ₩ glyph anywhere.
③ Why: the brief's own example text for this screen is literally
   `"$42 offered on a $58 listing"`, so I followed that literal example
   rather than the ₩/KRW convention used by other screens in this repo
   (e.g. `MinimumOfferThresholdScreen`) — there was no currency conflict to
   resolve since this screen never renders a ₩ glyph at all.

① What: the concrete fixed dates/times for the offer window and for the
   "current viewing moment" the countdown is computed against.
② Decided: `OFFER_SUBMITTED_AT = Oct 17, 2026 09:00`,
   `INITIAL_OFFER_EXPIRES_AT = Oct 20, 2026 09:00` (a 72-hour window), and a
   third fixed anchor `STATUS_SNAPSHOT_AT = Oct 18, 2026 03:00` standing in
   for "now" without ever reading the real clock.
③ Why: the brief gave "Offered Oct 17" / "Expires Oct 20" as its own example
   and asked for a derived (not hand-typed) "time remaining" readout like
   "Expires in 2 days 6 hours" — I picked `STATUS_SNAPSHOT_AT` specifically
   so that `EXPIRES_AT − SNAPSHOT_AT` lands on exactly that example string,
   which is the strongest evidence the countdown is a real computation and
   not a copied label.

① What: what the listing/offer/history domain data itself should actually say
   (item name, condition tags, category, offer amounts, history rows).
② Decided: a single current offer ($185 on a $240 "Merino Wool Overcoat",
   Outerwear/Excellent) plus four history rows across accepted/declined/
   expired on unrelated items (satchel, lamp, backpack, keyboard).
③ Why: the brief only specified the mechanic and format, not concrete
   values; picked plausible resale-marketplace items/prices with a
   below-asking ratio (~77%) consistent with "offer below asking," and kept
   the history count at 4 (within the required 3–5) for a believable but not
   padded list.

① What: exactly how the "Extend 24 Hours" button's one-time use should be
   visually/structurally represented once used (brief said "disabled state
   with adjacent plain-text copy" but not the layout).
② Decided: kept the disabled button in the same top row (so the countdown
   value and the button stay visually paired), and placed the explanatory
   sentence ("Already extended once for this offer.") as its own full-width
   line directly underneath the row, rather than as a tooltip or inline
   caption squeezed next to the button.
③ Why: a full-width line below reads clearly at small type sizes and avoids
   cramming explanatory copy into the same row as a 150pt-wide button,
   keeping both the button's 44pt+ touch target and the text's line length
   comfortable — an accessibility/layout convention already visible in this
   repo's other "explain why, then show the control" bands (e.g. gated
   submit flows), adapted to a persistent rather than blocking context.

① What: how to word the live-region announcement text itself for the
   extension event (brief said "announces this" but not the copy).
② Decided: `"Extended 24 hours — now expires {Month Day}."` — restates the
   action and gives the new concrete date rather than a vague "Done!".
③ Why: per the GENERATION.md doctrine against promising/implying outcomes
   the handler doesn't perform, I wanted the announcement to name the exact
   state change that just happened (new expiry date) rather than a generic
   success phrase, so a screen-reader user gets the same concrete
   information a sighted user gets from the countdown updating.
