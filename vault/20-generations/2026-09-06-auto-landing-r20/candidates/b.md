# Candidate b — repick landing (r20)

**Concept:** A dark, market-ticker-toned landing page whose hero centerpiece is a draggable `<input type="range">` scrubber over one flagship listing's fixed 4-stage price/verification history — dragging it recomputes the listing's live price, milestone checklist, and narrative caption simultaneously, and a second "Verification Ledger" section plus the closing CTA copy echo that same derived state live.

## 브리프에 없던 것

**1. Accent hue**
① The brief bans violet/amber and requires computing WCAG contrast myself for whatever hue I pick.
② Chose a signal green: full-saturation `#05DF72`, small-text/icon tint `#8CF0BE`, ink `#0B0B0F`.
③ Green reads as "market/verified/positive" (ticker-up color), is not in the banned list, and is under-represented versus violet/amber in the catalogue.

**2. Contrast arithmetic for the accent**
① Had to measure contrast against both the dark ink and white, and figure out which text color to put ON a solid accent fill.
② Computed: `#05DF72` vs `#0B0B0F` ink = **11.04:1**; `#05DF72` vs white = **1.78:1**; tint `#8CF0BE` vs ink = **14.33:1**. Because this hue is very light (high luminance), dark ink text on the accent fill measures **11.04:1** (passes small text) while white text on the accent fill measures only **1.78:1** (fails badly) — the opposite pairing from the brief's violet reference example. Every accent-filled button/chip in the page uses **dark ink (`#0B0B0F`) text**, never white-on-accent.
③ The brief explicitly warns the "safe" pairing is hue-dependent and to verify my own numbers rather than copy the reference direction — measuring showed white-on-this-green fails AA, so ink-on-green was the only compliant choice.

**3. Theme (dark vs light)**
① Brief left dark-vs-light as my call for a "market ticker" mood.
② Committed fully to dark (`#0B0B0F` background, fixed — not OS-dependent, no `prefers-color-scheme` branching since this is a marketing page with one fixed brand look).
③ A live-ticker/stock-terminal mood reads as dark-mode-native (trading terminals, market tickers); a light theme would fight that association.

**4. `zinc-500` sweep**
① The floor rule (`zinc-400` minimum on dark) meant an initial pass using `text-zinc-500` for strikethrough prices and inactive ticker/tick-mark labels had to be corrected.
② Replaced every `text-zinc-500` with `text-zinc-400`, and verified `#A1A1AA` (Tailwind zinc-400) against `#0B0B0F` = **7.66:1** by direct calculation.
③ Comfortably clears AA (4.5:1) with margin, and matches the brief's own reference muted token (`#A1A1AA`) exactly.

**5. Body paragraph container widths (0.44em formula)**
① The brief mandates computing exact container px width from `chars-per-line = container-width / (0.44 × font-size)`, targeting ~70 chars (ceiling 75), not using `ch`.
② Hero sub-copy: font-size 18px → `0.44 × 18 = 7.92px/char`; container `555px` → `555 / 7.92 ≈ 70.1` chars. CTA body + testimonial quote: font-size 16px → `0.44 × 16 = 7.04px/char`; container `500px` → `500 / 7.04 ≈ 71.0` chars.
③ Both land right at the ~70-char target and stay under the 75-char hard ceiling, so `max-w-[555px]`/`max-w-[500px]` were set as exact inline `maxWidth` values rather than a Tailwind `max-w-*` step or a `ch`-based width.

**6. Brand name, flagship listing, and fixed stage data**
① Brief names the product "repick" but specifies no headline copy, no example listing, and no concrete price/verification narrative for the scrubber archetype.
② Brand stays "repick" (lowercase per brief). Flagship listing invented as a "Sony a7 III — 24-70mm Kit" camera with a 4-stage fixed history: Listed ($620, Day 0) → AI-Graded ($620, Day 1, grade B+) → Offer Accepted ($555, Day 4) → Verified & Shipped ($555, Day 6). Grid products (headphones/sneakers/watch) and their before/after prices, match %, and grades are also invented, as are the social-proof stats (`14,208` sales / `$2.4M` paid out / `96%` match confidence) and two testimonials.
③ The archetype requires a concrete deterministic fixed-array dataset (no `Date.now`), so a specific, plausible secondhand-camera resale story was authored to make the price-drop-at-offer-acceptance narrative legible; a camera lets "AI condition grade" (brassing, shutter count) read as a believable inspection detail.

