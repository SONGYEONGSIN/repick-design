# auto-native-r39 — SCORES

Source hash at freeze: `78977036af747741cc7c118bb3a8a520bbe5e6fb`
(recomputed after the global export fix below — see note)

## Hard gate (`node scripts/gate.mjs --target native --screens evolve-r39-a evolve-r39-b evolve-r39-c`)

**First pass**: global block — all 12/12 failed with `blockedBy: tsc 실패`, single root cause:
`native/src/evolve/r39/c/BackupCodesScreen.tsx` exported `BackupCodesScreen` as a named export only;
`screens.ts` imports it as default (`import EvolveR39C from "./evolve/r39/c/BackupCodesScreen"`).
Per skill §3 `blockedBy` rule, this is a shared-tsc-project failure attributable to candidate c only,
and does not consume any candidate's 1-fix budget since a/b were never themselves broken. Orchestrator
fix: added `export default BackupCodesScreen;` at end of file (no other change).

Also required before any gate could run at all: `native/node_modules` did not exist (only `native/`'s
own package.json was present, un-installed) — ran `npm install` inside `native/` as an environment
bootstrap step, not a skill step.

**Second pass (after the one-line default-export fix)**: 12/12 clean.

| screen | tsc | export | render | iframe |
|---|---|---|---|---|
| evolve-r39-a (Price Match Request) | pass | pass | pass | pass |
| evolve-r39-b (Vacation Mode) | pass | pass | pass | pass |
| evolve-r39-c (Two-Factor Backup Codes) | pass | pass | pass | pass |

`verdict.pass: true`, `violations: []`.
