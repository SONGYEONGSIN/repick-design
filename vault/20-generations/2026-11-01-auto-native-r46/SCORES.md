# auto-native-r46 — SCORES

Freeze hash (post-registration, pre-screenshot/judging, unchanged through screenshots and judging): `a086168e7e9f1fa8df490006a63d4e2c48c545b7`

## Hard gate (`node scripts/gate.mjs --target native --screens evolve-r46-a evolve-r46-b evolve-r46-c`)

| Candidate | tsc | export | render | iframe |
|---|---|---|---|---|
| a — ShippingLabelScreen ("Buy a shipping label") | 통과 | 통과 | 통과 | 통과 |
| b — PriceHistoryScreen ("Price History") | 통과 | 통과 | 통과 | 통과 |
| c — BulkRelistScreen ("Ended Listings") | 통과 | 통과 | 통과 | 통과 |

**All 12 gates clean on the first run — zero 1-fix used by any candidate.** `native/node_modules` had to be installed first (not present in this session's checkout); `npx tsc --noEmit` scoped to the whole `native/` project was also run independently and returned clean.

## Judge panel (3 lenses, blind, `general-purpose` Agent dispatches — no custom designer/comparator agent type configured)

| Lens | 1st | 2nd | 3rd |
|---|---|---|---|
| lens1 — DNA compliance | **a** | b | c |
| lens2 — mobile completeness | **b** | a | c |
| lens3 — screen-type differentiation | **c** | b | a |

**A complete 3-way tie — all three lenses picked a different 1st place.** Resolved via this project's established tie-break procedure ([[curation-criteria]] "주간 반증 판정 기준" ②): *"완전 동률 시 brief 렌즈 우선을 유지하되, archetype 렌즈가 그 후보를 최하위로 명시 판정했으면 동률 우승서 제외하고 나머지 중 brief 1위 재적용."*

- Brief-lens (lens1) top pick: **a**.
- Archetype-lens (lens3) explicitly ranked **a last (3rd)** — the exception condition is met.
- a excluded from the tie; lens1's preference reapplied among the remaining two (b, c): lens1 ranked **b** above c.
- **Winner: b ("Price History").**

### Lens1 (DNA compliance) — full reasoning
All three clear the bar, no disqualifying violations. a 1st: textbook blocked-workflow state machine for a genuinely gated situation, both required a11y attributes correctly scoped, every `accessibilityHint` verified honest, and its code-surface-distinctness claim against `SellerVerificationScreen.tsx` spot-checked and confirmed (no shared style-key/handler names). b 2nd: correctly identifies and applies the read-only-record shape, substantive (non-decorative) single action, correct live-region discipline — held back only because its own reuse-distinctness claim named no specific precedent screen to verify against (unverified, not falsified). c 3rd: correctly identifies the selection-derived shape, its reuse-distinctness claim against `relist/BulkRelistScreen.tsx` was the most rigorously spot-checked and confirmed true of the three — ranked last mainly on a visually-small (but technically 44pt-compliant) checkbox glyph and a judgment call that its overall tray silhouette (dark band, ghost-clear + solid-primary button pair) is the thinnest form of differentiation among the three despite verified-distinct naming.

### Lens2 (mobile completeness) — full reasoning
b 1st: the only candidate with a rich set of *derived* numbers, and lens2 independently hand-recomputed every delta/percentage/day-gap in the price-history series against the raw data and confirmed all of them exact to the screenshot, plus thoughtful domain-aware color semantics (price drop = success-green, price raise = warning-amber, not generic good/bad). a 2nd: most interaction breadth (carrier selection, validated weight/size inputs, gated pay flow, expand/download), correct simple arithmetic, clean native idiom at both 390/768px — ranked just behind b only because there's comparatively little to verify arithmetically (a flat-rate add-then-total, deliberately and self-documented as such). c 3rd: genuine, well-built interactions (real state mutation on relist, correctly derived tray-visibility), but the thinnest in computed/derived content of the three — no aggregate value or percentage anywhere on the screen, each row just echoes a static price.

### Lens3 (differentiation) — full reasoning
Did a real catalog sweep (`ls native/src/`, grepped r40–r45 for live-region usage, and — critically — opened each candidate's own named "closest precedent" screen in full to verify, not just trust, their self-reported distinctness claims). c 1st: shape reused from `relist/BulkRelistScreen.tsx` (confirmed) but **zero shared identifiers** (verified directly) and a real functional divergence — the existing screen's actions are non-destructive/undoable with an undo bar, c's relist action is destructive/irreversible with a dismiss-only confirmation panel — plus it fills an actual catalog gap (ended-listing relist vs. live-listing price-tuning). b 2nd: correctly fills a real gap (`watchlist/WatchList.tsx` is a summary list, not a single-item price-timeline drill-down) but lens3 found a specific, narrow, previously-undisclosed echo — the self-clearing live-announcement mechanism (`ORDER_NOTICE_LIFETIME_MS = 5000`, a timer ref, identical cleanup/guard pattern) is nearly identical to `evolve/r33/a/ProvenanceRecordScreen.tsx`'s `ANNOUNCEMENT_LIFETIME_MS = 5000` mechanism — narrow enough not to sink the candidate (the surrounding screen and the control's actual operation are genuinely distinct), but real and unclaimed in the concept note. **a 3rd, severely**: lens3 did not take the concept note's "distinct code surface" claim at face value and instead opened `pickup/ShipmentPickupScreen.tsx` (a's own named closest neighbor) in full — found the *architecture*, not just the style-key prefix, is a near-skeletal match: identical `FlatList` + `listRef` + scroll-to-index-on-blocked-press pattern, a **verbatim** `onScrollToIndexFailed` fallback handler, the same discriminated-union blocked/ready/done state shape, the same 3-way band conditional, and near-identical `ListHeaderComponent` structure/copy ("Pick a carrier, confirm the package, then pay to generate the label" vs. "Confirm the package, pick a carrier, then book a pickup window"). Renaming style keys (`control` vs. `dock`) did not prevent this — exactly the failure mode `native/GENERATION.md` §3's existing L2 note warns about, found at a deeper layer (component architecture, not just naming) than that note's original examples.

## No post-judgment §3-1 fix

No rule violations (per `native/GENERATION.md`'s explicit, enumerated rules) were cited against winner b by any lens — lens3's finding about b is a narrow pattern-reuse observation, not an enumerated-rule violation, and does not change the tie-break outcome (the tie-break turns on lens3's ranking of **a**, not b). Nothing to fix. Freeze hash for b unchanged from the pre-judging gate run through final judging.
