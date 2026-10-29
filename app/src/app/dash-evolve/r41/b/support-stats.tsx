import type { CategoryEntry } from "./data";
import { formatCurrency, formatSignedPercent1 } from "./format";
import { Card, CardHeading, ProgressBar, Sparkline } from "./ui";

export default function SupportStats({
  total,
  budget,
  spendHistory,
  mover,
  moverDeltaPct,
  comparisonLabel,
}: {
  total: number;
  budget: number;
  spendHistory: number[];
  mover: CategoryEntry;
  moverDeltaPct: number;
  comparisonLabel: string;
}) {
  const remaining = budget - total;
  const usedPct = (total / budget) * 100;

  return (
    <Card>
      <CardHeading title="Spend trend & budget" subtitle="A quick trend and budget check, at a glance." />

      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <p className="font-normal text-[11px] uppercase tracking-wide text-zinc-400">Last 6 months</p>
          <p className="mt-1 font-normal text-xs text-zinc-400 tabular-nums">
            {formatCurrency(spendHistory[0])} &rarr; {formatCurrency(spendHistory[spendHistory.length - 1])}
          </p>
        </div>
        <Sparkline values={spendHistory} />
      </div>

      <div className="mt-4 border-t border-white/10 pt-4">
        <div className="flex items-baseline justify-between gap-2">
          <p className="font-normal text-[11px] uppercase tracking-wide text-zinc-400">Budget remaining</p>
          <p className="font-normal text-xs text-zinc-400 tabular-nums">{formatCurrency(remaining)} of {formatCurrency(budget)}</p>
        </div>
        <div className="mt-2">
          <ProgressBar percent={usedPct} label={`${formatCurrency(total)} of ${formatCurrency(budget)} budget used`} />
        </div>
      </div>

      <div className="mt-4 border-t border-white/10 pt-4">
        <p className="font-normal text-[11px] uppercase tracking-wide text-zinc-400">Top mover, {comparisonLabel}</p>
        <p className="mt-1 flex items-center gap-1.5 font-normal text-xs text-zinc-400 tabular-nums">
          <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-sm" style={{ backgroundColor: mover.color }} />
          {mover.name} moved the most, {formatSignedPercent1(moverDeltaPct)}
        </p>
      </div>
    </Card>
  );
}
