# auto-landing-r32 — DECISION

Round 1 of a scheduled 2-round-back-to-back `/dash-evolve 2` execution (unattended; see outer session's round-budget note repeated at the end for round 2's own record).

## 0. 준비

- **라운드 수 확정**: `node scripts/round-budget.mjs --explain 2` → `1  미채움 0종 — N≥2 의 근거(커버리지)가 없다`. `app/src/lib/works.ts`의 `PAGE_TYPES` 18종 전부 채워짐(`unfilledTypes()` → `[]`). 호출자가 2를 줬지만 스크립트가 1을 냈으므로 **이번 스킬 실행은 1라운드만 돈다** — 호출 세션(오케스트레이터) 레벨에서 이 스킬을 두 번째로 다시 호출해 2라운드째를 만든다(round 2는 별도 실행으로 뒤따른다).
- **Agent 도구 가용성**: 확인됨(top-level에서 Agent 도구로 designer 3개·judge 3개를 직접 호출). `self_judged` 없음.
- **네이티브 주기**: 오늘(2026-10-10)은 UTC 토요일(`getUTCDay()===6`) — 월요일 고정 native 트리거 미적용.
- **타깃 결정**: 미채움 큐 0종 → `['dash','landing','native']` 균등 난수 → **landing**.
- **재배정 큐**: `reassign-queue.md` "대기 중" 확인 — landing 항목 없음(대기 중인 것은 `auto-dash-r38/c` 하나뿐, dash 타깃). 재배정 없음.
- **다양성 금지 축** (`scripts/catalog-variety.mjs`, 최근 3개 landing 승자 r29/r30/r31 기준):
  - theme: r31·r30 둘 다 `dark` → **연속 2회, 금지** → 이번 라운드 **light 강제**.
  - accent: r31 indigo·r30 teal·r29 green — 전부 다름 → 금지 없음(자유).
  - face: r31·r30 둘 다 `grotesk` → **연속 2회, 금지** → 이번 라운드 grotesk 회피(wide/mono/없음 중 선택).
- **RETRIEVE 체크리스트 추가 확인** (Q60 lineage): 지난 랜딩 라운드(r30→r31)가 쌓은 카피 수렴 회피 목록(5+2=7개 구체 문구/패턴)을 GENERATE 프롬프트에 그대로 캐리포워드 — 아래 참조.

## 1. RETRIEVE

전문 로드: `design-principles.md`(landing BRIEF) · `page-brief-core.md` · `page-brief-repo.md` §1(영문 전용)·§2(폰트 화이트리스트)·§3(레포 관례) · `curation-criteria.md` · `questions-queue.md`(Q56·Q60·Q62 최근 항목) · `ux-guidelines.catalog.md`(web/both) · `motion.catalog.md`(landing 열) · `landing-deltas-provisional.jsonl` 최근(r27~r31) · `auto-ledger.jsonl` landing 최근 5개 · 중복 금지 목록(works.ts v6~v26 승격본 + landing-evolve 전체 라운드 r2~r31 아키타입, 전부 누적).

**중복 금지 아키타입 목록** (장치·입력×출력 조합, 승격 여부 무관 전 누적): 단일/재정규화 레이더 다이얼, N-row 재정렬 리스트/리더보드, 가중축 오더북 재정렬, 항목별 토글 원장, 가변세트빌더→할인곡선+트러스트롤업, 연속 2D 좌표 산점도, 레이어스택/분해스택, 히스토그램, 워터폴/브리지, 노드그래프(선호그래프/트러스트웹)/별자리그래프, 원형누적/버블, 2D 히트맵 테이블, 다중세그먼트 레이디얼 아크, 스트림그래프, 트리맵, 슬로프/범프차트, 레이더/스파이더, 생키, 퍼널, 평행좌표, 순차 게이트체인, 마리메꼬, 불릿그래프, 아이시클, 지도영역 클릭셀렉터, 스와이프카드덱, 멀티스텝위저드→지급액계산기, 스크롤SVG경로타임라인, AI레드라인문서, 협상대화생성기, 드래그비포애프터슬라이더, AI주석핀순차리빌, 예산슬라이더→스펙그리드, 가격밴드축소, 비교표+탭+아코디언.

