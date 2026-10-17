# Candidate b — Seller Annual Tax Documents

Concept: a two-level grouped archive — sticky tax-year headers each opening onto that year's 1-3 official marketplace tax documents (1099-K, corrected 1099-K, transaction summary), with a per-row Download that swaps the button to a confirmed state and fires a single auto-clearing live-region announcement.

## Brief gaps

1. **What**: how to realize "two-level grouped/sectioned list" in RN concretely.
   **Decided**: one `FlatList` whose `data` is a flattened array of `{type: "yearHeader" | "pending" | "document", ...}` items built by `buildTaxDocumentListItems`, with `stickyHeaderIndices` computed from the yearHeader positions so year sections behave like real sticky section headers without reaching for `SectionList`.
   **Why**: the brief explicitly offers this exact approach and it keeps the grouping real (headers own a slice of rows) rather than a filter chip on a flat list.

2. **What**: how to make "Download" feel real with no backend/filesystem access.
   **Decided**: pressing it sets a single `confirmedDocId` + one shared `announcement` string; the pressed row's button swaps label to "Downloaded" and tints green, a single always-mounted live-region container (so there's never more than one live region in the tree) announces the same text via `accessibilityRole="alert"`, and a timer resets both back to idle after a fixed 4000ms.
   **Why**: matches the brief's "confirmable transient state change ... similar to a real download-triggered toast" instruction and the determinism/live-region-reset rules (no `Math.random`/`Date.now`, no live region left stuck "on").

3. **What**: what to show for the in-progress current tax year (2026) with no documents yet.
   **Decided**: still render its year header, but its one child row is a `type: "pending"` non-interactive notice ("issued after the filing season closes, by Jan 31 2027") instead of a document row.
   **Why**: a real annual-tax-documents screen would always show the current year as a placeholder rather than silently omitting it; this is an addition on top of the assigned 1-3-rows pattern, not a substitute for it (the other three years hold 2, 1, and 3 document rows respectively).

4. **What**: a year with no 1099-K at all (2024, under the reporting threshold).
   **Decided**: show only its Transaction Summary document plus a `noteLabel` explaining the threshold, rather than omitting the year or faking a 1099-K.
   **Why**: realistic marketplace tax behavior, and it exercises the "1-3 rows, not always the same shape" part of the assignment.

5. **What**: ₩ glyph vs `KRW` notation (Section 1 of the brief).
   **Decided**: `KRW 1,234,000` Latin notation via a locally-written `formatKRW` (not copied from the r37/b reference file, which already used the same notation independently).
   **Why**: avoids the ₩-stroke-abuts-digit strikethrough look at body size; kept consistent with existing repo convention rather than introducing a second currency-formatting style.

6. **What**: where the live-region confirmation strip visually lives, given "no fixed bottom band."
   **Decided**: a collapsible strip between the static title block and the FlatList (height 0 when idle, expands only while a confirmation is active) — not pinned to the bottom, not a persistent action bar.
   **Why**: the band-mechanic assignment is "no fixed bottom band," not "no transient feedback anywhere"; this keeps the confirmation visible near the top chrome regardless of scroll position without introducing a bottom band of any kind.

CHECK_STRING: Annual Tax Documents
