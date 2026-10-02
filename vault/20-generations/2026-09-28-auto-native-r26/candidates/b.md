# Candidate b — Seller Rating Summary

One-line concept: a read-only completed-record screen showing a seller's aggregate rating breakdown (switchable score lens with live-recomputed average + star histogram, plus item/shipping/communication sub-scores) above a scrollable list of individual written reviews, with a persistent share action bar and per-row flag-for-moderation confirm.

## 브리프에 없던 것

1. **What**: whether the aggregate numbers should be static dummy literals or derived from underlying data.
   **Decided**: `data.ts` exports only a fixed `ratingEntries` array plus pure fold functions (`averageForLens`, `distributionForLens`); the screen computes the hero score, star histogram, and category sub-scores via `useMemo` over that array, never a hardcoded summary number.
   **Why**: the round's open-deltas note flags "live-recomputed hero/summary values tied to the same inputs" as a strong completion-lens signal from a prior round; even though this screen has no blocked workflow, tying the header number to a real fold over the review list (and making it re-derive live when the shopper switches score lens) demonstrates the same rigor without inventing a workflow that doesn't belong on a finished record.

2. **What**: which single "real action" belongs on the persistent bottom action bar, since the brief offered two options ("Share rating summary" or "Flag a review") but only asked for one wired mechanism.
   **Decided**: put "Share rating summary" on the fixed bottom bar (toggles an inline share-preview panel that echoes the seller name, currently-selected score lens, live average, and review count — a real, visible, state-driven outcome, not a toast that vanishes); moved "Flag a review" down to a **per-row** Cancel/Confirm swap on each review card instead, per GENERATION.md's explicit rule that independent per-row destructive-ish actions get a row-level swap, not one global band.
   **Why**: flagging a review is inherently per-item (each review is independently reportable), so folding it into the single global bottom bar would violate the doctrine's own "a global gate doesn't make sense when rows are independent" clause; the share action is the one screen-level action that makes sense as a singleton band.

3. **What**: how to represent "star" visuals without emoji and without a design-system icon library.
   **Decided**: used the Unicode glyphs `★`/`☆` (filled/outline star) as plain `<Text>` characters, colored via `tokens.color.accent` / `tokens.color.border`, sized independently for the hero (22px) vs. inline review tags (default) vs. row headers (16px).
   **Why**: GENERATION.md requires "vector/text icons if needed, no emoji" — a typographic star glyph is a standard text-icon idiom (not an emoji pictograph) and needs no new asset or icon-font dependency, consistent with the token-only/no-new-dependency constraint.

4. **What**: what "category sub-scores" and "star distribution" should mean together, since a naive reading would just show two unrelated static blocks.
   **Decided**: introduced a `ScoreLens` selector (chips: Overall / Item as described / Shipping speed / Communication) that re-targets *both* the hero score+distribution histogram at once, while the three sub-score cards below always show all three category averages regardless of the active lens (so the sub-score grid stays a stable "breakdown," while the hero+histogram becomes the interactive, live-recomputed portion).
   **Why**: this gives the screen one genuine interactive mechanism worth a live region (satisfying the "live-recomputed" signal) while keeping the sub-score grid legible as a fixed reference block, rather than needing five separate histograms on screen at once.

5. **What**: deterministic "posted" timestamps without `Date.now()`/`new Date()`.
   **Decided**: fixed relative-time string literals per review (`"Posted 2 days ago"`, `"Posted 3 weeks ago"`, etc.), authored in ascending chronological order down the list.
   **Why**: GENERATION.md forbids non-deterministic date APIs in dummy data; a plain literal string sidesteps any need for a clock while still reading naturally in a reviews UI (arbitrary choice, no existing screen convention referenced).
