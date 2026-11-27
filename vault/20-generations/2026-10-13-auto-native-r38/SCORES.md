# auto-native-r38 — SCORES

Frozen source hash (candidate .tsx/.ts concatenation, `shasum`): `300b3129ccee0f3e97168b7b724029a0285aa331`
Computed before screenshot capture / judging. If this hash changes mid-judging, the round is void —
re-gate and re-capture before resuming.

## Hard gate — `node scripts/gate.mjs --target native --screens evolve-r38-a evolve-r38-b evolve-r38-c`

Same `PW_CHROMIUM_PATH`/`CHROME_PATH` environment workaround as r37 (sandbox has no outbound access
to `cdn.playwright.dev`; pre-installed `/opt/pw-browsers/chromium` used instead).

| screen | tsc | export | render | iframe |
|---|---|---|---|---|
| evolve-r38-a (Help Center) | pass | pass | pass | pass |
| evolve-r38-b (Annual Tax Documents) | pass | pass | pass | pass |
| evolve-r38-c (Return Shipping Label) | pass | pass | pass | pass |

**12/12 clean on first pass — no 1-fix loop needed, no `blockedBy` cross-candidate tsc failures.**
`verdict.pass: true`, `violations: []`.
