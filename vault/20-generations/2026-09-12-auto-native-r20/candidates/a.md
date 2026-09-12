# auto-native-r20 · candidate a — Trade Proposal

One-line concept: a screen for composing and adjusting one active item-for-item barter proposal — pick which of your own items sit on your side and which of the counterparty's items sit on theirs (checkbox-style toggles on both sets), add an optional one-directional cash top-up, and watch a live fairness readout (a two-segment value bar plus a computed "who's ahead by how much" line) update as the selection changes — with the send action living inline next to that readout instead of in a fixed bottom band, since there is no multi-step gate here beyond "at least one item is picked on each side."

## Files
- `native/src/evolve/r20/a/TradeProposalScreen.tsx` — screen component (default export `TradeProposalScreen`).
- `native/src/evolve/r20/a/data.ts` — deterministic dummy data: `MY_ITEMS` (4 items the user owns), `THEIR_ITEMS` (6 items the counterparty owns), the mid-negotiation initial selection/top-up state, top-up step/bounds, a fairness tolerance constant, and pure `formatUsd`/`sumValues` helpers.

Check string: `Trade Proposal` — the screen's `accessibilityRole="header"` title, rendered unconditionally at the very top of the `FlatList`'s header, no scroll required.

## Band-form choice: none
GENERATION.md §3 states a screen with no fixed bottom band is a fully valid choice when there's nothing to gate. This screen has exactly one real precondition to sending ("at least one item selected on each side") and no sequence of steps behind it, so a blocked-workflow state machine would be manufacturing structure that isn't there. A selection-count-driven contextual bar was also considered and rejected: that form is for when the count itself is the primary object of attention sliding in a summary bar as it changes (e.g. a bulk-relist picker) — here the count is one input among several (my items, their items, top-up direction, top-up amount) feeding one combined readout, and that readout plus the send button already sit together, inline, right where the two selection lists end. Adding a second, floating summary of the same numbers would just duplicate it. So the send control and its blocking-reason text live in the normal scroll flow, in a single `accessibilityLiveRegion="polite"` zone at the bottom of the content.

## Differentiation from the two named screens
- `offer-thread/OfferThread.tsx` (not opened, per instructions — going by its one-line description): a pure cash counter-offer chat thread, i.e. a list of messages/turns. This screen has no message list, no timestamps-of-turns, and no chat composer — its entire surface is two selectable item sets plus one top-up amount and one comparison card. The negotiation's current status is a single pill + one note line ("Countered" / "Mira countered: she dropped the tripod…"), not a scrollback of turns.
- `detail/PriceDetail.tsx` (not opened): a single item's price-history view — one item, its own price over time. This screen never shows any one item's history; it compares two *sets* of items (plus optional cash) against each other, in the present, for a trade that hasn't been finalized. There's no chart of a single item's past prices anywhere on the screen.

## 브리프에 없던 것

