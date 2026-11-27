# SCORES — auto-dash-r58

Freeze hash (concatenated sources, a+b+c, unchanged from this point through gate through
judging): `4ec0be9e61e7ceb0bb9e8a629a48c0335d023fad`

(An earlier freeze, `5e51db03d4bfd4eaf4ac97a61f6def8c137c52df`, was superseded before any
screenshot capture or judging began — see the fourth bullet below. No judge or lens ever saw that
earlier hash's state.)

All three candidates were self-authored this round (no `Agent` tool available — see DECISION.md
§0 disclosure). Issues found during the orchestrator's own first gate pass were fixed before this
official freeze; the table below is the **final, post-fix, 10/10-clean** verdict for all three.

| Candidate | route | types | static | lint | weights | sweep | focus | console | a11y | perf |
|---|---|---|---|---|---|---|---|---|---|---|
| a — Grainhouse | ✅ | ✅ 0 errors | ✅ 0 | ✅ 0 | ✅ 3 (rendered) | ✅ 0 overflow | ✅ 0 missing | ✅ 0 defects | ✅ 100 | ✅ 96 |
| b — Signalwatch | ✅ | ✅ 0 errors | ✅ 0 | ✅ 0 | ✅ 3 (rendered) | ✅ 0 overflow | ✅ 0 missing | ✅ 0 defects | ✅ 100 | ✅ 95 |
| c — Pulseband | ✅ | ✅ 0 errors | ✅ 0 | ✅ 0 | ✅ 3 (rendered) | ✅ 0 overflow | ✅ 0 missing | ✅ 0 defects | ✅ 100 | ✅ 97 |

## Issues found and fixed before freeze (not a post-judgment §3-1 fix — this happened before any
judging, during the orchestrator's own first-pass authoring/gating, since there was no separate
designer round to send a correction back to)

- **a (Grainhouse)**: first gate pass failed on `types` (a `Card` component missing an `id` prop),
  `lint` (an unescaped apostrophe; a table-header sub-component declared inside the render body,
  tripping `react-hooks/static-components`), and `sweep` (`table-overflow` at five desktop
  widths — the root cause, found by direct Playwright measurement, was an absolutely-positioned
  per-cell tooltip `<div>` contributing its un-clipped width to the enclosing `<table>`'s
  `scrollWidth` even at `opacity:0`; fixed by replacing all per-cell floating tooltips with one
  shared `aria-live` status line above the grid) and `a11y` (`color-contrast` — several
  `text-slate-500` instances on this candidate's dark surfaces, below the catalog's documented
  dark-surface floor of `slate-400`). All fixed; re-gated 10/10 clean.
- **b (Signalwatch)**: first gate pass failed only on `a11y` (`color-contrast` — the active
  segmented-control pill used `bg-emerald-600` with white text, measured by Lighthouse at
  3.65:1 against the 4.5:1 floor for that 12px/400-weight combination); narrowed to
  `emerald-700` for that one solid-fill-with-white-text usage only (every tinted-badge usage of
  `emerald-600` was already passing and left unchanged). Re-gated 10/10 clean.
- **c (Pulseband)**: passed 10/10 clean on the first attempt — both lessons above (the tooltip-
  overflow class of bug, and the dark-surface text-color floor) were applied from the start,
  since this candidate was authored after a and b in the same session.
- **a (Grainhouse), second pass**: a visual-only bug invisible to any gate — the "Utilization" KPI
  tile's delta line hard-coded a `+` prefix in front of a signed number, so once the comparison
  value made the delta negative it rendered the double sign `+-33.4 pts vs last week` (caught by
  direct screenshot review before capturing the frames handed to judging, not by any gate). Fixed
  by making the sign-prefix conditional (matching the pattern the other three KPI tiles already
  used) and adjusting the hand-set prior-week reference value to a plausible one. Re-gated 10/10
  clean; freeze hash updated (see above) before any screenshots were captured for judging.
