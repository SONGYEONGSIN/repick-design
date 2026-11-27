# DECISION — auto-dash-r62 (target: dash)

## 0. 라운드 수 확정 — 맥락

이 실행은 무인 스케줄 작업의 지시로 "`dash-evolve` 라운드를 2회 연속 수행"하라는 요청을 받았다. 단, `scripts/round-budget.mjs "2"` 실행 결과는 **1**이었다(`node scripts/round-budget.mjs --explain "2"` → `"미채움 0종 — N≥2 의 근거(커버리지)가 없다"`). `app/src/app/dash-evolve/r62`는 이 실행의 **첫 번째 외부 반복**(바깥 루프의 1/2)이며, 그 안에서 스킬이 규정한 내부 라운드 수는 1이다 — 스킬 §0-0-1이 정확히 예정한 동작이다(호출자가 더 준 값을 스크립트가 깎으면 그 사실을 이 절에 적는다).

**선행 사실(이 실행의 앞선 시도, 참고용)**: 이 실행에서 동일 바깥 루프의 더 앞선 두 시도(`auto-dash-r59`, `auto-dash-r60`, `auto-dash-r61`, `auto-native-r57`)는 **서브에이전트 세션이 `Agent` 도구 유무를 `ToolSearch`로(잘못) 확인해 "도구 없음"으로 오판 → no-round 종료**로 끝났다. 이번 라운드(`r62`)는 **오케스트레이팅 세션 본인**이 `Agent` 도구를 직접 보유·사용해 §0-0부터 정상 완주한 첫 번째 실행이다 — 중첩 서브에이전트는 자신의 하위 서브에이전트를 스폰할 수 없는 이 하네스의 제약이 그 혼동의 실제 원인이었음을 직접 호출로 재확인했다(subagent_type 어느 것이든 "일반" 서브에이전트에서 `Agent` 도구는 "No such tool available"로 명시 거부됨, `ToolSearch` 미스가 아니라 하네스 수준의 명시적 부재).

## 0-0. 서브에이전트 가용성

오케스트레이터(이 세션) 자신이 `Agent` 도구를 보유 — 이 라운드 내내 designer 3개·judge 3개를 전부 실제로 병렬 스폰해 완주했다(아래 §2·§4). no-round 조건 미해당.

## 0-1. 타깃 선택

```
IS_NATIVE_DAY = (UTC 요일 === 1 ? 1 : 0) → 0 (오늘은 일요일)
미채움 PAGE_TYPES 조회 → 0종 (18/18 전부 카탈로그에 있음)
TARGET = ['dash','landing','native'] 균등 난수 → dash
```

재배정 큐(`reassign-queue.md`) 확인: `target:dash`·`target:landing` 모두 **대기 중 없음**(이 라운드 시작 시점) — 이번 라운드는 고정 배정 없이 3후보 전부 자유 탐색.

라운드 번호: `vault/30-ledger/auto-ledger.jsonl`에서 `target:dash` 최대 round 번호 +1 = **62** (직전 dash 엔트리는 가짜 "Agent 도구 없음" no-round 3건: r59/r60/r61 — 이들도 라운드 번호를 소비했으므로 그 다음 번호가 r62).

run id: `auto-dash-r62`. run dir: `vault/20-generations/2026-11-15-auto-dash-r62/`.

## 1. RETRIEVE — 읽은 것

- `dash-brief-v3.md` 전문, `page-brief-core.md` 전문, `page-brief-repo.md` 전문, `reassign-queue.md`(대기 중 없음 확인), `curation-criteria.md` 전문.
- `dash-deltas-provisional.jsonl` 최근분(격리 delta) — 선택→다중위젯 동기화 티어링(전면재계산 < 단일축 부분재계산 < 다축 독립 스코프) delta를 designer 프롬프트에 직접 반영.
- `auto-ledger.jsonl`의 `target:dash` 최근 5개: r57(c, "Ridgehaul", dark/violet/display-mono) · r58(c, "Pulseband", dark/rose/mono) · r59/r60/r61(전부 가짜 no-round, variety null).
- `scripts/catalog-variety.mjs` 실행 → 65작품: theme dark 36/light 29, accent 상위 amber8·teal8·violet-hex7, face pretendard29(기본)·mono13·grotesk12·wide11.
- **다양성 금지 축 도출**: 최근 2승자(r57·r58)가 전부 dark+display-mono였으므로 이번 라운드는 dark 과다·mono 금지를 designer 배정에 반영. accent는 amber/teal/violet-hex/violet/rose(상위+최근 사용)를 피하고 orange/green/sky처럼 저사용 축을 배정.
- **매크로-골격 금지**: 최근 dash 라운드들(`r55`~`r58`)의 매크로 버킷을 조사 — 트레이딩터미널 3페인, 노드그래프+디테일("Nodewatch"), 선버스트+계층리스트("Outlay"), CI/CD 파이프라인맵+테이블("Trestle"), 박스플롯+피드("Ridgehaul" ×2), 레일없는 티커+슬로프차트("Arbor")를 전부 금지 목록으로 3 designer에게 명시.

