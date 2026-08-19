# auto-native-r8 · candidate a — Seller Storefront

A buyer's read-only view of another user's public seller profile: a profile-header band (initials avatar, display name, handle, a four-cell trust-signal stat row — rating, completed sales, membership length, average response time), then a segmented switch between "Listings" (a 2-column grid of the seller's 6 active items) and "Reviews" (a single-column list of 3 past buyer reviews with star rating, short text, and reviewer initials). The macro shape — header band + tab switch + a body whose *layout itself* changes between the two tabs (grid vs. list, not just swapped content in the same shape) — does not collapse into any of the two failure modes past rounds hit repeatedly: it is not a bare browse/search grid (Search & Discover, Discover Listings — 0-for-6 across rounds) because the grid is subordinate to and framed by an identity/trust header the user did not search for; and it is not a plain settings list (Account & Preferences already owns that shape) because the body is inspectable content about someone else, not the viewer's own controls. There is no terminal or blocking action anywhere on this screen — viewing a storefront has no "submit" — so per GENERATION.md §3 it deliberately carries no fixed bottom band.

## 브리프에 없던 것

① 결정할 것: 하단 고정 밴드를 넣을지.
② 결정: 넣지 않는다 — 화면 전체에 실제 진행-차단 액션이 없다(디스커버리 화면과 달리 여기서는 아무것도 "제출"하지 않는다).
③ 이유: GENERATION.md §3이 명시하듯 밴드는 개수가 아니라 일을 하는지로 판정되고, r3/r5/r6c/r7a가 검증한 상태기계 패턴은 진짜 선행조건이 있는 종결 액션 화면에만 적용 대상이다. 이 화면엔 그런 액션이 전혀 없어 재현 대신 부재를 선택했다 — 억지로 끼워넣는 것이 오히려 감점 대상이라는 지시를 따랐다.

① 결정할 것: 리스팅 그리드와 리뷰 리스트를 하나의 FlatList로 numColumns를 토글할지, 별도 FlatList 두 개로 나눌지.
② 결정: 탭에 따라 완전히 다른 FlatList를 조건 렌더링(각각 numColumns=2 그리드 / numColumns 미지정 1열)한다 — 공유되는 것은 ListHeaderComponent(프로필 헤더+탭바) 뿐.
③ 이유: React Native는 마운트된 FlatList의 numColumns를 런타임에 바꾸는 것을 지원하지 않는다(레이아웃 불일치로 경고/오류) — 별도 컴포넌트로 분리하는 것이 유일한 안전한 방법이었고, 이 자체가 "그리드/리스트 두 형태가 하나의 탭 스위치 뒤에 있다"는 화면 정체성을 강화했다.

① 결정할 것: 아바타(판매자 이니셜 원)에 단일 액센트를 쓸지 중립색을 쓸지.
② 결정: 판매자 아바타는 `tokens.color.accent` 배경 + `onAccent` 텍스트를 쓰고, 리뷰 작성자의 작은 아바타는 중립(`border` 테두리, 배경 없음)으로 차등을 둔다.
③ 이유: DNA(§3)는 "단일 액센트"만 허용하므로 화면에서 액센트를 쓸 자리를 하나로 좁혀야 했다 — 이 화면의 주인공은 스토어프런트 주인이므로 그 한 원에만 액센트를 쓰고, 리뷰어들(제3자, 반복 등장 요소)은 중립으로 눌러 위계를 명확히 했다. 임의 선택이지만 "화면의 주인공 하나에만 액센트"라는 규칙은 다른 화면들(예: verification의 accent=완료 단계)과 일관된 용법이다.

① 결정할 것: 이니셜 원의 borderRadius를 토큰(`radius.md`=12, `radius.sm`=6)으로 표현할 수 없는데 어떻게 원을 만들지.
② 결정: 원형 요소(아바타, 상태 점, 목업 썸네일의 산/원 장식)는 `width/height`의 절반을 `borderRadius`에 직접 수치로 넣는다 — 토큰을 새로 추가하지 않는다.
③ 이유: `disputes/DisputeCenterScreen.tsx`의 `timelineDot`(10×10 → borderRadius:5)·`photoRemove`(20×20 → borderRadius:10)가 이미 이 정확한 관용구를 쓰고 있어 기존 코드베이스 관행을 그대로 따랐다 — "원은 크기의 절반"은 디자인 토큰이 아니라 기하학적 계산값이라는 기존 판단을 재사용.

① 결정할 것: ₩ 가격 표기에 `tabular-nums`를 쓸지.
② 결정: 이 화면의 모든 가격(`priceLabel`)에 `fontVariant: tabular-nums`를 전혀 적용하지 않는다.
③ 이유: `auto-native-r4`(L1)·`auto-native-r6`(L2)가 두 라운드 연속 재현한 렌더 아티팩트(중첩 Text 트리에 ₩ 가 있으면 취소선처럼 보임)를 피하기 위해서다. 이 화면의 가격은 카드마다 독립된 한 줄짜리 사실이라 표처럼 정렬될 필요가 없어, tabular-nums의 이득이 없는 안전한 선택(쓰지 않음)을 택했다 — `r7a`가 동일한 화면급에서 내린 것과 같은 결정.
