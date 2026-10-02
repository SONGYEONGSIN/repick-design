"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Crosshair } from "lucide-react";
import {
  NODES,
  DOMAIN_LABEL,
  TIER_ICON,
  STATUS_META,
  statusFor,
  formatPercent,
  formatRps,
  formatMs,
  FOCUS_RING,
  type ServiceNode,
  type HealthStatus,
} from "./data";
import { StatusBadge } from "./ui";

type SortKey = "fullName" | "domain" | "status" | "errorRatePct" | "rps" | "p99Ms" | "saturationPct";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | HealthStatus;

const STATUS_RANK: Record<HealthStatus, number> = { healthy: 0, degraded: 1, critical: 2 };

const FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All services" },
  { key: "healthy", label: "Healthy" },
  { key: "degraded", label: "Degraded" },
  { key: "critical", label: "Critical" },
];

const COLUMNS: { key: SortKey; label: string; align: "left" | "right" }[] = [
  { key: "fullName", label: "Service", align: "left" },
  { key: "domain", label: "Domain", align: "left" },
  { key: "status", label: "Status", align: "left" },
  { key: "errorRatePct", label: "Error rate", align: "right" },
  { key: "rps", label: "Throughput", align: "right" },
  { key: "p99Ms", label: "p99 latency", align: "right" },
  { key: "saturationPct", label: "Saturation", align: "right" },
];

interface NodeTableProps {
  pinnedNodeId: string | null;
  onPinNode: (id: string) => void;
}

export default function NodeTable({ pinnedNodeId, onPinNode }: NodeTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("errorRatePct");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filter, setFilter] = useState<StatusFilter>("all");

  const rows = useMemo(() => {
    const filtered =
      filter === "all" ? NODES : NODES.filter((n) => statusFor(n.errorRatePct) === filter);
    const sorted = [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "fullName") cmp = a.fullName.localeCompare(b.fullName);
      else if (sortKey === "domain") cmp = DOMAIN_LABEL[a.domain].localeCompare(DOMAIN_LABEL[b.domain]);
      else if (sortKey === "status") cmp = STATUS_RANK[statusFor(a.errorRatePct)] - STATUS_RANK[statusFor(b.errorRatePct)];
      else cmp = (a[sortKey] as number) - (b[sortKey] as number);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [filter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "fullName" || key === "domain" ? "asc" : "desc");
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2" role="group" aria-label="Filter services by status">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f.key)}
              className={`flex h-9 items-center rounded-full border px-3.5 text-xs font-medium transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                active
                  ? "border-rose-600 bg-rose-600 text-white"
                  : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              {f.label}
            </button>
          );
        })}
        <span className="ml-1 text-xs font-normal tabular-nums text-zinc-500">
          {rows.length} of {NODES.length}
        </span>
      </div>

      <div className="overflow-x-auto lg:overflow-visible">
        <table className="w-full min-w-[840px] table-fixed border-collapse text-left lg:min-w-0">
          <caption className="mb-2 text-left text-xs font-normal text-zinc-500">
            All {NODES.length} services in the dependency graph with live health metrics. Columns are sortable; use
            the filters above to narrow by status.
          </caption>
          <colgroup>
            <col style={{ width: "27%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "6%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200">
              {COLUMNS.map((col) => {
                const isSorted = sortKey === col.key;
                const ariaSort = isSorted ? (sortDir === "asc" ? "ascending" : "descending") : "none";
                const Icon = isSorted ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={ariaSort}
                    className={`py-1 text-[11px] font-medium uppercase tracking-wider text-zinc-500 ${
                      col.align === "right" ? "text-right" : "text-left"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className={`inline-flex min-h-6 items-center gap-1 rounded py-1.5 ${FOCUS_RING} ${
                        col.align === "right" ? "flex-row-reverse" : ""
                      }`}
                    >
                      {col.label}
                      <Icon aria-hidden="true" className={`h-3 w-3 shrink-0 ${isSorted ? "text-rose-600" : "text-zinc-500"}`} />
                    </button>
                  </th>
                );
              })}
              <th scope="col" className="py-2.5 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                Focus
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((node) => (
              <NodeRow key={node.id} node={node} isPinned={pinnedNodeId === node.id} onPinNode={onPinNode} />
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-sm font-normal text-zinc-500">
                  No services match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NodeRow({
  node,
  isPinned,
  onPinNode,
}: {
  node: ServiceNode;
  isPinned: boolean;
  onPinNode: (id: string) => void;
}) {
  const status = statusFor(node.errorRatePct);
  const meta = STATUS_META[status];
  const Icon = TIER_ICON[node.tier];
  return (
    <tr className={isPinned ? "bg-rose-50/70" : undefined}>
      <td className="py-2.5 pr-2">
        <div className="flex min-w-0 items-center gap-2">
          <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-500" />
          <span className="truncate text-sm font-medium text-zinc-900">{node.fullName}</span>
        </div>
      </td>
      <td className="py-2.5 pr-2 text-sm font-normal text-zinc-600">{DOMAIN_LABEL[node.domain]}</td>
      <td className="py-2.5 pr-2">
        <StatusBadge status={status} />
      </td>
      <td className={`py-2.5 pr-2 text-right text-sm font-medium tabular-nums whitespace-nowrap ${meta.text}`}>
        {formatPercent(node.errorRatePct)}
      </td>
      <td className="py-2.5 pr-2 text-right text-sm font-normal tabular-nums whitespace-nowrap text-zinc-700">
        {formatRps(node.rps)}
      </td>
      <td className="py-2.5 pr-2 text-right text-sm font-normal tabular-nums whitespace-nowrap text-zinc-700">
        {formatMs(node.p99Ms)}
      </td>
      <td className="py-2.5 pr-2 text-right text-sm font-normal tabular-nums whitespace-nowrap text-zinc-700">
        {node.saturationPct}%
      </td>
      <td className="relative py-2.5 text-right">
        <button
          type="button"
          onClick={() => onPinNode(node.id)}
          aria-pressed={isPinned}
          className={`relative inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
            isPinned
              ? "border-rose-600 bg-rose-600 text-white"
              : "border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
          }`}
        >
          <Crosshair aria-hidden="true" className="h-4 w-4" />
          <span className="sr-only">
            {isPinned ? `Unpin ${node.fullName} from the graph` : `Focus ${node.fullName} in the graph`}
          </span>
        </button>
      </td>
    </tr>
  );
}
