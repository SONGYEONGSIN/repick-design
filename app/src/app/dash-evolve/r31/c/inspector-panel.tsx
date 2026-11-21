"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronRight } from "lucide-react";
import { grandTotal, ticketsFor, type Category, type Leaf, type Subcategory } from "./data";
import { StatusBadge, TrendIcon } from "./ui";

type SortKey = "opened" | "status";

export default function InspectorPanel({ cat, sub, leaf }: { cat: Category; sub: Subcategory; leaf: Leaf }) {
  const [sortKey, setSortKey] = useState<SortKey>("opened");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const tickets = useMemo(() => ticketsFor(leaf.id), [leaf.id]);
  const sorted = useMemo(() => {
    const copy = [...tickets];
    copy.sort((a, b) => {
      const cmp = sortKey === "status" ? a.status.localeCompare(b.status) : a.id.localeCompare(b.id);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [tickets, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const pct = Math.round((leaf.count / (grandTotal() || 1)) * 100);
  const columns: { key: SortKey; label: string }[] = [
    { key: "opened", label: "Opened" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="flex w-full min-w-0 shrink-0 flex-col gap-4 lg:w-80">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-[12px] text-zinc-500">
        <span>{cat.name}</span>
        <ChevronRight aria-hidden className="h-3 w-3" />
        <span>{sub.name}</span>
      </nav>

      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="text-[13px] font-semibold text-zinc-900">{leaf.name}</h2>
        <dl className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-zinc-500">Tickets</dt>
            <dd className="text-[18px] font-semibold tabular-nums text-zinc-900">{leaf.count}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-zinc-500">Share of total</dt>
            <dd className="text-[18px] font-semibold tabular-nums text-zinc-900">{pct}%</dd>
          </div>
        </dl>
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2 text-[12px] text-zinc-600">
          <TrendIcon trend={leaf.trend} />
          <span>
            {leaf.trend === "up" ? "Trending up" : leaf.trend === "down" ? "Trending down" : "Flat"} · last seen {leaf.lastSeen}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <h3 className="text-[12px] font-semibold text-zinc-900">Related tickets</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full table-fixed border-collapse" aria-label={`Related tickets for ${leaf.name}`}>
            <colgroup>
              <col className="w-[62%]" />
              <col className="w-[38%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-zinc-200">
                {columns.map((col) => {
                  const active = col.key === sortKey;
                  const ariaSort = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";
                  return (
                    <th key={col.key} scope="col" aria-sort={ariaSort as "ascending" | "descending" | "none"} className="py-1.5 text-left text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                      <button type="button" onClick={() => toggleSort(col.key)} className="inline-flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500">
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
              {sorted.map((t) => (
                <tr key={t.id} className="border-b border-zinc-100 last:border-0">
                  <td className="whitespace-nowrap py-1.5 text-[12px] text-zinc-700">{t.opened}</td>
                  <td className="whitespace-nowrap py-1.5">
                    <StatusBadge status={t.status} />
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
