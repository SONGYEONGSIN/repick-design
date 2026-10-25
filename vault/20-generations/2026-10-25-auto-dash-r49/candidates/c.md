# Candidate C — Ledgerwell (incident root-cause review board)

## Concept (one line)
Ledgerwell is an SRE incident-review console — a dark, orange-accented, board/kanban-centric shell (four-column remediation board: Open → Investigating → Remediation → Closed) whose dominant visualization is an accessible-native decomposition tree breaking a selected incident's root cause into Infrastructure/Code/Process factors, with two independently-scoped persistent selections.

## Structure
- **Macro shell: board/kanban-centric.** Used twice in the preceding five rounds (r45/b Marimekko-as-kanban-columns, r47/a waffle+kanban), both paired with a non-tree chart. This round pairs kanban with a decomposition tree, a new combination verified against both `app/src/app/dash-evolve/` and `/dash` per Q58.
- **Dominant chart: decomposition tree**, implemented as an **accessible-native nested disclosure list** rather than SVG — each category (Infrastructure/Code/Process) is a real `button[aria-expanded]` sibling to a separate selectable label button (no nested `<button>`-in-`<button>`), defaulting to fully expanded so every leaf percentage is visible without interaction. This satisfies the catalog's own accessibility requirement for this chart type ("키보드 확장/축소, SR가 노드 값+%기여 낭독") directly in the primary surface rather than needing a second, separate accessible-fallback artifact.
- **Two independently-scoped persistent selections (catalog's top fan-out tier — "다축 독립 스코프")**: a kanban-card pin (`selectedIncidentId`) drives only the Incident Detail card; a tree-node pin (`selectedFactor`) drives only the Contributing Factor card. Neither resets the other. Because factor ids (`infra`, `code-nullcheck`, …) are shape-invariant across all six incidents, selecting a factor type is genuinely independent of which incident is active — switching incidents re-reads the *same* selected factor's percentage for the new incident rather than needing to reset to a default.
- **Required register table**: the Incidents register lists all 6 incidents (Title/Severity/Status/Owner/Opened), real sort on 4 columns, a severity filter (All/Sev1/Sev2/Sev3), CSV export. Zero `overflow-x-auto` on the page.
- **No display font this round** (deliberate face choice, not an oversight) — Pretendard throughout, to vary the face axis against this catalog's recent dash winners (none of whom chose to skip a display face).

## Interactions (5 implemented)
1. **Hover/focus ephemeral readout on any tree row** (category or leaf) — local `hovered` state in `DecompositionTree`, shows a one-line description; falls back to the current pin's description when nothing is hovered, so the readout line is never empty.
2. **Click a tree row → pin `selectedFactor`** — drives exactly one consumer, the Contributing Factor card.
3. **Click a kanban card → pin `selectedIncidentId`** — drives exactly one consumer, the Incident Detail card (and the tree's own percentages, since the tree always displays the selected incident's shape — this is the chart re-reading its input, not a second consumer of the pin).
4. **Real sort + filter on the Incidents register** — 4 sortable columns, severity filter, independent of both pins.
5. **⌘K command palette (bonus)**.

## Brief gaps — what I had to decide and how

1. **What to decide**: the brief's chart catalog requires a decomposition tree to have "키보드 확장/축소, SR가 노드 값+%기여 낭독" but doesn't say whether that accessible behavior must live in a *second*, separate fallback element (as grade-C/D charts require) or can be the primary rendering itself.
   **What I chose**: build the tree as the accessible structure directly (nested `<ul>`/`<button aria-expanded>`), with no separate SVG-plus-table pair.
   **Why**: the catalog's "필수 폴백" language for other grades exists because *those* chart types (treemap, sunburst, network graph, chord) are visually dense shapes whose SVG rendering carries information a DOM-based fallback can't reproduce one-to-one. A decomposition tree's canonical interaction (expand/collapse, read value+contribution) maps directly onto native disclosure-list semantics with nothing lost — building a second, separate fallback would duplicate the same numbers in a different DOM shape for no accessibility gain.
2. **What to decide**: with two independent pins, the brief doesn't say what happens to the factor pin when the incident pin changes (reset to a default, or keep whatever was selected).
   **What I chose**: keep the same factor id selected across incident changes (ids are shape-invariant, so "Code → Race condition" stays selected and its percentage just updates for the newly active incident).
   **Why**: this is the stronger reading of "independently scoped" — resetting the factor pin on every incident change would make it secretly dependent on the incident pin (a hidden third consumer effect), which is exactly the coupling the top fan-out tier is defined against.
