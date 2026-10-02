# auto-native-r28 — hard gate

Target: native. Candidates: a = "Appeal Your Suspension" (blocked-workflow band), b = "Tax Export Tagging" (selection-driven contextual bar), c = "Shipping Protection Claim" (read-only completed-record + persistent action bar).

Frozen source hash (SHA-1 over all `.tsx`/`.ts` in `native/src/evolve/r28/*/`): `c3c2abd1ba10e65e57d52763792c27c4f8d9e35d`

## Hard gate (12/12 clean on first attempt, no 1-fix needed)

| screen | tsc | export | render | iframe |
|---|---|---|---|---|
| evolve-r28-a | pass | pass | pass | pass |
| evolve-r28-b | pass | pass | pass | pass |
| evolve-r28-c | pass | pass | pass | pass |

`node scripts/gate.mjs --target native --screens evolve-r28-a evolve-r28-b evolve-r28-c` → `pass:true`, `violations:[]`.

Screenshots: `shots/<v>-390.png` and `shots/<v>-768.png` (Expo Web export → `serve` on :8091 → Playwright screenshot), one per candidate per width. All 6 captures show distinct, correctly-rendered screens (manually inspected — no stale-Metro-bundle cross-contamination, the known risk this repo's `validate.sh` documents and guards against with `--clear`).
