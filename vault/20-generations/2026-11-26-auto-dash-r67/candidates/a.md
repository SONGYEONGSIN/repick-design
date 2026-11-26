# Candidate a — Siteframe (reassigned re-implementation of auto-dash-r66/b)

**Concept.** Siteframe is a clinical-trial site-visit scheduling console for a CRO/sponsor
operations team juggling patient visits across multiple trial sites. This candidate is a clean
re-implementation of the exact concept previously conceived as `auto-dash-r66/b` — same
calendar/board-centric macro layout, same component set, same brand/theme — rebuilt to fix the one
defect that killed that attempt. The macro-bucket is calendar/board-centric: a month (or week)
calendar fills most of the viewport, each day cell colored by a 6-step lime heatmap bucket (0 / 1–2
/ 3–4 / 5–6 / 7–8 / 9+ visits) with the exact visit count always rendered as bold tabular text
inside the cell (never color-only), plus an `sr-only` "visits scheduled" extension so density reads
correctly without sight. Selecting a day reveals that day's visit board below: a sortable,
filterable `<table>` (Time / Patient / Visit type / Site / Coordinator / Status, `aria-sort`,
status-filter chips, tabs for "Visit list" vs. "Day summary"). A Sites rail beside the calendar and
a 4-card KPI row above it are both driven from the same underlying `Visit[]` array via pure
aggregate functions in `data.ts`, so a month total, a site's on-time rate, and the day board's row
count can never drift apart.

**The time-column fix (the point of this reassignment).** The prior attempt rendered a 12-hour
range with a duplicate-meridiem-elision trick ("8:30–9:00 AM"), which shrinks a same-meridiem row
but cannot shrink a row whose range crosses AM→PM ("11:30 AM–12:15 PM", 18 characters, no shared
suffix to drop) — that one wide row caused the `sweep` cell-overlap failure after an otherwise
clean fix pass. This candidate switches `formatClock`/`formatRange` in `data.ts` to a bare 24-hour
clock, always zero-padded on both sides ("08:30", "23:00"), so **every** formatted range is exactly
11 characters — `HH:MM–HH:MM` — for every row, with no AM/PM boundary left to cross and therefore
no special-casing required at all. This is option (b) from the reassignment brief: removing the
failure class rather than just out-widening it.

A first pass under-widened the Time column (14% of a 600px mobile `min-w`) relative to its new
fixed-length content once `pr-3` padding was subtracted, which re-gating caught as an 8-row
cell-overlap regression at 390px — a plain under-sizing bug, not a recurrence of the original
AM/PM-crossing defect (it hit every row uniformly, not just the crossing one). The one permitted
fix pass corrected this by (1) raising the colgroup shares for the two fixed-length, non-truncating
columns — Time 14%→18%, Patient 12%→13% (borrowed from Visit type 16%→15%, Site 20%→18%,
Coordinator 18%→16%; Status stays 20%) — and (2) raising the table's mobile `min-w` from 600px to
660px. Visit type/Site/Coordinator all `truncate` internally and can never bleed into a neighbor
regardless of width, so only Time and Patient needed pixel-exact verification: at 660px, Time is
`0.18 × 660 = 118.8px`, minus `pr-3` (12px) = 106.8px content area against an ~88px 11-character
tabular-nums string (18.8px slack); Patient is `0.13 × 660 = 85.8px`, minus 12px = 73.8px against
an ~56px 7-character id like "021-169" (17.8px slack) — both clear the 16px floor. At 1280px desktop
(table content width ~920px, from 1280 − 256px sidebar − 64px `lg:px-8` − 40px card padding) the
same percentages give Time ~153.6px of content against ~88px (65.6px slack) and Patient ~107.6px
against ~56px (51.6px slack); every wider breakpoint (1366/1440/1600/1920) only adds slack
monotonically. At 390px mobile the `<table>` itself (never a `<td>`, which has no layout effect
under `table-fixed`) carries `min-w-[660px]`, so the one `overflow-x-auto` wrapper around it is the
only place this route scrolls sideways.

