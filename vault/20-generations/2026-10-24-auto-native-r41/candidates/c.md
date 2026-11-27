# Candidate c — "Notification Preferences"

A settings screen, distinct from the app's separate notification-history feed, that lets the
account holder turn individual notification categories on or off. Categories are grouped into
"Buying" and "Selling" sections (`SectionList`), each row pairs a one-line description with a
toggle (`Switch`), and the screen is this round's third assigned test of the catalog's
dirty-state save-band mechanic: the working toggle state is compared by structural equality
against a snapshot taken at mount, and a bottom band mounts/unmounts the instant that comparison
flips, showing a live "Save Changes — N updated" count.

## Category list + grouping

- **Buying**
  - Price Drop Alerts — notified when a watchlisted listing drops in price
  - Offer Updates — notified when a seller accepts/counters/declines your offer
  - Order Status — shipping, delivery, and pickup updates for purchases
- **Selling**
  - New Messages — notified when a buyer messages you about a listing
  - New Offers Received — notified when a buyer makes an offer on your listing
  - Payout Confirmations — confirmation once a sale's payout has been sent

6 categories total across 2 groups.

## Fresh naming scheme (contrast with what was off-limits)

Not used anywhere: `isDirty`, `hasChanges`, or any other generic touched/dirty flag.

Used instead, all specific to "comparing two preference maps":
- `draftPreferences` — the live, in-progress toggle state (not "working state")
- `confirmedPreferences` — the last-saved snapshot taken at mount (not "saved state")
- `findChangedPreferenceKeys(draft, confirmed)` — the pure diff function, named for exactly what
  it returns (the list of category keys that disagree), not a boolean predicate
- `changedPreferenceKeys` / `pendingChangeCount` — the derived values the band actually reads
- `commitDraftPreferences()` / `discardDraftPreferences()` — the two band actions, named for what
  they do to the two maps (promote draft → confirmed, or roll draft back to confirmed), not
  generic `save()`/`reset()`

## 브리프에 없던 것 (Brief gaps)

① Whether the band needs a Discard action, since the brief's spec only described Save.
② Added a secondary "Discard" button next to "Save Changes" that reverts the draft back to the
   confirmed snapshot.
③ The repo's own doctrine name for this mechanic is "save/discard band", and a one-way save-only
   control would strand a user who flips a toggle by mistake with no way back short of manually
   re-toggling every changed row — Discard is the direct inverse action the mechanic implies.

① How to keep exactly one live region on screen while a band that mounts/unmounts needs one.
② Wrapped the band in an always-mounted `View` with `accessibilityLiveRegion="polite"`; only the
   `SaveBand` inside it mounts/unmounts, so the live region itself never appears or disappears.
③ An always-present polite region lets assistive tech track content changes (band appearing,
   disappearing, or its count changing) without ever having two live regions active at once, and
   without needing a second mechanism just to announce the unmount.

① Whether the toggle should be RN's built-in `Switch` or a hand-built `Pressable` toggle.
② Used `Switch`, styled via `trackColor`/`thumbColor`/`ios_backgroundColor` tokens.
③ `Switch` already implements `accessibilityRole="switch"` and `accessibilityState` correctly on
   both platforms, so using it removes a whole class of a11y-wiring mistakes for a control this
   screen needs six of, with no visual cost against the near-monochrome + single-accent DNA.
