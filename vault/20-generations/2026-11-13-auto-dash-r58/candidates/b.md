# Candidate b — "Signalwatch"

Security/reliability operations incident console. Light / emerald / `--font-display-grotesk`.

**Macro skeleton**: feed-centric (brief's explicitly-encouraged bucket — "중앙 실행/활동 스트림 +
양옆 보조 패널"). The dominant widget is a literal chronological incident feed (cards), not a
chart and not a resource rail; left = severity filter rail, right = pinnable inspector. Distinct
from candidate a (calendar/board) and c (hero + single chart) within this round, and distinct from
the saturated 3-pane watchlist-rail-plus-chart trading-terminal bucket this catalog's own
reassign-queue already flags (≥4 occurrences) — there is no chart in the center column here, the
feed itself is the proof.

**Interactions (5, ≥4 required)**:
1. Severity filter (checkbox group, left rail) — scoped to the feed list and its "Showing N of M"
   count only; does not touch the KPI row's all-time totals.
2. Click a feed card → pins it: opens the inspector panel and swaps the 4th KPI tile to that
   incident's id/title — two independently-scoped reactions, feed list itself does not re-filter
   or reorder on pin.
3. Sort toggle (Newest / Severity) — a real re-sort of the visible feed.
4. Hover or focus an hourly point on the activity sparkline → a live `aria-live` status line above
   the chart (not a floating tooltip — see the brief-gap note below) shows that hour's count.
5. ⌘K command palette — filter by service, clear filters, or jump to the inspector.

## 브리프에 없던 것

1. **무엇을 정해야 했나**: how to show a per-point sparkline value on hover without the exact
   overflow bug this same round's candidate a hit (an absolutely-positioned tooltip, even at
   `opacity:0`, contributing to an ancestor's `scrollWidth`).
   **무엇으로 정했나**: the sparkline's hover/focus state renders into a plain inline `<p
   aria-live="polite">` sitting above the SVG, never an absolutely-positioned element.
   **왜**: this is the same fix candidate a needed, applied here pre-emptively from the start
   (both candidates were authored in the same session, so the lesson transferred immediately
   rather than needing its own gate failure to discover) — a straightforward case of one round's
   in-progress finding de-risking a sibling candidate, which is exactly what delta/learning passes
   are supposed to let later work reuse, just compressed into a single round here since both were
   self-authored back to back.

2. **무엇을 정해야 했나**: the brief's accent-math guidance (`curation-criteria.md` Q24) says
   values that fail the a11y gate should have their *usage* narrowed rather than their *value*
   changed everywhere — but doesn't give a ready answer for a solid-fill segmented-control pill.
   **무엇으로 정했나**: kept `emerald-600` for every badge/icon usage (all pass easily on their
   `*-50` tints) but used `emerald-700` specifically for the one white-on-solid-fill button state
   (the active segmented-control pill), after this round's own Lighthouse run measured
   `emerald-600` at 3.65:1 against white text (short of the 4.5:1 floor) for that specific
   12px/400-weight combination.
   **왜**: narrowing by usage (solid-fill-with-white-text only) rather than replacing the token
   catalog-wide keeps every already-correct tinted-badge usage untouched.

3. **무엇을 정해야 했나**: INCIDENTS needed a deterministic MTTA (mean time to acknowledge)
   figure for the KPI row, but the brief doesn't specify how "deterministic" dummy aggregate
   statistics should be computed vs. hand-set.
   **무엇으로 정했나**: computed it as a real reduce/average over the fixed per-incident
   `ackMinutes` field (itself hand-authored, not random) rather than hand-typing the rounded
   result — so the displayed figure is traceably derived from the visible per-incident data,
   the same choice candidate a made for its utilization percentage.
   **왜**: keeps the KPI figure internally consistent with the feed data a reader could
   cross-check, rather than being an independent, unverifiable literal.
