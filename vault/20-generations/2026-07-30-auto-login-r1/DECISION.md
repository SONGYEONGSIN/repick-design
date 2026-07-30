# DECISION — auto-login-r1

## 후보
- **a** — Contour (analytics/observability SaaS) · 스플릿 · `/login-evolve/r1/a`
- **b** — Meridian (timezone-aware scheduling SaaS) · 풀블리드 배경 · `/login-evolve/r1/b`
- **c** — Ledgerline (freelancer invoicing/tax SaaS) · 미니멀 무장식 · `/login-evolve/r1/c`

## 하드게이트 (§3) — [[20-generations/2026-07-30-auto-login-r1/SCORES|SCORES]] 요약
전 후보 생존. a는 1차 a11y 94(main 랜드마크 누락 + 비활성 세그먼트 텍스트 대비 4.34 — neutral-500 on neutral-100)에서 1회 수정(우측 폼 패널을 `<main>`으로, 비활성 토글 텍스트 neutral-600으로 승격) 후 100. b·c는 1차부터 static/sweep/a11y(100)/perf 전부 통과.

## JUDGE 3렌즈 판정 전문

### 렌즈 1 — 프로파일 준수 (brief-login §1·§2, 폼 a11y 최우선)
**RANKING: c > a > b**
- a: label/error 연결·aria-invalid/describedby·aria-pressed 비밀번호 토글(포커스 유지)·aria-busy+live region 전부 정확하나, "Forgot password?" 링크가 `href="#forgot-password"` 죽은 링크(아무 동작 없음) — 3후보 중 부가 링크 요구사항 이행이 가장 약함. input에 `required` 속성 없음.
- b: 핵심 와이어링은 견고(라벨·autocomplete·aria-invalid/describedby·aria-pressed·aria-busy+live region, 실제 Google/Microsoft/GitHub 마크)하나, 법적 고지가 실제 `<a>`가 아니라 비기능 `<button type="button">Terms</button>`/`<button>Privacy Policy</button>`로 구현됨. input `required` 없음. 모바일에서 스크린샷 3장(s35/s70/s100)이 필요할 만큼 세로로 김(나머지 둘은 390px 한 화면에서 해결).
- c: 이 렌즈의 핵심 기준을 가장 깨끗하게 충족 — input에 aria-invalid/describedby **+ required** 병행, `aria-busy`가 `<form>` 자체에, 상태 영역이 결과에 따라 role/aria-live를 alert(assertive)/status(polite)로 동적 전환, "Forgot password?"가 죽은 링크가 아니라 실제 접근성 disclosure(`aria-expanded`/`aria-controls`)로 피드백을 생성. 390px 한 화면에서 전부 해결.

### 렌즈 2 — 상용 완성도 (Linear·Vercel·Stripe급)
**RANKING: a > c > b**
- a: 컨투어 라인 비주얼 패널이 제품명("Contour")을 그대로 형상화하고 스파크라인 스탯 카드("Signal coverage 98.4%")가 진짜 제품 텍스처처럼 읽힘 — 탭필 형태의 Sign In/Create 토글 + 단일 바이올렛 액센트로 3후보 중 가장 타이트한 시스템화.
- c: 볼드 워드마크 vs 그레이 태그라인 vs 헤어라인 룰 vs 라벨-캡스 폼필드의 타이포 위계가 Stripe/Linear급 절제로 읽히나, 1440/1920에서 블록 전체가 좌상단에 고립돼 넓은 뷰포트에서 "의도된 미니멀"이 아니라 "미완성"으로 보임.
- b: 지구본/그리드 모티프는 스케줄링 제품에 영리하게 온-컨셉이나, 떠 있는 인용구 버블("Scheduling that respects everyone's midnight")과 카드 뒤 앰버 글로우 블룸이 인증 화면에 불필요하게 덧붙은 마케팅 장식 — 장식 과잉(anti-slop) 사유.

### 렌즈 3 — 아키타입 차별성 (첫 login 라운드라 카탈로그 중복 없음 — 아키타입 몰입도 + 형식적 신규성)
**RANKING: b > a > c**
- b: 풀블리드에 가장 과감하고 독창적으로 몰입 — 실제 구형 투영 그래티큘(경위선) 수학 + 애니메이션 글로우 블롭 + 펄싱 위치 마커가 모바일 스크롤 전체에 걸쳐 이어지는 연속 캔버스를 이루고, 카드가 중앙이 아니라 히어로 컬럼에 붙어 비대칭 배치 — "중앙 유리카드 위 히어로 사진" 클리셰 회피.
- a: 스플릿 실행은 탄탄하나(다크 비주얼 사이드 + 라이트 폼 사이드) 센터피스(사인파 "컨투어" 지형선 + 플로팅 스파크라인)는 취향 있는 브랜드-직역형 터치일 뿐 구조적으로 새롭지 않음 — 스플릿의 가장 예상 가능한 버전.
- c: 진짜 무장식(카드·보더 없음, 헤어라인만)이고 텍스트링크 방식 모드 전환(세그먼트 필 아님)이 미니멀다운 선택이지만, 전반적으로 "무난한 에디토리얼 SaaS 로그인"으로 읽혀 이 후보만의 시그니처 기법이라 지목할 지점이 약함.

## 집계 — 완전 3파전 동률
1위 표: a=1(렌즈2) · b=1(렌즈3) · c=1(렌즈1) — 다수결 불성립.

[[curation-criteria]] 축적 기준 "주간 반증 판정 기준 ②"(3파전 동률 tie-break 예외) 적용: *"완전 동률 시 brief 렌즈 우선을 유지하되, archetype 렌즈가 그 후보를 최하위로 명시 판정했으면 동률 우승서 제외하고 나머지 중 brief 1위 재적용."*

1. 기본값 = 렌즈1(brief/프로파일 준수) 1위 = **c**.
2. 렌즈3(archetype)이 c를 **최하위(3위)로 명시 판정**(b>a>c) → c를 동률 우승 후보에서 제외.
3. 나머지 {a, b} 중 렌즈1 순위 재적용 — 렌즈1은 a를 b보다 상위(c>**a**>b)로 판정.

**→ 승자: a (Contour · 스플릿)**. 렌즈2(상용 완성도)도 독립적으로 a를 1위로 판정해, tie-break 재적용 결과와 별도 렌즈가 수렴한다는 점이 결정을 보강한다.

## no-winner 여부
아니오 — tie-break 규칙으로 억지 없이 승자 확정(규칙이 없었다면 완전 동률 no-winner 후보였을 상황이나, 축적된 meta-기준이 명시적 절차를 제공).
