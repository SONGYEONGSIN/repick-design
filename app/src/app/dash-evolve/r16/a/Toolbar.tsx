"use client";

import { Search, X } from "lucide-react";
import { SEVERITY_ORDER, SEVERITY_META, type Severity } from "./data";
import { SEVERITY_STYLE } from "./ui";

export function Toolbar({
  query,
  onQueryChange,
  activeSeverities,
  onToggleSeverity,
  onClear,
  resultCount,
  totalCount,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  activeSeverities: Set<Severity>;
  onToggleSeverity: (s: Severity) => void;
  onClear: () => void;
  resultCount: number;
  totalCount: number;
}) {
  const filtered = query.trim() !== "" || activeSeverities.size < SEVERITY_ORDER.length;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex h-11 min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 focus-within:ring-2 focus-within:ring-teal-600 sm:max-w-xs">
        <Search className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Filter by id, title, asset, CVE…"
          aria-label="Filter findings"
          className="h-full min-w-0 flex-1 border-0 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none"
        />
        {query ? (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            aria-label="Clear filter text"
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded text-zinc-500 hover:text-zinc-700 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:outline-none"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div role="group" aria-label="Filter by severity" className="inline-flex h-11 items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-1">
        {SEVERITY_ORDER.map((sev) => {
          const active = activeSeverities.has(sev);
          const style = SEVERITY_STYLE[sev];
          return (
            <button
              key={sev}
              type="button"
              aria-pressed={active}
              onClick={() => onToggleSeverity(sev)}
              className={`inline-flex h-full items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:outline-none ${
                active ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
              {SEVERITY_META[sev].label}
            </button>
          );
        })}
      </div>

      <p className="text-xs whitespace-nowrap text-zinc-500 tabular-nums" aria-live="polite">
        {filtered ? `${resultCount} of ${totalCount} findings` : `${totalCount} findings`}
      </p>

      {filtered ? (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-11 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-teal-800 hover:bg-teal-50 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:outline-none"
        >
          Clear filters
        </button>
      ) : null}
    </div>
  );
}
