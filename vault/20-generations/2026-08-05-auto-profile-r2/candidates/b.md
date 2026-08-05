---
tags: [generation, profile, auto-profile-r2]
---

# auto-profile-r2 / b — "Renata Kessler / Solstice Macro"

Route: `app/src/app/profile-evolve/r2/b/` (`page.tsx`, `profile-client.tsx`, `hero.tsx`,
`scoreboard-band.tsx`, `divergence-chart.tsx`, `percentile-gauge.tsx`, `positions-table.tsx`,
`avatar-mark.tsx`, `data.ts`).

## Product / brand / trigger

**Meridian** is a track-record benchmarking platform for systematic trading strategies —
"copy-trading with an audited receipt." The profile belongs to **Renata Kessler**, publisher of
**Solstice Macro**, a systematic, rules-based multi-asset strategy (rates, FX, commodities,
credit) live since Feb 2022. The trigger for landing on this page is a prospective copier
deciding whether to allocate capital to (or "copy") the strategy — the entire point of the page
is proving the track record is real, current, and honestly compared, not just narrating it.

This is the suggested "comparison/benchmark-forward" direction from the brief, concretized as a
finance/trading domain rather than the generic athlete/investor framing, because a track record
vs. a named index/peer cohort is the most literal real-world instance of "them vs. baseline" and
gave the richest set of legitimately-informative interactions.

## Macro structure — deliberately not a transplant of any r1 archetype or r1/b's own skeleton

The r1 round (per the assignment brief) produced: (a) public storefront + ARIA tablist, (b)
**sticky left sidebar** + always-on heatmap + filterable grid, (c) hero + feed + billing-toggle
pricing tiers. This candidate avoids all three:

1. **Hero** (not full-bleed banner) — platform wordmark, avatar monogram, name/handle/strategy,
   an "Audited track record" badge, one bio paragraph, and a Copy-strategy toggle.
2. **Scoreboard band — a sticky horizontal spine, not a sticky sidebar.** `position: sticky;
   top: 0` band that docks under the viewport top once scrolled past the hero and stays pinned
   through the rest of the page. It is split into two columns — Solstice's numbers on the left,
   the selected baseline's numbers on the right — with a delta badge between them ("+X.XXpp
   ahead of S&P 500"). This *is* the "them vs. baseline" structural spine the brief asked for:
   every other panel on the page keys off the same `range`/`baseline` state this band controls,
   and the pinned trust cluster (return, win rate, copiers, live-since) required by the
   `auto-profile-r1` delta lives inside it, so it is visible at every scroll depth without a
   sidebar and without a tab.
3. **Monthly divergence chart** — a diverging bar chart (not a GitHub-style contribution
   heatmap), bars pointing up for months Solstice beat the selected baseline and down for months
   it trailed, scaled on a fixed axis so switching baselines re-heights bars without rescaling
   the axis. All 24 months are always rendered; months outside the active time-range control are
   dimmed (not hidden) rather than removed, so the full history stays inspectable.
4. **Cohort standing panel** — a static (non-interactive, always-visible) percentile gauge,
   placed beside the chart in normal flow (explicitly *not* sticky, to avoid re-introducing a
   sidebar silhouette).
5. **Open positions table** — a semantic, sortable, filterable table, not a card grid.

No tabs anywhere; no panel is mounted/unmounted behind a click.

## Interactions (6, all information-bearing)

1. **Time-range segmented control** (1M / 3M / YTD / 1Y / All) in the scoreboard band —
   recomputes the compounded Return and Win Rate figures shown for Solstice, recomputes the
   baseline's Return for the same window, and changes which months are dimmed vs. active in the
   divergence chart below.
2. **Baseline segmented control** (S&P 500 / Peer Median — Systematic Macro) in the scoreboard
   band — swaps every "baseline" figure on the page simultaneously: the band's baseline return
   and delta badge, every bar height in the divergence chart (own − baseline is recomputed per
   bar), the month-detail readout, and the Δ column in the positions table.
