# b — Alerts Center (AlertsCenter)

**한 줄**: 가격 하락·AI 매치·오퍼 스레드 업데이트를 날짜별로 묶은 알림 인박스. 항목을 열어 보는 게 아니라 그 자리에서 읽음 처리하거나 치우는(triage) 것이 핵심 동작이다.

- 배정 화면유형: **분류/트리아지 인박스** — 차별 축 "알림 분류(triage)" (읽기 전용 스크롤도, 시간순 대화 스레드도 아님)
- 기존 4화면(watchlist·match·detail이 읽기 전용, offer-thread가 시간순 대화형) 대비, "여러 출처의 이벤트를 분류해 치우는" 동사가 처음 등장
- 매크로 골격: 헤더(제목 + 총 미읽음 카운트) → 카테고리 필터 칩 행(All/Price Drops/Matches/Offers, 각 칩에 미읽음 배지) → (조건부) 되돌리기 배너 → 날짜별 `SectionList`(Today/Yesterday/This Week, 섹션 헤더에 "Mark all read") → 행마다 인라인 2버튼(Mark read/unread · Dismiss). 라운드1 밴 실루엣(고정 헤더 + 파생 금액 핀 카드 / 스크롤 / 하단 풀폭 accent 액션바)과 다르게 **하단 고정 바 없음** — 모든 액션이 행/섹션 내부에 있다.

## 브리프에 없던 것

1. ① 파괴적 액션(Dismiss)에 확인 다이얼로그를 넣을지
   ② 즉시 삭제 + 인라인 "Undo" 배너(모달 확인 없음)로 결정
   ③ 카탈로그 "확인 다이얼로그: 파괴적 행동 전 확인"과 [[curation-criteria]]의 "핵심 증명을 추가 탭 뒤로 지연시키지 말 것"이 충돌해, 되돌릴 수 있는 저위험 액션(iOS Mail/Gmail의 archive+undo 관용구)에서는 즉시실행+되돌리기가 확인 다이얼로그의 동등한 대체로 통용된다는 업계 관행을 근거로 확인 모달 대신 undo를 택함.

2. ① 카테고리별 아이콘 글리프를 무엇으로 할지
   ② `▼`(price-drop) `◆`(match) `●`(offer) — Unicode Geometric Shapes 블록의 텍스트 글리프 고정 할당
   ③ GENERATION.md는 "이모지 금지, 아이콘 필요 시 벡터/텍스트"만 명시하고 구체 글리프는 지정하지 않음. emoji-presentation 모호성이 있는 기호(체크마크 등)를 피하고 명백히 텍스트 프리젠테이션인 기하 도형만 임의 배정.

3. ① 섹션(날짜 그룹) 단위 일괄 액션을 넣을지
   ② 각 섹션 헤더에 미읽음이 있을 때만 "Mark all read" 버튼 노출
   ③ 브리프 원문이 "actions live inline per-row **or per-section**"이라고 섹션 단위 액션을 명시 허용했고, 트리아지라는 차별 축을 강화하는 저비용 확장이라 판단해 추가.

4. ① 필터 칩의 접근성 역할을 `accessibilityRole="tab"`으로 할지 `"button"`+`selected` state로 할지
   ② `"button"` + `accessibilityState={{selected}}`로 결정 (OfferThread.tsx의 PresetChip과 동일 관용구)
   ③ RN 타입상 `"tab"` role도 존재하지만 라운드1 승자(offer-thread)가 이미 검증한 "칩 = button + selected" 패턴을 재사용하는 편이 게이트 미검증 role보다 안전하다고 판단(기존 코드 관례 우선).

5. ① 행(row) 전체를 눌러 상세로 이동하게 할지
   ② 행은 비인터랙티브 정보 블록으로 두고, 행 내부의 두 버튼(Mark read/unread · Dismiss)만 Pressable로 한정
   ③ 브리프가 "navigating away 대신 인라인 분류"를 명시했고, 행 탭 이동을 허용하면 사실상 PriceDetail(단건 상세 읽기)로 회귀해 화면유형 차별성이 흐려지므로 의도적으로 제외.
