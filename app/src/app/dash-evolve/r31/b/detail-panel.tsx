"use client";

import { useId, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronRight } from "lucide-react";
import type { Department, Team } from "./data";
import { StatusDot, cx } from "./ui";

type SortKey = "name" | "role" | "status";

export default function DetailPanel({
  dept,
  team,
  onSelectTeam,
}: {
  dept: Department;
  team: Team;
  onSelectTeam: (teamId: string) => void;
}) {
  const headingId = useId();
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sorted = useMemo(() => {
    const copy = [...team.members];
    copy.sort((a, b) => {
      const cmp = sortKey === "status" ? a.status.localeCompare(b.status) : a[sortKey].localeCompare(b[sortKey]);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [team.members, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const columns: { key: SortKey; label: string }[] = [
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="flex w-full min-w-0 shrink-0 flex-col gap-4 lg:w-80">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[12px] text-zinc-400">
        <span>All teams</span>
        <ChevronRight aria-hidden className="h-3 w-3" />
        <span>{dept.name}</span>
        <ChevronRight aria-hidden className="h-3 w-3" />
        <span className="font-medium text-zinc-50">{team.name}</span>
      </nav>

      <div className="rounded-xl border border-white/10 bg-zinc-900 p-4">
        <h2 id={headingId} className="text-[13px] font-semibold text-zinc-50">
          {dept.name} · {team.name}
        </h2>
        <dl className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-zinc-400">Headcount</dt>
            <dd className="text-[18px] font-semibold tabular-nums text-zinc-50">{team.headcount}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-zinc-400">Open roles</dt>
            <dd className="text-[18px] font-semibold tabular-nums text-zinc-50">{team.openPositions}</dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap gap-1.5" aria-label={`Teams in ${dept.name}, always visible headcount`}>
          {dept.teams.map((t) => {
            const active = t.id === team.id;
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={active}
                onClick={() => onSelectTeam(t.id)}
                className={cx(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400",
                  active ? "border-indigo-400/50 bg-indigo-500/20 text-indigo-200" : "border-white/10 text-zinc-400 hover:text-zinc-100"
                )}
              >
                {t.name} · {t.headcount}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-zinc-900 p-4">
        <h3 className="text-[12px] font-semibold text-zinc-50">Team roster</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full table-fixed border-collapse" aria-labelledby={headingId}>
            <colgroup>
              <col className="w-[42%]" />
              <col className="w-[36%]" />
              <col className="w-[22%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-white/10">
                {columns.map((col) => {
                  const active = col.key === sortKey;
                  const ariaSort = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";
                  return (
                    <th key={col.key} scope="col" aria-sort={ariaSort as "ascending" | "descending" | "none"} className="py-1.5 text-left text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                      <button type="button" onClick={() => toggleSort(col.key)} className="inline-flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400">
                        {col.label}
                        {active ? (
                          sortDir === "asc" ? (
                            <ArrowUp aria-hidden className="h-3 w-3" />
                          ) : (
                            <ArrowDown aria-hidden className="h-3 w-3" />
                          )
                        ) : (
                          <ArrowUpDown aria-hidden className="h-3 w-3 text-zinc-600" />
                        )}
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {sorted.map((m) => (
                <tr key={m.name} className="border-b border-white/5 last:border-0">
                  <td className="truncate py-1.5 text-[12px] text-zinc-200">{m.name}</td>
                  <td className="truncate py-1.5 text-[12px] text-zinc-400">{m.role}</td>
                  <td className="whitespace-nowrap py-1.5">
                    <StatusDot status={m.status} />
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
