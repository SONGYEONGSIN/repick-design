# auto-landing-r55 — SCORES

Freeze hash (pre- and post-gate, unchanged): `e961fa6de590503b63f6fd4fd318999672864b9a`
(`cat app/src/app/landing-evolve/r55/*/*.tsx app/src/app/landing-evolve/r55/*/*.ts | shasum`)

Target: `landing` — drawn uniformly from `[dash, landing]` (native excluded: already drawn today via
the Monday weekly-cadence rule for this scheduled session's round 1, `auto-native-r58`).

Command: `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium node scripts/gate.mjs --target web --routes
/landing-evolve/r55/<v>` against a dev server on `localhost:3100` started for this round.

| Candidate | route | types | static | lint | weights | sweep | focus | console | a11y | perf |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| a — Condition Grade Walkthrough | ✅ | ✅ | ✅ | ✅ | 3종 | ✅ | ✅ | ✅ | 100 | 99 |
| b — Authenticity Confidence Meter ("Provenance") | ✅ | ✅ | ✅ | ✅ | 3종 | ✅ | ✅ | ✅ | 100 | 98 |
| c — Offer vs. Ask Negotiator ("Meetpoint") | ✅ | ✅ | ✅ | ✅ | 3종 | ✅ | ✅ | ✅ | 100 | 99 |

30/30 gates pass on first attempt across all 3 candidates. `violations: []` for all three. No 1-fix
used by any candidate.
