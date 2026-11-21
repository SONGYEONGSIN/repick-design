"use client";

import { useMemo, useState } from "react";
import { AXES, VENDOR_LIST, metricsFor, type Period, type VendorId } from "./data";
import { formatCurrency, formatSigned } from "./format";
import { statusFor } from "./status";
import { FOCUS_RING, SortHeader, StatusBadge } from "./ui";

/**
 * The mandated accessibility fallback for the parallel-coordinates chart above: every vendor,
 * every metric, as exact sortable numbers in a real `<table>`. It is a sibling panel in the same
 * document flow (not behind a toggle, not revealed only by JS state), reachable by scrolling or
 * by Tab like any other content, and it never depends on hovering or clicking anything in the
 * chart to read a value.
 */

type SortColumn = "name" | "cost" | "seats" | "utilization" | "risk" | "sla" | "priceChange";

interface SortState {
  column: SortColumn;
  direction: "asc" | "desc";
}

function valueFor(id: VendorId, period: Period, column: SortColumn): number | string {
  const vendor = VENDOR_LIST.find((v) => v.id === id)!;
  if (column === "name") return vendor.name;
  const m = metricsFor(id, period);
  if (column === "cost") return m.cost;
  if (column === "seats") return m.seats;
  if (column === "utilization") return m.utilizationPct;
  if (column === "risk") return m.riskScore;
  if (column === "sla") return m.slaRating;
  return m.priceChangePct;
}

