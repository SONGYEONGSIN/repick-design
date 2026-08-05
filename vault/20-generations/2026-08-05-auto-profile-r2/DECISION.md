# DECISION — auto-profile-r2

타깃: `profile` (신규 · 프로파일 부재 2라운드째 — [[page-brief-core]] §"타입 프로파일 목록" 규정대로 코어만으로 생성. `profile-deltas-provisional.jsonl`의 r1 델타(핵심 신뢰 통계 상시노출)를 GENERATE 사전 지침으로 명시 전달했다.)

큐 선정: `app/src/lib/works.ts`의 `PAGE_TYPES` 미채움 조회 결과 `profile,blog,about,careers,contact,developers,integration,media-kit`가 미충족 상태였고(승격은 `/dash-falsify apply`에서 일어나므로 `auto-profile-r1`이 있어도 works.ts엔 아직 `category:"profile"`이 없다), 배열 순서상 첫 항목인 `profile`을 뽑았다.

다양성 축 사전 배정: `node scripts/catalog-variety.mjs` + 최근 5라운드(product-detail-r2·paywall-r2·native-r1·profile-r1·blog-r1)의 `variety` 필드로 계산한 banList가 **빈 상태**(theme/accent/face 전부 강제 회피 없음)였다. 그럼에도 카탈로그 전체가 `pretendard`-전용(21/24)·`violet-hex`/`indigo` 액센트(7·5회)에 쏠려 있어, 3후보에 서로 다른 축을 사전 배정했다: a=light/emerald/grotesk · b=dark/cyan/wide · c=light/blue/mono(카탈로그 최초 사용).

## 후보
- **a — "Imogen Castellane / Keel & Ballast Audits"**: 독립 프로토콜 보안감사관 프로필. sticky 상단 identity bar(rating·audits·fixes·since 4-stat `dl`, 전 스크롤 깊이 상시노출)에 항상 노출되는 프로토콜별 커리어 총계 시맨틱 테이블이 이어지고, 메인은 심각도 칩×프로토콜 select×정렬로 필터링되는 연대순 케이스 로그(각 항목이 아코디언으로 확장돼 실제 findings 테이블을 노출)다. r1의 탭형 스토어프론트·사이드바+히트맵·히어로+피드+가격 3종과 다른 "로그 스파인" 구조.
- **b — "Renata Kessler / Solstice Macro" (Meridian 플랫폼)**: 트레이딩 전략 벤치마크 프로필. sticky 스코어보드 밴드(핵심 `dl` + 기간 토글 + 베이스라인 토글)가 페이지의 구조적 척추로, 두 토글이 통계쌍·월별 다이버전스 바 차트·포지션 테이블의 델타 열을 동시에 재계산한다. r1 3종과도, 이번 라운드 a/c와도 겹치지 않는 "공유 이중 토글이 이질적 산출물 다수를 재계산" 조합.
- **c — "Reeve Calloway / Fieldwork"**: 프리랜스 프로덕트·그로스 디자이너 포트폴리오. sticky identity bar 아래 discipline 다중선택 칩 + engagement-type 세그먼트 + 정렬이 3열 케이스스터디 카드 그리드를 구동하고, 각 카드가 확장돼 before/after 메트릭 테이블과 후기를 노출한다.

## 하드게이트
게이트 실행: `CHROME_PATH=/opt/pw-browsers/chromium PW_CHROMIUM_PATH=/opt/pw-browsers/chromium PW_NO_SANDBOX=1 node scripts/gate.mjs --target web --routes /profile-evolve/r2/<v>` (playwright.dev 다운로드가 프록시에서 차단돼 세션 로컬 크로미움 사전설치본 사용, gate.mjs 자체는 무수정). 전 후보 1차부터 전 항목 통과(static 위반 0 · weights 3종 · sweep 오버플로 0 · a11y a=100/b=96/c=100 · perf 기록만). 1-fix 루프 불요. 상세: SCORES.md.

스크린샷: 후보별 16장(4폭×4스크롤 지점), blank 판정 전원 통과(48/48 — b는 정제 조치 후 재촬영, 아래 참조).

