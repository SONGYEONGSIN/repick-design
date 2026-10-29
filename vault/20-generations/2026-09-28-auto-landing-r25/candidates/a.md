# Candidate a — Fair Price Matrix

One line: a 4-grade × 5-age-bracket resale-price heatmap table where a segmented
condition-grade toggle and a years-since-release slider spotlight one live cell
(neighboring cells fade toward white by grid distance), recomputing a price +
percentile readout that stays live all the way through the closing CTA.

Route: `app/src/app/landing-evolve/r25/a/` — `page.tsx`, `client.tsx`,
`price-matrix.tsx`, `listing-card.tsx`, `data.ts`.

## 브리프에 없던 것

1. **Accent hue + computed contrast numbers (required).** Chose orange — an
   underused hue in the catalog, and a plausible material association for a
   camera-resale brand (film, brass wear, warmth) without being amber/teal.
   Computed against the WCAG relative-luminance formula myself (Node one-off),
   not eyeballed:
   - `#ea580c` (fill/border/bars/large text) vs white `#ffffff`: **3.56:1** —
     clears the ≥3:1 large-text/non-text floor. Used only for button fills,
     the selected matrix cell, borders and the accent-tinted background chips
     — never as small standalone text on white.
   - Dark ink `#1c1917` **on** the `#ea580c` fill (button labels, selected-cell
     number): **4.91:1** — clears full AA 4.5:1, so ink-on-accent was used
     instead of white-on-accent (white-on-`#ea580c` only reaches 3.56:1 and
     would have failed small text).
   - `#c2410c` (brighter tint, small text/icons/focus rings) vs white:
     **5.18:1**; vs the `#fff7ed` chip background it sits on in badges:
     **4.88:1** — both clear 4.5:1.
   - `#9a3412` (used for the discount badge, extra safety margin) vs white:
     **7.31:1**; vs `#fff7ed`: **6.88:1**.
   - Muted body text `#57534e` vs white: **7.63:1**; vs the `#fafaf9` section
     background: **7.30:1**. Ink `#1c1917` vs white: **16.74:1**.
   - Caught myself mid-build: I first used stone-400 `#a8a29e` for several
     "quiet" captions/labels (category eyebrows, the discount strikethrough
     price, table footnote). Computed contrast **2.52:1 vs white** — well
     under 4.5. Replaced every instance with `#57534e` (7.63:1) rather than
     shaving it to just-over-threshold, since the brief's own guidance
     prefers a real margin over a floor-hugging value.
   - No second accent hue: nothing on the page needed a second color axis
     (e.g. "seller-submitted vs inspection-derived"), so per the brief's own
     test — "if you can't state the split in one sentence, don't" — it stayed
     single-hue.

2. **Character-width arithmetic (required).** Two body-copy tokens, both
   computed in px per the brief's 0.44em/glyph rule (no `ch` units):
   - Hero subhead: `max-w-[540px]` at `18px` → `540 / (0.44 × 18)` =
     `540 / 7.92` ≈ **68.2 chars/line**.
   - Section intros + closing-CTA sentence: `max-w-[460px]` at `16px` (Tailwind
     `text-base`) → `460 / (0.44 × 16)` = `460 / 7.04` ≈ **65.3 chars/line**.
   Both land under the ~70–72 ceiling with margin.

3. **Grid shape and the reference dataset.** The brief specified the axes
   (grade × age) but not how many steps or what the actual numbers are. I
   picked 4 grades (Like New / Excellent / Good / Fair) × 5 age brackets
   (0–1, 1–2, 2–3, 3–5, 5+ yr) = 20 cells on purpose, so the hero headline
   ("One matrix. Twenty honest prices.") could make the grid's exact size
   part of the copy. Retention % and "beats X% of listings" percentile are a
   fixed, hand-authored 4×5 matrix (monotonically decreasing on both axes),
   priced against an invented reference item ($2,498 Sony a7 IV body) —
   clearly dummy data, not a claim about real repick pricing.

4. **Fade-by-distance algorithm for "neighboring cells."** The brief asked for
   a gradient/fade on neighbors without specifying the falloff. I used
   Chebyshev distance from the selected cell with four discrete blend-toward-
   white ratios (0 / 0.45 / 0.75 / 0.9), applied to a heat-tier color that
   itself encodes the cell's price level (independent of selection) — so the
   grid is a real heatmap-by-price with a selection spotlight layered on top,
   not just a highlight ring. Text stays ink-colored at full opacity in every
   cell regardless of fade tier, since even the lightest and darkest tiers in
   the ramp keep ink-on-tile contrast well above 12:1 — confirmed this before
   picking the palette so the fade could never quietly break contrast.

5. **Heading-level fix from reusing one card component in two contexts.**
   `ListingCard` renders the item name as `<h3>` when used in the Product
   Preview grid (correctly nested under that section's `<h2>`), but the same
   component also appears in the hero, before any `<h2>` exists yet. Reusing
   `<h3>` there would have skipped straight from `<h1>` to `<h3>`. Added a
   `heading` boolean prop so the hero instance renders the name as a plain
   styled `<p>` instead — same visual weight, no heading skip.

6. **No dark closing band.** Many landings reverse to a dark panel for the
   final CTA; I kept it a light `#fafaf9` card on white instead, since the
   brief's steering explicitly prefers light theme and introducing a dark
   band would have meant a second set of contrast tokens to justify for one
   section.

7. **No mobile hamburger.** Nav links are simply `hidden md:flex`; logo + CTA
   stay visible at every width. Kept the interaction surface to the four the
   brief asks for rather than adding a fifth (a disclosure menu) that would
   also need its own focus-trap/contrast self-audit.
