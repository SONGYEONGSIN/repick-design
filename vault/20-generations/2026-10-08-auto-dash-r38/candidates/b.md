# Candidate B — Ledgerline (RevOps Variance Explorer)

Ledgerline is a light, sky-accented RevOps dashboard where picking a KPI from a flat rail of five variance investigations (New ARR shortfall, Expansion ARR shortfall, Churned ARR, Support SLA breach hours, Gross margin erosion) swaps which root-cause decomposition tree fills the detail pane, and every node of that tree — expanded or not — always prints its own value and percent-of-parent as real, screen-reader-readable text, independent of a separately-stateful sortable/filterable leaf table below it.

## 브리프에 없던 것

**1. Product identity — "Ledgerline"**
① A fictional RevOps/FinOps brand name, wordmark and icon chip (`GitBranch` in a sky tile) for the whole console.
② Set once in `sidebar.tsx` using `--font-display-grotesk` via inline `fontFamily`, and reused in exactly one other spot — the headline dollar/hour figure at the top of the detail pane (`detail-pane.tsx`) — since both are "large Latin text," never mixed with another display face.
③ The brief invents-the-product-freely but is explicit that only one display face may appear per piece; a wordmark plus the one hero number are the only two places in the whole page large enough to qualify as "display" text, so both were anchored to the same variable rather than letting a third place quietly introduce a second face.

**2. The five KPIs, their dimension chains, and all tree weights/values**
① Which five variance stories exist, what three-level dimension chain each decomposes through (e.g. Region → Segment → Reason code vs. Team → Channel → Root cause vs. Cost center → Vendor category → Driver), and every literal weight/root-value number in `data.ts`.
② Chose five distinct SaaS-finance/ops "shortfall" stories so the dominant chart reads as one coherent product feature rather than five unrelated demos, and gave each its own dimension vocabulary (not just relabeled Region/Segment/Reason everywhere) so the rail doesn't feel like five copies of one tree.
③ The brief names the chart type and offers examples ("revenue shortfall, churned users, failed jobs, latency budget") but invents no product; RevOps variance-explaining was picked because it is the most literal, least-stretched fit for "contribution-breakdown analysis," and varying the dimension names per KPI is what makes the rail→tree swap feel like real content rather than a reskinned fixture.

**3. A largest-remainder distribution engine instead of hand-typed dollar amounts**
① How to guarantee every level's children sum exactly to their parent (the brief's "sums reconcile" rule), for 5 KPIs × 2 periods × up to 22 nodes each, without manually re-adding numbers after every edit.
② Wrote `distributeInt()` (largest-remainder / Hare-quota rounding) in `data.ts`: every branch only carries a relative integer `weight` among its siblings, and the exact dollar/hour split is computed top-down from each level's already-exact parent value — so reconciliation is a structural guarantee of the algorithm, not a fact I had to hand-verify.
③ The brief requires exact reconciliation but says nothing about how to produce the numbers; hand-authoring ~110 leaf dollar amounts across 10 tree variants and keeping every subtree sum consistent by eye was judged too error-prone, so the arithmetic was pushed into one small pure function instead.

**4. Two-line stacked row layout for the tree (no fixed pixel columns)**
① How to lay out "label / value / %-of-parent / bar" per node so it never overflows at 390px once nesting (up to two levels of `ml-4 pl-2` indentation) and a long "N% of <parent label>" string are both present.
② Each row is two flex lines — line 1: chevron + truncating label + value; line 2 (indented under the label): a flexible `ContributionBar` + a short "N% of parent" string — instead of the fixed-width `w-24`/`w-28` columns I first tried, which did the arithmetic out to an overflow risk at mobile width once indentation was added.
③ The brief has a hard 390px-no-overflow gate and explicitly bans `min-w` tricks on `td`/`th` for this exact failure mode in tables; the tree isn't a table, but the same fixed-column trap applies to flex rows, so I measured the worst case (chevron + value + indentation + bar + percent text) against the real available width and redesigned around flexible, shrinkable tracks instead of fixed ones.

**5. An explicit `aria-label` sentence on every tree toggle, in addition to the always-visible text**
① The brief's own example satisfies the requirement with "a text node OR an aria-label"; I had to decide which, or whether to do both.
② Every toggle button's accessible name is a single explicit `aria-label` ("{label}: {value}, {percent} percent of {parent}") that always starts with the node's own visible label text (so it still satisfies WCAG's "label in name" even though `aria-label` technically overrides the DOM text content for the accessible-name computation) — rather than letting a screen reader stitch together several separately-styled spans inside the button.
③ Several adjacent `<span>`s with different Tailwind classes but no explicit `aria-label` would still technically read out value and percent, but relying on DOM-text concatenation (whitespace handling, punctuation between spans) is brittle and harder to self-audit; one deliberately-composed sentence is unambiguous and easy to verify against the brief's "value and percentage, not just the node name" wording.

**6. Default-expanded tree, not default-collapsed**
① The brief leaves initial expand/collapse state to the candidate.
② `DecompositionTree` initializes `expanded` to the full set of every internal node id (via `collectInternalIds`), so all ~22–31 nodes of the selected KPI's tree are visible on first render, not just the root's immediate children.
③ The directive on this chart type is "key values must be ALWAYS-VISIBLE... non-negotiable," and a dominant visualization that starts mostly collapsed would show almost nothing on first paint; starting fully open also means the default render (the one the automated gate actually scans) already exercises the deepest, most contrast-risky rows, rather than hiding that audit surface behind a toggle.

**7. Two different percent semantics, named explicitly rather than left ambiguous**
① The tree's "% of parent" (relative to the immediate parent) and the leaf table's "% of total" (relative to the grand root) are different numbers for the same node; I had to decide whether to pick one or expose both, and how to label them so they aren't mistaken for each other.
② Tree rows always say "N% of parent"; the leaf table's column header says "% of total" and its caption spells out "ranked by share of the total." `flattenLeaves()` in `data.ts` computes `percentOfTotal` independently of the tree's own `percentOfParent`.
③ A root-cause explainer is only useful if a user can both drill contextually (this reason is a big chunk of its *segment*) and rank globally (this reason is a big chunk of *everything*); collapsing both into one "%" would silently answer only one of those questions depending on which level you're looking at, so I kept them as two distinctly-labeled numbers instead.

**8. Rail → tree independence enforced by remount, not by a shared reset effect**
① The spec requires the rail selection to do "exactly one thing" and never reach into the tree's own expand state beyond the initial swap; I had to pick a concrete mechanism that can't quietly regress into a second coupling path later.
② `DetailPane` passes `key={kpi.id}` to `<DecompositionTree>`, so switching KPIs remounts a fresh tree component (with its own fresh `useState`) rather than passing a `selectedKpiId` prop into the tree and having an internal `useEffect` reset expand state in response to it. The leaf table, by contrast, is *not* remounted or keyed by KPI — its sort/filter state deliberately survives a rail switch, to make the two mechanisms visibly different.
③ An effect that watches `selectedKpiId` and resets tree state is exactly the "one selection id re-threaded through a consumer" pattern the brief ranks as weak; `key`-based remount gets the same visible behavior (new KPI ⇒ fresh tree) with no shared variable for rail and tree to both depend on, which is easier to verify stays decoupled as the component grows.
