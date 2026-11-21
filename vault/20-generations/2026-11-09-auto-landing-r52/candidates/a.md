# Candidate a — self-report

## 1. One-line concept

A single horizontal "listing age" scrubber (Day 0–60) drives two synchronized live displays at
once — a numeric match/price/pool stat strip, and the rich product-preview cards' own badges
(match %, price, discount) — so dragging one continuous value visibly ages real listings on a
resale marketplace, inside the Hero itself and again, mirrored onto the same state, in the Value
section.

## 2. Accent hue + contrast math

Deviated from the brief default `#6E56CF` (and from r51's cyan `#22D3EE`) to amber `#F59E0B`, to
keep this round's palette diverse and because "time/urgency" fits a listing-age mechanic
semantically. Computed by hand (sRGB → linear → WCAG relative luminance), not guessed:

- `Luminance(#0B0B0F)` = 0.00346, `Luminance(#F59E0B)` = 0.43883, `Luminance(#FFFFFF)` = 1.0
- **Accent text directly on bg**: (0.43883+0.05)/(0.00346+0.05) = **9.15:1** — clears AA at *any*
  text size directly on `#0B0B0F` or the `#13131A` card surface. Because this already clears body
  AA on its own, amber does **not** need a separate brighter "tint" derivative for small
  text/icons/focus rings the way the brief's dimmer default `#6E56CF` (3.73:1) does — one hex
  serves every role on the background.
- **White text on an accent fill**: (1.0+0.05)/(0.43883+0.05) = **2.15:1 — fails at every size.**
- **Dark-ink (`#0B0B0F`) text on an accent fill**: (0.43883+0.05)/(0.00346+0.05) = **9.15:1 —
  passes at every size.**
- This is the *inverse* of the brief's worked default-hue example (which puts white on the fill
  and reserves dark ink for large/non-text roles). Amber is a *light* accent, not a mid-dark one,
  so every accent-filled surface on this page (buttons, the match-score chip) carries dark-ink
  text, never white. Recorded in `tokens.ts` alongside the hex.

## 3. Body container width arithmetic

Used the required constant (Pretendard-mixed-body average advance = `0.44em`, not `ch`) and solved
for container width rather than guessing a `ch`/round-number value:

- Hero subhead: target ~70 chars @ 17px → width = 70 × 0.44 × 17 = **524.6px** → used
  `max-w-[520px]` → actual chars = 520 / (0.44 × 17) = 520 / 7.48 ≈ **69.5 chars** (under 75, close
  to 70, as instructed).
- Section intro paragraphs (Product Preview / Closing CTA), @ 16px → width = 70 × 0.44 × 16 =
  **492.8px** → used `max-w-[500px]` → actual chars = 500 / (0.44 × 16) = 500 / 7.04 ≈
  **71.0 chars** (under 75).
- Card/testimonial copy (15px, inside a 3-col grid, effective inner width ≈376px) → 376 /
  (0.44 × 15) ≈ **57 chars** — shorter than the 65–75 target, which the brief explicitly allows for
  "caption/sidebar" text.

## 브리프에 없던 것

① **Concrete scrub domain and why it's not a re-skin.** The brief fixes the input shape (one
continuous drag value) and output novelty requirement but leaves the domain open.
② Chose **"listing age in days" (0–60)** as the scrubbed dimension, driving (a) a stat-strip
(avg. match score / est. days-to-match / qualified-buyer pool) and (b) the actual product cards'
own match %, price, and discount badges — two synchronized displays from one axis, plus the same
mechanism mirrored into the Value section on the identical lifted state.
③ Checked this against the listed catalogue (chart/dial recompute, conversational transcript,
track-changes markup, renormalizing radar, variable-cardinality set-builder, 2D coordinate plot,
layer-stack, histogram re-bucketing, branching quiz, duel comparator, drag-reorder ladder,
budget-curve editor, Sankey flow, seller-tier ladder) — none of those are a single continuous time
axis that ages real listing cards *and* feeds a separate numeric panel simultaneously, so this is a
genuinely different input×output pairing, not a re-skin of any one entry. The "time since listed"
domain itself is also a natural, under-used fit for a resale marketplace (unlike budget/trust/
priority axes already explored) since depreciation-over-time is literally how resale pricing works.

