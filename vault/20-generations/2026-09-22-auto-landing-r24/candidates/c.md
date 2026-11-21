# Candidate c — Bubble Match

One line: six competing listings for the same bike sit as circles whose **area** (not radius) is set
by a live weighted-average match score across four sliders (price / condition / trust / speed), the
top-scoring listing always centered and ringed with its full tag set, and the closing CTA quotes that
same live score — a proportional bubble-pack output form the catalogue has not shipped before.

## 브리프에 없던 것

**1. Theme: light, not dark**
① The brief left theme open ("either dark or light, your call").
② Picked light: near-white page ground `#FAFAFA` (~zinc-50 tier), ink `#111114`, white `#FFFFFF`
card/panel surfaces.
③ The catalog skews 15 dark : 6 light. Structure dominates theme per design-principles (a
same-density light or dark are equal), but nothing about the bubble-pack concept needed a dark
canvas, and picking light adds a data point to the underrepresented side without costing anything —
the same near-monochrome + single-accent discipline applies either way.

**2. Accent hex, and the two-tint split, with full contrast arithmetic**
① Had to pick a hue (brief: cyan or emerald, not violet) and calculate contrast against background
and any fill text, per design-principles' method (WCAG relative-luminance formula, not eyeballed).
② Picked **cyan**, two tints: `#0E7490` (cyan-700, "FILL" — buttons, the top-match bubble's fill,
bar fills, borders, large text) and `#155E75` (cyan-800, "TEXT TINT" — small text/icons/focus rings
where extra headroom over 4.5:1 was worth having). Computed with the standard sRGB relative-luminance
formula (`L = 0.2126R + 0.7152G + 0.0722B` on linearized channels, `contrast = (L1+0.05)/(L2+0.05)`):

| Pairing | Ratio | Verdict |
|---|---|---|
| `#0E7490` as text on `#FAFAFA` (bg) | 5.13:1 | passes AA at every text size |
| `#155E75` as text on `#FAFAFA` (bg) | 6.96:1 | extra margin, used for the smallest text/icons |
| `#FFFFFF` as text on `#0E7490` fill | 5.36:1 | passes AA at every size — the only text color used on fill |
| `#111114` (ink) as text on `#0E7490` fill | 3.52:1 | large text (>=24px/19px bold) or non-text only — never used for body text on fill on this page |
| `#52525B` (zinc-600, muted) vs `#FAFAFA` | 7.41:1 | safe on near-white surfaces |
| `#52525B` vs `#F4F4F5` (panel) | 7.03:1 | safe on tinted surfaces too — muted text never needs to track which floor applies |

③ Chose cyan over emerald because the round's sibling candidates were unknown at generation time,
and cyan reads more "data/live-instrument" (matches the "match visualizer" framing) than emerald's
more common "growth/success" association. The two-tint split exists because `#0E7490` alone already
clears 4.5:1 against the bg (5.13:1) but leaves the least headroom of anything in the palette — using
the darker `#155E75` specifically for the smallest text (11px badge labels, focus rings) trades a
little saturation for margin, cheaply. One early draft used `text-white/85` for the in-bubble label on
the accent-filled top bubble; computed separately it measured **4.35:1 against `#0E7490`** — below the
4.5 floor for that 11-12px semibold text — so it was corrected to solid white (5.36:1). Recording that
near-miss here because it is exactly the kind of thing the brief warns skipping this step causes.

**3. Line-length container widths, computed from the 0.44em constant, not `ch`**
Formula per brief: `chars-per-line = container-width-px / (0.44 * font-size-px)`.

| Copy | Font size | Container | Chars/line |
|---|---|---|---|
| Hero subhead | 18px | `max-w-[555px]` | 555/(0.44×18) = 555/7.92 = **70.1** |
| Section intro paragraphs (listings/value/FAQ headers/CTA) | 16px | `max-w-[500px]` | 500/(0.44×16) = 500/7.04 = **71.0** |
| FAQ answer body | 15px | `max-w-[460px]` | 460/(0.44×15) = 460/6.6 = **69.7** |
| Bubble-spotlight "weighted at…" caption | 12px | `max-w-[360px]` | 360/(0.44×12) = 360/5.28 = **68.2** |
| Value-card body copy | 14px | `max-w-[300px]` | 300/(0.44×14) = 300/6.16 = **48.7** (short card caption — under 65 is normal per spacing rule, not a violation) |

All land at ~68-71 chars, inside the ~70-target / 75-ceiling band with margin, and none use `ch`.

