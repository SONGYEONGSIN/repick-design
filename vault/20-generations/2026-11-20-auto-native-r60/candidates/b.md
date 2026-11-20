# Candidate b — Age/ID Verification Gate

One-line concept: A single-screen buyer-side gate for a restricted purchase (a fixed-blade hunting knife, 18+) where the buyer confirms the date-of-birth and ID photo already on file, taps one "Verify & Continue" action, and sees the pending → approved/denied result announced in-content — no bottom band, because there's nothing left to continuously gate once this one check resolves.

File: `native/src/evolve/r60/b/AgeVerificationGateScreen.tsx` (export `AgeVerificationGateScreen`), data in `native/src/evolve/r60/b/data.ts`.

## 브리프에 없던 것

1. **① Whether the verification result needs an async/pending phase at all, given no Date.now/Math.random is allowed for "deterministic" dummy data.**
   ② Added a fixed `setTimeout(..., 900)` delay (constant `VERIFY_PENDING_MS` in `data.ts`) between tapping "Verify & Continue" and the state resolving to approved/denied, rather than resolving instantly.
   ③ Arbitrary, but deliberate: the brief explicitly requires a live-region-announced *transition* from pending to approved/denied, which implies a pending state must exist and be visible for a moment. A fixed millisecond delay is not randomness or a clock read — it's just a timer duration — so it stays inside the "no Math.random/Date.now/new Date" rule while still giving the pending state somewhere to show.

2. **① What actually determines approved vs. denied, since the brief says "make up a plausible verification state" but doesn't say whether the screen should ever reach "denied."**
   ② Made the outcome a pure derived comparison (`IDENTITY_ON_FILE.ageOnFile >= RESTRICTED_ITEM.minAge`) against hardcoded dummy data, which evaluates to `true` (age 25 vs. minimum 18) — so the demo path is "approved," but the component itself is generic/not hardcoded to "always approved," and the denied visual branch is fully built and reachable if the dummy data were edited to an underage buyer.
   ③ Arbitrary (my call), but chosen so the code is honest about why the outcome is what it is (a real comparison, not a hardcoded string), and so the denied UI isn't dead/unreachable code — it's just not the dummy data's current path.

3. **① Whether the post-approval state should offer a further "Continue to checkout" tappable action, since there's no real checkout screen to route to in this isolated component.**
   ② Decided against it — once approved, the button area is removed entirely and replaced by the status card's text ("you can continue to checkout") as information, not a fake affordance. No dead-end Pressable with an onPress that does nothing.
   ③ Reference: the rule "never attach an accessibilityHint describing behavior a Pressable doesn't actually implement" reads as a broader signal against fake affordances in general — so I erred toward not building an inert button at all rather than building one with a vague label and no hint.

4. **① How "confirm an ID photo already on file" should look without implying a real camera/upload action.**
   ② Rendered it as a checkbox-style confirmation row ("Yes, this ID photo is still accurate") against a static placeholder swatch + captured-date metadata — not an "Upload" button, since the brief's own gate rule warns against hinting an upload/camera action a Pressable doesn't perform.
   ③ Direct application of the brief's own warning about dummy upload buttons; reusing the existing confirm-row pattern already used in `native/src/verification/SellerVerificationScreen.tsx` (read for convention, not copied domain) for visual consistency with the rest of the app's identity-confirmation idiom.

5. **① Whether the two-item checklist (DOB confirm + ID photo confirm) should use `FlatList` or just be hardcoded as two inline rows, given the brief's FlatList idiom is scoped to "lists of any real length."**
   ② Used `FlatList` anyway (as the screen's root scrollable list, with `ListHeaderComponent`/`ListFooterComponent` for everything else), even though it's only 2 items.
   ③ Arbitrary but low-cost: matches the existing `SellerVerificationScreen.tsx` convention in this codebase (FlatList-as-scroll-container with header/footer slots) and keeps the screen using the mandated import/idiom rather than reaching for `ScrollView` + `.map()`.

6. **① Exact restricted item and its price/category, and the buyer's identity fields — none specified by the brief beyond "a specific restricted item and a plausible verification state."**
   ② "Marlowe Fixed-Blade Hunting Knife" ($184.00, Outdoor & Field Gear, 18+), buyer "Alex R. Donovan," DOB "June 14, 2001" / age 25 on file, ID photo "captured Mar 3, 2024."
   ③ Arbitrary, invented, fictional — chosen to match the brief's own example ("e.g. a collectible knife") and to keep every number/date hardcoded and consistent with each other (age 25 is consistent with a 2001 DOB as of a plausible "present" without ever computing it live).

7. **① Disabled-button styling: the token set doesn't define a dedicated "disabled" background, and simply swapping to `border` gray under white button text would fail contrast.**
   ② Used `opacity: 0.45` on the button as a whole (keeping its accent background + white text) rather than swapping to a different background color.
   ③ Reference: brief's own UX guideline "disabled states get reduced opacity + non-interactive styling" — took that literally rather than inventing a new disabled-background token combo that risked breaking the AA contrast rule.
