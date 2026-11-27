# Candidate a — Regrade

Regrade is a condition-graded resale marketplace. The hero pairs an editorial, asymmetric
left-aligned headline with a single proof card that holds the round's assigned device — a
**discrete ordered stepper** (Prev/Next, four dots: Good → Very Good → Excellent → Like New) —
living inside the Hero component's own render tree, not a sibling section. Stepping the grade
recomputes, through one pure formula, the badge text, the live resale estimate, and the buyer-facing
sentence on the same product photo; the identical function calls reappear in the "Value, three ways"
recap section and in the closing CTA's headline, so the number a visitor sees last is provably the
same number the control is holding, not a restated literal. A four-card product-preview grid supplies
the richer, multi-listing proof (AI-match tags, grade, seller verification, before/after discount),
and a short social-proof band closes the gap before the final CTA. Theme is dark per assignment,
accent is a violet hue distinct from the catalog default, and the page carries a single
`--font-display-wide` face for its two display headlines, Pretendard everywhere else.

## Brief gaps

1. **What**: exact accent hex (hue assigned as "violet," no shade given).
   **Decision**: `#7C3AED` (Tailwind's violet-600) as the full-fill accent, `#C4B5FD`
   (violet-300) as the small-text/icon/focus-ring tint.
   **Why**: arbitrary within the assigned hue family, chosen to reproduce the canon default's own
   contrast *pattern* (a fill that clears large-text 3:1 but not body AA, paired with a much lighter
   tint that clears body AA on its own) rather than copying the default's literal shade. Contrast
   computed by hand (sRGB → linear → relative luminance, formula below) rather than estimated:
   - `L(#FFFFFF)=1.0`, `L(#0B0B0F)=0.003448`, `L(#7C3AED)=0.1343`, `L(#C4B5FD)=0.5189`.
   - `#7C3AED` vs bg `#0B0B0F`: `(0.1343+0.05)/(0.003448+0.05) = 3.45:1` — clears the 3:1 large-text
     / non-text floor, misses body AA. Used only for buttons, borders, bars, chip fills, and the one
     ≥24px/≥19px-bold use (none on this page needed text that large on a bare fill — see next point).
   - **White on `#7C3AED` fill**: `(1.0+0.05)/(0.1343+0.05) = 5.70:1` — clears body-text AA with
     headroom. Every on-fill label on this page (CTA button text, the "Grade: X" chip) is set in
     white for exactly this reason — not dark ink, even though dark ink would also be legal at the
     chip's size, because white clears AA at *every* size and keeps one rule instead of two.
   - **Dark ink (`#0B0B0F`) on `#7C3AED` fill**: `(0.1343+0.05)/(0.003448+0.05) = 3.45:1` — the
     same arithmetic as accent-vs-bg (ink is literally the bg hex), so it only clears the
     large-text/non-text floor. Recorded per the brief's requirement to calculate it even though
     the page ends up not using dark ink on fill anywhere.
   - `#C4B5FD` vs bg `#0B0B0F`: `(0.5189+0.05)/(0.003448+0.05) = 10.65:1` — the small-text/icon/
     focus-ring tint, used for every eyebrow, caption, icon, link, and the stepper's active dot.
   - Muted token left at the brief's default `#A1A1AA` (zinc-400): `(0.3596+0.05)/(0.003448+0.05)
     = 7.66:1` — the brief only asked the accent hue to be recalculated, not muted.
   - Diversity check: violet is distinct from this round's flagged `amber`/`teal` saturation outliers
     and from the canon default `#6E56CF`, satisfying both the hue assignment and the
     diversity-avoidance note.

2. **What**: body-column width per the 0.44em/char (not `ch`) arithmetic.
   **Decision**: three literal pixel `max-w-[…]` values, one per body-copy size actually used on
   the page, derived from `chars-per-line = container-px / (0.44 × font-size-px)`:
   - Hero subhead, 18px: `0.44 × 18 = 7.92px/char` → 70-char line ≈ 554px, 75-char ceiling ≈ 594px.
     Container chosen: **550px** → `550 / 7.92 = 69.4 chars`. At target, under ceiling.
   - Section body copy, 16px: `0.44 × 16 = 7.04px/char` → 70-char ≈ 493px, ceiling ≈ 528px.
     Container chosen: **492px** → `492 / 7.04 = 69.9 chars`. At target, under ceiling.
   - Testimonial quotes, 14px: `0.44 × 14 = 6.16px/char` → 70-char ≈ 431px, ceiling ≈ 462px.
     Container chosen: **430px** → `430 / 6.16 = 69.8 chars`. At target, under ceiling.
   **Why**: computed per design-principles §Typography's own formula, not guessed; `ch` was never
   used as a width unit anywhere on the page specifically because the brief flags it as ~35% too
   wide a proxy for Pretendard's mixed-script average glyph advance.

3. **What**: the device's exact formula and copy (brief specifies the *mechanism* — a formula and a
   per-grade lookup — but not the numbers or sentences).
   **Decision**: `estimatedPrice = round(basePrice × multiplier[step])` with multipliers
   `[0.52, 0.67, 0.81, 0.94]` for Good/Very Good/Excellent/Like New, and a four-entry `buyerNote`
   lookup array, both defined once in `model.ts` and called from the Hero card, the "Value, three
   ways" recap, the closing CTA headline, and (with each listing's own fixed base price/step) every
   Product Preview card — never duplicated as a literal.
   **Why**: arbitrary multipliers (chosen to read as a plausible, monotonically increasing resale
   curve for secondhand apparel/electronics), but the *mechanism* — base price × grade multiplier,
   one shared function — is exactly what the assignment requires in place of four hardcoded price
   strings, and it is what makes the closing-CTA-cites-the-same-number requirement checkable: it is
   the same function call, not a re-typed number.