**카피 수렴 회피 목록** (r30이 처음 묶고 r31이 그대로 캐리, 이번 라운드도 그대로 전달): "Create your free account"/"No card required…", "$___ paid out"+"72 hrs" 스탯 페어, "Set your [X]. Watch the [Y] [verb]." (Watch 동사), "Buyers trust the [X], not just the result.", 풋터 "[축 목록] — [과거분사절], [부정 대안]", 재귀 watch/redraw 동사, "Why [the AI picked this/matched this]" 디스클로저 메커니즘+카피, "Free to [browse/look].", 클로징 오프너 "Right now,", "Three ___ … listing" 3분할 헤딩, "List your first item" 정확 문구.

## 2. GENERATE — 3병렬 (배정 요약)

| v | 장치(input×output) | 테마 | 액센트 | 디스플레이 활자 |
|---|---|---|---|---|
| a | 듀얼핸들 가격범위 슬라이더 → 조건등급별 라이브 box-and-whisker(사분위) 분포 | light | sky | `--font-display-wide` |
| b | 단일선택 카테고리 선택기 → 라이브 chord/arc 다이어그램(동반구매 관계) | light | rose | `--font-display-mono` |
| c | 연속 임계값 슬라이더 3개 → 라이브 100개 아이콘 pictogram/isotype 배열 + 바운드 카운트 | light | lime | 없음(`--font-sans` 그대로) |

세 장치 전부 이 카탈로그에 전례 없는 input×output 조합(위 중복 금지 목록 어느 것과도 겹치지 않음). 디자이너 3개(general-purpose 에이전트, "designer에는 Bash 없음" 방침을 프롬프트로 재현 — tsc/lint/gate 금지 명시) 병렬 호출, 조립한 브리프 전문(경로 아님)을 각자 프롬프트 본문에 직접 기술. 완료 확인은 각 에이전트의 SubagentHandback을 기다려 확인(파일 존재만으로 진행하지 않음) — b는 작업 중 LandingPage.tsx/ProductPreview.tsx/ValueSection.tsx가 사후 재작성되는 전형적 비동기 패턴을 보였고, 완료 알림을 받은 뒤에야 다음 단계로 진행했다.

**게이트 직전 동결 해시**: `cat r32/*/*.tsx r32/*/*.ts | shasum` = `0b1c9f744755b7011f160fdb938bca47f13d6634` (게이트·캡처·판정 전 과정에서 불변 확인).

## 3. HARD GATE

환경: `PW_CHROMIUM_PATH`/`CHROME_PATH` = `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` (Playwright 패키지 v1228 요구 vs 사전설치 리비전 1194 불일치 — r29/r31과 동일 우회), `PW_NO_SANDBOX=1`. dev 서버 중간에 한 번 죽어(이 세션 고유 복구 절차: 재기동으로 해소, `.next` 손상 징후는 없어 `rm -rf .next` 불요) 재기동 후 3 라우트 전부 200 확인.

**3후보 전원 10/10 게이트 1차 통과 — 1-fix 없음, 탈락 없음.** 상세: [[SCORES]].

| | a | b | c |
|---|---|---|---|
| a11y | 100 | 100 | 100 |
| perf(기록) | 63 | 55 | 58 |
| 기타 8게이트 | 전부 pass | 전부 pass | 전부 pass |

## 3-1. 판정 후 수정

**불필요.** 승자(c)에게 어떤 렌즈도 규칙 위반을 지목하지 않았다(렌즈1·2 결함 0건, 렌즈3은 차별성 관점의 수렴 관찰만 — 규칙 위반이 아니라 §3-1 범위 밖). a에는 렌즈1이 실제 결함을 지목했다(`ProductPreview.tsx:103` "Live comparables" 라벨이 슬라이더와 무관한 정적 데이터에 붙음 — 정본이 명시 경고한 "수행하지 않는 효과를 주장하는 카피"의 재현형) — 그러나 a는 승자가 아니므로 정제 조치 불요.

## 4. JUDGE 패널

스크린샷: 후보별 16장(4폭×4스크롤) 캡처 완료, blank 0건. judge에게는 후보당 4장(`<v>-1440.png`·`-1440-s35`·`-1440-s70`·`-390.png`)만 지정(프레임 예산). judge 3개(general-purpose, 블라인드 — 서로의 결과 비공개, 컨셉/순서 비공개, 소스+스크린샷만 제공) 병렬 호출.

