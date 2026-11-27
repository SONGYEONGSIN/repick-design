# Candidate c — Seller Payout Simulator

## Concept

A seller-facing reframe of the repick landing page built around a single-screen payout
calculator: three stepper/counter inputs (0–9) for Electronics, Fashion and Home let a
prospective seller dial in roughly how many items they're planning to list, and every other
number on the page — a prominent live total in the hero, a full itemized breakdown table in
the device section, a horizontal stacked bar showing the category mix of that payout, one live
stat in the value split, and the dollar figure in the closing CTA — recomputes immediately from
that same state, with no wizard, no steps and no "next" button. The whole page is written in a
confident, operational "here's what you'll actually get" voice rather than a buyer-facing
discovery pitch: nav labels (Payout calculator / Pricing & fees / Seller stories), the hero
headline ("Count what you're selling. Watch it turn into a number."), and the social proof are
all seller-voiced, and the mandatory hero proof card is swapped for a seller-appropriate
equivalent (see below) instead of forcing in buyer-only metrics. Theme is dark, accent is a
sky/light-blue hue, and headlines use no display face — scale and weight carry all the
typographic impact.

## Accent contrast calculations

Dark ink/background: `#0B0B0F`. Chosen accent family: Tailwind's `sky` scale, which resolves
to exactly the hex values below (verified against the published swatch values, not eyeballed).

Relative-luminance WCAG contrast (standard sRGB → linear → `0.2126R + 0.7152G + 0.0722B`
formula, then `(L_light + 0.05) / (L_dark + 0.05)`):

- **ACCENT `#0EA5E9`** (sky-500): vs white `#FFFFFF` → **2.77:1** (fails AA at any text size —
  never used as text on a white surface, and never used *under* white text). vs ink `#0B0B0F`
  → **7.09:1** (clears AA for text of any size). Used for: CTA button fills (with dark-ink text
  on the fill, not white — see below), the Electronics stacked-bar segment, borders/soft
  backgrounds (`ACCENT_SOFT_BG`/`ACCENT_SOFT_BORDER`).
- **ACCENT_TINT `#7DD3FC`** (sky-300): vs white → **1.67:1** (fails, same rule). vs ink →
  **11.78:1** — the extra headroom this tint exists for: small captions/eyebrows, icons, the
  focus ring, and the Fashion stacked-bar segment.
- Because neither shade clears AA against white, every solid accent button uses **dark ink
  text on the accent fill** (`#0B0B0F` on `#0EA5E9`, same 7.09:1 pair read the other direction)
  rather than white-on-accent, which this catalog's default violet accent could get away with
  but sky cannot.
- A third, deeper tone `ACCENT_DEEP #0369A1` (sky-700) was added for the Home stacked-bar
  segment so three categories stay in one hue family instead of reaching for an unrelated hue;
  it's used only as a decorative fill, paired with a text legend, never as text.
- Muted body text floor: `zinc-400 #A1A1AA` vs ink → **7.66:1**, used as this route's muted-text
  color throughout. I initially used `zinc-500 #71717A` for several small uppercase captions
  and table headers and computed it at **4.06:1** against ink — below the mandated zinc-400
  floor and below AA for normal-size text — so every `zinc-500` instance was replaced with
  `zinc-400` before finishing.

## Body line-length calculation

Constant: average character width ≈ 0.44em. Primary body paragraphs (hero subhead, section
intros, closing CTA paragraph, testimonial quotes) are capped at a literal `505px` max-width,
not a `ch` unit.

- At the base body size, `16px`: `0.44 × 16 = 7.04px` per character.
  `505 ÷ 7.04 ≈ 71.7` characters per line — inside the 70–75 target band.
- At the `sm:text-lg` (`18px`) size the hero subhead steps up to on wider screens:
  `0.44 × 18 = 7.92px` per character. `505 ÷ 7.92 ≈ 63.8` characters per line — shorter, not
  longer, than the 16px case, so it stays safely under the ceiling rather than needing a
  second, wider container for that breakpoint.

## Hero proof-card note

Match % and discount % — two of the canonical four hero-proof elements this catalog otherwise
uses — are **deliberately omitted**, not forgotten: neither has a seller-facing meaning. A
seller isn't being matched against anything, and their prospective listing has no "discount"
until it's actually priced and sold. In their place, `Hero.tsx`'s own return statement renders a
real **sold comparable** pulled from fixed, deterministic data in `data.ts` (`SOLD_COMP`): item
name ("Sony WH-1000XM4 headphones"), category, **condition grade** ("Like New"), the actual sold
price, and a separate **"Verified sale" badge** row (never overlaid on the item art itself — it
sits in its own flex row below a border, per the no-badge-on-photo rule). The "photo" is a
generated CSS/icon placeholder (a fixed-size, fixed-background-color box with a centered Lucide
`Headphones` icon) rather than a real Unsplash URL — the brief explicitly allows "photo/
placeholder" here, and guessing an Unsplash photo ID I couldn't verify felt like the riskier
choice for a required proof element, so I took the brief's own "likely safer, simpler" option.
This card sits directly beside the hero's live, `aria-live`-announced running payout total, so
the two sanctioned proof elements (condition grade + verified-sale badge) and the live estimate
are genuinely in the same component, not just the same page.

