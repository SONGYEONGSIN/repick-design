import { Monitor, Smartphone, Tablet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { DeviceShare } from "../../lib/data";
import { round2 } from "../../lib/format";
import { Card, WidgetHeader } from "../ui";

const DEVICE_META: Record<DeviceShare["label"], { Icon: LucideIcon; stroke: string; dot: string }> = {
  "데스크톱": { Icon: Monitor, stroke: "stroke-indigo-500", dot: "bg-indigo-500" },
  "모바일": { Icon: Smartphone, stroke: "stroke-emerald-500", dot: "bg-emerald-500" },
  "태블릿": { Icon: Tablet, stroke: "stroke-amber-500", dot: "bg-amber-500" },
};

const R = 40;
const CX = 50;
const CY = 50;
const CIRCUMFERENCE = round2(2 * Math.PI * R);

export default function DonutWidget({
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
  data: DeviceShare[];
  className?: string;
}) {
  const segments = data.reduce<Array<DeviceShare & { segLen: number; offset: number }>>((acc, d) => {
    const cumulativeBefore = acc.reduce((sum, s) => sum + s.segLen, 0);
    const segLen = round2((d.value / 100) * CIRCUMFERENCE);
    return [...acc, { ...d, segLen, offset: round2(-cumulativeBefore) }];
  }, []);

  return (
    <Card id={id} highlighted={highlighted} className={`flex min-w-0 flex-col gap-4 p-4 sm:p-5 ${className}`}>
      <WidgetHeader title={title} subtitle={subtitle} />
      <div className="flex min-w-0 flex-1 items-center gap-5">
        <svg viewBox="0 0 100 100" className="size-28 shrink-0" role="img" aria-hidden="true">
          <g transform={`rotate(-90 ${CX} ${CY})`}>
            <circle cx={CX} cy={CY} r={R} fill="none" strokeWidth="14" className="stroke-zinc-100" />
            {segments.map((s) => (
              <circle
                key={s.label}
                cx={CX}
                cy={CY}
                r={R}
                fill="none"
                strokeWidth="14"
                strokeLinecap="butt"
                strokeDasharray={`${s.segLen} ${round2(CIRCUMFERENCE - s.segLen)}`}
                strokeDashoffset={s.offset}
                className={DEVICE_META[s.label].stroke}
              />
            ))}
          </g>
        </svg>

        <ul className="flex min-w-0 flex-1 flex-col gap-2.5">
          {segments.map((s) => {
            const meta = DEVICE_META[s.label];
            return (
              <li key={s.label} className="flex items-center gap-2 text-sm">
                <span className={`size-2 shrink-0 rounded-full ${meta.dot}`} aria-hidden="true" />
                <meta.Icon className="size-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate text-zinc-700">{s.label}</span>
                <span className="shrink-0 tabular-nums font-medium text-zinc-900">{s.value}%</span>
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}
