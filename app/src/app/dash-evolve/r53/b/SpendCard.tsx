import { Card, CardHeader, Sparkline, formatUsd } from "./ui";
import { SPEND_LINES, SPEND_TOTAL, SPEND_TREND } from "./data";

export function SpendCard({ id }: { id?: string }) {
  const deltaUsd = SPEND_TREND[SPEND_TREND.length - 1] - SPEND_TREND[0];
  const deltaPct = Math.round((deltaUsd / SPEND_TREND[0]) * 1000) / 10;

  return (
    <Card id={id} colSpan="col-span-1 md:col-span-2 lg:col-span-4" rowSpan="lg:row-span-1">
      <CardHeader title="Infra spend" description="Current month, by category" />
      <div className="flex min-h-0 flex-1 items-center gap-4 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="text-2xl font-semibold tabular-nums text-zinc-900">{formatUsd(SPEND_TOTAL)}</p>
          <p className={`mt-0.5 text-xs tabular-nums ${deltaPct >= 0 ? "text-red-600" : "text-green-700"}`}>
            {deltaPct >= 0 ? "+" : ""}
            {deltaPct}% vs. 8 weeks ago
          </p>
          <ul className="mt-2.5 flex flex-col gap-1">
            {SPEND_LINES.slice(0, 3).map((l) => (
              <li key={l.category} className="flex items-center justify-between gap-2 text-[11px] text-zinc-600">
                <span className="min-w-0 truncate">{l.category}</span>
                <span className="flex-shrink-0 tabular-nums">{formatUsd(l.amountUsd)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-shrink-0">
          <Sparkline values={SPEND_TREND} tone="green" width={100} height={44} />
        </div>
      </div>
    </Card>
  );
}
