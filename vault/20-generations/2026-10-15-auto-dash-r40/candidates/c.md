# Candidate C — Tracewell

**Concept**: Tracewell, an incident-response ops console whose dominant visualization is a process-mining flow map
of how tickets actually move — Detected → Triaged → Investigating → Mitigating → Resolved, with an Escalated
branch that loops back to Investigating and a Reopened branch off Resolved — with every node's live count and
every edge's transition volume printed as plain text on the diagram itself, and the single worst bottleneck edge
(Escalated → Investigating, highest average wait) flagged with a red treatment, a warning icon and a named
callout.

## Interactions implemented (5)

1. **Crosshair-style hover tooltip** on process-map nodes/edges — ephemeral, keyboard-equivalent via focus, and
   explicitly suppressed when the hovered item is already pinned/selected (`process-map.tsx`).
2. **Click/Enter-to-pin selection**, narrowly scoped to exactly one adjacent tile ("Selected step" card) rather
   than fanned out across the page (`process-map.tsx` → `selected-step-detail.tsx`).
3. **Period segmented control** (7d / 30d / 90d) that swaps the edge-volume and wait-time dataset feeding the
   whole flow map, the bottleneck callout, the path-summary table and two KPI tiles (`process-map.tsx`).
4. **Real table sort + filter** on Recent Incidents — tri-state tab filter (All/Open/Resolved) plus clickable,
   `aria-sort`-correct column sort on State/Age/Priority (`recent-incidents-table.tsx`).
5. **⌘K command palette** — opens via the header trigger or Cmd/Ctrl+K, filters as you type, Arrow/Enter/Escape
   keyboard nav, focus returns to the input on open (`command-palette.tsx`).

All of the above are deterministic (no `Math.random`, `Date.now`, or bare `new Date()`), and `motion-safe:`/
`motion-reduce:`-gated where any transition is used.

## Typography confirmation

Exactly three rendered font weights across the whole route: `font-normal` (400, body/caption), `font-medium`
(500, labels/nav/badges/table cells), `font-semibold` (600, headings and the process-map's node/edge values).
No `font-bold`, `font-light`, or any other weight utility appears anywhere in the folder (verified by grep).
No display typeface was added — plain Pretendard throughout, hierarchy carried by size/color/tracking only.

## 브리프에 없던 것

1. **Domain and numbers for the flow itself.** The brief named "incident-response runbook flow" as one valid
   option but specified no concrete states, volumes or wait times. I invented the 7-state graph (with a
   fast-track Triaged→Resolved shortcut and a balanced Escalated/Reopened loop-back) and hand-built a
   flow-conserving 30-day dataset (every node's inflow equals its outflow except the Resolved sink), then
   derived 7d/90d variants by scaling, so the numbers read as internally consistent rather than arbitrary.

2. **Choice of node/edge color semantics.** The brief fixed dark+cyan with destructive red, but didn't say how
   to color seven different ticket states without adding a second accent. I restricted every semantic signal to
   three tones only — neutral zinc, cyan for "active work," red for "needs attention" (Escalated, Reopened,
   Critical priority, the bottleneck) — always paired with a distinct lucide icon, never color alone.

3. **The narrow selection fan-out target.** The brief required selection to update "ONE adjacent tile" but left
   the specific tile's content open. I chose a single "Selected step" card that shows a dwell-time-bucket bar
   chart for a selected node, or volume/wait + up to three matching open tickets for a selected edge — two
   different views behind one component, switched by the discriminated `SelectedTarget` union, so exactly one
   tile ever changes regardless of what's clicked.

4. **Process-log findings (hard-gate fix pass).** The shared `focusRing` constant in `command-palette.tsx`,
   `page.tsx`, `process-map.tsx` and `recent-incidents-table.tsx` led with `outline-none`, which sets
   `--tw-outline-style: none` and is never reset by the later `focus-visible:outline-2` utility in this repo's
   Tailwind v4 setup — the ring is invisible on every one of those elements. Fixed by dropping `outline-none`
   from the constant everywhere; `focus-visible:` alone is sufficient. Separately, this repo's
   `react-hooks/refs` lint rule forbids reading or writing a `ref.current` during render (not just
   `react-hooks/set-state-in-effect`, which forbids `setState` inside a `useEffect` body) — so the
   render-time "reset on prop change" idiom here has to track the previous value with `useState`, not
   `useRef` (confirmed against this repo's own `r40/b/command-palette.tsx`, which already uses that
   pattern). Verified the actual sweep culprits with Playwright rather than guessing further: the
   `table-overflow` on `table#2` and the `cell-overlap` between "Investigating" and "MC" were both inside
   `recent-incidents-table.tsx`'s own table — the Priority column's badge (`"Medium"` worst case) needed
   ~18px more than its 11% colgroup share, and the ID column had zero safety margin against Title; rebalancing
   the six column percentages (11/24/20/19/10/16) fixes both with zero overflow/overlap at every sweep width.
   The process map's `<svg>` carried fixed `width`/`height` pixel attributes instead of scaling with its
   `viewBox`, so its `overflow-x-auto` wrapper (`div#0`) scrolled instead of shrinking below ~1424px — fixed
   by dropping the fixed attributes for `className="block h-auto w-full"`. Also fixed the account-menu
   `label-content-name-mismatch` (aria-label now leads with the visible "JL" initials) and the State/Age/
   Priority sort-header buttons' `target-size` (now `h-6`/24px tall, with extra `th` padding between them).
   Full gate (`route/types/static/lint/weights/sweep/focus/console/a11y/perf`) now passes clean.
