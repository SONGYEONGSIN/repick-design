"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Phone, Mail, Users, CalendarCheck, X } from "lucide-react";
import type { Deal, PeriodId, RankedRep } from "../lib/data";
import { PERIOD_META, TEAM_META } from "../lib/data";
import { formatPct, formatUSD, formatInt, cn } from "../lib/format";
import { Avatar, Badge, Card, EyebrowLabel, ProgressBar, RankChangeIndicator, StageBadge } from "./ui";
import TrendChart from "./TrendChart";

type SortKey = "company" | "value" | "closeDate" | "probability";
type SortDir = "asc" | "desc";

const MONTH_RANK: Record<string, number> = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };

function dateRank(date: string): number {
  const match = /^(\w{3})\s+(\d{1,2})$/.exec(date);
  if (!match) return 0;
  const [, mon, day] = match;
  return (MONTH_RANK[mon] ?? 0) * 100 + Number(day);
}

function compareDeals(a: Deal, b: Deal, key: SortKey): number {
  switch (key) {
    case "company":
      return a.company.localeCompare(b.company);
    case "value":
      return a.value - b.value;
    case "closeDate":
      return dateRank(a.closeDate) - dateRank(b.closeDate);
    case "probability":
      return a.probability - b.probability;
    default:
      return 0;
  }
}

function SortableHeader({
  label,
  active,
  dir,
  onClick,
  className = "",
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
  className?: string;
}) {
  return (
    <th scope="col" aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"} className={cn("py-2 font-medium", className)}>
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        {label}
        {active ? (
          dir === "asc" ? (
            <ArrowUp className="h-3 w-3" aria-hidden="true" />
          ) : (
            <ArrowDown className="h-3 w-3" aria-hidden="true" />
          )
        ) : null}
      </button>
    </th>
  );
}

