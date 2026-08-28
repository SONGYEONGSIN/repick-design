# DECISION — auto-native-r14

타깃: native (미채움 큐 0건 → dash/landing/native 균등 난수 → native 당첨. 오늘은 월요일 아님, native 주기 강제 미해당)
후보: a=Bulk Relist/Inventory Manager · b=Referral & Rewards · c=Wallet & Transaction History
소스 해시(freeze): `3627bcbc6be85ca51eaccfddbd98769813a60b66`

## 하드게이트
`node scripts/gate.mjs --target native --screens evolve-r14-a evolve-r14-b evolve-r14-c` → 12/12 통과, 1-fix 루프 불요. 상세는 SCORES.md.
환경 부트스트랩(스킬 밖): `native/` 자체 `npm install` 누락 조치(r12 선례와 동일 패턴), `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`+`CHROME_PATH`+`PW_NO_SANDBOX=1` 인라인 지정.

## JUDGE 패널 (3렌즈 병렬, 후보당 2프레임 — 390/768)

### 렌즈1 — DNA 준수: **b > c > a**
- a 3위: `#eef2ff` 하드코딩 hex 2건(`InventoryManagerScreen.tsx:629, 784`) — 정본 §2 "토큰 없으면 위반" 명시 위반. 접근성 설계(형제 Pressable, 라이브 리전 1쌍)는 셋 중 가장 정교했으나 이 위반이 순위를 끌어내림.
- b 1위: 하드코딩 hex 0건, 라이브 리전 1쌍 정확, 5개 고정 마일스톤이라 FlatList 미사용 정당.
- c 2위: 하드코딩 hex 0건, 필터전환 라이브 리전 시연이 가장 직접적이나, `Withdraw` 버튼의 `accessibilityHint`가 실제로 일어나지 않는 내비게이션("Opens the payout screen…")을 약속 — 접근성 정직성 흠으로 b 아래.

### 렌즈2 — 모바일 완성도: **a > c > b**
- a 1위: 선택→배치액션→파괴적확인→처리중→결과알림의 전체 네이티브 상태 사이클을 유일하게 구현, 로딩·성공피드백·색+텍스트 병행·탭별 실도달 빈상태까지 완비.
- c 2위: 잔액 상시노출+필터가 그 위에 얹히는 구조로 조작이 증명을 안 가림, FlatList 가상화·tablist 시맨틱 정확. 인터랙션 폭이 a보다 좁음.
- b 3위: 정적 증명(사다리+진행바)은 우수하나 실질 인터랙션이 Copy/Share 시뮬레이션 2개뿐 — 확인단계·처리중·배치작업 등 완성도 체크리스트 다수가 애초에 등장할 기회가 없는 구조.

### 렌즈3 — 화면유형 차별성: **c > a > b**
- c 1위: 배정된 "필터가능 원장" 셸을 가장 깨끗하게 지킴 — payout(상태기계+sticky band)과 제어흐름·상태이름·마크업이 전혀 안 겹침, Withdraw 버튼도 no-op로 명확히 문서화되어 payout 흉내 안 냄.
- a 2위: 멀티셀렉트+배치툴바 셸을 충실히 구현, 기존 카탈로그 어느 것과도 상태이름·제어흐름 안 겹침. 다만 두 프레임 모두 선택모드 진입 전 기본 렌더만 캡처되어 핵심 차별 지점(체크박스+배치툴바)이 시각 증거로는 약함(코드로만 확인).
- b 3위: membership과는 명확히 구분되나, 리워드 사다리(원형 node+connector+achieved/next/locked 3상태)가 order-status의 타임라인(dot+done/current/upcoming 3상태)과 시각 문법이 유사. 인터랙션(비인터랙티브 vs 아코디언+CTA 밴드)은 실제로 다르나 실루엣이 가장 근접.

## 집계 — 3파전 완전 동률 → tie-break 예외 적용
1위표: a=1(렌즈2) · b=1(렌즈1) · c=1(렌즈3) — 완전 동률.

curation-criteria "주간 반증 판정 기준 ②"(2026-07-25) 적용: brief 렌즈(렌즈1) 우선을 유지하되, archetype 렌즈(렌즈3)가 렌즈1의 1위 후보를 **최하위로 명시 판정**했으면 그 후보를 동률 우승서 제외하고 나머지 중 렌즈1 순위를 재적용한다.

- 렌즈3이 렌즈1의 1위(b)를 **3위(최하위)**로 명시 판정함 → 조건 성립.
- b 제외 → 남은 {a, c}에 렌즈1 순위 재적용: 렌즈1 원순위 b>c>a 이므로 남은 후보 중 c가 a보다 앞섬.
- **승자: c (Wallet & Transaction History)**

r13(2026-08-24)에 이은 두 번째 3파전 완전 동률 사례, 같은 tie-break 예외로 해소.

## LEARN — 격리 적재 delta (아래 §참조, native-deltas-provisional.jsonl에 append)
렌즈1이 c의 순위를 깎은 근거(Withdraw accessibilityHint 허위 약속) vs 같은 라운드 a가 같은 미구현 자리표시자 패턴에서 이 문제를 피한 대비가 재사용 가능한 신규 규율이다 — `auto-native-r8`의 "no-op Pressable은 정당한 자리표시자" delta(L1, 아직 미승격)를 정교화한다: **정당한 것은 no-op 자체이지, no-op을 정직하지 않게 포장하는 accessibilityHint가 아니다.**

## 판정 커버리지 — 미확인 범위 자진 신고 요약
- 렌즈1: `native/tokens.ts` 실값 미열람(스크린샷 시각 확인만), c의 거래리스트 하위 항목 스크롤 미확인, GENERATION.md 원문 전체 미열람(발췌만 사용).
- 렌즈2: 실기기/시뮬레이터 런타임 미검증, 네트워크 실패 경로 3후보 전원 소스에 없어 비교 제외, `ink`/`ink2` 대비비 별도 계산기로 미검증.
- 렌즈3: `listing`(ListingCreateScreen) 등 14개 카탈로그 항목 소스 미열람(설명만으로 비교), a의 선택모드/c의 필터적용 후 상태는 스크린샷에 없어 코드 리딩으로만 검증(런타임 미확인).

기권·재개: 없음(3렌즈 모두 1회 완주).

## 게이트 커버리지 메모 (기존 질문 재확인 — 신규 질문 아님)
렌즈1이 a에서 잡은 하드코딩 hex 2건은 하드게이트가 못 잡았다 — native 게이트는 tsc/export/render/iframe 4단계뿐이라 웹의 `static-check`(토큰 강제)에 해당하는 관문이 없다. 기존 [[questions-queue]] Q34("native 하드게이트가 웹보다 여섯 관문 얇다")가 이미 추적 중인 격차이며 새 질문을 만들지 않는다. a는 어차피 최하위(렌즈1)·2위(렌즈3)로 승격되지 않았으므로 이번 라운드는 실제 피해(위반작 카탈로그 편입) 없이 격차만 재확인했다.

## 판정 후 수정
불요 — c는 게이트 12/12 1차 통과, 규칙 위반(하드코딩 hex 등) 없음. accessibilityHint 이슈는 규칙 위반이 아니라 완성도/정직성 판단이라 §3-1 대상이 아님(고치면 순위를 바꿀 만한 개선이라 다음 라운드 대상).

## no-winner 여부
아니오 — c 승격.
