# DECISION — auto-about-r3

타깃: `about` (프로파일 부재 — [[page-brief-core]] §"타입 프로파일 목록" 규정대로 코어만으로 생성. r1·r2에 이어 3번째 라운드. 이 라운드에서 나온 delta가 향후 `about` 프로파일 초안에 계속 누적된다.)

## 다양성 축

이번 라운드는 `about` 자체 최근 이력(r1: light/amber/grotesk, r2: dark/rose/mono)이 짧아 `catalog-variety.mjs`의 `banList`가 연속 동일 테마 외에는 빈 상태였다. 카탈로그 전체 분포(light 16 · dark 10, `violet-hex` 7 · `indigo` 5 · `sky` 4 과다, `pretendard`(활자 미지정) 21/26 과다)와 about 자체 최근 2라운드 승자 활자(r1=grotesk, r2=mono, 둘 다 회피 대상)를 근거로 세 후보에 다음을 배정: a=dark/blue/wide, b=light/emerald/기본(활자 미지정), c=dark/cyan/wide.

## 매크로-버킷 선제 회피

`about` r1·r2가 이미 쓴 6개 매크로-셸+인터랙션 조합(에디토리얼 스크롤+마일스톤 타임라인+스크롤스파이 / 디렉토리 그리드+칩·검색필터 / 다이어그램-호버 동기화 / 스티키 레일+org-pod+탭리스트 / 연도 스크러버+details / select 필터+캐러셀)을 세 designer 프롬프트에 명시 회피 목록으로 전달하고, 각자에게 "구조적/체계적"(a) · "챕터형 내러티브, 단 다이어그램 동기화·타임라인 센터피스 제외"(b) · "데이터 중심/엄격"(c) 방향을 분기 배정했다.

## 후보

- **a — Ordinal**: 규정/워크플로 자동화 SaaS. 다크/blue/`--font-display-wide`. People을 함수축↔지역축으로 재편되는 실제 트리(trunk+branch)로 구현(같은 12명 데이터셋을 두 축으로 재구성), Values는 마스터-디테일(플레인 버튼 리스트가 디테일 패널 하나를 스왑 — 탭/아코디언/캐러셀 아님).
- **b — Millrace**: 송장-결제 자동대사 SaaS. 라이트/emerald/기본 활자(디스플레이 폰트 미지정). 01–06 챕터 내러티브 스파인. 인터랙션 3종: People 카드-플립(`person-flip-card.tsx`, 클릭/포커스로 앞면↔뒷면, `backface-visibility`+`prefers-reduced-motion`에서 전환시간 0), Values의 "무엇을 지향/거부하는가" 페어드-비교 토글, Proof의 카테고리 버튼 그룹.
- **c — Sextant**: 사용량·청구·지원 데이터 정합 SaaS. 다크/cyan/`--font-display-wide`. People은 실시간 타이핑 퀵파인드(select·칩 아님, 16명 전원 기본 노출), 지역별 인원분포 hover/focus/pin 바 차트, 6개 원칙을 하나씩 열람하는 누적 읽음-확인 진행률 패널.

## 하드게이트

게이트 실행: `CHROME_PATH=/opt/pw-browsers/chromium PW_NO_SANDBOX=1 PW_CHROMIUM_PATH=/opt/pw-browsers/chromium node scripts/gate.mjs --target web --routes /about-evolve/r3/<v>`. 소스 동결 해시: `f5c023c62585184e1a43d3c0c2ce7250405becee`. 전 후보 1차 통과(static 위반 0 · weights 3종 · sweep 오버플로 0 · a11y a=96/b=100/c=96 · perf a=66/b=68/c=70, 기록만) — 1-fix 루프 불요. 스크린샷 48장(후보별 16 = 4폭×4스크롤), blank 0/48. 상세: [[SCORES]].

## JUDGE 패널 (3렌즈, 블라인드 — 각 렌즈에 데스크톱 1280px + 모바일 390px × 스크롤 0/35/70/100% 8프레임/후보 + 소스 경로 제공, candidates/*.md·SCORES·DECISION·ledger는 판정 전 비공개)

### 렌즈1 — page-brief-core 준수 + 견고성
1위 c · 2위 a · 3위 b. c는 16명 전원 기본 노출(필터 미적용 상태에서도 People 델타를 가장 강하게 충족) + 전 위젯 정확한 ARIA로 견고성 1위. a도 동등히 견고하나 People 섹션이 초기 렌더에 12명 중 3명만 보임(첫 org 노드만 기본 확장)이 감점. b는 접근성 메커니즘 자체는 탄탄하나 `page.tsx:58`·`166`에서 `{COMPANY_NAME}` 뒤 텍스트가 렌더 시 공백 없이 붙는("Millracematches", "Millracetoday") 실제 콘텐츠 결함을 히어로·클로징 양쪽에서 발견(`b-1280.png`/`b-390.png`/`b-1280-s70.png`/`b-390-s100.png`).

