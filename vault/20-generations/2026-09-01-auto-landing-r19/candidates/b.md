# Candidate b — Reverse Auction Ledger

One-line concept: a live order book of six verified sellers competing for the same iPhone 14 Pro sale, re-ranked in real time by three weight sliders (price / speed / trust) whose current setting is threaded through `useMemo` all the way to the closing CTA, so the "leader" named at the bottom of the page is always the same one sitting at the top of the table.

Files: `app/src/app/landing-evolve/r19/b/{page.tsx,client.tsx,Hero.tsx,Ledger.tsx,WeightControls.tsx,Badges.tsx,PhotoTile.tsx,ProductPreview.tsx,ValueSection.tsx,SocialProof.tsx,ClosingCTA.tsx,SiteHeader.tsx,data.ts,scoring.ts,tokens.ts}`.

## 브리프에 없던 것

**1. Page background hex**
① The brief left the exact light-ground hex open ("paper/off-white feel appropriate to a ledger").
② `#FAFAF8` — a warm, very slightly off-white paper tone — for the page; true `#FFFFFF` reserved for the ledger card and other raised surfaces so they read as a distinct layer sitting on the page rather than blending into it.
③ A pure-white ground would make the white ledger card invisible against it; a two-tier near-white system (paper vs. card) is how real ledgers/forms separate "the page" from "the document," which fits the archetype directly.

**2. Accent hue + exact contrast math**
① The brief bans violet and requires the exact accent hex be checked against both white and the dark-ink token, with the arithmetic shown.
② Chose a single deep ink-amber, `#92400E` ("ledger stamp"), used for the CTA button fill, the live-pulse dot, the AI-match badge, the rank-1 avatar, and link/focus color — nothing else. Verified with the WCAG relative-luminance formula (linearized sRGB, `L = 0.2126R + 0.7152G + 0.0722B`, `contrast = (L1+0.05)/(L2+0.05)`):
  - `#92400E` vs `#FFFFFF` (white) = **7.09:1** — clears 4.5:1 for body text *and* clears it for white text sitting on an `#92400E` fill (the fill-background rule), so the solid CTA button and rank-1 avatar chip are safe with white text at any size.
  - `#92400E` vs `#FAFAF8` (page bg) = **6.79:1** — clears 4.5:1 for the "Start selling" nav link and any body-size accent text on the page ground.
  - `#92400E` vs `#18181B` (zinc-900, the dark-ink token) = **2.50:1** — fails the body-text floor, so the accent is never set as text or fill against the dark ink; every accent instance in the page sits on white or paper, never on dark ink.
  - Also checked `#92400E` text against Tailwind v4's actual `amber-50` badge fill (`oklch(98.7% 0.022 95.277)`, converted to linear sRGB rather than assumed) = **6.84:1** — the AI-match badge tint pairing is safe. (Tailwind v4 ships colors in OKLCH, not the sRGB hex I'd have guessed from v3 muscle memory — I converted the actual `--color-zinc-*`/`--color-amber-*`/`--color-emerald-700`/`--color-rose-700` OKLCH triples from `node_modules/tailwindcss/theme.css` to linear sRGB myself to get real numbers rather than stale hex assumptions; e.g. real `zinc-500` vs `zinc-100` = 4.39:1, matching the brief's own "fails 4.5" example almost exactly.)
③ Amber/copper reads as a ledger ink-stamp or wax seal rather than a "tech" hue, keeps the palette distinguishable from the rank-delta emerald/rose (so the one brand accent is never confused with the functional up/down signal), and the ink-on-dark failure is exactly why the accent never appears on the dark-ink token anywhere in the file — every usage was audited against that one failing pair.

**3. Muted-text policy: zinc-600 everywhere, never zinc-500**
① The brief gives two different floors depending on surface tone (zinc-500 near-white / zinc-600 tinted) and warns the ledger's striped rows are a live risk.
② Standardized on `zinc-600` for every piece of real (non-decorative) muted text on the page, regardless of which of the two surface tiers it sits on. Real numbers: `zinc-600` vs `white` = 7.73:1, vs `zinc-50`(page) = 7.40:1, vs `zinc-100`(stripe) = 7.02:1 — all comfortably clear 4.5:1. `zinc-500` was measured too (4.83 / 4.62 / 4.39 against the same three) and dropped as a text color entirely once I saw how close the near-white cases run to the 4.5 floor.
③ The ledger's alternating row stripes (`bg-zinc-50`/`bg-zinc-100` at different points) make the "which floor applies" bookkeeping tedious and error-prone to get right per element; picking the stricter floor as the house rule for every text instance removes the whole failure class rather than auditing it tile-by-tile. `zinc-500` is only ever used on non-text SVG icons (Truck/ShieldCheck, marked `aria-hidden`), which axe's `color-contrast` rule doesn't evaluate.