## 2. GENERATE — 3병렬 (Agent 도구로 실제 스폰)

조립한 브리프 전문(정본 발췌 본문 + 기계검증 규칙 + 영문카피 명문화 + 그리드크래프트 규칙 + 레포 관례)을 각 designer에게 직접 전달(경로만 주지 않음).

| 후보 | 배정 매크로 골격 | 테마/액센트/활자 | 산출 |
|---|---|---|---|
| a | 캘린더/보드 중심 (금지 축 회피 목록에 신규 추가) | light / orange / `--font-display-wide` | "Stagebook" — 이벤트 베뉴 부킹 캘린더(월/주/아젠다 3뷰) |
| b | 히어로 숫자 + 단일 지배 시각화, 차트타입은 treemap/ranked-bar로 한정(line·candlestick·boxplot·slope·sunburst·node-graph 금지) | light / green / `--font-display-grotesk` | "Dockwise" — 창고 풀필먼트 운영(랭크드 바 + 핀 상세카드) |
| c | 마스터-디테일 — 단, 선택 파급은 다축 독립 스코프 티어 요구(단일 재구축 금지) | dark(자유) / sky / mono 금지(최근 2라운드 연속 사용) → grotesk(워드마크만)+Pretendard | "Clearcall" — 매출 콜 인텔리전스(콜 레일+스포트라이트+코칭 다이제스트) |

세 designer는 서로 서로의 폴더를 열지 않았음(각자 보고에서 확인). 각 `candidates/<v>.md`에 "브리프에 없던 것" 절 포함 작성 완료.

**동결+해시**: freeze SHA-1 = `6af45ebb73561d472df2f876ebd57fd992aa1ce3` (3후보 전체 `.tsx`/`.ts` 이어붙임, 게이트 직전 기록).

## 3. HARD GATE

dev 서버 3100 기동(.next 캐시 문제 없음, 정상 기동), `node scripts/gate.mjs --target web --routes /dash-evolve/r62/<v>` 개별 실행.

### a (Stagebook) — **탈락**
1차: `console` 13건 하이드레이션 불일치 (`Intl.NumberFormat` compact notation의 trailing-zero 서버/클라이언트 ICU 불일치, `November 3, 1 booking, $480` vs `$480.0`). 나머지 9게이트 전부 클린(a11y 100, perf 72).
1-fix: `n < 1000 ? 일반포맷 : compact포맷` 래퍼로 수정(오진단 — "1000 미만이라 compact가 불필요"). 재게이트 **재실패** — 동일 결함군이 1000 이상 값(`$7K` vs `$7.0K`)에서 재현. 스킬 §3 "재실패 시 탈락" 적용. **판정 패널 미진입.**
사후 확인(c의 1-fix에서): 진짜 원인은 크기와 무관하게 `trailingZeroDisplay`가 미지정이라 ICU 구현에 맡겨진 것 — a는 이미 1-fix를 소진해 적용하지 않음. [[reassign-queue]] #23에 정확한 처방으로 등재(§6 참조).

### b (Dockwise) — **생존**
1차부터 10/10 클린 (a11y 100, perf 89, console 메시지 90건·결함 0). 1-fix 불요.

### c (Clearcall) — **생존 (1-fix)**
1차: `console` 13건, 동일 결함군(`$86K` vs `$86.0K`, compact 통화 포매터). 나머지 9게이트 클린(a11y 100, perf 79).
1-fix: `trailingZeroDisplay: "stripIfInteger"`를 compact 포매터에 명시 추가(값·의미 변경 없음, 규칙위반 해소에 한정). 재게이트 **10/10 클린**(console 메시지 103건·결함 0, perf 91).

**생존 2개(b, c) → §4 정상 진입(단독 심사 아님).**

상세 게이트 표: `SCORES.md`.

## 4. JUDGE 패널 — 3렌즈 블라인드, b/c 비교 (a는 탈락으로 비교 대상 제외)

스크린샷: `capture-shots.mjs`로 b/c 각 16프레임(4폭×4스크롤) 전수 캡처, blank 0건. judge에게는 각 4프레임(1440-top, 1440-s70, 390-top, 390-s100) 제공.

| 렌즈 | 1위 | 2위 | 핵심 근거 |
|---|---|---|---|
| 1 (브리프 준수) | **c** | b | c의 `pinnedId`/`hoveredTopic` 두 축이 코드 추적으로 완전히 분리 배선됨을 확인(SpotlightCard만 소비, CoachingDigest는 절대 안 받음) + 44px 헤더 리터럴 준수. b는 동일 티어(핀/호버)를 달성했으나 헤더 컨트롤 실측이 44px에 못 미치고(28~32px), 워크스페이스 스위처 셰브론·알림벨이 시각적으로만 있고 미배선(c의 "Log call" 버튼도 동일 결함 — 2/2 비차별적, Q76 등재). |
| 2 (상용 완성도) | **c** | b | c의 카피·데이터 서사 일관성(콜 제목↔딜가치↔스코어↔감정이 전부 서로 부합, 구체적 인용구)과 단일 액센트 절제가 b보다 우위. b도 상용급이나 더 일반적("Staging"/"Overflow" 등)이고 모바일 테이블이 데스크톱의 축소 느낌. |
| 3 (구조 차별성) | **b** | c | b의 랭크드-바+핀 매크로 골격이 기존 카탈로그 버킷 목록에 없는 신규 조합(단, 히어로 섹션이 "히어로+인라인스탯" 버킷과 일부 겹침 인정). c는 스킬 자체가 비신규로 전제하는 마스터-디테일이라 이 렌즈에서 천장이 낮음 — 다만 다축 독립 스코프를 코드 추적으로 "최상위 티어"로 확인(전면재계산 아님, 부분재계산도 아님).

