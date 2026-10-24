# Candidate b — Blocked Users

**Concept:** A blocked-users list (buyers/sellers who can no longer message the
account holder or bid on their listings), driven by a selection-based bulk
toolbar.

The screen lists every blocked contact with their role, block reason, and a
short reason detail. Each row is independently selectable (checkbox
semantics via `accessibilityRole="checkbox"`). This is bottom-band doctrine
form **#3 (selection-driven contextual bar)**: the bar is completely absent
while nothing is selected, and mounts only once the user taps at least one
row, with the live-selected-count text announced via a single
`accessibilityLiveRegion="polite"` region.

The domain-specific derived logic layered on top of plain selection count:
blocked contacts carry one of two `reason` kinds — `manual` (the user
blocked them directly, liftable any time) or `platform` (Trust & Safety
enforced the block after a confirmed report, not liftable from this screen).
The bar's **Unblock** action is only enabled when the *current selection
composition* contains zero platform-enforced blocks — selecting even one
platform-blocked row alongside manual ones disables Unblock and the bar's
single live-region text explains why. The bar's second action, **Tag as
Noted**, is unconditional (always enabled once 1+ rows are selected) and
applies a non-destructive "Noted" label to the selected rows, giving the
toolbar two genuinely different action types (a conditional/destructive one,
an unconditional/non-destructive one) instead of a single generic
multi-delete.

Unblock is destructive-ish (it restores a stranger's ability to contact the
account again), so it requires an explicit second-tap confirm rendered
in-place inside the same bar (never a native `Alert`) before it executes.
After a confirmed unblock, the selection clears (the bar unmounts) and a
separate, temporary undo band takes its place at the same bottom edge — the
two are mutually exclusive by construction (`showUndoBand = !showSelectionBar
&& undoInfo !== null`), so they are never mounted simultaneously.

**Render-check string:** `Blocked Users`
(the screen's `accessibilityRole="header"` title, rendered verbatim as the
first `<Text>` in the header.)

## 브리프에 없던 것 (What the brief didn't specify)

1. **What decided:** The concrete domain (which "list of independently
   selectable items with a real batch action" to build).
   **Decided:** Blocked Users list (buyers/sellers blocked from contacting
   the account), explicitly bulk-unblock / bulk-tag.
   **Why:** The brief listed "a blocked-users list" as one of its own
   example domain suggestions (section 8) and it fit the selection-bar
   assignment (#3) naturally — arbitrary judgment call picking from the
   brief's own suggestion list.

2. **What decided:** The taxonomy of *why* a user is blocked (needed to
   produce composition-dependent derived state, not just a count).
   **Decided:** Two reasons — `manual` (self-initiated, liftable) vs
   `platform` (Trust & Safety enforced, not liftable here).
   **Why:** Arbitrary judgment call, chosen specifically to satisfy the
   brief's instruction that "some actions only enabled for certain
   selection compositions, not just selection count" — a plain
   count-only-gated bulk-delete would have read as weak differentiation
   per the brief's own warning.

3. **What decided:** How to implement the destructive confirm for bulk
   Unblock without a native `Alert`.
   **Decided:** A two-tap flow entirely inside the selection bar itself
   (`barMode: "selecting" | "confirmUnblock"` swaps the bar's action row and
   its single live-region text into a Cancel/Confirm pair).
   **Why:** General RN/accessibility practice (avoid native `Alert`, which
   this brief's section 5 already forbids for other cases) extended by
   analogy to this screen's own destructive bulk action, kept as one single
   live region rather than opening a second modal region.

4. **What decided:** Whether a post-unblock undo affordance exists, and its
   shape/timing.
   **Decided:** Yes — a manually-dismissed undo band (`Undo` / dismiss `x`),
   with no auto-hide timer.
   **Why:** The brief explicitly permits a post-action undo affordance as
   long as it's mutually exclusive with the selection bar (never both
   mounted). No auto-timeout was chosen specifically to avoid any
   `setTimeout`/clock-based non-determinism, in the spirit of section 6's
   determinism rule (no `Date.now()`/timers driving visible state) even
   though that rule is literally about dummy data — arbitrary judgment call
   erring conservative.

5. **What decided:** Color treatment for the "Noted" tag badge.
   **Decided:** `success`/`successBg`/`successBorder` tokens, not
   `accentBg`.
   **Why:** Directly following the brief's explicit rule that `accentBg`
   must never be used as a tag-chip background — picked the closest
   semantically-fitting existing token family instead of inventing a color.

6. **What decided:** Color treatment for the "Platform-enforced" badge.
   **Decided:** `warning`/`warningBg`/`warningBorder` tokens (not `danger`).
   **Why:** Arbitrary judgment call — it's a restriction notice about the
   row, not a failure/error state, so `warning` read as the better semantic
   fit than `danger` on the existing token palette.

7. **What decided:** Avatar-circle styling (no dedicated avatar token
   exists in `tokens.ts`).
   **Decided:** Reused `tokens.color.border` as the circle fill and
   `tokens.color.ink2` as the letter color.
   **Why:** General instruction from the brief itself ("if you need a color
   not in tokens.ts, reuse an existing token... not invent a new hex").

8. **What decided:** What happens to a pending Unblock confirm prompt if the
   user changes the selection (taps another row) while it's showing.
   **Decided:** Any row toggle resets `barMode` back to `"selecting"`,
   discarding the pending confirm.
   **Why:** Arbitrary interaction-safety judgment call — prevents a stale
   confirmation prompt from applying to a selection set the user has since
   changed.

9. **What decided:** Row ordering behavior after an Undo restores
   previously-unblocked users.
   **Decided:** Restored rows are re-inserted at their original position
   (filtered back against the fixed source array order), not appended to
   the end.
   **Why:** Arbitrary judgment call for a stable, predictable list — avoids
   surprising reordering after an undo on a screen the automated gate may
   inspect deterministically.

10. **What decided:** Exact number and mix of seeded blocked-user rows.
    **Decided:** 9 fixed entries, 6 manual / 3 platform-enforced, mixed
    buyer/seller/both roles.
    **Why:** Arbitrary judgment call — large enough to justify `FlatList`
    per section 1, and enough of each `reason` kind present so the
    conditional-Unblock logic is exercised by a realistic mixed selection,
    not just a hypothetical.
