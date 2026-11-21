# Candidate c — Category Demand Ribbon

A hand-rolled streamgraph landing page: four gear categories (lenses, camera bodies, accessories,
vintage film gear) stack as a wiggle-baseline ribbon across a trailing 12-month timeline, four
weight sliders ("how much of your kit falls in each category") live-reflow both band thickness and
stacking order, and a marker pins exactly where a real saved listing (a Sony FE 24-70mm F2.8 GM II)
sits inside its band — the same live weighting, share % and index number then carry through to the
closing CTA line instead of resetting to a static string.

## 브리프에 없던 것

1. **Accent hue + computed contrast (required by the brief).** Picked orange over the suggested
   hue list (not violet/amber/teal, and distinct from r24/c's cyan already in this catalog).
   Light theme, ground `#FAFAFA`. Ran the WCAG relative-luminance formula through Node rather than
   eyeballing — full pairing table:

   | Pairing | Ratio | Verdict |
   |---|---|---|
   | `#C2410C` (orange-700, FILL) vs `#FAFAFA` (bg) | 4.96:1 | clears AA text at every size, used for fills/borders/large text/buttons |
   | `#C2410C` vs `#F4F4F5` (panel) | 4.71:1 | still clears normal-text AA on tinted panels |
   | `#9A3412` (orange-800, small-text/icon/focus tint) vs `#FAFAFA` | 7.00:1 | margin for small text, icons, the focus-visible ring |
   | `#FFFFFF` as text on `#C2410C` fill | 5.18:1 | the only text color used on an accent-filled surface |
   | `#111114` (ink) as text on `#C2410C` fill | 3.64:1 | large-text/non-text floor only — not used for body text on fill anywhere |
   | `#52525B` (muted) vs `#FAFAFA` | 7.41:1 | safe on page ground |
   | `#52525B` vs `#F4F4F5` (panel) | 7.03:1 | safe on panel surfaces |

   Chart-band (non-text, WCAG 1.4.11 ≥3:1) categorical palette, near-monochrome except the one band
   that's also the tracked item's category: Lenses `#C2410C` (4.96:1), Camera Bodies `#3F3F46`
   (10.01:1), Accessories `#71717A` (4.63:1), Vintage Film Gear `#18181B` (16.97:1) — all vs
   `#FAFAFA`. Worth flagging: the brief's literal muted token `#A1A1AA` only measures **2.46:1**
   against this light ground (it's written as the dark-theme default), so it was NOT used as a
   chart fill here — `#71717A` stands in for the Accessories band instead, and `#52525B` is used
   wherever the brief's muted token would normally go on text. Full derivation is repeated as a
   comment block in `tokens.ts`.

2. **Character-width arithmetic (required by the brief).** Used `container_px / (0.44 × font_px)`,
   no `ch` units anywhere. Section-intro paragraphs: `480 / (0.44 × 16) = 480 / 7.04 ≈ 68.2` chars.
   Hero subhead: `500 / (0.44 × 17) = 500 / 7.48 ≈ 66.8` chars. Closing-CTA paragraph: same 16px/480px
   → ≈68.2. FAQ answers: `460 / (0.44 × 15) = 460 / 6.6 ≈ 69.7` chars. All land under the ~70-72
   target with margin toward the 75-char hard ceiling.

3. **The streamgraph math itself — nothing in the brief specifies an algorithm.** Built a "wiggle"
   baseline (`-totals[i]/2` per month, so the stack is centered and the outer silhouette itself
   breathes with the data, not just an internal partition of a fixed rectangle) plus a Catmull-Rom
   → cubic-Bezier smoothing pass (tension 6, the standard conversion) so 12 discrete monthly points
   read as an organic ribbon instead of a polygon. Stacking order uses an "inside-out" heuristic
   (largest-weighted category most central, sorted by total weighted volume, recomputed on every
   slider move) — a reasonable approximation of d3's `stackOrderInsideOut`, hand-written since no
   chart library is installed in this repo.

4. **Underlying dataset is hand-authored, not sourced.** All 48 base-trend numbers (4 categories ×
   12 months, 0–100 resale-demand index) are fixed literals I invented with plausible seasonal
   shapes (lenses: holiday + summer-travel bump; bodies: spring release-cycle dip; accessories:
   flat with a small December lift; vintage film: climbs through summer) — no real repick data
   exists for this preview. Same is true of the tracked item (Sony FE 24-70mm F2.8 GM II, $1,650
   of $2,300), the hero/product-preview listings, sellers, and testimonials.

5. **Added a semantic `<table>` fallback that the brief didn't ask for.** Since the chart is the
   entire value proposition and SVG has no inherent tabular semantics, added a collapsible "View
   exact numbers" disclosure under the ribbon with a real `<table>` (`caption`, `scope="col"`,
   `scope="row"`) showing the live weighted values per category per month, plus the static source
   index in parentheses — self-audited its focus and contrast since it's a post-interaction state
   the automated first-render scan won't reach.

6. **Photo IDs.** Reused fixed `images.unsplash.com/photo-<id>` values already present elsewhere in
   this repo's marketing routes (v6/v10/v13/v14/v15/v18) rather than sourcing new ones, since those
   are confirmed working camera-gear photography and the brief bans random-seed image services.

7. **Font-weight budget.** Exactly three rendered weights used throughout (verified by grep across
   every file, including inline SVG `fontWeight`): 400 (`font-normal` / unstyled body text), 600
   (`font-semibold`), 800 (`font-extrabold`) — no `font-bold`/`font-medium`/`font-black` anywhere.

8. **Interaction inventory (brief asks for ≥4, doesn't name them).** (1) hero: category tabs swap
   which real listing card + proof shows, zero scroll; (2) scroll trigger: `whileInView` entrance
   reveals per section, gated by `useReducedMotion`; (3) product-preview: category filter chips
   re-render the listing grid; (4) form/quiz-style: the four weight sliders, which are also the
   page's core manipulation — they reflow the ribbon's `d` paths, stack order and marker position
   live via Framer Motion's `animate` prop on the SVG path/circle/line elements (duration 0 when
   reduced motion is on, so state still updates, just without the tween).
