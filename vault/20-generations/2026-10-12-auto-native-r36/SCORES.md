# auto-native-r36 — SCORES

Freeze hash (all candidate sources, `cat .../*/*.tsx .../*/*.ts | shasum`): `aac34ae09ddd9af632da7a6b1363907f6da1a448` (verified unchanged before and after gate run).

`node scripts/gate.mjs --target native --screens evolve-r36-a evolve-r36-b evolve-r36-c`

| candidate | tsc | export | render | iframe |
|---|---|---|---|---|
| a (Seller Payout Hold Review) | 통과 | 통과 | 통과 | 통과 |
| b (Minimum Offer Threshold) | 통과 | 통과 | 통과 | 통과 |
| c (Return Inspection Decision) | 통과 | 통과 | 통과 | 통과 |

12/12 clean on first attempt — no 1-fix loop needed, no candidate dropped.

Render-check strings used: a="Payout On Hold", b="Minimum Offer Settings", c="Return Inspection".
