# Candidate B — repick

`/home/user/repick-design/app/src/app/landing-evolve/r31/b/page.tsx`

## Brand name

**repick** (lowercase wordmark, as used across the rest of the catalog's copy
voice — confident, minimal, no logotype flourish).

## Concept, one paragraph

The hero is a seven-card swipe deck of real repick listings (denim trucker,
court sneakers, a wool blazer, a raffia tote, white sneakers, a silk slip
dress, a shearling-collar coat), each carrying its price, discount, AI
condition grade, AI match score and seller-verification state exactly like a
normal listing preview would. Swiping — by drag, or by the always-visible
"Pass" / "Love it" buttons — feeds a fixed, hand-authored delta table that
nudges a six-axis taste profile (Vintage, Minimalist, Streetwear, Formal,
Sustainable, Statement), rendered as a hand-built SVG radar chart sitting in
the same hero grid as the deck. The polygon eases toward its new shape after
every swipe (snapping instantly under reduced motion), axis points are real
focusable buttons that report their exact score, and once any card has been
sorted the dominant axis flows forward: it renames the "Recommended for you"
grid (re-picked from the same seven cards, weighted by how much each one
would have pushed that axis) and rewrites the closing CTA's headline, body
and button copy. Before any swipe, the radar shows a neutral 50/50/50 hexagon
and the CTA stays generic — never undefined, never broken.

## Interaction list (4 required + extras)

1. **Pass** — click/tap button or drag left past 90px; applies that card's
   fixed `leftDelta` and advances the deck.
2. **Love it** — click/tap button or drag right past 90px; applies that
   card's fixed `rightDelta` and advances the deck.
3. **Undo last swipe** — pops the most recent entry from history; radar eases
   back to the prior shape.
