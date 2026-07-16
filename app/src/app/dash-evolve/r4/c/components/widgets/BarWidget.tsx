import type { BreakdownItem } from "../../lib/data";
import { formatNumber } from "../../lib/format";
import { Card, WidgetHeader } from "../ui";

export default function BarWidget({
  id,
  highlighted,
  title,
  subtitle,
  data,
  className = "",
}: {
  id: string;
  highlighted: boolean;
  title: string;
  subtitle: string;
  data: BreakdownItem[];
  className?: string;
}) {
  const max = Math.max(...data.map((d) => d.value));
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card id={id} highlighted={highlighted} className={`flex min-w-0 flex-col gap-4 p-4 sm:p-5 ${className}`}>
      <WidgetHeader title={title} subtitle={subtitle} />
      <ul className="flex flex-col gap-3">
        {data.map((item) => {
          const widthPct = max > 0 ? (item.value / max) * 100 : 0;
          const sharePct = total > 0 ? (item.value / total) * 100 : 0;
          return (
            <li key={item.label} className="flex min-w-0 flex-col gap-1">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="truncate font-medium text-zinc-700">{item.label}</span>
                <span className="shrink-0 whitespace-nowrap tabular-nums text-zinc-500">
                  {formatNumber(item.value)} · {sharePct.toFixed(0)}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                <div className="h-full rounded-full bg-indigo-500" style={{ width: `${widthPct}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