**4. Per-listing attribute values and the score formula**
① The brief specifies weighted-formula manipulation but not the actual numbers or formula shape.
② Six fixed listings for the same "Trek Domane SL5, 54cm" search, each with four fixed 0-100
attributes (`priceValue`, `condition`, `trust`, `speed`) plus display fields (price, grade, verified,
ship days). Score = weighted average, independent 0-100 sliders normalized by their own sum:
`score = (priceValue·wP + condition·wC + trust·wT + speed·wS) / (wP+wC+wT+wS)`. A floor of
`WEIGHT_MIN=5` on every slider keeps the denominator always positive (no divide-by-zero).
③ Chose *independent normalized sliders* over *sliders forced to sum to 100 via redistribution*
(the brief allows either) because redistribution logic (rescaling the other three whenever one
changes) adds a second, harder-to-verify-correct arithmetic layer for no visible difference in the
resulting score math — normalizing by the current sum is mathematically equivalent to "weights that
sum to 100" for every ratio that matters, and is far simpler to reason about and get right. Attribute
values were tuned (checked with a throwaway Node script, not committed) so that six different
scenarios — the default and four single-axis-dominant presets — could be verified up front to (a)
never tie exactly and (b) actually crown three *different* top-match listings across those five
weightings, so the "reordering" claim in the copy is true of the shipped numbers, not aspirational.

**5. Default slider weights (non-trivial default state)**
① Brief requires a default that doesn't render as six same-size circles.
② `{ price: 62, condition: 30, trust: 48, speed: 22 }` — a "value-conscious, trust-aware buyer"
persona, not equal weights and not a single-axis extreme.
③ Checked the area ratio this produces before committing to it: an all-equal default (`50/50/50/50`)
gave a **1.79** area ratio (max score 88.0 vs min 49.3, in the six-listing dataset), which already
reads as differentiated, but leans on the listings' own spread rather than the weights doing any
work — it would look identical if it just as easily used unequal attribute data with equal weights.
The chosen unequal default keeps a similar area ratio (**1.49**, top RideCycleCo 85.1% down to Elena
R. 64.4%) while actually exercising the weighting mechanism the page is about, and every quick-preset
button produces a visibly larger area ratio (2.0-3.4×) so dragging sliders reads as a clear escalation
from the default, not a reset to sameness.

**6. Quick-preset weight combinations (the "4th interaction type")**
① Brief asks for >=4 distinct interaction types; sliders + scroll-reveal + tap-to-inspect covered
three, needed one more that wasn't decorative.
② Added five one-tap presets (Balanced / Best price / Best condition / Most trusted / Fastest ship),
each setting all four sliders at once — `{100, 8, 8, 8}` in whichever order, i.e. the named axis at
max and the other three floored near `WEIGHT_MIN`. The active preset (if the current sliders exactly
match one) gets a filled accent state on its button, computed by field-by-field comparison each
render, not stored as separate state that could drift from the sliders.
③ Verified numerically that the five presets crown three different top-match sellers (RideCycleCo,
Marcus H., Bay Area Bike Exchange) rather than all converging on the same "best overall" listing —
Bay Area wins both "Best condition" and "Most trusted" because it genuinely leads both of those
attributes (98 and 94 respectively), which is a real property of the fixed data, not a coincidence to
paper over. An earlier attempt at gentler presets (`{100, 20, 20, 20}`) made three of five presets
converge on the same top listing, which undersold the "the board actually reorders" claim, so the
non-primary weights were pushed down to `8` to make the primary axis dominate more clearly.

**7. Deterministic circle-packing formula**
① Brief explicitly allows (and suggests) a fixed-formula packing instead of physics simulation.
② Fixed 520×520 coordinate space. Rank-0 (top match) bubble sits at dead center. The other five ring
around it at 72° steps starting straight up (`-90°`), each one's orbit radius set to exactly
`topRadius + GAP(10) + ownRadius` — which makes bubble-vs-top overlap *structurally impossible*
regardless of the scores (verified numerically across the default, all five presets, "all weight on
one axis" edge cases, and two arbitrary mixed-weight scenarios: minimum gap between any two circles
was always exactly the 10px floor, never negative). Radius: `r = R_MAX · sqrt(score/100)`, so
**area** (`π·r²`) is linear in score, per the brief's requirement that area (not radius) carry the
signal — `R_MAX = 74` was picked, together with the 72° ring, by checking the resulting bounding box
against the 520-unit stage across every scenario above (worst-case margins were never under ~14 of
the 520 units on any side) so nothing clips even at the largest simultaneous bubble sizes.
③ Percentage-based CSS (`left/top/width/height` as `% of a forced-square container`) keeps every
bubble a true circle at any container width without JS measurement or ResizeObserver — a square
`aspect-square` wrapper means percentage-of-width and percentage-of-height always resolve to the same
pixel value.

