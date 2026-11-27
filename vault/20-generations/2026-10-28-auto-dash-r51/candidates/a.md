# Candidate b — Inboxline (Email Deliverability / Sender-Reputation Console)

**Product**: Inboxline — a fictional B2B email-deliverability console (GlockApps/250ok/Postmark-Signals
tier) that marketing/growth teams use to monitor whether transactional and marketing mail actually lands
in the inbox, for one monitored domain (fictional client: `mail.acme.com`). Route: `/dash-evolve/r50/b`.

**Macro layout**: standard app shell — left sidebar (brand lockup "Inboxline"/Radar icon, workspace
switcher defaulting to a 30-char name to exercise the truncation fix below, two nav sections, bottom user
menu) + topbar (⌘K search button, "Export CSV" primary action, notifications, avatar menu) — but the main
content is **hero + single dominant visualization**, not hero+inline-stats: there is no secondary KPI
strip competing with the chart. The page header is just an eyebrow/h1/description line plus the one
period segmented control; the very next element is the hero `Card`, and the streamgraph inside it is
sized to `300px → 540px` tall across breakpoints (`h-[300px] sm:h-[380px] lg:h-[460px] xl:h-[540px]`) so
it is visibly the largest single element on the page. A pinned provider-detail card and a full data-table
ledger sit below the hero as supporting/consumer panels, not as a second stats row.

**Dominant visualization — the streamgraph**: a stacked, centered-silhouette streamgraph, one ribbon per
major mailbox provider (Gmail, Outlook, Yahoo, Other), rendered as hand-generated SVG `<path>`s (no chart
library). Ribbon **thickness** is that day's successful inbox placements (`inboxHits`) by provider — a
real additive quantity, so the stack always sums to the day's actual total (shown in the per-day
tooltip/aria-valuetext). Ribbon **edges** are smoothed from the raw daily samples via a Catmull-Rom →
cubic-Bézier conversion (`catmullRomSegments`/`ribbonPath` in `StreamGraph.tsx`), with every control
point and endpoint rounded to 2 decimals through a shared `r2()` — the brief's "interpolation rounded to
2dp" requirement, satisfied by the smoothing math itself rather than a cosmetic sine overlay.

- **Pattern/line-style differentiation (not color alone)**: each provider carries two independent,
  colour-blind-safe signals — a rotated SVG hatch fill (`patternAngle` 0/45/90/135°, some with a dashed
  hatch stroke) and a distinct top-edge `stroke-dasharray` (solid / `"6 3"` / `"1.5 3"` / `"8 2 2 2"`).
  Every provider's combination of angle+hatch-dash+edge-dash is unique, so the four ribbons stay
  distinguishable with colour removed entirely.
- **Always-visible current value (not hover-only)**: a persistent legend row above the chart renders all
  four providers' *today* placement rate and letter grade unconditionally — it is not gated behind any
  hover/focus state. The same row doubles as the brief's "legend-with-values" fallback; a full sortable
  **data table** below the hero is the second, more exhaustive fallback (every number the ribbons encode,
  per day, for the selected window).
- Rate and grade are never hand-typed independently: `rateOf()` derives every percentage from the two
  stored integers (`testsSent`/`inboxHits`), and `gradeForRate()` is the single function every grade badge
  calls (legend, detail card, table), so a percentage and the grade beside it can never drift apart.

**Interactions (5 implemented, brief requires 4+, all `'use client'`, deterministic)**:
1. **Keyboard-accessible crosshair** — the chart's bottom "scrub rail" is a real ARIA `role="slider"`
   (`tabIndex`, `aria-valuemin/max/now/valuetext`, Arrow-Left/Right/Home/End), not just a mouse-hover
   effect. Focusing or arrow-stepping it reveals the same crosshair line + per-provider tooltip a mouse
   hover does, with `aria-valuetext` carrying the accessible announcement (the visual tooltip itself is
   `aria-hidden` to avoid double-announcing the same value).
