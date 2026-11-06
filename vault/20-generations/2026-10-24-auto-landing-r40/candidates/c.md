# Candidate c — "Twelve Cells"

A light, near-monochrome landing page built around a single idea: resale trust is a
function of two coordinates, condition tier and category, and Repick can show you
exactly which coordinate you're buying into before you click anything. The hero states
the thesis ("Twelve cells. One exact match.") and shows two already-graded proof cards
inline. The Grade Matrix below is a real 3×4 `<table>` of 12 button-cells — each cell
carries a fixed availability count and a 5-dot density read before any click — pre-set
to the most popular cell (Like New × Sneakers). Selecting any cell swaps a "best match"
hero-style card (image, name, match%, price, condition, seller-verification, discount)
and a 2-item comparison strip together, from a fully hardcoded 12-entry lookup table (36
items total counting alternates). The value-proposition section re-derives its three
columns' copy from whatever cell is currently selected, and the closing CTA restates the
live selection as a sentence + stat line, so the page never reads as decorative once a
visitor has touched the grid.

## Accent usage (sky)
- `sky-700` (#0369a1): all filled CTA buttons (white text, 5.93:1), the eyebrow labels on
  white/zinc-50 backgrounds, the selected matrix cell's fill (white text on top), the
  filled "match%" chip, and every `focus-visible` outline color. This is the only place
  accent carries small text directly on a light surface.
- `sky-600` (#0284c7): non-text only — the filled density dots inside each matrix cell,
  and the `hover:border-sky-600` micro-state on unselected cells. Never used for text.
- No `sky-500` anywhere (it fails even the large-text floor on white).
- Accent never becomes a background fill larger than a single button/chip/cell; all
  section backgrounds are white or `zinc-50`, and the matrix's 12 small cell buttons are
  the single largest concentration of accent on the page, by design.

## Body paragraph char-width math
Pretendard's real average glyph advance is used (0.44em), not `ch`.
- 16px (`text-base`) paragraphs (hero subhead, matrix intro): target width =
  68 chars × 0.44 × 16px = 478.7px → used `max-w-[480px]` → 480 / 7.04 = 68.18 chars.
  Comfortably under the 75-char hard ceiling.
- 14px (`text-sm`) value-prop column paragraphs: no explicit `max-w` needed — the
  3-column grid at the 1180px container width already constrains each column to
  ≈ 350px, which is 350 / (0.44×14) = 56.8 chars, well inside the 68–70 target band on
  its own; at mobile (single column, ≤358px available) it's ≈ 58 chars, still inside
  budget.

## Interactions (minimum 4, delivered 6)
1. Hero primary CTA (`#matrix` anchor) with visible `focus-visible` outline.
2. Scroll-triggered `Reveal` entrances (mount-gated, reduced-motion safe) on the matrix
   intro, the value-prop block (2 staggered reveals), social proof, and the closing CTA.
3. Grade Matrix cell click — single-selection across 12 real `<table>` button-cells,
   `aria-pressed` + descriptive `aria-label` per cell.
4. Live-synchronized response: clicking a cell swaps the best-match card (image, name,
   match%, price, condition, verified-seller, discount) and the 2-item comparison strip
   together, from the same lookup entry, inside an `aria-live="polite"` region.
5. Keyboard arrow-key navigation between matrix cells (Up/Down/Left/Right move focus
   between buttons; Tab also reaches every cell in document order; Enter/Space select).
6. Live-state propagation into copy: the value-prop section's three paragraphs and the
   closing CTA's headline/stat line are computed from `selected`, never hardcoded.

## 브리프에 없던 것 (Brief gaps)

1. ① What: whether the 12-cell images should be one fixed photo per (tier, category)
   cell or one fixed photo per category (reused across its 3 tiers).
   ② Decided: one fixed, confirmed-working Unsplash photo id per **category**, reused
   across all 3 tiers of that category.
   ③ Why: the brief only required the *best-match item data* (name/price/match/etc.) to
   be distinct per cell, not the photography; reusing a category-level photo across
   tiers also matches real resale catalogs (the same bag model listed in different
   condition tiers looks like the same bag), and it let me pick from photo ids already
   verified working elsewhere in this repo (`r30/b`, `v18`) rather than guessing new,
   unverified ids.

2. ① What: how to keep every `<th>` in the matrix table from silently inheriting the
   browser's default bold (700) font-weight, which isn't covered by this repo's
   Tailwind preflight reset and would have silently created a 4th rendered weight.
   ② Decided: explicitly set `font-semibold` (600) on every `<th>`, including the
   visually-empty corner header cell (whose text is `sr-only` but still computes a
   font-weight).
   ③ Why: checked `node_modules/tailwindcss/preflight.css` directly — it resets
   `h1`–`h6` to `font-weight: inherit` but never touches `th`, so UA-default bold would
   have rendered on every header cell unless countered explicitly.

3. ① What: whether the matrix's selected-cell indicator should rely on `aria-pressed`
   (toggle-button semantics) or a custom `role="gridcell"`/roving-tabindex ARIA grid
   pattern.
   ② Decided: plain `<table>` + `<button>` cells, each independently carrying
   `aria-pressed`, with all 12 buttons in normal Tab order (not a roving-tabindex ARIA
   grid), plus an additional arrow-key handler as a pure enhancement on top.
   ③ Why: the brief explicitly allows "a real `<table>`/`role="grid"` **or** a
   button-grid that's fully keyboard-navigable (Tab reaches it, arrow keys **or** Tab
   move between cells)" — i.e. Tab-order navigation alone already satisfies the
   requirement, so a full roving-tabindex ARIA grid pattern (which requires tabindex=-1
   on all but one cell, its own failure-prone state machine) was unnecessary complexity
   and risk for no required benefit; Tab-reaches-all plus an arrow-key bonus gets the
   same UX with less surface area for an a11y regression.

4. ① What: what counts as "most popular" and how to signal it without an absolutely
   positioned overlay (which the brief bans only for photos, but I chose not to use one
   on the matrix cell either, for consistency).
   ② Decided: Like New × Sneakers, as the highest `count`/`density` cell in the table,
   flagged with an inline "Top pick" pill rendered in the button's normal content flow
   (not `absolute`-positioned), and used as the default pre-selected cell.
   ③ Why: the brief only required picking *some* cell as the default and badging it as
   popular; tying the badge to the actual highest-density cell in the hardcoded table
   keeps the "informative before you click" density signal and the "most popular"
   narrative consistent with each other instead of being two unrelated arbitrary facts.
