# Candidate c — "Build Your Match"

## Concept

A light, near-monochrome orange landing page built around a 3-facet live quiz. The hero leads with
the quiz's headline promise ("Answer three questions. Get one exact match.") and two always-visible
proof cards (Trail Runner, Down Parka) in the hero itself. Section 2 is the assigned device: three
independent pill-button groups — Category (4 options), Budget (3 tiers), Minimum condition (3 floors)
— each a `<fieldset>`/`<legend>` group with `aria-pressed` single-select buttons, no two groups
dependent on each other's options. Changing any one of the three re-runs a single `findMatch()`
function against a fixed 10-item pool (filter by category, filter by budget range, filter by
condition-grade floor, sort by match score then price), and the results panel beside the quiz swaps to
show the new best match (photo, grade, verified, discount, price) plus up to two alternates — or, if
the combination has zero real listings, an explicit "no match" state (icon + explanation + suggestion
to widen a filter) rather than a broken or stale panel. The value-prop section and closing CTA both
restate the live pick, so a visitor who answers the three questions and never scrolls back up still
sees their exact match reflected downstream — and the closing CTA has its own honest empty-state
copy for the (rarer) no-match case, so it's never caught stating a null answer as if it were real.

## Files written

- `app/src/app/landing-evolve/r41/c/page.tsx` — page shell, lifts `{category, budget, tolerance}` state
- `app/src/app/landing-evolve/r41/c/Hero.tsx` — hero (headline, subhead, CTA, always-visible AI match preview cards)
- `app/src/app/landing-evolve/r41/c/MatchQuiz.tsx` — the 3 pill-group facets + live results/empty-state panel
- `app/src/app/landing-evolve/r41/c/ValueProp.tsx` — 3-column value prop, middle column ties to live pick
- `app/src/app/landing-evolve/r41/c/SocialProof.tsx` — stats row + two testimonials
- `app/src/app/landing-evolve/r41/c/ClosingCTA.tsx` — closing section, restates live pick or honest empty state
- `app/src/app/landing-evolve/r41/c/ProductCard.tsx` — shared hero proof card
- `app/src/app/landing-evolve/r41/c/data.ts` — deterministic 10-item pool, `findMatch()`
- `app/src/app/landing-evolve/r41/c/Reveal.tsx`, `useMounted.ts` — repo-pattern SSR-safe reveal

## Brief gaps — what I had to decide that the brief didn't specify

1. **What determines it** — default facet values, since three independent categorical inputs have
   no brief-specified starting combination. Decided: Footwear / $100–$300 / Good or better — checked
   by hand that this combination resolves to exactly one real match (Trail Runner, 95%) before fixing
   it as the default, so first paint is never the empty/no-match state (same non-trivial-default
   concern as candidate b, satisfied by construction here since this combination was deliberately
   chosen rather than defaulted to index 0 of each list).
2. **What determines it** — behavior when a combination has zero matches. The brief's "조작=가치체감"
   language assumes a value to show; it doesn't say what to render when the live computation
   legitimately has no answer. Decided: a dedicated, honestly-worded empty state (not a fallback
   fake item, not a frozen stale panel) in both the quiz result panel and the closing CTA — picked
   over silently keeping the last valid match on screen, which would make the "live" claim false
   (the panel would stop reflecting the actual current selection).
3. **What determines it** — accent contrast values, since orange is not the brief's default
   `#6E56CF`. Computed directly: `orange-700` (`#c2410c`) on white = **5.18:1** (small-text safe) —
   used for all text-on-white accent use (eyebrows, match-% badge text on tint). White text on
   `bg-orange-700` fill = **5.18:1** as well (same pair, reversed) — used for CTA/discount-badge
   fills. (`orange-600` was checked and rejected for small text/fills: only 3.56:1 either direction,
   large-text-only.)

## Accent usage (orange)

- Fills: primary CTA buttons (`bg-orange-700`, white text, 5.18:1), discount badge, active pill
  background, "match %" badge in the results panel.
- Text/icons on white: `text-orange-700` for eyebrow labels, icons, tinted-badge match-% text (on
  `bg-orange-50`) — 5.18:1, verified directly rather than assumed from the default token's own
  published value.
