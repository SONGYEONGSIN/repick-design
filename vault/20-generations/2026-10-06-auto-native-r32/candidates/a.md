## Concept
A conversation list where picking one or more archivable threads surfaces a bottom bar to archive them in bulk, while threads with an unread reply or an open offer are flagged and disabled from picking until resolved.

## 브리프에 없던 것

1. **① Lock mechanism: disable vs. allow-but-exclude** — ② Chose to make locked rows (unread reply / open offer) fully non-selectable (`Pressable disabled`) rather than selectable-but-silently-excluded from the bulk action. ③ The brief offered either as valid; disabling with an inline reason badge gives a single unambiguous signal per row and avoids a second mismatch state where "picked count" and "will actually archive count" differ — simpler to reason about and to announce correctly in one live region.

2. **① What counts as "resolved enough to archive"** — ② Defined exactly two blocking conditions: `hasUnreadMessage` and `hasOpenOffer`, combined into one reason string when both apply ("Unread reply and an open offer"). ③ Arbitrary but grounded in the assignment's own examples; kept the rule set small and binary rather than inventing additional thread states (e.g. "flagged", "disputed") that weren't asked for.

3. **① Undo window length** — ② Fixed at 8 seconds, counted down via `setInterval` on an integer (never `Date.now()`), displayed live in the undo bar text and only announced once at archive time (not re-announced every tick). ③ Arbitrary numeric choice; kept short enough to feel like a true "just in case" window rather than a persistent second inbox state, and avoided re-announcing every second to not spam the live region.

4. **① Where the single live region physically lives** — ② Implemented as one visually-hidden `Text` node mounted once near the top of the screen (not inside either the selection bar or the undo bar), whose content is set directly by each event handler (pick/unpick, clear, archive, undo) rather than inferred via a `useEffect` watching derived state. ③ Chosen to make "exactly one live region, total" trivially true by construction, and to avoid a race where an effect reacting to `pickedIds` clearing (because archiving clears it) would overwrite the just-set archive-confirmation message with a stale "nothing picked" message.

5. **① Whether the alert-role live message should persist indefinitely after an action** — ② Added a self-clearing timeout (5s) that resets the live region text back to `""` (so `accessibilityRole` reverts to `undefined`) once a screen reader has had time to pick up the announcement, instead of leaving the last message (and `alert` role) mounted forever. ③ Directly extends the stated 2026-10-06 refinement: a stale "just happened" alert sitting permanently on an otherwise idle screen is the same failure mode as an unconditional alert on mount, just delayed.

6. **① Row tap target vs. small visual checkbox** — ② Made the entire row (not just the 22×22 checkbox glyph) the single `Pressable` with a ~60pt minimum height, so the real tap target clears 44×44 even though the visual indicator is smaller. ③ Standard RN accessibility minimum from the brief; avoided adding `hitSlop` to a sub-element since the whole row is already the interactive unit.

7. **① Restoring order after Undo** — ② Persisted the original dataset index (`ORIGINAL_ORDER`) and re-sort the merged list by it after an Undo, instead of just appending restored threads to the top or bottom. ③ Arbitrary but avoids a jarring reorder; bulk-undo should put things back exactly where the user remembers them.
