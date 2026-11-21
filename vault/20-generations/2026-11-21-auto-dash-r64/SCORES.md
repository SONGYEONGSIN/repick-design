# SCORES — auto-dash-r64

- pre-gate source hash (candidates as frozen before first gate run): `be52010b29f4b711198bcb244caa82fce91f731c`
- dev server: localhost:3100 (this round started it; will stop at §7)
- gate env: `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium CHROME_PATH=/opt/pw-browsers/chromium PW_NO_SANDBOX=1` (preinstalled Chromium 1243 matches the pinned `playwright@1.61.1`; `npx playwright install` is blocked by the network policy, so the repo's existing `PW_CHROMIUM_PATH`/`CHROME_PATH` env hooks in `capture-shots.mjs`/`dash-sweep.mjs`/`gate.mjs`'s lighthouse spawn are used instead of a script change)

## Candidate a — "Weir" (API gateway rate-limit console, master-detail + hour×endpoint heatmap, light/emerald-700, reassignment of r63/c)

1st gate:

| gate | pass | detail |
|---|---|---|
| route | ✓ | 1개 라우트 응답 OK |
| types | ✓ | 에러 0 |
| static | ✓ | 위반 0 |
| lint | ✗ | error 0 · warning 1 (`@typescript-eslint/no-unused-vars` — `pct` defined but never used, `KeyRail.tsx:109`) |
| weights | ✓ | 3종 (렌더 실측) |
| sweep | ✓ | 전 폭 오버플로 0 |
| focus | ✓ | 포커스 표시 0건 누락 |
| console | ✓ | 메시지 13건 · 결함 0 |
| a11y | ✓ | 100 |
| perf | ✓ | 89 |

**1-fix**: removed unused `pct` from the `{ key, pct, status }` destructure in `KeyRail.tsx:109` (dead var left over from an earlier revision; the row's own matrix total is rendered separately via `MiniBuckets`/`formatNumber`, this binding had no remaining use).

2nd gate: **10/10 clean.**

## Candidate b — "Jobline" (field-service dispatch board/calendar, bullet-chart grid, light/green, assigned bucket: calendar/board-centric)

1st gate:

| gate | pass | detail |
|---|---|---|
| route | ✓ | 1개 라우트 응답 OK |
| types | ✓ | 에러 0 |
| static | ✓ | 위반 0 |
| lint | ✓ | 위반 0 |
| weights | ✓ | 3종 (렌더 실측) |
| sweep | ✓ | 전 폭 오버플로 0 |
| focus | ✓ | 포커스 표시 0건 누락 |
| console | ✓ | 메시지 38건 · 결함 0 |
| a11y | ✗ | 96 · 실패 감사 `color-contrast` (승격 감사 — 점수 무관 하드페일) |
| perf | ✓ | 79 |

Lighthouse `color-contrast` detail (desktop+mobile union) flagged 5 text nodes, all descendants of one component: the cancelled-job `JobCard` in `DispatchBoard.tsx` — the job-time span (`text-zinc-500`), the title (`text-zinc-500 line-through`), the customer-name span (`text-zinc-600`), the status `Badge`'s inner span (inherits `text-zinc-600` from `muted` tone), and the `InitialsAvatar` fallback-letter span (`text-zinc-600` on `bg-zinc-100`). None of those tokens individually violate this catalog's contrast-floor rule (zinc-500 on near-white, zinc-600 on muted zinc-50/zinc-100 surfaces are both within the documented floors) — the actual cause was a blanket `opacity-70` on the whole cancelled-card `<button>` wrapper, which uniformly multiplies every descendant's effective contrast down regardless of its token, dropping all five below AA at once.

**1-fix**: removed `opacity-70` from the cancelled-card className in `DispatchBoard.tsx` (kept `border-dashed` + `bg-zinc-50` + the title's `line-through` as the cancelled-state visual cue — no color token changed).

2nd gate: **10/10 clean.**

## Candidate c — "Vigil" (SOC alert-triage console, feed-centric + radar chart, light/orange)

1st (only) gate — **10/10 clean on first pass**:

| gate | pass | detail |
|---|---|---|
| route | ✓ | 1개 라우트 응답 OK |
| types | ✓ | 에러 0 |
| static | ✓ | 위반 0 |
| lint | ✓ | 위반 0 |
| weights | ✓ | 3종 (렌더 실측) |
| sweep | ✓ | 전 폭 오버플로 0 |
| focus | ✓ | 포커스 표시 0건 누락 |
| console | ✓ | 메시지 39건 · 결함 0 |
| a11y | ✓ | 100 |
| perf | ✓ | 83 |

## Summary

All three candidates survive the hard gate (a, b used their 1-fix; c needed none). Proceeding to screenshot capture and the 3-lens judge panel.
