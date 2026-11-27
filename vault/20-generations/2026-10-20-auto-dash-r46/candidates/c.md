# Candidate C — Tidemark

**One-line concept**: Tidemark is a revenue-intelligence console for a subscription/e-commerce finance team — ten acquisition channels rendered as a dense grid of horizon-chart rows (daily % deviation from each channel's 28-day baseline, folded into 3-band color-intensity strips), topped by a KPI headline strip and backed by a fully sortable fallback table.

- Archetype: **dense grid/list of horizon-chart rows** (KPI strip above, one row per channel below) — explicitly not a kanban board, not master-detail, not feed-centric.
- Theme: dark (`zinc-950`/`zinc-900` surfaces, `border-white/10`, `zinc-50`/`zinc-400` text) · accent: plain Tailwind **violet** (`violet-400`/`-500`/`-600`, not a house hex) · display face: `--font-display-grotesk`, used only for the "Tidemark" wordmark.
- Structure, top to bottom: KPI strip (4 cards, `xl:` 4-up) → "Revenue deviation by channel" card (period/scheme segmented controls + color legend + 10 horizon rows, each independently expandable in place) → "Same data, as numbers" fallback table (sortable, `sm:hidden` card list below 640px).

## Interactions (4 required, 5 implemented + shell extras)

1. **Period-range toggle** (`horizon-board.tsx`) — 30d/90d segmented control recomputes the horizon strips' day-window, the "Net revenue impact" KPI (`netRevenueImpact(days)`), and the "Channels declining" KPI (`decliningCount(days)`). The two "right now" KPIs (steepest decline / strongest gain) are deliberately **not** wired to it — they read the fixed last-index value, same as the expanded panel's full-90-day view, and both are labelled "independent of the period toggle" so the two kinds of number are never confused.
2. **Band-intensity scheme toggle** (diverging/sequential) — real state swapping which fill-class ramp `buildBandRects` uses for negative values: diverging splits sign into a second hue (rose ramp), sequential reuses the same violet ramp for both signs so color encodes magnitude only and the row's own signed text label becomes the only way to read direction. The legend row re-renders to match (hides the rose swatches and explains the fallback in sequential mode).
3. **Row hover/focus crosshair tooltip, keyboard accessible** (`horizon-row.tsx`) — each row's horizon strip is one `tabIndex=0` wrapper div (not 90 separate stops): `onMouseMove` maps pointer X to a day index via `getBoundingClientRect`; focusing it seeds the cursor at "today"; ArrowLeft/ArrowRight/Home/End step it. A crosshair line draws inside the SVG's own `viewBox` (bounded by construction) and an opaque `bg-zinc-800` tooltip + an `aria-live="polite"` sr-only span announce the exact day label and signed value. Entirely local `useState` per row — no other row, and nothing else on the page, reacts.
4. **In-place row expansion** (the chart's own fan-out mechanic, see below) — clicking/focusing a row's name toggles that row's own `expanded` boolean.
5. **Real fallback-table sort** (`fallback-table.tsx`) — 6 `aria-sort` columns (Channel/Current/30d avg/90d avg/Min/Max), ascending/descending toggle, fully separate `useState` that touches nothing in the chart section and is touched by nothing in it.

Shell extras, all with real `onClick`: ⌘K command palette (scrolls to and focuses a channel's row — pure navigation, writes no shared "selected channel" state), a "New alert" drawer that actually appends to an `alerts` array rendered in the notifications panel, workspace switcher, notifications popover, account menu, mobile nav drawer.

## Font/weight discipline

- Body/Korean-capable text stays on `--font-sans` everywhere; the only Latin display use of `--font-display-grotesk` is the sidebar wordmark "Tidemark" (one face, one spot).
- Rendered weights, route-wide: exactly 3 — `font-normal` (400), `font-medium` (500), `font-semibold` (600). No `font-bold`/`font-light`/etc. anywhere (checked by grep across all 10 files in the folder).
- Every `<th>` that carries its own direct text (the fallback table's "Momentum" header) gets an explicit `font-medium` so it can never render at the browser's UA-default bold; the sortable headers' text instead lives inside a nested `<button className="font-medium ...">`, so the `<th>` itself never has a direct text node to default-bold in the first place. `<caption>` gets an explicit `font-normal` too, even though it is `sr-only`, since the weight gate measures computed style regardless of visibility.
- All numbers are `tabular-nums`; all 11px labels are `uppercase tracking-[0.06em]`.

## Fallback table for the horizon chart (a11y requirement)

`fallback-table.tsx` is always in the DOM directly below the chart card — reachable by scrolling or Tab, no click/toggle needed to reveal it. It carries the same per-channel numbers the horizon strips encode as color/band-height: Current (today), 30-day avg, 90-day avg, 90-day Min, 90-day Max, plus a derived "Momentum" column (30d avg vs. 90d avg, Improving/Steady/Worsening with icon+color+text). Every column is sortable (`aria-sort`, ascending/descending). Below 640px it swaps to a `sm:hidden` card list (`hidden sm:block` for the table) so no horizontal scrollbar is ever needed — there is exactly one scroll-capable axis on the whole page (vertical, on `<main>`), zero `overflow-x-auto` containers.

## Secondary (non-color) magnitude channel

Every horizon row pins its exact signed current value (`formatPctSigned`, e.g. "−18.0%") as plain `text-xl tabular-nums` text at the right end of the row, outside the colored SVG entirely — never on top of a tinted band, so no text ever needs a per-band contrast check. The crosshair tooltip adds the same discipline per-day (date label + signed value as opaque-background text, not color-only). The legend pairs every swatch with a text range label. Color is never the only channel anywhere color is used to encode data.

## Why the row-expansion mechanic has no separate detail component

Each `HorizonRow` owns its own `expanded` boolean via local `useState`, initialized per-instance from a prop (`defaultExpanded`) computed once in `data.ts`. Clicking a row's name toggles only that instance's own state; the expanded content — a full-90-day line+area chart and four stat chips — renders **inside that same row's own markup**, directly below its compact strip, never in a separate panel, sidebar, or drawer elsewhere on the page. No `selectedId` is threaded anywhere: the command palette's "jump to channel" is pure `scrollIntoView` + `.focus()` navigation, never a state write, specifically so it can never become a second consumer of a shared selection. This is the deliberate "no separate detail component at all" tier: expanding one row changes nothing else on the page, and collapsing it is equally local.

## 브리프에 없던 것

1. ① The concrete product/domain for the horizon chart — the brief offered "an infrastructure/observability console… or a per-channel revenue-trend console" as two options and left the choice open.
   ② Invented **Tidemark**, a revenue-intelligence console tracking ten acquisition channels' daily % deviation from a 28-day baseline.
   ③ Chose revenue-over-infra specifically to differ from this session's immediately preceding dark-theme round (`r44/c`, "Quorum," an infra/incident console) — same macro territory (a finance/ops SaaS) but a genuinely different subject and dataset shape, so the two dark dashboards in this catalog read as two different products rather than re-skins of one idea.

2. ① The exact horizon-chart rendering technique — the brief describes the *concept* (banded, folded, increasing intensity) but not literal pixel geometry, and classic horizon charts fold a continuous area curve, which doesn't translate cleanly to crisp, deterministic, rounded-to-2-decimal SVG coordinates for 90 daily points per row.
   ② Built it as **discrete per-day bars**, not a folded area curve: each day is a 1-unit-wide column, and each of 3 bands draws its own clamped-contribution rectangle anchored to the zero midline (`buildBandRects`). Stacking three bands per day reproduces the horizon chart's defining "increasing intensity = deeper into range" read, just via bars instead of a continuous fold.
   ③ A bar-per-day horizon variant is a documented real-world variant of the technique (useful for naturally discrete daily data, which revenue figures are) and sidesteps clipping-path math entirely — every rectangle's `x/y/width/height` is a single closed-form expression, trivially rounded to 2 decimals, with no risk of a path self-intersecting or rendering a sliver at a boundary.

3. ① Whether the expanded row's "full-resolution line chart" (explicitly named in the brief) should reuse the same banded technique at a larger scale, or be a genuinely different chart type.
   ② Built a real line+area chart for the expanded panel: one continuous `<polyline>` plus two sign-gated `<polygon>` fills (positive area anchored to the zero line, negative area anchored to the zero line, each zeroed out wherever the sign doesn't match) — a different rendering from the compact bars, not more horizon bands.
   ③ The brief's own wording ("showing its full-resolution line chart and stats") names a line chart specifically; reusing the banded technique at a bigger size would have technically shown "more resolution" but not actually delivered the different visual object the brief describes, and building a second, distinct chart type gives expansion a genuine payoff beyond "the same strip, but bigger."

4. ① What "period" the fallback table's columns should be, given the brief says "same series×period numeric values" but a literal day-by-day replica of 30–90 columns would break the mobile card-list layout and `table-fixed` width budget.
   ② Used aggregate periods instead of literal days: Current (today), 30-day avg, 90-day avg, 90-day Min, 90-day Max — six genuinely different numeric views of the identical per-channel series the horizon strips render, all derived from the same `SERIES` array via the same handful of pure functions (`currentValue`/`periodAvg`/`periodMin`/`periodMax`).
   ③ Treated "same series×period numeric values" as "the same underlying numbers, at meaningful period granularities" rather than "literally every day as its own column" — a 90-column table would itself need a horizontal scroller, directly reintroducing the "two wide scrollers on one page" pitfall the brief explicitly warns against.

5. ① Exactly which two numbers to compare for the fallback table's "Momentum" column, since it needed to be genuinely different information from the "Current" column (not just the same value restated with an icon).
   ② Defined momentum as 30-day avg vs. 90-day avg (Improving / Steady / Worsening, ±1 percentage-point epsilon for "Steady"), a medium-term trend reading distinct from "Current" (today's single value) and from the KPI strip's "right now" figures.
   ③ Arbitrary threshold and comparison pair, but chosen so the table's seven columns tell seven different stories rather than six numbers plus one redundant restatement, and so the up/down icon convention (up = improving = good, matching the horizon rows' own violet-for-gain logic) stays consistent in meaning even though it's comparing a different pair of numbers than anywhere else on the page.

6. ① Whether the KPI strip's "steepest decline / strongest gain, right now" cards should move with the period toggle, since showing four KPIs that update on different triggers risked reading as inconsistent.
   ② Kept both "right now" cards fixed to the single `currentValue()` (today, index 89), explicitly labelled "independent of the period toggle" in their subtext, while the other two KPIs (net revenue impact, channels declining) do recompute with the toggle and say which period they're showing.
   ③ A revenue lead asking "who's in trouble right now" wants an answer that doesn't change depending on which reporting window a colleague happens to have open elsewhere on the same screen — the same reasoning the existing catalog already applied to a monitors table's "live" status column staying independent of a period toggle.

7. ① How to keep the crosshair interaction keyboard-accessible without creating 90 tab stops per row (900 across the whole page).
   ② Made the entire horizon strip one focusable container per row (`tabIndex=0` on the wrapper, not on each bar), with ArrowLeft/ArrowRight/Home/End moving an internal cursor index and a single `aria-live="polite"` region announcing the day/value at that cursor.
   ③ Not specified by the brief beyond "keyboard accessible" — a roving-cursor-inside-one-stop pattern was the only way to satisfy that without multiplying the page's total tab-stop count by roughly 90×, which would have made every other keyboard interaction on the page (sort headers, toggles, the fallback table) tedious to reach by comparison.

8. ① The exact 1920px right-edge arithmetic for this shell, since the brief's own worked example used a different sidebar/padding combination.
   ② No `max-w` cap anywhere on the main content. At 1920px: sidebar `w-64` = 256px fixed, main padding `lg:p-8` = 32px each side → available width = 1920 − 256 − 64 = 1600px, flush to the grid, leaving exactly the 32px padding as the right-edge gap (well under the 40px ceiling).
   ③ Recomputed from this candidate's actual shell geometry rather than reusing a number from a different round's sidebar width, per the brief's own instruction that the 1660px-style thresholds are examples, not a universal constant.
