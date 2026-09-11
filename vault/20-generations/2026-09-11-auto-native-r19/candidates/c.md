# Candidate c — Public Listing Q&A

**Concept**: A public question-and-answer board attached to one item listing — every question and its answer is visible to any prospective buyer (not the private buyer↔seller negotiation channel `offer-thread/OfferThread.tsx` already covers), showing an always-open compose box ("Ask a Question"), a sortable list of prior questions each carrying a helpful-vote count and either a seller's or another buyer's answer (or a pending "awaiting an answer" state), with no fixed bottom band since asking a question is never gated.

**Check string** (exact visible text for the render-check): `Ask a Question`

**Files**:
- `native/src/evolve/r19/c/ListingQA.tsx` — screen component (default export `ListingQAScreen`)
- `native/src/evolve/r19/c/data.ts` — deterministic dummy data (listing summary, seeded questions/answers, formatters)

## Brief gaps

1. **Decide**: the brief specifies band form (4) — no fixed bottom band — but doesn't say what, if anything, replaces the "gated terminal action" pattern this catalog otherwise leans on for its one live-region moment.
   **Decided**: the live region lives on an inline confirmation banner that appears in the scroll flow right after the compose box when a question is posted ("Your question was posted…"), then settles (disappears) on the next unrelated interaction (typing again, toggling a sort tab, marking something helpful) or an explicit dismiss (✕).
   **Why**: convention — this mirrors the "settle on next interaction" pattern already used for the undo row in `r18/b/SavedSearchesScreen.tsx`, but renamed (`confirmationVisible`/`dismissConfirmation`, not `bandBlocked`/"Tap to go there") per the DNA note against reusing prior screens' exact key names or copy, and it isn't a band at all — it scrolls with content, consistent with form (4).

2. **Decide**: who answers a public Q&A question — the brief says "the seller's (or in some cases another buyer's) answer" but leaves the actual mix/role-labeling unspecified.
   **Decided**: added an explicit `role: "seller" | "buyer"` on every `QAAnswer`, with a small "Seller" (accent-filled) vs "Buyer" (outlined) tag before the answer text, and seeded 3 seller answers, 1 buyer answer, 1 unanswered question.
   **Why**: arbitrary but deliberate — a public board where only the seller ever answers wouldn't need the role distinction the brief explicitly called out, so I built the seed data to actually exercise both branches rather than leaving "buyer answers" a theoretical code path.

3. **Decide**: whether votes/helpful counts need their own live-region announcement — the brief's "focus your live-region attention on wherever state actually changes meaningfully" is a judgment call per interaction.
   **Decided**: the per-question "Helpful" toggle updates its own count and `accessibilityLabel` (e.g. "Marked helpful. 15 people found this helpful.") but does **not** get a live region — only the compose-post confirmation does.
   **Why**: convention — DNA explicitly forbids two simultaneous live regions ("no more, no less" than one), and a focus-bound label change on the toggle itself already communicates the new state to a screen reader when it's re-visited, the same way the r18 `HelpfulButton`-style toggles in this codebase (e.g. `NotifyToggle`) rely on `accessibilityState`/label rather than a live region for a routine per-row toggle. The compose-post moment is the one genuinely novel, unprompted state change (new content appears without the user re-focusing anything), so that's where the alert+polite pair belongs.

4. **Decide**: whether the screen needs a sort/filter control at all — the brief only requires "a list of prior questions" and a compose box, no sort is mandated.
   **Decided**: added a two-way "Most helpful / Newest" segmented sort (defaulting to Most helpful) above the list.
   **Why**: arbitrary addition, but low-risk — a real Q&A board with dozens of entries needs some ordering choice, and reusing the existing segmented-control idiom (already validated for `ConditionSegmented` in `r18/b`) keeps it in-language rather than inventing a new control type. It's presentation-only (re-sorts a client-side array), doesn't gate anything, and doesn't conflict with the no-band decision.

5. **Decide**: no listing photo asset exists in this codebase's dummy-data conventions (no image imports appear anywhere in the sampled prior screens).
   **Decided**: used a bordered placeholder tile with a plain vector glyph (`◇`) instead of an `<Image>`.
   **Why**: convention — matches the "no emoji, vector icon/text glyph instead" DNA rule and avoids introducing a new image-loading pattern (remote URI, require(), etc.) this codebase doesn't establish elsewhere for listing thumbnails.
