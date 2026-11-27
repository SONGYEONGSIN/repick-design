# Candidate a — "Grainhouse"

Production-studio booking ops console (photo/video studios, edit bays, equipment). Dark /
indigo / `--font-display-wide`.

**Macro skeleton**: calendar/board-centric (brief's explicitly-encouraged bucket, not reused by
any of the last 5 dash rounds r53–r57). Dominant widget is a resource-by-hour availability table
(6 resources × 8 hourly columns, 9:00–16:00) for a selected day, not a resource-rail + chart +
feed trading-terminal shape (that bucket is flagged saturated in this catalog's own reassign-queue
notes, ≥4 occurrences).

**Interactions (5, ≥4 required)**:
1. Hover/focus a schedule cell → a live status strip above the grid previews client + project
   (keyboard-reachable via focus, not hover-only).
2. Click a cell → opens the detail panel, swaps the 4th KPI tile to that cell's own revenue
   contribution, and highlights the matching resource's rows in the bookings table below — three
   widgets, independently scoped (KPI = single-value swap, table = row highlight only, no full
   recompute), not one "selection → re-render everything" blob.
3. Resource-type filter (All / Studio / Edit bay / Equipment) — segmented control, filters grid
   rows.
4. Day selector (Mon–Fri) — segmented control, swaps the whole grid's data.
5. ⌘K command palette — jump to a resource, jump to a day, or scroll to the bookings table.

**Responsive strategy**: the hour-grid table is `hidden md:block`; below `md` a dedicated
`MobileAgenda` list (one card per resource, no tiny tap targets) takes over — not the same table
squeezed into 390px.

## 브리프에 없던 것 (self-authored, since this round has no independent designer agent — see
DECISION.md §0 disclosure)

1. **무엇을 정해야 했나**: the brief's layout-archetype list names "캘린더/보드 중심" but gives no
   concrete shape for what a *booking* calendar should look like (room-by-time grid vs. a literal
   month calendar vs. a Gantt).
   **무엇으로 정했나**: a resource-rows × hour-columns table for a single selected day, with a
   day switcher rather than a 7-day literal month view.
   **왜**: a literal week/day grid at 6 resources × many hours would either force a wide
   `min-w` table (banned on desktop) or need per-cell density too fine to stay keyboard/tap
   accessible. Collapsing to one day at a time keeps every cell ≥ 59px even at the narrowest
   tested desktop width (1264px), confirmed by direct Playwright measurement during this round's
   own hard-gate debugging.

2. **무엇을 정해야 했나**: how to surface a per-cell hover detail without becoming the exact
   "sr-only 앵커"-class bug the brief already names once (absolutely-positioned content inside a
   clipping ancestor polluting `document.scrollWidth`).
   **무엇으로 정했나**: no per-cell floating tooltip at all — a single shared `aria-live="polite"`
   status line above the table, updated on hover *and* focus.
   **왜**: this round's own hard-gate run caught the floating-tooltip version live — the
   `<td>`'s `scrollWidth` included its absolutely-positioned (non-clipped) tooltip child even at
   `opacity:0`, inflating the enclosing `<table>`'s `scrollWidth` past its `table-fixed` column
   budget at five separate desktop widths. Lifting the preview to one shared element removes the
   per-cell overflow surface entirely and is incidentally more robust for screen-reader and
   low-vision users than a floating box would have been.

3. **무엇을 정해야 했나**: the brief requires "선택→다중 위젯 동기화" but (per
   `dash-brief-v3`'s own documented history) warns against a single `selectedId` threaded
   identically into every widget.
   **무엇으로 정했나**: three independently-scoped reactions to one click — KPI tile value swap,
   detail panel, and bookings-table row highlight (not row filtering, not a full table
   re-sort) — each on its own prop, not one shared re-render path.
   **왜**: direct application of the catalog's own documented axis ("파급을 하나로 뭉치는가,
   갈래로 나누는가") from `dash-brief-v3`'s interaction-sync section.
