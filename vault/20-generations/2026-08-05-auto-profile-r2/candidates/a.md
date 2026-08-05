---
tags: [generation, profile, auto-profile-r2]
---

# auto-profile-r2 / a — "Imogen Castellane / Keel & Ballast Audits"

**Product/brand/trigger**: Keel & Ballast Audits is the solo practice of **Imogen Castellane**, an independent protocol security auditor (smart contracts, bridges, rollups, wallet infrastructure, oracle feeds). No single "trigger" moment — this is a credibility page a prospective client lands on from a referral or an audited project's disclosure post, and needs to judge, fast, whether this auditor's claimed track record is real and current before booking a paid scoping call.

**Macro structure — a case-log spine, not a storefront/tabs, sidebar/heatmap/grid, or hero/feed/pricing shape**: the whole page reads as a single scrolling document, not a dashboard split into widgets.
- `identity-bar.tsx` — a slim **`sticky top-0`** bar (not a sidebar, not a hero banner) spanning full width: monogram mark, `h1` name + title on the left, a 4-item `dl` (rating / audits / fixes / active-since) on the right. It stays mounted at every scroll depth and every filter/sort/expand state below it — the direct answer to the standing delta ("core proof must never live behind a tab or require a click," previously the deciding factor for 2 of 3 judge lenses).
- `intro-section.tsx` — non-sticky, renders once: practice name, bio, location/tenure `dl`, and an availability pill.
- `track-record-table.tsx` — an always-visible, non-interactive semantic `<table>` breaking career totals down by protocol type (engagements / critical findings / share of practice). Its numbers never change with the log's filters below, so the base claim is never only as complete as whatever filter happens to be selected — the "let interaction reinforce, not gate, the core proof" rule applied a second time, at the aggregate level.
- `case-log.tsx` — the **primary content column**: a chronological, filterable, sortable, expandable log of 10 real audit engagements. This is the page's main axis, not a decorative widget bolted onto a sidebar.
- `side-panel.tsx` — a static (non-sticky, non-filtering) column of Methodology / Coverage / Contact — reference material, deliberately not a second filter surface, so the log's own toolbar stays the single place filtering happens.

This differs from all three prior `auto-profile-r1` candidates by construction: no public-storefront tablist (r1/a), no sticky *left sidebar* driving a heatmap-plus-grid (r1/b), no hero-stats-plus-feed-plus-billing-toggle (r1/c). The sticky element here is a horizontal top bar carrying only identity + stats, not a sidebar carrying identity + stats + bio + tags; the main content is a filterable timeline, not a grid or feed.

**Interactions implemented (4, all information-bearing)**, in `case-log.tsx`:
1. **Severity filter** — four toggle chips (Critical/High/Medium/Low, `aria-pressed`, OR logic) filter the log to engagements whose *highest* logged severity matches any selected chip. Derived from each case's real `findings` counts via a pure `topSeverity()` function, not a hand-duplicated field.
2. **Protocol-type filter** — a native `<select>` (labelled "Protocol type") narrows the log to one of five scope types (Smart Contract / Bridge / L2 Rollup / Wallet Infrastructure / Oracle Feed) or all.
3. **Sort control** — a native `<select>` (labelled "Sort") reorders the visible log by Newest first / Oldest first / Most severe first, keyed off a hand-assigned `sortKey` (no `Date` object).
4. **Per-case expand/collapse** — each entry is an `aria-expanded`/`aria-controls` button; opening it reveals a real per-case findings-breakdown `<table>` (severity × count, with a Total row) and the full engagement summary — not a decorative animation, genuinely different content than the collapsed row shows.

A live `aria-live="polite"` "Showing X of 10 engagements" count and a "Reset filters" affordance (shown only when a filter is active, and again inside the empty state) confirm the filters are real and give a way back out.

