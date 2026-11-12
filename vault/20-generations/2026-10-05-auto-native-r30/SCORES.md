# auto-native-r30 — SCORES

소스 동결 SHA-1: `2e0c28d24c4430b68ce119683f946a1db7483d1f`
(`cat native/src/evolve/r30/*/*.tsx native/src/evolve/r30/*/*.ts | shasum`)

`node scripts/gate.mjs --target native --screens evolve-r30-a evolve-r30-b evolve-r30-c` — **12/12 1차 통과, 1-fix 불요, blockedBy 없음.**

| screen | tsc | export | render | iframe |
|---|---|---|---|---|
| evolve-r30-a (Pro Seller Plan) | 통과 | 통과 | 통과 | 통과 |
| evolve-r30-b (Linked Marketplaces) | 통과 | 통과 | 통과 | 통과 |
| evolve-r30-c (Promo Code Wallet) | 통과 | 통과 | 통과 | 통과 |

violations: 없음.
