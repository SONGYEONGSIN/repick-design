# Candidate b — Consignment Partners

1. **Concept:** A list of the people who consign items to you for resale ("Consignment Partners"), each row showing their consigned/sold/paid-out stats, where the per-row destructive action is permanently **ending the consignment partnership** (they can no longer send you items to resell).

2. **Gate registration:**
   - Default export component: `ConsignmentPartnersScreen`
   - File: `native/src/evolve/r53/b/ConsignmentPartnersScreen.tsx`
   - Exact rendered heading text (verbatim, `accessibilityRole="header"`): `Consignment Partners`

## 브리프에 없던 것

- **① 도메인 선택 (consignment partners)** — ② 재판매 위탁을 맡기는 사람들의 목록, 행마다 "파트너십 영구 종료"라는 파괴적 행동. ③ dedup 목록에 "Linked Bank Accounts" · "Linked Marketplaces" · "Linked Social Accounts" · "Blocked Users/Accounts" 등 "목록 + 행 단위 해제" 화면이 많았지만 전부 플랫폼/계정 연결 해제이거나 차단이었음. 위탁 판매 파트너(다른 사람이 나에게 물건을 맡겨 대신 팔아주는 C2C 특유의 관계)는 어디에도 없어 임의로 고름 — repick이 C2C 마켓플레이스라는 설정에 맞는, 아직 다뤄지지 않은 구체 도메인이 필요했기 때문.

- **① 종료 후 행이 어떻게 보여야 하는가** — ② 종료된 파트너는 목록에서 사라지지 않고 "Partnership ended" 정적 텍스트로 영구히 남는다 (되돌리기 버튼 없음). ③ "열린 학습" 항목의 "비파괴적 결과는 3번째 상태로 남아 Change로 재오픈" 규칙을 참고했지만, 이 행동은 명시적으로 **비가역**이라고 브리프가 규정했으므로 "Change" 어포던스를 주면 §4의 "일어나지 않을 일을 힌트로 약속하지 마라" 규칙을 위반하게 된다. 그래서 그 규칙의 정신(사라지지 않고 남아 결과를 보여줌)만 가져오고 되돌리기 어포던스는 의도적으로 생략했다 — 임의 선택이 아니라 두 규칙이 충돌할 때 더 구체적인(§4, 명시적 금지) 규칙을 우선한 것.

- **① 공유 상태의 정확한 모양** — ② `EndFlowCursor = { partnerId: string | null; stage: "resting" | "awaitingConfirm" }` 하나로 확인 중인 행을 추적하고, 종료된 행 집합은 별도의 `closedPartnerIds: string[]`로, "방금 종료되어 알림을 내야 하는 행 하나"는 또 별도의 `justClosedPartnerId: string | null`로 분리했다. ③ 브리프가 "공유 변수 하나로 활성 확인은 전역에서 최대 1개"를 요구했지만, 종료는 비가역·영구 기록이라 확인-커서와 같은 생애주기를 가질 수 없었다(확인은 resting으로 돌아가야 하지만 종료 기록은 영구히 남아야 함). 그래서 "지금 확인 중인 행"과 "영구히 종료된 행들"을 분리하고, 그 중 "방금 사용자가 종료시킨 행 하나"만 더 추적해 라이브 리전이 두 번째로 겹치지 않게 했다 — 임의 설계이지만 "전역에 활성 라이브 리전은 항상 최대 1개"라는 제약을 두 종류의 전환(확인 열기/종료 확정) 모두에서 구조적으로 보장하기 위한 선택.

- **① 초기 시드 데이터에 이미 종료된 파트너를 넣을지** — ② 5명 중 1명(`p5`, Noa Lindqvist)을 `initiallyEndedPartnerIds`로 마운트 시점부터 이미 종료 상태로 시드했다. ③ 브리프엔 지시 없음. 화면을 열자마자 터미널 상태(종료됨)의 시각적 모습을 상호작용 없이 보여주는 것이 "핵심 가치는 항상 기본으로 보여야 한다"는 3-렌즈 요구와 맞다고 판단해서 임의로 추가. 다만 이 시드된 종료는 "방금 사용자가 한 일"이 아니므로 `accessibilityRole="alert"`/라이브 리전 없이 조용한 정적 텍스트로만 렌더한다(§4 "진행 가능 여부가 바뀌는 지점"에만 alert가 붙어야 한다는 규칙 — 마운트 시점의 기존 상태는 "전환"이 아니므로 alert 대상이 아니라고 해석).

- **① 통화 표시 포맷** — ② `formatUsd()`로 센트 정수를 `$12.34` 문자열로 포맷. ③ GENERATION.md의 ₩ 관련 노트는 이 라운드가 영문 전용이라 적용 대상이 아니라고 브리프가 명시했으므로, USD `$` 표기를 임의로 선택(원화 특유 이슈를 피하면서도 가격 도메인에 자연스러운 선택).

- **① 통계 숫자에 `tabular-nums`를 어디까지 적용할지** — ② 숫자만 담긴 `Text`(consigned 개수·sold 개수·paid-out 금액·헤더의 active/ended 카운트 줄)에만 `tabularNums` 스타일을 별도로 분리해 적용. ③ 브리프는 자유롭게 써도 된다고만 했지 범위는 지정하지 않음 — 레이블 텍스트와 섞인 `Text`에 걸면 레이블 글자 폭까지 바뀌어 의미가 없으므로, 숫자만 담긴 리프 `Text`에 한정하는 것이 자연스럽다고 판단.
