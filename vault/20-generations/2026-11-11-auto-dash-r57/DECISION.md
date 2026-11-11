# auto-dash-r57 — DECISION

## §0. 라운드 전제 및 편차 고지

- 스케줄된 무인 실행. 사용자 프롬프트는 `/dash-evolve 2`(연속 2라운드)를 요청했다.
- `node scripts/round-budget.mjs 2` → **1**. 미채움 `PAGE_TYPES` 0종(dashboard/settings/landing/login/404/catalog/scene/product-detail/paywall/profile/blog/about/careers/contact/developers/integration/media-kit/mobile 전부 카탈로그에 1건 이상). 스크립트 규칙대로 **이번 호출은 1라운드만 돈다** — `N≥2` 요청을 받았어도 강제 N=1이며, 이 사실을 여기 첫 절에 기록한다(§0-0-1 산문 교훈 반영: 스크립트 출력만 신뢰).
- 요일: 2026-11-11(수) — UTC 요일 3, 월요일 아님 → native 고정 주기 미발동.
- 타깃 추첨: 미채움 0종이므로 `[dash, landing, native]` 균등 난수 → **dash**.
- 라운드 번호: `auto-ledger.jsonl`에서 dash 타깃 최대 r56 + 1 = **r57**.
- Agent 도구 가용성: 이 세션은 `Agent` 도구를 보유(일반 세션, subagent_type 선택 가능). 커스텀 designer/comparator 에이전트 타입은 이 환경에 없음(과거 r53 이후 일관된 관측과 동일) — `general-purpose` subagent_type으로 3 designer·3 judge 전원 대체, 생성과 판정이 서로 다른 독립 서브에이전트 인스턴스에서 수행됨(오케스트레이터 본인은 생성도 판정도 하지 않음 — §0-0 블라인드 전제 충족). **self_judged: false.**
- 재배정 큐: `vault/00-principles/reassign-queue.md` "대기 중" #21 `auto-dash-r56/b`("Ridgehaul", 박스플롯+피드중심 티켓스트림, dark/green/display-grotesk, 1-fix가 `react-hooks/refs`를 새로 만든 탈락)를 **후보 a로 소비**, 탈락 사유(커맨드 팔레트 open 리셋 effect→ref 치환이 새 위반을 만든 것 / aria-label 재포맷 불일치)를 배정문에 그대로 전달.
- 다양성 금지 축(`scripts/catalog-variety.mjs`, 최근 3라운드 window): `banList.theme = ["light"]`(r56·r54 승자 연속 light). accent/face 금지 없음(어느 것도 window=3에서 2회 이상 반복 안 됨). 이에 따라 이번 라운드 3후보 전원 **dark** 배정, 활자는 직전 2라운드 승자 활자(r56=none/Pretendard-only, r54=grotesk) 제외 원칙에 따라 b=display-wide, c=display-mono(또는 none) 배정(a는 재배정 큐가 고정한 display-grotesk — 재배정 예외).
- 매크로 버킷 회피: 최근 포화 버킷(워치리스트레일+중앙차트+우측상세 4+회/캘린더/치트리/벤토/Sankey+master-detail/칸반/트리맵/슬로프/네트워크그래프/디컴포지션트리/코로플레스/퍼널/캔들스틱/코드다이어그램/간트) 목록을 3 designer 프롬프트에 금지 축으로 명시.

## §1. RETRIEVE — 읽은 것

`dash-brief-v3.md` 전문 · `page-brief-core.md` 전문 · `page-brief-repo.md` 전문 · `reassign-queue.md` 대기 중 #21 · `dash-deltas-provisional.jsonl` 중 status≠refuted & 비-superseded 전량(L2 8건 전문 + 최근 L1 8건) · `curation-criteria.md` · `charts.catalog.md`·`colors.catalog.md`(다크 팔레트) · `auto-ledger.jsonl` dash 최근 5건(r52~r56) · 중복 금지 목록(최근 포화 버킷).

## §2. GENERATE — 3 designer (general-purpose, 블라인드·독립)

