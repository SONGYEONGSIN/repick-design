# SCORES — auto-landing-r60

Freeze hash (concatenated `*.tsx`+`*.ts` under `app/src/app/landing-evolve/r60/*/`, `shasum`):
`c9898a02e04d1a78a02b0164da4c789e2ba12b59` — unchanged from registration through gate, capture,
and judging below (re-verified identical after judging completed).

Environment: `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium CHROME_PATH=/opt/pw-browsers/chromium
PW_NO_SANDBOX=1`. The first gate attempt (without `PW_NO_SANDBOX`) returned `a11y: unavailable` /
`perf: unavailable` for all three candidates — Lighthouse's `chrome-launcher` needs `--no-sandbox`
against this environment's pre-installed Chromium revision (1243) vs. the repo's expected
playwright-core build (1228); without it the headless launch silently fails and the gate falls
back to "unavailable" (a soft pass per `page-brief-repo` §5, not a hard fail — but it means a11y
was NOT actually being checked). Re-ran with `PW_NO_SANDBOX=1` added and Lighthouse ran for real
(confirmed via a direct `npx lighthouse` invocation before trusting the gate's number again).

## Candidate a — "Horizon" (Resale Timing Dial)

First and only gate run — clean on first attempt, 1-fix not used.

| gate | result |
|---|---|
| route | pass — 1개 라우트 응답 OK |
| types | pass — 에러 0 |
| static | pass — 위반 0 |
| lint | pass — 위반 0 |
| weights | pass — 3종 (렌더 실측) |
| sweep | pass — 전 폭 오버플로 0 |
| focus | pass — 포커스 표시 0건 누락 |
| console | pass — 메시지 52건 · 결함 0 |
| a11y | pass — **100** |
| perf | pass — 83 (기록만) |

## Candidate b — "Branch" (Trade-In Triage Tree)

First and only gate run — clean on first attempt, 1-fix not used.

| gate | result |
|---|---|
| route | pass |
| types | pass — 에러 0 |
| static | pass — 위반 0 |
| lint | pass — 위반 0 |
| weights | pass — 3종 |
| sweep | pass — 전 폭 오버플로 0 |
| focus | pass — 포커스 표시 0건 누락 |
| console | pass — 메시지 52건 · 결함 0 |
| a11y | pass — **100** |
| perf | pass — 93 (기록만) |

## Candidate c — "Flagged Zones" (Self-Inspection Ledger)

First and only gate run — clean on first attempt, 1-fix not used.

| gate | result |
|---|---|
| route | pass |
| types | pass — 에러 0 |
| static | pass — 위반 0 |
| lint | pass — 위반 0 |
| weights | pass — 3종 |
| sweep | pass — 전 폭 오버플로 0 |
| focus | pass — 포커스 표시 0건 누락 |
| console | pass — 메시지 40건 · 결함 0 |
| a11y | pass — **100** |
| perf | pass — 93 (기록만) |

All three candidates survive to judging with zero outstanding violations, zero 1-fix used.
