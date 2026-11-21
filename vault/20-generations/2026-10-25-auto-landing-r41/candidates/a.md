# Candidate a — "Twelve Cells" (reassigned)

## Concept

Reassignment of `auto-landing-r40/c` from [[reassign-queue]] #16. A light, near-monochrome sky-blue
landing page built around a 3×4 grade matrix: three condition tiers (Like New / Good / Fair) across
four categories (Bags / Watches / Sneakers / Electronics), twelve cells, each pre-populated with a
real best-match item plus two close alternates. The hero leads with the matrix's headline promise
("Twelve cells. One exact match.") and two always-visible proof cards (Like New Sneakers, Good Bags)
in the hero itself — not a separate section — each with match %, grade, verified badge and discount
in a row below the photo. Section 2 is the matrix device: clicking any cell (or arrow-keying between
them, `aria-pressed` + roving focus) instantly swaps a synced results panel — a full product card for
the cell's best match, plus a 2-item "also close" list — all derived from one shared `MATRIX` lookup
table in `data.ts`, so the panel and the twelve summary counts can never disagree. The value-prop
section's middle column and the closing CTA both restate the live selection ("Behind your {tier}
{category} match" / "{tier} {category} match: {name} at {match}%"), so a visitor who picks a cell and
never scrolls back up still sees their pick reflected everywhere downstream.

## The one fix

The only change from `r40/c`'s already-fixed-once source: `relative` added to the grid-cell
`<button>` className (`GradeMatrix.tsx`). This is the reassignment's named defect, per
[[reassign-queue]] #16 — the trailing `sr-only` span inside each button, with no `position:relative`
ancestor between it and the `overflow-x-auto` table wrapper, was painting at unscrolled coordinates
and inflating `document.scrollWidth` by 79px at 390px. The button is the sr-only span's direct
parent, so anchoring there (rather than, say, the `<td>`) is the narrowest fix that satisfies
[[page-brief-core]] §2's "자기 자신이나 가장 가까운 감싸는 요소" requirement. No other line changed.
Re-gate: 10/10 clean, no 1-fix needed — sweep's 390px overflow is confirmed 0, a11y is confirmed 100
(both the `color-contrast` and `label-content-name-mismatch` fixes from r40/c's own 1-fix carried
over untouched and still hold).

## Files written

- `app/src/app/landing-evolve/r41/a/page.tsx` — page shell, lifts `{tier, category}` selection state
- `app/src/app/landing-evolve/r41/a/GradeMatrix.tsx` — the 3×4 matrix + synced results panel (contains the one fix)
- `app/src/app/landing-evolve/r41/a/data.ts` — deterministic 12-cell matrix, hero showcase lookup
- `app/src/app/landing-evolve/r41/a/Reveal.tsx`, `useMounted.ts` — repo-pattern SSR-safe reveal

## Brief gaps — what I had to decide that the brief didn't specify

1. **What determines it** — whether to keep the reassignment's design 1:1 or redesign it. Decided:
   **keep 1:1** (same matrix data, same copy, same layout), changing only the named defect. The
   reassignment's entire purpose, per [[reassign-queue]]'s own stated regulation ("배정문에 탈락 사유를 그대로
   넣는다"), is to isolate whether the *form* survives judgment once the *defect* is gone — redesigning
   anything else would confound that test, same as the `r23/a` "Fathom" precedent kept its name and
   design through its own reassignment.
2. **What determines it** — face/theme/accent for a reassigned candidate. Decided: **unchanged**
   (sky accent, light theme, no display face). The reassignment instructions name only the sr-only
   fix as required; this round's variety-axis diversification (grotesk/none faces, violet/orange
   accents) was applied to the two *free* candidates (b, c) instead, so the round still gets 3
   distinct accents and the reassigned form isn't penalized for an axis nobody asked it to change.

## Accent usage (sky)

- Fills: primary CTA (`bg-sky-700`, white text), "Top pick" badge on unselected cells (`bg-sky-700`),
  selected-cell background (`bg-sky-700`).
- Small text/accents directly on white: `text-sky-700` eyebrow labels (verified ≥ AA for small text
  on white — this is the design-principles default accent family already validated in the original
  `r40/c` SCORES/DECISION, carried over unchanged).
- Darker fill for the selected-state badge specifically: `bg-sky-900` (the original r40/c 1-fix,
  9.46:1 white-on-fill, kept as-is).
