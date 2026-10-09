# auto-native-r26 — DECISION

## §0 Round budget & target
- `node scripts/round-budget.mjs 2` → **1** (0 unfilled `PAGE_TYPES` — same condition as `auto-dash-r27`/`auto-dash-r31`). The outer scheduled request asked for 2 consecutive rounds; per `round-budget.mjs`'s own rule this single invocation runs exactly 1 round, logged here per §0-0-1. The outer 2-round request is satisfied by running this whole §0–§7 sequence twice independently (this is round 1 of that pair; round 2 picks its own target after this one lands, excluding `native`).
- 2026-09-28 is a **Monday** (`new Date().getUTCDay() === 1`) → per the native weekly-cadence rule, since this invocation's budget is N=1, the day's single round is forced to `target=native`.
- `reassign-queue.md` "대기 중" has **no native entry** — nothing to reassign this round; all 3 candidates are free exploration.
- Round number: max existing `auto-native-r*` in the ledger is r25 → this round is **r26**.

## §1–2 GENERATE — 3 candidates, distinct macro forms
Assigned to diversify against r25 (which already used blocked-workflow / persistent-bar / selection-bar together) and to avoid the two most recent evolve-round domains:
- **a — "File a Warranty Claim"** (`native/src/evolve/r26/a/WarrantyClaimScreen.tsx`): blocked-workflow state-machine band (defect category → ≥1 evidence photo → remedy → submit), own vocabulary (`nextCheckpoint`/`steerToCheckpoint`/`railMessage`/`retractIfFiled`), real derived refund depreciation + auto-retract-on-edit-after-submit.
- **b — "Seller Rating Summary"** (`native/src/evolve/r26/b/SellerRatingSummaryScreen.tsx`): read-only completed-record + persistent action bar, live-recomputed hero score/histogram driven by a lens-chip selector, per-review inline Flag→Cancel/Confirm.
- **c — "Linked Bank Accounts"** (`native/src/evolve/r26/c/LinkedBankAccountsScreen.tsx`): no fixed chrome, per-row destructive Cancel/Confirm row-swap (`rowsAwaitingUnlink: Set<string>`) for Unlink, real business-rule gating (can't unlink sole/default account).

Source frozen before gate, SHA-1: `ecaa56c4ac084869274505a682a58a89e11486ca` (see SCORES.md).

## §3 HARD GATE
`node scripts/gate.mjs --target native --screens evolve-r26-a evolve-r26-b evolve-r26-c` → **12/12 pass on first attempt**, no `blockedBy`, no 1-fix loop needed (see SCORES.md for the full table).

## §4 Screenshots
Expo Web export per candidate (`EXPO_PUBLIC_SCREEN=evolve-r26-<v> npx expo export --platform web`) → served on :8091 → captured at 390×844 and 768×844 via `native/scripts/shot-evolve.mjs` (bare `npx playwright screenshot` CLI ignores `PW_CHROMIUM_PATH`, per the script's own header comment). All 6 frames confirmed non-blank by visual inspection before judging (`shots/{a,b,c}-{390,768}.png`).

## §4 JUDGE PANEL (3 blind independent lenses, codenames X=a, Y=b, Z=c given to judges to prevent anchoring on candidate letters)

### Lens 1 — DNA/canon compliance
**Ranking: Z (c) > X (a) > Y (b)**
- Z 1st: textbook per-row destructive-confirm with `Set<string>` state, live-region separation, `accentBg` used only for the genuine `Default` selection tag, no violations found.
- X 2nd: cleanest blocked-workflow state machine of the three, correct `alert`+`polite` pairing, no hardcoded hex, no violations; one non-blocking nitpick (nested `FlatList scrollEnabled={false}` inside an outer `ScrollView` — a known RN smell, not a canon violation as worded).
- Y 3rd (deciding factor): **`accentBg` used as a full-bleed flood fill** on the hero score card, the share-echo panel, and category tag chips (`SellerRatingSummaryScreen.tsx:320-326, 481-490, 612-617`) — `tokens.ts` explicitly documents `accentBg` as "kept for selection/emphasis only, never used as a flood color," and none of these three usages is a selection state. Also one incomplete live-region pairing (hero score's live-region container lacks `accessibilityRole="alert"` on the value text itself).

### Lens 2 — mobile completeness / commercial polish
**Ranking: X (a) > Z (c) > Y (b)**
- X 1st: most fully-wired closed loop (gated form → filed confirmation → editable-after-fact with correct retraction), real computed refund/reference values, consistent press/active feedback everywhere.
- Z 2nd: textbook destructive-confirm with real business-rule gating (`unlinkBlockReason`), consistent press feedback; one flaw — the "+ Link a new bank account" footer is a literal no-op styled identically to live controls (honest, since it makes no false claim, but still a dead-end tap).
- Y 3rd (deciding factor): **a real dishonesty defect** — the Share action's echo panel text asserts "… link copied to clipboard" (`SellerRatingSummaryScreen.tsx:163`) but no `Clipboard` API call exists anywhere in the file (grep-confirmed zero matches) — the handler is a pure boolean toggle behind a claimed OS-level side effect. Additionally, **zero `pressed &&` press-feedback styling found anywhere in the file** (grep-confirmed) — every Pressable, including the main CTA, uses a static style with no active-state acknowledgment, a systemic miss against the native-feel requirement.

### Lens 3 — screen-type differentiation
**Ranking: X (a) > Z (c) > Y (b)**
- X 1st: genuinely new domain (warranty claims), original vocabulary (`checkpointY`, `paperTrail`, `retractIfFiled`), real camera-specific defect taxonomy with per-category business rules.
- Z 2nd: genuinely new domain (payout destinations), original vocabulary (`rowsAwaitingUnlink`, `confirmZone`, `bankInitial`), canonical use of the destructive-confirm form for a genuinely irreversible action.
- Y 3rd (deciding factor, not disqualifying): new domain (rating aggregate) with mostly original vocabulary (`StarGlyphRow`, `shareEcho*`), BUT the per-row Flag→Cancel/Confirm sub-pattern is functionally identical in shape (though not verbatim in naming/copy) to Z's per-row Unlink→Cancel/Confirm — a legitimate, doctrine-sanctioned re-use of form (3), but a softer domain fit (flagging a review for moderation is a lower-stakes action than unlinking a payout account), which is why Y ranks below Z despite not being a code-surface reskin.

**Cross-candidate note (lens3):** no two candidates share a screen-type/domain; all three chrome shells differ (state-machine rail / persistent action bar / no fixed chrome) — good doctrine-form spread this round.

## Aggregation
1st-place votes: **X (a) = 2** (lens2, lens3), Z (c) = 1 (lens1). **2:1 majority winner: a — "File a Warranty Claim."** No 3-way tie, no tie-break procedure needed. All three lenses agree Y (b) is last — non-controversial ranking floor.

## §3-1 Post-judgment fix
None needed — no lens flagged a rule violation on the winner (a); lens1's nested-FlatList note was explicitly called a non-violation nitpick. No re-gate required.

## §5 LEARN — delta appended (native-deltas-provisional.jsonl)
Extracted from lens2's finding on losing candidate Y (generalizes an existing L2 rule to a new surface, evidenced independently against the winner's clean behavior on the same axis): the existing "never write an `accessibilityHint` promising something the handler doesn't do" rule generalizes beyond assistive-tech hints to **any visible on-screen copy** asserting a real system-level side effect (clipboard write, share-sheet completion, file save) that the handler never performs. See ledger/DELTAS entry for full text + evidence.

## §6 Refinement gate
- Reviewed all native DELTAS for conflicts/duplicates against this round's new entry — no clash with existing canon or open deltas. Not yet L2 (single-round observation, no mechanical gate exists for it yet) — kept L1/provisional.
- No new `questions-queue` entry — judge panel was a clean 2:1 with fully consistent floor ranking across all three lenses (Y last in all three); no lens conflict or meta-criteria gap surfaced this round.
- Canon (`dash-brief-v3.md`, `design-principles.md`, `page-brief-core.md`, `native/GENERATION.md`, `native/src/tokens.ts`) **unchanged** this round — no L3-worthy claim.

## §7 Outcome
- **Winner: a — "File a Warranty Claim"** (`evolve-r26-a`).
- Candidates b, c remain registered in `screens.ts`/`screens.json` (evolve/dash only) per no-winner-drop convention — disposition of non-winners happens at `/dash-falsify`, not here.