2. **Real table sort + filter** — every ledger column header is a `<button>` with correct `aria-sort` on
   its `<th>`, toggling direction on repeat clicks; a segmented "All / Flagged" filter narrows rows to
   days where any provider dropped below 85%, with a live count in each segment label.
3. **Period toggle** — 7D/30D/90D segmented control recomputes the visible day slice for both the
   streamgraph and the ledger via `sliceForWindow()`; it never touches the legend's "today" values or the
   detail card's 7-day stats, which are intentionally window-independent (always "right now").
4. **Selection → scoped sync, split from the crosshair** — clicking a ribbon `<path>` (itself a real
   focusable `role="button"` SVG element, Enter/Space-activatable) or its matching legend chip pins that
   provider to the **Provider detail** card only — a narrow effect. It does not alter the data table, the
   legend's other chips, or the crosshair. The ephemeral per-day crosshair from (1) is local state inside
   `StreamGraph` and never writes to the pin — hovering/scrubbing never moves or clears the pinned card,
   matching the brief's "split scope" axis hierarchy exactly.
5. **⌘K command palette** (bonus) — real substring filtering over "pin a provider" and "jump to a
   window" actions; it is wired to both the global shortcut and the topbar's search button, so that
   button is a real control, not a decorative trigger.

Two additional real (non-decorative) actions beyond the four: the topbar's primary "Export CSV" button
builds a CSV from the exact rows the ledger shows for the current window (`toCsv(buildTableRows(days))`)
and downloads it via a `Blob` + anchor click — genuinely functional, addressing the house defect class of
an inert-looking primary CTA. Clicking a pinned provider's legend chip/ribbon a second time un-pins it
(back to the auto-selected fallback) rather than only ever pinning forward.

**Default-populated detail panel**: `ProviderDetailCard` never shows an empty "select a provider" state.
With no explicit pin, `pinnedId` resolves to `WORST_PERFORMER_ID` — the provider with the lowest *today*
rate, computed once from the same `PROVIDER_SNAPSHOTS` the legend reads — and the card's header text says
so explicitly ("Auto-selected: today's worst-performing provider"). The card shows today's rate+grade, a
weighted 7-day average with an up/down/flat delta (icon **and** color **and** text, never color alone),
a volume-share percentage, a tiny 14-day sparkline, and — only for Yahoo, which carries the dataset's one
scripted 16-day authentication incident (day offsets 54–69, i.e. 2026-09-22 → 2026-10-07) — an inline note
naming it. The incident sits inside the default 30-day window's tail, so the story is visible without any
interaction on first paint in the common case.

**Typography/font**: `--font-sans` (Pretendard) only, inherited from the root layout — no
`next/font` import, no `--font-display-*` reference anywhere in this candidate's files (verified by
grep: zero `fontFamily`/`font-family` occurrences in the whole folder). Exactly three rendered Tailwind
weight classes are used anywhere in the route — `font-normal` (400), `font-medium` (500), and
`font-semibold` (600) — confirmed by grepping the folder for every `font-*` weight utility; no bare
`<strong>`/`<b>` anywhere that would default to 700. Numbers are `tabular-nums` and right-aligned in the
ledger; section eyebrows are `text-[11px] font-medium uppercase tracking-[0.08em]`.

**Theme**: refined dark product surface — `zinc-950` canvas, `zinc-900` cards, `white/10` hairlines, body
text `zinc-50`, auxiliary text held at `zinc-400` as a floor everywhere (not only behind `dark:`, since
the whole route is dark) — no glow/scanlines/grain. Single accent **lime-400**, used sparingly: the
primary button fill, the focus ring colour, the active segmented-control state, the "pinned" chip state,
and — doubling as the "healthy" semantic — the Gmail ribbon. Verified pairs: lime-400-on-zinc-950 solid
button ≈13:1; lime-400 text on zinc-900/950 ≈10–11:1; every grade badge's `-300` text step on a `zinc-900`
tinted chip is comfortably brighter than the `zinc-400` floor. The other three ribbons use a plain
categorical ramp (sky/amber/zinc) rather than more lime, since a single hue cannot carry four chart
categories — see Brief gaps §1.

