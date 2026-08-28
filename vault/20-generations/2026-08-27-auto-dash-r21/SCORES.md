# SCORES — auto-dash-r21

Source hash at judging time (all three routes, tsx+ts concatenated): `f324d6b8f29f562143d9aee5a6d2fbdc999dfd8b`

Env note: `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, `CHROME_PATH` (same), `PW_NO_SANDBOX=1` — repo's Playwright chromium install is revision 1194, package default expects 1228; this repointing was needed for every gate/screenshot invocation (precedented across many prior rounds per the ledger, first hit again in round 1 of this execution, `auto-dash-r20`).

## Hard gate — per-candidate (`node scripts/gate.mjs --target web --routes /dash-evolve/r21/<v>`)

| Gate | a (Meridian) | b (Vantage) | c (Flowline) |
|---|---|---|---|
| route | OK | OK | OK |
| types | 에러 0 | 에러 0 | 에러 0 (fixed: `Segmented<T extends string>` vs numeric `Horizon` — TS2322 ×3, converted horizon state to string-literal id) |
| static | 위반 0 | 위반 0 | 위반 0 |
| lint | 위반 0 | 위반 0 | 위반 0 (fixed: 2 unused imports) |
| weights | 3종 (렌더 실측) | 3종 (렌더 실측) | 3종 (렌더 실측) |
| sweep | 오버플로 0 | 오버플로 0 (fixed: `xl:grid-cols-[1fr_280px]` collided with the exact 1280px gate width given a 360px fixed rail — raised to `2xl:`) | 오버플로 0 |
| focus | 0건 누락 | 0건 누락 | 0건 누락 |
| console | 결함 0 | 결함 0 | 결함 0 |
| a11y | 100 | 100 | 100 |
| perf | 72 | 71–72 | 71–72 |

All three fixes above were made **during GENERATE, before the first official gate run counted here** — the table shows the clean re-run, not a 1-fix-loop remediation of a judged candidate (no candidate was judged in a failing state).

## Combined gate (all 3 routes together)

`node scripts/gate.mjs --target web --routes /dash-evolve/r21/a /dash-evolve/r21/b /dash-evolve/r21/c` → **pass: true**, all 10 gates green, 0 violations, a11y 100, perf 69.

## Screenshots

`vault/20-generations/2026-08-27-auto-dash-r21/shots/` — 4 widths (1280/1440/1920/390) × 4 scroll depths (0/35/70/100%) × 3 candidates = 48 frames. `capture-shots.mjs` reported `blanks: []`, `errors: []` for all three routes.

## Diversity axes (`node scripts/catalog-variety.mjs`, run fresh before GENERATE)

Catalog-wide (51 works): `violet-hex` accent overrepresented at 8/51 — avoided entirely across all three candidates. `pretendard` face at 26/51 (default), `grotesk`/`wide`/`mono` at 8–9 each. Theme roughly balanced (dark 28 / light 23), slight lean toward light for this round given r20 shipped dark×3.

Immediately preceding round (`auto-dash-r20`) axes, passed to designer decisions as "do not reuse": winner used dark/emerald/grotesk; the other two r20 candidates were also dark (rose/wide, blue/none).

| Candidate | theme | accent | face |
|---|---|---|---|
| a (Meridian) | light | cyan | wide |
| b (Vantage) | light | rose | mono |
| c (Flowline) | dark | teal | none (Pretendard only) |

No repeat of r20's exact combo or of `violet-hex`. Theme mix (2 light / 1 dark) nudges the catalog toward balance after r20's all-dark round.
