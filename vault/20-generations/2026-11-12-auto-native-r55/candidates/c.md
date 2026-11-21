# Candidate c — Intake Batches

One-line concept: a read-only list of seller item-intake batches where tapping a batch swaps the whole screen into a detail view showing a stage-by-stage processing timeline and a per-item status breakdown that the list row never shows, with a header "back to list" control and a real persistent "Contact Intake Support" action bar; only one batch can be focused at a time.

Check-string heading (exact, visible on initial render, in `IntakeBatchesScreen.tsx`): **"Intake Batches"**

Files:
- `native/src/evolve/r55/c/IntakeBatchesScreen.tsx`
- `native/src/evolve/r55/c/data.ts`

## 브리프에 없던 것

1. **결정 필요**: 드릴다운 대상 도메인 자체 (브리프는 예시만 주고 "invent your own" 지시).
   **결정**: "Intake Batch" — 셀러가 드롭오프 지점에 맡긴 아이템 묶음이 접수→검수→등급→등록→정산 단계를 거치는 흐름.
   **근거**: 브리프가 예시로 든 return case / auction lot / shipment leg를 그대로 베끼지 말라고 명시했으므로, repick 도메인에 맞는 새 개념(아이템 중개 전 입고 처리)을 임의로 발명함.

2. **결정 필요**: 체크스트링 헤딩의 정확한 문구/단수·복수.
   **결정**: 목록 헤딩 "Intake Batches", 디테일 헤딩 "Batch <id>".
   **근거**: 브리프는 "영어 고유 헤딩이면 된다"는 조건만 제시, 정확한 워딩은 임의 선택.

3. **결정 필요**: "back to list" affordance를 헤더 컨트롤로 둘지 하단 밴드로 둘지.
   **결정**: 헤더의 "‹ Back to Batches" Pressable로 처리하고, 하나뿐인 하단 고정 밴드는 실제 액션("Contact Intake Support")에만 사용.
   **근거**: 브리프 §3이 "back 어포던스는 헤더 컨트롤만으로도 충분하다"고 명시적으로 허용했음 — 그 선택지를 그대로 채택.

4. **결정 필요**: 어떤 단계에서 "Dispute Grading Result" 액션을 노출할지.
   **결정**: currentStage가 graded/listed/paid일 때만 노출 (등급이 매겨지기 전엔 이의제기 대상이 없으므로).
   **근거**: 브리프에 없는 업무 규칙이라 일반 상식(등급 산정 전엔 등급에 이의를 제기할 수 없다)으로 임의 결정.

5. **결정 필요**: 하단 고정 밴드의 "항상 사용 가능" 상태를 요청 후에도 유지할지, 1회성으로 소모할지.
   **결정**: 요청 후에도 버튼은 계속 눌릴 수 있는 상태로 두고 라벨만 "Support Request Sent"로 바뀌며, 매 눌림마다 확인 문구를 다시 보여줌(비활성화하지 않음).
   **근거**: 브리프 §3이 읽기 전용/완료형 화면의 하단 밴드를 "a persistent always-available action bar"로 정의 — "always-available"을 문자 그대로 지켜 버튼을 disabled 처리하지 않기로 임의 결정.

6. **결정 필요**: 이모지 금지 상황에서 상태(승인/반려/대기)를 나타낼 구체적 글리프.
   **결정**: 승인류 "✓", 반려 "!", 대기 "•" (텍스트 글리프, 색상과 텍스트 라벨을 항상 병행).
   **근거**: 브리프는 "vector/text glyphs via Text, not emoji"라고만 규정, 구체 글리프 집합은 임의 선택. 색맹 접근성을 위해 글리프+색+텍스트 상태문구 3중 표기.

7. **결정 필요**: 5단계(received/inspected/graded/listed/paid) 각각을 토큰의 어떤 색으로 뱃지 처리할지.
   **결정**: received=중립(neutral), inspected=warning, graded=accent, listed/paid=success.
   **근거**: "단일 액센트만 강조, no other hues"라는 DNA 규칙과 토큰에 정의된 success/warning/danger 세맨틱 색 사이의 긴장을 임의로 해소 — 세맨틱 상태색(success/warning/danger)은 장식이 아니라 "상태 의미 전달"이라는 다른 목적의 토큰으로 간주하고 사용했고, 진짜 강조(accent)는 그래프상 "중간 결정 지점(graded)"과 인터랙티브 쉐브런/버튼에만 한정해 "단일 액센트" 원칙을 지키려 함. 이 해석에는 확신이 없고, 더 엄격하게 읽으면 success/warning도 금지해야 할 수 있음 — 솔직히 애매한 지점.

8. **결정 필요**: "파괴적 행동 확인" 가이드라인을 이 읽기전용 레인에 넣을지, 넣는다면 어떻게 스타일링할지.
   **결정**: "Dispute Grading Result"를 추가하고, 확인 전엔 danger 테두리의 아웃라인 버튼 → 확인 단계에선 Cancel/Confirm 두 버튼(Confirm은 danger 배경 채움)으로 전환.
   **근거**: 브리프는 이 레인이 "likely read-only"라고만 했지 파괴적 액션을 금지하지 않았고, UX 캐탈로그의 "파괴적 액션은 확인 단계 필요" 규칙을 적용할 기회로 보고 임의로 추가함.

9. **결정 필요**: 상세 화면 안의 타임라인/아이템 목록도 FlatList로 만들어야 하는지.
   **결정**: 메인 배치 목록만 FlatList, 상세 화면 내부의 고정 길이 하위 목록(스테이지 5개, 아이템 2~6개)은 `.map()`으로 ScrollView 안에 렌더링.
   **근거**: FlatList를 ScrollView 안에 중첩하면 가상화 경고/레이아웃 문제가 발생하는 것이 RN 일반 관행이고, 브리프 §UX캐탈로그 규칙 문구("The list view must use FlatList")가 문자상 "the list view"(마스터 목록) 하나를 가리킨다고 좁게 해석함 — 이 해석도 100% 확신은 없음.

10. **결정 필요**: 화면에 통화(금액) 표시를 넣을지, ₩/tabular-nums 상호작용 리스크를 어떻게 다룰지.
    **결정**: 이 도메인에 금액 자체를 전혀 넣지 않음(판매가/정산액 등 모두 생략).
    **근거**: 브리프는 ₩와 tabular-nums의 "조합"만 피하라고 했지 통화 자체를 금지하지 않았지만, 입고 배치 추적 도메인에는 금액이 꼭 필요하지 않다고 보고 리스크를 원천적으로 피하는 쪽으로 임의 단순화함.

11. **결정 필요**: live region 컨테이너를 어디에 둘지(목록 헤딩과 상세 헤딩이 같은 자리인지).
    **결정**: 목록/상세 공용의 단일 `<Text accessibilityRole="alert">` 헤딩 하나를 `accessibilityLiveRegion="polite"` 컨테이너로 한 번만 감싸고, 포커스 상태에 따라 내용(및 스타일)만 바꿔치기.
    **근거**: 브리프 §3이 "화면당 live region 컨테이너는 최대 1개"라고 명시했으므로, 두 헤딩을 별도 컨테이너로 만들지 않고 하나를 재사용하는 쪽으로 임의 설계.
