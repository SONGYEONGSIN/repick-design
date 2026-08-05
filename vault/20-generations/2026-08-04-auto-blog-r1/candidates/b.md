---
tags: [generation, blog, r1, candidate-b]
---

# blog-evolve r1 · candidate b — Stackrail Engineering Blog

Route: `/blog-evolve/r1/b` · files in `app/src/app/blog-evolve/r1/b/`
(`page.tsx`, `blog-client.tsx`, `site-chrome.tsx`, `author-mark.tsx`, `data.ts`)

## Product / brand

**Stackrail** — invented workflow-orchestration / pipeline-automation SaaS for engineering teams
(the Airflow/Temporal/GitHub-Actions territory of this fictional universe, distinct from the
already-used `Fathomline` (analytics), `Anvil`/`Circuitloom` (resale), `Rivet` (404)). The route is
Stackrail's public engineering blog: "Notes from the team building Stackrail" — architecture
decisions, incident postmortems, performance work, developer-experience tooling, open-source notes
and release logs. 7 recurring bylines (Staff Engineer, SRE, Eng Manager, Senior SWE, Developer
Advocate, Performance Engineer, Co-founder/CTO) across 6 categories, 22 articles total.

## Macro structure — sticky category rail + dense text-forward list (not a card grid)

1. **Site header** (`site-chrome.tsx`, outside `<main>`, sticky) — wordmark, primary nav (`Blog`
   marked `aria-current="page"`), CTA. Static server component, no client JS needed.
2. **Intro block** (inside `<main>`) — kicker + single `h1` + subhead + a stat line
   (`22 articles · 7 authors · 6 categories`, `tabular-nums`) framing the page, not a post.
