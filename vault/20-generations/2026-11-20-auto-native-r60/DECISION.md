# auto-native-r60 — DECISION

## 0. Round budget / target selection (스크립트 산출, 산문 아님)
- `node scripts/round-budget.mjs --explain 2` → `1\t미채움 0종 — N≥2 의 근거(커버리지)가 없다`. `app/src/lib/works.ts` `PAGE_TYPES` 18종 전부 채워짐(unfilled=[]). 호출자가 2를 요청했지만 스크립트가 1을 반환 → **이번 호출은 1라운드만 돈다.** (스케줄된 외부 작업이 "2연속 라운드"를 요청했으나, §0-0-1 규칙대로 산문이 아니라 스크립트 산출을 따른다 — `auto-native-r57`/`r58`/`r59` 노트와 동일한 기존 처분.)
- 타깃 선택 스크립트(§0, `works.ts` 미채움 조회 → 전부 채워져 있어 `[dash,landing,native]` 균등 난수): 오늘(2026-11-20, 금요일, UTC getUTCDay=5)은 월요일이 아니므로 native 주간 고정 라운드가 아니라 **순수 난수**로 `native`가 뽑혔다.
- 라운드 번호: `auto-ledger.jsonl`에서 target=native 최대 라운드 59 + 1 = **r60**.
- `reassign-queue.md`에 target:native "대기 중" 항목 없음 — 3후보 전부 자유 탐색.
- Agent 도구 가용성(§0-0) 확인됨 — 3개 독립 designer, 3개 독립 judge 전부 `general-purpose` Agent(이 환경에 전용 `designer`/`comparator` 정의 없음, `auto-native-r58`/`r59`와 동일 대체). self_judged 아님.

