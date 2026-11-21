"use client";

import { Search } from "lucide-react";
import type { ApiKey, QuotaStatus } from "./data";
import { environmentLabel, formatNumber, matrixTotal, quotaStatus, quotaUsedPct } from "./data";
import { EnvBadge, FOCUS, MiniBuckets, SegmentedControl, StatusBadge } from "./ui";

export type StatusFilter = QuotaStatus | "all";
export type SortMode = "usage" | "name";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "ok", label: "OK" },
  { value: "warning", label: "Warning" },
  { value: "exceeded", label: "Exceeded" },
];

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "usage", label: "Usage" },
  { value: "name", label: "Name" },
];

/**
 * The fixed-width key rail. Its only effect outside itself is `onSelect`, which feeds the Key
 * overview card and the dominant heatmap/table in the detail pane (see WeirClient's comment on
 * `pinnedKeyId`). Search, status filter and sort are entirely local to this rail.
 */
export function KeyRail({
  keys,
  query,
  onQueryChange,
  statusFilter,
  onStatusFilterChange,
  sortMode,
  onSortModeChange,
  pinnedId,
  onSelect,
}: {
  keys: ApiKey[];
  query: string;
  onQueryChange: (v: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (v: StatusFilter) => void;
  sortMode: SortMode;
  onSortModeChange: (v: SortMode) => void;
  pinnedId: string;
  onSelect: (key: ApiKey) => void;
}) {
  const needle = query.trim().toLowerCase();
  const rowsAll = keys.map((key) => {
    const pct = quotaUsedPct(key);
    return { key, pct, status: quotaStatus(pct) };
  });

  const filtered = rowsAll.filter((row) => {
    const matchesQuery =
      needle === "" ||
      row.key.name.toLowerCase().includes(needle) ||
      row.key.owner.toLowerCase().includes(needle);
    const matchesStatus = statusFilter === "all" || row.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const rows =
    sortMode === "usage"
      ? [...filtered].sort((a, b) => b.pct - a.pct)
      : [...filtered].sort((a, b) => a.key.name.localeCompare(b.key.name));

  return (
    <div className="flex h-full min-w-0 flex-col">
      <div className="shrink-0 border-b border-zinc-200 p-4">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-sm font-semibold text-zinc-900">API keys</h1>
          <span className="shrink-0 font-mono text-xs font-normal tabular-nums text-zinc-600">
            {rows.length} of {keys.length}
          </span>
        </div>

        <div className="relative mt-3">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search name or owner"
            aria-label="Search API keys by name or owner"
            className={`${FOCUS} h-9 w-full min-w-0 rounded-lg border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm font-normal text-zinc-900 placeholder:text-zinc-500`}
          />
        </div>

        <div className="mt-3">
          <SegmentedControl
            label="Filter keys by quota status"
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={onStatusFilterChange}
          />
        </div>

        <div className="mt-2">
          <SegmentedControl label="Sort keys" options={SORT_OPTIONS} value={sortMode} onChange={onSortModeChange} />
        </div>
      </div>

      <ul aria-label="API key list" className="min-w-0 flex-1 space-y-1 overflow-y-auto p-2">
        {rows.map(({ key, status }) => {
          const pinned = key.id === pinnedId;
          return (
            <li key={key.id}>
              <button
                type="button"
                aria-pressed={pinned}
                onClick={() => onSelect(key)}
                className={`${FOCUS} flex w-full min-w-0 flex-col items-start gap-2 rounded-xl border-l-2 px-3 py-2.5 text-left transition-colors motion-reduce:transition-none ${
                  pinned ? "border-emerald-700 bg-emerald-50" : "border-transparent hover:bg-zinc-50"
                }`}
              >
                <div className="flex w-full min-w-0 items-start justify-between gap-2">
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900">{key.name}</span>
                  <StatusBadge status={status} />
                </div>
                <div className="flex w-full min-w-0 items-center justify-between gap-2">
                  <span className="min-w-0 flex-1 truncate text-xs font-normal text-zinc-600">
                    {key.owner} team
                  </span>
                  <EnvBadge label={environmentLabel(key.environment)} />
                </div>
                <div className="flex w-full min-w-0 items-center gap-2">
                  <MiniBuckets matrix={key.matrix} className="flex-1" />
                  <span className="shrink-0 whitespace-nowrap font-mono text-xs font-normal tabular-nums text-zinc-600">
                    {formatNumber(matrixTotal(key.matrix))} req
                  </span>
                </div>
              </button>
            </li>
          );
        })}
        {rows.length === 0 && (
          <li className="px-3 py-8 text-center text-sm font-normal text-zinc-600">No keys match your filters.</li>
        )}
      </ul>
    </div>
  );
}