## JUDGE 패널 (3렌즈, 블라인드 — 컨셉 문서 비공개, 스크린샷+소스만 전달)

### 렌즈1 — page-brief-core 준수 + 견고성
1위 a · 2위 c · 3위 b. 3후보 전원이 상시노출 델타(rating/stat `dl`이 전 스크롤·전 상태에서 sticky 유지)를 지켰고 `dl` 중첩 규칙(아이콘이 `dt` 내부)도 전원 정확했다. a는 32프레임(1280·390 × 4스크롤) 전수 검사에서 결함 없음 — 커리어 총계 테이블이 필터와 무관하게 불변인 "증명 상시노출" 설계, `motion-reduce:transition-none` 준수까지 확인. c는 근소한 2위 — `IdentityBar`의 제목 줄이 `truncate`로 뱃지를 삼켜(390px에서 "Available for new engagements" 배지가 안 보임) 핵심 `dl`과 무관한 완성도 결함 1건. **b — 실질 결함**: `PositionsTable`이 `overflow-x-auto` 래퍼 없이 `table-fixed`만 써서 390px에서 열이 붕괴(정렬 아이콘과 "Return" 텍스트 겹침, 값 문자열 서로 붙어 읽기 불가) — `document.scrollWidth`를 오염시키지 않아 자동 sweep은 통과했지만 page-brief-core §5(로컬 가로 스크롤은 모바일 전용, 16px 미만 여유폭은 실패) 정면 위반. 하드게이트가 못 잡는 폭 결함 클래스로 3위 사유.

### 렌즈2 — 상용 완성도
1위 b · 2위 a · 3위 c. b: 스코어보드 밴드의 두 토글이 통계쌍·바 차트·포지션 테이블 델타 열을 동일 소스(`data.ts`)에서 실시간 재계산 — 트레이딩 벤치마크 대시보드 레퍼런스급 정보 밀도와 상태 일관성, 카피-DOM 불일치 없음. a: 완전히 일관되나 차트/생성형 자산이 전무해(정적 모노그램뿐) 3후보 중 시각적으로 가장 얇음 — "감사 보고서"에 가깝고 벤치마크 프로필만큼 상용적이지 않음. c: 케이스카드 커버 아트가 카테고리별로 결정론적이나 실제 데이터를 인코딩하지 않는 장식적 아이콘(b의 차트는 실제 수익률 크기를 인코딩)이라 상대적으로 낮은 3위, 단 카피-DOM 불일치는 없음(footer가 "58 engagements"와 "8 case studies representative" 두 숫자를 정확히 구분).

### 렌즈3 — 아키타입 차별성
1위 b · 2위 a · 3위 c. b: 공유 이중 토글이 이질적 출력 3개(통계쌍/차트/테이블)를 동시 재계산하는 입력×출력 조합은 이번 라운드도 r1 3종에도 없는 신규 조합 — Q15(신규 타입의 타 타입 골격 이식) 관점에서 **profile-native/독자적**으로 판정(고신뢰). a: 필터칩+select+정렬→재정렬 메커니즘 자체는 c와 공유되고 catalog 타입의 핵심 이식이지만, 최종 조합(sticky 바+불변 집계 테이블+비경쟁 정적 사이드+리스트형 출력)이 c와는 구분되는 재조합 — **부분 이식**(중간 신뢰). c: sticky 통계바(r1/a 계열)+about/태그 카드(r1/b 사이드바 콘텐츠와 거의 동일)+필터→그리드(catalog 메커니즘의 가장 문자적 재현)로 3후보 중 신규 구조 어휘 기여가 가장 적다 — **확신 이식**(고신뢰).

## 집계
1위 표: b 2표(렌즈2·렌즈3) · a 1표(렌즈1) → **다수결 성립**. [[curation-criteria]] "차별성 ↔ 완성도 상충 시 판정 방향"과는 다른 패턴이다 — 이번엔 완성도(렌즈2)와 차별성(렌즈3)이 **같은 후보(b)**로 수렴했고, 렌즈1만 반대(b의 실결함 근거)였다. tie-break 불요.

