# auto-native-r7 · candidate a — Dispute & Return Center

A single screen for a buyer to review open/past disputes on completed orders (expandable timeline cards) and build a new return/dispute request against the one order still inside its return window (reason, free-text description, add/remove evidence photos, desired resolution) — gated by a fixed bottom band that behaves as a state machine.

## 브리프에 없던 것

① 결정할 것: 고정 하단 밴드를 쓸지, 아니면 r2가 입증한 "고정 chrome 전무" 패턴을 쓸지.
② 결정: 고정 밴드(상태기계)를 채택 — 진행 불가 사유를 문장으로 말하고, 누르면 draft 카드로 점프+확장한다. 완료되면 같은 컨트롤이 실제 제출 버튼이 되고, 제출 후에는 비인터랙티브 확인 뷰(accessibilityRole="alert" + 밴드 컨테이너 accessibilityLiveRegion="polite")로 바뀐다.
③ 이유: 이 화면은 진짜 종결 액션(분쟁 개시)을 갖고 있고 그 액션에는 실제 선행조건(사유·설명 20자 이상·증거사진 2장 이상·희망 처리방식)이 있다 — native-deltas L2가 지목한 정확히 그 케이스라서, r2의 "설정형 화면은 고정 chrome 없이" 패턴은 적용 대상이 아니고, r3/r5/r6c가 검증한 상태기계 밴드 패턴을 재현하는 것이 옳다.

① 결정할 것: 증거 사진 첨부를 어떻게 모사할지 (카메라 라이브러리 없음).
② 결정: "Add photo"를 누르면 결정론적으로 번호가 매겨진 자리표시자(Photo 1, 2…)가 최대 5개까지 추가되고, 각 자리표시자에 개별 Remove(✕) 버튼을 둔다 — 제거 시 남은 항목을 다시 1..n으로 재번호.
③ 이유: 실제 이미지 피커 없이도 "정말 작동하는 상호작용"(추가/삭제가 상태를 바꾸고 하단 밴드 조건에 실제로 반영됨)을 만족시키면서, Math.random 없이 완전히 결정론적으로 유지하기 위함.

① 결정할 것: 원화(₩) 표기 화면에서 tabular-nums를 쓸지.
② 결정: 이 화면의 모든 ₩ 금액(주문가·환불액)에 fontVariant: tabular-nums를 전혀 적용하지 않는다.
③ 이유: native-deltas r4/r6(L2)가 두 라운드 연속으로 재현한 실측 버그 — tabular-nums 스타일 Text의 자손 트리 어디에든 ₩ 글자가 있으면 취소선 같은 렌더 아티팩트가 생긴다. 이 화면의 금액은 정렬이 중요한 표(ledger)가 아니라 본문 텍스트 한 줄짜리 사실(fact)이라 tabular-nums의 이득이 없어, 아예 쓰지 않는 안전한 선택지를 택했다.

① 결정할 것: 제출 후 이미 접수된 분쟁을 다시 편집 가능하게 할지.
② 결정: 제출 즉시 draft 카드는 다른 과거 케이스들과 동일한 읽기 전용 타임라인 카드로 전환되고, 재편집 진입점을 두지 않는다.
③ 이유: r6c는 "필드 수정 시 draft로 강등"을 채택했지만, 그건 신원 서류 재확인이라는 다른 도메인이었다. 분쟁 접수는 제출 순간 상대방(판매자)·Repick 지원팀에 실제로 전달되는 행위라 프런트만 되돌리는 건 사용자에게 거짓 여지를 주는 것 — 그래서 이 화면은 제출을 진짜 종결로 취급하고 그 이후는 다른 두 과거 케이스와 동일한 히스토리 뷰로 합류시켰다.
