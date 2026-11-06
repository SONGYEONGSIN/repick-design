"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, ArrowDownRight, ChevronUp, ChevronDown, ListFilter, Search, X } from "lucide-react";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  INCIDENTS,
  formatDate,
  formatSignedCompactUSD,
  type CategoryId,
  type Incident,
  type StoreId,
} from "./data";
import { Avatar, Card, Pill, SegmentedControl, cn, FOCUS_RING } from "./ui";

type SortKey = "id" | "category" | "impact" | "loggedDate";
type SortDir = "asc" | "desc";

const CATEGORY_OPTIONS: { id: CategoryId | "all"; label: string }[] = [
  { id: "all", label: "All categories" },
  ...CATEGORY_ORDER.map((id) => ({ id, label: CATEGORY_META[id].label })),
];

type StatusFilterId = "all" | "open";

const STATUS_OPTIONS: { id: StatusFilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "open", label: "Open only" },
];

function SortHeader({
  label,
  sortKey,
  active,
  dir,
  onSort,
  className,
}: {
  label: string;
  sortKey: SortKey;
  active: boolean;
  dir: SortDir;
  onSort: (key: SortKey) => void;
  className?: string;
}) {
  return (
    <th
      scope="col"
      aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
      className={cn("px-3 py-2.5 text-[11px] font-medium uppercase tracking-wide text-zinc-400", className)}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "inline-flex items-center gap-1 rounded py-1.5 transition-colors motion-reduce:transition-none hover:text-zinc-100",
          FOCUS_RING,
          active && "text-zinc-100",
        )}
      >
        {label}
        <span className="flex flex-col leading-none">
          <ChevronUp className={cn("h-2.5 w-2.5", active && dir === "asc" ? "text-teal-300" : "text-zinc-400")} aria-hidden="true" />
          <ChevronDown className={cn("-mt-0.5 h-2.5 w-2.5", active && dir === "desc" ? "text-teal-300" : "text-zinc-400")} aria-hidden="true" />
        </span>
      </button>
    </th>
  );
}