**집계: 1위 표 c 2(렌즈1·2) vs b 1(렌즈3) → 2:1 다수결, 완전동률 아님. 승자 = c.**

렌즈 불일치는 [[curation-criteria]] "완성도 다수결 우선" 원칙의 재확인 사례로 처리(문구 변경 없음, 질문 추가 없음 — 이미 기존 원칙이 설명하는 범위 안의 통상적 2:1).

Q76 신규 등재(§위 참조): 두 생존 후보 모두 "시각적으로만 상호작용 가능해 보이는 미배선 컨트롤" 1개씩 — 비차별적이라 다수결에 영향 없음, 기록만.

판정 전문은 각 judge 보고 원문 기준(이 문서에 요약 인용) — 세 judge 모두 "완료 체크리스트"(랭킹/사유/근거/미확인범위) 전부 충족, 재개 불요(1회차에 완결).

## 5. LEARN — 격리 적재

`dash-deltas-provisional.jsonl`에 2건 append:
1. **(판정 사유 기반, L1)** 마스터-디테일이 차별성 렌즈에서 명시적으로 신규성 0 처분을 받고도, 코드 추적으로 검증된 다축 독립 스코프 파급 + 상시노출 핵심값 + 서사 일관성만으로 2:1 승리 — "완성도 다수결 우선" 원칙의 가장 강한 재확인 사례(신규성이 "낮음"이 아니라 "0"으로 명시된 채 승리).
2. **(하드게이트 기계검증 기반, L2 — 재현 임계 대기 없이 즉시 승격, [[curation-criteria]] Q29 판정과 동일 근거)** compact-notation `Intl.NumberFormat`의 trailing-zero 서버/클라이언트 ICU 불일치 — 같은 라운드에서 서로 다른 두 designer 인스턴스가 독립적으로 재현, 처방(`trailingZeroDisplay: "stripIfInteger"`) 1회 적용으로 완전 해소 확인. a는 오진단으로 탈락했고 재배정 큐에 정확한 처방을 남겨 다음 시도가 첫 수정에서 성공하도록 함.

## 6. 지식 정제 게이트

- 클러스터링: 이번 2건 모두 기존 L2/L3 원칙(선택파급 티어링, 완성도 다수결 우선)과 **무충돌** — 보강/재확인이지 모순이 아니다.
- 레벨 재책정: delta #2는 §5에서 이미 L2로 기록(기계검증 즉시승격 규율 적용, 재현 2라운드 대기 불필요).
- 충돌 쌍: 없음.
- 질문 강제 생성: **Q76** (questions-queue.md에 신규 등재) — 시각적으로만 인터랙티브해 보이는 미배선 컨트롤이 하드게이트·judge 다수결 모두에서 못 잡히는 사각. meta-기준(curation-criteria)으로 즉시 정당화 불가(기계검증 설계가 오탐율 미검증) → 큐에 유보.
- 재배정 큐: **#23 "Stagebook"** 신규 등재(§3 참조) — 탈락 사유가 형태가 아니라 순수 기계 결함(이제는 정확히 진단됨)이므로 재배정 대상.

## 7. 기록 + 커밋

- `auto-ledger.jsonl` append: `target:'dash', round:'auto-dash-r62', winner:'c', no_winner:false, hardgate:{...}, judges:{lens1:'c',lens2:'c',lens3:'b'}, variety:{theme:'dark',accent:'sky',face:'grotesk'}` (아래 실제 커맨드로 기록).
- `vault/index.md` "세대 기록"에 `[[20-generations/2026-11-15-auto-dash-r62/DECISION|auto-dash-r62]]` 등재.
- 정본 2종(`dash-brief-v3.md`, `design-principles.md`) + `page-brief-core.md` + 타입 프로파일 + `/dash` 갤러리 + `/v1~v5` **무변경** 확인(이번 라운드는 `app/src/app/dash-evolve/r62/*`, `vault/00-principles/{dash-deltas-provisional.jsonl(append만),reassign-queue.md,questions-queue.md}`, `vault/20-generations/2026-11-15-auto-dash-r62/*`, `vault/30-ledger/auto-ledger.jsonl(append만)`, `vault/index.md`만 수정).
- `git commit` → `evolve/dash` → push.
