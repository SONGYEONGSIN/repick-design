"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { STATUS_LABEL, VENDORS, type VendorStatus } from "./data";
import { SegmentedControl, StatusBadge } from "./ui";

type SortColumn = "name" | "region" | "status" | "contractEndSort";
type SortDirection = "asc" | "desc";
type StatusFilter = "all" | VendorStatus;

const STATUS_FILTERS: readonly StatusFilter[] = ["all", "active", "renewal-due", "expired"];

const COLUMNS: readonly { key: SortColumn; label: string }[] = [
  { key: "name", label: "Vendor" },
  { key: "region", label: "Region" },
  { key: "status", label: "Status" },
  { key: "contractEndSort", label: "Contract end" },
];

/**
 * Independent vendor directory. This table keeps its own sort/filter
 * state and reads the same VENDORS roster as box-plot-strip.tsx only
 * because both describe the same supplier base — there is no shared
 * "selected vendor" id, no hover sync, and no re-filtering triggered by
 * hovering or focusing a box above. Neither component imports state from
 * the other. Per the brief's fan-out guidance, zero shared selection
 * state outranks even a bare shared id, so resist the temptation to wire
 * these together "to be helpful."
 */
export function VendorTable() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortColumn, setSortColumn] = useState<SortColumn>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const filtered = VENDORS.filter((v) => {
    if (statusFilter !== "all" && v.status !== statusFilter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      v.name.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q) ||
      v.contact.toLowerCase().includes(q) ||
      v.region.toLowerCase().includes(q)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortColumn === "name") cmp = a.name.localeCompare(b.name);
    else if (sortColumn === "region") cmp = a.region.localeCompare(b.region);
    else if (sortColumn === "status") cmp = a.status.localeCompare(b.status);
    else cmp = a.contractEndSort - b.contractEndSort;
    return sortDirection === "asc" ? cmp : -cmp;
  });

  function toggleSort(column: SortColumn) {
    if (column === sortColumn) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  }

  function ariaSortFor(column: SortColumn): "ascending" | "descending" | "none" {
    if (sortColumn !== column) return "none";
    return sortDirection === "asc" ? "ascending" : "descending";
  }

  function SortIcon({ column }: { column: SortColumn }) {
    if (sortColumn !== column) return <ArrowUpDown className="size-3.5" aria-hidden="true" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="size-3.5" aria-hidden="true" />
    ) : (
      <ArrowDown className="size-3.5" aria-hidden="true" />
    );
  }

  return (
    <section id="vendor-directory" aria-labelledby="directory-heading" className="min-w-0 scroll-mt-6">
      <div className="flex flex-wrap items-end justify-between gap-4 pb-4">
        <div className="min-w-0">
          <h2
            id="directory-heading"
            className="text-sm font-semibold uppercase tracking-wide text-zinc-50"
          >
            Vendor directory
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            Contact and contract details for every vendor on file — a separate widget from the
            chart above, with its own sort and filter state.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative block">
            <span className="sr-only">Search vendors</span>
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-zinc-400"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search vendor, category, contact…"
              className="h-9 w-56 rounded-md border border-white/10 bg-zinc-900 pl-8 pr-3 text-xs text-zinc-50 placeholder:text-zinc-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            />
          </label>
          <SegmentedControl
            options={STATUS_FILTERS}
            value={statusFilter}
            onChange={setStatusFilter}
            getLabel={(s) => (s === "all" ? "All" : STATUS_LABEL[s])}
            ariaLabel="Filter by contract status"
          />
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-white/10 sm:block">
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="caption-top bg-zinc-900/60 px-4 py-3 text-left text-xs text-zinc-400">
            {sorted.length} of {VENDORS.length} vendors shown. Sortable by vendor, region, status
            and contract end — not synced to the box-plot strip above.
          </caption>
          <colgroup>
            <col style={{ width: "28%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "17%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "30%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              {COLUMNS.map((col) => (
                <th key={col.key} scope="col" aria-sort={ariaSortFor(col.key)} className="px-4 py-2.5 text-left">
                  <button
                    type="button"
                    onClick={() => toggleSort(col.key)}
                    className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-zinc-400 hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                  >
                    {col.label}
                    <SortIcon column={col.key} />
                  </button>
                </th>
              ))}
              <th scope="col" className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                Contact
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {sorted.map((v) => (
              <tr key={v.id} className="align-top">
                <td className="px-4 py-3">
                  <span className="block truncate text-sm font-medium text-zinc-50">{v.name}</span>
                  <span className="block truncate text-xs text-zinc-400">{v.category}</span>
                </td>
                <td className="px-4 py-3 text-sm text-zinc-300">{v.region}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={v.status} />
                </td>
                <td className="px-4 py-3 text-sm tabular-nums text-zinc-300">{v.contractEnd}</td>
                <td className="px-4 py-3">
                  <span className="block truncate text-sm text-zinc-300">{v.contact}</span>
                  <span className="block truncate text-xs text-zinc-400">{v.email}</span>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-zinc-400">
                  No vendors match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ul className="flex flex-col gap-3 sm:hidden">
        {sorted.map((v) => (
          <li key={v.id} className="rounded-xl border border-white/10 bg-zinc-900/60 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-50">{v.name}</p>
                <p className="truncate text-xs text-zinc-400">
                  {v.category} · {v.region}
                </p>
              </div>
              <StatusBadge status={v.status} />
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <dt className="text-zinc-400">Contract end</dt>
                <dd className="tabular-nums text-zinc-300">{v.contractEnd}</dd>
              </div>
              <div>
                <dt className="text-zinc-400">Contact</dt>
                <dd className="truncate text-zinc-300">{v.contact}</dd>
              </div>
            </dl>
          </li>
        ))}
        {sorted.length === 0 && (
          <li className="rounded-xl border border-white/10 p-6 text-center text-sm text-zinc-400">
            No vendors match these filters.
          </li>
        )}
      </ul>
    </section>
  );
}
