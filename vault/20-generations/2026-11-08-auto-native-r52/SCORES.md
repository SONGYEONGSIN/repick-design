# auto-native-r52 — SCORES

target: native · round: auto-native-r52 · date: 2026-11-08

freeze hash (`cat native/src/evolve/r52/*/*.tsx native/src/evolve/r52/*/*.ts | shasum`): `4e669aac821d328faebd484ff4fc076cb359df0a`

## HARD GATE — `node scripts/gate.mjs --target native --screens evolve-r52-a evolve-r52-b evolve-r52-c`

First attempt (after installing `native/` deps, missing at environment bootstrap — see DECISION §0): **12/12 pass, 0 violations, 0 candidates used their 1-fix opportunity, 0 `blockedBy` cross-candidate failures (global `tsc` 0 errors).**

| screen | tsc | export | render | iframe |
|---|---|---|---|---|
| evolve-r52-a (Flash Drop Raffle) | pass | pass | pass | pass |
| evolve-r52-b (Curate Featured Items) | pass | pass | pass | pass |
| evolve-r52-c (Split Delivery Addresses) | pass | pass | pass | pass |

All 3 candidates survive to JUDGE.
