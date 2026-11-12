"use client";

import { useId, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { Batch, Vendor } from "./data";
import { StatusBadge, Sparkline } from "./ui";

type SortKey = "date" | "defectRate" | "status";

export default function InspectorPanel({ vendor, batches, trend }: { vendor: Vendor; batches: Batch[]; trend: number[] }) {
  const headingId = useId();
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = useMemo(() => {
    const copy = [...batches];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "date") cmp = a.id.localeCompare(b.id);
      else if (sortKey === "defectRate") cmp = a.defectRate - b.defectRate;
      else cmp = a.status.localeCompare(b.status);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [batches, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const period90 = vendor.periods[90];
  const sampleSize = batches.length;

  const columns: { key: SortKey; label: string }[] = [
    { key: "date", label: "Batch" },
    { key: "defectRate", label: "Defect %" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="flex w-full min-w-0 shrink-0 flex-col gap-4 lg:w-80">
      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 id={headingId} className="text-[13px] font-semibold text-zinc-900">
          {vendor.name}
        </h2>
        <p className="mt-0.5 text-[12px] text-zinc-500">{vendor.category}</p>

        <dl className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-zinc-500">90-day median</dt>
            <dd className="text-[18px] font-semibold tabular-nums text-zinc-900">{period90.median}%</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-zinc-500">Sample size</dt>
            <dd className="text-[18px] font-semibold tabular-nums text-zinc-900">{sampleSize}</dd>
          </div>
        </dl>

        <div className="mt-3 text-rose-500">
          <Sparkline values={trend} />
          <p className="mt-1 text-[11px] text-zinc-500">Defect rate across the last {trend.length} batches</p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <h3 className="text-[12px] font-semibold text-zinc-900">Recent batches</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full table-fixed border-collapse" aria-labelledby={headingId}>
            <colgroup>
              <col className="w-[34%]" />
              <col className="w-[28%]" />
              <col className="w-[38%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-zinc-200">
                {columns.map((col) => {
                  const active = col.key === sortKey;
                  const ariaSort = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";
                  return (
                    <th
                      key={col.key}
                      scope="col"
                      aria-sort={ariaSort as "ascending" | "descending" | "none"}
                      className="py-1.5 text-left text-[10px] font-semibold uppercase tracking-wide text-zinc-500"
                    >
                      <button
                        type="button"
                        onClick={() => toggleSort(col.key)}
                        className="inline-flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
                      >
                        {col.label}
                        {active ? (
                          sortDir === "asc" ? (
                            <ArrowUp aria-hidden className="h-3 w-3" />
                          ) : (
                            <ArrowDown aria-hidden className="h-3 w-3" />
                          )
                        ) : (
                          <ArrowUpDown aria-hidden className="h-3 w-3 text-zinc-300" />
                        )}
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {sorted.map((b) => (
                <tr key={b.id} className="border-b border-zinc-100 last:border-0">
                  <td className="whitespace-nowrap py-1.5 text-[12px] text-zinc-700">{b.date}</td>
                  <td className="whitespace-nowrap py-1.5 text-[12px] font-medium tabular-nums text-zinc-900">{b.defectRate}%</td>
                  <td className="whitespace-nowrap py-1.5">
                    <StatusBadge status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
