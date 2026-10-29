# auto-native-r40 — SCORES

Freeze hash (`cat native/src/evolve/r40/*/*.tsx native/src/evolve/r40/*/*.ts | shasum`):
`11fe064a8e103968dab135f654dfa8ebc2cc7c3b`

Environment note: this sandbox had never run `npm install` inside `native/` (no
`node_modules`), which made the first gate run fail all 3 candidates' `tsc` step with a
cascading `TS17004`/missing-types error from a *pre-existing* file
(`native/src/auction/LiveAuctionScreen.tsx`), unrelated to any r40 candidate. Fixed by
running `npm install` in `native/` before gating (one-time environment setup, not a
candidate or canon issue). Second issue: this sandbox's pre-installed Playwright chromium
revision (1194) doesn't match what `playwright@^1.61.1` expects by default (1228), so
`chromium.launch()` failed until `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium` was
exported before invoking `gate.mjs`/`validate.sh` (already supported via
`executablePath: process.env.PW_CHROMIUM_PATH || undefined` in `native/scripts/validate.sh`
— no script changes needed, just the env var at invocation time).

## `node scripts/gate.mjs --target native --screens evolve-r40-a evolve-r40-b evolve-r40-c`

All candidates passed 12/12 on the first attempt — zero 1-fix loops, zero candidates dropped.

| screen | tsc | export | render | iframe |
|---|---|---|---|---|
| evolve-r40-a (Offer Status) | ✅ | ✅ | ✅ | ✅ |
| evolve-r40-b (Return Drop-off Points) | ✅ | ✅ | ✅ | ✅ |
| evolve-r40-c (Payout Method Order) | ✅ | ✅ | ✅ | ✅ |

`verdict.violations`: `[]`
