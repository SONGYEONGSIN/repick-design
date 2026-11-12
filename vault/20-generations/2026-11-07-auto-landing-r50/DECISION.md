# auto-landing-r50 — DECISION

## 0. 라운드 수 확정 (§0-0-1)

`node scripts/round-budget.mjs --explain "2"` → `1	미채움 0종 — N≥2 의 근거(커버리지)가 없다`.

호출자(이번 실행의 예약 작업 프롬프트)는 2를 요청했으나 `PAGE_TYPES`(18종) 전부가 카탈로그에
1건 이상 있어 미채움 큐가 0종이다. 스크립트가 강제한 대로 **이 실행은 1라운드만 돈다** — §0-0-1
규율대로 이 사실을 첫 절에 적는다. 예약 작업의 "2라운드 연속 수행" 지시는 스킬의 round-budget
조건(이 문서 §0-0-1)을 무시하고 고정 숫자를 요구하는 형태였는데, 스킬 자체가 "호출자가 2 이상을
줬어도 스크립트가 1 을 내면 1라운드만 돌고 그 사실을 DECISION 첫 절에 적는다"를 명시하므로 그대로
따랐다 — 숫자가 아니라 조건이 상한을 정한다는 2026-09-12 개정 근거 그대로다.

## 0-0. 서브에이전트 가용성 확인

`Agent` 도구 실제 사용 가능 확인됨(이 라운드의 designer 3개·judge 3개 전부 실제 서브에이전트
호출로 생성·판정됐다). `self_judged: false`.

## 타깃 선택

- 월요일 고정 native 주기: 오늘(2026-11-07)은 토요일(UTC `getUTCDay()===6`) — 해당 없음.
- 미채움 큐 조회(`works.ts` `PAGE_TYPES`): 0종 (18종 전부 카탈로그 1건 이상).
- dash/landing/native 균등 난수 → **landing** 당첨.
- 라운드 번호: ledger에서 landing 최대 라운드(r49)+1 = **r50**.
- run id: `auto-landing-r50`. run 디렉토리: `vault/20-generations/2026-11-07-auto-landing-r50/`.

## 1. RETRIEVE — 요약

