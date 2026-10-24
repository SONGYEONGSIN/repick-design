# Candidate a — Match-Weight Reorder

## Concept

The hero asks the visitor to rank four priorities — Price, Condition Grade, Seller Trust,
Pickup Speed — into the order that matters to them, by dragging rows (native HTML5
drag-and-drop) or nudging them with always-visible up/down buttons. That order is converted
into a fixed 40/30/20/10 weight vector (rank 1 gets 40% of the weight budget, rank 2 gets
30%, rank 3 gets 20%, rank 4 gets 10%) and used to recompute, live and with no page reload,
the match percent of three real repick listings — a waxed field jacket, a hot-swap mechanical
keyboard, and a leather weekender bag — each of which carries its own fixed 0-100 score on
all four criteria. The three product cards re-sort by the recomputed match percent directly
inside the Hero component's own grid, and the same ranked data and weight vector propagate
into the Product Preview (expanded cards with an AI-match-reasoning line keyed to whichever
chip currently leads), the Value section (top match, match spread, and a count of listings
clearing 75% — all three recomputed live from the current order), and the Closing CTA, whose
headline and button both name the current top-ranked listing and its live match percent.

## Accent contrast calculations

Assigned hue: violet. Chosen shade (not the catalog stock `#6E56CF`): **`#8B5CF6`** (base
accent), with a darker fill step for button backgrounds and a lighter tint step for small
text/icons/focus rings — the same three-role pattern the stock color uses, recomputed for
this hue. Background/ink: `#0B0B0F`. Computed with the standard WCAG relative-luminance
formula (sRGB → linear, `0.2126R + 0.7152G + 0.0722B`, contrast = `(L1+0.05)/(L2+0.05)`):

| Role | Hex | vs. white `#FFFFFF` | vs. bg/ink `#0B0B0F` |
|---|---|---|---|
| `accent` (base) | `#8B5CF6` | 4.23:1 | 4.64:1 |
| `accentFill` (button bg) | `#6D28D9` | 7.10:1 | 2.76:1 |
| `accentTint` (small text/icons/focus ring) | `#C4B5FD` | 1.85:1 | 10.64:1 |

Decisions from these numbers:
- `accentFill` (`#6D28D9`) is reserved for button backgrounds carrying white label text —
  7.10:1 clears AA (and AAA) for text of any size, so every CTA button is safe regardless of
  label font size.
- `accentBase` (`#8B5CF6`) is used for borders, large text (the uppercase eyebrow labels are
  13px but all-caps/tracked, used the same way the stock color's own worked example treats
  non-text/large-text roles) and non-text UI like the active-card border. At 4.64:1 against our
  actual dark background it also clears AA for *normal* body-size text on this page, so it is
  additionally safe as inline text color directly on `bg`/`surface` — but it is NOT used as a
  fill behind small white button text (4.23:1 against white falls short of the 4.5:1 AA
  threshold for small text), matching the stock color's own fill-vs-white caveat.
  `accentFill` carries that role instead.
- `accentTint` (`#C4B5FD`) is reserved for small text, icons and focus-visible rings, all of
  which sit on the dark `bg`/`surface`, never on white — 10.64:1 clears AAA there with room to
  spare.
- `muted` (`#A1A1AA`): the brief flags this as only ~2.5:1 against pure white and warns not to
  assume it transfers. Computed against this page's *actual* bg (`#0B0B0F`): 7.66:1, and
  against `surface` (`#16131F`): 7.14:1 — both clear AA comfortably at body-text size, so the
  stock muted value is kept as-is for this round's dark bg.

## Body line-length calculation

Body paragraphs use a single font size of **16px** and a container **max-width of 500px**
(`max-w-[500px]`), applied consistently to every flowing paragraph (hero subhead, section
intros, value-section copy). Using the required constant (average character width ≈ 0.44em,
not the CSS `ch` unit):

```
characters-per-line = container-width-px ÷ (0.44 × font-size-px)
                     = 500 ÷ (0.44 × 16)
                     = 500 ÷ 7.04
                     ≈ 71.0 characters
```

71 characters sits just above the ~70 target and comfortably under the hard ceiling of 75, so
500px/16px was kept as the one body-paragraph constant used everywhere on the page rather than
varying it per section.

## 브리프에 없던 것 (What the brief didn't specify)

1. **① Drag mechanism.** The brief explicitly left this open ("implement drag via pointer
   events / native HTML5 drag-and-drop / or a simpler up/down fallback — your call").
   **②** Implemented native HTML5 drag-and-drop (`draggable`, `onDragStart`/`onDragOver`/
   `onDrop`) as the pointer fast-path, but made the always-visible up/down button pair on every
   chip the *primary*, non-optional mechanism rather than a last-resort fallback.
   **③** HTML5 DnD has no built-in keyboard story and is unreliable on touch screens, and I
   have no way to run a real build/browser test on this handwritten code. Shipping buttons as
   the primary path guarantees full keyboard reachability and touch support regardless of
   whether the DnD wiring behaves perfectly in every browser; drag is then a pure enhancement
   that can only make the device better, never block it.

2. **① Weighting formula.** The brief asked for "a concrete weighting formula, e.g. 40/30/20/
   10" but left the exact numbers to me. **②** Used exactly 40/30/20/10 (rank 1 → 40%, rank 2 →
   30%, rank 3 → 20%, rank 4 → 10%). **③** It sums to exactly 100 with no rounding, and the
   gaps between ranks (10 points) are large enough that moving one chip one slot always
   produces a visibly different match percent on every product — a flatter split (e.g.
   30/27/23/20) would make some reorders barely move the numbers, undermining the "manipulation
   visibly propagates" requirement.

