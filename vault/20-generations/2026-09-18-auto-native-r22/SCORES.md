# auto-native-r22 — SCORES

Target: native · Round: 22 · Date: 2026-09-18

Freeze hash (candidate source, pre-gate): `8f4247e29f736462b94d4041224e77cb031b179a`
(`cat native/src/evolve/r22/*/*.tsx native/src/evolve/r22/*/*.ts | shasum`)

## Candidates
- **a** — Return & Refund Request (buyer-facing, blocked-workflow band)
- **b** — Active Sessions (account security, no fixed band, per-row inline destructive-confirm)
- **c** — Consignment Drop-off Scheduling (seller-facing, blocked-workflow band, open-hours-driven slot derivation)

## Hard gate — `node scripts/gate.mjs --target native --screens evolve-r22-a evolve-r22-b evolve-r22-c`

### Run 1 (initial)
- `evolve-r22-a/tsc`: pass (0 errors)
- `evolve-r22-b/tsc`: pass (0 errors)
- `evolve-r22-c/tsc`: **fail** — 2 errors (`ConsignmentDropoffScreen.tsx:93,98` TS2345 — `RefObject<View | null>` not assignable to `RefObject<View>` param type on `focusSection`)
- a/b `export`·`render`·`iframe`: `blockedBy` — "다른 후보(evolve-r22-c)의 tsc 에러" (global tsc shared across the native project; did not consume a/b's own 1-fix budget per skill §3 `blockedBy` rule)
- c `export`·`render`·`iframe`: blocked by its own tsc failure

### 1-fix (candidate c only — a/b were never at fault)
Narrowed `focusSection`'s parameter type from `React.RefObject<View>` to `React.RefObject<View | null>` to match what `useRef<View>(null)` actually produces under the installed React/RN type versions. No behavior change.

### Run 2 (after fix) — **12/12 pass**
| Screen | tsc | export | render | iframe |
|---|---|---|---|---|
| evolve-r22-a | pass | pass | pass | pass |
| evolve-r22-b | pass | pass | pass | pass |
| evolve-r22-c | pass | pass | pass | pass |

All three candidates survive the hard gate. Proceeding to JUDGE panel.

## Environment note
`native/` has its own `package.json`/`node_modules` separate from the repo root and `app/` — it had never been installed in this session and caused a spurious project-wide `tsc` failure (`TS17004` across an unrelated pre-existing file) on the first attempt. Fixed by running `npm install` inside `native/` before gating. Not a candidate defect.
