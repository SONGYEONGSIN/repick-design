# Candidate A — Portway: Buyer Activation Funnel

**Concept.** Portway is a B2B wholesale marketplace platform; this page is its "Buyer Activation Funnel" console — a 5-stage conversion funnel (Visitors → Signed Up → First RFQ Sent → First Order Placed → Repeat Buyer) rendered as a tapering trapezoid stack, where every stage permanently shows its count and drop-off percentage, and clicking a stage pins it and reveals a cohort breakdown table directly beneath the funnel.

## Interactions implemented (5, exceeding the 4-minimum)

1. **Crosshair tooltip on the funnel** — hovering *or focusing* (keyboard) a stage draws a thin violet crosshair line at its trapezoid edge and opens a floating readout with the exact count and accounts lost vs. the previous stage. Wired via `onMouseEnter/onMouseLeave` **and** `onFocus/onBlur` on the same button.
2. **Real table sort + filter** — the cohort table's Cohort/Channel, Lead Account, Entered, Advanced and Conv. Rate columns are click-sortable with live `aria-sort`, plus a text filter box that narrows rows by label or lead-account name/company in real time.
3. **Period toggle** — a segmented control (30 Days / 90 Days / All Time) recomputes the entire funnel, KPI strip and cohort tables from one source of truth (`STAGE_TOTALS`).
4. **Stage-pin → inline cohort reveal (primary axis)** — clicking a stage pins it (persistent `aria-pressed` state, violet border) and the cohort table below updates to that stage's breakdown. **The first stage ("Visitors") is pinned by default**, so the table is populated at first paint, never an empty placeholder. There is no separate detail pane — the "BEST" pattern from the brief: the table is revealed inline beneath the funnel itself, not a swap of an independent widget. The ephemeral tooltip (point 1) never touches this state; it's a separate, local, non-persistent preview.
5. **⌘K command palette** — `Cmd/Ctrl+K` opens a filterable action list (pin a stage, change period, jump to the funnel or cohort section), fully keyboard-navigable (arrow keys + Enter, `aria-activedescendant`), closable via Escape or backdrop click.

A sixth, secondary interaction: a **Tabs** control inside the cohort card lets the viewer flip the pinned stage's breakdown between "By Channel" and "By Signup Week" groupings (defaults to Channel for the top-of-funnel stage, Week for every other stage, re-derived whenever the pin changes).

## Mandatory fix compliance

No render-prop dismissible component exists anywhere in this route. The one dropdown/popover primitive (`menu.tsx`) takes `trigger` and `panel` as plain `ReactNode` props — never a function-as-children — and every close happens from a real event handler (`onClick`, a `pointerdown` outside-click listener, or `Escape` inside a `useEffect`), never invoked inline during render.

## Typography discipline

- Single optional display face used: **`--font-display-mono`** (JetBrains Mono Display), applied only to the brand wordmark ("Portway") and the page `<h1>`. Everything else is Pretendard (`font-sans`), untouched.
- Exactly **3 rendered font weights**: 400 (default/inherited — never set explicitly), 500 (`font-medium`, all labels/captions/secondary emphasis), 600 (`font-semibold`, all headings/primary numbers). No `font-bold`, `font-light`, etc. anywhere; verified by grep across the whole route.
- All counts, percentages and IDs use `tabular-nums`; table numerics are right-aligned and `whitespace-nowrap`.

## Brief gaps

① **What to decide**: which concrete B2B product/brand and which 5 funnel stages to invent (the brief only specified "5-stage conversion funnel," not the domain).
② **Decision**: "Portway," a B2B wholesale marketplace; funnel = Visitors → Signed Up → First RFQ Sent → First Order Placed → Repeat Buyer (90d).
③ **Why**: arbitrary but deliberately distinct from the reassigned concept's generic framing — a wholesale/RFQ funnel gives a legitimate reason for two different cohort dimensions (channel vs. signup week) and for "Lead Account" avatar cells, which let one real table satisfy the brief's "hover rows, status badges, avatar cells, aria-sort" requirement without adding a second table.

① **Decide**: whether a hover-only hover/hover-driven secondary pane was needed per the selection-fan-out hierarchy.
② **Decided**: no secondary pane at all — pinning reveals the cohort table inline beneath the funnel (the brief's own "BEST" tier for this candidate), and the crosshair tooltip never drives any other widget, so there is no hover/pin collision to guard against.
③ **Why**: the brief explicitly named this as the intended shape for this candidate ("your stage-pin→cohort-table relationship IS your primary interaction axis").

① **Decide**: how to keep every cohort-table subtotal reconciling with the funnel's own numbers without hand-balancing dozens of hand-typed rows across 5 stages × 2 views × 3 periods.
② **Decided**: wrote one pure `splitTotal(total, weights)` helper that always makes rounded parts sum exactly to `total` (the last row absorbs the rounding remainder), then re-verified by hand that no row's `advanced/entered` ratio could exceed 100% for the worst-case stage/weight combination (First RFQ Sent → First Order Placed, ~55% global rate) before shipping the weight arrays.
③ **Why**: general practice (a single source-of-truth split function is less error-prone than 90 hand-typed numbers) — the first draft's week-cohort weights *did* produce a >100%-conversion row for that exact stage, caught by hand-computing the worst case, which is why the final `CONV_WEIGHTS_WEEK` array is deliberately gentler than `ENTER_WEIGHTS_WEEK`.

① **Decide**: exact violet shade for the one solid-fill primary button (Export Snapshot) and the notification-count badge, both using white text.
② **Decided**: `violet-600` (not the assigned `violet-500`) for those two elements only; every other violet usage (badges, borders, active-tab underline, focus ring, progress fill) stays in the instructed 300–500 range.
③ **Why**: computed via an OKLCH→sRGB conversion that white text on `violet-500` is ≈4.40:1 — just under the 4.5:1 AA floor for normal-size text — while `violet-600` gives ≈5.9:1. Referenced the brief's own "AA-checked" instruction over the shade suggestion where the two were in tension.

① **Decide**: whether the two Unsplash portrait photos used as "Lead Account" avatars needed any special handling.
② **Decided**: used 6 fixed, specific `images.unsplash.com/photo-<id>` portrait URLs (already allow-listed in `next.config.ts`) as generic avatar placeholders attached to invented buyer names/companies, cycling deterministically by row index.
③ **Why**: the brief itself names this as the one legitimate photo use case for this concept ("avatars for a top customers in this stage list"); general practice in dashboard mockups is stock portraits as anonymous placeholders, never implying a real endorsement.

① **Decide**: layout shape for the funnel visualization itself (SVG canvas vs. CSS bars vs. something else).
② **Decided**: CSS `clip-path` trapezoids inside a flex row per stage (shape on the left, text/numbers on the right), rather than one SVG canvas with text overlaid on fills.
③ **Why**: general practice for accessibility/robustness — keeping permanent text off the colored fill avoids any contrast risk from the fill's gradient, and per-stage flex rows truncate safely at narrow widths instead of a monolithic SVG needing its own responsive text layout.
