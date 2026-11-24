# auto-native-r63 — SCORES

Target: native · round 2/2 of this scheduled session's 2 requested back-to-back rounds
(round-budget.mjs forced N=1 per invocation — see DECISION §0; this is a separate sequential
invocation after round 1, `auto-dash-r65`, committed+pushed).

Freeze hash (all 3 `.tsx`/`.ts` files under `native/src/evolve/r63/`, concatenated):
`50a267bafa4e39f1ec5224bd32cd768c2df1c679`

## Hard gate (`node scripts/gate.mjs --target native --screens evolve-r63-a evolve-r63-b evolve-r63-c`)

| screen | tsc | export | render | iframe |
|---|---|---|---|---|
| a (Saved Addresses) | pass | pass | pass | pass |
| b (Request Data Export) | pass | pass | pass | pass |
| c (Referral Program) | pass | pass | pass | pass |

**12/12 clean on the first attempt across all three candidates — 0 violations, 0 1-fix.**

## Orchestrator live-interaction verification (before screenshotting/judging)

Per established practice in this catalog (e.g. `auto-native-r62`), the orchestrator independently
drove each candidate's core claimed mechanism live via Expo Web export + Playwright, rather than
trusting self-reports or default-render screenshots alone:

- **a**: tapping "Delete" on the first row ("Home") genuinely flips that row's own surface in place
  to "Remove the Home address for Priya Nandakumar? This can't be undone." + Cancel/Confirm — no
  modal, no native Alert, confirmed by screenshot. The other 3 rows remain in their normal
  Set-as-default/Delete state, confirming the flip is scoped to the tapped row only.
- **b**: tapping "Request export" genuinely swaps the entire screen content from the request view to
  a terminal confirmation view — reference number `DX-20261124-7741`, requested-at timestamp, and the
  same 47/212/18 counts carried over from the request view (confirming single-source derivation, not
  independently hardcoded in both views) — confirmed by screenshot.
- **c**: tapping "Share Invite Link" genuinely calls `Share.share()` (not a no-op or a faked-success
  timer) — in this sandboxed headless-Chromium environment, the Web Share API is unavailable, so the
  call rejects and the screen shows its own documented honest-failure branch: "Couldn't open the
  share sheet. Try again." **This is environment-specific, not a code defect** — RN Web's `Share`
  module delegates to `navigator.share`, which real mobile Safari/Chrome support but a sandboxed
  headless browser does not; the candidate's handler is doing exactly what it was built to do
  (report the real outcome, not fake one), confirmed by screenshot and noted here explicitly so
  judges don't misread the rejection branch as a bug.

## Screenshots

`vault/20-generations/2026-11-24-auto-native-r63/shots/{a,b,c}-{390,768}.png` (default render, 0
blanks, visually confirmed on read). Interaction-state frames also captured and reviewed by the
orchestrator (saved to scratch, not part of the committed catalog since the skill's native frame
budget is default-render only per screen, 2 widths).

All three candidates survive to §4 JUDGE with 3 live survivors.
