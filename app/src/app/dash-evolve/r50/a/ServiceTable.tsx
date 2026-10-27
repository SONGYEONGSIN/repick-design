"use client";

import { useState } from "react";
import { ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";
import { CATEGORY_META, type Service, TIER_META, tierFromScore } from "./data";

type SortKey = "name" | "category" | "blast" | "risk" | "size";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

const COLS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Service" },
  { key: "category", label: "Category" },
  { key: "blast", label: "Blast radius" },
  { key: "risk", label: "Risk score" },
  { key: "size", label: "Dependents" },
];

/** Required fallback for the bubble chart — every bubble as a sortable row, never hidden behind
 *  hover. Sort state here is its own independently-scoped axis: it does not drive, and is not
 *  driven by, the chart's hover state or the queue's pinned selection. */
export function ServiceTable({
  services,
  hoveredId,
  onHover,
}: {
  services: Service[];
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("risk");
  const [asc, setAsc] = useState(false);

  const rows = [...services].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "name") cmp = a.name.localeCompare(b.name);
    else if (sortKey === "category") cmp = CATEGORY_META[a.category].label.localeCompare(CATEGORY_META[b.category].label);
    else if (sortKey === "blast") cmp = a.blastRadiusPct - b.blastRadiusPct;
    else if (sortKey === "risk") cmp = a.riskScore - b.riskScore;
    else cmp = a.dependentsTouched - b.dependentsTouched;
    return asc ? cmp : -cmp;
  });

  function toggle(key: SortKey) {
    if (key === sortKey) setAsc((v) => !v);
    else {
      setSortKey(key);
      setAsc(false);
    }
  }
  function ariaSort(key: SortKey): "ascending" | "descending" | "none" {
    if (key !== sortKey) return "none";
    return asc ? "ascending" : "descending";
  }
  function sortIcon(key: SortKey) {
    if (key !== sortKey) return <ArrowUpDown className="h-3 w-3 text-zinc-500" aria-hidden="true" />;
    return asc ? <ChevronUp className="h-3 w-3" aria-hidden="true" /> : <ChevronDown className="h-3 w-3" aria-hidden="true" />;
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 px-4 py-3">
        <h3 className="text-sm font-semibold text-zinc-900">Changed services — fallback table</h3>
        <p className="mt-0.5 text-xs font-normal text-zinc-600">
          Every bubble above as a row: service, blast radius, risk score, dependents touched.
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm font-normal text-zinc-500">No changed services match this filter.</p>
      ) : (
        <>
          {/* Mobile card list (below sm) */}
          <ul className="sm:hidden">
            {rows.map((s) => {
              const tier = tierFromScore(s.riskScore);
              const t = TIER_META[tier];
              return (
                <li
                  key={s.id}
                  onMouseEnter={() => onHover(s.id)}
                  onMouseLeave={() => onHover(null)}
                  className={`border-b border-zinc-100 px-4 py-3 last:border-0 transition-colors duration-150 ease-out ${hoveredId === s.id ? "bg-blue-50" : ""}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-zinc-900">{s.name}</p>
                    <span className={`flex-shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${t.bg} ${t.text} ${t.border}`}>
                      {tier}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-normal text-zinc-600">{CATEGORY_META[s.category].label}</p>
                  <p className="mt-1 flex items-center justify-between text-xs font-normal text-zinc-600">
                    <span className="tabular-nums">Blast {s.blastRadiusPct}%</span>
                    <span className="tabular-nums">Risk {s.riskScore}</span>
                    <span className="tabular-nums">{s.dependentsTouched} dep.</span>
                  </p>
                </li>
              );
            })}
          </ul>

          {/* Desktop table — table-fixed + % colgroup, min-w on the table element, no horizontal scroller */}
          <table className="hidden w-full table-fixed border-collapse text-sm sm:table">
            <caption className="sr-only">
              Changed services for the selected release, with blast radius, risk score and dependents touched; sortable by column
            </caption>
            <colgroup>
              <col style={{ width: "28%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "16%" }} />
            </colgroup>
            <thead>
              <tr className="border-b border-zinc-200">
                {COLS.map((c) => (
                  <th key={c.key} scope="col" aria-sort={ariaSort(c.key)} className="px-4 py-2.5 text-left font-normal">
                    <button
                      type="button"
                      onClick={() => toggle(c.key)}
                      className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-zinc-600 ${FOCUS_RING}`}
                    >
                      {c.label}
                      {sortIcon(c.key)}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => {
                const tier = tierFromScore(s.riskScore);
                const t = TIER_META[tier];
                return (
                  <tr
                    key={s.id}
                    onMouseEnter={() => onHover(s.id)}
                    onMouseLeave={() => onHover(null)}
                    className={`border-b border-zinc-100 last:border-0 transition-colors duration-150 ease-out ${hoveredId === s.id ? "bg-blue-50" : ""}`}
                  >
                    <td className="truncate px-4 py-2.5 font-medium text-zinc-900">{s.name}</td>
                    <td className="truncate px-4 py-2.5 font-normal text-zinc-600">{CATEGORY_META[s.category].label}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 font-normal tabular-nums text-zinc-900">{s.blastRadiusPct}%</td>
                    <td className="whitespace-nowrap px-4 py-2.5 font-normal">
                      <span className="tabular-nums text-zinc-900">{s.riskScore}</span>
                      <span className={`ml-2 rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${t.bg} ${t.text} ${t.border}`}>
                        {tier}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 font-normal tabular-nums text-zinc-900">{s.dependentsTouched}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
