# Candidate A — repick

## Brand name

**repick** — lowercase wordmark, set in `--font-display-mono`, carried over from the
assigned product name rather than inventing a new one (the brief frames "repick" as
the product itself, not a placeholder).

## Concept, one paragraph

A near-monochrome dark landing page built around a hand-drawn SVG map of a fictional
city split into six districts — Northside, Riverfront, Old Mill, Garden Row, East
End, and South Quay — rendered as irregular octagon "blocks" around a decorative
river line. Clicking (or tapping, or Enter/Space-ing) a district commits it as the
selected region, which drives a live stats panel (active listings, average resale
price, top category, AI-verified sellers nearby) with a hand-built six-week SVG bar
chart whose bars redraw to that district's own listing-trend profile; hovering or
keyboard-focusing a district (without clicking) previews that same panel live, so a
visitor can scan the whole city before committing. The committed district also
reorders which three AI-matched, condition-graded, seller-verified product cards
appear inside the hero itself, and the same district's name and verified-seller
count resurface, unbroken, in the closing CTA — so the whole page reads as one
causal chain from map click to sentence.

## Interaction list

1. **Click / Enter / Space a map district** (`<path role="button" tabIndex={0}>`) —
   commits the selection. Updates: the marker pin on the map, the product-card row,
   and the closing CTA's headline + verified-seller count.
2. **Hover or keyboard-focus a district** (mouseenter/mouseleave + focus/blur on the
   same path) — live, non-committing preview. Updates: the stats `<dl>`, the 6-week
   bar chart, and an `aria-live="polite"` caption under the map ("Previewing X…" /
   "Showing X"). Reverts to the committed district on mouse-leave/blur.
3. **"Why this match?" expand/collapse** on each of the 3 product cards
   (`aria-expanded` button, `ChevronDown` rotates) — reveals a one-line AI
   match-reasoning sentence per listing.
4. **Neighborhood search input** — filters a row of chip buttons below the map;
   each chip is a second, non-SVG way to select/preview the same district (keyboard-
   and touch-friendly alternative to the small map shapes).
5. *(richness, not counted toward the minimum)* Scroll-reveal on the "how it works"
   pillars and testimonials via a `Reveal` wrapper — mount-gated with
   `useSyncExternalStore` and gated by `useReducedMotion`, so the server-rendered
   HTML always ships at full opacity.

## Font / typography confirmation

- Body, nav, labels, badges, buttons, all Korean-equivalent copy: inherits the
  page's default `--font-sans` — never overridden with a font-family anywhere.
- Headline-scale Latin text only (`<h1>`, `<h2>` section titles, the `repick`
  wordmark, and the large numeric stats in the panel) uses
  `style={{ fontFamily: 'var(--font-display-mono)' }}` — never mixed with any other
  display face, never applied to body copy.
- Exactly **3 rendered font weights** across every file: `400` (`font-normal`, and
  the unstyled default, which is also 400 so it never becomes a hidden 4th weight),
  `500` (`font-medium` — nav, labels, badges, buttons, chart axis labels), `600`
  (`font-semibold` — all headings, the wordmark, product titles/prices, large stat
  numbers). No `font-bold`/`font-light`/etc. anywhere (grepped to confirm).

## Accent color — computed contrast

Accent: **`#3B82F6`** (blue-hex family). Background / dark-ink: **`#0B0B0F`**.

Relative luminance (WCAG formula, `L = 0.2126R + 0.7152G + 0.0722B` on linearized
sRGB channels):

- `#3B82F6` → R=0.2314, G=0.5098, B=0.9647 → linearized ≈ (0.0437, 0.2233, 0.9227)
  → **L ≈ 0.2357**
- `#0B0B0F` → **L ≈ 0.00345**
- White → L = 1

**Ratio 1 — accent vs. white:** `(1.00 + 0.05) / (0.2357 + 0.05) = 1.05 / 0.2857 ≈
3.68:1`. Clears 3:1 (large text ≥24px/19px‑bold, and non-text like borders/bars/focus
rings). **Fails** 4.5:1 for small (≤19px, non-bold) text.

**Ratio 2 — accent vs. dark-ink:** `(0.2357 + 0.05) / (0.00345 + 0.05) = 0.2857 /
0.05345 ≈ 5.35:1`. Clears both 3:1 **and** 4.5:1.

**Rule applied:** the accent is used two ways on this page, and each gets the
pairing that actually clears 4.5:1:

