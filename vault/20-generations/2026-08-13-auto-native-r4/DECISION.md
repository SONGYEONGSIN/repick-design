# auto-native-r4 — DECISION

Target: `native`. Candidates: a = Browse (search & browse marketplace listings) · b = Notifications (activity feed) · c = Order History (grouped purchase timeline, expand-on-tap).

Frozen source hash judged: `65db908a6a60223d33905cb714c58ebb5151ac56`.

Screen-type selection this round: with `PAGE_TYPES` unfilled at 0 (all 18 filled — first time this happened, see `questions-queue.md` Q18 update), round target rotation fell to `dash/landing/native` random with `dash` excluded (already generated as round 1 of this execution) — `native` was drawn. Three previously-uncovered screen types were assigned (search/browse, notifications, order history), distinct from all 8 existing native screens (Watchlist, AI Match, Price Detail, Offer Thread, Account & Preferences, Sell Price Guide, Handoff Check, Owned Grid).

## Judge panel (3 lenses, blind — parallel agents, no cross-visibility)

### Lens 1 — DNA compliance (GENERATION.md + tokens.ts)
**Ranking: b > c > a.**
No candidate has a canonical DNA violation (SafeAreaView confirmed on all 3 independently by the orchestrator before judging; no hex, no `Math.random`/`Date.now`/`new Date()`, no emoji, no Hangul copy). b wins on the cleanest, most deliberate match to the accumulated fixed-vs-scrolling-chrome finding — correctly reasons (in its own source comment) that a no-terminal-action screen should have zero fixed chrome, and executes it fully (`NotificationsScreen.tsx:219-241`), plus the most precise accessibility-role mapping (`accessibilityRole="switch"`/`"radiogroup"`, going beyond the GENERATION.md minimum). c makes the same zero-fixed-chrome judgment correctly but loses ground to a real, code-attributable rendering defect (see below). a is marked down for pinning a non-interactive "Browse" title alongside its (justified) pinned search input — dead chrome riding along with functional chrome, the exact anti-pattern the loop's r1→r2 deltas warn against.

### Lens 2 — mobile app commercial polish
**Ranking: b > c > a.**
b is defect-free across both widths — real state-machine mark-read/mark-all-read (including a legitimate state-dependent disable, not a permanently-dead control), uniform ≥44pt touch targets, type differentiated via monogram+label without leaning on hue. c has the richest domain modeling and interaction (status-conditional expand detail, 4-shape status system) but a real, evidenced defect: the "Total spent" header stat visibly line-wraps mid-digit at 390px (`c-390.png`) while rendering fine at 768px (`c-768.png`) — `stat`/`statValue` styling too wide for its column at the narrowest supported width. a is functionally solid (search/filter/sort/save all real, composable state) but loses ground to two evidenced defects: the sort-row labels ("Price: Low to High"/"Price: High to Low") truncate to unreadable fragments at 390px (losing the actual distinguishing information, not just cosmetic), and its save-chip is visually under the 44pt convention (mitigated but not eliminated by `hitSlop`).

**Cross-lens finding, independently caught by both lens1 and lens2**: candidate c's currency values (`₩4,555,000` etc., `OrderHistoryScreen.tsx:243,170-172`) render with what both judges independently described as a horizontal line through the full digit string, visible in both `c-390.png` and `c-768.png`. Neither judge could pin an exact cause from source (no `textDecorationLine` anywhere in the file). The orchestrator investigated further post-judging: candidate c is the only one of the three combining `₩` with `fontVariant: ["tabular-nums"]` on the same text node (`OrderHistoryScreen.tsx:170-172,426-431`) — candidate b also renders `₩`-prefixed prices extensively (`data.ts`, e.g. "₩185,000 — down from ₩220,000") but *without* `tabular-nums` on that text, and shows no artifact. This isolates the likely trigger to `fontVariant: tabular-nums` interacting badly with the Won-sign glyph in this environment's font-fallback chain, though the orchestrator was not able to fully confirm the rendering-engine mechanism (a live DOM/computed-style inspection, not just source-reading, would be needed) — recorded as a hedged-confidence LEARN delta below.

### Lens 3 — screen-type/structural differentiation
**Ranking: c > a > b.**
All three avoid outright convergence with each other or the 8 existing screens, but c stands furthest apart: the only candidate whose list isn't a flat array of uniform rows (a synthetic month/order row union produces genuine grouping, `OrderHistoryScreen.tsx:27-29,93-108`) plus the only tap-to-expand accordion with status-conditional detail in the round — a disclosure pattern not present anywhere else in the app. a earns real (if narrower) differentiation via its pinned, task-relevant search bar and a richer 3-primitive filter vocabulary (multi-select category + single-select price band + segmented sort) than its round-mates. b, while executing its assigned type competently and correctly per the established no-fixed-chrome precedent, was judged the least structurally novel of the three — closest in raw skeleton (chip-filtered flat list) to a, distinguished mainly by one hand-built toggle switch control.

## Aggregation

| | lens1 (DNA) | lens2 (mobile polish) | lens3 (differentiation) |
|---|---|---|---|
| 1st | b | b | c |
| 2nd | c | c | a |
| 3rd | a | a | b |

**1st-place votes: b=2, c=1, a=0. Winner = b (Notifications) by 2-of-3 majority.**

Same structural pattern as this execution's round 1 (`auto-dash-r13`): a dual-majority across two lenses (here, DNA + mobile-polish) outranks a lone differentiation-lens vote when the two conflict, per this loop's established tie-break precedent. Not a forced winner — b was not merely "safest," it was independently rated cleanest/most-polished by two separate lenses reading different evidence (compliance-clause checklist vs. commercial-completeness checklist), and lens3 still rated it a legitimate, gate-clean, correctly-executed screen (3rd of 3 on differentiation specifically, not disqualified).

## Judgment coverage — self-reported gaps (consolidated from the 3 lens outputs)
- No lens ran the gate scripts or the app live — all reasoned from source + the 2-frame-per-candidate screenshot set (390px mobile, 768px tablet — Expo web export, not a device photo).
- Lens1/lens2 did not read `vault/20-catalog/ux-guidelines.catalog.md`'s Native/Mobile section directly; lens3 did not open the 8 existing native screens' source (worked from one-line descriptions only, per the task's framing) and did not read `tokens.ts`.
- None tested with an actual screen reader; accessibility assessment throughout is static-source reading of `accessibilityRole`/`accessibilityLabel`/`accessibilityState` props.
- The ₩+tabular-nums rendering artifact's exact mechanism (font-fallback substitution vs. some other cause) remains unconfirmed — flagged as a hedged-confidence finding, not a proven root cause.

## 정제 조치 (post-judgment fix — none needed)
Winner b's judged state matches its frozen hash exactly; no rule violation was found in the winning candidate requiring a post-judgment fix per §3-1. (c's ₩-rendering defect and a's truncation/touch-target notes are round-mate findings, not promotion-blocking issues in the winner.)

## LEARN — delta extracted (see `native-deltas-provisional.jsonl` append)
`fontVariant: ["tabular-nums"]` applied directly to a text node that also contains a non-Latin currency symbol (₩) produces a visible line-through-like rendering artifact across the full string in this environment — not present when the same symbol appears in plain body text without `tabular-nums`, in the same round, from a different candidate. Recorded as L1, hedged confidence (mechanism not fully confirmed — needs a live DOM/computed-style inspection to nail down, source-reading alone ruled out `textDecorationLine` as the cause but couldn't identify the actual mechanism).
