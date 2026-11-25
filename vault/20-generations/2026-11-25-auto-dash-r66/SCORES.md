# auto-dash-r66 — SCORES

Freeze hash (all 3 candidates' `.tsx`/`.ts`, concatenated, before any 1-fix): `6d04334c2ea77505f0523f12d4004842a64c8b56`

Env note: this sandbox's pre-installed Chromium (`/opt/pw-browsers/chromium`, v158) does not match the
pinned `playwright@1.61.1`'s expected bundled build (v1228), and its download is blocked by the
egress proxy — gate runs used `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium CHROME_PATH=/opt/pw-browsers/chromium
PW_NO_SANDBOX=1` (all three candidate scripts already read `PW_CHROMIUM_PATH` via
`process.env.PW_CHROMIUM_PATH || undefined`, so no script edits were needed).

## Candidate a — Gridwell (3-pane market, dark/indigo/wide)

1st gate — **10/10 clean, no 1-fix needed**.

| gate | result | detail |
|---|---|---|
| route | pass | 1개 라우트 응답 OK |
| types | pass | 에러 0 |
| static | pass | 위반 0 |
| lint | pass | 위반 0 |
| weights | pass | 3종 (렌더 실측) |
| sweep | pass | 전 폭 오버플로 0 |
| focus | pass | 포커스 표시 0건 누락 |
| console | pass | 메시지 39건 · 결함 0 |
| a11y | pass | 100 |
| perf | pass | 81 |

## Candidate b — Siteframe (calendar/board, light/lime/grotesk)

1st gate — **FAIL** (sweep `cell-overlap` ×43 across 1264/1280/1350/1366/1424/1440/390px + a11y 95
`button-name`).

| gate | 1st | 2nd (post 1-fix) |
|---|---|---|
| route/types/static/lint/weights | pass | pass |
| sweep | **fail** — 43 cell-overlap ("Time" column text overlapping "Patient" id column) | **fail** — 1 residual (390px, 17px, the one row whose range crosses AM→PM) |
| focus | pass | pass |
| console | pass | pass |
| a11y | **fail** — 95, `button-name` ("New visit" button's label was `hidden sm:inline`, leaving only an `aria-hidden` icon below `sm` — the exact pattern `page-brief-core` names as the historical cause of 5 prior `button-name` failures) | pass — 100 |
| perf | pass | pass |

1-fix applied (orchestrator, not re-dispatched to designer — rule-violation-fix only, no taste changes):
1. `data.ts` `formatRange`: drop the repeated meridiem when both endpoints share AM/PM
   ("8:30–9:00 AM" instead of "8:30 AM–9:00 AM") — removes 3 chars from the common case.
2. `VisitBoard.tsx`: widened the Time column (12%→19%) and rebalanced Visit type/Site/Coordinator/
   Status (20/20/20/14 → 17/18/16/18), and added `pr-3` horizontal padding to every header/body cell
   (there was none at all before — cells touched edge-to-edge, which is most of why even a
   correctly-sized column overlapped its neighbor by the text's full excess width).
3. `Topbar.tsx`: `hidden sm:inline` → `sr-only sm:not-sr-only` on the "New visit" button's label.

Re-gate: a11y → 100 (clean), sweep → down from 43 violations to 1 (only the single row whose range
crosses AM→PM, e.g. "11:30 AM–12:15 PM", which the meridiem-dedup fix cannot shorten since the two
endpoints don't share a period). **Per SKILL.md §3, exactly one fix attempt is allowed; any residual
failure after it is elimination, no second attempt** — candidate b is gate-eliminated and does not
proceed to judging. Reassignment note: see DECISION.md §3 and `reassign-queue.md`.

## Candidate c — Spendmesh (rail-less treemap, dark/violet/pretendard-only)

1st gate — **10/10 clean on the hard-gate's own checks** (static/lint/types/sweep/focus/console/a11y
100/perf 81). **But this did not mean the candidate was judge-ready** — a manual screenshot
inspection (per §4's "스크립트는 프레임마다 실제 픽셀을 재 빈 화면을 판정한다... 하드게이트 4종은
'통과했는데 아무것도 안 그려진' 경우를 잡지 못한다" warning) found the dominant visualization — the
treemap itself — rendering as a fully empty dark rectangle at every desktop width tested
(1440/390 scroll-0 frames). The automated per-frame "blank" classifier did not flag this because the
header/KPI strip above the treemap still contributed enough non-background pixels to keep the whole
frame's `nonBgRatio` above its threshold; only the treemap's own region was empty.

**Root cause (confirmed via direct Playwright DOM measurement, not guesswork)**: the treemap's
container div used Tailwind `min-h-[420px] ... xl:min-h-[640px]` + `flex-1`, and the `Treemap`
component's own root measures itself via `h-full w-full` + `ResizeObserver`. `height: 100%` only
resolves against an ancestor whose *declared* `height` CSS property is definite — `min-height`
(even when it ends up being the value that determines the ancestor's rendered box) does not count,
and neither does `flex-1` here because the flex-grow chain's own ultimate ancestor only has
`min-h-screen`, never a definite `height`. Confirmed empirically:
`getBoundingClientRect()` on the wrapper reported `height: 640` (correct, from `min-height`) while
the *same instant*, `getBoundingClientRect()` on the `Treemap` root — its own direct child, with
`h-full` — reported `height: 0`. The `squarify()` layout algorithm itself was verified correct in
isolation (tested directly with the real team-cost values and a real `640` height argument — it
produced sane non-zero rects); the bug was 100% in the CSS percentage-height chain, not the layout
math.

**Fix (orchestrator-diagnosed and applied directly, not re-dispatched to the designer — this is a
rendering-bug fix, the same class of "regardless of judge-eligibility, a blank chart must be fixed
before judging" action the skill mandates, not a taste/scope change)**: changed the wrapper's
classes from `relative min-h-[420px] flex-1 sm:min-h-[480px] lg:min-h-[560px] xl:min-h-[640px]` to
`relative h-[420px] sm:h-[480px] lg:h-[560px] xl:h-[640px]` (an explicit, definite `height` at each
breakpoint instead of a `min-height` + flex-grow). Re-measured directly: the `Treemap` root's
`getBoundingClientRect()` now reports `height: 640` matching the wrapper, and every team/service
tile rect now carries real non-zero widths and heights.

**Re-gate after that fix surfaced a second, previously-masked defect**: `a11y` dropped to `100` with
`label-content-name-mismatch` hard-fail on **every one of the 25 treemap tile buttons** — this audit
could not meaningfully evaluate 0-size elements before, so it was silent on the first (broken) gate
run. Full Lighthouse desktop-preset detail confirmed each tile's custom `aria-label` (e.g.
`"Compute $182,000 — 49.1% of Platform Engineering team spend. Press Enter to…"`) did not literally
contain the tile's own rendered text (`"COMPUTE" / "$182K" / "49.1% of team"` — different formatting:
compact vs. full currency, abbreviated vs. full team-spend phrasing). This is the exact
`label-content-name-mismatch` pattern `page-brief-core` §2 already names as this catalogue's
recurring failure mode, with the exact documented fix: drop the competing custom label and let the
visible text supply the accessible name, extended (not replaced) by a `sr-only` span for the richer
detail. Applied: removed the tile `aria-label` entirely; added a `sr-only` span *inside* the button,
after the visible label/value/share spans, carrying the full currency amount + percentage + team
name + "Press Enter to view the breakdown" sentence — so the accessible name is now the concatenation
of the visible text (satisfying the audit) plus the extended detail.

Re-gate after the second fix: **10/10 clean** (a11y 100, no `label-content-name-mismatch`, all else
unchanged). Screenshots recaptured post-fix — the treemap now renders with legible, correctly-sized
tiles at every width (see `shots/c-*.png`).

Freeze-hash note: candidate c's source changed twice after the recorded freeze hash
(`6d04334c2ea77505f0523f12d4004842a64c8b56`) to fix these two defects — both fixes are
rendering/rule-violation corrections with zero effect on c's design intent, domain, copy, or
information architecture (the designer's own concept stands unchanged; only a CSS sizing bug and an
accessible-name wiring bug were corrected). Post-fix hash:
`5428d764211a2254417035c9e4f991670d6d6ec6` (whole-round concatenation, a/b/c). Judges will see the
post-fix, fully-rendered state.

| gate | 1st (treemap invisible) | 2nd (after CSS fix) | 3rd (after label fix) |
|---|---|---|---|
| route/types/static/lint/weights | pass | pass | pass |
| sweep | pass | pass | pass |
| focus | pass | pass | pass |
| console | pass | pass | pass |
| a11y | pass — 100 (treemap tiles invisible to the audit) | **fail** — 100 score but `label-content-name-mismatch` hard-fail on all 25 tiles | pass — 100, clean |
| perf | pass — 81 | pass — 82 | pass — 82 |
