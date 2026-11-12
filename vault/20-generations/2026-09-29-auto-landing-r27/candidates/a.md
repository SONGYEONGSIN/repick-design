# Candidate a — Signal Map

One line: a five-axis radar polygon (condition, authenticity, price fit,
seller trust, demand velocity) drawn from one real listing's raw AI scores,
where five renormalizing weight sliders reshape the whole shape at once — and
the same live weighted score follows the visitor down to the closing CTA.

Route: `app/src/app/landing-evolve/r27/a/` — `page.tsx`, `client.tsx`,
`signal-chart.tsx`, `listing-card.tsx`, `data.ts`, `tokens.ts`.

## 브리프에 없던 것

1. **Accent hue + computed contrast numbers (required).** Assigned violet for
   this round. Used `#6E56CF` (the brief's own worked-example token) as the
   base fill and computed every pairing myself with the WCAG relative-
   luminance formula (Node one-off in `/tmp`, not eyeballed — my numbers land
   a little under the brief's illustrative ones, likely a small
   threshold-constant difference in the linearization step, but they're
   self-consistent and computed for real):
   - `#6E56CF` vs background `#0B0B0F`: **3.64:1** — clears the ≥3:1
     large-text/non-text floor, fails 4.5:1 body AA. Used only for borders,
     chip/button fills, the SVG polygon stroke/fill, and headline-scale text
     (≥24px / ≥19px bold) — e.g. the big "weighted match" numeral is instead
     kept white to avoid relying on that floor at all.
   - White text **on** the `#6E56CF` fill (match-% chip, buttons, CTA pill,
     avatar initials): **5.39:1** — clears full AA, used for every piece of
     small text sitting on an accent-filled surface.
   - Dark ink `#0B0B0F` on the `#6E56CF` fill: **3.64:1** — noted but never
     actually used, since white-on-fill already clears AA and ink-on-fill
     would not for small text.
   - Light tint `#B6A6F0` (small text, icons, focus rings, directly on the
     dark bg): **9.08:1**. Used for the focus-visible outline color, grade/
     verified chip text+icons, and axis-slider icons.
   - Muted `#A1A1AA` vs bg `#0B0B0F`: **7.66:1** — body copy. White vs bg:
     **19.64:1** — headings/primary numerals.
   - Card surface is slightly lighter than the page bg (`#131319`, for
     depth), so I re-checked the same tokens against it rather than assuming
     the page-bg numbers still applied: muted **7.22:1**, tint **8.55:1**,
     white **18.50:1**, accent-as-border/fill (non-text) **3.43:1** — all
     still clear their respective floors.

2. **The renormalizing weight function (required mechanic, not specified in
   detail).** The brief asked for "the renormalizing pattern that won r18"
   applied to a polygon instead of a dial, but not the actual redistribution
   math. I wrote `renormalizeWeights()`: moving one slider to a new value
   scales the other four *proportionally to their current ratios* (not
   split evenly), so a user who has already emphasized two axes over the
   other two keeps that relative shape when they adjust a fifth — it feels
   like "make room" rather than "reset everyone to equal." The last axis in
   iteration order absorbs the rounding remainder so the five always sum to
   exactly 100, never 99 or 101 from repeated rounding drift.

3. **Per-axis display value vs. the headline weighted score are two
   different formulas, deliberately.** The polygon plots
   `raw × (weight / 20)`, clamped to 100 — so emphasizing an axis can push it
   to the 100 ceiling while de-emphasizing others visibly shrinks them,
   which is what makes the *whole shape* redraw rather than one spoke
   stretching in isolation. The headline "weighted match" number and the
   closing-CTA quote instead use the true weighted average,
   `Σ(raw × weight) / 100` — unclamped, since weights always sum to 100 it
   can never exceed the raw range. I kept these separate on purpose: the
   polygon is a visual emphasis device, the headline number is the honest
   arithmetic mean a seller/buyer would want quoted.

4. **Which listing anchors the radar.** The brief said "a real listing's
   underlying per-axis raw scores," not which one. I picked the Sony a7 IV
   card already shown in both the hero and the product-preview grid (same
   `id`, same photo), and added a small thumbnail strip directly above the
   chart naming it, so the shape doesn't feel abstract — a visitor can trace
   it back to a card they already scrolled past.

5. **Range-input styling: skipped `appearance-none` without explicit thumb
   pseudo-elements.** A bare `accent-color` utility on a normally-rendered
   input looked like the simplest path, but `appearance-none` alone (with no
   `::-webkit-slider-thumb` rule) is a known way to make Chrome render an
   invisible, zero-size thumb — the same "compiles fine, paints nothing"
   trap the brief calls out for focus rings. I used `appearance-none` and
   then explicitly styled `::-webkit-slider-thumb`/`::-moz-range-thumb`
   (white fill, accent border, 20px) plus an inline `linear-gradient`
   background computed from the live weight value (percentages can't come
   from a static Tailwind class, so that one piece has to be inline style —
   same reasoning as the r24/b comment about template-literal class names
   not being scannable).

6. **SVG viewBox sized with a label-overflow margin, not just the ring
   radius.** A radar chart's axis labels sit outside the outer ring; sizing
   the `viewBox` to `2 × maxRadius` clips longer labels ("Demand") at the
   edge since SVG clips at its own box by default. Widened the viewBox from
   440 to 520 (radius stays 150) so the longest label has ~60px of run-out
   room past its anchor point before the edge — arbitrary but
   comment-documented margin, not a bug I wanted to catch in review instead.

7. **No mobile hamburger, same call as the Fair Price Matrix round.** Nav
   links are `hidden md:flex`; logo and CTA stay visible at every width. The
   four required interaction types (hero perspective toggle, scroll-
   triggered reveals, the category-filter chips, and the weight sliders)
   already cover the surface I wanted to self-audit for focus/contrast; a
   disclosure menu would add a fifth interactive, off-default-view state to
   audit for no real product-preview benefit at r27's scope.
