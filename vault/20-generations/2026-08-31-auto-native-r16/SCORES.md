# auto-native-r16 — SCORES

frozen-state hash (`cat native/src/evolve/r16/*/*.tsx native/src/evolve/r16/*/*.ts | shasum`): `ae8872fe2e1c5cfe1859de2f1736422db9ece751`

env note: `native/` had no installed dependencies at session start (`npm install` run). Root `playwright-core@1.61.1` requests chromium revision 1228, but the sandbox's pre-cached browser is revision 1194 at `/opt/pw-browsers/chromium` — `native/scripts/validate.sh` already supports `PW_CHROMIUM_PATH` override, so gate/capture were run with `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`. Environment-specific fix, not a skill change.

## Hard gate — `node scripts/gate.mjs --target native --screens evolve-r16-a evolve-r16-b evolve-r16-c`

All 3 candidates passed 12/12 on the first attempt (no 1-fix consumed).

| screen | tsc | export | render | iframe |
|---|:--:|:--:|:--:|:--:|
| evolve-r16-a (Offer Comparison) | ✅ | ✅ | ✅ | ✅ |
| evolve-r16-b (Bulk Relist) | ✅ | ✅ | ✅ | ✅ |
| evolve-r16-c (Report Listing) | ✅ | ✅ | ✅ | ✅ |

`verdict.pass: true`, `violations: []`.
