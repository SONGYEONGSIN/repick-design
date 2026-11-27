# Candidate B — Vantage (vendor scorecard radar)

## Concept

**Vantage** — a supplier-performance SaaS dashboard whose dominant view is a single radar chart
comparing up to four vendors at once across six fixed procurement axes (Cost Efficiency, Quality,
Delivery Speed, Reliability, Support, Compliance), with toggle chips controlling which vendors are
overlaid and an always-visible data table underneath carrying the same raw numbers.

## Interactions implemented (5 of the suggested 4+)

1. **Vertex tooltip on the radar chart** (ephemeral, keyboard-accessible) — six invisible hotspot
   buttons sit at each axis's outer grid vertex; hover *or* keyboard focus on one opens a small
   panel showing that single axis's exact value for every currently overlaid vendor. Hover and
   focus share one `activeAxisId` state and both clear it on leave/blur, so neither can get stuck
   open. `radar-chart.tsx`.
2. **Real table sort** on the fallback table — clicking the "Axis" header or any vendor column
   header toggles `aria-sort="ascending"/"descending"`, re-sorting the visible rows; numeric
   columns default to descending (highest first), the axis column to alphabetical ascending.
   `fallback-table.tsx`.
3. **Toggle-chip selection → the radar + its fallback table recompute in place** — this is the
   page's only selection mechanism, by design. There is no separate detail/consumer pane: clicking
   a vendor chip (or the equivalent command in the palette) directly redraws the same radar
   polygon and the same table rows. Order of selection assigns which of four fixed, accessible
   series styles (color **and** stroke pattern **and** marker shape) a vendor gets, so overlaying
   never relies on color alone. `entity-toggle.tsx`, `dashboard.tsx`.
4. **Reporting-period segmented control** ("Q3 2026" / "Q2 2026") — swaps the two static score
   datasets feeding the radar and table (and only those two; the KPI strip stays anchored to the
   latest quarter, see Brief gaps). `ui.tsx` (`SegmentedControl`), `dashboard.tsx`.
5. **⌘K command palette** — a second entry point into the *same two* controls above (toggle a
   vendor's overlay membership, switch reporting period), filterable, arrow-key + Enter operable,
   Escape-to-close with focus returned to the search button. It deliberately does not add any new
   surface of its own. `command-palette.tsx`.

A sixth, smaller touch: the radar's series mount/unmount with a short opacity+scale transition via
`framer-motion`'s `AnimatePresence`, gated through `useReducedMotion()` (duration drops to 0 when
reduced motion is preferred).

## Typography discipline

- Single optional display face used: **Space Grotesk Display**
  (`font-[family-name:var(--font-display-grotesk)]`), applied only to the brand wordmark
  ("Vantage" in the sidebar) and the page's one `<h1>` ("Vendor Scorecard"). Everything else stays
  on the default Pretendard body stack.
