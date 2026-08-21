# r13 · candidate b — Price-Trajectory Spec Grid

**One-line concept:** A dense grid of spec-sheet listing cards where each card
draws the item's price falling from market rate to the repick-verified figure as
an inline sparkline; one continuous budget slider re-ranks the grid, recomputes
every card's match score, and repositions the "fits your budget" marker on every
line at once.

- Theme: LIGHT (near-white). Accent: EMERALD only. Display face: MONO
  (`var(--font-display-mono)`) on headlines + numeric display. Body: Pretendard.
- Weights: exactly 3 — 400 (normal) / 600 (semibold) / 800 (extrabold).
- Route: `/landing-evolve/r13/b` — returns 200, title + description exported.

## 브리프에 없던 것

**Budget default & domain**
① The slider's min/max/default were unspecified.
② Domain $40–$320, default $180 — which leaves 5 of 6 listings in-budget and the
   $214 overcoat over-budget at rest.
③ shared-constraints "manipulation = value" bans a panel that shows identical
   numbers at rest; a non-zero difference (5/6 fit, one over) must be seeded.

**Match formula**
① The brief requires match% to recompute from budget + priority but gives no math.
② match = weighted sum of priceScore(budget,discount) + condition + style, with
   a per-priority weight vector (0.6/0.2/0.2) and price weight never below 0.2.
③ Keeping price weight ≥0.2 in every priority guarantees a budget drag always
   moves the number — so one manipulation reliably lights ≥2 evidence surfaces.

**Emerald fill shade for small white text**
① The variety axis names #059669 as the fill under white small text, but white on
   #059669 measures 3.77:1 — below the AA 4.5 the hard gate enforces.
② I use emerald-700 #047857 (5.5:1) for every small white-on-fill element (CTA,
   -%, ranked chips) and keep #059669 only as the non-text slider accent track.
③ shared-constraints §8 (no "just barely passing", AA 4.5 body) is a machine gate
   that kills the candidate; contrast supersedes the shade preference.

**Over-budget card handling**
① The brief says budget "re-filters/re-ranks which cards surface" but not whether
   over-budget items disappear.
② Soft filter: over-budget cards sort to the tail, dim the photo to 80%, and swap
   the marker copy to "$N over your budget" — but keep every proof value readable.
③ Proof must stay exposed on every card at rest; removing cards would hide proof,
   so re-ranking (not deletion) is the honest reading of "re-filters".

**Sort control tie-breaks**
① Sort key options and their ordering rules were left to me.
② Match% / Biggest drop / Lowest price, with in-budget items always ranked before
   over-budget ones inside any sort.
③ Ranking membership ahead of the sort key makes the budget's effect legible as
   grid ORDER — the third evidence surface beside match% and the sparkline marker.

## Line-length math (Pretendard, 0.44em/char; `ch` banned)

chars/line = container-px ÷ (0.44 × font-px)

- Hero lede `LEDE_MAX` — 540px @ 18px (sm+): 540 ÷ (0.44×18) = 540 ÷ 7.92 ≈ **68.2**
  (Below sm the lede is 16px but the ~390px viewport, not the 540 cap, binds it:
  ~350 ÷ 7.04 ≈ 49.7 chars.)
- CTA / closing prose `BODY_MAX` — 480px @ 16px: 480 ÷ (0.44×16) = 480 ÷ 7.04 ≈ **68.2**
- Value-block desc — 14px inside the 3-col grid at the 1200px max container:
  column = (1200 − 64 padding − 80 gaps) ÷ 3 = 352px → 352 ÷ (0.44×14) = 352 ÷ 6.16 ≈ **57.1**

All body prose ≤ 68.2 chars/line, inside the ≤70 target and well under the 75 cap.
