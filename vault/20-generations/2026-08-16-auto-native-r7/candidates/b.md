# candidate b — Search Results (with active filters)

A query-driven search-results screen: a fixed relevance-ranked single-column list for a text search
already in progress, with three facet filters (size, condition, price) pre-applied as individually
removable chips, a live result count, an editable query field, and a sort control (Relevance / Price
low-high / Price high-low / Newest) that actually reorders the deterministic 14-item dummy dataset.
Distinguished from Discover (`evolve-r6-b`, a no-query browse grid with single-select radio chips) by
foregrounding match-to-query relevance (a per-row relevance meter + "Matches: …" token line) and
applied-filter state (removable pill chips, not swappable radio chips) over open-ended browsing.

## 브리프에 없던 것

① 결정: 고정(pinned) chrome을 둘지, r2 패턴대로 완전 스크롤 단일 리스트로 갈지.
② 결정: 하단 고정 밴드는 없음(종결 액션이 없으므로). 상단에는 얇은 "라이브 필터-상태 스트립"(쿼리
필드 + 결과 수 + 제거 가능한 활성 필터 칩 + 정렬)만 고정하고, 값이 더 무거운 facet 선택 패널
("Refine filters")은 고정하지 않고 리스트 헤더로 넣어 스크롤과 함께 흘러가게 했다.
③ 이유: r3/r5가 확립한 규칙은 "고정면은 일을 하는지로 판정한다"이고, 이 화면은 진행을 막는 종결
액션이 없으므로 r3식 "차단 상태기계" 밴드는 애초에 해당 없음(하단 고정 없음, r2 패턴과 합치). 그러나
상단 스트립은 장식이 아니라 실제 읽기/쓰기 상태 표시자다 — 칩을 지우거나 정렬을 바꾸는 조작은 리스트를
얼마나 내려갔든 항상 닿아야 하므로(그렇지 않으면 필터를 지우려고 맨 위로 스크롤해야 함, 이는 "내
위치를 잃지 않고 필터를 조정"하라는 브리프 요구와 정면충돌), 이 부분만 고정했다. 반면 facet 추가는
가끔 일어나는 동작이라 상시 엄지 존이 필요 없어 스크롤 헤더로 뺐다 — Discover(r6/b)가 검색+필터
전체를 고정 헤더에 욱여넣은 것과 의도적으로 다른 절충이다.

① 결정: KRW 가격 표기에 `fontVariant: ["tabular-nums"]`를 쓸지.
② 결정: 이 화면 전체에서 tabular-nums를 아예 쓰지 않았다(가격 숫자도 일반 Text).
③ 이유: auto-native-r4/r6 델타가 두 라운드 연속으로 재현한 렌더링 버그 — ₩ 기호가 tabular-nums
스타일 Text의 자손이면(형제로 분리해도 중첩 자식이면) 취소선 같은 렌더 아티팩트가 생긴다. 정렬은
가격 컬럼이 좁고 한 줄 카드라 tabular-nums 없이도 시각적으로 문제없어, 가장 단순하고 안전한 회피
(아예 안 씀)를 택했다.

① 결정: facet가 다중 선택(OR-within-group, AND-across-group)인지 단일 선택인지.
② 결정: 그룹 내부는 다중 선택(예: size에 M과 L을 동시에 선택 가능), 그룹 간에는 AND.
③ 이유: 브리프가 "size, condition, price range, brand"를 나열만 하고 카디널리티를 정하지 않았다.
검색 결과 화면에서 "M 또는 L 아무거나"는 실사용자 검색 패턴에 흔하고, 활성 칩이 각각 독립적으로
제거 가능해야 한다는 요구(브리프의 "removable chips")도 다중 선택 모델에서 더 명확하게 의미를 가진다
(단일 선택이면 칩을 지우는 것과 "선택 안 함"으로 되돌리는 것이 같은 동작이 되어 구분이 흐려진다).
