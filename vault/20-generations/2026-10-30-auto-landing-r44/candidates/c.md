# c — Sell-Through Simulator

Light / near-monochrome / emerald-700 accent / `--font-display-wide` (Archivo
Display). A single continuous "List at $X" slider ($40–$220) drives a
deterministic, closed-form price-elasticity formula that recomputes a
14-day inventory-depletion **time-series projection** — an area/line chart
of units remaining per day — plus a live headline ("Clears 100% of
inventory in N days" / "{pct}% sold through by day 14") that threads
through the product-preview price badge and into the closing CTA's own
sentence.

## Why this is a distinct device (dedup check, done before finalizing)

This round's closest structural neighbor is `r40/b` (dual-handle range
slider → static price-distribution histogram). Mine differs on both axes
named in the brief:

- **Single slider, not dual-handle.** One scalar (list price) drives
  everything; there is no min/max window to set.
- **Time-series projection, not a static distribution.** `r40/b`'s
  histogram bins a fixed, already-existing catalog of 24 listings by price
  — the x-axis is price-bucket, and nothing simulates forward in time. Mine
  has no catalog to bin: `computeDepletionCurve(price)` *simulates forward*
  day-by-day from a fixed starting inventory (120 units) using a fixed
  demand-rate formula, so the x-axis is **day 0–14**, not a price bucket,
  and the y-axis (units remaining) is a quantity that only exists because
  time has elapsed. Changing the slider doesn't refilter a static dataset;
  it changes the *rate* that the forward simulation runs at, which reshapes
  the whole curve (how steep it falls, where/whether it hits zero within
  the horizon). Nothing else in the catalog (bar/radar/beam/bracket/
  ladder/stepper/grid/histogram) outputs a forward depletion projection.
- Also checked against this round's two siblings: a reassigned 4-stage
  stepper (dark/sky) and a search-radius slider → map (different input
  shape, different output vocabulary, no overlap either).

## Contrast math (computed, WCAG relative luminance)

Background `#FAFAFA` (L = 0.9559), ink `#121212` (L = 0.00608) — body text
ink-on-bg is 17.94:1, far past AA, not the constrained case. The one
accent family is emerald, specifically **emerald-700 `#047857`**
(L = 0.14152), picked over the catalog's recent `green-700` (different
hue family entirely — Tailwind `green` and `emerald` are distinct scales)
and over this catalog's other recent emerald picks, computed fresh rather
than copied:

- **White text on the emerald-700 fill** (CTA buttons, the "match%" filled
  badge, the active chart/table toggle pill): white (L=1.0) is the lighter
  of the pair, so `(1.0+0.05)/(0.14152+0.05) =` **5.48:1**. Clears AA
  (4.5:1) at *every* text size, not just large text — so every
  filled-accent surface on this page uses white text, never ink.
- **Dark ink `#121212` text on the emerald-700 fill**: **3.42:1**. Clears
  only the large-text/non-text floor (3:1, for ≥24px or ≥19px-bold), fails
  body AA — so this pairing is deliberately **not used anywhere** on this
  page (I use white-on-fill everywhere instead, documented above, so this
  number is a documented guardrail, not a live pairing).
- **Emerald-700 text directly on the `#FAFAFA` background** (eyebrows,
  "−N%" discount figures, "Verified" badge text/border, the live headline
  sentence under the stat, nav hover): **5.25:1**. Clears body-size AA.
- Muted text floor kept at `zinc-600` (`#52525B`) everywhere on this
  near-white surface — **7.42:1** against `#FAFAFA`, well past AA, so it
  never has to rely on the thinner `zinc-500`-on-near-white margin the DNA
  doc flags (4.63:1, which clears 4.5 by only 0.13). `zinc-500` is used
  deliberately but only for the two **large (≥24px) decorative** elements
  (the "14" ghost number, the oversized quote-mark glyph) where the floor
  is 3:1 and 4.63:1 is comfortable — computed the same way: `zinc-500`
  (`#71717A`, L=0.1674) against `#FAFAFA` (L=0.9559) → `1.0059/0.2174 =
  4.628`.

## Body line-width math (computed, `ch` avoided per the required constant)

Using `chars-per-line = container-width ÷ (0.44 × font-size)`:

- Hero subhead, `text-lg` (18px): container `555px` →
  `555 / (0.44×18) = 555/7.92 ≈ 70.1 chars`.
- Standard body paragraph, `text-base` (16px) (value-split intro,
  testimonial quotes): container `496px` →
  `496 / (0.44×16) = 496/7.04 ≈ 70.5 chars`.
- Small captions, `text-sm` (14px) (closing-CTA note, feature-card body):
  container `430px` / `300px` → `430/6.16 ≈ 69.8 chars` / well under for
  the narrower card copy, which is allowed to run short.
All target ~70, under the 75-char ceiling with the recommended margin
rather than flush against it; constants live as literal `max-w-[…]`
values next to each paragraph rather than as `ch` units.

## Brief gaps

1. **① Where the manipulation device lives (hero vs. value-split) — ②
   put the slider + chart in the Hero itself, not value-split — ③** the
   brief allows either, but product+proof must stay in the Hero fold
   regardless. Splitting the device from the fold would mean a visitor
   scrolls past the live simulator before ever seeing the product it's
   pricing; keeping both in one component also means the "manipulation
   visibly updates the proof" requirement and the "product+proof in the
   hero component itself" requirement are satisfied by the same piece of
   markup, with no risk of the documented failure mode (cards living in a
   *different* component than the hero).
