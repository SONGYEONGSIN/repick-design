# auto-landing-r41 — SCORES

Freeze hash (candidates a/b/c, final state judged): `9bacd270a5e63a128e68c73a6275deecc3e4a363`
(computed via `cat app/src/app/landing-evolve/r41/*/*.tsx app/src/app/landing-evolve/r41/*/*.ts | shasum`)

## Candidate a — "Twelve Cells" (reassigned, [[reassign-queue]] #16)

Reassignment of `auto-landing-r40/c`, which hard-gate-dropped on a **second**, unrelated failure
introduced by its own first a11y fix (see reassign-queue #16 for the full history). The assigned
fix: add `position: relative` to the grid-cell `<button>` itself (the sr-only span's direct DOM
parent), so its absolutely-positioned trailing `sr-only` span anchors inside the clipping
`overflow-x-auto` table wrapper instead of escaping to unscrolled viewport coordinates
([[page-brief-core]] §2 "sr-only 앵커"). The `bg-sky-900` selected-state badge fix and the
competing-`aria-label`-removal fix from the original r40/c 1-fix are both kept as-is (they were
never the cause of the second failure).

1st pass: **PASS** — 10/10 clean, no 1-fix needed. The targeted `relative` fix fully resolved the
reassignment's named defect with no new violations.

| gate | pass | detail |
|---|---|---|
| route | ✅ | 1개 라우트 응답 OK |
| types | ✅ | 에러 0 |
| static | ✅ | 위반 0 |
| lint | ✅ | 위반 0 |
| weights | ✅ | 3종 (렌더 실측) |
| sweep | ✅ | 전 폭 오버플로 0 (390px 포함 — 원 재배정 사유였던 `page-overflow` 재발 없음) |
| focus | ✅ | 포커스 표시 0건 누락 |
| console | ✅ | 메시지 45건 · 결함 0 |
| a11y | ✅ | 100 |
| perf | ✅ (기록만) | 53 |

**Survived to judging.**

## Candidate b — "Point by Point" (AI defect scan-line reveal)

1st pass: **FAIL** — `a11y` 96 (`color-contrast`: three uses of `text-zinc-500` on the `#0B0B0F`
page background — the struck-through original-price text in `ProductCard.tsx` and `ScanReveal.tsx`,
and the "Not yet scanned" list-item text in `ScanReveal.tsx` — measure 4.06:1 against the 4.5:1
small-text floor).

1-fix applied: replaced all three `text-zinc-500` instances with `text-zinc-400` (7.66:1 against
the same background, well clear of AA). No layout or behavior change.

Re-gate (clean):

| gate | pass | detail |
|---|---|---|
| route | ✅ | 1개 라우트 응답 OK |
| types | ✅ | 에러 0 |
| static | ✅ | 위반 0 |
| lint | ✅ | 위반 0 |
| weights | ✅ | 3종 (렌더 실측) |
| sweep | ✅ | 전 폭 오버플로 0 |
| focus | ✅ | 포커스 표시 0건 누락 |
| console | ✅ | 메시지 137건 · 결함 0 |
| a11y | ✅ | 100 |
| perf | ✅ (기록만) | 54 |

**Survived to judging.**

**Pre-judgment design iteration (not a §3-1 post-judgment fix — both of these happened before
the freeze hash above was taken, during my own manual interaction test of the live device, i.e.
ordinary design review, not the constrained post-ranking carve-out):**
1. `DEFAULT_SCAN_PCT` was originally `0` — the device's default (no-interaction) render showed
   "0% confidence, 0 of 5 points scanned," an empty/trivial state. This directly violates the
   `auto-landing-r38` L2 doctrine already in `landing-deltas-provisional.jsonl` ("a live device's
   default render, not just its formula, must be non-trivial, because the no-interaction state is
   what most judges and cold visitors actually see"). Changed the default to `45`, which yields a
   non-trivial 2-of-5/55% state on first paint for every item in the pool (verified: all four
   items' defect `xPct` layouts yield 2 of 5 revealed at scan position 45, 52–60% confidence).
2. Found via interactive testing (keyboard `ArrowRight` on the range input, not just reading the
   source) that switching the item thumbnail reset `scanPct` back to `0` — reintroducing the exact
   empty state the fix above had just removed, on every item switch. Changed the reset target from
   literal `0` to `DEFAULT_SCAN_PCT`, so switching items re-arms the scan at the same non-trivial
   starting position as first paint, not a momentary blank one. This generalizes the r38 doctrine
   from "first render" to "every reset," which the existing delta text doesn't say explicitly —
   recorded as this round's LEARN delta.

## Candidate c — "Build Your Match" (3-facet quiz → live best-match card)

1st pass: **PASS** — 10/10 clean, no 1-fix needed.

| gate | pass | detail |
|---|---|---|
| route | ✅ | 1개 라우트 응답 OK |
| types | ✅ | 에러 0 |
| static | ✅ | 위반 0 |
| lint | ✅ | 위반 0 |
| weights | ✅ | 3종 (렌더 실측) |
| sweep | ✅ | 전 폭 오버플로 0 |
| focus | ✅ | 포커스 표시 0건 누락 |
| console | ✅ | 메시지 79건 · 결함 0 |
| a11y | ✅ | 100 |
| perf | ✅ (기록만) | 59 |

**Survived to judging.**

## Interactive verification (beyond static gate)

All three candidates' live-manipulation claims were verified by actually driving the controls
with Playwright (keyboard `ArrowRight`/click, not just reading source or raw DOM-value injection,
which a first attempt showed gives a false negative against React-controlled inputs):
- **a**: clicking a grid cell (`Like New` × `Watches`) correctly swapped the best-match panel to
  "Stainless Field Watch" with its own alternates — confirmed causal, not cosmetic.
- **b**: 60 `ArrowRight` presses on the scan range moved confidence from the 45%-default 55% to a
  correctly-recomputed 75% (2→3 of 5 points, weights 30+25+20), with the newly-revealed
  check-point's label appearing in the list — confirmed causal.
- **c**: selecting `Bags` + `$300+` correctly recomputed the panel to "Carry-On — Hardshell" at
  92% match, dropping the prior Footwear pick entirely — confirmed causal, not a partial update.

## Environment notes

- Lighthouse required `CHROME_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome
  PW_NO_SANDBOX=1` to produce real a11y/perf scores instead of a silent `unavailable` soft-pass.
  Playwright's own browser download (`npx playwright install chromium`) is blocked by the sandbox
  proxy (`cdn.playwright.dev` → 403) — `PW_CHROMIUM_PATH` pointed at the same pre-installed
  chromium-1243 build instead, for `capture-shots.mjs`/`dash-sweep.mjs`/`gate.mjs`'s own Lighthouse
  invocation. No script/package changes; purely environment-level, one-time per session.
- `images.unsplash.com` is blocked by this sandbox's outbound proxy (confirmed via direct `curl -v`:
  `CONNECT images.unsplash.com:443` → **403 Forbidden**) — the same constraint already recorded as
  [[questions-queue]] Q49. All three candidates use fixed, human-picked Unsplash photo IDs exactly
  per [[page-brief-core]] §3's allowed pattern; all three render the broken-image fallback in this
  environment's screenshots **equally**, not as a candidate-specific defect. The `aspect-ratio`
  reservation + below-photo badge placement (design-principles §Landing구조 2번) holds up correctly
  under the failure — no layout collapse, no badge/alt-text overlap, confirmed in every captured
  frame. This is expected to render normally in a real deployment with unrestricted egress.
