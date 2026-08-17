# auto-native-r7 · candidate c · Price Alerts

A settings-style management screen for configured price/restock alerts — armed/triggered/expired
status per row, inline threshold editing (won stepper) or watched-size selection with no separate
save step, and a two-tap inline delete — laid out as a single continuously-scrolling `FlatList`
with zero fixed/pinned chrome.

## 브리프에 없던 것

**① 고정 chrome 여부**
② 헤딩·요약 줄을 포함해 화면 전체를 고정 크롬 없는 단일 스크롤 `FlatList`로 구성했다(핀 헤더도, 하단
액션바도 없음).
③ 이 화면엔 화면 전체가 수렴하는 종결/차단 액션이 없다 — 각 행은 사용자가 독립적으로 "설정하는" 값이지,
전체가 함께 완료를 향해 나아가는 값이 아니다(r2 delta의 정확한 조건). r3/r5의 상태기계 밴드는 여러 단계를
검증해 나가는 종결 플로우용이며, 여기선 위조할 근거가 없다고 판단해 채택하지 않았다. (다만 r2를 그대로
베끼지 않았다는 근거로, 대안도 검토했다: PayoutsScreen(r6/a)처럼 "계속 봐야 하는 숫자"가 있으면 슬림 고정
스트립을 쓰는 게 맞다 — 하지만 이 화면엔 그런 단일 참조 숫자가 없다. 각 알림의 현재가는 그 카드 안에서만
의미가 있고, 화면 전체를 관통하는 합계/잔액 같은 상시 참조값이 아니라서 고정 스트립 근거가 없다.)

**① 임계값 편집 UI 형태**
② 텍스트 입력이 아니라 ±₩5,000 스테퍼 버튼(가격) / 사이즈 칩 선택(재입고)으로 구현했다.
③ 모바일에서 숫자 텍스트 입력은 키보드 전환·포커스 관리 오버헤드가 크고, 브리프의 RN 관용구 목록에
`TextInput`이 없다. 스테퍼/칩은 44×44pt 터치 타겟을 만족시키면서 탭 한 번으로 값이 바로 바뀌는 즉시-적용
관용구(카탈로그 "제출 피드백"·"입력 타입")에 더 잘 맞는다.

**① 만료(expired) 알림의 편집 가능 여부**
② `expired` 상태의 알림은 스테퍼/사이즈 칩을 비활성화하고 이유를 문장으로 보여주되(disabled 버튼이 정보
0을 주지 않는다는 delta 원칙 준수), 삭제(Delete)는 항상 가능하게 남겨뒀다.
③ 리스팅이 이미 사라진 항목의 임계값을 조정하는 건 실제로 의미가 없다(맞출 대상이 없음) — 하지만
"할 수 있는 일이 하나도 없는" 죽은 행을 만들면 안 되므로, 유일하게 의미 있는 다음 행동(정리를 위한 삭제)은
항상 열어뒀다.

**① ₩ + tabular-nums 처리**
② 모든 원화 금액은 `WonText` 헬퍼로 렌더링: 스타일 없는 `View` 래퍼 아래 `₩` 기호 `Text`(tabular-nums
없음)와 숫자 `Text`(tabular-nums 적용, ₩ 미포함)를 형제로 둔다. 스테퍼 범위 캡션처럼 같은 문자열 안에
`₩`와 숫자가 리터럴로 섞여야 하는 자리는 그 노드에서 아예 `tabular-nums`를 빼는 쪽을 선택했다.
③ r4/r6 델타가 두 차례 재현한 렌더링 결함(같은 노드 트리 아래 ₩와 tabular-nums가 만나면 취소선처럼
보이는 아티팩트)을 피하기 위함 — 형제 관계뿐 아니라 중첩 깊이까지 확인해, 스테퍼 범위 캡션처럼 형제 분리가
어려운 짧은 문자열은 애초에 tabular-nums를 쓰지 않는 쪽을 택했다.
