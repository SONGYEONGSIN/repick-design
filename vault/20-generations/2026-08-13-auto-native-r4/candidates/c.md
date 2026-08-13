Order History: a scrolling, month-grouped record of past repick purchases, filterable by status and searchable by item name, where tapping any order expands it into its full receipt-level detail.

## 브리프에 없던 것

① 화면에 고정 헤더/하단 액션바를 둘지
② 전부 없앰 — 검색·필터·정렬 전부 `ListHeaderComponent` 안에서 함께 스크롤되고, 하단 밴드도 없다.
③ `native-deltas-provisional.jsonl` r2/r3 델타 — 종결 액션이 없는 화면(설정형·열람형)은 고정 크롬을 전혀 두지 않을 때 3렌즈 만장일치를 받았고, 반대로 종결 액션이 있는 화면(Handoff Check)만 하단 상태기계 밴드가 이겼다. 주문 내역은 이미 끝난 거래의 열람 화면이라 "지금 완료해야 할 행동"이 없으므로 전자 패턴을 따름.

① 주문 상태를 몇 종류로, 무슨 이름으로 나눌지
② `ordered`(주문됨) / `scheduled`(핸드오프 예약됨) / `completed`(완료) / `cancelled`(취소됨) 4종.
③ Handoff Check 화면이 이미 "핸드오프 검증"을 실시간으로 다루므로, 그 이전 단계(주문 직후)와 그 결과가 기록으로 남는 이후 상태(완료/취소)까지 포함해 거래의 전체 생애주기를 시간순으로 커버하도록 임의로 정함.

① 상태를 색이 아니라 무엇으로 구분할지
② 각 상태마다 다른 아이콘 모양(점선 사각형=ordered, 실선+내부 점=scheduled, 단색 채움+체크=completed, 외곽선+X=cancelled) + 항상 곁에 텍스트 라벨.
③ GENERATION.md §3·ux-guidelines catalog "결정론·이모지" 및 r1 델타(색상 단독 전달 금지, 아이콘 필요 시 벡터)를 따름 — 액센트 컬러 하나뿐이라 채움 여부·테두리 스타일·내부 마크로만 구분해야 했음.

① 리스트를 어떻게 그룹핑할지
② 월별(예: "August 2026") 헤더 행을 정렬 순서에 맞춰 삽입 — 정렬 방향(최신/오래된순)이 바뀌면 그룹 순서도 함께 뒤집힘.
③ 브리프가 "그룹핑이 스캔에 도움되는지 고려하라"고 명시했고, 실제 쇼핑앱 주문내역 UX 관행(월별 묶음)을 참고해 임의로 채택.

① 확장(expand) 상호작용의 트리거 범위
② 카드 전체를 하나의 `Pressable`로 만들어 탭하면 확장 — 별도의 "상세보기" 버튼을 카드 안에 중첩시키지 않음.
③ RN 관용구상 `Pressable` 안에 또 다른 `Pressable`을 중첩하면 제스처 충돌·접근성 트리 혼란이 생기므로, 행 전체를 단일 터치 타겟으로 만드는 쪽을 택함(Owned Grid의 카드 탭 패턴과 동일).

① 통화 표기
② KRW(₩, 천단위 콤마)를 그대로 사용, `toLocaleString` 미사용.
③ 기존 Watchlist(`native/src/watchlist/data.ts`)가 이미 이 방식을 쓰고 있어 앱 내 화폐 표기 관행을 그대로 따름 — 임의 선택이 아니라 기존 화면 참조.

① 검색 인풋을 둘지, 필수 요구사항이었는지
② 넣음 — item name 부분일치(대소문자 무시) 필터.
③ 브리프의 "Bonus: search-by-item-name if you have time"를 시간이 있어 채택.
