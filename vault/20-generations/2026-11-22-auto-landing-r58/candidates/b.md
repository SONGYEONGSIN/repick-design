# Candidate B — Add-On Combination Tier

**One line:** Three independent coverage toggles (Shield Guard / Loss Watch / Resale Lock) resolve to one of 7 named tiers looked up by the exact *combination* that's on — Shield+Resale Lock and Shield+Loss Watch are both "2 of 3" yet are unrelated tiers with unrelated copy and unrelated prices — paired with a live itemized price breakdown, both read off one shared `deriveCoverage()` function everywhere on the page.

## Route

`app/src/app/landing-evolve/r58/b/` — `page.tsx` + `Client.tsx` + `Hero.tsx` / `CoverageDevice.tsx` / `ListingCard.tsx` / `ProductPreview.tsx` / `ValueSplit.tsx` / `SocialProof.tsx` / `ClosingCta.tsx` / `Reveal.tsx` + data modules `coverage.ts` / `listings.ts` + `tokens.ts`.

## The device

Three booleans — `shield` (Shield Guard, +$149), `loss` (Loss Watch, +$89), `resale` (Resale Lock, +$59) — each toggled independently. `coverage.ts` holds a `TIER_LOOKUP: Record<string, {label, blurb}>` keyed by the active ids joined in a fixed order ("shield", "loss", "resale", "shield+loss", "shield+resale", "loss+resale", "shield+loss+resale") — 7 entries, one per non-empty subset of 3 booleans. This is a genuine combination→label table, not a popcount threshold: `shield+loss` → **"Guarded Hold"** ("built for keeping the item for years") and `shield+resale` → **"Resale-Ready Shield"** ("a documented warranty history raises your locked resale floor") are both "2 of 3 on" but are unrelated products with unrelated recommendation copy and no shared wording. `deriveCoverage(state)` returns one object — `{ key, tierLabel, tierBlurb, lines, addOnTotal, itemPrice, total }` — and every surface on the page (Hero, the full breakdown panel in "Value, three ways", the 7-row reference table, and the Closing CTA) reads from a call to this exact function, never a re-typed copy. The itemized breakdown renders one line per *active* add-on (never collapsed into a single total) in both the compact Hero device and the full mirror.

Two more ways to reach a point in the same 7-state combination space, beyond the three manual toggles: a quiz-like "Not sure where to start?" persona picker (3 presets — long-term keeper, frequent traveler, likely reseller — each setting all three booleans at once through the same `setState`), and the reference table itself, whose 7 rows are produced by calling `deriveCoverage` on all 7 hand-listed `CoverageState` objects in `ALL_COMBINATIONS`, with the row matching the live state visibly marked "Current."

Default state is `{ shield: true, loss: false, resale: true }` → "Resale-Ready Shield," non-empty and reused as the exact target of every reset (`resetToDefault` always calls `setState(DEFAULT_COVERAGE)`), on first load and every later reset alike.

## Interactions (4+)

1. Hero's 3 add-on toggle buttons (`aria-pressed`, icon + text + price, no color-only state).
2. The persona quick-fit quiz in "Value, three ways" (presets all 3 booleans at once).
3. The Product Preview sort control (Best match / Lowest price / Biggest discount) — reorders cards, never hides any of the 4 badge types.
4. Scroll-triggered `Reveal` entrances (framer-motion `whileInView`, `prefers-reduced-motion`-gated, transform/opacity only).

## Hero-fold compliance

Document order is headline block, then device+proof block, in that literal JSX order, with no `order-*` utility anywhere — the 2-column desktop grid is just `lg:grid-cols-[1.08fr_1fr]`, so collapsing to one column at 390px keeps the same order. The compact Hero proof card uses a fixed 80×80px thumbnail laid out horizontally next to the title/price column (never a full-width stacked photo), and the compact device panel omits the tier eyebrow label, the blurb paragraph, the "Item price" breakdown line, and the reset link (all three are shown in the full mirror later) specifically to fit the fold — the tier label, the active add-ons' price lines, and the total survive in the compact view, satisfying "itemized breakdown + tier label, not collapsed into one number" without the full device's extra prose.

## 브리프에 없던 것

