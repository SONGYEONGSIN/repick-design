"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Pin } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import { AXIS_WEIGHTS, type AxisDef, type VendorDef, type VendorId } from "./data";
import {
  compositeForView,
  formatComposite,
  formatScore,
  valueForView,
  type ViewMode,
} from "./format";

interface ComparisonTableProps {
  vendors: VendorDef[];
  axes: AxisDef[];
  view: ViewMode;
  pinnedId: VendorId;
  onPin: (id: VendorId) => void;
}

type SortKey = string; // AxisId value or "composite"

const STATUS_STYLE: Record<VendorDef["status"], string> = {
  Preferred: "bg-rose-50 text-rose-700",
  Secondary: "bg-zinc-100 text-zinc-600",
  Approved: "bg-zinc-100 text-zinc-600",
};

function SortIcon({ active, dir }: { active: boolean; dir: "ascending" | "descending" }) {
  if (!active) return <ArrowUpDown className="h-3 w-3 shrink-0 text-zinc-400" aria-hidden="true" />;
  return dir === "ascending" ? (
    <ArrowUp className="h-3 w-3 shrink-0 text-rose-600" aria-hidden="true" />
  ) : (
    <ArrowDown className="h-3 w-3 shrink-0 text-rose-600" aria-hidden="true" />
  );
}

