"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, ArrowUpDown, Trophy } from "lucide-react";
import type { Period, Rep } from "./data";
import { REPS } from "./data";
import { FOCUS, FieldLabel, Sparkline } from "./ui";

type SortKey = "name" | "calls" | "talk" | "win";
type SortDir = "asc" | "desc";

function repsForPeriod(period: Period): { rep: Rep; calls: number }[] {
  return REPS.map((rep) => ({ rep, calls: period === "week" ? rep.callsWeek : rep.callsMonth }));
}

function sortValue(row: { rep: Rep; calls: number }, key: SortKey): number | string {
  switch (key) {
    case "name":
      return row.rep.name;
    case "calls":
      return row.calls;
    case "talk":
      return row.rep.avgTalkRatio;
    case "win":
      return row.rep.winRatePct;
  }
}

const SORTABLE_COLUMNS: { key: SortKey; label: string; width: string }[] = [
  { key: "name", label: "Rep", width: "32%" },
  { key: "calls", label: "Calls", width: "14%" },
  { key: "talk", label: "Talk ratio", width: "18%" },
  { key: "win", label: "Win rate", width: "16%" },
];

/**
 * Team leaderboard table — part of the Coaching Digest body, so it is period-scoped (its "Calls"
 * column reads `period`) but never selection-scoped: it is completely unaffected by which call is
 * pinned in the Spotlight card above.
 */
export function Leaderboard({ period, periodLabel }: { period: Period; periodLabel: string }) {
  const [sortKey, setSortKey] = useState<SortKey>("win");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const rows = useMemo(() => repsForPeriod(period), [period]);

  const sorted = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = sortValue(a, sortKey);
      const bv = sortValue(b, sortKey);
      if (typeof av === "string" && typeof bv === "string") return av.localeCompare(bv) * dir;
      return ((av as number) - (bv as number)) * dir;
    });
  }, [rows, sortKey, sortDir]);

  const topPerformer = useMemo(
    () => REPS.reduce((best, r) => (r.winRatePct > best.winRatePct ? r : best), REPS[0]),
    [],
  );

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <div className="min-w-0">
      <FieldLabel>Team leaderboard — {periodLabel}</FieldLabel>

      <div className="mt-2 flex min-w-0 items-center gap-3 rounded-xl border border-sky-400/20 bg-sky-400/[6%] px-4 py-3">
        <Trophy className="h-4 w-4 shrink-0 text-sky-400" aria-hidden="true" />
        <Image
          src={`https://images.unsplash.com/photo-${topPerformer.avatarId}`}
          alt={`Portrait of ${topPerformer.name}`}
          width={24}
          height={24}
          className="h-6 w-6 shrink-0 rounded-full object-cover"
        />
        <p className="min-w-0 flex-1 truncate text-sm font-normal text-zinc-300">
          Top performer by win rate — <span className="font-medium text-zinc-50">{topPerformer.name}</span>{" "}
          at <span className="font-mono font-medium tabular-nums text-sky-400">{topPerformer.winRatePct}%</span>
        </p>
      </div>

      <div className="mt-3 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full table-fixed border-collapse max-lg:min-w-[520px]" aria-label={`Team leaderboard, ${periodLabel}`}>
          <colgroup>
            {SORTABLE_COLUMNS.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
            <col style={{ width: "20%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-white/10 bg-white/[3%]">
              {SORTABLE_COLUMNS.map((col) => {
                const active = sortKey === col.key;
                const ariaSort: "ascending" | "descending" | "none" = active
                  ? sortDir === "asc"
                    ? "ascending"
                    : "descending"
                  : "none";
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={ariaSort}
                    className={`px-3 py-2.5 font-normal ${col.key === "name" ? "text-left" : "text-right"}`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      className={`${FOCUS} inline-flex min-h-[24px] items-center gap-1 rounded px-0.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400 hover:text-zinc-50 ${
                        col.key === "name" ? "" : "flex-row-reverse"
                      }`}
                    >
                      {col.label}
                      {active ? (
                        sortDir === "asc" ? (
                          <ArrowUp className="h-3 w-3" aria-hidden="true" />
                        ) : (
                          <ArrowDown className="h-3 w-3" aria-hidden="true" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 opacity-50" aria-hidden="true" />
                      )}
                    </button>
                  </th>
                );
              })}
              <th scope="col" className="px-3 py-2.5 text-right font-normal">
                <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400">8-wk trend</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(({ rep, calls }) => (
              <tr key={rep.id} className="border-b border-white/5 last:border-0">
                <td className="px-3 py-2.5 align-middle">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Image
                      src={`https://images.unsplash.com/photo-${rep.avatarId}`}
                      alt={`Portrait of ${rep.name}`}
                      width={28}
                      height={28}
                      className="h-7 w-7 shrink-0 rounded-full object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-zinc-50">{rep.name}</span>
                      <span className="block truncate text-xs font-normal text-zinc-400">{rep.role}</span>
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-right align-middle font-mono text-sm font-normal tabular-nums text-zinc-50">
                  {calls}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-right align-middle font-mono text-sm font-normal tabular-nums text-zinc-50">
                  {rep.avgTalkRatio}%
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-right align-middle font-mono text-sm font-normal tabular-nums text-zinc-50">
                  {rep.winRatePct}%
                </td>
                <td className="px-3 py-2.5 text-right align-middle">
                  <Sparkline trend={rep.trend} className="ml-auto text-sky-400" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