**7. Scrubber anchor mapping and default position**
① The archetype requires a continuous 0–100 control mapped onto 4 discrete fixed stages, with no timestamp math — exact anchor positions and interpolation rule weren't specified.
② Chose anchors `[0, 33, 67, 100]`; the "current stage" is the furthest anchor at/under the scrubber value, and price is linearly interpolated between that stage's price and the next stage's price within that segment (so the $620→$555 drop animates smoothly only across the "Offer Accepted" third of the track). Default scrubber position is **100** (fully verified/shipped), not 0.
③ Defaulting to the finished, fully-verified state satisfies "proof visible by default, not first revealed by interaction" — the visitor sees the complete success story immediately, and dragging backward *deepens* understanding (reveals why the price moved) rather than being required to unlock the proof.

**8. Second recompute surface ("Verification Ledger")**
① The checklist wants "2+ independent surfaces" recomputing from one manipulation, and a distinct "value section" landing-structure item, without specifying what it looks like.
② Added a 4-card ledger section below the hero that highlights whichever stage the shared scrubber state currently points to, plus a heading sentence that interpolates the live stage label/day/price. This section holds no control of its own — it purely reflects the hero's `progress` state (lifted to the page component).
③ Gives the "manipulation" a second, physically separate surface (beyond the hero's price/badges/caption) that recomputes in lock-step, fulfilling the multi-surface requirement without adding a second competing control (the archetype calls for one scrubber, not two).

**9. Font weights and display face**
① Brief requires exactly 3 rendered weights and permits at most one whitelisted display face for large latin headline text only.
② Used 400 (body/normal), 600 (labels, badges, nav, buttons), 700 (headings, big numbers). Applied `--font-display-grotesk` (Space Grotesk Display) to the `<h1>` only, at `font-bold` (700); every other heading/number stays on Pretendard.
③ Verified via a targeted `npx eslint` pass (zero warnings) and manual audit of every `font-*` class in the file — no `font-medium` or unstyled bold sneaks in; the display face is confined to the one large headline as instructed.

**10. Layout scale (container width, grid split, section padding, tracking values)**
① Max content width, hero column split, and exact section padding weren't specified numerically.
② `max-w-[1400px]` content container; hero grid is `grid-cols-12` split 6/6 at `lg:`; all major sections use `py-24` (96px), matching the "≥96px desktop" floor exactly; tracking set to `0.28em` (eyebrows), `0.16em` (captions/section labels), `0.12em` (stat labels) per the given scale.
③ 1400px keeps line lengths and card widths comfortable at 1920px without the page feeling like a stretched single column; 6/6 gives the headline and the proof card visually equal weight, matching "editorial density" over lopsided whitespace; 96px is the literal floor stated in the brief.

**11. Ticker marquee mechanics**
① The archetype's "one more" 4th motion type (beyond scrubber, scroll reveal, card hover) wasn't specified.
② Built an auto-scrolling "recently verified sales" ticker strip (fixed 8-item array, duplicated once for a seamless loop) using a plain CSS `@keyframes` animation at 26s linear infinite, paused via `:hover`/`:focus-within`, and skipped entirely (`prefers-reduced-motion`) by conditionally omitting the animating class.
③ A scrolling ticker is the most literal expression of "market/live" mood for a resale marketplace, reinforces the time/price theme of the scrubber, and gives a 4th, genuinely distinct interaction type (auto-motion + hover-to-pause) rather than padding the count with a near-duplicate of the scroll reveal.

**12. Product photography**
① Brief bans randomized image services and requires hand-picked fixed Unsplash photo IDs with real alt text; none were given for a camera/headphones/sneakers/watch.
② Picked specific fixed IDs: camera `1441986300917-64674bd600d8`, headphones `1519669417670-68775a50919e`, sneakers `1542291026-7eec264c27ff`, watch `1523275335684-37898b6baf30`, all served via `images.unsplash.com` (already allow-listed in `next.config.ts`).
③ These are commonly-referenced, stable Unsplash photo IDs matching each product category, keeping every image container's fixed `aspect-ratio` + reserved background color intact regardless of load outcome.

**13. Focus-visible mechanism**
① Brief flags `ring-2`/`ring-offset` as a dead Tailwind v4 idiom and warns `outline-none` can cancel a later `focus-visible:outline`.
② Every interactive element (range input, nav links, both CTA buttons) uses `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-*` with an explicit `outline-color` (inline style or a scoped plain `<style>` block for the range thumb) — `outline-none` is never used anywhere in the file.
③ Guarantees a real, always-visible focus ring at rest-none/focus-full rather than relying on a utility that Tailwind v4 no longer paints.
