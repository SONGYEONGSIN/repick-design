# a — Verification Timeline (reassignment, r43/c bug fixed)

Dark / sky / no display face (Pretendard only). Rebuild of `auto-landing-r43/c`
— same 4-stage clickable-any-order verification stepper (Listed → Inspected →
Authenticated → Shipped) driving one `STAGES` lookup table's confidence %,
badge count, and ETA-in-days into a single preview card and the closing CTA
— re-authored from scratch in `landing-evolve/r44/a`, with the one fixable
bug that dropped the original at the hard gate corrected from the start.

## The bug and the fix (verbatim reassignment, verified independently)

r43/c's stepper row (`<ol>`) sits inside a `grid gap-10 lg:grid-cols-[1.1fr_0.9fr]`
container. Its direct child — the plain `<div>` wrapping the `<ol>` and the
two value-prop cards — is a **grid item**, and a grid item defaults to
`min-width: auto` (content-based sizing), the same failure mode as a flex
item. r43/c added `min-w-0` only to the `<li>`, the `<button>`, and the label
`<span>` *inside* that row — one nesting layer too deep — so the wrapper
`<div>` itself (the actual grid item) stayed unconstrained and kept expanding
to its content's max-content width, overflowing at 390px regardless of what
was constrained further down.

**Fix applied in `Hero.tsx`**: both direct children of the `grid` row —
the stepper/value-prop wrapper `<div className="min-w-0">` and the sticky
preview-card wrapper `<div className="min-w-0 lg:sticky lg:top-24">` — carry
`min-w-0` on themselves, not only on what's nested inside them. The
descendant-level `min-w-0`s (li/button) are kept too, but they were never
the fix; the grid-item wrapper is. This also brings the route into line with
`page-brief-core.md` §4's blanket rule ("그리드 아이템은 `min-w-0`"), which
I applied to every other grid item on the page (the stat-duo grid cells, the
testimonial grid cells) as a general precaution, not just the one row named
in the bug report.

## 브리프에 없던 것

