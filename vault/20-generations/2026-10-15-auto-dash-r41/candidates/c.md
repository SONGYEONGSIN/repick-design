# Candidate C — Pulsegrid

**Concept**: Pulsegrid, an APM anomaly console whose dominant visualization is a 24-hour time-series line (Latency
p95 / Error rate / CPU) drawn against a dashed, low-opacity "expected range" band, with every point that falls
outside the band marked by a distinct diamond (spike above) or triangle (dip below) glyph and its exact value +
deviation printed directly on the chart as always-visible text — never hover-only — backed by an always-visible
"Active anomalies" strip and a matching plain anomaly-events table underneath.

## Interactions implemented (5)

1. **Metric toggle (segmented control)** — Latency / Errors / CPU swaps the entire 24-point dataset feeding the
   chart, the KPI strip, the active-anomalies strip, the table and the focused-anomaly readout (`page.tsx` →
   `anomaly-chart.tsx`).
2. **Crosshair hover tooltip** on the chart — mouse-driven vertical crosshair + point marker + a floating card
   with the hour's actual value, expected range and (if any) deviation; purely supplementary, since the same
   figures are already always-visible in the strip/table (`anomaly-chart.tsx`).
3. **Click-to-focus an anomaly** from the "Active anomalies" chips — narrowly updates one readout line ("Focused
   anomaly…") plus a dashed selection ring around that one marker on the chart; defaults to the metric's most
   severe anomaly on load and whenever the metric changes, so the readout is never empty (`anomaly-strip.tsx` →
   `page.tsx` / `anomaly-chart.tsx`).
4. **Real table sort** on the anomaly-events table — clickable, `aria-sort`-correct Time and Deviation columns,
   each toggling asc/desc independently (`anomaly-table.tsx`).
5. **⌘K command palette** — opens via the header trigger or Cmd/Ctrl+K, searches metrics and anomalies together,
   selecting either swaps the metric (and anomaly) in the same narrow way as #3 (`command-palette.tsx`).

All of the above are deterministic (no `Math.random`, `Date.now`, or bare `new Date()` — all 72 data points across
the three metrics are fixed literals), and every transition is `motion-safe:`-gated.

## Typography confirmation

Exactly three rendered font weights across the whole route: `font-normal` (400, body/caption/axis labels),
`font-medium` (500, labels/nav/badges/table cells/chart value labels), `font-semibold` (600, headings and sort
column labels). No `font-bold`, `font-light`, or any other weight utility appears anywhere in the folder. The
wordmark "Pulsegrid" is the only text set in `var(--font-display-grotesk)`; everything else, including all body
copy and Korean, stays on the global `--font-sans` (Pretendard).

## 브리프에 없던 것

1. **The three concrete metric datasets and their anomalies.** The brief specified the chart form (anomaly
   detection with a band + markers) but not actual numbers. I hand-built 24 hourly points per metric (latency,
   error rate, CPU) with a believable diurnal baseline, a derived ±18–22% expected-range band, and 2–3 injected
   anomalies per metric chosen so severity (`deviation / bandWidth`) spans both "warning" and "critical" within
   each metric — direction, deviation and severity are all *derived* functions of the raw numbers (never stored
   redundantly), so the chart markers, the strip and the fallback table can never drift out of sync with each
   other.
2. **Whether the fallback table should list all 24 points or only the flagged ones.** The brief's own wording
   ("matching the chart's own flagged points exactly") read as "anomalies only," so the table holds 2–3 rows per
   metric, not 24 — and I additionally split it into a real `<table>` at `sm:` and up and a flat `dt`/`dd`
   definition list below `sm:`, since a 5-column table with an "Expected range" cell has no safe nowrap width at
   390px.
3. **How "default-select the most severe anomaly" interacts with the metric toggle.** The brief required the
   detail readout never be empty by default but didn't say what happens to the selection when the user swaps
   metrics mid-session. I re-run the "pick the most severe anomaly" rule every time the metric changes (via a
   stored-previous-value comparison in the render body, not a `useEffect`, to avoid
   `react-hooks/set-state-in-effect`), so switching from Latency to CPU never leaves a stale or empty focus.
4. **Pre-emptive fixes for the two documented r40 hard-gate traps.** Every `FOCUS_RING` constant in this route is
   `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600` with no `outline-none`
   anywhere in the folder (grepped clean). No inline SVG anywhere uses a `<title>` element — the chart's decorative
   `<svg>` carries `aria-hidden="true"` instead (since its full value/deviation content already exists as
   always-visible HTML text beside it), and the tiny legend glyphs use `aria-hidden` for the same reason. The
   chart's own `<svg>` has no fixed `width`/`height` attributes, only `viewBox` + `className="block h-auto w-full"`,
   so it shrinks correctly at every desktop width without forcing a scrollbar.
