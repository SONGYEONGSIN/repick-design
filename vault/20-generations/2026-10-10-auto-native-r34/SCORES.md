# auto-native-r34 — HARD GATE (gate.mjs --target native --screens evolve-r34-a evolve-r34-b evolve-r34-c)

Environment: `PW_CHROMIUM_PATH`/`CHROME_PATH` = pre-installed `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` (same Playwright-version-mismatch workaround as the web gate this session). `PW_NO_SANDBOX=1`.

**12/12 clean on the first attempt — no 1-fix loop needed, no candidate dropped.**

| screen | tsc | export | render | iframe |
|---|---|---|---|---|
| evolve-r34-a (Identity Re-verification) | pass | pass | pass | pass |
| evolve-r34-b (Saved Shipping Addresses) | pass | pass | pass | pass |
| evolve-r34-c (Close Seller Account) | pass | pass | pass | pass |

Screenshots: Expo Web export per screen (`EXPO_PUBLIC_SCREEN=evolve-r34-<v> npx expo export --platform web`), served on :8091, captured at 390×844 and 768×844 via Playwright. 6 files, 0 blank (visually spot-checked a-390.png, matches spec — checklist, live-region band, "2 of 4 steps remaining" state-machine sentence, token colors).

## Candidate summaries
- **a** — "Identity Re-verification": blocked-workflow state-machine band. 4-step checklist (gov ID, liveness photo, current address, updated agreement), band states what's blocking and jumps to the next incomplete step on press, single live region (`polite` container + `alert` sentence), real `scrollToIndex` + `setAccessibilityFocus`.
- **b** — "Saved Shipping Addresses": row-level 3-state (normal/verifying/locked-primary), no fixed global band. Inline Cancel/Confirm destructive-confirm per row, primary-address row explains via live region why it can't be removed directly instead of transforming to confirm. **Orchestrator flag for judges, especially lens3**: this domain+form (saved addresses, no-band, per-row 3-state normal/confirming/locked) is very close to the already-existing, unpromoted `evolve-r29-c` ("Saved Addresses", no-winner round) — a RETRIEVE gap this round (only checked the last ~6 ledger rounds, not the full native archive, mirroring the dash-side Q58 lesson). Judges should weigh this explicitly; see DECISION.md.
- **c** — "Close Seller Account": destructive-confirm band (single global action, band self-transforms in place), with a real conditional eligibility gate (open-orders/pending-balance blockers) computed from data, not cosmetic.
