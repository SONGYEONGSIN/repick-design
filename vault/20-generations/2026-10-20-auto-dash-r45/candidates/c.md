# Candidate C — Switchboard

**Concept.** Switchboard is a ticket-routing operations console for a mid-size SaaS support org — a live feed of
individual handoffs between six internal departments (Tier-1 Support, Billing, Platform Eng, Trust & Safety,
Customer Success, Sales), paired with a chord diagram that shows the aggregate handoff volume between every pair
of departments for the selected reporting period.

Path: `app/src/app/dash-evolve/r45/c/page.tsx` (+ local components in the same folder). Theme: light/pure-white.
Accent: rose. Display face: `--font-display-grotesk` (large numbers and the wordmark only).

## Layout / composition

**Macro shell: feed-centric.** App shell = fixed left sidebar (brand lockup, workspace switcher, 5-item nav with
an active pill, bottom user block) + 44px-tall top bar (⌘K search button, a working "New routing rule" primary
button, notifications bell, avatar menu) + mobile drawer.

Main content, 12-col grid:
- A slim KPI row (4 cards, `xl:col-span-3`, 2-up from `sm`, 4-up from `xl`) — total handoffs (with a 6-period
  trend sparkline), department count, busiest-pair share, urgent-in-queue count. All KPI values render at
  `text-xl` (20px), strictly smaller than the chord's own headline number.
- **Routing feed** (`lg:col-span-7`) — the primary content: a deterministic list of 12 handoff events, each with
  a ticket id, priority badge, from→to department pair, agent avatar, age, and a per-row "Mark reviewed" toggle.
  A `Tabs` control filters by priority.
- **Department routing map** (`lg:col-span-5`, sticky on large screens) — the chord diagram, the page's dominant
  *quantitative* visualization (distinct from the qualitative feed to its left).
- **Full handoff matrix** (full width, below both) — the mandatory accessible fallback, always rendered.

No third, permanently-reserved "detail pane" exists anywhere on the page.

## Interactions (7, all real, deterministic, motion-reduce-respecting)

