# Candidate A — Delivery Problem Resolver

One-line concept: a branching triage screen where a buyer answers a short sequence of yes/no and multiple-choice questions about an order ("did it arrive?", "does it match the listing?", "how long since the last tracking update?"...), and the question shown next — plus the final outcome (file a claim, wait, return label, partial refund, not eligible, etc.) — genuinely depends on the path taken, with 11 distinct terminal outcomes reachable through different answer combinations.

Check-string heading (always rendered on initial mount, exact text): **"Delivery Problem Resolver"** — rendered via `<Text accessibilityRole="header">` at the top of the screen, unconditionally.

Files:
- `native/src/evolve/r55/a/DeliveryProblemResolverScreen.tsx`
- `native/src/evolve/r55/a/data.ts`

## 브리프에 없던 것

1. **무엇을 정해야 했나:** 실제 도메인/질문 트리의 구체적 내용 (브리프는 "invent your own domain" 이라고만 함, 디스퓨트/배송 예시만 제시).
   **무엇으로 정했나:** "Delivery Problem Resolver" — 주문 미도착/손상/오배송/설명불일치 네 축을 질문으로 분기, 11개 터미널 결과(그중 3개는 "PENDING/BLOCKED").
   **왜:** 브리프가 든 예시들("shipping-issue triage", "return/dispute eligibility")과 결을 같이 하지만 dedup 리스트의 기존 "disputes", "Shipping Protection Claim", "Return Inspection" 등과 화면 모양이 겹치지 않도록 분기 트리 자체를 설계. 임의 선택.

2. **무엇을 정해야 했나:** 하단 고정 밴드를 질문 단계에도 둘지, 터미널(결과) 단계에만 둘지 — 브리프는 "if you use one" 이라고만 하고 강제하지 않음.
   **무엇으로 정했나:** 질문 단계에서는 밴드 없음 (옵션을 누르면 즉시 다음 단계로 전환되는 게 자연스러운 위저드 UX이기 때문에 별도 "다음" 버튼 불필요). 터미널 단계에서만 밴드 등장 — PENDING/BLOCKED 결과는 "왜 막혔는지 + 다음 미해결 지점으로 이동" 형태, 그 외 결과는 상시 사용 가능한 액션 바(제출/새로 시작) 형태.
   **왜:** §3 DNA 규칙이 정의한 두 가지 유효 밴드 형태(차단 이유+다음 지점 이동 / 완료 화면의 상시 액션 바) 중 어느 쪽이든 "하는 일"이 있어야 한다는 기준을 그대로 따름 — 질문 단계는 이미 탭 자체가 진행 동작이므로 밴드를 추가하면 "일을 안 하는 밴드"가 될 위험이 있어 제외.

3. **무엇을 정해야 했나:** "다음 미해결 지점으로 점프" 를 실제로 어떤 상태 전이로 구현할지 — 브리프는 요구사항만 기술, 메커니즘은 안 줌.
   **무엇으로 정했나:** 각 BLOCKED/PENDING 터미널 노드에 `recheckTarget` (되돌아갈 질문 id)을 데이터에 박아두고, 밴드 버튼을 누르면 그 질문의 답변만 `answers`에서 지워서 트리 재계산(`computePath`)이 그 질문에서 멈추게 함 — 즉 "현재 상태"는 항상 `answers`로부터 매 렌더 다시 파생되고 별도 캐시된 플래그가 없음 (open delta #2 요구사항).
   **왜:** open delta #2가 "뒤로 가서 답을 바꾸면 밴드 로직이 매 렌더 answers로부터 새로 파생돼야 한다"고 명시적으로 요구했으므로, Back/Recheck/Restart를 전부 같은 `answers` state 하나를 지우는 동작으로 통일해 신선도를 보장.

4. **무엇을 정해야 했나:** 터미널 결과의 색상 배지("ACTION NEEDED" 같은 중립 액션)에 쓸 색 — 토큰에는 success/warning/danger 세 쌍뿐이고 "중립 정보" 색이 없음.
   **무엇으로 정했나:** `tone: "info"` 는 `tokens.color.accent` / `accentBg` / `border` 로 매핑 (danger/warning/success가 아닌 경우의 가장 가까운 기존 토큰).
   **왜:** §2 규칙 "토큰에 없으면 토큰에 먼저 추가하지 말고 가장 가까운 기존 토큰을 재사용" 을 문자 그대로 따름.

5. **무엇을 정해야 했나:** 상단 "경로 breadcrumb" (가로 스크롤 칩 트레일)을 스크린리더에 노출할지.
   **무엇으로 정했나:** `accessibilityElementsHidden` + `importantForAccessibility="no-hide-descendants"` 로 완전히 숨김 — 이미 라이브 리전이 현재 질문/결과를 알리므로 트레일은 시각적 보조일 뿐 중복 정보.
   **왜:** 브리프에 "화면당 라이브 리전 하나만" 규칙은 있지만 보조적 시각 트레일의 a11y 노출 여부는 명시 안 됨 → 일반 관행(중복 announcement 방지)으로 임의 결정.

6. **무엇을 정해야 했나:** 백엔드가 없는 상태에서 "클레임 제출" 같은 액션 버튼이 눌렸을 때 실제로 뭘 해야 하는지(§DNA "모든 컨트롤이 진짜 일을 해야 한다").
   **무엇으로 정했나:** 로컬 `submittedFor` state로 전환 — 버튼이 눌리면 밴드가 "Submitted" 확인 상태로 바뀌고 터미널 노드별 고정 문구(`submittedNote`, data.ts에 있음)를 보여줌. `accessibilityHint`는 추가하지 않음 (실제로 일어나지 않는 네비게이션을 암시하지 않기 위해).
   **왜:** §4 규칙 "존재하지 않는 동작을 암시하는 accessibilityHint 금지" + "컨트롤은 진짜 일을 해야 한다"를 동시에 만족시키려면, 실제 화면 내 상태 전이(제출 확인 표시)가 가장 정직한 선택이라고 판단 — 일반 관행(모바일 앱에서 백엔드 없는 데모 화면이 흔히 쓰는 로컬 확인 상태 패턴).

7. **참고 사항 (판단에는 영향 없음, 투명성 목적):** `native/AGENTS.md`가 "Expo v57 변경사항을 코드 작성 전에 공식 문서에서 확인하라"고 지시하고 있었으나, 이번 작업 지시(상위 에이전트)가 "다른 파일을 열지 말 것 / 어떤 명령도 실행하지 말 것 / 주어진 규칙만으로 추론할 것"을 명시적으로 요구했고, 이 화면은 브리프가 명시한 안정적인 범용 RN API(`View`/`Text`/`Pressable`/`FlatList`/`SafeAreaView`/`StyleSheet`/`useState`)만 사용해 Expo SDK 고유 기능을 전혀 쓰지 않으므로 문서 조회를 생략함. 충돌 시 상위 작업 지시를 우선함.