export function VendorTable({ period }: { period: Period }) {
  const [sort, setSort] = useState<SortState>({ column: "risk", direction: "desc" });
  const [atRiskOnly, setAtRiskOnly] = useState(false);

  function toggleSort(column: SortColumn) {
    setSort((prev) => (prev.column === column ? { column, direction: prev.direction === "asc" ? "desc" : "asc" } : { column, direction: "desc" }));
  }

  const rows = useMemo(() => {
    const base = VENDOR_LIST.filter((v) => !atRiskOnly || statusFor(v, period) === "at-risk");
    const sorted = [...base].sort((a, b) => {
      const av = valueFor(a.id, period, sort.column);
      const bv = valueFor(b.id, period, sort.column);
      const cmp = typeof av === "string" || typeof bv === "string" ? String(av).localeCompare(String(bv)) : (av as number) - (bv as number);
      return sort.direction === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [period, sort, atRiskOnly]);

  const periodLabel = period === "current" ? "current renewal cycle" : "prior renewal cycle";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-semibold text-sm text-zinc-900">All vendor contracts</h2>
          <p className="mt-0.5 max-w-xl font-normal text-xs text-zinc-500">
            The exact figures behind the chart above — sortable by any column, filterable to at-risk contracts only.
          </p>
        </div>
        <button
          type="button"
          aria-pressed={atRiskOnly}
          onClick={() => setAtRiskOnly((v) => !v)}
          className={`min-h-9 shrink-0 rounded-lg border px-3 font-medium text-xs motion-safe:transition-colors ${FOCUS_RING} ${
            atRiskOnly ? "border-rose-200 bg-rose-50 text-rose-700" : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
          }`}
        >
          {atRiskOnly ? `At-risk only (${rows.length} of ${VENDOR_LIST.length})` : "Show at-risk only"}
        </button>
      </div>

      {/* Desktop / tablet: real sortable table. */}
      <div className="mt-3 hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[720px] table-fixed border-collapse">
          <caption className="mb-2 text-left font-normal text-xs text-zinc-500">
            Six vendor contracts compared across six metrics for the {periodLabel}. Click a column heading to sort; use the toggle above to show
            only contracts flagged at-risk.
          </caption>
          <colgroup>
            <col className="w-[22%]" />
            <col className="w-[13%]" />
            <col className="w-[10%]" />
            <col className="w-[11%]" />
            <col className="w-[10%]" />
            <col className="w-[9%]" />
            <col className="w-[13%]" />
            <col className="w-[12%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200">
              <SortHeader label="Vendor" active={sort.column === "name"} dir={sort.direction} onSort={() => toggleSort("name")} />
              <SortHeader label={AXES[0].label} active={sort.column === "cost"} dir={sort.direction} onSort={() => toggleSort("cost")} align="right" />
              <SortHeader label={AXES[1].label} active={sort.column === "seats"} dir={sort.direction} onSort={() => toggleSort("seats")} align="right" />
              <SortHeader
                label={AXES[2].label}
                active={sort.column === "utilization"}
                dir={sort.direction}
                onSort={() => toggleSort("utilization")}
                align="right"
              />
              <SortHeader label={AXES[3].label} active={sort.column === "risk"} dir={sort.direction} onSort={() => toggleSort("risk")} align="right" />
              <SortHeader label={AXES[4].label} active={sort.column === "sla"} dir={sort.direction} onSort={() => toggleSort("sla")} align="right" />
              <SortHeader
                label={AXES[5].label}
                active={sort.column === "priceChange"}
                dir={sort.direction}
                onSort={() => toggleSort("priceChange")}
                align="right"
              />
              <th scope="col" className="px-2 py-2 text-left font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((v) => {
              const m = metricsFor(v.id, period);
              const status = statusFor(v, period);
              return (
                <tr key={v.id} className="hover:bg-zinc-50">
                  <th scope="row" className="px-2 py-2.5 text-left font-medium text-sm text-zinc-900">
                    <span className="block truncate">{v.name}</span>
                    <span className="block truncate font-normal text-xs text-zinc-500">{v.category}</span>
                  </th>
                  <td className="px-2 py-2.5 text-right font-normal text-sm tabular-nums text-zinc-900">{formatCurrency(m.cost)}</td>
                  <td className="px-2 py-2.5 text-right font-normal text-sm tabular-nums text-zinc-900">{m.seats}</td>
                  <td className="px-2 py-2.5 text-right font-normal text-sm tabular-nums text-zinc-900">{m.utilizationPct}%</td>
                  <td className="px-2 py-2.5 text-right font-normal text-sm tabular-nums text-zinc-900">{m.riskScore}</td>
                  <td className="px-2 py-2.5 text-right font-normal text-sm tabular-nums text-zinc-900">{m.slaRating.toFixed(1)}</td>
                  <td className="px-2 py-2.5 text-right font-normal text-sm tabular-nums text-zinc-900">{formatSigned(m.priceChangePct)}%</td>
                  <td className="px-2 py-2.5 text-left">
                    <StatusBadge status={status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: card list. Six columns of a dense table cannot fit at 390px without a second
          horizontal scroller on the page, so mobile gets a stacked alternative instead. */}
      <ul className="mt-3 space-y-2 sm:hidden">
        {rows.map((v) => {
          const m = metricsFor(v.id, period);
          const status = statusFor(v, period);
          return (
            <li key={v.id} className="rounded-lg border border-zinc-200 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-medium text-sm text-zinc-900">{v.name}</p>
                  <p className="truncate font-normal text-xs text-zinc-500">{v.category}</p>
                </div>
                <StatusBadge status={status} className="shrink-0" />
              </div>
              <dl className="mt-2 grid grid-cols-3 gap-2">
                {AXES.map((axis) => (
                  <div key={axis.id} className="min-w-0">
                    <dt className="font-semibold text-[10px] uppercase tracking-[0.06em] text-zinc-500">{axis.shortLabel}</dt>
                    <dd className="mt-0.5 font-medium text-xs tabular-nums text-zinc-900">{axis.format(axis.accessor(m))}</dd>
                  </div>
                ))}
              </dl>
            </li>
          );
        })}
      </ul>

      {rows.length === 0 ? <p className="mt-3 rounded-lg bg-zinc-50 px-3 py-6 text-center font-normal text-sm text-zinc-500">No contracts match this filter.</p> : null}
    </div>
  );
}
