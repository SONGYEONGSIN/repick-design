"use client";

/**
 * The mandatory accessible fallback for the Network Graph (A11y grade D per charts.catalog — never
 * shipped alone). This table carries the *complete* adjacency data — every node, every upstream
 * ("Calls") and downstream ("Called by") relationship, every health state and metric — so a
 * screen-reader user can rely on it entirely without ever seeing the graph canvas. Both this table
 * and topology-graph.tsx read the same CALLS_OUT/CALLED_BY structures derived from EDGES in data.ts,
 * so the two views can never disagree.
 *
 * Real sort (click a column header, toggles asc/desc, `aria-sort` kept in sync) and real filter
 * (status chips + text search) — both `'use client'` state, not decoration.
 */

import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { CALLED_BY, CALLS_OUT, NODES, TIER_LABEL, type NodeId } from "./data";
import { formatMs, formatPct } from "./format";
import { BORDER, DIVIDE, FOCUS_RING, FOCUS_RING_INSET, HEALTH_LABEL, HEALTH_ORDER, HEALTH_RANK, HOVER_ROW, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, type Health, cx } from "./tokens";
import { HealthBadge } from "./ui";

type SortKey = "name" | "health" | "callsOut" | "calledBy" | "p99" | "error";
type SortDir = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string; width: string; align?: "right" }[] = [
  { key: "name", label: "Service", width: "24%" },
  { key: "health", label: "Status", width: "12%" },
  { key: "callsOut", label: "Calls", width: "21%" },
  { key: "calledBy", label: "Called by", width: "21%" },
  { key: "p99", label: "P99", width: "11%", align: "right" },
  { key: "error", label: "Error rate", width: "11%", align: "right" },
];