| 후보 | 제품/컨셉 | 폼 | 테마/액센트/활자 |
|---|---|---|---|
| a | **Ridgehaul** — IT/고객지원 운영 콘솔. 팀별 티켓 해결시간 박스플롯 + 피드중심 라이브 티켓스트림(하이브리드 셸) | 재배정 큐 #21 고정 | dark / green / display-grotesk |
| b | **Outlay** — 클라우드 비용배분 콘솔. 비용센터 레일(master-detail) + 2단 선버스트(org→team→service) + 필수 접근성 폴백(접이식 트리) | 자유 탐색(설계 지정) | dark / cyan / display-wide |
| c | **Trestle** — CI/CD 빌드 신뢰성 콘솔. 히어로(헤드라인 성공률)+단일 지배 프로세스맵(파이프라인 단계 흐름) + 필수 접근성 폴백(경로요약 테이블+Top-3 병목) | 자유 탐색(설계 지정) | dark / violet / display-mono |

3후보 전원 designer 완료 알림 수신 확인(파일 존재만으로 진행하지 않음). 동결 해시(최초, 1-fix 전): `0d664c9019052903140ca5c50765d68638d1f8a7`.

## §3. HARD GATE

| 후보 | 1차 | 1-fix | 재게이트 |
|---|---|---|---|
| a | `sweep` `table-overflow`(1280~1536px, TicketTable colgroup이 Status/Priority 배지 실폭보다 좁음) | colgroup 재배분(32/14/13/15/17/9→24/9/17/20/17/12) — 재배분 중 Team 열의 `<span className="truncate">`가 비-flex `<td>` 안에서 블록화 안 돼 다음 열로 번지는 **신규** `cell-overlap` 발견 → `block w-full` 추가로 해소 | **10/10 클린** |
| b | `sweep` `page-overflow`(390/1280/1350/1366px, KpiRow "Over budget" 서브텍스트 span — a와 동일 결함 클래스: 비-flex 컨테이너의 truncate span 미블록화) / `a11y` 96(`listitem` — HierarchyTree 하위 `<ul role="group">`이 암묵적 `list` 역할을 덮어써 `<li>` 자식이 유효 리스트 컨테이너 상실) | KpiRow span에 `block w-full` 추가 / `role="group"` 제거(ARIA tree 패턴이 아닌 평범한 중첩 `<ul>` 디스클로저이므로 불필요했음) | **10/10 클린** |
| c | — | — | **1차부터 10/10 클린** |

동결 해시(1-fix 후, 최종 판정 대상): `32efa4ad3e0f9bf99a0487228b67e665e6e43591`. 상세는 `SCORES.md`.

**관찰**: a·b가 독립적으로 같은 결함 클래스(비-flex 컨테이너의 `truncate` span이 블록화되지 않아 부모 폭 제약을 무시 — table-fixed 맥락에선 `cell-overlap`, 일반 flow 맥락에선 `page-overflow`로 표면화)를 냈다. LEARN에서 L1 delta로 기록.

## §4. JUDGE 패널 (3렌즈, general-purpose 블라인드, 각 후보당 4프레임: `<v>-1440.png`·`<v>-1440-s70.png`·`<v>-390.png`·`<v>-390-s70.png`)

### 렌즈1 (브리프/DNA 준수) — **b > c > a**
- a 3위: 두 건의 구체적 규칙 위반 — ① 상단바에 avatar 메뉴 부재(브리프 요구 "⌘K+주요액션+알림+**아바타 메뉴**"), 아바타는 사이드바 하단에만 있고 드롭다운/메뉴 기능 없음. ② 다크 팔레트에 `slate-*`를 전면 사용(브리프는 "zinc-950/900 표면·zinc-50/400 텍스트" 명시) — b·c는 둘 다 정확히 `zinc-*` 사용.
- b 1위: 상단바 요소 전부 정확(아바타+드롭다운 포함), zinc 팔레트 정확, 단일 액센트+시맨틱 2차색(amber) 정확, 3웨이트 정확, 선버스트 폼이 지정과 정확 일치, 선택 파급이 브리프 예시에 가장 가깝게 "하나의 좁은 위젯"만 건드림.
- c 2위: 전부 준수하나, pin이 ProcessMap+PathTable 양쪽에서 설정되고 3곳(ProcessMap outline/PathTable 버튼/StageDetailCard)에 표시되어 b보다 "좁은 위젯 하나" 해석이 더 느슨함(금지 패턴은 아니나 b 대비 열위).

