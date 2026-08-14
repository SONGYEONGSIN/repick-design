# Candidate c — Saved searches & alerts (evolve-r5-c)

A single, always-scrolling `FlatList` of saved-search cards (query + category, alert on/off switch, live match-count summary, an inline frequency editor, and an inline two-step "remove" confirm) — no fixed header band, no fixed bottom action bar. Structurally distinct from the account/Preferences settings screen: that screen is a `SectionList` of grouped generic field rows (toggle/segmented/stepper/display) under a titled section; this screen is a flat list where every control is scoped to one self-contained saved-search item, not to a shared section, and the content domain is search queries + match alerts rather than personal account fields.

## 브리프에 없던 것

① Decide: whether flipping the alert toggle and picking a new alert frequency should each get their own inline "applied" tag, or share one status slot per row.
② Decided: one shared `statusTag` slot per row (keyed by search id), overwritten by whichever action happened most recently ("Alerts turned on" / "Alerts turned off" / "Frequency set to Daily digest").
③ Why: r2's lesson only established that toggles need *an* inline confirmation, not how multiple confirmable actions on the same row should coexist. Following account/Preferences.tsx's `AppliedTag`/`touched` pattern (one tag per row, keyed by field id) but collapsing it to one tag per whole row (not per sub-control) kept the card visually calm — a card with a toggle tag AND a separate frequency tag stacked at once looked like clutter with only five rows of screen budget, so I merged them into a single most-recent-action tag with `accessibilityLiveRegion="polite"` (the same idiom the reference file uses on its stepper's live value).

① Decide: how to represent "new matches" without relying on color alone (catalog's no-color-alone rule) for a value that is fundamentally just a number.
② Decided: a small dot that is filled + accent-colored when matches > 0 and hollow (bg fill + border) when matches = 0, paired with text that already differs in wording ("3 new matches" vs "No new matches"), plus bold weight only on the active state.
③ Why: GENERATION.md and the catalog state the no-color-alone rule but don't give a native shape vocabulary for it. I reused the filled/hollow toggle-thumb precedent already established in account/Preferences.tsx's switch track (on = filled accent, off = hollow bordered) and applied the same filled-vs-hollow logic to a status dot, so the codebase now has one consistent "state = shape, not just hue" convention instead of two different ones.

① Decide: whether removing a saved search needs a full modal, and what the two-step inline confirm should look like structurally.
② Decided: no modal — pressing "Remove" swaps the row's action strip in place for a prompt ("Remove this saved search?") with "Remove" / "Cancel" buttons, exactly mirroring account/Preferences.tsx's sign-out confirm pattern, but scoped per-row instead of once per screen.
③ Why: the destructive-action rule in the catalog's `Plat=both` rows says "confirm before destructive actions" without mandating modal vs. inline; the task prompt explicitly allows "tap again to confirm" as sufficient. Since this screen already has an established sibling precedent (account/Preferences' `SignOutRowView`) for exactly this two-step inline confirm shape, I reused it rather than inventing a third pattern, for internal consistency across the app's settings-adjacent screens.

① Decide: how the frequency editor should close — auto-collapse on selection (apply-and-close) vs. requiring a separate "Done" tap.
② Decided: selecting any frequency option applies immediately AND collapses the editor in the same action; a separate "Cancel" button only closes the editor without changing anything.
③ Why: r2's lesson is explicit that settings-type interactions should apply immediately with no deferred save step. Requiring a "Done" tap after selection would have reintroduced a two-step commit pattern the round's own accumulated lesson argues against, so I removed it and kept only "Cancel" (a true no-op escape hatch, not a confirm step).
