# Candidate A — Parity

One-line concept: a dark, blue-accented inventory-reconciliation console where one dense expected-vs-scanned ledger fills the viewport, with a click-to-pin cross-reference tray and a hover-only ephemeral scan-trail popover as two genuinely separate selection scopes.

## 브리프에 없던 것

**Product/brand identity**
① The brief only specifies a repick-adjacent ops archetype, not a name, product, or copy.
② Invented "Parity" — a warehouse inventory-reconciliation console (repick ops) matching expected vs. scanned unit counts per SKU line; current user "Dana Okafor / Reconciliation Lead"; two workspaces ("Repick Seoul Ops", "Repick Busan Ops").
③ "Parity" reads directly as the domain concept (bringing two sides of a ledger into agreement), which made every subsequent copy decision (nav labels, empty states, banner text) fall out naturally without inventing an unrelated metaphor.

**Theme: dark**
① Brief allows either light or dark, my call.
② Chose dark, refined-product register (zinc-950/900, white/10 borders) rather than light.
③ The catalog's last several dash winners skew light per the brief's own hue-repetition note; a genuine n8n/Coinbase-tier dark instance is a bigger differentiator than another white-canvas page, and a reconciliation/audit console (numbers-heavy, long dwell time) is a natural fit for dark surfaces.

**Accent hue + contrast (hard constraint: avoid emerald/cyan/rose/amber/teal/violet)**
① Brief bans the five most recent winner hues plus violet/amber specifically, and asks for computed contrast to be recorded.
② Chose blue (blue-400/500/600), not used by any of the excluded hues.
③ Computed (WCAG relative-luminance formula, sRGB):
   - `blue-400 #60A5FA` on `zinc-950 #09090B` → **7.82:1** (nav/links/focus ring text use)
   - `blue-400 #60A5FA` on `zinc-900 #18181B` → **6.97:1** (same, elevated cards)
   - `white #FFFFFF` on `blue-600 #2563EB` → **5.17:1** (solid primary button)
   All comfortably clear AA 4.5:1 for normal text. Status semantics deliberately use *different* Tailwind scales than the banned list so no badge reads as a second accent: `green-400` (11.42:1), `red-400` (7.19:1), `orange-400` (8.79:1), all on `zinc-950` — none of these are emerald/rose/amber/teal.

**Dark-mode text floor**
① Brief bans `zinc-500`/`zinc-600` outright on dark backgrounds (floor is `zinc-400`).
② Standardized on exactly three text tiers: `zinc-50` (primary), `zinc-300` (secondary), `zinc-400` (muted/aux) — no tier below the floor anywhere, including placeholder text (`placeholder:text-zinc-400`, not the more conventional `zinc-500`).
③ Computed `zinc-400` on `zinc-950` = 7.76:1 and on `zinc-900` = 6.91:1 — both pass with large margin, so there was no need to reach for a lower (banned) shade anywhere.

**Macro-archetype execution — dense grid + branched selection**
① Brief mandates a fresh skeleton (header strip + one dominant grid) and a *branched*, not uniformly-threaded, selection fan-out, with two named mechanisms (persistent pin vs. ephemeral hover) but no concrete UI spec.
② Built: (a) a Pin icon-button per row — persistent, recomputes only the `PinnedTray` component (a collapsible strip between the header and the grid) with its own Summary/Scan-trail tabs, while the header KPIs and the grid's own row set are explicitly left unfiltered by the pin; (b) a separate hover/focus trigger on the SKU cell that opens an ephemeral `ScanTrailPopover` with zero persisted state, closing completely on mouseleave/blur. When the grid's status/warehouse/search filters hide the currently pinned line, the tray surfaces a literal "out of sync with current filter" banner with a "Clear filters" action.
③ This was the one place the brief was most explicit about a known failure mode ("interchangeable with plain master-detail," penalized 3+ times), so I gave the two interactions visibly different trigger affordances (a toggle icon vs. a hover-only cell) and different effect scopes (one small tray vs. a transient tooltip) rather than sharing one `selectedId`.

**Layout: no max-width cap + 1920px arithmetic**
① Brief requires either flowing full-width or, if capped, arithmetic proving the cap doesn't visibly kick in at 1920px.
② No cap applied — the 12-col content grid flows to fill `<main>` at every breakpoint.
③ Arithmetic for this shell: sidebar `w-64` = 256px; `<main>` uses `px-4 sm:px-6 lg:px-8`, so at ≥1024px (`lg` active) padding is 32px each side. At 1920px: available width = 1920 − 256 − 64 = 1600px, and content uses all of it; gap from content's right edge to the viewport edge = 32px ≤ the 40px ceiling.

**Grid column-width safety net (table-fixed + colgroup %)**
① Brief requires summing real minimum content width per column before assigning percentages, with a `min-w` safety net per column rather than percentage-only allocation.
② Columns/percentages/floors chosen: Pin 4% / `min-w-9` (36px) · SKU 25% / 200px · Exp-Scan 9% / 80px · Variance 8% / 70px · Value impact 10% / 90px · Confidence 13% / 110px · Status 12% / 110px · Reviewer 11% / 100px · Last scan 8% / 70px (sums to 100% and 866px of floors).
③ Verified against the tightest checked breakpoint (1280px): sidebar 256px + 64px main padding + ~34px card/table-wrapper padding/border leaves ≈926px for the table — above the 866px floor sum, so no forced scrollbar appears until the true mobile width (390px), where the same floors intentionally force the single, mobile-only `overflow-x-auto` the brief allows as the correct fix for the cell-overlap case.

**Deterministic dummy data**
① Brief forbids `Math.random`/`Date.now`/`new Date()` and requires subtotals to actually sum to totals.
② Authored 26 explicit reconciliation lines (14 matched / 6 reviewing / 4 missing / 2 overcount) with hand-picked expected/scanned/unit-value triples; net unreconciled value derives as `Σ(scanned − expected) × unitValue` = **−$1,898**, and all three trend series (Today/7D/30D) were built to end on that exact figure so the hero number, the grid, and the chart never disagree. Per-line scan-trail events use a fixed 20/30/50 split of the `scanned` total (not random) so the three "recent/mid/old" event counts always sum back to the row's own scanned quantity.
③ This was the only way to satisfy "subtotals sum to totals" for a page whose hero number, chart, and grid all claim to describe the same underlying ledger — computing it by hand (verified with a one-off Node script during generation, not shipped) rather than eyeballing kept the three surfaces consistent.

**Typography**
① Brief allows at most one optional display face, "commonly none."
② Used none — Pretendard/`--font-sans` throughout, exactly three weights (`font-normal` 400 / `font-medium` 500 / `font-semibold` 600), including on `<th>` elements that would otherwise inherit the browser's default bold.
③ A reconciliation console is closer to a finance/ops tool than a marketing surface; a display face would have worked against the "restrained, not expressive" instruction, and skipping it also diversifies the catalog per the brief's own note that `wide` was already used twice in the last five rounds.
