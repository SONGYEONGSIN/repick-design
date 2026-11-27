# auto-native-r58 — SCORES

Freeze hash (pre- and post-gate, unchanged): `48ed5bc164f6e51c23b9291218f2e099435acdd5`
(`cat native/src/evolve/r58/*/*.tsx native/src/evolve/r58/*/*.ts | shasum`)

Target: `native` (forced — today 2026-11-16 is UTC Monday and `round-budget.mjs` returned N=1,
triggering SKILL.md §0's native weekly-cadence rule: "N=1이면 그날은 native 한 라운드만 돈다").

Command: `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium node scripts/gate.mjs --target native --screens evolve-r58-a evolve-r58-b evolve-r58-c`

| Candidate | tsc | export | render | iframe | 1-fix used |
|---|:--:|:--:|:--:|:--:|:--:|
| a — Search Preset Priority | ✅ | ✅ | ✅ | ✅ | no |
| b — Mis-description Review Queue | ✅ | ✅ | ✅ | ✅ | no |
| c — Select a Pickup Locker | ✅ | ✅ | ✅ | ✅ | no |

12/12 gates pass on first attempt. `violations: []`. No `blockedBy` cross-candidate failures (global
`tsc` clean across all three on the first run). No post-judgment section 3-1 fix anticipated to be
needed given a clean gate, but will be applied only if judging surfaces a rule violation in the winner.
