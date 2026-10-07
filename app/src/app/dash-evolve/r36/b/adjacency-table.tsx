"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { EDGES, NODE_BY_ID, RELATIONSHIP_LABEL, type ServiceEdge, type TierId } from "./data";
import { BORDER, CODE, FOCUS, HOVER_ROW, NUM, STATUS_BADGE, STATUS_LABEL, TEXT_AUX, TEXT_PRIMARY, TRANSITION, type Status, cx } from "./tokens";
import { Badge } from "./ui";

type SortKey = "source" | "target" | "relationship" | "latencyMs" | "callsPerMin" | "status";
type SortDir = "asc" | "desc";

const STATUS_RANK: Record<Status, number> = { down: 0, degraded: 1, healthy: 2 };

const STATUS_OPTIONS: { id: "all" | Status; label: string }[] = [
  { id: "all", label: "All statuses" },
  { id: "healthy", label: "Healthy" },
  { id: "degraded", label: "Degraded" },
  { id: "down", label: "Down" },
];
const TIER_OPTIONS: { id: "all" | TierId; label: string }[] = [
  { id: "all", label: "All tiers" },
  { id: "edge", label: "Edge" },
  { id: "service", label: "Service" },
  { id: "data", label: "Data" },
];

function sortValue(edge: ServiceEdge, key: SortKey) {
  switch (key) {
    case "source":
      return NODE_BY_ID.get(edge.source)?.name ?? edge.source;
    case "target":
      return NODE_BY_ID.get(edge.target)?.name ?? edge.target;
    case "relationship":
      return RELATIONSHIP_LABEL[edge.relationship];
    case "latencyMs":
      return edge.latencyMs;
    case "callsPerMin":
      return edge.callsPerMin;
    case "status":
      return STATUS_RANK[edge.status];
  }
}

