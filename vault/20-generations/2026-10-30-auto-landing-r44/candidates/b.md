# b — Nearby Sellers

Dark / indigo / grotesk. A hand-built radial distance map: twelve fixed
sellers sit at permanent (distance, bearing) pairs around a center "you"
marker, and a 1–25mi radius slider (plus quick-select presets) re-reads that
same fixed set against a moving threshold — pins light up solid, others dim,
nothing is re-fetched or swapped. Live "sellers in range" / "nearest seller"
stats sit beside the map, repeat in a value-3-split, and resolve the closing
CTA headline by name. This is a geographic/distance device, deliberately
distinct from the catalog's existing 5-axis criteria-radar polygon (that one
scores *attributes* on independent axes; this one places *fixed points in
physical space* and classifies them by a single scalar threshold) and from
`v24`'s quadrant recommender (two sliders *become* a marker's x/y and classify
it against 4 reference points — here the marker, the map, and all twelve
points are fixed; only the threshold moves).

## 브리프에 없던 것 (Brief gaps)

1. **Accent hex + contrast calc (required).** Chose indigo-600, one step
   darker than the repo's default `#6E56CF` violet, specifically because the
   default's own documented white-text number (5.39:1) and this family's
   natural lighter shades (indigo-500 `#6366F1`) sit too close to the AA
   small-text floor to have real margin:
   - Fill background `#4F46E5` (indigo-600): **white text = 6.29:1** (clears
     AA 4.5:1 for small text with real headroom, not a razor edge) vs.
     **`#0B0B0F` dark-ink text = 3.13:1** (clears the 3:1 large-text/non-text
     floor only, fails small-text AA). Decision, following the repo's own
     documented rule for fill-background text: every small/body-size label on
     an accent fill (badge text, "mi" unit suffix, button labels) is white;
     dark ink on fill is used in exactly one place — the "Nearest seller"
     stat tile's big number, `text-3xl font-extrabold` (30px ≥ the 24px large
     text threshold) — and nowhere smaller.
   - Bright tint for small text/icons/focus rings *directly on the dark bg*
     (not on the fill) `#A5B4FC` (indigo-300) against `#0B0B0F`:
     **9.86:1** — safe with large margin, used for the focus ring, active
     preset state text, tooltip "within radius" label, and accent spans in
     body copy.
   - Checked explicitly per `page-brief-core.md` §2's tinted-surface warning:
     the coverage-wash panel composites the accent fill at 15% alpha over the
     bg (`rgb(79,70,229)` × 0.15 + `rgb(11,11,15)` × 0.85 ≈ `rgb(21,19,45)`,
     luminance ≈0.0082). `zinc-400` muted text against that composited
     background still computes to **≈6.98:1** — still clears AA — so the
     existing `zinc-400` floor convention did not need to be raised for this
     specific tint level (unlike the catalog's `indigo-50`-on-light case the
     principle doc warns about, which was a much lighter surface).
   - Decorative ghost numeral (the live radius value, oversized behind the
     headline, `aria-hidden`): used `zinc-500` (`#71717A`), not the catalog's
     usual `zinc-600` fallback — `zinc-600` measures **2.54:1** on `#0B0B0F`
     (confirmed, matches the principle doc's own flagged failure) and fails
     the 3:1 large-text floor; `zinc-500` measures **4.07:1** and clears it.
     Per the "crafted under contrast, not darkened over it" guidance, I did
     not shrink the numeral below large-text size to justify a darker color —
     it stays huge (72–150px responsive) and uses the lighter shade instead.
2. **Body line-width math (computed, `ch` avoided).** Pretendard mixed-glyph
   average advance `0.44em`; `chars-per-line = container-width / (0.44 × font-size)`.
   Hero subhead and most body paragraphs: 16px type in a `480px` container →
   `480 / (0.44 × 16) = 480 / 7.04 ≈ 68.2 chars` — under the ~70 target with
   headroom below the 75-char ceiling (not flush against either bound).
   Card/testimonial body copy at 14px stays inside the same `480px`/narrower
   containers, which only shortens lines further, so no separate calc was
   needed for those.
3. **Display face.** `--font-display-grotesk` (Space Grotesk Display),
   applied via inline `fontFamily` only to the two large Latin headline
   elements (hero `<h1>`, closing-CTA `<h2>`) — never to body copy, captions,
   or UI labels, which stay on the repo's global Pretendard `font-sans`. Not
   used in the last 3 landing rounds per the assignment; picked over `-wide`
   and `-mono` because the device's own numerals (radius, stat counts) are
   already carrying a geometric/technical feel via `tabular-nums`, so the
   headline face reads cleanly rather than compounding a "data terminal"
   impression two faces would create together.
4. **Where the interactive device lives.** Put the radius slider + radar map
   inside the Hero component itself (not the value-3-split) because the
   brief's strongest, most-reproduced failure mode is proof/preview cards
   living in a *different* component than the hero — merging the map, its
   live stats, and all three listing-preview cards (each with all four
   badges: match%, grade, verified, discount) into one component makes the
   "hero component, not hero-then-next-section" rule structurally
   unambiguous, at the cost of a visually dense hero. The value-3-split
   below is editorial reinforcement of the device's premise (fixed set /
   computed distance / state that survives scroll) rather than a second
   interactive surface, since the brief only requires manipulation-updates-
   proof to hold *somewhere*, and it already holds in the hero.