- **Exactly three rendered font weights** across the route: 400 (default/unset — body copy, table
  data cells, captions, chip text, nav secondary text), 600 (`font-semibold` — card/section `h2`s,
  nav labels, table column headers, workspace/account-menu names), and 700 (`font-bold` — the
  `h1`, the brand wordmark, and the four KPI tiles' big figures). No `font-medium` anywhere. Every
  `<th>` was given an explicit `font-semibold` even where its visible text sits on a nested
  `<button>`, specifically to cancel the browser's unreset UA-default `th { font-weight: bold }`
  and remove any ambiguity about a stray fourth weight.
- No Korean text anywhere; no `font-serif`; no new `next/font` imports; numbers use `tabular-nums`.

## Brief gaps

Things the brief left to my judgment, and what I decided:

① **How many vendors can be overlaid at once, and what happens past the limit.**
→ Decided: cap at 4 (not the "2–3" the brief suggested as typical), blocking further additions
with an `aria-live` message rather than disabling chips (so every chip stays reachable).
→ Why: 4 is exactly how many visually-distinct, accessible stroke-pattern+marker-shape styles I
designed (solid/dashed/dotted/dash-dot × circle/square/triangle/diamond); going further would
force either reusing a style (breaking the "never color alone" rule) or adding a 5th pattern that
gets harder to tell apart on a small chart. Bounded by my own design decision, not the brief.

② **Whether the period toggle should also change the subordinate KPI strip.**
→ Decided: the "Avg overlay score" KPI tile always reflects the *latest* quarter (Q3 2026)
regardless of the page's Q3/Q2 period toggle, which only scopes the radar + table next to it. The
tile's caption says "Q3 2026" explicitly so the anchor is never ambiguous.
→ Why: arbitrary, in favor of a simpler mental model — one number in the subordinate strip that
means the same thing no matter what else on the page is being compared, rather than a KPI whose
meaning silently changes with an unrelated-looking toggle.

③ **Whether to include a `Tabs` component**, since the brief's component-system list names it
alongside Card/table/segmented control/dropdown/badges/progress/sparklines.
→ Decided: omitted. I built all the others (Card, sortable table, segmented control, three
dropdown/popovers, status badges, a progress bar, a sparkline) but deliberately did not invent a
tabbed sub-view.
→ Why: the only place tabs would plausibly fit is a secondary content pane, and the brief's
selection-fan-out section explicitly warns against adding "some other persistent detail pane that
swaps content" as a second, worse axis on top of the toggle-chip mechanism. I judged a manufactured
tab control not worth that risk for one checklist item.

④ **Domain, vendor roster, and axis set** (brief said "invent your own").
→ Decided: vendor/supplier management, 7 vendors, 6 axes (Cost Efficiency, Quality, Delivery
Speed, Reliability, Support, Compliance).
→ Why: vendor management was explicitly suggested in the brief as a good fit for this chart type;
6 axes is within the "5–8" range given and matches a recognizable real-world procurement
scorecard shape; 7 vendors gives the toggle-chip list enough density to be a real control without
becoming unwieldy.

⑤ **Whether series style is tied to a fixed vendor or to selection order.**
→ Decided: selection order assigns style (first vendor toggled on gets style 0, and so on), not a
fixed per-vendor mapping.
→ Why: with only 4 accessible styles and 7 vendors, a fixed mapping would mean some combinations
of overlaid vendors share a style slot incorrectly or leave styles unused; order-based assignment
guarantees the 4 styles in play are always the 4 actually visible on the chart.

⑥ **Command palette scope.**
→ Decided: it only ever does two things — toggle a vendor's overlay membership, or switch the
reporting period — mirroring the two real controls on the page, rather than a general fuzzy
nav-search over invented routes (Vendors, Contracts, etc. in the sidebar are inert placeholders).
→ Why: keeps it a genuine second entry point into the one selection mechanism instead of a
decorative affordance pointing at pages that don't exist in this single-route deliverable.

⑦ **The ultra-wide max-width cap value.**
→ Decided: `max-w-[1680px]` on the main content column, against a 256px (`w-64`) sidebar and 64px
of total horizontal padding (`lg:px-8`) — available width at 1920px is 1920 − 256 − 64 = 1600px, so
the 1680px cap never actually engages at 1920 (content simply fills the 1600px available) and only
starts constraining above that.
→ Why: directly computed from my own chosen shell dimensions per the brief's formula; the exact
cap number itself was otherwise unconstrained.

⑧ **Not animating the radar polygon's shape when scores change** (e.g. on period toggle), versus
only animating whole-series mount/unmount.
→ Decided: only the add/remove of a series animates (opacity + scale, via `AnimatePresence`);
changing the *same* series' values (period toggle) re-renders the polygon instantly.
→ Why: tweening an SVG `points`/`d` list between two different value sets needs point-by-point
interpolation that `framer-motion` doesn't do for free (it doesn't path-morph arbitrary polygons),
and a naive attempt risks a jumpy, not-actually-smooth animation. I judged an honest instant redraw
better than a broken-looking fake smooth one, and the brief's own phrasing ("something subtle
like...") treated the morph as an example, not a requirement.
