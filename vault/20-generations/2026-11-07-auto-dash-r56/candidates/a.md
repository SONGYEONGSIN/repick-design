# Candidate a — Arbor

A rail-less, ticker-headed ESG scorecard for repick's 12-facility resale/refurb network: the
dominant surface is a full-width slope chart where each facility is one row, a muted dot for last
quarter's score and a bold lime dot for this quarter's, joined by a horizontal line — and, per the
reassignment brief, the row (not the dots) is the only interactive target, fixing the original
Arbor build's target-size spacing failure from the ground up.

## Not specified by the brief

- **Exact accent hex + contrast math.** Picked lime-600/700/800 (`#65a30d` / `#4d7c0f` / `#3f6212`)
  off the standard Tailwind lime ramp, split by use the same way this repo's other single-accent
  routes do:
  - `lime-700` on white (text, active nav, "improving" numerals) = **4.99:1** — clears AA body
    text (4.5:1) with real but thin headroom, which is why it's the floor, not the ceiling, of the
    ramp used for text.
  - `lime-800` solid fill, white text on top = **7.08:1** (AAA), the extra margin a filled button
    needs over a text label.
  - `lime-600`, decorative only (chart stroke/dot, never carries text) = **3.09:1**, clearing the
    3:1 floor WCAG 1.4.11 sets for graphical objects. Direction is always also carried by an
    arrow icon + signed numeral, never by this color alone.
  All four luminances were hand-computed via the sRGB relative-luminance formula, not eyeballed.

- **What "the whole row is one target" means geometrically.** The brief says to make the row the
  hit target but doesn't say how big. I made the `<button>` span the row's full card width and a
  ~56-64px tall padded strip (one `<li>` per facility, dots and line rendered as `aria-hidden`
  decorative SVG inside it with no `onClick`/`tabIndex` of their own). Because WCAG 2.5.8's offset
  clause is measured center-to-center, not edge-to-edge, two full-row targets stacked with normal
  row rhythm are separated by roughly the row height (~60px) center-to-center regardless of
  whether their borders touch — comfortably clearing 24px without needing artificial vertical
  gaps between rows that would look broken in a dense scorecard.

- **What happens on row click, since there's no longer a per-dot tooltip.** I built it as an
  inline disclosure: clicking/Enter/Space-ing a row toggles a non-interactive detail strip
  (E/S/G sub-scores, certification, open incidents, a one-line description) directly below that
  row, via `aria-expanded`/`aria-controls` on the button. I avoided floating/absolutely-positioned
  tooltips on purpose — they're the kind of thing that can end up overlapping a neighboring row's
  hit target, which is exactly the class of bug this rebuild exists to not reintroduce. The
  revealed panel itself holds no interactive controls, so it can't create a second target near the
  row button either.

- **Fan-out scoping between the chart and the table/palette.** The brief's fan-out doctrine says
  to prefer independently-scoped selections over one monolithic recompute. I split this into two
  state atoms in `ArborClient.tsx`: `expandedRowId` (ephemeral, slope-chart-only, toggled by a row
  click) and `pinnedFacilityId` (set only by the facility table's name-button or the ⌘K palette,
  read only by `DetailPanel`). Neither resets the other.

- **QoQ vs YoY as the period toggle.** The brief asked for *a* period/view toggle without
  specifying which axis. ESG reporting is inherently quarterly, so I used quarter-over-quarter vs.
  year-over-year as the two comparison modes, both derived from one `historyPrev: [Q-4,Q-3,Q-2,Q-1]`
  tuple per facility via a single `periodValues()` function — the ticker, the table, and the slope
  chart all call it, so none of the three can disagree about what "previous" means for the active
  mode.

- **ESG weighting formula.** Invented 40% environmental / 30% social / 30% governance, computed
  once in `currentScore()` and never re-derived by hand anywhere else (table cells, ticker
  aggregates, and the detail panel's big score all call that one function).

- **Facility domain/regions.** repick doesn't have real facilities, so I invented 12 across 6
  US regions (sorting hubs, repair & refurb centers, distribution centers, returns-processing
  hubs, resale showrooms) with deterministic, hand-authored E/S/G sub-scores and 4-quarter
  histories — no `Math.random`/`Date.now` anywhere.
