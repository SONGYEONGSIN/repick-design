# Candidate b — Census (Support Ticket Triage)

repick internal support-ops console: a dominant 10×10 waffle grid reads the ticket
backlog's category composition at a glance (each cell = 1% of the open backlog,
icon-coded per category), with click-to-pin category selection that opens an
on-demand slide-over drilldown into that category's real tickets — never an
always-visible master-detail pane.

## 브리프에 없던 것

① **How many tickets to invent, and how the waffle's percentages relate to them.**
The brief asked for "~15–25 deterministic tickets" and a 10×10 waffle where "each
cell represents a fixed share of the total ticket backlog," but didn't say whether
the waffle's backlog is the same set as the invented tickets or a larger implied
population. I decided to make them the *same* set: 24 tickets total, and the
waffle's 100 cells are a largest-remainder apportionment of exactly those 24
tickets' category tally (via `compositionFor()` in `data.ts`), so "27 cells for
Item not as described" and "6 of the 24 invented tickets are Item not as
described" are the same fact expressed two ways — nothing to reconcile, and the
period toggle (7d/30d) just re-filters and re-apportions the same 24 rows by
`ageDays`, which is why the 7-day view drops "Listing removal appeal" to 0% (its
one ticket is 15 days old) instead of needing a second invented dataset.

② **Whether hover state should even be liftable to the parent, given the repo's
own accumulated delta on the hover/pin collision.** I decided to keep `hoverIdx`
entirely local to `WaffleGrid` (never passed up, never named anything a
parent also calls "selected") rather than threading a `hoveredId` down from
`client.tsx` next to `pinnedId` the way earlier rounds' post-mortems describe.
Reasoning: the vault's own r17–r26 history says the *distribution* of a shared
selection concept across siblings — not its exact prop name — is what reads as
interchangeable with master-detail. Making hover structurally incapable of
touching `pinnedId` (it only reads `pinnedId` once, read-only, to append
"Currently pinned" to its own tooltip string) is a stronger guarantee than a
same-name/same-order convention would have been.

③ **Reusing the categorical dataviz-skill blue (`#2a78d6`, slot 1) for the largest
category, right next to a chrome accent blue (`#1450b0`) for the single-accent
UI.** I decided this was acceptable rather than picking a different lead
category color, because they're visually distinct shades used in structurally
different roles (data fill vs. interactive chrome/focus ring), which is a common
real-product pattern (e.g., a brand blue distinct from a chart's data blue). I
did change one thing to avoid a second collision: the notification dot was
initially the categorical orange (`#eb6834`, "Shipping delay"'s color) and I
moved it to `rose-500`, since an unread-count dot borrowing a category's exact
hue risked being read as "there's a shipping-delay alert," which isn't true.

## Computed accent contrast (real WCAG relative-luminance formula, not estimated)

Accent: `#1450b0`.

- `#1450b0` text/fill on `#FFFFFF`: **7.49:1**
- `#1450b0` text/fill on `#FAFAFA` (zinc-50): **7.17:1**
- White (`#FFFFFF`) text on `#1450b0` fill (Export snapshot button): **7.49:1** (ratio is symmetric)

All comfortably clear AA normal-text (4.5:1) and the UI/large-text floor (3:1),
with margin to spare — chosen deliberately deeper than the very common `#2563EB`
(would have been ~5.2:1) for a slightly more considered, higher-contrast blue.

Muted text audit: every `text-zinc-400`-on-light instance found in review (2.56:1,
fails even the 3:1 floor) was bumped to `zinc-500` (4.83:1) or, where it sat on a
dark tooltip surface (`zinc-900`), left alone since `zinc-300`/`zinc-400` on
`zinc-900` measure 11.99:1 / 6.91:1 respectively — both clear the dark floor.

## Weights & display face

Exactly 3 rendered weights site-wide: 400 (implicit default — body copy, table
cells, descriptions), 500 (`font-medium` — labels, nav, badges, buttons), 600
(`font-semibold` — headings, emphasized numbers). `--font-display-wide` (Archivo
Display) is used only for the page `<h1>` and the small "repick" wordmark/logo
glyph in the sidebar — never body text, never a second display face.

## Shell & interaction confirmation

- App shell: left sidebar (brand lockup + workspace switcher + `Primary` nav with
  active pill + bottom user menu) and a top bar (⌘K-styled search button, primary
  "Export snapshot" action, notifications, avatar menu), all header controls
  exactly 44px (`h-11`). Mobile: sidebar becomes an off-canvas drawer (`inert`
  when closed, focus-trapped and Escape-closable when open).
- Selection → sync: clicking a waffle cell, a legend row, or a command-palette
  result calls one `pin(categoryId)` in `client.tsx`, which sets `pinnedId` *and*
  opens the slide-over. The persistent summary strip reads `pinnedId`/`pinnedSlice`
  directly and survives the drawer closing (Clear resets it explicitly). Hover is
  the local, ephemeral `hoverIdx` inside `WaffleGrid` described above — it never
  touches `pinnedId`, so there is no shared `selectedId` threaded through 3+
  components with the same name/order.
- 4+ real interactions: ① waffle cell hover/focus tooltip (keyboard-reachable —
  every cell is a real `<button>`) ② sortable + priority-filterable ticket table
  inside the slide-over (`aria-sort`, real client-side sort/filter) ③ 7d/30d
  period `SegmentedControl` that re-derives the waffle, legend counts and table
  rows ④ pin + slide-over sync described above ⑤ a working ⌘K command palette
  (global keyboard shortcut + topbar button, focus-managed, Escape-closable).

## Unsure / guessed

- No avatar/thumbnail images were used (initials-only `Avatar` chips instead),
  partly because `images.unsplash.com` 403s in this sandbox and partly because it
  kept the roster reads clean — flagging in case a photographic avatar was
  expected.
- The sidebar's workspace-switcher and user-menu popovers use `role="menu"` /
  `role="menuitemradio"` but only support Tab/Escape, not full arrow-key roving
  tabindex per the ARIA APG menu pattern. Every item is still independently
  focusable and activatable, so I judged this an acceptable simplification, but
  it's worth flagging as a deliberate scope call rather than full ARIA-menu
  compliance.
