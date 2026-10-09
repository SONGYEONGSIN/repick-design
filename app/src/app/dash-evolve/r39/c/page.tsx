"use client";

import { Fragment, useState, type ComponentType } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Command,
  Download,
  Database,
  Archive,
  ScrollText,
  Image as ImageIcon,
  CircleDashed,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Static, deterministic data. Nothing here depends on Math.random(), Date.now()
// or new Date() — every render produces the exact same numbers.
// ---------------------------------------------------------------------------

type PeriodKey = "current" | "projected";
type CategoryKey = "database" | "backup" | "logs" | "media" | "free";
type IconType = ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;

interface CategoryDatum {
  key: CategoryKey;
  label: string;
  share: number; // percent, 0-100
  capacityTb: number;
  swatch: string;
  icon: IconType;
}

const TOTAL_CAPACITY_TB = 500;
const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600";

const PERIOD_DATA: Record<PeriodKey, CategoryDatum[]> = {
  current: [
    { key: "database", label: "Database Volumes", share: 34, capacityTb: 170, swatch: "bg-sky-700", icon: Database },
    { key: "backup", label: "Backup Snapshots", share: 21, capacityTb: 105, swatch: "bg-sky-500", icon: Archive },
    { key: "logs", label: "Log Archives", share: 15, capacityTb: 75, swatch: "bg-sky-300", icon: ScrollText },
    { key: "media", label: "Media Cache", share: 12, capacityTb: 60, swatch: "bg-zinc-400", icon: ImageIcon },
    { key: "free", label: "Free / Unallocated", share: 18, capacityTb: 90, swatch: "bg-zinc-200", icon: CircleDashed },
  ],
  projected: [
    { key: "database", label: "Database Volumes", share: 37, capacityTb: 185, swatch: "bg-sky-700", icon: Database },
    { key: "backup", label: "Backup Snapshots", share: 23, capacityTb: 115, swatch: "bg-sky-500", icon: Archive },
    { key: "logs", label: "Log Archives", share: 16, capacityTb: 80, swatch: "bg-sky-300", icon: ScrollText },
    { key: "media", label: "Media Cache", share: 13, capacityTb: 65, swatch: "bg-zinc-400", icon: ImageIcon },
    { key: "free", label: "Free / Unallocated", share: 11, capacityTb: 55, swatch: "bg-zinc-200", icon: CircleDashed },
  ],
};

// Fixed, period-independent "largest contributor" detail shown in the
// expandable row of the breakdown table.
const SUB_DETAILS: Record<CategoryKey, { label: string; sizeTb: number }[]> = {
  database: [
    { label: "prod-primary-db", sizeTb: 96 },
    { label: "analytics-replica", sizeTb: 54 },
  ],
  backup: [
    { label: "nightly-snapshots", sizeTb: 70 },
    { label: "weekly-archive", sizeTb: 35 },
  ],
  logs: [
    { label: "app-log-retention", sizeTb: 48 },
    { label: "audit-trail", sizeTb: 27 },
  ],
  media: [
    { label: "cdn-image-cache", sizeTb: 38 },
    { label: "video-thumbnails", sizeTb: 22 },
  ],
  free: [
    { label: "reserved headroom", sizeTb: 60 },
    { label: "unassigned", sizeTb: 30 },
  ],
};

const CURRENT_USED_SHARE = 100 - PERIOD_DATA.current.find((d) => d.key === "free")!.share;
const PROJECTED_USED_SHARE = 100 - PERIOD_DATA.projected.find((d) => d.key === "free")!.share;
const USED_SHARE_DELTA = PROJECTED_USED_SHARE - CURRENT_USED_SHARE;

function buildWaffleCells(data: CategoryDatum[]): CategoryKey[] {
  const cells: CategoryKey[] = [];
  data.forEach((category) => {
    for (let i = 0; i < category.share; i += 1) {
      cells.push(category.key);
    }
  });
  return cells;
}

function segmentClass(active: boolean): string {
  const base = `flex h-7 items-center rounded-full px-3 text-xs font-medium transition-colors motion-reduce:transition-none ${FOCUS}`;
  return active
    ? `${base} bg-sky-700 text-white`
    : `${base} text-zinc-600 hover:bg-zinc-100`;
}

