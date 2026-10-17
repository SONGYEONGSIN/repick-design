# Candidate b — "The Duel"

A dark, near-monochrome landing page for repick built around a head-to-head
"Duel" comparator: two dropdowns (Challenger A / Challenger B) pick any two
of four resale listings, and four weighted axis bars (price value, condition
grade, seller trust, delivery speed) redraw live as opposing tug-of-war fills
anchored at a center line, plus an aggregate verdict score — the device lives
directly inside the hero's own grid alongside the 3–4 product-preview cards
(two of which double as the default duel contenders), and the same selected
pair's winner/loser names and scores thread through to the mid-page "How
scoring works" summary sentence and finally into the closing CTA button's own
label ("Browse {winner} on Repick"), so the manipulation survives to the end
of the page instead of dying in the hero.

## 브리프에 없던 것

1. **Decide:** Which rose hex to use for fill vs. small-text/icon/focus-ring,
   and whether a brighter tint derivative was needed.
   **Decided:** Two-hex system — `#F43F5E` (Tailwind rose-500) for
   text/icon/focus-ring/border directly on the `#0B0B0F` bg, `#E11D48`
   (rose-600) for solid fills that carry white text (CTA button, discount
   badge, winning bar segment, "Dueling now" pill).
   **Why:** Computed WCAG relative-luminance contrast by hand (sRGB →
   linearize → `L = 0.2126R+0.7152G+0.0722B` → `(L1+.05)/(L2+.05)`).
   `#0B0B0F` → L≈0.00339. rose-500 vs bg → L≈0.23602 → **5.36:1** (clears
   small-text AA 4.5:1 with real margin, so no further brightening needed for
   icons/focus rings). rose-600 vs bg → L≈0.17356 → **4.19:1** (clears the
   ≥3:1 fill/bar/border requirement by +40%). White text on rose-600 fill →
   **4.70:1** (clears AA 4.5:1 for small text, though by only ~4% margin —
   documented honestly rather than silently rounded up; it is a real pass,
   not a borderline fail). rose-400 (`#FB7185`, used only in the
   `outline-offset-2` gap of focus rings, never as fill) vs bg → **7.30:1**,
   comfortably visible. No dual-accent hue was introduced anywhere — every
   accent use is this one rose family, kept visually minor in total area
   (small pills, thin bars, a single eyebrow line) per the near-monochrome
   constraint.

