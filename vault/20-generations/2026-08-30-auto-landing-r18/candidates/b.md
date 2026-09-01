# Candidate b — "Matching Board"

Concept in one line: a dark, ledger-styled dual-column board — Buyer Requests
threaded live to Seller Listings by a per-row connecting line and a "% fit"
evidence chip — where a single category filter re-threads both columns, and
that same filter state resurfaces as recalculated numbers in the value-split
section and the closing CTA.

Route: `app/src/app/landing-evolve/r18/b/`
Files: `page.tsx`, `client.tsx`, `Hero.tsx`, `MatchingBoard.tsx`,
`ProductPreview.tsx`, `ValueSplit.tsx`, `SocialProof.tsx`, `ClosingCTA.tsx`,
`data.ts`, `theme.ts`, `ui.tsx`.

## 브리프에 없던 것

① **Exact accent hue + contrast computation.**
② Chose amber `#F59E0B` as the single accent (not violet/indigo), with a
brighter tint `#FFC369` derived for small text/icons/focus rings, and
`#0B0B0F` as the dark ink used on top of accent fills.
③ Computed by hand (WCAG relative luminance, not guessed):
- `#F59E0B` vs white `#FFFFFF` → **2.25:1** (fails small-text AA — so amber is
  never used as text color on a white/light surface in this candidate).
- `#F59E0B` vs dark ink `#0B0B0F` → **8.75:1** (passes AA even at small
  sizes — used for amber text/icons directly on the dark background, and for
  dark-ink-on-amber-fill button/chip text, since 8.75:1 is symmetric).
- `#FFC369` (bright tint) vs dark ink `#0B0B0F` → **12.4:1** — used for
  eyebrow labels, small icons, and the `focus-visible` outline color.
- Consequence: every accent-filled surface (CTA buttons, active category
  pill, discount chip) uses **dark ink text**, not white, because white on
  `#F59E0B` only reaches 2.25:1 — the brief's fallback rule ("use dark ink on
  the fill … unless it independently reaches 4.5:1 at small sizes") applies
  here, and 8.75:1 clears that bar comfortably at any size.
- Reasoning for amber specifically: it reads as a "ledger/order-matched"
  color (stock-ticker association) that fits the ticker-like matching-board
  concept and the `--font-display-mono` typeface, and it's outside the
  violet/indigo pile already in the catalog.

① **Whether to use a dual-accent scheme for the buyer/seller axis.**
② Skipped it — single accent only, columns differentiated by label text
("Buyer request" / "Matched listing"), icon, and layout position, not color.
③ The brief flags dual-accent as optional and lower-risk to skip; computing
and defending two full accent contrast tables inside an already tight
grayscale budget felt like added risk for a "color is never the only signal"
requirement I could already satisfy with text + icon + position. Kept the
"near-monochrome + tiny accent area" property honestly small.

① **A contrast bug found mid-build, not upfront.**
② The initial `mutedDim` token `#71717A` (used for de-emphasized text like
timestamps, price strikethrough, folio captions, form labels) computed to
only **3.7:1** against the card surface `#16161C` — under the 4.5:1 floor for
small normal-weight text, and the brief is explicit that `aria-hidden` (used
on the folio numbers) does not exempt visible pixels from this check.
Brightened it to `#8E8E96`, which recomputes to **5.5–6.0:1** against every
background surface actually used on the page (`#0B0B0F`, `#131318`,
`#16161C`). Recorded here rather than silently fixed, per the brief's
instruction to be honest about what had to be invented/corrected.

