# DECISION — auto-careers-r3

타깃: `careers` (프로파일 부재 — [[page-brief-core]] §"타입 프로파일 목록" 규정대로 코어만으로 생성. r1·r2에 이어 3번째 라운드. 같은 세션에서 about r3 다음으로 미채움 큐를 내려온 타입.)

## 다양성 축

careers 자체 최근 2라운드가 모두 dark(r1: dark/blue/wide, r2: dark/teal/미지정)라 `catalog-variety.mjs`의 `banList` 규칙(themeRun=2, 연속 동일 테마)상 dark가 사실상 회피 대상. 세 후보 중 둘을 light로 배정해 스트릭을 깼다: a=light/amber/grotesk, b=dark/violet(플레인, `violet-hex` 아님)/mono, c=light/rose/기본(활자 미지정). r1·r2 승자 활자(wide, 미지정)를 피해 grotesk·mono를 새로 배정.

## 매크로-버킷 선제 회피

`careers` r1·r2가 이미 쓴 6개 조합(문화선언+칩필터+드로어 / 라이브서치콤보박스+인라인확장+비교테이블 / FAQ아코디언+부서접기 / 정렬테이블+검색+탭리스트프로세스 / 체크박스필터+details+슬라이더 / 무필터+캐러셀+스테퍼+토글)을 세 designer 프롬프트에 회피 목록으로 전달, "지역/오피스 우선"(a) · "칸반보드 우선"(b) · "입력값-계산 우선"(c) 방향을 분기 배정했다.

## 후보

- **a — Isoline**: 글로벌 급여·컴플라이언스 인프라 SaaS. 라이트/amber/`--font-display-grotesk`. 오피스(전체/Austin-HQ/Lisbon/Singapore/Remote) ARIA 탭리스트가 페이지의 주축 — "전체" 기본 상태에서 14개 역할 전원이 도시별로 이미 노출. 팀 `<select>`와 키워드 검색이 추가로 좁히되 목록을 0으로 가리지 않음. 사이드바 타임존-겹침 패널이 오피스 선택마다 결정론적으로 재계산(싱가포르의 0시간 겹침도 정직하게 표시).
- **b — Loomwork**: 워크플로 오케스트레이션 SaaS. 다크/violet(플레인)/`--font-display-mono`. 12개 역할이 부서별 칸반 보드에 상시 전원 노출, 지역별 재편 토글(숨김 없이 재배열만). 카드 선택 시 마스터-디테일(드로어 아님)로 상세 패널 전환. 부서×연차 2축 룩업 테이블 기반 comp 밴드 조회.
- **c — Fenmark**: 현장 서비스·물류 라우팅/컴플라이언스 SaaS. 라이트/rose/기본 활자. 연차 스테퍼+팀/지역 `<select>` 2축 실연산(고정 밴드×배수, 반올림)으로 레벨/급여/에쿼티를 실시간 산출(클립보드 복사 포함), 11개 역할 카드 그리드는 상시 전원 노출(계산기는 하이라이트만, 게이팅 없음 — 테이블 크로우딩 델타 회피 위해 테이블 대신 카드 사용).

## 하드게이트

게이트 실행: `CHROME_PATH=/opt/pw-browsers/chromium PW_NO_SANDBOX=1 PW_CHROMIUM_PATH=/opt/pw-browsers/chromium node scripts/gate.mjs --target web --routes /careers-evolve/r3/<v>`. 소스 동결 해시: `a6531c101ed83c7ebc1c24fb345359ad80e260d0`. 전 후보 1차 통과(static 위반 0 · weights 3종 · sweep 오버플로 0 · a11y 전원 100 · perf a=80/b=68/c=72, 기록만) — 1-fix 루프 불요. 스크린샷 48장(후보별 16 = 4폭×4스크롤), blank 0/48. 상세: SCORES.md.

## JUDGE 패널 (3렌즈, 블라인드 — 각 렌즈에 데스크톱 1280px + 모바일 390px × 스크롤 0/35/70/100% 8프레임/후보 + 소스 경로 제공)

### 렌즈1 — page-brief-core 준수 + 견고성
1위 a · 2위 c · 3위 b. a는 단일 h1·정확한 헤딩 위계·실제 ARIA tablist(roving tabindex+화살표키)·`{" "}` 명시 래핑으로 공백 소실 결함 자체 회피(about-r3/b에서 관측된 결함 클래스를 이 후보 designer가 사전에 인지·방지)까지 확인. c도 전원 네이티브 컨트롤로 견고하나 a보다 야심이 낮음. b는 `role-board.tsx:83`에서 `dark:` 접두어 없이 `text-zinc-500`을 `bg-zinc-950` 배경에 직접 적용한 실측 대비 결함(≈4.14:1, AA 미달) — 정적 규칙 `no-dark-dim-text`가 `dark:text-*-500` 패턴만 잡아 이 사례(접두어 자체 누락)를 통과시킨 게이트 사각지대.

### 렌즈2 — 상용 완성도(Stripe·Linear·Vercel·Ramp급) + 에셋·인터랙션 밀도
1위 b · 2위 a · 3위 c. b는 보드 재편·마스터-디테일 상세 패널(실제 책무/자격요건 카피 포함)·2축 comp 룩업 3종이 전부 실상태-의미적이며 역할 카드 자체의 콘텐츠 깊이가 세 후보 중 가장 두텁다는 평가. a는 오피스탭+팀필터+검색은 탄탄하나 사이드바 타임존 패널이 이미 화면에 있는 정보를 재진술하는 "장식에 가까운" 유일한 사례로 지적됨. c는 계산기의 산술은 가장 정교하나 히어로 통계·계산기 매치카운트·정적 팀/지역 인덱스가 같은 정보를 3번 반복해 "진행이 아니라 패딩"으로 감점.

