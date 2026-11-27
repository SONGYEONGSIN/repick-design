# Candidate C — Seller Tier Ladder

One-line concept: a light-theme, editorial resale landing page whose five-item seller-verification
checklist drives, through one shared pure-function pipeline, a live tier badge (Bronze → Silver →
Gold → Platinum), a trust-meter bar, an unlocked-perks list, and a days-to-sell projection — and
whose closing CTA cites that exact same tier/score/days, never a hardcoded number.

Files written (all under `app/src/app/landing-evolve/r50/c/`):
- `page.tsx` — server component, metadata only.
- `LandingExperience.tsx` — client; lifts `checked: Set<ChecklistItemId>` state and assembles
  Header / Hero / ProductShowcase / SellerTierLadder / SocialProof / ClosingCTA / Footer.
- `SellerTierLadder.tsx` — the Value section (3 parts): checklist + presets, tier badge + trust
  meter, unlocked perks + days-to-sell.
- `tier-logic.ts` — pure, framework-free rules: `scoreFor`, `tierFor`, `nextTierInfo` (greedy,
  guarded), `daysToSellFor` (guarded), `PERKS` predicates. No `Math.random`/`Date.now` anywhere.
- `ProductCard.tsx` — compact (hero) and full (showcase) variants, 4-badge row never overlaid on
  the photo.
