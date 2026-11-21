# auto-landing-r35 — SCORES

Target: `landing` · Round: `auto-landing-r35` · Date: 2026-10-16
Env note: this session's Lighthouse/Playwright needed `CHROME_PATH=/opt/pw-browsers/chromium` (chrome-launcher doesn't inherit Playwright's bundled browser path) and `PW_NO_SANDBOX=1` (running as root — without `--no-sandbox` Lighthouse's Chrome fails to launch with "Running as root without --no-sandbox is not supported"). Both are environment-specific orchestration fixes, not design/content changes.

## Candidate a — "Grading Certificate" (light / emerald / `--font-display-wide`)

| gate | 1st pass | after 1-fix |
|---|---|---|
| route | ✅ | — |
| types | ✅ | — |
| static | ✅ | — |
| lint | ❌ `react-hooks/immutability` — `graphics.tsx:59` reassigned `x` after render inside `Barcode()`'s `.map()` | ✅ rewrote as `reduce` accumulator, no render-time reassignment |
| weights | ✅ 3종 (렌더 실측) | — |
| sweep | ✅ 전 폭 오버플로 0 | — |
| focus | ✅ 포커스 표시 0건 누락 | — |
| console | ✅ 결함 0 | — |
| a11y | ✅ 100 · 실패 감사 bf-cache(기록만) | — |
| perf | ✅ 66 (기록만) | — |

**1-fix applied**: `app/src/app/landing-evolve/r35/a/graphics.tsx` — `Barcode()` computed bar x-offsets via `let x; x += …` inside `.map()`, which the repo's React Compiler lint rule (`react-hooks/immutability`) flags as an illegal render-time mutation. Rewrote as a `reduce` that builds the bar list functionally (`prevEnd` computed from the accumulator's last entry). Re-gated clean.

Final verdict: **PASS, full gate clean.**

## Candidate b — "The Duel" (dark / rose / no display face)

| gate | 1st pass | after 1-fix |
|---|---|---|
| route | ✅ | — |
| types | ✅ | — |
| static | ❌ `img-needs-alt` — `ThumbArt.tsx:2`, literal string `<img>` matched inside a source **comment**, not markup | ✅ reworded comment to avoid the literal substring |
| lint | ✅ | — |
| weights | ✅ 3종 | — |
| sweep | ✅ 전 폭 오버플로 0 | — |
| focus | ✅ | — |
| console | ✅ | — |
| a11y | ✅ 100 · bf-cache | — |
| perf | ✅ 68 | — |

**1-fix applied**: `app/src/app/landing-evolve/r35/b/ThumbArt.tsx` — the static checker's `img-needs-alt` rule regex-matches `<img` anywhere in the file text, including inside a `//` comment explaining the file deliberately contains *no* `<img>` tags. Reworded the comment ("raster images" instead of literally writing `<img>`) — no code/behavior change. Re-gated clean. (False-positive class, not a real violation — confirmed no `<img>` element exists anywhere in the candidate's source.)

Final verdict: **PASS, full gate clean.**

## Candidate c — "Seller Payout Simulator" (reassigned, light / sky / no display face)

| gate | result |
|---|---|
| route | ✅ |
| types | ✅ |
| static | ✅ |
| lint | ✅ (confirms the reassignment's `useSyncExternalStore`-based `useMounted()` carried over cleanly — no `react-hooks/set-state-in-effect`) |
| weights | ✅ 3종 |
| sweep | ✅ 전 폭 오버플로 0 (confirms the `table-fixed`+`colgroup` fix + `[contain:layout]` resolved the `auto-landing-r34/c` `page-overflow` failure — this was the reassign-queue #12 root cause) |
| focus | ✅ |
| console | ✅ |
| a11y | ✅ 100 · bf-cache |
| perf | ✅ 61 |

**No 1-fix needed** — passed clean on the first gate run. Both reassign-queue #12 failures (lint + sweep overflow) are confirmed resolved.

Final verdict: **PASS, full gate clean, no 1-fix consumed.**

## Freeze hashes (source concatenation, pre-judge)

| candidate | sha1 (post 1-fix, final gated state) |
|---|---|
| a | `1a452fe13676312342486506352c21b23972b93a` |
| b | `253c51108750fc5f69e0efa0f97c85062e28edba` |
| c | `7a5ba4cf29f00d8d3b725bb7efae361cc4374c3e` (unchanged, no fix applied) |

All three candidates survive to §4 JUDGE with 2+ survivors (3 of 3).