① **Per-item price-decay / match-growth formulas.** Nothing in the brief specifies how "match %"
or "price" should respond to the scrub value. ② Modeled both as smooth exponential curves —
`price(day) = floor + (start − floor) × e^(−day/halfLife)` (decaying toward a floor) and
`match(day) = baseFloor + (ceiling − baseFloor) × (1 − e^(−day/(halfLife×1.4)))` (rising toward a
shared ceiling) — per item, using fixed per-item constants (no randomness). ③ Arbitrary but
deliberately smooth/monotonic and bounded, so every day value in range yields a sane number (no
spikes, no divide-by-zero, no negative price), and both curves are literally the live proof shown
on cards and in the stat strip (see `model.ts`).

① **Default scrub position.** The open-delta note requires every control reset to show a
genuinely useful value, not an empty/zero one. ② Set `DAY_DEFAULT = 18` (not 0, not the max) and
framed it in-code as "the model's own recommended re-price checkpoint." ③ Arbitrary pick, chosen
to sit roughly a third into the range so default numbers read as mid-range and meaningful (at day
18: e.g. the first listing shows ~50% off / ~81% match) — verified by hand-walking the formula in
③ above, not by guessing; day 0 was also checked and still yields non-zero, legible numbers (e.g.
~30% off / 58% match), so even dragging to the floor never produces an empty state.

① **Six fabricated listings (titles, brands, prices, grades, verification flags, match-reasoning
tags).** Not specified by the brief beyond "rich cards." ② Picked six resale categories spanning
fashion/electronics/home goods (sneakers, watch, jacket, film camera, bag, table lamp) with varied
retail prices ($95–$410) and varied `halfLifeDays`/`baseMatchFloor` so the live recompute visibly
differs card-to-card, not in lockstep. ③ Arbitrary dummy data, deterministic (no `Math.random`),
chosen for category variety so the page doesn't read as fashion-only.

① **Product imagery.** The brief allows either a specific fixed photo or generated SVG/CSS art.
② Used **generated SVG art only** (flat solid-fill geometric category icons on a panel background)
and skipped photos/`next/image` entirely. ③ Chosen deliberately to avoid any photo-load/CLS risk
and to sidestep the anti-slop "line-art/blueprint" trap by using solid filled shapes rather than
thin-stroke schematic outlines — the brief states generated SVG/CSS "avoids this risk entirely,"
so this candidate takes that option rather than sourcing a real Unsplash photo.

① **Card title markup (`<p>` instead of `<h3>`).** Not addressed by the brief's heading rules
directly. ② Rendered repeating card titles as styled `<p>` elements, not `<h3>`, keeping the page's
only heading levels at `h1` (Hero) and `h2` (one per section). ③ Chosen specifically to satisfy the
hard "no heading-level skip" rule — six repeating card titles as true `<h3>`s under an `<h1>` with
no intervening `<h2>` would have created exactly that skip.

① **Scrubber control markup.** The brief specifies "single continuous drag/scrub value" but not
the concrete widget. ② Implemented as a native `<input type="range">` with custom CSS for the
track fill/thumb (via a plain `<style>` block, not `styled-jsx`), rather than a custom
Framer-motion pointer-drag handle. ③ Chosen for built-in keyboard accessibility (arrow keys, native
focus handling, `aria-valuetext`) and robustness over hand-rolled pointer-event math, at the cost
of a little custom CSS for the thumb pseudo-elements.

① **Trust marks / testimonial copy (Social Proof section).** Not specified. ② Fabricated four
generic protection-program names and three short buyer/seller quotes, explicitly labelled "as of
this snapshot" in the eyebrow. ③ Arbitrary dummy copy, deliberately framed as a static snapshot
(not wired to the scrubber) so the page never implies every number everywhere is live — only the
Hero/Preview/Value/Closing figures that genuinely are make that claim.