### 렌즈2 — 상용 완성도(Stripe·Linear·Vercel·Ramp급) + 에셋·인터랙션 밀도
1위 a · 2위 c · 3위 b. a는 조직 재편 토글과 Values 마스터-디테일이 "순서/체계" 히어로 주장을 프레임 전체에서 하나의 논지로 이어간다는 점에서 최상위. c는 인터랙션 3종 모두 상태-의미적이나 미션·디렉토리·차트·원칙이 개별 모듈로 느껴져 서사 응집력에서 a에 뒤짐. b는 `person-flip-card`가 세 후보 통틀어 가장 "델라이트풀"한 인터랙션이라는 평가에도 불구하고 히어로·클로징을 여는/닫는 두 지점에서 반복되는 공백 결함이 "Stripe/Linear급이면 절대 출시 안 할 결함"으로 3위 사유가 됨.

### 렌즈3 — 아키타입 차별성 (r1·r2 6개 기존 조합 대비)
1위 a · 2위 b · 3위 c. a의 "축-전환 트리 + 마스터-디테일"은 기존 6개 조합 어디와도 겹치지 않고 이번 라운드 b·c와도 메커니즘이 다름. b의 챕터 스파인은 r1/a의 에디토리얼 스크롤과 리듬은 유사하나 타임라인 센터피스·칩그리드를 카드-플립·페어드토글로 대체해 신규성 인정, 특히 플립카드는 6개 아키타입 어디에도 없음. c는 People 퀵파인드가 아키타입2(디렉토리+검색)·아키타입6("Showing N of M")과 부분적으로 겹치고 지역 차트의 hover-동기화도 아키타입3과 개념적으로 인접해, 3개 메커니즘 중 2개가 기존 카탈로그 동작을 재조합한 것으로 판정되어 최하위.

## 집계

1위표: a 2표(렌즈2·렌즈3) · c 1표(렌즈1). 명확한 다수결 — **a가 승자**. 3파전 동률 예외(브리프 렌즈 우선 규칙)를 적용할 필요 없음(동률이 아님). no-winner 표 0개.

## 승자 — a (Ordinal)

## 정제 조치 (§3-1)

불요 — 승자 a는 3렌즈 모두에서 규칙 위반 지적이 없었다(재게이트 불요).

## 기권

없음 — 3렌즈 전원 응답, 재디스패치 불요.

## 참고 — 비승자 결함 기록 (다음 라운드·정본 후보용)

- **b — JSX 표현식 직후 줄바꿈 텍스트의 공백 소실(재현 1회, 미승격)**: `{EXPR} 텍스트...\n다음 줄...` 형태로 표현식 바로 뒤 텍스트가 여러 줄로 개행될 때, JSX 공백 정규화가 표현식과 텍스트 사이 공백을 삭제해 렌더 결과가 `EXPR텍스트`로 붙는다(실측: `curl`로 렌더된 HTML 확인 — `Millrace<!-- -->matches`, 공백 문자 없음). 정적 검사·Lighthouse·sweep 어디도 문자열 결합 결함을 못 잡는다. 재현 1회라 승격 임계(2회 이상) 미달 — 다음 라운드에서 같은 패턴이 또 나오면 `about-deltas-provisional.jsonl`에 L1으로 적재.
- **c — People 델타 충족의 최상위 구현이나 인터랙션 3종 중 2종이 기존 카탈로그 동작 재조합**: 렌즈3 지적대로 퀵파인드(아키타입2/6 인접)·지역차트 hover-동기화(아키타입3 인접) — 다음 라운드가 People/지리 정보를 다룰 때는 이 두 메커니즘을 회피 목록에 추가할 가치가 있다.

## LEARN — 델타 적재

```
node -e "import('./scripts/design-loop.mjs').then(m=>m.appendLedger({round:'auto-about-r3',variant:'a',delta:'People 섹션을 두 개 이상의 독립된 축(예: 직군/지역)으로 재편 가능한 실제 계층 구조(트리)로 제공하면, 단일 평면 목록·그리드보다 완성도(렌즈2)와 아키타입 차별성(렌즈3)에서 동시에 우위를 얻는다 — 단, 초기 렌더가 전원 축약 노출이면 안 된다(브리프 렌즈 감점 요인, a가 3/12명만 기본 노출로 유일하게 받은 지적).',evidence:'렌즈2: \"the org-breakdown functions-region regroup toggle actually rebuilds the tree from one dataset\" · 렌즈3: \"a two-axis regroup toggle that rebuilds a genuine trunk-and-branch tree... matches no catalog archetype\" · 렌즈1(반대 근거로 인용): \"People 섹션이 첫 렌더에 12명 중 3명만 노출\"',judge_votes:{lens1:'c',lens2:'a',lens3:'a'},confidence:'high',level:'L1',status:'provisional'},'vault/00-principles/about-deltas-provisional.jsonl'))"
```
level=L1 — 승격은 정제 게이트가 판단.

## 지식 정제 게이트

`about-deltas-provisional.jsonl`은 이제 3건(r1: People+Values 콘텐츠 완결성 / r2: `list-none` 디스클로저 대체 어포던스 / r3: 축-전환 계층 People 구조). 클러스터링: 세 델타는 서로 다른 층위(콘텐츠 계약 / a11y 메커니즘 / 구조 패턴)를 다뤄 충돌 없음. 재현 2회 이상 조건을 만족하는 델타 없음(전부 1회 관측) — 전 건 L1 유지, L2 승격 없음. meta-기준(curation-criteria) 정당화 불가 항목 없음 — 신규 질문 생성 불요. 비승자 결함(JSX 공백 소실)은 재현 1회로 승격 임계 미달이라 delta로 적재하지 않고 위 "참고" 절에만 기록.
