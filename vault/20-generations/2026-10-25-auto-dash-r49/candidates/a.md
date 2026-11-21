# Candidate A — Meridian (AML / fraud transaction-network console)

## Concept (one line)
Meridian is a fraud/AML investigation console for compliance analysts — a dark, rose-accented 3-pane-market shell (watchlist rail folded into the chart itself + center network graph + right case detail) whose dominant visualization is a deterministic node-link network graph of inter-account transfers.

## Structure
- **Macro shell: 3-pane market (trading-terminal family).** This bucket has previously only shipped with a candlestick/price chart in this catalog (r20/b, r29/a, r35/a, r41/a, r42/a, plus promoted `/dash/d52`, `/dash/d32`) — this round pairs it with a network graph instead, which per Q58's grep-before-claiming-novel discipline I verified is a genuinely new pairing (no prior candlestick/network-graph collision).
- **Dominant chart: hand-built SVG network graph**, 8 account nodes on a fixed circular layout (angle = -90 + i·45°, r=85, 2-decimal rounded trig — no `Math.random`), 10 directed transfer edges with stroke-width ∝ volume for the active period. Node radius ∝ risk score; node fill is a semantic status color (flagged/watch/cleared), always paired with a text label (status badge + legend), never color-only.
- **Required accessible fallback** (network graph is catalog grade **D** — mandatory, not optional): the Transfers table lists every edge (From/To/Volume/Flagged), real sort on all 4 columns, a status filter (All/Flagged/Routine), and a working CSV export. Below `sm` it becomes a card list; there is zero `overflow-x-auto` on the page (the table is `table-fixed` + % `colgroup`, `min-w` is not used at all since columns already fit).
- **Always-visible headline**: "Largest flagged flow this period: Halvorsen Trading LLC → Baseline Imports — $Xk" recomputes from `topFlaggedEdge()` on every period change — never hover-gated.

## Interactions (5 implemented)
1. **Hover/focus inspector on graph nodes** — ephemeral `hoveredId` local to `NetworkGraph` only; shows the inspected account's code/name/risk/status in a live-region readout line below the chart. Defaults to the pinned account when nothing is hovered, so the line is never empty.
2. **Click/Enter a node → pin** — `pinnedId`, lifted to the page, drives exactly one consumer: the Case Detail card. Single-consumer tier (the catalog's middle fan-out tier) — a deliberate choice to vary tier coverage across this round's three candidates rather than maxing every candidate to the top tier.
3. **Period toggle (7d/30d/90d)** — recomputes KPI row, edge stroke widths, and the headline readout from the same `EDGES` array (no separate formula).
4. **Real sort + filter on the Transfers table** — `aria-sort` on all 4 columns, independent status filter, untouched by the node pin.
5. **⌘K command palette (bonus)** — global `Cmd/Ctrl+K` listener, Escape to close, focus moves to the input on open (this is the state the `focus` gate's "open a state, then Tab" pass specifically checks).

## Brief gaps — what I had to decide and how

1. **What to decide**: the catalog marks Network Graph as a11y grade **D**, which the brief reads as "단독 사용 금지 — 필수 폴백 함께" but doesn't say whether the fallback table also needs to double as the "real sort/filter" interaction, or whether that should be a separate table.
   **What I chose**: one table serves both duties (required fallback *and* the sort/filter interaction).
   **Why**: the brief's interaction list already names "실제 정렬/필터" as its own item: building a second table purely to satisfy word-count on two different headings would be duplicate information with no reader benefit, and `curation-criteria`'s Q6 reuse doctrine judges by information architecture, not by file count.
2. **What to decide**: the brief doesn't specify a required visual treatment for the "unpinned" vs "pinned" state in a chart with no separate selection highlight listed in the chart catalog.
   **What I chose**: a thin rose ring one radius-unit larger than the node's own circle, rendered only for the pinned node.
   **Why**: this keeps the pin visible without relying on fill-color alone (status already owns fill color), consistent with "색만으로 전달 금지."
