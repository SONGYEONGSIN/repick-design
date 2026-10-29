## Concept
A single scrolling list — no fixed chrome at all — where a scroll-away header chip tallies live "alerts active" and each watched listing carries its own enable toggle, fixed-price/percent-drop mode switcher, and inline validity note so the two jobs a bottom band usually does (current state, and what's blocked/why) live inside the body itself.

## 브리프에 없던 것

1. ① What counts toward the "active alerts" counter when a row is enabled but its input is invalid/empty.
   ② Only rows that are both toggled on AND have a resolvable (in-range, non-empty) threshold count as active; a toggled-on row with an invalid entry is excluded until fixed.
   ③ Arbitrary, but chosen so the counter stays a trustworthy single number instead of silently counting "intent" that wouldn't actually fire — the counter and the per-row readout both read from the same `resolveNotifyBelow` function, so there's no separately hand-maintained total.

2. ① Whether the top counter should be a pinned/sticky header or part of the scrolling content.
   ② Made it a `ListHeaderComponent` that scrolls away with the rest of the list, not `position: sticky`/absolute.
   ③ The brief explicitly calls for "zero fixed/pinned chrome" everywhere, not just the bottom — so even the "what currently holds" counter had to avoid being pinned to stay consistent with that constraint.

3. ① Currency for thresholds (brief allowed either ₩ or $).
   ② Used USD ($) throughout, consistently for both current price and threshold.
   ③ Arbitrary pick for English-copy consistency ("notify me below $X" reads naturally in USD); avoided mixing currency symbols within one screen.

4. ① How to let a shopper pick between a fixed-price trigger and a percent-drop trigger without adding a second row or a modal.
   ② A small two-option segmented `Pressable` switcher (`Fixed price` / `% drop`) inline under the toggle, with both raw input strings kept in state simultaneously so switching modes never discards what was typed in the other mode.
   ③ Arbitrary, invented for this screen — no existing segmented-control convention was referenced since none was supplied.

5. ① What text/threshold to show when a row's alert is off.
   ② Collapse the editor entirely when `alertEnabled` is false — no stale threshold, no greyed-out note — only the thumbnail/title/price/toggle line shows.
   ③ Keeps the "what's blocked/why" messaging meaningful only when it's actually relevant (an off row isn't "blocked", it's just off), avoiding a long list of dormant inline forms.

6. ① Rounding/precision for the derived percent-based dollar threshold.
   ② Round to the nearest cent (`Math.round(x * 100) / 100`).
   ③ Arbitrary but standard for a USD display, and keeps the derived readout deterministic and stable across renders.
