interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  stroke: string;
}

/** 결정론적 6포인트 추세 스파크라인 — 순수 SVG, 장식용(aria-hidden) */
export default function Sparkline({ data, width = 72, height = 22, stroke }: SparklineProps) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const padY = 3;

  const points = data
    .map((v, i) => {
      const x = i * stepX;
      const y = padY + (1 - (v - min) / range) * (height - padY * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const lastX = (data.length - 1) * stepX;
  const lastY =
    padY + (1 - (data[data.length - 1] - min) / range) * (height - padY * 2);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className="overflow-visible"
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r={2} fill={stroke} />
    </svg>
  );
}
