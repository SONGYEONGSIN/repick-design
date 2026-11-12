# auto-dash-r56 — DECISION

## 0. 세션 맥락 — 이 세션의 2라운드째(독립 재호출)

예약 작업이 "2회 연속"을 요청했으나, 1라운드째(`auto-landing-r50`)에서 `round-budget.mjs`가 해당
호출에 대해 N=1을 강제했다(미채움 0종) — 그 사실과 사유는 `auto-landing-r50/DECISION.md` 첫 절에
기록했다. 이 레포의 과거 이력(`vault/index.md`의 다수 과거 라운드 기록)을 보면 이 예약 작업은
**"/dash-evolve 를 두 번 별도로 호출"하는 방식으로 반복 수행돼 왔다** — 매 호출이 각자
`round-budget.mjs`를 다시 평가하고(오늘도 또 N=1), 직전 호출이 뽑은 타깃을 이번 호출의 균등 난수
풀에서 제외한다. 이번 라운드(`auto-dash-r56`)가 바로 그 **두 번째, 독립적인 /dash-evolve 호출**이다 —
1라운드(`auto-landing-r50`, landing, 커밋+push 완료)가 끝난 뒤 시작했고, 1라운드가 append한
delta·questions-queue를 다시 읽은 상태에서 시작했다.

- `node scripts/round-budget.mjs --explain "1"` → `1	미채움 0종 — N≥2 의 근거(커버리지)가 없다` (이번
  호출도 N=1 강제, 예상된 결과).
- 오늘(2026-11-07)은 토요일 — 월요일 고정 native 주기 해당 없음.
- 타깃 결정: 미채움 큐 0종 → dash/landing/native 균등 난수, **단 1라운드가 이미 landing을 뽑았으므로
  이번 호출의 풀에서 landing을 제외**(`[dash, native]`에서 추첨) → **dash** 당첨.
- 라운드 번호: ledger에서 dash 최대 라운드(r55)+1 = **r56**.

## 0-0. 서브에이전트 가용성 확인

`Agent` 도구 실제 사용 가능 확인됨(designer 3개·judge 3개 전부 실제 서브에이전트). `self_judged: false`.

## 1. RETRIEVE — 요약

`dash-brief-v3.md`+`page-brief-core.md`+`page-brief-repo.md` 전문 로드. `reassign-queue.md` "대기 중"
확인 — **#20 `auto-dash-r55/c` "Arbor" (target: dash) 발견**, 이번 라운드에서 소비(§2 참조). DELTAS
(`dash-deltas-provisional.jsonl`, 96건 중 최근 8건)를 designer 프롬프트에 지시문으로 직접 반영
(사이드바 nav 양쪽 마운트 배선 확인·요약-드릴다운 숫자 단일 소스·원형 차트 라벨 반경 여유·100% 초과
가능 비율의 progress-bar 캡 문제·선택→다중위젯 동기화의 파급-범위 티어 교리). `curation-criteria.md`
전문(이미 §1 RETRIEVE에서 재사용, 랜딩 라운드와 동일 내용). 참조 카탈로그 `charts.catalog.md`(25종
전체 + dash 핵심 8종) · `colors.catalog.md`(AA보정 팔레트 뱅크) 로드. `auto-ledger.jsonl` dash 최근
6건 확인(r50·r55 no-winner 2건 포함). `catalog-variety.mjs` banList — 최근 3건(r55 빈값·r54
light/rose/grotesk·r53 dark/blue-hex/mono)에서 금지 축 없음(테마 2연속 아님, 액센트/활자 2회+ 없음).

중복 금지 목록: 프로덕션 `/dash` 갤러리(d29-d55, 27개) + dash-evolve 누적 라운드 이력(r1-r55) — 포크
서브에이전트가 `vault/index.md`+`works.ts` 전수 스캔으로 컴파일. 직전 5라운드(r51-r55) 매크로 버킷
명시 회피 지시 포함.

## 2. GENERATE

재배정 큐를 먼저 소비: **#20 "Arbor"**(`auto-dash-r55/c`, 레일없는 티커+전폭 슬로프차트, 다중시설
ESG 스코어카드, light/lime/Pretendard-only) → **후보 a**로 고정 배정, 등재된 탈락 사유(끝점 두
24×24 버튼의 "최근접 간격" 조항 미충족)와 처방(끝점을 개별 버튼으로 만들지 말고 행 전체를 단일
클릭/포커스 영역으로)을 배정문에 그대로 포함. 나머지 2후보는 자유 탐색.

3 designer 서브에이전트(Agent 도구, general-purpose, 블라인드 병렬) 동시 호출.

