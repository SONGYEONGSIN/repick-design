# Candidate A — Local Meetup Schedule Screen

A day/time slot-grid sits above a short fixed list of vetted public hand-off spots, and the bottom band stays a non-committal "pending" state — naming exactly which of the two picks (slot, spot, or both) is still missing and jumping straight to it on tap — until both are made, at which point it becomes the real Confirm action.

## Brief gaps

- **Day range and count.** The brief didn't say how many days to offer or whether they roll relative to "today." Decided: 4 fixed day columns (Fri–Mon) with static label + date-string pairs, no `Date` math at all. Why: matches the determinism rule most conservatively — any relative-day logic risks a disguised `Date.now()`-equivalent, so plain literals were simplest and safest.

- **Time-slot granularity.** Not specified whether slots should be hourly, half-day, or named bands. Decided: 4 named bands (Morning / Midday / Afternoon / Evening) each with a printed clock range. Why: a 4×4 grid (16 cells) reads clearly on a phone width without horizontal scrolling or tiny touch targets, and named bands feel more like a casual peer-to-peer handoff than a dense hourly calendar.

- **Why some cells are unavailable.** The brief only implied a grid of "selectable" cells; it didn't require a busy/blocked cell concept. Decided: added a fixed `BUSY_CELL_IDS` set representing times the other party already marked busy, rendered grayed-out and disabled. Why: a plain fully-open grid felt too thin as a believable screen; a few pre-blocked cells make the grid mechanic legible (there's something to differentiate from "available") without adding any new user-facing condition to the gate.

- **Tie-break priority when both slot and spot are missing.** The brief required one deterministic order, documented in a comment, but left the choice open. Decided: the day/time grid wins priority (jump target resolves to the grid first) over the spot list. Why: arbitrary choice, justified by reading order — the grid is the first section on the screen and the spot list is physically below it, so resolving to the earlier section first matches natural top-to-bottom flow (same reasoning direction as the r53-style precedent, applied fresh here).

- **Exact blocked-band and done-band copy wording.** No literal strings were given. Decided: "Pick a day and time, then choose a meetup spot, before this hand-off can be confirmed." (both-missing), single-condition variants for each, and a done-state sentence that restates the full chosen day/time/spot. Why: arbitrary wording, kept deliberately specific (names the two concrete nouns "day and time" / "meetup spot") so the message satisfies the "names which condition(s) are missing" rule unambiguously rather than a vague "something's missing."

- **Whether picks can be changed after Confirm.** Not addressed by the brief. Decided: once finalized, both the grid cells and spot rows become disabled (no further edits) rather than allowing silent re-opening of a "confirmed" meetup. Why: arbitrary choice for internal consistency — avoids an ambiguous state where a "confirmed" band coexists with a grid that still looks editable.
