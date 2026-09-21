"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { type CrewSummary, formatCount, formatPercent, FOCUS_RING } from "./data";

interface CrewTableProps {
  crews: CrewSummary[];
}

type SortDir = "asc" | "desc";

export default function CrewTable({ crews }: CrewTableProps) {
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(
    () => [...crews].sort((a, b) => (sortDir === "desc" ? b.utilizationPct - a.utilizationPct : a.utilizationPct - b.utilizationPct)),
    [crews, sortDir]
  );

  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-zinc-50">Crew utilization</h2>
      <p className="mt-0.5 text-xs text-zinc-400">Share of the current 14-day window each crew has a job in progress.</p>

      <div className="mt-3 min-w-0 overflow-x-auto">
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="sr-only">Active job count, current utilization, and next available date for each field crew</caption>
          <colgroup>
            <col style={{ width: "30%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "34%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-white/10 text-left text-xs text-zinc-400">
              <th scope="col" className="py-2 pr-2 font-medium">
                Crew
              </th>
              <th scope="col" className="py-2 pr-2 text-right font-medium">
                Active jobs
              </th>
              <th scope="col" aria-sort={sortDir === "desc" ? "descending" : "ascending"} className="py-2 pr-2 font-medium">
                <button
                  type="button"
                  onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
                  className={`flex min-h-6 items-center gap-1 rounded py-1 ${FOCUS_RING}`}
                >
                  This-week utilization
                  <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                </button>
              </th>
              <th scope="col" className="py-2 pl-2 text-right font-medium">
                Next available
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sorted.map((crew) => (
              <tr key={crew.name} className="text-zinc-200">
                <th scope="row" className="py-2.5 pr-2 text-left font-medium text-zinc-50">
                  {crew.name}
                </th>
                <td className="py-2.5 pr-2 text-right tabular-nums text-zinc-300">{formatCount(crew.activeJobs)}</td>
                <td className="py-2.5 pr-2">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-white/10 sm:w-24">
                      <div
                        className="h-full rounded-full bg-cyan-400"
                        style={{ width: `${crew.utilizationPct}%` }}
                      />
                    </div>
                    <span className="shrink-0 whitespace-nowrap tabular-nums text-zinc-300">{formatPercent(crew.utilizationPct)}</span>
                  </div>
                </td>
                <td className="py-2.5 pl-2 text-right whitespace-nowrap tabular-nums text-zinc-300">{crew.nextAvailableLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
