"use client";

import { ChevronRight, ChevronsDownUp, ChevronsUpDown, Flame } from "lucide-react";
import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { ALL_NODES, ANCESTOR_IDS, ANOMALY_THRESHOLD_PCT, COST_TREE, LEVEL_ICON, type TreeNode, formatPct1, formatUsd } from "./data";
import { BORDER, FOCUS, HOVER_ROW, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { ContributionBar, DeltaChip } from "./ui";

export type CompareMode = "prior" | "budget";

// Regions start open (their services are the first thing worth comparing at a glance); service,
// resource-type and SKU levels start collapsed so the first paint is ~20 rows, not the full ~130.
const DEFAULT_EXPANDED = new Set(ALL_NODES.filter((n) => n.depth === 0 && n.children).map((n) => n.id));
const ALL_EXPANDABLE = ALL_NODES.filter((n) => n.children).map((n) => n.id);

function flattenVisible(nodes: TreeNode[], expanded: Set<string>): TreeNode[] {
  const out: TreeNode[] = [];
  for (const n of nodes) {
    out.push(n);
    if (n.children && expanded.has(n.id)) out.push(...flattenVisible(n.children, expanded));
  }
  return out;
}

function deltaFor(node: TreeNode, mode: CompareMode): number | undefined {
  return mode === "prior" ? node.deltaPriorPct : node.budgetDeltaPct;
}

interface RowProps {
  node: TreeNode;
  expanded: Set<string>;
  selectedId: string;
  tabbableId: string;
  compareMode: CompareMode;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
  onFocusRow: (id: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>, node: TreeNode) => void;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
}

/**
 * A single tree row, hoisted OUTSIDE DecompTree as a stable top-level component. Defining this
 * inline inside DecompTree's render (a real early draft of this file did exactly that) would give
 * React a brand-new component identity on every state change — expanding one node would remount the
 * entire visible tree and silently drop keyboard focus off the row the user was just on. Keeping it
 * a stable, module-level component instead lets React reconcile by `key` and preserve real DOM focus
 * across expand/collapse and selection changes.
 */
function TreeRow({ node, expanded, selectedId, tabbableId, compareMode, registerRef, onFocusRow, onKeyDown, onSelect, onToggle }: RowProps) {
  const hasChildren = !!node.children;
  const isOpen = hasChildren && expanded.has(node.id);
  const isSelected = node.id === selectedId;
  const Icon = LEVEL_ICON[node.level];
  const delta = deltaFor(node, compareMode);
  const isAnomaly = node.deltaPriorPct >= ANOMALY_THRESHOLD_PCT;
  const compareLabel = compareMode === "prior" ? "prior period" : "budget";
  const a11yLabel = [
    `${node.label}, ${node.level}`,
    `${formatUsd(node.value)}`,
    `${formatPct1(node.pctOfParent)} of parent`,
    delta !== undefined ? `${formatPct1(delta)} vs ${compareLabel}` : `no ${compareLabel} data at this level`,
    isAnomaly ? "flagged as an anomaly" : "",
  ]
    .filter(Boolean)
    .join(". ");

  return (
    <div
      role="treeitem"
      aria-level={node.depth + 1}
      aria-expanded={hasChildren ? isOpen : undefined}
      aria-selected={isSelected}
      aria-label={a11yLabel}
      tabIndex={node.id === tabbableId ? 0 : -1}
      ref={(el) => registerRef(node.id, el)}
      onFocus={() => onFocusRow(node.id)}
      onKeyDown={(e) => onKeyDown(e, node)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
      className={cx("cursor-pointer rounded-lg", TRANSITION, FOCUS, isSelected ? "bg-blue-50" : HOVER_ROW)}
    >
      <div className="flex min-h-11 items-center gap-2 pr-2">
        {hasChildren ? (
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.id);
            }}
            className={cx("grid h-6 w-6 shrink-0 place-items-center rounded-md", TEXT_AUX, "hover:bg-zinc-200/70")}
          >
            <ChevronRight size={14} className={cx("transition-transform duration-150 motion-reduce:transition-none", isOpen && "rotate-90")} />
          </button>
        ) : (
          <span aria-hidden="true" className="h-6 w-6 shrink-0" />
        )}

        <Icon size={14} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />

        <span className={cx("min-w-0 flex-1 truncate text-sm", isSelected ? "font-semibold" : "font-medium", TEXT_PRIMARY)}>{node.label}</span>

        {isAnomaly ? (
          <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full border border-rose-200 bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-700">
            <Flame size={10} aria-hidden="true" />
            <span className="hidden sm:inline">Anomaly</span>
          </span>
        ) : null}

        <ContributionBar pct={node.pctOfParent} className="hidden w-16 shrink-0 md:block" />

        <span className={cx("w-[4.5rem] shrink-0 whitespace-nowrap text-right text-sm font-semibold tabular-nums", TEXT_PRIMARY)}>{formatUsd(node.value)}</span>

        <span className={cx("w-14 shrink-0 whitespace-nowrap text-right text-xs tabular-nums", TEXT_AUX)}>{formatPct1(node.pctOfParent)}</span>

        <span className="hidden w-[4.75rem] shrink-0 justify-end sm:flex">
          {delta !== undefined ? <DeltaChip pct={delta} /> : <span className={cx("text-[11px]", TEXT_AUX)}>&mdash;</span>}
        </span>
      </div>

      {hasChildren && isOpen ? (
        <div role="group" className="ml-[22px] border-l border-zinc-200 pb-0.5 pl-[14px]">
          {node.children!.map((c) => (
            <TreeRow
              key={c.id}
              node={c}
              expanded={expanded}
              selectedId={selectedId}
              tabbableId={tabbableId}
              compareMode={compareMode}
              registerRef={registerRef}
              onFocusRow={onFocusRow}
              onKeyDown={onKeyDown}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

/**
 * The decomposition tree — the page's dominant, page-defining visualization.
 *
 * State that lives ONLY here: `expanded` (which nodes are drilled open) and `tabbableId` (roving
 * tabindex for keyboard nav). `selectedId` is lifted to FathomClient because exactly one sibling
 * widget (NodeDetailPanel) needs to react to it — see the comment on that prop below and the one in
 * TopMovers.tsx, which deliberately does NOT receive or react to this selection.
 */
export default function DecompTree({
  selectedId,
  onSelect,
  compareMode,
  focusToken,
}: {
  selectedId: string;
  // The ONLY consumer of a selection change is NodeDetailPanel, one level up in FathomClient. No
  // other widget on this page reads `selectedId` — TopMovers.tsx keeps its own separate row-expand
  // and sort state and never receives this prop at all.
  onSelect: (id: string) => void;
  compareMode: CompareMode;
  // Bumped by CommandPalette when a search result is chosen, so the tree can expand the result's
  // ancestor path and move real DOM focus to it even though the row wasn't clicked directly.
  focusToken: number;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(DEFAULT_EXPANDED));
  const [tabbableId, setTabbableId] = useState<string>(selectedId);
  const [pendingFocusId, setPendingFocusId] = useState<string | null>(null);
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const visible = useMemo(() => flattenVisible(COST_TREE, expanded), [expanded]);
  const visibleIndex = useMemo(() => new Map(visible.map((n, i) => [n.id, i])), [visible]);
  const isFullyExpanded = ALL_EXPANDABLE.every((id) => expanded.has(id));

  // React-recommended "adjusting state when a prop changes" pattern (a conditional setState call
  // during render, comparing against the previous render's value) in place of a setState-in-effect:
  // this reacts to `focusToken` being bumped from outside (the command palette) to auto-expand the
  // newly selected node's ancestors and queue it for a real DOM focus move, without the extra
  // render-then-effect-then-render cascade a useEffect would cause.
  const [prevFocusToken, setPrevFocusToken] = useState(focusToken);
  if (focusToken !== prevFocusToken) {
    setPrevFocusToken(focusToken);
    if (focusToken !== 0) {
      setExpanded((prev) => {
        const next = new Set(prev);
        for (const a of ANCESTOR_IDS.get(selectedId) ?? []) next.add(a);
        return next;
      });
      setPendingFocusId(selectedId);
    }
  }

  useEffect(() => {
    if (!pendingFocusId) return;
    const el = rowRefs.current.get(pendingFocusId);
    if (el) {
      el.focus();
      setPendingFocusId(null);
    }
  }, [pendingFocusId, visible]);

  function registerRef(id: string, el: HTMLDivElement | null) {
    if (el) rowRefs.current.set(id, el);
    else rowRefs.current.delete(id);
  }

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setExpanded(isFullyExpanded ? new Set(DEFAULT_EXPANDED) : new Set(ALL_EXPANDABLE));
  }

  function focusNodeAt(index: number) {
    const target = visible[index];
    if (!target) return;
    rowRefs.current.get(target.id)?.focus();
  }

  function focusNodeById(id: string) {
    rowRefs.current.get(id)?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>, node: TreeNode) {
    e.stopPropagation(); // a nested treeitem is a DOM descendant of every ancestor treeitem
    const idx = visibleIndex.get(node.id) ?? -1;
    const hasChildren = !!node.children;
    const isOpen = hasChildren && expanded.has(node.id);
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        focusNodeAt(idx + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        focusNodeAt(idx - 1);
        break;
      case "ArrowRight":
        e.preventDefault();
        if (hasChildren && !isOpen) toggleExpand(node.id);
        else if (hasChildren && isOpen) focusNodeAt(idx + 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (isOpen) toggleExpand(node.id);
        else if (node.parentId) focusNodeById(node.parentId);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        onSelect(node.id);
        if (hasChildren) toggleExpand(node.id);
        break;
      case "Home":
        e.preventDefault();
        focusNodeAt(0);
        break;
      case "End":
        e.preventDefault();
        focusNodeAt(visible.length - 1);
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <div className={cx("mb-2 flex items-center justify-between gap-3 border-b pb-2", BORDER)}>
        <ol className="flex min-w-0 items-center gap-1 overflow-hidden text-[11px] font-medium">
          {(["Region", "Service", "Resource type", "SKU"] as const).map((lvl, i) => (
            <li key={lvl} className="flex shrink-0 items-center gap-1">
              {i > 0 ? <ChevronRight size={11} aria-hidden="true" className="text-zinc-300" /> : null}
              <span className="rounded px-1 py-0.5 text-zinc-500">{lvl}</span>
            </li>
          ))}
        </ol>
        <button
          type="button"
          onClick={toggleAll}
          className={cx("inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium", BORDER, TEXT_AUX, "hover:bg-zinc-100", TRANSITION, FOCUS)}
        >
          {isFullyExpanded ? <ChevronsDownUp size={13} aria-hidden="true" /> : <ChevronsUpDown size={13} aria-hidden="true" />}
          {isFullyExpanded ? "Collapse to services" : "Expand all"}
        </button>
      </div>

      <div role="tree" aria-label="Cloud spend decomposition, from region down to SKU" className="flex flex-col gap-0.5">
        {COST_TREE.map((n) => (
          <TreeRow
            key={n.id}
            node={n}
            expanded={expanded}
            selectedId={selectedId}
            tabbableId={tabbableId}
            compareMode={compareMode}
            registerRef={registerRef}
            onFocusRow={setTabbableId}
            onKeyDown={handleKeyDown}
            onSelect={onSelect}
            onToggle={toggleExpand}
          />
        ))}
      </div>
    </div>
  );
}
