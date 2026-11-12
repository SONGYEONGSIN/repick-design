# Candidate B — "Priority Ladder"

One-line concept: a light-theme, fuchsia-accented landing page whose hero embeds a five-criterion
drag-to-reorder priority ladder (rank → fixed linear weight curve → 100) and a live "top matches"
mini scoreboard that re-sorts four fixed listings through that exact same weight function — carried
into a richer listing grid, a 3-column explainer, social proof, and a closing CTA that cites the
real current #1 criterion and the real current top listing's real computed score.

Files written (all under `app/src/app/landing-evolve/r51/b/`):
- `page.tsx` — server component, metadata only.
- `LandingExperience.tsx` — client root; the ONLY state is `rankMap: Record<CriterionId, number>`
  (a rank-position map, not an ordered array), threaded down to every section.
- `rank-model.ts` — pure, framework-free: `CRITERIA`, `computeLinearRankWeights` (+ the derived
  `RANK_WEIGHTS` constant), `weightFor`, `orderedIds`, `moveRank`, `reorderByDrag`,
  `leadCriterionId`, `describeOrder`, `computeMatchScore`, `rankItems`. No `Math.random`/`Date.now`.
- `data.ts` — `LISTINGS` (4), `TESTIMONIALS` (3), `PLATFORM_STATS` — all fixed.
- `tokens.ts` — the fuchsia/ink/muted/ghost tokens and the three computed body-measure widths,
  scoped to this route only (`globals.css` untouched).
- `Hero.tsx` — headline, subhead, single CTA, **and** the Priority Ladder + Match Board, all inside
  this one component's own return (not a section below it).
- `PriorityLadder.tsx` — the reorder UI (native pointer drag-and-drop + always-visible up/down
  buttons + `aria-live` status + the "Ranked by:" caption).
