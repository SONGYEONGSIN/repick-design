# auto-native-r51 — SCORES

target: native · round: auto-native-r51 · date: 2026-11-06

## Candidates
- **a** — "Propose an Item Swap" (Item Swap Proposal) — externally-gated blocked-waiting-on-other-party band, no self-unblock.
- **b** — "Combine Shipments" — selection-count-derived contextual bar, mutually exclusive with post-confirm undo banner.
- **c** — "Authenticator Review Queue" — claim-based row lock (authenticator-staff persona, distinct from existing buyer/seller screens).

## Hard gate — `node scripts/gate.mjs --target native --screens evolve-r51-a evolve-r51-b evolve-r51-c`

| candidate | tsc | export | render | iframe |
|---|---|---|---|---|
| a | 통과 | 통과 | 통과 | 통과 |
| b | 통과 | 통과 | 통과 | 통과 |
| c | 통과 | 통과 | 통과 | 통과 |

**12/12 clean on first attempt. 0 violations. 0 candidates used their 1-fix opportunity. 0 `blockedBy` cross-candidate failures.**

## Freeze hash

`cat native/src/evolve/r51/*/*.tsx native/src/evolve/r51/*/*.ts | shasum`:

```
8086bcaa2a4ff9c62afde9802a625e35b2b8b8d6
```

Unchanged from registration through gate. Screenshot capture and judging must observe this same hash.

## Environment note

This sandbox could not download Playwright's own Chromium (network-blocked to cdn.playwright.dev). Gate/screenshot steps ran with `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium PW_NO_SANDBOX=1 CHROME_PATH=/opt/pw-browsers/chromium` pointed at a pre-installed Chromium binary — no script changes, these are pre-existing env vars the repo's own scripts already read.
