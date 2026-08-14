import { getAllocation, TOTAL_BALANCE, formatUSDCompact, round2 } from "./data";

const SIZE = 108;
const RADIUS = 42;
const STROKE = 16;
const CENTER = SIZE / 2;
const CIRCUMFERENCE = round2(2 * Math.PI * RADIUS);

interface DonutSegment {
  id: string;
  symbol: string;
  name: string;
  color: string;
  pct: number;
  dash: number;
  gap: number;
  offset: number;
}

/**
 * Converts allocation percentages into cumulative stroke-dasharray segments.
 * Plain module-level helper (not a component) so the running-cursor
 * accumulation is a local reduce, not a render-time variable mutation.
 */
function buildDonutSegments(allocation: ReturnType<typeof getAllocation>): DonutSegment[] {
  return allocation.reduce<{ cursor: number; segments: DonutSegment[] }>(
    (acc, { holding, pct }) => {
      const dash = round2((pct / 100) * CIRCUMFERENCE);
      const gap = round2(CIRCUMFERENCE - dash);
      const offset = round2(-acc.cursor);
      const segment: DonutSegment = { id: holding.id, symbol: holding.symbol, name: holding.name, color: holding.color, pct, dash, gap, offset };
      return { cursor: round2(acc.cursor + dash), segments: [...acc.segments, segment] };
    },
    { cursor: 0, segments: [] },
  ).segments;
}

/**
 * Compact allocation donut + legend, sized for the right-rail portfolio
 * summary card. Always stacks vertically (donut over a 2-col legend grid) —
 * its container width is a fixed rail column, not the viewport, so it
 * intentionally ignores sm:/lg: breakpoints that would assume more room.
 */
export default function AllocationDonut() {
  const allocation = getAllocation();
  const segments = buildDonutSegments(allocation);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width={SIZE}
          height={SIZE}
          role="img"
          aria-label={`Asset allocation: ${segments.map((s) => `${s.symbol} ${s.pct}%`).join(", ")}`}
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
          <p className="text-sm font-semibold tabular-nums text-zinc-50">{formatUSDCompact(TOTAL_BALANCE)}</p>
          <p className="text-[10px] text-zinc-400">Total value</p>
        </div>
      </div>

      <ul className="grid w-full grid-cols-2 gap-x-3 gap-y-1.5">
        {segments.map((s) => (
          <li key={s.id} className="flex min-w-0 items-center gap-1.5 text-xs">
            <span aria-hidden="true" className="size-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="min-w-0 flex-1 truncate text-zinc-400">{s.symbol}</span>
            <span className="shrink-0 tabular-nums font-medium text-zinc-100">{s.pct.toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
