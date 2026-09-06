# Candidate b — Payline

One-line concept: A hero-number-first payout console for Repick Marketplace — one dominant "net payout volume" numeral with a light inline stat strip, backed by a volume-trend chart and a sortable settlement-run table, where pinning a row opens a side detail panel without touching the aggregate hero figures.

## 브리프에 없던 것

**Product / brand identity**
① Had to invent a whole product concept, name, and workspace context since the brief only says "repick-adjacent ops tooling."
② Decided: "Payline," a payout-operations console for "Repick Marketplace" (with EU/Wholesale sibling workspaces), owned by a "Payments Ops Lead" persona (Jordan Ames).
③ A payout/settlement console gives a naturally single, legible hero number (net payout volume) plus real supporting ops data (take rate, settlement time, disputes) — a good structural fit for the assigned hero-number-dominant archetype without inventing an artificial metric.

**Accent hue + measured contrast**
① Had to pick an accent outside emerald/cyan/rose/amber/teal (recent winners) and outside violet/amber (catalog-wide overrepresented), then verify real contrast numbers rather than assume Tailwind's default text pairing is safe.
② Decided: orange, split by role — orange-700 `#c2410c` (5.18:1 on white) carries all text/icons/focus rings; orange-600 `#ea580c` (3.56:1 on white — fails 4.5:1) is decorative-only (bars, large ≥19px numerals); solid buttons use orange-700→900, never 600, because white-on-600 only clears 3.56:1.
③ Orange was explicitly suggested by the brief's own example list, is unused in the excluded-hue set, and worked thematically as a warm "attention/money" accent for a payouts console — but Tailwind's default `orange-600` (the "obvious" choice) actually fails body-text contrast, so the two-step split was necessary, not optional.

**Status-badge palette (paid/processing/held/failed)**
① Had to decide whether status semantics should reuse the brand accent or stay separate.
② Decided: paid = green-800/green-50, processing = blue-800/blue-50, held = zinc-700/zinc-100, failed = red-800/red-50 — none reuse the orange accent.
③ Keeps the "single accent used sparingly" principle honest: if orange also meant "held," the accent would be doing double duty as both brand identity and a status signal, diluting its meaning. The one deliberate exception is the "pinned — out of sync" banner, which borrows the accent for a one-off contextual moment, not a recurring status.

**Theme (light, not dark)**
① Brief allows either theme; had to commit to one and execute it for real (not a cream/paper fake-light).
② Decided: genuine white-based light theme — `zinc-50` canvas, white cards, `zinc-200` hairlines, `shadow-sm`.
③ The last 5 rounds and the excluded-hue winners lean toward dark, trend-forward palettes; a disciplined white console (Mercury/Monarch register) reads as a deliberate contrast in this round's mix and suits a finance-adjacent ops tool.

**1920px width arithmetic (no cap applied)**
① Brief requires computing the cap math or proving no premature cap exists.
② Decided: no `max-w` on the main content grid at all. At 1920px: sidebar `w-64` = 256px, main padding is `lg:px-8` = 32px each side = 64px total → available content width = 1920 − 256 − 64 = **1600px**, and the grid fills exactly that (gap to each viewport edge = 32px, ≤ the 40px padding-only ceiling).
③ Given the assigned hero-number-dominant layout already needs generous horizontal room for a 96px numeral and a 12-col grid below it, capping width would have fought the layout's own scale; letting it run edge-to-edge (minus padding) was simpler and correct.

**Settlement-table column budget (min-content-first, not guessed-after)**
① Brief requires summing real minimum content widths before allocating colgroup percentages, with a `min-w` safety net rather than letting cells overlap.
② Decided budget: Run 100px · Seller 110px · Amount 76px · Method 90px · Status 96px · Date 84px = 556px sum → percentages 18/20/14/16/17/15. Verified against the tightest tested desktop width (1280px, ~600px available inside the left card): 556px leaves ~44px of slack, so `min-w` never binds on desktop; only mobile (Method column hidden, ~466px of floors vs. ~326px available) triggers the documented horizontal-scroll safety net inside the table's single `overflow-x-auto` wrapper.
③ This is the exact failure mode the brief calls a "hard fail, twice-reproduced" (badges/amounts silently overlapping); computing the floor first and deriving percentages from it, then checking the real 1280px number, was the only way to be sure the desktop breakpoints (1280/1366/1440/1600/1920) never scroll while mobile still degrades gracefully.

**Settlement data (sellers, runs, fees, dates) and the nested-consistent chart math**
① Had to invent every seller, run, date, amount, and fee rate — and the brief's data-discipline rule that subtotals must sum to totals meant these couldn't be arbitrary.
② Decided: 6 sellers, 12 settlement runs (Jun 2 – Sep 6, 2026); fee rates 0.4% (bank transfer) / 1.5% (instant payout); and — the load-bearing choice — the three period charts are nested by construction: the week's 7 daily values sum to exactly 68,240; the month's 4 weekly values (whose last entry **is** the week total) sum to exactly 284,910; the quarter's 3 monthly blocks (whose last entry **is** the month total) sum to exactly 812,460. Arithmetic is spelled out in a `data.ts` comment.
③ Rather than leave the hero number and its supporting chart merely "close enough," nesting the aggregates so each finer period's total is literally the next-coarser period's most recent bar makes the period-toggle interaction (requirement ③, paired with the hero recompute) demonstrably correct instead of just visually plausible. The settlement table itself is explicitly *not* period-filtered (documented in its own caption and in a `PayoutsClient.tsx` comment) — it's a fixed operational sample, so it was never a subtotal candidate.

**Branched selection: pin (persistent, partial) vs. hover (ephemeral, zero-state)**
① The brief requires two genuinely different-scope selection behaviors, not one `selectedId` threaded uniformly, and asks for the split to be visible as a UI element where it fits.
② Decided: clicking a row's pin icon sets `pinnedRunId`, which recomputes **only** the right-rail `RunDetailPanel` — the hero number, its stat strip, and the volume chart deliberately ignore it (documented via a code comment in `PayoutsClient.tsx`, since they're marketplace-wide aggregates and scoping them to one sampled row would misrepresent an aggregate as if derived from a single settlement). Hovering/focusing a seller name instead opens a CSS/state-driven tooltip with zero persisted state, positioned via a ref-measured absolute box that sits *outside* the table's `overflow-x-auto` clipping so it's never cut off. When a pinned run's date falls outside the currently selected period, a visible "Pinned — out of sync" banner appears in the detail panel with a "Switch to `<period>` view" action.
③ This directly targets the brief's called-out failure mode from prior rounds (branched-selection penalized as "interchangeable with plain master-detail" when done uniformly) by making the two interactions differ in trigger (click vs. hover), persistence (sticky vs. vanishes on blur/mouseleave), and blast radius (one panel vs. three widgets deliberately excluded) — and by surfacing the mismatch as an actual banner rather than a silent internal state divergence.

**Typography: single display face reserved for the hero numeral only**
① Brief allows at most one optional display face, "large text only," and hints the hero number is a good candidate.
② Decided: `var(--font-display-mono)` (JetBrains Mono Display) applied via inline `style` to the hero numeral alone (56–96px), at `font-semibold` (600) — one of the exact three rendered weights used everywhere else (400/500/600) — so it doesn't introduce a fourth computed weight. No display face anywhere else on the page.
③ A monospace numeral is a common, credible fintech-console convention (Mercury/Coinbase-style large figures), and restricting it to one element keeps the "dash pages commonly use none at all" guidance mostly honored while still using the affordance where it earns its keep.
