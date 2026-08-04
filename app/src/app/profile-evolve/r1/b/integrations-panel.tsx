"use client";

import { CalendarDays, ChevronDown, PackageSearch, ShieldCheck, Sparkles, Star, Users, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  CATEGORY_LABELS,
  INTEGRATIONS,
  SORT_OPTIONS,
  STATUS_FILTERS,
  TOTAL_INSTALLS,
  formatCount,
  sortIntegrations,
  type CategoryKey,
  type IntegrationStatus,
  type SortKey,
} from "./data";
import IntegrationMark from "./integration-mark";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

const STATUS_META: Record<IntegrationStatus, { icon: typeof ShieldCheck; className: string }> = {
  Verified: { icon: ShieldCheck, className: "text-amber-400" },
  Beta: { icon: Sparkles, className: "text-zinc-300" },
  Community: { icon: Users, className: "text-zinc-300" },
};

export default function IntegrationsPanel({
  activeCategory,
  onClearCategory,
}: {
  activeCategory: CategoryKey | null;
  onClearCategory: () => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("installs");
  const [statusFilter, setStatusFilter] = useState<IntegrationStatus | "all">("all");

  const filtered = useMemo(() => {
    let items = INTEGRATIONS;
    if (activeCategory) items = items.filter((i) => i.category === activeCategory);
    if (statusFilter !== "all") items = items.filter((i) => i.status === statusFilter);
    return sortIntegrations(items, sortKey);
  }, [activeCategory, statusFilter, sortKey]);

  return (
    <section aria-labelledby="integrations-heading" className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 id="integrations-heading" className="text-lg font-semibold text-zinc-50">
            Published integrations
          </h2>
          <p className="mt-1 text-sm font-normal text-zinc-400">
            <span className="font-medium tabular-nums text-zinc-200">{INTEGRATIONS.length}</span> integrations &middot;{" "}
            <span className="font-medium tabular-nums text-zinc-200">{formatCount(TOTAL_INSTALLS)}</span> installs total
          </p>
        </div>

        <div className="relative">
          <label htmlFor="sort-integrations" className="sr-only">
            Sort integrations
          </label>
          <select
            id="sort-integrations"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className={`appearance-none rounded-lg border border-zinc-800 bg-zinc-950 py-2 pl-3 pr-9 text-sm font-medium text-zinc-100 ${FOCUS}`}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((s) => {
            const active = statusFilter === s;
            return (
              <button
                key={s}
                type="button"
                aria-pressed={active}
                onClick={() => setStatusFilter(s)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${FOCUS} ${
                  active
                    ? "border-amber-400 bg-amber-500/15 text-amber-300"
                    : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700 hover:text-zinc-50"
                }`}
              >
                {s === "all" ? "All statuses" : s}
              </button>
            );
          })}
        </div>

        {activeCategory ? (
          <button
            type="button"
            onClick={onClearCategory}
            className={`inline-flex items-center gap-1 rounded-full border border-amber-400 bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-300 ${FOCUS}`}
          >
            {CATEGORY_LABELS[activeCategory]}
            <X aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="sr-only">Clear category filter</span>
          </button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 px-6 py-14 text-center">
          <PackageSearch aria-hidden="true" className="h-9 w-9 text-zinc-400" />
          <p className="mt-3 text-sm font-semibold text-zinc-50">No integrations match these filters</p>
          <p className="mt-1 max-w-sm text-sm font-normal text-zinc-400">
            Try a different status, or clear the category filter to see the full list again.
          </p>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => {
            const meta = STATUS_META[item.status];
            const StatusIcon = meta.icon;
            return (
              <li key={item.slug} className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 transition-colors hover:border-zinc-700">
                <div className="flex items-start gap-3">
                  <IntegrationMark slug={item.slug} category={item.category} className="h-11 w-11 shrink-0" />
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold leading-snug text-zinc-50">{item.name}</h3>
                    <p className="mt-0.5 text-xs font-normal text-zinc-400">{CATEGORY_LABELS[item.category]}</p>
                  </div>
                </div>

                <p className="mt-3 text-sm font-normal leading-relaxed text-zinc-300">{item.description}</p>

                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-normal text-zinc-400">
                  <span className="inline-flex items-center gap-1">
                    <span className="font-medium tabular-nums text-zinc-100">{formatCount(item.installs)}</span> installs
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Star aria-hidden="true" className="h-3.5 w-3.5 text-amber-400" />
                    <span className="font-medium tabular-nums text-zinc-100">{item.rating.toFixed(1)}</span>
                    <span className="tabular-nums">({formatCount(item.reviews)})</span>
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-t border-zinc-800 pt-3 text-xs font-normal">
                  <span className={`inline-flex shrink-0 items-center gap-1 ${meta.className}`}>
                    <StatusIcon aria-hidden="true" className="h-3.5 w-3.5" />
                    {item.status}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-zinc-400">
                    <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
                    Updated {item.updatedLabel}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
