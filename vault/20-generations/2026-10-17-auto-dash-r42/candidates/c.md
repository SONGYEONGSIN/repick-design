# Candidate C — Varia · Experiment Comparison Lab

**Product/brand**: Varia — an A/B-testing & experimentation platform for product teams (checkout flows, pricing pages, onboarding, search ranking, lifecycle email). Route: `app/src/app/dash-evolve/r42/c/page.tsx`.

**One-line concept**: A "lab notebook" macro-shell — a comparison *bench* of up to three pinned experiments, each shown as a full run card (headline lift number, 95%-CI whisker plot, control-vs-variant rate bars, secondary-metric mini-table) side by side — with a separate chip rail below for pinning/unpinning, and a full sortable experiment log underneath. There is no master-detail pane anywhere: pinning an experiment doesn't open a detail view elsewhere, it *is* the detail, placed directly on the bench.

## Interactions implemented (5 of the 4 required)
1. **Chart hover crosshair tooltip, keyboard-accessible** — the lift-CI whisker's point estimate has a 24×24 transparent overlay button (`metric-chart.tsx`) that opens an exact-value tooltip on `onMouseEnter`/`onFocus` and closes on `onMouseLeave`/`onBlur`. The proof (lift %, CI bounds, confidence %) is also always printed as static text below the plot — hovering only adds precision, never gates the first view of the number.
2. **Real table sort + filter** — `experiments-table.tsx`: every column sortable with `aria-sort`, plus a status segmented-control filter (All/Running/Shipped/Paused).
3. **Period/view toggle** — "Last 7 days" vs. "Full test period" segmented control on the bench widens/narrows each pinned card's CI whisker (wider interval on less data), on a domain that stays stable across the toggle so the axis doesn't jump.
4. **Selection syncing, narrowly scoped (not fanned to 3+ siblings)** — pinning (persistent) only ever touches the bench grid; hovering/focusing a rail chip (ephemeral, `experiment-rail.tsx`) only ever opens a small preview popover, and that preview is explicitly suppressed when the hovered chip is already pinned (`hoveredId && !pinnedIds.includes(hoveredId)`), wired through pointer *and* focus events on the same element.
5. **⌘K command palette** — search by name/metric/owner; selecting a result toggles its pin state on the bench.

The bench also defaults to two real, already-significant experiments pinned (`checkout-cta`, `pricing-annual-first`) — it never renders as an empty "select something" placeholder.

The header's primary action ("New experiment") has a real `onClick` that opens a functioning right-side drawer (name/hypothesis/metric fields, focus moves to the first field, Escape and backdrop both close it) — not a dead button.

## Font/typography confirmation
- Body/UI text: `--font-sans` (Pretendard) throughout.
- Display face: `--font-display-wide` used in exactly two places — the "Varia" wordmark and the page `<h1>` — both headline/wordmark-scale, nothing else.
- Exactly 3 rendered weights: `font-normal` (400), `font-medium` (500), `font-semibold` (600). Every text-bearing element carries one of these explicitly (audited by grep; no `font-bold`/`font-light`/unstyled text nodes).
- All numbers `tabular-nums`; the bench's lift headline (`text-3xl`) is the largest text on the page — the page `<h1>` is `text-2xl`, strictly smaller, so no other persistent element competes with the dominant visualization's own readout.
- Signed percentages use a true minus sign (U+2212), not a hyphen, consistently via one `formatSignedPct` helper.

