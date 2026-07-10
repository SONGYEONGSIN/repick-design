import type { ComponentType } from "react";
import { PlaneTakeoff, TrendingUp, AlertTriangle, Timer } from "lucide-react";
import { FlapText } from "./flap";

export function KpiRow({
  total,
  onTimePct,
  delayedCount,
  avgDelayMin,
}: {
  total: number;
  onTimePct: number;
  delayedCount: number;
  avgDelayMin: number;
}) {
  const stats: {
    label: string;
    value: string;
    length: number;
    tone: "amber" | "red" | "green" | "white";
    icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
    unit: string;
  }[] = [
    {
      label: "표시 편수",
      value: String(total),
      length: 2,
      tone: "white",
      icon: PlaneTakeoff,
      unit: "편",
    },
    {
      label: "정시율",
      value: String(onTimePct),
      length: 3,
      tone: onTimePct >= 80 ? "green" : "amber",
      icon: TrendingUp,
      unit: "%",
    },
    {
      label: "지연편",
      value: String(delayedCount),
      length: 2,
      tone: delayedCount > 0 ? "red" : "white",
      icon: AlertTriangle,
      unit: "편",
    },
    {
      label: "평균 지연",
      value: String(avgDelayMin),
      length: 2,
      tone: avgDelayMin > 0 ? "red" : "white",
      icon: Timer,
      unit: "분",
    },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-amber-500/10 bg-neutral-950 p-4"
        >
          <dt className="mb-3 flex items-center gap-2 text-xs font-medium tracking-wide text-neutral-500">
            <stat.icon aria-hidden className="h-4 w-4" />
            {stat.label}
          </dt>
          <dd className="flex items-baseline gap-1.5">
            <FlapText
              key={stat.value}
              value={stat.value}
              length={stat.length}
              align="right"
              tone={stat.tone}
              ariaLabel={`${stat.value}${stat.unit}`}
            />
            <span className="font-mono text-sm text-neutral-500">
              {stat.unit}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
