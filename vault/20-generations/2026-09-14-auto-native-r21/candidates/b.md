# Candidate b — Compare Items: a pinned-rail spec grid for watchlisted items

A multi-column comparison screen where 1-3 watchlisted items sit side by side against six shared spec rows (price, condition grade, seller rating, ship time, authentication, price trend), with a fixed left-hand row-label rail and horizontally-scrolling item columns; each row marks its best value with a checkmark + "Best" text, and each column header carries a remove control while a chip strip below lets you add items back in.

## 브리프에 없던 것
- 비교 가능한 아이템 풀 크기/구성: 브리프는 "2-3개 저장/워치리스트 아이템"이라고만 함 — 4개짜리 워치리스트 풀(`ALL_ITEMS`)을 만들고 그중 3개를 초기 비교 세트로, 1개를 "추가 가능" 상태로 남겨 add/remove 상호작용을 둘 다 실증할 수 있게 임의로 정함.
- 스펙 행 6개의 정확한 종류·순서: 브리프가 예시로 든 것(price, condition grade, seller rating, est ship time, authentication status, price trend)을 그대로 6행으로 채택 — 추가 행은 만들지 않음(카탈로그 관행상 한 화면에 과하지 않은 밀도 유지).
- "최고값" 판정 규칙(행별 asc/desc): 가격·배송일·가격추세는 낮을수록 좋음(asc), 평점은 높을수록 좋음(desc), condition/인증 상태는 등급을 숫자 랭크로 매핑(Like New=1…Fair=4, Verified=1…Not submitted=3)해서 asc로 비교 — 브리프에 등급 비교 기준이 없어 직접 랭크 테이블을 만듦.
- price trend의 "베스트" 의미: 30일 변동률이 가장 크게 하락한(가장 음수인) 아이템을 "베스트"로 표시 — "최근에 가장 많이 떨어졌으니 지금이 살 때"라는 해석을 임의로 채택(반대 해석도 가능하다는 점은 인지, 하지만 표에 일관된 규칙이 필요해 하나를 정함).
- 비교 세트 최대/최소 개수: 브리프의 "2-3개"를 상한 3(`MAX_COMPARE`)으로 못박고, 하한은 강제하지 않음(0개까지 제거 가능 → 빈 상태 카드로 안내). 1개만 남았을 때는 막지 않되 "베스트" 하이라이트만 숨김(비교 대상이 1개면 최고값 표시가 의미 없으므로).
- 열/행 고정 치수: `HEADER_CELL_HEIGHT=96`, `DATA_CELL_HEIGHT=60`, `COLUMN_WIDTH=152`, `RAIL_WIDTH=108` — 레일과 각 컬럼의 행이 시각적으로 정렬되려면 고정 높이가 필요해서 임의로 정한 값(스와이프 시 다음 컬럼이 일부 보이도록 폭도 함께 조정).
- 상태 메시지 정확한 카피: "Removed X — comparing N items.", "Added X — comparing N items.", "Comparing the maximum of 3 items — remove one to add X." 등 — 브리프는 "announce" 요구만 했지 문구는 없어 직접 작성.
- ₩ 표기 방식: GENERATION.md의 (a)/(b)/(c) 중 (a)를 택해 `formatWon`에서 "₩ " (공백 포함)로 출력.
- 밴드 없음 결정: GENERATION.md §3이 명시적으로 허용한 "no band"를 채택하고, 대신 작은 상태 라이브 리전만 그리드 위에 배치 — 지속형 액션 바("Compare with all watchlist items" 등)는 만들지 않기로 함(단일 종료 액션이 없는 탐색형 화면이라 판단).