**Accessibility specifics**: single `h1` ("Inbox placement"); every other heading is an `h2` from the
shared `CardHead`, so there is no level skip. The streamgraph's outer `<svg>` deliberately has **no**
`role="img"` (which would mark its subtree atomic and prune the four focusable ribbon buttons from the
accessibility tree) — it carries a plain `aria-label` instead, and each ribbon exposes its own
`role="button"`/`aria-pressed`/`aria-label`. Focus is visible and actually paints on every control via the
shared `FOCUS` token (`focus-visible:outline-2 ... outline-lime-400`, never preceded by a cancelling
`outline-none`), plus a belt-and-suspenders stroke-width boost on the ribbons themselves since CSS
`box-shadow` (part of the same token) has no effect on bare SVG shapes — the `outline` half still does.
Avatars use `next/image` with real, descriptive `alt` text and a fixed Unsplash photo id (no
`unoptimized`, no random-seed host). The sidebar's inner wrapper carries an explicit `w-full min-w-0`
specifically to guard against the house rail-overflow bug, exercised with a 30-character default
workspace name ("Northwind Growth Marketing Ops"); the same `SidebarBody` component (identical nav anchor
handlers) is mounted at both the desktop `<aside>` and the mobile drawer, so there is no mount where nav
silently doesn't work. The ledger has a `sm:hidden` mobile card-list fallback beside the `hidden sm:block`
real `<table>` (`min-w-[720px]` on the `<table>` itself, never a cell), and it is the only
horizontally-scrolling container on the page.

**1920px cap**: sidebar is a fixed `w-64` (256px); main content uses `px-4 sm:px-6 lg:px-8` with no
competing `max-w`, so at 1920px the right-edge gap is exactly the 32px of `lg:px-8` padding — under the
40px ceiling.

**Files**: `app/src/app/dash-evolve/r50/b/{page.tsx, InboxlineClient.tsx, Sidebar.tsx, Topbar.tsx,
CommandPalette.tsx, StreamGraph.tsx, ProviderDetailCard.tsx, DataTable.tsx, data.ts, tokens.ts, ui.tsx}`.

## Brief gaps

1. **What I had to decide**: the brief asks for a streamgraph whose ribbons "show inbox-placement-rate"
   per provider, but placement *rate* (a percentage, 0–100 and not naturally additive across providers)
   doesn't stack into a meaningful streamgraph the way a volume does — four percentages stacked on top of
   each other sum to a number with no real-world meaning (e.g. "340%"), which would read as a fabricated
   or misleading total under the brief's own "sums reconcile" rule.
   **What I decided**: the ribbon's vertical thickness encodes **inbox-placement volume**
   (`inboxHits`, a true additive count that sums to a meaningful daily total), while **placement rate**
   (the metric actually named in the brief) is the persistent per-provider readout in the legend chips, the
   per-day crosshair tooltip, the detail card, and the data table — always derived from the same two
   stored integers as the volume the ribbon paints. **Why**: this keeps every number on the page honestly
   additive and reconciling, while still making the rate the thing a reader reads off the chart at a
   glance (via the legend) exactly as the brief intends, rather than choosing between "literal but
   meaningless stacking" and "ignore the sums-reconcile rule."

2. **What I had to decide**: the brief's accent is "a single lime, used sparingly," but a four-series
   trend chart needs real hue separation between categories, and reusing lime for all four (or recolouring
   three of them to lime-adjacent tints) would both violate "sparingly" and make the ribbons harder to
   tell apart, not easier. **What I decided**: lime is reserved for UI chrome and exactly one ribbon
   (Gmail, doubling as the "healthy" semantic so no second green has to be invented); the other three
   ribbons use an ordinary categorical ramp (sky/amber/zinc), with the *pattern* coding (hatch angle+dash,
   edge dash) carrying the actual colour-blind-safe signal the brief asks for, rather than hue. **Why**:
   the brief's explicit pattern-differentiation requirement already exists specifically because relying on
   hue alone across many series is fragile — leaning on pattern (not a wider lime palette) for
   between-ribbon separation is the more literal reading of that requirement, and it leaves "single accent,
   used sparingly" intact for the chrome.

