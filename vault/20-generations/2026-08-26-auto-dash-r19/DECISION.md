# DECISION — auto-dash-r19

타깃: dash (미채움 큐 0건 → dash/landing 균등 난수, native는 이번 실행 1라운드째에서 이미 생성해 제외 → dash 당첨)
후보: a=Corridor(캘린더/보드, 워크플레이스 예약) · b=Cadence(로드맵/간트, 생산라인 스케줄) · c=Threshold(히어로 단일지표+보조지표, 지원SLA)
소스 해시(freeze, GENERATE 종료 시점): `20e422b377b3b14565afdd8eb4836571d5a37c20`
다양성 축: banList 실측(`catalog-variety.mjs` banList, window=3/themeRun=2) = `{theme:[], accent:[], face:["grotesk"]}` → 3후보 모두 grotesk 회피(`-wide`/`-mono` 사용) 확인. 직전 라운드(r18) 축 light+orange+grotesk 회피 지시.

## 하드게이트 (후보별 개별 실행 — `node scripts/gate.mjs --target web --routes /dash-evolve/r19/<v>`)
1차: c만 10/10 통과. a는 types(TS2459×3·TS2345×1)·lint(react-hooks/immutability)·focus(38건 죽은 outline-none 관용구)·a11y(96, color-contrast) 4관문 실패. b는 lint(미사용 변수)·a11y(96, color-contrast) 2관문 실패.

1-fix: a는 `BookingStatus` export 누락·useState 유니온 타입·렌더중 재할당·공유 FOCUS 토큰의 `outline-none`이 뒤 `focus-visible:outline`을 취소하는 죽은 관용구(page-brief-core §2 기지 패턴)를 고침. b는 미사용 import 제거 + `TEXT_AUX`(zinc-500)가 틴트 배경 위에서 4.52:1로 하한 근접 미달 → `TEXT_MUTED`(zinc-600)로 교체, 다크테마에서 복붙된 placeholder 색상도 수정.

2차: **b는 10/10 재통과 → 생존.** **a는 types/lint/focus는 전부 해소했으나 a11y color-contrast가 재발(96점, 동일 감사) → 1-fix 기회 소진, 탈락.** c는 1차부터 통과라 재게이트 불요. 상세는 SCORES.md.

## JUDGE 패널 (생존 후보 2개 — b/c, 프레임 4장씩: 1440·1440-s70·390·390-s70)

### 렌즈1 — brief 준수: **b > c**
b: 인터랙션 5종 실동작 확인, delta 준수(`encoding.ts`가 focusLineId 유일 소비자, OrderTable 완전 독립), 폰트 1종(`-mono`)·웨이트 3종, 죽은 focus 관용구 없음. c: 인터랙션도 5종 실동작(오히려 팔레트 엔트리 더 풍부)이고 delta 준수(단일 `buildDashboardView` 빌더)도 정갈하나, **⌘K 팔레트의 `placeholder:text-zinc-400`이 c 자신의 `tokens.ts`가 명시한 "순백 표면 zinc-500 하한"을 스스로 위반** — 기본 뷰가 아닌 상태는 게이트가 못 본다는 점을 소스 감사로 잡음.

### 렌즈2 — 상용 SaaS 완성도: **c > b**
c 1위: 헤드라인 96.5%+vs-target이 hover 없이 상시 노출, 보조값도 sr-only 테이블로 이중 접근성 확보, breach 카운트가 헤드라인에서 수학적으로 파생(어긋날 수 없음), 390에서 표→카드 완전 재구성. b 2위: 반응형 판단(간트→모바일 카드 리스트)과 데이터 정합은 c와 동급이나, **간트 바 진행률 텍스트가 `width>=56/96px` 조건부로만 노출** — "핵심 값은 hover 전에도 상시 텍스트" 원칙(단일 지배 시각화 완성도, L3)에 좁은 바에서 위반. 페이지 하단 테이블이 같은 값을 항상 병기해 정보 손실은 아니지만, **주 시각화 층위**에서 확실한 감점.

### 렌즈3 — 아키타입 차별성: **b > c**
b: 간트/타임라인 막대는 카탈로그 20종에 없는 신규 지배시각화. 선택 배선이 "부분재계산 핀"(행 헤더 클릭→KPI만 재계산, 원장 비연동)과 "비영속 인스펙터"(호버→ephemeral 툴팁, 상태 불변)로 **분리**돼 있어 master-detail 전면재계산과 다름. c: 매크로 형태(히어로 숫자)는 r17(워터폴)과 뚜렷이 다르나, 실제 선택 배선은 `QueueBreakdown`이 "페이지의 유일한 선택 표면" → 전체(헤드라인·차트·통계·테이블)를 재계산하는 **표준 master-detail 전면재계산**과 기능적으로 동일 — r18에서 "SaaS 최관습 골격"으로 지적된 패턴과 같은 구조(다만 c는 r17/r18 매크로 골격 자체와는 겹치지 않아 최소 요건은 통과).

## 집계 — 2:1 다수결
1위표: b=2(렌즈1·렌즈3) · c=1(렌즈2). 동률 아님(생존 후보 2개, tie-break 예외 불요) → **승자: b (Cadence — 생산라인 로드맵/간트)**.

## LEARN — 격리 적재 delta (아래 §참조, dash-deltas-provisional.jsonl에 append)
r17/r18 delta(selectedId 원시 threading을 피하고 단일 재인코딩 빌더로 재계산하라)를 c가 정확히 구현했음에도 렌즈3은 그 배선을 "관습적 master-detail"로 판정했다 — **원시 threading을 피하는 것과 아키타입 차별성을 얻는 것은 다른 문제**임을 이번 라운드가 드러냈다. b가 이긴 이유는 기술적 구현(빌더 함수 사용 여부)이 아니라 **선택이 일으키는 반응을 하나의 전면재계산으로 뭉치지 않고, 범위가 다른 두 갈래(부분재계산 vs 비영속 인스펙터)로 쪼갠 것**이다.

## 판정 커버리지 — 미확인 범위 자진 신고 요약
- 렌즈1: 1920px 우측여백 규칙 미실측(1440/390 프레임만 제공), ⌘K팔레트·기간토글 등 비기본 상태의 실제 렌더 스크린샷 없음(코드 리딩만), data.ts 전수 미정독, 공유 ui.tsx 컴포넌트 라인단위 미대조.
- 렌즈2: 로딩/빈상태/에러복구 UI 두 후보 다 미확인, ⌘K 세부동작 스크린샷 없음, c 티켓 20건 표본의 내부 정합(daysAgo 분포) 전수 미검증, 중간 스크롤 구간(35%·70% 사이) 미제공.
- 렌즈3: r14 매크로 골격 정보 부재로 직접 대조 불가, dash 카탈로그 20종 원본 스크린샷 미조회(프롬프트 요약에 의존), 공용 셸 컴포넌트(Sidebar/Topbar/CommandPalette) 라인단위 미대조, 실제 브라우저 인터랙션(호버/키보드) 런타임 미검증.

기권·재개: 없음(3렌즈 모두 1회 완주).

## 판정 후 수정
불요 — b는 게이트 10/10(1-fix 후) 통과, 이후 규칙 위반 발견 없음(렌즈들이 지적한 사항은 전부 완성도/차별성 판단이지 기계 위반이 아님).

## no-winner 여부
아니오 — b 승격. a는 하드게이트 탈락(주간 반증에서 일괄 드롭 대상, route는 유지).
