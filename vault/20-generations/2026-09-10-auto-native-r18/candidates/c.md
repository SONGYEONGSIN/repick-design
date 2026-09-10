# auto-native-r18 · candidate c — Condition Assessment

**Concept summary:** a seller-facing pre-listing screen where the seller rates five independent condition criteria (fabric/material wear, stitching/seams, odor, visible flaws, original tags/accessories) on a 4-level scale each; a real weighted-average-with-defect-cap pure function (`computeGrade` in `data.ts`) derives a live overall letter grade from those selections, and the fixed bottom band is a genuine blocked-workflow state machine (names which criteria are unrated, jumps to the first unrated one on tap, becomes the real "Confirm grade & continue" action once all five are rated).

**Check string** (exact visible heading text, always rendered): `Condition Assessment`

**Files:**
- `/home/user/repick-design/native/src/evolve/r18/c/ConditionAssessmentScreen.tsx`
- `/home/user/repick-design/native/src/evolve/r18/c/data.ts`

## 브리프에 없던 것

1. **① 결정할 것:** 기준(criteria) 개수와 구체적 항목 — 브리프는 "4-5개, 패션 리세일에 적합한 것"이라고만 지정.
   **② 결정:** 5개 — Fabric & Material Wear, Stitching & Seams, Odor, Visible Flaws, Original Tags & Accessories. 각 기준은 동일한 4단계(Like New / Light Wear / Visible Wear / Heavy Wear) 세그먼트 컨트롤 공유.
   **③ 근거:** 5개는 한 화면에서 스크롤 없이 인지 가능한 상한이면서, "구조적 손상(재봉)"·"표면 마모(원단)"·"주관적 요소(냄새)"·"외관 결함(흠집)"·"부속품(택/구성품)"까지 실제 중고패션 감정에서 쓰이는 서로 겹치지 않는 축을 커버하도록 임의로 구성.

2. **① 결정할 것:** 등급 산출 로직의 구체적 수식 — 브리프는 "average/worst-of/weighted 중 택1, 주석으로 문서화"만 요구.
   **② 결정:** 가중평균(weighted average, 기준별 weight 0.5~1.25) + "Heavy Wear가 하나라도 있으면 전체 등급을 C로 캡"하는 결함우선 규칙을 평균 위에 별도로 얹음. `data.ts`의 `computeGrade` 주석에 두 규칙을 모두 문서화.
   **③ 근거:** 순수 평균만 쓰면 치명적 결함(예: 찢어진 이음새) 하나가 나머지 준수한 항목들에 희석되어 사라지는데, 이는 오프라인 중고 감정 관행(치명 결함이 발견되면 그 자체로 등급을 낮춤)과 어긋난다고 판단해 평균 위에 캡 규칙을 추가 — "실제 함수"라는 브리프 요구를 충족하는 동시에 가중치·캡 두 층위 모두 유저 선택에 실시간으로 반응하도록 설계.

3. **① 결정할 것:** 블록 상태에서 "다음 미해결 항목으로 이동" UI를 어떻게 시각화할지 — 브리프는 메커니즘(스크롤/하이라이트)만 요구, 구체적 형태는 지정 안 함.
   **② 결정:** `FlatList` + `scrollToIndex`(+`onScrollToIndexFailed` 폴백)로 스크롤하고, 해당 기준 카드에 `highlightedId` state로 액센트 보더(굵기 1.5, `tokens.color.accent`)를 씌움 — 사용자가 그 기준에 답하면 자동으로 하이라이트 해제.
   **③ 근거:** `verification/SellerVerificationScreen.tsx`·`disputes/DisputeCenterScreen.tsx`가 쓰는 것과 같은 원리(FlatList ref + scrollToIndex)지만, 두 화면은 아코디언을 펼치는 방식으로 "이동"을 표현하는 반면 이 화면은 기준 카드가 애초에 모두 펼쳐져 있으므로 보더 하이라이트로 대체 — 화면 자체 구조(비-아코디언, 세그먼트 컨트롤 나열)가 달라 재사용은 원리 차원에 그치고 구체적 상태명·컨트롤 흐름은 독자적(`bandState` 단일 discriminated union으로 blocked/ready/confirmed를 표현, 참조 화면들의 개별 boolean 방식과 다름).

4. **① 결정할 것:** "confirm" 이후 사용자가 답변을 바꾸면 어떻게 되는지 — 브리프는 "continue는 로컬 상태 저장으로 충분"이라고만 명시, 재수정 시나리오는 언급 없음.
   **② 결정:** 어떤 기준이든 재선택하면 `confirmed`가 즉시 `false`로 리셋되어 밴드가 다시 ready(또는 blocked) 상태로 돌아감 — confirm 이후에도 카드는 계속 수정 가능.
   **③ 근거:** confirm된 등급이 그 뒤의 재평가로 인해 실제 계산값과 어긋난 채로 남아있으면 "진짜 계산된 값"이라는 브리프 취지를 배반하므로, 등급이 최신 선택을 항상 반영하도록 강제. `verification/SellerVerificationScreen.tsx`의 `markEdited` 패턴과 같은 발상이지만 별도 헬퍼 없이 `selectLevel` 내부에서 직접 처리해 코드 형태는 다르게 유지.
