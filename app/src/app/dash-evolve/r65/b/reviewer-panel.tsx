"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { FOCUS_RING } from "./ui";
import { REVIEWERS } from "./data";

type SortKey = "decisions" | "accuracyPct";
type SortDir = "asc" | "desc";

interface ReviewerPanelProps {
  headingId: string;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ReviewerPanel({ headingId }: ReviewerPanelProps) {
  const [sortKey, setSortKey] = useState<SortKey>("decisions");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const teamAvgAccuracy = useMemo(() => {
    const total = REVIEWERS.reduce((sum, r) => sum + r.accuracyPct, 0);
    return total / REVIEWERS.length;
  }, []);

  const sorted = useMemo(() => {
    const copy = [...REVIEWERS];
    copy.sort((a, b) => {
      const diff = a[sortKey] - b[sortKey];
      return sortDir === "asc" ? diff : -diff;
    });
    return copy;
  }, [sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function ariaSortFor(key: SortKey): "ascending" | "descending" | "none" {
    if (sortKey !== key) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  }

  function sortIconFor(sortKeyName: SortKey) {
    if (sortKey !== sortKeyName) return <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />;
    return sortDir === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-orange-700" aria-hidden="true" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-orange-700" aria-hidden="true" />
    );
  }

  return (
    <section aria-labelledby={headingId} className="min-w-0 space-y-4">
      <h2 id={headingId} className="text-lg font-bold text-zinc-900">
        Reviewer performance
      </h2>

      <div className="rounded-lg border border-zinc-200 bg-white p-3.5">
        <p className="text-xs font-medium text-zinc-500">Team avg. decision accuracy</p>
        <p className="mt-1 text-xl font-bold tabular-nums text-zinc-900">{teamAvgAccuracy.toFixed(1)}%</p>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="sr-only">
            Reviewer leaderboard: decisions made today and decision accuracy, sortable by column
          </caption>
          <colgroup>
            <col style={{ width: "48%" }} />
            <col style={{ width: "26%" }} />
            <col style={{ width: "26%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th scope="col" className="px-2 py-2.5 text-left text-xs font-medium text-zinc-500 sm:px-3">
                Reviewer
              </th>
              <th scope="col" aria-sort={ariaSortFor("decisions")} className="py-1 text-right">
                <button
                  type="button"
                  onClick={() => toggleSort("decisions")}
                  className={`flex h-9 w-full items-center justify-end gap-1 rounded px-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 ${FOCUS_RING}`}
                >
                  Decisions
                  {sortIconFor("decisions")}
                </button>
              </th>
              <th scope="col" aria-sort={ariaSortFor("accuracyPct")} className="py-1 text-right">
                <button
                  type="button"
                  onClick={() => toggleSort("accuracyPct")}
                  className={`flex h-9 w-full items-center justify-end gap-1 rounded px-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 ${FOCUS_RING}`}
                >
                  Accuracy
                  {sortIconFor("accuracyPct")}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((reviewer, idx) => (
              <tr key={reviewer.id} className={idx === 0 ? "bg-orange-50" : ""}>
                <th scope="row" className="px-2 py-2.5 text-left font-normal sm:px-3">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-bold text-zinc-700">
                      {initials(reviewer.name)}
                    </span>
                    <span className="min-w-0 truncate text-sm text-zinc-800">{reviewer.name}</span>
                  </span>
                </th>
                <td className="px-1.5 py-2.5 text-right tabular-nums text-zinc-700">{reviewer.decisions}</td>
                <td className="px-1.5 py-2.5 text-right tabular-nums text-zinc-700">{reviewer.accuracyPct.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
