# Candidate b — Minimum Offer Threshold

This screen is a seller's single-scroll settings list for the "minimum acceptable offer" floor on each of their active listings — a value below which incoming buyer offers are auto-declined without ever reaching the seller. It is built as one `FlatList` with no fixed bottom band: intro copy ("what this screen does and why") lives in `ListHeaderComponent`, and each listing is a card row showing its title, category, asking price, a live "Offers below ₩ X are auto-declined" sentence that always reflects the value currently being edited (even mid-keystroke, before Save), and — when not editing — the saved floor plus an "Edit" button. Tapping Edit opens that row's own inline editor: a labeled numeric field with ±1,000-won stepper buttons and explicit Cancel/Save actions, so changing the floor is a plain, reversible value edit rather than anything resembling a destructive confirm or a toggle. Saving validates the amount (non-negative, not above the listing's own price) inline, commits it, and announces a transient success message that clears itself after a few seconds.

## Render-check string
"Minimum Offer Settings"

## 브리프에 없던 것 (What the brief didn't specify)

1. ① How many listings can be "editing" at once ② Only one row at a time — opening Edit on a row auto-closes any other open editor ③ Keeps at most one live region (the active editor's preview) changing at a time, so it can never collide with the save-confirmation live region, and keeps the screen's cognitive load low (one decision in flight).

2. ① Whether the floor can exceed the listing's own asking price ② Capped it: the inline validator rejects a typed value above the listing's price, with a clear nearby error message naming the actual price ③ A floor above the asking price is nonsensical in this domain (every offer would be auto-declined) and gives a concrete, non-arbitrary "absurd value" case for the required inline-validation rule, beyond just rejecting negatives.

3. ① What granularity the stepper buttons should move by ② Fixed ±1,000 won per tap, clamped to [0, price] so the stepper itself can never produce an invalid draft ③ the typed field can still go invalid (exercising the error-message path) while the stepper stays a safe, always-valid quick-adjust affordance — two complementary ways to edit the same value.

4. ① Whether the live "Offers below X" preview should carry `accessibilityRole="alert"` ② Left it as a plain `polite` live region while editing (no alert role) and reserved `alert` strictly for the one-shot save-confirmation banner ③ the preview is continuously re-derived from in-progress typing (classic pattern-2 safe-harbor content) and would otherwise create a live region that's "active" for the entire duration of every edit; keeping alert reserved for the real, momentary state transition (an actual save) avoids any risk of two overlapping alert regions.

5. ① How to render the ₩ symbol next to figures given the glyph-collision note ② Used "₩" followed by an explicit space and then thousands-separated digits (e.g. "₩ 45,000") everywhere, via one `formatKRW` helper ③ keeps the real currency glyph (rather than falling back to "KRW" text) while sidestepping the documented glyph-run-in issue, and guarantees every price in the screen is formatted identically.

6. ① What happens to a row's draft text when the seller cancels ② Revert to the last *saved* threshold (not the original dummy-data default), by reading current committed state at cancel time ③ after one successful save, "cancel" on a later edit attempt must restore the most recent real value, not silently roll back an earlier edit the seller already committed — matches the "non-destructive, truly reversible" spirit of the required Cancel action.
