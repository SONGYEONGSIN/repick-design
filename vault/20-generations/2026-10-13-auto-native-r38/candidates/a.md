# auto-native-r38 — candidate a — Help Center

Concept: a Help Center screen where a live text-search box and a combinable category row jointly filter a single FAQ list, and each surviving row is a tap-to-expand/collapse accordion (not a tap-to-navigate card) — no fixed bottom band, since this is pure non-destructive browsing.

## Brief gaps

1. ① Whether expand/collapse should be single-open-at-a-time (classic accordion) or allow multiple answers open simultaneously.
   ② Decided to allow multiple rows expanded at once, tracked as a `Set<string>` of expanded ids rather than a single "currently open id".
   ③ FAQ browsing commonly benefits from comparing two open answers side by side (e.g. "return window" vs "who pays for return shipping"), and nothing in the brief mandates mutual exclusivity; a plain boolean-per-row toggle is also the simplest honest implementation of "tap a question to expand/collapse its answer."

2. ① Whether a search-result count needs a live announcement, and if so what accessibility role it should carry.
   ② Added a `accessibilityLiveRegion="polite"` wrapper (no `alert` role) around a small "N matching questions" text that updates as the filtered list changes.
   ③ The brief's `alert` + auto-clear rule is specifically for blocked→possible progress transitions, which don't exist on this screen (nothing is ever blocked). A plain polite region for a count update is informative without misusing `alert`, and there is only this one live region on the screen, so the "never two live regions at once" rule is trivially satisfied.

3. ① How to render the expand/collapse indicator so it genuinely "rotates... to indicate state" per the brief, without pulling in a new animation dependency.
   ② Gave each FAQ row its own `Animated.Value` (in a small per-row component, `FaqAccordionRow`) and interpolated a chevron glyph's `rotate` transform between `0deg` and `180deg` on toggle, using `useNativeDriver: true`.
   ③ `Animated` ships with `react-native` already (no new dependency), and isolating one `Animated.Value` per row (rather than one shared value swapped between rows) avoids animation glitches when a different row is toggled before the first finishes.

4. ① Whether the category row and the text search should be mutually exclusive or combinable, since the brief says "combinable with the text search."
   ② Implemented as two independent filters ANDed together: `inCategory && matchesQuery(entry, normalizedQuery)`, both recomputed from local state on every change.
   ③ Directly matches the brief's explicit instruction and is what makes this a genuinely "search-input-driven" list rather than a header with a static category chip row bolted onto an otherwise-generic FlatList.

5. ① Whether the search should match only the question text or also hidden keyword tags, and whether matching is case/whitespace sensitive.
   ② Matching normalizes (`trim().toLowerCase()`) the query and checks it as a substring against both `entry.question` and each string in `entry.keywords` (e.g. typing "refund" matches a question literally titled "When do I get my money back?").
   ③ This is what makes the keyword tags in `data.ts` do real work (per the brief's instruction to tag entries with "a few keywords, computed live as the user types") rather than being inert decoration on the data shape.

CHECK_STRING: Help Center
