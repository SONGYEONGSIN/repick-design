# Candidate C — Listing Boost Credits

A seller-facing, read-only ledger screen that shows a repick seller their Listing Boost Credits: a dark hero card with the current credit balance plus lifetime-earned/lifetime-spent stats, followed by a reverse-chronological `FlatList` of every earn/spend event (weekly storefront bonuses, milestone rewards, and specific "boosted '<listing name>' for N days" spends), each row carrying its own post-event running balance. Because this is a completed-history statement with nothing blocked or pending, the macro form is a persistent bottom action bar rather than a state machine: it always offers "Share my balance" (a real `Share.share()` call with a message built from the same derived balance/earned/spent figures) and "How it works" (a real `useState` toggle that expands/collapses an inline explainer panel in the scrollable header, mirrored by a secondary bar button so the toggle is reachable from the persistent bar too).

## Render-check string

"Boost Credits"

## 브리프에 없던 것 (What the brief didn't specify)

1. **① Display order of the ledger (oldest-first vs. newest-first)** ② Stored `boostCreditEvents` chronologically oldest-first in `data.ts` so the single running-balance fold reads naturally top-to-bottom, but render the `FlatList` newest-first (`boostCreditLedgerNewestFirst = [...boostCreditLedger].reverse()`) ③ Reversal happens strictly after the fold has already attached `runningBalance` to each row, so display order can never influence or corrupt the computed balances — kept the fold's input and the UI's input visibly separate rather than computing the fold backwards.

2. **① What exactly "spent" events should look like for this specific domain (vs. a generic ledger)** ② Each spend event names the actual boosted listing and its boost duration, e.g. `Boosted "Vintage Leather Jacket" — 3-day search boost`, rather than a generic "debit" line ③ The brief's own example phrasing ("Spent — boosted 'Vintage Leather Jacket' for 3 days") was a cue that boost-credit spends are inherently listing + duration specific, unlike a loyalty-points or promo-code ledger, so the copy needed to carry that domain detail to stay visibly distinct from a generic statement screen.

3. **① Whether the second bar action should live only in the bar, or also surface inside the scroll content** ② Made "How credits work" a single shared `toggleExplainer` handler wired to both an inline toggle row in the list header (`explainerToggle` Pressable, immediately above the panel it opens) and a secondary button in the bottom bar, so either entry point opens the same panel ③ The brief explicitly suggested the toggle could live "elsewhere in the scroll content" while the *bar* carries the actions — wiring both to one state avoids a bar button whose effect is invisible unless the user happens to scroll to find it.

4. **① Units/currency treatment for the hero number** ② Rendered the balance as a plain formatted integer ("128") with the word "credits" as a separate caption, no ₩ glyph anywhere ③ The brief flags boost credits as a non-currency unit and warns about the ₩ glyph collision at body size; since credits aren't money, the simplest and safest choice was to never introduce the glyph at all.

5. **① How to make earn vs. spend distinguishable without relying on color** ② Each row has an uppercase "EARNED"/"SPENT" tag plus an explicit "+"/"−" sign prefix on the amount text ("+20 credits" / "−88 credits"), on top of (not instead of) the success/danger color ③ Directly follows the brief's accessibility rule that a screen reader must distinguish movement direction without relying on color alone.

6. **① Loading/anti-double-press behavior for the Share action** ② Added an `isSharing` boolean guarding `handleShare`, disabling both bar buttons and swapping the primary button's label to "Opening share sheet…" while the `Share.share` promise is in flight ③ Directly follows the catalog's "Loading buttons: if any action feels async, disable + show loading, prevent double-press" rule; a real native share sheet call is exactly the kind of async action that rule targets.
