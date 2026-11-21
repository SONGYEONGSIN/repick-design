Check string: "Shared Collections"

# Candidate c — Collaborative Watchlist Share

`native/src/evolve/r43/c/CollectionShareScreen.tsx` + `native/src/evolve/r43/c/data.ts`

## Concept

Macro layout is a two-column card grid (`FlatList numColumns={2}`, no `.map()`)
over the buyer's saved collections (`COLLECTIONS` in `data.ts`, 6 deterministic
items). Each card is a self-contained share-settings unit:

- Name + item count.
- A friend badge (initials-as-avatar on `tokens.color.accentBg`/`accent`, the
  documented "selection/emphasis" use of that tint) naming who the collection
  is already shared with — a fixed 1:1 collaborator per collection, per the
  brief's "shares one of their saved watchlists with a friend" framing.
- A two-option segmented permission toggle (`accessibilityRole="radio"` pair,
  `accessibilityState={{selected, checked}}`) — View only / Can edit — which
  edits *working* state (`draftSharePermissions`), not the live link.
- A `Share Link` button that reveals/hides that collection's fixed share-link
  slug plus the permission *currently live on the link* (`permissionsSharedLast`,
  not the draft) — so a revealed link never overstates what it grants while a
  change is pending. This is the per-card "share action" the brief calls for;
  it is a plain reveal/hide toggle, not a clipboard write or any promise the
  code doesn't keep.
- A small `cardUnsyncedNote` ("Changed — sync to update the link"), shown only
  while that card's draft disagrees with its live permission — a continuously
  re-derived status string, not an ephemeral announcement, so it needs no
  manual clearing.

Bottom-band mechanic: the dirty-state/snapshot-diff shape, reused in
*principle* only. `draftSharePermissions` (what the toggles show) is diffed
against `permissionsSharedLast` (what each friend's live link actually
grants — the last-saved snapshot) by `findUnsyncedCollectionIds()`, a pure
per-id comparison. The band (`ShareSyncBar`, styles rooted at `shareSync*` —
`shareSyncBar/Headline/Detail/Actions/ConfirmButton/RevertButton`, no
`unsavedBand*`/`bandButton*`/`bandBlocked*` family names anywhere) mounts
only while `pendingSyncIds.length > 0`, names up to two affected collections
plus an overflow count, and offers `Discard` (revert draft → live) or
`Sync & Share` (commit draft → live for every pending id at once).

Both the band and the post-sync confirmation render inside one always-mounted
`<View accessibilityLiveRegion="polite">`, mutually exclusive by construction
(`pendingCount > 0 ? <ShareSyncBar/> : justSyncedMessage ? <toast/> : null`),
so the screen never carries more than one live region. The band's headline
text gets `accessibilityRole="alert"` unconditionally *within that branch*
because it is re-derived every render and only ever rendered while true (same
contract already used for the `bandHeadline`/count text in this catalog's
settings-screen precedent) — it is never stale. The separate post-sync
confirmation (`justSyncedMessage`, "Share settings updated — N collections
synced.") is the actual "just happened" transient: its `Text` gets
`accessibilityRole={justSyncedMessage ? "alert" : undefined}`, and a
`setTimeout` (ref-tracked, cleared both on re-sync and on unmount) blanks it
back to `""` after 4s so the alert role cannot latch on permanently.

No wrapper has `accessible={true}`; `accessibilityLabel` is set on each leaf
Pressable (toggle options, link-reveal button, band buttons) individually, so
nothing collapses the card's multiple interactive children into one opaque
focus unit. No `accessibilityHint` anywhere promises an outcome the handler
doesn't perform — the link-reveal button's label just says what toggling it
shows/hides, and the sync button's label states only the count it updates.
All collection names, friend names/initials, item counts and link slugs are
literals in `data.ts`; no `Math.random`, no bare `Date.now()`/`new Date()`.

## Brief gaps

1. **① Whether "share action" means an actual link-copy/share-sheet call, or
   a reveal.**
   ② Decided: a plain reveal/hide toggle of the fixed link text (plus the
   permission currently live on it), not a `Clipboard`/`Share` API call.
   ③ Pattern reference + honesty rule: GENERATION.md §4 explicitly bans an
   `accessibilityHint` (or, by the same logic, any user-facing copy) promising
   an outcome the handler doesn't perform (`r14/c` was docked for exactly
   this). Since this screen has no real backend to actually transmit a link,
   claiming "copied" or "sent" would be a lie for every user, sighted or not.
   A reveal is the most honest action available that still demonstrates the
   "share" affordance the domain requires.

2. **① Whether the friend-per-collection relationship is many-to-one,
   one-to-one, or a collection could have zero collaborators yet.**
   ② Decided: every collection in the grid already has exactly one named
   collaborator (friend); no "not yet shared" empty state.
   ③ Arbitrary, for scope control: the brief's own framing ("shares one of
   their saved watchlists... with a friend... sets a per-collection
   permission") reads as describing collections that are already shared, with
   the permission being the thing actively managed on this screen — adding an
   unshared/no-collaborator branch would introduce a second, unrelated empty
   state not asked for by the macro-layout spec (card grid + segmented toggle
   + share action per card).

3. **① What the band's dirty-state "snapshot" should actually represent when
   a reveal, not a permission edit, is also an action on the card.**
   ② Decided: link-reveal visibility (`revealedLinkIds`) is excluded from the
   dirty/snapshot comparison entirely — only the permission map feeds
   `findUnsyncedCollectionIds()`. Revealing a link is a local, reversible
   viewing choice with no "saved" counterpart, not a change to be synced.
   ③ Pattern reference: this mirrors the accepted distinction in GENERATION.md
   between a value "purely re-derived from current state" (no band
   involvement) and the actual working/saved pair that the band exists to
   reconcile — reveal state is neither; it simply isn't part of what gets
   shared.

4. **① Whether `Sync & Share` should commit all pending collections at once,
   or require a per-card individual confirm.**
   ② Decided: one bulk commit for every currently-pending collection,
   mirroring the single confirmed/working-snapshot pair this mechanic is
   defined on (the brief: "the full set of per-collection permission
   toggles" vs. "what was last actually shared" — both described in the
   singular, as one map each, not N independent per-card snapshots).
   ③ Pattern reference: this round's own brief language, plus the existing
   in-catalog precedent (`NotificationPreferencesScreen`) where one Save
   commits every changed preference key in one action rather than per-row.

5. **① Card grid density/column count.**
   ② Decided: `numColumns={2}` with 6 total collections (3 even rows).
   ③ Arbitrary within the brief's constraint ("a card grid... distinct from a
   roster list and a single-focus card") — 2 columns was chosen so each card
   has enough width to host a two-option segmented control at a readable
   label size without truncation, which a 3-column layout would have
   squeezed uncomfortably at the 44pt touch-target minimum.