① **Body paragraph container width, font size, and chars/line.**
② `max-width: 500px` at `16px` font-size for every intro/subhead paragraph.
③ Per the brief's formula (`chars_per_line = container_width_px / (0.44 ×
font_size_px)`, since Pretendard's average glyph advance is 0.44em, not the
wider `ch`-unit "0" glyph): `500 / (0.44 × 16) = 500 / 7.04 ≈ 71.0` chars —
inside the ~70 target and under the 75 hard cap. (An earlier pass used 15px
for three of these paragraphs, which computes to `500/(0.44×15) ≈ 75.8` —
over the cap — so all four were normalized to 16px for one consistent,
compliant container.) The one exception is the JetBrains Mono Display
headlines (`max-w-[16ch]`/`[18ch]`/`[20ch]`/`[22ch]`/`[24ch]`), where `ch` is
actually accurate because that face is monospace — every glyph *is* the "0"
glyph's width, so the brief's warning (which names Pretendard/Inter
specifically) doesn't apply there.

① **Concrete product/request dataset for the board.**
② Authored 12 buyer-request/seller-listing matched pairs across 4 categories
(Cameras, Furniture, Audio, Bikes — 3 pairs each), each with a budget,
condition ask, location, a priced listing with before/after discount %,
condition grade, seller verification tier, and 3 rationale tags. The
default "All matches" view shows one curated pair from three of the four
categories (Cameras, Furniture, Audio) so the board never opens empty.
③ Arbitrary but internally consistent — chose everyday secondhand-goods
categories that map cleanly to Repick's marketplace framing, with numbers
picked to read as plausible (discounts 19–39%, budgets $120–$900) rather
than derived from any real pricing model.

① **What the "matching-criteria toggle" actually is.**
② Interpreted it as the category filter (All / Cameras / Furniture / Audio /
Bikes) rather than a separate abstract "match by price vs. condition vs.
distance" axis toggle.
③ The brief explicitly allows either reading ("A category filter or
matching-criteria toggle"). A category filter gave a clearer, more concrete
"why did this re-thread" story (the pairs are literally different objects,
not just re-scored) and was lower-risk to make genuinely live-recomputed
end-to-end (hero board → value-split numbers → closing CTA copy) within one
state variable.

① **The three numbers behind the value-split section.**
② "Avg. price fit %", "Avg. condition confidence %", "Avg. time to match
(days)" — each hand-authored per match (not derived from the price/condition
text via a formula) and aggregated with a plain `.reduce()` average, rounded.
③ Kept them as directly authored fields (`priceFit`, `conditionConf`,
`speedDays` in `data.ts`) rather than computing "fit" from budget vs. price
algorithmically, because a formula would have needed its own justification
(e.g., is $60-under-budget better or worse "fit" than $30-under on a smaller
budget?) that the brief doesn't specify — authored numbers keep the demo
honest about being illustrative rather than implying a real scoring model.

① **How the connecting-line device is implemented geometrically.**
② Each buyer/listing pair gets its own short, local SVG connector (a fixed
`0 0 88 24` viewBox horizontal curve) between the two cards in that row,
instead of one large absolutely-positioned overlay spanning the whole board
that would need to measure real DOM pixel positions.
③ A single full-board overlay would require `getBoundingClientRect`
measurement (or a percentage-based grid-track assumption that only holds if
every card is exactly the same height) to stay aligned across breakpoints
and content-length variation, adding fragility for a purely decorative
device. Per-row local SVGs draw-on with framer-motion's `pathLength`
(gated by `useReducedMotion`), replay automatically on category change
because each row remounts under a new `key={match.id}`, and degrade cleanly
on mobile (the SVG is hidden under `md:`, leaving the always-visible "X% fit"
text+icon chip as the connective signal — so the pairing is never
communicated by the line's presence/color alone).

① **Fixed Unsplash photo IDs for the 4 product categories.**
② `photo-1502920917128-1aa500764cbd` (camera), `photo-1555041469-a586c61ea9bc`
(dining table), `photo-1505740420928-5e560c06d30e` (headphones),
`photo-1485965120184-e220f721d03e` (bicycle) — one fixed, content-matched
image reused across each category's 3 listings.
③ Picked well-known, frequently-referenced fixed Unsplash photo IDs for each
literal subject rather than a random/lorem image service, per the brief's
requirement. Reused per-category (4 images total, not 12 unique ones) to
keep the asset list small and the subject-match obviously correct; I was not
able to load a browser this session to visually confirm each ID still
resolves, so this is flagged as an assumption rather than a verified fact.

## Accessibility / robustness notes (self-audit, not just the default-render gate)

- Single `<h1>` (hero headline). Heading order across the whole DOM:
  h1 → h2 (board) → h3×6 (buyer/listing cards) → h2 (product preview) →
  h3×3 (preview cards) → h2 (value split) → h2 (social proof) → h2 (closing
  CTA). No skipped levels anywhere.
- Focus rings use `focus-visible:outline` + `outline-offset` +
  `outline-[#FFC369]` (a real CSS outline, not `ring-*`/`ring-offset-*`, and
  never preceded by `outline-none`) on every interactive element: category
  pills, both CTA links, the disclosure button, the email input, and the
  submit button.
- The one non-default state audited by hand: the disclosure panel in each
  product-preview card (`aria-expanded` + `aria-controls` + native `hidden`
  attribute on the panel, not `display:none` via a class toggle) and the
  email form's post-submit confirmation state (re-checked contrast of the
  `accentBright`-on-`bgCard` confirmation text — 8.9:1, computed the same way
  as the VerifiedChip case above).
- All `Reveal`-wrapped scroll animations and the SVG line draw-on check
  `useReducedMotion()` and render fully visible/static (never permanently
  `opacity:0`) when the user has reduced motion enabled.
- The buyer/seller axis is labeled in text ("Buyer request" / "Matched
  listing") on every card in addition to any visual differentiation, so nothing
  depends on the accent color alone.
