# Candidate b — Linked Marketplaces Sync

**Component:** `LinkedMarketplacesSync` — default export.
**Files:** `native/src/evolve/r30/b/LinkedMarketplacesSync.tsx`, `native/src/evolve/r30/b/data.ts`.
**Screen heading (gate render-check string):** `Linked Marketplaces`

A seller's list of the external marketplace accounts their inventory syncs with, rendered as a `FlatList` of cards, each independently a three-way state machine: an ordinary row sits `idle` with a single "Disconnect" button; tapping it flips that one row — not the screen — into a `confirming` state that swaps the button for an inline Cancel / "Confirm disconnect" pair; confirming updates the row to a `disconnected` presentation (status chip only, no further control). The one administratively-locked primary row (the seller's own Repick Storefront, since every other marketplace syncs against it) is a structurally different fourth case that never enters the state machine at all — it renders a "Primary" chip and a short note explaining why it can't be removed from this screen, and literally has no Disconnect button to disable. A single live-region status line sits under the header, mounted once, and every row handler (begin-confirm, cancel, confirm) writes its own announcement into it — there is exactly one live region for the whole screen, never one per row.

## 브리프에 없던 것

1. **What:** Whether disconnecting a row removes it from the list entirely or keeps it visible in a changed state.
   **Decided:** Keep the row in place and switch it to a muted "Disconnected" chip + note, no button — row never disappears.
   **Why:** Arbitrary, but chosen over removal because the brief's doctrine is about a row's own state machine (idle → confirming → done), which implies the row persists through its states rather than vanishing; removing it on confirm would make the confirm action read as "delete this row," which isn't what disconnecting a sync account means.

2. **What:** What makes a marketplace "the primary sync source" worth locking, and what the locked row's explanatory note should say without promising unbuilt functionality (e.g. a working link to "account settings").
   **Decided:** Made the primary row the seller's own Repick Storefront itself (not a third-party marketplace), with a note stating other rows sync against it — no mention of any settings screen or action the seller could take elsewhere.
   **Why:** General convention for sync/integration lists (the "home" platform is usually the one anchor source you can't unlink) + the pitfall note about never promising a side effect the code doesn't perform, which ruled out referencing an unimplemented settings flow.

3. **What:** Whether the live-region status line should be visually invisible (screen-reader-only) or a visible on-screen element.
   **Decided:** Made it a small, always-mounted visible caption line under the header (accent-colored, fixed min-height so it doesn't shift layout when text appears/disappears).
   **Why:** General convention — a visible confirmation of "what just happened" doubles as sighted-user feedback for an inline (non-Alert) destructive action, and avoids the extra complexity/fragility of an off-screen-only live region.

4. **What:** How many rows and what sync-health states to show beyond plain "connected," to exercise the row variety without the brief specifying it.
   **Decided:** Six rows total — one primary (active) + five disconnectable, of which four are "active" and one is "attention" (expired sign-in, sync didn't complete) with its own inline note.
   **Why:** Arbitrary but modest; one non-happy-path row demonstrates the health-chip variant exists without overloading the screen with edge cases the brief didn't ask for.