- *Accent as foreground on the dark page* (bar-chart "now" bar, stat icons, badge
  borders, eyebrow text, focus-visible outlines, the `−43%` discount label) → paired
  with the dark-ink background → **5.35:1**, safe at any size.
- *Accent as a fill* (every CTA button: "List an item" / "List your first item" ×2,
  the selected-chip background) → text on top is **dark-ink (`#0B0B0F`), not white**
  → same pair, reversed roles → **5.35:1**, which clears 4.5:1 even for small
  non-bold labels. White-on-accent (3.68:1) is never used for text, so no separate
  brighter tint variant was needed — see 브리프에 없던 것 below for why.

## 브리프에 없던 것 (things the brief left to me)

- **Invented geography.** The brief asked for a plausible invented region with 5–8
  clickable shapes but specified none. I built a fictional city of 6 districts
  (Northside, Riverfront, Old Mill, Garden Row, East End, South Quay) laid out as a
  2×3 grid of irregular octagons (corner-cut rectangles, a different corner-cut per
  district so each shape reads as hand-drawn rather than a uniform grid), separated
  by a purely decorative, `aria-hidden` river curve that also motivates the
  "Riverfront" name.
- **Preview vs. commit split.** The brief requires a hover/focus "preview before
  committing" but doesn't say which downstream elements the preview should touch. I
  decided hover/focus only drives the stats panel + chart (live, reversible), while
  the product-card row and the closing CTA update only on an actual click/Enter —
  so the CTA's region reference is never transiently wrong while someone is just
  scanning the map with a mouse.
- **Discount computed, not stored.** `price` and `originalPrice` are the only stored
  numbers per listing; the `−43%`-style badge is computed as
  `Math.round((1 - price/originalPrice) * 100)` in the component, so the displayed
  percentage can never drift out of sync with the two prices it describes.
- **Breakdown/total consistency, applied to a non-payout case.** The "subtotals must
  add up" rule in the brief is framed around payout breakdowns, but I applied the
  same discipline here: each district's 6-week trend chart's last bar is literally
  the same constant as that district's headline "active listings" stat (not a
  separately-invented endpoint), and the proof section's city-wide totals
  (2,576 listings / 791 verified sellers) are the literal sums of the six per-
  district constants, written out in a comment in `data.ts` so they can be checked
  by eye.
- **Stock-photo variety traded for certainty.** Rather than sourcing 18 distinct
  Unsplash ids (3 per district), I picked one real, content-appropriate id per
  category (outerwear/footwear/bags/denim/knitwear/accessories — 6 total) and reused
  each across that category's 3 listings, to stay certain every id is a real,
  on-topic photograph rather than a guessed one.
- **Line-length math.** Body paragraphs (hero subhead, "how it works" intro, CTA
  subtext) use a `max-w-[520px]` container at `17px` type:
  `520 ÷ (0.44 × 17) = 520 ÷ 7.48 ≈ 69.5` → **≈70 characters/line** (target ~70,
  ceiling 75). The narrower 3-column copy (value-pillar descriptions, testimonial
  quotes) uses `max-w-[320px]` at `14px`: `320 ÷ (0.44 × 14) = 320 ÷ 6.16 ≈ 51.9` →
  **≈52 characters/line** — tighter than the ceiling because the column itself is
  narrow by layout, not because 70 was unreachable.
- **Dark-ink-on-accent instead of a brighter tint.** Per the accent-contrast rule,
  since white-on-`#3B82F6` only clears 3.68:1 (fails 4.5 for small text), the brief
  allows a verified dark-ink alternative instead of inventing a brighter tint. I
  verified dark-ink-on-accent clears 5.35:1 and used that everywhere text sits on
  the accent fill, so no second accent value exists on the page.
- **Non-color state cues on the map.** Beyond the required "more than hover/select
  color alone," I added an always-on district name label inside the SVG, a filled
  `MapPin` marker for the committed district, and a dashed outline specifically for
  the previewed (not-yet-committed) district, so district state is legible by shape
  and text, not fill color, for colorblind users.
- **4th interaction.** Added the neighborhood search input + chip list the brief
  offered as optional, both as the required 4th real interaction and as a non-SVG,
  keyboard/touch-friendly way to reach every district.
- **Accessibility scaffolding not spelled out line-by-line in the brief:** a
  skip-to-content link, the stats block built as a semantic `<dl>` with each icon
  inside its `<dt>`, and the `aria-live="polite"` caption that announces
  "Previewing X…" vs. "Showing X" under the map for screen-reader users following
  hover/focus state changes.
