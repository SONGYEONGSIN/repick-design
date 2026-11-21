# Candidate C — "Draw-Your-Budget Curve"

One-line concept: a dark, cyan-accented hero where six independently-draggable/keyboard-adjustable
monthly points (Jan–Jun, each 0–400 on its own axis) form a hand-drawn budget curve; the real sum
of all six points drives a live "estimated items you could acquire" / "projected savings vs. buying
new" readout (a deterministic cheapest-first walk of a fixed inventory), while a second, independent
link reads only the currently-focused point's own value to pick which verified listings a Product
Preview grid shows — and the closing CTA cites that same `acquisitionPlan(total)` function, never a
hardcoded number.

Files: `app/src/app/landing-evolve/r51/c/{page.tsx, LandingClient.tsx, Hero.tsx,
BudgetCurveEditor.tsx, ProductCard.tsx, ProductPreview.tsx, ValueSplit.tsx, SocialProof.tsx,
ClosingCTA.tsx, data.ts, tokens.ts, Reveal.tsx, useMounted.ts, usePrefersReducedMotion.ts}`.

## Device mapping (dedup check against this catalog before building)

Read both named precedents in full before writing any component:
- **r49/b "Week Scrubber"** is a single native `<input type="range">` — ONE playhead selecting
  ONE position on a fixed 12-week timeline. Structurally this is a position-selector, not a
  value-shape-builder: there is exactly one number in its state (`weekIndex`).
- **r18/c "Trust Score Console"** is four native-range weight sliders that ALWAYS renormalize
  (`raw_i × weight_i / Σweight`) into a single composite that sums to a constant-ish gauge value —
  the four values are not independently meaningful, only their *ratio* is, and the dial's whole
  point is that pushing one slider up visually "steals" from the others.
- **This candidate** is neither: `values: number[]` holds SIX genuinely independent numbers, each
  free to range 0–400 with no renormalization and no coupling to any other point — the visitor can
  set all six to 400, or all to 0, or any shape in between, and nothing auto-adjusts a sibling
  point. State shape (`number[6]`, unconstrained) and file/component names
  (`BudgetCurveEditor`, not `TimeWindowSelector`/`WeightDial`) are deliberately distinct from both.
  Also skimmed `r50/c`, `r48/c`, `r45/c` candidate notes in `vault/20-generations/*/candidates/` —
  all single-handle/dual-handle timeline or radial-gauge devices, none a multi-point curve.

## 브리프에 없던 것

1. **Body-copy container width — exact method, not `ch`, not estimated.**
   Formula given by the brief: `chars/line = containerWidthPx ÷ (0.44 × fontSizePx)`, targeting
   ~70 chars with margin under the 75-char cap.
   - 16px body paragraphs (Hero subhead, Product Preview intro, Closing CTA line): `492px ÷
     (0.44 × 16) = 492 ÷ 7.04 = 69.89 chars`. Used `max-w-[492px]` on all three.
   - 12px dynamic captions (Hero's "$X left unspent…" line, Product Preview's fallback line):
     `370px ÷ (0.44 × 12) = 370 ÷ 5.28 = 70.08 chars`. Used `max-w-[370px]` on both — these two
     are state-derived strings whose length varies with the live values (item titles differ in
     length), so I capped the width defensively rather than measuring one sample string, since a
     longer title (e.g. "Direct-Drive Turntable") could otherwise push a single run past 75 chars
     on a wide desktop panel where nothing else would force a wrap.
   - 11px micro-captions (Social Proof's historical-figures disclaimer, Closing CTA's small
     reinforcement line, both footer lines): `339px ÷ (0.44 × 11) = 339 ÷ 4.84 = 70.04 chars`.
     Used `max-w-[339px]`.
   - Caught on self-review, not on first pass: these three short captions sit inside very wide
     containers (`max-w-[1280px]` sections, a wide rounded panel, a `justify-between` footer row)
     where nothing else would force them to wrap — at 1216px of available width and 11–12px type,
     an unwrapped one-liner can run 90–130 characters before hitting any edge, well past the
     75-char ceiling, even though the paragraph itself is "short" in word count. Line length is a
     property of the actual rendered line, not of how many sentences the copy has, so I went back
     and capped width on every one of them rather than only the long multi-sentence paragraphs.

2. **Cyan accent — used exactly as the brief precomputed, not recomputed or guessed.**
   `#22D3EE` text directly on `#0B0B0F` = **10.87:1** (brief's own figure) — confirmed this clears
   body-size AA on its own, so unlike a dimmer accent (e.g. this repo's default `#6E56CF` at only
   3.73:1 on bg), cyan needed **no separate bright "tint" derivative** for small text/icons/focus
   rings — the single hex is used for text at any size directly on bg or panel surface. White on
   the `#22D3EE` fill = **1.81:1** (fails, any size, per the brief) and dark ink `#0B0B0F` on the
   same fill = **10.87:1** (always safe) — so every filled surface on this page (CTA buttons, the
   active category chip, the match-% badge) carries dark-ink text, never white, confirmed in
   `tokens.ts`'s `ON_ACCENT_FILL_TEXT` and grepped across every component (zero `text-white` on an
   accent-fill background anywhere in the folder).
   Muted text computed separately (not given by the brief): `#A1A1AA` (zinc-400, this repo's
   documented dark-theme floor) vs `#0B0B0F` → sRGB→linear→WCAG relative luminance by hand:
   `L_muted = 0.3567`, `L_bg = 0.0034`, contrast = `(0.3567+0.05)/(0.0034+0.05) = 7.61:1`. Against
   the panel surface `#13131A` (`L = 0.0068`): `7.16:1`. Both clear AA with wide margin — one
   token, safe on both surfaces used on this page, recorded in `tokens.ts`.

