# Candidate b — Siteframe

**Concept.** Siteframe is a clinical-trial site-visit scheduling console for a CRO/sponsor
operations team juggling patient visits across multiple trial sites — distinct from the catalogue's
prior calendar-bucket entry (Crewline, logistics dispatch) in domain, data shape, and coloring
scheme. The macro-bucket is calendar/board-centric: a month (or week) calendar fills most of the
viewport, each day cell colored by a 6-step lime heatmap bucket (0 / 1–2 / 3–4 / 5–6 / 7–8 / 9+
visits) with the exact visit count always rendered as bold tabular text inside the cell (never
color-only), plus a `sr-only` "N visits scheduled" extension so the density reads correctly without
sight. Clicking (or arrow-keying to, or focusing) a day reveals that day's visit board below: a
sortable, filterable `<table>` (Time / Patient / Visit type / Site / Coordinator / Status,
`aria-sort`, status-filter chips, tabs for "Visit list" vs. "Day summary"). A persistent "Sites"
rail beside the calendar and a 4-card KPI row above it are both driven from the same underlying
`Visit[]` array via pure aggregate functions in `data.ts`, so a month total, a site's on-time rate,
and the day board's row count can never drift apart.

**The ≥4 real interactions:** (1) calendar day-cell hover/focus shows a single shared tooltip
(positioned via `getBoundingClientRect`, flips below near the top row) with a per-type visit
breakdown — keyboard-reachable via `onFocus`/arrow-key roving, not mouse-only; (2) the visit board's
table sort (3 sortable columns, `aria-sort`, toggling asc/desc) and status-filter chips both run
real client-side filtering/sorting on the day's records; (3) a Month ↔ Week `SegmentedControl`
toggle changes the calendar's dominant layout, with independent Prev/Next week navigation; (4)
clicking a day updates **only** the visit board below it (`selectedDay` → one consumer) — the KPI
row's "on-time rate" card has a completely separate, ephemeral per-site hover/focus tooltip
(`hoveredSite` local state) that never reads or writes `selectedDay`, so the two sync axes never
touch, per the catalogue's selection-fan-out lesson. A ⌘K command palette (bonus 5th interaction)
and a working "New visit" form (appends a real `Visit` to state, which the calendar/board
immediately reflect) round out the "every clickable control is wired" bar, alongside a functional
trial switcher that re-filters the entire page's data.

**Typography/theme discipline.** Pure white/zinc-50 canvas, zinc-200 hairlines, `shadow-sm` cards —
no cream/paper dressing. `--font-display-grotesk` is used in exactly two places (sidebar wordmark,
page `<h1>`); everything else, including all KPI numbers, is Pretendard with `tabular-nums`. Exactly
three rendered weights (400 ambient / 500 `font-medium` / 600 none / 700 `font-bold`). Lime is the
only accent — primary button, active nav/tab/segment state, selected-day border, and the heatmap
scale — status badges use separate muted semantic tones (sky/emerald/rose/zinc) the way Linear or
Asana separate brand color from status color.

**Vs. commercial references.** The shell (sidebar with workspace/trial switcher + bottom user menu,
44px-control topbar with ⌘K button + primary CTA + notification popover), the local component
system (Card/Badge/SegmentedControl/Tabs/Popover/Progress/Sparkline, all as separate files), and the
working create-visit form push this closer to a real Calendly/Asana-grade settings-and-scheduling
surface than a static mock; the main gap vs. Mercury-level polish is the absence of true multi-month
navigation (deliberately out of scope — see below) and of a persisted backend.

## 브리프에 없던 것

1. **Decide:** What counts as "on-time" for a clinical visit, given the brief only said "on-time
   rate" without defining it.
   **Decided:** `completed / (completed + missed)` among visits whose day has already happened,
   excluding `cancelled` (sponsor/site-initiated reschedule, not a patient no-show).
   **Why:** No visit-ops convention was given in the brief; this is the simplest formula that still
   reconciles exactly with the status counts shown in the Day-summary tab, which was the binding
   constraint ("headline number must trace to the same per-record data the detail view reads").

