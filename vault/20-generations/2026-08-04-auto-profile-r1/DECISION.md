# DECISION — auto-profile-r1

타깃: `profile` (신규 · 프로파일 부재 — [[page-brief-core]] §"타입 프로파일 목록" 규정대로 코어만으로 생성. `profile-deltas-provisional.jsonl`이 이 라운드에서 처음 생성되며, 여기서 나온 delta가 향후 `profile` 프로파일의 초안이 된다.)

다양성 축 사전 배정: 직전 3라운드(native-r1·paywall-r2·product-detail-r2)가 전부 `light` 테마였다(`scripts/catalog-variety.mjs` banList 계산: `theme: ["light"]`). 이 라운드는 그 rut를 깨기 위해 3후보 전원에게 **dark** 테마를 사전 배정했고, 액센트·활자는 서로 겹치지 않게 배정(a=rose/grotesk, b=amber/mono, c=cyan/wide) — 직전 라운드들의 액센트(indigo·teal·sky)·활자(system·pretendard·wide)와도 겹치지 않는다.

## 후보
- **a — Circuitloom Restorations**: 리퍼비시 오디오/키보드/광학기기 리셀러의 공개 프로필(중고 마켓플레이스 셀러 스토어프론트). 신뢰도 통계 클러스터(평점·리뷰수·정시배송률·판매량)가 탭 바깥에 상시노출, 시맨틱 `<table>`(caption/scope)로 셀러 대 마켓 평균 성과 비교. 등급 필터·정렬·리뷰 더보기·팔로우 토글 등 5개 인터랙션.
- **b — Sable Voss / Loopwire**: 워크플로 자동화 플랫폼(`catalog` 타깃의 Loopwire 브랜드 계승)의 검증된 연동 퍼블리셔 공개 프로필. 좌 sticky 사이드바(정체성+신뢰 통계 `dl`+About+태그)와 우 콘텐츠(52주 기여 히트맵+연동 그리드) 2컬럼. 히트맵은 완전 커스텀 roving-tabindex 키보드 내비 + `aria-live` + `sr-only` 폴백 테이블. 사이드바 태그 클릭이 크로스컴포넌트로 그리드를 필터링. 6개 인터랙션.
- **c — Signal & Noise / Ridgeline**: 애널리틱스/뉴스레터 SaaS의 크리에이터 구독 공개 프로필. 히어로에 통합된 도달 통계 `dl`(구독자/포스트/오픈율/유료회원), 필터링 가능한 포스트 피드, 월/연 청구 토글이 3개 멤버십 티어 가격을 동시 재계산. 4개 인터랙션.

## 하드게이트
게이트 실행: `CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome PW_NO_SANDBOX=1 PW_CHROMIUM_PATH=/opt/pw-browsers/chromium node scripts/gate.mjs --target web --routes /profile-evolve/r1/<v>`. b·c는 1차부터 전 항목 통과(a11y 100). a는 1차 a11y 94(mobile 프리셋 — `landmark-one-main` 문서 전체에 `<main>` 랜드마크 부재 + `select-name` 정렬 select 2개에 접근 가능한 이름 없음) → `profile-client.tsx`에 `<main>` 래핑, `listings-panel.tsx`/`reviews-panel.tsx` select에 `aria-label` 추가 후 재게이트 100. 소스 동결 해시(전 후보 최종 통과 시점): `c1670092edd721b37b2eae7ea7bf78fa1ff41f27`. 상세: SCORES.md.

스크린샷: 후보별 16장(4폭×4스크롤 지점), blank 판정 전원 통과(48/48).

## JUDGE 패널 (3렌즈, 블라인드)

### 렌즈1 — page-brief-core 준수 + 견고성
1위 b · 2위 c · 3위 a. b: 랜드마크 구조가 교과서적(header/main/aside/footer 정확한 중첩), 모든 `focus-visible:outline-none`이 실제 링과 짝지어짐, 기여 히트맵이 3후보 중 가장 엄격한 커스텀 위젯(roving-tabindex 전체 키보드 내비+`aria-live`+`overflow-x-auto` 밖에 배치된 `sr-only` 테이블 폴백), 헤딩 h1→h2→h3 무결, `dl` 평탄화도 정확(아이콘이 `dt` 내부). c: b와 동급으로 깨끗하나(`focus-visible` 전부 짝지어짐, `dl` 평탄화 정확), `page.tsx`가 `IdentityPanel`·`PostsFeed`·`MembershipTiers`·`SiteFooter`를 단일 `<main>`으로 감싸 `SiteFooter`의 `<footer>`가 `main`의 자손이 되어 암묵적 `contentinfo` 랜드마크 역할을 잃음(HTML-AAM 규정, 키보드 차단은 아닌 랜드마크 결함) — a도 동일 패턴(header가 main 자손)이라 a 대비 차별화는 안 됨, b 대비로만 열세. **a — 실질 결함**: `listings-panel.tsx:47`·`reviews-panel.tsx:48`의 탭 패널(`tabIndex={0}`)이 `focus-visible:outline-none` 단독이고 대체 링이 전혀 없음(같은 파일의 다른 인터랙티브 요소는 전부 `focus-visible:outline-2` 링을 가짐 — 누락으로 보임) — page-brief-core §3 "outline-none 단독 금지" 정면 위반, 하드게이트가 잡지 못하는 포커스 상태 결함으로 3위 사유.

