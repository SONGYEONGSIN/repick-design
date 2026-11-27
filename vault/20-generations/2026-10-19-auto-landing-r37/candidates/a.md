# Candidate a — Instant Estimate

## Concept (one line)

A type-ahead combobox over a fixed 25-item comp dataset: pick a result and the hero's payout
range, its three nearest comparable sales, the value-section stats, and the closing CTA all
recompute live from the exact same `computeEstimate()` function — nothing downstream of the
search is a hardcoded example.

## Full writeup

The device is a custom WAI-ARIA combobox (`role="combobox"` + `role="listbox"`/`role="option"`,
`aria-activedescendant`, never a native `<select>`) wired to a fixed, hand-authored dataset of 25
items spread across five categories (Sneakers, Denim & Outerwear, Bags & Leather, Watches &
Accessories, Streetwear Tops — see `data.ts`). Typing filters by substring match against
`"brand title category"`; arrow keys move a virtual-focus index through the results, Enter
selects, Escape closes. No network call anywhere, no `Math.random`/`Date.now`.

Selecting a result computes, via `estimate-math.ts`:

```
adjusted = item.sold × GRADE_FACTOR[item.grade] × CATEGORY_FACTOR[item.category]
mid      = round(adjusted × TAKE_RATE)       // TAKE_RATE = 0.88
fee      = round(adjusted − mid)
low      = round(mid × 0.91)
high     = round(mid × 1.09)
```

`item.sold` is that item's own fixed "most recent comparable sale" field; `GRADE_FACTOR` (A+ 1.00
→ B- 0.68) and `CATEGORY_FACTOR` (sneakers 1.08 → watches 0.93) are fixed per-grade/per-category
multipliers; `TAKE_RATE` is Repick's constant seller-payout share. This is the same pure function
called from Hero, ValueSection and ClosingCTA — never three separate copies of similar-looking
math. `getComparables()` returns the 3 same-category items (excluding the selection) sorted by
`|sold − selected.sold|` ascending, so the comp cards shown are genuinely the closest priced
sales, not just "the next 3 rows in the array."

