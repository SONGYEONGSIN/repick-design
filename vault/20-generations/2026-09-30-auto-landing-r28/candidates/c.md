# Candidate c — Five Axes

One line: a parallel-coordinates plot of six real camera listings across
price/condition/AI match/seller rating/distance, where clicking a priority
axis re-highlights the listing that actually wins it and recomputes a live
top-pick panel whose savings and match figures also drive the closing CTA's
sentence — on a light, near-monochrome page with a single deep-rose accent
and a mono display face, avoiding the buyer/seller-toggle hero shape.

Route: `app/src/app/landing-evolve/r28/c/` — `page.tsx`, `client.tsx`,
`parallel-plot.tsx`, `listing-card.tsx`, `data.ts`.

## Accent + contrast (required)

Assigned hue: deep rose/crimson, not amber/teal/violet-hex (the three most
overused) and not the two most recent winners' `blue-hex` or `emerald`.
Computed with the standard WCAG relative-luminance formula, not eyeballed:

- `#9F1239` (fill/text) vs white `#FFFFFF`: **8.19:1** — used directly as
  small accent text/icons on every white surface in the page (eyebrows,
  match-% badge, focus rings), comfortably clearing small-text AA.
- `#9F1239` vs dark ink `#18181B`: **2.17:1** — fails even the large-text
  floor, so this accent is never paired with dark-ink text on a fill; every
  accent-fill button/chip in this candidate uses **white** text, at every
  size, with no large/bold exception taken.
- White text **on** the `#9F1239` fill (primary buttons, active chips,
  testimonial-initial avatars, discount badges): same **8.19:1** figure
  (contrast is symmetric), so it clears full small-text AA regardless of
  size.
- `#FDA4AF` (light tint, used only on the one dark closing-CTA panel) vs
  that panel's `#0B0B0F`: **10.44:1** — used for the panel's eyebrow,
  shield icon and focus ring, since the page-wide `#9F1239` itself is
  print-dark and would be low-contrast text on that same dark panel.
- `#71717A` (zinc-500, folio numerals + muted text on plain white): **4.83:1**
  vs white — clears both the ≥3:1 large-text floor (folio numerals render at
  ≥1.8rem/28.8px extrabold) and the 4.5:1 small-text floor.
- `#52525B` (zinc-600, used wherever zinc-500 would otherwise sit on a
  *tinted* surface — chip backgrounds, the stat-panel `bg-zinc-50`, testimonial
  cards): **7.74:1** vs white, and still **~6.6:1** against `zinc-50`
  (`#FAFAFA`) — checked this because raw zinc-500 on zinc-50 computes to a
  borderline **4.63:1**, technically over the 4.5 small-text floor but too
  close to the edge to risk on a page whose own brief calls this exact
  pattern out as a known failure mode, so every zinc-500 instance that sits
  on a tinted background (not plain white) was bumped to zinc-600.

## Body-text container width + character math (required)

Formula per brief: `chars per line = container width px ÷ (0.44 × font-size px)`.

- 16px body paragraphs (hero subhead, section intros, closing-CTA sentence):
  target ~70 chars → `70 × 0.44 × 16 = 492.8 ≈ 493px` → `max-w-[493px]`
  (the `BODY` / `BODY_ON_DARK` constants in `client.tsx`).
- 12px "why AI picked this" reasoning line in `listing-card.tsx`: reused the
  existing catalog constant `70 × 0.44 × 12 = 369.6 ≈ 369px` → `max-w-[369px]`.
- 11px parallel-plot figure caption (`parallel-plot.tsx`): computed fresh
  since no existing constant covered 11px — `70 × 0.44 × 11 = 338.8 ≈ 340px`
  → `max-w-[340px]`. Without this cap the caption sits in the chart card,
  which is wide enough on desktop to render its ~110-character sentence as a
  single unwrapped line well past the 75-char hard ceiling — the cap forces
  it to wrap the same way regardless of viewport.

## 브리프에 없던 것 (What the brief didn't specify)

1. **What "manipulating the visualization" means for a parallel-coordinates
   plot specifically (required mechanic, method unspecified).** The brief
   left the input mechanism free ("axis-reorder that actually re-highlights
   or re-filters"). I chose a **priority-axis selector**: five toggle
   buttons (one per axis, `role="group"`, `aria-pressed`) where clicking one
   calls `bestListingForAxis(axisId, listings)` — a pure min/max reduction
   over the real listing data, not a lookup table — which re-highlights that
   listing's polyline (heavier stroke + accent + larger vertex dots, drawn
   last so it's on top) and repopulates a text stat panel (price, savings,
   match %, condition, distance) next to the chart. Default axis is "AI
   match" (not the first axis alphabetically or positionally), which was an
   arbitrary-but-motivated judgment call: it keeps the opening state tied to
   repick's core AI-matching value prop rather than an arbitrary tie-break,
   and it already produces a differentiated, non-zero top pick (Sony A7 III
   at 96%) before any interaction, satisfying the baseline-diff rule.