type SortKey = "share" | "capacityTb";
type SortDir = "asc" | "desc";

export default function Page() {
  const [period, setPeriod] = useState<PeriodKey>("current");
  const [hoveredCategory, setHoveredCategory] = useState<CategoryKey | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("share");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expandedCategory, setExpandedCategory] = useState<CategoryKey | null>(null);

  const data = PERIOD_DATA[period];
  const dataByKey = Object.fromEntries(data.map((d) => [d.key, d])) as Record<CategoryKey, CategoryDatum>;
  const freeDatum = dataByKey.free;
  const usedShare = 100 - freeDatum.share;
  const usedTb = TOTAL_CAPACITY_TB - freeDatum.capacityTb;

  const activeCategoryKey = hoveredCategory ?? selectedCategory;
  const activeCategory = activeCategoryKey ? dataByKey[activeCategoryKey] : null;

  const cells = buildWaffleCells(data);

  const chartAriaLabel = `Waffle chart, 100 cells, one cell per percent of the 500 terabyte plan. ${data
    .map((d) => `${d.label} ${d.share} percent`)
    .join(", ")}.`;

  const sortedRows = [...data].sort((a, b) => {
    const diff = a[sortKey] - b[sortKey];
    return sortDir === "asc" ? diff : -diff;
  });

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function sortAriaFor(key: SortKey): "ascending" | "descending" | "none" {
    if (sortKey !== key) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  }

  const projectionNote =
    period === "current"
      ? `Projected to reach ${PROJECTED_USED_SHARE}% in 30 days (+${USED_SHARE_DELTA} pts)`
      : `Up from ${CURRENT_USED_SHARE}% today (+${USED_SHARE_DELTA} pts)`;

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* App shell top bar */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-600 text-white">
              <Database className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="truncate text-base font-bold text-zinc-900">Vaultline</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`flex h-11 items-center gap-2 rounded-lg border border-zinc-200 px-3 text-sm font-medium text-zinc-600 hover:bg-zinc-50 ${FOCUS}`}
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Search</span>
              <kbd className="hidden items-center gap-0.5 rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-xs font-medium text-zinc-600 sm:inline-flex">
                <Command className="h-3 w-3" aria-hidden="true" />K
              </kbd>
            </button>
            <button
              type="button"
              className={`flex h-11 items-center gap-2 rounded-lg bg-sky-700 px-3 sm:px-4 text-sm font-medium text-white hover:bg-sky-800 ${FOCUS}`}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Export report</span>
            </button>
            <button
              type="button"
              aria-label="Notifications"
              className={`flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 ${FOCUS}`}
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              className={`flex h-11 items-center gap-2 rounded-lg border border-zinc-200 px-2 pr-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 ${FOCUS}`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white">
                PN
              </span>
              <span className="hidden sm:inline">Priya N.</span>
              <ChevronDown className="h-4 w-4 text-zinc-400" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Storage plan allocation</h1>
          <p className="mt-1 text-sm font-normal text-zinc-500">
            Live breakdown of the 500 TB Enterprise plan across data types.
          </p>
        </div>

        {/* Hero: dominant metric + inline stats, banner-integrated */}
        <section aria-labelledby="hero-heading" className="min-w-0 rounded-2xl border border-zinc-200 bg-sky-50 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 id="hero-heading" className="text-sm font-medium text-zinc-600">
              Capacity allocated
            </h2>
            <div role="group" aria-label="Time period" className="inline-flex rounded-full border border-zinc-200 bg-white p-1">
              <button type="button" onClick={() => setPeriod("current")} aria-pressed={period === "current"} className={segmentClass(period === "current")}>
                Current
              </button>
              <button type="button" onClick={() => setPeriod("projected")} aria-pressed={period === "projected"} className={segmentClass(period === "projected")}>
                Projected 30d
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-baseline gap-3">
              <span className="font-[family-name:var(--font-display-mono)] text-6xl font-bold tabular-nums text-zinc-900 sm:text-7xl">
                {usedShare}%
              </span>
              <span className="text-base font-medium text-zinc-700">of the 500 TB plan allocated</span>
            </div>

            <dl className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-sky-200 pt-5 text-sm lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
              <div className="min-w-0">
                <dt className="font-medium text-zinc-600">Used</dt>
                <dd className="font-bold tabular-nums text-zinc-900">{usedTb} TB</dd>
              </div>
              <div className="min-w-0">
                <dt className="font-medium text-zinc-600">Free</dt>
                <dd className="font-bold tabular-nums text-zinc-900">{freeDatum.capacityTb} TB</dd>
              </div>
              <div className="min-w-0">
                <dt className="font-medium text-zinc-600">Total plan</dt>
                <dd className="font-bold tabular-nums text-zinc-900">{TOTAL_CAPACITY_TB} TB</dd>
              </div>
              <div className="min-w-0">
                <dt className="font-medium text-zinc-600">{period === "current" ? "30-day projection" : "vs. today"}</dt>
                <dd className="font-bold tabular-nums text-sky-700">{projectionNote}</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Waffle proof + legend */}
        <section aria-labelledby="waffle-heading" className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 id="waffle-heading" className="text-sm font-medium text-zinc-600">
            Allocation by data type — 100 cells, 1% each
          </h2>

          <div className="mt-4 flex flex-col gap-8 lg:flex-row">
            <div className="min-w-0 shrink-0">
              <div
                role="img"
                aria-label={chartAriaLabel}
                className="grid w-full max-w-[380px] grid-cols-10 gap-[3px] sm:gap-1"
              >
                {cells.map((catKey, i) => {
                  const cat = dataByKey[catKey];
                  const isActive = activeCategoryKey === catKey;
                  return (
                    <div
                      key={i}
                      aria-hidden="true"
                      onMouseEnter={() => setHoveredCategory(catKey)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      className={`aspect-square rounded-[2px] transition-[filter] motion-reduce:transition-none ${cat.swatch} ${
                        isActive ? "ring-2 ring-inset ring-white brightness-110" : ""
                      }`}
                    />
                  );
                })}
              </div>
              <p className="mt-3 text-xs font-normal text-zinc-500">
                Each cell represents 1% of the 500 TB plan ({TOTAL_CAPACITY_TB / 100} TB per cell).
              </p>
            </div>

            <div className="min-w-0 flex-1 space-y-4">
              <dl className="divide-y divide-zinc-100">
                {data.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div key={cat.key} className="flex items-center justify-between gap-3 py-2">
                      <dt className="flex min-w-0 items-center gap-2">
                        <button
                          type="button"
                          onMouseEnter={() => setHoveredCategory(cat.key)}
                          onMouseLeave={() => setHoveredCategory(null)}
                          onFocus={() => setHoveredCategory(cat.key)}
                          onBlur={() => setHoveredCategory(null)}
                          onClick={() => setSelectedCategory((prev) => (prev === cat.key ? null : cat.key))}
                          aria-pressed={selectedCategory === cat.key}
                          className={`flex min-w-0 items-center gap-2 rounded-md px-1.5 py-1 text-sm font-medium text-zinc-700 hover:bg-zinc-50 ${FOCUS}`}
                        >
                          <span className={`h-3 w-3 shrink-0 rounded-sm ${cat.swatch}`} aria-hidden="true" />
                          <Icon className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
                          <span className="truncate">{cat.label}</span>
                        </button>
                      </dt>
                      <dd className="shrink-0 whitespace-nowrap text-right text-sm text-zinc-900">
                        <span className="font-bold tabular-nums">{cat.share}%</span>
                        <span className="ml-2 font-normal tabular-nums text-zinc-500">{cat.capacityTb} TB</span>
                      </dd>
                    </div>
                  );
                })}
              </dl>

              <div aria-live="polite" className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm">
                {activeCategory ? (
                  <p className="font-medium text-zinc-700">
                    <activeCategory.icon className="mr-2 inline h-4 w-4 text-sky-600" aria-hidden="true" />
                    {activeCategory.label}: <span className="font-bold tabular-nums text-zinc-900">{activeCategory.share}%</span> of total
                    capacity — <span className="font-bold tabular-nums text-zinc-900">{activeCategory.capacityTb} TB</span> of {TOTAL_CAPACITY_TB} TB.
                  </p>
                ) : (
                  <p className="font-normal text-zinc-600">Hover or focus a category above to see its exact allocation.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Supporting breakdown table */}
        <section aria-labelledby="table-heading" className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 id="table-heading" className="text-sm font-medium text-zinc-600">
            Breakdown by data type
          </h2>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] table-fixed border-collapse text-sm">
              <caption className="sr-only font-normal">
                Storage allocation by data type for the {period === "current" ? "current" : "projected 30-day"} period, with
                share, capacity, and projected change.
              </caption>
              <colgroup>
                <col style={{ width: "8%" }} />
                <col style={{ width: "32%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "22%" }} />
                <col style={{ width: "18%" }} />
              </colgroup>
              <thead>
                <tr className="border-b border-zinc-200 text-left">
                  <th scope="col" className="py-2 font-medium text-zinc-600">
                    <span className="sr-only">Expand</span>
                  </th>
                  <th scope="col" className="py-2 font-medium text-zinc-600">
                    Data type
                  </th>
                  <th scope="col" aria-sort={sortAriaFor("share")} className="py-2 text-right font-medium text-zinc-600">
                    <button type="button" onClick={() => toggleSort("share")} className={`inline-flex items-center gap-1 rounded px-1 ${FOCUS}`}>
                      Share
                      {sortKey === "share" ? (
                        sortDir === "asc" ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400" />
                      )}
                    </button>
                  </th>
                  <th scope="col" aria-sort={sortAriaFor("capacityTb")} className="py-2 text-right font-medium text-zinc-600">
                    <button type="button" onClick={() => toggleSort("capacityTb")} className={`inline-flex items-center gap-1 rounded px-1 ${FOCUS}`}>
                      Capacity
                      {sortKey === "capacityTb" ? (
                        sortDir === "asc" ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="py-2 text-right font-medium text-zinc-600">
                    Projected Δ
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((row) => {
                  const other = PERIOD_DATA[period === "current" ? "projected" : "current"].find((d) => d.key === row.key)!;
                  const delta = period === "current" ? other.share - row.share : row.share - other.share;
                  const isExpanded = expandedCategory === row.key;
                  const isHighlighted = selectedCategory === row.key || hoveredCategory === row.key;
                  const rowId = `row-detail-${row.key}`;
                  const Icon = row.icon;
                  return (
                    <Fragment key={row.key}>
                      <tr
                        className={`border-b border-zinc-100 ${isHighlighted ? "bg-sky-50" : ""}`}
                      >
                        <td className="py-2">
                          <button
                            type="button"
                            aria-expanded={isExpanded}
                            aria-controls={rowId}
                            aria-label={`${isExpanded ? "Collapse" : "Expand"} details for ${row.label}`}
                            onClick={() => setExpandedCategory((prev) => (prev === row.key ? null : row.key))}
                            className={`flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 ${FOCUS}`}
                          >
                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </button>
                        </td>
                        <td className="py-2 font-normal text-zinc-900">
                          <span className="flex items-center gap-2">
                            <span className={`h-2.5 w-2.5 shrink-0 rounded-sm ${row.swatch}`} aria-hidden="true" />
                            <Icon className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
                            <span className="truncate">{row.label}</span>
                          </span>
                        </td>
                        <td className="py-2 whitespace-nowrap text-right font-bold tabular-nums text-zinc-900">{row.share}%</td>
                        <td className="py-2 whitespace-nowrap text-right font-normal tabular-nums text-zinc-700">{row.capacityTb} TB</td>
                        <td className="py-2 whitespace-nowrap text-right font-medium tabular-nums text-zinc-600">
                          {delta === 0 ? "—" : delta > 0 ? `+${delta} pts` : `${delta} pts`}
                        </td>
                      </tr>
                      {isExpanded ? (
                        <tr id={rowId} className="border-b border-zinc-100 bg-zinc-50">
                          <td className="py-3" />
                          <td colSpan={4} className="py-3 pr-2">
                            <p className="mb-1 text-xs font-medium text-zinc-600">Largest contributors</p>
                            <ul className="space-y-1">
                              {SUB_DETAILS[row.key].map((item) => (
                                <li key={item.label} className="flex items-center justify-between gap-3 text-xs font-normal text-zinc-600">
                                  <span className="truncate">{item.label}</span>
                                  <span className="whitespace-nowrap tabular-nums">{item.sizeTb} TB</span>
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