export default function AdjacencyTable() {
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [tierFilter, setTierFilter] = useState<"all" | TierId>("all");
  const [sortKey, setSortKey] = useState<SortKey>("callsPerMin");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const rows = useMemo(() => {
    let list = EDGES.slice();
    if (statusFilter !== "all") list = list.filter((e) => e.status === statusFilter);
    if (tierFilter !== "all") list = list.filter((e) => NODE_BY_ID.get(e.source)?.tier === tierFilter);
    list.sort((a, b) => {
      const av = sortValue(a, sortKey);
      const bv = sortValue(b, sortKey);
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [statusFilter, tierFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  // Widths were rebalanced after the mobile sweep found the header buttons'
  // text overflowing into neighboring columns at 390px: Relationship and
  // Latency (p50) get more room here, taken from Source/Target/Status (whose
  // body cells already truncate comfortably at a narrower width). The header
  // button itself also got a real fix below (flex + min-w-0 + a dedicated
  // shortLabel at <sm) rather than relying on width alone.
  const columns: { key: SortKey; label: string; shortLabel: string; width: string; numeric?: boolean }[] = [
    { key: "source", label: "Source", shortLabel: "Source", width: "18%" },
    { key: "target", label: "Target", shortLabel: "Target", width: "18%" },
    { key: "relationship", label: "Relationship", shortLabel: "Type", width: "17%" },
    { key: "latencyMs", label: "Latency (p50)", shortLabel: "p50", width: "14%", numeric: true },
    { key: "callsPerMin", label: "Calls / min", shortLabel: "Calls", width: "17%", numeric: true },
    { key: "status", label: "Status", shortLabel: "Status", width: "16%" },
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <FilterSelect id="table-filter-status" label="Status" value={statusFilter} onChange={(v) => setStatusFilter(v as "all" | Status)} options={STATUS_OPTIONS} />
        <FilterSelect id="table-filter-tier" label="Source tier" value={tierFilter} onChange={(v) => setTierFilter(v as "all" | TierId)} options={TIER_OPTIONS} />
        <p className={cx("ml-auto text-xs font-normal", TEXT_AUX)}>
          {rows.length} of {EDGES.length} dependencies
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full table-fixed border-collapse text-sm" id="adjacency-table">
          <caption className="sr-only">
            Service dependency adjacency list: every call between services, its relationship type, p50 latency, call volume and health status. {EDGES.length} total
            dependencies across {new Set(EDGES.flatMap((e) => [e.source, e.target])).size} services.
          </caption>
          <colgroup>
            {columns.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02]">
              {columns.map((col) => {
                const active = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                    className={cx("px-2 py-2.5 text-left align-middle sm:px-3", col.numeric && "text-right")}
                  >
                    {/* `flex w-full min-w-0` on the button (instead of the default
                        `inline-flex`, which sizes to its unwrapped content) plus
                        `min-w-0 truncate` on the label span is what actually stops
                        the label from overflowing into the next column — a fixed
                        `<th>` width alone doesn't clip a flex child's text, since
                        flex items default to `min-width: auto`. The short label at
                        <sm is a second, belt-and-suspenders fix for the two
                        genuinely long headers. */}
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className={cx(
                        "flex w-full min-w-0 items-center gap-1 rounded-md text-[11px] font-medium uppercase tracking-[0.08em]",
                        col.numeric ? "flex-row-reverse text-right" : "text-left",
                        active ? "text-emerald-300" : TEXT_AUX,
                        TRANSITION,
                        FOCUS,
                      )}
                    >
                      <span className="min-w-0 flex-1 truncate">
                        <span className="sm:hidden">{col.shortLabel}</span>
                        <span className="hidden sm:inline">{col.label}</span>
                      </span>
                      {active ? (
                        sortDir === "asc" ? (
                          <ArrowUp size={12} aria-hidden="true" className="shrink-0" />
                        ) : (
                          <ArrowDown size={12} aria-hidden="true" className="shrink-0" />
                        )
                      ) : (
                        <ArrowUpDown size={12} aria-hidden="true" className="shrink-0 opacity-50" />
                      )}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((edge) => (
              <EdgeRow key={edge.id} edge={edge} />
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={cx("px-2 py-8 text-center text-sm font-normal sm:px-3", TEXT_AUX)}>
                  No dependencies match the current filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EdgeRow({ edge }: { edge: ServiceEdge }) {
  const source = NODE_BY_ID.get(edge.source);
  const target = NODE_BY_ID.get(edge.target);
  return (
    <tr className={cx("border-b border-white/5 last:border-b-0", HOVER_ROW, TRANSITION)}>
      <td className="px-2 py-2.5 align-middle sm:px-3">
        <span className={cx("block truncate text-sm font-medium", TEXT_PRIMARY)} title={source?.hostname}>
          {source?.name ?? edge.source}
        </span>
        <span className={cx("block truncate", CODE, "text-zinc-400")}>{source?.hostname}</span>
      </td>
      <td className="px-2 py-2.5 align-middle sm:px-3">
        <span className={cx("block truncate text-sm font-medium", TEXT_PRIMARY)} title={target?.hostname}>
          {target?.name ?? edge.target}
        </span>
        <span className={cx("block truncate", CODE, "text-zinc-400")}>{target?.hostname}</span>
      </td>
      <td className="px-2 py-2.5 align-middle sm:px-3">
        <span className={cx("block truncate text-sm font-normal", TEXT_AUX)}>{RELATIONSHIP_LABEL[edge.relationship]}</span>
      </td>
      <td className={cx("px-2 py-2.5 text-right align-middle text-sm font-medium sm:px-3", NUM, TEXT_PRIMARY)}>{edge.latencyMs}ms</td>
      <td className={cx("px-2 py-2.5 text-right align-middle text-sm font-medium sm:px-3", NUM, TEXT_PRIMARY)}>{edge.callsPerMin.toLocaleString("en-US")}</td>
      <td className="px-2 py-2.5 align-middle sm:px-3">
        <Badge className={cx(STATUS_BADGE[edge.status], "max-w-full overflow-hidden px-1.5")}>{STATUS_LABEL[edge.status]}</Badge>
      </td>
    </tr>
  );
}

function FilterSelect<T extends string>({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={cx("h-9 rounded-lg border bg-zinc-950 px-2.5 text-sm font-medium", BORDER, TEXT_PRIMARY, FOCUS, TRANSITION)}
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