1. **Decide**: whether "enabled once ≥1 item is selected on your side" (the brief's literal wording) should be the entire send-gate, or whether the counterparty's side also needs ≥1 item.
   **Decided**: require ≥1 item selected on *both* sides to enable Send, with three distinct inline reasons (only-mine-empty / only-theirs-empty / both-empty) rather than one generic "add items" line.
   **Why**: domain logic — an "item-for-item barter" with nothing requested from the other person isn't a trade proposal, it's just giving items away (which a top-up-only variant could in theory represent, but this screen's whole premise is a two-sided item comparison). The brief's phrasing was about *where* the control lives (inline vs. a persistent band) and gave one example condition, not a complete gating spec, so I treated the "≥1 on your side" clause as necessary-but-not-sufficient and added the symmetric requirement on the same basis, keeping every reason honestly and specifically worded rather than collapsing them into one vague message.

2. **Decide**: what "the proposal's current status" should actually look like without building the full negotiation-thread screen.
   **Decided**: the screen opens *mid-negotiation* — `PROPOSAL_STATUS = "countered"` in `data.ts`, with `INITIAL_SELECTED_MINE`/`INITIAL_SELECTED_THEIRS`/`INITIAL_TOPUP_*` set to reflect the counterparty's last counter (she dropped a tripod, asked for a top-up), and a one-line `STATUS_NOTE` explaining that in plain language next to a status pill and a fixed "Updated 2 days ago" label.
   **Why**: this makes the composition UI demonstrably about *adjusting an existing proposal*, not just building one from a blank slate, which is closer to what "distinguish sharply from offer-thread" implied (a proposal has state/history even without a full thread) — while staying a single status line rather than growing into a message list. The relative-time string is a fixed literal, not a computed diff, per the determinism rule.

3. **Decide**: the fairness tolerance — how close in value counts as "even" rather than "X is ahead."
   **Decided**: a fixed `FAIRNESS_TOLERANCE_CENTS = 1000` ($10.00), stated as a named constant with an inline comment explaining why (real barter never lands on an exact cent match).
   **Why**: arbitrary but principled and stated in the open — a $0.01 threshold would make almost every real selection "unfair" and defeat the point of the readout; a percentage-of-total threshold was considered but rejected as harder to reason about for a user glancing at two dollar totals.

4. **Decide**: what happens to the item-selection and top-up controls after Send is pressed (the brief doesn't specify a destination screen to navigate to).
   **Decided**: pressing Send is a real, visible state change — it flips a local `sent` flag, which (a) locks every selection/top-up control (`disabled` + dimmed + `accessibilityState.disabled`, not just a silently ignored press) and (b) replaces the readiness text with a real, true confirmation line ("Updated proposal sent to Mira Chen. Waiting for a response.") inside the same live region. No `accessibilityHint` claims a navigation this build doesn't perform.
   **Why**: precedent + the explicit `accessibilityHint` rule in GENERATION.md §4 — r19/b's `Publish Bundle` action and r14's contrasting Withdraw-button failure both establish that a no-op-feeling control is fine as long as it does something real and visible in-screen and never promises more than that; locking the controls afterward (rather than leaving them silently interactive) avoids a "pressable that produces no visible or announced effect" defect on the item rows/top-up controls too.

5. **Decide**: which set of items belongs in the `FlatList` and which is fine as a `.map()`.
   **Decided**: `THEIR_ITEMS` (6 items, the browsable set of things being requested — the side that would realistically scale in a live product) is the `FlatList`'s `data`; `MY_ITEMS` (4 items — a small, closed personal inventory eligible for this one trade) is rendered via `.map()` inside the header as a chip-wrap row.
   **Why**: matches the RN-idiom rule (`FlatList` for the primary/growing list, `.map()` for short/bounded ones) and the established precedent for this exact split in `r19/b/BundleBuilderScreen.tsx` (its own `.map()`'d footer list vs. `FlatList`'d main list) — nesting a second scrollable list here would trigger the same "VirtualizedLists nested in a plain container" concern for no benefit, since the personal-items row never needs independent scrolling.

6. **Decide**: item domain/theme, since the brief left the goods being traded unspecified.
   **Decided**: camera/vlogging gear (a camera body + lens vs. another camera body + accessories), 4 items mine / 6 items theirs, with fixed cent-precision values (e.g. `32000` = $320.00) that produce a genuinely close-but-not-identical trade by default so the fairness bar has something real to show on first render, not a trivially even 0.
   **Why**: arbitrary domain choice, but the price spread (mine ≈ $415 selected + their $10 top-up ≈ $410, a small $5 gap) was chosen deliberately so a viewer sees the bar and label doing real, non-trivial work immediately rather than defaulting to a flat "Even trade."

7. **Decide**: the visual form of the "fairness/value comparison readout" itself — the brief asks for one but doesn't specify a shape.
   **Decided**: a two-segment horizontal bar (`flex: mineRatio` / `flex: theirsRatio`, using `tokens.color.accent` for my side and `tokens.color.ink2` for theirs) plus a legend row of the two dollar totals and one bold sentence naming who's ahead (or "Even trade").
   **Why**: no chart library is available under the CDN allowlist for a web artifact, and this is native RN anyway — a plain proportional `View`-flex bar is the simplest genuinely-computed (not decorative) visualization, reusing only `tokens` colors and no new hex values.

8. **Decide**: ₩/currency formatting, since the brief's item values needed a concrete display format and this trade scenario reads more naturally in USD than KRW (no locale cue in the brief pins this to Korean won specifically).
   **Decided**: plain `$` with a `formatUsd` helper (dollars + zero-padded cents, `toLocaleString` for the thousands separator), sidestepping the ₩-glyph question entirely rather than picking one of the three valid ₩ options.
   **Why**: arbitrary — GENERATION.md's ₩ guidance exists because repick's other screens are KRW-priced marketplace listings; a barter/trade scenario didn't need to inherit that currency, and using `$` avoids relitigating a already-settled, non-issue (confirmed refuted in `r11`) question that has no bearing on this candidate.
