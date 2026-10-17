# Candidate b — Unlock Your Savings

## Concept

The device is a row of five independent switches — Free local pickup, Bundle 2+ items,
First-time buyer, Off-peak pickup window, Student verified — each worth a fixed dollar
amount off a $140 listing (a Shearling Field Jacket). Flipping any combination on or off
drives a hand-built SVG waterfall chart: a full-height base-price column, a floating bar
for each currently-enabled condition that steps the running total down by exactly its
dollar amount (with dashed connector lines linking each bar's ending level to the next
bar's starting level, the signature waterfall "step"), and a highlighted dark final column
showing the price the buyer actually pays. The same `waterfall` result object feeds a
live-priced product card (match %, condition grade, verified-seller badge, live discount
pill) that is rendered inside `Hero.tsx`'s own return statement, repeated in compact form
next to the chart, and cited again — with the live final price, live dollar savings, and
live retail-discount percentage — in the Value section and the closing CTA, so no number
on the page goes stale once a visitor starts flipping switches.

## Accent contrast calculations

Chosen teal: a two-tint system rather than one flat hex, because a single mid-teal cannot
clear AA in both directions the brief asks for (teal-on-white text *and* teal-on-ink text).

- `accent` (graphic fill / large text / borders): `#0D9488` (teal-600)
- `accentDark` (small/body text on white, button fills, focus rings): `#0F766E` (teal-700)
- `accentLight` (reserved for small text/icons on a dark-ink surface — see note below): `#2DD4BF` (teal-400)

Computed via the standard WCAG relative-luminance formula (sRGB → linearize → `L`,
contrast = `(L_light + 0.05) / (L_dark + 0.05)`):

| Pair | Ratio | Verdict |
|---|---|---|
| `#0F766E` (accentDark) text on `#FAFAFA` (bg) | **5.24 : 1** | Passes AA for any text size |
| `#0F766E` (accentDark) text on `#FFFFFF` | **5.48 : 1** | Passes AA for any text size |
| White text on `#0F766E` (accentDark) fill — buttons, discount pill | **5.48 : 1** | Passes AA |
| White text on `#0D9488` (accent) fill | **3.74 : 1** | Large/bold text only (≥24px or ≥19px bold) — this is why buttons use accentDark, not accent |
| `#0D9488` (accent) vs `#18181B` (ink) | **3.24 : 1** | Passes the 3:1 *large-text* floor only, not small text |
| `#0F766E` (accentDark) text on `#CCFBF1` (accentSoft chip bg) | **4.86 : 1** | Passes AA — used for the "AI match %" chips |
| `#2DD4BF` (accentLight) vs `#18181B` (ink) | **9.52 : 1** | Passes comfortably, reserved for small text/icons if a dark-ink panel is ever added |
| `#2DD4BF` (accentLight) vs `#FAFAFA` | **1.78 : 1** | Fails — never use accentLight on a light surface |

Working: for `#0F766E` → sRGB 0.0588/0.4627/0.4314 → linearized 0.00478/0.1811/0.1557 →
`L = 0.1418`. `#FAFAFA` linearizes to `L = 0.9552` per channel. Contrast
`(0.9552+0.05)/(0.1418+0.05) = 5.24`. Same method for every row above.

Net decision: **accentDark (`#0F766E`) is the only teal ever used as text color**, on
white/near-white or on the accentSoft chip tint — both clear AA. **accent (`#0D9488`) is
used only for the waterfall's floating discount bars** (a graphic fill with its own muted
stroke outline for non-text contrast, not relied on for embedded text) and for borders. The
page never ended up needing teal text on a true dark-ink background, so `accentLight` is
computed and reserved per the brief's instruction to log both directions, but isn't
load-bearing on this particular layout.

## Body line-length calculation

Constant per brief: average character width ≈ 0.44em. Target ~70 characters per line
(hard ceiling 75), using the `ch`-unit ban (0.44em, not `ch`).

Body paragraphs throughout (Hero subhead, Value/ClosingCTA/SocialProof copy) are set at
`text-base` (16px) inside a `max-w-[31rem]` container (496px):

