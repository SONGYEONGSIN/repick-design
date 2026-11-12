# auto-landing-r27 — DECISION

## §0 준비

- Agent 서브에이전트 도구 가용성: **최상위 오케스트레이터 세션에서 확인**. `auto-landing-r26`가 서브에이전트 내부에서 재위임이 불가능해(중첩 Agent 스폰 미지원) no-round로 종료된 뒤, 이번 라운드는 최상위 세션이 직접 designer/judge 서브에이전트를 스폰해 진행했다 — §0-0의 가용성 요건을 충족.
- 브랜치: `evolve/dash` (기존 체크아웃 유지).
- 라운드 예산: `node scripts/round-budget.mjs --explain 1` → **1** ("미채움 0종 — N≥2 의 근거(커버리지)가 없다"). `app/src/lib/works.ts`의 `PAGE_TYPES` 18종 전부 카탈로그에 등재되어 있어 미채움 큐가 비어 있다.
- native 주간 고정 주기: 오늘(2026-09-29)은 UTC 화요일(`getUTCDay()===2`) — 월요일 미해당, native 강제 대상 아님.
- 타깃 선택: 미채움 0종이므로 dash/landing/native 균등 난수 → **landing**.
- 라운드 번호: `auto-ledger.jsonl`에서 landing 최대 라운드(no-round였던 `auto-landing-r26` 포함) + 1 = **r27**. (r26은 no-round로 소진되어 실질적으로 판정에 도달하지 못했으므로, 이번 라운드가 이 세션에서의 사실상 첫 실질 landing 라운드다.)
- `reassign-queue.md` "대기 중" 확인 — landing 항목 없음(전부 아카이브). 재배정 없이 3후보 전부 자유 탐색.
- 다양성 축 선제 체크(`scripts/catalog-variety.mjs`): 최근 3개 landing 라운드 기준 `banList` = `{theme: [light], accent: [], face: [grotesk]}` (light·grotesk 회피). 카탈로그 전체 최소사용 accent = green(1)·lime(2)·orange(3)·violet(3). 이번 라운드는 3후보에 각각 dark 테마(light 회피) + 서로 다른 accent(violet/green/lime, 전부 최소사용 축) + 서로 다른 디스플레이 활자(mono/wide/미지정, grotesk 회피)를 배정했다.
- 매크로-골격 버킷 선제 체크: 카탈로그 및 최근 라운드(r21 2D스캐터, r22 레이어스택, r23 히스토그램, r25 히트맵테이블/방사형아크/스트림그래프)에 없는 output-visualization 3종을 신규 배정 — radar/polar polygon(a) · treemap(b) · slope/bump chart(c). 셋 다 서로 다른 input 메커니즘도 함께 배정(연속 리노멀라이징 슬라이더 / 가변 카디널리티 다중선택 / 이산 3단 토글).

## §1 RETRIEVE

정본 전문 확인: `design-principles.md`(landing DNA), `page-brief-core.md`(기계검증 규칙 전체), `page-brief-repo.md`(영문전용·폰트화이트리스트·게이트요건), `curation-criteria.md`(레벨체크리스트·축적된기준), `vault/20-catalog/ux-guidelines.catalog.md`·`motion.catalog.md`(landing 관련 행) 전문을 읽고 designer 프롬프트에 발췌 본문(링크 아님)으로 조립해 전달. `landing-deltas-provisional.jsonl` 57줄 전체 확인(최근 delta: r25 grid+overflow-auto contain:layout 픽스, r24 label-content-name-mismatch 수정법, r23 히스토그램 L2, r22 헤더/nav L1, r21 2D좌표 L2, r20 가변카디널리티 L2, r19 재정렬리스트 L1, r18 다이얼 L2). `auto-ledger.jsonl` landing 최근 5개 확인(r21~r25). 카탈로그 `v6~v26` 전체(19개 작품) 개념 요약 확인해 중복 금지 목록 구성.

## §2 GENERATE

3개 designer 서브에이전트(최상위 세션이 직접 병렬 스폰) — 각자 조립된 브리프 전문 + 배정된 아키타입/입력축/다양성축(테마·액센트·활자)을 받아 독립 생성:

- **a — "Signal Map"**: 5축(condition/authenticity/price-fit/seller-trust/demand-velocity) 레이더 폴리곤, 리노멀라이징 5-슬라이더 입력(v21 다이얼과 같은 리노멀라이징 패턴을 복수축 폴리곤에 적용). violet accent(`#6E56CF` 계열) · `--font-display-mono`.
- **b — "Demand Map"**: 6개 카테고리 트리맵(면적=수요), 가변 카디널리티 다중선택 입력(v23 Bundle Builder와 달리 1D 커브/롤업이 아니라 진짜 2D 면적분할). green(emerald) accent(`#1E7A56`/`#7ED9AA`) · `--font-display-wide`.
- **c — "Fair-Price Slope"**: 두 축(Seller's asking / repick's verified fair price) 연결선 슬로프 차트, 이산 3단 시나리오 토글(Balanced/Authenticity-first/Fast-sale) 입력. lime accent(`#8BA83A`/`#C9E08A`) · 디스플레이 활자 미지정(Pretendard 유지, 다양성 배정).

