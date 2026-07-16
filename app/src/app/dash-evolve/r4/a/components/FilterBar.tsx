"use client";

import { LayoutList, Search, Table2, X } from "lucide-react";
import { SegmentedControl } from "./ui";
import { CURRENT_CYCLE, FILTER_OPTIONS } from "../lib/data";

export type RailFilter = "all" | "mine" | "urgent";
export type RailView = "list" | "table";

export default function FilterBar({
  view,
  onViewChange,
  filter,
  onFilterChange,
  query,
  onQueryChange,
  resultCount,
}: {
  view: RailView;
  onViewChange: (v: RailView) => void;
  filter: RailFilter;
  onFilterChange: (f: RailFilter) => void;
  query: string;
  onQueryChange: (q: string) => void;
  resultCount: number;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-zinc-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="min-w-0">
        <h1 className="text-base font-semibold tracking-tight text-zinc-900">Issues</h1>
        <p className="mt-0.5 truncate text-xs text-zinc-500">
          {CURRENT_CYCLE.label} · {CURRENT_CYCLE.range} · {CURRENT_CYCLE.daysLeftLabel}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="relative flex h-8 w-full items-center sm:w-48">
          <span className="sr-only" id="issue-search-label">
            Filter issues by title or ID
          </span>
          <Search className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            aria-labelledby="issue-search-label"
            placeholder="Filter issues…"
            className="h-8 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-8 pr-7 text-xs text-zinc-900 outline-none transition-colors motion-reduce:transition-none placeholder:text-zinc-500 hover:bg-zinc-100 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
          />
          {query ? (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              aria-label="Clear search"
              className="absolute right-1.5 inline-flex h-5 w-5 items-center justify-center rounded outline-none hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <X className="h-3 w-3 text-zinc-500" aria-hidden="true" />
            </button>
          ) : null}
        </label>

        <SegmentedControl
          ariaLabel="Filter issues"
          value={filter}
          onChange={onFilterChange}
          options={FILTER_OPTIONS}
        />

        <SegmentedControl
          ariaLabel="Change view"
          value={view}
          onChange={onViewChange}
          options={[
            { id: "list", label: "List", icon: LayoutList },
            { id: "table", label: "Table", icon: Table2 },
          ]}
        />

        <span className="hidden text-xs text-zinc-500 tabular-nums lg:inline" aria-live="polite">
          {resultCount} issue{resultCount === 1 ? "" : "s"}
        </span>
      </div>
    </div>
  );
}
