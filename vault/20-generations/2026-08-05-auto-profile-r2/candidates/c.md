---
tags: [generation, profile, auto-profile-r2]
---

# auto-profile-r2 / c — "Reeve Calloway / Fieldwork"

One-line: a freelance product/growth designer's profile on a talent platform ("Fieldwork"), built around a filterable, sortable, expand-in-place case-study grid, with the trust/reach stat cluster pinned in a `sticky top-0` header strip rather than a sidebar or hero.

## Product / brand / trigger

- **Brand**: Fieldwork — an invented talent-marketplace platform for independent product/growth designers.
- **Profile owner**: Reeve Calloway, Senior Product & Growth Designer, 6 years on the platform, 58 completed engagements, 4.9 rating (52 reviews), &lt;2 hr response time, 96% on-time rate.
- **Trigger**: a hiring manager reaches the profile from search/referral to evaluate Reeve for a scoped design engagement (onboarding, conversion, retention, or design-systems work) and needs to see proof of outcomes fast, then filter down to case studies relevant to their own problem before reading full detail.

## Macro structure (deliberately distinct from all three auto-profile-r1 archetypes)

1. **`sticky top-0` identity/stat header strip** (`identity-bar.tsx`, mounted inside a `<header>` in `profile-client.tsx`) — avatar mark, `h1` name, title + availability, and a 4-item `dl` (rating, completed engagements, response time, on-time rate). This is the *only* persistently-visible surface; there is no sidebar and no full-bleed hero banner.
2. **About section** — bio, location, platform handle, specialty tags. Static, non-sticky, scrolls away normally (only the stat cluster is pinned, per the r1/b delta).
3. **Case-study grid as the primary content surface** — a filter/sort toolbar above a responsive card grid (1/2/3 columns). Each card carries a cover-art motif, discipline tag, headline impact metric, and an expand-in-place toggle that reveals problem/approach/results-table/testimonial without navigation.
4. **Footer** — one-line aggregate stat restating total completed engagements vs. the 8 shown here.

This avoids: r1/a's full-bleed banner + ARIA tablist (Listings/Reviews); r1/b's sticky **left sidebar** + heatmap + grid; r1/c's hero-with-feed + billing-toggle pricing tiers. Nothing here is tabbed, and there is no billing/pricing surface — the grid itself is asked to do the primary information work via two independent filter dimensions plus sort plus per-card expansion.

## Interactions (4, all information-bearing)

1. **Discipline filter chips** (`filter-toolbar.tsx`, `role="group"` of `aria-pressed` toggle buttons) — multi-select across Onboarding/Conversion/Retention/Systems; changes the actual set of cards rendered and the live "Showing N of 8" count (`aria-live="polite"` in `case-study-grid.tsx`).
2. **Engagement-type segmented control** (fieldset of visually-hidden radios styled as pills) — All / Fixed-price / Retainer / Audit; ANDs with the discipline filter, independently narrows the grid.
3. **Sort control** (native `<select>`) — Most recent / Highest impact / Longest engagement; reorders the filtered set using real per-case-study fields (`year`, `impactScore`, `durationWeeks`).
4. **Expand-in-place case detail** (`case-study-card.tsx`, `aria-expanded`/`aria-controls` button driving a `grid-template-rows` 0fr→1fr reveal) — opens problem/approach text, a semantic before/after metrics `<table>`, and a client testimonial for that specific case, independently per card, without navigation or a modal.

The core trust stats (interaction target of the r1/b delta) are **not** one of the 4 counted interactions — they are static, always-rendered content in the sticky header, exactly so they can never be gated behind a click.

## Palette / AA contrast math (Tailwind v4 OKLCH → sRGB, computed, not assumed)

Assigned axis: light theme, `blue` accent, `--font-display-mono` display face on `h1`/hero numerals only.

Converted Tailwind v4's OKLCH swatches to sRGB via the standard OKLab matrices, then WCAG relative-luminance contrast (script run locally, not eyeballed):

