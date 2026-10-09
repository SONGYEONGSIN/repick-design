# Candidate C — Shipping Rate Cards

A plain scrollable settings screen listing a seller's reusable shipping-fee rules ("rate cards" — carrier, service speed, fee, coverage area) that get attached to new listings, where each non-default card can be removed via an inline per-row Cancel/Confirm state and the one platform-default card renders a static "can't be removed" badge instead of a button.

## 브리프에 없던 것

1. **도메인 자체 — "Shipping Rate Cards" 선택**
   ① 무엇을 결정해야 했나: 제외 목록(Carrier pickup, Shipping Protection Claim, Saved Addresses, Price History, Price Drop Alerts 등)과 겹치지 않으면서, 각 행이 "개별적으로 파괴적 액션의 대상"이 되는 설정류 도메인을 새로 골라야 했음.
   ② 무엇으로 결정했나: 셀러가 리스팅에 붙이는 "재사용 가능한 배송비 규칙 카드" 목록 — 특정 배송(Carrier pickup)이나 특정 거래의 보호 청구(Shipping Protection Claim)가 아니라, 리스팅 작성 시 선택하는 사전 설정 템플릿.
   ③ 왜: 리세일 마켓 셀러 센터에 흔히 있는 "shipping profile/rate table" 패턴(이커머스 플랫폼의 셀러 배송 설정 관습)에서 착안. 제외 목록의 어떤 항목과도 필드·목적이 겹치지 않도록 "건당 배송"이 아닌 "규칙 자체의 CRUD"로 범위를 좁힘.

2. **잠김(locked) 행의 존재와 사유**
   ① 무엇을 결정해야 했나: 브리프가 "자연스러우면 3번째 상태(잠김 뱃지)를 포함하라"고 했으므로, 왜 하나의 카드만 삭제 불가능한지 서사가 필요했음.
   ② 무엇으로 결정했나: "Standard Flat Rate"를 플랫폼 기본 폴백 카드로 설정 — 다른 카드가 하나도 안 맞을 때 자동 적용되는 규칙이라 삭제 시 리스팅이 배송비 미설정 상태가 될 위험이 있다는 설정.
   ③ 왜: 실제 마켓플레이스(예: 쿠팡/이베이 셀러센터의 "기본 배송 템플릿")가 최소 1개의 폴백 규칙을 강제하는 관습을 따옴 — 임의가 아니라 도메인상 합리적인 제약으로 설계.

3. **행 내 비파괴적 보조 액션(Activate/Deactivate 토글)의 포함 여부**
   ① 무엇을 결정해야 했나: 브리프는 파괴적 액션만 요구했지만, 행마다 "Remove" 버튼 하나만 있으면 화면이 단조로워 "진짜 기능처럼" 느껴지지 않을 위험이 있었음.
   ② 무엇으로 결정했나: 삭제와 별개로 카드를 active/inactive로 전환하는 비파괴적 버튼을 같은 행에 추가 — 단, 이 토글은 confirm 플로우를 타지 않고 즉시 적용(되돌릴 수 있는 가벼운 액션이므로).
   ③ 왜: 삭제(비가역)와 비활성화(가역)를 구분하는 것은 일반적인 설정 UI 관습이며, 헤더의 derived stat("N of M currently selectable")이 이 상태와 리스트 상태 둘 다를 반영하도록 해 "같은 소스로부터 파생된 통계" 요구사항을 더 의미 있게 만듦.

4. **₩ 표기 방식**
   ① 무엇을 결정해야 했나: 브리프가 제시한 3가지 선택지(간격, KRW 라틴 표기, 그대로 사용) 중 하나를 골라야 했음.
   ② 무엇으로 결정했나: "KRW 3,000" 형태의 라틴 표기를 전면 채택.
   ③ 왜: 배송비처럼 여러 자리 숫자·수식(예: "KRW 12,000, plus KRW 1,200/kg")이 한 줄에 섞이는 카피에서는 ₩ 글리프보다 "KRW" 접두사가 가독성이 높다고 판단 — 임의 선택이지만 숫자가 복잡한 이 화면 특성에 맞춘 근거 있는 선택.

5. **삭제 확인 카피 문장**
   ① 무엇을 결정해야 했나: 금지된 두 템플릿("...This can't be undone from here." / "...will stop syncing.")을 피해 이 도메인에 맞는 새 확인 문구를 써야 했음.
   ② 무엇으로 결정했나: "Remove this rate card? You'll need to recreate it to use it again." (핸들러가 실제로 하는 일 — 리스트에서 제거 — 만을 정확히 설명, 핸들러가 건드리지 않는 "리스팅 재계산" 등은 언급하지 않음).
   ③ 왜: 브리프의 "핸들러가 실제로 수행하지 않는 기술적 부수효과를 암시하는 카피 금지" 규칙을 지키기 위해, 이 화면 상태(리스트)에 없는 "다른 리스팅" 데이터에 대한 약속을 피하고 이 화면이 실제로 하는 일만 서술.

## 파일
- `native/src/evolve/r33/c/ShippingRateCardsScreen.tsx` — 메인 화면
- `native/src/evolve/r33/c/RateCardRow.tsx` — 행 컴포넌트 (idle / confirming / locked 3상태)
- `native/src/evolve/r33/c/data.ts` — 결정론적 더미 데이터 6건 (1건 locked, 상태 mix)