| 후보 | 아키타입 | theme | accent | face |
|---|---|---|---|---|
| a | (재배정) Arbor — 레일없는 슬로프차트 ESG 스코어카드, 행 전체 단일 클릭 영역으로 재구현 | light | lime | 없음(Pretendard-only, 재배정 원안 유지) |
| b | Support Ticket Resolution Health — 박스플롯(팀별 해결시간 분포)+피드중심 티켓스트림 | dark | green | `--font-display-grotesk` |
| c | Service Dependency Map "Nodewatch" — 네트워크그래프(서비스 의존맵)+그래프캔버스+상세패널, 접근성 폴백 테이블 필수 | light | indigo | `--font-display-wide` |

3개 전원 완료 확인(SubagentHandback 수신) — a 213k·b 230k·c 299k subagent 토큰, 각 77·84·119 도구 호출.

**게이트 직전 동결 해시**: `de9f53ee8891812c13ddb92099acca122395482f` (1-fix 이전).

## 3. HARD GATE

| gate | a | b | c |
|---|---|---|---|
| route/types/static/sweep | pass 전원 | pass(1차) | pass 전원 |
| lint | **1차 실패**(미사용 `Users` import) → 1-fix: 제거 → pass | **1차 실패**(`react-hooks/set-state-in-effect` ×2) → 1-fix: open-트리거 리셋을 render-time prop-비교 패턴으로 전환 → **재실패**(`react-hooks/refs` ×2 — 수정 자체가 "render 중 ref.current 읽기" 신규 위반을 만듦) | **1차 실패**(`react-hooks/set-state-in-effect` ×4) → 1-fix: (1) palette 상태를 마운트-시점 리셋(내부 컴포넌트 언마운트/리마운트)으로 전환 (2) focus-request를 ref+tick 패턴으로 전환 (3) 좁은 뷰포트 초기값을 `useSyncExternalStore`로 전환(SSR-세이프) → pass |
| a11y | **1차 실패**(`label-content-name-mismatch` — 슬로프행 버튼의 커스텀 aria-label이 행의 실제 가시 텍스트(지역/타입·델타태그)를 전부 포함 못함) → 1-fix: 커스텀 aria-label 제거(컬럼헤더가 이미 맥락 제공, 버튼 콘텐츠 자체가 접근가능이름) → pass 100 | **1차 실패**(동일 감사, 박스플롯 행 — `team.name`+raw median 라벨이 가시 텍스트 `team.short`+포맷문자열과 안 겹침) → 1-fix로 재작성했으나 **lint 재실패로 탈락 확정 후에는 무의미** | pass 100 (1차부터) |
| **verdict** | **PASS (1-fix 1회 소진)** | **FAIL — 1-fix 후 재실패, 탈락**(스킬 §3: "재통과 → 생존, 재실패 → 탈락". `auto-dash-r55`와 동일 패턴 — 1-fix가 새 위반을 만들어 재실패) | **PASS (1-fix 1회 소진)** |

2후보 생존(a, c) → §4 JUDGE 패널로 진행(2개 이상 → 정상 패널).

**b의 탈락은 형태 판정이 아니다** — 두 실패(React effect 린트 패턴, aria-label 문구) 모두 구현
디테일이고 컨셉(박스플롯+피드중심 티켓대시보드) 자체의 결함이 아니다. §6에서 `reassign-queue`에 등재.

## 4. JUDGE 패널

4프레임/후보(1440 scroll0 · 1440 s70 · 1920 scroll0 · 390 scroll0) 캡처, 32장 전수(2후보), blank 0 ·
errors 0. judge 3개 병렬(Agent 도구, general-purpose, 서로 블라인드).

**렌즈1(브리프 준수)** — 1위 **a**, 2위 c. 근거: a의 target-size 수정이 구조적으로 실재함을 소스로
직접 확인(`SlopeChart.tsx:26-39` Track이 `aria-hidden` SVG로 비인터랙티브, `:83-113` Row가 행 전체를
단일 버튼으로 래핑) — 우연한 통과가 아니라 설계가 반영된 수정. 포커스 가시성도 Tailwind v4 죽은
관용구를 명시적으로 회피(`tokens.ts:36`). c는 접근성 폴백 테이블이 실질적(진짜 `<dl>` 양방향 의존성
목록, 정렬/필터 가능)이고 모바일 전략도 실재(`useSyncExternalStore` 기반, SSR-세이프)하나, 선택→동기화
축이 단일 `selectedId`로 그래프+디테일패널에 threading되는 구조라 브리프 자체가 기록한 "덜 차별화된
배선 형태"(r17 패턴)에 해당 — a의 독립 2축(행 아코디언 vs ⌘K 핀) 설계가 더 의도적.

