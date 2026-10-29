"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, ChevronRight } from "lucide-react";
import type { KpiDefinition, VarianceNode } from "./data";
import { type FlatRow, breadcrumbFor, findNode, flattenTree, formatMoneyK } from "./utils";

interface SharedNodeProps {
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  activeId: string;
  onPin: (id: string) => void;
  onHover: (id: string | null) => void;
  onFocusNode: (id: string | null) => void;
}

interface TreeNodeProps extends SharedNodeProps {
  node: VarianceNode;
  parentLabel: string;
}

/**
 * One decomposition-tree node. This is a RECURSIVE component (it renders
 * itself for every child), so the accessible-name rule below applies at
 * every depth at once.
 *
 * Accessible-name rule (do not change without re-reading this comment):
 * the button carries NO `aria-label`. Its accessible name is computed by
 * the browser directly from its visible text content — label, signed value,
 * and "<pct>% of <real parent label>". Because the visible text already
 * names the real parent (never the literal word "parent"), the accessible
 * name and the visible label can never diverge. This is what the brief
 * calls approach (b), and it is the only approach used anywhere in this file.
 */
function TreeNode({
  node,
  parentLabel,
  expandedIds,
  onToggleExpand,
  activeId,
  onPin,
  onHover,
  onFocusNode,
}: TreeNodeProps) {
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const isExpanded = hasChildren && expandedIds.has(node.id);
  const isActive = node.id === activeId;
  const pct = node.pctOfParent ?? 0;

  return (
    <li className="relative">
      <button
        type="button"
        aria-expanded={hasChildren ? isExpanded : undefined}
        onClick={() => {
          onPin(node.id);
          if (hasChildren) onToggleExpand(node.id);
        }}
        onMouseEnter={() => onHover(node.id)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onFocusNode(node.id)}
        onBlur={() => onFocusNode(null)}
        className={`flex w-full flex-wrap items-center gap-x-2 gap-y-0.5 rounded-lg border px-3 py-2 text-left motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 ${
          isActive ? "border-emerald-400/40 bg-emerald-400/10" : "border-white/10 bg-zinc-900 hover:bg-white/5"
        }`}
      >
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400 motion-safe:transition-transform" aria-hidden="true" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400 motion-safe:transition-transform" aria-hidden="true" />
          )
        ) : (
          <span aria-hidden="true" className="ml-1 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
        )}
        <span className="font-medium text-sm text-zinc-50">{node.label}</span>
        <span className="font-medium text-sm tabular-nums text-rose-400">{formatMoneyK(node.value)}</span>
        <span className="font-normal text-sm tabular-nums text-zinc-400">
          {pct}% of {parentLabel}
        </span>
      </button>
      {hasChildren && isExpanded && node.children ? (
        <ul className="ml-4 mt-1.5 space-y-1.5 border-l border-white/10 pl-4">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              parentLabel={node.label}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              activeId={activeId}
              onPin={onPin}
              onHover={onHover}
              onFocusNode={onFocusNode}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

type SortKey = "label" | "value" | "pctOfParent" | "depth";

const SORT_COLUMNS: { key: SortKey; heading: string }[] = [
  { key: "label", heading: "Driver" },
  { key: "value", heading: "Value" },
  { key: "pctOfParent", heading: "% of Parent" },
  { key: "depth", heading: "Level" },
];

function FallbackTable({ rows, kpiLabel }: { rows: FlatRow[]; kpiLabel: string }) {
  const [sortKey, setSortKey] = useState<SortKey>("depth");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function ariaSortFor(key: SortKey): "ascending" | "descending" | "none" {
    if (key !== sortKey) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  }

  const sortedRows = [...rows].sort((a, b) => {
    let result = 0;
    if (sortKey === "label") {
      result = a.label.localeCompare(b.label);
    } else {
      const av = sortKey === "pctOfParent" ? a.pctOfParent ?? -1 : sortKey === "value" ? a.value : a.depth;
      const bv = sortKey === "pctOfParent" ? b.pctOfParent ?? -1 : sortKey === "value" ? b.value : b.depth;
      result = av - bv;
    }
    return sortDir === "asc" ? result : -result;
  });

  return (
    <section aria-labelledby="drivers-table-heading" className="mt-6">
      <h3 id="drivers-table-heading" className="font-semibold text-sm text-zinc-50">
        All Variance Drivers
      </h3>
      <p className="mt-1 font-normal text-sm text-zinc-400">
        Every node in the {kpiLabel} decomposition in one sortable, screen-reader-friendly table, independent of
        which branches are expanded above.
      </p>
      <div className="mt-3 overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full min-w-[560px] table-fixed border-collapse text-sm">
          <caption className="px-3 py-2 text-left font-normal text-xs text-zinc-400">
            Variance drivers for {kpiLabel}: driver name, signed value, percent of its parent, and tree level.
          </caption>
          <colgroup>
            <col style={{ width: "40%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>
          <thead>
            <tr className="border-y border-white/10 bg-white/5">
              {SORT_COLUMNS.map((column) => (
                <th key={column.key} scope="col" aria-sort={ariaSortFor(column.key)} className="p-0">
                  <button
                    type="button"
                    onClick={() => handleSort(column.key)}
                    className="flex h-9 w-full items-center gap-1 px-3 font-medium text-xs text-zinc-400 hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
                  >
                    <span>{column.heading}</span>
                    {sortKey === column.key ? (
                      sortDir === "asc" ? (
                        <ArrowUp className="h-3 w-3" aria-hidden="true" />
                      ) : (
                        <ArrowDown className="h-3 w-3" aria-hidden="true" />
                      )
                    ) : (
                      <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => (
              <tr key={row.id} className="border-b border-white/5 last:border-0">
                <td className="px-3 py-2 font-normal text-zinc-50">{row.label}</td>
                <td className="whitespace-nowrap px-3 py-2 text-right font-normal tabular-nums text-zinc-50">
                  {formatMoneyK(row.value)}
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-right font-normal tabular-nums text-zinc-400">
                  {row.pctOfParent !== null ? `${row.pctOfParent}%` : "—"}
                </td>
                <td className="whitespace-nowrap px-3 py-2 font-normal text-zinc-400">
                  {row.depth === 0 ? "Root" : `Level ${row.depth}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

interface DecompositionTreeProps {
  kpi: KpiDefinition;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  pinnedId: string;
  onPin: (id: string) => void;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  focusedId: string | null;
  onFocusNode: (id: string | null) => void;
}

export default function DecompositionTree({
  kpi,
  expandedIds,
  onToggleExpand,
  onExpandAll,
  onCollapseAll,
  pinnedId,
  onPin,
  hoveredId,
  onHover,
  focusedId,
  onFocusNode,
}: DecompositionTreeProps) {
  const activeId = hoveredId ?? focusedId ?? pinnedId;
  const activeNode = findNode(kpi.root, activeId) ?? kpi.root;
  const breadcrumb = breadcrumbFor(kpi.root, activeId);
  const parentOfActive = breadcrumb.length >= 2 ? breadcrumb[breadcrumb.length - 2] : null;
  const rows = flattenTree(kpi.root);

  return (
    <div className="rounded-xl border border-white/10 bg-zinc-950 p-4 sm:p-6" aria-labelledby="tree-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="tree-heading" className="font-semibold text-lg text-zinc-50">
          Decomposition Tree
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExpandAll}
            className="h-9 rounded-md border border-white/10 px-3 font-medium text-xs text-zinc-400 hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
          >
            Expand all
          </button>
          <button
            type="button"
            onClick={onCollapseAll}
            className="h-9 rounded-md border border-white/10 px-3 font-medium text-xs text-zinc-400 hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
          >
            Collapse all
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-emerald-400/30 bg-emerald-400/5 p-4">
        <p className="font-normal text-xs uppercase tracking-wide text-zinc-400">{kpi.category} &middot; root of tree</p>
        <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-semibold text-base text-zinc-50">{kpi.root.label}</span>
          <span className="font-semibold text-xl tabular-nums text-rose-400">{formatMoneyK(kpi.root.value)}</span>
        </div>
        <p className="mt-1 font-normal text-sm text-zinc-400">{kpi.periodLabel} &mdash; full variance explained below.</p>
      </div>

      <ul className="mt-3 space-y-1.5">
        {(kpi.root.children ?? []).map((child) => (
          <TreeNode
            key={child.id}
            node={child}
            parentLabel={kpi.root.label}
            expandedIds={expandedIds}
            onToggleExpand={onToggleExpand}
            activeId={activeId}
            onPin={onPin}
            onHover={onHover}
            onFocusNode={onFocusNode}
          />
        ))}
      </ul>

      <section aria-labelledby="inspector-heading" className="mt-5 rounded-lg border border-white/10 bg-zinc-900 p-4">
        <h3 id="inspector-heading" className="font-semibold text-sm text-zinc-50">
          Node Inspector
        </h3>
        <p className="mt-1 truncate font-normal text-xs text-zinc-400">
          {breadcrumb.map((n) => n.label).join(" › ")}
        </p>
        <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-medium text-sm text-zinc-50">{activeNode.label}</span>
          <span className="font-semibold text-lg tabular-nums text-zinc-50">{formatMoneyK(activeNode.value)}</span>
        </div>
        {activeNode.pctOfParent !== null ? (
          <div className="mt-2">
            <div className="h-2 w-full rounded-full bg-white/10">
              <div
                className="h-2 rounded-full bg-emerald-400"
                style={{ width: `${activeNode.pctOfParent}%` }}
              />
            </div>
            <p className="mt-1 font-normal text-xs text-zinc-400">
              {activeNode.pctOfParent}% of {parentOfActive?.label ?? kpi.root.label}
            </p>
          </div>
        ) : (
          <p className="mt-2 font-normal text-xs text-zinc-400">
            Total {kpi.category.toLowerCase()} variance for the current period &mdash; this is the root of the tree.
          </p>
        )}
      </section>

      <FallbackTable rows={rows} kpiLabel={kpi.label} />
    </div>
  );
}