2. **Decide:** Exact container widths for the ~70-char line-length ceiling,
   since the brief explicitly forbids `ch` units for this.
   **Decided:** Hero subhead at 18px → target container =
   `70 × 0.44 × 18 = 554.4px`; used `max-width: 34.5rem` (552px) →
   `552 / (0.44 × 18) = 69.7` chars/line. Value-split body/summary and
   closing-CTA paragraph at 16px → `70 × 0.44 × 16 = 492.8px`; used
   `30.75rem` (492px) → `492 / 7.04 = 69.9` chars/line. Testimonial quotes at
   17px → `70 × 0.44 × 17 = 523.6px`; used `32.7rem` (523.2px) →
   `523.2 / 7.48 = 69.9` chars/line.
   **Why:** Followed the brief's own formula verbatim (`chars-per-line =
   container-px ÷ (0.44 × font-size-px)`) and solved backward for a
   container width landing just under 70 for each font size actually used,
   leaving headroom under the 75-char hard ceiling in every case; on mobile
   (390px, 358px after the 16px gutters) lines are naturally shorter, not
   longer, so the ceiling is never at risk there.

3. **Decide:** Which two listings face off by default, out of the four, so
   the at-rest duel already shows a non-trivial, non-zero split.
   **Decided:** Pulse Runner 97 (Nike sneaker) vs. Mirrorless Mk II
   (Fujifilm camera).
   **Why:** A jacket-vs-watch default would have had one side sweep all four
   axes (82>64, 88>78, 94>88, 90>68 — boring, looks rigged). Sneaker vs.
   camera splits 3–1 (sneaker wins condition/trust/delivery, camera wins
   price value) with every single axis gap non-zero, which is the brief's
   explicit requirement ("seed an initial asymmetry") demonstrated in its
   most convincing form — a real contest, not a sweep or a tie.

4. **Decide:** What the four listings/categories/brand names actually are —
   the brief gave the product type (resale marketplace) but no SKUs.
   **Decided:** Four fictional, deterministic items spanning different
   categories (Ridge Shell Jacket / Arc Trail, Diver 200M Chrono / Seiko,
   Pulse Runner 97 / Nike, Mirrorless Mk II / Fujifilm) with hand-set,
   fixed-literal price/listPrice/grade/trust/delivery/match numbers (no
   `Math.random`/`Date.now` anywhere — every number is a literal in `data.ts`
   and every derived value, e.g. `aggregateScore`, `discountPct`, is a pure
   function of those literals).
   **Why:** Category variety (outerwear/watch/sneaker/camera) makes the
   generative-SVG thumbnails and category icons (Shirt/Watch/Footprints/
   Camera from lucide) visibly distinct from each other, and it lets two
   cards "double as" duel contenders per the brief's suggestion while two
   more sit alongside as plain preview cards.

5. **Decide:** The fixed axis-weighting scheme for the aggregate verdict
   score (brief said "weighted axes" but not the weights).
   **Decided:** Price value 30%, condition grade 25%, seller trust 25%,
   delivery speed 20% (sums to 100%, displayed on each axis row as
   "{n}% weight").
   **Why:** Arbitrary but principled ordering — price is the single biggest
   lever in a resale decision so it got the largest weight, condition and
   trust are treated as equally important (both are "will I regret this"
   signals), delivery speed is real but least decisive, so it got the
   smallest non-trivial weight. Fixed and never user-adjustable in this
   candidate (the manipulated input here is *which two listings*, not the
   weights — reserved for a different candidate's device).

6. **Decide:** No display typeface was assigned to this candidate, so what
   carries the "editorial scale contrast" instead of a distinctive face.
   **Decided:** Stayed on `var(--font-sans)` (Pretendard) everywhere,
   including the hero `h1`, and leaned entirely on `clamp()` size jumps
   (1.4rem→2.1rem for the first h1 line, 2.5rem→5.4rem for the second) plus
   exactly three rendered weights (400 body / 600 semibold labels and
   subheads / 800 extrabold headlines and stat numbers — verified by
   grepping the folder for every `font-*` weight class used) and the
   3-tier tracking scale (eyebrow `0.28em`, caption `0.16em`, stat `0.12em`).
   **Why:** This was an explicit instruction for this candidate ("use NO
   display face... stay on --font-sans"), not a choice — included here only
   to record how scale contrast was still achieved without one, per the
   brief's own framing that this is "a valid, deliberate choice."

7. **Decide:** How the product-preview cards let a visitor change the duel
   without duplicating the two `<select>` dropdowns' job, to reach the
   brief's 4-distinct-interactions minimum meaningfully rather than
   decoratively.
   **Decided:** Each non-active card gets an "Add to duel" button (visible
   text + `sr-only` listing name suffix, no mismatched `aria-label`) that
   assigns that listing to Challenger B, recomputing the whole duel; active
   cards show a static "Dueling now" pill instead. Combined with select A,
   select B, and the `Reveal` scroll-entrances below the hero, that is 4
   distinct, information-bearing interactions (none decorative).
   **Why:** Keeps the dropdowns as the precise/explicit control and the
   cards as a fast/implicit one, without the two mechanisms fighting each
   other — clicking a card never surprises the dropdown labels, since B
   always reflects whatever was clicked or selected last.

8. **Decide:** How to animate the tug-of-war bars without animating `width`
   (banned: layout-thrashing) and without the Framer-Motion `whileInView`
   mount-gating risk touching the hero (also banned there).
   **Decided:** Each axis row is two half-tracks fixed at 50% width each;
   the actual "pull" is a `transform: scaleX(score/100)` on a full-height
   fill anchored with `transform-origin: right` (left half) / `left` (right
   half), transitioned via plain Tailwind `transition-transform` +
   `motion-reduce:transition-none` (a CSS media query, not JS/Framer state)
   — so it needs no mount gate at all and the Hero component imports no
   `Reveal`/Framer Motion whatsoever.
   **Why:** Satisfies "transform/opacity only" for animated properties by
   construction, and sidesteps the hero mount-gating hazard entirely rather
   than trying to gate it correctly — the brief flags this exact zone
   ("keep your hero free of scroll-reveal mount-gating risk") as the most
   severe place to get it wrong.

9. **Decide:** Testimonial names/roles and the three social-proof stats
   (brief requires social proof but gives no copy).
   **Decided:** Three short, generic, clearly-fictional first-name +
   initial testimonials (Jordan M. / Priya S. / Devon K.) with plain role
   labels, and three static stats ("118,000+ listings scored this month",
   "41 data points compared in every duel", "100% of sellers
   identity-verified before listing") — deliberately not the banned
   dollar-paid-out + "72 hrs" pairing, and phrased without any claim that a
   backend recomputes or re-pulls data on a schedule (everything here is the
   same fixed literal dataset `data.ts` already ships).
   **Why:** Generic-sounding placeholder names are standard, non-impersonating
   marketing-copy convention; the stats were chosen to reinforce the "same
   method every time" message of the Duel device itself rather than invent
   unrelated payout/trust claims.