4. **Hover / focus a radar axis point** — each of the six axis markers is a
   real `<button>` with a visible focus-visible outline and an `aria-label`
   stating its exact score; hovering or tab-focusing it swaps the readout
   line under the chart from the default (dominant axis, or "Balanced across
   all six" pre-swipe) to that axis's exact `n / 100`.
5. *(bonus)* **Reset deck** — clears history and starts over once at least
   one swipe has happened, or from the "Deck complete" panel.
6. *(bonus)* **Pointer drag** on the active card — manual `pointerdown` /
   `pointermove` / `pointerup` tracking (no library) with a live
   translate+rotate transform, snapping back if released under the 90px
   threshold.
7. *(bonus)* Anchor-link CTAs ("Start sorting", "See more `{axis}` finds")
   scroll back to the deck or down to the recommendation grid rather than
   being dead buttons.

The taste profile is causally wired end to end: swipe → fixed delta table →
`targetScores` → radar polygon + axis readouts → dominant axis → "Recommended
for you" heading/copy/card selection → closing CTA headline, body and button
label. Nothing below the fold goes stale once the user has swiped.

## Font / typography confirmation

Body and headline both use `--font-sans` only (Tailwind's default
`font-sans`, inherited from the layout's `--font-sans` variable) — **no**
added display face, no `font-serif`, no `next/font` import added by this
page. Exactly **three** rendered weights are used across the whole page:
`font-normal` (400, body copy), `font-medium` (500, labels/buttons/badges),
`font-bold` (700, headline, section headings, card names, prices, stats).
Verified with `grep -o 'font-[a-z]*' page.tsx | sort -u` → only those three.

## Accent color — contrast math (real relative-luminance, WCAG formula)

Accent: **`#C8FF4D`** (lime/yellow-green family). Computed via
`L = 0.2126·R + 0.7152·G + 0.0722·B` on linearized sRGB channels, then
`(L1+0.05)/(L2+0.05)`:

| Pair | Ratio | Passes |
|---|---|---|
| `#C8FF4D` vs **white** `#FFFFFF` text | **1.18 : 1** | Fails everywhere — white text is never placed on the lime fill. |
| `#C8FF4D` vs **dark ink** `#0B0B0F` text | **16.71 : 1** | Passes AAA even at small sizes — dark ink is what sits on every lime fill (buttons, the CTA pill, the value-pillar icon chip). |
| `#C8FF4D` as **foreground text/icon** on the `#0B0B0F` page background | **16.71 : 1** (same pair, ratio is symmetric) | Passes AAA at any size — used for the discount tag, the "lean toward X" copy, focus outlines, and the small lime dot inside each radar-axis button. |

Rule applied: every filled lime surface (both CTA buttons, the hero "Love
it" button, the value-pillar icon circle) uses **`#0B0B0F` ink text/icons**,
never white, because white-on-lime only clears 1.18:1. Every place lime is
used as *foreground* (text or stroke) sits on the `#0B0B0F` background and
clears 16.71:1, so no separate paler tint was needed for small text.

## 브리프에 없던 것

- **Seven products + their photo ids/prices/grades/discounts/verification**
  — the brief specified the mechanic, not the catalog. Invented seven
  resale items spanning all six axes (denim trucker → Vintage, court
  sneakers → Streetwear, wool blazer → Formal, raffia tote → Sustainable,
  white sneakers → Minimalist, silk slip dress → Statement, shearling coat →
  Vintage+Statement hybrid) with fixed Unsplash photo ids chosen for
  content-appropriate secondhand clothing/accessories, and hand-set
  price/original/grade/match/verified values per card.
- **The deterministic delta table itself** — brief asked for "a fixed table,
  your call on magnitude," so: right-swipe gives the primary axis +14 and a
  secondary axis a small +2–4 bump; left-swipe gives only the primary axis a
  small −5 (or −2/−3 split on the one hybrid card). Clamped to 0–100,
  starting from a 50/50/50/50/50/50 baseline. Anyone can hand-sum any swipe
  sequence against this table and get the same radar.
- **How "Recommended for you" picks its three cards** — re-sorts the same
  seven cards by `rightDelta[dominantAxis] ?? 0` (stable sort, so ties keep
  original order — still fully deterministic) rather than introducing a
  second, separate curated product set. Chosen to avoid anything that could
  read as a ranked/leaderboard visualization (banned) — it is presented as a
  plain three-card grid with no rank numbers or position indicators.
- **The axis set** — the brief's own example (Vintage, Minimalist,
  Streetwear, Formal, Sustainable, Statement) was used directly as the six
  axes, since it was offered as a ready, well-balanced set and the brief
  only required *a* 5–7 axis set, not that the example be avoided.
- **Radar geometry** — hand-built with plain trigonometry: 320×320 viewBox,
  center (160,160), max radius 100, label radius 128, angle(i) =
  `-π/2 + i·(2π/6)` (axis 0 at 12 o'clock, clockwise). Interactive hit
  targets are real absolutely-positioned HTML `<button>`s placed by
  percentage (`x/320·100%`), not SVG-native focusability, so they get normal
  browser tab order, disabled-state and focus-visible behavior for free and
  stay aligned at any rendered size since both the SVG and the buttons scale
  off the same percentage basis.
- **The morph animation** — a hand-rolled `requestAnimationFrame` tween
  (260ms, cubic ease-out) interpolating a `displayScores` state toward the
  real `targetScores`, gated by the `useSyncExternalStore`-based
  `prefers-reduced-motion` hook (snaps instantly when reduced motion is on).
  This lives in a `useEffect` — not the "adjust state during render" pattern
  — because it is a genuine imperative animation side effect in response to
  a value changing from a user action, not state being resynced from a prop.
- **Drag-to-swipe without framer-motion** — brief allowed using
  framer-motion, but a manual `pointerdown`/`pointermove`/`pointerup`
  implementation with a `useRef` (read/written only inside event handlers,
  never during render) kept the behavior simpler to reason about
  deterministically and avoided pulling in spring-physics defaults that
  would need their own reduced-motion gating.
- **Card-detail `<dl>`** — condition grade and AI match are marked up as a
  `<dl>` with the Layers3/Percent icons living inside each `<dt>`, satisfying
  "icon inside dt" and giving the badges real semantic pairing instead of
  being bare styled spans.
- **Social proof stats** — invented "1.2M+ pieces resold," "4.8 / 5 average
  seller rating," "6 grades, AI-checked on every photo set" specifically to
  avoid the banned "$X paid out" + "72 hrs" pairing template.
- **Body-copy line-length math** (Pretendard average Latin advance
  0.44em, formula `chars = width ÷ (0.44 × font-size)`):
  - Hero subhead: `max-w-[560px]` at `text-lg` (18px) → 560 ÷ (0.44×18) =
    560 ÷ 7.92 ≈ **70.7 chars/line**.
  - Social-proof quote: `max-w-[600px]`, `text-xl` (20px) on mobile → 600 ÷
    8.8 ≈ **68.2 chars/line**; `sm:text-2xl` (24px) on desktop → 600 ÷ 10.56
    ≈ **56.8 chars/line**.
  - Recommended-section intro: `max-w-[520px]` at `text-base` (16px) → 520 ÷
    7.04 ≈ **73.9 chars/line** (under the 75 ceiling, a little above the ~70
    aim — accepted since it is two sentences, not a long paragraph).
  - Closing-CTA paragraph: `max-w-[520px]` at `text-lg` (18px) → 520 ÷ 7.92 ≈
    **65.7 chars/line**.
  - Value-pillar card body: `max-w-[280px]` at `text-sm` (14px) → 280 ÷ 6.16
    ≈ **45.5 chars/line** — deliberately narrower than the paragraph aim
    because it is compact card copy inside a 3-up grid, not a running
    paragraph; well inside the ceiling either way.
- **Heading structure fix** — the swipe-deck card's product name was
  initially drafted as an `<h3>`, which would have skipped from `<h1>` to
  `<h3>` in document order (the hero has no `<h2>` before the deck). Changed
  it to a plain styled `<p>` so the only headings below `<h1>` are the
  section `<h2>`s, each followed by its own `<h3>`s (value pillars,
  recommended cards) — verified by grepping heading tags in render order.