export function IncidentsTable({ storeId, storeName }: { storeId: StoreId; storeName: string }) {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<CategoryId | "all">("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilterId>("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: "impact", dir: "asc" });

  const storeIncidents = useMemo(() => INCIDENTS.filter((i) => i.storeId === storeId), [storeId]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = storeIncidents.filter((incident) => {
      const matchesCategory = filterCategory === "all" || incident.category === filterCategory;
      const matchesStatus = statusFilter === "all" || incident.status === statusFilter;
      const matchesSearch = q === "" || incident.description.toLowerCase().includes(q) || incident.investigator.toLowerCase().includes(q);
      return matchesCategory && matchesStatus && matchesSearch;
    });
    const sorted = [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sort.key === "id") cmp = a.id.localeCompare(b.id);
      else if (sort.key === "category") cmp = a.category.localeCompare(b.category);
      else if (sort.key === "impact") cmp = a.impact - b.impact;
      else cmp = a.loggedDate.localeCompare(b.loggedDate);
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [storeIncidents, search, filterCategory, statusFilter, sort]);

  function toggleSort(key: SortKey) {
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  }

  const hasFilters = filterCategory !== "all" || search !== "" || statusFilter !== "all";

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-base font-semibold text-zinc-50">Incident ledger</h2>
          <p className="text-sm text-zinc-400">{storeName} — logged shrink events this quarter.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SegmentedControl label="Status filter" options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} />
          <label className="relative block w-full sm:w-auto">
            <span className="sr-only">Search incidents</span>
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search incidents…"
              className={cn(
                "h-10 w-full rounded-lg border border-white/10 bg-zinc-950 pl-8 pr-3 text-sm text-zinc-50 placeholder:text-zinc-400 sm:w-48",
                FOCUS_RING,
              )}
            />
          </label>
          <label className="relative">
            <span className="sr-only">Filter by category</span>
            <ListFilter className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as CategoryId | "all")}
              className={cn(
                "h-10 appearance-none rounded-lg border border-white/10 bg-zinc-950 py-0 pl-8 pr-8 text-sm text-zinc-50",
                FOCUS_RING,
              )}
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
          </label>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilterCategory("all");
                setStatusFilter("all");
              }}
              className={cn("inline-flex h-10 items-center gap-1 rounded-lg px-2.5 text-sm text-zinc-400 hover:text-zinc-100", FOCUS_RING)}
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Outside the clipped scroller on purpose: an `sr-only` node left
          inside an `overflow-x-auto` container paints at un-scrolled
          coordinates and can pollute `document.scrollWidth` at narrow
          viewports. */}
      <div className="sr-only" id={`incident-table-desc-${storeId}`}>
        Incident-level shrink events for {storeName}, sortable by column and filterable by category and status.
      </div>

      <div className="overflow-x-auto">
        <table aria-describedby={`incident-table-desc-${storeId}`} className="w-full table-fixed border-collapse text-left text-sm">
          <colgroup>
            <col style={{ width: "8%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "19%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "9%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-white/10">
              <SortHeader label="ID" sortKey="id" active={sort.key === "id"} dir={sort.dir} onSort={toggleSort} />
              <th scope="col" className="px-3 py-2.5 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                Description
              </th>
              <SortHeader label="Category" sortKey="category" active={sort.key === "category"} dir={sort.dir} onSort={toggleSort} />
              <SortHeader label="Impact" sortKey="impact" active={sort.key === "impact"} dir={sort.dir} onSort={toggleSort} className="text-right" />
              <th scope="col" className="px-3 py-2.5 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                Investigator
              </th>
              <th scope="col" className="px-3 py-2.5 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                Status
              </th>
              <SortHeader label="Logged" sortKey="loggedDate" active={sort.key === "loggedDate"} dir={sort.dir} onSort={toggleSort} />
            </tr>
          </thead>
          <tbody>
            {rows.map((incident) => (
              <IncidentRow key={incident.id} incident={incident} />
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-10 text-center text-sm text-zinc-400">
                  No incidents match this search and filter combination.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 text-xs text-zinc-400 sm:px-6">
        <span>
          Showing {rows.length} of {storeIncidents.length} incidents
        </span>
      </div>
    </Card>
  );
}

function IncidentRow({ incident }: { incident: Incident }) {
  const meta = CATEGORY_META[incident.category];
  const CategoryIcon = meta.icon;
  const up = incident.impact >= 0;
  const AmountIcon = up ? ArrowUpRight : ArrowDownRight;

  return (
    <tr className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
      <td className="truncate px-3 py-2.5 font-mono text-xs tabular-nums text-zinc-400">{incident.id}</td>
      <td className="truncate px-3 py-2.5 text-zinc-200">{incident.description}</td>
      <td className="overflow-hidden px-3 py-2.5">
        <Pill tone={meta.direction === "up" ? "up" : "down"}>
          <CategoryIcon className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span className="min-w-0 truncate">{meta.label}</span>
        </Pill>
      </td>
      <td className="overflow-hidden px-3 py-2.5 text-right">
        <span
          className={cn(
            "inline-flex max-w-full items-center justify-end gap-0.5 overflow-hidden whitespace-nowrap font-medium tabular-nums",
            up ? "text-emerald-300" : "text-rose-300",
          )}
        >
          <AmountIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {formatSignedCompactUSD(incident.impact)}
        </span>
      </td>
      <td className="overflow-hidden px-3 py-2.5">
        <span className="flex items-center gap-2">
          <Avatar name={incident.investigator} />
          <span className="min-w-0 flex-1 truncate text-zinc-300">{incident.investigator}</span>
        </span>
      </td>
      <td className="overflow-hidden px-3 py-2.5">
        <Pill tone={incident.status === "resolved" ? "up" : "watch"}>
          {incident.status === "resolved" ? "Resolved" : "Open"}
        </Pill>
      </td>
      <td className="truncate px-3 py-2.5 text-zinc-400">{formatDate(incident.loggedDate)}</td>
    </tr>
  );
}
