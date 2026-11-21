## Concept

Portlane is a dark, single-accent (desaturated emerald) console for freight-terminal dock
scheduling at "Harborview Terminal 4": a hero strip states the day's headline numbers inline
(doors, bookings, utilization, conflicts, average dwell) rather than as a KPI card grid, and the
page's entire weight sits in one dominant visualization below it — a Gantt-style dock-door
timeline with one row per door, grouped into inbound/outbound zones, where every booking bar
prints its carrier name and exact time window as persistent, always-visible text (never
hover-gated), with status (scheduled/loading/completed) carried by icon shape plus a CSS-driven
hover/focus tooltip for extra depth, and double-booked doors flagged with a dashed rose border +
triangle icon. Two independently-scoped persistent selections fan out to two different places —
clicking a door "pins" it and updates only the detail panel's sortable bookings table below;
picking a carrier from the hero's filter updates only a one-line carrier-focus summary and dims
non-matching bars on the timeline itself — while a third, fully ephemeral state (hovering the
time axis) drives a keyboard-reachable crosshair + tooltip local to the timeline alone. A
Today/Tomorrow toggle, the sortable/filterable detail table, a tabbed Upcoming/All view, and a
⌘K command palette round out the required interaction set.

## 브리프에 없던 것

- **Time-of-day formatting without `Date`** — the brief bans `new Date()` outright, which rules out the
  `new Date(EPOCH, ...)` + `Intl.DateTimeFormat` technique a sibling round in this same catalogue
  (`r28/c/data.ts`) used for its own Gantt. I hand-rolled `formatClock`/`formatClockShort`/
  `formatClockCompact` as pure arithmetic over minutes-since-midnight integers (floor/modulo, no
  Date object ever constructed) — arbitrary in exact string shape, but the "no Date API at all"
  constraint itself comes directly from this round's brief, which is stricter than the precedent
  file in the same repo.
- **How "persistent carrier + time text" survives a narrow bar** — the brief requires carrier + time
  window as persistent visible text on every bar, but never says what happens when a bar is only
  ~90–130px wide. I decided bookings should be long enough (≥150 min) and few enough per door
  (2–3) that a two-line truncated label (carrier name, then time range) always has room, backed by
  `overflow-hidden` + `truncate` on both lines as a hard safety net against text ever painting over
  the next bar — arbitrary durations, but the safety-net pattern is lifted directly from this
  round's own "cell-overlap is not caught by overflow checks" warning, applied defensively rather
  than only where the gate would literally catch it.
- **Where the one allowed wide `overflow-x-auto` goes** — the brief bans two wide horizontal-scroll
  containers but both the 12-row day-long Gantt and the detail table's "Time" column (e.g.
  "12:30 PM–4:30 PM") are genuinely too wide for a 320px phone without one. I gave the single
  allowed `overflow-x-auto` (with a `min-w` floor on the wrapper, not on cells) to the Gantt, since
  horizontal-scrolling a timeline on mobile is the convention Asana/Linear/Monday all use, and
  instead made the detail table scroll-free by shortening its clock format to "6:00a" and merging
  the trailer/load line into the carrier cell — a convention borrowed from those same products,
  applied here because the brief states the rule ("never two") but leaves the choice of which one
  to the implementer.
