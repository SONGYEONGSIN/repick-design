# auto-native-r8 · candidate b — Write a Review

A post-transaction review composer reached after a completed order: a read-only summary card (initials badge, item title/condition, counterparty name and role, completion date, order id) sits at the top, followed by a genuinely interactive 1-5 star rating control built from vector `Svg`/`Polygon` stars (not emoji, not decorative — each star is a `Pressable` with `accessibilityRole="button"` and a label like "Rate 3 out of 5 stars"), a six-chip multi-select quick-tag row, a multiline free-text field with an always-visible label (not placeholder-only), and a submit control. Only the star rating is a hard requirement; tags and text are optional, and the disabled submit button is paired with a visible sentence explaining exactly why it's disabled rather than being silently greyed out. This macro shape — read-only identity/subject header + single required rating widget + optional multi-select + optional freeform text + one-field-gated submit — is structurally distinct from every shipped screen (no wizard steps like Listing, no chronological thread like Offer Thread, no accordion like Verification, no timeline like Disputes/Order-status, no settings list like Account) and from every past-attempted macro shape in the "avoid repeating" list; it has also never been attempted before under this name. Per the assignment's explicit guidance, the bottom-band state-machine pattern that has won three rounds elsewhere was deliberately *not* reused here in its full jump-to-field form, because a one-required-field form doesn't need a multi-field router — the screen still gets a genuine loading→success submit transition (Forms catalog: visible feedback, not silent) via a simple three-state machine (`idle` → `submitting` → `submitted`) with the success state carrying `accessibilityRole="alert"` + `accessibilityLiveRegion="polite"`, which is a plain forms-feedback requirement rather than a re-application of the bottom-band pattern.

## 브리프에 없던 것

① 결정할 것: 별점을 이모지(⭐)가 아닌 "벡터/텍스트 글리프"로 렌더하라는 규칙을 구체적으로 무엇으로 구현할지 — 유니코드 텍스트 심볼(★/☆)과 진짜 벡터(SVG path) 중 선택.
② 결정: `react-native-svg`의 `Svg`+`Polygon`으로 5각 별 모양(고정 좌표 문자열)을 그리고, 채워짐 여부는 `fill`/`stroke` 색만 토큰으로 바꾼다. 유니코드 별 글리프는 쓰지 않는다.
③ 이유: 저장소에 `native/src/charts/{LineChart,Sparkline,BarBreakdown}.tsx`가 이미 `react-native-svg`로 아이콘/그래픽을 그리는 관용구를 확립해 두었고, 진짜 벡터가 유니코드 글리프보다 "이모지로 오인될 가능성"이 원천적으로 없다 — GENERATION.md §3의 "이모지 금지(아이콘 필요 시 벡터/텍스트)" 중 더 안전한 분기를 택했다.

① 결정할 것: 리뷰 대상(주문)에서 리뷰어가 구매자인지 판매자인지 방향을 브리프가 정하지 않았다.
② 결정: 리뷰어는 구매자이고 상대(피리뷰이)는 판매자 "Jordan Whitfield"로 고정한다 — `data.ts`의 `counterpartyRole: "Seller"`.
③ 이유: repick은 양방향 리뷰를 지원하지만 요약 헤더의 문구("Reviewing this order")를 모호하지 않게 하려면 한 방향을 확정해야 했다 — 구매자가 판매자를 평가하는 흐름이 이커머스 리뷰의 기본형이라 가장 읽기 쉬운 기본값으로 택했다.

① 결정할 것: 자유 서술형 텍스트 필드에 글자 수 제한을 둘지, 두면 얼마로 할지.
② 결정: `FEEDBACK_MAX_LENGTH = 500`으로 고정하고 입력창 아래 `{length}/{500}` 카운터를 항상 노출한다.
③ 이유: Forms 카탈로그의 "인라인 검증"·"제출 피드백" 취지에 맞춰 사용자가 제출 전에 상태를 미리 알 수 있게 했다 — 500은 리뷰 한 단락 분량(2-3문장)을 넉넉히 담으면서도 요약 카드보다 화면을 시각적으로 압도하지 않는 값으로 임의 선택했다.

① 결정할 것: 태그 다중선택 목록(6개, 고정)을 `FlatList`로 렌더할지 그냥 `.map()`으로 렌더할지 — GENERATION.md §1은 "리스트 → FlatList"라고 하지만 카탈로그는 "대량 `.map()`"만 금지한다.
② 결정: `FlatList`를 쓰되 `scrollEnabled={false}` + `contentContainerStyle={flexDirection:"row", flexWrap:"wrap"}`로 칩이 자연스럽게 줄바꿈되게 했다. 반대로 5개짜리 별 행은 고정된 제어 위젯이라 판단해 `FlatList`가 아닌 직접 `STAR_VALUES.map()`으로 렌더했다.
③ 이유: 태그는 "선택 가능한 항목의 컬렉션"이라는 리스트 정체성이 뚜렷해 `ListingCreateScreen`의 옵션 리스트 관용구(작은 항목도 FlatList)를 따랐고, 별 5개는 개수가 고정된 단일 컨트롤(슬라이더의 트랙과 유사)이라 가상화 대상인 "리스트"로 보지 않는 것이 더 정확한 모델링이라고 판단했다 — 두 결정 모두 §1의 "대량 아닌 것"에 대한 재량 범위 안에서 내렸다.
