# Candidate A — "Inventory Split Allocator"

A dark, lime-accented editorial landing page whose centerpiece is a constrained-sum,
4-category inventory-split allocator: dragging one category's slider proportionally
compresses the other three to keep the total at exactly 100%, and that single
redistribution function drives a live stacked-bar breakdown, a recomputed
"best category to list in right now" recommendation, a per-category and aggregate
projected payout, a matching highlight in the Product Preview section above it, and
the closing CTA's headline number — all from one shared `computeSplitModel()` call.

## Not specified by the brief

- **Category set.** The brief said "pick your own categories appropriate to a
  secondhand marketplace." Decided: Electronics / Apparel / Collectibles / Home &
  Living — four broad, visually distinct resale verticals (camera/sneaker/watch/decor
  imagery) with deliberately different payout-multiplier and demand-index constants,
  so the redistribution mechanism visibly changes the *outcome*, not just the bar
  widths. Picked for recognizability over platforms like eBay/Mercari/ThredUp, not
  from any repo precedent.

- **Redistribution algorithm.** The brief mandated "a real deterministic function,"
  not the specific math. Decided: dragging slider *i* to value *v* rescales the other
  three proportionally to their own prior relative share of the remaining `100 − v`
  (the standard "budget" mental model — raise one envelope, the others compress in
  proportion to what they already held). Rounding uses the largest-remainder method
  so the four always sum to exactly 100 with no drift, and a floor-of-1 safety pass
  borrows back from the largest category if rounding would otherwise zero one out.
  Arbitrary, but chosen because it's the simplest mapping that is still provably
  sum-preserving and reversible-feeling under drag.

- **Payout economics model.** Not specified how "projected payout per category"
  should be computed. Decided: `payout_i = tierEstimate × (share_i/100) ×
  payoutMultiplier_i` (a fixed resale-recovery-rate constant per category), and the
  "best to list now" ranking score is `(share_i/100) × payoutMultiplier_i ×
  demandIndex_i` — a second fixed per-category constant for current buyer demand.
  Both are real arithmetic over the live share, not a per-combination lookup table,
  so every manipulated slider changes the *computation*, not a skinned number.

- **Tie-guard for the dominant/weakest labels.** The brief explicitly warned that a
  naive `reduce` finds the same element for both "most" and "least" at a tie (both
  default to the first element when nothing is strictly greater/less). Fixed by
  comparing `maxScore − minScore` against an epsilon and, when balanced, replacing
  *both* labels with one neutral "evenly balanced, no category leads yet" message —
  rather than trying to show two names at a genuine tie. This guard is threaded
  through every surface that would otherwise name a "winner": the stacked bar's
  accent segment, the Fig. 02 "Recommended" checkmark, the Product Preview section's
  "Trending" ribbon, and the closing CTA's "with X leading the return" clause all go
  through a shared `highlightIndex` (`null` at a tie) instead of raw
  `model.dominantIndex`, so no two sections can contradict each other at the tie
  point.

- **Secondary selector (inventory tier).** Not required, but added a 3-way
  "Starter / Active / Power seller" segmented control (default: Active, $3,600 — a
  non-trivial default) that scales the *same* `tierEstimate` input into
  `computeSplitModel()`. It never resets the slider shares, so there's no reset-state
  edge case to guard, but it does prove two independently-driven live controls feed
  one shared computation, per the causal-consistency rule. Borrowed from the generic
  SaaS pricing-calculator convention (segmented tier chips above a live estimate).

