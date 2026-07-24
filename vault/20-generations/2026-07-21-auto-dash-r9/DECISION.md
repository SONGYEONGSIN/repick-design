# auto-dash-r9 — DECISION

타깃: **dash** (무작위 선택, `$((RANDOM % 2))` = 0 → dash)

후보:
- **a — Redline** (SLO & Error-Budget Console): 게이지/다이얼 콕핏 클러스터 — 히어로 게이지 1 + 2×2 보조 게이지 4, 폴라 좌표 아크+니들.
- **b — Meshline** (Service Dependency Intelligence): 유기적 force-directed형 의존성 네트워크 — 실제 순환(cycle)·교차링크 포함 16노드 웹.
- **c — Currents** (Revenue Attribution Flow): Sankey형 다단 흐름도 — 채널→플랜티어→결과 3단, 분기·합류 리본 36개, 흐름 보존.

## 하드게이트
전 후보 1차 통과 (SCORES.md 참조): 정적검사 `[]`, sweep `{"pass":true,"failures":[]}` (1280–1920px ±16px + 390px), Lighthouse a11y 96/100/97(a/b/c, 전부 ≥95 하드게이트 통과) · perf 96/96/96(기록만).

## JUDGE 패널 (3렌즈, 블라인드 — 스크린샷+소스만 제공, 후보 자체 컨셉노트 비공개)

### 렌즈 1 — 브리프 준수 (Opus)
**RANKING: a > c > b**
전 후보 블로킹 위반 없음(공통 스캐폴드 고품질) — 진짜 순백 라이트, 단일 Pretendard, 결정론 데이터, 단일 h1, 가상 페르소나(세션 이메일 미유출), 헤더 컨트롤 개별 44px, 대비 토큰 정확, sr-only는 caption/div에만(테이블 직접 적용 없음), 4+ 실동작 인터랙션 — 전부 확인.
- a: IncidentTable.tsx가 `table-fixed`+colgroup %만으로 min-w 전혀 없이 유동화 — 그리드 검증 룰 v2가 선호하는 "가장 견고한" 패턴을 직접 구현, 최고 준수.
- c: 동일하게 클린(FlowTable.tsx는 모바일만 min-w 게이트로 정확), 인터랙션 최다(23 onClick)지만 a의 무-min-w 패턴에 근소하게 밀림.
- b: 완전 준수이나 그래프 비선택/디밍 상태 라벨이 저대비에 가깝고(opacity-gated states), 모바일 min-w-[640px] 가로스크롤 의존 — 상대적으로 "덜 철벽".

### 렌즈 2 — 상용 완성도 (Mercury/Asana/n8n/Coinbase급, Opus)
**RANKING: c > a > b**
- c: Mercury급 히어로 헤더 + 모든 Sankey 노드에 라벨+수치(예: Organic Search 666, Retained 1,301) 상시 병기 — hover 없이 즉시 가독, 절제 완전 유지.
- a: 게이지 값이 중앙에 크게 표시돼 즉시 가독이나, 6개 대형 스피드미터는 셋 중 정보밀도가 가장 낮아 프리미엄 SaaS보다 Grafana류 모니터링 툴에 근접.
- b: SVG·선택 동기화는 가장 우아하나, 핵심 시각화가 "hover 전에는 못 읽는" at-a-glance 결함(r7/r8 델타 재현) — 노드 라벨은 작고 흐릿, 수치 병기 없음, 중앙 여백 과다.
- 크래프트 결함(순위 불변, 참고용): a는 UPTIME 게이지 니들-값 매핑이 근소 불일치(의미상, 클리핑 아님). b는 노드 라벨 저대비·소형. c는 Sankey 리본 교차부(Growth/Scale 구간)가 다소 탁하나 라벨 수치로 상쇄. 1280px에서 r8류 텍스트 클리핑/고아줄바꿈은 3개 후보 전부 없음.

### 렌즈 3 — 아키타입 차별성 (22종 갤러리 대비, Opus)
**RANKING: c > a > b**
소스 검증 결과 3개 전부 "진짜" 기하 구현(가짜로 겉포장한 후보 없음): a는 `polarPoint`/`describeArc` 실제 극좌표 아크+니들(점-산점도 아님), b는 `data.ts`에 실제 방향성 순환(`orders→payments→fraud→orders` 등) 포함 자유배치 웹(DAG/트리 아님), c는 `layoutColumn`/`layoutLinks`로 실제 흐름보존 분기·합류 리본(단일 깔때기/고정 파이프라인 아님).
- c: 2단 실 흐름보존 + 분기/합류 리본 — 기존 22종과 가장 먼 "응집력 있는" 신규 패밀리, 최고 차별성.
- a: 완전 신규 인스트루먼트 패밀리(아크+니들)이나 구조적으로는 고전 계기판의 스몰멀티플 배치.
- b: 진짜 순환·교차링크 웹이나 노드-링크 패밀리 자체는 갤러리가 이미 2회(DAG, 조직트리) 건드린 인접 계열 — 상대적으로 갤러리 대비 가장 근접.
전부 no_winner 미해당(모두 진짜 신규 지오메트리).

## 집계
1위 표: **c 2표(렌즈2·렌즈3), a 1표(렌즈1)** → **다수결 승자: c (Currents)**
기권 없음. no-winner 표 0개 — 억지 승자 아님(3렌즈 모두 "전원 하드게이트+브리프 통과, 진짜 신규 지오메트리"로 합의, 순위만 갈림).

## 승자: c — Currents (Revenue Attribution Flow / Sankey)

## LEARN용 재사용 delta 후보
렌즈2가 지적한 b의 패배 원인 — "그래프형 지배적 시각화에서 노드 라벨만 있고 수치가 없으면 hover 전 정보밀도가 열위"는 r7 델타(단일 지배적 시각화는 인코딩 정교함보다 at-a-glance 즉시가독이 우위)의 새로운 하위 사례(그래프/네트워크형 노드에 구체 적용)로, 아래 §LEARN에 별도 append.
