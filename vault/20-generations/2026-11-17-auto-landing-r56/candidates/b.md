# Candidate B — GRIDLINE

## 1. Concept + brand

**GRIDLINE** — a peer-to-peer sneaker/streetwear resale marketplace built around a
schematic district grid: tap one of 7 named zones and the estimated pickup
window, the courier fee, and the matched local inventory all recompute
together. Dark theme, near-monochrome, indigo accent, mono display face.

## 2. Accent color + contrast arithmetic

Background `#0B0B0F` → relative luminance (WCAG sRGB formula, piecewise
gamma) **L_bg ≈ 0.003453**.

**Accent base — `#4F46E5` (indigo-600), large fills only** (CTA button
backgrounds, selected-zone tile fill/border):
- Linear RGB ≈ (0.07827, 0.06129, 0.78350)
- L_accent = 0.2126×0.07827 + 0.7152×0.06129 + 0.0722×0.78350 ≈ **0.11707**
- Contrast vs bg = (0.11707+0.05)/(0.003453+0.05) ≈ **3.13 : 1**
- This clears the ≥3:1 floor for a large fill (buttons, borders, chip
  backgrounds, ≥24px/≥19px-bold text) but is NOT used for small text on its
  own, per the brief's rule.

**Derived tint — `#A5B4FC` (indigo-300), small text/icons/focus rings**
(eyebrow label, match-tag text, `LocateFixed`/`CheckCircle2` icon color,
`outline-indigo-300` focus ring):
- Linear RGB ≈ (0.37645, 0.45664, 0.97345)
- L_tint = 0.2126×0.37645 + 0.7152×0.45664 + 0.0722×0.97345 ≈ **0.47692**
- Contrast vs bg = (0.47692+0.05)/(0.003453+0.05) ≈ **9.86 : 1** — well above
  the 4.5:1 floor for small text/icons.

**Text on a filled accent swatch** (`bg-indigo-600` buttons):
- White (`L=1`) vs accent fill: (1+0.05)/(0.11707+0.05) ≈ **6.29 : 1** → passes.
- Dark ink (`L=0`) vs accent fill: (0.11707+0.05)/(0+0.05) ≈ **3.34 : 1** →
  fails normal-text AA (only large text/non-text would clear this).
- **Used white** on every filled-accent button (`bg-indigo-600 text-white`)
  for exactly this reason — matches the brief's "white usually wins" default.

**Muted/secondary text** — switched every instance to `text-zinc-400`
(`#A1A1AA`) rather than `zinc-500`, after actually computing zinc-500 against
this background: linear RGB ≈ (0.16514, 0.16514, 0.19454) → L ≈ 0.16728 →
contrast ≈ **4.07 : 1**, which fails the 4.5:1 floor outright on this
near-black bg. `zinc-400`: linear RGB ≈ (0.35638, 0.35638, 0.40345) →
L ≈ 0.35978 → contrast ≈ **7.67 : 1**. Confirms the brief's static "never
below zinc-400 in dark mode" rule is not just a style guard here — zinc-500
would have been a real, measurable failure on this exact background.

## 3. Body container width + character arithmetic

Chosen body paragraph container: **500px** (`max-w-[500px]`), font-size 16px
(1rem, Inter 400).

chars-per-line = container-px ÷ (0.44 × font-size-px) = 500 ÷ (0.44 × 16)
= 500 ÷ 7.04 ≈ **71 characters/line** — inside the "target ~70, never exceed
75" rule. (Not using `ch`, per the brief's warning that it overshoots ~35% in
this font.)

## 브리프에 없던 것

1. **① Product domain.** The brief fixed the device (spatial zone map) but
   left the resale category open. **② Decided:** sneakers/streetwear, 10 fixed
   SKUs. **③ Why:** local-meetup pickup for sneaker resale is an established
   real-world pattern (StockX/GOAT-style local verified meetups), which makes
   the "pickup zone" device read as a real product decision rather than an
   arbitrary skin, and Unsplash has strong, reliable coverage of sneaker
   photography, lowering the risk of a broken/off-subject fixed photo id.

