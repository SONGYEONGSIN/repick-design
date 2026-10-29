# auto-native-r23 — SCORES

Target: native · Round: 23 · Date: 2026-09-21
Freeze hash: `299af9daa504ad2055f3470f2f7921d814ad29df` (all candidate `.tsx`/`.ts` concatenated, post-1-fix — unchanged since this hash was taken, no post-freeze edits before judging)

## Candidates
- **a** — Protection Coverage (Buyer Protection Coverage) — read-only completed-record band-form, conditional always-real action bar ("File a Claim", vanishes once claim allowance is used up)
- **b** — Payment Methods (Saved Payment Methods) — row-scoped destructive-confirm-conversion, single-active-row exclusivity invariant
- **c** — Manage Photos (Listing Photo Manager) — selection-driven contextual bar (`selectedCount > 0` derived), mutually exclusive with a post-delete undo strip

## Hard gate — `node scripts/gate.mjs --target native --screens evolve-r23-a evolve-r23-b evolve-r23-c`

### Run 1 (pre-fix)
| screen | tsc | export | render | iframe |
|---|---|---|---|---|
| evolve-r23-a | blockedBy (b/c tsc) | blockedBy | blockedBy | blockedBy |
| evolve-r23-b | **FAIL** — 2× TS2307 `Cannot find module '../../tokens'` (`PaymentMethodsScreen.tsx:15`, `components.tsx:4`) | blocked | blocked | blocked |
| evolve-r23-c | **FAIL** — 2× TS2307 `Cannot find module '../../tokens'` (`PhotoManagerScreen.tsx:21`, `components.tsx:4`) | blocked | blocked | blocked |

Root cause: both b and c's files live at `native/src/evolve/r23/<v>/`, three directory levels below `native/src/`, but imported `tokens` with only two `../` (`"../../tokens"`) instead of three (`"../../../tokens"`). Candidate a used the correct three-level path from the start. Per skill §3 `blockedBy` rule, candidate a's blocked-by-others failure does not consume a's 1-fix opportunity — only b and c did, and only for this specific import-path defect (1-fix scope was restricted to exactly this).

### Run 2 (post 1-fix)
**12/12 pass.** All three candidates: tsc ✅ · export ✅ · render ✅ · iframe ✅.

## Notes
- `native` target needs no port-3100 dev server (gate.mjs's native branch self-serves Expo Web export on 8091 per screen).
- Registered in `native/src/screens.ts` (`COMPONENTS["evolve-r23-a"|"evolve-r23-b"|"evolve-r23-c"]`) and `native/screens.json` (check strings: "Protection Coverage" / "Payment Methods" / "Manage Photos") by the orchestrator, not by the designer agents — avoids 3 parallel agents writing the same shared registry files concurrently (a deviation from the literal skill text, noted for transparency; functionally equivalent, no candidate touched another candidate's files).
