# auto-dash-r48 — SCORES

**self_judged: true** — see DECISION.md sec0 (same deviation as round 1 of this scheduled
session, `auto-landing-r39`: no Agent/Task subagent-spawn tool in this execution
environment). Not eligible for `/dash-falsify` promotion regardless of outcome.

Freeze hash (`cat r48/*/*.tsx | shasum`): `75d60e11e7c9497d69da6daaa2a717436c594915` — taken
after the 1-fix round below completed and before screenshots/judging; unchanged through
capture and judging.

Lighthouse env note: same as round 1 — `CHROME_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`
+ `PW_NO_SANDBOX=1` set for every gate run, so a11y/perf are real measurements, not
`unavailable`.

| gate | a (Pulseboard) 1st → final | b (Rundate) 1st → final | c (Vantage) 1st (clean) |
|---|---|---|---|
| route | OK | OK | OK |
| types | 0 | 0 | 0 |
| static | 0 | 0 | 0 |
| lint | **1 warning → 0** | **1 warning → 0** | 0 |
| weights (렌더 실측) | 3종 | 3종 | 3종 |
| sweep | 0 | 0 | 0 |
| focus | 0건 | 0건 | 0건 |
| console | **13 hydration errors → 0** | 0 | 0 |
| a11y | **84 → 100** | **96 → 100** | 100 |
| perf (기록만) | 75 | 67 | 68 |

**a and b each used their one allowed 1-fix; c passed clean on the first attempt.** Both
fixes are documented in `candidates/a.md`/`candidates/b.md` and summarized here:

- **a** 1st-pass failures: `jsx-a11y/role-supports-aria-props` (`aria-sort` placed on a
  `<button>` instead of its parent `<th>`), 13 hydration-mismatch errors (root cause: the
  service card was a `<button>` wrapping further `<button>` elements for the sparkline's
  focusable points — invalid HTML content model, button-in-button, which the browser's
  parser auto-corrects differently server- vs client-side), and a11y 84 (`color-contrast`
  on `text-zinc-400` labels on white · `target-size` on 12px sparkline-point buttons).
  Fix: moved `aria-sort` to the `<th>`, restructured the card so only the service name is
  its own small `<button>` (sparkline points are siblings, not nested), bumped the point
  buttons to 24×24px hit targets, bumped the two `zinc-400` labels to `zinc-500`. Re-gate:
  10/10 clean, a11y 100.
- **b** 1st-pass failures: `@typescript-eslint/no-unused-vars` (dead `INK` constant) and
  a11y 96 (`color-contrast` + `label-content-name-mismatch` — see below). Fix: removed the
  unused constant; replaced the per-day intensity encoding (which varied the *cell's own
  background* behind constant white text, failing contrast at high counts) with a
  constant-background cell plus a separate `aria-hidden` decorative bottom bar whose
  opacity alone carries intensity; removed the custom `aria-label` on each day button
  (whose concatenated visible text, e.g. "142", wasn't a literal substring of a hand-written
  description string) in favor of a trailing `sr-only` span, so the accessible name is
  derived from content with no competing label. Re-gate: 10/10 clean, a11y 100.

## Environment note — display-face CDN unavailable (applies equally to all three)

Same root cause as round 1 (`cdn.jsdelivr.net:443` returns 403 through this sandbox's
egress proxy — confirmed again via `recentRelayFailures` in the proxy status during this
round's gate runs). All three candidates reference an allow-listed `--font-display-*`
variable correctly (static gate clean); runtime rendering falls back to each face's CSS
fallback chain. Not a candidate defect, not a judging differentiator.

## Self-discovered findings beyond the hard gate (neither is hard-gate-checkable; both fed
## into judging and §5/§6 below — not fixed post-freeze, per `dash-brief-v3` §3-1's scope
## limit to rule violations only)

1. **b — data-integrity mismatch**: the calendar cell's decorative "posts published" count
   (from a fixed formula, `countsFor()`) and the Day-detail panel's actual post list (from
   the real `POSTS` array) are independent data sources that disagree on Oct 14 (cell shows
   1, detail panel correctly shows 2 real posts). Violates `dash-brief-v3`'s "합계 정합"
   data-discipline principle. See `candidates/b.md` for detail — this is this round's LEARN
   delta (§5).
2. **c — radar top-axis label clipped by the SVG viewBox** (`y` goes negative for the
   "Quality" axis at `-90°`). This independently reproduces the existing `auto-dash-r45` L1
   delta, which explicitly named radar as a generalization target. Promoted to L2 in §6
   (`supersedes: 'auto-dash-r45'`). Mitigated by a redundant always-visible value list below
   the chart (unlike r45, where the clipped label was the only value-carrying surface).

## Shots

16 frames per candidate, no blanks, no capture errors. Judge frame budget: `<v>-1440.png` +
`<v>-390.png` (2 of 16 per candidate — fewer than round 1's 3, disclosed as a deliberate
time-budget reduction for this second round of the scheduled session). The data-integrity
and label-clipping findings above were both found by comparing these frames directly against
each other / against the source, not from a wider frame set.
