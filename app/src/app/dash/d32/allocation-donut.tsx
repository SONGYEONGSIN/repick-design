import { getAllocation, TOTAL_BALANCE, formatUSD, formatUSDCompact, round2 } from "./data";
import { Card } from "./ui";

const SIZE = 176;
const RADIUS = 70;
const STROKE = 22;
const CENTER = SIZE / 2;
const CIRCUMFERENCE = round2(2 * Math.PI * RADIUS);

export default function AllocationDonut() {
  const allocation = getAllocation();

  let cursor = 0;
  const segments = allocation.map(({ holding, pct }) => {
    const dash = round2((pct / 100) * CIRCUMFERENCE);
    const gap = round2(CIRCUMFERENCE - dash);
    const offset = round2(-cursor);
    cursor = round2(cursor + dash);
    return { id: holding.id, symbol: holding.symbol, name: holding.name, color: holding.color, pct, dash, gap, offset };
  });

  return (
    <Card
      id="allocation"
      title="자산 배분"
      description="보유 자산 비중"
      className="col-span-12 xl:col-span-4"
      bodyClassName="px-5 pb-5"
    >
      <div className="mt-2 flex flex-col items-center gap-5 sm:flex-row sm:items-center xl:flex-col">
        <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            width={SIZE}
            height={SIZE}
            role="img"
            aria-label={`자산 배분: ${segments.map((s) => `${s.symbol} ${s.pct}%`).join(", ")}`}
          >
            <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="currentColor" className="text-white/5" strokeWidth={STROKE} />
            <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
              {segments.map((s) => (
                <circle
                  key={s.id}
                  cx={CENTER}
                  cy={CENTER}
                  r={RADIUS}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={STROKE}
                  strokeDasharray={`${s.dash} ${s.gap}`}
                  strokeDashoffset={s.offset}
                  strokeLinecap="butt"
                />
              ))}
            </g>
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-lg font-semibold tabular-nums text-zinc-50">{formatUSDCompact(TOTAL_BALANCE)}</p>
            <p className="text-[11px] text-zinc-500">총 평가액</p>
          </div>
        </div>

        <ul className="w-full min-w-0 space-y-2.5" aria-hidden="false">
          {segments.map((s) => (
            <li key={s.id} className="flex items-center gap-2.5 text-sm">
              <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="min-w-0 flex-1 truncate text-zinc-300">{s.name}</span>
              <span className="shrink-0 tabular-nums font-medium text-zinc-100">{s.pct.toFixed(1)}%</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="sr-only">총 보유 자산 평가액 {formatUSD(TOTAL_BALANCE)}</p>
    </Card>
  );
}
