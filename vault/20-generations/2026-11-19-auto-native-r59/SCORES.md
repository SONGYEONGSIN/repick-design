# auto-native-r59 — HARD GATE

registered: `native/screens.ts` (`EvolveR59A/B/C` imports + `COMPONENTS` entries), `native/screens.json` (check strings).

| candidate | tsc | export | render | iframe | pass |
|---|---|---|---|---|---|
| evolve-r59-a (Bulk Discount Campaign) | pass | pass | pass | pass | **true** |
| evolve-r59-b (Warehouse Intake Scan) | pass | pass | pass | pass | **true** |
| evolve-r59-c (Compare Seller Plans) | pass | pass | pass | pass | **true** |

12/12 clean on the first attempt — no 1-fix needed. All 3 candidates survive to §4 JUDGE.

Note for judge panel: candidate a's own self-report flags a genuine prior-art overlap with `native/src/evolve/r48/c` (BulkPriceDropScreen) — same macro-shape (multi-select listings + percent discount + selection-count band). Designer's claimed differentiation: continuous +/- stepper driving one shared discount vs. r48/c's discrete per-row preset chips that commit immediately into persistent per-row state with per-row undo; candidate a only shows a pre-commit live preview and commits once for the whole screen via a single phase transition, no per-row undo. Lens3 should verify this against r48/c directly, not take the self-report at face value.
