"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Exchange, ExchangeType, Status } from "./data";
import { CURRENCY } from "./data";
import { Card, SegmentedControl, SortHeader, StatusBadge, ProgressBar, FOCUS_RING, useOutsideClose } from "./ui";

type SortKey = "name" | "cpm" | "winRate" | "latency";
type StatusFilter = "all" | Status;

function TypeFilter({ types, value, onChange }: { types: ExchangeType[]; value: ExchangeType | "all"; onChange: (v: ExchangeType | "all") => void }) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClose<HTMLDivElement>(open, () => setOpen(false));
  return (
    <div className="relative flex-shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
      >
        {value === "all" ? "All types" : value}
        <ChevronDown className="h-3.5 w-3.5 flex-shrink-0 text-zinc-500" aria-hidden="true" />
      </button>
      {open && (
        <ul role="listbox" aria-label="Filter by exchange type" className="absolute right-0 top-9 z-20 max-h-64 w-48 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-1 shadow-lg">
          <li>
            <button
              type="button"
              role="option"
              aria-selected={value === "all"}
              onClick={() => {
                onChange("all");
                setOpen(false);
              }}
              className={`block w-full rounded-md px-2.5 py-1.5 text-left text-xs font-normal text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
            >
              All types
            </button>
          </li>
          {types.map((t) => (
            <li key={t}>
              <button
                type="button"
                role="option"
                aria-selected={value === t}
                onClick={() => {
                  onChange(t);
                  setOpen(false);
                }}
                className={`block w-full rounded-md px-2.5 py-1.5 text-left text-xs font-normal text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
              >
                {t}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ExchangeTable({
  exchanges,
  allTypes,
  selectedId,
  onSelect,
}: {
  exchanges: Exchange[];
  allTypes: ExchangeType[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<ExchangeType | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("cpm");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const rows = useMemo(() => {
    let list = exchanges;
    if (statusFilter !== "all") list = list.filter((e) => e.status === statusFilter);
    if (typeFilter !== "all") list = list.filter((e) => e.type === typeFilter);
    const dir = sortDir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      switch (sortKey) {
        case "name":
          return a.name.localeCompare(b.name) * dir;
        case "cpm":
          return (a.currentCpm - b.currentCpm) * dir;
        case "winRate":
          return (a.winRate - b.winRate) * dir;
        case "latency":
          return (a.latencyMs - b.latencyMs) * dir;
        default:
          return 0;
      }
    });
  }, [exchanges, statusFilter, typeFilter, sortKey, sortDir]);

  const ariaSort = (key: SortKey): "ascending" | "descending" | "none" => (sortKey !== key ? "none" : sortDir === "asc" ? "ascending" : "descending");

  return (
    <Card as="section" aria-labelledby="exchange-table-title" className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-shrink-0 flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3 sm:px-5">
        <h2 id="exchange-table-title" className="text-sm font-semibold text-zinc-900">
          Exchange directory
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <SegmentedControl
            ariaLabel="Filter by status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "all", label: "All" },
              { value: "healthy", label: "Healthy" },
              { value: "degraded", label: "Degraded" },
              { value: "at-risk", label: "At risk" },
            ]}
          />
          <TypeFilter types={allTypes} value={typeFilter} onChange={setTypeFilter} />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <table className="w-full table-fixed border-collapse text-xs">
          <caption className="sr-only">
            Ad exchanges with current CPM, win rate and latency. Sorted by {sortKey}, {sortDir === "asc" ? "ascending" : "descending"}.
          </caption>
          <colgroup>
            <col style={{ width: "34%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "16%" }} />
          </colgroup>
          <thead className="sticky top-0 bg-zinc-50">
            <tr>
              <th scope="col" aria-sort={ariaSort("name")} className="px-4 py-2.5 text-left sm:px-5">
                <SortHeader active={sortKey === "name"} direction={sortDir} onClick={() => toggleSort("name")}>
                  Exchange
                </SortHeader>
              </th>
              <th scope="col" className="px-2 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-600">
                Status
              </th>
              <th scope="col" aria-sort={ariaSort("cpm")} className="px-2 py-2.5 text-right">
                <SortHeader active={sortKey === "cpm"} direction={sortDir} onClick={() => toggleSort("cpm")} align="right">
                  CPM
                </SortHeader>
              </th>
              <th scope="col" aria-sort={ariaSort("winRate")} className="px-2 py-2.5 text-right">
                <SortHeader active={sortKey === "winRate"} direction={sortDir} onClick={() => toggleSort("winRate")} align="right">
                  Win rate
                </SortHeader>
              </th>
              <th scope="col" aria-sort={ariaSort("latency")} className="px-2 py-2.5 text-right sm:pr-5">
                <SortHeader active={sortKey === "latency"} direction={sortDir} onClick={() => toggleSort("latency")} align="right">
                  Latency
                </SortHeader>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((e) => {
              const active = e.id === selectedId;
              return (
                <tr key={e.id} aria-current={active ? "true" : undefined} className={`transition-colors duration-150 ease-out ${active ? "bg-sky-50" : "hover:bg-zinc-50"}`}>
                  <td className="px-4 py-2.5 sm:px-5">
                    <button type="button" onClick={() => onSelect(e.id)} className={`block w-full min-w-0 rounded text-left ${FOCUS_RING}`}>
                      <span className="block truncate text-sm font-medium text-zinc-900">{e.name}</span>
                      <span className="block truncate text-[11px] font-normal text-zinc-600">
                        {e.type} &middot; {e.region}
                      </span>
                    </button>
                  </td>
                  <td className="px-2 py-2.5">
                    <StatusBadge status={e.status} />
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-right tabular-nums font-normal text-zinc-900">{CURRENCY.format(e.currentCpm)}</td>
                  <td className="px-2 py-2.5">
                    <div className="flex items-center justify-end gap-2">
                      <span className="whitespace-nowrap tabular-nums font-normal text-zinc-700">{e.winRate}%</span>
                      <div className="hidden w-10 flex-shrink-0 sm:block">
                        <ProgressBar value={e.winRate} label={`${e.name} win rate`} />
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-right tabular-nums font-normal text-zinc-700 sm:pr-5">{e.latencyMs} ms</td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm font-normal text-zinc-500">
                  No exchanges match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="flex-shrink-0 border-t border-zinc-200 px-4 py-2 tabular-nums text-[11px] font-normal text-zinc-500 sm:px-5">
        Showing {rows.length} of {exchanges.length} exchanges.
      </p>
    </Card>
  );
}
