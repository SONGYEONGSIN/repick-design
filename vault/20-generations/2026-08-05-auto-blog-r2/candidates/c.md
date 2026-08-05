---
tags: [generation, blog, auto-blog-r2]
---

# auto-blog-r2 / c — "Keelson"

Generated from [[page-brief-core]] alone — `blog` has no dedicated type profile yet, so this delta
is a draft toward one. Route: `app/src/app/blog-evolve/r2/c/page.tsx`.

## Product / brand / trigger

**Keelson** — a durable-queues/workflows/scheduling infrastructure platform for backend teams. A
keelson is the structural beam bolted the length of a ship's hull to reinforce the keel end to end —
the brand's own metaphor for a release spine, which is the reason this candidate reached for a
changelog/release-notes blog rather than another editorial format. The page is
"Changelog & release notes": every entry is a shipped version (`v4.2.0` → `v3.4.2`, 10 releases),
not a calendar-grouped article.

## Macro structure — why this is not a-r1/a, r1/b, or r1/c

- **Not** a hero + filtered 3-column card grid (r1/a "Northbeam").
- **Not** a sticky category rail + dense text list (r1/b "Stackrail").
- **Not** a month-grouped editorial timeline with four alternating card templates (r1/c "Loupe").

Instead: a single-column **spine** — a continuous vertical line with a dot per release, one
consistent card template throughout (deliberately not alternating — a changelog reads as one ledger,
not a magazine). Beside the spine sits a **jump-to-version index** that is a real navigation device,
not a decoration: it lists every currently-visible version, scrolls to it on click, and is kept in
sync with scroll position via `IntersectionObserver` so the active marker reflects where the reader
actually is. On `lg+` the index is a sticky vertical rail to the left of the spine; below `lg` it
becomes a horizontally scrollable strip pinned above the list — same function, different orientation,
not dropped.

Layout: hero (brand chip + h1 + intro + `<dl>` stat pair: latest version / total releases logged) →
toolbar (search + sort + type filter, in a `bg-zinc-50` card) → `grid-cols-1 lg:grid-cols-[160px_1fr]`
of [version index, spine list].

## Interactions (5, all information-bearing, one `useMemo` pipeline in `release-timeline.tsx`)

1. **Search** — free-text input filters releases by title, version, or tag substring (case-insensitive).
2. **Release-type filter** — pill group (All / Major / Minor / Patch / Security, `aria-pressed`)
   narrows the spine to one type; icon + label + color together (never color alone).
3. **Sort direction** — single toggle button flips the spine between newest-first and oldest-first,
   reversing the derived array (not the source).
4. **Jump-to-version + scrollspy** — clicking a version in the index `scrollIntoView`s the matching
   card (respects `prefers-reduced-motion` via `matchMedia` check at click time) and sets it active;
   scrolling the spine independently drives the same active state via `IntersectionObserver`, so the
   two are mutually synced rather than the index being a write-only trigger.
5. **Per-card "View full changelog" expand** — each card independently reveals its full bullet list
   of changes (`aria-expanded` + `aria-controls`), collapsed by default to keep the spine scannable.

A live `aria-live="polite"` result count ("Showing N of 10 releases") reports every filter/search
change to screen reader users, and an empty state ("No releases match your filters") replaces the
spine when a combination yields zero results.

## Palette / AA contrast math (light theme, blue accent, per this round's diversity assignment)

Computed with the standard WCAG relative-luminance formula (not eyeballed):

| Foreground | Background | Ratio | Use |
|---|---|---|---|
| `zinc-900` #18181b | white | 17.72:1 | headings |
| `zinc-700` #3f3f46 | white | 10.44:1 | — |
| `zinc-600` #52525b | white | 7.73:1 | body/secondary text on near-white |
| `zinc-600` #52525b | `zinc-100` #f4f4f5 | 7.03:1 | secondary text on muted surfaces (filter track, tag chips) |
| `zinc-500` #71717a | white | 4.83:1 | used **only** on white/`zinc-50` — never on `zinc-100`+ |
| `zinc-500` #71717a | `zinc-100` #f4f4f5 | **4.40:1 (fails, deliberately unused)** | confirms the brief's documented floor rule — this exact combo is the one page-brief-core §3 calls out as unsafe |
| `blue-600` #2563eb | white | 5.17:1 | links, active nav, primary buttons (as bg with white text, same ratio reversed) |
| `blue-700` #1d4ed8 | white | 6.70:1 | hover states |
| `blue-700` #1d4ed8 | `blue-100` #dbeafe | 5.49:1 | active "Major" badge/pill |
| `blue-700` #1d4ed8 | `zinc-100` #f4f4f5 | 6.10:1 | active nav-index item background alt |
| `emerald-700` #047857 | `emerald-50` #ecfdf5 | 5.21:1 | "Minor" badge |
| `violet-700` #6d28d9 | `violet-50` #f5f3ff | 6.48:1 | "Patch" badge |
| `rose-700` #be123c | `rose-50` #fff1f2 | 5.72:1 | "Security" badge |

