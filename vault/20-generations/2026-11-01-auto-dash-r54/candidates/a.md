# Candidate A — Firebreak (reassignment of the r53/c concept)

Firebreak is an SRE/incident-reliability SaaS console built on a true-light, single-orange-accent
theme. The macro layout is the brief-sanctioned "hero number + inline stats" variant rather than
this catalog's usual single-big-chart default: a Card holding a large SLA-compliance hero number
with delta/target badges and an incidents-logged chip, directly followed by a dense inline-stat
bullet/sparkline grid (MTTR, MTTA, P1 count, customer-facing count, change failure rate, postmortem
completion, pages/engineer, mean time between incidents, error budget consumed, plus two wide
4-week sparkline tiles) — deliberately no single dominant centerpiece visualization. Below that sit
a service-breakdown bar list and a sortable incidents table with a synced preview strip. Typeface
is Pretendard only everywhere (body, h1, wordmark); no `--font-display-*` variable is referenced
anywhere in this candidate. Exactly three rendered font weights are used site-wide — 400
(`font-normal`, applied explicitly on every table `td`), 500 (`font-medium`, labels/buttons/nav/
every table `th`), and 600 (`font-semibold`, headings/hero number/tile values) — with `th` weight
set directly on the leaf element so no UA-default bold leaks through a `thead` ancestor that
doesn't actually cascade weight to it.

**Interactions (7, all real `useState`/`'use client'`, none decorative):**
1. Reporting-period segmented control ("This month" / "Last month") re-slices the hero number, the
   full inline-stat grid, the service breakdown, and the incidents table from one `period` value.
2. Severity filter segmented control on the incidents table.
3. Sortable incident table columns (click a header to sort/reverse; `aria-sort` kept in sync).
4. Row hover/focus → a synced preview strip above the table (keyboard-reachable via a focusable
   button in the ID cell, not a bare `tabIndex` on a `<tr>`).
5. Sparkline crosshair: every weekly point is an invisible, focusable button layered over the SVG
   line, so hover **and** Tab-focus both reveal the exact value in a text tooltip — never
   hover-only information.
6. Command palette (⌘K): search/filter, "switch period" commands, and "jump to incident" (which
   sets the correct period *and* the preview so the result is actually visible).
7. Service-breakdown pin: clicking a service row pins/highlights it. This selection state lives
   entirely inside `ServiceBreakdownChart` and is never threaded to any sibling — a deliberately
   independent, non-resetting axis from the incident-row preview above, per the fan-out guidance
   (only `previewedId`/`onPreview` and one `onJumpToIncident` callback are shared from the parent,
   which is 2 consumers, not the flagged 3+ "identical threading" pattern).

**The two lineage bugs, fixed:**
- *Focus steal on load* — the prior `CommandPalette` effect read `if (open) {...; return cleanup;}
  triggerRef.current?.focus();`, which cannot distinguish "just closed" from "just mounted closed"
  and so stole focus to the search trigger on every page load. This candidate adds a `wasOpenRef`
  that only ever flips `true` while the palette is actually open; the trigger is refocused only on
  a genuine open→closed transition, with a one-line comment at the exact spot explaining the
  mount-vs-transition distinction, so it is auditable without re-deriving the fix.