2. **① Inventory size, horizon length, and the elasticity formula's shape
   — ② 120 units, 14-day horizon, `rate(price) = 9 × (120/price)^1.5` — ③**
   nothing in the brief fixes these numbers, only that the formula be
   price-only and deterministic. I chose values that make the full
   $40–$220 slider range cross *both* outcomes a seller actually faces:
   below ≈$124 the lot clears inside 14 days (e.g. $40 → 3 days, $95 →
   10 days), above it the lot does **not** clear inside the horizon (e.g.
   $150 → 19 days needed, so the page shows "sold-through %" instead of a
   day count). Showing both branches live, not just the flattering one, is
   what motivated the dual-phrasing headline (`headlineFor()` in
   `data.ts`) rather than assuming every price clears.
3. **① How to avoid overclaiming "every number moves with the slider" — ②
   the secondary comparable-lot card (Fig. 03) is explicitly labeled
   "Historical result … not driven by the slider above," and the closing
   CTA's supporting line says the seller-stats band above it is historical
   and doesn't move — ③** the brief explicitly warns against exactly this
   overclaim (citing a past candidate that said "every number on this page
   moves" when it didn't). My page has one static social-proof stat band
   and one static comparable-lot card by design (richer proof than a
   single live card alone), so the honest move was to label them as fixed
   rather than silently let a reader assume they're simulator output.
4. **① SVG chart text vs. responsive legibility — ② gridline values and
   day-tick labels are rendered as plain HTML `<span>`s positioned by
   percentage over the chart, not as SVG `<text>` — ③** an SVG `viewBox`
   scales everything inside it, text included, by the same factor as the
   drawing; a `text-[11px]` label baked into a 640-unit-wide viewBox
   renders far below 11 real CSS pixels once the container narrows to a
   ~320px mobile card. Geometry (gridlines, the area/line path, the
   sell-out marker) stays inside the `<svg>`, where scaling is exactly the
   desired behavior; only the numeric labels moved to an HTML overlay
   (`xPct()`/`yPct()` convert the same viewBox coordinates to percentages)
   so their font-size is a real, responsive value at every width. This
   also means the chart's `<svg>` now contains no text at all, so the
   `aria-hidden`-does-not-exempt-contrast caution (page-brief-core §2)
   applies only to the HTML label spans — covered above by the zinc-600 /
   emerald-700 numbers, independent of their `aria-hidden` wrapper.
5. **① A chart-only device would have no accessible data-equivalent by
   default — ② added a "Chart / Table" view toggle (segmented buttons,
   `aria-pressed`) that swaps the SVG+overlay for a real `<caption>` +
   `scope`-annotated `<table>` of all 15 day rows — ③** this doubles as
   the fourth required interaction type (hero slider, scroll reveal,
   product-card "why this matched" pattern reused in spirit via the
   lot-comparison cards, and this view toggle), and gives screen-reader
   users and anyone who wants the exact numbers a real alternative instead
   of relying solely on the `sr-only` chart summary sentence.
6. **① Elasticity formula naming / exact constants are mine, not drawn
   from any existing file — ② `REF_PRICE=120`, `BASE_RATE=9`,
   `ELASTICITY=1.5` in `data.ts` — ③** documented inline in `data.ts`
   rather than only here, so the formula travels with the code.

## Files

- `app/src/app/landing-evolve/r44/c/page.tsx` — default export; owns
  `price` state, derives `curve`/`sellOutDay`/`headline` via `useMemo`,
  assembles header/Hero/ValueSplit/SocialProof/ClosingCTA/footer.
- `app/src/app/landing-evolve/r44/c/data.ts` — the deterministic model
  (`dailyRate`, `computeDepletionCurve`, `sellOutDay`, `headlineFor`),
  formatting helpers, and catalog content (`MAIN_LOT`, `COMP_LOT`,
  `TESTIMONIALS`).
- `app/src/app/landing-evolve/r44/c/tokens.ts` — shared color/typography
  class tokens with the contrast math written next to each one.
- `app/src/app/landing-evolve/r44/c/PriceSlider.tsx` — the native
  `<input type="range">` control (full keyboard support for free) +
  live `<output>`.
- `app/src/app/landing-evolve/r44/c/DepletionChart.tsx` — the chart/table
  device: SVG geometry + percentage-positioned HTML axis labels, the
  chart/table toggle, and the semantic table alternative.
- `app/src/app/landing-evolve/r44/c/Hero.tsx` — the fold: headline,
  simulator panel (slider + stat + chart), and the two product-preview
  cards (live lot + historical comparable), each with match%/grade/
  verified/discount badges in their own row below the photo.
- `app/src/app/landing-evolve/r44/c/ValueSplit.tsx` — the three fixed
  assumptions behind the model, plus the "14" ghost number (zinc-500,
  4.63:1, large-text floor only).
- `app/src/app/landing-evolve/r44/c/SocialProof.tsx` — two testimonials
  (quote-mark glyph, zinc-500, same floor) + a static seller-stats band.
- `app/src/app/landing-evolve/r44/c/ClosingCTA.tsx` — cites
  `headline.cta` (the same derived value as the hero stat) by name, with
  an explicit note that the stats above it are historical.
- `app/src/app/landing-evolve/r44/c/Reveal.tsx` + `useMounted.ts` —
  scroll-reveal wrapper, reduced-motion- and pre-hydration-safe.
