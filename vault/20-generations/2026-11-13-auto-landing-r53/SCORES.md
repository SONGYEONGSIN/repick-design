# SCORES — auto-landing-r53

Freeze hash (pre-fix, all 3 candidates as first generated): `c39c951b71e06c264032af59858c4305e48e1e87`
Freeze hash (post-fix, judged state — unchanged from here through judging): `b1ae1e2e734b51d4c5a4eba7738baee0d4fb8620`

## Candidate a — "Instant Appraisal Configurator" (light / rose / display-grotesk)

1st hard-gate attempt: **failed** `static` `no-unlisted-font` ×6 — `style={{ fontFamily: DISPLAY_FONT }}` referenced a JS constant; the regex checker requires the literal `var(--font-display-*)` string inline (known failure mode, same as `auto-landing-r50/a` and `auto-landing-r52/a` per their DECISION.md notes). 1-fix: inlined the literal string at all 6 sites, removed the now-unused `DISPLAY_FONT` import.

Re-gate — **10/10 clean**:

| gate | pass | detail |
|---|---|---|
| route | true | 1개 라우트 응답 OK |
| types | true | 에러 0 |
| static | true | 위반 0 |
| lint | true | 위반 0 |
| weights | true | 3종 (렌더 실측) |
| sweep | true | 전 폭 오버플로 0 |
| focus | true | 포커스 표시 0건 누락 |
| console | true | 메시지 65건 · 결함 0 |
| a11y | true | 100 |
| perf | true | 92 |

## Candidate b — "Comparison Tray" (light / indigo / display-wide)

1st hard-gate attempt: **failed** `a11y` 98, `heading-order` — the listing-grid card titles used `<h3>` with no intervening `<h2>` after the page's `<h1>` (the "why/proof/cta" `<h2>`s all come later in document order), a genuine heading-level skip. 1-fix: changed the card-title heading from `<h3>` to `<h2>` (the later triptych-item `<h3>`s are correctly nested under their own `<h2>` and were left unchanged).

Re-gate — **10/10 clean**:

| gate | pass | detail |
|---|---|---|
| route | true | 1개 라우트 응답 OK |
| types | true | 에러 0 |
| static | true | 위반 0 |
| lint | true | 위반 0 |
| weights | true | 4종 (400, 600, 700, 800) — 기록만, 렌더 실측 (700 is the browser default `<th>` bold inside the comparison table, the same documented `weights`-vs-`<th>` UA-bold trap noted in `curation-criteria.md`; `weights` is record-only, not a hard-fail) |
| sweep | true | 전 폭 오버플로 0 |
| focus | true | 포커스 표시 0건 누락 |
| console | true | 메시지 104건 · 결함 0 |
| a11y | true | 100 |
| perf | true | 95 |

## Candidate c — "Price × Condition Plot" (light / lime / display-mono)

1st hard-gate attempt: **passed clean**, no 1-fix used.

| gate | pass | detail |
|---|---|---|
| route | true | 1개 라우트 응답 OK |
| types | true | 에러 0 |
| static | true | 위반 0 |
| lint | true | 위반 0 |
| weights | true | 3종 (렌더 실측) |
| sweep | true | 전 폭 오버플로 0 |
| focus | true | 포커스 표시 0건 누락 |
| console | true | 메시지 47건 · 결함 0 |
| a11y | true | 100 |
| perf | true | 97 |

All 3 candidates survive to judging.
