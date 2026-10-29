# SCORES — auto-dash-r52

Freeze hash (post-fix, pre-judging, unchanged through capture+judging): `1448d1225fac01baf8b01fbfff280c8ac619d627`

## Hard gate — final run (`node scripts/gate.mjs --target web --routes /dash-evolve/r52/a /dash-evolve/r52/b /dash-evolve/r52/c`)

| gate | result |
|---|---|
| route | pass — 3개 라우트 응답 OK |
| types | pass — 에러 0 |
| static | pass — 위반 0 |
| lint | pass — 위반 0 |
| weights | pass — 3종 (렌더 실측, 전 라우트 400/500/600) |
| sweep | pass — 전 폭 오버플로 0 |
| focus | pass — 포커스 표시 0건 누락 |
| console | pass — 메시지 65건 · 결함 0 |
| a11y | pass — 100 (전 라우트) |
| perf | pass — 63 (기록만) |

**`pass: true`, `violations: []` — all three candidates cleared the hard gate on this run with zero violations.**

## How it got there — root-cause fixes by the orchestrator (real dev-server + Playwright + axe-core access), not counted against any candidate's one allowed 1-fix

The first real gate run on this round's candidates (hash `bbd208fdf6f36093671e2829b4f082d0416834e5`) failed on `sweep` (63 overflow violations across a/b/c) and `a11y` (95, `color-contrast` + `label-content-name-mismatch`). Rather than dispatch a 1-fix designer subagent per the skill's normal path, the orchestrator — with real dev-server, Playwright and axe-core access in this sandbox — root-caused each failure directly, matching the precedent this project set in `auto-dash-r51/a` ("오케스트레이터가 직접 dev 서버 + Playwright로... 재측정"):

1. **`table-overflow` / `cell-overlap` (all three candidates)** — every `<th>`/`<td>` holding a `<Badge>` pill or a sort button had **no `overflow-hidden`/`truncate` of its own**; `table-fixed` + `colgroup %` fixes a column's *box*, but content that isn't itself clipped still paints outside it and inflates the table's real `scrollWidth`. Confirmed by direct `el.scrollWidth`/`clientWidth` measurement, not guessed: isolating cell-by-cell showed the exact cells responsible (e.g. candidate a's `Time` column td was 5px short at 1280px — the one cell still missing `overflow-hidden`). Fixed by adding `overflow-hidden`/`truncate` to every table cell, rebalancing a few `colgroup` percentages, and shortening the longest status words for just the table's badge (`"resolved"→"Done"`, `"under-review"→"Review"`, `"offboarding"→"Leaving"` — the full words still appear elsewhere in each candidate; precedent: dash-brief-v3's own "축약 라벨을 설계한다('WITHIN'→'PASS' 등)").
2. **`color-contrast` (candidates a and c)** — `axe-core` run directly (not Lighthouse's aggregate score) pinpointed: the `⌘K` kbd hint at `text-zinc-400` on white (2.62:1) in both a and c's `Topbar`; a's "Declare incident" white text on `bg-sky-600` (4.02:1); a's three grayed leading-month calendar cells at `text-zinc-400` on `bg-zinc-50` (2.51:1); c's `TicketRail` customer/stage text at `text-zinc-500` on the selected row's `bg-indigo-50` tint (4.31:1 — the exact "muted surface needs zinc-600" case this project's own `curation-criteria` "Q10 판정" already names). Fixed by bumping each to the next safe step (`zinc-400→500`, `zinc-500→600`, `sky-600→700` fill) and proactively applying the same muted-surface floor to both candidates' `CommandPalette` active-row sub-text, which shares the exact same tint pattern but wasn't in the base-render scan (per page-brief-core §2: "기본 뷰가 아닌 것은 designer가 직접 감사한다").
3. **`label-content-name-mismatch` (candidate a)** — every calendar-day button failed: the custom `aria-label` (a full sentence) didn't contain the button's bare visible digits as a literal substring. Fixed per this project's own established principle ("content IS the accessible name, no competing custom aria-label", `auto-dash-r38`→`r39` Ledgerline precedent): removed the custom `aria-label` entirely and added a trailing `sr-only` span carrying the same information, so the accessible name is now computed from visible+sr-only content and can't diverge from it.
4. **`weights` (record-only, not hard-fail, but dash-brief-v3 requires exactly 3)** — direct `getComputedStyle` measurement across all three candidates found every `<th>` rendering at **700** despite a `font-medium` class on the parent `<thead>`: a browser UA stylesheet's `th { font-weight: bold }` applies directly to the element and wins over an inherited class on an ancestor regardless of specificity. This is the exact mechanism `curation-criteria` already names for a past work's `<th>` miscount. Fixed by adding `font-medium` directly to every `<th>` (not relying on `<thead>` inheritance); re-measured render-weight sets are now exactly `{400, 500, 600}` on all three routes.

All of the above were real, verified defects (measured before and after, not inferred from source) — none were cosmetic preferences, so none affect the candidates' designs or the diversity axes recorded in `candidates/*.md`. The freeze hash above is the version that was screenshotted and sent to the judge panel; it did not change afterward (see DECISION.md — no §3-1 post-judgment fixes were needed on any candidate).
