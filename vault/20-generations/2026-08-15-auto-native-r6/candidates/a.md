# auto-native-r6 · candidate a · Payouts

## Framing
A seller-facing earnings ledger for repick: available balance, pending (escrow) balance, the
linked payout method, and a chronological transaction history (sales credited, payouts and fees
debited). No existing screen (`watchlist`, `match`, `detail`, `offer-thread`, `account`, `handoff`,
`notifications`, `listing`, `order-status`) covers seller-side money — this is genuinely new
surface area.

## Structure
- Root: `SafeAreaView` (§1 compliance, independently of whether the hard gate checks it — see
  `native-deltas-provisional.jsonl` round 1).
- **Slim sticky strip** (not part of the `FlatList`, stays pinned): kicker → `Payouts` h1 →
  available/pending balance row → `Request payout` button → "Last updated" timestamp.
- **Everything else scrolls** inside a single `FlatList` (`ListHeaderComponent`: payout-method
  card, period filter, section heading; `renderItem`: transaction rows; `ListFooterComponent`:
  settlement-time footnote; `ListEmptyComponent`: empty-period state).

### Why sticky-strip-over-scroll, not zero-fixed-chrome
`auto-native-r2`'s delta established that a fully scrolling, zero-pinned-chrome layout is the
right call for a **settings/preference** screen because nothing on that screen is a number the
user needs to keep checking while scrolling — every row there is a value they *set*, not a value
they *reference*. A payout ledger is the opposite case: "what's my available balance right now" is
exactly the fact a seller wants in view while scrolling transaction history (the same reason a
banking app pins its balance). So I kept one slim pinned block — title + two balance numbers + one
button + a timestamp — and nothing else. That is still far short of the banned "header + pinned
card + scroll + bottom action bar" 3-band silhouette from round 1: there is no separate pinned
card and no bottom band at all; the payout-method card, the period filter, and the section heading
all scroll away with the list. I also did not reach for r3/r5's bottom-band **state-machine**
pattern (blocking-reason text + jump-to-unresolved-item), because that pattern exists for
terminal/destructive confirmation flows with a wrong/right gate to pass through step by step —
"Request payout" here is a single repeatable, non-destructive action with one deterministic
before/after state, not a multi-field validation flow, so a plain pinned button earns its keep
without invented ceremony.

## Interactions implemented (4, ≥ the 2–3 minimum)
1. **Period filter** — `This week` / `This month` / `All time` segmented control (`radiogroup` +
   `radio` roles) filters the `FlatList` data via a pure `filterByPeriod` over a fixed `daysAgo`
   field on each transaction (never derived from the real clock).
2. **Pull-to-refresh** — `FlatList`'s `refreshControl`; a fixed 900 ms `setTimeout` (no
   `Date.now`/`Math.random`) toggles between two fixed "Last updated" label literals and is
   announced via `accessibilityLiveRegion="polite"` on the balance block.
3. **Tap a transaction row** — expands in place to show the transaction detail sentence and a
   transaction ID, mirroring the step-expand idiom already used in
   `order-status/OrderTrackingScreen.tsx`.
4. **Request payout** — tapping the pinned button, when available balance > 0, inserts a new
   `processing` payout row at the top of the ledger, drops the available balance to ₩0 (computed,
   not duplicated), and disables the button with a live-announced confirmation — no dead end, the
   button explains why it's now disabled ("No balance to pay out").
   (Bonus, not counted toward the minimum) tapping the payout-method card expands account holder
   name and arrival time, reusing the courier-card expand idiom from `OrderTrackingScreen.tsx`.

## Tokens / a11y / determinism confirmation
- Every color comes from `tokens.color.*`, every spacing from `tokens.space(n)`, every radius from
  `tokens.radius.{md,sm}` — no hardcoded hex anywhere in `PayoutsScreen.tsx`.
- `SafeAreaView` wraps the screen root.
- `accessibilityRole="header"` on both headings (`Payouts`, `Transaction history`);
  `accessibilityRole="button"`/`"radio"`/`"radiogroup"` mapped throughout;
  `accessibilityLabel`/`accessibilityHint`/`accessibilityState` set on every interactive element;
  `accessibilityLiveRegion="polite"` on the balance block for refresh and payout-request updates.
- `hitSlop={{top:8,bottom:8,left:8,right:8}}` (the round-comparison winning value, not 4pt) on
  every `Pressable`.
- `data.ts` has zero `Math.random`/`Date.now`/bare `new Date()` — dates are fixed literals,
  `daysAgo` is a fixed literal used only for period bucketing, the refresh delay is a fixed
  `setTimeout` duration, and both balances are computed via a pure `sumByStatus` reducer over the
  fixed transaction array (so they always reconcile with the visible rows instead of being
  hand-duplicated numbers).
- Every Won-prefixed numeral keeps the ₩ sign in its own sibling `<Text>` without
  `fontVariant:["tabular-nums"]`, and applies `tabular-nums` only to the numeral-only parent `Text`
  — the same structure `OrderTrackingScreen.tsx` already uses, per the round-4 delta about the
  suspected RN-Web rendering artifact.

## 브리프에 없던 것
- **① 결정할 것**: 브리프는 "balance, pending balance, transaction list, maybe request-payout
  action"만 주고 정확한 금액·거래 종류·결제수단·아이콘을 지정하지 않았다.
- **② 결정한 것**: 10건의 결정론적 더미 거래(판매 5건 완료 + 판매 1건 에스크로 + 정산 3건 +
  수수료 조정 1건)를 만들고, 사용 가능 잔액(₩90,000)과 대기 잔액(₩168,000)을 하드코딩하지 않고
  거래 배열에 대한 순수 reduce로 계산해 항상 합이 맞도록 했다. 결제수단은 "KB Kookmin Bank ••••
  1234"로 고정. 아이콘은 새 의존성 없이 유니코드 화살표(↑/↓/…)와 View 두 개로 만든 단순 은행
  아이콘 글리프로 대체했다(react-native-svg가 레포에 있지만 이 화면엔 그 정도 복잡도가 필요 없다고
  판단).
- **③ 이유**: 게이트가 렌더링만 검사하고 특정 숫자를 요구하지 않으므로, 임의의 그럴듯한 숫자보다
  "항상 검산되는" 숫자를 만드는 편이 재무 화면의 신뢰도 측면에서 더 안전하다고 판단했다. 아이콘도
  이모지 금지 규정 + "새 의존성 추가 금지" 원칙을 지키면서 기존 화면(OrderTrackingScreen)이 이미
  쓰는 텍스트/View 글리프 관용구를 그대로 재사용하는 쪽을 택했다.
