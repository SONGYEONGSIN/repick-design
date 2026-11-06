# Candidate B — Kelvin (Revenue Mix Board)

## Concept (one line)

**Kelvin** is a subscription revenue-mix console for SaaS finance/RevOps teams — a dark, teal-accented, kanban-style board whose single dominant visualization is a Marimekko (Mekko) chart of ARR by region (column width) × plan tier (column height stack).

## Structure

- **Macro shell: board/kanban-centric.** The Mekko board (`MekkoBoard.tsx`) IS the board's visual anchor: each region renders as a kanban-style "list" — a header chip (code + ARR) sitting above a column whose internal stacked blocks are the plan-tier "cards," scaled by height. There is no fixed-rail + always-populated third detail pane; the layout is KPI row → [Mekko board | Region Spotlight] in a 12-col grid (8/4 split at `xl`+) → full-width fallback table.
- **Dominant chart: Marimekko**, built from plain CSS (no SVG, no chart library). Column *widths* come from a single CSS Grid whose `gridTemplateColumns` uses each region's own ARR figure as its `fr` value, so width can never drift from the underlying numbers. Column *heights* are percentages derived from `tierShareOfRegionPct()`, rounded to 2 decimals via a shared `round2()` helper in `data.ts`. A "Share mix" / "Revenue scale" segmented control toggles whether every column fills the full track (classic normalized Marimekko) or is scaled to its own ARR relative to the largest region (bars read as true proportional heights) — same dataset, same internal tier ratios, just a different vertical anchor.
- **Always-visible headline readout.** The board's own headline — total ARR ($12.0M) plus "Scale leads the tier mix… / North America is the largest region…" — renders as plain text at `text-4xl` (36px), strictly larger than any KPI tile (`text-xl`, 20px, see `KpiRow.tsx`). It is never hover-gated.
- **Required accessible fallback: `BreakdownTable.tsx`.** A real `<table>` (region rows × tier columns + a Total column, plus a `<tfoot>` totals row), `caption`, `scope="col"`/`scope="row"`, `aria-sort`, sortable by any column, always present in the DOM below the board (no interaction needed to reach it). Below `sm` it swaps to a card list (`sm:hidden` / `hidden sm:block`) instead of letting a table scroll — and there is exactly zero `overflow-x-auto` anywhere on the page (the Mekko itself never scrolls either: `fr`-based tracks always sum to 100% of the available width), so the "two scrollers" trap can't occur.
- **Component system**, each local to this folder: `Card`, `SegmentedControl`, `MiniStack` (teal-ramp proportional bar), `cn`, `downloadCsv` (`ui.tsx`); sortable table with `SortHeader` (`BreakdownTable.tsx`); dropdowns/popovers (workspace switcher, notifications, account menu in `Sidebar.tsx`/`Topbar.tsx`); command palette (`CommandPalette.tsx`).

## Selection fan-out — two independently-scoped mechanisms (the axis this brief weights most)

1. **Ephemeral hover/focus tooltip on the Mekko.** `hovered` is `useState` local to `MekkoBoard.tsx` only. Hovering or keyboard-focusing any tier segment (each is a real, tabbable `<button>` with its own `aria-label` carrying the exact figure) shows a small floating tooltip anchored to that column. It changes nothing else on the page — not the pin, not the table, not the KPI row — and clears on blur/mouse-leave.
2. **Click-to-pin on a column header → Region Spotlight only.** Clicking a region's kanban-header chip calls `onPinRegion`, which is lifted to `Dashboard.tsx` as `pinnedRegionId` and passed to exactly one consumer, `RegionSpotlight.tsx` (plus a visual "pinned" ring on the header chip itself, the producer). The Mekko board's own rendering and the fallback table are **not** parameterized by `pinnedRegionId` at all — both always show every region, regardless of what's pinned. `RegionSpotlight` defaults to the largest region (North America, by `regionsByRank()[0]`) at first paint, so it is never an empty "click a region to see details" placeholder. The command palette's "Pin ⟨region⟩" actions and the ⌘K search also write to this same single-consumer channel — still only ever touching `RegionSpotlight`.

These two mechanisms live in non-overlapping widgets and never merge into one shared "selectedId" that threads through the chart, the table and a detail pane simultaneously.

## Interactions (5 implemented, all `'use client'`, deterministic, `motion-safe:`-gated)

