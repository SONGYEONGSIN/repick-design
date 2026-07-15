"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { zoneById, type DeliveryRecord } from "./data";
import { DELIVERY_STATUS_META } from "./status-meta";
import { Badge } from "./ui";
import { cn, FOCUS_RING } from "./cn";

type SortKey = "id" | "vehicle" | "zone" | "status" | "scheduled" | "duration" | "distance";
type SortDir = "asc" | "desc";

const COLUMNS: Array<{ key: SortKey; label: string; align?: "right" }> = [
  { key: "id", label: "Delivery" },
  { key: "vehicle", label: "Vehicle" },
  { key: "zone", label: "Zone" },
  { key: "status", label: "Status" },
  { key: "scheduled", label: "Scheduled" },
  { key: "duration", label: "Duration", align: "right" },
  { key: "distance", label: "Distance", align: "right" },
];

function sortValue(row: DeliveryRecord, key: SortKey): string | number {
  switch (key) {
    case "id":
      return row.id;
    case "vehicle":
      return row.vehicleId;
    case "zone":
      return zoneById(row.zoneId).name;
    case "status":
      return row.status;
    case "scheduled":
      return row.scheduled;
    case "duration":
      return row.durationMin ?? -1;
    case "distance":
      return row.distanceKm;
    default:
      return "";
  }
}

export function HistoryTable({
  rows,
  selectedId,
  onSelectDelivery,
}: {
  rows: DeliveryRecord[];
  selectedId: string | null;
  onSelectDelivery: (id: string) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("scheduled");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const va = sortValue(a, sortKey);
      const vb = sortValue(b, sortKey);
      const cmp = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <div className="min-w-0 overflow-x-auto rounded-lg">
      <table className="w-full min-w-[820px] border-collapse text-sm lg:min-w-0 lg:table-fixed">
        <caption className="sr-only">
          Delivery history — {rows.length} records, sortable by column. Select a row to view its detail in the
          side panel.
        </caption>
        <colgroup>
          <col className="lg:w-[22%]" />
          <col className="lg:w-[16%]" />
          <col className="lg:w-[12%]" />
          <col className="lg:w-[14%]" />
          <col className="lg:w-[12%]" />
          <col className="lg:w-[12%]" />
          <col className="lg:w-[12%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-white/10">
            {COLUMNS.map((col) => {
              const active = sortKey === col.key;
              const ariaSort = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";
              const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={ariaSort}
                  className={cn(
                    "px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400",
                    col.align === "right" ? "text-right" : "text-left",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => handleSort(col.key)}
                    className={cn(
                      FOCUS_RING,
                      "inline-flex items-center gap-1 rounded hover:text-zinc-200",
                      col.align === "right" && "flex-row-reverse",
                      active && "text-zinc-200",
                    )}
                  >
                    {col.label}
                    <Icon aria-hidden="true" className={cn("size-3", active ? "text-cyan-300" : "text-zinc-500")} />
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => {
            const zone = zoneById(row.zoneId);
            const meta = DELIVERY_STATUS_META[row.status];
            const selected = selectedId === row.id;
            return (
              <tr
                key={row.id}
                aria-selected={selected}
                className={cn(
                  "border-b border-white/5 transition-colors last:border-b-0 hover:bg-white/[0.03]",
                  selected && "bg-cyan-400/[0.06]",
                )}
              >
                <th scope="row" className="px-3 py-2.5 text-left font-normal">
                  <button
                    type="button"
                    onClick={() => onSelectDelivery(row.id)}
                    aria-pressed={selected}
                    className={cn(FOCUS_RING, "block w-full rounded text-left")}
                  >
                    <span className="block truncate font-medium tabular-nums text-zinc-100">{row.id}</span>
                    <span className="block truncate text-xs text-zinc-400">
                      {row.customer} · {row.address}
                    </span>
                  </button>
                </th>
                <td className="px-3 py-2.5 text-left">
                  <span className="block truncate tabular-nums text-zinc-200">{row.vehicleId}</span>
                  <span className="block truncate text-xs text-zinc-400">{row.driver}</span>
                </td>
                <td className="px-3 py-2.5 text-left">
                  <span className="block truncate text-zinc-300">{zone.code}</span>
                </td>
                <td className="px-3 py-2.5">
                  <Badge meta={meta} />
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-left tabular-nums text-zinc-300">
                  {row.scheduled}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-zinc-300">
                  {row.durationMin !== null ? `${row.durationMin} min` : "—"}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-zinc-300">
                  {row.distanceKm.toFixed(1)} km
                </td>
              </tr>
            );
          })}
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={COLUMNS.length} className="px-3 py-8 text-center text-sm text-zinc-400">
                No deliveries match the current filters.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