## 승자 — b (Renata Kessler / Solstice Macro)

## 정제 조치 (§3-1 — 판정 후 산출물 수정, 규칙 위반 해소에 한정)
렌즈1이 지적한 b의 `PositionsTable` 390px 폭 결함(page-brief-core §5 위반, 자동 sweep 미검출)을 승자 확정 후 수정했다. 원인은 [[page-brief-core]] §3에 이미 문서화된 "sr-only 앵커" 버그의 실측 재현이었다: `<caption className="sr-only">`와 델타 열 헤더의 `<span className="sr-only">`가 `position:absolute`인데 그 사이 조상 어디에도 `position:relative`가 없어, `overflow-x-auto` 클리핑 컨테이너를 건너뛰고 상위(문서) 좌표계에 페인트됐다 — 테이블에 `min-w-[560px]`를 주기 전에는 정적 위치가 뷰포트 안에 머물러 드러나지 않다가, 폭 결함 자체를 고치려 `overflow-x-auto` + `min-w-[560px]`를 추가한 순간(테이블의 in-flow 정적 위치가 560px 폭 기준으로 재계산되며) 처음으로 `document.scrollWidth`를 오염시켰다(390 → 509, 오버플로 119px, 자체 재현·계측 완료).
- **조치**: `positions-table.tsx`의 `overflow-x-auto` 래퍼 div에 `relative`를 추가해 두 `sr-only` 요소의 containing block을 클리핑 컨테이너 내부로 되돌렸다(테이블 자체는 `min-w-[560px]` + `overflow-x-auto`로 로컬 가로 스크롤 유지 — a/c와 동일 패턴).
- **재검증**: `cd app && npx tsc --noEmit`·`npx eslint src/app/profile-evolve/r2/b` 클린 재확인 → `node scripts/gate.mjs --target web --routes /profile-evolve/r2/b` 재실행 전 항목 통과(static 0 · weights 3종 · sweep 오버플로 0 · a11y 96 · perf 62) → 스크린샷 16장 재촬영, blank 0/16.
- **순위 재계산**: 하지 않음 — 이 수정은 렌즈1이 이미 근거로 인용한 결함의 **해소**이지 완성도 개선이 아니다(렌즈2·렌즈3의 1위 사유는 이 폭 결함과 무관했다). 렌즈1의 3위 판정 자체는 판정 시점 기록으로 그대로 둔다.
- **소스 재동결 해시**(조치 후, 전 후보): `c93d6cb43fd06f86a16cf9f15216a3d5f5af9df5` (SCORES.md 참조 — judge 패널이 본 원 동결 해시 `ecd0a7...` 와 구분해 기록).

## 기권
없음 — 3렌즈 전원 정상 응답.

## 참고 — Q15 관측 기록 (질문 큐 갱신용, 아래 §정제 게이트에서 반영)
이번 라운드는 Q15("신규 타입이 기존 타입 골격을 부분 이식하는 것을 아키타입 렌즈가 감점해야 하는가")의 2번째 관측 라운드다. 렌즈3의 개별 판정: b=독자적(고신뢰) · a=부분 이식(중신뢰) · c=확신 이식(고신뢰). r1에서는 3후보 **전원**이 이식이었고 그럼에도 이식도가 가장 낮았던 b(사이드바+히트맵, 대시보드 위젯 재스킨으로 판정됨)가 승자였다. 이번 r2에서는 **독자적 구조(b)가 1위 표까지 가져갔다** — 이식 여부가 승패를 가르는 결정 변수는 아니었지만(렌즈1은 b를 3위로 뒀다), 렌즈3의 1위가 2라운드 연속 "이식도가 낮은 후보"에게 갔다는 점은 관측할 가치가 있다.

## 참고 — 비승자 결함 기록 (다음 라운드 방지용, 델타 미승격)
- c의 `IdentityBar` 제목 줄이 `truncate`로 가용성 배지를 삼키는 패턴(390px에서만 발현, 핵심 `dl`과는 무관)은 이번 라운드 델타로 올리지 않았으나, 2회+ 재현 시 delta 편입 검토 대상.
