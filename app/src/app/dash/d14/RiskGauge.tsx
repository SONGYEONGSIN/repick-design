interface RiskGaugeProps {
  value: number;
  colorVar: string;
}

/** 반원형 리스크 게이지 — pathLength 정규화로 퍼센트를 그대로 dasharray에 사용 (순수 SVG, 장식용) */
export default function RiskGauge({ value, colorVar }: RiskGaugeProps) {
  return (
    <svg viewBox="0 0 100 56" className="h-auto w-full" aria-hidden="true">
      <path
        d="M8 50 A42 42 0 0 1 92 50"
        fill="none"
        stroke="var(--navy-800)"
        strokeWidth={8}
        strokeLinecap="round"
        pathLength={100}
      />
      <path
        d="M8 50 A42 42 0 0 1 92 50"
        fill="none"
        stroke={colorVar}
        strokeWidth={8}
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={`${value} 100`}
      />
      <circle cx={8} cy={50} r={2.4} fill="var(--gold-800)" />
      <circle cx={92} cy={50} r={2.4} fill="var(--gold-800)" />
    </svg>
  );
}