**렌즈2(상용 완성도)** — 1위 **a**, 2위 c. 근거: a의 슬로프차트가 상시-노출 텍스트만으로 "한눈에
읽히는" 기준을 완전히 만족(호버 불요), 인터랙션 표면이 풍부(QoQ/YoY 토글+정렬테이블+텍스트/지역
필터+상태필)이고 빈 상태 디테일패널("No facility pinned")까지 상용급 디테일. c는 쉘·스탯카드는
동등하게 완성도 높으나, 그래프 자체의 핵심 가치(blast radius)가 기본 상태에서 전혀 안 보이고 클릭
후에야 나타남("Select a service... will appear here") — 엣지가 전부 동일한 얇은 회색 선이라
Datadog류 서비스맵 대비 "생성된 레이아웃"처럼 읽힘.

**렌즈3(구조 차별성)** — 1위 **c**, 2위 a. 근거: 입력축×출력축 환원 — a("시설 카테고리 목록 →
ESG 점수 2시점+델타")는 **차트 프리미티브**(행내 슬로프 미니차트)만 신규이고 **매크로 쉘**(사이드바+
상단티커+단일 테이블)은 Portlane/Floorline/Harborline/Crewline과 같은 계열. c("서비스 노드(방향성
그래프) → 관계 도달성(직접의존·직접피의존·전이적 blast radius)+상태")는 **차트타입과 매크로 레이아웃
둘 다 신규** — Currents(Sankey, 흐름량만)·Portage(허브-스포크, 단일홉)와 구조적으로 다른 관계(다중홉
BFS 순회), Harborline/Ration의 리스트레일 패턴도 의도적으로 회피(선택이 리스트 행이 아니라 공간
캔버스의 노드 클릭).

**집계**: 1위표 — a 2(렌즈1·렌즈2) · c 1(렌즈3). no-winner 표 0. **다수결 승자 = a.** 완전동률 아님,
억지 승자 아님 — 세 렌즈 모두 1차에 완전한 랭킹+사유+근거+미확인범위 제출(재개 0회).

**§3-1 수정 여부**: 승자 a에 하드게이트 규칙 위반 지적 없음(렌즈1·2 모두 a를 결점 없이 1위 — 렌즈2가
언급한 390px 시설명 축약은 "경미한 반응형 타협"으로 명시, 규칙 위반 아님) → §3-1 불요.

## 5. LEARN — 격리 적재

delta 1건을 `dash-deltas-provisional.jsonl`에 append (L1):
- round: auto-dash-r56, variant: a
- delta: "A reassigned candidate's target-size fix (collapsing two adjacent small hit-targets into one whole-row click/focus region) should be verified structurally in source, not just by the automated gate passing -- lens1 independently confirmed the fix is real (the two score dots are aria-hidden, non-interactive SVG; the single <button> wraps the entire row) rather than trusting the gate pass alone. Separately: this round reproduced r55's exact 1-fix failure mode on an UNRELATED candidate (b) -- a React-hooks lint fix for 'set-state-in-effect' that itself introduces a NEW violation ('refs' -- reading ref.current during render) is now a 2nd independent occurrence of 'the standard 1-fix for this lint rule can trip a second, stricter rule in the same pass.' The safe fix pattern that worked in this same round (for sibling candidate c): mount/unmount an inner component to get fresh initial state instead of resetting it via a prop-change effect, use a ref+incrementing-counter ('tick') pattern for one-shot DOM-side-effect requests instead of a state field that needs to be reset back to null inside an effect, and use useSyncExternalStore (not a mount effect + setState) for any SSR-sensitive external-value read (viewport media queries, etc.). All three avoid both lint rules entirely rather than trading one violation for the other."
- evidence: "a/SlopeChart.tsx:26-39,83-113 (lens1 structural verification); b's 2nd gate attempt: react-hooks/refs x2 on CommandPalette.tsx:66-67; c's working fix: NodewatchDashboard.tsx useSyncExternalStore + ref+tick pattern, re-gated clean"
- judge_votes: {lens1: a, lens2: a, lens3: c}
- confidence: high (b's failure directly reproduces r55's documented pattern on a structurally unrelated candidate -- 2 independent occurrences across 2 different rounds and 2 different lint rules in the same family)
- level: L1, status: provisional

## 6. 지식 정제 게이트

