Check string: "Price History"

# Candidate b — Watched Item Price History

`native/src/evolve/r46/b/PriceHistoryScreen.tsx` (default export
`PriceHistoryScreen`) + `data.ts`.

## Concept

A single watched-but-unsold item's price history: one buyer is tracking
one listing ("Sony WH-1000XM4 Wireless Headphones", condition "Like
New") that has not sold, and the screen shows that item's full fixed
price timeline — 7 recorded points from "Listed at ₩ 185,000" on
Aug 2, 2026 down to the current ₩ 109,000, including one mid-sequence
price *raise* (₩ 152,000 → ₩ 158,000) so the data isn't a trivially
monotonic staircase. Every row is plain, non-`Pressable` content — there
is nothing to drill into on a fixed historical price point.

**Band shape and why.** This is a read-only record screen in the
GENERATION.md §3 sense: nothing is gated behind an unfinished prior
step, so there is no "why can't I proceed yet" sentence to say, which
means a blocked/ready/done state machine is the structurally wrong band
here. The bottom band is instead a persistent, always-mounted action
bar holding exactly one real control: a history-order toggle
("Oldest first" ↔ "Newest first") that actually reverses the rendered
`FlatList` order. The container carries `accessibilityLiveRegion="polite"`
(the only live region on the screen, as instructed for this specific
band shape), and only the confirmation line itself
("Showing newest first: 7 price points, Oct 22, 2026 back through
Aug 2, 2026.") carries `accessibilityRole="alert"` — not the container.

**Making the one action substantial, not thin.** The toggle is
provably correct rather than decorative: `buildEnrichedHistory()` in
`data.ts` computes each point's KRW delta, signed percent change, and
day-gap from its true *chronological* neighbor exactly once, in fixed
order. The screen's sort control only ever reorders a *copy* of that
already-computed array for display — it never recomputes anything — so
reversing the visible order can never change what any row's delta/
percent/day-gap says, only which row it sits next to. To additionally
guard against the "one button, otherwise thin" failure mode this band
shape is known to risk, every non-interactive row carries real computed
content beyond date+price: a colored delta badge (success-token green
for a drop, warning-token amber for the one raise), the signed percent
change, the KRW amount, and "N days after the previous point" — plus a
header block with a current-price card showing total change since
listed (₩ 76,000 lower, −41.1%) and days watched/days-unchanged, both
derived from the same fixed dates via a pure `daysBetweenIso()` helper
(no `Date.now()`, no argument-less `new Date()` anywhere).

Code surface (style keys, state names, helpers — `screenRoot`,
`sortBarContainer`, `toggleHistoryOrder`, `historyRowDeltaBadge`,
`buildEnrichedHistory`, `daysBetweenIso`, etc.) is written fresh for
this price-history/watchlist domain, not copied from any existing
read-only-record screen in the catalog (e.g. `ProvenanceRecordScreen`),
per the "band shape may repeat, code surface may not" rule.

## 브리프에 없던 것

① What a buyer-watching-an-unsold-item price history screen should do
when the price history isn't purely monotonic (every real listing can
get a price *raise*, e.g. a reluctant relist after a failed offer, not
just drops) — the brief's examples ("Listed at X", "dropped to Y") only
describe decreases.
② Decided as: included one price-raise point (₩ 152,000 → ₩ 158,000 on
Sep 10) in the fixed dummy data, styled with the `warning` token instead
of `success`, so the screen's color language stays meaningful (green =
good news for the watcher, amber = caution) rather than painting every
row green regardless of direction.
③ Because a real price-history list is not strictly decreasing, and
hard-coding every row as a "drop" would make the one working list
interaction (the sort toggle) look trivial — reversing a list that only
ever goes one direction proves nothing, while reversing a list with a
reversal in the middle of it is a genuine, checkable reorder.

① Which single action to make the persistent band's one real control —
the brief offers "sort toggle" or "price alert toggle" as equally valid
options with no tiebreaker.
② Decided as: the sort toggle, because it operates directly and
visibly on the list that makes up almost the entire screen (re-ordering
all 7 rows), whereas a price-alert on/off toggle would only change one
small badge's text and risked being exactly the "trivial toggle that
barely changes anything" failure mode the assignment explicitly warned
against.
③ A control whose effect is large and checkable against the page's own
content (the visible row order) is easier for a judge or screen-reader
user to verify than a control whose only effect is an isolated state
word changing from "Off" to "On".

① How to keep the per-row delta/day-gap numbers correct under both sort
directions without literally recomputing them against the wrong
neighbor after a reverse (a decorative-looking sort is a known risk
flagged in the brief).
② Decided as: compute `deltaKRW` / `deltaPercent` / `daysSincePrevious`
once in `buildEnrichedHistory()` over the chronologically-ordered source
array in `data.ts`, before any display-order logic exists, then only
ever `.reverse()` a *copy* of that already-enriched array for rendering.
③ This makes "oldest first" vs "newest first" purely a presentation
concern — the math layer never sees or depends on display order — so
the sort toggle cannot silently corrupt the numbers it's supposed to be
reordering, which is the exact failure a cosmetic (non-functional) sort
toggle would be vulnerable to.

① Whether the photo placeholder (no image asset exists for this item)
should be a plain empty gray box or carry any content.
② Decided as: a small square in `tokens.color.swatch1` with a short
text mark ("WH") inside it, sized well under the touch-target minimum
and positioned next to, not inside, the one real `Pressable`.
③ A flat empty box reads as a bug/placeholder-forgot-to-fill-in, while a
short text mark reads as an intentional stand-in for a product photo —
and keeping it non-interactive and small avoids any ambiguity with the
screen's one real control.
