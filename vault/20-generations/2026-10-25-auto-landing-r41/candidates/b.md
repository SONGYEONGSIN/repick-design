# Candidate b — "Point by Point"

## Concept

A dark, near-monochrome violet landing page built around a new output device: an **AI defect
scan-line reveal**. The hero leads with a grotesk-display headline ("Watch the AI check every point
before you buy.") and a right-hand "AI match preview" panel holding two always-visible proof cards
(Chronograph, Mirrorless Body — match %, grade, verified, discount in a row below the photo). Section
2 is the assigned device: pick one of four listings (thumbnail picker, single-select), then drag — or
arrow-key — a vertical scan line across its photo. Each of the item's 5 fixed, weighted check-points
(`data.ts`'s `defects` array, weights summing to 100) "confirms" the instant the scan line crosses its
`xPct`, and a single `scanResult()` function derives three outputs from one input (`scanPct`): the
revealed/hidden point lists (rendered as two differently-styled tag groups, not just dots — so the
live state is legible even without the visual markers), a running `confidencePct` (the literal sum of
revealed weights), and the five on-image dot markers' colored/uncolored state. Nothing here is a
separate "fake" number — the confidence percentage IS the sum of the specific points the scan line has
actually crossed, and the value-prop section and closing CTA both restate it live ("Your current scan:
{pct}%" / "{item}: {n} of 5 points, {pct}% confidence"), so a visitor who drags partway and never
scrolls back up still sees their exact scan position reflected downstream.

## Files written

- `app/src/app/landing-evolve/r41/b/page.tsx` — page shell, lifts `{itemId, scanPct}` state
- `app/src/app/landing-evolve/r41/b/Hero.tsx` — hero (headline, subhead, CTA, always-visible AI match preview cards)
- `app/src/app/landing-evolve/r41/b/ScanReveal.tsx` — item picker + scan-line device + live stat/tag panel
- `app/src/app/landing-evolve/r41/b/ValueProp.tsx` — 3-column value prop, middle column ties to live confidence
- `app/src/app/landing-evolve/r41/b/SocialProof.tsx` — stats row + two testimonials
- `app/src/app/landing-evolve/r41/b/ClosingCTA.tsx` — closing section, restates live item/points/confidence
- `app/src/app/landing-evolve/r41/b/ProductCard.tsx` — shared hero proof card
- `app/src/app/landing-evolve/r41/b/data.ts` — deterministic 4-item pool, 5 weighted check-points each, `scanResult()`
- `app/src/app/landing-evolve/r41/b/Reveal.tsx`, `useMounted.ts` — repo-pattern SSR-safe reveal

## Brief gaps — what I had to decide that the brief didn't specify

1. **What determines it** — the device's default (no-interaction) `scanPct`. The brief doesn't name
   a default value for a continuous live-recompute input. Decided: **45**, not 0 — a literal 0 default
   produces an empty "0% confidence, 0 of 5" first paint, which the catalog's own
   `auto-landing-r38` L2 delta already establishes as a defect class (the default render, not just the
   formula, is what most judges/cold-visitors actually see). Verified 45 yields a non-trivial 2-of-5,
   52–60%-confidence state for every item in the pool, not just the one shown on first paint.
2. **What determines it** — what happens to `scanPct` when the active item is switched via the
   thumbnail picker. Found through interactive testing (not just reading the source) that resetting to
   literal `0` reintroduced the exact empty state item (1) had just fixed, on every switch. Decided:
   reset to `DEFAULT_SCAN_PCT` (45), not `0`, generalizing the r38 non-trivial-default doctrine from
   "first render" to "every reset of this control" — the existing delta text only says "default
   render," not "every reset," so this is a genuine extension, not just an application of an
   already-written rule. Recorded as this round's LEARN delta (see DECISION.md §5).
3. **What determines it** — accent contrast values, since violet is not the brief's default
   `#6E56CF`. Computed directly (relative-luminance formula, not estimated): `violet-600` (`#7c3aed`)
   on `#0B0B0F` = 3.45:1 (large-text/non-text fill use only) with white text on that fill = **5.70:1**
   (clears AA for all text sizes) — used for all button/badge fills. `violet-400` (`#a78bfa`) directly
   on `#0B0B0F` = **7.22:1** — used for small eyebrow text/icons on the bare background. (`violet-500`
   text directly on bg measured 4.64:1, technically AA-passing but with almost no margin — avoided in
   favor of the larger-margin 400/600 pairing above, in the same spirit as [[page-brief-core]] §4's
   "16px 미만의 딱 맞음은 실패로 간주" treatment of width margins.)

## Accent usage (violet)

- Fills: primary CTA buttons (`bg-violet-600`, white text, 5.70:1), discount badge, selected
  thumbnail background, scan-slider `accent-violet-500` (native range theming).
- Text/icons on dark bg: `text-violet-400` for eyebrow labels, revealed-point tag bullets/background
  tint, star ratings, section icons — 7.22:1.
- Non-text (no AA requirement): the scan-line itself and its glow (`shadow-[...rgba(167,139,250,.65)]`)
  — a functional indicator of the live boundary, not an ambient decoration; it marks the literal x
  position all five dot markers and the stat panel are keyed off of.