export default function ComparisonTable({ vendors, axes, view, pinnedId, onPin }: ComparisonTableProps) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"ascending" | "descending">("descending");

  const valueFor = useMemo(
    () =>
      (vendor: VendorDef, key: SortKey): number =>
        key === "composite"
          ? compositeForView(vendor, view)
          : valueForView(key as AxisDef["id"], vendor.scores[key as AxisDef["id"]], view),
    [view],
  );

  const sortedVendors = useMemo(() => {
    if (!sortKey) return vendors;
    const copy = [...vendors];
    copy.sort((a, b) => {
      const diff = valueFor(a, sortKey) - valueFor(b, sortKey);
      return sortDir === "ascending" ? diff : -diff;
    });
    return copy;
  }, [vendors, sortKey, sortDir, valueFor]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "ascending" ? "descending" : "ascending"));
    } else {
      setSortKey(key);
      setSortDir("descending");
    }
  }

  function ariaSortFor(key: SortKey): "ascending" | "descending" | "none" {
    return sortKey === key ? sortDir : "none";
  }

  return (
    <div>
      {/* Desktop / tablet: real table, sortable by axis or composite. */}
      <table className="hidden w-full table-fixed border-collapse sm:table">
        <caption className="sr-only">
          Supplier evaluation scores across six axes on a 0–100 scale, plus the weighted composite
          score. Select a column header to sort.
        </caption>
        <colgroup>
          <col style={{ width: "22%" }} />
          {axes.map((axis) => (
            <col key={axis.id} style={{ width: "11%" }} />
          ))}
          <col style={{ width: "12%" }} />
        </colgroup>
        <thead>
          <tr className="border-b border-zinc-200">
            <th scope="col" className="px-3 py-2.5 text-left align-bottom">
              <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                Supplier
              </span>
            </th>
            {axes.map((axis) => (
              <th
                key={axis.id}
                scope="col"
                aria-sort={ariaSortFor(axis.id)}
                className="px-2 py-2.5 align-bottom"
              >
                <button
                  type="button"
                  onClick={() => handleSort(axis.id)}
                  title={axis.label}
                  className="ml-auto flex items-center gap-1 rounded text-right text-[11px] font-medium uppercase leading-tight tracking-wide text-zinc-500 motion-safe:transition-colors hover:text-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                >
                  <span className="text-wrap">
                    <span aria-hidden="true">{axis.shortLabel}</span>
                    <span className="sr-only">{axis.label}</span>
                  </span>
                  <SortIcon active={sortKey === axis.id} dir={sortDir} />
                </button>
              </th>
            ))}
            <th scope="col" aria-sort={ariaSortFor("composite")} className="px-3 py-2.5 align-bottom">
              <button
                type="button"
                onClick={() => handleSort("composite")}
                className="ml-auto flex items-center gap-1 rounded text-right text-[11px] font-medium uppercase leading-tight tracking-wide text-zinc-500 motion-safe:transition-colors hover:text-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              >
                <span className="text-wrap">Composite</span>
                <SortIcon active={sortKey === "composite"} dir={sortDir} />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedVendors.map((vendor) => {
            const isPinned = vendor.id === pinnedId;
            return (
              <tr
                key={vendor.id}
                className={`border-b border-zinc-100 motion-safe:transition-colors hover:bg-zinc-50 ${
                  isPinned ? "bg-rose-50/50" : ""
                }`}
              >
                <th scope="row" className="px-3 py-3 text-left align-middle font-normal">
                  <button
                    type="button"
                    aria-pressed={isPinned}
                    onClick={() => onPin(vendor.id)}
                    className="flex w-full items-center gap-2.5 rounded text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[11px] font-semibold text-zinc-700">
                      {vendor.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5">
                        <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900">
                          {vendor.shortName}
                        </span>
                        {isPinned ? (
                          <Pin className="h-3 w-3 shrink-0 fill-rose-600 text-rose-600" aria-hidden="true" />
                        ) : null}
                      </span>
                      <span
                        className={`mt-0.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${STATUS_STYLE[vendor.status]}`}
                      >
                        {vendor.status}
                      </span>
                    </span>
                  </button>
                </th>
                {axes.map((axis) => (
                  <td key={axis.id} className="px-2 py-3 text-right align-middle">
                    <span className="tabular-nums text-sm font-normal text-zinc-700">
                      {formatScore(valueForView(axis.id, vendor.scores[axis.id], view))}
                    </span>
                  </td>
                ))}
                <td className="px-3 py-3 text-right align-middle">
                  <span className="tabular-nums text-sm font-semibold text-zinc-900">
                    {formatComposite(compositeForView(vendor, view))}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Mobile: stacked cards — the table's columns cannot shrink further
          without breaking label widths, so below sm this swaps shape
          entirely rather than forcing a horizontal scroller. */}
      <ul className="space-y-3 sm:hidden">
        {sortedVendors.map((vendor) => {
          const isPinned = vendor.id === pinnedId;
          return (
            <li
              key={vendor.id}
              className={`rounded-lg border p-3 ${isPinned ? "border-rose-200 bg-rose-50/50" : "border-zinc-200 bg-white"}`}
            >
              <button
                type="button"
                aria-pressed={isPinned}
                onClick={() => onPin(vendor.id)}
                className="flex w-full items-center gap-2.5 rounded text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700">
                  {vendor.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900">
                      {vendor.shortName}
                    </span>
                    {isPinned ? (
                      <Pin className="h-3 w-3 shrink-0 fill-rose-600 text-rose-600" aria-hidden="true" />
                    ) : null}
                  </span>
                  <span
                    className={`mt-0.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${STATUS_STYLE[vendor.status]}`}
                  >
                    {vendor.status}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-base font-semibold tabular-nums text-zinc-900">
                    {formatComposite(compositeForView(vendor, view))}
                  </span>
                  <span className="block text-[11px] font-normal text-zinc-600">composite</span>
                </span>
              </button>
              <dl className="mt-3 grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5 rounded bg-zinc-50 px-2 py-1.5">
                {axes.map((axis) => (
                  <Fragment key={axis.id}>
                    <dt className="min-w-0 truncate text-[11px] font-medium uppercase tracking-wide text-zinc-600">
                      {axis.shortLabel}
                    </dt>
                    <dd className="shrink-0 justify-self-end tabular-nums text-sm font-normal text-zinc-800">
                      {formatScore(valueForView(axis.id, vendor.scores[axis.id], view))}
                    </dd>
                  </Fragment>
                ))}
              </dl>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs font-normal text-zinc-500">
        Composite weighting: {axes.map((a) => `${a.shortLabel} ${Math.round(AXIS_WEIGHTS[a.id] * 100)}%`).join(" · ")}.
      </p>
    </div>
  );
}
