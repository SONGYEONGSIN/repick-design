# Candidate a — Trade-In Payout Estimator

A bandless, always-live pricing calculator: a category pill row, a four-tier condition segmented control, and a quantity stepper drive a single always-visible result card that recomputes a full payout breakdown (base value → condition multiplier → bulk-quantity bonus → total) on every change, with no submit, lock, reveal, or accept/decline step anywhere.

## Component / heading (for gate registration)

- Default-exported component: `TradeInPayoutEstimatorScreen`
- File: `native/src/evolve/r54/a/TradeInPayoutEstimatorScreen.tsx`
- Sibling data file: `native/src/evolve/r54/a/data.ts`
- Exact rendered heading text (real `<Text accessibilityRole="header">`, always on screen regardless of input state): `Trade-In Payout Estimator`

## Brief gaps

1. **Category list and base values** — the brief named the control shape ("segmented/pill control for category") but not the categories or their dollar values. Invented five: Sneakers ($85), Handbags ($140), Watches ($220), Electronics ($95), Streetwear ($40) — a spread of price points so the live recompute is visibly meaningful across categories, chosen arbitrarily but kept deterministic in `data.ts`.

2. **Number and shape of condition tiers** — the brief said "a segmented control for condition" but not how many tiers. Used four, mirroring the tier count already established by r47/a's `InstantTradeInScreen` condition-option convention (3 options per question there, but 4 overall condition states felt like the natural single-axis equivalent): Like New (×1.00), Good (×0.80), Fair (×0.55), Heavily Worn (×0.30). Multipliers are round, legible numbers rather than anything with a cited real-world justification.

3. **Bulk-tier thresholds and bonus size** — the brief required "a bulk-quantity bonus/discount" but not the breakpoints. Chose a bonus (not a discount) framing — trading in more items earns a better rate, which reads as encouraging rather than punitive on a payout screen — at 1–2 (0%), 3–5 (+5%), 6–9 (+10%), 10–12 (+15%), with a quantity cap of 12. The cap exists only so the stepper has a visible disabled-state ceiling to demonstrate `accessibilityState={{ disabled }}` correctly.

4. **Rounding / currency precision** — the brief didn't specify display precision. Used two-decimal USD (`$XX.XX`) throughout since condition multipliers (×0.55 etc.) produce non-integer dollar amounts; this differs intentionally from r47/a's `InstantTradeInScreen`, which rounds to whole dollars — this screen's math is exact-cents because it's explicitly a "calculator," not a final offer amount.

5. **Icon/glyph choice** — used plain text glyphs `−` / `+` for the stepper buttons rather than any vector icon library or emoji, per the DNA's "no emojis, no theatrical decoration" rule and consistent with how other catalog screens (e.g. `SizeReferenceScreen`'s `+`/`–` expand chevron) use bare text glyphs instead of icon fonts.

6. **Live-region placement** — the brief said to wrap the result panel with `accessibilityLiveRegion="polite"` and put `accessibilityRole="alert"` only on the most meaningful changed value. Chose the total dollar amount as that one value (not the per-line breakdown rows), since it's the single number a user glancing at the screen cares about after any input change; the breakdown lines update visually but aren't separately announced, avoiding the "more than one live region" rule and avoiding over-announcing every line on every keystroke-equivalent tap.

7. **Layout container** — the brief didn't mandate ScrollView vs. a non-scrolling View. Used `ScrollView` since the full control set (5 category pills + 4 condition segments + stepper + multi-line result card) can exceed a small phone's viewport in portrait, and `ScrollView` for a small, bounded, non-paginated set of controls is an established idiom elsewhere in this catalog (confirmed via grep across evolve/).

## Non-duplication check

- **evolve/r47/a/InstantTradeInScreen** (nearest neighbor by domain — also a trade-in payout number computed from fixed lookup data). Differs architecturally in every load-bearing way: InstantTradeIn's state is a `Phase` state machine (`blocked → primed → offered → accepted/declined`) gated by "are all questions answered," with an explicit reveal tap, a `FlatList` of question rows, `useRef`-driven `scrollToIndex` + `AccessibilityInfo.setAccessibilityFocus` jump-to-unanswered-question logic, and a bottom band that itself morphs into an Accept/Decline button pair ending in a terminal locked state with a "Start over" reset. This screen has none of that: no `Phase` type, no gating predicate, no reveal step, no decision/lock state, no bottom band at all, no FlatList (the control set is small and fixed), and no focus-jumping logic — the three inputs are independent, always-editable, and the result is simply `computePayout(categoryId, conditionId, quantity)` recomputed via `useMemo` on every keystroke-equivalent tap, with no terminal state ever reached. It is structurally closer to a mortgage/tip calculator than to an offer flow.
- **evolve/r53/c/SizeReferenceScreen** (nearest neighbor by "no band" macro shape — also a bandless, continuously-interactive screen with segmented toggles, pills and a live-updating summary line). Differs in that SizeReference is a *browse/filter/lookup* tool over a growing dataset (search text, category filter, sort order, unit toggle, expand/collapse per card, `FlatList` over filtered results, an empty state) — its "liveness" is re-filtering a list, not recomputing an arithmetic formula. This screen has no search, no filtering, no list of records, no expand/collapse, and no empty state (there is nothing to be empty — the three inputs always resolve to exactly one deterministic number). The shared trait is only "no band, always interactive," which the brief itself names as the valid macro shape for this round; the actual state shape (3 scalar inputs → 1 derived numeric breakdown object) and interaction model (tune-and-read, not filter-and-browse) are unrelated.
- **evolve/r26/c/LinkedBankAccountsScreen** (considered, not read in full — named in the production-screen list as a settings/list-management screen). Not a close neighbor: it manages a persisted list of linked accounts (add/remove/reorder), which has no analog here — there is nothing to add, remove, or persist on this screen, only three transient input values held in local `useState`.

Overall: the "no band, no gate, no selection-derived lock, continuously live recompute" shape is new to this catalog as far as these neighbors show — the closest cousin in spirit (r47/a) is explicitly a gated reveal-then-decide flow, which this screen is not.