- *390px overflow* — rather than chase the unconfirmed root cause from the two prior attempts
  (which already tried ad-hoc `min-w-0`/truncate patches and failed), this candidate rebuilds every
  flex/grid row defensively from scratch: `min-w-0` is applied to every flex/grid *item*, not just
  the row container (including nested spans inside badges, delta tags, and table-cell content, not
  only the obvious outer wrappers); every label/heading/long string carries `break-words` or
  `truncate`; the stat grid starts at `grid-cols-1` on mobile (no narrow half-columns to squeeze
  into) instead of `grid-cols-2`; the only literal pixel widths over ~150px (`min-w-[640px]` on the
  table) are confined to the `hidden lg:block` desktop branch; the sparkline's own fixed box is
  capped at 140×34 with its hover/focus tooltip capped at `max-w-[120px]` + `truncate`; the one
  `overflow-x-auto` scroller (desktop table only) is the sole horizontal-scroll container on the
  page; the table uses `table-fixed` + `<colgroup>` percentages summing to exactly 100, with
  `min-w` only on the `<table>`/wrapping `<div>`, never on a `td`/`th`, and `overflow-hidden
  truncate` directly on every `td`/`th`'s content as a clipping safety net. The project's global
  `body { word-break: keep-all }` (set for Korean-script support) was also specifically considered:
  it is a plausible contributor to the originally-unexplained overflow, since some engines compute a
  flex item's automatic minimum size using the full, unbroken line width once wrapping is
  restricted — which `min-w-0` neutralizes directly regardless of whether that theory is the exact
  mechanism, hence applying it exhaustively rather than selectively.

## 브리프에 없던 것 (What wasn't in the brief)

- **Product/brand name**
  - ① Decide whether to keep "Firebreak" or invent a new name for the reassignment.
  - ② Kept "Firebreak" — same wordmark, same orange flame mark.
  - ③ The task explicitly frames this as "recreate the SAME concept faithfully," not a free
    reinvention; the brand identity is part of that concept, and changing it would add
    unnecessary diff noise against the fix-the-two-bugs mandate.

- **Exact dummy incident records**
  - ① The brief doesn't specify literal incident titles/services/timestamps, only that the data must
    be deterministic and arithmetically correct.
  - ② Re-derived a fresh 18-incident ledger (9 last-month / 9 this-month) spanning the same 8
    services, renumbered IDs (`INC-22xx`/`INC-23xx` instead of the lineage's `INC-09xx`/`INC-10xx`)
    and lightly reworded titles, rather than copying the prior file's records verbatim.
  - ③ Convention from the assignment itself ("re-derive and improve," "don't just copy files
    verbatim") plus the general rule that all derived metrics must come from code, not hand-typed
    subtotals — satisfied here since every aggregate is computed by `computeAggregates`/
    `computeServiceBreakdown`, never hand-entered.

- **Mobile stat-grid column count**
  - ① The brief doesn't mandate a specific breakpoint schedule for the inline-stat grid, only that
    nothing overflow at 390px.
  - ② Changed the base grid from `grid-cols-2` (used in the failed lineage) to `grid-cols-1`, moving
    to 2 columns only at `sm:` (640px+).
  - ③ Arbitrary but risk-minimizing: a single eliminated candidate already shipped `grid-cols-2` at
    mobile and still failed the 390px check for unknown reasons: removing the narrow half-column
    squeeze entirely is cheap insurance against whatever the exact mechanism was, at the cost of a
    visually denser stat section on very narrow phones re-densifying one breakpoint later.

- **Focus-ring implementation**
  - ① The brief gives a literal safe-pattern string (`focus-visible:outline-2 outline-offset-2
    outline-<color>`, no `outline-none`) but the lineage file used a different (ring-based) pattern
    that the brief separately flags as unsafe in this exact Tailwind v4 setup.
  - ② Replaced the shared `FOCUS_RING` constant with the literal prescribed pattern
    (`focus-visible:outline-2 outline-offset-2 outline-orange-600`), applied everywhere, and found
    one remaining `outline-none` (on the command-palette search input) that would have recreated
    the explicitly-banned pairing — removed it.
  - ③ Followed the brief's explicit instruction literally rather than trusting the lineage file's
    own (apparently non-compliant) prior art.

- **Third independent selection axis**
  - ① The brief's "selection fan-out" guidance asks for genuinely independent selection state across
    components if more than one thing is "selectable," but the lineage only had two axes
    (period, preview).
  - ③ Added a third: pinning a service row in `ServiceBreakdownChart`, with its state declared and
    owned entirely inside that component.
  - ③ Demonstrates the "independent, non-resetting state in different components" pattern the brief
    calls out positively, rather than just avoiding the negative pattern by omission.
