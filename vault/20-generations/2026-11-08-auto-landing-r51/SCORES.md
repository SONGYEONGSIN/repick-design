# auto-landing-r51 — SCORES

target: landing · round: auto-landing-r51 · date: 2026-11-08

freeze hash (pre-fix, `find app/src/app/landing-evolve/r51 -type f \( -name "*.ts" -o -name "*.tsx" \) | sort | xargs cat | shasum`): `a63b6833b851fb314b948e0a83ba206b77c99ac4`
freeze hash (post-1-fix): `412563360c806c6f1f67cd26e76cf02d2abe67c2`

## HARD GATE — `node scripts/gate.mjs --target web --routes /landing-evolve/r51/a /landing-evolve/r51/b /landing-evolve/r51/c`

### 1st attempt — 3 violations across 2 candidates
- **a** ("Pairwise Duel Weight Builder"): clean, 0 violations.
- **b** ("Drag-to-Reorder Priority Ladder"): `lint` `react/no-unescaped-entities` ×2 (`ClosingCta.tsx:49` "That's", `ValueSplit.tsx:44` "repick's").
- **c** ("Draw-Your-Budget Curve"): `static` `no-unlisted-font` ×1 (`Hero.tsx:37` — `fontFamily` referenced a JS const (`DISPLAY_FONT` from `tokens.ts`) instead of the literal `var(--font-display-mono)` string the regex requires directly at the call site — the same known failure mode as a prior round's `auto-landing-r50/a`).

### 1-fix
- **b**: both apostrophes replaced with `&apos;`.
- **c**: inlined the literal `"var(--font-display-mono)"` directly in the `style` prop, dropped the now-unused `DISPLAY_FONT` import.

### 2nd attempt — **10/10 clean, 0 violations**, a11y 100, perf 90.

| route | route | types | static | lint | weights | sweep | focus | console | a11y | perf |
|---|---|---|---|---|---|---|---|---|---|---|
| a (Pairwise Duel) | pass | pass | pass | pass | 3종 | pass | pass | pass | 100 | 90 |
| b (Priority Ladder) | pass | pass | pass | pass (1-fix) | 3종 | pass | pass | pass | 100 | 90 |
| c (Budget Curve) | pass | pass | pass (1-fix) | pass | 3종 | pass | pass | pass | 100 | 90 |

All 3 candidates survive to JUDGE.
