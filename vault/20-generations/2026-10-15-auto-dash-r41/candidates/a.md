# Candidate A — Fathom

**Concept**: Fathom, a crypto markets-desk console for an institutional trading team — a left watchlist rail of 7
instruments drives a dominant candlestick chart (OHLC + 5-candle dashed moving average, generated SVG, deterministic),
with the latest candle's exact open/high/low/close/volume always printed in the header (never hover-only), a sortable
recent-trades table and a full OHLC history table always visible below it, and a dismissible order-ticket drawer in
place of any permanently-reserved third pane.

## Interactions implemented (5, all `use client`, deterministic, `motion-reduce`-gated)

1. **Period toggle** (1D / 1W / 1M / 1Y, segmented control) — swaps the whole candle dataset (24 hourly / 7 daily /
   30 daily / 12 monthly candles), re-derives the header's always-visible latest-OHLC readout and both tables
   (`page.tsx` → `data.ts`).
2. **Crosshair hover/focus tooltip on the chart** — one transparent, focusable hit-rect per candle; hovering OR
   tabbing to it shows a floating OHLC tooltip positioned next to that candle, clamped so it never runs off the
   `viewBox` (`candlestick-chart.tsx`).
3. **Click-to-select a candle** — clicking or pressing Enter/Space on a candle updates one small "Selected" readout
   line directly under the chart (narrow fan-out, self-contained in this one widget); defaults to the latest candle
   so it is never blank, and resets to the new latest candle whenever the instrument or period changes
   (`candlestick-chart.tsx`).
4. **Real table sort** on the Recent Trades table — Time / Price / Size / Value columns are independently
   sortable with correct `aria-sort`, defaulting to newest-first and resetting on instrument change
   (`trades-table.tsx`).
5. **⌘K command palette** — global `Cmd/Ctrl+K` listener or the topbar search button opens it; searches the 7
   instruments by symbol/name and switches the chart (`command-palette.tsx`).

Also present: watchlist-rail click (navigation, switches the chart's instrument — not counted as the "selection"
interaction per the brief), and a Market/Limit `Tabs` switch plus a Buy/Sell `SegmentedControl` inside the order
ticket drawer, which default-populates with the current instrument and last price, shows a disabled+spinner
submitting state, then a success panel — opened on demand, closed by default, never a permanent third pane.

## Font / typography confirmation

Body and all copy on the global `--font-sans` (Pretendard). The wordmark "Fathom" in the sidebar brand lockup is
the only text set in `--font-display-wide`, used exactly once. Exactly 3 rendered font weights route-wide —
`font-normal`, `font-medium`, `font-semibold` — grepped clean across every file in this folder (no `font-bold`,
`font-light`, etc.). The one inline SVG text weight (the chart tooltip's candle-date label) uses `fontWeight: 600`,
matching `font-semibold`'s rendered weight rather than introducing a fourth.

## 브리프에 없던 것

1. **The actual instrument roster, prices and candle math.** The brief specified the chart form (candlestick, ≤500
   candles, hollow-up/filled-down) but no real dataset. I picked 7 plausible crypto pairs (BTC/ETH/SOL/XRP/AVAX/
   LINK/DOGE-USD) with per-instrument base prices, decimal precision (2 or 4), and a seeded sine/cosine generator
   in `data.ts` that chains `open[i] = close[i-1]` for continuity — fully deterministic, no `Math.random`/`Date.now`/
   bare `new Date()`, and every candle's high/low always bounds its open/close by construction.
2. **Which "selection" stays narrow vs. which is navigation.** The brief distinguishes watchlist-rail clicks
   (navigation) from a true "selection" interaction that must stay narrow. I kept the candle click-to-select
   entirely local to the chart component's own state (not lifted to the page), so by construction it can only ever
   touch its own "Selected" readout line — there was no sibling widget it could threaten to fan out into.
3. **Avoiding the empty-detail-panel defect without building a detail panel at all.** Rather than invent a
   "selected trade" pane that starts blank, I followed the brief's simplest escape hatch: no permanently-reserved
   pane exists. The order ticket is a closed-by-default drawer that, when opened, default-populates with the
   currently-viewed instrument and its last price rather than empty fields.
4. **Pre-emptive fixes for the two documented r40 hard-gate traps.** Every `FOCUS_RING` in this route (including on
   SVG candle hit-rects) is `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600`
   with zero `outline-none` anywhere in the folder (grepped clean). No inline SVG anywhere uses a `<title>` element;
   the chart's outer `<svg>` carries a direct `aria-label` with no role (it has real focusable children, so
   `role="img"` was deliberately avoided too, since that role is defined to hide descendant content from the
   accessibility tree); the decorative sparkline and legend-sample SVGs use `aria-label`/`aria-hidden` instead.
5. **Table responsiveness without a second horizontal scroller.** The chart is the one widget that could need
   horizontal room, so it scales via a fixed `viewBox` at `width: 100%` instead of scrolling at all. Both the OHLC
   history and Recent Trades tables use `table-fixed` + percentage `<colgroup>` and switch to a stacked `dl`-card
   list below the `sm` breakpoint, so neither ever needs its own `overflow-x-auto`.
