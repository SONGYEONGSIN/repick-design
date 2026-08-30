# Candidate C — Trust Score Console

A dark, near-monochrome hero where a real listing's composite Trust Score renders live in a restrained radial gauge (amber arc on a neutral track) alongside four native-range weight sliders and preset persona chips; every drag renormalizes the gauge and its four sub-bars in place via a pure `raw_i × weight_i / Σweight` function, and the resulting number is carried back into the closing CTA copy so the "live" state never dies in the hero.

## 브리프에 없던 것

**① Accent hue + exact hex + computed contrast**
Decided: `#D97706` (amber-600) as the full-hue accent, `#FCD34D` (amber-300) as its bright tint for small text/icons/focus rings. Computed via proper WCAG relative-luminance (sRGB → linear, 0.2126/0.7152/0.0722 weights), not guessed:
- `#D97706` vs white `#FFFFFF`: **3.19:1**
- `#D97706` vs dark ink `#0B0B0F`: **6.17:1**
- `#D97706` vs card surface `#111116`: **5.91:1**
- `#FCD34D` vs `#0B0B0F`: **13.62:1**
Why amber: brief explicitly bans violet/indigo as overused; amber reads as "grading/calibration instrument" (think analog meter needles) which fits a gauge-centric concept better than teal/cyan, and unlike the canonical violet (3.73:1, fails small-text AA on its own), amber-600 already clears 4.5:1 against dark bg at small sizes — so I used the full accent for some small numeric text (e.g. the weight-value readout in each slider row) instead of restricting it to large-text-only, since the underlying accessibility reason for that restriction (insufficient contrast) doesn't apply to this hue. Documented so this deviation from the *letter* of the usage-limits pattern is a verified, not accidental, choice.
- Text-on-accent-fill: white on `#D97706` = only 3.19:1 (fails small-text AA), but dark ink `#0B0B0F` on `#D97706` = 6.17:1 (passes) — so all filled buttons/chips use dark-ink text, per the brief's "rare exception" clause.

**② Body paragraph container width / font-size / chars-per-line**
Decided: every body paragraph that carries prose (hero subhead, product-preview subhead, closing-CTA subhead) uses `font-size: 16px` inside `max-width: 492px`. Computed: `492 / (0.44 × 16) = 69.9` chars/line — landed intentionally right at the 70-char target rather than the 75-char ceiling, and reused the same two numbers everywhere for one consistent typographic rhythm instead of a different width per section. Narrower 3-column body copy (value-split columns, testimonial quotes) uses smaller boxes (`300px` at 14–15px, ~46–49 chars) since shorter lines in a multi-column layout read fine under the ~70 target, not over it.

**③ Reference listing + raw factor scores + default weights**
Decided the anchor listing: a Leica M6 TTL rangefinder camera, $2,140 (from $2,650, −19%), Grade A-, seller "FocalTradePost". Fixed raw per-factor scores (never change, only weights do): seller history 88, authenticity check 96, condition match 91, price fairness 79. Default weights: 65/85/70/50 → composite = Σ(raw·weight)/Σweight = **89.6** at rest (never 0, per the brief's explicit at-rest requirement). Chose a camera as the anchor because authenticity/condition inspection language (serial match, shutter test) makes the four-factor rationale concrete and product-preview card #1 reuses the same item for continuity between hero and grid.

**④ Weight-slider range, step, and persona presets**
Decided: 0–100 range, step 5 (21 discrete positions — enough resolution to feel continuous without excess noise per drag). Added four one-click persona presets (Balanced / Authenticity-first / Condition-first / Price-first) as fixed weight vectors, purely because the brief said "richly counts" for the hero interaction and a second, faster way to explore "what if I cared more about X" (preset vs. manual drag) gave a 4th-ish interaction texture without adding a duplicate control surface. Preset weight sets and the resulting composites (86.1–90.6) were hand-picked to land in a believable, non-extreme range rather than swinging to 0 or 100.

**⑤ Sub-bar semantics and visual scale**
Decided each sub-bar shows `contribution_i = raw_i × weight_i / Σweight` (in absolute score-points, summing exactly to the composite) rather than a normalized weight-share percentage — chosen because it ties the visual bar directly to the number the user is being shown in the gauge (traceable math), and a fixed visual ceiling of 40 points per bar (`barMax`) was picked as a believable single-factor cap for a 4-factor blend, clamped so no bar overflows if a user pushes one weight to the extreme.

**⑥ Gauge geometry**
Decided a 270° sweep (−135° to +135°, opening at the bottom, classic speedometer shape) at `cx=140, cy=140, r=100`, `viewBox="0 0 280 230"`, 14px stroke. Chose stroke-dasharray/dashoffset reveal (constant path `d`, animated numeric offset) over recomputing the arc's `d` per value, specifically to sidestep any of the hydration-mismatch risk the brief calls out for trig-derived coordinates — only one already-`r2()`-rounded number changes per render, not a full path string.

**⑦ Product images**
Used three fixed `images.unsplash.com/photo-<id>` URLs (camera, fleece jacket, watch) chosen for real content match to each card's copy. Could not verify these resolve over the network from this sandboxed environment (outbound HTTPS to images.unsplash.com timed out / was blocked here — confirmed via a direct `curl` probe, unrelated to the IDs themselves), so this is a known unverified risk to flag for the hard-gate step; every image sits in a fixed `aspect-[4/3]` box with a `#1C1C22` background placeholder so a failed load never collapses the card or lets alt text collide with badges (badges are already in a separate row below the photo, not an overlay).

**⑧ Interaction inventory (need: 4 distinct types)**
1. Hero: 4 weight sliders (native `<input type="range">`, real-time recompute) + persona-preset chips.
2. Scroll-triggered reveal (`framer-motion` `whileInView`, `once: true`) on product cards, value-split columns, stats, testimonials — gated by `useReducedMotion` so the reduced-motion resting state is the finished, fully-visible state, not a stuck `opacity:0`.
3. Product-preview interaction: per-card "AI matching rationale" disclosure button (`aria-expanded`/`aria-controls`, keyboard-operable).
4. Closing-CTA email capture form with client-side pattern validation and an `aria-live` status region (idle/invalid/success) — no fake async delay, no `Date`/`random`.

**⑨ Focus-visible styling**
Avoided both dead idioms called out in the brief: no `ring-2`/`ring-offset-*` combo anywhere, and no `outline-none` paired with a later `focus-visible:outline-*` (I never apply `outline-none` at all — the browser's default is already `outline-style: none` at rest, so `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2/4` with an explicit `outlineColor` is the only outline rule in play, and it reliably paints in this Tailwind v4 setup since `outline` is a plain CSS property, not the box-shadow-based ring hack).

**⑩ Tertiary text color correction during self-audit**
Initially used a second gray (`#71717A`) for de-emphasized captions/labels/price-strikethrough across every section. Computed its contrast against both dark surfaces (`#0B0B0F`: 4.06:1, `#111116`: 3.89:1) — both fail the 4.5:1 AA floor for normal-size text. Replaced all text usages with the already-verified `#A1A1AA` muted token (7.3–7.7:1), and kept `#71717A` only on the one purely decorative, `aria-hidden` `Mail` icon in the closing CTA, where the 3:1 non-text floor applies instead and it passes. Also bumped the product-card discount scrim from `black/70` to a `black/90 → black/60 → transparent` gradient with `text-white/85` for the strikethrough price, since a fixed opacity value against an unpredictable underlying photo isn't something I can guarantee 4.5:1 for analytically — pushing the near-bottom scrim opacity high enough makes the actual background functionally near-black regardless of the photo.
