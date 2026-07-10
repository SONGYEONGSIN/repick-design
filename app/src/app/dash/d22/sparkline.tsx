import { r2 } from "./data";

interface SparklineProps {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
  label: string;
}

/** 결정론적 SVG 미니 스파크라인. role="img" + aria-label로 데이터 요약 제공. */
export function Sparkline({ values, width = 96, height = 28, color = "var(--accent)", label }: SparklineProps) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = r2((i / (values.length - 1)) * width);
      const y = r2(height - ((v - min) / range) * height);
      return `${x},${y}`;
    })
    .join(" ");
  const last = values[values.length - 1];

  return (
    <svg
      role="img"
      aria-label={`${label} 추이, 현재값 ${last}`}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" opacity={0.85} />
      <circle cx={width} cy={r2(height - ((last - min) / range) * height)} r={2} fill={color} />
    </svg>
  );
}
