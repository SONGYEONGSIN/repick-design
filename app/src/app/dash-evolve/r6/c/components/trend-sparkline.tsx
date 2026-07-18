import { round2 } from "../lib/data";

interface TrendSparklineProps {
  values: number[]; // 전체 배열(길이 8), periodsAvailable 이후 값은 무시
  periodsAvailable: number;
  domainMax: number;
  className?: string;
}

const WIDTH = 280;
const HEIGHT = 72;
const PAD_X = 6;
const PAD_Y = 10;

export function TrendSparkline({
  values,
  periodsAvailable,
  domainMax,
  className,
}: TrendSparklineProps) {
  const observed = values.slice(0, periodsAvailable);
  const denom = Math.max(observed.length - 1, 1);

  const points = observed.map((v, i) => {
    const x = round2(PAD_X + (i / denom) * (WIDTH - 2 * PAD_X));
    const ratio = Math.min(1, v / domainMax);
    const y = round2(HEIGHT - PAD_Y - ratio * (HEIGHT - 2 * PAD_Y));
    return { x, y, v };
  });

  const linePoints = points.map((p) => `${p.x},${p.y}`).join(" ");
  const baselineY = round2(HEIGHT - PAD_Y);

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      width="100%"
      height={HEIGHT}
      className={className}
      role="img"
      aria-label={`기간별 추이: ${observed.map((v) => `${v}%`).join(", ")}`}
    >
      <line
        x1={PAD_X}
        y1={baselineY}
        x2={WIDTH - PAD_X}
        y2={baselineY}
        stroke="currentColor"
        strokeWidth="1"
        className="text-zinc-200 dark:text-white/10"
      />
      {points.length > 1 ? (
        <polyline
          points={linePoints}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-indigo-500 dark:text-indigo-400"
        />
      ) : null}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={i === points.length - 1 ? 3.5 : 2.5}
          fill="currentColor"
          className={i === points.length - 1 ? "text-indigo-600 dark:text-indigo-300" : "text-indigo-400 dark:text-indigo-500"}
        />
      ))}
    </svg>
  );
}
