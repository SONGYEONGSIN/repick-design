# Riskline — release-approval console (auto-dash-r50, candidate a)

`/dash-evolve/r50/a` — product: **Riskline**, a change-management / release-approval console for
engineering orgs reviewing production releases before they ship. Light theme, blue accent
(`blue-600` / `#2563EB`), `--font-display-wide` on the wordmark only.

## Macro layout

Standard shell — left sidebar (`w-64`: brand lockup, workspace switcher, 4-item nav with active
pill, bottom user row) + 44px topbar (⌘K search button, "New release request" primary action,
notification bell popover, avatar menu) — but the main content area is the assigned variant: a
**fixed 440px pending-releases queue rail** (`QueueRail.tsx`, `w-full sm:w-[440px]`) next to a
**flex-1 approval-detail pane** (`DetailPane.tsx`). A 2-option segment control (Pending/Approved)
at the top of the rail swaps which release set the list shows. Sidebar fixed at 256px + rail fixed
at 440px leaves 1224px for the detail pane at a 1920px viewport; the pane carries no `max-w`, only
`px-6` padding, so the right-edge gap is 24px — well under the 40px ceiling, and no artificial cap
was needed since available width stays below the ~1660px threshold where one would apply.

Mobile (`<sm`): the rail becomes full-width and the shell shows either the rail OR the detail pane
(`mobileView: "list" | "detail"` in `page.tsx`), never both — selecting a release switches to the
detail view with a `sm:hidden` "Back to queue" control; this is CSS-driven (`hidden`/`flex`/`block`
toggled by `mobileView`, overridden by `sm:` variants on desktop) so desktop ignores the state
entirely. The sidebar collapses into a drawer (`MobileDrawer.tsx`) opened from a topbar hamburger,
reusing the exact same `SidebarContent` component and `onNavigate` handler as the desktop `<aside>`
— both mounts get the real `setActiveNav` callback, not a no-op at either site. `SidebarContent`'s
root wrapper is explicitly `w-full` (it's the single child of a row-flex `<aside>`/drawer), guarding
against the sidebar-blowout bug with a 31-character workspace name ("Northwind Platform
Engineering") in the switcher as the test case.

## Components

`Card`-equivalent surfaces are `rounded-xl border border-zinc-200 bg-white` throughout. Segment
controls and category-filter chips share one pattern (`bg-zinc-100` track, `bg-white
shadow-sm` active pill, `aria-pressed`). Badges pair a color dot + text label, never color alone
(risk tiers, change-note flags). The sortable table uses `aria-sort`, a `scope="col"` header with a
button per column, `table-fixed` + percentage `colgroup` (no `min-w` on cells, no horizontal
scroller), and a `sm:hidden`/`hidden sm:table` mobile-card/desktop-table split. Dialogs
(command palette, new-release form) are `role="dialog" aria-modal="true"`, Escape-to-close, and
click-outside-to-close. Every interactive element carries a real `focus-visible:outline
focus-visible:outline-2 ... outline-blue-600` ring — nothing uses `outline-none`.

## Dominant visualization — bubble/scatter + required fallback

`BubbleChart.tsx` plots the **currently-selected release's** changed services: x = blast radius %
(generated SVG, `viewBox 440×260`, linear scale, all coordinates rounded to 2dp via a `round2`
helper — no chart library), y = rollback risk score, bubble radius = dependents touched (fan-out:
how many other services depend on the changed one). Shape encodes category (circle=API,
diamond=database, triangle=frontend, square=infra) since more than one category exists; fill color
encodes risk tier (red/orange/amber/emerald), with a legend for both. A light-red "Elevated zone"
rect flags the blast≥50 & risk≥50 quadrant. Each bubble has a real, invisible `<button>` overlay
(absolute-positioned by percentage, sized to match its SVG radius) so hover **and** keyboard
focus/blur both drive the same ephemeral `hoveredId` state — nothing here is mouse-only.

**Required fallback**: `ServiceTable.tsx` renders every bubble as a row — service name, category,
blast radius %, risk score (+ tier badge), dependents touched — sortable on every column via
`aria-sort`, never hidden behind hover. The same `hoveredId` state is shared between chart and
table so hovering a bubble highlights its row and vice versa (one ephemeral pair, not three
threaded selections). A category filter in `DetailPane.tsx` narrows both the chart and the table
to the same filtered set, so chart and fallback can never disagree on what's shown.

## Interactions (5 implemented)

1. **Hover crosshair tooltip, keyboard-accessible** — hovering/focusing a bubble shows an
   `aria-live="polite"` service-detail line and highlights the matching table row; blur/mouse-leave
   clears it. Purely ephemeral — never writes to the pinned selection.
2. **Real sortable + filterable table** — independent `sortKey`/`asc` state in `ServiceTable.tsx`,
   plus the category filter in `DetailPane.tsx` that also redraws the chart.
3. **Pending/Approved segment toggle** — swaps the rail's dataset; switching segments auto-selects
   a sensible release in the new set if the current selection isn't in it (highest-risk pending, or
   the first approved item), so the detail pane is never left pointing at something absent.
4. **Click-to-select → multi-widget sync** — clicking a queue row is the one axis that *persists*:
   it sets `selectedId` in `page.tsx`, which alone drives the header card, stat strip, chart and
   table in the detail pane. This is deliberately the only thing threaded that way; the chart/table
   hover pair above is a second, independently-scoped axis, per the brief's split-axis guidance.
5. **⌘K command palette (bonus)** — fuzzy-filters all releases by version/title, jumps to one
   (sets segment + selection + mobile view), Escape/backdrop/✕ all close it and reset its own query
   through the close handler rather than a `setState`-in-`useEffect` (avoids the
   `react-hooks/set-state-in-effect` lint error — focus-on-open stays the only effect-driven side
   effect; query-reset happens in the close handlers instead).

Two more real (not required, but real) actions: the topbar's **"New release request"** button
opens an actual dialog that prepends a new pending release built from a fixed service catalog
(deterministic baseline numbers, not free-typed risk) and selects it; and the detail pane's
**Approve / Request changes** buttons actually mutate release state (`approved`/`changeNote`) and
Approve auto-switches the segment to Approved so the result is visible immediately.

## Typography

Exactly 3 rendered weights: `font-normal` (400), `font-medium` (500), `font-semibold` (600) — no
`font-bold`/`font-light`/etc. anywhere, and every text-bearing element either carries one of the
three classes directly or inherits one from a classed ancestor (verified; the few `<td>`/`<span>`
cells that inherit do so from a parent that is itself explicitly classed). All numeric values are
`tabular-nums`; 11px uppercase/tracked labels throughout. `text-zinc-500` is used only on
pure-white/near-white (zinc-50) surfaces; anything on a tinted surface (segment tracks, active
pills, the chart's "Elevated zone" fill) uses `zinc-600`+ instead, and the one chart label that
could sit over the tinted quadrant was bumped to `zinc-600` defensively. Decorative icon-only
interactive controls use `zinc-500` as a floor, not `zinc-400`.

## Data integrity

All derived numbers come from `data.ts`'s service rows, never hand-typed twice: release-level risk
score = `max(services.riskScore)`, blast radius = `max(services.blastRadiusPct)`, tier =
`tierFromScore(riskScore)` (thresholds: ≥80 Critical, ≥60 High, ≥35 Medium, else Low), services
touched = `services.length`. The table, the chart, the stat strip and the queue-row mini-stats all
read these same functions, so no two displayed numbers can disagree. The default first-paint
selection is computed as the highest-`riskScore` pending release (`rel-1`, Checkout flow v2.14.0,
payments-gateway at risk 91 → Critical), never an empty state. No `Math.random`/`Date.now`/bare
`new Date()` anywhere; relative timestamps ("12m ago", "Yesterday") are hand-authored fixed
strings, and the one "live" counter (`newCounter`) used for synthesized release ids is a plain
incrementing `useState`, not derived from wall-clock time.

## Verification

`npx tsc --noEmit` and `npx eslint` both run clean against every file in this folder (the only
fix needed was moving a `setQuery("")` reset out of a `useEffect` body into the close handlers, to
satisfy `react-hooks/set-state-in-effect`).

## Brief gaps

- **"Bubble size = number of services touched" vs. "each bubble = one changed service"** — these
  two brief sentences are in tension: services-touched is release-level, but size must vary per
  bubble. Decided: bubble size = **dependents touched** (how many other services depend on the
  changed one — a legitimate per-service fan-out metric), while "services touched" is reported
  separately as a release-level stat (card + table row count). Arbitrary-but-defensible
  interpretation, chosen because it's the only per-service reading of "how many services this
  touches" that isn't just a restatement of blast radius.
- **Release-level risk/blast from per-service numbers** — the brief requires derived numbers to
  agree but doesn't say which aggregation. Decided: **max**, not average/sum, because a release's
  real-world rollback exposure is bounded below by its single riskiest component, not smoothed by
  its safer ones. General risk-management practice (weakest-link reasoning), not a cited pattern.
- **What drives "Pending → Approved" segment switching on Approve** — decided to auto-flip the
  rail's segment to Approved when the open release is approved, rather than leaving the user
  looking at a pending-filtered list that no longer contains their selection. Arbitrary UX call,
  made for immediate visible feedback over strict literalism about "only the toggle switches
  segments."
- **Mobile behavior for a 440px-rail + flex-1-pane layout** — the brief doesn't specify how a fixed
  440px rail should behave under 375px. Decided on an iOS-Mail-style single-pane-at-a-time switch
  (`mobileView` state + a `sm:hidden` back button) rather than shrinking the rail, since shrinking
  440px of list content below ~375px would make every row unreadable. General mobile master-detail
  practice, not from this repo's catalogue (deliberately not consulted).
- **Nav items beyond "Releases"** — Policies/Audit log/Settings have no real page brief here.
  Decided to make them switch `activeNav` to a real placeholder panel (its own `h1`, not a dead
  link) rather than omit them or fake full pages, satisfying "primary actions must do something
  real" without inventing scope the task didn't ask for.
- **Category taxonomy for shape-grouping** — brief says "group by shape/pattern if more than one
  category exists" but doesn't name categories. Decided on api/database/frontend/infra as a generic
  service-topology taxonomy (circle/diamond/triangle/square), arbitrary but a common engineering
  mental model for "what kind of thing did we change."
