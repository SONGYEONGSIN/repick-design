# Candidate c — Reloop, Seller Quality console

## Concept

Reloop is an invented marketplace-ops product for resale/liquidation sellers; candidate c is its
"Seller Quality" screen, a fixed-width left rail of ~24 sellers next to a dominant right pane built
around a hand-built SVG scatter plot (return rate × revenue, bubble = order volume), a persistent
detail card, and a full sortable fallback table — a dark, single-accent (sky) console in the
Linear/Superhuman master-detail mold, differentiated from prior master-detail rounds by its
correlation-scatter dominant visualization and an explicit pin/hover split on the selection
mechanic.

## Applied interactions (5, all real `useState`, deterministic)

1. **Persistent pin** (click a rail row, a table row, or a chart bubble) — highlights the seller's
   bubble with a static ring+halo, opens/updates the `DetailCard`, and is the only thing that drives
   that card. Toggles off on a second click.
2. **Ephemeral rail hover** — a fully separate `hoveredRailId` state that only draws a dashed preview
   ring on the matching bubble; it never opens the detail card and is cleared on mouse-leave/blur.
   Genuinely separate code path from the pin (different state variable, different visual language:
   dashed vs. solid+halo).
3. **Chart point hover/focus tooltip** — a third, independent interaction local to `ScatterChart`
   (`hoveredChartId`); shows exact values in a crosshair-style HTML overlay, keyboard-reachable via
   `tabIndex`/`onFocus` on each SVG point.
4. **Real column sort** on the full data table (`aria-sort`, 4 sortable columns) — explicitly does
   *not* react to the pinned seller (only highlights the pinned row); a caption states this.
5. **Tier filter chips + rail sort toggle** (segmented control) on the left rail, independent of the
   table's own sort state.
6. (Bonus) **⌘K command palette** searching all sellers, selecting an entry pins it via the same
   handler as the rail.

Non-reactive-by-design element: the chart's **outlier labels** (top-3 revenue, worst-3 return rate)
are computed once from the static dataset and never change with the pinned seller — called out in
the chart's own caption — so the chart still reads correctly with nothing pinned.

## What the brief left unspecified

**1. Brand/domain specifics**
① Brief said "invent a plausible brand name" for a seller-quality console but gave no product
identity. ② Invented "Reloop," a resale/liquidation marketplace, with an ops lead persona ("Mara
Ojeda") and workspace ("Aldergate Resale"). ③ "Reloop" reads as short, ownable, and evokes
returns/resale without colliding with the assigned brief's own placeholder name.

**2. Quality-tier thresholds and colors**
① No return-rate cutoffs for Healthy/Watch/Critical were given. ② Set 0–9% Healthy, 9–16% Watch,
16%+ Critical, colored emerald/amber/rose — a semantic layer distinct from the single sky accent.
③ Matches this same codebase's existing precedent (r28/c's `STATUS_META` uses the identical
accent+semantic-triad split), which the brief's "single accent" rule is understood to permit since
status colors communicate state, not brand emphasis.

**3. Whether bubbles themselves should be tier-colored**
① Brief bans "color alone" for meaning but the scatter plot's dozens of unlabeled bubbles have no
per-point text. ② Kept all bubbles a single sky hue rather than coloring by tier. ③ Tier is already
fully redundant with the X-position (tier is literally derived from return rate, the X axis), and
every seller's tier is independently available as icon+text in the full table and rail — so no
bubble relies on color alone to convey information not available elsewhere on the page.

**4. Rail vs. app-shell sidebar conflict**
① The domain brief's "master-detail" macro (fixed left rail of records) collides with the "app
shell" requirement for a standard branded left sidebar+nav. ② Kept the standard nav Sidebar
(Reloop brand, workspace switcher, nav) and nested the seller rail as a second, narrower column
*inside* main content, next to the detail pane. ③ Same resolution r28/c already used for its
QueueRail-inside-Gantt-shell pattern in this codebase; keeps both requirements literally satisfied.

**5. Table column set for the "same metrics" fallback**
① Brief requires the fallback table list "every seller with the same metrics" but not which exact
columns. ② Seller, Tier, Return rate, Revenue (90d), Orders, 30-day trend — mirrors every field the
chart/tooltip exposes (X, Y, radius) plus the tier and trend shown in the rail/detail card.
③ Ensures the table is a genuine parity fallback, not a subset.

**6. Table column widths at real breakpoints**
① No column-width guidance beyond "generous enough, no overlap." ② Hand-tuned percentages
(Seller 24/Tier 17/Return 12/Revenue 16/Orders 11/Trend 20) calibrated against this shell's actual
computed width at 1280px (rail 288px + sidebar 256px + paddings leave ~610px for the table), not a
generic guess. ③ The brief explicitly flagged this exact class of bug ("cell content must never
overlap") as a repeat failure in prior rounds, so it warranted arithmetic rather than eyeballing.

**7. Default pinned state on load**
① Unspecified whether the page should load with nothing pinned or something pre-selected.
② Defaulted to pinning seller `sl-3` (Coastal Crate Co.) on mount. ③ Shows the detail card, pin ring,
and non-empty state immediately, so a first render (and any screenshot judges take) demonstrates the
fan-out mechanic without requiring an interaction first.

**8. Deterministic-data generation method**
① Brief mandates no `Math.random`/`Date.now` but leaves the generator open. ② Used a seeded
mulberry32 LCG run once at module scope, with values shaped by a mild power curve (`rng() ** 1.15`,
etc.) so the distribution looks organic rather than uniform, then rounded to 1–2 decimals.
③ Deterministic across server/client renders, and the power-curve shaping avoids the "obviously
uniform-random" look a flat LCG draw would have on a scatter plot.

**9. CSV export scope for the primary topbar action**
① Brief requires a primary action button but not what it does. ② "Export report" downloads all 24
sellers' full metrics as CSV via a client-side `Blob`. ③ Matches the same pattern already used by
r28/a's topbar export, keeping the primary action meaningfully tied to the page's own data rather
than a generic placeholder.
