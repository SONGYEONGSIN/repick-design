# Candidate A — Census

## Concept
**Census** is a support-ticket triage console. A 10×10 waffle grid is the whole
landing view: each of its 100 cells is exactly 1% of the current open backlog,
icon-coded by category (Billing, Bug report, Access, Onboarding, Integration,
Performance, Feature request, Other) and allocated with a largest-remainder
method so the cells always sum to 100. Selecting a category — via the legend
list, the command palette, or clicking a waffle cell — opens an on-demand
slide-over drawer listing that category's real tickets; closing it returns to
the waffle with nothing else open.

## Interactions implemented (5, minimum was 4)
1. **Hover tooltip on waffle cells** — pure CSS (`group`/`group-hover`), carries
   no React state, so it can never touch `selectedCategoryId`.
2. **Click-to-select category → slide-over** — from the legend rows (primary,
   keyboard-reachable path) or the waffle cells (mouse convenience); opens the
   fixed, off-canvas drawer, never a persistent pane.
3. **Sort + filter inside the slide-over's ticket table** — status filter chips
   (All/Open/Pending/Waiting) and clickable, `aria-sort`-reflecting column
   headers (ID, Priority, Status, Age) that toggle direction.
4. **Today / 7d / 30d period toggle** — recomputes the backlog snapshot (waffle
   allocation, legend counts, and the drawer's ticket list all derive from the
   same filtered ticket array for the active window).
5. **⌘K command palette** — opens from the top-bar search trigger or the global
   Cmd/Ctrl+K shortcut, filters categories by typing, full arrow-key navigation,
   Enter opens the drawer, Escape closes and returns focus to whatever opened it.

## Font / typography
- Display face: `var(--font-display-wide)` used in exactly one place — the
  "Census" wordmark in the sidebar brand lockup. Nowhere else.
- Rendered weights: **3** — 400 (default/body, e.g. table cell values, captions),
  500 (`font-medium` — labels, nav, badges, buttons, legend rows), 600
  (`font-semibold` — h1/h2 headings, stat-card big numbers, brand wordmark). No
  `font-bold`/`font-light`/etc. anywhere; the native `<kbd>` shortcut hint is
  explicitly re-set to `font-sans` so it doesn't fall back to a system
  monospace face.
- `tabular-nums`: every numeric display — stat-card values, legend counts and
  percents, command-palette counts, ticket IDs, ticket ages, the status-filter
  "`N of M`" caption.
- All formatted integers go through a single `Intl.NumberFormat("en-US")`
  wrapper (`format.ts`); every input is a small exact integer (0–50), so there
  is no SSR/client string-mismatch risk and `notation: 'compact'` is never used.

## Completeness vs. the SaaS reference bar
- Full app shell: sidebar (brand lockup, a real 2-option workspace-switcher
  popover, 6-item nav with an active pill, user card with a real `next/image`
  avatar) + top bar (⌘K search trigger, primary button, notification bell with
  a real unread count, avatar menu with a working popover). Every one of those
  controls is individually `h-11` (44px).
- Component system: `Card`, `SectionLabel`, `PriorityBadge`/`StatusBadge` (icon
  + color + text, never color alone), `SegmentedControl`, `InitialsAvatar`,
  `Sparkline` (hand-rounded SVG coordinates), a real sortable `<table>` with
  `caption`/`scope`/`aria-sort`, hover rows, status badges, and avatar cells —
  all split into their own files (`ui.tsx`, `ticket-table.tsx`, etc.), not one
  page.
- 12-column grid, 4/8px rhythm, explicit `min-w-0` on grid items; content has
  no `max-w` cap below ~2560px, and the shell's own `xl:px-10` (40px) is the
  only gap from the viewport edge at 1920px.
