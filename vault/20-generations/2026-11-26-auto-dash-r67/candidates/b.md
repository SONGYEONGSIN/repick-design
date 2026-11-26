# Candidate B — Tendril

**Concept**: Tendril, a vendor dependency & concentration-risk console for supply-chain teams, viewed here through
the "Aurora Electronics" workspace. Its dominant visualization is a deterministic three-ring radial node-link graph
(1000×560 coordinate space, `rx`/`ry = rx×0.56` ellipses, trig rounded to 2 decimals, no `Math.random`): 4 internal
sites in the center ring, 14 tier-1 vendors in the middle ring, 20 tier-2 sub-suppliers in the outer ring — 38 nodes
total. Edges run site→tier-1 (weighted by annual USD spend) and tier-1→tier-2 (unweighted sourcing dependencies);
a tier-2 node depended on by 2+ tier-1 vendors is flagged "concentration risk" (6 of them), the headline failure
mode the product exists to surface. Risk is never color-only: shape encodes tier (square/circle/diamond), border
style encodes risk band (solid vs. dashed-and-thicker for High/Critical), and the numeric score is always rendered
inside the node — color is the fourth, non-load-bearing cue. The required D-grade fallback ships as an equally
functional "Adjacency list" tab (sortable by node/risk/links/spend with real `aria-sort`, filterable by text, tier
dropdown and a "concentration risk only" switch) right alongside the graph in the same card, selected via `Tabs`,
never hidden behind it.

**Two independent selection axes**: (1) *persistent, click-based* — clicking or pressing Enter on a node anywhere
(the graph, a table row, a connection chip in the inspector, or the ⌘K palette) pins it, which updates **only** the
Node Inspector card (profile, risk score + progress bar, owner avatar, upstream/downstream connection chips).
(2) *ephemeral, hover-based* — hovering or focusing a row in the completely separate "Spend by category"
small-multiples strip reveals that row's share-of-total, supplying vendor and risk band inline; this state is local
`useState` inside `CategorySpendStrip` itself, never lifted to the page, and never reads or writes the pin.

**Interactions (5)**: ① hover/focus crosshair-style tooltip on graph nodes, with full keyboard traversal via a
roving-tabindex (arrow keys / Home / End move between all 38 nodes, Enter pins); ② real sortable + filterable
adjacency-list table; ③ Graph/Adjacency-list view tabs, plus an independent 3mo/6mo segmented control on the spend
trend sparkline; ④ the split pin (graph→inspector) vs. hover (category strip, self-contained) selection axes above;
⑤ a live spend-trend sparkline (6 literal monthly figures). All client components, fully functional, deterministic,
`motion-reduce:`-gated.

**Typography/contrast confirmation**: Pretendard (`--font-sans`) everywhere except the sidebar wordmark "Tendril"
and the Graph card's two hero numbers (total nodes, annual spend), which use `var(--font-display-mono)` —
exactly the "wordmark + 1–2 hero numbers" allowance, nothing else. Exactly three rendered weights across the whole
folder: `font-normal` (400, body/table/captions), `font-medium` (500, labels/nav/badges/tabs) and `font-semibold`
(600, headings, the wordmark, headline numbers) — grepped clean of `font-bold`/`font-light`/any other weight.
Every secondary-text class stays at `text-zinc-400` or lighter (grepped clean of `zinc-500`/`zinc-600`). Dark
surfaces are `zinc-950`/`zinc-900` with `white/10` borders; the violet accent (`violet-300/400/600`) is used
sparingly — focus rings, the pinned node's border, tab underline, toggle/segmented active state and solid CTAs
(`violet-600` + white text) — never as a whole-node fill, matching the risk-band palette's own restraint.

## 브리프에 없던 것

1. **The exact node/edge counts and all domain numbers (spend, risk scores, the concentration threshold).**
   Decided on 38 nodes (4 sites + 14 tier-1 + 20 tier-2), hand-authored literal spend figures summing to a $28.9M
   annual total, and a concentration-risk threshold of "depended on by 2 or more tier-1 vendors" (6 nodes qualify).
   The brief only fixed the chart-type ceiling (≤100 nodes for SVG) and the D-grade-fallback requirement, not real
   data or a threshold — 2+ is the conventional "single point of failure" bar in dependency-risk tooling.

2. **How to keep the dominant graph's headline numbers "never hidden until hover" once a Graph/Table tab exists.**
   Decided to hoist the stat row into its own `NetworkHeadlineStats` component, rendered once above the tab panels
   rather than inside the Graph tab's own markup, so it stays visible in both the graph and table views. The rule's
   intent reads most strictly as "never gated behind which view is active," not only "never gated behind a mouse
   event" — pre-empting a failure that would only show up when the table tab is opened.

3. **The deterministic layout algorithm and its margins.** Decided on three concentric ellipses (not circles) with
   `ry = rx × 0.56` to match the 1000×560 canvas, and ring radii chosen so the outermost ring keeps an ≥8% margin
   to every viewBox edge. The repo's radial-label-clipping rule is specifically about text end-anchored at a fixed
   radius; this graph only shows short in-node codes/scores (full names live in the tooltip/inspector/table), so the
   real risk was node-to-edge overlap at small container widths, which the 8% margin arithmetic (checked against a
   ~300px mobile card interior and a 14px tier-2 node half-width) covers with slack to spare.

4. **Where the second, independent interaction axis physically lives.** Decided to give it its own card ("Spend by
   category") with hover/focus state declared as local `useState` inside `CategorySpendStrip` itself — not passed
   down as a prop from the page, not read by any other component. The brief's hard-won distinction rewards an axis
   that is genuinely, structurally separate from the pin, and keeping the state local (never even threaded through
   the parent) is the strongest available proof that hovering a spend bar can never, even accidentally, touch the
   graph's pinned node.

5. **Edge semantics ("depends on" vs. "depended on by") and fixing a direction bug caught in self-review.** Decided
   edges mean "source sources from target" (site sources from tier-1, tier-1 sources from tier-2), so "upstream"
   (what a node depends on) follows the edge's own source→target direction and "downstream" (who depends on it)
   follows it in reverse. An earlier draft had the two swapped in `neighborsOf`; the convention chosen matches
   standard supply-chain usage (upstream = toward raw materials/suppliers) and was verified against the
   concentration-risk nodes, which should have a large "downstream" (depended-on-by) count — confirmed after the fix.
