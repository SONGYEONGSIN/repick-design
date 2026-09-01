# auto-landing-r18 — SCORES

Target: landing · Round: auto-landing-r18 · Date: 2026-08-30
Frozen-state hash (post-GENERATE, pre-gate): `dd1307aa4aa32e70746337e569dc2ec371227802`

Gate command: `node scripts/gate.mjs --target web --routes /landing-evolve/r18/<v>`
(run with `PW_CHROMIUM_PATH`/`CHROME_PATH=/opt/pw-browsers/chromium` + `PW_NO_SANDBOX=1` — this sandbox's Playwright/Lighthouse both need the pre-installed Chromium binary and `--no-sandbox` since we run as root; without these, a11y/perf silently report `unavailable` and pass-through instead of actually scoring.)

## Candidate a — "Grading Timeline"

| gate | 1st pass | after 1-fix |
|---|---|---|
| route | pass | — |
| types | pass | — |
| static | pass | — |
| lint | **fail** (2× react/no-unescaped-entities, Hero.tsx:50,60) | pass |
| weights | pass (3종) | — |
| sweep | pass | — |
| focus | **fail** (3건 — testimonial nav dots #19–21, dead `outline-none`+`focus-visible:ring-2` idiom) | **fail again** (same 3 elements — replacement `focus-visible:shadow-[0_0_0_2px_#7A4E0F]` still produces zero detectable pixel change on the sweep browser's before/after focus diff) |
| a11y | fail — 95, promoted-audit hard-fail on `color-contrast` (discount badge `#8F5D12` on composited `#eae2d3` = 4.36:1, needs 4.5:1) | pass — 99 (only bf-cache · landmark-one-main, both record-only) |
| perf | 64 (record only) | 62 (record only) |

**Verdict: DROPPED.** Lint and color-contrast were fixed cleanly in the 1-fix pass, but the focus violation re-failed on the exact same 3 elements after the fix attempt. Per skill §3 ("1-fix 루프... 재통과 → 생존, 재실패 → 탈락"), a second failure on the same gate eliminates the candidate — no second fix attempt. Root cause is plausibly that the sweep script's before/after focus screenshot diff is scoped to the element's own bounding box (7×7px / 18×7px dots), which may not capture a `box-shadow` that paints outside that box — but the rule is mechanical and this is exactly the case it's designed to catch (a designer round-tripping fixes without the orchestrator being able to verify pixel-level correctness itself). Not sent to judge panel.

## Candidate b — "Matching Board"

| gate | 1st pass | after 1-fix |
|---|---|---|
| route | pass | — |
| types | pass | — |
| static | pass | — |
| lint | **fail** (1× react/no-unescaped-entities, ClosingCTA.tsx:58) | pass |
| weights | pass (3종) | — |
| sweep | pass | — |
| focus | pass (0건 누락) | — |
| a11y | pass — 100 (bf-cache only, record-only) | — |
| perf | 79 (record only) | 64 (record only, re-measured on 1-fix run — dev-server perf is inherently noisy, not a fail condition per page-brief-repo §5) |

**Verdict: SURVIVES.** Single lint fix, clean re-gate, all-pass.

## Candidate c — "Trust Score Console"

| gate | result |
|---|---|
| route | pass |
| types | pass |
| static | pass |
| lint | pass (0 violations, 1st try) |
| weights | pass (3종) |
| sweep | pass |
| focus | pass (0건 누락) |
| a11y | pass — 100 (bf-cache only, record-only) |
| perf | 68 (record only) |

**Verdict: SURVIVES.** Clean pass on first attempt, no 1-fix needed.

## Survivors for §4 JUDGE

- **b** (Matching Board)
- **c** (Trust Score Console)

Candidate a is dropped per the hard-gate 1-fix rule above.
