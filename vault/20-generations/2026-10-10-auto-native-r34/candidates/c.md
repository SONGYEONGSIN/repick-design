# Candidate c — Close Seller Account

One-line concept: a single irreversible "Close Seller Account" action gated by a real, data-driven blocker checklist (open orders / pending payout), where pressing the primary action transforms the same bottom band in place into a Cancel / Confirm closure row instead of popping a native Alert.

## 브리프에 없던 것

- **Blocked vs. eligible mock state**: the brief explicitly left this to me ("you choose whether your mock data represents the blocked or unblocked state"). I chose **eligible** (`openOrdersCount: 0`, `pendingPayoutBalanceCents: 0` in `data.ts`) so the primary subject of this band form — the band pressing → self-transforming into Cancel/Confirm — is actually reachable in the rendered screen rather than permanently unreachable behind a disabled button. The blocker logic itself is still fully real and data-driven (`getBlockers`/`isEligibleToClose` in `data.ts` compute from the two count fields; flipping either to nonzero re-blocks the action and changes the band's idle copy and the button's `disabled`/`accessibilityState`/hint). I render the checklist as a "Resolved" vs "Needs action" badge row either way so the conditional is visible in the UI even though it's currently satisfied.
- **Three-stage band state machine**: brief only specified idle → confirming. I added a third `closed` stage (after "Confirm closure" is pressed) so the live region has a real terminal message ("Account closure confirmed. You will be signed out shortly.") instead of leaving the user on the confirm step forever with no feedback.
- **Concrete figures invented**: seller handle `@northstar.vintage`, member-since `2022-03-04`, 9 active listings (delisted on close), 134 completed sales (kept as read-only history), KRW 0 pending payout. Currency shown as `KRW 0` per the Latin-notation guidance.
- **Read-only impact rows**: "Active listings", "Order history", "Seller profile" — invented as informational, non-blocking summary rows, explicitly not `Pressable` and given no hint, since they're display-only.
- **Single FlatList layout**: rather than `ScrollView` + nested lists (which RN warns against), the whole scrollable body — section headers, blocker rows, impact rows — is one `FlatList` with a `ListHeaderComponent` carrying the title/intro; the destructive band sits as a sibling below it so it never scrolls away.
- **Hint accuracy**: the idle "Close account" button only gets an `accessibilityHint` when eligible ("Opens a confirmation step before permanently closing your account" — accurate, since pressing it only transitions state, it doesn't itself close anything); when disabled, no hint is given at all, per the brief's instruction not to promise completion of something the handler can't do yet.
- **Exactly one live region**: `accessibilityLiveRegion="polite"` is set only on the bottom band's outer `View`; the one `Text` inside it that changes content (idle status / confirm copy / closed copy) carries `accessibilityRole="alert"`. Section headings use `accessibilityRole="header"` instead, so they don't compete as a second live region.

## Confirmation

- Render-check string: **"Close Seller Account"** — rendered verbatim as the page's `accessibilityRole="header"` title (first line under `ListHeaderComponent`), so it appears in `document.body.innerText` on initial load regardless of band stage.
- Export: `CloseSellerAccountScreen` — **default export** — from `native/src/evolve/r34/c/CloseSellerAccountScreen.tsx`.
- Supporting data: `native/src/evolve/r34/c/data.ts` (deterministic — no `Math.random`/`Date.now`/no-arg `new Date()`; all figures are fixed literals or derived from them).
