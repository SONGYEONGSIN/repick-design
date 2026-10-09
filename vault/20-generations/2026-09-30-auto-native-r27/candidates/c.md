# Candidate c — Blocked Accounts

A settings-style screen listing every buyer/seller account this user has blocked, where unblocking
is a per-row destructive action rather than a screen-level workflow. The screen assigns each row
one of three states: a plain "Unblock" affordance (for user-initiated blocks), an in-place
Cancel/Confirm pair once "Unblock" is tapped, or a permanently locked state (for blocks applied by
repick Trust & Safety, e.g. confirmed fraud, which cannot be removed from this screen at all —
the screen's non-destructive business rule, a computed `canUnblock` eligibility flag per row
rather than a shared toggle). Per the assigned bottom-band form (#4), there is **no fixed bottom
chrome whatsoever** — the FlatList simply ends, and destructive intent is resolved entirely within
the row via a Cancel/Confirm pair (never a native `Alert`). Exclusivity is enforced structurally:
`confirmingId` is a single scalar state value, so requesting a second row's confirmation silently
resolves the first row back to normal — at most one row can ever be in the confirming shape.

## Render-check string

`Blocked Accounts`

(Also present and equally distinctive if a more specific match is needed: `Locked by repick Trust & Safety and can't be removed here` — the computed-eligibility summary line.)

## 브리프에 없던 것 (What the brief didn't specify)

1. **What domain to pick.** The brief allowed any non-duplicate marketplace domain. I chose
   "Blocked Accounts" (buyer/seller block list) because it naturally has no single screen-level
   gate — every row is independently, destructively actionable (unblock) — which is an exact fit
   for assigned form #4, and it isn't in the permanent-catalog or r23–r26 exclusion lists.
   Decided arbitrarily within the brief's own suggested-ideas list ("a blocked-users list" was
   explicitly named as an example).

2. **The non-destructive business rule.** The brief required "at least one genuine
   non-destructive business rule" and gave "a computed eligibility flag" as one valid shape. I
   invented `blockedBy: "user" | "platform"` and a `canUnblock()` function so that
   platform-applied (Trust & Safety) blocks are permanently locked and cannot be unblocked from
   this screen, only appealed via support. Decided by reasoning from the repick domain (a
   marketplace plausibly has staff-enforced blocks distinct from user-initiated ones) — this is a
   judgment call, not drawn from another screen.

3. **What "resolve the first row" means when a second row's confirm is requested.** The brief says
   triggering a second row's confirm should "resolve/cancel the first" but doesn't say whether
   that should itself produce a visible/announced side effect. I chose a silent resolve (no status
   message fires for the row that got bumped) since only one `confirmingId` value can exist at
   once — the first row simply re-renders back to its normal "Unblock" state with no explicit
   "cancelled" announcement for it, because no user-facing action was taken against that account.
   Arbitrary judgment call, made to avoid a confusing secondary announcement competing with the
   new row's confirm message in the single live region.

4. **Single live-region wording/placement.** The brief mandates a container with
   `accessibilityLiveRegion="polite"` plus inner `accessibilityRole="alert"` text, but not its
   copy or layout. I placed one persistent status region directly under the header (above the
   FlatList) that all three transitions (confirm-requested, cancelled, confirmed) write into, and
   kept the in-row confirm question as plain (non-alert) text so the screen never has two alert
   sources firing from one handler. Decided by re-deriving the doctrine's stated rule from
   general RN accessibility practice, not copied from another screen's variable names.

5. **Copy tone and specific reasons/dates in dummy data.** The brief didn't specify exact block
   reasons, names, or dates. Invented 8 deterministic fixed-string entries (6 user-blocked, 2
   platform-locked) with plausible, varied block reasons (spam/harassment/no-shows for
   user-blocks; fraud/chargeback/counterfeit docs for platform-blocks) to make the locked-vs-
   unblockable distinction legible at a glance. Arbitrary judgment call, matching the
   deterministic-data convention already used in `native/src/sessions/data.ts` (fixed labels
   instead of computed dates).

6. **Avatar decorative markup.** Used `accessible={false}` on the initials-avatar `View` since it
   carries no independent information beyond the adjacent name text, to avoid it becoming a
   redundant stop for screen readers. General RN accessibility practice, not mandated by the
   brief.

7. **Locked-row visual treatment.** Invented a small bordered "Locked · T&S" badge using
   `tokens.color.warning*` (not `danger*`, since it's an informational/status marker rather than
   an error) plus an explanatory note. Judgment call: reused the existing `warning` token family
   because the state is "notable, not actively catastrophic," distinct from the destructive-red
   `danger` family reserved for the Confirm-unblock action itself.
