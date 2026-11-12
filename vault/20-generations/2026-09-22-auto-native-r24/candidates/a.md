# auto-native-r24 · candidate a

**Concept:** "Report a Listing" — a trust-and-safety flow where a buyer flags a listing
(counterfeit claim, misleading photos, prohibited item, harassment, etc.) via a required
violation-reason picker, optional free-text detail and evidence-photo placeholders, and a
blocked → ready → done state-transition band.

**Render-check string:** `Report a Listing`
(top-level heading, `accessibilityRole="header"`, in the FlatList's `ListHeaderComponent` —
always visible in the default render, before any interaction.)

**Export:** `ReportListingScreen` (named export; also the default export) —
`native/src/evolve/r24/a/ReportListingScreen.tsx`

## Brief gaps

1. **What:** Exact violation-reason category set and their supporting sub-copy (the brief
   gave example labels but not final wording or descriptions).
   **Decided:** Five categories — Counterfeit / not authentic, Misleading photos or
   description, Prohibited item, Harassment or abusive seller, Other — each with a one-line
   description shown under the label so the radio choice is self-explanatory without a
   separate glossary screen.
   **Why:** Directly lifted the five example categories named in the brief verbatim; added
   descriptions as an arbitrary judgment call, following the pattern of `ShipmentPickupScreen`
   giving every option row a `label` + `sub` line rather than a bare label.

2. **What:** Whether the reason picker and evidence section should be visually "staged/locked"
   (like the pickup screen's three sequential steps) or both simply live on the same screen.
   **Decided:** No locking — the reason picker is the only gate; the evidence section is always
   visible and editable regardless of whether a reason is picked yet.
   **Why:** The brief only requires ONE field (reason) to unblock the band, and explicitly
   allows optional fields to stay empty at "ready." Locking the optional section would have
   implied a dependency the brief never states, so I treated pickup's stage-locking as specific
   to that screen's genuine sequential-pricing logic, not a pattern to reuse here.

3. **What:** What "Add photo" should actually do, since a real image picker was explicitly
   ruled out.
   **Decided:** True no-op — `onPress={() => {}}`, `accessibilityRole="button"`,
   `accessibilityLabel="Add photo"`, and deliberately no `accessibilityHint` at all (rather than
   inventing a hint that describes nothing, or a hint that implies upload).
   **Why:** Brief explicitly says "no-op Pressable that is honest ... give it no misleading
   hint" — took that as an instruction to omit the hint entirely rather than write a vague
   substitute. The two pre-attached swatches (`tokens.color.swatch1`/`swatch2`) come from fixed
   `data.ts` literals representing evidence already on the report, so the photo row isn't just
   an empty add-button with nothing to look at.

4. **What:** Wording for the blocked-band's secondary hint line, since the literal phrase "Tap
   to go there" was explicitly disallowed and the reused-name ban meant I couldn't just port
   pickup's "Tap to jump to this step" wholesale either.
   **Decided:** "Finds the reason list for you." (blocked state) — paired with an
   `accessibilityHint` of "Scrolls to the reason list below" on the same Pressable.
   **Why:** Arbitrary original phrasing chosen to (a) not repeat "tap"/"go there" verbatim,
   (b) stay honest about the actual mechanism (`scrollToIndex` to the reason section), matching
   the brief's ban on both the literal banned phrase and any hint that overpromises.

5. **What:** Post-submit (done) reference number format/value.
   **Decided:** A fixed lookup table `REPORT_REF_BY_REASON` in `data.ts` keyed by reason id
   (e.g. `counterfeit` → `RPT-30441`), read via `buildReportRef(reasonId)` — a pure function,
   no `Date.now()`/`Math.random()`.
   **Why:** Mirrors `ShipmentPickupScreen`'s `buildLabelRef` determinism pattern (referenced in
   that file's own header comment) so the "done" band has something concrete to show, without
   inventing any non-deterministic ID generation.

6. **What:** Currency/listing context shown in the read-only "LISTING" card at the top (brief
   said no currency needed for this screen, but a report needs to reference *which* listing).
   **Decided:** Added a minimal fixed listing summary (title, seller handle, USD price,
   listing id) as dummy literal data in `data.ts`, `$` formatting consistent with
   `ShipmentPickupScreen`'s `money()` convention.
   **Why:** A report screen with no visible reference to the thing being reported would be
   confusing in a screenshot/gate check; kept it minimal (one card, no interaction) so it
   doesn't compete with the three required interactions.
