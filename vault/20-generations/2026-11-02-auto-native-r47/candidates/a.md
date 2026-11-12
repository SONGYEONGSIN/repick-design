# Candidate a — Instant Trade-In Offer

A marketplace-operated instant buyback screen: the user answers five fixed condition questions about an item they own, Repick computes a cash offer the instant every question is answered, and the user accepts or declines that exact number on the spot (no counterparty, no review wait, no listing).

## 브리프에 없던 것

1. ① 어떤 아이템/카테고리로 더미 데이터를 채울지 ② Sony WH-1000XM4 헤드폰 (전자제품) ③ 임의 선택. 전자제품은 "배터리 상태"처럼 전형적인 중고거래 상태질문을 자연스럽게 만들 수 있고, 기존 r25/a(TradeInAppraisalScreen)는 카테고리를 명시하지 않아 겹치지 않는다.

2. ① 오퍼 계산 공식(정확한 수식) ② `BASE_SUBTOTAL_USD(120) - totalDeduction`, 최소 `MIN_OFFER_USD(15)`로 floor. 각 질문의 각 옵션에 고정 `deductionUsd`(0~70) 부여 ③ 임의 결정 — 브리프는 "instant offer를 계산한다"고만 했고 구체적 공식·숫자는 요구하지 않았다. 결정론(§5)을 지키기 위해 전부 고정값으로만 구성했고, 바닥값(floor)을 둔 것은 "instant buyback은 절대 0 이하로 떨어지지 않는 보장 최소가"라는 실제 중고 바이백 서비스들의 관행을 참고한 임의 설계.

3. ① 조건 질문 개수와 내용 ② 5개 고정 질문(기능/배터리/외관/부속품/흡연·반려동물 환경), 각 2~3개 선택지 ③ 임의 결정 — 브리프는 "a short condition questionnaire"라고만 했다. 기존 r25/a의 "예/아니오" 이진 구조와 차별화하려고 모든 질문을 2~3지 선택(칩/라디오)으로 설계했다.

4. ① 화폐 단위 ② USD(`$`) 사용, KRW(`₩`) 미사용 ③ 임의 결정 — 저장소의 ₩ 글리프 주의사항(GENERATION.md §1)은 피하는 게 아니라 "선택"이라고 명시돼 있지만, 이 화면에서는 아예 KRW를 쓸 필요가 브리프에 없어 글자 겹침 이슈 자체를 피할 수 있는 USD를 골랐다.

5. ① 오퍼 공개(reveal) 단계를 둘지 ② "모든 질문 응답 완료" → "See my offer" 탭 → 오퍼 숫자 공개 → "Accept/Decline" 2단 버튼 행이라는 3단 전환을 설계 ③ 브리프가 명시한 "primary action disabled until answered" + "컴퓨트된 오퍼로 2차 phase 전환"을 문자 그대로 충족시키려면 최소 2단 전환이 필요했는데, "답변 완료 즉시 숫자를 보여주는 것"보다 "See my offer를 눌러야 공개"가 블록드-워크플로 밴드의 상태기계 성격(§3)을 더 명확히 드러낸다고 판단해 추가한 중간 단계.

6. ① 답변을 오퍼 공개/결정 후 바꾸면 어떻게 되는지 ② reveal과 decision을 모두 초기화(재확인 요구) ③ 브리프에 없는 엣지케이스. 오퍼가 답변에서 파생된 값이므로, 답변이 바뀐 뒤에도 과거 숫자나 과거 accept/decline을 그대로 두면 거짓 정보가 되어 r25/a의 `retractFiling` 패턴과 같은 원칙(파생 상태가 바뀌면 하위 결정을 되돌린다)을 재사용했다.

7. ① "Start over" 리셋 동작을 둘지 ② accepted/declined 터미널 상태에 "Start over" 링크를 추가해 답변을 전부 초기화 ③ 브리프는 터미널 상태 이후의 동작을 지시하지 않았다. 사용자가 실수로 declined 상태에 갇히지 않도록 임의로 추가한 탈출 경로.

8. ① jump-to-problem을 어떻게 "진짜" 스크롤+포커스로 구현할지 ② `FlatList.scrollToIndex` + 각 질문 행에 걸린 `ref` 콜백을 통해 `AccessibilityInfo.setAccessibilityFocus`를 스크롤 완료 후(260ms 지연) 호출 ③ 브리프가 "real scrollToIndex/focus jump, not just a text update"라고 명시했으므로, 단순 텍스트 갱신이 아니라 실제 네이티브 접근성 포커스 이동까지 구현했다. 지연 시간(260ms)은 레이아웃/스크롤 애니메이션이 끝날 시간을 어림잡은 임의값.
