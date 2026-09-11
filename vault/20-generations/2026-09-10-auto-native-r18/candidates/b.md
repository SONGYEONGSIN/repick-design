# Candidate b — Saved Searches & Price Alerts Manager

**Concept**: A chrome-less settings screen listing the buyer's saved searches (brand/model, size, price ceiling, condition); every row's notify toggle, size, price, and condition applies immediately and independently — no Save button, no draft state — and deleting a search shows an inline "Removed · Undo" row instead of a modal confirm.

**Check string** (exact visible heading text for the render-check): `Saved Searches & Alerts`

## 브리프에 없던 것

1. **결정할 것**: 저장된 검색의 "쿼리"를 어떻게 표현/편집할지 — 브리프 예시("Nike Dunk Low, size 270, under ₩150,000")는 자유 텍스트처럼 보이지만, 편집 UI를 어떻게 만들지는 안 정해져 있었다.
   **결정**: 브랜드/모델명은 고정 라벨로 두고, 사이즈·가격 상한·컨디션 세 필드만 칩/스테퍼/세그먼트로 즉시 편집 가능하게 만들었다(자유 텍스트 입력 없음).
   **이유**: `account/Preferences.tsx`가 이미 검증한 "즉시 적용 인라인 필드" 관용구(세그먼트·스테퍼)를 그대로 재사용할 수 있고, 키보드 입력 없이도 모든 필드가 터치만으로 완결된다 — RN 모바일에서 이게 더 관용구에 맞다고 판단.

2. **결정할 것**: "새 저장 검색 추가" 어포던스가 정확히 무엇을 해야 하는지 — 브리프는 "리스트 상/하단 행 또는 헤더 레벨 어포던스"라고만 명시했다.
   **결정**: 헤더 바로 아래 고정되지 않은 스크롤 내 행("+ Add a saved search")으로 두고, 누르면 기본값을 가진 새 항목을 리스트 맨 위에 추가하면서 곧바로 그 항목의 편집 패널을 연다.
   **이유**: `accessibilityHint`로 안 지켜질 동작을 약속하지 말라는 규칙(GENERATION.md §4) 때문에, "추가"가 실제로 뭔가를 만들고 그 자리에서 편집 가능해야 진짜 동작이 된다 — 빈 모달이나 별도 폼 화면으로 보내지 않았다.

3. **결정할 것**: undo가 "auto-settle"되는 정확한 트리거 — 브리프는 "사용자가 넘어간 뒤 자동 정착"이라고만 했지 타이머인지 다른 조작인지는 안 정했다.
   **결정**: `setTimeout`/시계 기반이 아니라, 다른 행을 토글·편집·추가·삭제하는 등 **다음 상태 변경 조작**이 일어나는 순간 보류 중이던 삭제를 확정(placeholder 제거)하게 만들었다. 명시적 Undo/Dismiss 버튼도 별도로 뒀다.
   **이유**: GENERATION.md §5(결정론 — `Date.now`/bare `new Date` 금지)와 정확히 충돌하지 않더라도, 타이머 기반은 렌더 체크·테스트 환경에서 비결정적으로 보일 위험이 있어 사용자 조작에 결합된 결정론적 트리거를 택했다 — `relist/BulkRelistScreen.tsx`의 undo 바 패턴(다른 조작 시 `setUndo(null)`)과 같은 방향.

4. **결정할 것**: 알림 토글 컴포넌트를 네이티브 `Switch`로 할지 커스텀 `Pressable` 토글로 할지 — 브리프는 둘 다 허용했다.
   **결정**: `account/Preferences.tsx`와 동일한 커스텀 `Pressable` track/thumb 토글을 재사용했다(네이티브 `Switch` 미사용).
   **이유**: 네이티브 `Switch`는 플랫폼 기본 색상을 쓰기 때문에 토큰(`tokens.color.accent`) 하나로 색을 통제하기 어렵고, 이미 이 코드베이스에서 a11y(`accessibilityRole="switch"` + `accessibilityState`)까지 검증된 패턴이 있어 그대로 재사용하는 편이 일관성 있다고 판단.
