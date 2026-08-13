# Candidate a — Search & Browse (evolve-r4-a)

A searchable, filterable grid of every active listing on repick — the app's home/discovery surface, with a pinned live-search bar, category and price-band chips, a sort control, and a scrolling FlatList of listing cards.

## 브리프에 없던 것

① 결정: 검색창을 화면 상단에 고정할지, 필터 칩과 함께 리스트 위에서 같이 스크롤시킬지.
② 결정: 검색 입력창만 SafeAreaView 바로 아래 고정 밴드에 두고, 카테고리/가격/정렬 칩은 FlatList의 ListHeaderComponent로 넣어 결과와 함께 스크롤되게 했다.
③ 이유: native-deltas-provisional.jsonl의 학습(고정 밴드는 "일을 해야" 이긴다 — 장식/기본-비활성 고정 요소는 진다)을 검색 화면에 적용한 것. 검색어 재입력은 스크롤 중에도 반복적으로 필요한 핵심 조작이라 고정할 가치가 있지만, 필터 칩은 가끔 조정하는 보조 조작이라 고정하면 화면 상단을 영구 점유해 리스트 공간을 뺏는다 — GENERATION.md에는 이 구분이 없어 화면 목적(발견/탐색, 종결 액션 없음)에 맞춰 임의로 정했다.

① 결정: 리스트/그리드 중 어느 레이아웃으로 카드형 조각을 구성할지, 그리고 이미지가 없는 상태에서 썸네일을 어떻게 표현할지.
② 결정: 1열 리스트(가로 배치: 왼쪽 정사각 썸네일 + 오른쪽 정보 블록)로 하고, 썸네일은 OwnedGridScreen(r3/c)이 쓴 것과 같은 "테두리 박스 + 내부 도형(dot/bar)" 패턴을 재사용해 사진 없는 자리표시자로 썼다.
③ 이유: 과제 지시에 "grid or list"로 명시돼 있어 선택권이 있었다 — 조건/위치/카테고리 등 텍스트 메타데이터가 많은 화면이라 2열 그리드보다 1열 리스트가 한 줄에 더 많은 정보를 넣기 좋다고 판단(같은 라운드의 OwnedGridScreen이 이미 2열 그리드 선례라 레이아웃 차별화 목적도 있음). 썸네일 도형은 실제 이미지 자산이 없는 결정론 더미 환경에서 기존 화면이 쓴 검증된 패턴을 그대로 재사용.

① 결정: 가격 필터를 슬라이더로 만들지, 프리셋 구간 칩으로 만들지.
② 결정: "Any price / Under $50 / $50-$150 / $150-$300 / $300+" 4단계 고정 구간 칩으로 만들었다.
③ 이유: RN 슬라이더는 코어 react-native에 내장 컴포넌트가 없고(`@react-native-community/slider` 별도 패키지 필요, package.json에 없음) 새 의존성 추가는 산출 경로 제약(자기 폴더 안에서만) 및 결정론/단순성 원칙과 충돌할 수 있어, 기존에 이미 검증된 "Pressable 칩 그룹" 패턴(OwnedGridScreen의 basis 선택기, 44pt 이상 터치 타겟)을 그대로 재사용해 위험을 줄였다.

① 결정: 카드마다 실제로 동작하는 인터랙션을 무엇으로 둘지 — 상세 화면으로 가는 척하는 장식용 Pressable을 둘지, 진짜 상태를 바꾸는 조작을 둘지.
② 결정: 카드 자체는 Pressable로 감싸지 않고(진짜 이동할 상세 화면이 이 스코프에 없으므로 가짜 내비게이션 버튼을 만들지 않음), 대신 카드마다 "Save"/"Saved" 토글칩을 두어 실제 로컬 상태(찜 목록)를 바꾸는 조작으로 만들었다.
③ 이유: 과거 라운드 delta가 "장식용/무반응 고정 요소는 진다"고 지적한 원칙을 카드 단위 조작에도 확장 적용 — WatchList.tsx의 기존 코드는 onPress 없는 장식용 Pressable을 쓰고 있었지만(선례 존재), 그 안티패턴을 그대로 반복하지 않고 진짜 동작하는 조작으로 대체하기로 임의 결정했다.
