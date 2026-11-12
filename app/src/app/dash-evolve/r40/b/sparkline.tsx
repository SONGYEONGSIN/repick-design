"use client";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  label: string;
}

/** Minimal generated SVG sparkline — no charting library, coordinates rounded to 2 decimals. */
export default function Sparkline({ data, width = 160, height = 40, label }: SparklineProps) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((value, i) => {
    const x = round2((i / (data.length - 1)) * width);
    const y = round2(height - ((value - min) / range) * (height - 6) - 3);
    return { x, y };
  });
  const last = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={`${label}: ${data.join(", ")}`}
    >
      <polyline
        points={points.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="none"
        stroke="#e11d48"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {last ? <circle cx={last.x} cy={last.y} r={2.5} fill="#e11d48" /> : null}
    </svg>
  );
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
