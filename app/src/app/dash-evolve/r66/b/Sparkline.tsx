interface SparklineProps {
  values: number[];
  width?: number;
  height?: number;
  label: string;
}

/** A tiny, deterministic inline-SVG trend line — no charting library needed for 7 points. */
export function Sparkline({ values, width = 96, height = 28, label }: SparklineProps) {
  const max = Math.max(1, ...values);
  const min = Math.min(0, ...values);
  const span = Math.max(1, max - min);
  const stepX = width / Math.max(1, values.length - 1);
  const points = values.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / span) * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const last = values[values.length - 1] ?? 0;
  const lastY = height - ((last - min) / span) * height;

  return (
    <svg
      role="img"
      aria-label={label}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      <polyline points={points.join(" ")} fill="none" stroke="currentColor" className="text-lime-600" strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={width} cy={lastY} r={2.5} className="fill-lime-600" />
    </svg>
  );
}
