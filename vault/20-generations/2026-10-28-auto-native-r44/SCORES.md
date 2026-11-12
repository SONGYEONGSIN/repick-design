# auto-native-r44 — SCORES

Freeze hash (cat all candidate .tsx/.ts, shasum): `2ba8d07a5ff4d081fb7515aa4eacf1b938eae741`

## Hard gate (`node scripts/gate.mjs --target native --screens evolve-r44-a evolve-r44-b evolve-r44-c`)

| candidate | tsc | export | render | iframe |
|---|---|---|---|---|
| a (Authenticity Escalation Case) | ✅ | ✅ | ✅ | ✅ |
| b (Schedule Return Pickup) | ✅ | ✅ | ✅ | ✅ |
| c (Seller Reputation Tier) | ✅ | ✅ | ✅ | ✅ |

12/12 clean on first attempt. Zero 1-fix loops. Zero candidates dropped at this stage.

`verdict.pass: true`, `verdict.violations: []`.
