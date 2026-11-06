# Lens 2 (mobile completeness) — auto-native-r47

## Ranking
1. a (InstantTradeInScreen) — most careful handler-to-effect tracing (real scrollToIndex + AccessibilityInfo focus jump, explicit stale-offer invalidation, correct floor math), only cosmetic nits.
2. c (PointsRedemptionScreen) — equally disciplined a11y/live-region/FlatList hygiene and verified math, but the Confirm button has no double-tap guard on a real balance mutation.
3. b (StoreCreditTopUpScreen) — correct math and clean live-region discipline, but the screen's entire reason for existing, "Confirm & Buy," is a true no-op with zero feedback: the worst completeness gap of the three.

## Per-candidate detail

### a
**Handler tracing.** `handleBandPress` in the "blocked" phase calls `jumpToQuestion` (InstantTradeInScreen.tsx:140-149), which really does `listRef.current?.scrollToIndex(...)` *and* `AccessibilityInfo.setAccessibilityFocus` on the actual row's node via `findNodeHandle` — not a label-only "jump." The band's hint text "Tap to jump there" (line 287) is verified accurate. `selectOption` (151-157) explicitly resets `revealed` and `decision` whenever any answer changes after an offer was shown — this is exactly the "invalidate a previously-shown result" case the brief calls out, and it's implemented and commented (lines 26-27), not missed.

**Math verification.** `computeOfferUsd`/`totalDeductionUsd` (data.ts:88-99), `BASE_SUBTOTAL_USD=120`, `MIN_OFFER_USD=15`.
- All "best" answers: deduction 0 → offer `max(15,120)=120`. Matches offerCard "no condition deductions" branch (InstantTradeInScreen.tsx:216).
- Mixed case (partial function 15 + full battery 0 + scuffed cosmetic 8 + some accessories 5 + clean environment 0) → deduction 28, offer 92, `atFloor` false (120-28=92 ≥ 15). Matches "minus $28 for condition" with no floor note.
- Worst case (broken 70 + none 30 + cracked 20 + none 10 + exposed 5) → deduction 135, raw = 120-135 = -15 < 15, `atFloor` true, offer floored to `MIN_OFFER_USD=15`. Correct.
- Boundary nit: deduction exactly 105 → raw=15, `atFloor = raw < MIN_OFFER_USD` is `15<15=false`, so the "Minimum guaranteed offer applied" note is suppressed even though the offer is in fact sitting exactly at the floor value. Cosmetic off-by-one, not a money bug (the number itself is still correct).

**RN idiom / a11y.** Real `FlatList` with `ref`, `onScrollToIndexFailed` fallback (263-268) — genuine robustness a mockup wouldn't bother with. Option groups use `accessibilityRole="radiogroup"` wrapping `role="radio"` items (82-85). Exactly one `accessibilityRole="alert"` text is live inside the single `accessibilityLiveRegion="polite"` `offerBand` container at any time, structurally guaranteed by the single `phase` switch (271-373). Touch targets ≥44/48pt throughout (522, 644, 658, 709).

**Weakness found.** `jumpToQuestion`'s `setTimeout(..., FOCUS_DELAY_MS)` (144-148) is never cleared on unmount — if the screen unmounts mid-delay, `findNodeHandle`/`AccessibilityInfo.setAccessibilityFocus` fire against a stale ref, a real (if low-severity) RN cleanup gap. Tablet screenshot (a-768.png) is a straightforwardly stretched single-column phone layout — not a problem, just unremarkable use of the extra width.

### b
**Handler tracing — the central finding.** `handleConfirmPurchase` (StoreCreditTopUpScreen.tsx:77-81) is a literal no-op, by the file's own comment: "confirming intentionally does nothing further — no receipt or balance update is produced." It's wired to the primary "Confirm & Buy" Pressable (204-216). Unlike GENERATION.md's sanctioned no-op pattern (a placeholder for an *unbuilt sub-flow*, with no `accessibilityHint` lying about it — which this screen correctly avoids, no hint is attached at 203-207), this isn't a side door: it is the screen's single terminal action, the whole point of a "top-up" screen. Tapping it produces zero visible state change, no confirmation text, no live-region announcement, nothing — from the user's perspective it is indistinguishable from a broken button. This is a materially worse outcome than A's Accept/Decline or C's Confirm/Redeem, both of which actually execute their core local action and narrate it through the live region.

**Math verification.** `CREDIT_PACKAGES` (data.ts:20-25) and `bonusCents` (37-39):
- credit-10: price 1000¢/credit 1000¢ → bonus 0 → "Get $10.00 credit", no bonus line. Matches screenshot.
- credit-25: price 2500¢/credit 2700¢ → bonus 200¢ = "+$2.00 bonus". Matches screenshot exactly.
- credit-100: price 10000¢/credit 11500¢ → bonus 1500¢ = "+$15.00 bonus". Matches screenshot exactly.
- `newBalanceCents` (83-85) = `CURRENT_BALANCE_CENTS(450)` + selected `creditCents`; for credit-10 that's 1450¢ = $14.50 — correct, though not visible in the supplied screenshots (confirm step not captured).

