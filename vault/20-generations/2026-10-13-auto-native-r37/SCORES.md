# auto-native-r37 — SCORES

Frozen source hash (candidate .tsx/.ts concatenation, `shasum`): `605f7845ed9b46c50bb5acd8d389da4e5f133c94`
Computed before screenshot capture / judging. If this hash changes mid-judging, the round is void —
re-gate and re-capture before resuming.

## Hard gate — `node scripts/gate.mjs --target native --screens evolve-r37-a evolve-r37-b evolve-r37-c`

Environment note: this session's sandbox has no outbound access to `cdn.playwright.dev`, so the
bundled Playwright browser download failed. Used the pre-installed Chromium at
`/opt/pw-browsers/chromium` via `PW_CHROMIUM_PATH` / `CHROME_PATH` env vars, which every gate/capture
script already supports (`process.env.PW_CHROMIUM_PATH || undefined`). No script changes needed.

| screen | tsc | export | render | iframe |
|---|---|---|---|---|
| evolve-r37-a (Referral Rewards) | pass | pass | pass | pass |
| evolve-r37-b (Fee & Commission Statement) | pass | pass | pass | pass |
| evolve-r37-c (Bundle Deal Builder) | pass | pass | pass | pass |

**12/12 clean on first pass — no 1-fix loop needed, no `blockedBy` cross-candidate tsc failures.**
`verdict.pass: true`, `violations: []`.