```
characters per line = container_width_px / (0.44 × font_size_px)
                     = 496 / (0.44 × 16)
                     = 496 / 7.04
                     ≈ 70.45 characters
```

70.45 sits right at the 70-character target and under the 75-character ceiling, so
`max-w-[31rem]` at `text-base` was used consistently as the one body-paragraph container
size across every section instead of varying it per section.

## 브리프에 없던 것 (What the brief didn't specify)

1. **① Exact dollar amounts per toggle and the base/retail prices.**
   **② Decided:** base listing price $140, retail $210, and per-condition amounts
   Pickup $8, Bundle $14, First-time buyer $10, Off-peak $6, Student $9 (max stack $47,
   final price floor $93, ≈56% off retail with everything on).
   **③ Why:** the brief specifies the *device* and *output shape* but not the actual
   numbers. I picked a round, legible base price and condition amounts that are each
   visually distinct on the chart (no two conditions worth the same dollar amount, so the
   bars are never confusingly identical in height) and that keep the worst-case bar count
   (7: base + 5 discounts + final) readable in a single 640px-wide SVG.

2. **① Fixed catalog order vs. click order for the waterfall.**
   **② Decided:** the waterfall always walks toggles in one fixed order (Pickup, Bundle,
   First-time, Off-peak, Student) regardless of the order a visitor actually clicks them
   in; only bars for currently-off conditions disappear, the rest hold their position.
   **③ Why:** a waterfall that reshuffled bar order based on click sequence would be
   disorienting and non-deterministic-feeling even though the math is still a pure
   function of state. A fixed order makes the chart's layout predictable and makes
   "4th distinct interaction" (the itemized `<details>` breakdown) read in a stable order
   too.

3. **① How a floating/discount bar's geometry relates to the base and final bars
   (connector logic).**
   **② Decided:** every segment stores `priceStart`/`priceEnd`; base and final segments set
   both to the same value (so they render as full columns from $0), discount segments set
   them to the running total before/after. Connector dashed lines are drawn uniformly at
   `scaleY(segment.priceEnd)` between every consecutive pair, which happens to line up
   correctly for base→first-discount and last-discount→final too.
   **③ Why:** the brief asks for "a labeled bar segment or a connected step in a waterfall
   shape" but leaves the geometry up to the builder; a single uniform formula (rather than
   special-casing base/final) kept the SVG layout code short and bug-resistant to the
   variable bar count (2 to 7 bars depending on toggle state).

4. **① Non-text contrast of the chart's own bars and the toggle track, which have fills too
   light to pass 3:1 against white on their own.**
   **② Decided:** gave every waterfall bar a solid `COLOR.muted` (zinc-600) stroke outline,
   and gave the toggle switch's "off" track a `COLOR.muted` border, rather than relying on
   fill color alone.
   **③ Why:** the brief's ghost-number note ("axe's color-contrast checks visible text
   nodes regardless of aria-hidden") made me check every light-gray fill I was about to use
   for a graphical object (the base bar's `#D4D4D8`/`zinc-300` fill, the toggle's
   `zinc-300` off-track) and found both fail 3:1 against `#FAFAFA`/white on fill alone
   (1.48:1 and 1.48:1 respectively). WCAG 1.4.11 allows either the fill or a bordered
   outline to carry the 3:1 requirement for a graphical object, so adding a `zinc-600`
   border (7+:1) to each was the fix, rather than darkening the fills themselves and
   losing the intended light/dark bar distinction.

