Linked Bank Accounts: a seller's settings-style list of payout destinations, where each row independently carries its own non-destructive "Set as default" and destructive "Unlink" (row-swap Cancel/Confirm, no bottom band at all since nothing on the screen is blocked).

## 브리프에 없던 것

1. **What**: whether a seller can unlink the account currently marked "default," or unlink their last remaining account.
   **Decided**: neither is allowed — Unlink is visibly disabled (border/bg swap to neutral, `accessibilityState={{disabled:true}}`) with the reason spelled out as body text under the row (`unlinkBlockReason` in data.ts: "Set a different account as default before unlinking this one." / "This is your only linked account — link another before unlinking it.").
   **Why**: general practice for payout/banking settings screens (e.g. Stripe Connect, PayPal payout accounts all block removing the sole or default destination) — a seller with zero payout accounts is a real business dead-end the marketplace can't recover from silently, so I treated it as a domain constraint worth encoding rather than leaving Unlink always-enabled.

2. **What**: how per-row destructive confirmation state should be modeled so "unlinking one account's confirm state must not affect other rows" is actually true, not just visually true.
   **Decided**: `rowsAwaitingUnlink` is a `Set<string>` of account ids (not a single nullable "which row is confirming" variable), so two different rows could in principle be mid-confirmation at once without one press silently reverting the other.
   **Why**: arbitrary-but-principled choice — a single nullable id would have looked identical in the common case (one row at a time) but would make starting a confirm on row B implicitly cancel row A's confirm, which reads as one row's action affecting another and seemed like exactly the failure mode the brief was warning against.

3. **What**: whether "Set as default" needs its own live-region announcement, and if so, where it should live relative to the per-row Unlink live region.
   **Decided**: gave the screen header its own `announceBox` (`accessibilityLiveRegion="polite"`) for default-change and post-unlink outcome messages, kept fully separate from each row's own `confirmZone` live region used only while that row is mid-Unlink-confirmation. A single button press only ever writes into one of the two.
   **Why**: directly required by GENERATION.md §4 ("never put more than one live region in play from a single user action") — since the screen has two genuinely different kinds of state change (a non-destructive default swap vs. a destructive per-row confirmation), I judged they needed physically separate containers rather than reusing one, so no single press could ever be ambiguous about which region carries new information.

4. **What**: what "Add a new bank account" should do, given the brief's terminal-CTA-must-not-be-a-no-op rule doesn't obviously name a single terminal CTA for a settings list.
   **Decided**: treated "Set as default" and "Unlink" as this screen's real terminal actions (both fully wired to visible state changes), and left "+ Link a new bank account" as an honest no-op placeholder with no `accessibilityHint` describing navigation that won't happen.
   **Why**: the open-deltas note explicitly says a no-op placeholder is fine for a not-yet-built sub-flow as long as it isn't the screen's own terminal CTA — linking a *new* account is a distinct onboarding sub-flow (bank verification, micro-deposits, etc.) clearly out of scope for a management/unlink screen, so I scoped the terminal-CTA rule to the two actions the screen's name actually promises.
