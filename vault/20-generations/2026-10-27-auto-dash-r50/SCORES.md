# SCORES — auto-dash-r50

target: dash · freeze hash (post-generation, pre-fix): `b4079a8355421c6fd2cb270f49e5d60c58394cfe`

## Candidates

- **a** — Riskline (change-management / release-approval console) — `app/src/app/dash-evolve/r50/a/page.tsx`. Fixed-rail (440px) pending/approved queue + flex-1 approval-detail pane, bubble/scatter dominant viz. Light/blue/`--font-display-wide`.
- **b** — Inboxline (email-deliverability / sender-reputation console) — `app/src/app/dash-evolve/r50/b/page.tsx`. Hero + single dominant streamgraph (no competing stat strip). Dark/lime/none.
- **c** — Flagline (feature-flag / experimentation console) — `app/src/app/dash-evolve/r50/c/page.tsx`. Rail-free dense bento (precedented by production `/dash/d34`), slope chart dominant viz. Light/green/`--font-display-grotesk`.

## Hard gate, round 1 — `node scripts/gate.mjs --target web --routes /dash-evolve/r50/<v>`

| candidate | static/lint/types/console/route/weights/focus | sweep | a11y | perf |
|---|---|---|---|---|
| a | all clean | **FAIL** — table-overflow at 1264/1280/1350/1366px (6-22px, `table#0`) | **FAIL** — 94, `button-name` + `label-content-name-mismatch` | 63 |
| b | all clean | **FAIL** — table-overflow at 1264/1280/1350/1366px (30-98px, `div#0`) | 100 | 54 |
| c | all clean | **FAIL** — page-overflow at 390px (270px) | **FAIL** — 97, `color-contrast` | 64 |

## 1-fix pass (one attempt each, per §3)

- **a**: wrapped `ServiceTable.tsx`'s table in a `relative overflow-x-auto` card wrapper, added `min-w-[640px]` on the `<table>` itself; fixed `Topbar.tsx` button-name (`sr-only sm:not-sr-only` pattern) and the account-menu `aria-label`/visible-text mismatch.
- **b**: added `min-w-0` to `DataTable.tsx`'s outer `Card` and its desktop-table flex wrapper (the `auto-dash-r46` L2 documented fix pattern).
- **c**: added `min-w-0` to all 5 direct children of the `grid-cols-12` bento grid in `flagline-dashboard.tsx` (matching the candidate's own spec, which had called for it but never implemented it); darkened `zinc-400`→`zinc-600` text and `emerald-600`→`emerald-700` button backgrounds for AA contrast.

## Hard gate, round 2 (re-fix) — dev server fully restarted (stale `next-server` process from the session's earlier native round was found still bound to :3100 holding a corrupted Turbopack cache; killed, `.next` wiped, clean restart, confirmed 200 on all 3 routes before re-gating)

| candidate | sweep | a11y | verdict |
|---|---|---|---|
| a | **FAIL, worse** — `div#0` 1264px now 125px (was 22px via `table#0`), **new** `table#1` violation (3px, all 4 widths) | 100 (fixed) | **DROPPED** — re-fail |
| b | **FAIL, unchanged** — identical 98/87/41/30px at all 4 widths, to the pixel | 100 (already passing) | **DROPPED** — re-fail |
| c | **FAIL, unchanged** — identical 270px at 390px | 100 (fixed) | **DROPPED** — re-fail |

**All 3 candidates re-failed their one allowed fix attempt. Zero candidates survive to §4 JUDGE.** This is not a judged no-winner round (the panel never convened) — it is a hard-gate washout, one step earlier in the pipeline than §4 anticipates ("생존 후보 2개 이상" or "1개 단독 심사"). See [[questions-queue]] Q71 for the full analysis of why two independently-diagnosed, doctrine-matching fixes (the `auto-dash-r46` L2 `min-w-0`-on-ancestor pattern) produced measurably zero effect.

Candidate `b` queued to [[reassign-queue]] (#17) as the most clearly diagnosed of the three; `a` and `c` are equally eligible (rule-violation drops, not form drops) but not queued per the queue's one-per-round convention.