5. **① Whether the muted-text floor should vary by surface, as the brief allows (zinc-500
   on near-white vs. zinc-600 on tinted surfaces).**
   **② Decided:** used a single `zinc-600`-equivalent (`#52525B`) for *every* muted-text
   instance on the page, regardless of whether it sits on `#FAFAFA`, `#FFFFFF`, `#F4F4F5`,
   or the teal-tinted `accentSoft` chip background, instead of switching between a
   zinc-500 and a zinc-600 token depending on surface.
   **③ Why:** several components (the toggle condition cards, the "AI match" chips) change
   background color live, between white and the teal-tinted `accentSoft`, as a toggle is
   switched on. Tracking two separate muted tokens and swapping them per-state added
   complexity for a marginal gain (zinc-500 would only have saved a small amount of visual
   weight on the purely-white surfaces). Computed numbers for both reference points, since
   the brief requires logging them even though I standardized on one: `#52525B` vs
   `#FAFAFA` → **7.41:1**; `#52525B` vs `#F4F4F5` (zinc-100, the darker "tinted surface"
   case) → **7.04:1**; `#71717A` (zinc-500, the lighter-surface floor) vs `#FAFAFA` →
   **4.63:1** (passes AA but with much less margin, and would have failed on the
   `accentSoft` chip background at ~4.3:1 — close enough to the AA line on an
   automatically-swapping teal background that I didn't want to risk it). The darker,
   uniform token removed that risk entirely.

6. **① What the five toggles' captions should say, and how to fit a full caption plus a
   dollar amount inside a toggle card without it feeling like two unrelated sentences.**
   **② Decided:** one combined sentence per card — a short "who qualifies" clause followed
   by "Saves $X." — truncated to one line via CSS `truncate` on narrow viewports rather
   than wrapping to two lines.
   **③ Why:** the accessible name on the switch button itself (`aria-label`) already
   contains the full label + dollar amount, so if the visible caption truncates on a very
   narrow viewport, screen-reader users and sighted users who widen the viewport both still
   get the complete information; the truncation is a cosmetic fallback, not a data-loss
   issue.

7. **① Whether "at least one of three value stats is live" (brief's floor) should become
   two live stats plus one static, or stay at exactly one.**
   **② Decided:** made two of the three Value-section stats live (your price right now,
   your dollar savings + %) and kept the third as a static catalog-wide benchmark (68% of
   buyers qualify for at least one condition).
   **③ Why:** going beyond the brief's stated minimum here directly reinforces the
   "manipulation survives to the CTA" requirement — by the time a visitor reaches the
   closing section, they've already seen the same live number recomputed three separate
   times (hero caption, device card, value stat), so the final CTA's live price doesn't
   feel like an isolated gimmick confined to the chart.

8. **① How to announce live price changes to assistive technology without being
   disruptive.**
   **② Decided:** added a single `aria-live="polite"` visually-hidden paragraph in
   `LandingPage.tsx` that restates the current price/savings/condition-count sentence,
   rather than putting `aria-live` on the SVG chart or the product card directly.
   **③ Why:** the brief requires each toggle to have a correct accessible name/state, but
   says nothing about announcing the *consequence* of a toggle flip. A single page-level
   live region avoids multiple overlapping announcements firing from the chart, the card,
   and the CTA simultaneously on every click.

9. **① Where the "4th distinct interaction" (beyond the toggle row, scroll reveal, and the
   live product-preview binding) should come from.**
   **② Decided:** added two: a native `<details>/<summary>` itemized breakdown (expand/
   collapse, also serving as a fully semantic text alternative to the SVG chart) and a
   `<select>` to sort the three static "similar listings" by savings/price/match.
   **③ Why:** the brief only requires a minimum of four; I picked interactions that each
   pull double duty — the `<details>` doubles as an accessibility fallback for the chart,
   and the sort `<select>` doubles as the "rich card data" variety the brief asks for in
   the product-preview section, rather than adding a purely decorative fifth interaction.

10. **① Photo sourcing for the featured and comparison listings.**
    **② Decided:** reused four fixed Unsplash photo IDs already present elsewhere in this
    catalog (`1509631179647-0177331693ae`, `1553062407-98eeb64c6a62`,
    `1524805444758-089113d48a6d`, `1495121605193-b116b5b09a56`) rather than picking new,
    unverified IDs.
    **③ Why:** this session has no network access to verify a brand-new Unsplash ID
    resolves to a real photo before publishing; reusing IDs that other rounds in this same
    repo already render successfully (and that `next.config.ts` already allow-lists via
    `images.unsplash.com`) removes that risk entirely while still satisfying "a
    deliberately-chosen fixed Unsplash URL."