4. **What**: representative hero item and the four Product Preview listings (brief asks for "a
   representative product photo" and "rich preview cards" without naming products).
   **Decision**: a wool-blend overcoat as the hero's steppable item (clothing reads condition-grade
   steps intuitively — visible wear scales naturally from Good to Like New), plus sneakers/watch/
   camera/backpack as the four fixed-grade Product Preview listings, each a different category so
   the grid doesn't read as four variations on one product.
   **Why**: arbitrary product choice; fixed `images.unsplash.com/photo-<id>` URLs per
   page-brief-core §2 (deliberately chosen content, not a random-image host), each image container
   given a fixed `aspect-[4/3]` and a reserved background color per the brief's image-discipline
   rule, and every condition-grade badge placed in a row below the photo (never an absolute overlay
   on it), per the brief's explicit badge-placement rule.

5. **What**: mobile (<lg) document order inside the Hero component (brief explicitly calls out this
   exact failure mode from a prior round and asks candidates to check real JSX source order, not
   just the desktop grid).
   **Decision**: the proof card (photo, badges, live price, buyer note, stepper) is the *first*
   child in Hero's JSX, the headline column is second; `lg:order-2`/`lg:order-1` only swap the
   *visual* position back to a conventional text-left arrangement once the two columns sit
   side-by-side at the `lg` breakpoint. Below `lg` there is no order override, so the stacked
   single-column mobile view renders the graded product and its live controls before the headline
   text, with no scrolling required to reach them.
   **Why**: structural safeguard against the specific, previously-flagged failure mode (DOM order
   burying proof below a long headline/subhead/CTA block on narrow viewports) rather than relying on
   keeping hero copy short enough to "probably" still fit above the fold — this way fold compliance
   doesn't depend on exact viewport height arithmetic I can't verify without running the dev server.

6. **What**: which three things the "Value, three ways" section restates, and whether it needs its
   own copy of the stepper control.
   **Decision**: three cards — "The badge" (grade name + step position + a cumulative progress bar,
   plus a same-page anchor link back to the Hero's control), "The price" (the same formula spelled
   out as `base × multiplier% = estimate`, plus the same discount %), and "For the buyer" (the same
   `buyerNote` sentence) — with no second Prev/Next control; all three read the one `step` state
   lifted into `Client.tsx` and call the same `model.ts` functions the Hero's stepper drives.
   **Why**: the assignment requires the stepper's *effects* to land inside Hero, not that every
   later restatement duplicate the control itself; a second live control would be redundant and risk
   reading as decoration rather than function. This also directly exercises the open-delta rule that
   *every* textual restatement of the control's state — not just the closing headline — must call the
   same derivation, including the "Step n of 4" caption-style chrome inside this section.
