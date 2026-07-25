interface SparklineProps {
  values: number[];
  className?: string;
  label: string;
}

/** Small trend sparkline. Coordinates are rounded to 2 decimal places to avoid server/client hydration mismatches. */
export default function Sparkline({ values, className, label }: SparklineProps) {
  const width = 72;
  const height = 24;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const step = width / (values.length - 1 || 1);

  const points = values
    .map((v, i) => {
      const x = Number((i * step).toFixed(2));
      const y = Number((height - ((v - min) / range) * height).toFixed(2));
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label={label}
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
