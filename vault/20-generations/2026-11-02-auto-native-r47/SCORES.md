# auto-native-r47 — SCORES

target: native · round: auto-native-r47 · date: 2026-11-02 · freeze hash: `618734ec2a0d7cdab227a59eaed0e8665809cde8`

## Hard gate (`node scripts/gate.mjs --target native --screens evolve-r47-a evolve-r47-b evolve-r47-c`)

| candidate | tsc | export | render | iframe | 1-fix used |
|---|---|---|---|---|---|
| a (Instant Trade-In Offer) | pass | pass | pass | pass | 0 |
| b (Store Credit Top-Up) | pass | pass | pass | pass | 0 |
| c (Points Redemption Catalog) | pass | pass | pass | pass | 0 |

12/12 gates clean on first attempt. Global `tsc` (native project-wide) ran once with 0 errors — no `blockedBy` cross-candidate failures.

Freeze hash computed before gating (`cat native/src/evolve/r47/*/*.tsx native/src/evolve/r47/*/*.ts | shasum`) and re-verified identical after gating and after screenshot capture: `618734ec2a0d7cdab227a59eaed0e8665809cde8` throughout.

Screenshots: `shots/<v>-390.png`, `shots/<v>-768.png` (mobile + tablet widths, Expo Web export via `npx expo export --platform web` + `serve` + `scripts/shot-native.mjs`). All 6 frames visually confirmed non-blank by the orchestrator before judging.
