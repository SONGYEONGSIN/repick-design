# auto-native-r6 · candidate b — Discover Listings

## 화면 구조

`native/src/evolve/r6/b/DiscoverScreen.tsx` + `native/src/evolve/r6/b/data.ts`.

A general browse/search surface over the full catalog — deliberately distinct from `watchlist`
(a list of items the user already saved). Structure:

- **Fixed header** (does not scroll): H1 "Discover Listings" (`accessibilityRole="header"`) +
  live result count ("N of 12 listings") + a search `TextInput` + three filter-chip rows
  (Category, Condition, Price), each horizontally scrollable.
- **`FlatList` results grid** (`numColumns={2}`) below the header — virtualized, 12 fixed dummy
  listings, each card shows a placeholder thumbnail, category, title, price, and a condition
  badge.
- Tapping a card expands it in place into a quick-preview (description, seller, a "Save to
  watchlist" toggle, a "Close" button) — no separate screen, no off-screen confirmation.
- Pull-to-refresh (`RefreshControl`) resets search text, all three filters, and the selected
  card back to their defaults — a real, deterministic, visible effect, not a decorative spinner.

## 왜 고정 검색/필터 바인가 (fixed-vs-scrolling 판단)

`native-deltas-provisional.jsonl` r2/r3/r5 이력에 따르면 고정 밴드는 "일을 하는가"로 판정된다.
이 화면은 설정형(r2 승자 패턴, 종결 액션 없음)도 아니고 종결 액션형(r3/r5 승자 패턴, 하단
상태기계)도 아닌 **탐색/검색형**이다: 사용자가 스크롤하며 결과를 훑는 동안에도 검색어를 고치거나
필터를 바꾸는 것이 화면의 핵심 조작이므로, 그 도구를 스크롤 밖에 고정해 항상 닿게 하는 것이 이
화면 유형에 맞는 선택이라고 판단했다. 과제 지시문도 이 패턴을 명시적으로 정당한 것으로 허용한다.
다만 하단에는 어떤 고정 밴드도 두지 않았다 — 종결 액션이 없는 화면이므로 r1이 지적한 "고정
헤더+핀카드+스크롤+하단 액션바" 3밴드 실루엣으로 되돌아가지 않도록, 고정면은 상단 검색/필터
하나로 제한했다. 그 고정면은 표시되는 매 순간 실시간 필터링이라는 실제 일을 한다(장식이 아님).

## 구현한 실제 인터랙션 (3개 이상)

1. **실시간 텍스트 검색** — `TextInput` onChangeText가 제목/카테고리 문자열을 대소문자 무관
   매칭해 그리드를 즉시 좁힌다 (`filterListings`, 고정 로직·부작용 없음).
2. **필터 칩 3그룹**(Category/Condition/Price, 각 단일 선택) — 선택 시 배경색뿐 아니라
   테두리 두께(1→2pt) + 볼드체 + 체크마크(✓) 접두어까지 함께 바뀌어, 색만으로 상태를
   전달하지 않는다(catalog "색만으로 전달 금지" 항목 준수). 각 칩은
   `accessibilityRole="button"` + `accessibilityState={{selected}}`.
3. **탭하여 카드 확장(quick-preview)** — 카드를 탭하면 같은 셀 안에서 설명·판매자·저장 버튼이
   펼쳐진다(별도 화면/오프스크린 확인 없음 — r3 lens3가 지적한 "확인이 탭 시점에 안 보이는" 문제를
   피하기 위해 의도적으로 카드 내부에 둠). 다시 탭하거나 Close로 접는다.
4. **Pull-to-refresh** — `RefreshControl`로 당기면 검색어/필터/선택 상태를 결정론적으로 기본값
   으로 되돌린다(임의값·현재시각 없음, 고정된 500ms 지연 후 리셋).
5. (부가) **빈 상태** — 필터 조합으로 결과가 0개면 안내 문구 + "Clear filters" 버튼을 보여준다
   (catalog Interaction/Feedback "빈 상태" 항목).

## 토큰·SafeArea·결정론 확인

- 색상은 전부 `tokens.color.*`(bg/accent/onAccent/ink/ink2/muted/faint/border)만 사용 — 하드코딩
  hex 없음. 새 색이 필요한 지점(없음)은 발생하지 않았다.
- 최상위 래퍼는 `SafeAreaView`(`DiscoverScreen.tsx` 최상단) — 게이트가 검사하지 않아도
  r1 delta에 따라 명시적으로 적용.
- `data.ts`의 모든 더미 값은 고정 리터럴 + 순수 함수(`filterListings`/`priceBand`/`formatKRW`)뿐이며
  `Math.random`/`Date.now`/인자 없는 `new Date()`를 쓰지 않는다. `setTimeout`은 pull-to-refresh의
  고정 500ms 지연에만 쓰였고 값 자체는 결정론적이다.
- **₩ + tabular-nums 위험 회피(r4 delta)**: 가격 텍스트(`formatKRW` 출력)를 렌더링하는 모든
  `Text` 노드에 `fontVariant:["tabular-nums"]`를 적용하지 않았다 — 숫자 정렬보다 r4에서 관측된
  렌더링 아티팩트 회피를 우선했다.

## 브리프에 없던 것

- ① **결정할 수밖에 없었던 것**: 리세일 마켓플레이스에 필요한 카테고리 분류·가격 구간·조건
  등급의 정확한 값이 브리프에 없었다.
- ② **결정한 내용**: 카테고리 6종(Electronics/Furniture/Clothing/Books/Accessories/Sporting
  Goods), 조건 3단계(Like New/Good/Fair — 기존 `MatchList`/`WatchList` 더미가 이미 쓰는 등급
  어휘와 맞춤), 가격 구간 3단(Under ₩50,000 / ₩50,000–200,000 / Over ₩200,000). 아이콘은
  벡터 라이브러리가 `native/package.json`에 없어(react-native-svg는 있지만 아이콘 세트 없음)
  카드 썸네일에 카테고리 2글자 약어(EL/FN/CL/BK/AC/SG)를 텍스트 글리프로 썼고, 증감/닫기
  등의 조작 글리프는 기존 `Preferences.tsx`가 이미 쓰는 관용구(−/+)와 같은 방식으로 유니코드
  문자(✓)만 사용했다.
- ③ **이유**: 새 의존성을 추가하지 않고(GENERATION.md §1 RN 관용구 범위 내), 이미 화면들이
  쓰는 등급 어휘(WatchList/MatchList의 grade·condition 톤)와 자연스럽게 이어지도록 하기 위해서.
