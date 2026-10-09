"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, Cpu, Database, HardDrive, MapPin, Target, type LucideIcon } from "lucide-react";
import { type CostNode, formatCurrency, formatPercent } from "./cost-data";

type SortMode = "value" | "name";

function sortNodes(nodes: CostNode[], mode: SortMode): CostNode[] {
  const copy = nodes.slice();
  if (mode === "name") {
    copy.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    copy.sort((a, b) => b.value - a.value);
  }
  return copy;
}

function iconFor(node: CostNode, depth: number): LucideIcon | null {
  if (depth === 0) return Target;
  if (depth === 1) return MapPin;
  if (node.name === "Compute") return Cpu;
  if (node.name === "Database") return Database;
  if (node.name === "Storage") return HardDrive;
  return null;
}

function highlightMatch(name: string, query: string) {
  const q = query.trim();
  if (!q) return name;
  const idx = name.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return name;
  return (
    <>
      {name.slice(0, idx)}
      <mark className="rounded-sm bg-orange-100 px-0.5 font-medium text-orange-900">
        {name.slice(idx, idx + q.length)}
      </mark>
      {name.slice(idx + q.length)}
    </>
  );
}

interface TreeRowProps {
  node: CostNode;
  ancestors: CostNode[];
  depth: number;
  parentValue: number;
  totalValue: number;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onFocusNode: (chain: CostNode[]) => void;
  sortMode: SortMode;
  searchQuery: string;
  currentFocusId: string;
}

function TreeRow({
  node,
  ancestors,
  depth,
  parentValue,
  totalValue,
  expandedIds,
  onToggleExpand,
  onFocusNode,
  sortMode,
  searchQuery,
  currentFocusId,
}: TreeRowProps) {
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const isExpanded = expandedIds.has(node.id);
  const shareOfParent = parentValue > 0 ? (node.value / parentValue) * 100 : 100;
  const shareOfTotal = (node.value / totalValue) * 100;
  const Icon = iconFor(node, depth);
  const isCurrent = node.id === currentFocusId;
  const query = searchQuery.trim().toLowerCase();
  const isDimmed = query.length > 0 && !node.name.toLowerCase().includes(query);

  return (
    <li className="relative min-w-0">
      <div
        className={`flex min-w-0 items-center gap-1.5 rounded-md py-1.5 pr-2 ${isCurrent ? "bg-orange-50" : ""}`}
        style={{ paddingLeft: depth * 18 }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => onToggleExpand(node.id)}
            aria-expanded={isExpanded}
            aria-label={`${isExpanded ? "Collapse" : "Expand"} ${node.name}`}
            className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-zinc-600 outline-offset-2 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-orange-600"
          >
            {isExpanded ? <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" /> : <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
          </button>
        ) : (
          <span className="block h-5 w-5 flex-shrink-0" aria-hidden="true" />
        )}

        <button
          type="button"
          onClick={() => onFocusNode([...ancestors, node])}
          className={`flex min-w-0 flex-1 items-center gap-1.5 truncate rounded px-1 py-0.5 text-left outline-offset-2 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-orange-600 ${isDimmed ? "text-zinc-600" : "text-zinc-900"}`}
          title={`Focus the sunburst on ${node.name}`}
        >
          {Icon ? <Icon className="h-3.5 w-3.5 flex-shrink-0 text-zinc-600" aria-hidden="true" /> : null}
          <span className={`truncate text-sm ${isCurrent ? "font-bold" : "font-medium"}`}>
            {highlightMatch(node.name, searchQuery)}
          </span>
        </button>

        <span className="flex-shrink-0 whitespace-nowrap text-right text-sm font-normal tabular-nums text-zinc-600">
          {formatCurrency(node.value)}
        </span>
        <span className="flex-shrink-0 whitespace-nowrap text-right text-xs font-normal tabular-nums text-zinc-600" style={{ width: 52 }}>
          {formatPercent(shareOfParent)}
        </span>
      </div>

      {hasChildren && isExpanded && (
        <ul>
          {sortNodes(node.children ?? [], sortMode).map((child) => (
            <TreeRow
              key={child.id}
              node={child}
              ancestors={[...ancestors, node]}
              depth={depth + 1}
              parentValue={node.value}
              totalValue={totalValue}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              onFocusNode={onFocusNode}
              sortMode={sortMode}
              searchQuery={searchQuery}
              currentFocusId={currentFocusId}
            />
          ))}
        </ul>
      )}
      {!hasChildren && (
        <span className="sr-only font-normal">{formatPercent(shareOfTotal)} of total spend</span>
      )}
    </li>
  );
}

export interface HierarchyTreeProps {
  root: CostNode;
  defaultExpandedIds: string[];
  onFocusNode: (chain: CostNode[]) => void;
  currentFocusId: string;
  searchQuery: string;
  extraExpandedIds: Set<string>;
  sortMode: SortMode;
  onSortModeChange: (mode: SortMode) => void;
}

export default function HierarchyTree({
  root,
  defaultExpandedIds,
  onFocusNode,
  currentFocusId,
  searchQuery,
  extraExpandedIds,
  sortMode,
  onSortModeChange,
}: HierarchyTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(defaultExpandedIds));

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const mergedExpanded = new Set<string>([...expandedIds, ...extraExpandedIds]);

  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-zinc-900">Full hierarchy</h2>
        <div className="flex items-center gap-1 rounded-md border border-zinc-200 bg-white p-0.5" role="group" aria-label="Sort hierarchy by">
          <button
            type="button"
            onClick={() => onSortModeChange("value")}
            aria-pressed={sortMode === "value"}
            className={`rounded px-2 py-1 text-xs outline-offset-2 focus-visible:outline-2 focus-visible:outline-orange-600 ${sortMode === "value" ? "bg-zinc-900 font-medium text-white" : "font-normal text-zinc-600 hover:bg-zinc-100"}`}
          >
            Value
          </button>
          <button
            type="button"
            onClick={() => onSortModeChange("name")}
            aria-pressed={sortMode === "name"}
            className={`rounded px-2 py-1 text-xs outline-offset-2 focus-visible:outline-2 focus-visible:outline-orange-600 ${sortMode === "name" ? "bg-zinc-900 font-medium text-white" : "font-normal text-zinc-600 hover:bg-zinc-100"}`}
          >
            Name
          </button>
        </div>
      </div>
      <ul className="max-h-[420px] overflow-y-auto pr-1">
        <TreeRow
          node={root}
          ancestors={[]}
          depth={0}
          parentValue={root.value}
          totalValue={root.value}
          expandedIds={mergedExpanded}
          onToggleExpand={toggleExpand}
          onFocusNode={onFocusNode}
          sortMode={sortMode}
          searchQuery={searchQuery}
          currentFocusId={currentFocusId}
        />
      </ul>
    </div>
  );
}