컨테이너 재시작으로 후보 b(자체 리뷰 수정 중이던 min-w-0 CSS 한 줄)·c(데이터/토큰만 완료, page/client/차트 컴포넌트 미완)의 백그라운드 작업이 유실됐다 — 복구 서브에이전트를 재파견해 b는 검증+자체보고서 작성만(코드 수정 불요, 기존 파일이 이미 완결 상태였음), c는 기존 `data.ts`/`tokens.ts`를 그대로 이어받아 나머지 파일(`page.tsx`/`client.tsx`/`slope-chart.tsx`/`listing-card.tsx`)을 완성했다. 세 후보 모두 완주.

**게이트 직전 동결 해시** (후보 전체 `.tsx`/`.ts` 이어붙인 SHA-1, gate 실행 전 기록): `356b8ff20772d0d1ef1e8ed386da67d018235436`.

## §3 HARD GATE

`node scripts/gate.mjs --target web --routes /landing-evolve/r27/<v>` (env: `PW_CHROMIUM_PATH`/`CHROME_PATH`를 이 샌드박스의 사전설치 Chromium에 고정 — outbound가 `cdn.playwright.dev`를 막아 기본 설치가 실패하므로).

- **a**: 1차 lint 위반 1건(`data.ts:81` 미사용 변수 `n`) → 제거 후 재게이트 10/10 클린.
- **b**: 1차 클린(10/10).
- **c**: 1차 클린(10/10).

`a11y`/`perf`(Lighthouse) 전부 `unavailable`(=pass 취급, `page-brief-repo` §5) — 이 샌드박스에 Lighthouse용 CDP 경로가 없다(`auto-landing-r25`와 동일 환경 제약, 실측 미검증). 그 외 8게이트(route/types/static/lint/weights/sweep/focus/console) 전부 3후보 0위반. 상세는 `SCORES.md`.

스크린샷: 후보별 4폭(390/1280/1440/1920) × 4스크롤(0/35/70/100%) = 16장, 3후보 48장, blank 0건.

## §4 JUDGE

3렌즈 병렬(최상위 세션이 직접 스폰, 블라인드 — 컨셉명 비공개, a/b/c 순서로만 제시). 공통 입력: 후보당 4프레임(1440 s0/s35/s100 + 390 s0) + 소스 경로. 세 렌즈 모두 요구된 4프레임 완료 판정 조건(랭킹·후보별사유·근거file:line또는프레임명·미확인범위자진신고)을 첫 응답에서 전부 충족해 재개(SendMessage) 불요했다.

- **렌즈1(브리프 준수)**: **c > a > b**. 셋 다 비차별적 규칙(영문전용·히어로내 매물카드·클로징CTA 라이브값)은 통과. c가 히어로 매물카드 4장(a는 2장, b는 1장 토글)으로 가장 강한 증명 밀도, 그리고 자체 3-시나리오 중 하나(Authenticity-first, −8.5%)가 브리프의 "오른다"는 템플릿을 깨는 것을 미리 발견해 CTA 동사 자체를 파생시킨 점을 최고 평가.
- **렌즈2(상용완성도)**: **b > a > c**. b의 히어로 자체가 실제 인터랙션(워치/스니커즈 카드 스왑)을 담고 헤드라인이 트리맵의 통찰을 한 문장으로 선언하는 점, 섹션 폴리오 넘버링의 에디토리얼 터치를 1위 근거로. c는 **히어로 헤드라인 줄바꿈 결함**을 구체 인용해 3위로 내렸다 — 수동 `<br/>` 배치(`client.tsx:185-189`)가 실제 clamp 타이포 스케일에서 다시 랩되어 "price"가 고아줄로 남는 현상이 1440px·390px 양쪽에서 재현(`c-1440.png`·`c-390.png`).
- **렌즈3(형태 차별성)**: **b > a > c**. b의 트리맵이 카탈로그 전체 중 유일한 "면적=값" 2D 공간분할 형태(나머지는 전부 점/선/바늘/막대/리스트 어휘)라는 점, v23과의 근접 선행작 대조에서 명확히 구분됨을 1위 근거로. a는 v21(단일 바늘 다이얼)과의 근접 선행작 대조에서 복수축 폴리곤임을 확인해 통과했으나 입력 메커니즘(리노멀라이징 슬라이더) 자체는 v21/v18 계보의 재사용임을 자백. c는 근접 선행작 충돌은 없으나 가장 관용적인(axis+line) 차트 어휘이자 입력축(이산 3단 토글)도 가장 단순해 3위. **매크로-골격 충돌 체크**: 3후보 모두 동일한 히어로 12-col 7/5 그리드·유사 소셜프루프 카드·유사 클로징CTA 패턴을 공유(브리프 템플릿 공유로 판단, 감점 대상 아님) — a·c가 "Buying/Selling" 퍼스펙티브 토글 구조까지 서로 더 근접했다는 관측을 새 질문 후보로 남긴다(아래 §6).

