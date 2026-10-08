"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { TreeNode, Unit } from "./data";
import { formatValue } from "./data";
import { ContributionBar } from "./ui";

function collectInternalIds(node: TreeNode, into: Set<string>) {
  if (node.children?.length) {
    into.add(node.id);
    for (const child of node.children) collectInternalIds(child, into);
  }
}

/**
 * Root-cause decomposition tree.
 *
 * Accessibility contract (mandatory for this chart type):
 * - Every branch with children is a real <button> carrying `aria-expanded`,
 *   so the expand/collapse state is announced by assistive tech the same
 *   way any native disclosure control is — no custom roving-tabindex
 *   treeview is needed, which keeps the keyboard path simple and robust.
 * - Each row's value and %-of-parent are rendered as plain visible text
 *   nodes inside that row (not a hover tooltip, not CSS-indentation-only),
 *   so they are both always-visible on screen and read by a screen reader
 *   as part of the toggle button's / row's accessible text.
 * - Hierarchy is conveyed structurally (nested <ul>/<li>, not only visual
 *   indentation) so a screen reader's list semantics ("list, 2 items")
 *   reinforce the parent/child relationship independent of indentation.
 */
export function DecompositionTree({
  root,
  unit,
  dimensionLabels,
}: {
  root: TreeNode;
  unit: Unit;
  dimensionLabels: readonly [string, string, string];
}) {
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const ids = new Set<string>();
    collectInternalIds(root, ids);
    return ids;
  });

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div>
      <p className="mb-2 px-2.5 text-xs text-zinc-500">
        Every branch always shows its value and its share of the parent above it. Press{" "}
        <span className="font-medium text-zinc-700">Enter</span> or{" "}
        <span className="font-medium text-zinc-700">Space</span> on a branch to expand or collapse it.
      </p>
      <ul className="flex flex-col gap-0.5">
        <li className="px-2.5 pb-0.5 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
          By {dimensionLabels[0].toLowerCase()}
        </li>
        {root.children?.map((node) => (
          <TreeRow
            key={node.id}
            node={node}
            parentLabel={root.label}
            unit={unit}
            dimensionLabels={dimensionLabels}
            expanded={expanded}
            onToggle={toggle}
          />
        ))}
      </ul>
    </div>
  );
}

function TreeRow({
  node,
  parentLabel,
  unit,
  dimensionLabels,
  expanded,
  onToggle,
}: {
  node: TreeNode;
  parentLabel: string;
  unit: Unit;
  dimensionLabels: readonly [string, string, string];
  expanded: Set<string>;
  onToggle: (id: string) => void;
}) {
  const hasChildren = Boolean(node.children?.length);
  const isExpanded = expanded.has(node.id);
  const percentDigits = node.percentOfParent.toLocaleString("en-US", { maximumFractionDigits: 1 });
  const childDimensionName = dimensionLabels[Math.min(node.depth, dimensionLabels.length - 1)];
  // Stated once, explicitly, as the element's accessible name — rather than relying on a
  // screen reader to stitch several visible text nodes back together — so the value and
  // %-of-parent are unambiguous even though the same information is also always visible
  // on screen (see the rowBody markup below) for sighted users.
  const accessibleLabel = `${node.label}: ${formatValue(node.value, unit)}, ${percentDigits} percent of ${parentLabel}`;

  const rowBody = (
    <>
      <div className="flex min-w-0 items-center gap-2">
        {hasChildren ? (
          <ChevronRight
            aria-hidden="true"
            className={`size-4 shrink-0 text-zinc-500 transition-transform motion-reduce:transition-none ${
              isExpanded ? "rotate-90" : ""
            }`}
          />
        ) : (
          <span aria-hidden="true" className="size-4 shrink-0" />
        )}
        <span className={`min-w-0 flex-1 truncate text-sm ${hasChildren ? "font-medium text-zinc-900" : "text-zinc-700"}`}>
          {node.label}
        </span>
        <span className="shrink-0 text-right text-sm font-semibold tabular-nums text-zinc-900">
          {formatValue(node.value, unit)}
        </span>
      </div>
      <div className="mt-1 flex items-center gap-2 pl-6">
        <ContributionBar percent={node.percentOfParent} tone={hasChildren ? "sky" : "zinc"} />
        <span className="shrink-0 whitespace-nowrap text-xs tabular-nums text-zinc-600">
          {percentDigits}% of parent
        </span>
      </div>
    </>
  );

  return (
    <li>
      {hasChildren ? (
        <button
          type="button"
          onClick={() => onToggle(node.id)}
          aria-expanded={isExpanded}
          aria-controls={`tree-group-${node.id}`}
          aria-label={accessibleLabel}
          className="flex w-full flex-col rounded-lg px-2.5 py-2 text-left hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
        >
          {rowBody}
        </button>
      ) : (
        <div role="group" aria-label={accessibleLabel} className="flex w-full flex-col rounded-lg px-2.5 py-2">
          {rowBody}
        </div>
      )}

      {hasChildren && isExpanded && (
        <ul id={`tree-group-${node.id}`} className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-zinc-200 pl-2">
          <li className="px-2.5 pb-0.5 pt-1 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            By {childDimensionName.toLowerCase()}
          </li>
          {node.children?.map((child) => (
            <TreeRow
              key={child.id}
              node={child}
              parentLabel={node.label}
              unit={unit}
              dimensionLabels={dimensionLabels}
              expanded={expanded}
              onToggle={onToggle}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
