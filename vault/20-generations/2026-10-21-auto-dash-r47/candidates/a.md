# Candidate A — Warden

**Pitch:** Warden is a SOC 2 audit/compliance workspace where the entire program's health lives in one 100-cell waffle (one cell per control) and every open finding lives as a card on a four-stage remediation board, instead of the usual KPI-row-plus-line-chart dashboard.

## Archetype & dominant visualization

- **Macro shell:** board-centric. The Audit Board (a four-column Kanban: Backlog → In Progress → Evidence Review → Attested) is the page's largest, most interactive surface — not a left-rail+KPI-row+chart+table layout, and not a rail+chart+feed terminal.
- **Dominant visualization:** a 10×10 waffle chart (100 cells = 100 SOC 2 controls), colored by status (Compliant / At-Risk / Non-Compliant / N/A), with the compliance rate always printed as large text (`75%` in the display face) plus a full sentence ("71 of 95 applicable controls compliant · 5 of 100 marked not applicable …") — never hover-only.
- **Theme/accent:** dark (zinc-950/900 surfaces, `border-white/10`, zinc-400 text floor) with a single emerald accent.

## Interactions implemented (6)

1. **Waffle hover/focus tooltip** — each of the 100 cells is a roving-tabindex button with a full `aria-label`; hovering or keyboard-focusing a cell shows a floating tooltip (`AC-07 · Access Control · Compliant`). Purely ephemeral — it changes no persistent state.
2. **Category pin** — clicking a waffle cell or a category chip sets `selectedCategory`, which drives exactly one consumer: the "Category Focus" card. It does **not** touch the board or the finding pin.
3. **Finding pin** — clicking a Kanban card sets `selectedFindingId`, which drives exactly one consumer: the "Finding Detail" card. It does **not** touch the category pin or the waffle highlight state beyond its own ring. These two pins are independently scoped, live in two different cards, and neither resets the other (tier-3: two independent persistent pins, plus the ephemeral hover above).
4. **Period segmented control** ("This Quarter" / "Last Quarter" / "Full Year") swaps the underlying dataset for the waffle, headline rate and trend chip.
5. **Findings Register real sort** — every column header toggles asc/desc with `aria-sort`, including a custom severity rank and a hand-written month/day due-date comparator (no `Date` objects).
6. **⌘K command palette** — global shortcut, arrow-key navigation, filtering by label; every command is wired to a real action (jump + scroll to a section, change period, open the New Finding modal, switch workspace).

Plus: a working mobile drawer, notification and account dropdowns, a workspace switcher, and a "New Finding" modal stub (controlled form, resets and closes on Create — documented in-code as a deliberate stub since the board/table render a fixed dataset).

## Typography

- Body, labels, all UI copy: `--font-sans` (Pretendard) only.
- Display: `--font-display-grotesk` used in exactly two places — the "Warden" wordmark in the sidebar and the big waffle headline percentage (`75%`). No other display var used, no serif, no extra `next/font` imports.
- Exactly 3 rendered font weights for the whole route: 400 (default/unstyled), `font-medium` (500), `font-semibold` (600). No `font-bold`/`font-light` anywhere.
- All numeric/ID values use `tabular-nums`.

## Completeness highlights

- The sidebar's `SidebarContent` root is `w-full min-w-0` inside the row-flex `<aside>` (the r46 overflow bug this catalog hit twice), and the long workspace-switcher label truncates correctly under a `w-64` rail.
- 1920px arithmetic: sidebar 256px + `px-6` main padding (48px) = 304px consumed → 1616px available content width at 1920px. The content cap (`max-w-[2000px]`) is well above that, so it never engages and content fills to within the gutter of the viewport edge.
- Every interactive element uses `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400` — never `outline-none` alone, never `ring`-only (all backdrop-dismiss buttons are also pulled out of tab order with `tabIndex={-1}` since they duplicate an already-focusable, labelled close control).
- Zero `overflow-x-auto` anywhere: the Findings Register is `table-fixed` + `<colgroup>` (10/30/14/10/16/8/12 = 100) with a `sm:hidden` card-list fallback, and the Kanban board reflows via `grid-cols-1 → sm:grid-cols-2 → xl:grid-cols-4` instead of scrolling horizontally at any desktop width.
- All data is static and hand-reconciled: category totals sum to 100, each period's status counts sum to each category's total and to 100 overall, and the Q3 trend chip's "+9 pts vs Q2 FY26" baseline is the same number Q2's own rate computes to when you switch the period toggle — verified by direct computation, not just by typing matching numbers in two places.