1. **Chord node/arc hover+focus+click** — hovering, tab-focusing, or clicking any department arc or any
   connecting ribbon highlights only its own connections in place (dims the rest) and updates the always-visible
   headline block with that selection's exact numbers. This is also the keyboard-accessible "tooltip" the brief
   requires for this chart type: every arc and ribbon is a real `tabIndex={0}` SVG element with a complete
   `aria-label` (e.g. "Tier-1 Support and Billing: 492 combined handoffs this week, 428 from Support to Billing
   and 64 from Billing to Support").
2. **Legend buttons** — a plain, always-visible, fully keyboard-reachable `<button>` per department that drives
   the exact same highlight as (1), for anyone who'd rather not navigate curved SVG paths.
3. **Period toggle** — segmented control (This week / This month) swaps the entire dataset feeding the KPI row,
   the chord diagram and the matrix.
4. **Matrix sort** — click any "To" column header (or "Total out") in the accessible fallback table to sort
   departments by that column; `aria-sort` kept in sync; same sort order mirrored into the mobile card list.
5. **Feed priority filter** — `Tabs` (All / Urgent / High / Normal) over the routing feed.
6. **Ephemeral "Mark reviewed"** — per-row, session-only, local to `RoutingFeed`; never read by anything else.
7. **⌘K command palette** — jump-focuses any department's chord node, switches period, or opens the rule drawer;
   the "New routing rule" top-bar button opens a drawer whose form really appends a new rule to a visible,
   growing "Active rules" list (not just a close-on-submit no-op).

## Font / weight discipline

Exactly 3 rendered weights across the whole route: `font-normal` (400), `font-medium` (500), `font-semibold`
(600) — no `font-bold`/`font-light` anywhere, including inside the SVG `<text>` elements. `--font-display-grotesk`
is applied only to the brand wordmark, the page `<h1>`, and the chord diagram's own big headline number.

## Chord fallback: how the adjacency table works

`AdjacencyTable` renders the same `from → to → value` data as a classic OD (origin/destination) matrix: rows =
"from" department, columns = "to" department, a "Total out" column (row sum) and a "Total in" footer row (column
sums) — both computed from the same `Flow[]` array the chord diagram reads, so the crossfoot always reconciles
with the grand total shown in the lead sentence. It is a real `<table>` with `<caption>`, `scope="col"`/`scope="row"`,
and `aria-sort`, always rendered — reachable without any JS state change, no "click to reveal" gate. Below `sm`
it switches to a `<dl>`-based card list carrying the identical per-department data (same component, same `sorted`
array), since the 8-column matrix cannot fit a 390px viewport even with `overflow-x-auto`.

## Why the selection mechanic has no separate consumer component

`ChordDiagram` owns one piece of state, `activeId`, entirely inside itself. Every consumer of that state — the
ribbon/arc opacity and color, the node label weight/color, and the always-visible headline block's big number,
title and breakdown rows — lives in the *same* component file and re-renders from the *same* `useMemo`. No prop
carrying the selection is ever passed to, or read by, `RoutingFeed`, `AdjacencyTable`, or any page-level state.
The headline block is not a second "detail" element either: it is the one block that both renders the
always-visible default readout (the busiest pair, pre-interaction) and mutates in place on hover/focus/click —
the chart *is* its own detail view, literally zero additional components react to `activeId`.

## 브리프에 없던 것

**① 부서(카테고리) 집합과 개수.** 브리프는 "a set of categories (e.g. cross-team handoffs...)"만 제시했다.
② 6개 고정 부서(Tier-1 Support/Billing/Platform Eng/Trust & Safety/Customer Success/Sales)로 확정했다.
③ 6은 코드 체인지 다이어그램이 과밀(curve-crossing D등급)해지지 않는 상한에 가까우면서, 실제 SaaS 지원 조직의 전형적 부서 분할과 맞아 서사가 선다.

**① 리본의 방향성 인코딩 방식.** 브리프는 "arc thickness encoding flow magnitude"만 명시했고, d3-chord식 완전
양방향 비대칭 리본(폭이 양 끝에서 다름)을 요구하지 않았다.
② 리본 폭은 A↔B의 **합산**(aToB+bToA) 값 하나로만 인코딩하고, 방향별 분해는 호버/포커스 시의 헤드라인 텍스트와
접근 테이블에서만 숫자로 보여주기로 했다.
③ 완전 양방향 서브아크 배치는 손으로 짠 좌표 수학의 버그 표면을 두 배로 늘리는데, 빌드/타입체크를 전혀 돌릴 수
없는 이번 제약상 검증 불가능한 복잡도를 추가하는 리스크가 수익보다 크다고 판단했다.

**① 노드 식별 색상의 출처.** 브리프는 "single accent principle(rose/sky 하나)"만 말했고, 6개 부서를 구분할
카테고리컬 팔레트는 지정하지 않았다.
② dataviz 스킬의 검증된 카테고리컬 8색 중 1~6번(blue/orange/aqua/yellow→c98500/magenta→d55181/green)을 고정
순서로, "항상 떠 있는 텍스트 라벨 옆의 작은 식별 틱"으로만 사용하고 로즈는 브랜드·포커스·선택 강조에만 썼다.
③ 칩/틱이 라벨 텍스트와 항상 동반되므로 "color alone" 규칙을 건드리지 않으면서도, 단일 로즈만으로는 6개 부서를
한눈에 구분할 수 없는 문제를 해결했다.

**① 선택 메커니즘의 트리거 모델(토글 vs 모멘터리).** 브리프는 "clicking/focusing a node...highlights...in place"
라고만 적어, 클릭 시 토글(고정)인지 일시적 호버인지 명시하지 않았다.
② hover/focus는 즉시 활성화·해제되는 모멘터리로, click은 같은 대상을 토글(고정/해제)하도록 했다.
③ 터치 기기에는 hover가 없으므로 click-토글이 없으면 모바일에서 이 메커니즘 자체를 쓸 방법이 없어진다.

**① 필수 접근 테이블의 위치.** 브리프는 "SHIP the mandatory fallback as a first-class citizen"라고만 했지,
차트와 같은 카드 안인지 별도 섹션인지는 정하지 않았다.
② 차트 카드 밖, 두 패널 아래에 전체 폭의 독립 카드/섹션으로 분리했다.
③ 30개 흐름을 모두 담은 매트릭스를 차트 카드 안에 넣으면 그 카드가 과도하게 길어지고, 차트의 헤드라인(가장
중요한 가시 정보)이 스크롤 없이 보이는 영역에서 밀려날 위험이 있었다.

**① "component system" 체크리스트(Tabs/Progress/Sparkline)를 실제로 어디에 쓸지.** 브리프는 이 세 컴포넌트를
"모두 로컬 파일로" 가지라고만 했고, 이 특정 대시보드 서사에 억지로 끼워 맞출 자리를 지정하지 않았다.
② Sparkline은 "Total handoffs" KPI 옆 6기간 트렌드로, Progress는 매트릭스의 "Total out" 셀 아래 점유율 바로,
Tabs는 피드의 우선순위 필터로 각각 자연스러운 자리를 찾아 넣었다.
③ 억지 삽입처럼 보이지 않으면서도, 세 컴포넌트가 실제로 해당 화면의 서사(트렌드/점유율/필터)에 기여하게 했다.