**RN idiom / a11y.** Real `FlatList` with `numColumns={2}` + `columnWrapperStyle` for the package grid (100-125) — genuine grid virtualization, not `.map()`. Exactly one `accessibilityLiveRegion` container (`creditBand`, conditionally rendered only when `selectedPackage` is non-null, 168-219) — the single-nullable-id derived-band pattern is implemented cleanly, matching its own header comment. Touch targets ≥44pt (419, 444).

**Weakness found (secondary).** No `accessibilityRole="radiogroup"` wraps the four package tiles (each tile is individually `role="radio"`, 246-249) — A does this correctly (InstantTradeInScreen.tsx:82-85) and B doesn't, so a screen-reader user never gets "4 of 4" group context. Minor relative to the no-op CTA but a real, checkable a11y gap. Visuals in both screenshots are clean and uncramped; tablet (b-768.png) just gives the same 2-column grid more width, not a materially different layout.

### c
**Handler tracing.** `requestRedeem`/`cancelRedeem`/`confirmRedeem` (PointsRedemptionScreen.tsx:64-94) genuinely execute: selecting "Redeem" flips the row to an inline Cancel/Confirm pair (RewardRow.tsx:91-124), and "Confirm" really deducts `reward.costPoints` from `balance` (PointsRedemptionScreen.tsx:86) and shows a "Redeemed… balance is now N" acknowledgement that folds the actual new balance into the one live sentence (RewardRow.tsx:126-132) — verified correct, not a static label. A reward over budget renders *no* `Pressable` at all (RewardRow.tsx:78-89), so it's guaranteed un-tappable, not just visually dimmed; `requestRedeem` also independently guards `reward.costPoints > balance` (PointsRedemptionScreen.tsx:66) — belt and suspenders.

**Math verification.** `STARTING_BALANCE=2480` (data.ts:25).
- `ship-5` costs 400 → after redeem, balance 2080. `boost-24` costs 300 → 2180. Both check out against `REWARDS` (data.ts:27-84).
- Unaffordable case: `voucher-30` costs 4000 vs. balance 2480 → shortfall `4000-2480=1520`, rendered as "Need 1,520 more" (RewardRow.tsx:87, `formatPoints` uses `toLocaleString`) — correct grouping, matches the pattern visible for other values in the screenshot ("2,480 pts").
- Displayed balance "2,480 pts" and the catalog's exact costs (400/300/750/700/900/1500/2200/4000) all match data.ts and the screenshots pixel-for-pixel.

**RN idiom / a11y.** Real `FlatList` with explicit `extraData={[balance, activeRewardId, rowPhase]}` (111-114) — correctly defensive FlatList hygiene for rows whose render depends on external state, and better practice than it strictly needed to be. `useEffect(() => clearAckTimer, [])` (57) properly tears down the acknowledgement timer on unmount — a cleanup A's analogous `setTimeout` in `jumpToQuestion` lacks. `activeRewardId`/`rowPhase` is a single shared pair across all rows, so only one row's `accessibilityLiveRegion="polite"` container is ever mounted screen-wide — structurally guaranteed, verified by reading `phaseFor` (96-97) and the single-state design, not just "usually true." File explicitly notes and avoids `accessible={true}` (RewardRow.tsx:20-23), and each accessibilityHint ("Opens a confirmation…", "Spends the points shown…") matches the real subsequent effect.

**Weakness found.** `confirmRedeem` (PointsRedemptionScreen.tsx:83-94) has no guard against being invoked twice in rapid succession (no `if (rowPhase !== "confirm") return`, no disabling of the Confirm `Pressable` while processing — RewardRow.tsx:109-119). Because the deduction is a stateful `setBalance(prev => prev - cost)`, a fast double-tap on "Confirm" before React re-renders the row out of the "confirm" phase could in principle apply the deduction twice for one user intent — a real (if narrow) financial-correctness gap for a points-spend action, the kind of thing that matters more here than in A (whose Accept/Decline is idempotent regardless of repeat taps) or B (whose Confirm is a no-op so has nothing to double-apply).

## Unchecked scope
- Did not run the screens in an actual RN runtime/simulator; all handler and math verification is static code tracing plus hand-computation against the dummy data, not live execution.
- Did not verify VoiceOver/TalkBack behavior on a device — a11y correctness is judged from the `accessibilityRole`/`accessibilityState`/`accessibilityLiveRegion` props as written, not from an actual screen-reader pass.
- Did not fully audit `validate.sh`/tsc output for any three candidate — assuming the harness's 4-gate check already passed since these reached judging.
- Screenshots only show each screen's *initial* unanswered/unselected state (plus b's confirm step wasn't captured at all) — later-phase visual states (A's offered/accepted/declined bands, B's confirm screen, C's mid-redemption/done rows) were verified from code only, not screenshots.
- The RN `FlatList`/`VirtualizedList` re-render semantics when `renderItem` is a fresh (non-memoized) closure each render vs. needing `extraData` is a known but subtle internals question; I did not treat A's/B's lack of `extraData` as a proven bug since their `renderItem` is not wrapped in `useCallback`, which should make a fresh reference sufficient — but I did not verify this against a running app.
