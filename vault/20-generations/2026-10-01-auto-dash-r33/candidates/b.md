# Candidate b — Routeline

## 1. Concept

**Routeline**, a regional delivery-operations console for a fictional parcel carrier, **Haulwell Logistics**. The dominant visualization is a hand-built SVG hex-grid map of Haulwell's 12 regional delivery zones (an abstracted honeycomb instrument, not a literal country outline). A metric toggle switches what the map encodes — **On-time delivery rate / Delay incidents per week / Revenue at risk (USD)** — while hex hue always stays tied to each zone's health status (on-track / watch / at-risk), so the color key never changes meaning across toggles; only the fill intensity (degree of concern) and the in-hex numeric label change.

## 2. Implemented interactions (5, brief required ≥4)

1. **Map hover/focus tooltip** — hovering or Tab-focusing a hex shows a floating tooltip with the zone's name, status, and exact current-metric value. Keyboard-accessible: each hex is a focusable `role="button"` polygon with a full `aria-label`, reachable and operable (Enter/Space) without a mouse.
2. **Rail sort + filter** — the zone rail is a real `<table>` with `aria-sort` on three clickable column headers (Zone / Status / current metric), plus status-filter chips (All/On track/Watch/At risk) and a live text search across zone, name, and manager.
3. **Metric toggle** — a segmented control (`On-time` / `Incidents` / `Rev. at risk`) re-renders the map's shading, in-hex labels, and the rail's metric column and sort comparator.
4. **Region selection → detail panel** — clicking a rail row, a hex, or a command-palette result sets the single persistent `selectedId`, which drives the detail panel's header, stat tiles (with an 8-week on-time sparkline), depot table, and recent-incidents table. This is the only consumer of `selectedId`.
5. **(Bonus) ⌘K command palette** — arrow-key + Enter navigable zone jumper, opened via the topbar's search button or ⌘K/Ctrl+K globally; sets the same `selectedId` as the other two selection paths.

