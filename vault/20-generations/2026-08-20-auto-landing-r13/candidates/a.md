# r13 / a — Radar Match Profiles

**One-line concept:** Each pre-owned listing is a 5-axis radar polygon; the buyer draws their own ideal polygon with criteria chips + a demand weight, and every match score is the literal overlap area of the two shapes — so toggling one chip redraws every radar, recomputes every match%, and re-sorts the stack at once.

- **Theme:** DARK (`#0B0B0F`). **Accent:** AMBER only, near-monochrome. **Display face:** GROTESK (`var(--font-display-grotesk)`) on large Latin headings only; body = Pretendard. **Weights:** exactly 3 — 400 / 600 / 800.
- **Output-visualization device (new):** two overlaid 5-axis polygons per card, drawn as inline deterministic SVG (coords rounded to 2 dp), match% = intersection area ÷ ideal area.
- **Input vocabulary:** criteria-priority chips (5 toggles) + a Lenient/Balanced/Strict segmented weight. One manipulation → 3 evidence surfaces (polygon redraw + match% + re-sort). Proof (match%, condition grade, verified badge, before→after discount) is always visible on each card at rest.

## 브리프에 없던 것

**1. Exact meaning of "overlap = match%"**
① The brief said the overlap is the match%, but not how to turn two polygons into one number.
② Chose intersection-area ÷ ideal-area, summed over the five 72° sectors as `0.5·min(rₖ,ideal ₖ)·min(rₙ,idealₙ)·sin72`.
③ Both polygons are star-shaped from the centre, so a per-sector min is the exact intersection there — honest arithmetic the visitor could re-derive, not a fudge.

**2. Amber fill that carries white text**
① The variant hint named `#d97706` (amber-600) as the white-text fill, but that is only 3.18:1 with white — below the AA 4.5 hard gate.
② Chose amber-700 `#b45309` (5.02:1) for every text-bearing fill (CTA, chips, badges); kept `#d97706` for non-text polygon paint/borders and `#fbbf24` for small accent text.
③ Same split r12/c used (cyan-700 over cyan-600) — a dead candidate from a contrast fail is worse than deviating one step on the hint.

**3. Value of an axis the buyer leaves OFF**
① An unselected chip still needs some ideal radius or the polygon collapses.
② Chose a low baseline of 30 (out of 100) — "I'll take anything here."
③ Makes an unselected axis nearly always satisfied, so match% reflects only what the buyer actually asked for; arbitrary but tuned so the three cards re-order across manipulations.

**4. Demand-level semantics**
① The brief asked for a weight control but not what the levels mean numerically.
② Chose Lenient/Balanced/Strict = demand 60/80/100 on selected axes.
③ Gives a monotonic "harder bar → lower scores → wider spread" that reads instantly and reorders the stack (Strict pulls boots clear of the rest); convention borrowed from difficulty selectors.

**5. Listing count + axis values**
① Variant fixed the hero at 3 cards but not their profiles.
② Chose boots/tote/jacket with hand-tuned 5-axis values so the default order (boots 96 > tote 93 > jacket 81) visibly reshuffles: enabling Rarity lifts the jacket to #1, enabling Fit lifts the tote, Strict spreads them.
③ A re-sort that never changes order proves nothing; the numbers were solved in a scratch script so each manipulation moves the ranking.

**6. Closing-CTA layout (told to avoid a generic centered band)**
① Needed a distinct closing layout.
② Chose an asymmetric bordered panel: left headline + single action, right a "your starting profile" readout (axes weighed / demand / top match 96%).
③ Ends the page on the same left-aligned, evidence-forward footing it opened on, echoing the editorial hero rather than a centered pitch card.

## Line-length math (Pretendard, 0.44em/glyph → chars = containerPx ÷ (0.44 × fontPx))

| Prose block | container px | font px | chars/line |
|---|---|---|---|
| Hero subhead | 440 | 16 | 440 ÷ 7.04 = **62.5** |
| Hero "Reading the chart" | 420 | 16 | 420 ÷ 7.04 = **59.7** |
| Value part bodies | 460 | 15.2 (0.95rem) | 460 ÷ 6.688 = **68.8** |
| Testimonial quotes | 460 | 16 | 460 ÷ 7.04 = **65.3** |
| Closing subhead | 440 | 16 | 440 ÷ 7.04 = **62.5** |

Max = 68.8 ch ≤ 70 ✓ (all body prose containers capped with explicit `max-w-[…]` so the figure above is the widest each line can reach).
