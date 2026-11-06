# Candidate A — Ledgerline

## Product / brand name
**Ledgerline** — a RevOps/FinOps variance decomposition console ("RevOps / FinOps Console" tagline). Persona on the account: Maya Chen (maya.chen@northline.io), workspace "Northline Retail · Q3 FY26".

## Concept
Ledgerline answers one question for a finance/ops team: *why did this number move?* A compact, plain-list KPI rail on the left holds four signed variance metrics (Net Revenue, Gross Margin, Customer Churn, Operating Spend — each vs. Q3 plan). Clicking a metric swaps the dominant right-hand pane: a recursive **Decomposition Tree** that explains the selected metric's variance as a chain of contributing drivers, each showing its signed value and its percentage of its immediate parent directly on the node — down to two levels of drivers (e.g. Net Revenue Variance → Enterprise Segment → New Logo ARR Shortfall). Every number on every node is always visible; nothing about the core numbers is hover-only. A always-present Node Inspector adds a breadcrumb and a magnitude bar for whichever node is hovered, focused, or last clicked, and a fully independent, sortable `<table>` beneath the tree lists every node flattened (regardless of what's expanded) as the required accessible fallback. A ⌘K command palette lets the team jump straight to a metric by name or category.

## Interactions implemented
1. **KPI-rail selection → tree-root recompute**: clicking a metric in the rail swaps the Decomposition Tree's root context (which tree is shown, its default expansion, and which node is pinned) — a narrow, single-axis partial recompute, nothing else on the page changes.
2. **Keyboard-accessible hover/focus readout**: hovering *or* keyboard-focusing any tree node updates the Node Inspector (breadcrumb, value, and a magnitude bar vs. its real parent) — focus and hover are wired identically, so the readout works with a mouse or a keyboard.
3. **Expand/collapse per node**: every non-leaf tree node is a native `<button>` with `aria-expanded`, toggled by click, Enter, or Space — a real keyboard-navigable tree, not just a visual one.
4. **Expand all / Collapse all**: two toolbar buttons above the tree for fast state changes.
5. **Sortable fallback table**: clicking a column header (Driver / Value / % of Parent / Level) in the `<table>` toggles sort direction and updates `aria-sort`.
6. **⌘K command palette**: a search trigger in the top bar opens a dialog that filters the four metrics by name/category and jumps the rail selection on select.
7. **Reset Decomposition**: primary top-bar action that restores the current tree to its default expansion and pinned root.
8. Secondary chrome: a cycling workspace switcher, a notifications disclosure, an account-menu disclosure, and a mobile drawer nav — all real, focusable, independently toggled controls.

## Font / typography confirmation
- Body text, all labels, table cells, and all UI copy use the default `--font-sans` (Pretendard) — never overridden.
- `--font-display-wide` is used exactly once, as a `[font-family:var(--font-display-wide)]` arbitrary value, on the "Ledgerline" wordmark in the sidebar brand lockup only. It is never combined with another display face and never used for body text.
- Exactly three rendered font weights across the whole route: `font-normal` (400), `font-medium` (500), `font-semibold` (600). The page root sets `font-normal` explicitly so nothing inherits an unintended browser-default weight; every other weight is applied explicitly per element.
- All numeric content (variance values, percentages, the ⌘K hint) uses `tabular-nums`.

## 브리프에 없던 것
- **Exact KPI set and variance figures**: the brief specified the domain (RevOps/FinOps variance) but not which four metrics or what numbers. I invented Net Revenue Variance (−$500K), Gross Margin Variance (−$200K), Customer Churn Variance (−$400K ARR), and Operating Spend Variance (+$150K over budget), each with two levels of hand-authored drivers, because the sums-to-total and percentages-sum-to-100 constraint required a fully worked, internally consistent dataset rather than placeholder numbers. I verified every parent/children sum and every sibling percentage group with a small script before finalizing.
- **Tree depth (2 levels of drivers)**: the brief didn't specify how deep the decomposition should go. I capped it at root → segment/category drivers → root-cause sub-drivers (2 levels) to keep the tree legible at all required widths (390px–1920px) without needing horizontal scrolling or a third column of boxes; the flat fallback table still surfaces every node regardless of depth.
- **Visual form of the tree (vertical indented list, not a horizontal left-to-right Power BI-style layout)**: "decomposition tree" most commonly renders as horizontal columns per depth. I chose a vertical, indented, connector-lined tree (border-left guides + chevrons) instead, because a horizontal multi-column layout would either need fixed per-column widths (breaking at 390px) or dynamic DOM-measured SVG connectors (hydration/positioning risk). The vertical form satisfies the same "recursive node showing value + % of parent, expandable" requirement while guaranteeing no overflow at any required width.
- **The Node Inspector panel**: not explicitly requested; added to satisfy the "hover/focus shows more detail" interaction requirement with something genuinely additive (breadcrumb path + a dedicated magnitude bar) beyond what's already always-visible on the node itself.
- **Command palette and its specific fix pattern**: the brief's failure history implied a command palette existed in an earlier attempt at this slot; I rebuilt it from scratch (no reused code, per instructions) using the `wasOpen` render-time comparison pattern for resetting `query`, and used an effect only for imperative `inputRef.focus()` (not a state update), to avoid `react-hooks/set-state-in-effect`.
- **Persona identity**: invented "Maya Chen" / "maya.chen@northline.io" and workspace "Northline Retail" since no real user/account identity may be hardcoded.
- **Expand all / Collapse all and Reset Decomposition controls**: added as low-risk, genuinely functional richness beyond the two required interactions, since the brief invited "a couple more for richness."
- **Notifications and account-menu popovers, workspace-switcher cycling**: the shell spec named these elements (notifications, avatar menu, workspace switcher) without specifying behavior; I made each a minimal but real, independently toggled, keyboard-focusable control rather than static decoration.