- `data.ts` — products, testimonials, platform stats (fixed Unsplash photo ids only).
- `Reveal.tsx` — scroll-entrance wrapper; `initial`/`whileInView` never depend on reduced-motion
  (so there's no SSR-hydration race that could leave anything stuck at `opacity:0`), only the
  transition's duration/offset collapse to 0 under `prefers-reduced-motion`.
- `styles.ts` — shared accent/ink/focus-ring tokens, scoped to this route (globals.css untouched).

## Not specified by the brief

- **Accent hex + contrast arithmetic (required to state).** Chose `#7C3AED` (violet, not the
  catalogue default `#6E56CF`), with a darker same-hue step `#5B21B6` for small accent-colored text
  on light surfaces. Computed by hand (relative luminance → contrast ratio, WCAG formula):
  - `#7C3AED` vs white `#FFFFFF`: **≈5.70:1** — clears body-text AA (4.5:1) *and* the large-text
    floor (3:1). Used directly for small accent-colored labels (eyebrows) since it already clears
    4.5:1 — the brief's "usually fails" caveat didn't hold for this specific hue/value, so I did
    the arithmetic rather than reflexively adding a lighter tint that wasn't needed.
  - `#7C3AED` vs ink `#16151C`: **≈3.18:1** — clears only the large-text/non-text floor, matching
    the brief's expectation that dark ink on the saturated fill is large-text-only safe. I never
    put dark ink on an accent fill at small size; the one accent-filled small-text badge (the
    discount chip, e.g. "-42%") uses white.
  - White text on `#7C3AED` fill: **≈5.70:1** (same ratio, symmetric) — safe for small text, used
    on the discount badge and all filled CTA buttons.
  - `#5B21B6` vs white: **≈8.98:1** — used for the tier-icon glyph, the "unlocked" check icon, the
    AI-match badge text, and the focus-ring color.
  - `ink #16151C` vs white: **≈18.1:1** (for reference — this is why ink-on-white headings/prices
    were never a contrast concern regardless of size).
- **Exact ink/background values.** Brief says "pick your own exact values." Used `#16151C` (a
  near-black with a faint violet undertone, computed above) as ink, `zinc-50` (#fafafa) as the page
  background, `white` for card surfaces, `zinc-100` for tinted tracks (preset segmented control,
  meter track) — giving the near-white/tinted-surface split the brief's contrast-floor guidance
  assumes. Muted text everywhere uses `zinc-600`, which is darker than *both* stated floors
  (zinc-500 on near-white, zinc-600 on tinted zinc-100+), so one muted-text color is safe on every
  surface in this page without needing to track which specific floor applies per element.
- **Body-paragraph width, computed per the brief's formula, not `ch`.** Pretendard-Latin average
  glyph advance = 0.44em. For the primary body size (16px/1.6, used for all prose paragraphs):
  `chars = container_px / (0.44 × 16) = container_px / 7.04`. Target ~70 chars → `70 × 7.04 ≈
  492.8px`; rounded to **`max-w-[480px]`** (≈68 chars/line — inside 65-75, intentionally short of
  75 per the brief's "aim ~70, not flush against 75"). For testimonial quotes, set at 14px
  (`text-sm`): `70 × 0.44 × 14 = 431.2px` → **`max-w-[432px]`**. In the 3-up testimonial/showcase
  grids the rendered column is sometimes narrower than this cap (e.g. ~354px effective text width
  at `lg:grid-cols-3` on a 1280px container) — that's the grid compressing it below the ceiling,
  not a habitual fixed-width pick; the 480px/432px figures are the *ceiling* applied wherever a
  paragraph has a full single column to itself (hero subhead, section subheads, CTA copy).
- **The checklist item set, weights, and tier thresholds** (brief gave an example set, not exact
  values). Picked: ID verified (30), Photos verified (20), Fast-ship enabled (20), Return policy
  published (15), Bank account linked (15) — summing to 100. Thresholds: Bronze 0 / Silver 40 /
  Gold 65 / Platinum 90. Chosen so that different *combinations* of the same count land in
  different tiers (e.g. {ID, Photos, Return} = 65 → Gold, but {Photos, Return, Fast-ship} = 55 →
  Silver — both 3 items checked), concretely demonstrating "which items, not just how many" per the
  brief. Only checking all five reaches Platinum, which made the "verify one more thing to reach
  the top tier" framing literally true whenever exactly 4/5 are checked, without hand-typing it.
- **The "next tier" / "N more steps" claim.** Rather than hardcode the brief's illustrative "verify
  one more thing" copy, `nextTierInfo` greedily picks the *highest-weight missing items first* and
  counts how many are needed to cross the next threshold — which is the mathematically minimal
  count for a free choice among positive weights, so the copy's number is always provably correct,
  including for the default state (2/5 checked → exactly 1 more step to Gold) and both
  degenerate ends (0 checked → 2 steps to Silver; all 5 checked → `reached: true`, no next tier,
  guarded via `!next || missing.length === 0`).
- **Days-to-sell formula.** Not specified by the brief beyond "improves as more/more-impactful
  items are checked." Used a linear interpolation from a 21-day baseline (0 score) to a 2-day floor
  (100 score): `21 − (19/100) × score`, rounded, floored at 2 via `Math.max`. Guarded the "0 days
  faster than baseline" degenerate case explicitly (score 0 → delta 0 → different copy branch,
  "At the marketplace baseline," instead of an awkward "0 days faster").
- **Default checked state.** Brief requires non-empty/non-trivial at rest. Defaulted to
  {ID verified, Photos verified} = score 50 = Silver, which also happens to equal one of the three
  preset buttons ("Most sellers") — so the UI is self-consistent at first paint rather than
  contradicting its own presets.
- **Which 5 interaction types to use** (brief: "minimum 4, each must serve conversion/info").
  Picked: (1) individual checklist toggles, (2) preset quick-select chips (batch state jumps,
  genuinely different interaction shape from (1)), (3) per-item "why this matters" disclosures
  (click-to-expand rationale — informs hesitant sellers), (4) scroll-triggered reveals +
  hero-card parallax (motion, reduced-motion-gated). Kept hover states and focus rings as
  baseline a11y, not counted toward the "4 distinct types" tally.
- **Font-face scope for the display typeface.** Brief says `--font-display-mono` is for "large
  Latin headline text only." Interpreted narrowly: applied it to every `<h1>`/`<h2>` and the
  `repick` wordmark, but deliberately *not* to the large decorative ghost numbers (01–04) or the
  big stat numerals (trust score, days-to-sell) — those stay on `--font-sans`/inherited body weight
  since they're large digits, not headline prose, and treating "any large Latin text" as headline
  would have made two visually competing display registers on the same page.
- **Image sourcing.** Cross-referenced this catalogue's own `data.ts` files for photo ids already
  in production use with consistent category labeling (e.g. `1542291026-7eec264c27ff` used as a
  white/grey sneaker in at least 8 other candidates; `1523275335684-37898b6baf30` as a watch;
  `1526170375885-4d8ecf77b99f` as a mirrorless camera; `1491553895911-0055eca6402d` as headphones;
  `1551028719-00167b16eac5` as outerwear) rather than guessing fresh ids blind. For avatars, reused
  ids that appear repeatedly as `avatarId` for named people in dashboard-type candidates
  (`1543076447-215ad9ba6923`, `1441986300917-64674bd600d8`, `1553062407-98eeb64c6a62`), on the
  inference that a face photo reused as a person's avatar across many unrelated files is reliably a
  portrait, not a product shot.
- **Ghost-number tracking tier.** Reused the "stat" tier (0.12em) for the 01–04 ghost numerals
  since they're not literally headline/caption/stat-label text but are closest in spirit to a large
  stat numeral; avoided inventing a 4th tracking value.
- **Header "your tier" live badge.** Not required by the brief, added as an extra always-visible
  citation of the same live tier (desktop/tablet only, `sm:flex`) to make the "every surface agrees"
  property even more legible to a reviewer scrolling the page, at zero extra state (same
  `tierFor(scoreFor(checked))` call as everywhere else).