**Selection fan-out note (per the round's delta directive):** `selectedId` lives in `client.tsx` and is passed only to the rail, the map, and the detail panel's data source — it has exactly one semantic consumer (the detail panel). The map's hover/focus preview is a **structurally separate, local** pair of `useState` calls inside `region-map.tsx` (`hoverId`/`focusId`, merged into `previewId`): it never calls `onSelect`, never touches `selectedId`, and resets on mouseleave/blur. The two states are commented at both definition sites explaining why they are kept apart.

## 3. Typography

- Display face: **`--font-display-mono`** only, used in exactly two places — the `<h1>` "Network delivery performance" and the sidebar wordmark "Routeline". Nowhere else.
- Body/UI/Korean path: Pretendard (`font-sans`) throughout (no Korean copy appears; the page is English-only per the copy-language rule).
- Exactly **3 rendered font weights**: 400 (unwritten/`font-normal` body, captions, table cells), 500 (`font-medium` — nav items, labels, badges, filter chips, data-table headers, the SVG metric-value label), 600 (`font-semibold` — h1/h2/h3, KPI figures, selected-row emphasis, the SVG zone-code label). No `font-bold`/`font-light` anywhere, audited by grep across all 9 component files.
- All numeric values (`tabular-nums`) and right-aligned in tables: rail metric column, KPI figures, depot volumes/rates, incident parcel counts, sparkline-adjacent deltas.
- No `compact` Intl.NumberFormat notation used anywhere (currency formatted as full `$55,860`, not `$56K`), per the SSR/CSR hydration-mismatch warning.

## 4. Completeness vs. the SaaS reference bar

- Full app shell: sidebar (brand lockup, workspace switcher with listbox dropdown, 3 nav sections with lucide icons + active pill, bottom user row) + topbar (⌘K search trigger, primary action, notifications with unread dot, avatar menu) — every topbar control is individually `h-11` (44px).
- Mobile drawer sidebar with backdrop + explicit close button, both keyboard-dismissible.
- Component system split into dedicated files: `ui.tsx` (Card, StatusBadge, InitialsAvatar, SegmentedControl, SortIcon, Sparkline, `useDismissable`, `useFocusTrapReturn`), `sidebar.tsx`, `topbar.tsx`, `region-rail.tsx`, `region-map.tsx`, `detail-panel.tsx`, `command-palette.tsx`, `data.ts`, `client.tsx`, `page.tsx`.
- Deterministic data: 12 zones, hand-authored depot volumes that sum exactly to each zone's weekly volume, network totals computed via `reduce` over the zone list (never retyped as independent constants) so nothing can drift out of sync.
- Hex geometry: fixed-formula flat-top hex-grid (4 cols × 3 rows), coordinates precomputed to 2 decimal places and hardcoded as literal arrays — no trigonometry at render time, fully hydration-safe.
- Color + text pairing on the map: every hex shows its status-derived hue *and* an exact numeric label on a fixed dark pill backdrop (added specifically so label contrast holds even when a hex's fill is at its lightest/most-saturated — verified the AA floor by hand against the worst-case hue/intensity combinations).
- Full keyboard path: skip-link → main landmark, sidebar nav, topbar controls, rail (search → filter chips → sortable headers → rows), map hexes (Tab-reachable, Enter/Space to select), detail panel tables, command palette (arrow keys + Enter, Escape to close, focus returns to the triggering element, background made `inert` while open).
- Focus visibility: every interactive element uses `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6cc0b3]` with no `outline-none` anywhere in the route (verified by grep) — avoiding the self-cancelling pattern called out in the brief.
- 12-col-capable fluid layout, no page-wide `max-w` cap; rail fixed at `312px` (`lg:w-[312px]`), map `2xl:flex-1 min-w-0`, detail panel `2xl:w-[380px]`. Below `2xl` the map and detail panel stack (map gets full width); below `lg` the rail stacks above the map/detail column. Desktop tables use `table-fixed` + percentage `<colgroup>` widths (no `min-width` on cells).

## Brief gaps

- **Exact region count / geometry scheme** — undefined in the brief beyond "hex-grid or abstracted polygon." Chose **12 zones** (enough to need real sort/filter, not so many the rail or map gets noisy) arranged as a **4-column × 3-row offset flat-top hex grid** (odd-column vertical offset), generated once from fixed formulas (`size=56`, `colGap=1.5×size`, `rowGap=√3×size`) and hardcoded as rounded-to-2-decimal literals in `data.ts`.
- **Exact teal accent hex** — brief said "a single teal accent (desaturated, service-grade)" without a value. Chose **`#3f9c90`** as the base accent (with `#8fcdc2` as its lighter on-dark text/icon tint and `#6cc0b3` for focus outlines), checked by hand against WCAG contrast math for both text-on-tint and icon-on-dark use cases — deliberately duller than Tailwind's stock `teal-400`/`teal-500`.
- **Rail width** — brief gave a ~280–340px range. Chose **312px** (`w-[312px]`), roughly centered in that range, enough for a two-line zone cell (avatar + code + name) plus a status badge and a metric column without crowding.
- **Map color encoding mechanics** — the brief only said the toggle should "switch what the map encodes." Designed a two-channel encoding to avoid conflating "which metric" with "how healthy": **hue always = status** (derived from on-time rate alone, so the legend never needs to be re-read), **fill intensity = normalized concern on the currently toggled metric** (direction-flipped so "more intense" always means "needs more attention" regardless of metric). Documented this choice directly in `region-map.tsx` and `data.ts` (`concernIntensity`).
- **Label contrast on the map** — not specified, but the machine-verified contrast floor forced a decision: full-intensity amber/rose hex fills are light enough that white text directly on them fails AA. Added a fixed dark pill (`fill-zinc-950/75`) behind each hex's two-line label instead of computing per-hex text color, since a fixed backdrop is simpler to reason about and verify by hand than a luminance-branching text-color function.
- **Default selection on load** — brief didn't say whether the detail panel starts empty or pre-populated. Chose to default-select the worst-performing zone (`SE-01`, Pine Bluff, the only zone with no close runner-up for "most in need of attention") rather than leaving the panel empty, since an ops console reads better with an immediately useful default — commented in `client.tsx` as the one place `selectedId` starts non-empty.
- **Revenue-at-risk derivation** — "revenue" wasn't given a formula. Modeled it as `delayIncidents × $420` (a fixed, named `PENALTY_PER_INCIDENT_USD` constant standing in for an SLA-penalty exposure model), so it's fully deterministic and so the network total is always `133 incidents × $420 = $55,860` — never a hand-typed figure that could drift from the per-zone rows.
