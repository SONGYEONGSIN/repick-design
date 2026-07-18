function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Small non-interactive trend line used inline in each leaderboard row. The
 * crosshair-enabled chart lives in TrendChart.tsx (used in the detail
 * drawer) — this one stays a lightweight visual accent, not a duplicate
 * interactive control, and never receives focus.
 */
export default function MiniSparkline({
  values,
  className = "h-8 w-20",
  positive = true,
}: {
  values: number[];
  className?: string;
  positive?: boolean;
}) {
  const n = values.length;
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const span = hi - lo || 1;
  const coords = values.map((v, i) => {
    const x = n === 1 ? 0 : round2((i / (n - 1)) * 100);
    const y = round2(92 - ((v - lo) / span) * 76);
    return `${x},${y}`;
  });
  const path = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c}`).join(" ");
  const last = coords[coords.length - 1].split(",");

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path
        d={path}
        fill="none"
        stroke={positive ? "#10b981" : "#f43f5e"}
        strokeWidth={3}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={last[0]} cy={last[1]} r={3} fill={positive ? "#10b981" : "#f43f5e"} />
    </svg>
  );
}
