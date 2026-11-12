# Candidate C — Vaultline (Storage Capacity Allocation Console)

## Product / brand

**Vaultline** — a storage capacity-planning console for an invented enterprise storage SaaS. The route is `dash-evolve/r39/c`.

## Concept

Vaultline answers one question at a glance: *how much of our storage plan is already spoken for, and by what.* A hero banner states the dominant fact — "**82% of the 500 TB plan allocated**" — in large mono-numeral type, with the plan's used/free/total capacity and a 30-day projection folded into an inline stat strip inside the same banner (no separate KPI tiles). Directly below, a 10×10 waffle grid (100 cells, 1 cell = 1% = 5 TB) renders the exact same breakdown the hero number summarizes — Database Volumes, Backup Snapshots, Log Archives, Media Cache, and Free/Unallocated — so the chart visually proves the headline rather than competing with it. A always-visible legend (`dl`) lists every category's percentage and TB value as static text; hovering or focusing a category (via the legend control, which doubles as the accessible "cell-group" handle) lights up its share of the grid and raises a live detail readout. A "Current / Projected 30d" segmented toggle recomputes the hero number, the inline stats, and the waffle grid together as one coherent unit. Below, a sortable breakdown table restates the same five rows with share, capacity, and the delta to the other period, each row expandable to show its two largest underlying volumes/snapshots/log streams.

## Interactions implemented (all `'use client'`)

1. **Hover/focus a legend category** → highlights the matching cells in the waffle grid and updates an `aria-live="polite"` detail readout with the exact percentage and TB value. Keyboard-equivalent: Tab to a legend button; the same readout updates on focus as on hover (the grid cells themselves are decorative/`aria-hidden` so screen-reader users aren't forced through 100 stops — the legend button *is* the accessible group handle).
2. **Click a legend category** → pins the selection (`aria-pressed`), which also highlights the matching row in the breakdown table below — a small, well-scoped "selection fanout" limited to grid + legend + one table row.
3. **Current / Projected 30d segmented toggle** → recomputes the hero percentage, the Used/Free/Total/Projection inline stats, and the waffle fill pattern together as a single unit (82% → 89%, +7 pts / +35 TB).
4. **Sortable table columns** (Share, Capacity) → click a header to sort ascending/descending, with `aria-sort` kept in sync and an arrow-up/down/both icon indicating state.
5. **Expandable detail rows** → a chevron per row (`aria-expanded`/`aria-controls`) reveals that category's two largest contributors (e.g. `prod-primary-db — 96 TB`) without leaving the table.

## Font / typography confirmation

- Body, labels, nav, table, legend, and all Korean-equivalent (English-only) copy use `--font-sans` exclusively.
- `--font-display-mono` is used in exactly one place: the hero percentage (`82%`), combined with `tabular-nums`, at `text-6xl`/`text-7xl` — confirmed visually as the single largest, most prominent number on the page (no other number on the page approaches that scale).
- Exactly three rendered font weights across the route: `font-normal` (400, body/secondary text), `font-medium` (500, labels/nav/buttons/table headers), `font-bold` (700, h1, hero number, all data values in the legend/stats/table). No `font-semibold`, `font-light`, etc. anywhere.
- Accent: `sky-600`/`sky-700` on white/sky-50 surfaces (verified AA-passing pairings); neutral hierarchy via `zinc-900`/`zinc-700`/`zinc-600`/`zinc-500`, with `zinc-600`+ used for any text sitting on the tinted `sky-50` hero surface per the muted-surface contrast floor.

## Accessibility fallback for the waffle chart

- Every category's exact percentage and TB value is printed as static, always-visible text in the legend (`dl`), not gated behind hover.
- The grid itself carries a single `role="img"` with a full `aria-label` enumerating every category and its percentage, for a one-stop screen-reader summary.
- The same breakdown is additionally available as a real `<table>` (with `<caption>`, `scope="col"` headers, and `colgroup` widths summing to 100%) directly below the chart.
- Individual waffle cells are `aria-hidden` (purely decorative fill), so the accessible "cell-group" control is the legend button — this avoids forcing keyboard/screen-reader users through 100 redundant stops while still satisfying "Tab reveals the same info as hover."

## 브리프에 없던 것 (invented beyond the brief)

- **Brand name, domain, and all dummy numbers**: the brief left the SaaS domain open ("storage quota usage by data type" was one listed example); I committed to "Vaultline," a 500 TB enterprise storage plan, and the specific five categories/percentages/capacities for both the Current and Projected-30d states, hand-authored so every grid sums to exactly 100 cells/100% and every TB column sums to exactly 500 TB in both periods.
- **Which element is the accessible "cell-group" handle**: the brief asks for hover/focus on a "waffle cell-group" with keyboard parity. I decided the *legend button* per category — not the 100 individual cells — is the real interactive/focusable target, with the grid cells themselves `aria-hidden` and only mouse-enhanced. Reasoning: making 100 cells individually focusable would create an unusable 100-stop tab sequence for keyboard/screen-reader users on exactly the chart class the brief is most protective of (AA fallback); routing the accessible interaction through the already-required always-visible legend satisfies "Tab reveals the same info as hover" without that cost.
- **The expandable-row sub-data (largest contributors per category)**: the brief only suggested "consider ... an expandable detail row" as an optional fourth interaction, with no content specified. I invented fixed, period-independent synthetic volume/snapshot/log-stream names and sizes (e.g. `prod-primary-db — 96 TB`) to fill it credibly.
- **The "Projected Δ" table column and its sign convention**: not specified by the brief; I added it as a lightweight always-on "compare to the other period" signal (per-category percentage-point delta, directional depending on which period is currently selected) so the table stays informative regardless of which toggle state is active, rather than adding a second, separate compare-toggle control.
- **Invented persona**: "Priya N." (Platform Ops), used only for the avatar-menu placeholder per the no-real-identity rule.
- **Top-bar primary action**: "Export report" with a Download icon — the brief required a primary action in the shell but didn't name one; invented to fit a capacity-planning console.
- **Color assignment logic for the five categories**: the brief requires color not be the sole carrier of meaning and cautioned about close-value adjacent hues. I used a deliberate value ramp (`sky-700` → `sky-500` → `sky-300` → `zinc-400` → `zinc-200`) plus a distinct Lucide icon per category (Database, Archive, ScrollText, Image, CircleDashed) in the legend and table, rather than a texture/pattern overlay, as the simpler way to keep adjacent sky shades distinguishable without color alone.
