# Candidate B — Outlay

**Concept**: Outlay, a cloud cost allocation console whose dominant visualization is an arc-based donut (6
categories: Compute, Storage, Data Transfer, Databases, Observability, Networking) with a large center total
readout, paired with an always-rendered legend immediately beside it that shows every category's name, icon,
dollar amount, percent-of-total and period-over-period delta as plain text — never hover-only — backed by a plain
percentage data table below that reproduces the same numbers.

## Interactions implemented (5)

1. **Period toggle (segmented control)** — This Month / Last Month / Quarter swaps the entire dataset (donut,
   legend, support stats, detail panel, table) and re-picks the default-selected category in the same click
   handler, not an effect (`page.tsx` → `data.ts`).
2. **Crosshair-style hover tooltip on the donut** — hovering or focusing a wedge/legend row shows a small floating
   card (name, amount, percent, delta) anchored at the wedge's own mid-angle; purely supplementary, since the same
   figures are already always-visible in the legend (`donut-chart.tsx`).
3. **Click-to-select a category** — clicking a wedge or a legend row updates one widget only, the Detail panel
   (its Overview/Budget tabs); defaults to the largest category on load and whenever the period changes, so the
   panel is never blank (`donut-chart.tsx` → `page.tsx` / `detail-panel.tsx`).
4. **Real table sort** on the allocation table — clickable, `aria-sort`-correct Category / Monthly cost / % of
   total columns, each click toggling asc/desc (`allocation-table.tsx`).
5. **⌘K command palette** — opens via the header trigger or Cmd/Ctrl+K, searches nav destinations and the
   "create budget" action (`command-palette.tsx`).

Also present: a tab switch inside the Detail panel (Overview / Budget) and a workspace-switcher dropdown in the
sidebar. All data is fixed literals (no `Math.random`, `Date.now`, or bare `new Date()`); donut arc coordinates
are rounded to 2 decimals in `geometry.ts`; every transition is `motion-safe:`-gated.

## Typography confirmation

Exactly three rendered font weights across the whole route: `font-normal` (400, body/captions/table cells),
`font-medium` (500, labels/nav/legend names/segmented & tab controls), `font-semibold` (600, headings, the h1 and
the donut's center total). No `font-bold`, `font-light`, or any other weight utility appears anywhere in the
folder. The wordmark "Outlay", the page `<h1>` and the donut's center total figure are the only text set in
`var(--font-display-mono)`; everything else, including all body copy and Korean, stays on the global `--font-sans`
(Pretendard).

## 브리프에 없던 것

1. **The actual six categories, their colors and icons, and three periods of numbers.** The brief specified the
   chart form (donut, 4–6 segments, A11y-C warning) but not real data. I built three periods (This Month / Last
   Month / Quarter) where every category's amount, previous-period amount and budget allocation are literal
   numbers, and total / budget / percent / delta / top-mover are all *derived* via `reduce` in `data.ts` — never
   stored redundantly — so the donut, legend, support card and fallback table can never drift out of agreement.
   I also ran the vault's `dataviz` skill validator (`validate_palette.js`) against the six category hexes on the
   actual `zinc-950` surface before using them (all six checks passed; the 6–8 CVD band is covered by giving every
   segment its own icon + always-visible label, per the skill's secondary-encoding rule).
2. **What "supporting numbers smaller than the center readout" means in practice.** The brief banned a competing
   KPI row and required any period-over-period/budget numbers to be visibly smaller than both the donut's center
   total and the legend's per-segment labels. I built one "Spend trend & budget" card holding a 6-month sparkline,
   a budget-remaining progress bar and a one-line "top mover" note, all set in `text-xs`/`text-[11px]`, strictly
   below the center total's `text-[26px]/[30px]` and the legend's `text-sm` — and computed the top mover itself
   (the category with the largest |amount − previousAmount|) from the same arrays rather than asserting it.
3. **How the default-selected detail panel should avoid being either empty or a second KPI competitor.** Rather
   than add a fourth sibling widget, I gave the already-required Detail panel two small tabs (Overview / Budget)
   so it carries real secondary content (allocation vs. spend, with its own progress bar) without inventing a new
   always-empty-by-default panel — directly targeting the "empty detail panel" defect called out as the most
   consistently penalized completeness issue in the brief.
4. **Pre-emptive fixes for the two documented r40 hard-gate traps.** Every `FOCUS_RING` constant in this route is
   `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400` with no `outline-none`
   anywhere in the folder (grepped clean). No inline SVG anywhere uses a `<title>` element — the donut's decorative
   `<svg>` carries `aria-hidden="true"` instead (its full value/percent content already exists as always-visible
   HTML text in the legend beside it), and the hover tooltip and sparkline SVGs are likewise `aria-hidden`. The
   tooltip's horizontal position is also clamped (22%–78% of the donut's box) so it can't push the page into
   horizontal overflow at 390px when a wedge sits near the ring's left/right extreme.
