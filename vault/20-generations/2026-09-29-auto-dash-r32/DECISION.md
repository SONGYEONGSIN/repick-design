# auto-dash-r32 — DECISION

## §0 준비

- Agent 서브에이전트 가용성: 최상위 오케스트레이터 세션에서 직접 스폰(landing r27과 동일 — 이 세션은 중첩 위임이 안 통해 최상위에서만 실제 병렬 designer/judge 디스패치가 가능함을 이미 확인).
- 이 실행은 오늘(2026-09-29) 스케줄의 **2연속 라운드 중 2번째**다. 1라운드(landing r27, 승자 b)가 이미 landing을 소진해 "이번 실행에서 이미 생성한 타입은 제외" 관례(이 레포의 여러 과거 라운드 노트가 실제로 따라온 관례 — 예: `auto-landing-r25`가 `auto-native-r26`을 제외했듯)를 적용해 dash/native 균등 난수 → **dash** 당첨.
- 라운드 예산: `round-budget.mjs` → 1 (미채움 0종, 근거 동일). 라운드 번호: `auto-dash-r32`(직전 `auto-dash-r31`+1).
- `reassign-queue.md` "대기 중" 확인 — dash 정식 등재 항목 없음(백로그 후보는 있으나 "다음 배정은 남은 백로그 중에서 판단" 상태로 미확정 — 이번 라운드는 재배정 없이 3후보 전부 자유 탐색으로 진행).
- 다양성 축 선제 체크(`scripts/catalog-variety.mjs`, dash 최근 5라운드): `banList` = `{theme: [dark], accent: [], face: [pretendard]}` (다크 3연속·디스플레이폰트-미지정 2연속 회피). 3후보 전부 **light** 테마(브리프의 "진짜 라이트" 규율 준수) + 서로 다른 accent(rose/blue/amber, 최근 5라운드 미사용 계열) + 서로 다른 디스플레이 활자(grotesk/wide/mono, 전부 지정 — pretendard-미지정 축 회피).
- 매크로 버킷 선제 체크: 최근 5라운드(r27-r31) 버킷(KPI행+8/4차트분할=차별성비용 명시 delta 있음·회피, 캘린더/보드 2회=회피, 마스터-디테일·3페인마켓 다수 사용=근접회피) 전부 회피, 지배시각화도 카탈로그 25종 목록 대비 미탐색 3종(Line+Highlights 이상탐지 소형멀티플·Waffle·branching Process Map) 배정.

## §1 RETRIEVE

`dash-brief-v3.md`(완성도기준·그리드크래프트룰·선택-다중위젯동기화 축적기준 전문) · `page-brief-core.md`/`page-brief-repo.md`(landing r27에서 이미 로드, 세션 내 재사용) · `curation-criteria.md` · `vault/20-catalog/charts.catalog.md`·`colors.catalog.md`(dash 전용) · `ux-guidelines.catalog.md`(Plat=web/both) · `motion.catalog.md`(dash 열) 전문 확인. `dash-deltas-provisional.jsonl` 70줄 전체 확인(최근: r26 이중스코프pin L2 promoted, r27 KPI행+8/4=차별성비용 L2, r29 Intl.NumberFormat compact SSR/클라이언트 ICU 하이드레이션 불일치 L1, r29 hover가드 정밀화, r30 빈 소비자패널=미완성신호 L1, r31 브리프열거외곽셸 우위 L1). `auto-ledger.jsonl` dash 최근 5(r27-r31) 확인. `/dash` 갤러리(d29-d55) 전체 + dash-evolve 누적 아키타입(승격분 + 미승격 losing/self-judged 후보 포함) 확인해 중복 금지 목록 구성.

## §2 GENERATE

3개 designer 서브에이전트(최상위 세션 직접 병렬 스폰) — 각자 조립된 브리프 전문 + 배정된 지배시각화/입력축/다양성축을 받아 독립 생성:

- **a — "Tripwire"**: 사기·분쟁 신호 소형-멀티플 월(10개 신호, Line+이상탐지 다이아몬드 마커 소형차트 그리드가 페이지 전체) + 클릭 시 같은 그리드 셀이 `col-span-2`로 인라인 확장(별도 상세 컴포넌트 없음). rose accent · `--font-display-grotesk`.
- **b — "Census"**: 지원티켓 구성 10×10 와플그리드(카테고리별 면적=비중) + 온디맨드 슬라이드오버 드로어(상시 3페인 아님). blue accent · `--font-display-wide`.
- **c — "Loopback"**: 반품/환불 프로세스맵 노드-엣지 그래프(실제 루프백 엣지 포함, 간트/생키/퍼널과 달리 분기·순환 구조) + 하단 필름스트립. amber accent · `--font-display-mono`.

세 후보 모두 브리프의 "선택→다중위젯동기화" 축(pin=영속·hover=완전로컬·충돌가드 명시)을 지시대로 구현. 모두 완주.

**게이트 직전 동결 해시**: `69391119cfa4453f1e5590b593fe85982a805ffc`.

