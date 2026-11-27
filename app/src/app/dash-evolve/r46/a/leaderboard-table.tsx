"use client";

import { useMemo, useState } from "react";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  ENTITIES,
  LATEST_INDEX,
  PERIODS,
  PREVIOUS_INDEX,
  rankAt,
  rankDelta,
  valueAt,
  type CategoryId,
} from "./data";
import { formatCount, formatRank } from "./format";
import { CategoryTag, RankDelta, SortHeader, Sparkline, Tabs } from "./ui";

/**
 * The mandated accessibility fallback for the bump chart above: every integration, every week, as
 * exact numbers in a real `<table>`. It sits in the normal document flow (not behind a toggle,
 * not revealed only by a JS state change) and is reachable by scrolling or by Tab like any other
 * content on the page. Its sort and its category filter are both local to this component — they
 * never read or write the chart's own line-selection state above, and the chart never reads this
 * component's state either.
 */

type SortColumn = "name" | "currentRank" | "delta";
type MetricView = "rank" | "connections";

interface SortState {
  column: SortColumn;
  direction: "asc" | "desc";
}

const FILTER_OPTIONS: { value: CategoryId | "all"; label: string }[] = [
  { value: "all", label: "All" },
  ...CATEGORY_ORDER.map((id) => ({ value: id, label: CATEGORY_META[id].label })),
];

const METRIC_TABS: { value: MetricView; label: string }[] = [
  { value: "rank", label: "Rank by week" },
  { value: "connections", label: "Connections by week" },
];

function sortValue(entityId: string, column: SortColumn): number | string {
  if (column === "name") return ENTITIES.find((e) => e.id === entityId)!.name;
  if (column === "currentRank") return rankAt(entityId, LATEST_INDEX);
  return rankDelta(entityId, PREVIOUS_INDEX, LATEST_INDEX);
}

