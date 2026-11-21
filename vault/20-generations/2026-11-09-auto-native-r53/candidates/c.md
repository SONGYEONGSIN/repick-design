# Candidate c — Size & Fit Reference

A bandless browse/lookup screen for secondhand-marketplace shoppers: filterable, searchable, sortable size-conversion charts (Tops / Bottoms / Shoes / Outerwear) that expand inline to reveal the full chart, with a metric/imperial unit toggle — no selection, no checklist, no bottom surface of any kind.

**Component:** `SizeReferenceScreen` (default export)
**File:** `native/src/evolve/r53/c/SizeReferenceScreen.tsx` (+ `native/src/evolve/r53/c/data.ts`)
**Exact rendered heading text:** `Size & Fit Reference`

Interaction types present, all affecting what's on screen directly (no gating step between any of them and seeing the result):
1. Category filter chips (All / Tops / Bottoms / Shoes / Outerwear)
2. Free-text search over garment name/category
3. Sort toggle (catalog order vs. A–Z)
4. Metric/imperial unit toggle, recomputing every visible chart's values
5. Per-card expand/collapse to reveal the full size table

The live region (`accessibilityRole="alert"` + `accessibilityLiveRegion="polite"`) sits on the result-count summary line only, since that's the one place a value changes (filtered/searched count) that a screen-reader user could otherwise miss silently. Expand/collapse and the unit toggle each announce their own state via `accessibilityState`/`accessibilityLabel` on the control itself, so no extra alert was added there — nothing is silently lost.

## 브리프에 없던 것

1. **무엇을 결정해야 했나:** 밴드 없는 화면에 어떤 "탐색형" 도메인을 쓸지 — 브리프는 도메인을 지정하지 않음.
   **결정:** 중고 거래에서 실제로 반복되는 니즈인 "사이즈/핏 변환표 참고"로 정함 (의류/신발 브랜드별 치수 비교).
   **이유:** 기존 25개 프로덕션 화면과 112개 아카이브 전부를 훑었을 때 "사이즈 변환 참고"는 겹치지 않았고, 본질적으로 선택지/완료 개념이 없는 순수 참고형 콘텐츠라 "absence is a valid choice"를 가장 깨끗하게 증명할 수 있다고 판단함.

2. **무엇을 결정해야 했나:** 단위 토글(미터법/인치)을 "밴드"로 볼지 아닌지의 경계.
   **결정:** 화면 상단에 고정된 세그먼트 컨트롤로 배치하고, 이것은 "선택에서 파생된 하단 표면"이 아니라 전역 디스플레이 설정(검색/정렬과 동급의 평범한 상단 컨트롤)으로 취급함.
   **이유:** 브리프가 금지한 것은 "고정 하단 밴드"와 "선택에서 파생되는 맥락 표면"이지, 화면 상단의 일반 컨트롤이 아니므로 — 검색창이나 정렬 토글과 같은 레벨의 UI로 설계함.

3. **무엇을 결정해야 했나:** 사이즈 데이터 자체의 수치 (브랜드별 실측값은 브리프에 없음, 임의로 지어내야 함).
   **결정:** 일반적으로 알려진 US/UK/EU 사이즈 변환 관례와 흔한 bust/waist/chest cm↔inch 범위를 그대로 사용 (예: W30 = 76cm/30in, EU 42 = US 9 남성 신발 등).
   **이유:** 결정론적 요구사항(Math.random 금지)을 만족시키면서도 실제로 존재하는 변환 관습에 가깝게 맞춰 신뢰도 있는 더미 데이터처럼 보이게 함 — 임의의 숫자이지만 현실의 사이즈 차트 관습에서 벗어나지 않게 선택.

4. **무엇을 결정해야 했나:** `TextInput`을 핵심 import 라인에 추가할지 — 브리프의 "mandatory import line"은 View/Text/Pressable/FlatList/SafeAreaView/StyleSheet만 명시함.
   **결정:** 검색이라는 상호작용 유형을 구현하려면 RN 표준 `TextInput`이 필요하므로 같은 `react-native` import 문에 추가함.
   **이유:** 브리프의 import 라인은 "최소 요구 집합"으로 해석했고, 금지 목록에 TextInput이 없으며 RN 표준 컴포넌트이므로 이 화면의 핵심 상호작용(검색)을 위해 반드시 필요했음.

5. **무엇을 결정해야 했나:** 카드별 확장(expand/collapse) 상태를 단일 선택(한 번에 하나만 열림)으로 할지, 다중 선택(여러 개 동시에 열림)으로 할지.
   **결정:** `Set<string>`으로 다중 확장을 허용함 (여러 카드를 동시에 펼쳐서 비교 가능).
   **이유:** "비교"가 이 화면의 핵심 가치 중 하나(여러 브랜드 차트를 나란히 보기)이므로 아코디언처럼 하나로 제한하면 오히려 탐색형 도메인의 목적에 반한다고 판단 — 임의 선택이지만 도메인 목적에 맞춘 선택.

6. **무엇을 결정해야 했나:** 신발 사이즈의 "metric/imperial" 의미를 어떻게 body-measurement 차트와 통일할지 — 신발은 본질적으로 cm/in이 아니라 EU/US/UK 체계임.
   **결정:** 단위 토글을 "metric → EU 사이즈 표시", "imperial → US 사이즈 표시"로 매핑하고, 각 신발 가이드 카드의 helperNote에 그 사실을 명시함.
   **이유:** 화면 전체에 하나의 토글만 두어 단순성을 유지하면서도(밴드 없이 상단 컨트롤 하나), 신발 사이즈 체계의 실제 관습(신발에는 cm/in보다 US/UK/EU가 더 흔함)을 왜곡하지 않도록 명시적 안내 문구로 보완함.
