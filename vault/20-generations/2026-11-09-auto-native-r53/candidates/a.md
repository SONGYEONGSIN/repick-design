# Candidate a — Pop-Up Booth Registration gate

A seller's "reserve a table at a local pop-up market" screen, blocked until three independently-named conditions clear (identity verification for the event, booth fee payment, and a minimum-size tagged inventory manifest); the fixed bottom band names whichever single cause is currently active and, on tap, scrolls and moves accessibility focus to that exact unresolved control — a different target for each of the three causes.

## Component / heading (for gate registration)

- Default-exported component: `BoothRegistrationGateScreen`
- File: `native/src/evolve/r53/a/BoothRegistrationGateScreen.tsx`
- Exact rendered heading text (appears as real `<Text accessibilityRole="header">`, not just a comment/prop): `Pop-Up Booth Registration`

## 브리프에 없던 것

1. **도메인 자체** — 브리프는 "multi-condition gate가 자연스럽게 존재하는 도메인"만 요구. 팝업 마켓 부스 예약(신원 인증 / 부스비 결제 / 재고 매니페스트 태깅)이라는 구체 도메인과 세 조건의 정체·이름은 전부 새로 발명했다. dedup 목록에 없는 영역인지 재차 확인한 뒤 선택.

2. **동시 차단 시 우선순위 규칙** — "여러 조건이 동시에 막혀 있으면 원인별로 다른 곳으로 보내라"는 요구는 있지만, 어느 조건을 먼저 보여줄지는 미지정. identity → payment → manifest 순서를 임의로 정했다 (신원 확인이 먼저라는 게 가장 논리적인 실제 업무 순서라고 판단). 초기 더미 데이터는 세 조건을 모두 막힌 상태로 둬서(식별 미인증·수수료 미납·3/6 태깅) 기본 렌더만으로 전체 메커니즘이 드러나게 했다.

3. **"jump" 구현 방식** — "real scroll/focus, not just a text update"라는 요구만 있고 API는 미지정. `ScrollView` + `onLayout`으로 섹션 절대 오프셋을 측정 → `scrollTo` → `setTimeout(350ms)` 후 `findNodeHandle` + `AccessibilityInfo.setAccessibilityFocus`로 실제 네이티브 접근성 포커스를 이동시키는 방식을 썼다. 이 패턴은 임의 발명이 아니라 이 레포의 r34/r45/r47 라운드에서 이미 쓰인 전례를 그대로 재사용한 것 — 새 관용구를 만들지 않기 위한 의도적 선택.

4. **전부 해제된 뒤 밴드가 어떻게 되는지** — 교리는 "조건부 밴드"(모양 a) 아니면 "할 일 없을 때 부재"(모양 b)만 제시하고, 모양 a를 쓰다가 전부 풀리면 어떻게 되는지는 안 알려줬다. 밴드를 사라지게 하는 대신, 같은 고정 밴드 자리가 그대로 "Confirm Booth Reservation" 실제 액션으로 바뀌도록 했다 — 아직 확인(confirm) 버튼을 눌러야 하는 진짜 미완료 작업이 남아있으므로 "할 일이 없는" 상태(모양 b)가 아니라고 판단했고, 교리의 핵심 기준("뭔가를 하는가")을 두 상태 모두에서 충족시키는 쪽을 선택.

5. **구체적 수치** — 부스비 $45.00, 최소 매니페스트 품목 6개(총 8개 중 3개 기본 태깅됨), 행 높이 64pt(스크롤 오프셋 계산용 고정값, 4의 배수라 토큰 리듬과는 맞지만 `tokens.space()`를 통해 생성하진 않음) — 전부 임의 결정, 단 전체 메커니즘이 기본 렌더에서 다 드러나도록 역산해서 고른 값.

6. **접근성 레이블 분화 정도** — "Review" 버튼의 화면에 보이는 문구는 세 조건 모두 "Review"로 고정해 시각적으로 단순하게 유지했지만, `accessibilityLabel`은 조건별로 다르게 썼다 ("Go to identity verification" / "Go to booth fee payment" / "Go to next item that needs tagging"). 브리프는 "jump 동작"의 분기만 요구했는데, 스크린리더 사용자에게도 같은 의미가 전달되도록 접근성 레이블까지 분화시킨 건 추가 판단.

7. **accessibilityHint 문구** — 모든 Pressable이 실제로 상태를 바꾸는 진짜 동작이라 (no-op이 하나도 없음), 전부 참인 힌트를 달았다. "없는 기능을 약속하지 말라"는 규칙은 지켰지만 애초에 no-op을 하나도 두지 않기로 한 것 자체가 임의의 설계 선택.