**Two independently-scoped selection axes.** (1) Persistent: clicking/arrow-keying/focusing a
calendar day sets `selectedDay`, which flows to exactly one consumer — the VisitBoard below —
leaving the KPI row and Sites rail untouched. (2) Ephemeral: hovering or focusing a site chip
inside the "On-time rate" KPI card sets a local `hoveredSite` state that opens a small tooltip
*inside that same card only*; it is never read by, nor ever writes to, `selectedDay`, the board, or
the Sites rail. The two axes live on different dominant widgets (calendar vs. a KPI card) and never
share state, satisfying the "split blast radius" bar rather than a single selection threaded to
multiple re-rendering consumers.

**The ≥4 real interactions.** (1) Calendar day-cell hover/focus tooltip, positioned via
`getBoundingClientRect` and flipped below near the top row, with a per-visit-type breakdown —
keyboard-reachable via `onFocus` and arrow-key roving, not mouse-only. (2) The visit board's table
sort (3 sortable columns, `aria-sort`, toggling asc/desc) plus status-filter chips, both running
real client-side filtering/sorting. (3) A Month ↔ Week `SegmentedControl` toggle that changes the
calendar's dominant layout, with independent Prev/Next week navigation. (4) The `selectedDay` →
VisitBoard sync described above, kept structurally separate from the ephemeral `hoveredSite` axis.
Bonus: a ⌘K command palette (jump to day, switch view, filter status, switch trial) and a working
"New visit" form that appends a real `Visit` to state, immediately reflected by the calendar and
board, plus a trial switcher that re-filters every widget on the page.

**Typography/theme.** Pure white/zinc-50 canvas, zinc-200 hairlines, `shadow-sm` cards — light
theme throughout, lime as the only accent (primary button, active nav/tab/segment state, selected-
day border, the heatmap scale). `--font-display-grotesk` is used in exactly two places — the
sidebar wordmark and the page `<h1>` — plus the "Visits this month" KPI's headline numeral, which
is also a hero number; everything else, including every other KPI number, is Pretendard with
`tabular-nums`. Exactly three rendered weights: 400 ambient body (Tailwind's default inherited
weight, never overridden to `font-semibold`), 500 `font-medium`, 700 `font-bold`. Status badges use
separate muted semantic tones (sky/emerald/rose/zinc), kept apart from the brand accent the way
Linear or Asana separate brand color from status color.

