# Candidate c — repick, seller side

## Brand name
**repick** (the catalog's established product name; this page carries the "for sellers" sub-line in the header rather than inventing a second brand).

## Concept, one paragraph
A seller-facing landing page whose entire proof lives in the hero: a four-step chip wizard — category, condition, brand tier, photo count — sits directly beside a live, itemized payout receipt. Every chip click updates a shared `Selections` state object, which a single deterministic function (`computeEstimate`) folds through fixed lookup tables into a suggested price range, a fee rate and dollar amount, and a payout range, displayed as a real `<dl>` receipt (AI-suggested price range → our fee → your payout). The wizard opens with sensible, non-degenerate defaults (Denim & jeans / Good / Premium / 5–7 photos) so the receipt and the closing CTA are never blank. Below the hero, a "sold recently" comp strip, a three-column "no hidden math" explainer, and seller testimonials build trust before a closing CTA that quotes the visitor's own current payout number back to them by name.

## Interaction list
1. **Category chip** (6 options) — selects one of six category tables; auto-advances the wizard to the condition step.
2. **Condition chip** (4 options: New/Like New/Good/Fair) — scales price and nudges the fee rate down for better-documented items.
3. **Brand tier chip** (3 options: Standard/Premium/Luxury) — scales price up steeply and lowers the fee rate (bigger items keep a larger share).
4. **Photo-count chip** (3 options: 3–4 / 5–7 / 8+ photos) — nudges suggested price via a listing-confidence multiplier.
5. **Step-tab navigation / edit-previous-step** — four always-visible step tabs (each showing its current value) let the visitor jump back to any step without losing later choices; `aria-current="step"` marks the active one.
6. **Reset to defaults** — one click restores the default selections and the step-1 view, demonstrating the formula is a pure function, not state soup.
7. **Scroll-reveal** — testimonials and the three-column explainer fade/rise into view via a hydration-gated, `prefers-reduced-motion`-respecting `Reveal` wrapper (never ships `opacity:0` in raw SSR HTML).

All four/five required interactions recompute the same live `Estimate` object that feeds the payout panel **and** the closing CTA sentence — nothing downstream of the wizard is a disconnected static number.

## Font / typography confirmation
- Body, Korean-capable text, and all UI copy: `--font-sans` (Pretendard stack) throughout.
- Headline-scale Latin text only (`h1`, section `h2`s via `SectionIntro`/inline, stat figures): `--font-display-grotesk`, never mixed with `-wide`/`-mono`.
- Exactly **3 rendered font weights**: 400 (default/`font-normal`, inherited by all body `<p>` text), 600 (`font-semibold` — labels, nav, secondary emphasis), 700 (`font-bold` — headings, numerals, selected-state text). Verified by grepping every `font-*` weight utility in the route; no `font-medium`/`font-extrabold`/etc. appear anywhere, and SVG icon markup carries no text weight to begin with.
- All payout/price/percentage figures use `tabular-nums`.

## Accent color — contrast math (required)
Chosen accent: **`#6D4AE0`** (a bluer, more saturated violet than the catalog default `#6E56CF` — same family, different shade per the variety assignment). Derived bright tint for small text/icons/focus rings: **`#AE9BFF`**.

Computed with the real WCAG relative-luminance formula (sRGB → linear, `0.2126R + 0.7152G + 0.0722B`, contrast = `(L_lighter + 0.05) / (L_darker + 0.05)`):

- `#6D4AE0` vs **white** (`#FFFFFF`): **5.67:1** — clears AA at every text size. Used for all text set on an accent fill (e.g. the "List your {item}" CTA buttons, selected-chip checkmark/icon when placed on the soft accent wash).
- `#6D4AE0` vs **dark ink** (`#0B0B0F`): **3.47:1** — clears the large-text/non-text floor (3:1) but **not** small-text AA (4.5:1). Consequence: `#6D4AE0` is used directly as a *border* color (non-text, 3:1 floor applies and passes) and as the headline-scale eyebrow is instead rendered in the brighter tint (see below) rather than the base accent, to stay safely inside small-text AA everywhere it is read as text.
- Derived tint `#AE9BFF` vs background `#0B0B0F` (used for the eyebrow label, step/chip icons, selected-chip glyphs, and the `focus-visible` outline ring): **8.36:1** — comfortably clears small-text AA.
- Spot-checked supporting colors against the `#0B0B0F` floor: `zinc-400` (`#A1A1AA`) = **7.66:1** (safe body/caption floor used throughout); `zinc-500` (`#71717A`) = **4.06:1**, which is *below* the 4.5:1 small-text floor — found during review in two wizard captions and corrected to `zinc-400` (kept only on decorative, `aria-hidden` icon glyphs, which are not text nodes and are exempt from `color-contrast`). `emerald-300` (`#6EE7B7`, the "Sold" badge) on the near-black surface = **12.89:1**.

## 브리프에 없던 것
- **Fee-rate formula (brand tier ± condition adjustment).** The brief said "fee should visibly depend on brand tier or condition in some deterministic way you define." I made it depend on *both*: `feeRate = clamp(BRAND_FEE_RATE[tier] + CONDITION_FEE_ADJUST[condition], 0.08, 0.25)`. Standard/Premium/Luxury base rates are 0.20/0.16/0.12 (higher-dollar items keep a larger share, mirroring how marketplaces commonly discount take-rate on big tickets); condition then nudges that rate by −0.02 (New) / −0.01 (Like New) / 0 (Good) / +0.02 (Fair) on the theory that cleaner condition carries less grading/dispute risk. The clamp is defensive — by construction the real range is 0.10–0.22, so it never actually triggers, but I left it in so the function can't silently misbehave if a table value changes later.
- **Suggested-price range, not a single point estimate.** The brief's example line item is "AI-suggested price range." I built the whole receipt around a range rather than a point figure: `mid = base × conditionMult × brandMult × photoMult`, then `priceLow = round(mid × 0.85)`, `priceHigh = round(mid × 1.15)` (a fixed ±15% band, not randomized). Fee and payout are then computed independently at each endpoint (`feeX = round(priceX × feeRate)`, `payoutX = priceX − feeX`), so the subtraction is correct **by construction** at both ends rather than derived from a single mid-point and then split — there is no rounding path where `priceX − feeX ≠ payoutX`.
- **Photo-count's effect on price, not on fee.** The brief lists photo count as an "optional 4th step" without specifying what it should drive. I made it a price multiplier (0.94 / 1.00 / 1.06 for 3–4 / 5–7 / 8+ photos) rather than touching the fee, on the reasoning that more photos increase buyer confidence and clearing price, while repick's cut is a listing-economics decision unrelated to how many pictures a seller uploaded.
- **Six base categories and their per-category base price.** The brief gives condition and brand tier's exact option sets but only says "pick a category" for step 1. I invented six resale-realistic categories (Denim & jeans, Outerwear & jackets, Knitwear & sweaters, Dresses, Sneakers & shoes, Bags & accessories) each with its own hand-chosen base price ($32–$64) representing the Good/Standard/5–7-photo baseline, so that category alone visibly changes the receipt before any other step is touched.
- **Wizard interaction shape: accordion-with-always-visible step tabs, not four stacked always-open panels or a fully gated linear flow.** The brief allows "some step navigation" without specifying its shape. Because all four selections already have valid defaults (no step is ever "locked"), I let every step tab be clickable at any time — clicking a chip in the active step both commits the value and auto-advances to the next step (steps 1–3), while clicking any step tab jumps straight to it for editing. This gave a concrete "edit previous step" interaction without needing to special-case a blocked/disabled state anywhere.
- **`aria-controls` design for the step tabs.** Only one step panel exists in the DOM at a time (the active step's chip grid), so I pointed every step tab's `aria-controls` at one stable, always-present panel id rather than four per-step ids — four per-step ids would have left three of them dangling (pointing at ids absent from the DOM) whenever that step wasn't active, which is an invalid ARIA reference.
- **Line-length math.** Per `--font-display-grotesk`/Pretendard body rule, chars-per-line = container-px ÷ (0.44 × font-size-px), target ~70, hard ceiling 75:
  - `SectionIntro` body (used by the "sold recently" and "no hidden math" sections): `493px ÷ (0.44 × 16px) = 493 ÷ 7.04 ≈ 70.0` chars — exactly on the catalog's known-good target.
  - Hero subhead: `520px ÷ (0.44 × 18px) = 520 ÷ 7.92 ≈ 65.7` chars.
  - Closing-CTA paragraph: `480px ÷ (0.44 × 16px) = 480 ÷ 7.04 ≈ 68.2` chars.
  - Value-split column body: `400px ÷ (0.44 × 14px) = 400 ÷ 6.16 ≈ 64.9` chars.
  - Testimonial quote: `420px ÷ (0.44 × 14px) ≈ 68.2` chars.
  - Footer blurb: originally set to `480px` at 14px (`≈ 77.9` chars — over the 75-char ceiling); caught during review and narrowed to `430px ÷ 6.16 ≈ 69.8` chars.
  - The short copyright line is left unconstrained in width (as the catalog's own precedent does) because it is one sentence that never actually wraps to a second line at any tested viewport — the rule concerns per-line length of paragraphs that do wrap, not single-line micro-copy.
