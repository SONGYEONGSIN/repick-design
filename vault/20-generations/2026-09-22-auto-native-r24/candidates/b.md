# auto-native-r24 · candidate b — Seller Sales Analytics

**Concept**: a read-only seller-facing performance dashboard — revenue trend, category revenue split and a tap-to-expand best-sellers list, driven by a 7D/30D/90D period selector that swaps in a different precomputed dataset.

**Render-check string**: `Seller Sales Analytics`
(the `accessibilityRole="header"` top-level heading in `SellerAnalyticsScreen`'s header — always present in the default render regardless of period state.)

**Export**: `SellerAnalyticsScreen` (named export) at `native/src/evolve/r24/b/SellerAnalyticsScreen.tsx`, data at `native/src/evolve/r24/b/data.ts`.

**Charts reused**: `LineChart` (revenue trend, with `formatCompact` Y-axis labels), `BarBreakdown` (category revenue split, values out of 100), `Sparkline` (per-best-seller recent-activity trend, nested inside each tappable row).

**Band form**: persistent always-visible bottom action bar (not a state machine) — this is a completed/read-only record screen with no blocked step to explain, per native/GENERATION.md §3's "certificate" precedent. The bar's one action, "Copy summary", is a real toggle: pressing it swaps the bar's own lead sentence for a genuine confirmation sentence (`Summary for <period> copied — ready to paste into a message.`), announced via a `accessibilityLiveRegion="polite"` container + `accessibilityRole="alert"` on the transition text, and the button label itself changes to "Copy again" — not a silent no-op.

**Required interactions delivered**:
1. Period selector (7D/30D/90D) — real `useState<Period>`, recomputes `dataset` from `PERIOD_DATA[period]` (three fixed literal datasets in `data.ts`), which drives the hero revenue figure, % change, orders/AOV tiles, the `LineChart` points, the `BarBreakdown` data and the best-sellers `FlatList` data all at once. Active segment conveyed by filled ink background + bold text + `accessibilityState={{ selected }}`, not color alone.
2. Action bar "Copy summary" (see Band form above).
3. Best-seller row tap-to-expand — each `FlatList` row is a `Pressable` with `accessibilityState={{ expanded }}`; tapping reveals an inline units-sold + revenue line for that item, using `PERIOD_DATA[period].bestSellers[i]`.

## Brief gaps

- **① Which numbers make up "revenue trend" per period, and at what granularity.**
  **②** 7D uses 7 daily points (Mon–Sun); 30D uses 5 weekly points (Wk1–Wk5); 90D uses 6 roughly-15-day bucket points (P1–P6) — not 90 daily points.
  **③** The brief didn't specify point density. Plotting 90 raw daily points on a ~300px-wide `LineChart` (built for ~7–14 points, with per-point X labels) would be unreadable and would make the touch-tooltip's nearest-point hit-testing nearly useless. Aggregating to a fixed number of buckets per period is a standard dashboard convention and keeps all three periods' charts equally legible.

- **① What the "previous period" comparison baseline is for the % change figure.**
  **②** A fixed literal `previousTotalRevenueWon` per period (e.g. 7D's previous-7-days total = ₩1,290,000), not derived from any visible data — it represents a prior period that isn't otherwise shown on screen.
  **③** The brief asked for "revenue trend over time" but didn't specify a comparison figure; I added one (hero card's `▲ X% vs the previous period`) because a sales-analytics dashboard without any period-over-period comparison felt like a materially weaker read of the concept, and the rule set requires all aggregates to come from fixed literals rather than being invented at render time — so the "previous period" total needed its own fixed literal input rather than being computed from the current chart's own points.

- **① Whether category-split bar values are a percentage, a currency amount, or a unit count.**
  **②** Percentage share of revenue, values summing to 100 per period.
  **③** `BarBreakdown` renders `max`-relative fills with the raw numeric value printed as-is (no unit suffix baked into the component, and I didn't modify the shared chart file). Percentages summing to 100 read unambiguously as "share of revenue" once labeled in the section subhead ("Share of revenue by category, out of 100"), without needing to touch `BarBreakdown.tsx` to add a `%` glyph.

- **① Which single action belongs on the persistent action bar.**
  **②** "Copy summary" (a clipboard-style confirmation toggle), not a multi-destination share panel.
  **③** The brief offered both as valid options. I picked the simpler clipboard-toggle over a destination-list panel (like the existing certificate screen's `Share certificate`) specifically to keep this candidate's code surface distinct from that screen's `sharePanel`/`shareRow` pattern, per native/GENERATION.md's note that reusing a band's *principle* is fine but duplicating its *style-key surface* reads as a retread.

- **① Default period on first render.**
  **②** 30D.
  **③** Not specified. 30D is a common default granularity for a seller dashboard (short enough to feel current, long enough to show a real trend) — arbitrary but reasonable, and it's real `useState`, so any period is reachable immediately via the segmented control.