### 렌즈3 — 아키타입 차별성 (r1·r2 6개 기존 조합 대비)
1위 a · 2위 c · 3위 b. a의 "오피스 탭리스트가 주축 + 탭 전환마다 타임존 바차트 재계산"은 6개 아키타입 및 b·c 어디와도 메커니즘이 겹치지 않는 데이터비주얼-내비게이션 결합. c의 "연차/지역 2축 실연산 + 결과가 카드 그리드를 하이라이트(게이팅 아님)"는 아키타입5(슬라이더→고정밴드 룩업)의 사촌이나 단일 인덱스가 아닌 2축 산술이라는 점에서 재라벨 이상. b의 "칸반 재편 토글+선택시 영구 사이드패널"은 아키타입1의 드로어·아키타입2의 인라인확장의 더 얕은 변형이고, comp 룩업도 c의 계산기와 "급여 계산기"라는 개념을 공유(메커니즘은 다름 — 범주형 룩업 vs 실산술)해 이번 라운드 내 주제 중복으로 지적, 3위.

## 집계

1위표: a 2표(렌즈1·렌즈3) · b 1표(렌즈2). 명확한 다수결 — **a가 승자**. 동률이 아니므로 tie-break 규칙 적용 불요. no-winner 표 0개.

## 승자 — a (Isoline)

## 정제 조치 (§3-1)

불요 — 승자 a는 3렌즈 모두에서 규칙 위반 지적이 없었다(오히려 렌즈1이 공백 소실 결함을 사전 회피한 점을 명시 확인).

## 기권

없음 — 3렌즈 전원 응답, 재디스패치 불요.

## 참고 — 비승자 결함 기록 (다음 라운드·정본 후보용)

- **b — `dark:` 접두어 누락으로 정적 규칙을 우회하는 다크모드 저대비(재현 1회, 미승격)**: `text-zinc-500`을 다크 전용 배경(`bg-zinc-950`)에 조건부 클래스 없이 직접 적용하면 `no-dark-dim-text`가 검사하는 `dark:text-*-500/600` 패턴 자체가 없어 정적 검사·Lighthouse(단일 스킴 감사) 양쪽 다 못 잡는다(실측 대비 ≈4.14:1, AA 미달). page-brief-core §3이 이미 "다크 쪽 하한은 정적 규칙이 강제"라 서술하지만 그 강제가 `dark:` 접두어의 *존재*를 전제한다는 사각지대는 별도로 문서화된 적 없다 — 재현 1회라 승격 임계 미달, 다음 라운드에서 같은 사각지대가 또 나오면 target-agnostic 질문으로 questions-queue 등재 검토.
- **JSX 표현식 직후 공백 소실 버그, 교차-세션 2회째 관측**: about-r3(이 세션, 비승자 b)에 이어 이 라운드 candidate a의 designer 서브에이전트가 독립적으로 같은 결함 클래스("134people")를 발견해 `{" "}` 명시 래핑으로 스스로 수정 — 산출물에는 남지 않았으나 관측 자체는 재현 2회째. 두 사례 모두 target-agnostic(About·Careers 양쪽에서 발생)이라 특정 타입 delta보다는 page-brief-core 후보에 가깝지만, 이 세션은 정본 파일 수정 권한이 없어 기록만 남긴다.

## LEARN — 델타 적재

```
node -e "import('./scripts/design-loop.mjs').then(m=>m.appendLedger({round:'auto-careers-r3',variant:'a',delta:'Careers 페이지의 필터·내비 주축을 오피스/지역 탭리스트로 두면(부서·직군이 아니라), 탭 전환에 결부된 2차 데이터 시각화(예: 타임존 겹침)를 자연스럽게 얹을 수 있어 완성도·차별성 두 렌즈에서 동시 우위를 얻는다 — 단, 2차 시각화가 화면에 이미 있는 텍스트 정보를 색으로만 재진술하면(신규 정보 없음) 렌즈2가 장식으로 감점한다(a의 유일한 감점 사유).',evidence:'렌즈3: \"a data-viz-as-navigation-feedback mechanism absent from all six archetypes and from B/C\" · 렌즈1: \"office tablist... default state renders all 14 job titles with zero clicks\" · 렌즈2(반대 근거로 인용): \"the sidebar timezone-overlap bar... restates a fact already in adjacent text rather than adding new information\"',judge_votes:{lens1:'a',lens2:'b',lens3:'a'},confidence:'high',level:'L1',status:'provisional'},'vault/00-principles/careers-deltas-provisional.jsonl'))"
```
level=L1 — 승격은 정제 게이트가 판단.

## 지식 정제 게이트

`careers-deltas-provisional.jsonl`은 이제 3건(r1: 오픈롤 상시노출 계약 / r2: 4열+ 테이블 390px 크로우딩 / r3: 오피스축 탭리스트+2차 시각화 결합). 클러스터링: 셋 다 서로 다른 층위(콘텐츠 계약 / 반응형 레이아웃 / 구조 패턴)라 충돌 없음. 재현 2회 이상 조건을 만족하는 델타 없음(전부 1회 관측) — 전 건 L1 유지. meta-기준 정당화 불가 항목 없음 — 신규 질문 생성 불요. 비승자 결함(b의 `dark:` 누락 저대비, 교차세션 JSX 공백버그)은 둘 다 재현 1회(또는 세션 내 산출물 비잔존)로 승격 임계 미달 — 위 "참고" 절에만 기록.
