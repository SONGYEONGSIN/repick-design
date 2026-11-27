# Candidate B — Keelwatch (Reliability Command Center)

## Concept (one line)

**Keelwatch** is a dark, rose-accented SRE reliability console for a fictional multi-region SaaS platform, whose feed-centric shell puts a live **Incident Feed** at the center of the page and treats a **services × regions error-surface heatmap**, an error-budget burn-down, and a responder-load panel as supporting side material around it.

## Structure

- **Macro shell: feed-centric.** Standard app shell (left sidebar with brand lockup + workspace switcher + nav + user footer; topbar with ⌘K search, a real "Declare incident" primary action, notifications, avatar menu). Inside the content area: a header strip (h1 + description + four inline reconciled stats — Active / Critical / MTTR / Uptime, rendered as plain text, not a KPI-card row) → a two-column row where the **Incident Feed is the hero** (`lg:col-span-7 xl:col-span-8`) and a narrow side rail (`lg:col-span-5 xl:col-span-4`) holds three small supporting cards (Pinned Cell, Error Budget Burn, Responder Load) → the full-width **Error Surface heatmap** below, as a secondary, supporting section. No left-nav+KPI-row+chart+table shape, no fixed-rail+chart+always-populated-detail-pane shape.
- **Dominant visualization: a services × regions intensity heatmap** (`heatmap.tsx`), 7 services × 5 regions = 35 cells, hand-built as a real semantic `<table>` (never a chart library) that is simultaneously the heatmap AND the chart catalog's required row/column-labeled data-table fallback: every cell shows its exact numeric value (error rate % or p95 latency ms, toggled by a segmented control) as always-visible text, with only a 5-step rose-tier background (`zinc-800/70` → `rose-950/70` → `rose-800/70` → `rose-600/70` → `rose-500/70`) encoding escalating severity — color is never the only signal. A text+icon legend and an always-visible "Worst cell this window" headline (using `--font-display-wide` for the big number) sit above the matrix and recompute whenever the metric toggle flips. Below `sm`, the table is replaced by a `sm:hidden` per-service card list of tappable region chips — the only such fallback on the page, and the page has zero `overflow-x-auto` containers anywhere (both this matrix and the incidents table use `table-fixed` + percentage `colgroup`s sized to fit their own column, never a scroller).
- **Component system** (local to this folder): `Card`, `SeverityBadge`/`StatusBadge`, `ProgressBar`, `Avatar` (next/image + initials fallback), `SegmentedControl`, `SortHeader`/`SortIcon` (`ui.tsx`); the incident composer (`composer.tsx`); the command palette (`command-palette.tsx`); three small reconciled side cards (`pinned-cell-card.tsx`, `error-budget-card.tsx`, `responder-load-card.tsx`).

## Selection fan-out — the two independently-scoped mechanisms (tier-3)

1. **`pinnedKey` (click-to-pin) — written only in `heatmap.tsx`, read only in `pinned-cell-card.tsx`.**
   `page.tsx` declares `const [pinnedKey, setPinnedKey] = useState<PinnedKey>(...)`, defaulted to the dataset's worst error-rate cell (never empty before any click). It is passed to `ServiceRegionHeatmap` only as the write-only callback `onPin={setPinnedKey}`, and to `PinnedCellCard` only as the read-only prop `pinnedKey`. **No other component ever receives `pinnedKey` or `setPinnedKey`** — not the Incident Feed, not the incidents table, not the command palette. `PinnedKey` stores only `{serviceId, regionId}` (not a frozen value), so `PinnedCellCard` recomputes both metrics live from `data.ts` — it can never go stale if the heatmap's own metric toggle is flipped after the pin.

