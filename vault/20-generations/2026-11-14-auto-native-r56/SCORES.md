# auto-native-r56 — SCORES

Freeze hash (`cat native/src/evolve/r56/*/*.tsx native/src/evolve/r56/*/*.ts | shasum`): `50dd23cfcbcb2724a2bdd0c282b5d009212c22f4`

Gate command: `node scripts/gate.mjs --target native --screens evolve-r56-a evolve-r56-b evolve-r56-c`

Pre-gate environment note: first gate invocation failed with 7376 `tsc` errors (cascading `Cannot find module 'react'`/`'react-native'`), all attributable to `native/node_modules` never having been installed in this session (bootstrap only ran `npm install` at repo root and in `app/`, not `native/`) — not caused by any of the three candidates. Ran `npm install` in `native/`, re-ran `tsc --noEmit` clean (0 errors) across the whole native project (including the pre-existing, unrelated `native/src/auction/LiveAuctionScreen.tsx`), then re-ran the gate. No candidate code was touched to fix this.

| screen | tsc | export | render | iframe |
|---|---|---|---|---|
| evolve-r56-a (Local Meetup Schedule) | pass | pass | pass | pass |
| evolve-r56-b (Price Drop Alert Settings) | pass | pass | pass | pass |
| evolve-r56-c (Seller Tier Progress) | pass | pass | pass | pass |

**12/12 clean on first attempt (no 1-fix needed).** All three candidates survive to JUDGE.

Registration: `native/src/screens.ts` + `native/screens.json` updated centrally by the orchestrator (slugs `evolve-r56-a/b/c`, check strings "Schedule a Meetup" / "Price drop alerts" / "Your seller tier") — candidates did not touch these files themselves, per instructions.