### 렌즈2 (상용 SaaS 완성도) — **c > b > a**
- c 1위: 프로세스맵이 셋 중 가장 정보 밀도 높고 기능적(색+선굵기+앰버 외곽선이 각자 다른 의미), ">100%" 처방을 유일하게 명시 배수 라벨("2.0x over SLA")로 정확히 구현, 데이터 현실성 우수.
- b 2위: 선버스트+헤드라인 항상노출 우수하나, 데스크톱(1440px) 비용센터 레일/트리 레이블이 더 좁은 모바일(390px) 프레임보다 심하게 잘리는 **레이아웃 역행** 발견(완성도 결함, 규칙 위반 아님).
- a 3위: 기능은 멀쩖으나 시각적 밀도가 가장 낮고("박스플롯"이 가는 선+틱 수준), Open Ticket Queue의 TEAM 열이 1440px에서도 여유 있음에도 잘림(완성도 결함).
- **공통 결함(비차별)**: 3후보 전원 선택 상세 패널이 기본값으로 완전 빈 플레이스홀더("Pin a stage...", "No cost center pinned", "No team pinned yet")로 열림 — 브리프가 명시한 "기본 선택으로 채워야 한다" 완성도 기준 위반을 **전원 공유**. 비차별적이라 순위에 반영 안 됐으나 §3-1 처분 대상(아래).

### 렌즈3 (아키타입 차별성) — **c > a > b**
- c 1위: 진짜 방향성 프로세스-흐름 차트(Sankey/네트워크/디컴포지션트리와 구조적으로 구별됨, 고정 선형 스파인+단일 수렴 싱크)이며, 셸 자체가 "히어로+단일지배차트"로 레일/피드/master-detail 전부 회피 — 포화 버킷과 가장 멀다.
- a 2위: 진짜 5수 요약 박스플롯, 셸은 "차트2단+분리된 피드/테이블 2단" — 전형적 "레일|중앙차트|우측상세" 1행-3분할과 달지만, 리스트형 차트+인접 상세카드 구성이 레일-인접 패턴에 다소 가깝다.
- b 3위: 진짜 2단 선버스트(차트 타입 자체는 셋 중 가장 신규)이나, `OutlayClient.tsx` 레이아웃이 "비용센터 레일 | 중앙 지배차트 | 우측 상세카드"를 **한 행에 동시 가시화** — 이 라운드가 피하라고 명시한 "워치리스트레일+중앙차트+우측상세" 포화 버킷과 매크로 골격 수준에서 구조적으로 일치(레일 내용·차트 종류만 바뀜). 개별 실행 품질은 최고이나 골격 재수렴.

### 집계
1위 표: **c 2표(렌즈2·렌즈3), b 1표(렌즈1)**. 완전동률 아님 — 명확한 2:1 다수결. tie-break 불요.

## §3-1. 판정 후 수정 (승자 c에 한함, 규칙 위반 해소만)

