# Candidate C — Arbor ESG Facility Scorecard

Arbor is a multi-facility ESG/compliance platform rendered as a rail-less, single-column dashboard: a slim app shell (sidebar + topbar) opens directly onto a one-line middot-separated stat ticker, then a single full-width dominant visualization — a per-facility slope/dumbbell chart comparing each of ten facilities' Emissions, Safety and Compliance scores between Q2 FY26 and the current Q3 FY26, with both quarters always printed as flanking text next to every track rather than hidden behind hover. The page is light (white canvas), uses one desaturated lime accent for brand/interactive state and Pretendard only (no display face, three rendered weights total), and wires two independently-scoped selection states — an ephemeral per-dot hover/focus crosshair-tooltip local to the chart, and a persistent row-click "pin" that opens a non-modal facility detail panel pre-loaded with the quarter's biggest decliner — on top of a real sort/filter toolbar, a metric-switching segmented control that also re-drives the ticker, and a ⌘K command palette.

## 브리프에 없던 것

- ① Whether the three ESG metrics should share one 0–100 scale or each keep its own native unit (e.g. raw tonnes CO₂ for emissions).
  ② Defined all three as 0–100 "performance scores" (higher is always better) on one shared scale.
  ③ Arbitrary, but deliberate: the brief's hard rule that the metric toggle must drive "the" slope chart implies one consistent track geometry across all three views; a shared scale lets the toggle swap data without re-deriving axis bounds or flipping "higher/lower is better" semantics per metric, which would have made the single TrendIndicator component's up/down logic metric-dependent and riskier for the orientation-consistency rule.

- ① How to keep the mandatory detail drawer from either defaulting empty or requiring a full modal focus-trap implementation.
  ② Made it a non-modal `role="complementary"` panel that is fully unmounted (not just visually hidden) while closed, pre-populated with the biggest cross-metric decliner (Perth Minerals Yard) the moment it's shown.
  ③ Convention: matches how Mercury/Linear-style products use persistent side panels rather than blocking dialogs for record detail; unmounting-when-closed was the safer a11y choice over `translate-x-full`-and-leave-mounted, which would leave off-screen content still keyboard/SR-reachable.

- ① Exact facility set, names, regions and the two quarters' numbers — the brief only specifies the domain and the "both values always visible" mechanic, not actual data.
  ② Ten invented facilities across NA/EMEA/APAC/LATAM (manufacturing, logistics, data center, energy), with hand-set Q2→Q3 FY26 scores where Austin Battery Works is the largest improver and Perth Minerals Yard the largest decliner on every metric.
  ③ Arbitrary but constrained: picked names ≤24 characters specifically to stay inside the grid-craft "minimize mid-word truncation" rule at the label column width chosen for the 1280px floor, and chose deltas so every stat the ticker/sort/filter surfaces (averages, improving-counts, flagged-count, top mover) is a true `reduce()` over the table rather than a hand-typed figure that could drift from it.