- Table overflow fix (this was the reason the previous "Census" build was
  dropped): the slide-over's ticket table has **no `min-width` anywhere** — it
  is `table-fixed` with percentage widths set on the `<colgroup>`
  (12/34/18/18/18%) — so there is nothing that can exceed the drawer's usable
  width at any viewport, open or closed. The drawer was also widened to
  `sm:w-[560px]` (vs. the dropped build's 460px) for breathing room, but that
  is a comfort change, not the fix: the fix is that the table has nothing to
  overflow with in the first place. Verified by hand: at the narrowest case
  (mobile, drawer `w-full` = 390px, minus `p-5` padding = 350px usable), the ID
  and Age columns' only defense against their own labels is `truncate` (not
  comfortable headroom) — so every cell, including badges, carries
  `overflow-hidden`/`truncate` as a hard backstop against cell-overlap
  regardless of the exact percentage math.
- Focus visibility: every focusable control uses
  `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700`
  with no `outline-none` and no `ring`/`ring-offset` anywhere in the file set
  (the one exception, the command-palette's own search input, uses a negative
  `outline-offset-[-3px]` instead of `outline-none`, specifically so the
  indicator isn't clipped by the dialog's `overflow-hidden` corner).
- A single `h1` ("Ticket triage"); two sibling `h2`s (the backlog card's title,
  the drawer's category title) — no skipped levels.

## Brief gaps
Things the brief left undefined that I had to decide myself:

- **Exact drawer width**: chose `sm:w-[560px]` (full-width below `sm`). The
  brief only said the dropped build's ~400–420px usable width was too narrow
  for its old table; 560px is a round, comfortable number that still leaves
  the drawer clearly a drawer (not a second page) at 1280px+ viewports, and the
  real overflow fix (percentage `colgroup`, no `min-width`) doesn't actually
  depend on this number.
- **Exact ticket-table columns kept/dropped**: kept ID, Subject (with requester
  name + avatar folded into a second line inside the same cell), Priority,
  Status, Age. Dropped a separate "Requester" column (merged into Subject to
  save a whole column's width) and dropped "Channel" entirely (email/chat/
  api/phone exists in the data model and is exported, but isn't surfaced in
  the UI — it wasn't load-bearing for triage and every extra column tightens
  the narrow-viewport budget). This is a judgment call, not a documented rule.
- **Exact amber hex**: Tailwind's stock `amber-600` (`#d97706`) for solid
  fills/primary actions and `amber-700` (`#b45309`) for on-white text/icons/
  focus rings, with `amber-50`/`amber-800` for tinted badges. Chosen because
  they're already desaturated relative to `amber-400`/`500` (the brief's "not
  candy-bright" instruction) and because reusing the existing Tailwind scale
  keeps every amber in the file at a small, consistent set of steps rather than
  inventing a bespoke hex.
- **Categorical palette for the 8 waffle categories**: pulled directly from the
  dataviz skill's validated default 8-hue categorical order (blue → orange →
  aqua → yellow → magenta → green → violet → red) and assigned it 1:1 to the
  8 categories in that fixed order, rendering each category as a contiguous
  run of waffle cells — not a per-cell shuffle — specifically so the only
  hue pairs that ever sit adjacent are the ones the skill's adjacent-pairlist
  actually validated. The light-tint backgrounds behind each icon are
  hand-picked (not a formula) — the skill only specifies the saturated
  hue step, not a tint ramp.
- **Which of "period toggle" vs. "⌘K palette" to build**: the brief said pick
  one for interaction #4; I built both (5 real interactions total) since the
  top bar already needed a search trigger per the app-shell contract, and
  wiring it to a real palette cost little extra once the period toggle was
  already in place for the waffle.
- **Whether waffle cells themselves need to be keyboard-focusable**: decided
  no — the 100 cells are `aria-hidden`/`tabIndex=-1` (mouse + hover only), and
  the `CategoryLegend` rows are the sole keyboard/screen-reader path to the
  same "select a category" action. Making all 100 cells individually tabbable
  would technically satisfy "full keyboard reachability" but would be a worse
  keyboard experience than 8 legend rows that expose the identical information
  and action.
- **Brand name**: "Census" was given by the reassignment brief as the
  product's working title; I kept it as the actual in-UI brand name/wordmark
  rather than inventing a different one, since nothing in the brief asked for
  a new name and it reads fine as a support-ops product name.
