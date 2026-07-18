"use client";

import type { PeriodId, RankedRep } from "../lib/data";
import { PERIOD_META } from "../lib/data";
import { Card, EyebrowLabel } from "./ui";
import LeaderboardRow from "./LeaderboardRow";

export default function Leaderboard({
  ranked,
  period,
  selectedRepId,
  onSelectRep,
  scopeLabel,
}: {
  ranked: RankedRep[];
  period: PeriodId;
  selectedRepId: string | null;
  onSelectRep: (id: string) => void;
  scopeLabel: string;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 sm:px-5">
        <div>
          <p className="text-sm font-semibold text-zinc-900">Ranked by quota attainment</p>
          <p className="text-xs text-zinc-500">
            {scopeLabel} · {PERIOD_META[period].label}
          </p>
        </div>
        <div className="hidden items-center gap-8 pr-16 md:flex">
          <EyebrowLabel className="w-32 text-right">Attainment</EyebrowLabel>
          <EyebrowLabel className="w-10 text-right">Change</EyebrowLabel>
        </div>
      </div>

      {ranked.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-zinc-500">No reps in this scope.</p>
      ) : (
        <ol aria-label={`Sales leaderboard, ${scopeLabel}, ${PERIOD_META[period].label}, ranked by quota attainment`}>
          {ranked.map(({ rep, rank, stat }) => (
            <LeaderboardRow
              key={rep.id}
              rep={rep}
              rank={rank}
              stat={stat}
              selected={rep.id === selectedRepId}
              onSelect={() => onSelectRep(rep.id)}
            />
          ))}
        </ol>
      )}
    </Card>
  );
}
