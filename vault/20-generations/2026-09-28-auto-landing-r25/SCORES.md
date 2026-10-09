# auto-landing-r25 — SCORES

pre-fix source hash: `78353ed00f70faee66f4cc1f25b38ba32e5ee4fb`
post-1-fix source hash (frozen for judging): `e2ebea0446325dc2368d0d025f6761bcd59be419`

## Hard gate (`node scripts/gate.mjs --target web --routes /landing-evolve/r25/<v>`)

| candidate | route | types | static | lint | weights | sweep | focus | console | a11y | perf |
|---|---|---|---|---|---|---|---|---|---|---|
| a (Fair Price Matrix) | pass | pass | pass | pass | pass(3) | pass* | pass | pass | unavailable | unavailable |
| b (Authentication Confidence Ring) | pass | pass | pass | pass* | pass(3) | pass | pass | pass | unavailable | unavailable |
| c (Category Demand Ribbon) | pass | pass | pass | pass | pass(3) | pass | pass | pass | unavailable | unavailable |

`a11y`/`perf` report `unavailable` (no Lighthouse/Chrome devtools protocol available in this sandbox) — per page-brief-repo §5 this counts as pass, not a hard fail.

### 1-fix loop (both consumed, both re-gated clean)

- **a — sweep, page-overflow by 11px at 390px.** Root cause was subtle: the Fair Price Matrix section's scrollable `<table>` (`min-w-[560px]` inside an `overflow-x-auto` region) is correctly contained at the grid-track level (verified `min-w-0` on the region keeps its own box at exactly the 342px track width, no leak at that level) — but `document.documentElement.scrollWidth` still read 11px over `clientWidth` with the section present, and reverted to clean the moment the section was hidden, even after adding `overflow-x-clip` at the section boundary (which by itself did NOT stop the leak, confirmed empirically). This points to a browser layout-engine quirk in how scrollable-overflow is computed for a CSS Grid item that contains a nested `overflow-x:auto` scroll container, rather than a mispositioned/oversized element (every element's own `getBoundingClientRect()` in the subtree was confirmed within bounds). Fix applied: `[contain:layout]` on the section (CSS containment, which by spec establishes a hard containment boundary stronger than `overflow`) — verified live via `page.evaluate` before committing to file, then re-gated 8/8 (sweep specifically 0 overflow). Local horizontal scroll on the table itself is unaffected (containment only isolates the section's contribution to ancestor layout, not the table's own nested scroll container).
- **b — lint, 3× `@typescript-eslint/no-unused-vars` (`INK`, `MUTED`, `ACCENT_STRONG` declared, never referenced — colors used as literal Tailwind arbitrary values elsewhere per the file's own contrast-table comment).** Fix: removed the 3 unused declarations (kept `GHOST`/`ACCENT`/`TRACK`, confirmed still referenced). Re-gated 8/8.
- **c** — 8/8 clean on first attempt, no 1-fix needed.

### Environment note
`images.unsplash.com` returned 403 for all curated fixed-ID photo requests during dev-server rendering in this sandbox (outbound network restriction, not a candidate defect — confirmed consistent across all 3 candidates' dev-server logs). `next/image` renders its built-in broken-image fallback in that case; this did not by itself cause any of the sweep/gate failures above (isolated and fixed independently, see root-cause notes). Screenshots below will show broken-image placeholders for remote photos as a result of this sandbox's network policy, not a candidate authoring defect.