**Carried forward from r66/b, confirmed kept.** (1) `pr-3` (or equivalent trailing padding) on
every table cell, including the sortable `<th>`s via `SortHeader`, which lacked it in the version
read back from the prior route — added here so all six header cells and all six body-cell types
share the same horizontal rhythm. (2) Every responsively-hidden button label uses
`sr-only sm:not-sr-only` on the label span (e.g. the topbar's "New visit" button), never
`hidden sm:inline`, so the accessible name never goes empty at narrow widths.

## 브리프에 없던 것

1. **Decide:** Whether 24-hour time is in-scope for a CRO/sponsor scheduling console, since the
   brief's fix options list 24-hour format as only one of two acceptable choices.
   **Decided:** Yes — adopt 24-hour clock display route-wide (table, notifications popover, new-
   visit form's time `<select>`), not just inside the VisitBoard table.
   **Why:** Reference — many clinical-trial site operations tools and CRFs use a 24-hour clock by
   convention to avoid AM/PM transcription ambiguity in patient records, so this reads as more
   domain-authentic than arbitrary; it also avoids a jarring 12-hour-vs-24-hour format mismatch
   between the table and the rest of the page, which would have been inconsistent.

2. **Decide:** How much width to give the Time column now that the content is fixed-length, since
   the brief only gave a specific target (~23-24%) for the widen-only option (a), not for the
   width-invariant-notation option (b) this candidate chose.
   **Decided:** An initial pass under-sized it at 14% of a 600px mobile `min-w`, which re-gating
   caught as an 8-row cell-overlap regression at 390px (every row, not just one — a plain sizing
   bug, not a recurrence of the AM/PM-crossing defect). The one permitted fix corrected it to Time
   18% / Patient 13% (both fixed-length, non-truncating columns, verified by exact pixel arithmetic
   against their known character counts) with Visit type 15% / Site 18% / Coordinator 16% / Status
   20% absorbing the difference, plus raising the table's mobile `min-w` to 660px.
   **Why:** Arbitrary-but-verified both times — the first pass wrongly assumed "shorter fixed text
   needs less room" without checking actual pixels at the table's own narrowest rendered width
   (660px, reached only via the mobile `min-w`, not the 390px viewport itself); the corrected pass
   computes real slack (Time: 18.8px, Patient: 17.8px, both >16px) at that exact width instead.

3. **Decide:** A concrete demo calendar (month, which weekday Nov 1 falls on) — the brief gave no
   specific date, and the hard rule bans `new Date()`/`Date.now()`.
   **Decided:** November 2026, `TODAY_DAY = 25` (Wednesday) as a fixed integer constant, with Nov 1,
   2026 hand-verified as a Sunday against a Jan 1, 2026 = Thursday anchor, so the 30-day month needs
   no leading filler cells.
   **Why:** Reused unchanged from r66/b's own resolution of the same open question — this candidate
   is an explicit re-implementation of that concept, and the anchor date is independently checkable
   arithmetic, not an arbitrary new choice to introduce.

4. **Decide:** Whether multiple trials should be real, switchable datasets or a single hard-coded
   trial.
   **Decided:** Two trials (ARX-312, BTN-119) with fully independent day-count seeds, switchable via
   a workspace-switcher pattern in the sidebar that re-filters every widget on the page.
   **Why:** Carried over from r66/b — a trial switcher that only relabeled one dataset would be a
   dead-looking-but-live control, which the brief penalizes; a second real dataset keeps it genuine.

5. **Decide:** What counts as "on-time" for a clinical visit.
   **Decided:** `completed / (completed + missed)` among visits whose day has already happened,
   excluding `cancelled` (sponsor/site-initiated reschedule, not a patient no-show).
   **Why:** Carried over from r66/b — the simplest formula that still reconciles exactly with the
   status counts shown in the Day-summary tab, the binding constraint for any headline number.

6. **Decide:** What a focus-visible treatment should look like, given the brief bans relying on
   `ring-2`+`ring-offset-*` alone (Tailwind v4 can render that fully transparent) and warns about
   `outline-none` self-cancellation.
   **Decided:** A shared `FOCUS_RING`/`FOCUS_RING_INSET` token pair using plain
   `focus-visible:outline-2 focus-visible:outline-offset-{2,0} focus-visible:outline-zinc-900`, with
   no `outline-none` anywhere; the one input that would look wrong with a plain outline (the command
   palette's search box) instead gets `focus-within:bg-zinc-50` on its wrapping row as the visible
   change.
   **Why:** Carried over from r66/b, which already implemented the brief's own prescribed
   alternative for the one input where an outline would clash with custom chrome.

7. **Decide:** How to treat `cancelled` visits visually without a disallowed low-opacity wrapper.
   **Decided:** `cancelled` renders as a dashed-border, line-through badge in `zinc-500` text, never
   inside an `opacity-*` container.
   **Why:** Carried over from r66/b's direct application of the brief's correction about blanket-
   opacity wrappers multiplying descendant text contrast below the stated floors.

8. **Decide:** Whether the sr-only `<caption>` inside the VisitBoard's `overflow-x-auto` wrapper
   needed an explicit containing block, since Tailwind's `sr-only` utility is `position:absolute`
   and the hard rules call out exactly this risk for elements inside a scroll-clipping container.
   **Decided:** Added `relative` to the wrapper `<div>` around the `<table>` (not to the caption
   itself, to avoid touching table-internal layout).
   **Why:** Reference — this is the literal scenario named in this round's hard-rule list ("any
   `position:absolute` `sr-only` element inside an `overflow-x-auto` clipping container... needs
   `position:relative` on itself or its nearest wrapper, or its containing block escapes the clip
   and corrupts page `scrollWidth` at 390px"); the prior r66/b route did not have this `relative`
   class, so it is a genuinely new fix in this re-implementation, not a carried-over one.
