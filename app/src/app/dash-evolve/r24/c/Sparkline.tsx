interface SparklineProps {
  values: number[];
  width?: number;
  height?: number;
  className?: string;
}

/** Tiny deterministic trend line — no chart library, plain SVG polyline. */
export default function Sparkline({ values, width = 96, height = 28, className }: SparklineProps) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  const points = values
    .map((v, i) => {
      const x = Math.round(i * step * 100) / 100;
      const y = Math.round((height - ((v - min) / range) * height) * 100) / 100;
      return `${x},${y}`;
    })
    .join(" ");
  const lastX = Math.round((values.length - 1) * step * 100) / 100;
  const lastY = Math.round((height - ((values[values.length - 1] - min) / range) * height) * 100) / 100;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label={`Trend sparkline from ${values[0]} to ${values[values.length - 1]}`}
    >
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r={2} fill="currentColor" />
    </svg>
  );
}