2. **`hoverId` (hover/focus) — declared in `feed.tsx`, read only in `feed.tsx`.**
   A second, fully local `useState<string | null>` inside `IncidentFeed`, written by `onMouseEnter`/`onFocus` on a stream row and reset to `null` by `onMouseLeave`/`onBlur` — which simply means "show the first currently-filtered incident" (`const inspected = filtered.find(i => i.id === hoverId) ?? filtered[0] ?? null`), so the Inspector strip beneath the stream list is never an empty placeholder. **`page.tsx` never imports or reads `hoverId`.**

   **Verified by grep**: `grep -rn "pinnedKey\|setPinnedKey" app/src/app/dash-evolve/r47/b` returns matches only in `page.tsx` (declaration + the two narrow props it hands out), `heatmap.tsx` (the `onPin` parameter name) and `pinned-cell-card.tsx` (the read). `grep -rn "hoverId" app/src/app/dash-evolve/r47/b` returns matches only inside `feed.tsx`. Neither id is ever the same channel, and the command palette's "Filter: Critical only" / "Filter: Open only" actions write to a *third*, ordinary page-level `feedFilter` — the same shared view state the feed's own filter chips write to (exactly mirroring the "two filter-setting actions that flip the same page-level view filter a view toggle already writes to" pattern from this catalog's own prior-round account) — and the palette never touches `pinnedKey` or `hoverId`.

## Interactions (5 implemented, all `'use client'`, deterministic, `motion-safe:`-gated)

1. **Heatmap hover/focus crosshair** — a local `activeCell` state (own `useState`, never leaves `heatmap.tsx`) brightens the hovered/focused cell's row and column labels and drives an `aria-live="polite"` caption line ("Hover or tab onto a cell to inspect it." by default); keyboard-reachable since every cell is a real `<button>`.
2. **Real table sort + filter** — the Incident Feed's Table view (`feed.tsx`) is a genuine sortable `<table>` (Incident/Service/Severity/Status/Time columns, `aria-sort` kept in sync, default sort = newest-first) with its own avatar-cell Assignee column, plus the shared `feedFilter` chip row (All/Open/Acked/Critical/Resolved).
3. **Stream / Table view toggle** — a `SegmentedControl` inside `IncidentFeed` swaps between the compact live-stream cards (+ ephemeral Inspector) and the full sortable table, both reading the same filtered/sorted data.
4. **Selection → multi-widget sync (tier-3)** — the two independently-scoped mechanisms described above: click-to-pin a heatmap cell (→ Pinned Cell card only) and hover/focus a feed row (→ local Inspector strip only).
5. **⌘K command palette** — `Ctrl/Cmd+K` or the topbar search button opens a filterable, arrow-key-navigable palette whose actions are navigation (scroll-to-section) and the shared `feedFilter`, never `pinnedKey` or `hoverId`.

Also real, not decorative: the topbar's **"Declare incident"** primary action opens an inline composer (`composer.tsx`) that prepends a brand-new incident to the feed with an id computed by `nextIncidentId()` (never a literal), immediately changing the header's reconciled "Active" count.

## Font / typography discipline

- Body/UI copy: `var(--font-sans)` (Pretendard) everywhere, never overridden.
- Display font: exactly one, `var(--font-display-wide)` (Archivo Display) — used only for the sidebar wordmark ("Keelwatch"), the page `<h1>` ("Incident Command"), and the two large headline numbers (the heatmap's "worst cell" value, the Pinned Cell card's big error-rate figure). Never mixed with another display variable.
- Exactly three rendered font weights across the whole route: `font-normal` / `font-medium` / `font-semibold` — grepped for `font-bold`/`font-light`/`font-extrabold`/`font-black`/`font-thin`: zero matches.
- All numeric figures use `tabular-nums`, right-aligned in table columns. Section/axis/eyebrow labels are 11px uppercase with `tracking-[0.06em]`, applied consistently.
- Contrast audited for the dark floor: every secondary-text use is `text-zinc-400` or brighter (no `text-zinc-500`/`600` anywhere in the route, checked by grep after an initial pass caught several at `zinc-500` — notably the mobile heatmap chip's small region-label caption, which sat on the brightest rose-tier fill and measured ~3.4:1 against it; it was bumped to `zinc-50` to match the value text above it, since contrast must hold against the *painted cell*, not the card background).

## 브리프에 없던 것

- **① 무엇을 정해야 했는가:** 어떤 가상 제품/도메인으로 서비스×리전 히트맵과 피드 중심 셸을 구체화할지 (브리프는 아키타입과 축만 지정, 제품 자체는 자유).
  **② 무엇으로 정했는가:** "Keelwatch" — 멀티 리전 SaaS 플랫폼을 위한 SRE 신뢰성 콘솔. 7개 서비스 × 5개 리전의 에러율/p95 지연을 추적하고, 실시간 인시던트 피드가 메인.
  **③ 왜:** "severity = rose" 지시와 가장 자연스럽게 맞물리는 도메인이 인시던트/신뢰성 운영이었고, 이 라운드의 회피 목록에 있는 다른 조합들(캔들스틱+워치리스트, 실시간 스트리밍 영역차트 등)과 겹치지 않으면서도 "서비스×리전" 같은 비지도·비달력 2축 히트맵이 가장 솔직하게 맞아떨어지는 소재였기 때문.

- **① 무엇을 정해야 했는가:** 히트맵의 두 축(서비스/리전)의 구체적 라벨과 개수, 그리고 "worst cell"을 어떤 기준(에러율 vs 지연)으로 기본 표시할지.
  **② 무엇으로 정했는가:** 7개 서비스(API Gateway, Auth, Checkout, Search Index, Billing API, Media CDN, User Profile) × 5개 리전(US East/West, EU West, AP Southeast, SA East), 기본 지표는 에러율(%)이고 세그먼트 컨트롤로 p95 지연(ms)과 전환.
  **③ 왜:** 7×5=35셀은 SVG 상한(~1만 셀)과 무관하게 테이블로도 충분히 가독성 있는 규모이고, 두 지표 모두 Checkout×SA East가 최악 셀로 일치하도록 수치를 설계해 "지표를 바꿔도 같은 핫스팟이 다른 단위로 재계산된다"는 사실을 숫자 자체로 증명할 수 있었기 때문.

- **① 무엇을 정해야 했는가:** 히트맵이 자체적으로 a11y 폴백 "데이터 테이블"을 별도로 둘지, 아니면 히트맵 자체를 테이블로 만들지 (브리프는 "필요"만 명시, 구현 형태는 자유).
  **② 무엇으로 정했는가:** 히트맵 매트릭스 자체를 진짜 `<table>`(`caption`/`scope`)로 구현해서 시각화와 폴백 테이블을 하나로 합침.
  **③ 왜:** 별도의 폴백 테이블을 또 두면 페이지에 두 번째 넓은 표가 생겨 "두 개의 overflow-x-auto" 함정에 걸릴 위험이 커지고, 데이터도 두 곳에 따로 유지해야 해서 수치가 어긋날 여지가 생기므로, 시각화=테이블로 합치는 쪽이 더 안전하고 간결하다고 판단.

- **① 무엇을 정해야 했는가:** 핀(pin) 메커니즘이 "값"을 고정 저장할지, "셀 좌표"만 저장할지 (브리프는 "한 개의 작은 요약 카드만 갱신"이라고만 명시).
  **② 무엇으로 정했는가:** `PinnedKey`는 `{serviceId, regionId}`만 저장하고, `PinnedCellCard`가 매 렌더마다 두 지표를 `data.ts`에서 새로 조회.
  **③ 왜:** 값을 고정 저장하면 히트맵의 지표 토글(에러율↔지연)을 나중에 바꿨을 때 핀 카드가 "그때 그 지표"의 낡은 숫자를 들고 있게 되는 모순이 생기므로, 좌표만 공유하고 항상 최신 데이터에서 재계산하는 쪽이 "숫자가 절대 어긋나지 않는다"는 브리프의 요구에 더 충실하다고 판단.

- **① 무엇을 정해야 했는가:** 피드의 호버/포커스 "ephemeral inspector"가 구체적으로 무엇을 보여줘야 하는지, 그리고 호버가 끝났을 때 빈 상태로 돌아가도 되는지 (브리프는 "지속 상태를 아무것도 바꾸지 않는 호버 인스펙터"라고만 명시).
  **② 무엇으로 정했는가:** 스트림 리스트 아래에 고정된 "Inspector" 스트립을 두고, 호버/포커스 중인 인시던트의 러너북/담당자/경과시간을 보여주며, 호버가 끝나면 `hoverId`가 `null`이 되어 "현재 필터 기준 첫 번째 인시던트"로 자동 복귀.
  **③ 왜:** 이 카탈로그의 반복 함정 중 하나가 "선택 전 완전히 빈 디테일 패널"이므로, 에페메럴 상태라 해도 기본값 없이 비워두면 같은 함정에 걸리게 되어, null을 "보여줄 게 없음"이 아니라 "기본 폴백으로 조회하라"는 신호로 해석하도록 설계.

- **① 무엇을 정해야 했는가:** 에러 예산(Error Budget) 카드의 SLO 기준과 "burned" 계산 방식 (브리프에 전혀 없는, 도메인상 필요해서 발명한 위젯).
  **② 무엇으로 정했는가:** 99.9% SLO 기준 30일당 43.2분 예산, 해당 월 `resolved` 인시던트의 `resolutionMinutes` 합으로 burn을 계산 — Uptime(30d)과 MTTR도 같은 `resolutionMinutes` 배열에서 파생.
  **③ 왜:** 브리프가 명시한 "합계가 재구성되어야 한다(sums reconcile)"는 요구를 가장 확실히 지키는 방법은 서로 다른 세 위젯(헤더의 Uptime/MTTR, Error Budget 카드)이 처음부터 하나의 소스 배열만 집계하도록 만드는 것이라고 판단했고, 99.9%/43.2분은 SRE 업계의 표준적인 월간 에러 예산 관례를 그대로 차용.
