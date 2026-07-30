"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, CheckCircle2, RotateCcw, Search, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { formatDate, SERVICE_BY_ID, STATUS_LABEL, type DeployRecord, type DeployStatus } from "./data";
import { BORDER, DIVIDE, FOCUS_RING_INSET, HOVER_ROW, NUM, TEXT_CAPTION, TEXT_PRIMARY, TONE, TRANSITION, cx } from "./tokens";
import { Badge, SegmentedControl } from "./ui";

const STATUS_TONE = {
  success: TONE.good,
  rolled_back: TONE.warn,
  failed: TONE.bad,
} as const;

const STATUS_ICON = {
  success: CheckCircle2,
  rolled_back: RotateCcw,
  failed: XCircle,
} as const;

type SortKey = "date" | "service" | "author" | "duration" | "leadTime" | "status";
type SortDir = "asc" | "desc";

const STATUS_FILTERS: { id: DeployStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "success", label: "Success" },
  { id: "rolled_back", label: "Rolled back" },
  { id: "failed", label: "Failed" },
];

const COLUMNS: { key: SortKey; label: string; width: string; align?: "right" }[] = [
  { key: "date", label: "Date", width: "16%" },
  { key: "service", label: "Service", width: "22%" },
  { key: "author", label: "Author", width: "20%" },
  { key: "duration", label: "Duration", width: "13%", align: "right" },
  { key: "leadTime", label: "Lead time", width: "13%", align: "right" },
  { key: "status", label: "Status", width: "16%" },
];

export default function DeployTable({
  deploys,
  query,
  onQueryChange,
}: {
  deploys: DeployRecord[];
  query: string;
  onQueryChange: (query: string) => void;
}) {
  const [statusFilter, setStatusFilter] = useState<DeployStatus | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    return deploys.filter((d) => {
      if (statusFilter !== "all" && d.status !== statusFilter) return false;
      if (q === "") return true;
      const service = SERVICE_BY_ID[d.serviceId].name.toLowerCase();
      return service.includes(q) || d.author.toLowerCase().includes(q);
    });
  }, [deploys, statusFilter, q]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const dir = sortDir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      switch (sortKey) {
        case "date":
          return (a.dateMs - b.dateMs) * dir;
        case "service":
          return SERVICE_BY_ID[a.serviceId].name.localeCompare(SERVICE_BY_ID[b.serviceId].name) * dir;
        case "author":
          return a.author.localeCompare(b.author) * dir;
        case "duration":
          return (a.durationMin - b.durationMin) * dir;
        case "leadTime":
          return (a.leadTimeHours - b.leadTimeHours) * dir;
        case "status":
          return a.status.localeCompare(b.status) * dir;
        default:
          return 0;
      }
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const shown = sorted.slice(0, 60);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "date" ? "desc" : "asc");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative">
            <span className="sr-only">Search deploys by service or author</span>
            <Search size={14} aria-hidden="true" className={cx("pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2", TEXT_CAPTION)} />
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Filter by service or author…"
              className={cx(
                "h-9 w-56 rounded-lg border pl-8 pr-2.5 text-sm outline-none sm:w-64",
                BORDER,
                "bg-white dark:bg-zinc-950",
                TEXT_PRIMARY,
                "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
                "focus-visible:ring-2 focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-400",
              )}
            />
          </label>
          <SegmentedControl options={STATUS_FILTERS} value={statusFilter} onChange={setStatusFilter} ariaLabel="Filter deploys by status" />
        </div>
        <p aria-live="polite" className={cx("text-xs", TEXT_CAPTION)}>
          <span className={NUM}>{sorted.length}</span> of <span className={NUM}>{deploys.length}</span> deploys
          {sorted.length > shown.length ? ` · showing most recent ${shown.length}` : ""}
        </p>
      </div>

      <div className="mt-3 overflow-x-auto [scrollbar-width:thin]">
        <table className="w-full min-w-[640px] table-fixed border-collapse text-sm lg:min-w-0">
          <caption className="sr-only">Recent deploys across all services, sortable by column and filterable by status or search text.</caption>
          <colgroup>
            {COLUMNS.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER)}>
              {COLUMNS.map((c) => {
                const active = sortKey === c.key;
                const ariaSort = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";
                const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
                return (
                  <th key={c.key} scope="col" aria-sort={ariaSort} className="py-2 pr-2 align-middle font-medium">
                    <button
                      type="button"
                      onClick={() => toggleSort(c.key)}
                      className={cx(
                        "inline-flex items-center gap-1 rounded px-1 py-1 text-[11px] font-semibold uppercase tracking-wider",
                        active ? TEXT_PRIMARY : TEXT_CAPTION,
                        TRANSITION,
                        FOCUS_RING_INSET,
                        c.align === "right" && "flex-row-reverse",
                      )}
                    >
                      {c.label}
                      <Icon size={12} aria-hidden="true" className={active ? "" : "opacity-50"} />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className={cx("divide-y", DIVIDE)}>
            {shown.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className={cx("py-8 text-center text-sm", TEXT_CAPTION)}>
                  No deploys match this filter.
                </td>
              </tr>
            ) : (
              shown.map((d) => {
                const service = SERVICE_BY_ID[d.serviceId];
                const StatusIcon = STATUS_ICON[d.status];
                return (
                  <tr key={d.id} className={cx(HOVER_ROW, TRANSITION)}>
                    <td className={cx("py-2.5 pr-2", NUM, TEXT_CAPTION)}>{formatDate(d.dateMs)}</td>
                    <td className="truncate py-2.5 pr-2">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={cx("h-2 w-2 shrink-0 rounded-full", service.dot)} aria-hidden="true" />
                        <span className={cx("truncate", TEXT_PRIMARY)}>{service.name}</span>
                      </span>
                    </td>
                    <td className={cx("truncate py-2.5 pr-2", TEXT_PRIMARY)}>{d.author}</td>
                    <td className={cx("py-2.5 pr-2 text-right", NUM, TEXT_CAPTION)}>{d.durationMin}m</td>
                    <td className={cx("py-2.5 pr-2 text-right", NUM, TEXT_CAPTION)}>{d.leadTimeHours.toFixed(1)}h</td>
                    <td className="py-2.5 pr-2">
                      <Badge tone={STATUS_TONE[d.status]} Icon={StatusIcon}>
                        {STATUS_LABEL[d.status]}
                      </Badge>
                    </td>
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