1. **Accent contrast math (required).** Theme is light (bg `#FFFFFF`), accent hue sky. Computed by hand via sRGB→linear→relative-luminance:
   - `sky-500 #0EA5E9` vs white → **2.77:1** — fails even the 3:1 floor, so it is not used as a hue token at all on this route.
   - `sky-600 #0284C7` (`ACCENT_LARGE`) vs white → **4.10:1** — clears the 3:1 large/bold-text and non-text floor but not 4.5:1 body-text AA. Reserved for large/bold accents and non-text fills only.
   - `sky-700 #0369A1` (`ACCENT`) vs white → **5.93:1** — clears body-text AA with room; used for small text, icons, borders, and the focus-visible outline.
   - White text on an `ACCENT` (`#0369A1`) fill → **5.93:1** (computed, not assumed) — passes AA at any size.
   - Dark ink (`#18181B`) on the SAME `#0369A1` fill → **2.99:1** — fails even the 3:1 large-text floor. So every accent-filled button/chip/badge on this route uses white text, confirmed by this number rather than eyeballed.
   - `zinc-600 #52525B` (muted) vs white → **7.75:1**, comfortably above the brief's tinted-surface floor too, so one `MUTED` constant covers both the near-white page background and the zinc-100 tinted panels without a second surface-dependent token.
   Decision: use `sky-700` as the one hue token for text/icon/border/focus-ring/fill (with white text), and `sky-600` only for large/bold decorative accents and non-text elements. Rationale: the brief's "light tint for small text" instruction is written from a dark-background frame (lighten the accent for small text); on a light background the equivalent move is to darken it — same intent, inverted direction. Noted explicitly since it's an adaptation, not a literal reading.

2. **Line-length computation (required).** Using the brief's 0.44em/glyph constant (not CSS `ch`): chars-per-line = container-px ÷ (0.44 × font-size-px).
   - Hero subhead, 16px → 7.04px/char; `max-w-[480px]` → 68.2 chars (ceiling 75 at 528px, 48px of headroom).
   - Value-split pillar copy, 13.5px → 5.94px/char; `max-w-[280px]` → 47.1 chars.
   - Card reasoning text, 13px → 5.72px/char; `max-w-[320px]` → 56.0 chars.
   - Closing CTA subhead, 16px → 7.04px/char; `max-w-[460px]` → 65.3 chars.
   - Testimonial quotes, 14px → 6.16px/char; `max-w-[360px]` → 58.4 chars.
   All five land comfortably under the 70-char target, let alone the 75-char ceiling.

3. **The underlying product.** The brief's device is add-on insurance for *something*; it doesn't say what. Picked a single resale item — a mirrorless camera kit — reused across all "listings" (varied only by condition/match/price) so the coverage math has one consistent base price ($1,240) to attach to. Rationale: keeps the device's price math legible (one item price + N add-on lines) rather than having to re-explain a different base price per card.

4. **Add-on pricing and the base item price.** Invented flat one-time fees ($149 / $89 / $59) and a $1,240 resale price (list $1,850, 33% off) — arbitrary but internally consistent numbers chosen so the 7 possible totals ($1,240–$1,547) stay in a believable, distinct-looking range for the reference table.

5. **Hero-fold vertical budget.** Where the brief leaves "feasible" to the builder's judgment, trimmed the compact device (no eyebrow label, no blurb, no "Item price" line, no reset link — all exist in the full mirror instead) and shortened Hero copy to a single short sentence per line, estimating section heights by hand (toggles ≈124px, breakdown panel ≈132px, proof card ≈188px, headline block ≈242px) to land the full fold around ~760px of the 900px budget rather than exactly at the edge.

6. **`dl` icon placement.** Put the icon inside `dt` (not beside the pair) for every icon-bearing `dl` (the proof-card badges); the coverage breakdown's `dl` rows have no icon, so they're plain `dt`/`dd` pairs, which the rule doesn't require an icon for.

7. **Reference table "Current" indicator.** The brief doesn't say how to mark the live-matching row in a static-looking table; added both a background tint (`sky-100`) AND a visible "Current" pill with white-on-accent text (not color alone), so the signal survives for both sighted-color and screen-reader users, and is itself computed via the same `row.key === currentKey` comparison rather than a separate hand-maintained flag.
