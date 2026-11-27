"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { CheckCircle2, PauseCircle } from "lucide-react";
import type { FeatureFlag, SortDirection } from "./types";
import { ENVIRONMENT_LABEL } from "./data";
import { formatUpdated } from "./format";
import { ProgressBar, SegmentedControl, SortButton } from "./ui";

type StatusFilter = "all" | "active" | "paused";
type SortKey = "name" | "rollout" | "updated";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
];

export function FlagsTable({
  flags,
  highlightedId,
  registerRowRef,
}: {
  flags: FeatureFlag[];
  highlightedId: string | null;
  registerRowRef: (id: string, el: HTMLTableRowElement | null) => void;
}) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("updated");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const rows = useMemo(() => {
    const filtered = flags.filter((f) => statusFilter === "all" || f.status === statusFilter);
    const sorted = [...filtered].sort((a, b) => {
      let cmp: number;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name, "en-US");
      else if (sortKey === "rollout") cmp = a.rollout - b.rollout;
      else cmp = a.updatedHoursAgo - b.updatedHoursAgo;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [flags, statusFilter, sortKey, sortDir]);

  const ariaSortFor = (key: SortKey): "ascending" | "descending" | "none" =>
    key === sortKey ? (sortDir === "asc" ? "ascending" : "descending") : "none";

  return (
    <div>
      <div className="flex items-center justify-between gap-3 px-4 pt-3 pb-1 sm:px-5">
        <SegmentedControl options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} ariaLabel="Filter flags by status" />
        <span className="text-[11px] font-normal text-zinc-500 tabular-nums">
          {rows.length} of {flags.length}
        </span>
      </div>
      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[640px] table-fixed border-collapse">
          <caption className="sr-only">Feature flags, sortable by name, rollout, and last updated</caption>
          <colgroup>
            <col className="w-[30%]" />
            <col className="w-[14%]" />
            <col className="w-[12%]" />
            <col className="w-[18%]" />
            <col className="w-[16%]" />
            <col className="w-[10%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200">
              <th scope="col" aria-sort={ariaSortFor("name")} className="px-4 py-2 text-left sm:px-5">
                <SortButton active={sortKey === "name"} direction={sortDir} onClick={() => toggleSort("name")}>
                  Flag
                </SortButton>
              </th>
              <th scope="col" className="px-2 py-2 text-left text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
                Environment
              </th>
              <th scope="col" className="px-2 py-2 text-left text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
                Status
              </th>
              <th scope="col" aria-sort={ariaSortFor("rollout")} className="px-2 py-2 text-left">
                <SortButton active={sortKey === "rollout"} direction={sortDir} onClick={() => toggleSort("rollout")}>
                  Rollout
                </SortButton>
              </th>
              <th scope="col" className="px-2 py-2 text-left text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
                Owner
              </th>
              <th scope="col" aria-sort={ariaSortFor("updated")} className="px-2 py-2 text-right sm:pr-5">
                <SortButton active={sortKey === "updated"} direction={sortDir} onClick={() => toggleSort("updated")} align="right">
                  Updated
                </SortButton>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((flag) => {
              const isHighlighted = flag.id === highlightedId;
              return (
                <tr
                  key={flag.id}
                  ref={(el) => registerRowRef(flag.id, el)}
                  className={`transition-colors duration-150 ease-out ${isHighlighted ? "bg-emerald-50" : ""}`}
                >
                  <td className="min-w-0 px-4 py-2.5 sm:px-5">
                    <p className="truncate text-[13px] font-normal text-zinc-900">{flag.name}</p>
                    <p className="truncate text-[11px] font-normal text-zinc-500">{flag.key}</p>
                  </td>
                  <td className="px-2 py-2.5 text-[12px] font-normal whitespace-nowrap text-zinc-700">{ENVIRONMENT_LABEL[flag.environment]}</td>
                  <td className="px-2 py-2.5 whitespace-nowrap">
                    {flag.status === "active" ? (
                      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-zinc-500">
                        <PauseCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        Paused
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-8 shrink-0 text-[12px] font-normal tabular-nums text-zinc-700">{flag.rollout}%</span>
                      <ProgressBar value={flag.rollout} label={`${flag.name} rollout`} />
                    </div>
                  </td>
                  <td className="px-2 py-2.5">
                    <div className="flex items-center gap-2">
                      <Image
                        src={`https://images.unsplash.com/photo-${flag.ownerPhotoId}?q=80&w=96&auto=format&fit=facearea&facepad=2.5`}
                        alt={flag.ownerName}
                        width={22}
                        height={22}
                        className="shrink-0 rounded-full border border-zinc-200 object-cover"
                      />
                      <span className="truncate text-[12px] font-normal text-zinc-700">{flag.ownerName}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2.5 text-right text-[12px] font-normal whitespace-nowrap text-zinc-500 tabular-nums sm:pr-5">
                    {formatUpdated(flag.updatedHoursAgo)}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-[13px] font-normal text-zinc-500 sm:px-5">
                  No flags match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
