# auto-native-r31 — SCORES

Target: native · Round: auto-native-r31 · Date: 2026-10-06

Source hash (frozen before gate, `cat native/src/evolve/r31/*/*.tsx native/src/evolve/r31/*/*.ts | shasum`): `0721373760afbd95dbbbf36d6e0827fbf600b331`

## Candidates

| v | Screen | Band form |
|---|---|---|
| a | Export Account Data | blocked-workflow state machine |
| b | Security Activity Log | persistent always-visible action bar (read-only record) |
| c | Price Drop Alerts | no fixed chrome — top live counter + per-row inline editor |

## Hard gate (`node scripts/gate.mjs --target native --screens evolve-r31-a evolve-r31-b evolve-r31-c`)

12/12 clean on first attempt — **no 1-fix needed**.

| Screen | tsc | export | render | iframe |
|---|:--:|:--:|:--:|:--:|
| evolve-r31-a | 통과 | 통과 | 통과 | 통과 |
| evolve-r31-b | 통과 | 통과 | 통과 | 통과 |
| evolve-r31-c | 통과 | 통과 | 통과 | 통과 |

`violations`: `[]`