**4. Ledger table column widths (`table-fixed` + `<colgroup>` %)**
① The brief requires percentage widths, not `min-w`, and flags the ledger table specifically as the highest-risk spot for a forced horizontal scrollbar.
② `Rank 11% · Seller 26% · Price 16% · Signals 21% · Score 26%` (sums to 100).
③ Hand-checked against the narrowest case (390px viewport, 16px section padding, `p-5` card padding ⇒ ~318px table width): Rank needed enough room for a delta chip ("+2"/"0", not the wider word "even" I started with — swapped it out once the arithmetic showed it wouldn't fit); Seller needs room for a 24px avatar + a truncated name (`truncate` class, safe by design since it clips rather than overflows); Signals and Score both fit their content with margin to spare. No column relies on `whitespace-nowrap` without an `overflow-hidden`/`truncate` backstop, so nothing can force the table wider than 100%.

**5. Body-copy container width (0.44em constant)**
① The brief bans `ch` units and requires the container width be derived from `chars_per_line = container_px ÷ (0.44 × font_size_px)`, shown as arithmetic, target ~70 / ceiling 75.
② All flowing body paragraphs (hero subhead, section intros, value-card body, closing-CTA paragraph) use `max-w-[480px]` at `text-base` (16px).
③ Arithmetic: `480 ÷ (0.44 × 16) = 480 ÷ 7.04 = 68.2` characters per line — inside the ~70 target, safely under the 75 ceiling, with a little headroom rather than sitting right at the edge.

**6. Display face and headline clamp**
① One display face allowed, grotesk banned this round; brief explicitly flags mono as a strong fit for a ledger and leaves the exact clamp values open.
② Used `--font-display-mono` (JetBrains Mono Display) for the h1 and the brand wordmark only, applied via inline `style={{ fontFamily: "var(--font-display-mono)" }}` rather than a Tailwind arbitrary class — `--font-display-mono` is declared in a plain `:root` block in `globals.css`, outside `@theme inline`, so Tailwind never generates a `font-[…]` utility for it (confirmed by reading the file's own comment on this); an existing page in the repo (`v21/Hero.tsx`) uses the same inline-style approach for a sibling display token, which is what led me to it instead of guessing at arbitrary-class syntax. `--font-mono` (body mono, exempt from the one-display-face rule per the brief) *is* inside `@theme inline`, so the small folio numbers ("01 — Ledger" etc.) use the native `font-mono` utility instead. Headline clamp: `clamp(2.75rem, 1.7rem + 3.4vw, 4.25rem)` — flat at 68px above a ~1200px viewport (checked against the hero's actual `lg:col-span-5` column width at 1280/1920px so the three short `block`-level phrase lines ("Six sellers." / "One item." / "Ranked live.") don't overrun it), scaling down to a 44px floor at 390px.
③ A monospace display face is the one typeface choice that unmistakably reads "order book / terminal" rather than "generic SaaS headline," which is the whole point of the archetype; block-level phrase lines (not a single wrapped sentence, not manual `<br/>`s) were chosen after checking that a naive sentence would wrap mid-clause at the computed column width, while three short independent phrases stay safely inside it at every breakpoint tested.

**7. Product imagery: generative tiles, not `images.unsplash.com`**
① The brief allows either a fixed Unsplash photo id or generative SVG/CSS, but this sandbox's outbound proxy cannot reach `images.unsplash.com` to confirm a hand-picked id actually resolves.
② Built `PhotoTile.tsx` — a fixed-aspect-ratio, flat-color (`zinc-100` bg, `zinc-200` border) tile with a centered lucide icon standing in for every product photo (flagship listing + all four product-preview cards).
③ A wrong photo id would ship a silently broken image on every card with no way to catch it before publish; a deterministic icon tile stays inside the near-monochrome palette and reads closer to a spec-sheet entry than a lifestyle photo, which suits a ledger better than real photography would anyway. (An existing page in the repo, `v19/SwatchTile.tsx`, documents the exact same constraint and reached the same conclusion independently, which is what confirmed this was the right call rather than an overcautious one.)

**8. Default slider weights + scoring formula**
① The brief requires the composite score to be a real computation, not decoration, but leaves the exact weighting scheme and default values open.
② Three independent 0–100 sliders (not required to sum to 100): default `price 45, speed 20, trust 35`. Composite = `Σ(weight_i × subscore_i) ÷ Σweight_i`, where price/speed sub-scores are min–max normalized across the six active offers (cheaper/faster ⇒ higher sub-score) and trust is used directly (already 0–100). If every slider is dragged to 0, the formula falls back to an equal 1/1/1 blend instead of dividing by zero.
③ Letting weights be independent (rather than forcing them to sum to 100) is a much better direct-manipulation experience — the visitor never has to "balance a budget" to explore a single axis — while the weighted-mean formula still guarantees a stable, always-defined 0–100 composite regardless of the slider positions.

**9. Rank-delta computation (previous-order tracking)**
① The brief requires rank movement to be visually legible (row reorder or a delta indicator, icon + text, never color alone) but doesn't prescribe the mechanism.
② `Ledger.tsx` keeps a `useRef<string[]>` of the previous render's offer-id order, diffs the newly computed order against it inside a `useMemo`, and updates the ref in a `useEffect` that runs after paint — so a slider drag shows the *actual* rank change from the prior state, and the delta is `0`/icon-`Minus` on first mount (no false movement on load). Every delta renders as an icon (`ArrowUp`/`ArrowDown`/`Minus`) *and* a signed number, never color alone, per the brief's requirement.
③ This is the standard "diff against last-committed order, commit the new order after paint" pattern for exactly this kind of derived-delta UI, and it keeps the whole ledger a pure function of `weights` (no hidden mutable score state) while still producing a stateful-feeling delta.

**10. Dropped `aria-controls` on the row-expand toggle**
① Not in the brief directly, but the a11y section's warning to "audit states reachable only after opening" led me to check the expand/collapse toggle closely, and I found a real risk: the toggle's `aria-controls` pointed at the detail `<tr>`'s `id`, but that row is conditionally rendered (`AnimatePresence`) and doesn't exist in the DOM in the page's default (collapsed) state — which is exactly the state an automated a11y scan captures.
② Removed `aria-controls` from the toggle button; kept `aria-expanded` (which is always valid, since the button itself always exists) as the sole ARIA state signal for the disclosure.
③ `aria-controls` referencing a not-yet-existent id is a legitimate `aria-valid-attr-value`-class failure risk on the very first (default) render the gate scans, and `aria-expanded` alone is a fully valid, common accessible-disclosure pattern — better to drop the belt when the suspenders are what's actually load-bearing here.
