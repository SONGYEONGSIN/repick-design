# Candidate B — Ridgehaul (Support Ticket Resolution Health)

A dark, near-monochrome ops console for repick's support org: a wide feed-centric activity
stream of recently resolved/escalated tickets sits in the center column, flanked by an SLA
pulse + team-detail panel on the left and a compact per-team box-plot panel (resolution time
in hours, 5 teams) on the right — clicking a team's box plot pins two independently-clearable
selections: the center feed's team filter, and the left panel's team-detail/breach-log card.

## Not specified by the brief

- **Exact accent hex + contrast math.** Accent = `emerald-400` (#34D399) for text/icons on
  `zinc-950` (#09090B) — relative luminance 0.4967 vs 0.0028 → contrast ≈ **10.36:1**. Primary
  filled buttons use `emerald-500` (#10B981, L=0.3641) with **dark** (`zinc-950`) text rather
  than white, because white-on-`emerald-600` only reaches ≈3.77:1 (fails AA for normal-weight
  button labels) while dark-on-`emerald-500` reaches ≈**7.85:1**. Breach severity gets its own
  family, `amber-400` (#FBBF24, L=0.5790) on `zinc-950` → ≈**11.92:1**, always paired with an
  `AlertTriangle` icon + the text "Breached SLA" and a **dashed** border (not just a hue swap —
  shape differs from the "On track" badge's solid border too). A third, calmer `sky-400` is
  used only for the in-progress "Escalated" state (not resolved yet, so it's not a severity
  color at all).
- **Which 4+ interactions to pick.** Chose: (1) box-plot hover/focus crosshair that computes an
  hours value from cursor position and shows it as SVG text, with a keyboard-equivalent (focus
  shows the crosshair at the median) since box plots don't have an obvious arrow-key crosshair
  gesture; (2) the ticket table's sortable `Duration`/`Updated` column headers (`aria-sort`)
  combined with the status segmented control as the "real filter" half of that same brief item;
  (3) the two independently-scoped selection pins described above (box-plot click → feed filter
  + detail pin, each with its own clear control — the top fan-out tier per the open-delta note);
  (4) the ⌘K command palette (arrow keys + Enter, `aria-activedescendant`, focus-restore to the
  trigger button on close).
- **Whether box-plot "outlier" and "SLA breach" should be the same concept.** Decided they're
  related but distinct: outliers are a statistical property of each team's distribution (Tukey
  1.5×IQR fences), while "breached" is a fixed business rule (`resolutionHours > 24`). For most
  teams the single worst ticket happens to be both; Listings & Catalog's slowest ticket (16.8h)
  is a chart outlier but **not** an SLA breach — kept deliberately to show the two concepts don't
  collapse into one, since the brief only asked for "outliers" without specifying the relation.
- **SLA threshold.** Picked a single global 24h resolution SLA (common first-line support
  convention) rather than a per-team threshold, since the brief didn't specify one — this also
  made the SLA reference line land at exactly 50% of the box-plot's 0–48h scale, which doubles
  as a clean shared axis across all five rows.
- **"Recently resolved/escalated" feed depth.** Used a fixed, fully deterministic 60-ticket
  dataset (5 teams × 10 resolved + 2 escalated each, built by a small index-mapping loop over
  hand-authored per-team hour/subject arrays — not `Math.random`), spanning a fixed "last ~3.9
  days" window via closed-form minute offsets, rather than literally wiring to a live feed.
- **Workspace switcher / notifications / CSV export realism.** The brief asks for these shell
  pieces without specifying depth. Made the workspace switcher a real (if cosmetic) toggle, the
  notification bell a real read/unread state, and the topbar's primary action a genuinely
  functional client-side CSV export of the full ticket dataset (Blob + object URL), rather than
  a dead-end "primary action button."
- **Table responsiveness.** The center feed is a real `<table>` (sortable headers, status
  badges, avatar cells) rather than a plain card list, so it also satisfies the component-system
  "sortable data table" requirement. At narrow widths it keeps a `min-w-[700px]` on the
  `<table>` element itself (never on individual cells) inside one `overflow-auto` card region —
  the brief's own "Table `min-w`" rule implies this pattern is sanctioned, and it's the only
  horizontally-scrolling container on the page.