- **Accent hue + contrast arithmetic (the assigned part I had to compute myself).**
  Picked **`#A3E635`** (lime-400-ish), hue ≈ 90°, clearly in the lime family and
  distinct from the catalog's over-used violet/blue/amber/teal/emerald. Computed via
  relative-luminance → contrast-ratio (WCAG formula):
  - `#A3E635` vs white `#FFFFFF` → **1.51 : 1** (fails even the large-text 3:1 floor —
    never use the accent as text or a fill *text color* on a white/light surface).
  - `#A3E635` vs the dark background `#0B0B0F` → **13.02 : 1** (clears body-text
    4.5:1 with huge margin — safe for fills, borders, bars, AND small text/icons
    directly on the dark background, not just large text).
  - **Inversion of the brief's generic fill-text rule:** because lime is a *light*
    hue, dark ink (`#0B0B0F`) on an accent fill measures the same **13.02 : 1**
    (WCAG contrast is symmetric in the two colors), while *white* text on the same
    accent fill measures only **1.51 : 1** and fails outright. So every lime-filled
    chip/button/ribbon in this build uses `#0B0B0F` ink text, at every size — the
    opposite of the brief's "white on fill" default, which assumes a darker/more
    saturated accent than lime. This is exactly why the brief says to do the
    arithmetic per-hue rather than copy the generic rule.
  - Secondary tint `#D4F77A` used for small accent icons/eyebrow text — not strictly
    required for AA (the base token already clears 4.5:1 on this background) but
    kept as a softer accent so small UI chrome doesn't read as neon-loud at tiny
    sizes, consistent with "accent in tiny quantity."
  - Muted secondary text `#A6A6B0` vs `#0B0B0F` → **8.14 : 1** (body-text safe, well
    above the dark-mode `-400` floor equivalent).
  - Ghost-number gray `#63636F` vs `#0B0B0F` → **3.32 : 1** — deliberately tuned to
    clear the large-text (≥24px) 3:1 floor by a small margin. The ghost numbers
    ("01"–"05") are sized with `clamp(2.25rem, 6vw, 4.5rem)` so they never render
    below 36px (the clamp floor dominates at narrow widths), keeping them always in
    the "large text" bracket this color was tuned for. Weight is 500 (not 800, not a
    4th weight) and tracking is the stat-tier `0.12em`, both chosen specifically so
    the ghost numerals stay visually subordinate to the 800-weight headlines next to
    them rather than competing, per the brief's back-off guidance.

- **Body-measure math (no `ch`, computed in px from the 0.44em constant).** Using
  `chars = container_px / (0.44 × font_px)`:
  - Hero subhead / Product-Preview intro / Closing-CTA paragraph: 16px font,
    `max-width: 500px` → `500 / (0.44 × 16) = 500 / 7.04 ≈ 71` chars/line.
  - Allocator intro paragraph: 17px font, `max-width: 525px` →
    `525 / (0.44 × 17) = 525 / 7.48 ≈ 70.2` chars/line.
  - Testimonial blockquote: 15px font, `max-width: 460px` →
    `460 / (0.44 × 15) = 460 / 6.6 ≈ 69.7` chars/line (an earlier 500px draft came to
    ≈75.8 chars — over the brief's ceiling — so the width was tightened).
  All three land right at the "~70, not flush against 75" target instead of a
  habitual fixed value. Narrower containers (card-grid copy, detail-panel text
  inside the allocator's output cards) were left unconstrained by an explicit
  max-width because their parent grid column is already narrower than any of the
  above values, so the column itself — not a magic number — is the limiting factor.

- **Hero CTA / closing CTA destination.** Since this is a standalone design
  candidate with no real `/sell` route, the hero's single primary CTA and the
  closing "Adjust the split" button scroll to the allocator section (a real,
  functional in-page action) rather than linking to a non-existent route. The
  closing "Start listing on repick" button is a styled, fully focusable button
  making the expected visual claim without a fabricated destination.

- **Product imagery.** Hand-picked fixed `images.unsplash.com/photo-<id>` URLs (not
  a random source endpoint): headphones (`photo-1572635196237-14b3f281503f`),
  sneakers (`photo-1549298916-b41d501d3772`), camera
  (`photo-1516035069371-29a1b244cc32`), denim jacket
  (`photo-1551028719-00167b16eac5`), vintage watch
  (`photo-1524592094714-0f0654e20314`), ceramic decor
  (`photo-1555041469-a586c61ea9bc`), and four portrait photos for testimonials. Every
  image container reserves a fixed `aspect-square`/`aspect-[4/3]`/`1:1` box with a
  `bg-white/5` or `bg-white/10` fallback, so a failed load never collapses layout or
  lets alt text collide with badges (badges are never overlaid on photos in this
  build — they sit in a row beneath the image).

- **Stacked-bar coloring.** Rather than give each of the 4 categories its own hue
  (which would read as a colorful chart and violate "near-monochrome, accent in tiny
  quantity"), all segments render in a neutral `rgba(255,255,255,0.22)` gray except
  the current dominant category's segment, which gets the single lime accent fill.
  Color reinforces the recommendation but never conveys it alone — the same
  category name is always spelled out in text in the recommendation card and the
  Fig. 02 legend.

## Font weights used (exactly 3, as assigned)

`font-normal` (400, body/detail text), `font-medium` (500, labels/eyebrows/ghost
numbers/captions), `font-extrabold` (800, all headings and numeric emphasis). No
`font-semibold`/`font-bold`/`font-black` anywhere; every heading tag explicitly
carries `font-extrabold` so Tailwind's preflight `font-weight: inherit` on
`h1`–`h6` never lets a stray browser-bold slip through.