- **발견**: 렌즈2가 지목한 "선택 상세 패널 기본값이 완전 빈 플레이스홀더" 결함(brief의 명시 지시 — "selection-driven detail panel must default-populate with a sensible fallback at first paint" — `dash-brief-v3` §완성도 기준의 `auto-dash-r40` L2 delta에서 유래)은 승자 c를 포함해 3후보 전원이 공유했다. 비차별적이라 순위를 바꾸지 않았으나(auto-404-r1 "폰트 웨이트 3종" 선례와 동일 프로필 — 비차별 위반을 알면서 카탈로그에 올리지 않는다), 승자에 한해 해소한다.
- **조치**: `app/src/app/dash-evolve/r57/c/ConsoleClient.tsx` — `pinnedStageId`를 `useState<string|null>(null)` → `useState<string|null>(() => PERIODS["30d"].bottlenecks[0]?.id ?? null)`로 변경. 초기 기간(30d)의 1위 병목 단계로 시드하며, 이후 기간 토글에 의해 리셋되지 않는다(effect 없음 — `set-state-in-effect` 금지 규칙을 피하는 패턴, b의 `HierarchyTree` 시드 열림 패턴과 동형). 커맨드 팔레트의 "Clear pin" 액션(`setPinnedStageId(null)`)은 그대로 유지되어 사용자가 의도적으로 지울 수 있다 — 그 경우에만 빈 상태 카피가 나타나며, 이는 "기본값이 비어 있음"이 아니라 "사용자가 지운 상태"이므로 규칙 위반이 아니다.
- **재게이트**: 10/10 클린 유지(a11y 100, sweep 0, perf 93). 순위 재계산 없음(규칙 위반 해소일 뿐 완성도 개선이 아님 — 취향적 변경 없음).
- a·b(비승자)는 동일 결함을 공유하지만 §3-1은 승격 경로에만 적용하므로 수정하지 않는다. 드롭되는 b/c(여기서는 둘 다 비승자지만 — 정정: 비승자는 a, b)의 형태는 아래 §재배정 처리를 따른다.

## §5. LEARN

아래 L1 delta 1건을 `dash-deltas-provisional.jsonl`에 append:

> "truncate" 클래스(white-space:nowrap 포함)가 붙은 `<span>`이 flex 컨테이너의 직계자식이 아니면(table-cell의 직계자식, 또는 plain div의 직계자식) CSS 블록화가 일어나지 않아 부모의 폭 제약을 무시하고 시각적으로 번진다 — 같은 라운드에서 독립적으로 생성된 두 후보(a: TicketTable.tsx의 Team 열, b: KpiRow.tsx의 "Over budget" 서브텍스트)가 서로 다른 트리거(테이블 셀 vs KPI 카드)로 같은 결함 클래스를 냈고, table-fixed 맥락에서는 `cell-overlap`으로, 일반 플로우 맥락에서는 `page-overflow`로 서로 다르게 표면화됐다. 두 경우 모두 `className`에 `block w-full`(또는 동등한 블록화)을 추가해 해소. 일반화: `truncate`를 쓰는 span이 flex/grid 아이템이 아니라면 항상 명시적으로 블록화하라.

## §6. 지식 정제 게이트

- 클러스터링: 위 신규 L1 delta는 `truncate`-블록화 결함 클래스로, 기존 L2(`table-fixed`+colgroup `min-w` 셀/테이블 구분, 2026-09-12 편입)와 인접하지만 트리거 메커니즘이 다르다(colgroup 폭 배분 문제가 아니라 CSS display 블록화 문제) — 같은 delta로 병합하지 않고 별도 L1으로 유지.
- 재현 임계: 이번이 1회차(같은 라운드 내 2개 독립 인스턴스지만, delta 승격 규칙은 "2개 라운드 이상"을 요구) — L2 승격은 **보류**, 다음 라운드에서 세 번째 독립 재현이 나오면 L2 상향 검토. 충돌 쌍 없음, questions-queue 신규 질문 불요(기존 meta-기준으로 충분히 설명됨 — "결함 클래스 재현은 기법이 아니라 클래스로 판정"이 이미 `curation-criteria`에 있음).

## §7. 처리

- 승자: **c (Trestle)**, 2:1 다수결(렌즈2·렌즈3).
- 비승자 a(Ridgehaul)·b(Outlay): 둘 다 하드게이트 클린 재통과 + 판정까지 정상 진입 + 규칙 위반 지적 없음(순수 판정 패배) — 재배정 큐에 넣을 자격(탈락 사유=규칙 위반)이 아니므로 큐에 추가하지 않는다. 재배정 큐 #21(이번에 소비한 a의 원형)은 결과와 무관하게 아카이브로 이동(규약).
- no-winner 아님.
