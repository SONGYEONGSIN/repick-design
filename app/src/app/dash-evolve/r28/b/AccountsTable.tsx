"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ListFilter,
  ChevronUp,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  X,
} from "lucide-react";
import {
  ACCOUNTS,
  CATEGORY_META,
  formatDate,
  formatSignedThousands,
  type Account,
  type CategoryId,
} from "./data";
import { Card, Pill, cn, FOCUS_RING } from "./ui";

type SortKey = "name" | "category" | "arrImpact" | "lastActivity";
type SortDir = "asc" | "desc";

const CATEGORY_OPTIONS: { id: CategoryId | "all"; label: string }[] = [
  { id: "all", label: "All categories" },
  ...(Object.keys(CATEGORY_META) as CategoryId[]).map((id) => ({
    id,
    label: CATEGORY_META[id].label,
  })),
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
      className={cn("px-3 py-2.5 text-xs font-semibold text-zinc-500", className)}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "inline-flex items-center gap-1 rounded py-1.5 transition-colors hover:text-zinc-900",
          FOCUS_RING,
          active && "text-zinc-900",
        )}
      >
        {label}
        <span className="flex flex-col leading-none">
          <ChevronUp
            className={cn("h-2.5 w-2.5", active && dir === "asc" ? "text-cyan-600" : "text-zinc-300")}
            aria-hidden="true"
          />
          <ChevronDown
            className={cn(
              "-mt-0.5 h-2.5 w-2.5",
              active && dir === "desc" ? "text-cyan-600" : "text-zinc-300",
            )}
            aria-hidden="true"
          />
        </span>
      </button>
    </th>
  );
}

export function AccountsTable({ activeCategory }: { activeCategory: CategoryId | null }) {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<CategoryId | "all">("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
    key: "arrImpact",
    dir: "desc",
  });

  // Seeds the filter from a pinned bridge step. The dropdown stays a
  // fully independent control afterwards — this only fires again when
  // the pin itself changes, so a manual filter choice in between is
  // never overwritten.
  useEffect(() => {
    setFilterCategory(activeCategory ?? "all");
  }, [activeCategory]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = ACCOUNTS.filter((a) => {
      const matchesCategory = filterCategory === "all" || a.category === filterCategory;
      const matchesSearch = q === "" || a.name.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
    const sorted = [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sort.key === "name") cmp = a.name.localeCompare(b.name);
      else if (sort.key === "category") cmp = a.category.localeCompare(b.category);
      else if (sort.key === "arrImpact") cmp = a.arrImpact - b.arrImpact;
      else cmp = a.lastActivity.localeCompare(b.lastActivity);
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [search, filterCategory, sort]);

  function toggleSort(key: SortKey) {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "name" || key === "category" ? "asc" : "desc" },
    );
  }

  const hasFilters = filterCategory !== "all" || search !== "";

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-zinc-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">Account activity</h2>
          <p className="text-sm text-zinc-500">This quarter's ARR movements, by customer.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative block w-full sm:w-auto">
            <span className="sr-only">Search accounts</span>
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
              aria-hidden="true"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search accounts…"
              className={cn(
                "h-10 w-full rounded-lg border border-zinc-200 bg-white pl-8 pr-3 text-sm text-zinc-800 placeholder:text-zinc-500 sm:w-48",
                FOCUS_RING,
              )}
            />
          </label>
          <label className="relative">
            <span className="sr-only">Filter by category</span>
            <ListFilter
              className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
              aria-hidden="true"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as CategoryId | "all")}
              className={cn(
                "h-10 appearance-none rounded-lg border border-zinc-200 bg-white py-0 pl-8 pr-8 text-sm text-zinc-800",
                FOCUS_RING,
              )}
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400"
              aria-hidden="true"
            />
          </label>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilterCategory("all");
              }}
              className={cn(
                "inline-flex h-10 items-center gap-1 rounded-lg px-2.5 text-sm text-zinc-500 hover:text-zinc-900",
                FOCUS_RING,
              )}
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] table-fixed border-collapse text-left text-sm">
          <caption className="sr-only">
            Account-level ARR movements for the current quarter, sortable by column and filterable
            by category.
          </caption>
          <colgroup>
            <col style={{ width: "26%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "21%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "15%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-100">
              <SortHeader label="Account" sortKey="name" active={sort.key === "name"} dir={sort.dir} onSort={toggleSort} />
              <th scope="col" className="px-3 py-2.5 text-xs font-semibold text-zinc-500">
                Plan
              </th>
              <SortHeader
                label="Category"
                sortKey="category"
                active={sort.key === "category"}
                dir={sort.dir}
                onSort={toggleSort}
              />
              <SortHeader
                label="ARR impact"
                sortKey="arrImpact"
                active={sort.key === "arrImpact"}
                dir={sort.dir}
                onSort={toggleSort}
                className="text-right"
              />
              <th scope="col" className="px-3 py-2.5 text-xs font-semibold text-zinc-500">
                Owner
              </th>
              <SortHeader
                label="Last activity"
                sortKey="lastActivity"
                active={sort.key === "lastActivity"}
                dir={sort.dir}
                onSort={toggleSort}
              />
            </tr>
          </thead>
          <tbody>
            {rows.map((account) => (
              <AccountRow key={account.id} account={account} />
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-10 text-center text-sm text-zinc-500">
                  No accounts match this search and filter combination.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-zinc-100 px-5 py-3 text-xs text-zinc-500 sm:px-6">
        <span>
          Showing {rows.length} of {ACCOUNTS.length} accounts
        </span>
      </div>
    </Card>
  );
}

function AccountRow({ account }: { account: Account }) {
  const meta = CATEGORY_META[account.category];
  const CategoryIcon = meta.icon;
  const up = account.arrImpact >= 0;
  const AmountIcon = up ? ArrowUpRight : ArrowDownRight;

  return (
    <tr className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/70">
      <td className="truncate px-3 py-2.5 font-medium text-zinc-900">{account.name}</td>
      <td className="px-3 py-2.5 text-zinc-500">{account.segment}</td>
      <td className="px-3 py-2.5">
        <Pill tone={meta.direction === "up" ? "up" : "down"}>
          <CategoryIcon className="h-3 w-3" aria-hidden="true" />
          <span className="truncate">{meta.label}</span>
        </Pill>
      </td>
      <td className="px-3 py-2.5 text-right">
        <span
          className={cn(
            "inline-flex items-center justify-end gap-0.5 whitespace-nowrap font-medium tabular-nums",
            up ? "text-emerald-700" : "text-rose-700",
          )}
        >
          <AmountIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {formatSignedThousands(account.arrImpact)}
        </span>
      </td>
      <td className="truncate px-3 py-2.5 text-zinc-600">{account.owner}</td>
      <td className="whitespace-nowrap px-3 py-2.5 text-zinc-600">
        {formatDate(account.lastActivity)}
      </td>
    </tr>
  );
}
