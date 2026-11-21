# auto-landing-r40 — SCORES

Freeze hash (candidates a/b, final surviving state): `0e7debaa24f21f35e42f39309f3cd58a71f6f369`
(computed via `cat app/src/app/landing-evolve/r40/*/*.tsx app/src/app/landing-evolve/r40/*/*.ts | shasum`)

## Candidate a — "Rank Shuffle"

1st pass: **FAIL** — `types` TS2345 (`RankShuffle.tsx:45`, narrowed `FactorId | null` not flowing into nested closure) + `lint` `react-hooks/refs` (`RankShuffle.tsx:35`, ref write during render).

1-fix: moved `orderRef.current = order` into a `useEffect`; captured `const activeId = draggingId` after the null-check so TS narrows correctly inside the nested `handleMove` closure.

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
| console | ✅ | 메시지 52건 · 결함 0 |
| a11y | ✅ | 100 |
| perf | ✅ (기록만) | 68 |

**Survived to judging.**

## Candidate b — "Window, Not a Point" (Range Sweep)

1st pass: **FAIL** — `lint` `react-hooks/refs` ×4 (`RangeSweep.tsx:72,79`), caused by a "factory returns closure" pattern (`startDrag(which)` / `onDragMove(which)` called during render to produce the actual handler) that the new `react-hooks/refs` rule cannot statically prove is deferred.

1-fix: replaced the two parameterized factory functions with four plain named handlers (`handlePointerDownMin/Max`, `handlePointerMoveMin/Max`, mirroring the already-passing `endDrag` pattern) and a shared `stepFor()` helper for keyboard stepping — no behavior change, same min/max drag + keyboard-slider semantics.

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
| console | ✅ | 메시지 122건 · 결함 0 |
| a11y | ✅ | 100 |
| perf | ✅ (기록만) | 58 |

**Survived to judging.**

## Candidate c — "Twelve Cells" (Grade Matrix) — **DROPPED (hard gate, re-fail)**

1st pass: **FAIL** — `a11y` 96 (`color-contrast`: "Top pick" badge in the *selected* cell state used `bg-white/20 text-white`, a translucent overlay over `bg-sky-700` that composited to `#3387b9`, giving only 3.95:1 against the 4.5:1 small-text floor; `label-content-name-mismatch`: a custom `aria-label` on each of the 12 grid-cell buttons paraphrased the visible "{count}" + "Top pick" text instead of containing it verbatim).

1-fix applied: (a) changed the selected-state "Top pick" badge background from `bg-white/20` to a solid `bg-sky-900` (white-on-sky-900 = 9.46:1, verified by direct relative-luminance calculation); (b) removed the competing `aria-label` entirely and appended a trailing `sr-only` span inside each button so the already-visible text ("{count}", "Top pick") becomes a literal prefix of the accessible name, per this repo's established precedent for this exact audit (`auto-dash-r39/a`, `auto-landing-r36` note).

Re-gate: `a11y` now **100** (both audits fixed, confirmed via direct Lighthouse re-run with full `details.items` inspection) — **but a new, different violation appeared**: `sweep` `page-overflow` at 390px, **+79px**, not present in the 1st-pass gate (which reported `sweep: 전 폭 오버플로 0`).

Root cause (diagnosed, not fixed — the one permitted fix attempt was already spent on the a11y audits): the new trailing `sr-only` span sits inside `<div className="overflow-x-auto …"><table className="min-w-[520px] …">`, and **no ancestor between the button and that scroll wrapper has `position:relative`** — this is precisely the documented [[page-brief-core]] §2 "sr-only 앵커" bug (an absolutely-positioned `sr-only` node inside an `overflow-x-auto` clipping container paints at unscrolled/un-clipped coordinates and inflates `document.scrollWidth` at 390px specifically, where the table's horizontal scroller is actually active) — not a candidate-authorship defect in the original design, but a side effect of *this specific 1-fix's own remedy* for the unrelated a11y failure.

Per skill §3 ("1-fix 루프 ... 재실패 시 탈락"), a second fix attempt is not permitted regardless of diagnosis confidence — **candidate c is dropped from this round, not sent to judging.** Queued to [[reassign-queue]] (see below) since the drop is a hard-gate rule violation, not a form/judgment rejection — the "Twelve Cells" / Grade Matrix device itself (3×4 single-cell-select matrix → synced best-match card + 2-alternative comparison strip) is undisqualified by this failure and eligible for reassignment with the exact fix specified.

| gate | 1st pass | after 1-fix |
|---|---|---|
| route | ✅ | ✅ |
| types | ✅ | ✅ |
| static | ✅ | ✅ |
| lint | ✅ | ✅ |
| weights | ✅ | ✅ |
| sweep | ✅ (0 overflow) | ❌ **390px +79px overflow (new)** |
| focus | ✅ | ✅ |
| console | ✅ | ✅ |
| a11y | ❌ 96 (color-contrast, label-content-name-mismatch) | ✅ 100 |
| perf | ✅ (기록만) | ✅ 57 |

**DROPPED — judge panel runs with 2 survivors (a, b) only, per skill §4 ("생존 후보 2개 이상일 때").**

## Environment notes
- Lighthouse required `CHROME_PATH=/opt/pw-browsers/chromium PW_NO_SANDBOX=1` env vars to produce real a11y/perf scores instead of a silent `unavailable` soft-pass (same sandbox constraint documented in prior rounds' SCORES.md, e.g. `auto-landing-r39`). No script changes made.
- Playwright's pinned chromium revision (1228) was missing from `/opt/pw-browsers`; resolved by symlinking `chromium-1228` → the pre-installed `chromium-1243` (and the matching `chromium_headless_shell-1228` → `-1243`) rather than attempting a network download (blocked by the sandbox's agent-proxy allowlist). No script/package changes — purely an environment-level fix, done once at session bootstrap.