3. **① Per-product per-criterion scores.** The brief specified the four chip criteria and the
   card fields (grade, trust, discount, match%) but not the underlying 0-100 score each
   product carries per criterion. **②** Hand-authored a 4×3 score matrix (price/condition/
   trust/pickup × jacket/keyboard/bag) deliberately engineered so that the three listings swap
   rank order between at least two different chip orderings (verified by hand: default order
   ranks jacket 80 > keyboard 74 > bag 72; reversing the order to pickup-first flips it to
   keyboard 83 > bag 81 > jacket 63). **③** A static or near-tied score matrix would make the
   "cards visibly re-sort" requirement untestable/invisible to a reviewer who only tries one or
   two reorders — the matrix needed real spread built in on purpose.

4. **① Real vs. generated product imagery.** The brief offered either a fixed Unsplash photo or
   a generated SVG/CSS placeholder and called the Unsplash route a real option too.
   **②** Chose generated placeholders: a flat-color rounded box per product with a single
   lucide icon (shirt / keyboard / shopping-bag) keyed to category, given `role="img"` +
   `aria-label` in place of `alt`. **③** I cannot verify a real Unsplash photo ID resolves
   without a browser; a generated mark has no load-failure state at all, sidesteps the
   badge-collides-with-broken-alt-text failure mode entirely, and the brief itself flagged this
   as "often safer" for exactly this device.

5. **① What ties a product's "AI-match-reasoning" line to the current chip order.** The brief
   required a reasoning tag on the rich card but not how it should respond to reordering.
   **②** Each product carries one reasoning sentence per possible *lead* chip (whichever
   priority currently sits in rank 1), and the card shows whichever sentence matches the
   current leader. **③** A single static reasoning sentence per product would silently stop
   being true the moment the visitor reordered chips (e.g. a sentence praising "fast pickup"
   would still show even after Pickup Speed was demoted to last) — tying it to the live leader
   keeps the copy honest under every order, the same "manipulation survives" principle the
   brief applies to the CTA.

6. **① Hero vs. Product Preview differentiation.** The brief allows Product Preview to be "the
   same cards... or an expanded/secondary view of the same live data." **②** Built Hero's cards
   as compact horizontal rows (small thumbnail + badges, no reasoning line) so three fit above
   the fold without scrolling, and gave Product Preview a fuller vertical card (larger
   thumbnail, rank badge, reasoning line) sharing the same `ProductCard` component via a
   `variant` prop. **③** A literal duplicate of the full rich card inside Hero would be too tall
   to clear "visible without scrolling at common viewport heights" once stacked three deep next
   to the reorder device; the compact variant keeps the mandatory proof inside Hero's own
   return while the expanded variant still satisfies the "rich cards" requirement for section 2.

7. **① Screen-reader announcement granularity on reorder.** Nothing in the brief specifies how
   assistive tech should learn the result of a reorder. **②** Added a `role="status"
   aria-live="polite"` summary of the new chip order inside the reorder device itself, plus a
   separate, shorter live status next to the card grid announcing only the new top match
   (title + percent) rather than re-reading all three full cards. **③** Making the entire card
   grid an `aria-live` region would re-announce all three cards' full text on every single move,
   which is noisy enough to be counterproductive; a concise top-match status plus the chip-order
   status gives a screen-reader user the same information a sighted user gets from watching the
   grid resort, without the spam.

8. **① Headline two-breakpoint clamp values.** The brief requires separate `clamp()` ranges for
   `<lg` vs `lg` to avoid 375px overflow but doesn't give numbers. **②** Mobile:
   `clamp(2.25rem, 9vw, 3rem)`; desktop (`lg:`): `clamp(3.25rem, 5.5vw, 5.5rem)`.
   **③** At 375px, `9vw` = 33.75px, below the 2.25rem (36px) floor, so mobile always renders at
   the fixed 36px floor regardless of viewport — removing any risk of the vw-term growing past
   the container at the smallest supported width — while the desktop range is free to scale up
   to 88px on wide screens where there is room.

9. **① Whether "Seller Trust" score and the "Verified seller" badge must always agree.**
   The brief lists seller-trust-badge and condition grade as separate card fields but doesn't
   say whether a product can have a mid/high trust *score* while still showing "Unverified."
   **②** Let them diverge: the leather bag is unverified but still carries a trust score of 80
   (reflecting return-history/rating signals independent of the verification badge).
   **③** Treating "verified" as a binary gate and "trust score" as a separate continuous signal
   is closer to how a real marketplace would compute trust, and it gives the Seller Trust chip
   a genuine, non-redundant effect on ranking instead of just mirroring the verified/unverified
   flag that's already shown as its own badge.