2. **Decide:** A concrete demo calendar (which month, which weekday Nov 1 falls on) was needed for a
   real month grid, but the brief gave no specific date.
   **Decided:** November 2026, with `TODAY_DAY = 25` (Wednesday) as a fixed integer constant — never
   a `Date` object — and Nov 1, 2026 hand-verified as a Sunday against a Jan 1, 2026 = Thursday
   anchor, so the 30-day month needs zero leading filler cells.
   **Why:** The hard rule bans `new Date()`/`Date.now()`; picking a month that starts exactly on the
   first weekday column also simplified the grid math (no leading blanks) and happens to land "today"
   in the same month as this session's real date, which felt like a deliberate, checkable anchor
   rather than an arbitrary one.

3. **Decide:** Whether multiple trials should be real, switchable datasets or a single hard-coded
   trial, since the brief says "sponsor ops team... across multiple trial sites" but doesn't specify
   multi-trial switching.
   **Decided:** Two trials (ARX-312, BTN-119) with fully independent day-count seeds, switchable via
   a real workspace-switcher pattern in the sidebar that re-filters every widget on the page.
   **Why:** The brief explicitly penalizes dead-looking-but-live controls; a workspace/trial switcher
   that only relabels one dataset would be exactly that, so a second real dataset was the honest way
   to make it a genuine control rather than decoration.

4. **Decide:** How to treat past/cancelled visits visually without a disallowed low-opacity wrapper.
   **Decided:** `cancelled` status renders as a dashed-border, line-through badge in `zinc-500`
   text, never inside an `opacity-*` container.
   **Why:** Directly follows the brief's own correction about blanket-opacity wrappers multiplying
   descendant text contrast below the stated floors — dashed border + strikethrough is the suggested
   alternative, taken literally.

5. **Decide:** Whether KPI headline numbers should ever use `Intl.NumberFormat`'s `compact`
   notation (the brief flags a hydration pitfall with it).
   **Decided:** No compact notation anywhere — every count is small enough (≤150) that plain
   `Intl.NumberFormat("en-US")` is both correct and sidesteps the entire
   `trailingZeroDisplay:"stripIfInteger"` class of bug.
   **Why:** Arbitrary-but-conservative: the safest way to honor a documented gate lesson is to avoid
   the risky code path entirely rather than apply its documented fix and hope nothing else catches
   it.

6. **Decide:** What a focus-visible treatment should look like, given the brief explicitly bans
   relying on `ring-2`+`ring-offset-*` alone and warns about `outline-none` self-cancellation.
   **Decided:** A shared `FOCUS_RING`/`FOCUS_RING_INSET` token pair using plain
   `focus-visible:outline-2 focus-visible:outline-offset-{2,0}` with **no** `outline-none` anywhere
   except the command-palette search input, where the wrapping row instead gets
   `focus-within:bg-zinc-50` as the real visible change.
   **Why:** Directly implements the brief's own prescribed alternative ("use a non-outline focus
   treatment... instead") for the one input where a plain outline would look wrong against its
   custom chrome.

7. **Decide:** Whether "Workspace settings" / "Sign out" in the account menu need to do anything
   beyond closing the menu, since this is a single-route demo with no other pages or auth.
   **Decided:** They close the menu and nothing more (same treatment as the compact-rows toggle's
   sibling items in spirit, but without a page to navigate to).
   **Why:** Arbitrary but consistent with this catalogue's own precedent for a prior light/orange
   winner's account menu, which used the identical "close-only" treatment for its non-functional
   item — treated as an accepted convention rather than reinventing one.

8. **Decide:** Where the line is between "accent color used sparingly" and the heatmap itself, since
   a density heatmap in the assigned accent hue necessarily paints many cells lime.
   **Decided:** Let the heatmap use the full lime scale (it *is* the dominant visualization the
   brief asks for), and keep lime out of every other decorative surface — body text, large fills,
   secondary charts — so the accent still reads as singular and restrained everywhere else.
   **Why:** The brief's own dominant-visualization spec ("color intensity") only makes sense in the
   assigned accent; "sparingly" was read as "don't also spend it elsewhere," not "don't use it for
   the one chart that's supposed to showcase it."
