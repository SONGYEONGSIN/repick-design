---
tags: [generation, blog, auto-blog-r2]
---

# auto-blog-r2 / a — "Continuum"

Route: `/blog-evolve/r2/a` · files in `app/src/app/blog-evolve/r2/a/`
(`page.tsx`, `data.ts`, `cover-tile.tsx`, `site-chrome.tsx`, `series-explorer.tsx`)

No dedicated `blog` profile exists yet — this candidate was generated from `page-brief-core` alone,
per its own instruction that the delta becomes a draft toward that profile. `blog` had exactly one
prior round (`auto-blog-r1`); this doc explicitly avoids all three of its archetypes.

## Product / brand / trigger

**Continuum** — an invented systems-engineering research & education group. Its blog is not a
reverse-chronological feed: the trigger a reader arrives with is "I want to actually learn
distributed consensus / query planning / observability," and the product's answer is a small set of
fixed-length **series** — ordered, numbered sequences of parts meant to be read in order, each part
showing where it sits and what's next — plus a secondary shelf of **standalone essays** that don't
belong to any series (culture, incident retrospectives, one-off notes).

## Macro structure — why it's a distinct skeleton

The assignment ruled out three shapes already used in `auto-blog-r1`: hero + filtered 3-col card grid
(r1/a "Northbeam"), sticky category rail + dense list (r1/b "Stackrail"), and month-grouped editorial
timeline with alternating templates (r1/c "Loupe"). This candidate's primary structural device is
**series membership**, not category, search rank, or publish date:

1. **Site header** (`site-chrome.tsx`, outside `<main>`) — wordmark, primary nav, accessible mobile
   disclosure (see below).
2. **Intro block** — kicker + single `h1` ("Read it as a sequence, not a feed") + one-line subhead.
   Deliberately *not* a large single-featured-post hero (that's r1/a's device) — no post is
   privileged over the series structure itself.
3. **Overview `dl`** — three aggregate stats (series count, parts published/total, essay count) in a
   `dl > div` group with the icon inside each `dt`, per `page-brief-core` §3.
4. **Series explorer** (`series-explorer.tsx`, client, `id="series"`) — a `role="tablist"` of three
   series cards (icon tile, title, tagline, live "published/read" counts), and below it a single
   `role="tabpanel"` rendering the selected series as a numbered **stepper**, not a card grid: each
   part is a row with an index badge on a connecting rail, a status chip (Published/Upcoming, icon +
   text, never color alone), an expand toggle, and a read toggle. Expanding a part reveals its full
   summary, topic tags, and **Previous part / Next part** buttons that jump the expanded state to the
   neighboring part *within the same series* — the "navigate within a series as easily as across
   posts" requirement, without needing real per-post routes.
5. **Standalone essays** (`id="essays"`, zinc-50 band) — a plain single-column filterable list (not a
   grid, not a rail) with a search box and multi-select topic chips. Kept deliberately secondary and
   visually distinct from the series section so the series device stays the page's spine.
6. **Site footer** (sibling of `<main>`, keeps its `contentinfo` role).

## Interactions (6, all information-bearing, plus the required mobile-nav disclosure)

1. **Series tab switch** — `role="tablist"`/`role="tab"`/`role="tabpanel"` with roving `tabIndex`
   and Arrow-Left/Right keyboard support (DOM focus moves with the arrow key, not just state).
   Switches which series' description and part stepper is shown; each tab's own "published/read"
   counts update live from state.
2. **Part expand/collapse** — `aria-expanded` accordion per part, single-open-per-series, reveals the
   full summary, topic tags, and read time.
3. **In-series Previous/Next jump** — inside an expanded part, moves the open part to `index ± 1`
   within the active series (disabled at the first/last part), so a reader can work through a whole
   series without re-scanning the list.
