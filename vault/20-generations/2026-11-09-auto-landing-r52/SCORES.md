# auto-landing-r52 — HARD GATE SCORES

Freeze hash (post 1-fix, registration-through-judging): `96daea5dc6547187dc33e22c0d34d121882ae8b5`
(`cat app/src/app/landing-evolve/r52/*/*.tsx app/src/app/landing-evolve/r52/*/*.ts | shasum`)

| route | route | types | static | lint | weights | sweep | focus | console | a11y | perf |
|---|---|---|---|---|---|---|---|---|---|---|
| r52/a ("Sell it at the moment buyers actually want it" — listing-age scrubber) | ✅ | ✅ | ✅ (1-fix) | ✅ | 3종 | ✅ | ✅ | ✅ | 100 | 97 |
| r52/b ("Matched Resale, Proven Live" — multi-select must-haves checklist) | ✅ | ✅ | ✅ | ✅ | 3종 | ✅ | ✅ | ✅ | 100 | 97 |
| r52/c ("type a budget, meet your match" — typed numeric budget entry) | ✅ | ✅ | ✅ | ✅ | 3종 | ✅ | ✅ | ✅ | 100 | 90 |

**1st attempt**: a failed `static` (`no-unlisted-font`, `Hero.tsx:57`) — `fontFamily` referenced a JS constant (`DISPLAY_FONT` imported from `tokens.ts`) instead of the literal string the regex-based static checker requires (same known failure mode as `auto-landing-r50/a`, noted in `design-principles.md`). b and c clean on first attempt.

**1-fix**: orchestrator applied directly (mechanical, rule-violation-only) — inlined the literal `"var(--font-display-grotesk)"` in `Hero.tsx`, removed the now-unused `DISPLAY_FONT` import.

**2nd attempt**: a 10/10 clean. All three candidates 10/10, 0 violations.

No blank-frame candidates to report yet (screenshots pending §4).
