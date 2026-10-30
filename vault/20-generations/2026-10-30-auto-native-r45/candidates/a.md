Check string: "Want List"

# Candidate a — Want List

`native/src/evolve/r45/a/WantListScreen.tsx` (default export) +
`native/src/evolve/r45/a/data.ts`

## Concept

A pre-listing wishlist: the buyer records criteria for an item they want
but that is not listed anywhere yet (brand, model/style, size, condition
tier, max price) — distinct from this catalog's `watchlist` screen, which
tracks items that already ARE listed. Macro layout is a form+list hybrid:
a `FlatList` of saved want-criteria cards is the primary content, with an
"Add a want" row that opens a single inline add/edit form on the same
screen (tapping any card loads it into that same form for editing — no
separate route, since this is a single-screen RN app).

Band mechanic: `wantDraftDiffersFromSaved` (`data.ts`) does a trimmed,
field-by-field comparison between the live draft and `savedFormSnapshot`
— the want's own last-saved values when editing, or the empty baseline
when adding new — recomputed every render in the component body. The
bottom band mounts only while that comparison is true and unmounts the
instant Save or Discard make it false again; there is no hand-flipped
`isDirty` anywhere. This is the L2-established snapshot-equality band
shape (first: Vacation Mode's toggle; second: Payout Method Order's
reordering) applied a third time, independently, to want-criteria form
fields, with its own helper/state/style names (`wantDraftDiffersFromSaved`,
`savedFormSnapshot`, `hasUnsavedWantDraft`, `band`/`bandText`/`bandActions`
style keys) — none shared key-for-key with either prior implementation.

The band's container has `accessibilityLiveRegion="polite"`; its headline
text has `accessibilityRole="alert"`. This is the only live region on the
screen. No wrapper anywhere has `accessible={true}`: each want card is a
single leaf `Pressable` (no nested interactive children, since there is
no per-card delete — see brief-gap #1), and the condition-tier chips are
siblings, not nested inside another `Pressable`. All copy is English; no
emoji; near-monochrome + the single indigo accent (used only for the open
form's border, the selected condition chip, the max-price chip, and the
Save button). Four seeded wants ship in `data.ts`, spanning four different
condition tiers and price points; no `Math.random`, `Date.now()`, or bare
`new Date()` — a new want's date is the fixed literal `ADDED_TODAY_LABEL`.

## Brief gaps

1. **① Whether want cards need a delete/remove action**, since a resale
   wishlist plausibly outgrows old entries. ② Left deletion out entirely.
   ③ The brief's spec only asked for Add + inline edit + the dirty-draft
   Save/Discard band. Adding delete would mean picking between two
   different destructive-action band shapes already documented in
   GENERATION.md §3 (band-to-row confirmation flip) and risking a second
   live region or a key-naming collision with either precedent on a
   feature nobody asked for — simplest and safest was to not invent it.

2. **① What happens to one open form (with unsaved changes) if the user
   taps "Add a want" or taps a different card while it's dirty**, since
   the brief describes only a single inline form area. ② The newly
   targeted want (or a blank draft) simply replaces the open one — no
   warning, no block. ③ Nothing in the brief asks for a save-guard across
   targets, and adding one would mean a second conditional flow alongside
   the band; kept to the one described mechanic rather than inventing a
   second confirmation path.

3. **① How to represent "no preference on condition"** for a want, since
   a buyer may accept any condition for some items. ② Added a fifth
   `ConditionTier`, `"Any condition"`, as the form's default and as one of
   the four seeded entries' values. ③ A wishlist with only firm tiers
   (New/Like new/Good/Fair) would force buyers to falsely narrow their own
   criteria; "Any condition" is the plain, English, non-decorative way to
   express that without adding a second control (e.g. a toggle) alongside
   the existing condition-chip row.

4. **① Currency formatting**, given the brief's ₩/`tabular-nums` warning.
   ② Used plain `$` (USD) throughout; `tabular-nums` applied only to the
   max-price chip text, which never contains ₩. ③ Sidesteps the documented
   rendering artifact entirely rather than threading a workaround through
   a mixed text run.

5. **① Whether the form's own "Close" escape hatch should be allowed to
   discard unsaved changes silently**, bypassing the band's Save/Discard.
   ② Hid the "Close" button entirely while `hasUnsavedWantDraft` is true,
   replacing it with a plain hint line ("Save or discard your changes
   below to close this form"); it reappears once the draft matches the
   saved snapshot again (after Save or Discard). ③ A side-door that closes
   the form and loses changes without going through Discard would make
   the band purely decorative for that exit path — hiding it keeps
   Save/Discard as the only way out of a dirty draft, consistent with the
   band being the thing that "does work" per GENERATION.md §3.

6. **① How many seeded wants, and how varied.** ② Four: a fleece jacket
   (Like new, $90), running shoes (Good, $75), vintage jeans (Any
   condition, $45), and a handheld console (New with tags, $60). ③ Brief
   asked for 3-4 "with varied criteria" — used the top of that range and
   made sure every field (brand, model/style, size, condition, price)
   differs across all four rows, and that all five condition tiers are
   reachable (four shown on cards, "Any condition" also the form's default
   for untouched new drafts).