- `MatchBoard.tsx` — the hero's compact, live-resorting 4-listing scoreboard.
- `ListingGrid.tsx` — Product Preview section: the same 4 listings, richer cards (AI-match-reasoning
  tag tied to the current #1 criterion, condition grade, verification badge, before/after discount).
- `ValueSplit.tsx` — the 3-column explainer, no interaction required.
- `SocialProof.tsx` — 3 testimonials + a platform-stats row.
- `ClosingCta.tsx` — cites the live top listing + its live score + the live #1 criterion.
- `Reveal.tsx` — scroll-entrance wrapper, `initial={false}` under reduced motion so nothing can be
  left stuck at `opacity:0`.

## Duplicate check performed before designing

Globbed every existing `landing-evolve/r*/*/page.tsx`, the `(marketing)` catalog, and skimmed
`candidates/*.md` for `r46`–`r50`, as instructed. Two close precedents found, both read in full:

- **`r50/c` "Seller Tier Ladder"** — a 5-item **checklist** (subset of boolean toggles) feeding a
  tier threshold. Confirmed genuinely different input/output shape from this assignment: a checklist
  is "which items are checked" (an unordered subset), not "what order are all five items in" (a
  total ranking/permutation). No overlap beyond both using a 5-item list of trust-ish criteria.
- **`r34/a` "Priority Order device"** (no candidate note on disk for `r34`, but the live code —
  `ReorderDevice.tsx` / `reorder-math.ts` / `Hero.tsx` / `LandingPage.tsx` — is, in concept, almost
  exactly this assignment: a dark/violet theme, 4 fixed criteria (price/condition/trust/pickup), a
  **hand-typed fixed table** of weights (40/30/20/10), reorder-in-hero with native drag + up/down
  buttons + `aria-live`, a 3-card match grid, and a closing CTA citing the live top match. This is
  the real precedent this round's brief is implicitly reacting to. Deliberately differentiated on
  every axis the task instructions call out, not just renamed:
  - **State shape**: `r34/a` stores an ordered `ChipId[]` array. This build stores a **rank MAP**
    (`Record<CriterionId, number>`), and derives the ordered array on demand (`orderedIds`). Moving
    a row up/down is a rank-value swap on the map, not an array splice; only the drag-drop path
    converts to an array internally, then converts back.
  - **Weight curve**: `r34/a` hard-types `[40, 30, 20, 10]`. This build **computes** the curve from
    a linear (triangular) formula — `(n - rank + 1) / (n(n+1)/2) × 100` — with largest-remainder
    rounding, and only incidentally resolves to `[33, 27, 20, 13, 7]` for n = 5. The brief explicitly
    offers "linear or a fixed table" as the two options; this build took the other one.
  - **Criterion count and set**: 5, not 4 — Price / Condition / Seller rating / Shipping speed /
    Rarity (the brief's own example set), vs. `r34/a`'s Price / Condition / Seller Trust / Pickup
    Speed.
  - **Theme and accent**: light / fuchsia, vs. `r34/a`'s dark / violet — opposite polarity, not an
    adjacent hue on the same dark base.
  - **Component/file names**: `PriorityLadder.tsx`, `rank-model.ts`, `MatchBoard.tsx`,
    `ListingGrid.tsx`, `ClosingCta.tsx`, `Reveal.tsx` — none reused from `ReorderDevice.tsx` /
    `reorder-math.ts` / `ProductCard.tsx` / `ProductPreview.tsx` / `LandingPage.tsx` / `ClosingCTA.tsx`.
  - **Scoreboard vs. grid split**: `r34/a` puts the full rich 3-card grid directly in the hero and a
    *separate* `ProductPreview` section repeats a similar card. This build puts a genuinely
    *compact* scoreboard (rank badge + title + score only) in the hero, and reserves the rich
    badge/reasoning/discount treatment for the dedicated `ListingGrid` section below, per this
    round's explicit "Product preview: make the scoreboard's listing cards rich" instruction.

## 브리프에 없던 것 (not specified by the brief)

- **Body-column width — computed in px from the brief's 0.44em constant, never `ch`.**
  `chars = containerPx ÷ (0.44 × fontPx)`, target ≈70 chars/line:
  - 16px body copy (hero subhead, value-section intro, CTA paragraph): `70 × 0.44 × 16 = 492.8px` →
    rounded to **493px** (`MEASURE_16`).
  - 17px intro copy (listing-grid section intro): `70 × 0.44 × 17 = 524.8px` → **525px**
    (`MEASURE_17`).
  - 15px testimonial quotes: `70 × 0.44 × 15 = 462.0px` → **462px** (`MEASURE_15`).
  All three land at ~70 chars/line, intentionally short of the 75-char ceiling rather than flush
  against it, per the brief's own framing. No container in this build uses the `ch` unit.

- **Used the brief's pre-computed fuchsia values exactly as given, without recomputing them, and
  applied the "fill behind white text" rule literally rather than loosely.** `#A21CAF` (fuchsia-700)
  for every small/body-sized accent text, AND as the fill behind every white text on an
  accent-filled surface — both CTA buttons, the Priority Ladder's and Match Board's `#1` rank-digit
  badges, and the listing grid's "`N`% match" chip. The brief's rule is keyed to whether the fill
  carries real text, not to the text's font-size, so a small filled digit badge gets the same 700
  fill as a sentence-length button label — the 600 step (`#C026D3`) is reserved strictly for
  non-text chrome (focus rings, the "leading" tint border) and for large (≥24px) text rendered
  directly on the page background, never for anything filled that also carries white text, however
  small. Supporting ink/muted/ghost/border values were hand-computed (sRGB → linear → relative luminance →
  WCAG ratio) rather than guessed: ink `#18181B` vs. white ≈17.7:1; muted `#52525B` vs. white ≈7.75:1
  (well clear of the 4.5:1 floor on every surface in this build, light or near-white); ghost
  `#71717A` vs. white ≈4.83:1, deliberately checked against the large-text 3:1 floor since the ghost
  numerals render at `clamp(2.25rem, 6vw, 4rem)` (≥36px even at the clamp floor, so always in the
  large-text bracket) — picked well above the 3:1 minimum rather than just barely clearing it, same
  ethos as the brief's own fuchsia-700-over-fuchsia-600 preference for small text.

- **The weight curve's exact shape and the default rank.** The brief said "pick a fixed, explicit
  weight curve (e.g. linear or a fixed table)." Took linear: rank *r* gets a budget share
  proportional to `(n − r + 1)`, so the top rank is worth exactly 5× the bottom rank and every step
  down the ladder costs exactly one "part," converted to whole percentage points via
  largest-remainder rounding so the five weights always sum to exactly 100 (see `rank-model.ts`).
  Default rank (non-trivial, not alphabetical and not the brief's own listed order): Condition (1) →
  Seller rating (2) → Price (3) → Rarity (4) → Shipping speed (5), which makes the Mirrorless Camera
  the default top match at 77% — a number nothing in the codebase hand-types; it falls out of the
  formula the first time the page renders.

- **Which 4 listings and their per-criterion scores.** Not specified beyond "3-4 dummy listings."
  Picked four very different resale categories (camera, sneakers, watch, jacket) and deliberately
  gave each one a different strongest criterion (condition/rating for the camera, shipping speed for
  the sneakers, rarity/seller-rating for the watch, price for the jacket) so that dragging any single
  criterion to #1 visibly changes which listing leads — rather than one listing dominating under
  every possible ranking. The jacket is also the one `verified: false` listing, to exercise the
  "verification pending" badge state at least once.

- **The tie-guard and the "Ranked by:" caption audit.** `rankItems` breaks score ties on listing id
  (`localeCompare`), so two equal composite scores can never trigger a silent re-shuffle. Per the
  brief's specific warning about captions that look like chrome but are actually position-dependent:
  audited both the sr-only `aria-live` status string and the small *visible* "Ranked by: …" caption
  under the ladder, and both call the same `describeOrder(rankMap)` function — there is no second,
  hand-typed copy of "what order is this in" anywhere in the component tree.

- **Image sourcing.** Reused photo ids already confirmed in production use elsewhere in this
  catalog's own `data.ts` files with consistent category labeling (mirrorless camera, white/grey
  sneaker, watch, outerwear jacket; three portrait ids reused as testimonial avatars), rather than
  guessing fresh ids blind — the same mitigation `r50/c`'s candidate note recorded for the same risk.
  Every image container reserves a fixed `aspect-[4/3]`/`1:1` box with a near-white fallback
  background, and badges are always in a separate row under the photo, never overlaid on it.

- **Font weights and the display face.** Exactly 3 rendered weights: 400 (implicit/`font-normal`,
  body and captions), 600 (`font-semibold`, labels/badges/buttons/bold inline spans — including a
  few places set via inline `fontWeight: 600` rather than a class, still the same weight, never a
  4th value), 800 (`font-extrabold`, every heading and the large stat/score numerals). `var(--font-
  display-wide)` (Archivo Display, already declared globally) is applied only to `<h1>`/`<h2>` and
  the `repick` wordmark — never to body copy, badges, or the decorative ghost numerals, which stay on
  the inherited `--font-sans` body weight since they're large digits, not headline prose.

- **Mobile headline sizing.** `clamp()` is split into two separately-tuned formulas rather than one
  spanning every breakpoint: `clamp(2rem, 8.5vw, 2.75rem)` below `lg`, `clamp(3rem, 4.3vw, 4.5rem)`
  at `lg` and above (`Hero.tsx`), so the viewport-relative term doesn't have to compromise between a
  narrow phone and a wide desktop in the same expression.