1. **Accent hex + contrast calc (required, computed independently from WCAG
   relative luminance, not copied from r43/c's note)**. Chose sky, same
   family as the original candidate:
   - Fill background `#0369a1` (sky-700): **white text = 5.93:1** (clears AA
     4.5:1 for small text) vs **`#0B0B0F` dark-ink text = 3.31:1** (fails AA
     small-text 4.5:1, and only barely clears the 3:1 large-text/non-text
     floor with little margin). Decision: every accent-fill background on
     this page (buttons, the "ID-Verified" tier badge) carries white text
     only — dark ink on fill is never used, because 3.31:1 is too close to
     its floor to trust at any size.
   - Large stat numbers / active borders / icon fills `#38bdf8` (sky-400)
     against bg `#0B0B0F`: **9.17:1** (clears AAA 7:1, safe even at small
     text sizes, used for stat numbers and connector lines regardless).
   - Active label text / emphasis spans `#7dd3fc` (sky-300) against the same
     bg: **11.79:1** (clears AAA with margin).
   - Bonus check, not required but verified since it's load-bearing
     everywhere: the repo's own `muted` token `zinc-400` (`#a1a1aa`) against
     `#0B0B0F` computes to **7.61:1** — confirms the existing "zinc-400
     floor" convention is actually safe on this exact bg, not just assumed.
2. **Body line-width math (computed, not guessed, `ch` avoided)**. Using the
   required constant — Pretendard's measured mixed-glyph average advance is
   `0.44em`, not `1ch` (`ch` is the digit-0 advance, ~35% wider here) —
   `chars-per-line = container-width / (0.44 × font-size)`:
   - 16px paragraphs (hero subhead): container `480px` →
     `480 / (0.44 × 16) = 480 / 7.04 ≈ 68.2 chars`.
   - 14px paragraphs (value-prop cards, testimonials, the "why this matched"
     disclosure panel): container `430px` →
     `430 / (0.44 × 14) = 430 / 6.16 ≈ 69.8 chars`.
   Both sit inside the 65–75 ceiling with headroom under 75, close to the
   ~70 target rather than flush against the limit (constants documented in
   `theme.ts` next to `PROSE_16`/`PROSE_14` so they travel with the code).
3. **No display face, explicitly kept** — this candidate's reassignment
   brief fixes this as a deliberate "don't use the slot" choice, and the
   repo's actual font whitelist (`page-brief-repo.md` §2) has no "Inter"
   variable at all: `--font-sans` already resolves to Pretendard globally,
   so every element here — headings included — simply inherits the body
   default. Nothing in the file sets a `--font-display-*` class.
4. **Lookup-table causality, kept** — `STAGES` is a plain array indexed by
   `stageIndex`; the three synchronized values (confidence/badges/ETA) are a
   direct lookup, not a formula. No `reduce`, no `min`/`max`, so there is no
   tie condition to misjudge (avoids the comparator-reduce bug class).
5. **Clickable-in-any-order, kept** — stages stay independently clickable
   rather than forced-sequential, so a visitor can compare e.g. "Listed"
   against "Shipped" directly, which is the thing actually doing the
   convincing here.
6. **Product photo swap, decided fresh (not in r43/c, which used a bare
   Camera-icon placeholder box with no real photo)**. The brief requires an
   actual listing photo, not an icon placeholder, inside the Hero fold.
   Rather than invent a new unvetted Unsplash id, I reused the fixed,
   already-cataloged id `images.unsplash.com/photo-1526170375885-...`
   (a mirrorless camera body with a lens attached) that another route in
   this catalog (`r30/b`) already uses for the same product category —
   deliberately chosen content, not a random image service, per
   `page-brief-core.md` §3. Renamed the product copy from "Canon AE-1,
   fully serviced" to "Full-frame mirrorless kit, lens included" so the
   copy matches what the photo actually shows, and added a condition grade
   badge, a seller-tier badge, and a resale/retail/discount-% price line
   (computed via `discountPct()`, not hardcoded) so the first-fold proof
   covers match % / grade / certification / discount as the brief's
   product-preview checklist asks for — all of this is static dressing
   around the preview card; only confidence %, badge count, and ETA are
   stage-driven, exactly as in r43/c.
7. **Fourth interaction type, added**. The brief requires at least 4 distinct
   interaction types (hero interaction + scroll trigger + the stepper itself
   + one more). The stepper itself and the scroll-reveal (`Reveal`,
   `framer-motion` `whileInView`, gated on `prefers-reduced-motion` via
   `useReducedMotion` and on mount via `useMounted` so no entrance
   `opacity:0` ever reaches a non-hydrated render) account for two. r43/c's
   hero interaction and the stepper are the same device, so to clear the "4
   distinct types" floor unambiguously I added a local disclosure toggle
   ("Why this matched" / `aria-expanded` + `aria-controls`) under the
   preview card, following the same pattern already in this catalog's
   `r30/b/ProductPreview.tsx`.
8. **Duplicate-avoidance depth** — same caveat as the original r43/c note:
   this round's dedup list (drag-reorder, dual-handle slider, grid-cell
   match, scanline reveal, facet pickers, balance beam, tournament bracket,
   weighted-score, bid-ladder, trade-ledger) and this round's two sibling
   candidates (search-radius → map/radar; price-point slider → inventory
   simulation) don't overlap this reassigned stepper form at all.

## Files

- `app/src/app/landing-evolve/r44/a/page.tsx` — default export, header, Hero,
  social proof, closing CTA. Owns `stageIndex` state (non-trivial default
  `2`, "Authenticated").
- `app/src/app/landing-evolve/r44/a/Hero.tsx` — the hero fold: headline,
  stepper (the fix lives here), two value-prop cards, sticky product-preview
  card with photo/badges/price/stat-duo/disclosure.
- `app/src/app/landing-evolve/r44/a/data.ts` — `STAGES` lookup table,
  `BADGE_POOL`, `PRODUCT`, `discountPct()`.
- `app/src/app/landing-evolve/r44/a/theme.ts` — accent/contrast tokens +
  computed prose-width constants, documented inline.
- `app/src/app/landing-evolve/r44/a/Reveal.tsx` + `useMounted.ts` — scroll
  reveal wrapper, reduced-motion + pre-hydration safe.