## §3 HARD GATE

`node scripts/gate.mjs --target web --routes /dash-evolve/r32/<v>` (env: `PW_CHROMIUM_PATH`/`CHROME_PATH`를 사전설치 Chromium에 고정, landing r27과 동형).

- **a**: 1차 sweep 실패(28건 cell-overlap/table-overflow — 원인: `case-table.tsx`가 `signal-panel.tsx`의 `sm:grid-cols-2` 서브그리드로 절반폭에 눌려 상태배지 텍스트가 `table-fixed` 셀 경계 밖으로 겹쳐 그려짐) → 서브그리드 분할 제거(테이블이 항상 패널 전체폭을 쓰도록)로 1-fix, 재게이트 10/10 클린.
- **b**: 1차 lint 3건(`set-state-in-effect`·`prefer-const`·미사용 import) + sweep table-overflow 1건(154px, 데스크톱 전 구간 동일) → lint 3건 수정 + (오진단으로) 외곽 `fixed` 래퍼에 `overflow-hidden` 추가로 1-fix 시도 → **재게이트 재실패**(동일 154px sweep 위반 그대로) → **스킬 §3 "재실패 시 탈락(사유 무관)" 그대로 적용해 탈락**. 사후 진단(재게이트는 소모하지 않고 정적 조사만): 정지 상태 스냅샷은 오버플로 0이라 결함이 상호작용 이후(슬라이드오버가 실제 열린 상태)에만 발현하며, 실제 원인은 `ticket-table.tsx`의 `min-w-[520px]`가 드로어 폭(`sm:w-[460px]`, 패딩 차감 시 더 좁음)을 초과하는데 로컬 `overflow-x-auto` 래퍼가 그 오버플로를 완전히 격리하지 못하는 것으로 추정(정확한 누출 경로는 미확정 — 1-fix 예산 소진으로 2차 격리 시도 불가). 상세는 `SCORES.md` "candidate b" 절.
- **c**: 1차 클린(10/10).

`a11y`/`perf` 전부 `unavailable`(=pass, 이 샌드박스 CDP 경로 부재, 실측 미검증). 생존 2후보(a, c) 스크린샷 16프레임×2=32장, blank 0건.

## §3-1 판정 후 수정

렌즈1·렌즈2가 독립적으로 동일 지점을 지적했다 — 승자 a의 `signal-chart.tsx`의 평범한 추세선(`stroke="#a1a1aa"`, zinc-400)이 실제 데이터를 나타내는 그래픽 요소인데 배경 대비 약 2.56:1로 비텍스트 3:1 하한 미달(a.md 자체가 "불확실한 부분"으로 미해결 인정). **규칙 위반 해소**로 판단해 `#71717a`(zinc-500, 약 4.83:1)로 교체 — 재게이트 10/10 유지 확인. 판정 순위는 재계산하지 않음(수정이 순위를 바꿀 만한 사안이 아님 — 렌즈2가 이미 c를 승자로 뽑으며 이 항목을 근거로 들지 않았고, 렌즈1도 a를 승자로 뽑으며 이 항목이 아니라 선택-팬아웃 구조 차이를 결정 근거로 들었다).

## §4 JUDGE (생존 2후보)

3렌즈 병렬(최상위 세션 직접 스폰, 블라인드). 공통 입력: 후보당 4프레임(1440 s0/s35/s100 + 390 s0), 소스 경로. 렌즈3은 추가로 `-s70` 프레임을 자체 판단으로 열람(스킬이 허용하는 범위 — 프레임 예산 안에서 필요시 자체 보강).

- **렌즈1(브리프 준수)**: **a**. 근소한 차이 — a는 pin이 오직 "같은 SignalPanel 컴포넌트의 인라인 확장"만 소비해 별도 상세 컴포넌트 자체가 없는 반면, c의 `selection` 유니온은 4개 서로 다른 컴포넌트(ProcessGraph·DetailPanel·StageTable·Filmstrip)에 그대로 전달돼, 타입은 다르지만("단일 selectedId 문자열"은 아니지만) 여전히 "단일 리프트 상태가 3+ 컴포넌트로 팬아웃"되는 브리프 경고 형태에 더 가깝다고 판정. 부수적으로 c의 1920px 여백 규칙 위반(DetailPanel이 `lg:max-w-md`로 캡돼 그 행에 상당한 빈 여백)과 c 사이드바에 제품명("Loopback")이 전혀 노출되지 않는 점(a는 워드마크+워크스페이스 스위처 둘 다 있음)도 근거로 인용. c는 대비감사 엄밀함(amber 500 위 흰글자 실패를 스스로 발견해 수정)에서 근소 우위였으나 순위를 뒤집지 못함.
- **렌즈2(상용완성도)**: **c**. a는 4열 데스크톱 기본뷰에서 신호명 8/10개가 말줄임+`title` 폴백 없이 잘려("Payment-declin...", "Counterfeit-rep..." 등) 사기감시월의 가장 중요한 식별 라벨이 가독 불가에 가깝다고 지적, c는 엣지 볼륨 상시 텍스트 라벨(호버 불요)·상시노출 병목 배지·기본 pin이 병목 스테이지라 첫 로드부터 실데이터가 채워진 점(§완성도기준 "at-a-glance 즉시가독" 정확 충족)·엣지 볼륨 보존 계산이 실제로 맞아떨어짐(inbound=outbound+pooled 수기검증)을 근거로 들었다.
- **렌즈3(형태 차별성)**: **a**. 두 후보 모두 카탈로그에 없는 지배시각화(소형멀티플 월 / 분기·순환 프로세스맵)를 실제로 렌더링했다고 확인했으나, a의 매크로셸은 "상세 페인 자체가 존재하지 않는" 구조라 브리프 열거 4대 아키타입(마스터-디테일 포함)의 어느 것과도 겹치지 않는 반면, c는 그래프+DetailPanel+StageTable("above the process map을 그대로 반영")+Filmstrip의 4단 수직 스택이 사실상 세로로 펼친 마스터-디테일이라고 판정(가장 근접한 카탈로그 선례: d53). KPI행+8/4분할 차별성비용 패턴은 둘 다 재현하지 않음 확인.

