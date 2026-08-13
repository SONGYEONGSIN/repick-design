# auto-native-r4 — SCORES

Frozen source hash: `65db908a6a60223d33905cb714c58ebb5151ac56`
(`find native/src/evolve/r4 -name "*.tsx" -o -name "*.ts" | sort | xargs cat | shasum`)

## Gate: `node scripts/gate.mjs --target native --screens evolve-r4-a evolve-r4-b evolve-r4-c`

| candidate | tsc | export | render | iframe |
|---|---|---|---|---|
| a — Browse (search & browse) | pass | pass | pass | pass |
| b — Notifications (activity feed) | pass | pass | pass | pass |
| c — Order History (purchase timeline) | pass | pass | pass | pass |

All 12 checks passed on the first run — no 1-fix needed.

## Orchestrator-independent checks (not machine-gated — the loop's own r1 delta established the hard gate does not check these)
- **SafeAreaView top-level wrap**: confirmed present in all 3 (`BrowseScreen.tsx:245`, `NotificationsScreen.tsx:219`, `OrderHistoryScreen.tsx:344`).
- **Determinism** (no `Math.random`/`Date.now`/argless `new Date()`): grepped all 3 `data.ts` + screen files — only comments referencing the rule, no actual violations.
- **No hardcoded hex colors** outside `tokens.ts`: none found in any candidate.

## Summary
All 3 candidates survive to JUDGE clean. Each explored a genuinely different, previously-uncovered screen type (search/browse, notifications/activity, order history) per the round's assignment — no overlap with existing screens (Watchlist, AI Match, Price Detail, Offer Thread, Account & Preferences, Sell Price Guide, Handoff Check, Owned Grid) or with each other.
