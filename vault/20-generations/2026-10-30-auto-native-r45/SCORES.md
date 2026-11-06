# auto-native-r45 — SCORES

Target: native. Freeze hash (all 7 source files in `native/src/evolve/r45/{a,b,c}/*`): `a3036269a1dad19ffa94630facc9bfe4ce50cb9e` — unchanged from registration through gate through screenshot capture through judging.

## Candidates
- **a** — Want List (`native/src/evolve/r45/a/WantListScreen.tsx`, `data.ts`) — check: "Want List"
- **b** — Local Meetup Events (`native/src/evolve/r45/b/LocalMeetupEventsScreen.tsx`, `data.ts`) — check: "Local Meetup Events"
- **c** — Negotiation History (`native/src/evolve/r45/c/NegotiationHistoryScreen.tsx`, `data.ts`, `components.tsx`) — check: "Negotiation History"

## Hard gate (`node scripts/gate.mjs --target native --screens evolve-r45-a evolve-r45-b evolve-r45-c`)

All 3 candidates passed clean on the first attempt — 12/12 gates green, 0 violations, no 1-fix loop needed.

| Candidate | tsc | export | render | iframe |
|---|---|---|---|---|
| a (evolve-r45-a) | ✅ 통과 | ✅ 통과 | ✅ 통과 | ✅ 통과 |
| b (evolve-r45-b) | ✅ 통과 | ✅ 통과 | ✅ 통과 | ✅ 통과 |
| c (evolve-r45-c) | ✅ 통과 | ✅ 통과 | ✅ 통과 | ✅ 통과 |

Global `tsc` ran once across the whole native project with zero errors; no `blockedBy` cross-candidate failures occurred.

## Screenshots
`vault/20-generations/2026-10-30-auto-native-r45/shots/{a,b,c}-{390,768}.png` — 390px and 768px widths, Expo Web export + serve on :8091, captured via `scripts/shot-native.mjs` with `PW_CHROMIUM_PATH`/`PW_NO_SANDBOX` set for the sandboxed Chromium. All 6 frames visually confirmed non-blank with real, distinct content before being sent to judges.

## Judge panel (3 independent blind general-purpose Agent-tool subagents, no cross-lens visibility, candidates/*.md concept notes withheld from all three)

| Lens | 1st | 2nd | 3rd |
|---|---|---|---|
| lens1 — DNA/GENERATION.md compliance | **c** | a | b |
| lens2 — mobile app completeness | **b** | c | a |
| lens3 — screen-type differentiation | **a** | c | b |

**Complete 3-way split on 1st place — no majority.** See DECISION.md for the tie-break and full reasoning.

### Key findings by lens

**lens1 (DNA compliance)**: No hard rule violations in any candidate. c: correctly implements the read-only-record "always-visible functional action bar" band shape (no live region, correctly absent); status conveyed by color+label together. a: correctly implements the dirty-snapshot-diff band shape, exactly one live region, all accessibilityHints match their handlers; minor note — condition chips at 36pt (below the 44pt convention, not itself a GENERATION.md §1-5 rule). b: correctly implements the selection-count-derived band, single live region, functional non-decorative jump action; one real defect — `pluralize(count, "person going")` produces "18 person goings" (grammatically broken, visible in both screenshots).

**lens2 (mobile completeness)**: All handlers in all 3 candidates traced and confirmed to produce real, correct effects — no logic bugs in b or c. b: most sophisticated functional interaction of the three (real scrollToIndex + accessibility focus + onScrollToIndexFailed retry), chronological-order dependency verified correct; same pluralize-grammar defect as lens1 found independently. c: sort-toggle logic hand-verified correct against all 8 offer values; flagged as comparatively thin (rows are static Views, zero touch feedback, no drill-in) — a completeness gap, not a bug. **a: a REAL verified defect — `WantCard.onPress` unconditionally calls `openEditForm` with no guard against `hasUnsavedWantDraft`; switching to a different want card while mid-edit on a dirty draft silently discards the unsaved edit with no confirmation, despite the screen having built an entire Save/Discard/unsaved-indicator mechanism specifically to prevent exactly this. Silent data loss — a genuine commercial-app defect** (`WantListScreen.tsx:105-112`, `:306`).

**lens3 (differentiation)**: a: clean vs. watchlist and PriceDropAlertSettingsScreen (zero identifier overlap); correctly identified as the 3rd principle-level (not code-surface) occurrence of the snapshot-diff band family (after Vacation Mode, Payout Method Order) with no literal name collisions; flagged an unaddressed conceptual neighbor (SavedSearchManagerScreen) but confirmed no code-surface collision and substantively different mechanics. c: clean vs. offer-thread; flagged OfferStatusScreen's embedded "Your Other Offers" sub-list as a real, un-acknowledged conceptual near-duplicate of part of c's purpose, but zero identifier collision and c adds real dimensions (seller-counter, final amount, 2 extra statuses, working sort). **b: a MAJOR, verified finding — the "jump to next" mechanism is a near-line-for-line copy of `evolve/r34/a/IdentityReverificationScreen.tsx`'s jump mechanism, not mechanism-level reuse as its own code comment claims: identical constant names AND values (`HIGHLIGHT_DURATION_MS = 1600`, `FOCUS_SETTLE_DELAY_MS = 350`), identical ref-variable shapes/names, identical function structure (same scrollToIndex call shape, same highlight-then-clear-timer pattern, same clearTimeout-guard-before-setTimeout, same findNodeHandle+setAccessibilityFocus sequence). This is exactly the code-surface-collision failure mode GENERATION.md §3 names** (`LocalMeetupEventsScreen.tsx:43-44, 79-82, 121-147` vs `IdentityReverificationScreen.tsx:22-23, 53-56, 79-105`).

Full per-candidate reasoning, all cited evidence, and each lens's self-disclosed unseen scope are preserved verbatim in DECISION.md.
