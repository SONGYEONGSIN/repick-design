# Candidate b — Cross-List to Meridian Marketplace

One-line concept: A seller browses their active listings in a single `FlatList`, checks any number of them that are eligible for Meridian (a single external partner marketplace), and a selection-count-derived contextual bar — absent at 0 selected, appearing only at 1+, with a live-region-announced running count — lets them cross-post the whole batch at once; ineligible-category and already-posted rows never render a checkbox at all, and a row that comes back "Sync Error" gets its own per-row Retry control instead of being silently re-selectable.

File: `native/src/evolve/r62/b/CrossListPartnerSyncScreen.tsx` (default export), data in `native/src/evolve/r62/b/data.ts`.

For the orchestrator: import as
```ts
import CrossListPartnerSyncScreen from "./evolve/r62/b/CrossListPartnerSyncScreen";
```
and register under a key such as `"evolve-r62-b": CrossListPartnerSyncScreen`.

**Exact visible heading text (gate check-string):** `Cross-List to Meridian Marketplace` — rendered as the screen's single `accessibilityRole="header"` `<Text>`, present on default render with 0 rows selected.

## Mechanism notes

- **Selection-count-derived bar, earned not habitual.** The only state behind the bar is `selectedIds: Set<string>`; `selectedCount` is read off `.size` every render, never duplicated into a separate toggle/phase flag. The instant a batch resolves, every id in it is cleared from `selectedIds` in the same update (those rows stop being checkbox-eligible), so the bar provably disappears in that same render rather than lingering on leftover state.
- **Live-region container is permanently mounted.** `liveDock` (the `accessibilityLiveRegion="polite"` wrapper) exists for the screen's whole life; only its children — nothing, or the bar — vary with `selectedCount`. At 0 selected it renders no children and has no explicit dimensions, so it is genuinely absent (zero height, no chrome), not merely visually hidden.
- **Exactly one live region, one alert.** No other element on screen sets `accessibilityLiveRegion`, and only the running-count `Text` inside the bar carries `accessibilityRole="alert"` — the post-batch result banner deliberately does NOT reuse this mechanism (see brief gap 3 below).
- **Ineligible and already-posted rows never expose a checkbox.** Both swap the checkbox slot for a decorative, accessibility-hidden placeholder (`accessibilityElementsHidden` + `importantForAccessibility="no-hide-descendants"`) and instead carry a visible reason (ineligible) or a success-toned "Already Posted" chip — never a disabled-but-styled trap.
- **Sync-error is a reachable, real state, not a type-only dead branch.** `data.ts`'s `resolveCrossPostOutcome` deterministically fails exactly one seeded listing (`pl-3`) whenever it's included in a batch; the "Sync Error" chip and its row-level Retry control are only ever produced by that real action path, never hardcoded into the initial data.
- **Retry is deliberately not a checkbox.** Re-including a failed row in a future batch and "acknowledging/fixing" a failure are different intents, so Retry is its own `Pressable` (resets the row to Not Posted) rather than overloading the checkbox semantics.
- **Touch targets computed, not eyeballed.** Row checkboxes and the ineligible/posted placeholder both get explicit `minWidth: 44, minHeight: 44` rather than relying on padding-around-a-22px-box arithmetic. The bar's primary action and the row Retry button both get explicit `minHeight: 44` with an inline comment showing the padding+line-box math falls just under 44 without it.
- **No `accessible={true}` wrapper trap.** Every row is a plain `View`; the checkbox `Pressable` and the Retry `Pressable` are independent leaf-level accessible elements, not locked into one opaque unit.
- **Tokens only, RN core only.** All color/spacing/radius values come from `tokens.color.*` / `tokens.space(n)` / `tokens.radius.*`; imports are limited to `View`, `Text`, `Pressable`, `FlatList`, `SafeAreaView`, `StyleSheet` from `react-native`.
- **Determinism.** `data.ts` has no `Math.random`, `Date.now`, or argument-less `new Date()` — every listing is a literal, and the one runtime transition (`resolveCrossPostOutcome`) is a pure fixed-table lookup.

## Brief gaps

1. **① What the partner marketplace is called, and how many listings to seed.**
   ② Invented "Meridian Marketplace" as the single external partner, and seeded 8 listings: 5 eligible-and-not-yet-posted, 1 already-posted, 2 ineligible-by-category.
   ③ A named partner reads more like a real commercial integration than a generic placeholder; 8 rows is enough to show every declared state (not-posted, already-posted, sync-error-after-interaction, two distinct ineligibility reasons) without padding the screen with repeats, following this round's own guidance to make the core proof visible without requiring interaction.

2. **① Exactly which eligibility rule makes a row "not eligible," and whether it's one rule or several.**
   ② Two distinct category-based reasons, both category-level (not condition- or price-based, per the brief's explicit "no price math" instruction): Fine Jewelry is blanket-unsupported by the partner, and Used Electronics requires a certification the seller doesn't have. Each row's reason is literal text in `data.ts`, not derived from a shared rule function.
   ③ The brief only said "e.g. category not supported" — giving two differently-worded reasons (rather than one generic "category not supported" string repeated) demonstrates that eligibility is read per-row from data rather than being a single hardcoded check, and keeps the screen's copy feeling like real catalog policy rather than a placeholder.

3. **① Whether the post-batch result ("3 posted, 1 needs attention") should live inside the same selection-count live region as the running-count text, since both are "transition" feedback.**
   ② Kept them separate: the result is a plain, dismissible, non-live-region banner above the list, not folded into `liveDock`. The bar's visibility stays strictly `selectedCount > 0` with nothing else influencing it.
   ③ `GENERATION.md`'s delta for this form explicitly calls out not letting a persistent-bar habit creep back in via a separately-tracked flag; routing the result through the same live region after `selectedIds` has already been cleared would have required exactly such a flag (e.g. `phase: "result"`) to keep the bar alive past 0 selected. A plain banner avoids that trade entirely, at the cost of the result not being screen-reader-announced automatically — an accepted trade since the brief's accessibility requirement is specifically about the *selection count* transition, and "never two live regions at once" is easiest to guarantee by only ever having one.

4. **① What happens to a row after a failed cross-post — can the seller ever get it unstuck, and how.**
   ② A per-row "Retry" `Pressable` (visible only on a `syncError` row) resets that one row back to `Not Posted`, re-enabling its checkbox so it can be included in a future batch. It is not a checkbox toggle and does not auto-retry.
   ③ `GENERATION.md`'s delta about declared-but-unreachable states applies directly to "sync-error" — without a real recovery path, Retry's own existence and the error chip's styling would be the only "functional-looking" thing about it. Giving it a real, traceable effect (and keeping it a distinct control from the bulk checkbox) satisfies both "every declared branch reachable" and "no non-functional `onPress` dressed up as real."

5. **① Whether rows should show a seeded "already posted" item at all, since the brief's own example list ("not-posted / already-posted / sync-error") implies it should be visible without interaction.**
   ② One listing (`pl-4`, "Leather Messenger Bag") starts in `posted` status with a success-toned "Already Posted" chip and no checkbox.
   ③ Matches the judging note that the core proof — per-row eligibility, selection count, and what cross-posting does — should be legible on first render, not discovered only after pressing things.
