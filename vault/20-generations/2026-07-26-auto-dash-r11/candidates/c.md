# Candidate c — Sourcemark

**Product**: Sourcemark — "Supplier Sourcing & Comparison Console," a B2B vendor-discovery SaaS for procurement/ops teams evaluating suppliers across packaging, industrial hardware, electronics, logistics, raw materials and office/facilities categories.

**Archetype**: Faceted Search & Compare Console. Inside the mandatory app shell (left sidebar with brand lockup/workspace switcher/nav/user, top bar with ⌘K search/primary action/notifications/avatar menu, mobile drawer), the screen-owning content is a three-part faceted workspace:
- **Left** — a facet-filter panel (`FacetPanel.tsx`) inside the main content area (distinct from the global nav sidebar): Category, Region and Price band as OR-combined checkbox groups with live counts; Minimum rating as a single-select threshold chip row; Capability tags as AND-combined multi-select chips ("must offer every selected tag"). Combination rule across groups is AND, documented inline in `data.ts`.
- **Center** — a responsive card grid of 16 fictional supplier listings (`SupplierCard.tsx` / `SupplierRow.tsx`), each with a `next/image` contact-portrait thumbnail, name, location, star rating + review count (always shown as text, not hover-only), category/region/price stat chips, lead time, MOQ, a verified badge and capability tags — never a dominant `<table>`.
- **Right** — a slide-in compare tray (`CompareTray.tsx`) that appears once ≥1 item is added to compare (max 4, graceful "Tray full" disabled state on other cards). It renders a semantic `<table>` (caption + `scope="row"/"col"`) aligning Category/Region/Rating/Price/Lead time/MOQ/Verified/Capabilities per selected supplier, each with a remove control.

**Interactions implemented (5, all real `'use client'` state)**:
1. Facet filters (category/region/price/rating/capabilities) that actually filter the visible cards.
2. "Add to compare" toggle per card/row that adds/removes suppliers from the compare tray, capped at 4 with a disabled "Tray full" state.
3. Sort dropdown (Best match / Rating high→low / Price low→high / Lead time fastest) that reorders visible cards.
4. Grid/list view toggle (`SegmentedControl`) that switches between a multi-column card grid and a denser single-column row list, preserving filters/sort/search.
5. Search-within input that filters cards by name/category/region/city substring, also reachable via the ⌘K command palette.

**Font/typography**: Single global `font-sans` (Pretendard, inherited from the app-wide layout — no additional `next/font` imports in this route) with `tabular-nums` applied to every numeric value (scores, review counts, prices, lead times, MOQ) via the shared `NUM` token. English-only copy throughout, verified in the rendered HTML (only false-positive Unicode punctuation — em dash, middot, star glyph — matched the CJK regex, no actual Korean text present).

**Theme**: CRM & Client light palette (colors.catalog) — white/zinc-50 canvas, white cards, zinc-200 borders, zinc-900/600/500 text — with full `dark:` variants (zinc-950/900 surfaces, white/10 borders, zinc-50/300/400 text, floor respected in every state branch including the unverified/empty/disabled-tray branches). Single-accent principle: primary blue (#2563EB) is UI chrome only (buttons, focus rings, active nav/toggle, checked selection controls); accent emerald (#059669) is reserved for exactly one domain signal — the "Verified" badge and "Top rated" (≥4.5★) score emphasis — always paired with icon + text.

**Differs from the duplicate-avoidance list**: this is card-grid + facet-filter + compare-tray as the dominant pattern — not a table, not a chart-dominant BI canvas, not a kanban/calendar/map/inbox/DAG/leaderboard/heatmap/treemap/funnel/chat-dock/org-tree/gauge-cluster/network-graph/Sankey/warehouse-heatmap/scatter/on-call-ring pattern, and not the generic "KPI row + chart + table" dashboard shape either. The center content is deliberately non-tabular visual cards; the only `<table>` in the entire route lives inside the secondary compare tray, which is explicitly permitted for row-aligned attribute comparison.

**Files**: `app/src/app/dash-evolve/r11/c/{page.tsx, SourcemarkClient.tsx, Sidebar.tsx, Topbar.tsx, CommandPalette.tsx, FacetPanel.tsx, ResultsGrid.tsx, SupplierCard.tsx, CompareTray.tsx, ui.tsx, tokens.ts, data.ts}`.

**Verification**: `curl -s -o /dev/null -w '%{http_code}' http://localhost:3100/dash-evolve/r11/c` → `200`. `npx tsc --noEmit` clean.