2. **① Number and shape of zones.** The brief specified "named zones" on a
   grid but not a count or geometry. **② Decided:** 7 zones, grouped into 3
   tiers (near/mid/far) that each map to one fixed ETA + fee combination, laid
   out as asymmetric non-overlapping rectangles (hand-picked percentages)
   around a decorative central "Hub" node with dashed connector lines.
   **③ Why:** 7 gives enough variety to make the device feel real without
   requiring per-zone bespoke fee/ETA values (which would multiply the
   surface area for a hand-authored page with no build check); grouping into
   3 tiers keeps `TIER_INFO` as the single small lookup table that
   `getZoneResult()` reads, so every zone's numbers are guaranteed internally
   consistent by construction rather than by careful typing.

3. **① How "proof below the mobile fold" gets solved.** The brief forbids
   `order-*` reordering and demands the Hero's headline + device + proof all
   fit a typical 390px fold, without giving an exact pixel budget.
   **② Decided:** keep DOM order headline → device → proof (no reordering),
   and instead shrink *vertical cost*: compact header (nav hidden below `sm:`),
   tight mobile paddings/line-heights, a smaller mobile map aspect ratio, and
   — the key move — a horizontal `overflow-x-auto snap-x` filmstrip for the
   proof grid on mobile (full CSS grid only from `sm:` up) instead of a
   multi-row stack. **③ Why:** this was explicitly the brief's own suggested
   failure mode to avoid (robbing one region to pay another), so the only
   lever left that doesn't touch document order is the *height* each region
   consumes — a one-row horizontal scroller is the standard technique for
   showing "more items than fit" without the row growing taller.

4. **① Tier/status color coding.** Nothing in the brief says how to visually
   distinguish zone tiers (near/mid/far) on the tiles. **② Decided:** no
   traffic-light colors (green/amber/red) — used two shades of the one accent
   hue (`indigo-300` / `indigo-600`) plus `zinc-600` for the farthest tier,
   always paired with a text label ("Near tier" / "Mid tier" / "Far tier").
   **③ Why:** the brief's near-monochrome DNA explicitly says "your **one**
   accent color," so a traffic-light scheme (my first draft) would have
   smuggled in two extra hues; shade-of-accent + text label keeps the
   monochrome discipline while still being distinguishable, and color is
   never the sole signal per the a11y rule.

## 5. Final confirmation

- **Exactly 3 rendered font weights:** 400 (`font-normal`/unstyled body text
  and inherited text), 600 (`font-semibold` — eyebrow, captions, stat labels,
  nav, buttons, badges), 800 (`font-extrabold` — the one `h1` and every `h2`).
  No `font-bold`/`font-medium` classes exist anywhere in the route.
- **Display face used:** `var(--font-display-mono)` only, applied via one
  shared `DISPLAY_FONT_STYLE` constant in `ui.ts`, referenced from exactly
  three places: the hero `h1` (`Hero.tsx`), the closing-CTA `h2`
  (`ClosingCta.tsx`), and the brand wordmark in the header/footer
  (`Client.tsx`). No other display variable is referenced anywhere in the
  route.
- I did not open, read, or reference any other candidate's files, `DECISION.md`,
  `SCORES.md`, or any `candidates/*.md` other than this one.

## Files

- `app/src/app/landing-evolve/r56/b/page.tsx`
- `app/src/app/landing-evolve/r56/b/Client.tsx`
- `app/src/app/landing-evolve/r56/b/Hero.tsx`
- `app/src/app/landing-evolve/r56/b/ZoneMap.tsx`
- `app/src/app/landing-evolve/r56/b/ProductGrid.tsx`
- `app/src/app/landing-evolve/r56/b/ProductCard.tsx`
- `app/src/app/landing-evolve/r56/b/ValueSplit.tsx`
- `app/src/app/landing-evolve/r56/b/SocialProof.tsx`
- `app/src/app/landing-evolve/r56/b/ClosingCta.tsx`
- `app/src/app/landing-evolve/r56/b/zones.ts` (shared data + the single
  `getZoneResult()` derivation function)
- `app/src/app/landing-evolve/r56/b/ui.ts` (shared `FOCUS_RING` + display-font
  style tokens)
