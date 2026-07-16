import type { LucideIcon } from "lucide-react";
import { Card, DeltaPill, SectionLabel, Sparkline } from "../ui";

export default function MetricWidget({
  id,
  highlighted,
  label,
  Icon,
  value,
  deltaPct,
  invertDelta = false,
  spark,
  className = "",
}: {
  id: string;
  highlighted: boolean;
  label: string;
  Icon: LucideIcon;
  value: string;
  deltaPct: number;
  invertDelta?: boolean;
  spark: number[];
  className?: string;
}) {
  return (
    <Card id={id} highlighted={highlighted} className={`flex min-w-0 flex-col justify-between gap-3 p-4 ${className}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <SectionLabel className="flex items-center gap-1.5">
            <Icon className="size-3.5 text-zinc-400" aria-hidden="true" />
            {label}
          </SectionLabel>
          <p className="mt-1.5 text-2xl font-semibold tabular-nums tracking-tight text-zinc-900">{value}</p>
        </div>
        <Sparkline points={spark} width={72} height={28} className="mt-1 shrink-0 text-indigo-500" />
      </div>
      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
        <DeltaPill value={deltaPct} invert={invertDelta} />
        <span>이전 기간 대비</span>
      </div>
    </Card>
  );
}
