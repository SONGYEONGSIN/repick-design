# Candidate A — Seller Response Templates

## Concept

`SellerResponseTemplatesScreen` is a seller-facing library screen for managing canned reply
snippets ("Still available", "Already sold", "Price is firm", etc.) that sellers reuse when
answering buyer messages. Each row shows the template's title, category tag, body preview, and
how many times it's been used. Rows are selected by pressing a leading checkbox-style control
(press-to-select, no swipe) — with zero rows selected, no bottom surface exists at all. The
instant one or more rows become selected, a dark contextual bar mounts at the bottom of the
screen, announces the live selection count through a polite live region, and offers two real
bulk actions: **Duplicate** (adds copies of the selected templates to the library, resets their
usage count to 0) and **Delete** (opens a native confirm dialog before removing anything). After
a delete is confirmed, the selection is cleared — unmounting the bar — and a separate, short-lived
toast appears with an **Undo** action that restores the exact prior list; the bar and the toast
are structurally mutually exclusive since the toast is only ever rendered while the selection
count is zero. If every template is deleted, an empty state offers a one-tap "Restore sample
templates" action rather than leaving a blank screen.

## Render-check string

"Response Templates"

## 브리프에 없던 것 (What the brief didn't specify)

1. **① What** the second bulk action (alongside Delete) should be. **② Decision:** Duplicate —
   selected templates are copied into the library with "(copy)" appended to the title and usage
   count reset to 0. **③ Why:** the brief explicitly offered "duplicate/export" as an example
   second action; duplicate is more useful than export for a small on-device template library
   (no file system to export to) and gives the bar two genuinely different action types
   (additive vs. destructive) to exercise the mutual-exclusivity rule meaningfully.

2. **① What** happens to a deleted template — gone forever or recoverable. **② Decision:** a
   snapshot of the full list is taken right before delete, and the post-delete toast carries an
   "Undo" button that restores that exact snapshot. **③ Why:** the catalog rule calls for
   destructive-action confirmation, but a confirm dialog plus a disappearing toast with no
   recovery path still leaves a seller with no safety net if they fat-finger "Delete" through the
   confirm; undo-via-snapshot is a common, low-risk mobile pattern for exactly this gap.

3. **① What** triggers selection — tapping anywhere on the row, or only a small checkbox hit
   area. **② Decision:** the entire row is the pressable/toggle target (not just the 24×24
   checkbox glyph), with the checkbox glyph as a purely visual indicator. **③ Why:** the brief
   says "checkbox/press-to-select" as one option, not two; a full-row target comfortably clears
   the 44×44pt minimum touch-target rule without needing `hitSlop` padding around a tiny visual
   checkbox, and is the more forgiving mobile pattern for a list meant to be scanned quickly.

4. **① What** data to show per template beyond the reply text itself. **② Decision:** added a
   `category` tag (Availability, Price, Shipping, Pickup, Condition, Thanks) and a `usageCount`
   ("Used 1,240 times"). **③ Why:** a bare list of reply strings felt thin for demonstrating
   real content hierarchy and the thousands-separator numeric-formatting rule; category tags
   also mirror how sellers would actually organize a growing template library.

5. **① What** happens when the library is emptied out entirely (all 8 deleted). **② Decision:**
   built a real empty state (title + explanatory body + a functional "Restore sample templates"
   button that resets to the deterministic seed data) rather than letting the screen go blank.
   **③ Why:** the catalog explicitly flags empty-state guidance as a 🟡 rule, and since Delete is
   a real, functioning action here (not a stub), emptying the list is a reachable state that
   needed a real answer, not a hypothetical one.

6. **① What** color/surface treatment distinguishes the selection bar from the toast so they're
   never visually confusable even though they occupy the same screen region at different times.
   **② Decision:** the selection bar uses the dark `tokens.color.ink` surface with `onInk`/
   `onInkMuted` text (a deliberate contrast shift from the rest of the near-monochrome-on-white
   screen, signaling "temporary mode"), while the toast uses the lighter `tokens.color.ink2`
   card-on-white treatment. **③ Why:** tokens.ts's own comments call out `onInk`/`onInkMuted` as
   existing specifically for dark-ink surfaces; reusing that existing pairing rather than
   inventing a new tint keeps the screen inside the token set while still giving the two
   transient surfaces distinct identities.
