# Candidate A — Ration (Cost Allocation console)

## Concept (one line)

**Ration** is a FinOps console for engineering orgs — a dark, amber-accented, master-detail dashboard that allocates cloud spend across teams, service categories and individual resources, with a squarified-style treemap as its one dominant visualization.

## Structure

- **Macro shell: master-detail.** A master list of teams (`teams-rail.tsx`) on the left scopes everything in the detail area on the right (treemap, breadcrumb/subtotal card, pinned-resource card, tree-table, resources table) to the selected team. The split is stacked on top of each other below `2xl` (1536px) and side-by-side only at `2xl`+, so the detail column always has generous width for its table at 1280/1440 — see the gap note below.
- **Dominant chart: Treemap** (`cost-treemap.tsx` + `treemap.ts`). Hand-built, deterministic, no chart library: a recursive bisection ("slice-and-dice") layout computed in a fixed 240×100 logical box and rendered as absolutely-positioned `<button>` tiles sized by CSS percentage. Every tile always shows its name and dollar value as real text (never hover-only). Clicking a top-level (category) tile drills into its resources; clicking a drilled-in (resource) tile pins it.
- **Required accessible fallback: `tree-table.tsx`.** A full `<table>` with one collapsible row per category and a plain row per resource underneath — the same figures the treemap shows, fully keyboard-navigable (native `<button>` disclosure toggles with `aria-expanded`), defaulting to **all expanded** so the complete breakdown is visible without any interaction.
- **Tier-1 selection fan-out — two independent selections, each on its own dominant widget:**
  1. **Treemap drill** (`drillCategoryId`, owned by `page.tsx`, acted on inside `cost-treemap.tsx`) drives only `breadcrumb-card.tsx` (breadcrumb trail + subtotal readout). Defaults to the team's top level — never an empty state.
  2. **Table pin** (`pinnedResourceId`, acted on inside `resources-table.tsx`, also reachable from a treemap leaf tile and from the command palette) drives only `pinned-resource-card.tsx` (cost vs. last month, utilization vs. category average, status). It is a **global** resource id, not scoped to the active team or the drill path, so it survives switching teams — proving the two selections truly never touch each other. Defaults to an anomalous resource (`platform-logs-bucket`) so the card never renders a "pin something" placeholder.
- **Component system**, each in its own file: `Card`, `StatusBadge`, `Delta`, `Avatar`, `ProgressBar`, `Sparkline`, `SegmentedControl`, `Tabs`, `SortHeader`/`SortIcon` (all in `ui.tsx`); sortable/filterable data table (`resources-table.tsx`); dropdowns/popovers (workspace switcher, notifications, account menu in `sidebar.tsx`/`topbar.tsx`); command palette (`command-palette.tsx`).

## Interactions (5 implemented, all `'use client'`, deterministic, `motion-reduce`-gated via `motion-safe:`)

