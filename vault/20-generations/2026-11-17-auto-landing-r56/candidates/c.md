# Candidate C — Sift

## 1. Concept

**Sift** — a trustworthy-minimalist, light-theme resale landing page built around a sequential
swipe deck: pass/like one secondhand find at a time, and every decision deterministically
reweights a live tag-based preference profile that re-ranks a "Recommended for you" rail and is
cited by name all the way down to the closing CTA.

## 2. Accent — lime — contrast arithmetic

Base light theme: bg `#FFFFFF`, fg `text-zinc-900` (`#18181B`), muted floor `text-zinc-500`
(`#71717A`-family) on white/`zinc-50`, raised to `text-zinc-600`/`text-zinc-700` on any
`zinc-100`+ tinted surface (badges, pill tracks).

Relative luminance via sRGB: for channel `c∈[0,255]`, `c' = c/255`; if `c' ≤ 0.03928`,
`c_lin = c'/12.92`, else `c_lin = ((c'+0.055)/1.055)^2.4`. `L = 0.2126R + 0.7152G + 0.0722B`.
Contrast `= (L_light+0.05)/(L_dark+0.05)`. White: `L = 1`.

- **Base fill — `lime-700` `#4D7C0F`** (large fills: buttons, discount pill, bars, CTA):
  `R=77,G=124,B=15` → `R_lin≈0.0743, G_lin≈0.2013, B_lin≈0.0048` → `L≈0.1601`.
  Contrast vs white bg = `1.05 / 0.2101 = 5.00 : 1`. Clears 3:1 (large-fill/non-text floor)
  comfortably, and in fact also clears 4.5:1 normal-text AA — used anyway.
- **Small-text/icon/focus-ring tint — `lime-800` `#3F6212`**: `R=63,G=98,B=18` →
  `R_lin≈0.0497, G_lin≈0.1222, B_lin≈0.0061` → `L≈0.0984`.
  Contrast vs white bg = `1.05 / 0.1484 = 7.08 : 1`. Used for the match-badge text/icon, the
  "Step" eyebrows, and as the literal focus-ring color (`#3F6212`).
  **Note on the brief's "lighter tint" wording**: that instruction assumes a dark background,
  where a *lighter* tint raises contrast. This candidate's theme is light, so the arithmetic
  inverts — a *darker* shade of the same hue is what raises contrast against a white bg. I kept
  the hue and derived a darker tint instead; see §4 item 2.
- **Text on a filled accent swatch** (e.g. the discount pill, `bg-lime-700`):
  - White text vs `lime-700`: same pair as above, symmetric ratio = **5.00 : 1** → passes 4.5:1
    normal-text AA at any size.
  - Dark ink (`zinc-900` `#18181B`, `L≈0.0092`) vs `lime-700` (`L≈0.1601`): contrast =
    `0.2101 / 0.0592 = 3.55 : 1` → fails normal-text AA, only clears the 3:1 large-text/non-text
    floor.
  - **Decision**: white text is used on every filled `lime-700` swatch, at every size (discount
    pill, both CTA buttons) — dark ink on filled accent is never used anywhere on the page, to
    avoid the 3.55:1 trap entirely rather than tracking which instances are "large enough."

## 3. Body container width & line-length arithmetic

Constant from the brief: Pretendard-mixed body text averages **0.44em per character**, so
`chars-per-line = container-px ÷ (0.44 × font-size-px)`.

Chosen: **16px** body font, **500px** container (`max-w-[500px]`), used identically for the hero
subhead, the ValueSplit intro paragraph, and the closing-CTA paragraph (all three were
standardized to 16px specifically so this one calculation holds everywhere a 500px container is
used — earlier drafts had 15/15.5px variants on the same container, which would have pushed the
char count past target at in-between viewport widths, so they were unified instead of
double-checked three separate times).

`500 ÷ (0.44 × 16) = 500 ÷ 7.04 ≈ 71.0` characters per line — inside the ~70 target, under the 75
ceiling.

## 4. 브리프에 없던 것 (things the brief left for me to invent)

1. **Brand name + product domain.** The brief fixed the device, theme, accent and display face
   but not a brand name or what's being resold. I invented **"Sift"** and a small secondhand
   streetwear/accessories catalog (sneakers, outerwear, bags, accessories) because the swipe
   mechanic reads cleanly against visually distinct product photos.
2. **Light-theme accent tint direction.** The brief's §2 language ("derive a lighter tint... for
   small text/icons/focus rings") is written for a dark background, where lightening a hue raises
   its contrast. Candidate C is light-themed, so lightening would have *lowered* contrast against
   white. I derived a **darker** tint (`lime-800`) instead, computed its contrast independently
   (7.08:1, see §2), and used it everywhere the brief calls for the "tint" role.
3. **Non-empty default profile.** A profile built purely from decisions is uniform/empty before
   the first swipe, which the brief explicitly forbids as a default. I added a documented,
   non-personal **baseline seed** (`Sneakers: 3, Streetwear: 2, Mid: 2`, everything else `1`) in
   `lib.ts` as a fixed constant separate from the decision-derived deltas — never re-derived from
   a real action, only ever added to by one.
4. **Match-percentage normalization.** The brief asks for a live "match %" but not a formula. I
   normalized each listing's weighted-tag fit score against `(current max tag weight × 3)` and
   clamped the result to a 30–99 display band, so a fresh baseline profile never reads as a
   literal 0% or 100%.
5. **Tie-break rule for ranking and for "top trait."** Fit scores can tie (most visibly at the
   baseline). Both `topTrait()` and `rankByFit()` break ties by the listing/tag's fixed position
   in the canonical `LISTINGS`/`TAGS` arrays — deterministic and immune to the "unguarded reduce
   returns the same label for both extremes" trap the brief warns about, since I only ever compute
   a single maximum (never a most/least pair from the same comparator).
6. **Deck-complete state.** The brief doesn't specify what happens after all 10 cards are decided.
   I added a completion panel in `DeckCard.tsx` with a "Start over" reset, rather than letting the
   component render nothing/undefined.

## 5. Confirmations

- **Rendered weights: exactly 3** — `font-normal` (400, body copy/captions), `font-semibold` (600,
  labels/buttons/badge text/card titles), `font-extrabold` (800, the h1/h2/h3 headings and the
  wordmark). No `font-bold`, `font-medium`, `<strong>`/`<b>`, or inline `font-weight` appears
  anywhere in the route (verified by search across every file in `r56/c/`).
- **Display face**: `var(--font-display-wide)` only, applied via inline `style` in `Hero.tsx`
  (h1), `ValueSplit.tsx` (h2), `SocialProof.tsx` (h2), `ClosingCta.tsx` (h2), and `Client.tsx`
  (the "Sift" wordmark in the header and footer). `var(--font-display-grotesk)` and
  `var(--font-display-mono)` are not referenced anywhere in this route.
- I did not open, list, or read any other candidate's files, any sibling `a/`/`b/` folder, or any
  `DECISION.md`/`SCORES.md` in this repo at any point while building this candidate.
