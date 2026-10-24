---
round: auto-native-r26
candidate: a
domain: Warranty Claim
files:
  - native/src/evolve/r26/a/WarrantyClaimScreen.tsx
  - native/src/evolve/r26/a/data.ts
export: named `WarrantyClaimScreen` + `export default WarrantyClaimScreen` (same file also default-exports it, matching r25/a convention)
heading: "File a Warranty Claim"
---

# Concept

A buyer/seller files a warranty claim on a defective camera bought through repick — a
three-checkpoint blocked-workflow intake (defect category, evidence photos, remedy) gated by a
bottom rail state machine that names the single unresolved checkpoint and scrolls to it, with a
live-computed refund figure, category-gated remedy eligibility, and a submitted claim that
auto-reopens the moment any of its inputs change again.

## 브리프에 없던 것 (decisions the brief didn't specify)

1. **Which item, and what the defect taxonomy actually is.**
   ① Decided: a Fujifilm X-T4 body (order `RP-88214`, purchased Mar 14 2026, 365-day coverage,
   178 days elapsed → 187 days left), with 7 concrete defect categories (sensor/image quality,
   autofocus, shutter, LCD/viewfinder, battery/charging, lens mount damage, other).
   ② Why: the assignment only says "select the defect category" — a generic dropdown with no
   real content would leave the remedy-eligibility logic (item 3 below) with nothing to hang off
   of. A camera has genuinely distinct defect classes with different real-world remedy paths
   (electrical faults vs. physical/accidental-looking damage), which is what actually makes the
   later gating logic meaningful instead of decorative.

2. **What blocks submission, and in what order.**
   ① Decided: three ordered checkpoints checked in sequence — (a) a defect category chosen,
   (b) at least 1 evidence photo attached, (c) a remedy chosen — so the bottom rail always names
   the single most-upstream unresolved item, per GENERATION.md §3's blocked-workflow state
   machine. Remedy selection itself is additionally locked (visually and functionally) until (a)
   and (b) are both satisfied, reinforcing the order rather than just checking it after the fact.
   ② Why: this is the mandated bottom-band form for a genuinely blocked, multi-step workflow.
   Control-flow and style names were written from scratch for this domain (`nextCheckpoint` not
   `bandBlocked`, `steerToCheckpoint` not `jumpTo`, `railMessage`/`railActionLabel`/`railWrap` not
   `statusFor`/`band*`) per the explicit instruction not to reuse another screen's identifiers —
   I have not read any other evolve-r* or catalog screen source in this session, so these names
   were chosen fresh for this domain (rail/checkpoint vocabulary), not adapted from anything seen.

3. **How defect category and remedy actually interact (the "real mechanism" requirement).**
   ① Decided: each defect category carries a `repairBusinessDays` figure (2–8 days, worse for
   structural faults like the shutter or lens mount) and a `refundReady` flag. Categories that
   read as physical/accidental damage (lens mount, "other") are not refund-eligible until a
   hands-on inspection — the Refund card is disabled and explains why. If a refund was already
   chosen and the buyer then switches to a refund-ineligible category, the remedy choice is
   cleared automatically rather than left in an invalid state.
   ② Why: the brief's open-deltas section specifically warns against a screen whose name promises
   a mechanism ("select defect → remedy") but implements a shallow "select → total → confirm"
   pattern. Tying repair turnaround and refund eligibility to the actual defect category, instead
   of showing the same three static remedy options regardless of input, is what makes the
   category selection causally matter rather than being a label nobody reads again.

4. **Refund amount math.**
   ① Decided: a straight-line depreciation off the fixed purchase price, capped at a 20%
   deduction across the 365-day coverage window: `deduction = round(price * 0.2 * daysElapsed /
   warrantyTotalDays)`, refund = price − deduction. With the fixed dummy values this yields
   ₩1,382,608 (shown as `KRW 1,382,608` to sidestep the ₩-glyph note rather than solve a
   non-problem).
   ② Why: needed a genuinely derived, non-random figure tied to the same purchase data that
   gates the workflow (per the "live-recomputed hero/summary values" signal called out as a
   strong completion-lens result last round), rather than a hardcoded refund placeholder. All
   constants live in `data.ts` as literals — no `Math.random`/`Date.now`.

5. **Auto-retracting a filed claim when its inputs change.**
   ① Decided: once a claim is filed (`claimStage: "filed"`, a synthesized `claimNumber` shown),
   editing the defect category, adding/removing an evidence photo, or reselecting the remedy
   silently reopens the claim (`claimStage` back to `"open"`, `claimNumber` cleared) before
   applying the edit, and the bottom rail's live region announces the new unresolved state.
   ② Why: called out directly in the brief's open-deltas as a strong signal from the prior round
   (r25/a) — a submitted state that doesn't honestly reflect a subsequent edit is worse than not
   submitting at all. I also gave the rail an explicit "Edit claim" action once filed, so
   reopening isn't only an implicit side effect of touching the form.

6. **Evidence photo capture, since there's no real camera here.**
   ① Decided: an "Add photo" control that appends the next entry from a fixed 5-item pool
   (`data.ts` → `EVIDENCE_POOL`), each with a deterministic caption and one of the three token
   swatch colors, capped at `MAX_EVIDENCE_SHOTS = 5`; each attached photo has its own Remove
   control. No confirm-before-remove dialog — removing an unsent evidence photo just re-opens the
   add slot, which isn't the kind of irreversible action GENERATION.md's destructive-confirm rule
   is aimed at (that pattern is reserved for genuinely destructive/irreversible actions).
   ② Why: needed a concrete, deterministic stand-in for a camera-roll/camera picker (no
   `Math.random`/`Date.now` allowed), and reserved the heavier Cancel/Confirm row pattern for
   where it's actually warranted rather than applying it reflexively to every remove button.

7. **List rendering for the three option groups (defect categories, evidence thumbnails, remedy
   cards).**
   ① Decided: `FlatList` with `scrollEnabled={false}` nested inside the screen's outer
   `ScrollView`, rather than a plain `.map()` over each fixed array.
   ② Why: GENERATION.md's catalog explicitly prefers `FlatList` over big `.map()` for lists; even
   though each of these arrays is small and capped (7 / ≤5 / 3 items), using `FlatList`
   consistently for every option-group in the screen keeps the idiom uniform rather than mixing
   `FlatList` in one place and raw `.map()` in another for what's conceptually the same kind of
   list-of-selectable-rows control.
