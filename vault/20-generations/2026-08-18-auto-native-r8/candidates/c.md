# auto-native-r8 · candidate c — Checkout / Order Review

`evolve-r8-c` is a pre-purchase checkout/review screen: a single scrollable stack of
read-only summary blocks (item card with a placeholder thumbnail, shipping address,
payment method, price breakdown) closed by a fixed bottom band that shows the live total
next to a single "Place order" CTA. Structurally this differs from every existing and
past-attempted native screen in this repo: it is not a multi-step wizard (listing
creation), not a vertical stepper timeline (order status), not an accordion/checklist
state machine (seller verification, disputes), and not a grid/feed (watchlist, AI match,
notifications). It is a flat "confirm before you commit" summary — closer to a receipt
than a process — and its bottom band is intentionally the simplest legitimate shape:
because address and payment are already on file and there is exactly one real terminal
action, the CTA is always enabled and does real work (reads out the live total) rather
than modeling invented blocking/validation states just to reuse the alert+jump-to-field
state-machine mechanics that already won three prior rounds elsewhere.

## 브리프에 없던 것

1. ① GENERATION.md §1 gives a explicit ban/fix for `tabular-nums` cascading onto nested
   ₩ text, but does not say whether to use `tabular-nums` at all on this screen's price
   column. ② Decided not to use `fontVariant: ["tabular-nums"]` anywhere in this screen —
   every price (item price, three breakdown rows, total, band total) is plain `Text` with
   `textAlign: "right"` for alignment. ③ The known bug has now reproduced twice from
   developers who *thought* they'd nested correctly; the screen's real requirement is
   "figures line up visually," which plain right-alignment already satisfies without
   opting into the risky mechanism at all — simplest safe option per the round's own
   guidance.

2. ① Whether a static, non-repeating stack of summary blocks should be built as a
   `FlatList` (the pattern every other screen in this repo uses, per §1's "리스트 →
   FlatList" mapping) or a plain `ScrollView`. ② Used `ScrollView` for the main content
   and reserved `FlatList` semantics for screens that actually virtualize a homogeneous,
   potentially-long collection. ③ This screen has exactly four fixed blocks, not a list —
   forcing a `FlatList` with a single-item `data` array would be virtualization theater,
   and using `ScrollView` here is also what keeps this candidate's macro-shape legibly
   different from the FlatList-header/footer skeleton shared by watchlist, order-status,
   disputes, and handoff.

3. ① Tokens.ts has no dedicated "input-like read-only field" or "link/change-affordance"
   color — only `accent`, `ink`, `muted`, `faint`, `border`. ② Rendered the "Change"
   affordance as small `accent`-colored bold text inside a `Pressable` with
   `minHeight:32`/`minWidth:44` and 8px `hitSlop`, giving a `pressed`-state background of
   `tokens.color.border`. ③ Keeps the single-accent rule (only `accent` marks an
   interactive/actionable element) while still clearing the 44×44pt touch-target minimum
   from the Native/Mobile catalog section without inventing a new token.

4. ① No brief value for the service fee or shipping fee amounts, or for how the total
   should be computed/verified as internally consistent. ② Set `SHIPPING_FEE_WON = 3500`
   and `SERVICE_FEE_WON = 12250` as fixed literals in `data.ts`, then computed
   `TOTAL_WON = ITEM_PRICE_WON + SHIPPING_FEE_WON + SERVICE_FEE_WON` as a plain arithmetic
   expression rather than a fourth hardcoded literal. ③ Guarantees the breakdown always
   sums correctly by construction (no risk of the displayed total silently drifting from
   its parts) while staying fully deterministic — no `Math.random`, no date arithmetic.
