import { TrendingUp, Gauge, Wallet, Users } from "lucide-react";
import { formatMillions, formatPercent, formatCount, round2, type PeriodDefinition } from "./data";

function Sparkline({ data }: { data: number[] }) {
  const width = 168;
  const height = 52;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);

  const points = data.map((value, i) => {
    const x = round2(i * step);
    const y = round2(height - ((value - min) / range) * (height - 6) - 3);
    return { x, y };
  });

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${path} L${points[points.length - 1].x},${height} L0,${height} Z`;
  const last = points[points.length - 1];

  return (
    <figure className="shrink-0">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        aria-hidden="true"
        className="overflow-visible"
      >
        <path d={areaPath} fill="#ecfeff" />
        <path d={path} fill="none" stroke="#0e7490" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={last.x} cy={last.y} r={2.4} fill="#0e7490" />
      </svg>
      <figcaption className="sr-only">
        Trailing 12-month ARR trend, from {formatMillions(data[0])} to {formatMillions(data[data.length - 1])}.
      </figcaption>
    </figure>
  );
}

function StatInline({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-zinc-600">
      <Icon className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
      <span className="font-semibold tabular-nums text-zinc-900">{value}</span>
      <span className="text-zinc-500">{label}</span>
    </span>
  );
}

export function Hero({
  periodDef,
  endingArr,
  sparkline,
}: {
  periodDef: PeriodDefinition;
  endingArr: number;
  sparkline: number[];
}) {
  return (
    <section aria-labelledby="hero-number" className="mb-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            {periodDef.rangeLabel}
          </p>
          <p id="hero-number" className="mt-2 text-sm text-zinc-500">
            Ending ARR
          </p>
          <p
            className="mt-1 text-6xl font-semibold tabular-nums text-zinc-900 sm:text-7xl"
            style={{ fontFamily: "var(--font-display-mono)" }}
          >
            {formatMillions(endingArr)}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2.5">
            <StatInline
              icon={TrendingUp}
              label={`${periodDef.stats.growthLabel} growth`}
              value={formatPercent(periodDef.stats.growthPct)}
            />
            <StatInline
              icon={Gauge}
              label="Net revenue retention"
              value={formatPercent(periodDef.stats.nrrPct)}
            />
            <StatInline
              icon={Wallet}
              label="Gross margin"
              value={formatPercent(periodDef.stats.grossMarginPct)}
            />
            <StatInline
              icon={Users}
              label="Active accounts"
              value={formatCount(periodDef.stats.activeAccounts)}
            />
          </div>
        </div>
        <div className="flex flex-col items-start gap-1.5 sm:items-end">
          <span className="text-xs font-medium text-zinc-500">Trailing 12 months</span>
          <Sparkline data={sparkline} />
        </div>
      </div>
    </section>
  );
}
