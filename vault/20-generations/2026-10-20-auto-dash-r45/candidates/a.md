# Candidate A — Vendly (Vendor Renewal Intelligence)

## Concept (one line)

**Vendly** is a vendor-renewal-intelligence console for procurement/vendor-ops teams — a real light (pure white/zinc-50), indigo-accented workspace whose single dominant visualization is a **parallel-coordinates chart** comparing six active SaaS vendor contracts across six metric axes (cost, seats, utilization, renewal risk, SLA, YoY price change).

## Structure

- **Macro shell: master-detail.** `VendorComparisonPanel.tsx` is one `Card` containing a left entity-picker rail (the six vendors) and a right pane that *is* the chart itself — no third, always-populated detail pane sits beside it. Page order: KPI row (`grid-cols-2 xl:grid-cols-4`) → the comparison panel (rail + chart, `lg:grid-cols-12`, 4/8 split) → a full-width fallback table card.
- **Dominant chart: parallel coordinates**, hand-built as plain SVG (`viewBox`, no chart library). Six vertical axes at fixed `x` positions (`30,162,294,426,558,690`), each independently normalized against `axisDomain()` (min/max of the active period's six vendors), `y` rounded to 2 decimals via `round2()`. Each vendor's polyline ends in a two-letter code (`NB`, `FC`, `LD`, `HS`, `QB`, `TD`) so identity never depends on line color alone.
- **Always-visible headline readout.** "Highest renewal risk this cycle: *Loomwork Docs* — **61/100**" renders as plain text (`text-3xl`/`sm:text-4xl`, 30/36px), computed fresh from `highestRiskVendor(period)` on every render — never hover-gated, and it correctly re-points to a *different* vendor (Quillix Billing, 60/100) when the period toggle switches to the prior cycle, proving it isn't hardcoded.
- **Required accessible fallback: `VendorTable.tsx`.** A real `<table>` (visible `<caption>`, `scope="col"`/`scope="row"`, `aria-sort`), sortable by any of its seven columns, plus an "at-risk only" filter toggle — sitting directly in the DOM below the chart, reachable without any state change. Below `sm` it becomes a card list (`sm:hidden` / `hidden sm:block` on the table) instead of letting six columns scroll, and the chart itself never scrolls (pure `viewBox` responsive scaling), so there is exactly one `overflow-x-auto` on the whole page.
- **Component system**, each local to this folder: `Card`, `SegmentedControl`, `Tabs`, `StatusBadge`, `Delta`, `Avatar`, `ProgressBar`, `Sparkline`, `SortHeader`/`SortIcon` (`ui.tsx`); dropdowns/popovers (workspace switcher, notifications, account menu in `sidebar.tsx`/`topbar.tsx`); command palette (`command-palette.tsx`).

## Selection fan-out — built to the brief's best-ranked tier

There is **no separate detail component at all.** `pinnedId` and `hoverId` are `useState` local to `VendorComparisonPanel.tsx` only. The entity rail, the chart's highlighted polyline, the ephemeral inspector line, and the "same-component becomes its own detail" accordion (Metrics / Cost-trend tabs) below the chart are four renderings of that *one* component's own state — not separate consumer components reacting to a shared id threaded down from `page.tsx`. `page.tsx` never holds or passes a vendor id anywhere; it only passes `period` (a view filter, not a selection).

- **Ephemeral hover/focus preview** (`hoverId`): hovering a rail row, hovering a polyline's invisible hit-path, or Tab-focusing a rail row all set the same transient state. It is cleared on blur/mouse-leave and never writes to `pinnedId`.
- **Committed pin** (`pinnedId`, click/Enter on a rail row or a polyline): highlights that polyline solid-indigo and drives the accordion detail below. Defaults to `DEFAULT_PINNED_ID` (the highest-risk vendor, computed from the data, not guessed) — never an empty "select a vendor" placeholder.
- **The command palette is not a third consumer.** Its vendor "quick-jump" items call `document.getElementById('rail-vendor-<id>').focus()` — a plain DOM call, not a prop or piece of React state. Focusing that button triggers the exact same ephemeral preview a mouse hover would, through the browser's own focus event, so the palette can never regress this into a shared-`selectedId` pattern.

## Interactions (5 implemented, all `'use client'`, deterministic, `motion-safe:`-gated)

1. **Ephemeral hover/focus tooltip-equivalent** — the inspector line under the chart, keyboard-accessible via Tab (interaction #1 above).
2. **Click/Enter pin → in-place accordion detail** (interaction #2 above), with its own `Tabs` (Metrics / Cost trend) and a `ProgressBar` + `Sparkline` paired with printed numbers.
3. **Period segmented control** ("Current renewal cycle" / "Prior renewal cycle") — swaps the dataset driving the KPIs, the chart, and the table at once.
4. **Real table sort** — `VendorTable.tsx`, sortable by name or any of the six metric columns, `aria-sort` kept in sync, default sort = Risk desc.
5. **"Show at-risk only" filter toggle** on the fallback table — purely local to the table, doesn't touch selection state.

Also real (not decorative): the header "Export comparison CSV" button builds a CSV client-side from `VENDOR_LIST`/`AXES` and triggers a real download — never a no-op button. The ⌘K command palette is itself a sixth, navigation-only interaction (scroll-to-section, vendor quick-focus).

## Font / weight discipline

- Body/UI copy: `var(--font-sans)` default (Pretendard, never overridden).
- Display font: exactly one, `var(--font-display-wide)` (Archivo Display), used only for the sidebar wordmark ("Vendly") and the page `<h1>` ("Vendor Comparison"). No second display face anywhere, and never on the chart's own headline (that uses size/weight/color on the body face instead, per the "build hierarchy without more weights" instruction).
- Exactly three rendered weights on the whole route: `font-normal` / `font-medium` / `font-semibold` — grepped for `font-bold`/`font-light`/`font-extrabold`/`font-black`/`font-thin` across every file in this folder: zero matches. Every `<th>`/`<caption>` that carries visible text has an explicit weight class, so no browser UA-stylesheet bold ever sneaks in as a fourth weight.
- All numeric figures use `tabular-nums`, right-aligned in every table column. Axis labels are 11px uppercase with `tracking-[0.06em]`, applied consistently.
- Contrast floor respected per-surface: `text-zinc-500` only on the plain white/zinc-50 canvas; bumped to `text-zinc-600` wherever a caption can sit on a tinted background (the rail's pinned/preview `indigo-50`/`zinc-50` rows) — see the inline comment at that exact call site in `vendor-comparison-panel.tsx`.

## Reconciliation (how the numbers can't drift)

`data.ts` stores each vendor's `current`/`prior` metrics as two authored literals; every portfolio figure (`totalCost`, `averageUtilization`, `atRiskVendors`, `highestRiskVendor`, `highestPriceChangeVendor`) is a function over that one source, called identically by the KPI row, the chart's headline, the inspector line, the accordion, and the table — never re-typed. The *current* cycle's "YoY Price Change" axis is itself derived from `(current - prior) / prior`, hand-verified for all six vendors (e.g. Loomwork: `(42000-38000)/38000 = +10.5%`) so it can never contradict the cost figures shown next to it; the *prior* cycle's own YoY figure has no third data point to derive from and is authored independently, never implying a relationship the page doesn't show. Each vendor's 6-point `costHistory` sparkline ends in exactly `[prior, current]`, so the sparkline and the printed cost figures can never disagree. Total spend ($579,000 current / $554,500 prior, +4.4%) and average utilization (79.0% / 74.8%, +4.2pp) were hand-summed and cross-checked before being left as runtime `reduce()`s rather than hardcoded.

## Parallel-coordinates fallback table — how it works

`VendorTable.tsx` renders unconditionally in the DOM directly below the chart: a semantic `<table>` with a visible `<caption>`, `scope="col"` sort headers (`aria-sort="ascending"|"descending"|"none"`), `scope="row"` vendor names, and click-to-sort on every numeric column, defaulting to Risk-descending (matching the chart's own headline emphasis). An "at-risk only" toggle filters both the table and nothing else. Below `sm` the table is replaced (`sm:hidden`) by a card list (`hidden sm:block` on the table) showing the same six metrics per vendor as labeled chips, so nothing needs horizontal scroll at 390px and color is never the only cue for status (an icon + text badge accompanies it everywhere).

## 브리프에 없던 것

- **① 무엇을 정해야 했는가:** 비교 대상 엔티티와 산업 도메인 자체 (브리프는 "vendors, pricing plans, customer cohorts, infrastructure regions" 중 선택지만 제시).
  **② 무엇으로 정했는가:** "Vendly" — SaaS 벤더 갱신/비용 인텔리전스 콘솔. 6개 가상 SaaS 벤더 계약을 비용·좌석·활용률·갱신 리스크·SLA·전년 대비 가격 변동 6축으로 비교.
  **③ 왜:** "Renewal Risk"라는 축이 자연스럽게 병렬좌표의 "헤드라인(어떤 엔티티가 가장 위험한가)" 역할을 할 수 있고, 최근 라운드들의 FinOps/observability 도메인과 겹치지 않으면서도 실제 B2B SaaS 조달팀이 쓸 법한 현실적인 제품 콘셉트이기 때문.

- **① 무엇을 정해야 했는가:** 선택-팬아웃 "최상 티어"(동반 소비 컴포넌트 없음)를 지키면서도 브리프가 요구하는 "좌측 엔티티-피커 레일 + 우측 차트" 마스터-디테일 쉘을 동시에 만족시키는 방법 (레일이 따로 존재하면 보통 그 자체가 "두 번째 컴포넌트"가 되기 쉬움).
  **② 무엇으로 정했는가:** 레일과 차트와 아코디언 디테일을 전부 *하나의* 클라이언트 컴포넌트(`VendorComparisonPanel.tsx`) 안의 로컬 `useState`로 묶고, `page.tsx`는 어떤 벤더 id도 들고 있지 않음.
  **③ 왜:** 브리프가 명시한 순위에서 "공유 selectedId가 2개 이상의 소비 컴포넌트로 흐르는 것"이 나쁜 것이지, "시각적으로 분리된 두 패널"이 나쁜 것은 아니라고 해석함 — 같은 React 컴포넌트가 여러 DOM 블록을 반환하는 것은 선택 상태의 "소비자 수"를 늘리지 않으므로, 쉘 요구사항과 팬아웃 랭킹을 동시에 만족시키는 가장 안전한 해석이라고 판단.

- **① 무엇을 정해야 했는가:** ⌘K 커맨드 팔레트가 차트의 선택(핀) 상태와 어떻게 상호작용해야 하는지 (브리프는 검색 버튼의 실제 동작만 요구하고, 팔레트와 선택 모델의 관계는 명시하지 않음).
  **② 무엇으로 정했는가:** 팔레트는 React 상태를 전혀 건드리지 않고, 벤더 항목을 클릭하면 `document.getElementById('rail-vendor-<id>').focus()`만 호출함 — 포커스가 옮겨가면서 "자연스럽게" 호버와 동일한 미리보기가 뜨지만, 이는 DOM 이벤트일 뿐 prop/상태 연결이 아님.
  **③ 왜:** 팔레트를 선택 상태의 네 번째 소비자로 만들지 않기 위한 가장 확실한 방법이 "상태를 공유하지 않는 것"이라고 판단 — prop이나 id를 전혀 두지 않으면 팬아웃 랭킹 위반 여부를 따질 필요조차 없어짐.

- **① 무엇을 정해야 했는가:** 병렬좌표 차트가 좁은 화면(390px)에서 가로 스크롤을 가져야 하는지, 아니면 그대로 축소돼야 하는지 (브리프는 "두 개의 overflow-x-auto 금지"만 명시하고 차트 자체의 모바일 전략은 지정하지 않음).
  **② 무엇으로 정했는가:** 차트에는 `overflow-x-auto`를 전혀 쓰지 않고, `viewBox="0 0 720 280"` + `width:100%`로 순수 비율 축소만 적용. 테이블 쪽의 `overflow-x-auto`(640px 이상에서만 활성)와 절대 동시에 가로 스크롤 컨테이너가 되지 않도록 함.
  **③ 왜:** 두 개의 가로 스크롤러가 겹칠 때 모바일 스크롤 폭 계측이 깨진다는 함정을 원천적으로 피하는 가장 단순한 방법은 "스크롤러를 하나만 만드는 것"이라고 판단. 390px에서 축의 글자가 작아지는 대가는 감수했고, 그 정보는 바로 아래 접근성 폴백 테이블(카드 리스트)이 정확한 값으로 전부 커버함.

- **① 무엇을 정해야 했는가:** KPI 타일의 숫자 크기와 차트 헤드라인의 숫자 크기 중 "실제로 더 커야 하는 것"이 차트의 벤더 *이름*인지 *숫자*인지 (브리프는 "대시보드의 지배적 시각화 자체의 주요 데이터 텍스트"라고만 표현).
  **② 무엇으로 정했는가:** 벤더 이름은 `text-xl/text-2xl`, 리스크 숫자(`61/100`)는 `text-3xl/text-4xl`로 — 숫자가 더 크도록 뒤바꿈.
  **③ 왜:** "데이터 텍스트"는 이름이 아니라 실제 측정값(숫자)이라고 해석했고, 모든 브레이크포인트에서 KPI 타일의 `text-xl`(20px)보다 명백히 더 크게 만들어 애매함 없이 규칙을 통과시키기 위함.
