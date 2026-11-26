# auto-landing-r59 — SCORES

Freeze hash (all 3 candidates' `.tsx`/`.ts`, concatenated, after the one 1-fix below, before
screenshot capture or judging): `4ef1ce71a7cf3026be0b3ee2ceb5b0b07d98ff7b`

Env note: this sandbox's pre-installed Chromium (`/opt/pw-browsers/chromium`) is used via
`PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`, exported per invocation — `gate.mjs`,
`capture-shots.mjs` and `dash-sweep.mjs` all already read this env var, no script edits needed.

## Candidate a — "Grade Ladder" (light / cyan / `display-grotesk`)

1st gate — **FAIL** (a11y 95, `button-name`).

| gate | 1st | 2nd (post 1-fix) |
|---|---|---|
| route/types/static/lint/weights | pass | pass |
| sweep | pass | pass |
| focus | pass | pass |
| console | pass | pass |
| a11y | **fail** — 95, `button-name` (the "Include original accessories" `role="switch"` button had no accessible name — only an adjacent, unassociated `<span>` carried the label text) | pass — 100 |
| perf | pass — 93 | pass — 96 |

1-fix: added `aria-label="Include original accessories"` directly to the switch button
(`GradeLadder.tsx`). Re-gate: **10/10 clean**, a11y 100, perf 96.

## Candidate b — "Dispute Replay" (dark / rose / `display-mono`)

Before gating, proactively applied the same fix candidate a needed (same `role="switch"`
pattern, no accessible name on the "Route flagged checks to a human reviewer" toggle) —
`aria-label="Route flagged checks to a human reviewer"` added to `FrameScrubber.tsx` before the
first gate run, so this did not consume a 1-fix attempt.

1st gate — **10/10 clean, no 1-fix needed.**

| gate | result | detail |
|---|---|---|
| route | pass | 1개 라우트 응답 OK |
| types | pass | 에러 0 |
| static | pass | 위반 0 |
| lint | pass | 위반 0 |
| weights | pass | 4종 (400, 500, 600, 800) — 기록만 |
| sweep | pass | 전 폭 오버플로 0 |
| focus | pass | 포커스 표시 0건 누락 |
| console | pass | 메시지 52건 · 결함 0 |
| a11y | pass | 100 |
| perf | pass | 86 |

## Candidate c — "Trust Breakdown" (light / lime / Pretendard-only)

1st gate — **10/10 clean, no 1-fix needed.**

| gate | result | detail |
|---|---|---|
| route | pass | 1개 라우트 응답 OK |
| types | pass | 에러 0 |
| static | pass | 위반 0 |
| lint | pass | 위반 0 |
| weights | pass | 4종 (400, 500, 600, 800) — 기록만 |
| sweep | pass | 전 폭 오버플로 0 |
| focus | pass | 포커스 표시 0건 누락 |
| console | pass | 메시지 39건 · 결함 0 |
| a11y | pass | 100 |
| perf | pass | 89 |

## Summary

All 3 candidates survive the hard gate (a: 1-fix, b/c: clean). All proceed to the JUDGE panel.
