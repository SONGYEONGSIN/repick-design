# auto-dash-r53 — SCORES

Target: dash · round N=1 (round-budget.mjs capped the requested N=2 to 1 — unfilled `PAGE_TYPES` queue is empty, see DECISION.md). Target drawn uniformly from [dash, landing, native] (unfilled queue empty) → **dash**.

Generic `general-purpose` Agent dispatches substituted for this repo's usual named `designer`/`comparator` agent types, which are not configured in this execution environment — the Agent tool itself (the actual object of the §0-0 check) is available, and independence between the three blind generation dispatches and the later blind judge dispatches was preserved. See DECISION.md "오케스트레이션 편차" for full disclosure.

Pre-assigned (to avoid collision between blind designers): macro layout, theme, accent, display-face per candidate.

| Candidate | Brand | Macro layout | Theme/accent/face |
|---|---|---|---|
| a | Outpost | Feed-centric (signal feed + inspector) | dark / blue-hex / `display-mono` |
| b | Thrum | Rail-free dense bento (8-card grid) | light / green / `display-wide` |
| c | Firebreak | Hero-number + inline-stats, no dominant viz | light / orange / Pretendard-only |

## Hard gate — candidate hash (post-fix, frozen before judging)

```
cat app/src/app/dash-evolve/r53/{a,b,c}/*.tsx app/src/app/dash-evolve/r53/{a,b,c}/*.ts | shasum
```
(run immediately before capture-shots.mjs in §4 — see DECISION.md for the recorded value)

## Gate verdicts

### Candidate a — Outpost
1st pass: `pass:false` — lint error×2 (`react-hooks/set-state-in-effect` CommandPalette.tsx:32, `@typescript-eslint/no-unused-vars` Inspector.tsx:61), a11y hard-fail `label-content-name-mismatch` (desktop search-trigger button: visible text didn't match a differently-worded `aria-label`).
1-fix: removed the mismatched `aria-label`, switched the responsively-hidden label span to `sr-only sm:not-sr-only` (content IS the accessible name at every width); wired the previously-unused `tier` into a `TierBadge` next to the case header; moved the CommandPalette reset off a `setState`-in-effect pattern onto a render-time `prevOpen` comparison.
**Re-gate: `pass:true`, 0 violations.** static 0 · lint 0 · sweep (full-width overflow) 0 · focus 0 missing · a11y 100 · perf 72.

### Candidate b — Thrum
1st pass: `pass:false` — lint error×2 (same `react-hooks/set-state-in-effect` pattern in CommandPalette.tsx, lines 43 & 52), sweep `table-overflow` (`table#0`, IncidentQueueCard, 1264–1440px, 15px→1px shrinking — colgroup Status-column underallocated), a11y hard-fail `button-name` (mobile: primary header action button's label fully `hidden sm:inline`, no accessible name at all at narrow widths).
1-fix: same render-time-state-adjustment refactor for CommandPalette; rebalanced `<colgroup>` (Status 12%→20%, Incident 32%→24%, using Incident's `line-clamp-2` slack); switched the header button's `hidden sm:inline` label to `sr-only sm:not-sr-only`.
**Re-gate: `pass:true`, 0 violations.** static 0 · lint 0 · sweep 0 · focus 0 missing · a11y 100 · perf 74.

### Candidate c — Firebreak
1st pass: `pass:false` — lint error×2 (same CommandPalette pattern), sweep `cell-overlap` (IncidentsTable, 1280–1680px, header "Severity"↔"Owner" + every data row "INC-XXXX"↔description — colgroup ID/Severity columns underallocated), sweep `page-overflow` (390px, +44px, no selector), focus `focus-invisible` (search-trigger button, 1440px, `outline-none` with no working `focus-visible:` replacement).
1-fix: lint fixed (same render-time pattern); colgroup rebalanced (ID 9%→15%, Severity 9%→13%, taking from Title/SLA slack) + `break-words`/`min-w-0` defense-in-depth — **cell-overlap fully resolved, 0 on re-gate.** `page-overflow` and `focus-invisible` fix attempts did not resolve the issues (identical values on re-gate, confirmed not a cache artifact via a from-scratch dev-server + `.next` cache rebuild).
**Re-gate: `pass:false`, 2 violations remain** (`page-overflow` 390px +44px unchanged; `focus-invisible` search button unchanged). **Root cause of the focus failure, diagnosed directly via Playwright (not from gate output alone):** CommandPalette's open↔close focus-restoration `useEffect` has no way to distinguish "just transitioned from open to closed" from "just mounted with `open=false`" — it unconditionally calls `triggerRef.current?.focus()` whenever `open` is falsy, including on initial mount, which steals keyboard focus to the search button the instant the page loads (confirmed: `document.activeElement === button` and `button.matches(':focus-visible') === true` immediately after `networkidle`, before any Tab was pressed). The gate's before/after focus-paint comparison therefore sees "already focused" in both snapshots → no visible change → `focus-invisible`. Per skill §3, this is the one allotted fix attempt — **candidate c is eliminated from judging.** Logged to `vault/00-principles/reassign-queue.md` #19 with both root causes (the diagnosed one and the unconfirmed `page-overflow` one) for reassignment.

## Survivors entering §4 JUDGE: **a (Outpost), b (Thrum)** — 2 candidates, normal 3-lens blind panel (majority vote, no tie-break needed with 2 survivors since each lens picks exactly one).