### 렌즈2 — 상용 완성도
1위 b · 2위 a · 3위 c. b: 핵심 증명(설치수 173,600·연동 9·평점 4.6·가입일)이 `lg:sticky` 사이드바 `dl`에 전 스크롤 깊이(s0/s35/s70/s100 × 전 폭)에서 상시노출 확인. 상태 일관성을 소스 추적으로 검증 — `TOTAL_INSTALLS`(`data.ts:181`, `INTEGRATIONS.installs` reduce)와 `AVG_RATING`이 `sidebar.tsx`·`integrations-panel.tsx` 양쪽에 동일하게 파생 사용, 별도 하드코드 상수 없음. 사이드바 태그↔그리드 크로스필터링이 3후보 중 가장 실질적인 인터랙션. a: "Reputation at a glance" 통계가 코드 주석으로 "탭 뒤에 절대 가두지 않음" 명시, 스크린샷으로 확인. `followers` 파생값이 단일 지점에서만 계산돼 불일치 위험 없음. b보다 인터랙션 세트가 종합적이나 구조적으로 더 관행적이라 근소하게 2위. c: 팔로우 토글이 정확히 `subscribers` 필드에만 연결(코드 주석이 "hard requirement"로 명시), 월/연 청구 토글도 손계산 검증 결과 일관(월 $8/mo vs 연 $6/mo×12=$72/yr 정합) — 결함은 없으나 크로스컴포넌트 인터랙션·비교 위젯이 없어 3후보 중 가장 관행적인 단일 컬럼 구성으로 3위.

### 렌즈3 — 아키타입 차별성
1위 a · 2위 c · 3위 b. a: 매크로 골격 "정체성 헤더+상시노출 평판 통계+시맨틱 비교 테이블+탭형 콘텐츠". "Performance vs. marketplace" 비교 테이블이 이번 라운드 유일한 신규 요소(b·c 어디에도 진짜 비교 테이블 없음) — `profile` 아키타입에 고유한 어휘. 약점: 등급칩 필터×정렬 드롭다운→카드 그리드 재정렬 조합은 기존 `catalog` 타입이 이미 쓰는 조합의 이식. b: 골격이 "sticky 사이드바(정체성+통계+태그)+활동 히트맵+필터링 카드 그리드" — 이는 사실상 대시보드/설정 셸(레일+위젯)에 인물 이름을 붙인 형태다. 사이드바 태그→그리드 크로스필터는 기존 대시보드(`d29`/`d31`)가 이미 반복하는 패턴, 히트맵은 `d40`의 14주×7일 캘린더 히트맵의 재스킨, 상태칩×정렬→그리드 재정렬은 a의 리스팅 패턴과 라운드 내에서도 동일 조합(Q6 재탕) — 3후보 중 "profile 고유" 어휘 기여가 가장 적음. c: 골격 "히어로 정체성+상시노출 통계 스트립+포스트 피드+가격 티어 비교". 포스트의 인라인 아코디언 리빌은 이번 라운드 가장 독창적인 마이크로 인터랙션(a/b의 재정렬과 달리 확장-공개형)이나, 월/연 토글×3티어 가격카드 섹션은 기존에 이미 브리프가 있는 `paywall` 타입의 핵심 메커니즘을 거의 그대로 이식한 것 — 페이지의 상당 부분이 신규 어휘가 아니라 기존 타입 재사용.

## 집계
1위 표: b 2표(렌즈1·렌즈2) · a 1표(렌즈3) → **다수결 성립, tie-break 불요**. 렌즈3이 b의 골격을 "대시보드/카탈로그/기존 위젯의 이식"이라 가장 낮게 평가했음에도, 렌즈1(준수)·렌즈2(상용 완성도)가 b를 앞세웠고 그 근거가 구체적이다(a는 §3 포커스 가시성 실결함, c는 구조적으로 가장 관행적) — [[curation-criteria]] "차별성 ↔ 완성도 상충 시 판정 방향"과 정합(완성도 다수결).

## 승자 — b (Sable Voss / Loopwire)

## 정제 조치 (§3-1)
없음 — 승자 b는 3렌즈 전원에게서 규칙 위반이나 실결함을 지적받지 않았다(렌즈1이 "교과서적"으로 명시). 하드게이트는 1차 전 항목 통과.

## 기권
없음 — 3렌즈 전원 정상 응답.

## 참고 — 비승자 결함 기록 (다음 라운드 방지용, 델타 미승격)
- a의 `listings-panel.tsx:47`·`reviews-panel.tsx:48` 탭 패널 `focus-visible:outline-none` 단독 사용(대체 링 없음)은 이번 라운드 승자와 무관해 §5 델타로 올리지 않았으나, 하드게이트가 놓치는 포커스 상태 결함 클래스로 재현 시 delta 편입 검토.
- c의 `<footer>`가 `<main>` 자손으로 감싸여 암묵적 `contentinfo` 랜드마크를 잃는 패턴(a도 `<header>`에 동일 구조)은 Lighthouse 기본 audit이 놓치는 landmark 결함이다 — 2회+ 재현 시 delta 편입 검토.
