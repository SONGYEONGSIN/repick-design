# Candidate A — "Repick / The Checklist"

**One-line concept:** A dark editorial landing with a persistent left chapter-rail (22% desktop
width, collapsing to a thin horizontal strip on mobile) whose main device is a dual-handle price
slider over six fixed listings — moving either handle live-recomputes a semantic eligibility table
(within budget / condition ≥ Good / verified seller / ships in 3 days) and a running "X of 6
eligible" count that is cited, as a real derived value, in the hero, the value-split, a per-card
chip, and the closing CTA.

---

## 1. Accent color & contrast arithmetic

Theme: **dark** (`#0B0B0F` bg, matching the brief's stated default). Accent hue: **orange**
(`#F97316`) — chosen to diversify away from the catalog's recent amber/teal/violet/lime accents
(r54 emerald, r55b lime, r56c lime were all nearby in this run's history) without chasing novelty
over correctness; the math below is computed for this specific hex, not copied from another
round's worked example.

sRGB → linear → relative luminance: for each channel `c = value/255`, linearize as `c/12.92` if
`c ≤ 0.03928` else `((c+0.055)/1.055)^2.4`; `L = 0.2126·R + 0.7152·G + 0.0722·B`; contrast
`= (L_light + 0.05) / (L_dark + 0.05)`.

- **Page background** `#0B0B0F`: `L ≈ 0.0034`.
- **White `#FFFFFF`** vs bg: `(1.0+0.05)/(0.0034+0.05) ≈ 19.66:1` — body text, enormous headroom.
- **Muted `#A1A1AA`** (zinc-400, the brief's stated floor) vs bg: `(0.3564+0.05)/(0.0034+0.05) ≈
  7.61:1`; vs the raised surface `#141418` (`L≈0.0071`): `≈7.12:1`. One MUTED token safely covers
  both backgrounds used on this route.
- **Accent `#F97316`** (orange-500), `R=249,G=115,B=22` → `L ≈ 0.3248`.
  - vs bg: `(0.3248+0.05)/(0.0034+0.05) ≈ 7.02:1` — **clears body-size 4.5:1 AA directly**, so
    (like an earlier round's lime, unlike the catalog default violet) the same hex is used for
    text/icon/border at *any* size against bg or surface — no separate small-text tint token is
    needed for this hue.
  - vs surface `#141418`: `(0.3248+0.05)/(0.0071+0.05) ≈ 6.57:1` — still clears AA.
  - **White on an accent fill**: `(1.0+0.05)/(0.3248+0.05) ≈ 2.80:1` — **fails even the 3:1
    large-text floor**. Orange-500 is high-luminance enough that white text on it is low, not
    high, contrast — exactly the trap the brief calls out. Never used.
  - **Ink `#0B0B0F` on an accent fill**: `(0.3248+0.05)/(0.0034+0.05) ≈ 7.02:1` — clears body AA
    with headroom. Every filled badge/pill/button (discount badge, eligible-count chip, both
    CTAs) sets its label to ink, never white.
- **Fail-state red `#F87171`** (paired with an X icon + the word "Fail"/"Out of range", never
  color-only): `L ≈ 0.2797` → vs bg `(0.2797+0.05)/(0.0034+0.05) ≈ 6.18:1` — clears body AA too, so
  it is also safe at the small table-cell text size it's actually used at.

---

## 2. Body container width & character arithmetic

Formula given: `chars-per-line = container-px ÷ (0.44 × font-size-px)` (never `ch`, which runs
~35% wide of the stated 0.44em/char average for this font).

- **Hero subhead**, 17px, `max-w-[500px]`: `500 ÷ (0.44×17) = 500 ÷ 7.48 ≈ 66.8 chars/line`. The
  75-char hard ceiling at 17px is `75×7.48 ≈ 561px`; 500px sits 61px (8.2 chars) under it.
- **Closing-CTA subhead**, 16px, `max-w-[480px]`: `480 ÷ 7.04 ≈ 68.2 chars/line`. Ceiling at 16px
  is `528px`; 48px (6.8 chars) of headroom.
- **Testimonial quotes**, 14.5px, `max-w-[400px]`: `400 ÷ 6.38 ≈ 62.7 chars/line`. Ceiling is
  `478.5px`; well under it.
- **Value-split legend copy**, 14px, `max-w-[300px]`: `300 ÷ 6.16 ≈ 48.7 chars/line` — narrow by
  column layout, not a risk either direction.

---

## 3. 브리프에 없던 것 (things the brief left for me to decide)

1. **① Which four criteria make up the checklist, and their exact pass/fail thresholds.** The
   brief gives illustrative examples ("within budget", "condition ≥ Good", "verified seller",
   "ships in 3 days") but not concrete numeric thresholds. **② Decided:** `conditionRank >= 2`
   (Good or better, on a Fair=1/Good=2/Excellent=3/Like New=4 scale) and `shipDays <= 3`, both
   fixed per listing and independent of the slider; only "within budget" reads the live
   `[min, max]`. **③ Why:** matches the brief's own example wording exactly, and keeping only one
   of four criteria slider-driven is what makes the "two listings can never become eligible no
   matter how wide you drag" narrative (see item 2) possible and honest.
2. **① The exact six listings' prices/conditions/verification/ship-days, and the slider's
   bounds/default/step.** Entirely unspecified. **② Decided:** bounds `$20–$180`, step `$2`,
   default handles `$50–$130`; six listings priced `$38/$58/$64/$68/$72/$95` with conditions and
   verification deliberately mixed so that two listings (a 4-day-ship jacket, and a Fair-condition
   / unverified / 6-day-ship jacket) fail a *fixed* criterion no matter where the handles sit, one
   listing starts outside the default window, and the rest start eligible. **③ Why:** a dataset
   where every listing could eventually pass gives the slider no real "ceiling," so the "X short
   of the most this window can ever include" delta line (brief's required "vs X" restatement)
   would always read 0 — I needed engineered variety to make that line meaningfully non-trivial at
   the default view, while still landing on a non-zero, non-trivial default (3 of 6 eligible).
3. **① How to build an accessible two-thumb range control without a UI library.** Not specified.
   **② Decided:** two overlapping native `<input type="range">` elements, track transparent and
   `pointer-events:none` on the input body with `pointer-events:auto` restored only on the thumb
   pseudo-element (the standard accessible dual-range trick), a separately drawn fill bar between
   the two live percentages, and a locally-tracked `active` handle that gets `z-index:3` on
   focus/pointerdown so the two thumbs never permanently block each other. **③ Why:** keeps both
   handles natively focusable/keyboard-operable (Tab + arrow keys) and screen-reader-announced via
   `aria-label`/`aria-valuetext`, without needing a bespoke pointer-math drag implementation.
4. **① Macro rail width and mobile collapse behavior.** Brief says "roughly 20–25%" and "collapse
   to a thin strip or hide." **② Decided:** `lg:basis-[22%]` sticky column at desktop; at mobile a
   48–56px horizontally-scrollable top strip (chapter numerals + labels, same anchors) rather than
   hiding it outright. **③ Why:** keeps the rail's wayfinding usable on mobile without consuming
   enough vertical space to push the hero `<h1>` below the first screen — confirmed by keeping
   natural DOM order throughout (no mobile-only `order-*` reordering anywhere on the route).
5. **① Ghost-numeral color.** Brief warns oversized chapter numerals must clear 3:1 even if
   `aria-hidden`. **② Decided:** reuse the same `MUTED` (`#A1A1AA`, 7.61:1 on bg) token rather than
   a dimmer "watermark" gray or any alpha-transparency trick. **③ Why:** 7.61:1 is far past the
   3:1 large-text floor with margin to spare, and avoiding a second gray token removes any need to
   separately verify a new color — the "ghost" effect comes from scale/weight restraint relative
   to the white headline, not from lowering contrast.
6. **① Display typeface.** Brief whitelists three faces and flags `--font-display-wide` as used
   in 2 of the last 3 landing rounds. **② Decided:** `--font-display-grotesk` for all large Latin
   headings (h1/h2), never body, never mixed with another display face. **③ Why:** direct
   diversity instruction in the brief; referenced as the literal string `"var(--font-display-
   grotesk)"` at each call site rather than through a tokens.ts constant, per this codebase's own
   documented `no-unlisted-font` static-check convention (a past round hard-failed by indirecting
   through a constant).
7. **① What the Social Proof section's fixed-vs-live boundary looks like in practice.** Brief
   requires sections not wired to live state to say so explicitly. **② Decided:** a one-line
   on-page disclaimer ("A fixed snapshot... not affected by the range you set above") plus a code
   comment on the component, mirroring the exact pattern an earlier sibling round in this same
   catalog (r56c) already used for its own testimonials section. **③ Why:** established, already-
   reviewed convention in this codebase rather than inventing new phrasing.

---

## 4. Confirmations

- **Rendered font weights: exactly 3** — `font-normal` (400, all body copy, captions-by-default,
  unstyled text nodes), `font-semibold` (600, eyebrow/labels/badges/buttons/table headers/nav),
  `font-extrabold` (800, h1/h2/card titles/big stat numerals). No `font-medium`, `font-bold`,
  `font-light`, or `font-black` appears anywhere in the route (grepped across every file in
  `r57/a/`), and no `style={{ fontWeight: ... }}` is used anywhere.
- **Focus rings:** no `outline-none`/`outline-hidden` paired with a `focus-visible:outline-*` on
  the same element anywhere; every focusable element (both CTAs, both rail nav styles, every
  per-card disclosure `<summary>`, the "show only eligible" checkbox, and both range-slider thumbs
  via a scoped `:focus-visible::-webkit-slider-thumb` rule) gets an explicit `outline-2` in the
  literal accent hex, never a bare `ring-*` utility as the sole signal.
- **Hero-fold rule:** the dual-range slider (default `$50–$130`, non-zero/non-empty) and all four
  proof badges (94% match, Excellent condition, Verified seller, 38% off) for the Mono Trail
  Sneaker render as literal descendants of `Hero.tsx` itself, never a sibling section — verified by
  reading the component tree, not inferred. No `order-*` utility is used anywhere on the route, so
  the natural DOM order (headline → subhead → CTA → device+proof) holds unchanged at 390px.
- **Live-state audit:** every textual restatement of the slider's state — the hero's inline count,
  the per-card "Eligible/Not eligible at your current range" chip, the value-split's big stat, its
  "short of the most this window can ever include" delta, its cheapest-eligible-price and average-
  discount lines, the eligibility table's caption/count line and every pass/fail cell, and the
  closing CTA's headline/subhead/button label — all call the same four functions in `model.ts`
  (`eligibleCount`, `isEligible`, `checksFor`, `cheapestEligiblePrice`, `averageEligibleDiscount`,
  `maxAchievableCount`). None of them is a separately hand-typed number.
- **Other candidates:** I did not read the contents of this round's `candidates/c.md` (only saw,
  via a directory listing, that the path exists) or any `b/`/`c/` implementation files. No other
  candidate's code or copy was read.

---

## 5. Files

- `app/src/app/landing-evolve/r57/a/page.tsx` — metadata + default export.
- `app/src/app/landing-evolve/r57/a/Client.tsx` — lifts `[min, max]` state, composes all sections.
- `app/src/app/landing-evolve/r57/a/data.ts` — the six fixed listings + slider bounds/defaults.
- `app/src/app/landing-evolve/r57/a/model.ts` — pure derivation functions (no `Math.random`/
  `Date.now`/`new Date` anywhere in the route).
- `app/src/app/landing-evolve/r57/a/tokens.ts` — color/contrast math, type scale, prose widths.
- `app/src/app/landing-evolve/r57/a/Rail.tsx` — the editorial chapter rail.
- `app/src/app/landing-evolve/r57/a/DualRangeSlider.tsx` — the dual-handle device.
- `app/src/app/landing-evolve/r57/a/Hero.tsx`, `ProductPreview.tsx`, `ListingCard.tsx`,
  `ValueSplit.tsx`, `EligibilityTable.tsx`, `SocialProof.tsx`, `ClosingCta.tsx`, `Reveal.tsx` — the
  five structural sections plus the shared rich-card and scroll-reveal components.