3. **What I had to decide**: how a keyboard user reaches "focusable data points" on a 90-sample
   streamgraph without either (a) adding 90 individual tab stops (a worse keyboard experience than the
   chart it's compensating for) or (b) only supporting mouse hover. **What I decided**: one `role="slider"`
   control with `aria-valuenow/valuetext` and Arrow-Left/Right/Home/End, rather than N discrete focusable
   buttons. **Why**: a single roving slider is the standard ARIA pattern for "step through N ordered
   values with a keyboard," gives full parity with mouse-hover scrubbing (every day's tooltip is reachable),
   and avoids forcing 90 tab stops into the page's tab order — which I judged truer to the spirit of
   "keyboard-reachable chart data" than literal per-point `<button>` elements would have been.

4. **What I had to decide**: the brief's worked example for the default-populated detail panel is "the
   worst-performing provider," but in this dataset the scripted Yahoo incident has already mostly resolved
   by "today" (day 89 of 90), so the worst performer on first paint is ordinarily **Other**, not the
   provider with the dramatic incident story. **What I decided**: kept the fallback mechanically honest —
   `WORST_PERFORMER_ID` is whichever provider has the lowest *today* rate, full stop, computed from the
   same snapshot the legend reads — rather than hard-coding Yahoo as the "interesting" default. **Why**:
   a fallback that quietly special-cased the dramatic provider would be exactly the kind of
   independently-typed, not-actually-derived number the brief's §3 rule is written to catch; the incident is
   still fully visible by scrubbing/pinning Yahoo, and the 30-day default window's tail still overlaps the
   incident's end, so it isn't hidden, just not artificially forced into the default state.

---

## Reassignment note (auto-dash-r51/a, reassign-queue #17)

Reassigned from `auto-dash-r50/b` (dropped at §3 hard gate — `sweep` `table-overflow` on the "Daily placement ledger" `DataTable`, reproduced identically after an ancestor `min-w-0` 1-fix attempt, per reassign-queue #17 and questions-queue Q71).

**Root cause, found by direct measurement** (binary search across 1264/1280/1300/1320/1350/1366px with a Playwright probe matching `dash-sweep.mjs`'s exact metric — `el.scrollWidth > el.clientWidth` on `table, [class*="overflow-x"]` elements, not document-level overflow): the `overflow-x-auto` wrapper's own `clientWidth` tracked its container correctly (622px → 690px across that band) the whole time. The actual cause was the `<table>` inside it carrying a fixed `min-w-[720px]` — a value wider than the wrapper at every probed width below 1366px, completely independent of any ancestor's `min-w-0`. That is why the r50 1-fix (adding `min-w-0` to two ancestors) reproduced the exact same pixel values down to the decimal: the ancestors were never the bottleneck.

**Fix**: replaced the `min-w-[720px]` + `overflow-x-auto` scroll pattern with `table-fixed` + a `<colgroup>` of explicit per-column `%` widths, per `dash-brief-v3`'s own grid-craft rule ("데스크톱 테이블은 가로 스크롤바 금지 — min-w 강제 대신 table-fixed + % 열 배분"). Shortened the "Monitored volume" header to "Volume" (grid-craft's "축약 라벨을 설계한다"). Added `overflow-hidden truncate` as a safety-net on every cell (never triggers under the current data — verified empirically down to sub-pixel precision with `document.fonts.ready` awaited before measuring, since font-swap shifts text metrics after first paint).

**Verified**: `node scripts/gate.mjs --target web --routes /dash-evolve/r51/a` → **9/9 gates pass, 0 violations**, including `sweep` (0 overflow) across the full width set (1264–1920 + 390 mobile) and `a11y` 100. No ranking-relevant change — this is a pure layout-bug fix of the kind §3-1 scopes to "rule violation resolution," not a redesign.