| 렌즈 | 1위 | 2위 | 3위 |
|---|---|---|---|
| 렌즈1(브리프/DNA 준수) | **c** | b | a |
| 렌즈2(상용 완성도) | **c** | a | b |
| 렌즈3(아키타입 차별성) | a | b | **c** |

**2:1 다수결 — 승자 c.** 완전 동률 아님, tie-break 불요. no-winner 표 없음.

**렌즈1 핵심 근거**: c의 `computeDerivedStats` 단일 함수가 Hero 리드아웃·아이콘배열·Value 3스탯·클로징 CTA 헤딩+버튼라벨까지 전부 재계산 없이 그대로 꿰뚫는다(가장 엄격한 "조작=가치체감" 구현). a는 `ProductPreview.tsx:103`의 "Live comparables" 라벨이 슬라이더와 무관한 정적 데이터에 붙는 명시적 결함으로 3위. b는 Value 섹션 통계 2/3이 재계산이 아니라 카테고리별 고정 테이블 조회라 "조작=가치체감" 원칙의 약화된 버전으로 2위.

**렌즈2 핵심 근거**: c가 다중 표면(히어로+아이콘배열+Value+클로징 헤딩/버튼) 전부 하나의 실제 계산에서 파생되는 가장 강한 "단일 진실원"이고, 클로징에 기능하는 2차 인터랙션(구매자/판매자 세그먼트 토글)까지 갖춰 1위. a는 수학적으로 가장 엄밀한 사분위 계산 + 실동작 이메일폼으로 2위(단 위 "Live comparables" 라벨의 가벼운 정직성 흠). b는 클로징 섹션이 앵커 링크 하나뿐으로 가장 얇아 3위.

**렌즈3 핵심 근거**: a가 가장 자기완결적인 비주얼/구조 정체성(그리드·활자·장치 기하 전부 독립)으로 1위. b는 코드로 확인된 진짜 chord-diagram 기하(원주 고정 노드 + 중심 통과 베지어)로 2위. c는 기구 자체는 진짜 isotype 배열이나 (1) a와 거의 축자적인 카피 한 줄 공유("Each/Every card carries its own evidence/proof" — 단어 2개만 교체), (2) b와 동일한 히어로 그리드 비율(7/5/12) 독립 수렴, (3) 세 후보 중 유일하게 디스플레이 활자를 쓰지 않아 타이포 정체성이 가장 흐릿 — 이 세 가지로 3위.

## 5. LEARN — 격리 적재 (L1)

```
node -e "import('./scripts/design-loop.mjs').then(m=>m.appendLedger({round:'auto-landing-r32',variant:'c',delta:'A single derived-value aggregation (computed once from a real filter+average over the full sample dataset) threaded unmodified through 4+ surfaces — hero live readout, the core device (icon array), every value-section stat, AND the closing CTA heading+button label — reads as the strongest instance yet of the manipulation-survives-to-CTA doctrine to both a brief-compliance judge and a commercial-polish judge independently. The losing candidates each had a partial version: a recomputed its hero/value chain correctly but one static preview section (falsely labeled Live) was disconnected from it; b correctly threaded its selection through to the closing CTA but 2 of 3 value-section stats were flat per-category lookups rather than genuine aggregation. The differentiator is not whether state reaches the CTA (all 3 did that) but how many distinct surfaces share the exact same underlying computation, and whether every section claiming liveness is actually wired to it.',evidence:'lens1: single derived object traced Hero.tsx->ValueSection.tsx->ClosingCTA.tsx (c), vs a static ProductPreview.tsx:103 Live comparables label disconnected from slider state (a), vs ValueSection.tsx:17-18 flat DAYS_TO_SELL/PAYOUT_PCT lookups (b). lens2: c cited for a 4-surface single source of truth plus a working secondary CTA interaction (buyer/seller toggle).',judge_votes:{lens1:'c',lens2:'c',lens3:'a'},confidence:'high',level:'L1',status:'provisional'},'vault/00-principles/landing-deltas-provisional.jsonl'))"
```