## Completeness vs. the SaaS reference bar
- Full mandatory app shell: sidebar (brand lockup, workspace switcher, 5-item nav with active pill, bottom user/sign-out), top bar (⌘K search button, working primary CTA, notifications popover, avatar menu popover), mobile drawer, 44px control height.
- Dark theme on zinc-950/900 surfaces with `white/10` borders; lime-400 as the single accent (verified ≈13:1 contrast against zinc-950/900 — well past AA even at body-text size, so no need to restrict it to large-text-only), plus rose-400/amber-400 used only as *semantic* (not decorative) state color, always paired with an icon or label text.
- One single source of truth for "is this lift real" (`classifyLift`) and one shared `LIFT_META` icon map, reused identically by the bench cards, the table, and the command palette, so the same experiment can never show a different direction icon in two places.
- Real sortable `<table>` with `<caption>`, `scope`, `aria-sort`; `table-fixed` + `<colgroup>` percentages (sum to 100) instead of `min-w` on cells; the only `overflow-x-auto` on the page is that one table, so there is never a second horizontally-scrolling container.
- Deterministic dummy data only — no `Math.random`/`Date.now`/bare `new Date()`; lift percentages were hand-verified to reconcile against their stated control/variant rates; counts use `Intl.NumberFormat` without `compact` notation (avoids the SSR/client ICU compact-rounding hydration risk).
- Focus-visible uses the one verified-safe pattern (`focus-visible:outline-2 outline-offset-2 outline-lime-400`, no preceding `outline-none`, no bare `ring`) on every interactive element, including controls inside the command palette and the new-experiment drawer.

## 브리프에 없던 것

1. **CI whisker's SVG aspect ratio vs. its absolutely-positioned overlay button**
   ① The brief doesn't address how to keep a percentage-positioned HTML overlay aligned with an SVG that uses a fixed `viewBox` but a fluid CSS width.
   ② Set `preserveAspectRatio="none"` on the whisker-plot SVG so it always stretches to fill its box exactly, keeping the overlay button's `left: X%` positioning pixel-accurate regardless of the card's actual rendered width.
   ③ Without it, default `xMidYMid meet` scaling would letterbox the chart whenever the container's aspect ratio didn't match the viewBox's 5:1 ratio (true at nearly every real card width), silently misaligning the hover/focus hit-target from the visible dot.

2. **Secondary brand accent colors for non-primary semantic states**
   ① The brief fixes lime as *the* accent but says nothing about color for "paused" or "statistically inconclusive/negative" states, which need to read as distinct from both the lime-positive state and each other.
   ② Used `amber-400` for "paused" and `rose-400` for "significant drop," both always paired with an icon (`PauseCircle`/`TrendingDown`) or label text, never color alone.
   ③ Matches this catalog's own established dark-theme convention (e.g. r40's `amber-400`/`red-400` semantic badges alongside a single green brand accent) — semantic status color is treated as separate from "decorative accent," which the 1–2-accent rule is really aimed at.

3. **How much of the bench to default-populate**
   ① The brief requires a sensible non-empty default but not *how many* of the 3 slots should start filled.
   ② Defaulted to 2 of 3 slots pinned (both running, both already significant), leaving the 3rd genuinely empty with an inviting "pin one below" placeholder.
   ③ Arbitrary but deliberate: an all-3-filled default would leave no visible empty-slot affordance to demonstrate the pin interaction's main entry point on first paint, while defaulting to 1 would under-sell the "comparison" framing the chart is named for.

4. **Column-header abbreviation under the fixed-width table**
   ① The brief requires desktop tables never to scroll and gives no guidance on label length vs. percentage-column width.
   ③ Abbreviated "Confidence" → "Confid." and "14-day trend" → "Trend" in the experiment log's headers so they never wrap inside their 10%/14%-wide columns at 1280px.
   ③ Follows the same abbreviation convention already used by this catalog's reference `RegionTable` ("Up"/"Inc."), verified against the narrowest in-scope desktop width rather than assumed.

5. **What "no fake-light" dark polish actually restricts for secondary chart ink**
   ① The brief sets a `zinc-400` floor for *text* but is silent on muted non-text ink (gridlines, zero-line, bar-track background) inside a custom SVG/CSS chart.
   ③ Used `white/10`–`white/25` (as opacity-modified white, not a named gray step) for gridlines, the zero-reference dashed line, and unfilled bar tracks — never text.
   ③ Keeps the "never `-500`/`-600` text" rule unambiguous by not even putting named gray/zinc utilities on non-text ink; opacity-modified white reads as "faint structural line," consistent with how the reference examples draw card borders (`border-white/10`).
