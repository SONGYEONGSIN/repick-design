Check string: "Request more time"

# Candidate b — Return Window Extension Request

`native/src/evolve/r43/b/ReturnWindowExtensionScreen.tsx` + `data.ts`.

## Concept

Single-focus detail/form screen (not a roster) for a buyer who wants extra
days before their return-eligibility deadline closes. Content stack, top to
bottom, inside one `ScrollView`:

1. Header (kicker + `accessibilityRole="header"` title + one-line lede naming
   the item and order id).
2. **Countdown card** — the dominant visual element. A 52px `tabular-nums`
   remaining-time readout (`3d 14h`), a status chip tiered by days-left
   (`success`/`warning`/`danger` tokens — same three-tier semantic already
   used for eligible/expiring/expired elsewhere in this catalog, reapplied
   here to days-until-deadline rather than an eligibility boolean), and
   directly below it the actual deadline date + time (`formatDateLabel` /
   `formatTimeLabel`, both manual-formatted from a fixed UTC timestamp —
   no `toLocaleDateString`, so the string can't drift across runtimes).
3. **Reason form** — a multiline free-text "why" field (min 20 chars, counter
   updates live) and a 4-option chip row for how many extra days to request
   (+3/+5/+7/+10, default +5), with a reactive preview line ("New deadline
   would be …") recomputed from current state every render.
4. A disclaimer line that extensions are reviewed, not automatic — so the
   "granted" band state below never over-promises approval, only that the
   *request* was sent.

## Bottom band — state machine, date-driven block condition

Reuses the blocked/ready/done shape (GENERATION.md §3) with fresh style keys
(`deadlineDock`, `deadlineDockClosed*`, `deadlineDockIncomplete*`,
`deadlineDockPrimed*`, `deadlineDockGranted*` — no overlap with the
`bandBlocked*`/`bandReady*`/`bandDone*` names used verbatim in
`disputes/DisputeCenterScreen.tsx` and five other screens). Four phases,
computed with `useMemo`:

- **`closed`** — `remaining.passed` is true (now ≥ original deadline).
  Terminal: the sentence is "This window closed on `<date>`"; tapping can't
  fix anything, so the press handler does the one real thing available —
  scrolls the ScrollView back to the countdown card.
- **`incomplete`** — deadline hasn't passed, but the trimmed reason is under
  20 characters. Sentence names the exact character count still needed;
  tapping scrolls to the reason field (using an `onLayout`-captured y offset,
  not a guessed constant) and calls `.focus()` on it via ref — a real,
  verifiable action, not just a label change.
- **`primed`** — reason valid, deadline not passed. Sentence states the
  chosen day count and previews the resulting date; tapping calls the real
  submit handler (`setGrantedDays` + `setSubmitted`).
- **`granted`** — static (non-`Pressable`) confirmation naming the new
  deadline, computed from the days value that was selected *at the moment of
  submission* (`grantedDays`, frozen separately from the still-live
  `extensionDays` state) so a later chip change — impossible anyway since
  chips disable on submit — could never retroactively alter what was
  already requested.

This gives two *distinct* blocked sentences (`closed` vs `incomplete`) as the
brief asked for, keyed off a real date comparison rather than only form
validity.

## Accessibility

- Band wrapper: `accessibilityLiveRegion="polite"`, always.
- The current phase's headline `Text` gets `accessibilityRole={justChanged ?
  "alert" : undefined}` — never unconditionally. `justChanged` is a separate
  piece of state from `phase`, flipped true by an effect that diffs
  `phase` against a `prevPhaseRef`, explicitly skips the first mount
  (`prevPhaseRef.current === null` branch returns before announcing), and is
  cleared back to `false` via `setTimeout(…, 3000)` with the timer cleared
  both on the next transition and on unmount.
- The live countdown readout, the preview-deadline line, and the granted
  confirmation's date are all re-derived from state/constants every render —
  none of them are one-off announcements, so none of them need manual
  clearing (per the brief's own distinction).
- No `accessible={true}` on any wrapper; the `radiogroup`/`radio` roles on
  the day-count chips are semantic group roles, not the boolean collapse
  prop, so each chip stays individually reachable.
- No `accessibilityHint` promises anything the handler doesn't do — the
  "closed" and "incomplete" bands both say "tap to review/jump" and the
  handler genuinely scrolls (+ focuses, for the reason field); the
  "granted" band is a plain `View`, not a `Pressable`, so it makes no tap
  promise at all.
- Determinism: `NOW_TS`, `ORDER.purchasedTs`, `ORIGINAL_DEADLINE_TS` are all
  `Date.UTC(year, month, day, …)` literals; `new Date(ts)` only ever appears
  with an explicit `ts` argument inside the formatting helpers, never bare.

## Why not FlatList

There is no collection of records on this screen — one order, one countdown,
one small 4-item chip row. A `ScrollView` is the honest container for a
single-focus form; wrapping the 4 extension-length options in a `FlatList`
would add virtualization machinery for a fixed-size list shorter than a
single screen's viewport, which the native UX guideline's FlatList rule is
not actually aimed at (it targets large/unbounded collections). The 4 chips
render via a plain `.map()`, same convention `DisputeCenterScreen` already
uses for its reason/resolution chip rows.

## Brief gaps

① Whether "deadline passed" needs to be reachable through live interaction
in the shipped dummy data, or only correct as code logic.
② Decided: only correct as code logic. The default `NOW_TS`/deadline pair
puts the screen 3d14h from the deadline (reachable, demoable happy path);
the `closed` phase triggers whenever `remaining.passed` is true but nothing
in the fixed data flips it true by itself.
③ Arbitrary-but-principled: this project's own dummy-data convention (e.g.
`DisputeCenterScreen`'s single `ELIGIBLE_ORDER`) already encodes one fixed
scenario per screen rather than a live toggle between scenarios, and there's
no clock in this app to let a user "wait past" a deadline inside one
session — building a fake fast-forward control to manufacture the second
state felt like a contrivance the brief didn't ask for, versus just making
sure the branch exists and is correctly driven by a real timestamp
comparison.

① Whether the extension-length choice (+3/+5/+7/+10) should itself be a
blocking requirement alongside the reason field.
② Decided: no — it ships pre-selected at +5 and is always "valid" on its
own; only the reason field and the deadline gate the band.
③ Pattern reference + arbitrary: the brief's example of the two blocked
sentences names only "reason empty" and "deadline passed" as the two
conditions, not a third field. Adding a mandatory-but-unselected day-count
would have forced a third blocked sentence the brief never asked for and
diluted the "two distinct states" shape it explicitly wants; defaulting it
to a sensible value keeps the form genuinely single-focus (one real
decision — the reason — gates the action) while still giving the user a
second, non-blocking control to adjust.

① How literally to interpret "the actual deadline date" in the countdown
card — date only, or date + time.
② Decided: both — big relative readout (`3d 14h`) plus the absolute date
*and* the time-of-day the window closes at.
③ General practice: return/eligibility deadlines in this catalog's existing
screens (e.g. order-status, return-inspection-decision) show absolute dates;
pairing the relative countdown with the absolute cutoff lets a traveling
buyer reason about their timezone/schedule without doing date-math in their
head, which is the screen's whole reason to exist.

① Where to put the countdown-tier color logic (success/warning/danger by
days-left) — a new convention, or reuse of existing token semantics.
② Decided: reuse of the existing `success`/`warning`/`danger` token triad,
re-keyed to "days until deadline" instead of "approved/pending/rejected".
③ Pattern reference: `tokens.ts` already documents these three as the
app's semantic eligible/expiring/expired colors; inventing a fourth hue for
the same conceptual gradient (plenty of time → closing soon → urgent) would
violate the near-monochrome + single-accent DNA for no real gain.
