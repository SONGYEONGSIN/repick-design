# Candidate c — Fair-Price Slope

One line: a paired-vertical-axis slope chart — "Seller's asking price" on the
left, "repick's verified fair price" on the right — where each of seven real
listings gets one straight connecting line, and a three-state pricing-scenario
toggle (Balanced / Authenticity-first / Fast-sale) genuinely recomputes every
line's slope from the same underlying per-item data, all the way down to the
closing CTA's live number.

Route: `app/src/app/landing-evolve/r27/c/` — `page.tsx`, `client.tsx`,
`slope-chart.tsx`, `listing-card.tsx`, `data.ts`, `tokens.ts` (`data.ts` and
`tokens.ts` were already finished by the agent that started this candidate;
I built `page.tsx`, `client.tsx`, `slope-chart.tsx` and `listing-card.tsx` on
top of them, unchanged).

## 브리프에 없던 것

1. **Accent hue + computed contrast numbers (required).** Assigned a
   desaturated, olive-leaning lime for this round (`a` got violet, `b` got
   green). The previous agent had already picked the hex values and written
   the WCAG numbers as inline comments in `tokens.ts` — I did not trust those
   comments blindly. I re-ran the real relative-luminance formula myself in a
   Node one-off (`/tmp/.../contrast.mjs`, not eyeballed) and they matched
   exactly:
   - `#8BA83A` (ACCENT_FILL) vs bg `#0B0B0F`: **7.26:1** — clears AA at every
     text size, used for fills/borders/line strokes and large text.
   - `#C9E08A` (ACCENT_TINT) vs bg: **13.58:1** — small text, icons, the
     focus-visible ring.
   - White text on the `#8BA83A` fill: **2.71:1** — fails even the 3:1
     large-text floor, never used.
   - Dark ink `#0B0B0F` on the `#8BA83A` fill: **7.26:1** — the only text
     color used on an accent-filled surface (match-% badges, active toggle
     pills, the primary CTA).
   - `#A1A1AA` (MUTED) vs bg: **7.66:1** — body copy and the chart's
     "asking price" / down-corrected line color.
   - White vs bg: **19.64:1**.
   - I additionally re-verified every one of those pairings against the two
     other surfaces actually used on this route that the original comments
     didn't cover — card background `#131319` and section panel `#0E0E13`:
     ACCENT_TINT **12.79:1** / **13.30:1**, MUTED **7.22:1** / **7.51:1**,
     white **18.50:1** / (not separately needed) — all still clear AA
     comfortably, so badge and card text is safe on every background it
     actually sits on, not just the page bg.

2. **The paired-axis geometry, decision + why.** The brief asked for two
   vertical axes connected by slope lines where the angle *is* the proof, but
   left the actual layout math open. Naive approach: a fixed-pixel SVG
   viewBox, which shrinks all label text proportionally at narrow viewports —
   exactly the 390px illegibility trap the brief warns about. I chose a
   hybrid instead: the SVG draws *only* geometry (axis lines, dots, the
   connecting line) and is `aria-hidden`; a separate absolutely-positioned
   HTML grid layer (one row per item, `gridTemplateRows: repeat(N, 1fr)`)
   carries all the real text (item name, asking $, fair $, signed delta,
   Trending icon) in normal rem-sized fonts that never scale with the SVG.
   Both layers share one parent whose `aspect-ratio` is pinned to a
   deliberately narrow, tall design ratio (340:644 for 7 rows), so the two
   layers always stay in lockstep regardless of the viewport's actual
   rendered width, and the HTML text never has to shrink.

3. **Collision-proof slope math, decision + why.** `data.ts` already fixed
   each item's row by asking-price rank (never reshuffled by the toggle) and
   documented that only the row's *internal offset* should move. I picked
   the actual offset formula: `offset = -(clamp(delta, ±80%) / 80%) × (ROW_H/2
   - 18)`. The `- 18` pad guarantees a line can never swing far enough to
   cross into a neighboring row's band even at the dataset's most extreme
   real delta (fast-sale pricing's PS5 console, +71.4%), so the chart never
   needs per-scenario re-layout — it's provably collision-free by
   construction rather than by testing.

4. **Text/table alternative to the chart, decision + why.** Rather than add a
   second, redundant `<table>` purely to satisfy the a11y requirement, I gave
   every chart row a `role="group"` wrapper whose `aria-label` is a full
   sentence ("Sony A7 IV. Seller asking $1,750. repick verified fair price
   $1,715, down 2.0 percent from asking.") built from the same `money()` /
   `SlopeRow` data the chart plots, and marked the visual label spans inside
   it `aria-hidden` so screen readers get one clean sentence per row instead
   of fragments. The visible HTML label layer (point 2 above) is real text
   regardless, so this was the smaller, non-duplicated way to satisfy "never
   color alone" + "text/table alternative" at once, instead of stacking a
   `<details><table>` under an already-accessible chart.

5. **Closing-CTA copy has to survive a negative average, decision + why.** I
   computed the three scenarios' real `avgSignedDeltaPct` before writing any
   CTA copy (Balanced +0.6%, Authenticity-first **−8.5%**, Fast-sale +22.2%)
   and found the brief's own worked example — "average seller proceeds go up
   X%" — breaks for the middle scenario, where the average genuinely moves
   *down* (Authenticity-first penalizes low-authenticity items hard enough
   that corrections skew negative on average, which is honest: it's the
   cautious-buyer read, not the seller-maximizing one). So the CTA verb is
   derived, not hard-coded: `avgSigned > 0.5 ? "go up" : avgSigned < -0.5 ?
   "come down" : "stay flat"`, with the same 0.5%-band threshold `data.ts`
   already uses for per-row direction. This means the CTA sentence changes
   its own grammar, not just its number, across toggle states — which is a
   stronger proof of genuine recomputation than a static-verb template with
   a plugged-in number would have been.

6. **Hero perspective toggle is a second, deliberately separate mechanism
   from the scenario toggle.** The brief's four required interaction types
   list "hero interaction" and "the before/after toggle" as distinct items.
   I used the hero's Buying/Selling pill (2 states, swaps headline/subhead/
   CTA copy only) purely for that slot, and kept the scenario toggle (3
   states, actually recomputes the chart) doing the one job the brief cares
   about most. Splitting them avoids overloading one control with two
   different kinds of state-swap and keeps the "manipulation survives to the
   CTA" chain traceable to a single toggle.

7. **No `<table>`, so no accidental fourth font-weight.** I originally
   considered a literal `<table>` for the chart's accessible alternative;
   browsers apply a default `font-weight: bold` to `<th>` that Tailwind's
   utility classes don't reliably override without an explicit reset, which
   would have been an easy way to smuggle in a fourth rendered weight beyond
   the intended three (400/600/800). Choosing the `role="group"` + real HTML
   label pattern (point 4) sidesteps that risk entirely rather than requiring
   me to catch it in review.
