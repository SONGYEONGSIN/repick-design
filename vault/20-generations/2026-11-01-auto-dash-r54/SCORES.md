# auto-dash-r54 — SCORES

Freeze hash (post-1-fix, pre-judging, unchanged through screenshot capture and judging): `46affceb56d2965e788e5d6437c4dffc10d8f181`

## Hard gate

| Candidate | static | lint | types | weights | sweep | focus | console | a11y | perf |
|---|---|---|---|---|---|---|---|---|---|
| a — Firebreak | 0 | 0 | 0 | 3종 | 1차 실패 → 1-fix → 0 | 0 | 0 | 100 | 62 |
| b — Gantry | 0 | 0 | 0 | 3종 | 0 | 0 | 0 | 1차 95(`label-content-name-mismatch`) → 1-fix → 100 | 73 |
| c — Strata | 0 | 0 | 0 | 3종 | 0 | 0 | 0 | 100 | 70 |

**a — 1-fix detail**: `sweep` `table-overflow` (`div#0`, 1280px +116px → 1440px +20px — the desktop incidents-table pane, in a 3/5-width `xl:col-span-3` grid column, was narrower than the `min-w-[640px]` floor forced on the table and its scroll wrapper). Removed `min-w-[640px]` from both the inner `overflow-y-auto` div and the `<table>` itself (`IncidentsTable.tsx`), letting the `table-fixed` + `<colgroup>%` columns shrink fluidly with their existing `overflow-hidden`/`truncate` cell safety nets, per dash-brief-v3's own grid-craft rule ("min-w 강제 대신 table-fixed+% 열 배분으로 유동화"). Re-gate: 0. This also incidentally re-verified the round's two carried-over reassignment bugs (focus-steal on mount, 390px overflow) — both held clean with zero further changes.

**b — 1-fix detail**: `a11y` `label-content-name-mismatch` on the account-menu trigger button (`header.flex > div.ml-auto > div.relative > button.grid`, visible content "JA" vs. authored `aria-label="Account menu"` not containing it — Lighthouse axe scan, node detail captured via direct `lighthouse --output=json` run). Removed the competing `aria-label` from the button; its accessible name now derives from content (the `Avatar` span's own `role="img" aria-label={full name}`), plus an appended `sr-only` " account menu" span — no aria-label/content conflict remains on any single element. Re-gate: a11y 100, 0 violations.

**c**: clean on first gate run, no 1-fix used.

## Judge panel (3 lenses, blind, general-purpose Agent dispatches — no custom designer/comparator agent type configured in this environment, per `auto-dash-r53` precedent)

| Lens | 1st | 2nd | 3rd |
|---|---|---|---|
| lens1 — brief/DNA compliance | **c** | a | b |
| lens2 — commercial polish | **c** | b | a |
| lens3 — structural differentiation | **b** | c | a |

**Clean 2:1 majority for c.** No tie, no tie-break invoked, no no-winner votes.

### Lens1 (brief compliance) — full reasoning
Zero hard-rule violations found in any candidate (no fake-light, no skeuomorphic decoration, no font/weight violations, no determinism/image/emoji/language violations, correct focus-visible pattern on all three, clean heading hierarchy on all three). Ranked on how fully each demonstrates the brief's most-named judgment axes: c wins on literal, always-visible-at-every-tier label+value completeness for its dominant treemap (`c/Treemap.tsx:140-143`) plus a dedicated mobile fallback that preserves that completeness rather than shrinking illegibly; a 2nd on the strongest demonstration of the selection-fan-out-independence axis (three non-resetting state axes, each commented in-code); b 3rd, fully compliant but the thinnest test of exactly these two axes (its own chart explicitly self-documented as "secondary," its selection story the simplest of the three).

### Lens2 (commercial polish) — full reasoning
All three clear the bar for a shippable surface; close between b and c. c 1st: independently-recomputed arithmetic matched to the decimal on two separately-displayed headline percentages (+6.1% QoQ, +5.0% variance), richest-feeling interaction set (grouping/quarter toggle, select, sort, independently-scoped pin, palette), deliberate mobile treemap→bar-list redesign. b 2nd, very close: possibly the richest raw interaction count of the three (real move-to-stage, watch toggle, checklist-completion toggle, multi-select filter, search, palette), exceptional token-discipline self-documentation, deliberate mobile board→stacked-list redesign — placed 2nd only because c's centerpiece more literally satisfies the "readable without hover" test. a 3rd: real concrete craft defects found and screenshot-verified — table column headers truncate to "SERV…"/"SE…" at 1440px, and incident IDs are hard-clipped (not ellipsis-truncated) so that four distinct IDs (2333/2329/2325/2321) visually collapse to "INC-233"/"INC-232"×3/duplicates, reading as a rendering bug.

### Lens3 (differentiation) — full reasoning
Did a real catalog sweep (grep + spot-reads across `app/src/app/dash/` gallery and `dash-evolve/r44`–`r53`). b 1st: the one candidate whose dominant content region is a board, not a chart — structurally departs from every chart-centric bucket saturating the recent catalog (watchlist-rail 3-pane confirmed ≥4-8 occurrences); its "funnel chart" is deliberately a plain supporting bar-strip, not a repeat of the catalog's actual funnel-chart precedent (`dash/d36/FunnelCanvas.tsx`); its selection state is genuinely decoupled across 3 independent axes, contrasted directly against a documented single-`selectedId`-threaded anti-pattern found in `dash-evolve/r47/a`. c 2nd: a real, if modest, shape delta from `dash-evolve/r44/a` (drops that round's rail+grid-of-side-cards for a stacked rail-free treemap+detail column) but the underlying concept (treemap for department budget/cost allocation, nearly identical utility-function names) is a close rerun of that same r44/a. **a 3rd, severely**: `diff -rq` against `dash-evolve/r53/c` shows an **identical file manifest** and only cosmetic edits in the one file fully diffed (`FirebreakClient.tsx`) — same brand name, same workspace label, same macro shape — this is round r53's eliminated candidate c, lightly polished and re-presented, not a fresh entrant; independently, its macro shape (sidebar+KPI-row+chart+table) and dominant-viz type (plain bar list) are both already the catalog's single most generic bucket regardless of the carryover issue.

**On a's carryover**: this is expected and intentional, not an error — candidate a was this round's `reassign-queue.md` #19 item (`auto-dash-r53/c` "Firebreak," twice eliminated at hard gate for two specific bugs; the recreation was instructed to be faithful to the original concept while fixing those two bugs). Lens3 was not told this and correctly identified the near-identity on its own, which is exactly the blind-panel behavior the process wants — it simply means a's reassignment succeeded on the mechanical axis (both bugs fixed, clean hard-gate pass) but, being a near-verbatim recreation rather than a fresh build, could never score well on *this specific lens*. See `reassign-queue.md` disposition below.

## No post-judgment §3-1 fix
Zero rule violations cited against winner c by any lens — nothing to fix. Freeze hash for c unchanged from the pre-judging gate run through this point.