**집계**: 1위 표 — a 2표(렌즈1·렌즈3) · c 1표(렌즈2). **2:1 다수결로 a("Tripwire") 승자.** no-winner 표 0개, tie-break 불요.

## §5 LEARN — 격리 적재

승자 a의 판정 사유에서 재사용 가능한 delta 1개 추출(`dash-deltas-provisional.jsonl`에 append):

**delta**: 선택-팬아웃 계보(r17-r31)를 한 단계 더 정밀화한다 — **상세 컴포넌트를 아예 두지 않는 것**(pin이 오직 같은 반복 컴포넌트 타입의 인라인 확장만 소비)이, **타입화된 유니온을 여러 소비 컴포넌트에 팬아웃하는 것**(각 소비자가 필드를 다르게 읽더라도)보다 마스터-디테일 회피 판정에서 더 강하다. 후자는 "단일 selectedId 문자열"이 아니어도 "리프트된 상태 하나 → 3+ 개의 구조적으로 구분된 컴포넌트" 형태 자체가 판정에서 마스터-디테일과 유사하게 읽힌다(이번 라운드는 `c`의 상세패널이 실제로 "위 프로세스맵을 반영한다"고 스스로 문서화해 유사성이 더 뚜렷했다). L1(1회 관측, 특정 후보 종속) 적재.

## §6 지식 정제 게이트

- dash DELTAS 70+1건 클러스터링: 신규 delta는 기존 r17→r26 계보(전면재계산 < 단일축부분재계산 < 다축독립스코프)와 무모순, 그 계보에 "상세페인 부재 > 다중소비자팬아웃" 이라는 한 단계를 추가로 제안하는 정밀화 — 재현 대기(L1 유지, 2라운드+ 재현 시 L2 승격 검토).
- 충돌 쌍 없음, 강제 질문 생성 없음(렌즈 1:2:0 분할이 아니라 2:1 정상 다수결 — curation-criteria "Q32 판정"에 따라 2:1은 정상 결과이며 별도 질문 불요).
- 정본(dash-brief-v3/design-principles/page-brief-core/page-brief-repo/curation-criteria) **무변경**.

## §7 기록 + reassign-queue

- `auto-ledger.jsonl` append: `target: dash, round: auto-dash-r32, winner: a, no_winner: false, variety: {theme: light, accent: rose, face: grotesk}`.
- **`reassign-queue.md` "대기 중"에 후보 b(Census) 등재** — 탈락 사유는 형태 판정이 아니라 하드게이트 규칙 위반(sweep table-overflow, 1-fix 후 재실패). 재배정 시 배정문에 반드시 명시할 것: "`ticket-table.tsx`의 `min-w-[520px]`를 슬라이드오버 드로어 실사용폭(`sm:w-[460px]` 빼기 패딩, 약 420px)에 맞춰 줄이거나 드로어 폭 자체를 넓힐 것 — 로컬 `overflow-x-auto`에 기대지 말 것. 검증은 정적 스냅샷이 아니라 실제 드로어를 연 상태에서 `document.documentElement.scrollWidth`를 재는 인터랙티브 Playwright 트레이스로 할 것(정지 상태는 오버플로 0으로 통과해 보인다)."
- `vault/index.md` "세대 기록"에 이번 run 등재.
- 승격(카탈로그 `works.ts` 배정)은 `/dash-falsify apply`의 몫 — 이 라운드는 하지 않는다.
- 커밋 → `evolve/dash` push.

## 환경 노트 (이 샌드박스 고유, 스킬 불변식 아님)

- Lighthouse a11y/perf `unavailable`(CDP 경로 부재, landing r27과 동일 제약).
- 컨테이너 재시작 없이 이번 라운드는 완주(landing r27은 1회 재시작 겪음 — 세션 로그 참조).
