# auto-native-r35 — SCORES

Freeze hash (all candidate sources, `cat .../*/*.tsx .../*/*.ts | shasum`): `339c062cd66b7e1e49ad9a3011faf55f211029c8` (verified unchanged before and after gate run).

`node scripts/gate.mjs --target native --screens evolve-r35-a evolve-r35-b evolve-r35-c`

| candidate | tsc | export | render | iframe |
|---|---|---|---|---|
| a (Seller Response Templates) | 통과 | 통과 | 통과 | 통과 |
| b (Local Pickup Zones) | 통과 | 통과 | 통과 | 통과 |
| c (Listing Boost Credits) | 통과 | 통과 | 통과 | 통과 |

12/12 clean on first attempt — no 1-fix loop needed, no candidate dropped.

Render-check strings used: a="Response Templates", b="Manage Pickup Zones", c="Boost Credits".
