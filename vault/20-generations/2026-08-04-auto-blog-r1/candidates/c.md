---
tags: [generation, blog, candidate-c]
---

# blog-evolve/r1/c — The Loupe Journal

## Product / brand

**Loupe** — a visual review & feedback tool for creative teams (video, motion, design comps),
positioned as the thing that replaces six scattered review tools with one shared timeline. The
blog, **"The Loupe Journal"**, publishes field notes on creative critique, remote-team review
rhythms, product updates, and craft essays about giving good feedback — an editorial voice with a
photography/darkroom undertone ("Loupe" as in the magnifier used to inspect film), distinct from
the generic-SaaS-dashboard voice most candidates in this catalog default to.

## Macro structure

A single main column running as a **vertical editorial timeline**, chronological and grouped by
month markers ("August 2026" → "April 2026") rendered as a thin rule across the column with a
continuous left rail line (`border-l`) threading every entry beneath it — explicitly not a uniform
card grid and not a dense sidebar-rail list. Four post treatments alternate down the page to create
real visual rhythm across a scroll:

- **feature-image** — oversized display-font headline + a large 4:3 photo, used for the pinned/most
  recent post and other high-stakes entries (case studies, launches).
- **feature-quote** — a big pull-quote pulled from the piece, no photo, set in a tinted panel — a
  second "large" treatment that reads completely differently from the image-led one.
- **compact-image** — a small square thumbnail beside a tight text block.
- **compact** — text-only, the tightest rhythm.

14 posts total, ordered `feature-image, compact-image, feature-image, compact, compact-image,
feature-quote, compact, compact-image, feature-image, compact, compact-image, compact,
compact-image, feature-quote` — no two adjacent entries share a treatment more than twice in a row.

A secondary `<aside>` (sticky on desktop, `lg:sticky lg:top-24`) sits beside the timeline holding
two modules: a **"Most read"** ranked list and a **newsletter signup** card. Both are structurally
subordinate to the timeline (the assignment's "not the page's main structural element" requirement)
and both render fully populated at rest — nothing on the page requires an interaction to reveal real
content; the first 8 of 14 posts (spanning August–June) are visible on load before any click.

## Interactions implemented (all information-bearing, all verified with Playwright)

1. **Tag filter** — a `role="group"` of topic chips (All topics / Craft / Product / Remote Teams /
   Case Studies / Engineering) filters the timeline in place and updates the `aria-live` "Showing X
   of Y posts" count. Verified: clicking "Craft" narrows 14 posts to 4.
2. **Load more** — extends the visible timeline by the remaining posts (`INITIAL_VISIBLE = 8`,
   reveals the rest in one step) and swaps the button for a "You're all caught up" confirmation once
   exhausted. Resets to the initial count whenever the tag filter changes. Verified: click grows
   "Showing 8 of 14" → "Showing 14 of 14" and the button itself disappears.
3. **Most-read scope toggle** — "This week" / "This month" swaps the ranked list to a different,
   independently-seeded set of posts and read counts (`MOST_READ_WEEK` vs `MOST_READ_MONTH`).
   Verified via `aria-pressed` state flip and list content change.
4. **Newsletter signup with client-side validation** — submitting an empty or malformed address
   shows an inline `role="alert"` error tied to the input via `aria-describedby`/`aria-invalid`
   without a page reload; a valid address swaps the form for a confirmation naming the captured
   address, with a "use a different address" reset. Verified both the invalid-input error path and
   the success path end-to-end.

## Palette / typography

**Light, warm editorial theme** — `stone` neutrals (not `zinc`) for a paper-toned, magazine feel,
with **orange-700/800 (rust/terracotta)** as the single accent hue — deliberately not
violet/indigo, and (being a light theme with no mono display face) fully distinct from the prior
round's dark+amber+mono trio. Display face: `--font-display-wide` (Archivo Display) for the h1
masthead and every post headline, giving the bold magazine-headline register; body copy stays on
`--font-sans`.

**Exactly 3 font weights across the whole route**, verified with the repo's own
`countFontWeights` check: `font-normal` (400, body/excerpts), `font-medium` (500, meta/labels/nav),
`font-semibold` (600, headings/headlines). No `font-bold`, no `font-light`, no `font-serif`.

**Contrast math** (computed with the real WCAG relative-luminance formula, not eyeballed):

| Pair | Ratio | Use |
|---|---|---|
| `stone-900` on `stone-50` | 16.74:1 | primary text |
| `stone-600` on `stone-50` | 7.30:1 | secondary/meta text (floor is `stone-600`, never `stone-500`, on any surface — I standardized on the muted-surface floor everywhere rather than mixing) |
| `stone-600` on `stone-100` | 6.99:1 | secondary text on the masthead/quote-panel tinted surfaces |
| `orange-700` on `stone-50` | 4.96:1 | accent links/active-filter text — passes AA (≥4.5:1) |
| white on `orange-700` | 5.18:1 | primary CTA button text (Subscribe) |
| `orange-800` on `orange-100` | 6.38:1 | "Editor's pick" badge |
| `red-700` on white | 6.47:1 | newsletter inline validation error |

No `dark:` variants are used anywhere — the theme is locked to explicit light-scheme utility
classes rather than following `prefers-color-scheme`, so the `no-dark-dim-text` rule is trivially
satisfied and there is no risk of the OS dark scheme silently swapping in an unaudited palette.

## Verification performed

- `dash-static-check.mjs` over all 7 route files: **0 violations**.
- `countFontWeights`: **3** (`normal`, `medium`, `semibold`).
- `dash-sweep.mjs` overflow sweep at 1280/1366/1440/1600/1920/390 (+ the −16px slack widths the
  sweep itself adds): **pass, 0 failures** — confirmed with real Playwright/Chromium, including
  under this sandbox's blocked-image condition (picsum.photos is outbound-blocked here), which is
  exactly the scenario the fixed-`aspect-ratio` + `bg-stone-200` image containers are meant to
  survive without layout breakage.
- Lighthouse accessibility: **100/100 on the desktop preset, 100/100 on the mobile (default)
  preset** — both comfortably clear the 95 hard-fail floor. Perf recorded only (96 desktop / 54
  mobile — the low mobile perf number is an artifact of this sandbox's network policy blocking the
  picsum.photos image host outright, not a rendering defect; every image sits in a reserved
  `aspect-ratio` container so the broken fetches never shift layout).
- Structural checks: single `<h1>` (masthead only), no heading-level skips (`h1` → `h2` month
  markers / sidebar module headers → `h3` post titles), single top-level `<main>`, `<header>` and
  `<footer>` both verified as DOM siblings of `<main>` (not nested inside it — confirmed by byte
  offset: `<footer>` opens after `</main>` closes), every interactive control has a visible
  `focus-visible:ring-2` plus a real accessible name, `tabular-nums` on every numeric value (dates,
  minute counts, read counts, stat row), `next/image` used exclusively (no raw `<img>`, no
  `unoptimized`), no emoji anywhere (lucide-react icons throughout).