**8. No CSS transition on bubble reposition/resize — instant recompute, not an animation**
① The motion catalog's "§공통 필수" rule (applies to both dash and landing) restricts animation to
transform/opacity only, explicitly banning animating `width/height/top/left`. But the bubble stage's
whole mechanic is size (area) and position changing with every slider drag.
② Resolved by not animating that state change at all — React re-renders the bubbles' inline
`left/top/width/height` styles instantly on every slider `onChange`, with no `transition` property on
those specific CSS properties. This sidesteps the rule rather than violating it: an instant re-paint
on state change is not a CSS/JS *animation* in the sense the rule addresses (a scroll-reveal, hover
microinteraction, or parallax layer that eases over time). A small `hover:scale-[1.04]
active:scale-[0.97]` micro-interaction *is* layered on top of the bubbles for tactile feedback on tap
— that one **is** transform-only and duration-gated (150ms, `motion-reduce:transition-none`), so it
stays inside the rule's actual letter.
③ Considered a "wrapper transform: scale()" trick to get both fluid responsiveness and an animatable
transform, but it requires knowing the container's actual rendered pixel width at runtime (a
ResizeObserver, with attendant SSR/hydration-mismatch risk for a value that differs per viewport) for
no clear payoff over an instant recompute, which several existing weighted-recompute components in
this repo (e.g. `(marketing)/v22`'s order-book re-ranking) also do without transitions.

**9. Generated CSS swatches instead of real photos**
① Brief explicitly names this as a legitimate fallback given possible sandboxed network restrictions
to Unsplash.
② Each of the six listing cards in the product-preview grid uses a `aria-hidden` div with a
`linear-gradient` background from a small fixed two-stop palette per listing (all cyan/slate family,
consistent with the near-monochrome + single-accent rule — no photo-realistic imagery implied), inside
a reserved `aspect-[4/3]` box, rather than any `next/image`/`<img>` call.
③ Zero network dependency, zero risk of `no-random-image-host` or load-failure/alt-text-overlap
issues, and it keeps the "no raw `<img>`" rule trivially satisfied by using no raster image at all —
the same choice a prior winning candidate made for the same reason.

**10. Badge placement on the product-preview cards**
① Design-principles explicitly bans absolute-overlay badges on top of a photo (image-load-failure /
alt-text collision risk) — initial draft put the live match-score badge as an absolute pill in the
photo's top-right corner, which is exactly the banned pattern.
② Corrected: the match-score badge moved into the card's normal-flow body, in the same row as the
seller name, alongside the grade/verified/ship badges below — nothing is ever positioned over the
`aria-hidden` swatch.
③ Caught by re-reading the rule against my own first draft rather than by an external check — noting
it here because the brief specifically calls out that this exact mistake has sunk candidates before.

**11. Product-preview grid keeps a fixed row order — the live score only changes a badge number**
① The catalog already has an "N-row re-sorting list" output form (banned from being duplicated here,
per the brief's device-uniqueness requirement) and the six-card grid below the hero risked
reproducing it if it re-sorted by score whenever weights changed.
② `GRID_ORDER` is a fixed literal array, never derived from the live ranking; each card still shows
its *own* live match-score badge (recomputed from the current weights, so the manipulation is still
real and visible there too), but cards never change position.
③ This keeps the bubble-pack as the page's one genuinely novel *geometry*, while the grid section
still demonstrates the "AI shows its work" product-preview requirement (rich tags: match %, condition
grade, verified badge, before/after price) without accidentally shipping a second, different-looking
instance of an already-cataloged output form on the same page.

**12. Spotlight/inspect panel default state and its relationship to the closing CTA**
① Rule 3 requires the closing CTA to reference the *live top match*, not whatever the visitor is
currently looking at if they have tapped a non-top bubble to inspect it — these needed to be
decoupled so tapping around the board never breaks the CTA's truthfulness.
② The bubble-stage's "inspected" state is `null` by default (showing the live top match, satisfying
the fold-visible full-tag-set requirement with zero interaction) and is local to `BubbleStage` itself;
the page-level closing CTA independently reads `ranked[0]` from the same shared `weights` state,
never from whatever the visitor tapped. Tapping a different bubble only ever changes the hero's own
spotlight panel content (with a "Back to top match" control to return), and can never desync the CTA.
③ This was a deliberate architectural split (state colocation vs. lifting) rather than lifting one
shared "focused listing" state to the page root, specifically so the tap-to-inspect interaction (rule
4's "product-preview interaction") and the manipulation-persists-to-CTA requirement (rule 3) can never
accidentally collide with each other as the component grows.
