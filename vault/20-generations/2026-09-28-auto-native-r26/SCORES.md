# auto-native-r26 — SCORES

source hash (frozen before gate): `ecaa56c4ac084869274505a682a58a89e11486ca`

## Hard gate (`node scripts/gate.mjs --target native --screens evolve-r26-a evolve-r26-b evolve-r26-c`)

| candidate | tsc | export | render | iframe |
|---|---|---|---|---|
| a (File a Warranty Claim) | pass | pass | pass | pass |
| b (Seller Rating Summary) | pass | pass | pass | pass |
| c (Linked Bank Accounts) | pass | pass | pass | pass |

12/12 pass on first attempt — no 1-fix loop needed. No `blockedBy` — global `tsc` clean across all three from the start.
