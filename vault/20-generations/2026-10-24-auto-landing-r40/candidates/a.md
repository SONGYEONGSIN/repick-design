# Candidate a — "Rank Shuffle"

## Concept

A light, near-monochrome landing page for Repick built around one core
mechanic: the visitor drags four priority chips — Price, Condition, Speed,
Trust — into their own order of importance, and that ordinal ranking (not a
continuous slider) is the single input that drives two synchronized
outputs: a reshaping radar chart and a live re-sorting 4-item match list.
Both outputs are computed from the exact same rank→weight function, so the
polygon and the list are always telling the same story from two angles. The
closing CTA restates whichever item currently sits #1 and its live
composite score, so the page never ends on dead, pre-written copy.

The hero keeps the required product-proof cards (match %, condition grade,
verified-seller badge, discount) inside the hero component itself, directly
under the headline/subhead/CTA, so they render above the fold. The value
section ties three cards back to the live weighting (trust/condition/price
vs. speed shares, read straight off current state), and social proof is
three short, concrete testimonials.

## Accent usage (rose)

- `rose-700` (#be123c): small accent text/icons on white (eyebrows, focus
  ring), and as the filled background for buttons and the "match %" chip
  (white text on it, 6.29:1).
- `rose-600` (#e11d48): the radar polygon's stroke/fill and small decorative
  icon strokes (ShieldCheck/BadgeCheck) — graphic use, not small text.
- No large background fields of rose anywhere; it stays confined to
  buttons, one chip, the chart, icons, and focus rings — a small fraction
  of total visual weight on an otherwise white/zinc page.
- `zinc-600` is the floor for every secondary/muted text string, including
  inside the tinted `zinc-50` closing-CTA panel.

## Character-width math

Pretendard's measured average glyph advance is 0.44em, not 1ch.
At the 16px body size used for every paragraph on this page:
`0.44 * 16 = 7.04px` per character.
Target band 68–70 characters → `68 * 7.04 ≈ 479px`, `70 * 7.04 ≈ 493px`.
`max-w-[480px]` (the `PROSE_WIDTH` token in `theme.ts`) sits inside that
band with real headroom under the 75-char hard ceiling
(`75 * 7.04 = 528px`), and is the single paragraph-width value used
everywhere instead of any `ch`-based width.

## Interactions (4+)

1. Hero primary CTA (`See your top match`) — anchors into the device.
2. Scroll-triggered `Reveal` entrances on the value, social-proof, and
   closing-CTA sections (not on the hero or the device itself, which are
   above the fold / interactive already — kept to the "1–2 core
   animations per view" budget).
3. Rank Shuffle drag-to-reorder: real pointer-drag (via `elementFromPoint`
   + `pointermove`/`pointerup` on `window`, works for mouse, pen and touch
   alike) on a grip handle, **plus** a fully keyboard-operable up/down
   button pair per chip (so the mechanic is never drag-only).
4. Live re-sort: the radar polygon (framer-motion `layout` FLIP) and the
   4-item match list (same `layout` technique, keyed by stable item id)
   both animate into their new shape/order the instant the rank changes.
5. Closing CTA line is computed from the live `scored[0]` item, not a
   literal — reordering the chips changes the CTA's headline text.

## Weight formula

`weightForRank(rank) = [1, 0.7, 0.45, 0.25][rank - 1]` — rank 1 (top of the
list) keeps full weight; each step down decays on a fixed, hand-picked
curve. This one function derives both the radar axis lengths and each
product's composite score (`Σ(score_i * weight_i) / Σ(weight_i)`), so there
is only one place weight is ever computed.

## 브리프에 없던 것 (Brief gaps)

1. **Decision needed**: whether to implement real pointer-drag, a
   keyboard-only fallback, or both, given no `@dnd-kit` in `node_modules`.
   **Decided**: both — hand-rolled `elementFromPoint`-based pointer drag on
   a grip handle, plus independent up/down buttons on every chip.
   **Why**: the brief explicitly allows a button fallback only "if real
   pointer-drag isn't feasible," and pointer drag *was* feasible in budget
   without a library, so skipping it would have under-delivered; the
   buttons stay anyway to guarantee keyboard/screen-reader operability and
   satisfy `target-size`.

2. **Decision needed**: the exact rank→weight decay curve (brief gave an
   example but said "pick your own").
   **Decided**: `1 / 0.7 / 0.45 / 0.25`.
   **Why**: steep enough that swapping two adjacent ranks visibly reshapes
   the radar polygon and reorders at least one list item on most swaps
   (verified by hand against the four fixed sample items), but not so
   steep that rank 4 collapses to near-zero and reads as "turned off."

3. **Decision needed**: how to keep radar axis label text (e.g.
   "Condition") from clipping against the SVG's own edges inside a small
   220×220px chart.
   **Decided**: capped the chart radius at 64 of 110 user units and placed
   labels at 1.15× that radius with a 10px font, worked out by hand so the
   widest label's half-width still lands inside the viewBox at every axis
   angle.
   **Why**: the brief only specifies rounding trig coordinates to 2
   decimals, not a radius/label-margin budget — this was arithmetic I had
   to do myself rather than eyeball, since this project's own history flags
   "eyeballed" sizing as a repeat failure mode.

4. **Decision needed**: whether the Hero's two product-proof cards should
   reuse the same 4 items as the Rank Shuffle device or be independent.
   **Decided**: independent, fixed items (sneakers, jacket) with their own
   static match/condition/discount data.
   **Why**: the brief's hero requirement and the device requirement are
   separately scoped (hero proof is about above-the-fold completeness;
   the device's 4 items are a distinct dataset for the ranking mechanic) —
   conflating them would make the hero cards silently change state before
   a visitor ever reaches the device, which seemed more confusing than
   clarifying.

5. **Decision needed**: which Unsplash photo IDs to use for the two hero
   cards.
   **Decided**: reused `1549298916-b41d501d3772` (sneakers) and
   `1441986300917-64674bd600d8` (jacket) — IDs already present elsewhere in
   this repo's `landing-evolve` history.
   **Why**: the brief requires a "human-picked, fixed photo ID," and
   reusing IDs this repo has already rendered successfully in past rounds
   is lower-risk than hand-picking untested new ones.
