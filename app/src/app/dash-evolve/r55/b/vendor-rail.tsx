"use client";

import { useMemo, useState } from "react";
import { Search, CheckCircle2, X } from "lucide-react";
import type { ComplianceStatus, Vendor, VendorStats } from "./data";
import { formatMinutes } from "./data";
import { CompactBoxPlot } from "./box-plot";
import { ComplianceBadge, FilterChip, FOCUS_RING } from "./ui";

export interface VendorRow extends Vendor {
  stats: VendorStats;
}

type StatusFilter = "all" | ComplianceStatus;

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "breach", label: "Breach" },
  { value: "at-risk", label: "At risk" },
  { value: "compliant", label: "Compliant" },
];

/**
 * The vendor-list rail doubles as the dominant visualization: every row carries its own compact
 * box plot drawn on the exact same shared scale (see box-plot.tsx), so any two vendors are
 * directly comparable without opening anything. The search box and status chips are this
 * component's own real filter state — scoped entirely to which rows are visible here, never
 * touching the pinned vendor or the detail pane.
 */
export function VendorRailPanel({
  vendors,
  pinnedId,
  onPin,
}: {
  vendors: VendorRow[];
  pinnedId: string;
  onPin: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vendors.filter((v) => {
      if (statusFilter !== "all" && v.stats.status !== statusFilter) return false;
      if (!q) return true;
      return v.name.toLowerCase().includes(q) || v.category.toLowerCase().includes(q);
    });
  }, [vendors, query, statusFilter]);

  return (
    <div className="flex h-full min-w-0 w-full flex-col">
      <div className="shrink-0 min-w-0">
        <h2 className="truncate text-sm font-semibold text-zinc-900">Vendors</h2>
        <p className="mt-0.5 truncate text-[11px] text-zinc-500">
          {filtered.length} of {vendors.length} shown · shared response-time scale
        </p>

        <label className="sr-only" htmlFor="vendor-rail-search">
          Search vendors by name or category
        </label>
        <div className="mt-3 flex h-9 min-w-0 items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5">
          <Search className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden="true" />
          <input
            id="vendor-rail-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search vendors…"
            className={`min-w-0 flex-1 rounded bg-transparent text-sm text-zinc-900 placeholder:text-zinc-500 ${FOCUS_RING}`}
          />
        </div>

        <div role="group" aria-label="Filter vendors by compliance status" className="mt-2 flex min-w-0 flex-wrap gap-1.5">
          {STATUS_FILTERS.map((f) => (
            <FilterChip key={f.value} active={statusFilter === f.value} onClick={() => setStatusFilter(f.value)}>
              {f.label}
            </FilterChip>
          ))}
        </div>
      </div>

      <ul className="mt-3 min-w-0 flex-1 overflow-y-auto overscroll-contain">
        {filtered.length === 0 ? (
          <li className="rounded-lg border border-dashed border-zinc-200 px-3 py-4 text-center text-sm text-zinc-500">
            No vendors match this filter.
          </li>
        ) : (
          filtered.map((vendor) => {
            const isPinned = vendor.id === pinnedId;
            return (
              <li key={vendor.id} className="min-w-0 py-1">
                {/* The card itself is a plain div, never a <button> — CompactBoxPlot below renders
                   its own focusable handles, and a <button> cannot validly contain another
                   interactive control (browsers silently break nested buttons apart). The pin
                   action lives on its own button covering just the name/category/badge row. */}
                <div
                  className={`min-w-0 rounded-lg border px-3 py-2.5 transition-colors motion-reduce:transition-none ${
                    isPinned ? "border-orange-300 bg-orange-50/60 ring-2 ring-orange-700" : "border-zinc-200"
                  }`}
                >
                  <button
                    type="button"
                    aria-current={isPinned ? "true" : undefined}
                    onClick={() => onPin(vendor.id)}
                    className={`block w-full min-w-0 rounded-md text-left transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                      isPinned ? "" : "hover:bg-zinc-50"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-1.5">
                      {isPinned ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-orange-800" aria-hidden="true" /> : null}
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900">{vendor.name}</span>
                    </div>
                    <div className="mt-0.5 flex min-w-0 items-center justify-between gap-2">
                      <span className="min-w-0 truncate text-[11px] text-zinc-500">{vendor.category}</span>
                      <ComplianceBadge status={vendor.stats.status} className="shrink-0" />
                    </div>
                  </button>

                  <div className="mt-2">
                    <CompactBoxPlot stats={vendor.stats} target={vendor.targetMinutes} vendorName={vendor.name} />
                  </div>

                  {/* Persistent visible text — median and SLA target are never hover-gated. */}
                  <div className="mt-1 flex min-w-0 items-baseline justify-between gap-1.5 whitespace-nowrap text-[11px] text-zinc-600">
                    <span className="truncate tabular-nums">
                      <span className="font-semibold text-zinc-900">{formatMinutes(vendor.stats.p50)}</span> median
                    </span>
                    <span className="shrink-0 truncate tabular-nums text-zinc-600">
                      {formatMinutes(vendor.stats.p10)}–{formatMinutes(vendor.stats.p90)}
                    </span>
                    <span className="shrink-0 tabular-nums text-zinc-600">SLA {formatMinutes(vendor.targetMinutes)}</span>
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

/** Mobile-only overlay for the vendor rail (the rail itself is a fixed desktop column from
 * `lg:` up). Pinning a vendor here also closes the drawer, so the detail pane is immediately
 * visible underneath. */
export function MobileVendorRail({
  open,
  onClose,
  vendors,
  pinnedId,
  onPin,
}: {
  open: boolean;
  onClose: () => void;
  vendors: VendorRow[];
  pinnedId: string;
  onPin: (id: string) => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button type="button" aria-label="Close vendor list" onClick={onClose} className="absolute inset-0 bg-zinc-900/40" />
      <aside className="absolute inset-y-0 left-0 flex w-80 max-w-[88vw] min-w-0 flex-col border-r border-zinc-200 bg-white p-4 shadow-sm">
        <div className="mb-1 flex shrink-0 justify-end">
          <button
            type="button"
            aria-label="Close vendor list"
            onClick={onClose}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 ${FOCUS_RING}`}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <VendorRailPanel
          vendors={vendors}
          pinnedId={pinnedId}
          onPin={(id) => {
            onPin(id);
            onClose();
          }}
        />
      </aside>
    </div>
  );
}