export default function TopologyTable({ selectedId, onSelect }: { selectedId: NodeId | null; onSelect: (id: NodeId) => void }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Health | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("health");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const q = query.trim().toLowerCase();

  const rows = useMemo(() => {
    let list = NODES.filter((n) => statusFilter === "all" || n.health === statusFilter);
    if (q !== "") {
      list = list.filter((n) => n.label.toLowerCase().includes(q) || n.owner.toLowerCase().includes(q) || TIER_LABEL[n.tier].toLowerCase().includes(q));
    }
    const sorted = [...list].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = a.label.localeCompare(b.label);
          break;
        case "health":
          cmp = HEALTH_RANK[a.health] - HEALTH_RANK[b.health];
          break;
        case "callsOut":
          cmp = CALLS_OUT[a.id].length - CALLS_OUT[b.id].length;
          break;
        case "calledBy":
          cmp = CALLED_BY[a.id].length - CALLED_BY[b.id].length;
          break;
        case "p99":
          cmp = a.p99Ms - b.p99Ms;
          break;
        case "error":
          cmp = a.errorRatePct - b.errorRatePct;
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [statusFilter, q, sortKey, sortDir]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className={cx("flex h-9 w-full max-w-xs items-center gap-2 rounded-lg border px-2.5", BORDER, "bg-zinc-900/60", FOCUS_RING)}>
          <Search size={14} aria-hidden="true" className={TEXT_CAPTION} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by service, owner, tier…"
            aria-label="Filter services by name, owner, or tier"
            className={cx("h-full flex-1 bg-transparent text-xs outline-none", TEXT_PRIMARY, "placeholder:text-zinc-400")}
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by status">
          {(["all", ...HEALTH_ORDER] as const).map((s) => {
            const active = statusFilter === s;
            const label = s === "all" ? "All" : HEALTH_LABEL[s];
            return (
              <button
                key={s}
                type="button"
                aria-pressed={active}
                onClick={() => setStatusFilter(s)}
                className={cx(
                  "flex h-8 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium",
                  TRANSITION,
                  FOCUS_RING,
                  active ? cx("border-sky-500/40 bg-sky-500/10 text-sky-300") : cx("border-white/10 bg-transparent text-zinc-400 hover:bg-white/5"),
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
        <p className={cx("ml-auto text-xs", TEXT_CAPTION)}>
          {rows.length} of {NODES.length} services
        </p>
      </div>

      {/* `relative` is load-bearing: it gives the sr-only <caption> below a local containing block so
          it paints inside this clipping box instead of escaping to an unpositioned ancestor and
          inflating document.scrollWidth at narrow viewports (see tokens.ts contrast note + the
          sr-only/overflow-clipping delta family in dash-deltas-provisional.jsonl). */}
      <div className="relative overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[860px] border-collapse text-sm lg:min-w-0 lg:table-fixed">
          <caption className="sr-only">Full service dependency adjacency list — every service, its calls and dependents, health, P99 latency, and error rate.</caption>
          <colgroup>
            {COLUMNS.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER, "bg-zinc-900/60")}>
              {COLUMNS.map((c) => {
                const isSorted = sortKey === c.key;
                const ariaSort = isSorted ? (sortDir === "asc" ? "ascending" : "descending") : "none";
                const Icon = isSorted ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
                return (
                  <th key={c.key} scope="col" aria-sort={ariaSort} className="p-0">
                    <button
                      type="button"
                      onClick={() => toggleSort(c.key)}
                      className={cx(
                        "flex h-10 w-full items-center gap-1 px-3 text-left text-[11px] font-semibold uppercase tracking-wide",
                        c.align === "right" && "justify-end",
                        TEXT_CAPTION,
                        TRANSITION,
                        FOCUS_RING_INSET,
                        "hover:text-zinc-50",
                      )}
                    >
                      {c.align === "right" ? <Icon size={12} aria-hidden="true" className={isSorted ? "text-sky-400" : undefined} /> : null}
                      <span>{c.label}</span>
                      {c.align !== "right" ? <Icon size={12} aria-hidden="true" className={isSorted ? "text-sky-400" : undefined} /> : null}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className={cx("divide-y", DIVIDE)}>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className={cx("px-3 py-8 text-center text-sm", TEXT_CAPTION)}>
                  No services match this filter.
                </td>
              </tr>
            ) : (
              rows.map((n) => {
                const isSelected = selectedId === n.id;
                const callsOut = CALLS_OUT[n.id];
                const calledBy = CALLED_BY[n.id];
                return (
                  <tr key={n.id} className={cx(isSelected ? "bg-sky-500/10" : undefined, HOVER_ROW, TRANSITION)}>
                    <td className="px-3 py-2.5 align-top">
                      <button
                        type="button"
                        onClick={() => onSelect(n.id)}
                        aria-current={isSelected ? "true" : undefined}
                        className={cx("rounded-md text-left text-sm font-medium leading-snug", TEXT_PRIMARY, TRANSITION, FOCUS_RING, "hover:text-sky-300")}
                      >
                        {n.label}
                      </button>
                      <p className={cx("mt-0.5 text-xs leading-snug", TEXT_CAPTION)}>
                        {TIER_LABEL[n.tier]} &middot; {n.owner}
                      </p>
                    </td>
                    <td className="px-3 py-2.5 align-top">
                      <HealthBadge health={n.health} />
                    </td>
                    <td className={cx("px-3 py-2.5 align-top text-xs leading-relaxed", TEXT_CAPTION)}>
                      {callsOut.length === 0 ? "—" : callsOut.map((c) => c.short).join(", ")}
                    </td>
                    <td className={cx("px-3 py-2.5 align-top text-xs leading-relaxed", TEXT_CAPTION)}>
                      {calledBy.length === 0 ? "—" : calledBy.map((c) => c.short).join(", ")}
                    </td>
                    <td className={cx("whitespace-nowrap px-3 py-2.5 text-right align-top text-sm tabular-nums", TEXT_PRIMARY)}>{formatMs(n.p99Ms)}</td>
                    <td className={cx("whitespace-nowrap px-3 py-2.5 text-right align-top text-sm tabular-nums", TEXT_PRIMARY)}>{formatPct(n.errorRatePct)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
