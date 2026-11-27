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

## JUDGE panel results

| lens | 1st | 2nd | 3rd |
|---|---|---|---|
| lens1 (DNA/a11y) | c | b | a |
| lens2 (mobile completeness) | c | b | a |
| lens3 (screen-type differentiation) | b | a | c |

**Ordinary 2:1 majority for c** (lens1+lens2; lens3 dissented) — not a complete 3-way tie (c=2 votes,
b=1 vote), so the tie-break rule does not apply; this is a plain majority.

**Critical finding (lens3, independently re-verified by the orchestrator)**: candidate c
("Referral Program") is a confirmed, severe duplication of an existing catalog screen,
`native/src/evolve/r37/a/ReferralRewardsScreen.tsx` ("Referral Program & Rewards") — same domain
(referral program: invite code/link, `Share.share()`, referred-friends list with credit amounts,
running balance) AND literal style-key overlap, independently confirmed by direct grep:
`listContent`, `headerBlock`, `inviteCodeLabel`, `inviteCodeValue`, `shareButton`,
`shareButtonPressed`, `shareButtonLabel`, `statTile` — 8 identical key names, plus near-identical
copy ("Share your invite" vs "Share Invite Link"; "Your referral code" vs "Your invite link").
**This is the orchestrator's own RETRIEVE-stage dedup-survey failure** — the dedup list given to
designer c only covered the last ~6 evolve rounds (r56-r62) plus production screens, not the full
`native/src/evolve/` archive, so `r37/a` (existing since well before this session) was never
surfaced. This is the exact, previously-named failure pattern (`questions-queue` Q63/Q78: "RETRIEVE가
전체 아카이브를 못 따라간다") recurring a further time, this time with a materially worse
consequence than prior occurrences — the duplicate candidate did not merely get reassigned or
contribute a non-winning data point, it won the round's ordinary majority, because only lens3
(differentiation) checks for cross-round code-surface duplication; lens1 and lens2 independently
ranked c 1st purely on DNA/a11y-compliance and mobile-completeness grounds, neither of which
includes a duplication check in its own rubric, and neither lens was told about `r37/a` any more
than the designer was.

**Disposition (consistent with this catalog's established precedent for confirmed-duplication
findings against a winning candidate, e.g. `auto-native-r61`'s b/`r23-b` case)**: the panel's
aggregation rule is applied mechanically — c is recorded as this round's winner via a genuine,
non-tie, 2-of-3 majority, not a forced/invented one. The duplication finding is not grounds for an
ad-hoc override under this skill's documented rules (no existing rule lets a dissenting lens veto an
ordinary majority), so the round is NOT recorded as no-winner. However, **this DECISION explicitly
recommends against promoting candidate c in the next `/dash-falsify` review** given the severity and
directness of the evidence — this is a stronger, more directly-confirmed case than the tie-break
scenario Q78 already flagged for human judgment, and a new `questions-queue` entry (Q81) is filed
extending Q78's question to ordinary (non-tie) majorities, since this round shows the same structural
gap (only one of three lenses checks for duplication, so a confirmed duplicate can still win a plain
majority) can bite even without a tie-break involved.
