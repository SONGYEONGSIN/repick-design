"use client";

import { ChevronRight, Crown } from "lucide-react";
import type { PeriodStat, Rep } from "../lib/data";
import { TEAM_META } from "../lib/data";
import { formatPct, formatUSDCompact, cn } from "../lib/format";
import { Avatar, ProgressBar, RankChangeIndicator } from "./ui";
import MiniSparkline from "./MiniSparkline";

const RANK_TIER: Record<number, { numeral: string; chip: string; ring: string }> = {
  1: { numeral: "text-3xl text-amber-600", chip: "bg-amber-50 border-amber-200", ring: "ring-amber-200" },
  2: { numeral: "text-2xl text-zinc-500", chip: "bg-zinc-100 border-zinc-200", ring: "ring-zinc-200" },
  3: { numeral: "text-2xl text-orange-700", chip: "bg-orange-50 border-orange-200", ring: "ring-orange-200" },
};

export default function LeaderboardRow({
  rep,
  rank,
  stat,
  selected,
  onSelect,
}: {
  rep: Rep;
  rank: number;
  stat: PeriodStat;
  selected: boolean;
  onSelect: () => void;
}) {
  const tier = RANK_TIER[rank];
  const trendUp = stat.rankDelta >= 0;

  return (
    <li className="border-b border-zinc-100 last:border-b-0">
      <button
        type="button"
        onClick={onSelect}
        aria-current={selected ? "true" : undefined}
        className={cn(
          "flex w-full items-center gap-2 px-3 py-3.5 text-left outline-none transition-colors motion-reduce:transition-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 sm:gap-4 sm:px-5",
          selected ? "bg-indigo-50/70" : "hover:bg-zinc-50",
        )}
      >
        <div
          className={cn(
            "flex w-8 shrink-0 flex-col items-center justify-center sm:w-12",
            tier ? cn("rounded-lg border py-1", tier.chip) : "",
          )}
        >
          {rank === 1 ? <Crown className="mb-0.5 h-3.5 w-3.5 text-amber-500" aria-hidden="true" /> : null}
          <span className={cn("font-bold tabular-nums leading-none", tier ? tier.numeral : "text-base text-zinc-500 sm:text-lg")}>
            {rank}
          </span>
        </div>

        <Avatar avatarId={rep.avatarId} name={rep.name} size={36} />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-zinc-900">{rep.name}</p>
          <p className="truncate text-xs text-zinc-500">
            {TEAM_META[rep.team].short} · {rep.title}
          </p>
        </div>

        <div className="hidden shrink-0 sm:block">
          <MiniSparkline values={rep.weeklyTrend} positive={trendUp} />
        </div>

        <div className="w-16 shrink-0 sm:w-24 md:w-32">
          <div className="flex items-baseline justify-between gap-1">
            <span className="text-sm font-semibold tabular-nums text-zinc-900">{formatPct(stat.attainmentPct)}</span>
          </div>
          <ProgressBar pct={stat.attainmentPct} className="mt-1.5" />
          <p className="mt-1 hidden truncate text-[11px] tabular-nums text-zinc-500 md:block">
            {formatUSDCompact(stat.closedRevenue)} closed
          </p>
        </div>

        <div className="shrink-0 text-right">
          <RankChangeIndicator delta={stat.rankDelta} className="justify-end" />
        </div>

        <ChevronRight className="hidden h-4 w-4 shrink-0 text-zinc-300 sm:block" aria-hidden="true" />
      </button>
    </li>
  );
}
