interface SparklineProps {
  values: number[];
  className?: string;
  label: string;
}

/** 작은 추이 스파크라인. 좌표는 소수 2자리로 반올림해 서버/클라이언트 하이드레이션 불일치를 방지한다. */
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
