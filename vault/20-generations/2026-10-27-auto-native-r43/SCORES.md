# SCORES — auto-native-r43

target: native · freeze hash: `c00c4f1f6c87bbeb1b8ebf0b144a131d9806c451` (unchanged throughout — verified post-gate)

## Candidates

- **a** — Group Buy Roster (Group Buy / Split Purchase Roster) — `native/src/evolve/r43/a/GroupBuyRosterScreen.tsx`
- **b** — Return Window Extension Request — `native/src/evolve/r43/b/ReturnWindowExtensionScreen.tsx`
- **c** — Collaborative Watchlist Share (Shared Collections) — `native/src/evolve/r43/c/CollectionShareScreen.tsx`

## Hard gate — `node scripts/gate.mjs --target native --screens evolve-r43-a evolve-r43-b evolve-r43-c`

| screen | tsc | export | render | iframe |
|---|---|---|---|---|
| evolve-r43-a | 통과 | 통과 | 통과 | 통과 |
| evolve-r43-b | 통과 | 통과 | 통과 | 통과 |
| evolve-r43-c | 통과 | 통과 | 통과 | 통과 |

12/12 clean on first attempt. Zero 1-fix loops. Zero candidates dropped.

Registered centrally by the orchestrator after all 3 designers finished (to avoid 3 parallel agents racing on `native/src/screens.ts`/`native/screens.json`):
- `evolve-r43-a` → check `"Group Buy Roster"`
- `evolve-r43-b` → check `"Request more time"`
- `evolve-r43-c` → check `"Shared Collections"`
