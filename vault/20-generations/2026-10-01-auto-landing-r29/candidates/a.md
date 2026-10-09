---
tags: [candidate, landing-evolve, r29]
---

# r29 / a — "Caliper"

**Path**: `app/src/app/landing-evolve/r29/a/` · `page.tsx` + `client.tsx` + `data.ts` + `tokens.ts` + `slider-panel.tsx` + `leaderboard.tsx` + `ui.tsx`

## One-line concept

A resale marketplace ("Caliper") where three independently weighted dials — price sensitivity, shipping speed, seller trust — drive a live, always-visible leaderboard of 8 competing listings that visibly re-ranks with an animated per-row rank-delta (icon + number) every time a dial moves, and the same live top listing is quoted by name and price all the way down to the closing CTA.

## The 4 interactions implemented

1. **Three continuous weighted sliders** (`slider-panel.tsx`) — price sensitivity / shipping speed / seller trust, each 0–100, rendered twice (compact copy in the hero, full copy with descriptions in the "mechanism" section) against one lifted `weights` state in `client.tsx`, so dragging either copy updates both and the whole page re-scores instantly.
2. **Live re-ranking leaderboard with animated rank-delta** (`leaderboard.tsx` → `LeaderboardRow`) — every listing's weighted score is recomputed on every slider frame (`rankListings` in `data.ts`), the array is re-sorted, and each row is a `motion.li` with Framer Motion's `layout` prop so rows visibly glide to their new position. Each row carries a `RankDeltaBadge`: `ArrowUp`/`ArrowDown`/`Minus` icon **plus** a visible number/dash **plus** `sr-only` text — never color alone.
3. **Category toggle via the leaderboard's own factor breakdown** — the "mechanism" section renders every listing in `detailed` mode, adding three live `FactorBar` gauges (price fit / ship speed / seller trust, each the *actual* 0–100 sub-score feeding that row's position) plus the fixed AI-match floor, so every row shows the specific factors that produced it, not a bare rank number.
4. **Live value reaching the closing CTA** — section 5 reads `board[0]` (the current top-ranked listing) directly: "Your top match right now: **{name}** at **${price}**", plus the exact current dial percentages in the body copy and a live runner-up card. Moving a dial anywhere on the page changes this section's copy on the next render — the mechanic never goes dead before the CTA.

A secondary mechanism — an `aria-live="polite"` region in the hero announcing the current #1 listing and its score — makes the re-ranking legible to screen-reader users who can't see the row-glide animation.

## Accent contrast — computed arithmetic

Dark theme at the DNA default `#0B0B0F` (no deviation — nothing about this layout needed a different near-black). Accent is teal/cyan family, split into two hexes because one hex can't satisfy both the on-background and on-fill rules at once on a near-black page:

| Pair | Hex | L (relative luminance) | Contrast | Floor | Result |
|---|---|---|---|---|---|
| `#14B8A6` (ACCENT) vs bg `#0B0B0F` | text/icons/borders/focus ring | L≈0.3720 vs L≈0.00345 | **(0.3720+0.05)/(0.00345+0.05) ≈ 7.90:1** | 4.5:1 (small body text) | **Pass**, wide margin — used directly as small-text/icon color, no lighter tint needed |
| White `#FFFFFF` on `#14B8A6` fill | would-be button fill | L≈1.0 vs L≈0.3720 | **(1+0.05)/(0.3720+0.05) ≈ 2.49:1** | 3:1 (non-text) | **FAILS** — `#14B8A6` is light enough that white text on it does not work (the inverse of the catalog's usual "dark ink on fill fails" case: here the ACCENT itself is too light for white, so it is simply never used as a filled background behind text) |
| White `#FFFFFF` on `#0F766E` fill (ACCENT_FILL) | buttons, match-% pills | L≈1.0 vs L≈0.14196 | **(1+0.05)/(0.14196+0.05) ≈ 5.47:1** | 4.5:1 (small text on fill) | **Pass**, real margin (not a "just barely" 4.53) — this is the only hex ever used behind text, always with white, never dark ink |
| `#0F766E` fill vs bg `#0B0B0F` | button/pill boundary | L≈0.14196 vs L≈0.00345 | **(0.14196+0.05)/(0.00345+0.05) ≈ 3.59:1** | 3:1 (non-text) | **Pass** — a filled pill reads as a distinct shape before its label is legible |
| `text-zinc-400` (#A1A1AA, muted-text floor) vs bg | captions, labels | L≈0.3600 vs L≈0.00345 | **≈ 7.67:1** | — | Used everywhere a muted caption appears; `text-zinc-500`/`600` were caught mid-build (computed at ≈4.08:1 against this background — below the 4.5:1 small-text floor) and replaced globally with `zinc-400` before finishing |

Formula used throughout: sRGB → linear via `((c+0.055)/1.055)^2.4` for c>0.03928, `L = 0.2126R+0.7152G+0.0722B`, contrast `=(L_light+0.05)/(L_dark+0.05)`. Full derivation lives as comments in `tokens.ts`.

## Body-width character count

Per the 0.44em/glyph rule (`chars_per_line = container_px ÷ (0.44 × font_px)`, never `ch`):

- 18px lead → 540px container → 540 / (0.44×18) ≈ **68.2 chars/line**
- 17px body → 520px container → 520 / (0.44×17) ≈ **69.5 chars/line**
- 14px (sm) → 430px container → 430 / (0.44×14) ≈ **69.8 chars/line**
- 12px (xs) → 370px container → 370 / (0.44×12) ≈ **70.1 chars/line**

All land just under the ~70-char target with slack below the 75-char ceiling. Constants live as `BODY_LG`/`BODY`/`BODY_SM`/`CAPTION` in `tokens.ts`.

## Font/weight audit

One display face (`--font-display-mono`, Latin-only: h1, section h2s, rank numerals, stat values, wordmark) + Pretendard for everything else. Exactly 3 rendered weights: **400** (default/unstyled body text, Pretendard's base weight — blockquotes, descriptions, reasoning lines), **600** (`font-semibold` — labels, nav, badges, slider labels), **800** (`font-extrabold` — h1, h2s, rank numerals, stat values, prices). No `font-medium`/`font-bold`/`font-light` used anywhere; verified by grepping every `font-*` class across all 7 files.

## Completeness vs. Linear/Stripe/Vercel-level landing pages

Present: persistent sticky header with logo/nav/secondary CTA, asymmetric hero with real huge type-scale contrast and in-fold proof, product grid with always-visible (never hover-gated) badges in a dedicated row below the photo, a fully-explained mechanic section, social proof (stats + testimonials), closing CTA that quotes live state, footer, skip link, focus-visible rings on every interactive element, `prefers-reduced-motion` handling via `motion-reduce`/`useReducedMotion`, hydration-safe scroll reveals.

Gaps vs. a true production marketing site: no FAQ/accordion section, no pricing/plans section, no footer link columns (legal/careers/social), no real auth flow behind the CTAs (they're anchors, matching this catalog's established convention for non-functional prototype CTAs), no image srcset beyond Next/Image's automatic handling, no A/B-test or analytics instrumentation. These are intentionally out of scope for a single landing-page design candidate.

## Brief gaps — undefined items I had to decide

- **Brand name**: "Caliper" — a measuring/precision-instrument metaphor that maps directly onto "condition grading" and "weighted matching," distinct from the literal product name "repick" and from every brand name used in prior rounds of this catalog.
- **Exact slider axes**: Price sensitivity / Shipping speed / Seller trust (3 of the brief's suggested 2–4; condition grade is shown as a fixed per-listing badge instead of a 4th axis, since the brief only requires grade to be *visible*, not necessarily slider-driven, and 3 axes kept the compact hero widget legible).
- **Exact default weights**: 65 / 30 / 55 (price/speed/trust) — chosen by hand so the default leaderboard order is already non-trivial and non-tied (verified by running the scoring function standalone: default order is Peak Design Backpack (72.0) > Leica M6 (71.1) > Fujifilm X-T4 (69.9) > Mirrorless Body (69.0) > Omega Speedmaster (67.4) > Leather Tote (64.8) > Rolex (63.6) > Nike AF1 (62.9) — no ties, no flat baseline).
- **Scoring formula**: `score = 0.35 × baseMatch + 0.65 × (normalized-weighted sum of price/ship/trust fit)`. The 35% floor and 65/35 split are my own invented constants (not specified in the brief) chosen so no combination of dials can fully override the AI-match signal, which doubles as the page's "trustworthy, not just gameable" argument. Verified at the extremes by running the formula standalone (price+speed-only weighting sends Rolex to last place at 46.5; trust-only weighting sends it to first place at 94.3), confirming the mechanic produces dramatic, legible movement across the dial range, not just cosmetic jitter.
- **Leaderboard row count**: 8 listings, spanning 4 categories (camera ×3, watch ×2, bag ×2, footwear ×1) rather than 8 instances of one product, framed in-copy as a personalized cross-category "watchlist" rather than one fixed search query — a deliberate choice driven by only having a limited, pre-verified pool of real `images.unsplash.com/photo-<id>` URLs to draw from (see below), but one that also reads naturally for a marketplace matching tool.
- **Image sourcing**: this sandbox's network egress blocks `images.unsplash.com` entirely (confirmed via both direct `curl` and `WebFetch`, both returned connection/egress-blocked errors), so none of the 8 photo IDs could be verified live. Instead of guessing new IDs blind, I reused 8 fixed photo IDs already present and working elsewhere in this repository's own codebase (`grep`-verified across `landing-evolve`, `(marketing)`, and `dash` routes), which is both within the "no random-seed host" rule (these are fixed, human-chosen ids, not seeded/random) and the lowest-risk source available without live verification.
- **Exact container width**: `max-w-[1200px]`, matching this catalog's established convention (reused verbatim from the most recent prior landing round) rather than inventing a new breakpoint.
- **Rank-delta semantics on first paint**: all deltas render as "no change" (`Minus` icon) on first load, since there is no prior order to diff against yet — this is a deliberate, documented choice in `ui.tsx`'s `useRankDelta` hook (not a bug), and it is distinct from the brief's "diff starting at zero" pitfall, which concerns the *leaderboard order* (not the delta badges) — that default order is non-tied per above.
- **"Match %" badge meaning**: labeled "N% weighted match" and bound to the live weighted `score` (not the fixed `baseMatch`), since the brief asks each row to show its "actual match score" and the personalized, dial-weighted number is the one that actually explains the row's position; the fixed AI-profile-match floor is still shown separately (as its own factor bar) in the detailed breakdown for transparency.
