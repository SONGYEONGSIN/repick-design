# auto-dash-r34 — hard gate

Target: dash. Candidates: a = "Portway" (5-stage funnel console, reassign-queue #7 rebuild), b = "Vantage" (radar/spider vendor scorecard), c = "Verbatim" (word-cloud + sentiment console).

Frozen source hash (SHA-1 over all `.tsx`/`.ts` in `app/src/app/dash-evolve/r34/*/`): `3fc3fe73c9a2673a992737a987d603ae5c01a2a2`

## 1차 시도 (pre-fix)

| gate | a | b | c |
|---|---|---|---|
| route/types/static/weights/focus/console/a11y/perf | pass | pass | pass |
| lint | **fail** — 5× `react-hooks/static-components` (cohort-table.tsx `HeaderButton` defined during render) + 2× `react-hooks/set-state-in-effect` (command-palette.tsx, funnel-console.tsx) | **fail** — 2× `react-hooks/set-state-in-effect` (command-palette.tsx) | **fail** — 2× `react-hooks/set-state-in-effect` (command-palette.tsx) |
| sweep | pass | **fail** — cell-overlap ×6 at 390px (fallback-table.tsx vendor-name header row, `items-end` flex column with no width ceiling) | **fail** — page-overflow 101px at 390px (word-cloud tile tooltip, `position:absolute` + `whitespace-nowrap`, always mounted even at opacity 0, uncontained) |

## 1-fix (각 후보 1회)

- **a**: `HeaderButton`/`SortIcon` moved to module scope with explicit props; `command-palette.tsx` and `funnel-console.tsx` set-state-in-effect calls moved into the causing event handlers (funnel-console used React's render-time "adjust state when a prop changes" pattern since `pinnedId` is also set from a sibling command-palette action, not just this file's own handler).
- **b**: `command-palette.tsx` fixed the same way (render-time prevOpen-tracking pattern, since `open` is an external prop). `fallback-table.tsx`: added `max-w-full min-w-0` to the vendor badge+name flex row so it's bounded by its own column width at 390px instead of growing past it.
- **c**: `command-palette.tsx` fixed the same way. Root cause of the overflow was an always-mounted (opacity-0 when inactive, not `display:none`) absolutely-positioned tooltip with a long sentence at `whitespace-nowrap` — added `overflow-hidden` to the word-cloud's wrapping Card so it can't inflate `document.scrollWidth`.

## 2차 (재게이트, 전원 통과)

| gate | a | b | c |
|---|---|---|---|
| route | pass (3/3 OK) | | |
| types | pass (에러 0) | | |
| static | pass (위반 0) | | |
| lint | **pass (위반 0)** | **pass** | **pass** |
| weights | 4종 (400/500/600/700) — 기록만, 집계치(3라우트 합) | | |
| sweep | **pass (오버플로 0)** | **pass** | **pass** |
| focus | pass (포커스 표시 0건 누락) | | |
| console | pass (메시지 179건 · 결함 0) | | |
| a11y | unavailable (pass) | | |
| perf | unavailable (pass) | | |

Full `verdict.pass: true`, `violations: []` on the second run. No candidate dropped — all 3 proceed to judging.

Screenshots: `shots/` — 4 widths (1280/1440/1920/390) × 4 scroll fractions (0/0.35/0.7/1) for b and c; a has no additional scroll frames because its page fits one viewport (no scrollable content below the fold) — capture-shots only emits distinct scroll-position files when the page is actually taller than the viewport. 0 blank frames across all 36 captures.
