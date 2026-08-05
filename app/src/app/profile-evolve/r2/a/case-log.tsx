"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, RotateCcw, ScrollText } from "lucide-react";
import CaseEntry from "./case-entry";
import { SEVERITY_LABEL, SEVERITY_ORDER_FOR_FILTER } from "./badges";
import { CASES, SCOPE_TYPES, topSeverity, type ScopeType, type Severity } from "./data";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

type SortMode = "newest" | "oldest" | "severity";

const SEVERITY_RANK: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };

/**
 * The case log is the page's primary content column — a chronological, filterable audit history, not
 * a decorative widget beside it. Four independent, information-bearing controls live here:
 *   1. severity filter (multi-select toggle chips, OR logic)
 *   2. protocol-type filter (native select)
 *   3. sort order (native select: newest / oldest / most severe first)
 *   4. per-case expand/collapse, revealing a real findings-breakdown table and summary, not decoration
 * All four operate on the same 10-case dataset and are exercised independently of one another.
 */
export default function CaseLog() {
  const [activeSeverities, setActiveSeverities] = useState<Set<Severity>>(new Set());
  const [scopeFilter, setScopeFilter] = useState<ScopeType | "all">("all");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  function toggleSeverity(level: Severity) {
    setActiveSeverities((prev) => {
      const next = new Set(prev);
      if (next.has(level)) next.delete(level);
      else next.add(level);
      return next;
    });
  }

  function toggleExpanded(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function resetFilters() {
    setActiveSeverities(new Set());
    setScopeFilter("all");
  }

  const filtered = useMemo(() => {
    let rows = CASES;
    if (activeSeverities.size > 0) {
      rows = rows.filter((c) => activeSeverities.has(topSeverity(c.findings)));
    }
    if (scopeFilter !== "all") {
      rows = rows.filter((c) => c.scope === scopeFilter);
    }
    const sorted = [...rows];
    if (sortMode === "newest") sorted.sort((a, b) => b.sortKey - a.sortKey);
    else if (sortMode === "oldest") sorted.sort((a, b) => a.sortKey - b.sortKey);
    else sorted.sort((a, b) => SEVERITY_RANK[topSeverity(a.findings)] - SEVERITY_RANK[topSeverity(b.findings)] || b.sortKey - a.sortKey);
    return sorted;
  }, [activeSeverities, scopeFilter, sortMode]);

  const filtersActive = activeSeverities.size > 0 || scopeFilter !== "all";

  return (
    <section aria-labelledby="log-heading" className="min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="log-heading" className="text-lg font-semibold text-zinc-900">
          Engagement log
        </h2>
        <p className="text-sm font-normal text-zinc-600 tabular-nums" aria-live="polite">
          Showing {filtered.length} of {CASES.length} engagements
        </p>
      </div>

      <div className="mt-3 flex flex-col gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-medium text-zinc-700">Severity</span>
          {SEVERITY_ORDER_FOR_FILTER.map((level) => {
            const active = activeSeverities.has(level);
            return (
              <button
                key={level}
                type="button"
                aria-pressed={active}
                onClick={() => toggleSeverity(level)}
                className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${FOCUS} ${
                  active
                    ? "border-emerald-700 bg-emerald-100 text-emerald-800"
                    : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400"
                }`}
              >
                {SEVERITY_LABEL[level]}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5">
          <label htmlFor="scope-filter" className="text-xs font-medium text-zinc-700">
            Protocol type
          </label>
          <select
            id="scope-filter"
            value={scopeFilter}
            onChange={(e) => setScopeFilter(e.target.value as ScopeType | "all")}
            className={`rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-normal text-zinc-800 ${FOCUS}`}
          >
            <option value="all">All types</option>
            {SCOPE_TYPES.map((scope) => (
              <option key={scope} value={scope}>
                {scope}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <label htmlFor="sort-mode" className="flex items-center gap-1 text-xs font-medium text-zinc-700">
            <ArrowUpDown aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            Sort
          </label>
          <select
            id="sort-mode"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            className={`rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-normal text-zinc-800 ${FOCUS}`}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="severity">Most severe first</option>
          </select>
        </div>

        {filtersActive ? (
          <button
            type="button"
            onClick={resetFilters}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:text-zinc-900 sm:ml-auto ${FOCUS}`}
          >
            <RotateCcw aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            Reset filters
          </button>
        ) : null}
      </div>

      {filtered.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {filtered.map((entry) => (
            <CaseEntry key={entry.id} entry={entry} expanded={expandedIds.has(entry.id)} onToggle={() => toggleExpanded(entry.id)} />
          ))}
        </ul>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-2 rounded-xl border border-dashed border-zinc-300 px-4 py-10 text-center">
          <ScrollText aria-hidden="true" className="h-6 w-6 shrink-0 text-zinc-600" />
          <p className="text-sm font-normal text-zinc-700">No engagements match the current filters.</p>
          <button
            type="button"
            onClick={resetFilters}
            className={`mt-1 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-400 ${FOCUS}`}
          >
            Reset filters
          </button>
        </div>
      )}
    </section>
  );
}
