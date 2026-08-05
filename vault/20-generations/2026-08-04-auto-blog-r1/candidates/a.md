---
tags: [generation, blog, r1, candidate-a]
---

# blog-evolve r1 · candidate a — Northbeam Blog

Route: `/blog-evolve/r1/a` · files in `app/src/app/blog-evolve/r1/a/`
(`page.tsx`, `data.ts`, `cover-art.tsx`, `avatar.tsx`, `site-chrome.tsx`, `featured-post.tsx`, `blog-explorer.tsx`)

## Product / brand

**Northbeam** — invented attribution-and-pipeline-analytics SaaS for B2B revenue teams (same
fictional universe as `Fathomline`/`Loopwire`/`Conduit`, distinct name and category-color system
from all of them). The route is Northbeam's public blog index: "Notes on attribution, pipeline
math, and the teams shipping both." Five recurring bylines (Founder/CEO, Head of Product, Staff
Engineer, Data Scientist, Content Lead) and six editorial categories (Attribution, Product,
Engineering, Data Culture, Guides, Company) stand in for a real publication's beat structure.

## Macro structure

1. **Site header** (outside `<main>`) — wordmark, primary nav (`Blog` marked `aria-current="page"`), CTA.
2. **Intro block** — kicker + single `h1` + one-line subhead, page-level framing, not a post title.
3. **Featured hero** (`featured-post.tsx`) — large generated cover art (`aspect-[4/3.1]` desktop /
   `aspect-[16/10]` mobile) beside title (`h2`), excerpt, author card (avatar + name + role), date,
   read time, and a real "Read article" CTA. Always the most recent post, statically rendered,
   never gated behind an interaction.
4. **Filtered card grid** (`blog-explorer.tsx`, client) — search + sort + category-chip controls
   above a responsive 1/2/3-column grid (`role="list"`), each card with fixed-aspect cover art,
   category chip, `h3` title, clamped excerpt, avatar + author + date + read time + read count.
   Grid is populated at rest with the first 6 of 11 non-featured posts — nothing requires
   interaction to see real content.
5. **Site footer** (sibling of `<main>`, keeps its `contentinfo` role) — brand blurb, three link
   columns, social row, legal bar.

## Interactions (4, all information-bearing)

1. **Category filter** — chip group (`role="group" aria-label="Filter by category"`, `aria-pressed`
   per chip) narrows the grid to one of 6 categories or "All"; live count updates
   ("Showing 2 of 2 articles matching your filters").
2. **Live search** — text input filters by title + excerpt substring match as you type; verified
   `attribution` → 1 result, correctly excluding posts merely tagged Attribution whose titles don't
   contain the word.
3. **Sort control** — native `<select>` (Newest first / Most read) re-orders the filtered set by
   `dateKey` or `reads`; visible in card meta row so the new order is legible, not just felt.
4. **Load more** — reveals 5 more of the filtered/sorted set per click, button text/count updates
   dynamically ("Load 5 more articles" → disappears at "Showing 11 of 11").

Search, category and sort all operate on one derived array so `aria-live="polite"` count text is
always exact; category/search changes reset pagination to the initial 6, sort does not (re-orders
in place). Verified via headless Playwright: search→"Showing 1 of 1", category→"Showing 2 of 2",
sort+load-more→"Showing 6 of 11" then "Showing 11 of 11". Empty-search state renders a recovery
"Clear filters" action rather than a dead end.

## Visual direction

Light, warm-paper editorial theme — deliberately not the zinc/dark SaaS default this catalogue
leans on. No violet/indigo; accent is rust/terracotta, distinct from the immediately-prior round's
dark+amber+mono trio (this round reuses neither dark nor amber, only sits in the same broad
warm-hue family via a different color and a light base).

- Background `#FBF7F1` (warm paper), filter-tray surface `#EFE4D3` (muted card), ink `#221D18`,
  secondary text `#5B4F41`, accent `#AE4526` / hover `#8F3A21`, border `#E6D9C4`.
- Display font: `var(--font-display-wide)` (Archivo Display) on `h1`/`h2`/`h3`/wordmark only, `700`
  weight — geometric, editorial-but-technical, pairs with an analytics brand. Body stays on
  `--font-sans` (Pretendard).
