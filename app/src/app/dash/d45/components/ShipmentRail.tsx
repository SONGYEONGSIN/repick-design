"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search, X } from "lucide-react";
import { useOps } from "../context";
import { SHIPMENTS, STATUS_FILTERS, getCarrier } from "../data";
import { DeltaText, SectionLabel, StatusPill } from "./ui";
import { cn } from "../utils";
import type { Shipment, SortDir, SortKey, StatusFilter } from "../types";

const STATUS_RANK: Record<Shipment["status"], number> = { delayed: 0, at_risk: 1, on_time: 2, delivered: 3 };

function matchesQuery(s: Shipment, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    s.id.toLowerCase().includes(q) ||
    s.originCode.toLowerCase().includes(q) ||
    s.destCode.toLowerCase().includes(q) ||
    s.originCity.toLowerCase().includes(q) ||
    s.destCity.toLowerCase().includes(q) ||
    getCarrier(s.carrierId).name.toLowerCase().includes(q)
  );
}

function compare(a: Shipment, b: Shipment, key: SortKey): number {
  if (key === "lane") return a.originCode.localeCompare(b.originCode) || a.destCode.localeCompare(b.destCode);
  if (key === "status") return STATUS_RANK[a.status] - STATUS_RANK[b.status];
  return a.etaDeltaHours - b.etaDeltaHours;
}

function SortButton({
  active,
  dir,
  label,
  onClick,
  align = "left",
}: {
  active: boolean;
  dir: SortDir;
  label: string;
  onClick: () => void;
  align?: "left" | "right";
}) {
  const Icon = active ? (dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-8 items-center gap-1 rounded px-1 text-[11px] font-medium uppercase tracking-wider outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-rose-400",
        align === "right" && "flex-row-reverse",
        active ? "text-zinc-100" : "text-zinc-400 hover:text-zinc-200",
      )}
    >
      {label}
      <Icon aria-hidden="true" className="size-3" />
    </button>
  );
}

/**
 * Left rail: a real sortable, filterable shipment table (not a button list) —
 * search + status chips filter the rows, column headers toggle sort with
 * aria-sort, and clicking a lane selects it, which drives the center chart's
 * carrier overlay and the right pane's detail + event feed.
 */
export function ShipmentRail() {
  const { selectedShipmentId, setSelectedShipmentId } = useOps();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("eta");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const rows = useMemo(() => {
    const filtered = SHIPMENTS.filter((s) => matchesQuery(s, query) && (statusFilter === "all" || s.status === statusFilter));
    const sorted = [...filtered].sort((a, b) => compare(a, b, sortKey) * (sortDir === "asc" ? 1 : -1));
    return sorted;
  }, [query, statusFilter, sortKey, sortDir]);

  function ariaSortFor(key: SortKey): "ascending" | "descending" | "none" {
    if (sortKey !== key) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  }

  return (
    <aside aria-label="Shipment list" className="flex w-full shrink-0 flex-col border-b border-white/5 pb-2 xl:w-[320px] xl:border-b-0 xl:border-r xl:pb-0 xl:pr-4">
      <div className="flex items-center justify-between gap-2 px-1 pb-3">
        <SectionLabel>Shipments · {rows.length}</SectionLabel>
      </div>

      <div className="px-1">
        <div role="search" className="flex h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3">
          <Search aria-hidden="true" className="size-4 shrink-0 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lane, carrier, ID…"
            aria-label="Search shipments"
            className="min-w-0 flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-400"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="flex size-6 shrink-0 items-center justify-center rounded text-zinc-400 outline-none transition-colors hover:text-zinc-200 focus-visible:ring-2 focus-visible:ring-rose-400"
            >
              <X aria-hidden="true" className="size-3.5" />
            </button>
          ) : null}
        </div>

        <div role="group" aria-label="Filter by status" className="mt-2.5 flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              aria-pressed={statusFilter === f.value}
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                "min-h-8 rounded-full border px-2.5 text-[11.5px] font-medium outline-none transition-colors",
                "focus-visible:ring-2 focus-visible:ring-rose-400",
                statusFilter === f.value ? "border-rose-400/40 bg-rose-500/15 text-rose-300" : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex-1 overflow-y-auto px-1 xl:max-h-[560px]">
        {rows.length === 0 ? (
          <p className="px-2 py-6 text-center text-xs text-zinc-400">No shipments match these filters.</p>
        ) : (
          <table className="w-full table-fixed border-collapse text-left text-sm">
            <colgroup>
              <col className="w-[48%]" />
              <col className="w-[28%]" />
              <col className="w-[24%]" />
            </colgroup>
            <caption className="sr-only">Shipments, sortable by lane, status, and ETA delta</caption>
            <thead>
              <tr className="border-b border-white/5">
                <th scope="col" aria-sort={ariaSortFor("lane")} className="py-1.5 pr-1">
                  <SortButton active={sortKey === "lane"} dir={sortDir} label="Lane" onClick={() => toggleSort("lane")} />
                </th>
                <th scope="col" aria-sort={ariaSortFor("status")} className="py-1.5 pr-1">
                  <SortButton active={sortKey === "status"} dir={sortDir} label="Status" onClick={() => toggleSort("status")} />
                </th>
                <th scope="col" aria-sort={ariaSortFor("eta")} className="py-1.5">
                  <SortButton active={sortKey === "eta"} dir={sortDir} label="ETA Δ" onClick={() => toggleSort("eta")} align="right" />
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => {
                const carrier = getCarrier(s.carrierId);
                const selected = s.id === selectedShipmentId;
                return (
                  <tr key={s.id} className={cn("border-b border-white/5 last:border-b-0 transition-colors", selected ? "bg-rose-500/10" : "hover:bg-white/5")}>
                    <th scope="row" className="p-0 text-left font-normal">
                      <button
                        type="button"
                        aria-current={selected ? "true" : undefined}
                        onClick={() => setSelectedShipmentId(s.id)}
                        className={cn(
                          "flex w-full min-w-0 flex-col items-start gap-0.5 px-2 py-2.5 text-left outline-none",
                          "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rose-400",
                        )}
                      >
                        <span className="block truncate text-[13px] font-medium text-zinc-100">
                          {s.originCode} → {s.destCode}
                        </span>
                        <span className="block truncate text-[11px] text-zinc-400">{carrier.shortName}</span>
                      </button>
                    </th>
                    <td className="whitespace-nowrap px-1 py-2.5 align-middle">
                      <StatusPill status={s.status} />
                    </td>
                    <td className="whitespace-nowrap px-1 py-2.5 text-right align-middle">
                      <DeltaText hours={s.etaDeltaHours} className="justify-end" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </aside>
  );
}