## 브리프에 없던 것

1. ① The brief doesn't specify what SaaS product to build. ② Invented "Warden," a SOC 2 Type II audit/controls-compliance workspace (100 fixed controls across 6 categories, a findings/remediation workflow). ③ Compliance tracking is explicitly listed as an allowed domain in the assignment, and it naturally produces a 100-item population (perfect for a 10×10 waffle) plus a real multi-stage workflow (perfect for a Kanban board) without forcing either shape.

2. ① The brief requires a waffle as the dominant chart but doesn't say how 100 cells should be keyboard-navigable without creating 100 tab stops. ② Implemented roving `tabIndex` (one active cell at a time, arrow/Home/End to move, Enter/Space to activate) inside a `role="group"`, rather than a full ARIA `grid`/`gridcell` pattern. ③ Arbitrary, documented engineering choice: roving tabindex is the standard pattern for large repeated-control sets (listbox/toolbar convention) and avoids both the 100-stop-Tab problem and the stricter conformance risk of a hand-rolled `role="grid"`.

3. ① The brief doesn't say whether the waffle's 100 cells should track individual controls' status across periods or just fill counts per period. ② Each period independently fills its 100 cells in a fixed category→status order (compliant block, then at-risk, then non-compliant, then N/A) rather than modeling "control #AC-07 was compliant in Q2 and is now at-risk in Q3." ③ Arbitrary simplification: the dashboard's job is to show the current distribution per period accurately (and it does, with hand-verified sums), not to model a longitudinal per-control history, which the brief never asked for.

4. ① The brief's "New Finding" / primary-CTA guidance says to avoid a dead button but doesn't say what creating a finding should actually do, given the board/table render a fixed dummy dataset. ② Built a real controlled-form modal (title/category/severity) whose Create button resets its own fields and closes — it does not insert a row into the board. ③ Convention from the brief's own defect list: "open a modal stub... something, not nothing" is given as an explicitly acceptable minimum; a full optimistic-insert into static demo data would risk silently desyncing the register, the board counts, and the waffle totals from each other.

5. ① Nothing in the brief specifies who the audited company or the dummy people are. ② Invented "Northwind Retail Inc." (+ a second workspace "Northwind EU Holdings" for the switcher) and four fictional owners (Maya Chen, Daniel Okafor, Priya Raman, Lucas Bianchi) plus a current user (Ava Brennan, Compliance Lead), each pinned to a fixed Unsplash photo id reused consistently across the board, table and detail cards. ③ Arbitrary but internally consistent naming or a small, deliberately diverse-sounding roster, matching the "realistic deterministic dummy data" requirement.

6. ① The brief bans `new Date()`/`Date.now()` but the Findings Register needs to sort a "Due" column correctly (Nov before Dec, Oct 30 before Nov 1). ② Wrote `due` as plain literal strings ("Oct 24") and a tiny fixed `MONTH_RANK` lookup table to sort them, instead of any Date API. ③ Direct consequence of the brief's own ban — the simplest deterministic substitute for date math without touching a banned API.

7. ① The brief asks for "selection → multi-widget sync" but leaves the exact blast-radius shape to the designer. ② Split it into two independently-scoped pins (category → Category Focus card; finding → Finding Detail card) plus one ephemeral hover (waffle tooltip), with the two pins living in physically separate cards that never reset or reference each other's state. ③ Directly following this round's own "actual differentiating axis" guidance, which explicitly scores two independent pins above a single shared `selectedId` or a hover+pin pair.
