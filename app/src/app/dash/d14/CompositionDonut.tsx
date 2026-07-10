interface CompositionItem {
  label: string;
  value: number;
  color: "gold" | "emerald" | "slate" | "risk";
}

const COLOR_VAR: Record<CompositionItem["color"], string> = {
  gold: "var(--gold-500)",
  emerald: "var(--emerald-500)",
  slate: "var(--slate)",
  risk: "var(--risk)",
};

interface CompositionDonutProps {
  items: CompositionItem[];
}

/**
 * 포트폴리오 구성 도넛 — 세그먼트 사이 게이지(gutter)를 둔 기하학적 컷 스타일.
 * 그래픽 자체는 장식(aria-hidden)이며, 실제 수치는 인접 범례 목록이 전달한다.
 */
export default function CompositionDonut({ items }: CompositionDonutProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const gap = 2.2; // 세그먼트 사이 시각적 간격(단위: 둘레 길이)

  const segments = items.reduce<
    Array<CompositionItem & { offset: number; drawLength: number }>
  >((acc, item) => {
    const rawLength = (item.value / total) * circumference;
    const previousEnd = acc.length > 0 ? acc[acc.length - 1].offset + (acc[acc.length - 1].drawLength + gap) : 0;
    const drawLength = Math.max(rawLength - gap, 0);
    acc.push({ ...item, offset: previousEnd, drawLength });
    return acc;
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
      <svg viewBox="0 0 100 100" className="h-40 w-40 shrink-0 -rotate-90" aria-hidden="true">
        <circle cx={50} cy={50} r={radius} fill="none" stroke="var(--navy-800)" strokeWidth={12} />
        {segments.map((seg) => (
          <circle
            key={seg.label}
            cx={50}
            cy={50}
            r={radius}
            fill="none"
            stroke={COLOR_VAR[seg.color]}
            strokeWidth={12}
            strokeLinecap="butt"
            strokeDasharray={`${seg.drawLength} ${circumference - seg.drawLength}`}
            strokeDashoffset={-seg.offset}
          />
        ))}
      </svg>

      <ul className="w-full min-w-0 space-y-2.5">
        {items.map((item) => {
          const pct = Math.round((item.value / total) * 100);
          return (
            <li key={item.label} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2 text-[var(--ivory)]">
                <svg viewBox="0 0 10 10" className="size-2.5 shrink-0" aria-hidden="true">
                  <circle cx={5} cy={5} r={5} fill={COLOR_VAR[item.color]} />
                </svg>
                {item.label}
              </span>
              <span className="shrink-0 font-[family-name:var(--font-deco-latin)] tabular-nums text-[var(--slate)]">
                {item.value}건 · {pct}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
