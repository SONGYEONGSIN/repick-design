# Candidate A — Subscription Plan Management ("Pro Seller Plan")

A single-scroll seller-facing screen for managing a paid "Pro" plan: a plan card up top (name, status badge, price, billing cycle, next renewal date, member-since date) followed by a short benefits list, with a fixed bottom band that handles the cancel-subscription flow entirely in place. The band starts as one outlined "Cancel Subscription" action; pressing it flips the same band, inside a live-region container, into a confirmation prompt plus a "Keep Plan" / "Confirm Cancellation" button pair, and confirming flips it again into a terminal result line — no native Alert is used anywhere, and the confirmation/result copy is itself the thing announced to assistive tech. Export: named export `SubscriptionPlanScreen` from `SubscriptionPlanScreen.tsx` (also re-exported as default for convenience). Component file: `native/src/evolve/r30/a/SubscriptionPlanScreen.tsx`; dummy data: `native/src/evolve/r30/a/data.ts`.

## 브리프에 없던 것

1. **What:** Whether cancelling is reversible from the band itself, and what the band shows after confirming.
   **Decided:** A third, terminal band phase ("terminated") shows a plain result sentence ("Subscription cancelled. Your Pro benefits stay active through November 4, 2026...") with no further buttons — there's nothing left to confirm or undo from this screen.
   **Why:** General convention for destructive-confirm flows (a completed action shouldn't leave stale action buttons sitting around inviting a repeat tap); arbitrary beyond that, since the brief only specified the idle→confirm transition in detail.

2. **What:** How to render the fixed list of plan benefits given the "Lists→FlatList" rule versus the brief's own exception for short fixed lists.
   **Decided:** Used a single `FlatList` for the whole scrollable body (benefits as `data`, plan card as `ListHeaderComponent`), rather than plain `View`s, so the exact required import line didn't need a `ScrollView` added to it.
   **Why:** General convention — satisfies the literal import constraint in the brief without introducing an unlisted import; the "plain Views is fine too" allowance was the fallback I didn't need.

3. **What:** How to avoid the ₩-glyph strikethrough issue entirely.
   **Decided:** Priced the plan in USD ("$14.00 / month") instead of KRW.
   **Why:** Arbitrary — the brief flagged the glyph issue only as something to watch for "if you show a price," and sidestepping the character entirely is simpler than spacing or writing "KRW" for a seller-plan screen where the currency itself isn't the point.

4. **What:** Whether the header's status badge should react to the in-progress cancellation, given the live-region doctrine applies specifically to the band.
   **Decided:** The badge switches from "Active" to "Cancellation scheduled" only once the band reaches its terminal "terminated" phase (not during the mid-flow confirmation step), and it is plain visual text with no `accessibilityRole="alert"` of its own.
   **Why:** Another part of this same brief's precedent — "keep exactly one live region/alert active at a time" — so the second, cosmetic status indicator deliberately stays silent and only the band's single alert line is ever announced.
