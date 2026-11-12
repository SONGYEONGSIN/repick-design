# Candidate b — "Window, Not a Point"

## Concept

A dark, near-monochrome emerald landing page for repick built around a single idea: a resale
budget is a *range*, not a single number. The hero leads with an oversized JetBrains-Mono-Display
headline ("Resale that grades itself before you buy.") paired with a right-hand "AI match preview"
panel holding two real listing cards — each with its match %, condition grade, verified badge and
discount shown in a row below the photo, never on top of it — so the proof is visible without any
scrolling or interaction. Section 2 is the assigned device: a **Range Sweep**, a dual-handle price
brush dragged over a 14-bar histogram built from a fixed 24-listing catalog ($42–$1,180). Moving
either edge independently filters the same 24-item array that feeds (a) a 2–3-row card grid of the
listings currently inside the window and (b) a live "{count} of 24 · median $X" readout — both
derived from one shared `filterByRange`/`medianPrice` call in `data.ts`, so neither can lag the
other. The default window ($180–$420) is a deliberately non-trivial "sweet spot" that already shows
9 of 24 listings and a median of $265 on first paint. The value-prop section's middle column and
the closing CTA both restate the *live* filtered count/median/window as props threaded down from
the single `[min, max]` state in `page.tsx` — if a visitor drags the sweep and never scrolls back
up, the closing CTA's number has already moved with them.

## Files written

- `app/src/app/landing-evolve/r40/b/page.tsx` — page shell, lifts `[min, max]` state, assembles sections
- `app/src/app/landing-evolve/r40/b/Hero.tsx` — hero (headline, subhead, CTA, AI match preview cards — all in one component)
- `app/src/app/landing-evolve/r40/b/RangeSweep.tsx` — the dual-handle histogram brush + live grid/readout
- `app/src/app/landing-evolve/r40/b/ValueProp.tsx` — 3-column value prop, middle column ties to live median
- `app/src/app/landing-evolve/r40/b/SocialProof.tsx` — stats row + two testimonials
- `app/src/app/landing-evolve/r40/b/ClosingCTA.tsx` — closing section, restates live filtered count/median
- `app/src/app/landing-evolve/r40/b/ProductCard.tsx` — shared listing card (image + match/grade/verified row + price/discount row)
- `app/src/app/landing-evolve/r40/b/data.ts` — deterministic 24-item catalog, filter/median/histogram helpers
- `app/src/app/landing-evolve/r40/b/Reveal.tsx`, `useMounted.ts` — exact repo-pattern SSR-safe reveal

## Accent usage (emerald)

- Fills: the primary CTA buttons (`bg-emerald-500` with `#0B0B0F` ink text, 7.74:1), the discount
  badge chip (same emerald-500/ink pairing), and the two slider handle knobs (`bg-emerald-400`,
  small and isolated — not a background fill).
- Text/icons: `text-emerald-400` for the eyebrow labels, match-% badge text, section icons
  (ShieldCheck/TrendingUp/UserCheck/Sparkles/Quote/BadgeCheck), stat numerals in the closing CTA
  count, and the in-range histogram bars / active-window band outline.
- Everything else (background, cards, borders, body text) stays zinc/white/`#0B0B0F` — emerald is a
  small fraction of total pixels, never a section background.

## Char-width math (body paragraphs)

Pretendard's real average glyph advance ≈ 0.44em, not 1ch. For the primary body paragraphs (hero
subhead, Range Sweep subhead, closing-CTA paragraph) at `text-base` (16px):

```
px_width / (0.44 × 16px) ≈ target_chars
480px / 7.04px ≈ 68.2 chars
```

So each of those three paragraphs is capped at `max-w-[30rem]` (480px), landing at ~68 characters
per line — inside the 68–70 target band and comfortably under the 75-char ceiling. The narrower
3-column value-prop blurbs intentionally sit below that (text-sm/14px, `max-w-[22rem]` → 352px /
6.16px ≈ 57 chars) since they're secondary column copy, not primary body paragraphs — narrower than
the target is safe, only wider would be a problem.

## Interaction list

1. Hero primary CTA ("Start matching") — hover/focus-visible states, scrolls to the sweep.
2. `Reveal` scroll-trigger entrance (opacity/y, mount-gated, reduced-motion-safe) on the hero
   text block, the hero preview panel, and each major section heading/column — used once per
   view, not on every element.
3. Range Sweep dual-handle drag (pointer-capture per handle) + full keyboard operation
   (`role="slider"` ×2, Arrow/Page/Home/End, live `aria-valuenow`/`aria-valuetext`).
4. Live-filtering card grid + aggregate readout — swaps which of the 24 listings render as cards
   and recomputes "{count} of 24 · median $X" from the identical `filterByRange` result.
5. (bonus) Histogram bar hover tooltip (native `title`, per-bin count + price band) and
   per-card hover (image scale + border tint) on `ProductCard`.
6. Closing CTA restates the live filtered count/window/median — not a hardcoded literal.

## 브리프에 없던 것 (Brief gaps)

① What: the exact dataset shape/size and price values for the 24 listings, and which categories/photos to use.
② Decided: 24 items across 8 categories (3 each: Outerwear, Footwear, Audio, Cameras, Watches, Bags, Bikes, Furniture), hand-placed prices from $42–$1,180, one fixed Unsplash photo id reused per category.
③ Why: the brief only said "e.g. 24 sample listings... $40–$1200"; I picked a round number of categories (8×3=24) so the default window would pull a visually varied mix, and reused one photo per category (not per item) to keep the asset list small and deterministic rather than inventing 24 distinct stock-photo ids I couldn't verify.

① What: how "swapped in/out of view" should look when the filtered set exceeds the visible grid slots.
② Decided: render the first 6 filtered-by-price-ascending items as cards, and show a plain "+N more listings inside this window" text line when the filtered set is larger — both read from the exact same `filtered` array, never a second independent count.
③ Why: the brief explicitly warned against two outputs drifting apart, so I kept one array as the single source of truth for both the visible cards and the "+N more" overflow note and the aggregate readout, rather than inventing a second "capacity" concept.

① What: whether heading levels for card titles and column titles could be `h3` under the hero's `h1` without violating heading-order.
② Decided: `ProductCard`'s listing name is a styled `<p>`, never a heading tag, in every context (hero and sweep grid alike); only true section headings use `h1`→`h2`→`h3` in strict non-skipping order.
③ Why: the same `ProductCard` is reused directly under the hero's `h1` (no `h2` in between) and under the sweep section's `h2`; giving it an `h3` would skip a level in the hero context, so I kept it a non-heading element everywhere instead of writing two variants.

① What: what "a meaningfully narrower default range" should resolve to as actual dollar figures.
② Decided: $180–$420, which seats 9 of the 24 listings (median $265) on first paint — spanning 6 of the 8 categories without needing any interaction.
③ Why: arbitrary but checked against the dataset by hand so the untouched state is visibly non-trivial (neither "almost everything" nor "almost nothing"), per the brief's explicit penalty for inert full-range or empty defaults.

① What: how far to take "dark ink on emerald fill" vs "emerald text on dark" given only buttons/badges were called out by name.
② Decided: applied it consistently to every solid-emerald surface (CTA buttons, discount badge, and nowhere else is emerald used as a text-on-emerald-fill case), and kept all emerald *text* (eyebrows, icons, in-range histogram bars) directly on the `#0B0B0F` page background.
③ Why: the brief's contrast math only calls out the button/chip case explicitly; extending the same rule to the discount badge chip (the only other solid-fill emerald surface) was the conservative reading rather than leaving it under-specified.
