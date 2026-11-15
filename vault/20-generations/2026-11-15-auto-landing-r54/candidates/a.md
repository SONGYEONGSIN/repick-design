# Candidate a — Switchback

Switchback is a resale marketplace for used trail and camp gear. The device is a fixed-sum
"spotlight credit" allocator: four category segments (Tents & Shelter, Packs & Bags, Footwear &
Traction, Layers & Shells) share a stacked bar whose three internal dividers are dragged (or
nudged with arrow keys) to trade credits between the two categories they sit between — moving one
divider changes only its two neighbors, so the total stays at exactly 100 by construction, not by
a rescale pass. Every drag recomputes `computeModel(shares)` in render (no effect, no stored
derived state): a live "demand fit" score (0–100, `100 − Σ|share−demand|/2`, a pure overlap of the
credit split against this week's fixed buyer-demand distribution) and a projected weekly view
count (`Σ share·viewYield`). Both numbers appear inside the hero (next to the bar and on the
currently-spotlighted listing card, same component as the headline), again on a matching card in
the Product Preview grid below, a third time as one of three live-vs-static scenario comparisons
in the Value section ("Your split" vs. "Evenly balanced" vs. "Demand-matched," the latter two with
a "Try this split" button that writes the live state), and a fourth time, still live, in the
closing CTA's headline and body copy. Interactions: (1) divider drag + full keyboard operation
(arrow keys nudge, Home/End snap to the neighbor bound), (2) two "Try this split" preset buttons
that feed back into the same shared state, (3) a native `<details>` "Condition detail" disclosure
per listing card, (4) scroll-triggered `Reveal` entrances on every section after the hero. Theme is
light/white throughout, including the closing section (no dark band). Accent is a single emerald
family at two literal weights — emerald-600 (#059669, 3.77:1 on white, large/non-text only) and
emerald-700 (#047857, 5.48:1 on white, body-size text/icons/focus ring) — plus dark ink
(#0B0B0F, 5.21:1) as the text color on the emerald-600 fill, since white-on-emerald-600 only
clears 3.77:1. Fonts: Pretendard (`--font-sans`) for all body/caption copy, `--font-display-wide`
reserved for the h1 and the closing-CTA h2 only; exactly three rendered weights (400/600/800).
Line-length: hero subhead at 18px uses a 540px container (540/(0.44×18) = 68.2 chars); section
body copy at 16px uses 480px (480/(0.44×16) = 68.2 chars); testimonial quotes at 14px use 420px
(420/(0.44×14) = 68.2 chars) — all under the 75-char ceiling, no `ch` unit used anywhere.

## 브리프에 없던 것

- **What the fixed pool represents and its domain.** The brief said "invent the domain." Decided:
  a weekly "spotlight credit" pool (100 credits) that boosts featured-search placement per
  category, not cash — keeps the device's stakes concrete (more views) without re-deriving a full
  pricing model, and sidesteps the brief's catalog note that `Intl.NumberFormat` compact notation
  caused an SSR/CSR hydration mismatch in a prior round: there is no currency or compact-notation
  formatting anywhere on this page (`toLocaleString("en-US")` with plain `decimal` notation only).

- **Divider-trades-only-its-neighbors mechanics, not a global rescale.** The brief required a
  zero-sum drag across 3–5 categories but not the specific redistribution math, and explicitly
  warned off devices that already exist in this catalog. A prior round's allocator (`r50/a`)
  rescaled all other categories proportionally on every drag; to stay clearly outside that
  mechanic and match the brief's literal "drag dividers between categories" description, boundary
  `i` here only changes the shares of categories `i` and `i+1` — the total is 100 by construction
  (each share is just the gap between two cumulative boundary points), with no separate rescale or
  rounding-remainder pass needed, and no risk of drift.

- **The fit-score formula and the deliberate fit/views tradeoff.** Nothing specified how
  "efficiency" should be computed. Decided: `100 − Σ|share_i − demand_i| / 2` (a symmetric overlap
  of two distributions that only hits 100 at an exact match) paired with an *independent* per-
  category view-yield constant for projected views — so "match demand exactly" and "maximize
  projected views" genuinely disagree at times (verified by hand: default split [40,20,15,25] →
  fit 85 / 5,885 views; demand-matched [32,27,23,18] → fit 100 / 5,752 views). That tension is the
  entire content of the Value, 3-way-split section, rather than three cards that would otherwise
  just restate the same number back.

- **Tie-guard on "dominant/spotlighted" category.** Learned from this catalog's own prior note on
  a naive `reduce` finding the same element for "most" and "least" at a tie: `computeModel` tracks
  a `tieCount` alongside `dominantIndex` and resets it whenever a strictly larger share supersedes
  the running max. When two or more categories tie for the lead, every surface that would
  otherwise name a single "Spotlighted" category (the hero proof card, the Product Preview grid,
  the Allocator's own label row) switches to a neutral "evenly split" framing instead of guessing.

- **Accent contrast arithmetic (computed by hand, sRGB → linear → WCAG relative luminance).**
  `L(white)=1.0`, `L(#059669)=0.2285`, `L(#047857)=0.1417`, `L(#0B0B0F)=0.0035`,
  `L(#71717A)=0.1673`, `L(#52525B)=0.0856`. Emerald-600 vs. white = (1.05)/(0.2785) = 3.77:1 (large
  text/non-text floor only — used for fills, bars, borders). Ink on the emerald-600 fill =
  (0.2785)/(0.0535) = 5.21:1, which is *why* button/chip text on that fill is dark ink and not
  white (white-on-emerald-600 is the same 3.77:1, which fails at 10–16px button/badge sizes).
  Emerald-700 vs. white = (1.05)/(0.1917) = 5.48:1, used for all small text/icons/the focus ring.
  Zinc-500 vs. white = (1.05)/(0.2173) = 4.83:1 (muted text, pure-white surfaces only, per the
  surface-conditional floor); zinc-600 vs. white = (1.05)/(0.1356) = 7.75:1, used instead on the
  one tinted surface in the page (the "Your split" live scenario card and the Value section's
  background) — confirmed the tint itself (#F7FDFA) is only 1.03:1 off pure white, so the
  white-surface contrast numbers above carry over to it with no separate recomputation needed.

- **Line-length containers, computed per the brief's exact formula, not eyeballed.** Three body
  font sizes appear on the page (18px hero subhead, 16px section intros/CTA paragraph, 14px
  testimonial quotes), each given its own literal pixel max-width rather than one `ch`-based value
  reused everywhere: 540px/18px → 68.2 chars, 480px/16px → 68.2 chars, 420px/14px → 68.2 chars.
  All three land just under the ~70-char target and comfortably under the 75-char hard ceiling;
  `ch` is not used anywhere in the route.

- **Target-size on the two smallest controls.** The brief's target-size audit is a named hard-fail.
  The "Try this split" buttons and each listing card's "Condition detail" `<summary>` toggle
  started under 24px tall with their initial padding; both were given enough vertical padding
  (`py-2` / `py-1.5` with an 11–12px line box) to clear 24×24 with margin before this was shipped,
  rather than left to be caught by the gate.