5. **Fixed seller dataset authored by hand, tied to real listings.** Twelve
   (distance, bearing) pairs span 1.2–23.8mi so the default radius (8mi, a
   non-trivial mid-pack value) already shows a mix of in-range/out-of-range
   pins on load. All three hero listing cards are anchored to specific
   sellers in that fixed set (`sellerId`) so "Finch & Co. · 1.2 mi away"
   under a product card and the map's nearest-seller pin are the same fact
   stated twice, not two independently-invented numbers.
6. **Fourth interaction type.** Brief requires ≥4: (1) the radius slider
   itself, (2) pin hover/focus/tap → tooltip (a second, independent way to
   query the same fixed data, with its own `role="status"` region and full
   `aria-label` per pin), (3) quick radius-preset chips (a discrete
   alternative to dragging), (4) scroll-triggered `whileInView` reveals
   (value-split cards, testimonials, closing CTA), all gated through a local
   `Reveal` wrapper that checks `useReducedMotion` and skips the `initial`
   state entirely when reduced motion is requested, so no entrance
   `opacity:0` is ever left unresolved.
7. **Product photos.** Reused three fixed, already-cataloged Unsplash ids
   (`1495121605193-b116b5b09a56`, `1524805444758-089113d48a6d`,
   `1441986300917-64674bd600d8`) that other routes in this repo already
   reference, rather than inventing unvetted ids, per the fixed-URL rule.
   Badges sit in their own row below each photo frame, never overlaid on it.
8. **Dedup check against this round's siblings and the broader catalog.**
   Confirmed via `app/src/lib/works.ts` (read-only) that no existing entry
   uses a radius/mileage/geographic-distance device; the closest prior art
   is `v24`'s 2D quadrant recommender (continuous coordinates, not a fixed
   point set) and the older 5-axis criteria-radar polygon (attribute scoring,
   not physical distance) — neither overlaps this candidate's mechanism.
   This round's other two candidates are a verification stepper and a
   price/inventory-depletion simulation, also non-overlapping.

## Files

- `app/src/app/landing-evolve/r44/b/page.tsx` — default export. Owns
  `radiusMi` (default `8`) and `activeSellerId` state; header, Hero (device +
  stats + listing cards), value-3-split, social proof, closing CTA.
- `app/src/app/landing-evolve/r44/b/radar-map.tsx` — the map device: coverage
  wash, center marker, twelve pin buttons, hover/focus/tap tooltip.
- `app/src/app/landing-evolve/r44/b/data.ts` — fixed `SELLERS` and `LISTINGS`
  datasets, `pinPosition()`, `coverageDiameterPct()`, `statsForRadius()`.
- `app/src/app/landing-evolve/r44/b/reveal.tsx` — scroll-reveal wrapper,
  reduced-motion safe.
