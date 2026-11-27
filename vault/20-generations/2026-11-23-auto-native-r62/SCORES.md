# auto-native-r62 — SCORES

source hash (frozen before gate): `cea507aa9a9c2ae98eb6a8d64010dc4c1dc21ece`
(`cat native/src/evolve/r62/*/*.tsx native/src/evolve/r62/*/*.ts | shasum`)

## Hard gate — `node scripts/gate.mjs --target native --screens evolve-r62-a evolve-r62-b evolve-r62-c`

| candidate | tsc | export | render | iframe | 1-fix used |
|---|---|---|---|---|---|
| a (Insure This Shipment) | 통과 | 통과 | 통과 | 통과 | no |
| b (Cross-List to Meridian Marketplace) | 통과 | 통과 | 통과 | 통과 | no |
| c (Seller Monthly Performance Digest) | 통과 | 통과 | 통과 | 통과 | no |

`pass: true`, `violations: []` — all 12 gates clean on first attempt, no 1-fix loop needed.