export default function RepDetailDrawer({
  entry,
  period,
  onClose,
}: {
  entry: RankedRep;
  period: PeriodId;
  onClose: () => void;
}) {
  const { rep, rank, stat } = entry;
  const [sortKey, setSortKey] = useState<SortKey>("closeDate");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Defer focus to the next tick rather than focusing synchronously in
    // this effect. The drawer is frequently opened by a keydown handler
    // (row click's Enter/Space activation, or the command palette's Enter
    // key). If the close button receives DOM focus while that same native
    // key event is still completing (keydown already fired; keyup has not),
    // the browser can treat the impending keyup as activating the
    // newly-focused button — instantly closing the drawer it just opened.
    const t = window.setTimeout(() => closeRef.current?.focus(), 0);
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Reset sort to a sensible default whenever the selected rep changes.
  const [prevRepId, setPrevRepId] = useState(rep.id);
  if (rep.id !== prevRepId) {
    setPrevRepId(rep.id);
    setSortKey("closeDate");
    setSortDir("asc");
  }

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "company" ? "asc" : "desc");
    }
  }

  const sortedDeals = [...rep.deals].sort((a, b) => {
    const cmp = compareDeals(a, b, sortKey);
    return sortDir === "asc" ? cmp : -cmp;
  });
  const openPipelineValue = rep.deals.filter((d) => d.stage !== "Closed Won").reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button type="button" aria-label="Close rep details" onClick={onClose} className="absolute inset-0 bg-zinc-900/40" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rep-drawer-title"
        className="relative flex h-full w-full flex-col overflow-y-auto border-l border-zinc-200 bg-white shadow-2xl sm:max-w-md lg:max-w-lg"
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar avatarId={rep.avatarId} name={rep.name} size={52} />
            <div className="min-w-0">
              <h2 id="rep-drawer-title" className="truncate text-base font-semibold text-zinc-900">
                {rep.name}
              </h2>
              <p className="truncate text-xs text-zinc-500">
                {TEAM_META[rep.team].label} · {rep.title}
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <Badge tone="neutral">Rank #{rank}</Badge>
                <RankChangeIndicator delta={stat.rankDelta} />
              </div>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close rep details"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-zinc-500 outline-none hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          <Card className="p-4">
            <div className="flex items-baseline justify-between">
              <div>
                <EyebrowLabel>Quota attainment · {PERIOD_META[period].label}</EyebrowLabel>
                <p className="mt-1 text-3xl font-bold tabular-nums text-zinc-900">{formatPct(stat.attainmentPct)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-500">Closed revenue</p>
                <p className="text-sm font-semibold tabular-nums text-zinc-900">{formatUSD(stat.closedRevenue)}</p>
                <p className="text-[11px] tabular-nums text-zinc-500">of {formatUSD(stat.quotaTarget)} quota</p>
              </div>
            </div>
            <ProgressBar pct={stat.attainmentPct} className="mt-3" />
          </Card>

          <div>
            <p className="mb-2 text-xs font-medium text-zinc-700">Quota attainment — last 6 months</p>
            <Card className="p-4">
              <TrendChart points={rep.quotaTrend} ariaTitle={`${rep.name} quota attainment trend, last 6 months`} />
            </Card>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-zinc-700">Activity — last 30 days</p>
            <div className="grid grid-cols-2 gap-3">
              <StatTile icon={Phone} label="Calls" value={rep.activity.calls} />
              <StatTile icon={Mail} label="Emails" value={rep.activity.emails} />
              <StatTile icon={CalendarCheck} label="Meetings booked" value={rep.activity.meetingsBooked} />
              <StatTile icon={Users} label="Meetings held" value={rep.activity.meetingsHeld} />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <p className="text-xs font-medium text-zinc-700">Deal pipeline</p>
              <p className="text-[11px] tabular-nums text-zinc-500">{formatUSD(openPipelineValue)} open</p>
            </div>
            <Card className="overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] table-fixed text-left text-xs lg:min-w-0">
                  <caption className="sr-only">Deal pipeline for {rep.name}</caption>
                  <colgroup>
                    <col className="w-[32%]" />
                    <col className="w-[20%]" />
                    <col className="w-[18%]" />
                    <col className="w-[16%]" />
                    <col className="w-[14%]" />
                  </colgroup>
                  <thead>
                    <tr className="border-b border-zinc-200 text-[11px] uppercase tracking-wide text-zinc-500">
                      <SortableHeader label="Deal" active={sortKey === "company"} dir={sortDir} onClick={() => toggleSort("company")} className="pl-3" />
                      <th scope="col" className="py-2 font-medium">
                        Stage
                      </th>
                      <SortableHeader label="Value" active={sortKey === "value"} dir={sortDir} onClick={() => toggleSort("value")} />
                      <SortableHeader label="Close" active={sortKey === "closeDate"} dir={sortDir} onClick={() => toggleSort("closeDate")} />
                      <SortableHeader label="Prob." active={sortKey === "probability"} dir={sortDir} onClick={() => toggleSort("probability")} className="pr-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {sortedDeals.map((deal) => (
                      <tr key={deal.id} className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50">
                        <td className="py-2.5 pl-3 pr-2 text-zinc-700">
                          <span className="block truncate" title={deal.company}>
                            {deal.company}
                          </span>
                        </td>
                        <td className="py-2.5 pr-2">
                          <StageBadge stage={deal.stage} />
                        </td>
                        <td className="whitespace-nowrap py-2.5 pr-2 tabular-nums text-zinc-700">{formatUSD(deal.value)}</td>
                        <td className="whitespace-nowrap py-2.5 pr-2 tabular-nums text-zinc-500">{deal.closeDate}</td>
                        <td className="whitespace-nowrap py-2.5 pr-3 tabular-nums text-zinc-500">{deal.probability}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatTile({ icon: Icon, label, value }: { icon: typeof Phone; label: string; value: number }) {
  return (
    <Card className="p-3">
      <div className="flex items-center gap-1.5 text-zinc-500">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="text-[11px] uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-1.5 text-xl font-semibold tabular-nums text-zinc-900">{formatInt(value)}</p>
    </Card>
  );
}
