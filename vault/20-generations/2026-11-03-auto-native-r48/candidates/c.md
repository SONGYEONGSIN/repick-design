# Candidate C — Bulk Price Drop

A 2-column multi-select listing grid where tapping preset percentage chips on a bottom contextual bar discounts every checked item at once, and each discounted cell persists in place with a strikethrough-old/new price and an inline Undo → Confirm-revert affordance instead of disappearing.

## 브리프에 없던 것

1. ① 할인 적용 후 선택 상태를 유지할지 해제할지 ② 적용된 항목은 `selectedListingIds`에서 제거해 선택 풀을 비움 ③ 적용된 셀은 이미 자신만의 "applied" 상태로 전환되므로 선택/보류 상태와 공존시키면 셀이 두 가지 의미를 동시에 표시하게 되어 모호해짐 — 또한 이 비움이 `hasSelection`을 자연히 false로 만들어 바를 숨기는 유일한 트리거가 됨

2. ① Undo/Change 중 어느 라벨을 쓸지 (브리프가 둘 다 예시로 제시) ② "Undo" 단일 라벨로 통일 ③ 전자상거래 일반 관행상 "되돌리기" 동작에는 Change보다 Undo가 의도를 더 명확히 전달함 (일반 관행 참조)

3. ① 적용된 셀을 다시 탭해서 재선택할 수 있게 할지 ② 불가능하게 함 — applied 상태의 외곽 래퍼는 Pressable이 아닌 plain View ③ 적용/선택이 동시에 가능하면 "한 번에 하나의 셀만 되돌리기 확인 중" 불변식과 상태 조합이 늘어나 단순성이 깨짐, 임의 선택이지만 보수적으로 좁힘

4. ① 그리드 2열 레이아웃에서 열 간/행 간 간격을 어떻게 줄지 ② `columnWrapperStyle`과 `contentContainerStyle`에 RN flexbox `gap` 사용 ③ 좌/우 컬럼별 marginLeft/Right 분기 로직 없이 동일한 `cell` 스타일을 양쪽에 그대로 쓸 수 있어 더 단순함 (임의 선택, flexbox gap은 최신 RN 표준 기능)

5. ① 컨텍스트 바에 "선택 해제"용 별도 버튼을 둘지 ② 두지 않음 — 선택 해제는 각 셀을 다시 탭해 토글하는 것으로 충분 ③ 브리프가 요구한 요소(카운트 라이브 리전 + 프리셋 칩)만으로 범위를 좁혀 과도한 기능 추가를 피함 (임의 선택, 범위 최소화)

6. ① 할인율 계산 시 소수점 처리 방식 ② `Math.round`로 센트 단위 반올림 ③ 통화 최소 단위(센트) 이하 값은 존재하지 않으므로 사사오입이 일반 관행이며 검증 가능한 고정 수치가 나옴 (일반 관행 참조)