**집계**: 1위 표 — c 1표(렌즈1) · b 2표(렌즈2·렌즈3). **2:1 다수결로 b("Demand Map") 승자.** no-winner 표 0개, tie-break 불요.

## §3-1 판정 후 수정

승자 b에 규칙 위반 지적 없음(렌즈1이 "히어로 카드 1장뿐"이라 지적한 것은 규칙 위반이 아니라 취향/완성도 차원 — 규칙은 "매물 카드가 히어로 안에 있을 것"만 요구하며 b는 이를 충족한다). **정제 조치 없음** — 판정본 = 승격본.

## §5 LEARN — 격리 적재

승자 b의 판정 사유에서 재사용 가능한 delta 1개 추출 (아래 커밋에서 `landing-deltas-provisional.jsonl`에 append):

**delta**: 트리맵(면적-as-값 2D 공간분할)이 이 카탈로그 전체에서 처음으로 점/선/바늘/막대/리스트 어휘를 벗어난 output-visualization 형태이며, 렌즈3이 이를 "가장 패러다임을 깨는 형태"로 명시 인용해 1위 근거로 썼다. 동시에 렌즈2는 이 후보의 승리를 헤드라인이 조작 장치의 통찰을 직접 문장으로 선언한 것("Buyer demand isn't spread evenly." → 트리맵)과 히어로 자체에 실제 인터랙션이 있는 것("Watches/Sneakers" 카드 스왑)에 돌렸다 — 즉 이번 승자는 §가치3분할의 기존 축(조작=가치체감·클로징까지 생존)에 더해 **"헤드라인이 장치의 통찰을 직접 서술하면 헤드라인과 장치가 하나의 아이디어로 읽힌다"**는 관측을 새로 냈다. L1(1회 관측, 특정 후보 종속)로 적재.

## §6 지식 정제 게이트

- landing DELTAS 57+1건 클러스터링: 이번 라운드는 기존 재현 delta와 충돌 없음(신규 output-visualization 형태 추가일 뿐, 기존 5축 원칙과 무모순).
- 레벨 재책정 대상 없음 — 이번 delta는 표본 1건(L1 유지), 재현 대기.
- **질문 강제 생성**: 렌즈3이 관측한 "a·c가 서로(Buying/Selling 퍼스펙티브 토글, 카피 템플릿)에 b보다 더 근접했다"는 매크로-골격 부분 수렴을, [[curation-criteria]] Q21("수렴은 배정으로 못 막는다, 층위를 옮기며 계속된다")의 4번째 사례 후보로 `vault/00-principles/questions-queue.md` "대기 중"에 append(아래 커밋). target: landing. 배경: 이번 라운드는 output-visualization·입력메커니즘 축을 전부 배정해 갈랐음에도, 그 아래 층위(히어로 퍼스펙티브 토글 구조·CTA 카피 템플릿)에서 a·c가 부분 수렴했다 — Q21이 이미 "배정은 그 층위의 수렴만 막는다"고 결론 낸 바로 그 패턴의 landing 타깃 재현. 잠정 가설: 배정을 더 내리지 않고 관측만 하고, 다음 라운드에서 재현되면 렌즈3 프롬프트에 "히어로 퍼스펙티브 토글 구조·CTA 카피 템플릿"을 명시적 회피 축으로 추가할지 판단.
- 정본(dash-brief-v3/design-principles/page-brief-core/page-brief-repo/curation-criteria) **무변경**.

## §7 기록

- `auto-ledger.jsonl` append: `target: landing, round: auto-landing-r27, winner: b, no_winner: false, variety: {theme: dark, accent: emerald, face: wide}`.
- `vault/index.md` "세대 기록"에 이번 run 등재.
- 승격(카탈로그 `works.ts`/`/v27` 배정)은 `/dash-falsify apply`의 몫 — 이 라운드는 하지 않는다.
- 커밋 → `evolve/dash` push.

## 환경 노트 (이 샌드박스 고유, 스킬 불변식 아님)

- Lighthouse a11y/perf가 이 샌드박스에서 `unavailable` — CDP 경로 부재. `page-brief-repo` §5 규정대로 pass 취급했으나 실측은 아니다.
- outbound `images.unsplash.com` 403 — 3후보 전부 고정 `photo-<id>` URL을 썼고(무작위 호스트 아님, 허용된 패턴), 깨진 이미지가 배지와 안 겹치도록 컨테이너를 견고하게 설계했음을 게이트 sweep·judge 둘 다 확인. 판정에 영향 없음(세 후보 다 동일 제약).
- 세션 중 컨테이너가 1회 재시작되어 후보 b·c의 백그라운드 서브에이전트 작업이 중단됨 — 복구 서브에이전트로 완주, 위 §2에 기록.
