# auto-dash-r27 — SCORES

Target: dash. Freeze hash (all 3 candidates, pre-1-fix): `4dc9cbf17d63ffe84b80d20a71dff224d6f152ee`
(`cat app/src/app/dash-evolve/r27/*/*.tsx app/src/app/dash-evolve/r27/*/*.ts | shasum`)

## Round budget

`node scripts/round-budget.mjs 2` → **1** (`--explain`: "미채움 0종 — N≥2 의 근거(커버리지)가 없다"). Requested N=2 downgraded to N=1 per skill §0-0-1 — only one round runs today.

## Target selection

PAGE_TYPES unfilled query → `[]` (0 unfilled). UTC day = 0 (Sunday), so the native-Monday-forced-target rule does not apply. Fell back to the dash/landing/native equal-random branch → **dash**.

## Hard gate — first pass (all 3 candidates)

| Candidate | route | static | lint | types | weights | sweep | focus | console | a11y | perf | pass |
|---|---|---|---|---|---|---|---|---|---|---|---|
| a (Waymark) | `/dash-evolve/r27/a` | 0 | 0 | 0 | 3종 | 0 | 0 | **13건 (hydration)** | unavailable | unavailable | **FAIL** |
| b (Fathom) | `/dash-evolve/r27/b` | **1건 (no-unlisted-font)** | **1건 (set-state-in-effect)** | 0 | 3종 | 0 | 0 | 0 | unavailable | unavailable | **FAIL** |
| c (Vantage) | `/dash-evolve/r27/c` | 0 | **1건 (set-state-in-effect)** | 0 | 3종 | **7건 (table-overflow)** | 0 | 0 | unavailable | unavailable | **FAIL** |

## 1-fix loop (one attempt each)

- **a**: root-caused to `Intl.NumberFormat({notation:"compact"})` in `formatKrValue()` (`data.ts`) — ICU/CLDR rounding differs between Node's SSR ICU and Chromium's, rendering `"$358.0K"` server-side vs `"$358K"` client-side for the same value. Replaced with a hand-rolled, engine-independent compact formatter reusing existing deterministic helpers. **Re-gate: PASS.**
- **b**: (1) static false-positive fixed attempt — extracted `{ fontFamily: string }` into a named `DisplayFontStyle` type alias. (2) lint fixed — replaced `setState`-in-effect with the "adjust state during render" pattern (`prevFocusToken` comparison). **Re-gate: static re-failed** (same regex still matches `type DisplayFontStyle = { fontFamily: string }` — the false-positive trigger moved, not removed; lint now passes). **Per skill's hard 1-fix rule (재실패 시 탈락), candidate b is DROPPED.** See `questions-queue.md` Q19 (third reproduction logged, new trigger: TS type annotation, not constant extraction).
- **c**: (1) lint fixed — moved `setActiveIndex(0)` reset into the search input's `onChange` handler, deleted the effect. (2) table-overflow fix attempt — added `lg:min-w-0` to the fallback score table (previously `min-w-[820px]` unconditionally, forcing overflow at 1280–1536px, per the documented "min-w on `<table>`, mobile-only" rule). **Re-gate: lint now passes, but a NEW `cell-overlap` defect appeared** ("Anchorline Supply" ↔ "At risk", 5–20px overlap at 1280–1536px) plus residual 1–8px `table-overflow` at the same widths — the `table-fixed` + `<colgroup>` percentage-width conversion made columns narrower than their actual content, a reproduction of the already-promoted L2 delta ("표준 처방이 새 결함을 만든다", dash-brief-v3.md §그리드 크래프트 룰 v2). **Candidate c is DROPPED** (재실패 시 탈락).

## Judge panel — solo review (only 1 survivor: a)

Per skill §4 ("1개면 단독 심사로 승자/no-winner만 판정"), 3 lenses independently reviewed candidate a alone (no ranking, no comparison — verdict is WINNER or NO-WINNER per lens).

| Lens | Verdict | Key basis |
|---|---|---|
| 1 (brief 준수) | **WINNER** | App shell, component system, font discipline, 4+ real interactions, selection fan-out discipline (explicit non-uniform threading, verified in source), 1920px cap — all confirmed present and correctly implemented. |
| 2 (상용 완성도) | **WINNER** | Real bullet-chart craft (bands + independent target tick + value bar, confirmed in `BulletGrid.tsx:90`), alignment/density/micro-copy read as production-grade, at-a-glance completeness satisfied. |
| 3 (아키타입 차별성) | **NO-WINNER** | Bullet-grid widget is genuinely novel, but the surrounding page shell (4-tile KPI row + `grid-cols-12` col-span-8/4 split) reproduces the already-shipped "KPI-row + 8/4 chart shell" archetype verbatim — widget novelty without layout novelty. |

**Aggregate: 2 WINNER / 1 NO-WINNER.** Per skill's no-winner rule ("no-winner 표 2개 이상이면 라운드 no-winner"), 1 no-winner vote does not trigger round no-winner → **round winner: a (Waymark)**.