## 1. RETRIEVE
포크 서브에이전트로 native 타깃 전체 컨텍스트(GENERATION.md·tokens.ts·page-brief-core 발췌·native-deltas-provisional.jsonl 비반증/최신체인 요약·reassign-queue·questions-queue·curation-criteria·ux-guidelines native/both 섹션·catalog-variety·최근 5라운드 이력·기존 아키타입 전체 목록)를 조립해 ~3000단어 브리프로 압축. native는 고정 DNA(라이트/인디고 #4f46e5/시스템 폰트)라 변형 금지 — variety 축 없음.

## 2. GENERATE — 도메인 배정 + 매크로버킷 사전 확인
`grep -rliE`로 후보 도메인 키워드(customs/declaration, age-verif/restricted-item, evidence-upload/dispute-evidence 등)를 `native/src/evolve/`·`screens.ts`·`screens.json` 전체에 대조 — 전부 0건, 신규 도메인 확정.

| 후보 | 도메인 | 밴드독트린 배정 형태 | 매크로형 |
|---|---|---|---|
| a | Customs Declaration Form (국제배송 세관신고) | 1. Blocked-workflow state machine | 다단계 폼 위저드 |
| b | Age/ID Verification Gate (연령제한 품목 구매 전 신원확인) | no band — 단일 게이트 | 단일 확인 화면, 밴드 없음 |
| c | Dispute Evidence Checklist (분쟁 증거 첨부 체크리스트) | 3. Selection-count-derived contextual bar | FlatList 체크리스트 |

3개 서로 다른 매크로형으로 사전 배정해 2파전 버킷 충돌을 피함. 3 designer 블라인드 병렬 — 서로의 산출물 비공개. "브리프에 없던 것" 절 전원 기록(`candidates/{a,b,c}.md`).

## 3. HARD GATE
소스 해시(전 후보 .tsx+.ts 연결 SHA-1): `34f78e6529b67de243d1aab9cda1126090196b1e`

`PW_CHROMIUM_PATH=/opt/pw-browsers/chromium node scripts/gate.mjs --target native --screens evolve-r60-a evolve-r60-b evolve-r60-c`

**12/12 전원 1차 통과, 1-fix 불요, blockedBy 없음.** (환경 고유 사전조치, SKILL 규칙 아님: 이 컨테이너에서 `native/node_modules` 미설치 상태라 `npm install` 1회 선행, Playwright 브라우저는 `/opt/pw-browsers/chromium`에 사전설치되어 있어 `PW_CHROMIUM_PATH`로 지정 — 레포 스크립트가 이미 이 env var를 지원함. `playwright install` 재실행은 환경 안내에 따라 생략.)

등록은 3후보 완료 확인 후 오케스트레이터가 `native/src/screens.ts`(import + `COMPONENTS["evolve-r60-<v>"]`)·`native/screens.json`(`check` 문자열)에 중앙 일괄 처리 — designer에게는 시키지 않음(동시 편집 충돌 회피).

## 4. JUDGE 패널 — 3렌즈 블라인드 병렬
스크린샷: Expo Web export+serve(8091)+playwright, 390/768px × 후보 3 = 6프레임, blank 없음(오케스트레이터 육안 확인).

| 렌즈 | 1위 | 2위 | 3위 |
|---|---|---|---|
| 렌즈1 (DNA/a11y 준수) | **a** | c | b |
| 렌즈2 (모바일 완성도) | **a** | b | c |
| 렌즈3 (아키타입 차별성) | **a** | b | c |

**집계: 3:0 만장일치 — 승자 a (Customs Declaration Form).** 완전동률 아님, tie-break 불요.

### 렌즈별 핵심 사유 (풀 판정문은 세션 로그, 요약만 보존)
- **렌즈1**: a는 명시 폰트웨이트 3종(400/500/700) 전부 확인, 하드코딩 hex 없음, 장식 아이콘을 `accessibilityElementsHidden`+`importantForAccessibility="no-hide-descendants"`로 명시적 은닉 — 3후보 중 a11y 방어가 가장 엄격. b는 명시 폰트웨이트가 사실상 2종(600/700)뿐이고 다수 텍스트가 암묵 기본값에 의존, 아이콘을 벡터 View 대신 유니코드 글리프(✓/✕)로 `<Text>`에 직접 넣어 포커스 가능 노드가 중복 선언될 위험, 포커스 숫자(`$184.00`)에 `tabular-nums` 누락(레포 관례 `PriceDetail.tsx` 대조) — 3건 모두 하드게이트 미검출. c는 둘 다 깔끔하나 장식 체크마크 서브뷰에 a11y 은닉 속성이 없어 a보다 근소 열세.
- **렌즈2**: a는 3개 상태(blocked/ready/done) 전부 실제 인터랙션으로 도달 가능, 완료 섹션 요약 접힘 등 진짜 상용급 폼 완성도. **b는 denied 분기가 코드·스타일 전부 갖췄지만 트리거 상수(`ageOnFile:25>=minAge:18`)가 항상 true라 실질 도달 불가.** **c는 Submit `Pressable`에 `onPress` 자체가 없어 활성화돼도 탭이 아무 효과 없음(pressed 스타일은 터치 자체로 발동해 "작동하는 척"함) — 가장 결정적인 완성도 결함.**
- **렌즈3**: 3매크로형(순차 블록 폼위저드 / 밴드없는 단일게이트 / 선택수기반 컨텍스트바) 실제로 구조적으로 구분됨, 2파전 충돌 없음. a가 3-상태 밴드를 가장 풍부하게 증명, b는 "밴드 없음" 의도를 가장 깔끔하게 실증, c는 형태는 맞으나 Submit 핸들러 누락으로 증명이 약함.

### §3-1 판정 후 수정 — 불요
승자 a에 대해 3렌즈 전원 하드룰 위반 0건(렌즈1의 "ORIGIN_OPTIONS가 data.ts 대신 컴포넌트 파일에 있다"는 트리비얼 노트일 뿐 DNA 위반 아님으로 명시). 재게이트 불요, 순위 재계산 불요.

### 비승자 결함 기록 (투명성 — reassign-queue/questions-queue 미등재)
b(denied 분기 도달불가)·c(Submit onPress 누락)는 둘 다 **하드게이트 12/12 클린을 통과한 순수 판정단계 패배**다. `auto-native-r58`/`r59`의 기존 처분과 동일하게, 이는 DNA/기계검증 규칙 위반이 아니라 완성도축 결함이므로 reassign-queue 대상이 아니고, 상충 delta 쌍도 meta-기준 정당화 불가 사례도 아니므로 questions-queue 신규 항목도 아니다. LEARN 절에서 재사용 가능한 교훈으로만 적재한다.

## 5. LEARN
아래 delta를 `native-deltas-provisional.jsonl`에 L1/provisional로 append (스크립트 실행 — 다음 절):
> 선언된 모든 상태(특히 밴드/CTA의 terminal 분기)가 실제 유저 인터랙션으로 도달 가능해야 한다. 코드가 상태별 스타일·카피를 전부 갖추고 있어도 트리거 핸들러나 게이팅 조건이 빠지면(`r60/b`: denied 분기가 `ageOnFile:25>=minAge:18`로 상수 고정되어 영구 도달불가 / `r60/c`: Submit `Pressable`에 `onPress` 자체가 없어 활성화돼도 무반응, pressed 스타일만 터치에 반응해 "작동하는 척"함) 4게이트(tsc/export/render/iframe) 전부를 통과한다 — 소스에서 상태 전이 경로를 직접 추적해야만 judge가 잡는다.

## 6. 지식 정제 게이트
전체 native DELTAS 재로드·클러스터링: 이 delta는 기존 어떤 delta의 "재현을 확장한다"는 주장을 하지 않는 **신규 관찰**(1라운드째)이므로 재현 임계(2라운드+) 미달 — L1 유지, 승격 보류. 충돌 쌍 없음, meta-기준으로 정당화 불가한 사례 없음 — questions-queue 신규 항목 불요.

## 7. 정본/불변식 확인
`native/GENERATION.md`·`native/src/tokens.ts`·전 웹 브리프·`/dash` 갤러리·`/v1~v5` 무변경. `native/src/screens.ts`+`screens.json`만 편집(표준 등록). `native-deltas-provisional.jsonl` append-only. main 커밋 없음, 전부 `evolve/dash`.

## 비고 — 이번 실행의 "2연속" 요청에 대해
외부 스케줄 프롬프트는 2라운드 연속 실행을 요청했지만, §0-0-1 스크립트가 N=1을 반환해 **이번 호출은 1라운드로 종료**한다. 이는 `auto-dash-r26`(2026-09-13)이 스크립트 산출을 무시하고 산문으로 "2라운드째"라 잘못 기록했던 실패를 반복하지 않기 위한 의도된 처분이며, `auto-native-r57`~`r59` 노트의 기존 선례와 동일하다.
