# Candidate b — Seller Fee & Commission Statement

A read-only per-sale fee statement with a This Week / This Month / This Quarter segmented filter and a running net-payout total, where each sale row stays collapsed to its headline numbers until tapped open to reveal its own commission / processing-fee / promo-credit breakdown.

## Brief gaps

1. **What**: Whether this screen needs any bottom-fixed band or live-region/alert transition at all.
   **Decided**: No band, and no `accessibilityRole="alert"`/live-region anywhere on the screen.
   **Why**: Section 3 explicitly allows "no band at all if the screen has nothing to block or confirm," and this is a pure read-only statement — nothing on it ever transitions from blocked→possible (switching periods or expanding a row changes what's *displayed*, not whether anything is *allowed*). Section 4's live-region/alert rule is scoped to such transitions, so it has no attachment point here. Noting this explicitly since every other recent round's screen (r36, by convention) did carry a live-region pattern, and I wanted the omission to read as a deliberate reading of the brief rather than a miss.

2. **What**: Which of the three allowed ₩-glyph strategies to use.
   **Decided**: `KRW` Latin-letter notation (e.g. "KRW 182,400"), via a local `formatKRW` helper.
   **Why**: Brief section 1 flags ₩-at-body-size as a real but unfixed rendering risk and asks for one deliberate choice. KRW notation sidesteps the glyph question entirely rather than attempting a third "fix" the brief says to avoid. (The existing r36 reference screen made the same choice for the same reason — I'm reusing the *decision*, not any of its code or copy.)

3. **What**: How to make the segmented control and the period-total card accessible, since the brief doesn't name specific roles for either.
   **Decided**: Segmented control = `accessibilityRole="tablist"` wrapping three `accessibilityRole="tab"` Pressables with `accessibilityState={{ selected }}`; period-total card = `accessibilityRole="summary"` with a single composed `accessibilityLabel` describing the period, sale count, and total. Each sale row's disclosure Pressable uses `accessibilityState={{ expanded }}` rather than inventing a custom hint-only pattern.
   **Why**: These are standard RN `AccessibilityRole` values built for exactly this (tab selection, a summary region, an expandable disclosure), so using them is more idiomatic than approximating with plain `button` roles everywhere, and it gives VoiceOver/TalkBack users the native tab/summary/expanded semantics for free.

4. **What**: Whether "This Week" / "This Month" / "This Quarter" sale lists should be literally nested (month contains week's sales plus more) or independently fixed arrays.
   **Decided**: Literally nested — the three fixed week-sale records also appear, by the same object reference, inside the month array, and the month's six also appear inside the quarter's nine.
   **Why**: Matches how a real statement period rollup would behave (nothing sold this week should mysteriously vanish from the month total) while staying fully deterministic — it's still fixed literals assembled into three lists, not date-filtering logic.

CHECK_STRING: Fee & Commission Statement
