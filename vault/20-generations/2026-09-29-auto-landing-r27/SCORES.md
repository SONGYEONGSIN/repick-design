# auto-landing-r27 — SCORES

Frozen-state hash (all 3 candidates' `.tsx`/`.ts` concatenated, `shasum`, taken before gating began):
`356b8ff20772d0d1ef1e8ed386da67d018235436`

Environment note: this sandbox has no Lighthouse/Chrome-DevTools-Protocol path wired to `npx lighthouse` even with `CHROME_PATH`/`PW_CHROMIUM_PATH` pointed at the pre-installed Chromium — `a11y`/`perf` report `unavailable` for all three candidates, which `page-brief-repo` §5 defines as pass (not a hard fail), same as `auto-landing-r25`'s environment note. Real a11y/perf were not machine-verified this round; judges were told to eyeball contrast/focus from the brief's self-reported numbers and screenshots instead.

| candidate | route | pass | fix rounds | notes |
|---|---|---|---|---|
| a — Signal Map (radar/polar) | `/landing-evolve/r27/a` | ✅ | 1-fix (lint: unused `n` in `data.ts:81`, removed) | re-gated clean after fix |
| b — Demand Map (treemap) | `/landing-evolve/r27/b` | ✅ | 0 (clean first pass) | |
| c — Fair-Price Slope (slope/bump chart) | `/landing-evolve/r27/c` | ✅ | 0 (clean first pass) | |

## Gate detail (post-fix, all candidates)

| gate | a | b | c |
|---|---|---|---|
| route | pass | pass | pass |
| types | 에러 0 | 에러 0 | 에러 0 |
| static | 위반 0 | 위반 0 | 위반 0 |
| lint | 위반 0 (after 1-fix) | 위반 0 | 위반 0 |
| weights | 3종 (렌더 실측) | 3종 (렌더 실측) | 3종 (렌더 실측) |
| sweep | 전 폭 오버플로 0 | 전 폭 오버플로 0 | 전 폭 오버플로 0 |
| focus | 포커스 표시 0건 누락 | 포커스 표시 0건 누락 | 포커스 표시 0건 누락 |
| console | 89건 · 결함 0 | 103건 · 결함 0 | 104건 · 결함 0 |
| a11y | unavailable (pass) | unavailable (pass) | unavailable (pass) |
| perf | unavailable (pass) | unavailable (pass) | unavailable (pass) |

All 3 candidates survive to judging (§4).
