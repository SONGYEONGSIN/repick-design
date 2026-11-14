# Candidate b — Price drop alert settings

A single-screen settings form (threshold stepper, channel switches, quiet-hours chips) with a bottom save band whose presence is derived purely from comparing the working draft to the last-saved baseline — absent when clean, explanatory when dirty-but-invalid, a real Save action when dirty-and-valid, and a brief edit-dismissed confirmation after saving.

## Brief gaps

1. ① Exact threshold ranges/steps for each mode. ② Percent-off: 5–70% in steps of 5; dollar-off: $5–$200 in steps of 5. ③ Arbitrary but chosen to avoid the "0% is a nonsensical threshold" trap the brief flags, while keeping the stepper's tap count reasonable (≈13 steps max either way).

2. ① Which notification channels exist. ② Push notifications, Email, In-app alerts (three, matching the brief's own example list verbatim). ③ Brief named exactly these three as examples, so I treated the example as the spec rather than inventing a fourth.

3. ① Quiet-hours UI shape. ② An on/off switch plus two rows of three fixed time chips (start: 9/10/11 PM, end: 6/7/8 AM) rather than a free-form time picker. ③ Brief explicitly said "simple time-range picker... no virtualized list," so fixed selectable chips (not a native time-wheel, which would need a library) seemed the safest reading of "simple."

4. ① What makes the draft "savable" vs. merely "different." ② Savable requires at least one channel on AND the threshold value inside its mode's min/max. ③ Brief's validation instruction specifically calls out gating Save's derived-valid boolean on a real rule, not just non-emptiness — zero channels was the one state the stepper can't self-prevent (switches can all go off), so that became the chosen invalid case.

5. ① What the band says when dirty-but-invalid vs. dirty-and-valid. ② Blocked state shows "Turn on at least one notification channel below before saving." and hides the Save button (keeps Revert); valid-dirty state shows "You have unsaved alert setting changes." with both Revert and Save. ③ Directly maps to the DNA's correctness-bar case (a): a blocked band must explain why in its own visible text, so the two states needed genuinely different copy rather than a disabled-look button.

6. ① How the post-save confirmation disappears without a timer. ② It's armed by Save and cleared by the very next edit (any `applyEdit` call clears `justSaved`); if the user never edits again it simply stays until they do. ③ Brief explicitly forbade a `setTimeout`-driven fake for this transition and required it be "recomputed from state" — edit-driven clearing is state-derived and deterministic, whereas a duration-based auto-hide is exactly the "fake" pattern called out.

7. ① Exact copy/wording throughout (title, subtitle, hints, last-saved string). ② Wrote plain descriptive English copy, e.g. "Range: 15% off to 70% off." and a fixed "Last saved Nov 10, 2026 at 9:14 AM." ③ No wording was specified; picked phrasing consistent with the near-monochrome, no-theatrics DNA tone, and used a fixed past-tense timestamp per the determinism rule (no live clock).
