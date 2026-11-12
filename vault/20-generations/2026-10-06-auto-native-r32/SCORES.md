# auto-native-r32 — SCORES

Target: native · Round: auto-native-r32 (second of 2 sequential rounds in this scheduled run) · Date: 2026-10-06

Source hash (frozen before gate, `cat native/src/evolve/r32/*/*.tsx native/src/evolve/r32/*/*.ts | shasum`): `905ff84ee062b3d623279317c2952ac4535966f6`

## Candidates

| v | Screen | Band form |
|---|---|---|
| a | Archive Conversations | selection-driven contextual bar + post-action undo |
| b | Linked Social Accounts | no fixed band — per-row 3-state (normal/confirming/locked-primary), single hoisted live region |
| c | Appeal This Review | blocked-workflow state machine + live moderation-preview card |

## Hard gate (`node scripts/gate.mjs --target native --screens evolve-r32-a evolve-r32-b evolve-r32-c`)

12/12 clean on first attempt — **no 1-fix needed**.

| Screen | tsc | export | render | iframe |
|---|:--:|:--:|:--:|:--:|
| evolve-r32-a | 통과 | 통과 | 통과 | 통과 |
| evolve-r32-b | 통과 | 통과 | 통과 | 통과 |
| evolve-r32-c | 통과 | 통과 | 통과 | 통과 |

`violations`: `[]`
