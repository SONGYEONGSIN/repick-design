---
round: auto-dash-r14
variant: c
route: /dash-evolve/r14/c
---

# c — Crewline (field-service dispatch console)

**Product/brand**: Crewline, a field-service dispatch console for Basin City HVAC & Electric (fictional B2B — 6 technicians across HVAC/electrical/plumbing). Calendar/board-centric archetype: a full Monday–Friday scheduling calendar dominates the viewport, accompanied only by a slim technician-capacity rail — no hero-KPI-row-first, no master-detail, no 3-pane layout.

**Structure**: standard app shell (left nav sidebar + 44px topbar with ⌘K/notifications/user, each control independently 44px) → page header (h1 + inline `dl` stat strip: jobs/technicians/utilization/unassigned, not a 4-card KPI row) → two-pane content row: a ~256px `CapacityRail` (technician list doubling as a horizontal Bar chart, per charts.catalog "Compare Categories") + the calendar, which fills all remaining width via `flex-1 min-w-0` (no page max-w cap at all — the row simply fills available width, so 1920px right-edge whitespace is exactly the page padding). Week view is a real `<table>` (caption + scope + colgroup `%` + `table-fixed`, technicians as rows, weekdays as columns) that never needs a horizontal scrollbar at any required desktop width; Day view is a per-technician 8am–6pm timeline (percentage-positioned blocks). Both collapse to a shared day-grouped `AgendaList` below `lg`, so 390px never attempts the 5-column table.

**4+ interactions implemented**:
1. Hover/focus tooltip on the capacity bar-chart rows (job-count breakdown), keyboard-accessible via native `onFocus`/`onBlur` on real `<button>` rows.
2. Real status filter (Scheduled/In progress/Completed/Unassigned chips) that hides/shows job entries across both calendar views and the mobile agenda.
3. Week/Day view toggle — genuinely re-renders the calendar in a different orientation (table vs. timeline), not a re-skin.
4. Selection-syncs-multiple-widgets: clicking a technician in the rail (or via ⌘K) highlights their row across whichever calendar view is active and bolds their bar in the rail; clicking "Unassigned" does the same for the dispatch-needed jobs.
5. (bonus) ⌘K command palette searches technicians and jobs; selecting a job jumps to Day view on that day with the technician highlighted.

**Dominant visualization**: the calendar/schedule grid itself — every job chip/block shows time, customer and status as always-visible text (never hover-only), including the day-timeline's narrow blocks, which are backed by a redundant always-visible text line per technician per day precisely so a 1-hour block's truncated label never becomes the only source of truth. The secondary chart (technician capacity, horizontal Bar) also renders its value (`Xh · Y%`) outside the bar, not on hover.

**Font/typography discipline**: Pretendard only — no display face declared (grotesk is banned this round, and my sibling candidates already claim `-wide`/`-mono`; the brief explicitly allows this as a valid choice this round). Exactly 3 rendered weights confirmed by `gate.mjs`'s real `getComputedStyle` measurement (`weights: 3종 (렌더 실측)`), not just class-counting.

**Verification run** (this session, via `gate.mjs --target web --routes /dash-evolve/r14/c` against the live dev server, plus a standalone Lighthouse run on both desktop and mobile presets): route 2xx · types 0 errors (scoped) · static 0 violations · lint 0 · weights 3 (rendered) · sweep 0 overflow across 1280/1366/1440/1600/1920/390 · focus 0 missing (real Tab-press measurement) · console 0 defects · Lighthouse a11y **100/100 both presets** (only failed audit: `bf-cache`, not accessibility, not hard-failed).

**Commercial-polish bar**: light theme is pure white/zinc-50 (no cream), amber-700 solid CTA (amber-600 fails small-text AA per colors.catalog's own "3:1 보정" note, so the fill uses -700), job-status semantics (zinc/teal/emerald/red) are kept fully separate from the amber UI accent so "brand color" and "status color" never collide — the kind of restraint that reads as Calendly/Linear-internal-ops rather than a demo. No theatrical motion: only `transition-colors`/`transition-[width]` at 150–200ms, all `motion-reduce`-gated.

## 브리프에 없던 것

1. **What**: whether the "slim side rail" and the "one secondary chart for utilization/capacity" from the assignment should be two separate widgets or could be merged.
   **Decided**: merged them into one `CapacityRail` — a vertical list of horizontal bars that is simultaneously the technician resource list and the Bar-chart capacity summary.
   **Why**: building them separately risked landing on the explicitly-banned "3-pane (rail + big chart + detail/feed)" skeleton; merging keeps the page to exactly two panes (rail, calendar) while still satisfying both requirements, and it's also what makes the selection-sync interaction natural (the thing you click to select a technician is the same thing that shows their utilization).

2. **What**: the assignment's Week/Day toggle risks resembling the explicitly avoid-listed "fixed-width rail + 2-option segmented toggle governing the right pane with no hero row" skeleton, since my layout also has a fixed rail and a toggle.
   **Decided**: kept a genuine hero element (the inline `dl` stat strip directly under `h1`) rather than dropping straight into rail+pane, and made the toggle change the calendar's *orientation* (table ↔ timeline) rather than swap in an unrelated content type — a calendar-specific behavior, not a generic content-swap.
   **Why**: the avoid-list's own wording keys on "no hero row" as part of what made that prior skeleton distinct; keeping a hero row is a real structural difference, and r10/r12's delta notes explicitly frame the ban at the coarse-skeleton level, not against any rail+toggle combination forever.

3. **What**: how to keep every job's time/customer/status "always visible" on the Day-view timeline when some job blocks are only ~40–60px wide (a 1-hour slot in a 10-hour window).
   **Decided**: render truncated text inside the block when space allows, but also render a redundant always-visible plain-text line per technician per day listing every job's time + customer, so visibility never depends on block width.
   **Why**: this is the direct, defensive reading of the repeatedly-reinforced L3 delta ("단일 지배 시각화 완성도" — hover-only values lose on judge lens 2 across r7/r9/r10); rather than trust that truncated in-block text will always be legible, the redundant text guarantees it regardless of pixel width at any of the required breakpoints.