4. **Mark-as-read toggle** — `aria-pressed` button per part; updates the per-series "X of Y read"
   readout next to the tab panel heading *and* the page-wide "N of 15 parts read across every series"
   line at the bottom of the section. Icon + label both change (circle → check-circle, "Mark
   read" → "Read"), never color alone.
5. **Essay search** — live substring filter over essay title + dek; result count
   ("Showing N of 6 essays") is `aria-live="polite"`.
6. **Essay topic filter** — multi-select `aria-pressed` chip group (AND-combined with search);
   empty-state message when a combination matches nothing.
7. **Mobile nav disclosure** (accessibility fix, see below) — hamburger toggles a real, keyboard- and
   screen-reader-reachable nav panel.

## Mobile-nav accessibility (Q16 fix)

All three `auto-blog-r1` candidates hid primary nav below `md:` with nothing replacing it
(`hidden ... md:flex`, flagged by judge lens1). This candidate's header (`site-chrome.tsx`):

- Nav links render inline at `md:` and up (`hidden items-center gap-1 md:flex`), exactly as before.
- Below `md:`, a `<button aria-expanded aria-controls="mobile-nav-panel" aria-label="Open/Close menu">`
  (44×44px target, `Menu`/`X` icon swap) toggles a real in-flow panel (`role="dialog"
  aria-modal="true" aria-label="Primary"`) containing the **same four nav links** plus the CTA, as
  actual focusable `<a>` elements — not a decorative hidden list.
- Opening moves focus to the first link; closing (via the button, a link click, `Escape`, or the
  dimming backdrop) returns focus to the menu button. `Escape` is bound with a `keydown` listener
  scoped to `navOpen`, and `document.body.style.overflow` is locked/restored so background content
  can't scroll under the open panel.
- The backdrop is `aria-hidden="true"` and never focusable (dismiss-only), so the accessibility tree
  contains exactly one interactive nav surface at a time — verified at 390px there is no state where
  nav links exist in the DOM but are neither visible nor reachable.

## Palette / AA contrast — rose accent, light theme

All ratios below are computed via the actual WCAG relative-luminance formula (`sRGB → linear →
0.2126R+0.7152G+0.0722B`, `(L1+0.05)/(L2+0.05)`), not estimated:

| Pair | Ratio | Verdict |
|---|---|---|
| `rose-700` (#be123c) on white | 6.29:1 | AA pass (labels, links, read-toggle) |
| white on `rose-700` fill | 6.29:1 | AA pass (read index badge, filled CTA alt) |
| `rose-700` on `rose-50` (active tag chip) | 5.72:1 | AA pass |
| `rose-800` on `rose-50` (selected series-tab title) | 7.30:1 | AA pass, comfortable margin |
| `zinc-900` on white (headings) | 17.72:1 | AA pass |
| `zinc-600` on white (body) | 7.73:1 | AA pass |
| `zinc-500` on white (secondary/meta text) | 4.83:1 | AA pass — at the documented white-surface floor |
| `zinc-600` on `zinc-100`/`rose-50` (muted-surface floor) | 7.03–7.04:1 | AA pass |
| `zinc-500` on `zinc-50` (stat band, essays band) | 4.63:1 | AA pass |
| `emerald-700` on `emerald-50` ("Published" chip) | 5.21:1 | AA pass |

**One real bug this caught and fixed**: `rose-50` (#fff1f2, luminance 0.9058) is, by relative
luminance, essentially as dark as `zinc-100` (#f4f4f5, luminance 0.9053) despite the "-50" name — a
`zinc-500` label on a `rose-50` card computes to **4.40:1, below the 4.5 AA gate**, the same failure
mode `page-brief-core` documents for `neutral-500` on `neutral-100` (4.34:1). The selected series-tab
card uses `bg-rose-50`, and its meta line ("published/read" counts) was originally `text-zinc-500`.
Fixed to switch to `text-zinc-600` only when that card is selected (`rose-50` background) while
staying `text-zinc-500` on the unselected white cards — confirmed by script: `zinc-600` on `rose-50`
= 7.04:1. No other `zinc-500` instance in the route sits on a tinted/muted background; every
remaining one is on white or `zinc-50`, both within the documented floor.

## Font usage confirmation

- Display face: **`--font-display-grotesk` only** (Space Grotesk Display), applied via inline
  `style={{ fontFamily: "var(--font-display-grotesk)" }}` to the `h1`, brand wordmark (header +
  footer), section `h2`s, the active series' `h3` panel title, and post/part title text. No
  `--font-display-wide` or `--font-display-mono` anywhere in the route (grep-confirmed 0 matches) —
  satisfies this round's "no `--font-display-wide`" diversity constraint.
- Body copy stays on `--font-sans` (Pretendard) everywhere else, including all part/essay dek and
  summary text.
- **Exactly 3 font-weight classes route-wide**, grep-confirmed: `font-bold` (15), `font-medium`
  (22), `font-normal` (13). No `font-semibold`, `font-thin`, etc. anywhere in the folder.
- No `font-serif`, no additional `next/font` import (grep-confirmed 0 matches for both).

## Generated art / no random image host

Every cover tile (`cover-tile.tsx`) is a deterministic inline SVG — hash-seeded gradient (two stops
from a fixed `hue`/`hue+22` pair) plus a route-shaped 5-point polyline plus a centered lucide icon,
sized and colored per series/essay `hue` from `data.ts`. Nothing is fetched over the network, so
there is no failure mode that could repeat `auto-blog-r1/c`'s picsum alt-text overflow — grep-
confirmed 0 matches for `picsum`/`loremflickr`/`source.unsplash`, 0 raw `<img>`, 0 `unoptimized`, and
`next/image` is not needed at all since no raster asset exists in the route.

## Verification run

- `cd app && npx tsc --noEmit` — **clean, 0 errors** (ran twice: once before, once after the
  `rose-50`/`zinc-500` contrast fix and the tablist roving-focus fix).
- `cd app && npx eslint src/app/blog-evolve/r2/a` — **clean, 0 errors/warnings** (same two runs).
- `cd app && npx next build` — full production build passed, including static generation of
  `/blog-evolve/r2/a` (an earlier attempt failed only on a sibling candidate route, `r2/b`, unrelated
  to this folder — expected when three candidates share the app directory concurrently; a rebuild
  after that candidate's route stabilized completed all 71 routes cleanly, `/blog-evolve/r2/a`
  included).
- Manual static-gate sweep (grep across the whole folder), 0 violations: no `Math.random(` /
  `Date.now(` / `new Date(` outside a comment explaining their absence; no raw `<img>`; no
  `unoptimized`; no emoji (Unicode-range scan); no `next/font` import; no `font-serif`; no
  `dark:text-{zinc,neutral,gray,slate,stone}-{500,600}`; no random image host. All `outline-none`
  occurrences are paired with `focus-visible:ring-2` (never bare). Heading order is `h1 → h2 → h2 →
  h3 → h2 → h2`, no skips (part/essay titles are styled spans inside list items, not headings, to
  avoid heading-level proliferation across 15 parts + 6 essays).