- DELTAS 클러스터링: 이번 delta는 "1-fix가 새 위반을 만든다"는 `auto-dash-r55`의 관측(§3 실측
  3후보 전원)과 **같은 결함 클래스**다 — 거기서는 `sweep`/`target-size`끼리 충돌했고, 여기서는
  `react-hooks` 플러그인 내부에서 두 규칙(`set-state-in-effect`→`refs`)이 충돌했다. 재현 2라운드+
  (r55, r56) 충족 — **L2 승격**: `{round:'auto-dash-r56', variant:'b', delta:'1-fix 처방이 새 규칙
  위반을 만드는 패턴은 게이트 종류(sweep/a11y든 lint든)를 가리지 않는다 — r55는 target-size 내부
  충돌, r56은 react-hooks 플러그인 내부(set-state-in-effect → refs) 충돌. 일반화: 1-fix 처방을 줄 때
  그 처방이 같은 플러그인/관문의 다른 규칙과 충돌하는지 먼저 확인한다(예: useRef 기반 우회는
  react-hooks/refs 와 충돌할 수 있으므로, 상태를 완전히 없애는 재설계(마운트-리셋·ref+tick·
  useSyncExternalStore)가 더 안전하다).', evidence:'auto-dash-r55 SCORES.md(3후보 전원 target-size
  내부충돌) + auto-dash-r56 SCORES.md(b, react-hooks 내부충돌)', judge_votes:null, confidence:'high',
  level:'L2', supersedes:'auto-dash-r56/b (L1 원본)', status:'provisional'}`로 append.
- **질문 등재는 보류** — 충돌쌍·meta-기준 미해결 사안 없음. 이번 라운드는 명확한 2:1이고 §3-1 불요
  사안이라 신규 질문 없음.

## 7. 재배정 큐 처리

- **#20 "Arbor" 소진**: 재배정 사유(target-size 간격 조항)가 완전히, 재현 가능하게 해소됐고(1-fix 1회
  만에, 그마저도 a11y 커스텀 라벨 문제였지 target-size 자체는 재발 없음) 판정까지 정상 진입해 **승격
  성공**(2:1) — `reassign-queue.md`에서 아카이브로 이동.
- **신규 등재 #21 "Ridgehaul"(`auto-dash-r56/b`)**: 탈락 사유 = 형태 아닌 구현 디테일(React effect
  린트 패턴 2종, aria-label 문구 1종). 재배정 지시(그대로 지시할 것): "(1) `open` prop이 true가 될 때
  내부 state를 리셋하는 effect를 쓰지 말고, `{open && <PaletteBody .../>}` 식으로 내부 컴포넌트를
  마운트/언마운트해 항상 state가 fresh하게 시작하도록 재구성하라. (2) 어떤 derived-state도 'A가
  바뀌면 B를 effect로 리셋'하는 패턴을 쓰지 말고, B가 필요한 지점에서 직접 clamp/derive하거나 A를
  바꾸는 이벤트 핸들러 안에서 B도 같이 설정하라 — 별도 effect 금지. (3) 박스플롯(또는 유사 요약 위젯)
  행의 커스텀 aria-label을 쓸 경우, 그 라벨 문자열이 행에 실제로 렌더되는 포맷 함수(예: formatHours)의
  출력을 **그대로** 포함해야 한다 — 같은 값을 독립적으로 다시 포맷/구술하면 축약·단위표기가 달라져
  label-content-name-mismatch가 재발한다." target: dash.

## 8. 기록 + 커밋

- `auto-ledger.jsonl` entry: target=dash, round=auto-dash-r56, winner=a, no_winner=false,
  variety={theme:"light", accent:"lime", face:"none (Pretendard-only)"}.
- `vault/index.md` "세대 기록"에 이번 run 등재.
- 정본(dash-brief-v3.md 등) 무변경 확인. `/dash` 갤러리 무변경 확인(승격은 `/dash-falsify apply`
  소관). jsonl append-only(기존 라인 수정 없음).
- `git add -A && git commit` → `evolve/dash` push.

## 예약 작업 성공 기준 대비 메모

이 라운드로 이 세션은 **2개의 독립 /dash-evolve 호출**을 완주했다 — 1라운드 `auto-landing-r50`(landing,
b "Head-to-Head" 승, 2:1) · 2라운드 `auto-dash-r56`(dash, a "Arbor" 승, 2:1). 두 호출 모두
`round-budget.mjs`가 각자 N=1을 강제했고(미채움 0종), 그 사실을 각 라운드의 DECISION.md 첫 절에
기록했다 — 예약 작업이 요청한 "2회 연속"은 **"/dash-evolve를 두 번 별도로 호출하고 각 호출의
round-budget 결과를 그대로 따른다"**는 이 레포의 기존 관행대로 충족됐다. 성공 기준의 "라운드 커밋
2개·ledger entry 2건·run 디렉토리 2개·index.md 두 run 등재"는 전부 만족됐다(landing r50 + dash r56).
정본 무변경, jsonl append-only, main 미커밋도 두 라운드 모두 유지됐다.
