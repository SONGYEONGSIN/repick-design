Check string: "Buy a shipping label"

# Candidate a — Shipping Label Purchase

`native/src/evolve/r46/a/ShippingLabelScreen.tsx` (named export
`ShippingLabelScreen`, also default-exported) +
`native/src/evolve/r46/a/data.ts`

## Concept

A seller, right after an item sells, buys and downloads its shipping
label. Four genuinely gated stages, scrolled as a single `FlatList` of
section cards with a numbered badge per card (not the "STEP N" kicker
text or accordion-expand chrome either existing multi-step screen uses):

1. **Choose a carrier** — three flat-rate carrier/tier rows (plain `View`
   + `Pressable` rows in an `accessibilityRole="radiogroup"`, per
   GENERATION.md §1's explicit carve-out for a short fixed list, not a
   `FlatList`-within-a-`FlatList`).
2. **Confirm weight & size** — four editable `TextInput`s
   (`keyboardType="decimal-pad"`), pre-filled from the sold item's
   category, with a red-border + inline-text correction if a field isn't
   a positive number.
3. **Review & pay** — a line-item breakdown (carrier fee + a flat
   insurance/handling fee = total) that renders once a carrier is picked.
4. **Your label** — inert placeholder text until paid; once paid, a
   label card with a fixed tracking number and two real `Pressable`
   actions, `View label` (toggles an inline preview box open/closed) and
   `Download PDF` (sets a `downloaded` flag and relabels itself
   `Downloaded ✓`, disabling further presses) — both are true state
   transitions, not no-ops, and their `accessibilityHint`s describe
   exactly what the handler does ("Shows the label preview below" /
   "Marks this label as downloaded") rather than promising navigation
   that doesn't happen.

**Band shape**: this is GENERATION.md §3's state-machine band for a
genuinely blocked workflow — you cannot see the invented variable `carrierId`
go non-null without picking a carrier, cannot reach `paid` without a
valid package, and cannot reach `downloaded` without `paid`. The fixed
bottom control (`styles.control`) has exactly one
`accessibilityLiveRegion="polite"`, and each of its three mutually
exclusive headline `Text`s (blocked / ready-to-pay / done) carries
`accessibilityRole="alert"` — all three, not just the blocked one, since
each is the sentence announcing that stage's transition. Pressing it
while blocked calls `goToSection()` (`listRef.scrollToIndex`) to the
specific unresolved card named in the sentence; pressing it while ready
calls `handlePay()`, which really does flip `paid` to `true` (no label
change without effect). No wrapper anywhere carries `accessible={true}`;
the carrier radiogroup and the label's two action buttons are left as
plain sibling `Pressable`s so none of them become structurally
unreachable.

**Distinct code surface, on purpose.** This app already has two other
state-machine bands (`src/verification/SellerVerificationScreen.tsx`'s
`band`/`bandBlocked…`/`bandReady…`/`bandDone…`, `src/disputes/
DisputeCenterScreen.tsx`'s identical `band` prefix) and, closer to this
screen's own domain, `src/pickup/ShipmentPickupScreen.tsx`'s `dock`/
`dockBlocked…`/`dockReady…`/`dockDone…` (its three stages are measure →
carrier → book-a-pickup-window, priced off a dimensional-weight bracket
table). This candidate's control uses a third, unshared prefix
(`control`/`controlBlocked…`/`controlReady…`/`controlDone…`), its own
state/handler names (`progress`, `goToSection`, `handleControlPress`,
`handlePay`), and its own hint copy ("Takes you to that step" /
"generates your label" vs. the other two screens' "Tap to go there" /
"Tap to jump to this step" / "Tap to review"). More importantly the
*flow itself* differs from `ShipmentPickupScreen` in three structural
ways, not just vocabulary: carrier is picked **before** weight/size
(the reverse order), price is a **flat per-tier rate independent of
weight** rather than a dimensional-weight bracket table, and the
terminal action is a **real payment that generates a downloadable
label**, not a pickup-window booking — see gap ① below for why price was
decoupled from weight.

## 브리프에 없던 것

1. **① 운송비가 무게/치수에 따라 달라지는지.** 브리프는 2단계(무게·치수
   확인)와 3단계(결제) 사이에 어떤 계산 의존성이 있는지 명시하지 않았다.
   ② 운송비를 무게와 무관한 **고정 등급제**(Saver/Standard/Next Day,
   각각 고정가)로 결정했다. ③ 이미 카탈로그에 있는
   `ShipmentPickupScreen`이 치수-무게 계산(actual vs. dimensional
   weight, `/139` 상수)과 무게구간 요율표를 코드 표면까지 정확히 구현해
   놓았다— 같은 계산을 다시 만들면 이번 화면이 그 화면의 리스킨처럼
   읽힐 위험이 있었다. 고정가 가정은 또한 실제로 많은 배송 파트너가
   박스 규격별 플랫레이트 봉투/박스를 쓰는 것과도 부합해, 도메인상으로도
   어색하지 않다.

2. **① 결제 수단/통화.** 브리프는 "review total cost and pay"라고만
   했고 결제 수단(월렛 차감·카드 등)은 명시하지 않았다. ② 별도 결제
   수단 선택 UI 없이, 밴드를 누르면 바로 총액이 청구되는 것으로 가정하고
   `payout`/`wallet` 화면의 ₩ 포맷(`₩ ` + 공백)을 그대로 따랐다. ③ 결제
   수단 선택을 추가하면 다섯 번째 단계가 생겨 "4단계" 브리프 범위를
   벗어나고, 이 화면의 핵심 분기(상태기계 밴드)와 무관한 질문이라 범위를
   좁혔다.

3. **① "다운로드"가 실제로 무엇을 하는지.** 네이티브 앱에는 실제 파일
   시스템 다운로드가 없다. ② `Download PDF`를 누르면 로컬 상태
   `downloaded`가 `true`로 바뀌고 버튼이 비활성화된 `Downloaded ✓`로
   바뀌는, 진짜 상태 전환으로 구현했다. ③ GENERATION.md §4의
   accessibilityHint 규칙("일어나지 않을 일을 약속하지 마라") 때문에
   힌트를 "기기에 저장합니다"처럼 쓰지 않고 "Marks this label as
   downloaded"로 — 핸들러가 실제로 하는 일(상태 전환)만 정확히
   설명했다.

4. **① 판매 품목과 구매자 지역.** 브리프는 "realistic, deterministic
   dummy data"만 요구했다. ② 필름 카메라(Canon AE-1, ₩ 142,000에
   판매)와 부산의 구매자로 고정했다. ③ 무게·치수 기본값(1.4lb,
   10×8×6in)이 "카메라+패딩 케이스"라는 구체적 품목에서 자연스럽게
   따라나오도록 해, 더미 데이터가 임의가 아니라 품목에서 파생된
   것처럼 보이게 했다.

5. **① 무게/치수 입력의 유효 범위.** 브리프는 상한·하한을 주지 않았다.
   ② `WEIGHT_BOUNDS_LB = {min: 0.1, max: 30}`, `DIM_BOUNDS_IN =
   {min: 1, max: 36}`로 고정했다. ③ 상한이 없으면 "0보다 큰 숫자"
   검증만으로는 비현실적인 값(예: 10000lb)도 통과해 2단계 게이트가
   무의미해진다 — 택배 한 상자가 가질 법한 현실적 범위로 고정해 검증을
   의미 있게 만들었다.
