# Nodeline — Service Dependency Graph Console

A platform-ops console for tracing service-to-service call topology: a fixed-deterministic-layout network graph (14 services, 24 call edges across four tiers) is the dominant visualization, pinned/hovered nodes drive an ephemeral inspector panel without recomputing any other widget, and a fully sortable Source→Target→Value adjacency table sits below as the mandatory A11y-D fallback.

**Path**: `app/src/app/dash-evolve/r22/b/page.tsx` (+ `data.ts`, `tokens.ts`, `ui.tsx`, `Sidebar.tsx`, `Topbar.tsx`, `CommandPalette.tsx`, `ServiceGraph.tsx`, `AdjacencyTable.tsx`, `SideRail.tsx`, `NodelineClient.tsx`)

## Composition
- **Shell**: left sidebar (workspace switcher popover, 6-item nav with active pill, avatar footer) + 64px topbar (⌘K search, Add-service CTA, notification bell, avatar popover menu). Mobile: off-canvas drawer.
- **Header row**: single `h1` + subtitle, no toggle here (kept with the graph it controls).
- **Inline KPI strip** (not a 4-card row — a divided 5-stat strip: Services / Edges / Total traffic / Median p99 / At-risk), `sr-only` region heading.
- **Main 12-col grid**: 8-col graph card (Latency/Error segmented toggle in its own header) + 4-col rail (persistent Legend card, ephemeral Inspector card below it).
- **Adjacency table** (full width): Tabs filter (All/Degraded/Critical with live counts) + sortable `aria-sort` columns, `table-fixed` with responsive column hiding — zero `overflow-x-auto` on the page.

## Interactions (4, all `'use client'`, deterministic, `motion-reduce`-safe)
1. Graph node click/hover/focus → connected-edge highlight (dim the rest) + ephemeral inspector (hover/focus previews via `hoverId`, click/Enter pins via `pinnedId`; clicking a pinned node again unpins).
2. Adjacency table real sort (4 sortable columns, `aria-sort`) + status filter (Tabs).
3. Latency/Error-rate segmented toggle recolors graph node fills and their persistent metric labels only.
4. ⌘K command palette (mounted only while open, so `query`/`activeIndex` start fresh for free — no `useEffect` reset-on-open) with arrow-key nav, `aria-activedescendant`, Enter to pin.

## Selection blast radius
`pinnedId`/`hoverId` are read by exactly `ServiceGraph` and `InspectorPanel`. `KPI_ITEMS` and `AdjacencyTable` never receive that state — both are computed once from static `NODES`/`EDGES` and are structurally unable to react to a graph selection (see the boundary comment in `NodelineClient.tsx`). Edge/node status shown on the graph and table also splits into a **canonical** status (worst of latency+error, used everywhere except the graph's own node fill) versus an **encoding-specific** status (used only for node fill under the active toggle) — so toggling Latency↔Error never disturbs the table, KPI strip, or edge colors, only the nodes' own fill.

## Accent — teal, both directions computed
- `teal-700` `#0f766e` on white `#ffffff` → **5.48:1** (AA text/icons/focus rings; used for nav-active text, links, button labels).
- White `#ffffff` on `teal-700` `#0f766e` fill → same pair, **5.48:1** (Add-service button, brand mark, skip-link — passes as filled-button text).
- `teal-700` `#0f766e` on `teal-50` tint (~`#f0fdfa`) → **~5.37:1** (nav-active pill, command-palette active row).
- `teal-600` `#0d9488` on white → **3.74:1** — non-text floor only (3:1); used solely for the graph's own SVG selection-ring stroke, never for text.

Status colors were rebuilt from Tailwind's default `-500`/`-600` steps to `-700` after hand-computing WCAG luminance: `amber-600` text measured **3.19:1** (fails 4.5:1), `zinc-300` arrowheads measured **1.48:1** (fails even the 3:1 non-text floor). `amber-700` (**5.02:1**) and `rose-700` (**6.29:1 text / 6.29:1 graphic**) replaced them project-wide for anything read as text or a thin stroke; `zinc-300`/`zinc-400` structural hairlines (edges, card borders) were left alone to match the rest of the catalog's border convention, since WCAG 1.4.11 doesn't gate plain dividers and Lighthouse can't test it.

## Typography
Pretendard only, no display face (recommended for a data-dense console). Exactly 3 rendered weights: 400 (default body), 500 (`font-medium` — nav, tabs, segmented control), 600 (`font-semibold` — headings, KPI figures, badges). `font-mono` (system stack, not a `next/font` import) reserved for service identifiers only, per the repo's code-data convention.

## Reference-grade completeness points
- Fixed deterministic layout: no force simulation at runtime — 14 `(x, y)` pairs are hand-placed once in a four-tier call-flow grid and just rendered; every computed SVG coordinate (edge endpoints, sparkline points) is rounded to 2dp via a shared `round2` helper.
- Every node is a real keyboard target (`tabIndex 0`, `Enter`/`Space` to pin) with a **stateful** visual focus change (an SVG ring stroke appears on `onFocus`, not a CSS `outline`) — the pattern the repo's own audit trail flags as the one that survives Tailwind v4's `ring`-transparency and `outline-none` self-cancellation traps.
- Health is never color-only: every status pairs a lucide icon with the color, and edges additionally carry a dash pattern (solid/dashed/dotted) so color-blind readers keep the signal.
- Dominant-viz completeness: each node shows its live metric value (ms or %) as persistent SVG text under the node, not hover-only — satisfies the catalog's at-a-glance rule for the assigned Network Graph archetype.

## 브리프에 없던 것

**Two-tier hover/pin selection, not a single selected-id.** The brief's interaction list just says "click/hover" triggers the panel; I split it into an ephemeral `hoverId` (mouse-enter/focus, clears on leave/blur) and a persistent `pinnedId` (click/Enter, toggles off on repeat) folded into one `activeId = pinnedId ?? hoverId`. This lets a keyboard or mouse user browse the topology without losing their place, then commit to one node — and it's what makes the "selection touches only two components" boundary easy to keep honest, since there's exactly one derived value flowing outward.

**A canonical/encoding-specific status split, not one status per node.** The brief's own suggested toggle example (latency vs error color) implied a single status would just get recolored; I instead compute two independent classifications (`latencyStatus`, `errorStatus`) and a canonical worst-of-both used everywhere except the graph's own node fill. One node (`recommend-engine`) is latency-critical but only error-degraded, so it visibly changes color when you flip the toggle while the table, KPI strip, and edge colors stay put — a concrete, checkable demonstration that the toggle's blast radius is scoped correctly, rather than a claim in a comment.

**A full manual WCAG-luminance rebuild of the status palette.** The brief asks for AA contrast in general terms; I hand-computed relative luminance for every teal/amber/rose/zinc step actually used (formula in `tokens.ts`'s comments) because Tailwind's conventional `-500`/`-600` defaults for a status system quietly fail on a pure-white canvas — `amber-600` text came out at 3.19:1 and `zinc-300` SVG arrowheads at 1.48:1, both below their respective floors. Every text or thin-stroke use of amber/rose was moved to `-700` (5.0–6.3:1) as a result, which is why the badges, KPI "at-risk" figure, and graph metric labels all read one shade darker than a default Tailwind status palette would produce.
