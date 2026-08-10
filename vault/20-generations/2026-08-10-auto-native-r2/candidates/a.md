# a — Search & Discover (Discover)

**한 줄**: 검색바 + 토글형 필터 칩(브랜드·사이즈·컨디션·가격) 행이 2열 카드 그리드를 실시간으로 좁힌다. 칩·검색은 그리드 스크롤 영역 밖에 있어 상시 고정되고, 하단 액션바는 없다.

- 배정 화면유형: **쿼리 기반 탐색/브라우즈(검색+필터 그리드)** — 차별 축 "query-driven exploration"
- 기존 화면(왓치리스트·매치·상세·오퍼스레드)이 전부 사전 정의된 단건/목록을 그대로 보여주는 데 대한 대비 — 사용자가 검색어·필터를 조작해 스스로 결과 집합을 좁히는 유일한 화면
- 매크로 골격: 헤더 + 검색바(고정) + 수평 스크롤 필터 칩 행(고정) + 결과 카운트(고정) + 2열 카드 그리드(유일한 스크롤 영역, 하단 액션바 없음)
- round 1의 3밴드 실루엣("고정 헤더 + 파생 금액 핀 카드 / 스크롤 리스트 / 하단 accent 풀폭 액션바")과 다름: 파생 금액 카드도 없고 하단 고정 액션바도 없다. 유일한 스크롤 컨테이너는 그리드 자체.

## 브리프에 없던 것

1. ① 필터 칩 간 매칭 로직(같은 facet 내 다중 선택 시 AND인가 OR인가, facet 간은?)
   ② 같은 facet(예: brand) 내 다중 선택 = OR, facet 간(brand vs size vs condition vs price) = AND
   ③ 실사용 이커머스 필터 UX 관용(Depop·Grailed류)을 따름 — "Nike 또는 Adidas, 그리고 M 사이즈"가 직관적 기대치. GENERATION.md·tokens.ts는 필터 조합 규칙을 명시하지 않아 임의 결정.

2. ① 그리드 카드에 넣을 최소 정보량(브리프는 "item name, price, thumbnail placeholder, condition"만 명시)
   ② brand·size도 추가(작은 pill 2개 + 상단 브랜드 라벨) + "SAVE/SAVED" 토글
   ③ PriceDetail의 단건 심화 콘텐츠(가격 히스토리 차트)와 겹치지 않는 선에서, WatchList의 AlertToggle처럼 그리드 카드에도 로컬 상호작용 지점 하나가 있어야 "실제 앱처럼 느껴진다"(렌즈2)는 curation-criteria 취지에 맞춰 임의 추가.

3. ① 썸네일 placeholder의 구체적 형태(브리프는 "thumbnail placeholder"라고만 언급)
   ② 정사각형(aspectRatio 1) + tokens.color.border 배경 + 브랜드 이니셜 1글자(굵게, muted 색)
   ③ 실제 이미지 없이도 브랜드 구분이 즉시 되도록 하는 최소 장치. 색은 토큰만 사용(하드코딩 금지 규칙 준수), 이모지·아이콘 라이브러리 없이 텍스트 글리프로 대체(§3 이모지 금지 규정 해석).

4. ① 가격 구간(price band) 경계값 — "price range" 칩이 무엇을 필터링하는지 브리프는 정의하지 않음
   ② 3구간: Under ₩50,000 / ₩50,000–150,000 / Over ₩150,000
   ③ 카탈로그 16개 아이템의 실제 가격 분포(19,000~189,000)를 3등분에 가깝게 나눠 각 칩이 실제로 결과를 눈에 띄게 좁히도록 임의 선택 — 등분포보다 "체감되는 필터 효과"를 우선.

5. ① "no results" 상태에서 사용자가 빠져나갈 구체적 경로(브리프는 "no results 상태를 결정론적으로 처리"라고만 요구, UI는 미지정)
   ② `ListEmptyComponent`에 안내 텍스트 + "Clear filters" 버튼(검색어·칩 전체 초기화) 배치, 필터 헤드 우측의 "Clear all"과 동일 핸들러 재사용
   ③ ux-guidelines.catalog.md "빈 상태: 안내+액션 / ✗ 백지 화면"(both, 🟡) 및 "에러 복구: 다음 단계 제시"(both, 🔴) 규칙을 그대로 따름 — dead end를 만들지 않기 위한 판단.

6. ① 검색창 clear(×) 버튼의 배치 방식(TextInput 내장 clear 버튼은 RN에 표준 API가 없음)
   ② TextInput을 감싸는 `position: relative` 컨테이너 위에 `position: absolute`로 얹은 별도 Pressable(글리프 "×")
   ③ RN core에는 웹의 `<input type="search">` clear affordance가 없어 직접 구현 필요 — nested Pressable(터치 충돌 위험)을 피하고 절대 위치 오버레이로 형제 관계를 유지하는 쪽을 택함(WatchList의 정보 블록/알림 토글이 형제로 배치된 기존 관용구 참조).

7. ① 필터 칩 행을 별도 `FlatList`로 만들지, 아니면 `ScrollView`로 만들지(브리프는 "FlatList for lists" 규칙만 있고 수평 칩 같은 소량 항목까지 강제하는지 불명확)
   ② `FlatList horizontal`로 구현(칩 16개도 데이터 배열이므로 `.map()` 금지 규칙을 그리드뿐 아니라 칩 행에도 동일 적용)
   ③ GENERATION.md §1 "리스트 → FlatList(.map() 대신 data/renderItem)"이 리스트 종류를 한정하지 않음 — 안전한 해석은 "데이터 배열을 렌더링하면 전부 FlatList"이므로 칩 행도 포함시킴.