## 6. 지식 정제 게이트

**클러스터링**: 렌즈3이 보고한 카피/구조 수렴 관찰 2건이 기존 L3 delta(`auto-landing-r31 multi`, "assigning distinct visualization devices... does not stop convergence one layer further down")와 같은 결함 클래스다 — **재현을 검증하고 결론을 명시**한다(curation-criteria 규율: delta 본문이 재현을 주장하면 먼저 검증).

- **채택**: 재현 확인. 이번 건은 과거보다 **한 등급 더 가까운 증거**다 — a↔c의 "Each/Every card carries its own evidence/proof"는 문장 골격이 동일하고 **단어 두 개만 교체**된 거의 축자적 일치로, 기존 사례들(헤드라인 스켈레톤, 디스클로저 메커니즘 등)보다 더 좁은 수렴이다. **추가로 새로운 층위를 하나 더 확인**했다 — b↔c의 히어로 그리드 비율(`col-span-7`/`col-span-5`/`col-span-12`) 독립 수렴은 **카피가 아니라 매크로 그리드 레이아웃 자체**의 수렴으로, 지금까지 이 계보가 다룬 층위(헤드라인 동사·디스클로저 카피·CTA 오프너 등 전부 문구 층위)보다 한 단계 더 구조적인 층위다.

```
node -e "import('./scripts/design-loop.mjs').then(m=>m.appendLedger({round:'auto-landing-r32',variant:'multi',delta:'Fifth independent reproduction of the device-level-anti-convergence-does-not-reach-copy-layer finding (after r28/c, r29 tie-break, r30, r31), and the closest textual match on record: candidates a and c (fully isolated agents, no shared context) wrote near-verbatim sentences differing by exactly two synonym swaps (\"Each card carries its own evidence.\" / \"Every card carries its own proof.\") in the same structural slot (product-preview section subhead). This round also surfaces a NEW convergence layer not previously catalogued at this lineage: candidates b and c independently produced an identical hero grid-column skeleton (headline col-span-7 + proof-card col-span-5 on one row, device panel col-span-12 full-width below) despite having completely different assigned devices (chord diagram vs icon array) and no shared macro-skeleton assignment -- i.e. assignment-level anti-convergence measures that target copy and visualization-device choice do not reach macro grid-proportion choices either. Neither convergence affected judging (lens3 used them as a tie-break-adjacent factor between a/b/c but did not treat either pair as a rule violation).',evidence:'lens3: \"a/ProductPreview.tsx:109 Each card carries its own evidence. vs c/ProductPreview.tsx:26 Every card carries its own proof. -- identical sentence skeleton... about as close to verbatim as two independently-built candidates get without being identical\" + \"b Hero.tsx:21-113 lg:col-span-7/lg:col-span-5/lg:col-span-12 vs c Hero.tsx:63/95/133 col-span-7/col-span-5/col-span-12\"',judge_votes:{lens1:'n/a',lens2:'n/a',lens3:'observation-not-ranking'},confidence:'high',level:'L3',status:'provisional',supersedes:'auto-landing-r31/multi'},'vault/00-principles/landing-deltas-provisional.jsonl'))"
```

**질문 큐**: `questions-queue.md` Q60에 "다섯 번째 재현" 절 추가(위 두 수렴 — 축자적 근접 카피 + 신규 발견된 그리드-비율 층위) — 새 Q 번호 생성 없이 기존 Q60 계보에 귀속(동일 메커니즘의 연속 재현이므로).

## 7. 기록 + 커밋

ledger entry: `target:'landing', round:'auto-landing-r32', winner:'c', no_winner:false`. `variety` (c, `catalog-variety.mjs readWork` 실측): `{theme:'light', accent:'lime', face:'pretendard'}` — face는 디스플레이 활자 미사용이라 `pretendard`로 읽힘(유효한 선택, §2 참조).

불변식 확인: 정본 2개(`dash-brief-v3.md`·`design-principles.md`) 무변경, `page-brief-core.md`·`page-brief-repo.md`·`curation-criteria.md` 무변경(append-only jsonl·md 추가 절만 변경), `/dash` 갤러리·`/v1~v5` 무변경, main 커밋 없음(전부 `evolve/dash`).