Layout: a stacked, full-width hero (headline + subhead + single CTA on top, full-bleed search
card below it) rather than a side-column split, so the proof grid is a 1-payout-panel +
3-comp-card row (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`) — deliberately not the flagged
`col-span-7`/`col-span-5` ratio, and not a column split at all. Product imagery is five
hand-built inline-SVG silhouettes (sneaker, jacket, bag, watch, hoodie — see `CategoryArt.tsx`),
each inside a fixed-aspect, reserved-background container, with badges (grade, AI-authentication,
price-gap) in a row below the art, never overlaid on top of it.

## Accent contrast calculations

Assigned hue: **emerald** (not teal/orange/violet/rose, all flagged as overused in the last four
winning rounds). Background/ink: `#0B0B0F` / `#FFFFFF`. Computed with the standard WCAG
relative-luminance formula (sRGB → linear, `L = 0.2126R + 0.7152G + 0.0722B`, contrast =
`(L1+0.05)/(L2+0.05)`):

| Role | Hex | vs. white `#FFFFFF` | vs. bg `#0B0B0F` | vs. surface `#121714` |
|---|---|---|---|---|
| `accent` (base) | `#10B981` | 2.54:1 | 7.74:1 | 7.15:1 |
| `accentFill` (button/pill bg) | `#047857` | 5.48:1 | 3.58:1 | 3.31:1 |
| `accentTint` (small text/icons/focus ring) | `#6EE7B7` | 1.52:1 | 12.89:1 | 11.89:1 |
| `muted` (stock value, kept as-is) | `#A1A1AA` | — | 7.66:1 | 7.07:1 |

Decisions from these numbers:
- `accentFill` (`#047857`) is reserved for small **white** text/labels on an accent fill (the
  `${priceGap} price gap` pill, the primary CTA buttons) — 5.48:1 clears AA (4.5:1) for
  body-size text with real margin, matching the hard rule that small text on an accent fill must
  be white, never dark ink (dark ink would only clear the 3:1 large-text floor here, not the
  4.5:1 small-text floor).
- `accent` (`#10B981`) is used as a 2px non-text border (the `PayoutPanel` outline) and is never
  used as a text color on white — 2.54:1 there fails even the 3:1 large-text floor — but at
  7.15–7.74:1 against this page's actual dark surfaces it would also be safe as body-size text
  directly on `bg`/`surface` if a future revision needed that; this round it is kept to
  borders only.
- `accentTint` (`#6EE7B7`) carries every small text/icon/focus-ring role (eyebrow labels,
  badge icons, search-input focus ring, category/grade captions) and never sits on white —
  11.9–12.9:1 against both dark surfaces clears AAA with room to spare.
- `muted` (`#A1A1AA`) is kept at the catalog's stock value since 7.07–7.66:1 against this
  page's actual `bg`/`surface` clears AA comfortably at body-text size; the brief's ~2.5:1
  warning is about white backgrounds, which this page never uses.

## Body line-length calculation

Every flowing paragraph (hero subhead, section intros, value-section captions) uses a single
constant: font size **16px**, container **`max-w-[500px]`**. Using the required constant
(average character advance ≈ `0.44em`, not the CSS `ch` unit, which in Pretendard/Inter would
overstate the true fit by roughly a third):

```
chars-per-line = container-width-px ÷ (0.44 × font-size-px)
               = 500 ÷ (0.44 × 16)
               = 500 ÷ 7.04
               ≈ 71.0 characters
```

71 sits just above the ~70 target and comfortably under the 75 ceiling, so this single
width/size pair is reused everywhere a flowing paragraph appears rather than varying it per
section.

## 브리프에 없던 것 (What the brief didn't specify)

1. **① The exact payout formula.** The assignment asked for "a real calculation ... e.g. based
   on condition grade + category + a fixed take-rate/fee constant" but left the actual numbers
   open. **②** Defined `GRADE_FACTOR` (A+ 1.00 down to B- 0.68, 6 steps), `CATEGORY_FACTOR` (5
   categories, 0.93–1.08) and `TAKE_RATE = 0.88`, applied to each item's own fixed "recent comp
   sold price" field, then split into a `±9%` low/high band around the midpoint.
   **③** I hand-verified all 25 items through this formula with a throwaway Node snippet (not
   part of the shipped page) before committing to it: every result is a sane, positive,
   double-digit-to-low-triple-digit dollar range with `low < high` in every case, so the
   numbers read as plausible resale payouts rather than as an obviously synthetic formula output.

2. **① Whether the selected item's own "sold" field should also drive its displayed discount %
   on comp cards.** The brief didn't say whether the search item needs a "before/after discount"
   display of its own (only the 3 comp cards explicitly need one). **②** Gave every item in the
   dataset both a `retail` and a `sold` field (so discount-% math is available and shown on every
   comp card), but the `PayoutPanel` for the *selected* item itself shows its comp-sale price and
   the computed fee/payout instead of a retail-vs-sold discount line. **③** The selected item is
   framed as "an item you're about to list" (not yet sold), so a before/after discount banner on
   it specifically would misleadingly imply it already sold; the comp cards are explicitly past
   sales, where a discount banner is accurate and is the proof the brief asks for.

3. **① How "closest comp" should be defined.** The brief says 3 comparable sold listings "from
   your fixed dataset (filtered to the same category, excluding the selected item)" but not how
   to pick *which* 3 when a category has more than 3 other members (every category here has 4
   others). **②** Sorted candidates by `|comp.sold − selected.sold|` ascending and took the
   nearest 3, rather than just the first 3 in array order. **③** This makes the comp set
   genuinely respond to *which* item was searched (two items in the same category can surface
   different comps), which is a stronger, more honest "manipulation recomputes real proof" story
   than always showing the same fixed trio for an entire category regardless of selection.

4. **① Disclosure-style copy for "why this is a comp."** Earlier rounds in this catalog used a
   `<details>/<summary>` disclosure toggle for match-reasoning text (flagged this round as a
   convergence risk around the "Why [x] matched/picked this" copy template). **②** Dropped the
   toggle entirely — comp cards show a short, always-visible one-line caption
   (e.g. "The nearest recent sale to your search by price.") instead of a collapsed
   disclosure. **③** This sidesteps the flagged copy template outright, reduces the a11y surface
   (no extra interactive disclosure control to keyboard-test per card), and the reasoning is short
   enough that hiding it behind a click would cost more clarity than it saves space.

5. **① Hero vs. Product Preview differentiation for the comp cards.** Like the generic landing
   skeleton's §3, Product Preview needed to exist as its own section, but the brief's assignment
   text says the 3 comps "render inside the hero's own component" as the mandatory proof.
   **②** Built one `ComparableCard` component with a `compact` variant (small art, no caption —
   used inside Hero, 3-up alongside the payout panel) and an `expanded` variant (larger art, adds
   the one-line caption — used in the separate `#comps` Product Preview section below), both fed
   by the identical `comparables` array computed once in `LandingPage`. **③** Satisfies both the
   hard "proof must be inside hero markup" rule and the generic structure's separate Product
   Preview section, without maintaining two different copies of the comp data or math.

6. **① What the closing CTA's live-tied number should actually be.** The brief's example phrasing
   was "Your [Brand Name] could be worth ~$X — list it today," left otherwise open.
   **②** Headline reads "A {grade} {brand title} estimates at ${low}–${high}," reusing the exact
   `estimate` object (not a re-derived or rounded-differently value) computed once in
   `LandingPage` and threaded down as a prop. **③** Threading the same object (rather than
   recomputing independently in `ClosingCTA`) removes any chance of the hero and the closing
   section ever showing two different numbers for the same selected item due to a formula typo
   or rounding drift between two call sites.

7. **① Category icon set / illustration style.** The brief encouraged "a generated SVG/vector
   illustration" but left the exact visual style open. **②** Built five small hand-authored
   `<svg>` silhouettes (sneaker, jacket, bag, watch, hoodie) as solid-stroke illustrations (not a
   thin blueprint/bracket line-art treatment), each keyed to category and reused by every item in
   that category rather than needing one illustration per item. **③** A per-category (not
   per-item) illustration keeps the dataset lightweight and avoids 25 near-duplicate hand-drawn
   marks, while still giving every comp card a genuine, non-photographic visual rather than a
   flat color block.

8. **① Whether the combobox should default to an empty/placeholder state or a pre-selected
   item.** The brief offered both options. **②** Pre-selected item `s1` (a Nike Air Jordan 1,
   grade A-) with the input pre-filled to its label, dropdown closed on load. **③** This avoids
   ever rendering an empty "search above to see your estimate" box above the fold, which the
   brief itself flags as needing to be handled gracefully if used at all — starting pre-filled
   sidesteps that state entirely while still making the first-ever interaction (typing something
   new) immediately change every live number on the page.
