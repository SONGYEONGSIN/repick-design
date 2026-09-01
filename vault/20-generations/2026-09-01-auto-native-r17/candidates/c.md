# Candidate c — Price Suggestion & Market Comps

Seller-side pricing tool shown while creating a listing: a weighted AI-suggested price
computed from 5 real comparable sold listings, with a live range-bar + comparison sentence
that updates as the seller accepts the suggestion, steps/types a custom price, or resets.

- Exported component: `PriceSuggestionScreen`
- Main export path: `native/src/evolve/r17/c/PriceSuggestionScreen.tsx`
- Supporting: `native/src/evolve/r17/c/components.tsx` (ItemSummaryCard, RangeBar, PriceEditor,
  CompRow), `native/src/evolve/r17/c/data.ts` (fixed comps + the pricing math)
- Rendered heading text (gate check-string candidate): **"Price Suggestion"**

## ₩ formatting

Chose (a) — a visible gap between the ₩ glyph and the digits (`formatWon` in `data.ts` returns
`"₩ 167,000"`, not `"₩167,000"`), matching the resolution already established in
`native/src/wallet/data.ts`. Price is this screen's entire subject (hero suggestion, range-bar
labels, stepper display, bottom bar, comp rows all show it at body size), so this was the
highest-stakes screen in the round to get this right, and no reason existed to relitigate an
already-settled provision with a fresh guess.

## 브리프에 없던 것

**1. 무엇을 정해야 했나:** 판매자가 지금 등록 중인 아이템이 정확히 무엇인지(브리프는 "seller's own
item"이라고만 함).
**무엇으로 정했나:** "Sony WH-1000XM4 Wireless Headphones", condition "Good".
**왜:** 다른 스크린들(detail=카메라, wallet=운동화/맨투맨/플리스)과 카테고리가 겹치지 않으면서, comp
검색이 "동일 모델·색상/컨디션 varies"로 자연스럽게 성립하는 흔한 리세일 품목이 필요했다. 헤드폰은
색상·컨디션 변주가 realistic하고 중고 전자기기 시장에서 실제로 흔한 카테고리다.

**2. 무엇을 정해야 했나:** AI 추천가를 만드는 실제 계산식 — 브리프는 "weighted median/average ...
not a hardcoded literal"이라고만 요구했지 공식은 안 줬다.
**무엇으로 정했나:** `recencyWeight(daysAgo) = 1/(1+daysAgo/14)` (최근일수록 가중치 큼) ×
`conditionWeight = max(1 - |조건차이|*0.25, 0.25)` (판매자 조건과 가까울수록 가중치 큼, 완전히
0이 되진 않음)의 가중평균, ₩1,000 단위 반올림. `computeSuggestedPrice`/`compWeight`로 `data.ts`에
그대로 노출.
**왜:** 게이트가 "inspectable, deterministic function"을 요구했으므로 정수 입력에 대해 순수하게
동작하고, 코드 한 곳을 가리켜 "이게 그 계산이다"라고 말할 수 있는 가장 단순한 두-요인 가중치 모델을
선택했다. 바닥값 0.25는 극단적으로 다른 컨디션의 comp도 완전히 버리지 않는다는 실제 프라이싱 로직에
가깝다.

**3. 무엇을 정해야 했나:** 하단 밴드 형태 — 브리프가 명시한 3개 옵션(blocked-workflow /
persistent action bar / selection-derived) 중 이 화면에 맞는 것.
**무엇으로 정했나:** Persistent action bar — "Continue with ₩X"가 항상 활성 상태로 떠 있고 현재
가격을 라이브로 반영.
**왜:** 이 화면엔 진짜 "막힌" 상태가 없다 — 화면이 열리자마자 AI 제안가가 이미 유효한 기본값이고,
seller가 comp 범위 밖으로 가격을 설정해도 그건 여전히 허용되는 선택(정보성 경고일 뿐 게이트가
아님)이다. 억지로 blocked-workflow를 만들면 가짜 게이트가 된다 — 브리프가 정확히 경고한 그 실수.

**4. 무엇을 정해야 했나:** 라이브 리전을 어디에, 얼마나 자주 걸 것인가 — 브리프는 "판단하라"고만
하고 정확한 스코프는 안 줬다.
**무엇으로 정했나:** 가격 숫자나 퍼센트가 아니라, 카테고리 라벨(`CATEGORY_LABEL[category]` —
"Matches the AI suggestion" 같은 5개 문장 중 하나)에만 `accessibilityLiveRegion="polite"`를 건다.
숫자/퍼센트는 화면엔 보이지만 라이브 리전 밖에 둔다.
**왜:** 카테고리는 임계값(범위 밖/제안가 위·아래)을 넘을 때만 바뀌므로 타이핑 매 글자마다 스팸이
되지 않는다. 브리프가 명시적으로 경고한 "키 입력마다 라이브 리전 채터링은 없는 것보다 나쁘다"를
피하면서도, 의미 있는 상태 전환(범위 밖으로 나감 등)은 스크린리더 사용자에게 여전히 전달된다.

**5. 무엇을 정해야 했나:** comp "사진"을 어떻게 표시할 것인가 — 브리프는 "가짜 이미지 URL 금지,
deterministic placeholder"만 요구.
**무엇으로 정했나:** 각 comp/아이템의 condition 첫 글자(L/G/F 등) 또는 제목 첫 글자를 넣은 단색
모노그램 박스 (`compIcon`/`itemIcon`), wallet 스크린의 `TypeBadge` 패턴을 그대로 재사용.
**왜:** 이미 이 카탈로그에 정착된 규약이고, 어떤 랜덤 요소도 없이 고정 데이터에서 결정적으로
도출된다 — 매 렌더마다 같은 글자가 같은 아이템에 뜬다.

**6. 무엇을 정해야 했나:** "Continue" 버튼을 눌렀을 때 실제로 무슨 일이 일어나는가 — 이 카탈로그엔
네비게이션 스택이 없다(각 화면이 독립 렌더).
**무엇으로 정했나:** 로컬 state(`confirmedPrice`)를 설정해 "Price set to ₩X for this listing."
배너를 실제로 띄운다. `accessibilityHint`도 정확히 그 동작만 약속("Confirms ₩X as this listing's
price").
**왜:** 브리프가 "존재하지 않는 걸 약속하는 accessibilityHint 금지"를 명시했다. 없는 다음 스텝으로
navigate한다고 주장하는 대신, 이 화면 안에서 실제로 검증 가능한 로컬 동작(가격 확정 배너)으로 hint를
100% 진실하게 유지했다.

**7. 무엇을 정해야 했나:** 스테퍼 증감폭.
**무엇으로 정했나:** ₩1,000 (comp 가격들이 천 원 단위로 끊기는 것과 일치).
**왜:** comp 데이터 자체가 1,000원 단위 정밀도라 그보다 잘게 쪼개는 스테퍼는 허위 정밀도가 되고,
그보다 크게(예: ₩10,000) 하면 "제안가와 정확히 일치" 상태를 스테퍼만으로 되찾기 어려워진다.