3. **Two-column body**: `lg:grid lg:grid-cols-[260px_1fr]`, collapsing to a single stacked column
   below `lg` (rail's category buttons become a wrapped chip row instead of a vertical list).
   - **Left rail** (`lg:sticky lg:top-24`) — category filter (`role="group"`, "All posts" +
     6 categories, each with a live `tabular-nums` count) directly above a **subscribe module**
     (email input + button + `aria-live` success/error region). The rail is structurally
     subordinate to the list, per the brief's "maybe a subscribe module" note.
   - **Right column** — search input + sort `<select>` (Newest / Most read) above an `aria-live`
     "Showing N of 22 articles" status line, then a dense `<ul>` of 22 `<li><article>` rows: small
     generated avatar, colored category dot + label, mono-set title, one-line dek, author name +
     role, date, read time, read count, and a "Read more" disclosure toggle for the longer excerpt.
     No image cards, no clamped-photo grid — this is a changelog/reading-list scan, not a magazine
     browse, by deliberate structural contrast with the card-grid candidates in this round.
4. **Site footer** (`site-chrome.tsx`, sibling of `<main>`, keeps its `contentinfo` role) — brand
   mark, footer nav, copyright line (spelled "Copyright 2026…", not the `©` glyph — see a11y notes).

All 22 articles render at rest with the default "All posts" + empty-search + "Newest first" state —
nothing on the page requires an interaction to see real content.

## Interactions (4, all information-bearing)

1. **Category rail filter** — `role="group"` of buttons (`aria-pressed` per button, "All posts" +
   6 categories with `tabular-nums` counts) narrows the list to one category; the section's `h2`
   retitles to the active category name and the "Showing X of 22" status updates live.
2. **Live search** — `<input type="search">` with an associated `<label>` (visually `sr-only`)
   filters by title, dek, author name and category label substring, combined (AND) with the active
   category filter; empty-state offers a "Clear filters" recovery action.
3. **Sort control** — native `<select aria-label="Sort articles">` (Newest first / Most read)
   re-orders the filtered set by ISO date string or by `reads`; a "sorted by reads" indicator
   appears next to the count when active so the reordering is legible, not just felt.
4. **Expand/collapse excerpt** — each row's "Read more" button (`aria-expanded` + `aria-controls`)
   reveals a longer excerpt paragraph beneath the one-line dek. The `<p id="excerpt-…">` stays
   mounted at all times with `hidden` toggled rather than being conditionally unmounted, so
   `aria-controls` always resolves to a real element — the same lesson documented for the
   ProfileClient tab panels in this codebase.
5. *(bonus, not counted toward the minimum)* **Newsletter subscribe** — client-side email-format
   validation on submit, swapping in a `role="status"` success or `role="alert"` error message tied
   to the input via `aria-describedby`, no page reload.

Search, category and sort all run through one `useMemo`-derived array, so the live count text is
always exact regardless of which controls are combined.

## Visual direction

Light, ink-on-white technical theme — neutral `zinc`, not warm `stone`/paper — with **teal** as the
single accent hue (not violet/indigo) and a **monospace display face** for headlines, category
eyebrow and the brand wordmark, giving the page a changelog/git-log register that fits a workflow
SaaS. This differs from the immediately-prior round's dark+amber+mono trio on two of three axes
(light vs. dark, teal vs. amber) while still reusing mono alone, which the brief explicitly allows.

- Surfaces: `bg-white` page/list, `bg-zinc-50` subscribe card, `border-zinc-200`/`-300` hairlines.
- Text: `zinc-900` primary, `zinc-600` secondary/meta everywhere (standardized on the muted-surface
  floor rather than mixing `zinc-500`/`zinc-600` by surface, to remove any surface-tracking risk).
- Accent: `teal-700` for links, active pill fill, primary buttons, focus rings; `teal-500` reserved
  for small decorative category dots only (paired with a visible text label, never color-only).
- Category tag hues (6, one per category, all paired with a visible text label + dot, not color
  alone): `teal-700` architecture, `rose-700` reliability, `amber-700` performance, `sky-700` DX,
  `emerald-700` open source, `orange-700` release notes.
- Display font: `var(--font-display-mono)` (JetBrains Mono Display) on `h1`, every article title,
  and the wordmark. Body/deks/meta stay on `--font-sans`.
- Exactly 3 font-weight classes on the route: `font-normal` (body/deks/excerpts), `font-medium`
  (nav, meta, pills, subscribe button), `font-semibold` (h1, article titles, subscribe heading) —
  confirmed via `grep -o` over the rendered HTML: only those three classes appear, `font-bold`/
  `font-light`/etc. count 0.

### Contrast (computed via WCAG relative-luminance, `node` script, not eyeballed)

| pair | ratio | floor | pass |
|---|---|---|---|
| `zinc-900` / white | 17.72:1 | near-white → 4.5:1 | yes |
| `zinc-600` / white | 7.73:1 | 4.5:1 | yes |
| `zinc-600` / `zinc-100` | 7.03:1 | muted surface → 4.5:1 | yes |
| `zinc-500` / `zinc-100` | 4.40:1 | muted surface → fails | **not used anywhere** — standardized on `zinc-600` for all secondary text instead |
| `teal-700` / white | 5.47:1 | 4.5:1 | yes (category tag text, links, "Read more") |
| white / `teal-700` | 5.47:1 | 4.5:1 | yes (primary buttons, active category pill) |
| `teal-600` / white | 3.74:1 | 3:1 (non-text/large only) | used only for decorative dots and the brand-mark icon fill, never for small text |
| `rose-700` / white | 6.29:1 | 4.5:1 | yes |
| `amber-700` / white | 5.02:1 | 4.5:1 | yes |
| `sky-700` / white | 5.93:1 | 4.5:1 | yes |
| `emerald-700` / white | 5.48:1 | 4.5:1 | yes |
| `orange-700` / white | 5.18:1 | 4.5:1 | yes |

No `dark:` variants are shipped anywhere (single committed light theme, explicit utility classes
rather than following `prefers-color-scheme`), so `no-dark-dim-text` is trivially satisfied.

## Images

No `<img>`/`next/image` anywhere in the route — every avatar is a deterministic inline SVG monogram
(`author-mark.tsx`, FNV-1a hash of the author id → two-stop `hsl()` gradient, no `Math.random`/
`Date`), matching this codebase's existing `visual-hash.ts`/`SellerMark` pattern. This was a
deliberate choice, not a shortcut: the brief frames photo thumbnails as optional ("may still use"),
and the assignment's own differentiation goal is a page whose "dominant reading mode is scanning
dense text, not browsing photo cards" — so this candidate carries zero photography at all rather
than a token thumbnail, leaning fully into the changelog-list register instead of hedging toward
the card-grid candidates' territory.

## Accessibility / structural checks done before handoff

- Single `<h1>` (intro), `<h2>` (rail "Categories", subscribe heading, dynamic list heading) —
  confirmed via server HTML: exactly one `<h1>`, exactly one `<main>`, exactly one `<footer>`.
- `<footer>` is a DOM sibling **after** `</main>` closes, never nested inside it (`page.tsx` renders
  `<SiteHeader/><BlogClient/><SiteFooter/>` as flat siblings; `BlogClient`'s own root is `<main>`).
- Every interactive element carries `focus-visible:outline-2 focus-visible:outline-offset-2
  focus-visible:outline-teal-600` (never `outline-none` alone) — audited via `grep`, 0 stray
  `outline-none`.
- Search input has a real `<label htmlFor>` (`sr-only`); sort `<select>` and category buttons all
  have explicit `aria-label`/visible text accessible names; subscribe email input has a `sr-only`
  label plus `aria-describedby` pointing at its live status region.
- No nested `dl > div > (Icon, dt/dd)` pattern anywhere — this route uses no `<dl>` at all, sidestepping
  that documented recurrence entirely (category tag = flat `span` + dot, not a description list).
- `tabular-nums` on every count: category counts, article read-minutes, read counts, the "Showing X
  of Y" status numbers, and the intro stat line.
- Grid items (`aside`, `section`) carry `min-w-0`; category labels `truncate` inside the fixed
  `260px` rail column so no interior element can force horizontal growth.
- The `©` glyph was avoided in the footer copyright line (spelled "Copyright 2026…") after
  `dash-static-check.mjs` flagged it under `no-emoji` — `U+00A9` is classified
  `Extended_Pictographic` in Unicode's emoji data despite not reading as an emoji visually; caught
  and fixed before handoff, worth flagging for future candidates in this catalogue.

## Gate results (this environment)

Ran `node scripts/gate.mjs --target web --routes /blog-evolve/r1/b` locally (with
`PW_CHROMIUM_PATH`/`CHROME_PATH` pointed at this sandbox's cached Chromium at
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, since neither was resolvable by Playwright's
default revision lookup — `npx playwright install` itself is blocked by the sandbox's outbound
proxy allowlist):

```
static:  pass (위반 0)
weights: pass (3종)
sweep:   pass (전 폭 오버플로 0)  — 1280/1366/1440/1536/1680/1920 (+16px-slack variants) and 390
a11y:    pass (100)              — worst of desktop+mobile Lighthouse presets (both scored 100)
perf:    55 (record-only, dev-server overhead; not a gate criterion)
```

Also confirmed independently: `tsc --noEmit` clean; `cd app && npx next build` succeeds and
prerenders `/blog-evolve/r1/b` as a static route; no console/page errors; production build listed
the route alongside its `a`/`c` siblings with no warnings specific to this folder.