## 브리프에 없던 것 (What the brief didn't specify)

1. ① Whether the stacked-bar "category mix" percentage should be of total **item count** or
   total **payout dollars**. ② I chose payout dollars. ③ The device is explicitly a *payout*
   simulator — the running total at the top is a dollar figure, and a dollar-mix bar ties
   directly into that number (e.g. a seller can see that Electronics is 3 items but a much
   larger slice of the money), which reads as more useful than an item-count mix that ignores
   price entirely.

2. ① How to keep each displayed row's three numbers (subtotal / fee / payout) from drifting
   apart under rounding. ② Subtotal is always a whole-dollar integer by construction (every
   `avgPrice` is a whole dollar, multiplied by an integer count), the fee is rounded exactly
   once (`Math.round(subtotal * feeRate)`), and payout is then taken as `subtotal - fee` on that
   already-rounded fee rather than independently rounded. ③ This guarantees the three displayed
   numbers always add up correctly on screen, the same anti-drift principle this catalog's
   existing payout-math component already uses — a seller doing the subtraction themselves
   should never get a different answer than what's shown.

3. ① Whether stacked-bar segment percentages across categories are guaranteed to sum to exactly
   100. ② They are not forced to — each `sharePct` is independently rounded from its own
   `payout / totalPayout`, so in edge cases the displayed percentages could be off by ±1 of
   summing to 100. ③ Forcing an exact sum (e.g. giving the rounding remainder to the largest
   category) adds a second, more opaque rule for a cosmetic ±1% discrepancy that's extremely
   unlikely to appear with only three categories and typical counts; I judged the simpler,
   transparent per-row rounding a better trade for a route built around "no hidden math."

4. ① Default (first-paint) counter values. ② Electronics 3, Fashion 5, Home 2. ③ The brief
   requires the breakdown, bar and totals to never start blank — these give a non-trivial,
   readable mix across all three categories on first load, instead of an empty or degenerate
   state, without implying any particular "typical" seller profile beyond what the reset
   button's label ("typical first listing") already claims.

5. ① Per-category average price and fee rate — the brief requires these to be fixed and
   deterministic but leaves the actual numbers open. ② Electronics $165 avg / 14% fee, Fashion
   $36 avg / 20% fee, Home $58 avg / 17% fee. ③ Modeled loosely on real resale categories:
   higher-ticket, lower-volume electronics get a lower take rate; lower-ticket, higher-volume
   fashion gets a higher one — giving the breakdown and the "how fees work" framing something
   real to point at rather than three identical numbers.

6. ① What satisfies "the breakdown-table interaction" as a *distinct* required interaction from
   the steppers themselves. ② Each visible row gets its own "Math" disclosure button
   (`aria-expanded`/`aria-controls`) that expands an inline row showing the literal arithmetic
   for that category (count × avg price − fee % = payout, plus its share of the total). ③ This
   gives the table a real interaction of its own, rather than treating "rows change when you
   move a stepper" (which is really the steppers' interaction, just rendered in table form) as
   satisfying that requirement twice.

7. ① Whether a 4th interaction beyond steppers/scroll/table-disclosure was needed, and what it
   should be. ② A "Reset to a typical first listing" button in the device section that snaps all
   three counters back to the fixed defaults (disabled when already at defaults). ③ It's a
   genuinely distinct state-mutating control rather than a cosmetic addition, and it reinforces
   the "no wizard, just adjust the numbers directly" framing — resetting is just another direct
   adjustment, not a step backward through a flow.

8. ① Whether a header/nav component was required given the 5-section list didn't mention one.
   ② Added a minimal sticky `Header.tsx` with seller-voiced nav labels and a "List an item" CTA.
   ③ Every other candidate in this catalog carries a header for wayfinding and jump-to-section
   anchors; omitting one here would make this single page an outlier for no stated reason, and
   the nav labels double as an easy, cheap way to reinforce the seller voice a second time.

9. ① Single-source-of-truth architecture for the shared counter state. ② `LandingPage.tsx` holds
   the one `counts` object in `useState`; every section receives `counts` as a prop and calls
   the pure, already-memo-free `computeBreakdown(counts)` itself rather than receiving a
   precomputed `breakdown` object. ③ `computeBreakdown` is a cheap, deterministic pure function
   of `counts` — recomputing it in each consumer is simpler than threading a second derived prop
   through the tree, and it removes any chance of a child reading a stale `breakdown` prop from
   a previous render.

10. ① Whether to use `next/image` for the sold-comparable item or a placeholder, given the
    "Raw `<img>` banned" rule names `next/image` first. ② Used a pure CSS/SVG-icon placeholder,
    with no `<img>` or `next/image` element at all for that card. ③ The "Raw `<img>` banned, use
    `next/image`" rule only binds when an actual raster photo is being shown; the proof-card rule
    itself explicitly allows "photo/placeholder," and a placeholder sidesteps the risk of citing
    an unverifiable Unsplash photo ID for a mandatory, judge-visible element.