export function LeaderboardTable() {
  const [sort, setSort] = useState<SortState>({ column: "currentRank", direction: "asc" });
  const [categoryFilter, setCategoryFilter] = useState<CategoryId | "all">("all");
  const [metricView, setMetricView] = useState<MetricView>("rank");

  function toggleSort(column: SortColumn) {
    setSort((prev) => (prev.column === column ? { column, direction: prev.direction === "asc" ? "desc" : "asc" } : { column, direction: "asc" }));
  }

  const rows = useMemo(() => {
    const base = ENTITIES.filter((e) => categoryFilter === "all" || e.category === categoryFilter);
    return [...base].sort((a, b) => {
      const av = sortValue(a.id, sort.column);
      const bv = sortValue(b.id, sort.column);
      const cmp = typeof av === "string" || typeof bv === "string" ? String(av).localeCompare(String(bv)) : (av as number) - (bv as number);
      return sort.direction === "asc" ? cmp : -cmp;
    });
  }, [sort, categoryFilter]);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-semibold text-sm text-zinc-50">All tracked integrations</h2>
          <p className="mt-0.5 max-w-xl font-normal text-xs text-zinc-400">
            The exact rank and connection count behind the chart above, every week — sortable, and filterable by category.
          </p>
        </div>
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-1.5">
          {FILTER_OPTIONS.map((opt) => {
            const active = opt.value === categoryFilter;
            return (
              <button
                key={opt.value}
                type="button"
                aria-pressed={active}
                onClick={() => setCategoryFilter(opt.value)}
                className={`min-h-7 rounded-full border px-2.5 py-1 font-medium text-[11px] motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                  active ? "border-sky-400/40 bg-sky-400/15 text-sky-300" : "border-white/10 bg-white/5 text-zinc-400 hover:text-zinc-50"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <Tabs tabs={METRIC_TABS} value={metricView} onChange={setMetricView} idBase="metric" ariaLabel="Weekly metric shown in the matrix columns" />
      </div>

      {/* Desktop / tablet: one real, sortable, semantic table with the full entity × period
          matrix. Only the active tab's panel is ever mounted — never two at once, so this stays
          the page's single horizontally-scrolling container. */}
      <div className="hidden sm:block">
        <div id={`metric-panel-${metricView}`} role="tabpanel" aria-labelledby={`metric-tab-${metricView}`}>
          <LeaderboardDesktopTable rows={rows} sort={sort} onSort={toggleSort} metricView={metricView} />
        </div>
      </div>

      {/* Mobile: card list. An 11-column matrix cannot fit real available width at 390px without
          a second independent horizontal scroller on the page, so mobile gets a stacked
          alternative that still carries the start → end rank and the exact current numbers. */}
      <ul className="mt-3 space-y-2 sm:hidden">
        {rows.map((entity) => {
          const currentRank = rankAt(entity.id, LATEST_INDEX);
          const delta = rankDelta(entity.id, PREVIOUS_INDEX, LATEST_INDEX);
          const startRank = rankAt(entity.id, 0);
          return (
            <li key={entity.id} className="rounded-lg border border-white/10 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-medium text-sm text-zinc-50">{entity.name}</p>
                  <CategoryTag label={CATEGORY_META[entity.category].label} className="mt-1" />
                </div>
                <p className="shrink-0 font-semibold text-xl tabular-nums text-zinc-50 [font-family:var(--font-display-mono)]">
                  {formatRank(currentRank)}
                </p>
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <RankDelta delta={delta} />
                <Sparkline values={entity.values} />
              </div>
              <p className="mt-2 font-normal text-xs text-zinc-400">
                {PERIODS[0].label} rank {startRank} → {PERIODS[LATEST_INDEX].label} rank {currentRank} · {formatCount(valueAt(entity.id, LATEST_INDEX))}{" "}
                connections now
              </p>
            </li>
          );
        })}
      </ul>

      {rows.length === 0 ? <p className="mt-3 rounded-lg bg-white/5 px-3 py-6 text-center font-normal text-sm text-zinc-400">No integrations match this filter.</p> : null}
    </div>
  );
}

function LeaderboardDesktopTable({
  rows,
  sort,
  onSort,
  metricView,
}: {
  rows: typeof ENTITIES;
  sort: SortState;
  onSort: (column: SortColumn) => void;
  metricView: MetricView;
}) {
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full table-fixed border-collapse">
        <caption className="mb-2 text-left font-normal text-xs text-zinc-400">
          {ENTITIES.length} integrations compared across {PERIODS.length} weeks, showing {metricView === "rank" ? "rank (1 = top)" : "active connections"}{" "}
          per week. Click a column heading to sort; use the category pills above to filter rows.
        </caption>
        {/* Percentage colgroup (not px + min-w on the <table>) so table-fixed can actually compress
            at the narrowest tested desktop width (1264px) instead of forcing a horizontal scrollbar
            there -- a fixed-px min-w floor is exactly this repo's documented anti-pattern for an
            11-column matrix this wide (see auto-dash-r44/b's ExceptionsTable finding). */}
        <colgroup>
          <col style={{ width: "18%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "10%" }} />
          {PERIODS.map((p) => (
            <col key={p.key} style={{ width: "8%" }} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b border-white/10">
            <SortHeader label="Integration" active={sort.column === "name"} dir={sort.direction} onSort={() => onSort("name")} />
            <SortHeader label="Rank" active={sort.column === "currentRank"} dir={sort.direction} onSort={() => onSort("currentRank")} align="right" />
            <SortHeader label="Δ vs last wk" active={sort.column === "delta"} dir={sort.direction} onSort={() => onSort("delta")} align="right" />
            {PERIODS.map((p) => (
              <th key={p.key} scope="col" className="px-2 py-2 text-right font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-400">
                {p.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rows.map((entity) => {
            const currentRank = rankAt(entity.id, LATEST_INDEX);
            const delta = rankDelta(entity.id, PREVIOUS_INDEX, LATEST_INDEX);
            return (
              <tr key={entity.id} className="hover:bg-white/5">
                <th scope="row" className="px-2 py-2.5 text-left font-medium text-sm text-zinc-50">
                  <span className="block truncate">{entity.name}</span>
                  <span className="mt-0.5 block">
                    <CategoryTag label={CATEGORY_META[entity.category].label} />
                  </span>
                </th>
                <td className="px-2 py-2.5 text-right font-medium text-sm tabular-nums text-zinc-50">{formatRank(currentRank)}</td>
                <td className="px-2 py-2.5 text-right">
                  <RankDelta delta={delta} className="justify-end" />
                </td>
                {PERIODS.map((p, idx) => (
                  <td key={p.key} className="px-2 py-2.5 text-right font-normal text-sm tabular-nums text-zinc-300">
                    {metricView === "rank" ? formatRank(rankAt(entity.id, idx)) : formatCount(valueAt(entity.id, idx))}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
