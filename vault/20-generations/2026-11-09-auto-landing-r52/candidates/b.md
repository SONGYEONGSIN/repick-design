# Candidate b — self-report

## 1. One-line concept

A "build-your-must-haves" signal checklist (discrete multi-select, 6 fixed trust/quality
signals) that simultaneously re-filters the live product-card grid (which listings show,
and which of their "matches" reasoning tags light up) **and** recomputes a three-tile
aggregate stat band (count / avg match% / avg discount%) from the exact same filtered set
— two differently-shaped outputs (a card grid vs. a numeric stat band) driven by one
selection, not a re-skin of the catalogue's plain "multi-select feeds one number" pattern.

## 2. Accent hue + contrast math

Used the default brief hue **`#6E56CF`** as-is (no hue change), but the page is a **light**
surface (bg `#FAF9F7`), not the dark default, so I recomputed the hue-independent and
surface-dependent figures myself rather than assuming the brief's dark-bg numbers applied:

- White-on-accent (`#FFFFFF` text on `#6E56CF` fill): **5.39:1** (recomputed via relative
  luminance; matches the brief's reference value — used as a sanity check). Legal for any
  text size on an accent fill (CTA buttons, "match%" pill).
- Dark-ink-on-accent (`#15141A` text on `#6E56CF` fill): **3.64:1** (brief's reference
  value, not relied on anywhere — all text on an accent fill in this build is white).
- **Accent text directly on this page's light backgrounds** (not in the brief, since the
  brief's calc is for accent-on-`#0B0B0F` dark bg = 3.73:1, which is the opposite surface):
  - `#6E56CF` on `#FAF9F7` (page bg, L≈0.948) → **≈5.12:1** — passes AA body/small text.
  - `#6E56CF` on `#FFFFFF` (card bg) → **5.39:1** — passes.
  - `#6E56CF` on `#F1EEEA` (tinted card art block, L≈0.858) → **≈4.66:1** — passes, but
    tight, so I kept this tone reserved for icon art, never for small running text.
  - `#6E56CF` on `#15141A` (dark closing-CTA section bg, L≈0.0073) → **≈3.40:1** — **fails**
    AA for small text. Caught this during review: the `Eyebrow` label in the dark CTA
    section was using the base accent color at 11px. Fixed by adding a `tone="dark"` path
    that swaps to a lighter tint of the same hue, `#B6A6F0` (brief's own reference tint,
    ≈9.1:1 on a near-black bg) — used only in that one dark-surface instance, base accent
    used everywhere else since the light surface already clears 4.5:1 without tinting.

## 3. Body container width arithmetic

Body/intro paragraphs set at **17px**, target **~70 characters/line** (per brief: aim
closer to 70 than the 75 ceiling, 0.44em average advance, not `ch`):

`width = 70 × 0.44 × 17 = 524.6px` → rounded to **525px**, applied as `maxWidth: "525px"`
(inline style, not Tailwind `ch`) on every intro/body paragraph (hero sub, section 2/3
intros, closing CTA paragraph). Card copy (titles, badge/caption text, testimonial quotes)
sits inside grid columns already narrower than that at every breakpoint, so no separate
width was computed for those — they're inherently short lines.

## 브리프에 없던 것

1. **Domain for the multi-select pool** — ① what: which concrete thing the user checks/
   unchecks ② chose: six trust/quality **signals** a resale buyer cares about
   (Authentication Verified, Top-Rated Seller, Ships This Week, Recent Price Drop,
   Limited/Rare Drop, Full Condition Report) ③ why: arbitrary within the brief's "pick your
   own domain" instruction, but deliberately chosen because it maps 1:1 onto real C2C
   resale trust concerns and gives each listing a believable boolean fingerprint; checked
   against the catalogued-vocabulary list and judged distinct from the existing
   "variable-cardinality multi-select set-builder" entry because the selection here drives
   two differently-shaped live outputs (card grid + stat band) rather than one number.

2. **AND vs. OR semantics for the filter** — ① what: how multiple selected signals combine
   ② chose: strict AND (a listing must clear *every* selected signal) with a ranked
   closest-match fallback when AND yields zero results ③ why: arbitrary but product-sound —
   "must-haves" read naturally as AND in a filter UI; the fallback (rank by count of
   signals met, tie-broken by original array index, not a plain reduce) exists specifically
   to satisfy the open-delta rule that a control's output must never go empty, including
   under a strict-AND combination that has no real match (e.g. all 6 signals selected).

3. **Empty-selection behavior** — ① what: what happens at 0 signals selected ② chose: show
   all 9 listings (not a blank state) with a status line saying so ③ why: convention/logic —
   an empty "must-haves" set should mean "no constraint," not "no results," and this also
   satisfies the default/reset-must-be-useful rule for every reset, not just first paint.

4. **Theme + accent departure from the most recent round** — ① what: light vs. dark,
   display face ② chose: light theme (bg `#FAF9F7`/ink `#15141A`), default accent hue
   (`#6E56CF`, unchanged), `var(--font-display-wide)` ③ why: r51 (most recent) used dark +
   cyan + mono; this round deliberately diverges on theme and display face while keeping
   the default accent hue (since the light surface passes contrast on the base hue without
   needing a hue change — recomputed rather than assumed, see §2).

5. **Nine-listing fixed dataset + three curated "top matches" subset** — ① what: how many
   dummy listings, and why 3 of them get a second, static editorial appearance in section 2
   ② chose: 9 total, with `supreme-boxlogo` / `seiko-5` / `canon-ae1` re-shown as curated
   picks ③ why: arbitrary but deliberate — large enough pool for the live filter to produce
   varied subsets across signal combinations, and the editorial section reads the same
   listing objects (not hand-copied numbers) so its grade/discount figures can never drift
   from the live dataset.

6. **Heading-skip fix** — ① what: listing-card titles ② chose: rendered as a styled `<p>`,
   not an `<h3>` ③ why: correctness fix — the Hero's only heading is the page `h1`, and the
   hero's own proof cards sit inside the Hero with no intervening `h2`; an `h3` there would
   have skipped a level in document order, so card titles use bold body text instead and
   headings stay strictly `h1` → `h2` throughout the page.

7. **Mobile document-order fix** — ① what: order of the toggle control vs. its own cited
   numbers inside the Hero's single left column ② chose: control block renders before the
   CTA/aggregate-line block in source order (control → CTA+stat line → cards, where cards
   are a separate grid column that still follows the control in the underlying DOM) ③ why:
   correctness fix — the open delta flags a citation rendering above its antecedent control
   in a single-column mobile stack as a fold-rule violation even if desktop looks fine
   side-by-side; reordered so every citation of `stats`/`selected` physically follows the
   control that produces it in document order.