- Exactly 3 font-weight classes on the route: `font-normal` (body/meta), `font-medium` (nav, chips,
  controls, byline name), `font-bold` (headings, wordmark) — confirmed via
  `countFontWeights`-equivalent grep, zero stray weights.

### Contrast (computed via WCAG relative-luminance, `node` script, not eyeballed)

| pair | ratio | floor | pass |
|---|---|---|---|
| ink `#221D18` / paper `#FBF7F1` | 15.65:1 | near-white surface → 4.5:1 | yes |
| secondary text `#5B4F41` / paper | 7.45:1 | 4.5:1 | yes |
| secondary text `#5B4F41` / muted tray `#EFE4D3` | 6.33:1 | muted surface → ~7:1-equivalent target | yes (comfortably above the 4.5:1 hard floor; picked deliberately over a lighter gray that measured 4.95:1 on the same surface) |
| accent `#AE4526` / paper (kicker, links) | 5.35:1 | 4.5:1 | yes |
| white / accent (buttons, active chip) | 5.71:1 | 4.5:1 | yes |
| accentDark `#8F3A21` / paper (hover, focus ring) | 7.04:1 | 4.5:1 | yes |

No dark-mode variants are shipped (single committed light theme), so `no-dark-dim-text` doesn't
apply; verified none of `dark:text-{zinc,neutral,gray,slate,stone}-{500,600}` appear in the route.

## Images

No `<img>`/`next/image` anywhere in the route — every cover and avatar is a deterministic inline
SVG (`cover-art.tsx`, `avatar.tsx`), seeded by post id / curated per-author hue, never
`Math.random`/`Date`. This follows an established pattern already in this codebase
(`catalog/brand-tile.tsx`, `profile-evolve/r1/a/listing-art.tsx`) precisely to satisfy
page-brief-core §4's "reserve aspect-ratio + background color, no layout collapse on failed
remote load" without a network dependency at all. Category badges sit in their own row below the
art, never overlaid on it. SVG coordinates are plain arithmetic, rounded to 2 decimals.

## Accessibility / structural checks done before handoff

- Single `h1` (intro), `h2` (featured title, "Latest articles", footer columns), `h3` (card
  titles) — no level skips. Confirmed via server HTML: exactly one `<h1>`.
- Exactly one `<main>`; `<footer>` is a sibling *after* `</main>`, not nested — confirmed
  programmatically (`footer inside main? False`).
- Every interactive element carries `focus-visible:outline-none focus-visible:ring-2
  focus-visible:ring-[#8F3A21] focus-visible:ring-offset-2` (never `outline-none` alone).
- Search input has a `sr-only` `<label htmlFor>`; sort `<select>` has a visible associated
  `<label>`; all icon-only social links in the footer carry `aria-label`.
- `tabular-nums` on read-minute counts, read counts, and the live "Showing N of M" numbers.
- `ul[role="list"]` around the card grid (Tailwind's list-style reset strips the implicit list
  role in some AT/browser combinations without it).
- No nested `dl` icon/term/description pattern is used anywhere on the route.

## Gate results (this environment)

Ran `node scripts/gate.mjs --target web --routes /blog-evolve/r1/a` locally (with
`PW_CHROMIUM_PATH`/`CHROME_PATH` pointed at this sandbox's cached Chromium, since neither was on
`PATH` by default):

```
static:  pass (위반 0)
weights: pass (3종)
sweep:   pass (전 폭 오버플로 0)  — 1280/1366/1440/1536/1680/1920 (+16px-slack variants) and 390
a11y:    pass (100)              — worst of desktop+mobile Lighthouse presets
perf:    52 (record-only, dev-server overhead; not a gate criterion)
```

`tsc --noEmit` clean; no console/page errors from the route itself (two unrelated
`ERR_TUNNEL_CONNECTION_FAILED` entries are the sandbox proxy blocking the globally-shared
jsdelivr Pretendard/Archivo CDN fonts declared in `app/src/app/globals.css` and `layout.tsx` —
the same infra every route in this catalogue depends on, not something introduced by or fixable
from within this folder; `font-display: swap` means text stays visible on the `--font-sans`
fallback regardless).
