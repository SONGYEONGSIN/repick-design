"use client";

/**
 * Cohort breakdown table — the ONE consumer driven by the funnel's pinned
 * stage (see the exclusion note in dashboard-client.tsx). Real client-side
 * sort (every column, ascending/descending, `aria-sort` kept in sync) and a
 * real channel filter, both backed by plain component state, no re-fetching.
 */

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown, Filter } from "lucide-react";
import { Badge, Card, SelectMenu } from "./ui";
import {
  COHORT_DATA,
  COHORT_KIND,
  COHORT_SCOPE_LABEL,
  COHORT_TOTAL_LABEL,
  PERIOD_META,
  STAGE_META,
  cohortTotal,
  formatCount,
  formatPct,
  shareOfTotal,
  type Channel,
  type CohortRow,
  type PeriodId,
  type StageId,
} from "./data";

type SortKey = "reason" | "channel" | "count" | "share";
type SortDir = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string; numeric: boolean; defaultDir: SortDir }[] = [
  { key: "reason", label: "Reason", numeric: false, defaultDir: "asc" },
  { key: "channel", label: "Channel", numeric: false, defaultDir: "asc" },
  { key: "count", label: "Users", numeric: true, defaultDir: "desc" },
  { key: "share", label: "Share", numeric: true, defaultDir: "desc" },
];

function sortRows(rows: (CohortRow & { share: number })[], key: SortKey, dir: SortDir) {
  const sign = dir === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    if (key === "reason") return a.reason.localeCompare(b.reason) * sign;
    if (key === "channel") return a.channel.localeCompare(b.channel) * sign;
    if (key === "count") return (a.count - b.count) * sign;
    return (a.share - b.share) * sign;
  });
}

export function CohortTable({ period, stageId }: { period: PeriodId; stageId: StageId }) {
  const [sortKey, setSortKey] = useState<SortKey>("count");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [channelFilter, setChannelFilter] = useState<Channel | "all">("all");

  const rawRows = COHORT_DATA[period][stageId];
  const total = cohortTotal(rawRows);
  const rowsWithShare = useMemo(
    () => rawRows.map((r) => ({ ...r, share: shareOfTotal(r.count, total) })),
    [rawRows, total]
  );

  const channels = useMemo(() => {
    const seen = new Set<Channel>();
    rawRows.forEach((r) => seen.add(r.channel));
    return Array.from(seen);
  }, [rawRows]);

  const filteredRows = channelFilter === "all" ? rowsWithShare : rowsWithShare.filter((r) => r.channel === channelFilter);
  const sortedRows = sortRows(filteredRows, sortKey, sortDir);

  const kind = COHORT_KIND[stageId];
  const stageLabel = STAGE_META[stageId].label;
  const scopeLabel = COHORT_SCOPE_LABEL[stageId];
  const totalLabel = COHORT_TOTAL_LABEL[stageId];

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(COLUMNS.find((c) => c.key === key)?.defaultDir ?? "desc");
    }
  }

  const channelOptions: { value: Channel | "all"; label: string }[] = [
    { value: "all", label: "All channels" },
    ...channels.map((c) => ({ value: c, label: c })),
  ];

  return (
    <Card className="flex flex-col p-5 sm:p-6">
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge tone={kind === "dropoff" ? "negative" : "positive"}>{kind === "dropoff" ? "Drop-off" : "Composition"}</Badge>
            <span className="text-xs text-zinc-400">Pinned: {stageLabel}</span>
          </div>
          <h2 className="mt-1.5 text-base font-bold text-zinc-50">{scopeLabel}</h2>
          <p className="mt-0.5 text-sm text-zinc-400">
            <span className="tabular-nums text-zinc-200">{formatCount(total)}</span> {totalLabel}
          </p>
        </div>
        {/* Deliberately its own left-aligned row at every width (not pushed to the
            far side of a wide header) so the popover below it never has to reach
            far across the card — keeps it inside the card at 390px through 1920px. */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-zinc-500" aria-hidden />
          <SelectMenu
            ariaLabel="Filter cohort table by acquisition channel"
            triggerLabel="Channel"
            value={channelFilter}
            options={channelOptions}
            onChange={setChannelFilter}
          />
        </div>
      </div>

      <div className="relative mt-5 overflow-x-hidden">
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="sr-only">
            Cohort breakdown for {scopeLabel}, {PERIOD_META[period].range}, sorted by {sortKey} {sortDir === "asc" ? "ascending" : "descending"}
            {channelFilter !== "all" ? `, filtered to the ${channelFilter} channel` : ""}.
          </caption>
          <colgroup>
            <col className="w-[36%]" />
            <col className="w-[22%]" />
            <col className="w-[21%]" />
            <col className="w-[21%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-white/10">
              {COLUMNS.map((col) => {
                const active = col.key === sortKey;
                const ariaSort = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";
                const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ChevronsUpDown;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={ariaSort}
                    className={`py-2 font-medium text-zinc-400 ${col.numeric ? "text-right" : "text-left"}`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      className={`inline-flex items-center gap-1 rounded px-1 py-0.5 text-[11px] font-medium uppercase tracking-[0.06em] transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 ${
                        col.numeric ? "flex-row-reverse" : ""
                      } ${active ? "text-zinc-100" : "text-zinc-400 hover:text-zinc-200"}`}
                    >
                      {col.label}
                      <Icon className="h-3 w-3" aria-hidden />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedRows.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-sm text-zinc-400">
                  No reasons match the selected channel.
                </td>
              </tr>
            ) : (
              sortedRows.map((row) => (
                <tr key={`${row.reason}-${row.channel}`} className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.03]">
                  <td className="py-2.5 pr-3 align-top text-zinc-200">{row.reason}</td>
                  <td className="py-2.5 pr-3 align-top text-zinc-400">{row.channel}</td>
                  <td className="whitespace-nowrap py-2.5 pr-1 text-right align-top tabular-nums text-zinc-200">
                    {formatCount(row.count)}
                  </td>
                  <td className="whitespace-nowrap py-2.5 text-right align-top tabular-nums text-zinc-400">
                    {formatPct(row.share)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-zinc-400">
        <span className="font-medium text-zinc-300">Note: </span>
        Share is each reason&rsquo;s percentage of the full {formatCount(total)}-user total above, even while a channel filter narrows which rows are shown.
      </p>
    </Card>
  );
}
