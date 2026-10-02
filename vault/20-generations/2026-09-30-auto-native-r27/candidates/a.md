# Candidate a — Purchase Archive

One-line concept: a read-only archive of the buyer's already-completed purchases, with a
persistent bottom action bar whose one real action exports the list via the native Share sheet.

This screen (`native/src/evolve/r27/a/PurchaseArchiveScreen.tsx` + `data.ts`) shows a buyer's
finished purchase history — 12 fixed orders, every one already delivered and closed, nothing
in progress or gated. A header summary card totals the spend, item count, and most-recent date;
below it a `FlatList` of purchase rows shows each item's title/spec, seller, completion date, a
condition badge (Like New / Light Wear / Visible Wear, reusing the app's existing condition
vocabulary), and the price paid. This is assigned bottom-band form **#2 (persistent
always-visible action bar)**: the band never changes shape or blocks anything — it's mounted
identically before and after any tap — and its one action, "Export", calls the real RN `Share`
API (`Share.share`) with a deterministic plain-text digest of every order (built by
`buildExportDigest` in `data.ts`). The band's hint line reports the real outcome of that call
(shared / dismissed / unavailable) and is the screen's only live region.

## Render-check string
`Completed Purchases Archive`

## 브리프에 없던 것 (What the brief didn't specify)

1. **Which domain to build.** The brief listed several candidate domains but didn't assign one.
   Decided: a buyer's completed-purchase history with an export action. Reasoning: arbitrary
   judgment call among the brief's own suggestions ("a buyer's purchase history export" is named
   verbatim in §8), chosen because it maps cleanly onto form #2's requirement for a genuinely
   completed record plus one real, always-available action — and it's clearly distinct from the
   excluded `order-status` (single in-flight order) and `wallet` (money ledger, not item records)
   screens.

2. **What the Export action actually does.** The brief requires "a real action ... that produces
   an observable effect," citing Share/Download as examples. Decided: call the real
   `Share.share()` API from `react-native` with a generated text digest, rather than a simulated
   local-state toggle. Reasoning: general RN practice — this is an actual platform API call with
   an externally observable effect (the OS share sheet opens), which is a stronger fit for the
   brief's "not a no-op" requirement than a screen that only flips a local `shared` boolean and
   relabels a button (a pattern I noticed in one existing catalog screen but chose not to
   replicate, since the label there claims "Shared" without any real action behind it).

3. **Condition-grade vocabulary for purchase rows.** The brief doesn't specify grading labels.
   Decided: reuse "Like New / Light Wear / Visible Wear" (a subset of the existing
   `condition/data.ts` `LEVEL_OPTIONS` labels) rather than inventing new grade names. Reasoning:
   referenced another screen's convention — repick's condition-grading vocabulary is a shared
   cross-screen concept, so reusing the existing labels keeps this screen consistent with the
   rest of the catalog without duplicating the condition-assessment *screen* itself.

4. **Currency rendering (₩ vs KRW).** The brief allows either. Decided: render prices as the word
   "KRW" in a separate `Text` node before the tabular-nums digit run, never the ₩ glyph.
   Reasoning: arbitrary judgment call explicitly sanctioned by the brief as equally valid; picked
   for typographic safety margin at small badge/row sizes.

5. **Row interactivity.** The brief doesn't say whether list rows should be tappable. Decided:
   rows are static display only (no `Pressable`, no navigation affordance). Reasoning: general RN
   practice plus scope discipline — item detail is an out-of-scope/excluded domain for this round,
   and the brief says not to wire real navigation, so making rows tap-targets that go nowhere
   would risk over-promising an interaction with no effect.

6. **Share outcome states and their copy.** The brief requires state changes to be announced but
   doesn't specify the exact states. Decided: three post-tap states — `shared`, `dismissed`,
   `unavailable` (e.g. if the Share API throws, such as on a platform/target without share
   support) — each with its own factual, non-overpromising copy line, surfacing inside the one
   live region. Reasoning: general RN practice for `Share.share()`'s real `action` values
   (`sharedAction` / `dismissedAction`) plus a defensive `catch` path so the copy never claims an
   outcome the call didn't actually reach.

7. **Number of purchase records and the date range.** The brief doesn't specify list length.
   Decided: 12 fixed records spanning Jan 15, 2026 – Sep 18, 2026 (all before today's in-context
   date of Sep 30, 2026, so every record reads as genuinely in the past). Reasoning: arbitrary
   judgment call — large enough to justify a `FlatList` over static rows per the RN-idioms rule,
   small enough to stay readable as a single screen, and dated entirely in the past relative to
   "today" so the record's "completed" framing stays internally consistent.
