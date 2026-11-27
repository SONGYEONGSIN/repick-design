"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import { LEVEL_ICON, MOVER_IDS, MOVER_NOTES, REGISTRY, pathLabels, formatPct1, formatUsd } from "./data";
import { BORDER, FOCUS, LEVEL_BADGE, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Card, CardHead, DeltaChip } from "./ui";

type SortKey = "value" | "delta";
type SortDir = "asc" | "desc";

const MOVERS = MOVER_IDS.map((id) => REGISTRY.get(id)!).filter(Boolean);

/** Hoisted to module scope (not defined inside TopMovers) so its identity is stable across
 * re-renders — a nested component definition would remount the button, and its own real DOM node,
 * on every sort click, dropping keyboard focus right after the very keypress that triggered it. */
function SortButton({ label, k, sortKey, sortDir, onSort }: { label: string; k: SortKey; sortKey: SortKey; sortDir: SortDir; onSort: (k: SortKey) => void }) {
  const active = sortKey === k;
  const Icon = active ? (sortDir === "desc" ? ArrowDown : ArrowUp) : ArrowUpDown;
  return (
    <button
      type="button"
      onClick={() => onSort(k)}
      className={cx("inline-flex h-8 items-center gap-1 rounded-md px-1.5 text-[11px] font-medium uppercase tracking-[0.04em]", active ? TEXT_PRIMARY : TEXT_AUX, "hover:bg-zinc-100", TRANSITION, FOCUS)}
    >
      {label}
      <Icon size={11} aria-hidden="true" />
    </button>
  );
}

/**
 * Top Movers — a SECOND, independently-scoped dominant widget. It reads its rows straight from the
 * same node registry the tree uses (so the dollar figures can never disagree with it), but its sort
 * state and its "why did this move" row-expansion state live ONLY in this component. It does not
 * accept `selectedId` as a prop, does not call `onSelect`, and clicking a tree node never changes
 * anything here — this is the deliberate alternative to threading one selection id through every
 * widget on the page.
 */
export default function TopMovers() {
  const [sortKey, setSortKey] = useState<SortKey>("delta");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expandedRowId, setExpandedRowId] = useState<string | null>(MOVER_IDS[0] ?? null);

  const rows = useMemo(() => {
    const sorted = [...MOVERS].sort((a, b) => {
      const av = sortKey === "value" ? a.value : a.deltaPriorPct;
      const bv = sortKey === "value" ? b.value : b.deltaPriorPct;
      return sortDir === "desc" ? bv - av : av - bv;
    });
    return sorted;
  }, [sortKey, sortDir]);

  function onSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function sortAria(key: SortKey): "ascending" | "descending" | "none" {
    if (key !== sortKey) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  }

  return (
    <Card>
      <CardHead
        title="Top movers"
        hint="A standalone leaderboard, sorted on its own — picking a tree node above never changes this list, and sorting here never changes the tree."
      />

      <div className="mt-3 -mx-1">
        <table className="w-full table-fixed border-collapse">
          <caption className="sr-only">Line items across the cost tree with the largest dollar value or period-over-period change, sortable by value or by change</caption>
          <colgroup>
            <col style={{ width: "52%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "26%" }} />
          </colgroup>
          <thead>
            <tr className={cx("border-b text-left", BORDER)}>
              <th scope="col" className="px-1 py-2">
                <span className={cx("text-[11px] font-medium uppercase tracking-[0.04em]", TEXT_AUX)}>Line item</span>
              </th>
              <th scope="col" aria-sort={sortAria("value")} className="px-1 py-2 text-right">
                <SortButton label="Value" k="value" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
              </th>
              <th scope="col" aria-sort={sortAria("delta")} className="px-1 py-2 text-right">
                <SortButton label="Δ prior" k="delta" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((node) => {
              const Icon = LEVEL_ICON[node.level];
              const path = pathLabels(node.id);
              const context = path.slice(0, -1).join(" › ") || "Top level";
              const isExpanded = expandedRowId === node.id;
              const note = MOVER_NOTES[node.id];
              return (
                <Fragment key={node.id}>
                  <tr className="align-top">
                    <td className="px-1 py-2.5">
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        onClick={() => setExpandedRowId((cur) => (cur === node.id ? null : node.id))}
                        className={cx("flex w-full items-start gap-2 rounded-md px-1 py-1 text-left", "hover:bg-zinc-50", TRANSITION, FOCUS)}
                      >
                        <ChevronDown size={13} aria-hidden="true" className={cx("mt-1 shrink-0 transition-transform duration-150 motion-reduce:transition-none", TEXT_AUX, isExpanded && "rotate-180")} />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-1.5">
                            <Icon size={12} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
                            <span className={cx("truncate text-sm font-medium", TEXT_PRIMARY)}>{node.label}</span>
                            <span className={cx("hidden shrink-0 rounded-full border px-1.5 py-0 text-[10px] font-medium leading-[16px] sm:inline-flex", LEVEL_BADGE[node.level])}>{node.level}</span>
                          </span>
                          <span className={cx("mt-0.5 block truncate text-xs", TEXT_AUX)}>{context}</span>
                        </span>
                      </button>
                    </td>
                    <td className={cx("whitespace-nowrap px-1 py-2.5 text-right text-sm font-semibold tabular-nums", TEXT_PRIMARY)}>{formatUsd(node.value)}</td>
                    <td className="whitespace-nowrap px-1 py-2.5 text-right">
                      <DeltaChip pct={node.deltaPriorPct} />
                    </td>
                  </tr>
                  {isExpanded ? (
                    <tr>
                      <td colSpan={3} className="px-1 pb-3">
                        <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5">
                          <p className={cx("text-xs leading-relaxed", TEXT_PRIMARY)}>{note ?? "No further detail recorded for this line item."}</p>
                          <p className={cx("mt-1.5 text-[11px]", TEXT_AUX)}>{`${formatPct1(node.pctOfParent)} of its parent · ${formatPct1(node.pctOfTotal)} of total cloud spend`}</p>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
