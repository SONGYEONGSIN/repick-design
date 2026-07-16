import type { FunnelStage } from "../../lib/data";
import { formatNumber } from "../../lib/format";
import { Card, WidgetHeader } from "../ui";

export default function FunnelWidget({
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
  data: FunnelStage[];
  className?: string;
}) {
  const max = data[0]?.value || 1;

  return (
    <Card id={id} highlighted={highlighted} className={`flex min-w-0 flex-col gap-4 p-4 sm:p-5 ${className}`}>
      <WidgetHeader title={title} subtitle={subtitle} />
      <ul className="flex flex-col gap-3">
        {data.map((stage, i) => {
          const widthPct = (stage.value / max) * 100;
          const prev = i > 0 ? data[i - 1].value : null;
          const convPct = prev ? (stage.value / prev) * 100 : null;
          return (
            <li key={stage.label} className="flex min-w-0 flex-col gap-1">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-medium text-zinc-700">{stage.label}</span>
                <span className="shrink-0 whitespace-nowrap tabular-nums text-zinc-500">{formatNumber(stage.value)}</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-md bg-zinc-100">
                <div className="h-full rounded-md bg-violet-500" style={{ width: `${widthPct}%` }} />
              </div>
              {convPct !== null ? (
                <p className="text-[11px] text-zinc-500">이전 단계 대비 {convPct.toFixed(0)}% 전환</p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