3. **Two independent live links, not one, both audited for the "hardcoded caption" trap.**
   The brief asks for a cumulative/total-derived readout AND a product preview tied to "the
   current point's value" — these are two different numbers (the SUM of all six points vs. the
   SINGLE active point's own value), so I deliberately kept them as two separate function calls
   (`acquisitionPlan(totalOf(values))` vs. `affordableForMonth(values[activeIndex], category)`)
   rather than collapsing them into one, so neither can accidentally become a stale copy of the
   other. Audited every caption near the curve by hand for the specific failure mode the brief
   warned about (a correct headline number next to a hardcoded sibling caption that contradicts it
   at an edge of the range): the $0/$100/.../$400 axis labels are genuinely static (they're the
   fixed scale, never the curve's value) and were left as literals computed once from
   `MAX_VALUE`/`valueToY`, but every other number-bearing string near the chart — each point's
   hover/focus tooltip, the "Total across 6 months" stat, "Estimated items", "Projected savings",
   the "$X left unspent — $Y more unlocks…" line, Product Preview's "Showing picks for…" caption
   and its fallback-gap line, and the Closing CTA's paragraph — all read `values`/`activeIndex`
   live and call `formatUsd`/`acquisitionPlan`/`affordableForMonth` directly in JSX, with zero
   hand-typed numbers anywhere in those strings. Checked both edges explicitly: all six points at
   $0 (`itemCount: 0`, copy switches to "Plan at least $45…" instead of dividing by zero or
   printing "$0 saved" against a stale item list) and all six points at $400 (`total: $2,400`,
   well past the $1,375 needed for all eight listings, copy switches to the "enough for everything
   currently listed" branch instead of still naming a `nextItem` that no longer exists).

4. **Chart geometry chosen to need zero trigonometry (so the brief's SVG-rounding rule doesn't
   even apply).** Point position is pure linear interpolation — `x` from a fixed index/count ratio,
   `y` from a fixed value/range ratio — with no angle, no `Math.sin`/`cos` anywhere in
   `data.ts`. Still rounded every computed coordinate to 2 decimals (`.toFixed(2)`) out of caution
   for hydration-mismatch risk, even though the "round SVG trig coordinates" rule is specifically
   about trig functions' floating-point drift, which this chart has none of.

5. **Unsplash photo ids reused from already-vetted ids already live elsewhere in this exact
   catalog, not freshly guessed.** Checked `r41/a/data.ts`'s `CATEGORY_PHOTO` map (one fixed id per
   category, already reused across r28/a, r29/a, r29/b, r33/c, r50/c, r50/b and others) and matched
   my five categories against it: Cameras → `1495707902641-75cac588d2e9`, Watches →
   `1523275335684-37898b6baf30`, Sneakers/Footwear → `1542291026-7eec264c27ff`, Furniture →
   `1567538096630-e0c55bd6374c`, Audio → `1491553895911-0055eca6402d` — one id per category, reused
   across that category's two listings each, same pattern `r41/a` itself used. Chose this over
   inventing eight brand-new ids specifically to avoid the documented risk (this sandbox cannot
   reliably verify a fresh Unsplash id resolves) while still satisfying "fixed id, never a
   random-seed service."

## Accessibility self-audit (states the default-render gate can't see)

- **Keyboard path for each point**: every point is a real `<button role="slider">` with
  `aria-valuemin={0}`/`aria-valuemax={400}`/`aria-valuenow={value}` and a human
  `aria-valuetext` ("$170 planned for May"). Arrow Up/Right and Down/Left move it by `$10`
  (`STEP`), Page Up/Down by `$50` (`STEP_LARGE`), Home/End jump to `$0`/`$400` — independently per
  point, Tab-reachable in month order, no drag required for full use. A single `sr-only`
  instruction paragraph above the track explains this once; no per-point duplicate instructions.
- **One `aria-live="polite"` region**, placed directly on the visible three-stat readout panel
  itself (not a separate hidden duplicate) — per-point drags update the DOM inside that live
  region, so a screen-reader user hears the new total/items/savings after any point changes,
  without six separate live regions firing on every pixel of a drag.
- **Hover is never the only way to see a value** — each point's dollar label renders at normal
  opacity at rest (muted color); hover/focus only brightens it to accent + bold + a
  `motion-reduce`-gated 1.08× scale. No information is hidden behind hover-only, and the active
  point is additionally marked by both color AND font-weight (never color alone).
- **Non-default states self-audited**: Product Preview's category-filter chips (own
  `aria-pressed` state, re-checked `#22D3EE`/`#0B0B0F` fill contrast = 10.87:1, same as the
  always-rendered match-% badge) and each card's "Why this match" disclosure
  (`aria-expanded`/`aria-controls`, native `hidden` attribute, not a class-toggled `display:none`).
