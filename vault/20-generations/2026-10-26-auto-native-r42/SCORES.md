# SCORES — auto-native-r42

Freeze hash (sha1 of all candidate sources, computed before gating): `d1f43d29e5236b46edad0f3c7d4f8db928d77557`
(`cat native/src/evolve/r42/*/*.tsx native/src/evolve/r42/*/*.ts | shasum`)

Environment notes (not candidate-code changes): this container had never run `npm install` for the root repo, `app/`, or `native/` — all three were installed fresh at session start. This sandbox's pre-installed Playwright Chromium (revision 1243 at `/opt/pw-browsers/chromium`) does not match the revision `playwright@1.61.1` expects by default (1228) and the CDN download is blocked by the environment's egress policy — worked around via `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`, which `native/scripts/validate.sh`, `scripts/shot-native.mjs`, and `native/scripts/iframe-check.mjs` already support natively via `process.env.PW_CHROMIUM_PATH`. No script changes made.

## Hard gate — `node scripts/gate.mjs --target native --screens evolve-r42-a evolve-r42-b evolve-r42-c`

12/12 clean on the first attempt. Zero 1-fix loops. Zero candidates dropped.

| screen | tsc | export | render | iframe |
|---|---|---|---|---|
| evolve-r42-a (Listing Q&A) | pass | pass | pass | pass |
| evolve-r42-b (Report a Buyer) | pass | pass | pass | pass |
| evolve-r42-c (Split-Pay Plan Selector) | pass | pass | pass | pass |

Render-check strings (from `native/screens.json`, confirmed present in `document.body.innerText` by the gate):
- a: "Questions & Answers"
- b: "Report a Buyer"
- c: "Choose How You'll Pay"

## Candidates

- **a — Listing Q&A**: buyer-facing public Q&A thread on a listing. Macro: fixed item-context header + `FlatList` of Q&A entries (question, asker, upvote toggle, nested answer). Band: always-mounted composer bar (not a derived blocked/ready workflow band — deliberately a 4th band form for this codebase, since there is no step-gating flow to represent). Composer enablement (`canPost`) is a `useMemo`-derived boolean, not a hand-flipped flag.
- **b — Report a Buyer**: seller-facing complaint wizard against a buyer's conduct (no-show / non-payment / abusive messages — a meetup/payment-behavior taxonomy, distinct direction+taxonomy from the existing report-a-listing screen). Macro: 3-step wizard. Band: classic blocked/ready state machine naming why the user can't proceed, swapped for a band-free local success panel on submit.
- **c — Split-Pay Plan Selector**: buyer-facing pre-checkout payment-timing choice (Pay in Full / Pay in 4 / Pay in 12 — distinct axis from the existing protection-tier picker and from seller-side payout screens). Macro: 3 fixed comparison radio-cards (`.map()` over a fixed 3-item array, not `FlatList`, correctly — this is a small fixed option set, not a scrolling record list). Band: selection-derived (`hasSelection = selectedPlanId !== null`), a third recognized band-presence trigger class for this codebase (neither selection-*count* nor dirty-state-diff).

Domain-collision check against the full native catalog (25 production screens + evolve r23–r41, ~57 more) was done by each designer at assignment time (full survey handed to them in the brief, per questions-queue Q63's lesson — full-archive check, not just the last ~5 ledger rounds) and re-confirmed by the orchestrator before assignment. No literal domain or band-form duplicate found for any of the three.