**Palette / AA contrast (light theme, `emerald` accent — assigned axis)**: fixed light theme, **no `dark:` classes anywhere** in the route (same "commit to one scheme" approach as prior dark-committed routes in this catalog — nothing for `no-dark-dim-text`'s `dark:text-*-500/600` regex to match, and it sidesteps the Lighthouse-scheme-mismatch failure mode noted in `page-brief-core.md` §3/Q11). Every combo below is real WCAG relative-luminance math (sRGB), not an assumed-safe Tailwind default:

| Foreground | Background | Contrast | Use |
|---|---|---|---|
| `zinc-600` `#52525b` | `white` | 7.74:1 | secondary text on near-white |
| `zinc-600` `#52525b` | `zinc-100` `#f4f4f5` | 7.04:1 | secondary text on muted surfaces (chip tracks) |
| `zinc-700`/`zinc-800`/`zinc-900` | `white`/`zinc-50` | >9:1 | body copy, headings |
| `emerald-700` `#047857` | `white` | 5.49:1 | practice-name accent text, rating icon |
| `white` | `emerald-700` `#047857` | 5.49:1 | primary button fill |
| `emerald-800` `#065f46` | `emerald-100` `#d1fae5` | 6.78:1 | active severity chip, "Resolved" badge |
| `rose-800` `#9f1239` | `rose-100` `#ffe4e6` | 6.68:1 | Critical severity badge |
| `orange-800` `#9a3412` | `orange-100` `#ffedd5` | 6.37:1 | High severity badge |
| `amber-800` `#92400e` | `amber-100` `#fef3c7` | 6.37:1 | Medium severity badge, "Monitoring" badge |
| `zinc-800` `#27272a` | `zinc-100` `#f4f4f5` | >9:1 | Low severity / "Disclosed" badge |

Two combos were checked and deliberately **avoided**: `emerald-600` text/fill on white measures **3.77:1** (fails normal-text AA, only clears the 3:1 large-text floor) — used nowhere as text, and buttons use `emerald-700` instead. `amber-700` on `amber-100` measures **4.51:1** — technically over the 4.5 gate but with near-zero margin, so severity badges use `amber-800`/`amber-100` (6.37:1) instead for real headroom. `zinc-500` is not used anywhere in the route (its 4.83:1-on-white margin is thin per the brief's own Q10 finding); `zinc-600` is used as the uniform muted-text floor everywhere, on both near-white and muted (zinc-100) surfaces, since it clears both floors with margin.

Color is never the sole signal: every severity/outcome badge pairs its color with a lucide icon (`ShieldAlert`/`CircleAlert`/`Info`/`CheckCircle2`/`Clock`/`ScrollText`) and a text label.

**Font**: `--font-sans` (Pretendard) for all body copy; `--font-display-grotesk` (Space Grotesk Display, allow-listed) applied only to the `h1` name and the four sticky-bar stat numerals (`rating`/`audits`/`fixes`/`since`) — the "hero numerals" — via inline `style`, nothing else, per the assigned axis. Exactly 3 weight classes route-wide, verified:
```
grep -rohE "font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)" *.tsx | sort | uniq -c
     19 font-medium
     25 font-normal
     12 font-semibold
```
No `font-bold`, no other weight, anywhere.

**No raster images**: the identity mark (`monogram-mark.tsx`) is a fixed-coordinate, deterministic inline SVG (abstract keel/waterline glyph in emerald tones) — no `next/image`, no remote host, so there is nothing for `no-raw-img`/`no-next-image-unopt`/`no-random-image-host` to catch by construction, and no broken-image/alt-text-overflow risk at any viewport.

**Data determinism**: `data.ts` is 100% literal — `PROFILE`, `STATS`, `TRACK_RECORD`, and 10 `CASES` entries, each with a hand-assigned `sortKey` (`YYYYMM` integer) standing in for a real date so "Newest/Oldest first" sorting never touches `new Date()`. `topSeverity()` and `totalFindings()` are pure functions over the literal `findings` counts — no randomness, no derived-then-hardcoded mismatch. `TRACK_RECORD` engagement counts sum to exactly `STATS.engagementsCompleted` (128); the header's "Fixes" stat (`vulnerabilitiesResolved`, 341, all-severity lifetime) is intentionally a different metric from the table's "critical findings" column, not a forced-consistent subtotal.

**Files**: `app/src/app/profile-evolve/r2/a/page.tsx`, `identity-bar.tsx`, `intro-section.tsx`, `track-record-table.tsx`, `case-log.tsx`, `case-entry.tsx`, `side-panel.tsx`, `badges.tsx`, `monogram-mark.tsx`, `data.ts`.

**Confirmed**: `cd app && npx tsc --noEmit` — clean, zero errors. `npx eslint src/app/profile-evolve/r2/a` — clean, zero warnings/errors. `npx next build` — succeeds, route prerendered as static (`○ /profile-evolve/r2/a`). Hand-verified every static gate rule against the route folder with zero violations: no `Math.random(`/`Date.now(`/`new Date(` (the only match is an explanatory code comment, not a call); no raw `<img>`; no `unoptimized`; no emoji (scanned every file's codepoints programmatically against the emoji ranges — none found); no `next/font` import; no `font-serif`; no font outside the allow-list (`--font-sans` body, `--font-display-grotesk` on `h1`/hero numerals only); no `dark:text-*` of any kind (route has zero `dark:` classes); no `picsum`/`loremflickr`/`source.unsplash` or any random-content image host (route has zero images). Single `h1` confirmed (identity bar only); heading order `h1 → h2 (About) → h2 (Track record) → h2 (Engagement log) → h3×10 (case titles) → h4 (Findings breakdown, inside each expanded case) → h2 (Methodology) → h2 (Coverage) → h2 (Get in touch)` — no skips. Both `<dl>` uses (sticky-bar stats, intro-section location/tenure) keep `dt`/`dd` as direct children of the `dl > div` group with icons placed inside `dt` only, never wrapping the pair. Every `outline-none` occurrence (3, one shared `FOCUS` constant reused across files) is paired with `focus-visible:ring-2` — never bare. Grid items inside the two-column layout (`CaseLog` section, `SidePanel` aside) and inside the sticky-bar `dl` all carry `min-w-0`; no `min-w-[…]` forcing anywhere in the route.