1. **Mekko view toggle** — "Share mix" vs. "Revenue scale" segmented control (interaction #1 above).
2. **Hover/focus tooltip on the dominant chart** — ephemeral, keyboard-accessible (interaction #2 above).
3. **Click-to-pin column header → Region Spotlight** — the scoped-consumer mechanism (interaction #3 above).
4. **Real table sort** — `BreakdownTable.tsx`, sortable by region name or any of the four tier columns or the total, with `aria-sort` kept in sync.
5. **⌘K command palette** — search/jump across regions, view toggle, and export, all wired to real handlers (not a static list).

Also real (not decorative): the header "Export mix (CSV)" button and the palette's "Export… as CSV" action both call `downloadCsv()`, which builds a CSV client-side and triggers a real browser download of the full region × tier matrix — never a no-op button.

## Font / weight discipline

- Body/UI copy: `var(--font-sans)` default (never overridden).
- Display font: exactly one, `var(--font-display-mono)` (JetBrains Mono Display), used only for the brand wordmark ("Kelvin" in the sidebar) and the Mekko board's one large headline ARR figure and the page `<h1>`. No second display face anywhere.
- Exactly three rendered weights on the whole route: `font-normal` / `font-medium` / `font-semibold` (verified by grep — zero `font-bold`/`font-light`/etc. occurrences across all files in this folder).
- All dollar and account figures use `tabular-nums` and are right-aligned in every table column; percentage labels use one consistent `formatPercent()` helper everywhere they appear (headline, legend, tooltip, spotlight, table) so the same underlying number is never independently re-typed or re-rounded in two places.
- Dark contrast floor respected: every secondary/caption text in this folder is `text-zinc-400` or lighter — audited with `grep` for `text-zinc-500`/`text-zinc-600` across the folder (zero matches on dark surfaces).
- Single accent principle: teal is the only brand hue (buttons, focus rings, active nav/tabs, notification dot). The Mekko's four plan-tier blocks are a **monochrome teal ramp** (`teal-800`/`600`/`400`/`200`) rather than a second palette, so the chart's own data encoding reinforces the one-hue rule instead of working against it; non-brand status colors (emerald/rose) are reserved for the one semantic "new ARR" delta, matching this codebase's established convention of keeping brand accent and status color separate.

## Reconciliation (how the numbers can't drift)

`data.ts` stores ARR **only** as four tier figures per region; every region total, the grand total, each tier's grand total, every share percentage, and the "Active accounts" KPI are *derived* functions over that one source array (`regionTotal`, `grandTotal`, `tierTotal`, `regionSharePct`, `tierShareOfRegionPct`, `tierShareOfGrandPct`, `totalAccounts`, etc.) — nothing is a second hand-typed literal. The headline ($12.0M total, Scale leads at 30.0%/$3.6M, North America largest at 40.2%/$4.82M), the KPI tile, the legend, the tooltip, the spotlight card and the fallback table's `<tfoot>` totals row all call the *same* functions, so they cannot contradict one another. Region account counts (612/398/201/54/19) sum to exactly 1,284, matching the "Active accounts" KPI tile verbatim.

## Mekko fallback table — how it works

`BreakdownTable.tsx` renders unconditionally in the DOM directly below the board (no click/toggle needed to reach it): a semantic `<table>` with `<caption>`, `scope="col"` sort headers (`aria-sort="ascending"|"descending"|"none"`), `scope="row"` region names, a `<tfoot>` totals row, and real click-to-sort on every column (region name, each of the four tiers, or total). Below `sm` the table is replaced (`sm:hidden`) by a card-list view (`hidden sm:block` on the table) showing the same figures per region with tier swatches paired with text labels, so color is never the sole carrier of meaning and nothing needs horizontal scrolling at 390px.

## 브리프에 없던 것

- **① 무엇을 정해야 했는가:** 제품/브랜드/도메인 자체 (브리프는 "revenue by region × plan tier" 예시만 제시).
  **② 무엇으로 정했는가:** "Kelvin" — SaaS Finance/RevOps 팀을 위한 구독 매출 믹스 콘솔. 리전별 ARR을 플랜 티어로 쪼개 보는 것이 Mekko 차트의 가장 자연스러운 적용처라고 판단.
  **③ 왜:** "Kelvin"이라는 이름 자체가 온도 단위(차가움=teal 계열과 연상)로 액센트 컬러와 톤이 잘 맞고, 최근 라운드들의 FinOps/observability 도메인과 겹치지 않도록 매출·구독 분석이라는 다른 업종을 선택함.

- **① 무엇을 정해야 했는가:** Marimekko를 SVG로 그릴지 CSS(div/grid)로 그릴지 — 브리프는 "generated SVG/CSS" 둘 다 허용.
  **② 무엇으로 정했는가:** 순수 CSS Grid(`fr` 단위) + 퍼센트 높이의 실제 `<button>` 엘리먼트.
  **③ 왜:** 세그먼트 각각을 진짜 포커스 가능한 `<button>`으로 만들어야 키보드 접근성(hover/focus 동시 트리거)을 자연스럽게 구현할 수 있고, SVG 안에서 `tabIndex`/포커스 스타일을 다루는 것보다 훨씬 신뢰도 높게 테스트 가능. 또한 `fr` 단위는 폭 비율이 숫자 데이터와 항상 정확히 일치함을 CSS 레이아웃 엔진이 보장해 주므로, 수동으로 퍼센트 폭을 계산해 어긋날 위험이 사라짐.

- **① 무엇을 정해야 했는가:** "Share mix" 대 "Revenue scale" 두 번째 뷰가 정확히 어떤 수학적 관계를 가질지(브리프는 "view toggle" 예시만 제시, 구체적 의미는 지정하지 않음).
  **② 무엇으로 정했는가:** 두 모드 모두 티어 내부 비율(`tierShareOfRegionPct`)은 동일하게 유지하고, 컬럼 전체 높이만 "항상 100%"(Share) 대 "최대 리전 대비 비례"(Scale)로 바꿈.
  **③ 왜:** 데이터셋을 두 벌 만들지 않고도(즉 두 번째 분기별 데이터를 새로 만들어 반드시 재정합해야 하는 위험을 피하고) 동일한 소스 숫자에서 두 가지 읽기를 제공할 수 있는 가장 안전한 방법이라고 판단.

- **① 무엇을 정해야 했는가:** Pin(클릭) 상호작용이 토글(다시 클릭하면 해제)인지 항상-하나-고정인지.
  **② 무엇으로 정했는가:** 토글 없음 — 항상 정확히 한 리전이 고정되어 있고, "Reset to largest" 버튼으로만 기본값(최대 리전)으로 되돌릴 수 있음.
  **③ 왜:** 브리프가 소비 위젯이 빈 placeholder로 시작해서는 안 된다고 명시했고, 토글 해제를 허용하면 "아무것도 고정 안 됨" 상태가 다시 생겨 그 규칙을 어기게 됨.

- **① 무엇을 정해야 했는가:** KPI 타일에 올릴 "New ARR (QTD)" 같은 보조 지표가 차트의 다른 숫자와 산술적으로 연결되어야 하는지.
  **② 무엇으로 정했는가:** 의도적으로 독립된 흐름(flow) 지표로만 제시 — 화면의 어떤 "이전 총계"와도 "신규 ARR = 이번 총계 − 이전 총계"라는 관계를 명시적으로 암시하지 않음.
  **③ 왜:** 브리프의 "derived-statistic consistency" 함정을 피하려면, 두 숫자가 수학적으로 연결된 것처럼 보이는 표현을 만들지 않는 것이 가장 안전함 — 화면에 없는 "지난 분기 총계"를 추론하게 만드는 표현을 아예 쓰지 않음.

- **① 무엇을 정해야 했는가:** 1920px에서의 max-w 캡 여부 (브리프는 공식만 주고 "자신의 쉘로 계산하라"고 명시).
  **② 무엇으로 정했는가:** max-w 캡을 전혀 사용하지 않음 — 메인 콘텐츠는 사이드바(256px) + `lg:px-8`(양쪽 32px) 패딩만 뺀 나머지 전체 너비를 그대로 씀.
  **③ 왜:** `fr` 기반 그리드와 테이블은 캡 없이도 1920px에서 자연스럽게 늘어나며 가독성을 해치지 않고, 캡을 걸 필요가 없는 레이아웃이라면 굳이 임의의 값을 정해 그 값이 1660px 규칙을 만족하는지 계산하는 리스크를 질 필요가 없다고 판단함 (우측 여백은 `lg:px-8`=32px로 ≤40px 규칙을 그대로 만족).
