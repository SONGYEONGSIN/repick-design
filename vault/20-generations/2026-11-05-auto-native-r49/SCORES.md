# SCORES — auto-native-r49

Freeze hash (candidate source, unchanged registration→gate→screenshot→judging): `f145c929b7006812a2037314472a0294b6134892`

## Candidates
- **a** — Nearby Sellers Map Browse (`native/src/evolve/r49/a/NearbySellersMapScreen.tsx`) — slug `evolve-r49-a`, check `"Browse Nearby Sellers"`
- **b** — Item Comparison (`native/src/evolve/r49/b/ItemComparisonScreen.tsx`) — slug `evolve-r49-b`, check `"Compare Items Side-by-Side"`
- **c** — Seller Onboarding Checklist (`native/src/evolve/r49/c/SellerOnboardingChecklistScreen.tsx`) — slug `evolve-r49-c`, check `"Set up your shop to start selling"`

## Hard gate (`node scripts/gate.mjs --target native --screens evolve-r49-a evolve-r49-b evolve-r49-c`)

Global `npx tsc --noEmit` (native project-wide): 0 errors.

| screen | tsc | export | render | iframe |
|---|---|---|---|---|
| evolve-r49-a | 통과 | 통과 | 통과 | 통과 |
| evolve-r49-b | 통과 | 통과 | 통과 | 통과 |
| evolve-r49-c | 통과 | 통과 | 통과 | 통과 |

**12/12 clean on first attempt — zero 1-fix used by any candidate, zero `blockedBy` cross-candidate failures.** `verdict.violations: []`.

## Judge panel (3 independent blind general-purpose Agent-tool subagents, no cross-lens visibility, `candidates.md` withheld from all 3)

| lens | 1st | 2nd | 3rd |
|---|---|---|---|
| lens1 — DNA/GENERATION.md compliance | c | a | b |
| lens2 — mobile completeness | c | b | a |
| lens3 — screen-type differentiation | b | c | a |

**Clean 2:1 majority for c** (lens1 + lens2). No tie-break procedure needed (not a 3-way complete tie).

### lens1 (DNA compliance) summary
No hard GENERATION.md violations in any candidate. c ranked 1st for the most precise satisfaction of the harder-to-satisfy rules: locked-row exhaustion explained on both visible copy and `accessibilityHint` (`SellerOnboardingChecklistScreen.tsx:261`), current-step no-op carries no false hint (`:247-251,268-279`), single derived-state source of truth (`:60-96`). a 2nd (clean, but no locked/disabled states to exercise the hint-exhaustion rule). b 3rd (clean, but thinnest demonstration of the harder DNA clauses — no band, no locked state, alert fires on a non-terminal action).

### lens2 (mobile completeness) summary
c 1st: zero defects found after full state/derivation trace (progress ratio, locked-reason text, singular/plural announcement branch all verified word-for-word against screenshots). b 2nd: all 5 comparison rows hand-verified correct against `data.ts`, but the comparison table has a hard-coded max width with no width-adaptation at 768px, leaving ~1/4 of the screen as dead space (`b-768.png`). a 3rd: **real verified data/visual inconsistency** — two sellers (`slr-secondstory` 6.2mi, `slr-analogaudio` 7.8mi) are pinned visually *inside* the map's labeled 5-mi ring despite their own displayed distance text placing them beyond it (cross-checked `pinXPct/pinYPct` radial distance vs `distanceMi` in `data.ts`).

### lens3 (differentiation) summary
b 1st: no existing screen (watchlist, price-history, protection-plan-picker all read in full) shares its frozen-label-column + horizontally-scrolling-item-columns comparison-table architecture; cleanest novel archetype. c 2nd: genuinely different state model (single derived `completedStepIds` array + hard sequential lock-chain) vs. its two nearest neighbors (`SellerVerificationScreen` — per-field booleans + free-order accordion; `IdentityReverificationScreen` — parallel pending/done array, no locking) despite thematic "seller setup checklist" overlap — architecturally not a reskin, but domain is more trodden ground than b's. a 3rd: **flagged as a partial reskin** of `native/src/evolve/r40/b/ReturnDropoffScreen.tsx` — same map/list segmented-toggle union, same single-selection-id pattern (`current === id ? null : id`), same percent-positioned-pin + `accessibilityState={{selected}}` pin pattern, same callout-with-one-CTA-button shape. Genuinely new elements in a (distance-ring overlay, filter sheet, cross-mode scrollToIndex) noted but judged insufficient to clear the core-scaffold collision.

## Non-winner findings (recorded, not queued — all 3 candidates passed the hard gate clean 12/12, so per this project's established disposition (r41/r42/r44-r48) pure judgment-stage losses are not reassign-queue candidates even when a real bug or collision is found during judging)
- **a**: real data/visual inconsistency (2 of 10 sellers drawn inside the "5 mi" ring despite >5mi displayed distance) + architectural partial-reskin of r40/b/ReturnDropoffScreen (map/list toggle + single-selection + percent-pin + callout-CTA scaffold).
- **b**: comparison table doesn't adapt width at 768px, leaving dead space.

No post-judgment §3-1 fix needed on winner c — zero defects/violations cited against it by any lens; freeze hash unchanged throughout.
