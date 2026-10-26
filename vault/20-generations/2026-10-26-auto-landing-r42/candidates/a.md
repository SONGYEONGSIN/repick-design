# r42 · candidate a — "Why This One"

## Concept summary

A light-theme, orange-accent hero built around three facet pickers — **Budget**
(`Under $50` / `$50–150` / `$150+`), **Condition tolerance** (`Like New only` /
`Good or better` / `Any condition`), and **Category** (`Electronics` /
`Clothing` / `Home`) — that drive a live, deterministically-templated
rationale paragraph instead of any chart/gauge/plot device. Each of the 27
facet combinations maps to one hand-authored product (`data.ts`, 27 literal
cells, no randomness) with its own name/price/listPrice/condition/match%/
seller-sales/discount. `buildRationale()` is pure string interpolation —
`"Because you {budgetPhrase} and {conditionPhrase} while looking at
{category}, ... Today's top match is the {name} at ${price} ({condition}
condition) — {discount}% under its original ${listPrice} — from a seller
with {sales} verified sales and a {matchPct}% fit..."` — so the sentence's
actual words change with every facet change, not just an animation layer.
`Rationale.tsx` crossfades the paragraph on a `key={signature}` change
(reduced-motion gets an instant, un-animated swap) so it visibly reassembles
without ever hiding content behind a stuck `opacity:0`. The same facet state
drives the matched product card (name/price/badges swap with it — this is
the "segmented stat needs matching card filter" requirement satisfied
directly, since the card *is* the segment), an expandable "how we scored
this match" breakdown, and the closing-CTA recap line + its button label
(`See more {category} matches`) — a causal chain from hero to footer.

**Accent + contrast (computed, WCAG relative-luminance formula):**
- `ACCENT` `#EA580C` (orange-600): contrast vs white = **3.56:1** — large
  text (≥24px/≥19px bold), filled backgrounds, borders, bars only.
- `ACCENT_TEXT` `#C2410C` (orange-700): contrast vs white = **5.18:1** —
  small accent text, icons, links, the focus-visible outline.
- Button-on-fill text: white-on-`ACCENT` only clears **3.56:1** (fails
  4.5:1 for small text), while ink `#111111`-on-`ACCENT` clears **5.31:1**
  — so every filled-accent button/pill uses ink-colored labels, not white.
- `MUTED` text-zinc-600 (`#52525B`): **7.74:1** on white and still clears
  4.5:1 (~computed against the `orange-50`-family tint used for cards), so
  it's used uniformly rather than mixing in zinc-500 (which is a known
  razor-thin case on tinted surfaces per the brief's own warning).

**Line-length check:** the rationale paragraph sits at 17px inside a card
whose raw content width can reach ~592px at desktop (640px hero column minus
card padding) — that's ~79 chars, over the 75-char ceiling — so `Rationale.tsx`
caps the paragraph itself at `max-w-[520px]` (520 ÷ (0.44 × 17) ≈ 69.5 chars),
independent of the card's own width, rather than narrowing the whole hero
column.

## Brief gaps

- **① Deciding what the item's *actual* condition should be when the
  tolerance facet is "Any condition" or "Good or better."** ② I set it so
  "Like New only" → actual condition Like New, "Good or better" → actual
  Good, "Any condition" → actual Fair. ③ The brief requires the matched card
  to literally filter with the facet, and showing a worse-condition item at
  looser tolerance is the only way to make the condition facet visibly
  change the card (not just the copy) while also demonstrating the
  flex-for-savings trade the rationale text claims.
- **① Whether 27 hand-authored products or a formula-generated grid was
  expected.** ② I hand-authored all 27 (one name/price/stat set per
  category×budget×condition cell) rather than deriving price/name from the
  facet indices. ③ A formula would have produced suspiciously round or
  mechanical numbers and generic names; literal, slightly irregular retail
  numbers (e.g. $92 boots at 53% off $195) read as a real catalog rather than
  a visibly-generated one, while staying 100% deterministic (no
  `Math.random`/`Date.now`).
- **① How literally to take "typewriter-style reveal animation."** ② I used
  a `key`-based crossfade/slide (`AnimatePresence mode="wait"`) rather than
  animating individual characters. ③ True per-character typing would require
  either re-typing the DOM text node (risking a stale/incomplete string being
  the only thing screen readers see mid-animation) or an `aria-live` region
  that fights the visual animation; a whole-paragraph crossfade keeps the
  full, correct sentence in the DOM at all times while still visibly
  "reassembling" on every facet change, and respects
  `prefers-reduced-motion` by skipping straight to the plain-text swap.
