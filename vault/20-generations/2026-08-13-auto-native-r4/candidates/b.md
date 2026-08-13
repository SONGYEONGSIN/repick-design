# 후보 b — NotificationsScreen

**한 줄**: 종결 액션이 없는 알림/활동 피드 — 제목·필터칩·"Mark all read"까지 전부 `ListHeaderComponent`로 FlatList 안에 들어가 함께 스크롤되고, 고정 헤더·하단 액션바는 없다. 탭하면 즉시 읽음 처리(점+"New"+굵기 3중 신호가 사라짐), 카테고리 칩과 "Unread only" 토글이 실시간으로 목록을 좁힌다.

- 배정: 화면유형 = **Notifications / Activity(알림·활동 피드 — native 최초)** / 실루엣 = **고정 챠 없는 단일 스크롤 FlatList(0밴드)**
- 게이트 검사 문자열: `Notifications`
- 파일: `NotificationsScreen.tsx`(named export) · `data.ts`

## 인터랙션

| 조작 | 갱신 |
|---|---|
| 알림 행 탭 | 해당 행만 읽음 처리 — 좌측 액센트 스트라이프 제거, 점+"New" 태그 제거, 제목 굵기 800→600, 헤더의 "N unread of 14" 즉시 감소 |
| 카테고리 칩(All/Price drops/Offers/Messages/Saved search/Handoff) | 단일 선택, FlatList 데이터를 즉시 필터 |
| "Unread only" 토글 | 카테고리 필터와 AND 결합, 즉시 재필터 |
| "Mark all read" | 전원 읽음 처리, unread=0이 되면 버튼이 "All caught up"으로 바뀌고 비활성화(장식 아님 — 실제로 더 이상 할 일이 없다는 사실을 반영) |
| 필터 결과 0건 | `ListEmptyComponent`로 "No notifications here / Try a different category…" 안내 |

읽음/안읽음 3중 신호: **형태**(좌측 4px 액센트 스트라이프 유무) + **텍스트**("New" 태그 + 점) + **굵기**(800 vs 600) — 색 하나로 전달하지 않음. 알림 종류는 색이 아니라 2글자 모노그램 배지(PD/OF/MS/SS/HC)로 구분 — 추가 색상 없음.

## 브리프에 없던 것

1. **고정 챠 유무 판단** — ① 필터칩·헤더를 고정할지 스크롤에 묻을지 ② 전부 스크롤(0밴드)로 결정 ③ `native-deltas-provisional.jsonl`의 r2/c·r3 학습: 종결 액션이 없는 화면(설정·브라우즈형)은 고정 챠가 없을 때 3렌즈 우위였고, 알림 피드는 "완료"랄 게 없는 브라우즈형이라 같은 범주로 판단.
2. **알림 종류 분류 체계(5종)** — ② priceDrop/offer/message/savedSearch/handoff ③ 기존 5개 화면(Watchlist·AI Match·Price Detail·Offer Thread·Handoff Check)이 이미 만든 이벤트 소스를 그대로 알림 트리거로 재사용 — 새 개념을 만들지 않고 기존 제품 표면과 정합시킴.
3. **타입 배지를 색이 아닌 2글자 모노그램으로** — ② PD/OF/MS/SS/HC ③ DNA의 "near-monochrome + 단일 액센트"를 지키면서 5종을 구분할 방법이 형태/텍스트뿐이라 이니셜 태그를 골랐다 — 임의 선택이지만 색상 추가를 피하는 유일한 경로.
4. **읽음/안읽음의 3중 신호 조합** — ② 좌측 스트라이프 + "New"+점 텍스트 + 폰트 굵기 ③ 카탈로그의 "색만으로 전달 금지" 조항을 3배 과잉 충족 — 굵기 하나만으로는 저시력 사용자에게 약하다고 판단해 텍스트 라벨까지 추가.
5. **상대 시간 표기 고정 문자열** — ② "2m ago" ~ "1w ago" 등 계산 없는 상수 ③ 결정론 규칙 — 실제 서비스라면 Date 연산이지만 브리프가 `Date.now`/인자 없는 `new Date()`를 금지해 고정 문자열로 대체. **"1w ago"처럼 상대 표현 자체가 이미 "현재 시각"을 암묵 참조한다는 점은 브리프가 다루지 않는다.**
6. **Mark all read의 비활성 조건과 라벨 전환** — ② unread=0일 때 버튼 라벨을 "All caught up"으로 바꾸고 비활성 ③ r3 delta("disabled 버튼은 정보를 0으로 만든다")를 피하려고, 비활성이어도 "왜 눌리지 않는지"를 라벨 자체가 말하게 설계.
7. **탭의 "이동할 것"이라는 어포던스만 남기고 실제 내비게이션은 생략** — ② 행 우측에 항상 보이는 `›` 셰브런(읽음 상태와 무관하게 항상 표시) ③ 과제 지시가 허용한 최소 해석 — 실제 라우팅이 없는 프로토타입임을 셰브런으로 정직하게 표시(가짜 링크를 만들지 않음).
8. **필터칩 레이아웃 = 가로 스크롤이 아닌 `flexWrap`** — ② 6개 칩을 줄바꿈으로 배치 ③ 가로 스크롤을 쓰면 카탈로그의 "제스처 어포던스 — 숨은 제스처엔 시각 힌트 동반" 조항을 추가로 만족시켜야 하는데, 칩 개수가 한 화면에 다 들어가므로 애초에 그 문제를 만들지 않는 편을 택함.
9. **소스 라벨 문구("Watchlist" / "Offer thread" / "Negotiation" / "Saved search" / "Handoff check")** — ② 각 알림 하단에 1줄 출처 표기 ③ 브리프가 "탭하면 원본 맥락으로 이동함을 나타내라"고 요구했는데, 이동 없이도 "어디로 갈지"를 알려주려면 출처 이름이 필요하다고 판단.
10. **빈 상태 문구** — ② "No notifications here / Try a different category, or turn off "Unread only"." ③ 카탈로그의 "빈 상태: 안내+액션" 항목을 그대로 적용 — 필터 조합이 0건일 수 있는 실제 가능성(예: Handoff + Unread only)에 대비.
