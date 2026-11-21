Outlay — a cloud cost-allocation console whose centerpiece is a two-ring sunburst (org → cost center → service) with an always-visible compact total at its center, backed by a keyboard-reachable collapsible hierarchy list.

## 브리프에 없던 것

1. ① Product/brand name and visual identity.
   ② "Outlay" — zinc-950/900 dark shell, cyan-400 accent, `Orbit` lucide icon as the wordmark glyph (rings evoke the sunburst).
   ③ Arbitrary, but chosen to read as a plausible, boring-on-purpose B2B infra product name — avoids anything resembling a real company.

2. ① Exact cyan/amber contrast values for every text/fill pairing (the brief says "pick a cyan tone... verify AA contrast yourself" but gives no numbers).
   ② Computed WCAG contrast ratios by hand (Node script) for cyan-200…700 vs zinc-950/900, amber-300 vs both, and zinc-400/zinc-500 vs both. Rejected cyan-800/900 as sunburst fills (2.74:1 / 2.18:1, below the 3:1 graphical floor) and capped the team ramp at cyan-700 (3.71:1).
   ③ Referenced convention (WCAG 1.4.11 for graphical objects, WCAG AA 4.5:1 for text) — the general practice already modeled by this repo's r56 candidate, extended with my own numbers for cyan/amber.

3. ① Whether "spend went up" should be colored like "score went up" (i.e. reuse the lime-is-good pattern from the reference convention).
   ② Inverted it: up (spend grew) = amber (the thing to watch), down (spend shrank) = cyan (the good outcome) — and kept this fully separate from the sunburst's own cyan team-identity ramp so the two cyan usages (identity vs. "good") never collide semantically.
   ③ General practice — cost dashboards (Datadog Cost Management, CloudHealth) treat spend increases as the attention-worthy direction, the opposite of a score/health metric.

4. ① The exact domain data: brand, team names, service names, dollar figures, budgets, and three months of history per service.
   ② Invented a 6-team org ("Platform Engineering," "Data & Analytics," "ML Platform," "Payments," "Growth & Marketing Eng," "Customer Support Tooling") with 4 services each, current/prev/prev-prev monthly spend, and a flat monthly budget per team. Built a narrative around it: an ML Platform GPU-training spend spike (+28% MoM) that also pushes it 1.26x over budget, plus a second, smaller overage (Growth & Marketing Eng at 1.02x) to prove the ">100%" treatment isn't a one-off special case.
   ③ Arbitrary numbers, but internally exact — every subtotal is summed from the leaf records by `data.ts` functions, never hand-typed twice, per the brief's own anti-duplicate-number rule.

5. ① Sunburst ring assignment — the brief says "2-3 rings" without specifying which hierarchy level gets which ring, or whether the org level needs a ring at all.
   ② Org total lives in the center hole as an HTML overlay (not a ring); ring A = cost centers; ring B = services. Two literal `<path>` rings plus a non-SVG center label.
   ③ Arbitrary but standard sunburst convention (root in the center hole, each depth level one ring out) — matches how D3/Highcharts sunbursts are conventionally drawn.

6. ① Which labels, if any, get peripheral on-chart text, given the "check your longest label's rendered width against the margin" warning.
   ② Decided to label ONLY ring B (services) with hand-written short forms (`shortLabel`, e.g. "GPU Training," "Observability"), and only when a wedge's angular span clears 14°; ring A (cost centers) gets no on-chart text at all — its identity comes from a color swatch + name that's mirrored in the cost-center rail and the hierarchy tree. Sized the label radius/margin against the dataset's longest `shortLabel` ("Observability," 13 chars) even though that exact string never crosses the 14° threshold today, specifically so a future data edit can't silently break the margin math.
   ③ My own judgment call to keep the chart legible (service names are naturally short/generic — "Compute," "Storage" — while team names are longer and better suited to list/legend form) and to directly satisfy the brief's radius-margin warning with a worked, documented calculation (see `geometry.ts`'s header comment).

7. ① How literally to interpret "each node's name + percentage" for the fallback tree — percentage of what (org total, or of its immediate parent)?
   ② Percentage of ORG total for every node, team and service alike — this is the exact same fraction the sunburst's wedge angles are computed from, so the tree's printed number and the wedge's visual size can never disagree (direct application of the brief's "never two independently-authored numbers" rule).
   ③ My own decision, made specifically to guarantee the chart/fallback consistency the brief requires elsewhere.

8. ① Whether the required period toggle is a 2-state (this month / last month) or needs a third data point.
   ② Added a third historical point (`prevPrevSpend`) per service so toggling to "Last month" has its own real MoM comparison (vs. two months ago) instead of going blank or reusing stale numbers.
   ③ Arbitrary, but necessary for the toggle to be a genuine, fully-derived interaction rather than a cosmetic relabel.

9. ① Default state for the two independent selections (rail pin, hierarchy expansion) on first load.
   ② Pin starts at `null` ("No cost center pinned" empty state, matching the reference convention's own default-null DetailPanel). Hierarchy tree starts with exactly the "this month" top mover (ML Platform) pre-expanded, seeded once via a lazy `useState` initializer — never reset by the period toggle, to avoid the forbidden `setState`-in-effect pattern.
   ③ Referenced convention for the pin default; my own call for the tree, made specifically to dodge the `react-hooks/set-state-in-effect` hard-fail.

10. ① Exact pixel geometry for the sunburst (viewBox size, ring radii, hole size, label-anchor radius) — the brief gives the margin RULE, not numbers.
    ② Worked it from both ends: a center hole generous enough that the compact-currency headline ("$1.9M") never crowds ring A even at the chart's smallest real rendered width (~300–326px on a 390px viewport), and a label-anchor radius whose margin to the viewBox edge was checked against the longest `shortLabel` string at a conservative glyph-width estimate. Landed on a 660×660 viewBox, center hole r=115, rings at 119–158 / 162–201, label anchor at r=213 (117px margin vs. a ~102.7px worst case).
    ③ My own calculation, fully documented in `geometry.ts` and `SunburstChart.tsx`, done by hand since I can't render the page to check visually.

11. ① Whether a `<table>` belongs anywhere on this page, given the brief's extensive table-safety rules (colgroup, table-fixed, single horizontal scroller, etc.).
    ② Used zero `<table>` elements anywhere — the cost-center rail and the hierarchy tree are both plain flex/list markup (`<ul>`/`<button>`), which sidesteps the whole table-overflow rule surface entirely while still satisfying "no desktop horizontal scrollbar."
    ③ My own simplification, made deliberately to reduce the page's overflow-risk surface given I can't visually verify rendering.

12. ① Nav items, workspace names, notification copy, and the current user's identity/avatar for the global shell.
    ② Invented "Priya Natarajan, Platform finance lead," a fixed `images.unsplash.com/photo-1494790108377-be9c29b29330` portrait, three workspace entries, and nav items split into "Work" (Spend/Cost centers/Budgets/Anomalies) and disabled "Insight" (Forecasts/Reports, "Soon").
    ③ Arbitrary, following the reference convention's exact shape (brand lockup + workspace switcher + nav sections + user area) one-for-one so the global shell reads as a believable, generic SaaS console rather than a one-off skin.