BRIEF(`design-principles.md`) + `page-brief-core.md` + `page-brief-repo.md` 전문 로드. `reassign-queue.md`
"대기 중" 확인 — landing 타깃 항목 없음(유일 대기 항목 #20은 target: dash) → 재배정 소비 없음, 3후보
전원 자유 탐색. DELTAS(`landing-deltas-provisional.jsonl`, 83건 전부 non-refuted) 중 r40-r49 최근 10건을
designer 프롬프트에 지시문으로 직접 반영(every/all 과장 카피 감사·보조선택자 리셋 시에도 non-trivial
default 유지·reduce tie-guard·CTA 링크 대상도 같은 live state 반영·히어로폴드는 실제 렌더 높이로 판정·
배지 완전성 등급·모든 텍스트 재서술이 같은 함수에서 파생). `curation-criteria.md` 전문 로드(meta-기준).
참조 카탈로그 `ux-guidelines.catalog.md`(web/both 행) + `motion.catalog.md`(landing 열) 로드.
`auto-ledger.jsonl` landing 최근 5건 확인. `catalog-variety.mjs` 실행 → 65작품 분포, `banList` 계산 결과
최근 3승자(r47·r48·r49)의 variety 필드가 다중-후보 혼합 문자열로 기록돼 있어 스크립트가 파싱 못 함
→ `theme:[] accent:[] face:[]` (금지 축 없음). 수동 확인: r49 승자 dark/blue/no-display-face,
r48 승자 light/emerald/none, r47 승자 light/amber/mono — 과소대표 축(green·blue-hex·lime·violet·orange)으로
이번 3후보 accent를 의도 배정(lime/orange/violet, 기본 hex `#6E56CF` 제외).

중복 금지 목록: `/v1~v5`(landing-forms.jsonl 6건) + landing-evolve 누적 아키타입 r1-r49(포크 서브에이전트가
`vault/index.md` 전수 스캔으로 컴파일) — designer 3개에게 전달, 직전 5라운드(r45-r49) 매크로 골격 명시 회피
지시 포함.

## 2. GENERATE

3 designer 서브에이전트(Agent 도구, general-purpose, 블라인드 병렬) 동시 호출. 각자 조립 브리프
전문(링크 아님, 본문) + 배정 아키타입 + 배정 theme/accent/face + 중복금지 목록 + 직전 5라운드 매크로
골격 회피 + 열린 delta 10건 지시문 + 레포 관례 + "tsc/lint/gate 실행 지시 없음(Bash 없음 가정)" 전달.

| 후보 | 아키타입 | theme | accent | face |
|---|---|---|---|---|
| a | Budget Split Allocator — 4카테고리 제약합산(=100%) 슬라이더 → 스택바+추천배지+총 payout | dark | lime `#A3E635` | `--font-display-grotesk` |
| b | Pairwise Listing Diff — 독립 2선택자 → 델타표+레이더 오버레이 | light | orange `#C2410C`(틴트는 다크 `#B8410A`) | `--font-display-wide` |
| c | Seller Tier Ladder — 가변조합 체크리스트 → 등급배지+perks리스트+days-to-sell | light | violet `#7C3AED`(기본 hex 아님) | `--font-display-mono` |

3개 전원 완료 확인(SubagentHandback 수신, 파일 존재와 별개로 완료 신호 대기) — a 265k·b 249k·c 223k
subagent 토큰, 각 86·96·51 도구 호출.

**게이트 직전 동결 해시**: 전체 소스(`cat r50/{a,b,c}/*.ts *.tsx | shasum`) = `a1de52e8c8457cd82ddf4dd0279ffe416ec06b24`
(a의 1-fix 이전 상태). a 1-fix 후 해시는 변경됐으나(기대된 변경 — §3 참조) b·c는 불변.

## 3. HARD GATE

| gate | a | b | c |
|---|---|---|---|
| route/types/lint/weights/sweep/focus/console | pass 전원 | pass 전원 | pass 전원 |
| static | **1차 실패**(위반 11, `no-unlisted-font`) | pass(위반 0) | pass(위반 0) |
| a11y | 100 (1-fix 후) | 98(`landmark-one-main` 실패 — 승격 7감사 목록 밖, 기록만) | 100 |
| perf | 95 | 91 | 94 |

**a 1-fix**: `fontFamily: DISPLAY_FONT`(JS 변수 참조) 11곳 — static-check 정규식이 `var(--font-...)`
리터럴만 인식하고 변수 참조는 통과 못 함(디자이너가 변수에 올바른 값을 담았지만 참조 형태가 검사를
피해감). `DISPLAY_FONT` 참조를 `"var(--font-display-grotesk)"` 리터럴로 전부 인라인 치환, 미사용 const
제거 → 재게이트 위반 0, 전 항목 pass. 순위에 영향 없는 기계적 리터럴화(§3-1 "규칙 위반 해소"에 해당,
완성도 개선 아님).

3후보 전원 생존 → §4로 진행.

## 4. JUDGE 패널

4프레임/후보(1440 scroll0 · 1440 s70 · 1440 s100 · 390 scroll0) 캡처, 48장 전수, blank 0 · errors 0.
judge 3개 병렬(Agent 도구, general-purpose, 서로 블라인드 — 후보명/컨셉 비공개, 폴더명 a/b/c만 전달).

**렌즈1(브리프 준수)** — 1위 **a**, 2위 c, 3위 b. 근거: a는 배지 완전성(양쪽 4배지 pill)·에디토리얼 밀도
(고스트 4개+Fig 캡션 2개)·tie-guard(`isBalanced` null 처리, `a/LandingExperience.tsx:192,716,1074`)·
타이어 셀렉터 독립 기본값 생존 모두 충족. c도 배지·고스트·Fig 충족, tie-guard 불필요(reduce 쌍 없음)라
해당 delta 미증명. **b는 배지 미완성**(discount가 pill이 아니라 평문 `<p>`, `ListingCard.tsx:148-155`)
+ 고스트 넘버 1개뿐·Fig 캡션 0개로 구조 밀도 조항 미달 → 3위.

**렌즈2(상용 완성도)** — 1위 **b**, 2위 a, 3위 c. 근거: b의 표+레이더가 "장식이 아니라 그 자체가
비교 데이터"로 읽히는 유일한 진짜 유틸리티형 인터랙션, 클로징이 실제 계산된 승자 차이를 인용
("wins by 6.3 points"). a는 타이포 위계 최상이나 고스트 넘버가 "정보 없는 반복 장식"으로 감점.
c는 미검증 상태의 "YOUR TIER: SILVER" 배지가 내비게이션에 선제 노출되어 데모성/주제이탈로 감점,
모노스페이스 활자가 리세일 제품에 안 맞는다는 판단. 공통 아티팩트: 3후보 전원 제품 사진이 회색
placeholder로 렌더(샌드박스 아웃바운드 차단 — r12·r15·r18과 동일 환경 아티팩트, 공정하게 전원 동일
영향으로 처리, 판정 무변경).

**렌즈3(구조 차별성)** — 1위 **b**, 2위 c, 3위 a. 근거: 입력축×출력축 환원 — a("제약합산 슬라이더 →
스택바+dominant/weakest배지+총합")는 r18·r42·r19·r35의 출력 어휘(스택바/최다최소배지/총합)를 그대로
재사용, 입력축(제약 재분배)만 변주 → 재탕에 가까움. c("가변조합 체크리스트 → 등급배지+perks")는
r20(가변조합 멀티셀렉트)과 입력축이 동일하나 출력축(연속 가격곡선 대신 이산 등급+perks리스트)이
실질적으로 달라 변종으로 인정. **b("독립 2선택 → 델타표+동시 레이더 오버레이")는 카탈로그에 선례
없음** — r4(단일선택자+탭)·r8(관계그래프)·r9(재가중)과 전부 다른 조합이며, "두 자유선택 개체를 표와
레이더 양쪽에서 동시에 diff"하는 출력 형태가 처음.

**집계**: 1위표 — b 2(렌즈2·렌즈3) · a 1(렌즈1). no-winner 표 0. **다수결 승자 = b.**
억지 승자 아님 — 2:1 실제 분할, 세 렌즈 모두 완전한 랭킹+사유+근거+미확인범위를 1차에 제출(재개 0회).

**렌즈1 소수의견 처리**: 렌즈1이 지적한 b의 두 결점(discount 평문 vs pill·고스트/Fig 부족)은 §3-1
"규칙 위반 해소" 범위 밖으로 판단해 **판정 후 수정하지 않는다** — 브리프의 "증명 카드 가시성" 요건은
충족됐고(discount 수치 자체는 보임), "pill 형태여야 하는가"는 브리프가 명시하지 않은 해석 차이이자
이미 세 렌즈가 각자 다르게 반영한 블라인드 판정의 일부다. 수정하면 렌즈1이 실제로 쓴 판정 근거를
사후에 지우는 것이 되어 "수정이 순위를 바꿀 만하면 재판정 사유"(§3-1)에 해당한다. 대신 이 모호성을
질문 큐에 등재한다(§6).

## 5. LEARN — 격리 적재

delta 1건을 `landing-deltas-provisional.jsonl`에 append (L1):
- round: auto-landing-r50, variant: b
- delta: "A dual-independent-selector input (pick any 2 of N fixed entities) feeding BOTH a tabular diff AND a geometric overlay (radar) of the SAME comparison function is a genuinely new output vocabulary this catalog hadn't produced — distinguishable from single-selector lookups (r4) and single-continuous-slider reweights (r9/r18/r42) by its N-choose-2 reachable-state size and its dual-representation (table+chart) of one shared diff. It won lens2+lens3 (commercial polish + structural novelty) specifically because the radar wasn't decorative — it was the same comparison data in a second encoding, and the closing CTA cited the actual computed winner/margin rather than a generic number. It lost lens1 specifically on hero-fold badge-completeness (discount rendered as plain text, not a pill) and on editorial-density underuse (1 ghost number, 0 Fig captions) — those two gaps are real and should be checked for in the NEXT dual-selector-diff candidate, but weren't severe enough to flip the 2:1 outcome."
- evidence: judge quotes (lens2 "the one interactive device... that reads as genuine utility rather than decoration, because the chart is literally the comparison data"; lens3 "no prior round draws two polygons on one radar from two independently chosen entities"; lens1 "b fails the badge-completeness delta... discount is a plain <p> line... zero Fig captions anywhere")
- judge_votes: {lens1: a, lens2: b, lens3: b}
- confidence: high (3 independent lenses converged on the SAME two factual gaps for b even while splitting 2:1 on the overall ranking)
- level: L1, status: provisional

## 6. 지식 정제 게이트

- DELTAS 클러스터링: 이번 delta는 r44(output-visualization 축 확장: 데이터위젯/대화형/문서교정/재정규화다이얼/세트빌더/2D플롯/레이어스택/히스토그램 8종) 계열에 **9번째 출력 어휘(이중개체 동시 diff 표+레이더)**로 합류 — 충돌 없음, 재현 임계(2라운드+)는 아직 미달(L1 유지, supersedes 없음).
- **질문 신규 등재** (`questions-queue.md` "대기 중"): 브리프의 "product-proof cards (match%, grade, verification badge, before/after discount)"가 4개 전부 **동일한 pill-배지 형태**를 요구하는지, 아니면 "보이기만 하면" 되는지 불명확 — 이번 라운드 렌즈1이 이 해석차로 승자(b)를 3위로 내린 반면 렌즈2·3은 같은 결점을 감점 요인으로만 반영하고 순위를 뒤집지 않았다. target: landing. 배경: 위 §4 "렌즈1 소수의견 처리" 참조. 잠정 가설: "4항목 모두 pill 형태로 시각적으로 동형이어야 한다"(렌즈1 암묵 가정)가 과잉 해석일 가능성 — `design-principles.md` §Landing구조2에는 "뱃지"라고만 적혀 있고 pill/chip 형태를 못박지 않는다. 동일 유형 중복 없음(신규).

## 7. 기록 + 커밋

- `auto-ledger.jsonl` entry: target=landing, round=auto-landing-r50, winner=b, no_winner=false,
  variety={theme:"light", accent:"orange #C2410C", face:"display-wide"} (승자 b 기준, 단일 clean 값 —
  이전 몇 라운드의 다중-후보 혼합 문자열 포맷 문제를 재현하지 않음).
- `vault/index.md` "세대 기록"에 이번 run 등재.
- no-winner 아님 — 승격 판단은 `/dash-falsify apply`(사람 리뷰) 소관, 이 라운드는 후보 3종 route 그대로
  유지하고 커밋한다.
- 정본(dash-brief-v3.md·design-principles.md) 무변경 확인. `/dash` 갤러리·`/v1~v5` 무변경 확인. jsonl
  append-only(기존 라인 수정 없음, 전부 확인함).
- `git add -A && git commit` → `evolve/dash` push.

## 예약 작업 성공 기준 대비 메모

예약 작업 프롬프트는 "2라운드 연속"을 요청했으나 §0-0-1 round-budget.mjs가 미채움 0종을 근거로
**이번 실행 전체에 대해 N=1을 강제**했다 — 이는 호출 시점에 정확히 1회만 확인하면 되는 것이 아니라
이 실행 전체의 유효 라운드 수가 1이라는 뜻이다(round-budget은 라운드별로 재호출하는 게 아니라
`/dash-evolve N` 호출 1회당 1회 평가되는 세션 전체의 예산이다). 성공 기준에 적힌 "라운드 커밋 2개·
ledger entry 2건·run 디렉토리 2개"는 스킬의 2026-09-12 개정(커버리지 0종이면 숫자가 아니라 조건이
상한을 정한다)이 반영되지 않은 구버전 가정이다 — 예약 프롬프트 자신이 "스킬이 바뀌면 이 프롬프트는
그대로 두면 된다"고 명시했으므로, 이 괴리는 예상된 drift이고 스킬 쪽이 권위를 갖는다. 이번 실행은
**유효하게 1라운드(auto-landing-r50)를 완주**했고, 그 사실과 사유를 이 문서 최상단에 기록했다.