1. **Hover/focus inspector on the dominant chart** — hovering or focusing any treemap tile (keyboard-accessible: it's a real `<button>`, triggered by `onFocus`/`onBlur` as well as mouse) fills a line below the grid with extra stats (share of parent, utilization, status) for that tile; defaults to the largest tile so it's never empty.
2. **Real sort + filter on the resources table** — three sortable columns (`aria-sort`) plus a status segmented-control filter (All/OK/Idle/Alert), pure array methods, no randomness.
3. **Period toggle** — "October 2026" / "September 2026" segmented control re-derives every KPI, the treemap, the tree-table and the resources table from the same underlying resource records.
4. **Selection → multi-widget sync (tier-1, described above)** — treemap drill and table pin, two independent states on two different widgets.
5. **⌘K command palette** — searches teams and resources; selecting a resource sets both the active team and the global pin in one action.

Bonus: a `Tabs` control in the teams rail re-sorts the team list by spend or by budget variance (real, functional, not decorative — added specifically to exercise the `Tabs` component since nothing else in the layout needed one).

## Font / typography confirmation

- Body, UI and all copy: `var(--font-sans)` (Pretendard) — never overridden.
- Display font: `var(--font-display-grotesk)` (Space Grotesk Display) applied only to Latin large text — the wordmark ("Ration"), the page `<h1>`, and the three large KPI-style numbers (KPI tiles, breadcrumb subtotal, pinned-resource cost). No second display face used anywhere.
- Exactly three rendered weights throughout: `font-normal` / `font-medium` / `font-semibold`. No `font-bold`/`font-light`/etc. anywhere in the route.
- All money/percent/utilization figures use `tabular-nums` and are right-aligned in every table column.
- Labels are `text-[11px] uppercase tracking-[0.06em]`.
- Dark floor respected: no text color darker than `zinc-400` anywhere (checked: all secondary text is `text-zinc-400`, never `-500`/`-600`).
- Single accent (amber) carries the brand everywhere **except** the treemap's own data encoding, which is a strict amber monochrome rank scale (`bg-amber-400`→`900` by rank, each paired with a contrast-checked text color — 400/500/600 get `text-zinc-950` at 11.9:1/9.1:1/6.2:1, 700/800/900 get `text-zinc-50` at 4.8:1+/6.8:1+), so the chart never introduces a second hue and every tile clears 4.5:1 regardless of which rank lands on it.

## 브리프에 없던 것

- **① 무엇을 정해야 했는가:** 제품/브랜드/도메인 자체 (브리프는 "cloud infrastructure cost allocation by team/service" 등을 예시로만 제시).
  **② 무엇으로 정했는가:** "Ration" — 팀·서비스 카테고리·리소스 단위로 클라우드 비용을 배분하는 FinOps 콘솔.
  **③ 왜:** Treemap(계층적 비율)과 master-detail(팀 목록→세부 비용) 셰이프가 가장 자연스럽게 맞아떨어지는 도메인이고, 최근 6라운드 어떤 후보와도 도메인이 겹치지 않음.

- **① 무엇을 정해야 했는가:** 트리맵 레이아웃 알고리즘의 구체적 구현 (squarified vs slice-and-dice, 둘 다 브리프가 허용).
  **② 무엇으로 정했는가:** 재귀적 이분(binary bisection) slice-and-dice — 매 단계 값의 절반 지점에서 분할하고 분할마다 방향을 교대.
  **③ 왜:** 빌드/린트를 직접 돌릴 수 없는 환경이라, "worst aspect ratio" 탐색이 필요한 완전한 squarified보다 정확성을 수학적으로 직접 검증하기 쉬운 알고리즘을 택함 (실제로 면적 비율이 정확히 일치하는지 수동 계산·스크립트로 검증함). 그러면서도 단일 스트립이 아닌 진짜 2차원 타일을 만들어 시각적으로도 트리맵답게 보이도록 함.

- **① 무엇을 정해야 했는가:** Pin 상호작용의 정확한 의미 — 클릭 시 토글(해제 가능)인지, 항상 하나가 고정된 상태를 유지하는지.
  **② 무엇으로 정했는가:** 토글 없음 — 항상 정확히 하나의 리소스가 고정되어 있고, 다른 행을 클릭하면 그 리소스로 바뀔 뿐 "아무것도 고정 안 됨" 상태로는 돌아가지 않음.
  **③ 왜:** 브리프가 "pin 소비 위젯이 기본 상태에서 빈 'select something' placeholder를 렌더링해서는 안 된다"고 명시적으로 경고했고, 토글을 허용하면 그 금지된 상태를 재도입하게 됨. 대신 기본값을 이례적인(anomalous) 리소스로 지정해 처음 진입부터 유의미한 비교가 보이게 함.

- **① 무엇을 정해야 했는가:** 팀을 전환할 때 트리맵의 드릴다운 상태(`drillCategoryId`)를 초기화할지.
  **② 무엇으로 정했는가:** 초기화하지 않음 — 카테고리 id(`compute`/`storage`/`database`/`networking`)가 모든 팀에 공통이므로, "Compute만 보고 있자"는 렌즈를 유지한 채 팀을 바꿔도 됨.
  **③ 왜:** 더 매끄러운 사용성이고, Pin 상태(완전히 전역)와 대비되는 "부분적으로 유지되는" 상태를 보여줘 두 선택 상태가 서로 다른 스코프 규칙을 가진다는 점을 분명히 함.

- **① 무엇을 정해야 했는가:** master-detail 분할이 어느 뷰포트 너비부터 좌우로 나뉘는지 (브리프는 1280/1440/1920 모두에서 가로 스크롤 없이 동작해야 한다고만 요구).
  **② 무엇으로 정했는가:** `2xl`(1536px) 이상에서만 좌우 분할, 그 아래(1280/1440 포함)에서는 세로로 쌓음.
  **③ 왜:** 1280px에서 사이드바(256px)+패딩을 뺀 나머지를 teams-rail(3/12)과 detail(9/12)로 쪼개면 리소스 테이블에 ~700px밖에 남지 않아 셀 내용이 비좁아짐. 세로로 쌓으면 1280/1440에서도 테이블이 거의 전체 콘텐츠 너비(~960–1120px)를 그대로 쓸 수 있어 colgroup % 계산이 훨씬 안전해짐.

- **① 무엇을 정해야 했는가:** 1920px에서의 max-w 캡 값 (브리프는 공식만 주고 "자신의 실제 쉘로 계산하라"고 명시).
  **② 무엇으로 정했는가:** `max-w-[1600px]`. 계산: 1920 − 사이드바 256px − 메인 좌우 패딩 64px(`px-8` 양쪽) = 1600, 즉 요구되는 최솟값과 정확히 일치 → 남는 간격은 `mx-auto`로 양쪽에 32px씩, ≤40px 조건을 만족.
  **③ 왜:** 공식이 요구하는 하한에 딱 맞춰 콘텐츠 폭을 최대로 쓰면서도 여유 간격 조건을 안전하게 통과.

- **① 무엇을 정해야 했는가:** 치명적 비용 카테고리 체계(브리프는 도메인만 제시, 구체적 분류는 없음).
  **② 무엇으로 정했는가:** Compute / Storage / Database / Networking 4개로 고정, 모든 팀에 공통 적용.
  **③ 왜:** 실제 클라우드 비용 리포트(AWS/GCP/Azure Cost Explorer류)에서 흔히 쓰는 상위 카테고리이고, 4개로 제한해야 모바일 390px에서도 트리맵 상위 타일 텍스트가 항상 읽힐 만큼 각 타일의 최소 지분을 확보할 수 있었음(카테고리를 5개 이상으로 늘렸을 경우 최소 지분 타일이 너무 작아짐).

- **① 무엇을 정해야 했는가:** 두 번째로 필요한 "기간" 데이터 세분화 수준 (분기/월/주 중 무엇으로 period toggle을 구현할지).
  **② 무엇으로 정했는가:** 딱 두 기간 — "이번 달"과 "지난 달"만.
  **③ 왜:** 모든 상위 집계(팀/카테고리/회사 전체)가 리소스 레벨 숫자에서 파생되도록 설계했기 때문에, 기간을 늘릴 때마다 48개 리소스 × 기간 수만큼 손으로 입력한 숫자가 늘어남. 두 기간이면 "period toggle" 상호작용과 전·후 비교(Delta)를 모두 보여주면서도 수기 데이터의 정합성을 직접 검증 가능한 범위로 유지.

- **① 무엇을 정해야 했는가:** 어떤 컴포넌트에 `Tabs`를 자연스럽게 배치할지 (브리프의 컴포넌트 시스템 목록에 tabs가 요구되지만, 레이아웃 설계상 자연스러운 탭 UI 자리가 없었음).
  **② 무엇으로 정했는가:** teams-rail에 "By spend / By budget variance" 정렬 전환 탭을 추가.
  **③ 왜:** 장식용으로 탭을 끼워 넣기보다, 실제로 동작하는 두 번째 정렬 기준을 주는 편이 "진짜 상호작용만"이라는 원칙에 맞음.
