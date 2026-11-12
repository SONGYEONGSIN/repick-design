# Candidate C — Promo Code Wallet

**Screen:** `native/src/evolve/r30/c/PromoCodeWallet.tsx` (default export `PromoCodeWallet`)
**Data:** `native/src/evolve/r30/c/data.ts` (named exports `PROMO_CODES`, `PromoCode`, `PromoCodeStatus`)
**Heading / gate render-check string:** `Promo Code Wallet`

A buyer's single flat list of collected promo/discount codes — active, expiring-soon
and expired entries deliberately interleaved rather than grouped by status, since the
brief frames this as one mixed wallet rather than three sorted buckets. Each row carries
a code, a short benefit line, a status pill, the discount value, an optional minimum-spend
line, and a source/expiry meta line. A leaf `Pressable` checkbox-style toggle on each row
drives selection into a `Set<string>`; `selectedCount` is read directly as `selectedIds.size`
on every render, never cached in a second variable. At `selectedCount === 0` the bottom
contextual bar is not in the render tree at all (the JSX returns `null`, not a hidden
style); once any row is selected it mounts with a live-region container announcing
"`N codes selected`" and offers `Cancel` (clears the Set) or `Archive` (filters the
selected ids out of local state and clears the Set). No undo/restore overlay was built,
so the mutual-exclusivity rule is satisfied trivially — there is nothing for the
selection bar to ever co-exist with, and the copy never promises a retention window that
isn't implemented.

## 브리프에 없던 것

1. **무엇을 결정해야 했나:** `₩` 글리프를 할인/최소구매 금액 표시에 어떤 방식으로 쓸지 (공백 삽입 vs `KRW` 표기 vs 그대로).
   **결정:** 숫자 앞에 공백을 넣는 방식 — `₩ 5,000 OFF`, `Min. spend ₩ 30,000`.
   **근거:** 브리프가 제시한 세 옵션 중 하나를 임의로 선택 (arbitrary) — 이 화면이 프로모 코드의 "금액형" 혜택을 자주 보여줘 원화 기호 자체를 없애기보다 가독성만 보정하는 쪽을 택함.

2. **무엇을 결정해야 했나:** expired 상태 배지의 색을 success/warning 처럼 색이 있는 배경으로 할지, 아니면 다른 처리로 할지.
   **결정:** expired 배지는 `color.bg` 배경 + `color.border` 테두리 + `color.faint` 텍스트로, 채워진 색상 배지를 쓰지 않음.
   **근거:** 일반 관행 (general convention) — danger 팔레트는 브리프 전역에서 "파괴적 동작"용으로 예약돼 있고, 만료는 에러가 아니라 중립적 상태이므로 모노크롬 톤을 그대로 유지.

3. **무엇을 결정해야 했나:** 선택 토글을 행 전체를 감싸는 Pressable로 만들지, 별도의 leaf 컨트롤로 분리할지.
   **결정:** 행 컨테이너는 평범한 `View`로 두고, 선택 토글만 44×44 `Pressable` leaf로 분리.
   **근거:** 브리프의 접근성 규칙 (일반 convention 명시) — "상호작용 자식을 감싸는 wrapper에 `accessible={true}`를 절대 쓰지 말라"는 조항을 지키는 가장 단순한 구조로, 행을 통째로 누르는 보조 제스처를 아예 만들지 않아 중첩 Pressable 문제 자체를 회피.

4. **무엇을 결정해야 했나:** 대량 작업(Archive) 이후 피드백을 어떻게 줄지 — undo 배너를 추가할지 말지.
   **결정:** undo/toast를 추가하지 않고, Archive 즉시 해당 행들을 로컬 state에서 제거 + 선택 해제만 수행.
   **근거:** 임의 선택 (arbitrary), 다만 브리프의 안전장치에 따른 것 — "구현하지 않은 되돌리기를 암시하는 문구/동작을 넣지 말라"는 규칙과 "선택 바와 undo 오버레이는 동시에 뜨지 않아야 한다"는 규칙을 가장 확실히 만족시키는 방법은 undo 자체를 만들지 않는 것이라 판단.
