# Candidate b — Demand Map

One line: repick's live demand-map treemap — a 6-category pool where any
freely-added/removed subset genuinely re-subdivides one rectangle's whole
area by active buyer-demand dollars, with the closing CTA quoting the same
live-computed selection total and leading category, not static copy.

Route: `app/src/app/landing-evolve/r27/b/` — `page.tsx`, `client.tsx`,
`demand-map.tsx`, `listing-card.tsx`, `treemap.ts`, `data.ts`.

## 브리프에 없던 것

1. **Accent hue + computed contrast numbers (required).** Assigned green.
   Used `#1E7A56` as the fill and `#7ED9AA` as the small-text/icon tint,
   computed for real with the WCAG relative-luminance formula (not
   eyeballed) against the page background `#0B0B0F`:
   - `#1E7A56` (fill) vs `#0B0B0F`: **3.72:1** — clears the ≥3:1 large-text/
     non-text floor only. Used for borders, chip/button fills, and the
     bright-green header dot — never for small body text at that ratio.
   - `#7ED9AA` (tint) vs `#0B0B0F`: **11.59:1** — used for every small
     accent text, icon and the `focus-visible` outline color.
   - White text **on** the `#1E7A56` fill (buttons, active chips, avatar
     initials): **5.29:1** — clears full small-text AA.
   - `#6B6B78` (folio numerals, aria-hidden section markers only, ≥2rem
     bold): **3.74:1** vs `#0B0B0F` — non-text-adjacent large decorative
     numerals only, never real content.
   - White vs `#0B0B0F` (headings, primary numerals): **19.64:1**.
   I also verified the treemap's own tile-fill ramp, since tile fills are
   the one place this candidate puts text directly on a variable-opacity
   colored surface rather than a fixed token. Tiles blend `#1E7A56` toward
   the page background at per-rank opacity `[1, .88, .76, .64, .52, .42]`;
   computing white-on-blended-fill contrast at each step gives
   **5.29 → 6.28 → 7.60 → 9.10 → 10.87 → 12.57 : 1** — strictly increasing
   as opacity drops, because the page background is *darker* than the fill,
   so lower opacity can only pull the blend toward black, never toward a
   lighter, lower-contrast color. That's a real, checked invariant (I
   recomputed it, didn't just trust the code comment's claim), not an
   assumption — it's why the tiles get no per-tile scrim and instead rely
   on this ramp plus the `LABEL_MIN_SHARE` (8%) threshold that drops the
   inline label to the always-visible legend below once a tile gets too
   thin to hold a legible chip regardless of contrast.

2. **What the treemap's tile *value* actually represents (required
   mechanic, underspecified).** The brief says "quantity such as active
   buyer demand or matching-budget allocation" — I picked active weekly
   buyer-demand dollars ($K) per category, fixed literals in `data.ts`
   (`CATEGORY_POOL`), framed as "what repick's matching engine currently has
   allocated here" so it reads as a live operational signal rather than an
   arbitrary popularity score, and ties naturally into the hero's "before
   you decide what to list next" seller framing.

3. **Recursive-binary-slice treemap instead of full squarify (decided,
   documented as a deliberate simplification in `treemap.ts`).** A true
   squarified treemap continuously re-optimizes aspect ratios across the
   whole row; I implemented the simpler "always split along the current
   rectangle's longer side, at the contiguous index whose running sum is
   closest to half the total" recursive slice instead. It still satisfies
   the hard requirement — every leaf's area is exactly proportional to its
   value and the leaves exactly tile the parent with no gaps/overlaps — and
   it's a pure function of `(items, width, height)`, so React can call it
   fresh on every selection change with zero extra layout state. Keeping
   `CATEGORY_POOL`'s fixed descending-value order as the input order (never
   re-sorting by the live subset) was also deliberate: it anchors the
   largest allocation in the same corner across selections instead of
   having tiles jump position, which reads as more stable as categories are
   toggled — a genuine re-subdivision of area, not a re-shuffle of layout.

4. **Mobile fallback: stacked rows sized by `flex-grow`, not a shrunk
   version of the same 2D grid (required trouble spot, no method
   specified).** At ≤639px the 2D absolute-positioned tile grid is replaced
   entirely (`sm:hidden` / `hidden sm:block`) by a vertical list where each
   row's `flex-grow` equals its category's raw value — same proportional
   area encoding, just carried by height in one dimension instead of a 2D
   rectangle, which avoids the illegible-sliver problem a narrow multi-
   column treemap would hit with 5-6 categories selected on a 390px
   viewport, while still visually reading as "this row's the biggest slice
   of the whole."

5. **Where the CTA's live number actually comes from (required: must not be
   static).** Both the demand-map section and the closing CTA call the same
   `summarizeSelection(selected)` in `data.ts` off the same `selected`
   state — never two independently-maintained copies of "what's currently
   selected." The CTA sentence interpolates `summary.items.length`,
   `summary.total` (formatted via `formatDemand`), and, when there's a
   leading category, `summary.top.label` + `pct(summary.topShare)` — all
   recomputed on every toggle, with `aria-live="polite"` on the paragraph so
   the change is announced, not just visually redrawn.

6. **Self-review pass found the files already essentially complete.** On
   pickup I read all six files in full: braces/parens/brackets balance
   cleanly in every file, no truncated JSX, no `TODO`/`FIXME`, no
   `Math.random`/`Date.now`/`new Date` anywhere, no bare `ring-*` utility or
   `outline-none` self-cancelling a later `focus-visible:outline-*` (the
   shared `FOCUS` constant is a real `outline` + `outline-2` +
   `outline-offset-2` + `outline-[#7ED9AA]` used consistently across every
   interactive element: header nav links, category-toggle chips, both tile
   variants, the skip link, and both CTA buttons). Every tile in both the
   desktop grid and the mobile list is a real `<motion.button
   type="button">` with a computed `aria-label`, not a bare `div` with
   `onClick`. `next/image` is used for every photo, each with `alt`, `fill`,
   a fixed `aspect-[4/3]` container, and a reserved `bg-zinc-900` behind it
   so a 403'd Unsplash fetch in this sandbox doesn't collapse the layout;
   badges sit in a row below the photo rather than overlaid on it, so
   fallback alt text has room. Exactly three font-weight classes render
   across the whole candidate — `font-normal`, `font-semibold`,
   `font-extrabold` — and `var(--font-display-wide)` (the `DISPLAY`
   constant) is applied only to the `h1`, the three `h2`s, and the
   `aria-hidden` section-folio numerals; body copy, nav, chips, testimonial
   quotes and every other string stay on the default `--font-sans`
   (Pretendard) stack, and there is no Korean text on this candidate to
   accidentally set in the display face. I found nothing that needed
   fixing — no edits were made to any of the six files.
