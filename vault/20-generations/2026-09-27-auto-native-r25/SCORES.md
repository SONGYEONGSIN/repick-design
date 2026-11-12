# auto-native-r25 — HARD GATE (§3)

Command: `node scripts/gate.mjs --target native --screens evolve-r25-a evolve-r25-b evolve-r25-c`
Env: `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium PW_NO_SANDBOX=1 CHROME_PATH=/opt/pw-browsers/chromium` (sandbox Chromium revision 1194 vs native's requested 1228 — bypassed via `PW_CHROMIUM_PATH`, same precedent as `auto-native-r16`/`r20`, no skill/gate script changes).

All 3 candidates passed all 4 gates on the **first attempt** — no 1-fix loop needed.

| Screen | tsc | export | render | iframe |
|---|:--:|:--:|:--:|:--:|
| evolve-r25-a (Trade-In Appraisal) | ✅ | ✅ | ✅ | ✅ |
| evolve-r25-b (Delivery Receipt) | ✅ | ✅ | ✅ | ✅ |
| evolve-r25-c (Saved Searches) | ✅ | ✅ | ✅ | ✅ |

Render check strings: a="Trade-In Appraisal" · b="Delivery Receipt" · c="Saved Searches" (registered in `native/screens.json`).

`violations: []`

## Frozen source hash (pre-judge)

```
cat native/src/evolve/r25/*/*.tsx native/src/evolve/r25/*/*.ts | shasum
```
→ `08e2a7a55126811b48f755124c1be8964b9c4463`

## Candidate summaries

- **a — Trade-In Appraisal** (blocked-workflow bottom-band state machine, own vocabulary `dockedBar*`/`holdUp`/`revealCheckpoint`): buyer submits an item for trade-in credit instead of peer-to-peer listing; live estimated-credit hero readout derived from 4 yes/no condition disclosures + drop-off method + payout preference; band names the specific unresolved question and scrolls to it; destructive "Withdraw request" converts the band into Keep-it/Withdraw in place.
- **b — Delivery Receipt** (persistent always-visible action bar, per read-only-completed-record doctrine): read-only post-transaction receipt (item, price breakdown, delivery details, 4-step timeline, seller info); Share/Save/Report-an-issue bar, each a real state change; Report-an-issue converts the bar into Cancel/Confirm-report in place.
- **c — Saved Searches** (selection-driven contextual bottom dock, own vocabulary `SelectionDock`/`RecoveryRow`): 7 standing saved searches with new-match counts / paused pills; multi-select unlocks Pause/Resume (disabled + explained on mixed active/paused selection) and Merge (enabled only for a same-category pair, computes a real merged search via `buildMergedSearch`); destructive delete converts the dock into Cancel/Confirm in place, exclusive with the post-delete undo row.

No candidate touched `native/screens.ts`/`screens.json` — orchestrator registered all 3 after generation completed (slugs `evolve-r25-{a,b,c}`).