3. **Asset-class filter chips** (All / Rates / FX / Commodities / Equities Overlay / Credit)
   above the positions table — filters visible rows and live-recomputes the "Showing X of 8 ·
   Y% allocated" summary line from the filtered subset.
4. **Sortable position columns** (Allocation / Return / Δ) — real `<th aria-sort>` header
   buttons that reorder the actual row data ascending/descending, with a visible chevron and
   `aria-sort` kept in sync.
5. **Divergence-chart month selection** — every bar is a focusable, clickable button
   (`aria-pressed`, full `aria-label` with both figures and the delta); selecting one expands the
   month-detail readout beneath the chart (own return, baseline return, delta) for that exact
   month, defaulting to the most recent month rather than an empty state.
6. **Copy-strategy toggle** in the hero — flips a pressed state and increments/decrements the
   live Copiers count shown in the pinned scoreboard band, so the interaction has a visible,
   numeric effect rather than being purely decorative.

## Palette / AA contrast math (dark theme, cyan accent)

All ratios computed with the real WCAG relative-luminance formula (sRGB → linearize → 0.2126R +
0.7152G + 0.0722B; contrast = (L1+0.05)/(L2+0.05)), not assumed from Tailwind's scale:

| Foreground | Background | Ratio | Verdict |
|---|---|---|---|
| `cyan-400` #22d3ee | `zinc-950` #09090b | **11.01:1** | AA (large & normal) |
| `cyan-400` #22d3ee | `zinc-900` #18181b | **9.80:1** | AA |
| `cyan-400` #22d3ee | `zinc-800` #27272a | **8.24:1** | AA |
| `cyan-300` #67e8f9 | `zinc-950` #09090b | **13.73:1** | AA |
| `zinc-400` #a1a1aa (secondary text floor) | `zinc-950` #09090b | **7.76:1** | AA (well above dark-surface zinc-400 floor) |
| `zinc-400` #a1a1aa | `zinc-900` #18181b | **6.91:1** | AA |
| `zinc-400` #a1a1aa | `zinc-800` #27272a | **5.81:1** | AA |
| `zinc-50`/white on `zinc-950` (primary text) | `zinc-950` | **19.06 / 19.90:1** | AA |
| `zinc-950` #09090b (avatar monogram text) | gradient stop `cyan-600` #0891b2 | **5.40:1** | AA |
| `zinc-950` #09090b | gradient stop `cyan-400` #22d3ee | **11.01:1** | AA |

No text in the route uses `zinc-500`/`zinc-600` at any weight (verified by grep, see below) — the
dark-surface floor is zinc-400 and every secondary-text use sits at 5.8:1 or above, comfortably
clear of the 4.5:1 AA gate. The route is unconditionally dark (no `dark:` variants; the whole
page hardcodes `bg-zinc-950 text-zinc-50` the way `auto-profile-r1/b` did), so the
`no-dark-dim-text` static rule's `dark:text-*-500/600` pattern doesn't apply, but the same floor
was still hand-enforced on every bare `text-zinc-*` class.

## Font usage confirmation

Body face is `--font-sans` (Pretendard) everywhere except the display face, applied only to the
`h1` (name), section numerals/values (`dd`/stat figures via a shared `DISPLAY_FONT` constant =
`{ fontFamily: "var(--font-display-wide)" }`), and the avatar monogram — matching the "apply
display only to h1/hero numerals" instruction. Grepped weight-class counts across the whole route
(`grep -oE "font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b" *.tsx`):

```
font-normal:   26 occurrences (divergence-chart 6, hero 3, percentile-gauge 3, positions-table 6, profile-client 1, scoreboard-band 7)
font-medium:   15 occurrences (hero 2, positions-table 8, scoreboard-band 5)
font-semibold: 15 occurrences (divergence-chart 5, hero 2, percentile-gauge 2, positions-table 1, scoreboard-band 5)
```

