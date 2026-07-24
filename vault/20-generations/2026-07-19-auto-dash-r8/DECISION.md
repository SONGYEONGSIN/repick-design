# auto-dash-r8 — JUDGE DECISION

대상: dash · 라운드 auto-dash-r8 · 후보 3개(a/b/c), 전원 HARD GATE 생존 → 3렌즈 판정 진행.

## 후보 요약
- **a — Chute** (체크아웃 퍼널 인텔리전스): 7단계 스텝형 퍼널이 화면 주인공. `/dash-evolve/r8/a`
- **b — Farsight** (AI 코파일럿 챗독 워크스페이스): 상시 오픈 AI 챗독(Fara) + 메인 워크스페이스 동기화. `/dash-evolve/r8/b`
- **c — Canopy** (조직/역량 트리 캔버스): 상단→하단 브랜칭 조직 트리가 화면 주인공. `/dash-evolve/r8/c`

## 렌즈 1 — 브리프 준수 (블라인드)
**1위 b, 2위 a, 3위 c**
- b: 그리드 크래프트 룰(`AccountsTable.tsx:76-87` min-w-[640px] lg:min-w-0 + table-fixed/colgroup), 대비 토큰(`tokens.ts:23-25`), 결정론 데이터(`data.ts:311-317` `_TOTALS_OK`), 5개 실동작 인터랙션 — 소스 결함 미발견.
- a: 동일 수준 준수(`data.ts:35-48` 최대잔여법 subtotal=total, `SegmentTable.tsx:65-76`)이나 "Live" 배지 점이 실데이터 근거 없이 `motion-safe:animate-pulse`만 거는 경미한 장식 모션(`FunnelClient.tsx:133`)으로 감점.
- c: 주 시각화 `OrgTreeCanvas.tsx:122`가 `min-w-[872px] overflow-x-auto`를 자기 소속 다른 테이블(`RosterTable.tsx:61` min-w-[760px] lg:min-w-0)과 달리 `lg:min-w-0` 리셋 없이 무조건 적용 — 동일 파일셋 내 일관성 결여로 감점.

## 렌즈 2 — 상용 완성도 (블라인드)
**1위 a, 2위 c, 3위 b**
- a: 트라페조이드 퍼널이 호버 없이 즉시 가독, 단일 액센트(퍼플)로 절제 유지 — Amplitude/Mixpanel급.
- c: 조직 트리 노드가 헤드카운트+활용률 바+상태색 인코딩으로 즉시 가독, 컴포넌트 시스템 일관 — 단, 모바일에서 노드 일부가 스크롤 힌트 없이 캔버스 밖으로 잘림.
- b: 1280px에서 그리드 크래프트 실결함 — KPI 캡션 중간 절단("위험 계...", "상태 가...") 및 "전주 대비" 고아 줄바꿈(`Workspace.tsx:175,197,204`) — 실제 상용 제품이라면 출시하지 않을 흔한 데스크톱 폭에서의 결함.

## 렌즈 3 — 아키타입 차별성 (블라인드)
**1위 a, 2위 c, 3위 b**
- a: 퍼널 자체가 페이지(`FunnelCanvas.tsx` 폭이 기간별 실카운트로 계산), KPI카드열로 후퇴 없음 — 기존 아키타입에 사촌 없음.
- c: 실제 동작하는 트리(퍼센트 좌표 SVG 커넥터, 조상 체인 하이라이트, 방향키 순회) — 단, 엄격한 상하 계층은 기존 "DAG/노드-엣지 캔버스" 아키타입과 구조적으로 가장 근접해 신규성 마진이 a보다 좁음.
- b: 챗독 자체는 실동작(`Workspace.tsx:74-118` CopilotAction이 실제로 focus-region/filter-status/select-account를 디스패치)이나, 챗독 아래 메인 워크스페이스가 이미 등재된 "히어로+벤토"·"크로스헤어 차트+상태필터+로그테이블" 형태를 사실상 그대로 반복 — 배정 아키타입이 화면의 지배 구조가 되지 못함.

## 집계
1위 표: a=2(렌즈2, 렌즈3), b=1(렌즈1), c=0. **다수결 승자 = a (Chute)**. no-winner 표 0개 — 억지 승자 아님(전원 유효 렌즈, 전원 하드게이트 통과).

## 승자: a — Chute (체크아웃 퍼널 인텔리전스)
