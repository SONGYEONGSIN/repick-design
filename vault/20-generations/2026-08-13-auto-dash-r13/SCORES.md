# auto-dash-r13 — SCORES

Frozen source hash (final, post 1-fix + blank-frame fix): `0021b33bcdd66088803df6dc185739ab0db42e8c`
(`cat app/src/app/dash-evolve/r13/*/*.tsx app/src/app/dash-evolve/r13/*/*.ts | shasum`)

Env note (this sandbox): pre-installed Chromium (rev1194) needs `--no-sandbox` to launch as root.
`PW_CHROMIUM_PATH`/`CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome` + `PW_NO_SANDBOX=1`
set for all gate/sweep/lighthouse/capture invocations — `gate.mjs`'s own dispatcher already reads
these env vars (`PW_NO_SANDBOX` → `--no-sandbox` chrome-flag, `PW_CHROMIUM_PATH` → playwright
`executablePath`), so a11y/perf ran live (not `unavailable`) for every candidate this round.

## Candidate a — Portlane (freight/logistics, 3-pane market)

| gate | 1st pass | after 1-fix |
|---|---|---|
| route | pass | — |
| types | pass | — |
| static | pass | — |
| lint | pass | — |
| weights | pass (3종) | — |
| sweep | **fail** — table-overflow by 7 at 1280w, `table#1` (CarrierScorecard: `Mode`/`Active` header cells narrower than their uppercase-tracking-wider text) | pass — 0 오버플로 |
| console | pass (48 msgs, 0 결함) | — |
| a11y | 97 | 97 |
| perf | 67 | 67 |

**1-fix applied**: rebalanced `CarrierScorecard.tsx` colgroup % (30/16/18/17/19 from 36/12/20/17/15) to give the `Mode`/`Active` columns enough width for their header labels at the narrowest desktop breakpoint. Rule-violation fix only — no rank-relevant polish.

## Candidate b — Trestle (CI/CD deploy ops, feed-centric)

| gate | 1st pass |
|---|---|
| route | pass |
| types | pass |
| static | pass |
| lint | pass |
| weights | pass (3종) |
| sweep | pass — 0 오버플로 |
| console | pass (221 msgs, 0 결함) |
| a11y | 95 |
| perf | 69 |

No 1-fix needed — clean on first pass.

## Candidate c — Runsheet (editorial content calendar, calendar-centric)

| gate | 1st pass | after 1-fix |
|---|---|---|
| route | pass | — |
| types | pass | — |
| static | pass | — |
| lint | pass | — |
| weights | pass (3종) | — |
| sweep | pass — 0 오버플로 | — |
| console | pass (52 msgs, 0 결함) | — |
| a11y | **fail** — desktop 100 / **mobile 94** (`button-name`: ⌘K search-trigger button had no accessible name at <sm since its label span is `hidden` at mobile and it carried no `aria-label`; `label-content-name-mismatch`: calendar-day and mobile-agenda buttons carry a full `aria-label` but their visible day-number/count text wasn't marked `aria-hidden`, so Lighthouse's visible-content check didn't see it as covered by the label) | pass — desktop 100 / mobile 100 |

**1-fix applied**: added `aria-label` to the ⌘K search-trigger button (matching its desktop visible text) and marked its now-redundant visible span `aria-hidden`; marked the day-number/count-badge/agenda-row inner text spans `aria-hidden` in `CalendarGrid.tsx` (the button's own `aria-label` already carries the full accessible description — weekday, date, item count, today/selected/outside-month state). Rule-violation fix only — no rank-relevant polish.

**Blank-frame fix (§4, separate from the §3 hard-gate 1-fix above)**: candidate c's mobile 390px scroll-100% capture came back blank (`distinct:16, nonBgRatio:0.004`). Root cause: c is a viewport-locked shell (`h-dvh overflow-hidden` root, only `<main>` scrolls internally) — added `overflow-hidden` to the root shell div (it was missing, a real bug: without it the outer document could scroll independently of `<main>`'s own scroll, a "double-scroll" case the brief's own grid-crafting rules warn about). After that fix, every real layout metric (`offsetHeight`/`clientHeight`/computed `height`) correctly read 900px at 390 width, but `document.documentElement.scrollHeight` still read 2077 — diverging from `document.body.scrollHeight` (900, correct) for reasons isolated to this Chromium build/headless config, not candidate c's markup (candidate b uses the identical `h-dvh overflow-hidden` shell pattern with zero divergence). Since `scripts/capture-shots.mjs` computed its scroll-through range from `documentElement.scrollHeight`, it scrolled the window 1177px past all real content into blank space. Fixed by switching that one line to `document.body.scrollHeight` (matches `offsetHeight` everywhere tested; identical to the old value for candidates a/b since their two metrics already agreed, so their captures are unaffected — verified). This is a capture-tooling fix, not a candidate-code change, and doesn't touch any canonical/gate file.

## Summary

All 3 candidates survive to JUDGE. 2 of 3 needed exactly 1 fix-and-regate pass (both passed on the retry, per the 1-fix rule — no candidate needed a 2nd attempt).
