# Candidate b — Vacation Mode

## Concept

A pure settings-form screen for a seller to pause their storefront: one `Switch` row
("Pause my storefront"), two tappable away-date rows ("Starts" / "Ends") that cycle
through a fixed six-entry preset list, and a multi-line auto-reply message `TextInput`
pre-filled with a deterministic default, shown to buyers while the storefront is
paused. The screen holds a `savedSnapshot` of the four form fields; every render
derives `hasUnsavedVacationChanges` by comparing the live field values against that
snapshot (`vacationSnapshotsEqual`, in `data.ts`) — never a hand-flipped flag. The
moment any field diverges, a bottom-fixed "unsaved vacation changes" band appears
with Discard / Save actions; pressing Save snaps `savedSnapshot` to the current
values (which makes the band vanish as a side effect of the comparison going true→
false) and swaps in a brief "Vacation settings saved." confirmation inside the exact
same live-region container, auto-clearing after 2.5s. Discard restores the four
fields from `savedSnapshot`, which likewise makes the band disappear via the same
derivation. Exactly one `accessibilityLiveRegion="polite"` container exists on the
whole screen, anchored at the bottom, and it conditionally renders either the band,
the saved notice, or nothing.

## Render-check string

`Vacation Mode`

## 브리프에 없던 것 (What the brief didn't specify)

1. **Decide:** How the two date rows relate to each other (shared list vs. two
   independent lists; whether to enforce start ≤ end).
   **Decided:** Both rows cycle independently through the *same* fixed
   `AWAY_DATE_PRESETS` array by index, with no ordering validation between start
   and end.
   **Why:** The brief explicitly says these can be "simple tappable rows that cycle
   through a short fixed deterministic list" with "no real date picker library
   needed" — it does not ask for range validation, and the screen's judged mechanic
   is the dirty-state band, not date-range correctness. Adding cross-field validation
   would be scope creep beyond what's specified; I picked default indices (0 and 2)
   so the out-of-the-box state already reads as a sensible ~2-week range.

2. **Decide:** Exact state/style naming for the band, since the brief asked for names
   that reflect "unsaved vacation settings" rather than generic `band`/`bandVisible`.
   **Decided:** `hasUnsavedVacationChanges` (derived boolean), `savedSnapshot`
   (last-saved state), `handleSaveVacationSettings` / `handleDiscardVacationChanges`
   (actions), `unsavedBand` / `unsavedBandText` / `unsavedBandActions` (styles), and
   a separate `savedNotice` / `savedNoticeText` style pair for the post-save
   confirmation state.
   **Why:** Directly follows the brief's instruction to write fresh, domain-specific
   names; mirrors the analog pattern's shape (`selectedCount` → `barVisible`) one-to-
   one but swaps in the dirty-state vocabulary for this domain.

3. **Decide:** What happens on Discard — does it also need a transient
   "announced" confirmation the way Save does?
   **Decided:** No. Discard silently restores the fields (which makes the band
   disappear via the same derivation) without a confirmation banner.
   **Why:** The brief only requires the band to "disappear immediately and visibly
   after a successful **save**" and to "announce the save" — it does not ask Discard
   to announce anything. Reverting the visible field values themselves (switch
   flips back, date rows revert, text reverts) is already a sufficient, honest
   signal of what happened; adding a second toast message risked a redundant
   live-region announcement on a transition the brief didn't call out.

4. **Decide:** Whether to use `ScrollView` even though the brief's suggested import
   line (`View, Text, Pressable, SafeAreaView, StyleSheet, TextInput, Switch`)
   omits it.
   **Decided:** Added `ScrollView` from `react-native` as the form's scroll
   container.
   **Why:** The brief's macro-layout instructions literally say "a vertically
   stacked set of labeled setting rows/sections in a ScrollView-like layout" — a
   plain `View` can't scroll if the three sections plus a multi-line text input
   overflow a small device's viewport, so an actual `ScrollView` is the direct,
   literal fulfillment of that instruction rather than a deviation from it.

5. **Decide:** Default auto-reply message copy and default date-range indices
   (no literal defaults given in the brief beyond "short deterministic default").
   **Decided:** A two-sentence, buyer-facing, apologetic-but-informative message in
   `DEFAULT_AUTO_REPLY_MESSAGE`, plus `startDateIndex: 0, endDateIndex: 2` (first and
   third presets in the six-entry list) as the seed snapshot in
   `INITIAL_VACATION_SETTINGS`.
   **Why:** Arbitrary but deterministic and literal, per the determinism rule (no
   `Date.now`/`Math.random`/argumentless `new Date()`); chosen to read naturally as
   a believable seller message and a believable ~2-week default window.

6. **Decide:** Whether the auto-reply `TextInput` should be disabled/greyed out when
   `storefrontPaused` is `false` (since the brief says the message is "shown to
   buyers while paused").
   **Decided:** Left it always editable regardless of the toggle state.
   **Why:** The brief describes the message's *display condition to buyers*, not an
   *editing* restriction for the seller — a seller should be able to draft/update
   their away message before flipping the toggle on. Disabling it would also add an
   untested, unspecified interaction between two fields the brief treats as
   independent form rows.