Exactly **3** weight classes route-wide, no `font-bold`/`font-light`/other steps present.

## Verification run

`cd /home/user/repick-design/app && npx tsc --noEmit` — **clean, zero errors.**

`cd /home/user/repick-design/app && npx eslint src/app/profile-evolve/r2/b` — **clean, zero
errors, zero warnings** (one initial `no-unused-vars` warning on `SORT_LABEL` was fixed by wiring
it into the sortable header buttons' `aria-label`s instead of leaving it dead).

`cd /home/user/repick-design/app && npx next build` was also run end-to-end and completed
successfully, statically generating `/profile-evolve/r2/b` alongside the rest of the site.

Static gate rules hand-verified (also cross-checked by running the repo's own
`scripts/dash-static-check.mjs` against every file in the route, which returned `[]` — zero
violations):

- No raw `<img>` anywhere (route ships no photographic imagery at all — the only visual asset is
  the deterministic inline-SVG avatar monogram — so `next/image`/`unoptimized` are moot; grepped
  and confirmed absent).
- No `Math.random(`, `Date.now(`, or `new Date()` — all 24 months of return data, all 8
  positions, and the cohort rank/size are literal, hand-authored numbers (the mulberry32-seeded
  generation script used to draft the return literals was a throwaway node one-liner, never
  shipped, same discipline as `auto-profile-r1/b`'s heatmap data).
- No emoji — all iconography is `lucide-react` (`ShieldCheck`, `UserCheck`/`UserPlus`, `Users`,
  `CalendarDays`, `TrendingUp`/`TrendingDown`, `Trophy`, `ChevronUp`/`ChevronDown`/`ChevronsUpDown`).
- No `next/font` import.
- No `font-serif`.
- No font declaration outside the allow-list — every `fontFamily`/`font-family` use resolves to
  `var(--font-display-wide)`.
- No `dark:text-{zinc,neutral,gray,slate,stone}-{500,600}` — confirmed zero matches; in fact no
  bare `text-zinc-500`/`text-zinc-600` at all in the route (grepped both patterns, both empty).
- No random image host — no remote image host of any kind is used.
- `outline-none` never appears unpaired — every occurrence is inside the shared `FOCUS` constant
  alongside `focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2`.
- Single `h1` (hero name); heading order is h1 → h2 (four sections: sr-only "Performance vs
  baseline" scoreboard heading, "Cohort standing", "Monthly return vs …", "Open positions") → h3
  ("{Month} detail", nested under the divergence-chart's h2) — no skipped levels.
- Every `<dl>` keeps `dt`/`dd` as direct children of the `dl > div` group; the two stats that pair
  an icon with a label (Copiers, Live since) put the `Users`/`CalendarDays` icon *inside* the
  `dt` itself, not as a sibling — the exact pattern the brief flagged as having broken two prior
  rounds.
- Table is `table-fixed` with percentage `<colgroup>` widths (34/20/16/15/15), `<caption
  className="sr-only">`, `scope="col"` on every header `<th>` and `scope="row"` on the instrument
  cell, `aria-sort` kept in sync on the sortable `<th>`s. No `overflow-x-auto` wrapper was needed
  — the fixed layout wraps text within cells at 390px instead of forcing a scrollbar, so the
  sr-only/containing-block footgun from `page-brief-core` §3 doesn't apply here (there is no
  scroll-clipping ancestor for the caption to be orphaned inside).
- All numeric values (returns, percentages, counts, allocation %) use `tabular-nums`.
- Grid/flex items carry `min-w-0` throughout (chart bar buttons, x-axis label spans, table
  section wrappers, the two-column layout in `profile-client.tsx`) to prevent 390px overflow.
- `prefers-reduced-motion` — the route ships no entrance animations at all (no `opacity:0` reveal
  states), only `transition-colors`/`transition-opacity` on interactive state changes, which
  degrade harmlessly under reduced motion since they're not one-shot entrance effects.