No `dark:` classes are used anywhere in the route — the page commits to a light surface
(`bg-white`/`bg-zinc-50` without `dark:` overrides), which is this round's assigned theme, so the
dark-floor rule (`no-dark-dim-text`) is vacuously satisfied rather than worked around.

## Font usage confirmation

No display font added — `--font-sans` (Pretendard) is used for every heading and body string, per
this round's diversity assignment ("no added display font"). `font-mono` (the existing
`--font-mono` system stack, already declared in `globals.css`, not a new import) is used only for
version-number strings (`v4.2.0`) alongside `tabular-nums`, which is a font-*family* choice already
on the allow-list, not a weight.

Exactly 3 font-weight classes route-wide, grep-counted (`grep -oE 'font-(thin|extralight|light|
normal|medium|semibold|bold|extrabold|black)\b' *.tsx | sort | uniq -c`) across all 7 files:

```
font-bold      : 11
font-semibold  : 15
font-normal    : 15
```

Per-file breakdown (bold / semibold / normal): `page.tsx` 4/3/2, `release-card.tsx` 3/3/5,
`release-timeline.tsx` 0/4/3, `site-footer.tsx` 2/0/3, `site-header.tsx` 1/4/0, `version-index.tsx`
1/1/2. No `font-medium`, `font-light`, or any other weight class appears anywhere in the route.

## Mobile nav accessibility (at 390px)

This is the round's actively-flagged risk (questions-queue Q16: all three r1 blog candidates hid
primary nav on mobile with no accessible alternative). `site-header.tsx` avoids that structurally:
below `md`, the desktop link bar (`hidden md:flex`) is replaced — not just hidden — by a hamburger
`<button>` with `aria-expanded`/`aria-controls`/`aria-label` that toggles a real `<nav aria-label=
"Primary mobile">` panel. The panel is **conditionally rendered** (mounted/unmounted, not
CSS-`hidden`), so it can never be tabbed into while invisible. Every link in the desktop bar
reappears in the panel plus the "Start free trial" CTA. `Escape` closes the panel and returns focus
to the toggle button; clicking a link inside the panel also closes it. At 390px there is always a
keyboard- and screen-reader-reachable path to every nav link — either the panel is open and all
links are in the tab order, or the toggle button itself is.

## Verification run

- (repo root) `node scripts/dash-static-check.mjs app/src/app/blog-evolve/r2/c/*.ts app/src/app/blog-evolve/r2/c/*.tsx` → `[]` (0 violations).
- `cd app && npx tsc --noEmit` → clean, no output, exit 0.
- `cd app && npx eslint src/app/blog-evolve/r2/c` → clean (fixed one initial `react-hooks/set-state-in-effect` error by replacing an effect-driven clamp with a derived `useMemo` value instead of `setState` inside `useEffect`).
- `cd app && npx next build` → succeeded; `/blog-evolve/r2/c` compiles and statically prerenders alongside the rest of the catalogue.

Hand-verified gate rules, 0 violations found by direct grep/regex checks matching `dash-static-
check.mjs`'s own rule set: no raw `<img>`, no `unoptimized`, no `Math.random(`/`Date.now(`/`new
Date()` in executable code (only in explanatory comments), no emoji (`\p{Extended_Pictographic}`
scan clean), no `next/font` import, no `font-serif`, no unlisted `font-family`/`fontFamily` (no
inline font-family declarations at all — every face comes from the CSS default), no
`dark:text-{zinc,neutral,gray,slate,stone}-{500,600}` (no `dark:` classes at all), no random image
host substring (`picsum.photos`, `loremflickr.com`, `placekitten.com`, `placeimg.com`,
`source.unsplash.com`, `placehold.co`, `dummyimage.com`) — the route has no remote image host of any
kind; every visual (release cover tiles, author avatars) is a deterministic inline SVG seeded from a
plain string hash (`utils.ts::hashString`, djb2 variant) of the release id or author name, per
`page-brief-core` §4's guidance and the r1/c documented failure it names directly.