2. **Avoiding the reported buyer/seller-toggle convergence risk (explicit
   note in the brief, no required alternative given).** Rather than a
   perspective switch, the whole page stays in a single persona — someone
   comparing six real camera listings — and the interaction is native to
   the chart itself (which axis matters to you) rather than a generic
   role-switch layered on top. The hero's only toggle is a 2-item featured-
   listing switcher (Sony A7 III / Canon EOS R6), which is a "which item am
   I looking at" control, not a "whose side am I on" control.

3. **Which five axes, and their real value ranges (brief names price/
   condition/match%/seller-rating/distance as examples, not fixed values).**
   Used those five as given. Values are fixed literals in `data.ts` for six
   real-feeling mirrorless-camera listings (Sony A7 III/A6400, Fujifilm
   X-T4, Canon EOS R6, Nikon Z6 II, Panasonic S5), each with a brand,
   condition grade, AI-match reasoning sentence, and a genuine before/after
   price gap — chosen so every axis has real spread (price $640–$1,320,
   condition 82–95, match 84–96%, rating 4.4–4.9, distance 1.4–8.7mi) and no
   axis is degenerate (min===max), which would collapse to a flat line.

4. **Per-axis domain padding (chart needs *some* headroom above/below the
   plotted min/max, brief doesn't specify how much).** Used 14% of each
   axis's own span as padding on both ends (`paddedDomain` in
   `parallel-plot.tsx`), computed fresh from the live `listings` array via
   `useMemo` rather than hardcoded per-axis constants — so the chart would
   still work correctly if the listing set changed. Arbitrary judgment call,
   chosen to keep line endpoints visually clear of the axis's own tick-label
   text without wasting so much vertical room that the polylines flatten.

5. **`role="img"` + a computed `aria-label` on the SVG, instead of a data
   table (accessibility approach for the chart, method unspecified).** Since
   the same underlying data is already fully exposed as accessible text in
   the product-preview listing cards and the stat-callout `<dl>` next to the
   chart, I treated the SVG itself as a single labeled graphic (its
   `aria-label` states listing count, all five axis names, and the current
   priority axis + winner) rather than duplicating every value into a
   sr-only table — judgment call favoring not duplicating content that's
   already readable elsewhere on the page.

6. **Display face: mono over grotesk/wide (brief's own diversity note flags
   mono as least-recently-used by winners, doesn't mandate it).** Picked
   `--font-display-mono` (JetBrains Mono Display) for every heading, stat
   value and folio numeral — it reads as analytical/precise, which fits a
   page whose entire premise is "read the numbers across five axes," and
   its tabular digits pair naturally with the plot's own tick labels and the
   `tabular-nums` price figures throughout.

7. **Self-review pass.** Read all five files in full after writing: braces/
   parens/JSX balance cleanly, no `TODO`/stubs, no `Math.random`/`Date.now`/
   bare `new Date()` anywhere, no `outline-none` on any element (grepped for
   the literal string — zero matches), every interactive element uses the
   `focus-visible:outline-2 focus-visible:outline-offset-2
   focus-visible:outline-[color]` pattern only. Exactly three font-weight
   classes render on the page — `font-normal` (400), `font-semibold` (600),
   `font-extrabold` (800) — including inside the inline SVG, where I caught
   and fixed a stray `fontWeight={700}` on the active-axis label (would have
   been a fourth weight) down to 600. Also caught and fixed: a `.sort((a) =>
   ...)` comparator that only read one argument (replaced with an explicit
   filter/concat partition, since a single-argument "comparator" isn't a
   real comparator even though V8 happens to order it consistently); a
   `★` glyph in the seller-rating axis formatter, replaced with `/5` to rule
   out any ambiguity with the "no emoji" static check even though U+2605 is
   a symbol rather than an emoji-presentation codepoint; and every
   `text-zinc-500` instance that sat on a tinted (`bg-zinc-50`) rather than
   plain-white background, bumped to `text-zinc-600` per the tinted-surface
   floor rule in §3. Single `h1` (hero) plus exactly four `h2`s (one per
   remaining section), no `h3` anywhere, so there's no heading-skip to
   avoid. Every `next/image` has `alt`, `fill`, a fixed `aspect-[4/3]`
   container with a `bg-zinc-100` reserved background, and its match/grade/
   verified/discount badges sit in a row below the photo, never overlaid.
