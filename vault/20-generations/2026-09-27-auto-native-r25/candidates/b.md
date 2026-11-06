# auto-native-r25 · candidate b

**Concept:** "Delivery Receipt" — a read-only record shown after a buyer has already confirmed
receipt of an item and payment has already been released to the seller: item summary, a price
breakdown (item / shipping / buyer protection fee / total paid), delivery method + tracking +
delivered date, a chronological order timeline ending at the confirmation event, seller info, and
a persistent bottom action bar (Share / Save / Report an issue). Deliberately not another face of
`certificate` (Authentication Certificate) — that screen is organized around pass/fail inspection
checkpoints for an item; this screen is organized around a finished money transaction (what was
paid, how it moved, when it arrived), with no verdict system anywhere.

**Render-check string:** `Delivery Receipt`
(top-level heading, `accessibilityRole="header"`, inside the FlatList's `ListHeaderComponent` —
always visible in the default render, before any interaction.)

**Export:** `DeliveryReceiptScreen` (named export; also the default export) —
`native/src/evolve/r25/b/DeliveryReceiptScreen.tsx`

## Brief gaps

1. **What:** The brief names three example bottom-bar actions ("e.g. Share receipt, Report an
   issue with this order, Download/Save receipt") but doesn't say how many buttons to actually
   ship, or whether "Report an issue" needs any confirmation step given the transaction is already
   settled.
   **Decided:** Shipped all three as a persistent 3-button row (Share / Save / Report issue).
   "Report an issue" is treated as consequential enough (it opens a support case against a closed,
   paid transaction) to use the band's existing Cancel/Confirm-row transformation instead of firing
   immediately or spawning a native `Alert`.
   **Why:** GENERATION.md §3 generalizes the destructive-confirmation pattern from `r13/a`
   (band itself flips into a `Cancel`/`Confirm` two-button row inside the already-live-region'd
   container) beyond literal money-destroying actions to any "surface that needs confirmation"
   (`r22/b`'s per-row generalization). Filing a report against a finished, paid order is exactly
   that kind of consequential-but-not-instant action, so reusing the *principle* (not the code) fit
   better than a silent instant no-op or an OS-level `Alert` popup.

2. **What:** What "each press must produce a real, visible state change" means for Share and Save
   specifically, since neither has an obvious multi-step flow the way "Report an issue" does.
   **Decided:** Both are one-press, idempotent-after-first-press actions: pressing "Share" flips a
   `shared` boolean (button label permanently becomes "Shared", not just a transient toast) and
   posts a status line; "Save" does the same with a `saved` boolean / "Saved" label. Re-pressing
   either still re-fires the status line so it isn't a one-time-only affordance.
   **Why:** A transient toast alone would satisfy "visible" but not "state change" as durably as a
   persisted label swap; matching the label to the actual outcome (nothing to open, no picker to
   choose from) also avoids literally reproducing `certificate`'s share-destination-picker
   expand/collapse control flow, which is exactly the kind of code-surface duplication
   GENERATION.md's 2026-09-12 addendum says loses even when the *band form* is correctly chosen.

3. **What:** The brief doesn't specify how many live regions the screen may have, only that the
   confirmation-moment text belongs in one.
   **Decided:** Exactly one live region for the whole screen: the bottom action bar's container
   (`accessibilityLiveRegion="polite"`), with a single status `<Text>` inside it that only takes
   `accessibilityRole="alert"` once a transient message (share/save/report-prompt/report-cancel/
   report-confirm) has been set; before any interaction it renders the same string as plain,
   non-alert text. All three actions (Share, Save, Report's three sub-states) write into this one
   `statusMessage` state slot, so no single press can ever update two regions at once.
   **Why:** GENERATION.md §4 explicitly warns against more than one live region and about a single
   action updating two regions simultaneously; consolidating every transition into one state
   variable was the simplest way to make that structurally impossible rather than relying on
   discipline across three separate handlers.

4. **What:** Currency formatting — the brief flags the ₩-glyph rendering risk but leaves the choice
   open, and this screen (unlike most others) needs four separate currency lines on one screen
   (item price, shipping, protection fee, total).
   **Decided:** Used the literal string `"KRW"` as a prefix (e.g. `KRW 238,000`) everywhere,
   never the ₩ glyph, including a `formatKrw()` helper in `data.ts` that also collapses a `0` value
   to the word "Free" for the shipping line.
   **Why:** GENERATION.md lists "write `KRW` instead of `₩`" as one of the three safe options.
   With four currency lines stacked in one card (vs. most other screens' single price line), the
   "put a space between ₩ and the digits" approach would mean re-verifying the glyph-spacing rule
   four times instead of once; picking the option that removes the glyph from the screen entirely
   was the lower-risk default for a receipt whose whole job is precise, trustworthy numbers.

5. **What:** The brief's domain description doesn't specify a delivery timeline/history, only "item
   summary, final price, delivery method/date, seller info, and confirmation timestamp" as content.
   **Decided:** Added a 4-step chronological "Order Timeline" (Order placed → Shipped by seller →
   Delivered → Receipt confirmed) as the screen's main scrollable `FlatList` body, with the last
   step's dot rendered in the accent color as a "this is where the record ends" marker (everything
   before it is a plain ink dot — there is no pass/fail distinction, unlike `certificate`'s
   checkpoint markers).
   **Why:** A receipt with only a single confirmation timestamp and no trail of how the order got
   there would read as thin next to a certificate screen that has five independently-timestamped
   checkpoints. The timeline gives the FlatList a genuine reason to exist (virtualizable, ordered
   data) instead of forcing an artificial list out of otherwise-flat content, while staying
   structurally distinct from `certificate`'s verdict checklist (no status enum, no pass/note
   glyph, just chronology).

6. **What:** Whether the seller info block needs any interactive affordance (e.g. "Message seller"
   or "View profile").
   **Decided:** Kept it fully read-only — an `accessible={true}` group (avatar + name + rating)
   with one combined `accessibilityLabel`, no nested `Pressable`.
   **Why:** GENERATION.md's 2026-09-20 addendum forbids `accessible={true}` on any wrapper that
   contains its own nested interactive child, since it makes that child unreachable to assistive
   tech. Rather than add a seller-profile link whose destination doesn't exist in this design round
   and then have to either give it a misleading `accessibilityHint` or an unlabeled no-op (both
   flagged elsewhere in GENERATION.md), leaving the block as a single non-interactive info group
   was the option with no accessibility trade-off to manage.