| Pair | Ratio | Verdict |
|---|---|---|
| `blue-700` (#1447e6) on white | 6.83:1 | AA normal-text pass |
| `blue-700` on `zinc-50` (#fafafa) | 6.55:1 | pass |
| `blue-700` on `zinc-100` (#f4f4f5, muted surface) | 6.22:1 | pass |
| `blue-700` on `blue-50` (#eff6ff) | 6.28:1 | pass — used for active discipline chip / impact-callout text |
| `blue-600` (#155dfc) on white | 5.25:1 | pass — used for icon accents only, not body text |
| white on `blue-700` | 6.83:1 | pass (not used for filled buttons here, but verified for future reuse) |
| `zinc-900` (#18181b) on white | 17.72:1 | pass — headings/body |
| `zinc-600` (#52525c) on `zinc-100` (muted, segmented-control track) | 7.02:1 | pass, and above the muted-surface zinc-600 floor |
| `zinc-500` (#71717b) on white | 4.83:1 | pass — used only on pure-white/`zinc-50` surfaces (duration labels, table "Before" cells), per the near-white floor |
| `zinc-500` on `zinc-100` | 4.39:1 | **fails** AA (matches the brief's own worked example of 4.34:1) — confirmed **not used** anywhere; every zinc-500 use in this route sits on white/`zinc-50`, and every muted-surface (zinc-100 segmented track, filter-chip counts) uses `zinc-600` instead |

Surface-tone-conditional floor was applied deliberately: `identity-bar.tsx` label text and `filter-toolbar.tsx` chip counts were bumped from an initial `zinc-500` to `zinc-600` specifically because they render on `zinc-100`/muted chip surfaces in some states; `zinc-500` was kept only where the background is confirmed white (card duration labels, table "Before" column, testimonial attribution).

## Font usage confirmation

Grep across the whole route (`grep -rEo "font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)" .` in `app/src/app/profile-evolve/r2/c/`) returns exactly 3 distinct weight utilities:

- `font-normal` — 23 occurrences (body text, table cells, labels)
- `font-medium` — 15 occurrences (buttons, chip labels, secondary emphasis)
- `font-semibold` — 14 occurrences (h1/h2/h3 headings, stat values, impact numbers)

Display face: `--font-display-mono` is applied inline (`style={{ fontFamily: "var(--font-display-mono)" }}`) only on the `h1` name in `identity-bar.tsx`, the 4 sticky-header stat `dd` values, the avatar-mark initials, and each card's headline impact-metric number — i.e. the `h1` and "hero numerals" only, per the assignment. Every other heading and all body text stays on the inherited `--font-sans` (Pretendard) with no additional `font-*` family utility or `next/font` import anywhere in the route.

## Verification

Ran from `/home/user/repick-design/app`:

- `npx tsc --noEmit` — clean, zero errors.
- `npx eslint src/app/profile-evolve/r2/c` — clean, zero errors/warnings.
- `npx next build` (full monorepo build, Turbopack) — compiled successfully; `/profile-evolve/r2/c` listed as a static (`○`) route alongside all other existing routes, no route-specific build failures.

Hand-verified static gate rules with 0 violations across every file in `app/src/app/profile-evolve/r2/c/`:

- No `Math.random(`, `Date.now(`, or `new Date(` anywhere (only mentioned in code comments as documentation of the deterministic-data guarantee; `hash.ts` uses a pure FNV-1a string hash for all generated art).
- No raw `<img>` — zero image elements at all; all visual art (avatar mark, case-study cover art) is inline generated SVG, so there is also no `unoptimized` prop, and no remote/random image host of any kind (no `next/image` import in this route at all — sidesteps that risk entirely).
- No emoji — checked via a codepoint scan (nothing above U+2100 other than the typographic entities `&middot;`/`&mdash;`/curly quotes already used as HTML entities, not literal glyphs).
- No `next/font` import — only lucide-react icon imports and internal relative imports.
- No `font-serif` anywhere.
- No unlisted font — only `var(--font-sans)` (inherited default) and `var(--font-display-mono)` (explicit, allow-listed) are referenced.
- No `dark:text-{zinc,neutral,gray,slate,stone}-{500,600}` — this route is light-theme-only by design (no `dark:` variants used at all), so the rule is vacuously satisfied; confirmed via grep.
- No random image host strings (`picsum`, `loremflickr`, `source.unsplash`) — none present; no external image host referenced at all.
- SVG coordinates in `cover-art.tsx` and `avatar-mark.tsx` are rounded to 2dp via a shared `round2`/inline rounding helper to avoid float-formatting hydration drift.
- `min-w-0` applied to case-study grid `<li>` items; the metrics table uses `table-fixed` with `%`-width columns (no horizontal scrollbar needed, wrapped in `overflow-x-auto` defensively for mobile only) and its `sr-only` `<caption>` sits inside a `relative`-positioned wrapper to avoid the containing-block clipping bug called out in the core brief.
- Icon-paired `dt`/`dd` groups keep the icon *inside* the `dt` itself (not as a sibling wrapping both), so `dt`/`dd` remain direct children of each `dl > div` group.
