type QuarterScore = { q: string; home: number; away: number; live?: boolean };

type QuarterBarsProps = {
  data: QuarterScore[];
  homeAbbr: string;
  awayAbbr: string;
};

/** 쿼터별 득점 비교 막대그래프. 순수 SVG. */
export default function QuarterBars({ data, homeAbbr, awayAbbr }: QuarterBarsProps) {
  const max = Math.max(...data.flatMap((d) => [d.home, d.away]), 1);
  const chartH = 150;
  const groupW = 84;
  const barW = 26;
  const gap = 8;

  return (
    <svg
      viewBox={`0 0 ${data.length * groupW} ${chartH + 34}`}
      role="img"
      aria-label={`쿼터별 득점: ${data
        .map((d) => `${d.q} ${homeAbbr} ${d.home}점, ${awayAbbr} ${d.away}점`)
        .join(", ")}`}
      className="w-full h-auto"
    >
      {data.map((d, i) => {
        const gx = i * groupW + groupW / 2;
        const hH = (d.home / max) * chartH;
        const aH = (d.away / max) * chartH;
        return (
          <g key={d.q}>
            {/* 홈 바 */}
            <rect
              x={gx - barW - gap / 2}
              y={chartH - hH}
              width={barW}
              height={hH}
              fill="var(--bo-orange)"
              stroke="var(--bo-ink)"
              strokeWidth={2.5}
            />
            <text x={gx - barW / 2 - gap / 2} y={chartH - hH - 8} textAnchor="middle" fontSize={13} fontWeight={800} className="fill-[var(--bo-ink)]">
              {d.home}
            </text>
            {/* 원정 바 */}
            <rect
              x={gx + gap / 2}
              y={chartH - aH}
              width={barW}
              height={aH}
              fill="var(--bo-cream-dim)"
              stroke="var(--bo-ink)"
              strokeWidth={2.5}
            />
            <text x={gx + barW / 2 + gap / 2} y={chartH - aH - 8} textAnchor="middle" fontSize={13} fontWeight={800} className="fill-[var(--bo-ink)]">
              {d.away}
            </text>
            {/* 기준선 */}
            <line x1={gx - groupW / 2 + 4} y1={chartH} x2={gx + groupW / 2 - 4} y2={chartH} stroke="var(--bo-ink)" strokeWidth={2} />
            {/* 쿼터 라벨 */}
            <text x={gx} y={chartH + 22} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-[var(--bo-ink)]">
              {d.q}
              {d.live ? " •" : ""}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
