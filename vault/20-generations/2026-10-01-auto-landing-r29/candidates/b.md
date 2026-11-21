# Candidate b — Gatelist, the gate chain

One line: five independent buyer-requirement toggles (verified seller, original packaging, no
visible wear, ships in 24h, price-matched guarantee) drive a true cascading pipeline — each of 10
real listings is evaluated gate-by-gate in a live table, visibly stopping at the first active gate
it fails, with a running qualifying-count and "top pick" that stay live all the way to the closing
CTA — the pass/fail-cascade output form this catalogue has not shipped before (distinct from the
earlier show/hide multi-toggle and from the sibling round's continuous-slider re-ranking table).

## The 4 interactions implemented

1. **Gate toggle chain** — 5 independent `role="switch"` buttons (Verified seller only / Original
   packaging included / No visible wear / Ships within 24 hours / Price-matched guarantee). Each
   toggle actually re-evaluates all 10 listings in pipeline order; a listing that fails an active
   gate stops there and every later gate renders "unreached" for that row, not just hidden.
2. **Quick presets** — "Reset to recommended" (restores the 2-gate default), "Require everything"
   (all 5 on — drops the pool to exactly 1 qualifying listing), "No requirements" (all 5 off — the
   full 10-listing pool). A distinct control type (button vs. switch) for jumping to the interesting
   extremes without five individual clicks.
3. **Product-preview category filter** — 6 pill tabs (All/Camera/Lens/Watch/Sneaker/Bag) re-filter
   the listing-card grid in section 2, independent of the gate-chain state.
4. **Per-row "why" disclosure** — clicking a listing's row header in the gate-chain table expands
   an `aria-expanded`/`aria-controls`-wired sub-row explaining either why it qualifies or exactly
   which gate stopped it, with the listing's underlying condition note.

(Scroll reveals via `framer-motion` `whileInView` are additional polish, mount-gated per the
hydration rule below — not counted among the 4 interactive mechanisms above.)

## Accent contrast arithmetic

Computed with the WCAG relative-luminance formula via a small Node script (reproduced in
`tokens.ts`'s header comment), against both the page background `#FDFDFC` and the panel/alternating
surface `#F3F6F4`:

| Pair | Ratio | Floor | Use |
|---|---|---|---|
| `#059669` (ACCENT) on `#FDFDFC` | 3.70:1 | ≥3:1 (large/non-text) | pass-icons, big tabular-nums digits, large accent headline word |
| `#059669` (ACCENT) on `#F3F6F4` | 3.46:1 | ≥3:1 | same, on panel surfaces |
| `#047857` (ACCENT_DEEP) on `#FDFDFC` | 5.39:1 | ≥4.5:1 (body text) | small accent text (eyebrows, match %, links) |
| `#047857` (ACCENT_DEEP) on `#F3F6F4` | 5.04:1 | ≥4.5:1 | same, on panel |
| white `#FFFFFF` on `#047857` fill | 5.48:1 | ≥4.5:1 (reversed-DNA rule) | every filled chip/button/toggle-ON state with small white text |
| white `#FFFFFF` on `#059669` fill | 3.77:1 | **fails** 4.5:1 | base ACCENT fill is therefore never used under small white text |
| `#15171B` (INK) on page / panel | 17.63:1 / 16.49:1 | — | headings, primary text |
| `#52525B` (MUTED, zinc-600) on page / panel | 7.59:1 / 7.10:1 | ≥4.5:1 | all secondary/caption text, either surface |
| `#71717A` (MUTED_ICON, zinc-500) on page / panel | 4.75:1 / 4.44:1 | ≥3:1 non-text only | bypass/unreached icon glyphs — never used as actual text (4.44 would fail the 4.5 body floor on the panel) |
| `#3F3F46` (STOP, zinc-700) on page / panel | 10.26:1 / 9.60:1 | ≥4.5:1 | fail/held-back icon + text |

Deliberately near-monochrome: pass/fail/bypass/unreached are told apart by icon shape (check / x /
minus / dash) and a text label, not by introducing a second hue (e.g. red) for "fail" — only green
is used as an accent anywhere on the page, matching the brief's "accent is a tiny amount" intent.

## Body-width character-count calculation

Per the brief's exact constant (0.44em/char average, not `ch`):
`chars_per_line = container_px ÷ (0.44 × font_px)`

- Body copy: `524px ÷ (0.44 × 17px) = 524 ÷ 7.48 = 70.05 chars/line`
- Lead paragraph: `555px ÷ (0.44 × 18px) = 555 ÷ 7.92 = 70.08 chars/line`

Both land right at the ~70-char target with slack under the 75-char ceiling. One `MUTED` color
(`#52525B`) is used for body copy on both the page and panel surfaces (see table above), so there is
no separate "_PANEL" variant to track — simpler than the two-tier zinc-500/zinc-600 split used by
some sibling candidates, chosen because zinc-500 on this round's panel tone measures only 4.44:1
(fails 4.5), while zinc-600 clears both surfaces with margin.

## Font / weight audit

Exactly 3 rendered weights: **400** (default Pretendard body, and `<th scope="row">`'s explicit
`font-normal` override), **600** (`font-semibold` — labels, nav, badges, buttons, sub-headings'
eyebrows), **800** (`font-extrabold` — h1/h2/h3 display type, big tabular-nums digits). Audited and
fixed two UA-default leaks that would have added hidden 4th/5th weights:
- `<strong>` has a browser UA rule `font-weight: bolder` in Tailwind's preflight, which resolves to
  700 against a 400 parent — the one `<strong>` on the page now carries an explicit `font-semibold`.
- `<th>` has no weight reset in Tailwind v4 preflight (unlike `<h1>`–`<h6>`, which reset to
  `inherit`), so a bare `<th>` renders UA-bold (700) — all 4 `<th>` elements in the gate-chain table
  carry an explicit `font-semibold` or `font-normal`.
- The toggle column's "ON"/"OFF" pill was originally `font-bold` (700); changed to `font-semibold`.

## Completeness vs. Linear/Stripe/Vercel-level landing pages

Present: persistent header with logo + nav + secondary CTA; hero with product proof inside the hero
component itself (two live-qualifying `ListingCard`s, not a separate section); rich preview cards
with always-visible match%/grade/verification/discount, never overlaid on the photo; a working,
accessible (`table-fixed` + `colgroup` %, `sr-only`-safe, scroll-contained on mobile) data table
driving the core mechanic; empty-state-safe copy (never renders "0 qualify" because the dataset
makes that unreachable, but the closing CTA still branches defensively on `best === null`); social
proof with both aggregate stats and attributed testimonials; a closing CTA that quotes the *live*
gate-chain state, not a cached number; full keyboard operability with visible focus rings on every
interactive element; `prefers-reduced-motion` respected via `motion-reduce:` and a reduced-motion
branch in `Reveal`. Short of a true production page: no real auth/checkout flow behind the CTAs (by
design — this is a landing-page candidate), no dark-mode variant (the round's assignment is
light-only), and the "why it was held back" disclosure only shows the first failing gate rather than
every gate a listing fails (a deliberate simplification — the pipeline literally stops evaluating
after the first failure, so there is no "every failing gate" to show without changing the mechanic).

## Brief gaps

Specifics the brief left to the candidate's judgment, made explicit here:

- **Toggle count and exact labels (5, fixed order):** 1. "Verified seller only" (`verifiedSeller`)
  2. "Original packaging included" (`originalPackaging`) 3. "No visible wear" (`noVisibleWear`)
  4. "Ships within 24 hours" (`shipsIn24h`) 5. "Price-matched guarantee" (`priceMatched`). Order is
  load-bearing: it is the pipeline sequence, not just a display order.
- **Exact default state:** gates 1 and 3 ON (`verifiedSeller`, `noVisibleWear`), gates 2/4/5 OFF.
  Verified against the full 10-listing dataset: default qualifying count = **5 of 10**
  (sony-a7iv, leica-m6, fuji-x100v, omega-speedmaster, peak-design-pack), top pick = Fujifilm X100V
  at 98% match. All-5-on collapses to exactly **1** (Fujifilm X100V again — it is the only listing
  with all five attributes true). All-5-off is the full **10**. Brute-forced all 32 toggle
  combinations in a scratch Node script before committing the dataset: the minimum qualifying count
  across every possible combination is 1, never 0 — so the "no requirements" or "every requirement"
  preset buttons can never land on a dead, empty-looking state.
- **Exact accent hex:** `#059669` (ACCENT, large/non-text) and `#047857` (ACCENT_DEEP, small text
  and white-text fills) — green/emerald family per the round's color assignment, distinct from the
  catalogue's violet/rose/teal defaults and from a prior round's dark-theme `#1E7A56`/`#7ED9AA`
  green pairing (this round is light-theme with different exact hexes).
- **Exact container width:** `max-w-[1200px]` page shell with `px-6` (24px) side gutters, matching
  this landing-evolve lineage's established container convention (clears the 16px minimum gutter
  rule with margin).
- **Listing pool size:** 10 listings (not the full 16 originally sketched) — trimmed to the set of
  photo ids independently confirmed already in use elsewhere in this repository (grepped first,
  never invented), spanning 5 categories (Camera ×4, Lens ×2, Watch ×1, Sneaker ×1, Bag ×2) for
  product-preview variety without guessing at unverified Unsplash ids.
- **Pipeline semantics for an inactive gate:** an OFF gate always renders "bypassed" for every
  listing (grey Minus icon + "Not required" text), regardless of that listing's underlying
  attribute — it is not silently passing because the attribute happens to be true, it is passing
  because the requirement is not currently being enforced. This distinction is only visible once a
  visitor compares the same listing's cell before and after flipping that gate.
- **Brand name:** "Gatelist" (invented for this candidate, not "repick") — chosen because the
  gate/pipeline metaphor is the entire mechanic, so the name and the mechanic reinforce each other
  rather than competing with a separately-invented identity.
