"use client";

import type { ReactNode } from "react";
import { PackagePlus, Gauge, ClipboardCheck, Wallet } from "lucide-react";
import {
  type Civil,
  addDays,
  buildWeekGrid,
  capacityFor,
  formatMedium,
  kpiScheduledToday,
  kpiBacklog,
  kpiTotalValue,
  currency,
  PICKUP_ROWS,
  TODAY,
} from "./data";
import { Card, Badge } from "./ui";
import { Sparkline } from "./Sparkline";

function Kpi({
  icon: Icon,
  label,
  value,
  caption,
  children,
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
  caption: string;
  children?: ReactNode;
}) {
  return (
    <Card className="flex h-full flex-col">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-50 text-teal-700">
          <Icon className="h-3.5 w-3.5" aria-hidden />
        </span>
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-500">{label}</p>
      </div>
      <p className="text-[26px] font-semibold tabular-nums text-zinc-900">{value}</p>
      <p className="mt-0.5 text-[12px] text-zinc-500">{caption}</p>
      {children ? <div className="mt-3">{children}</div> : null}
    </Card>
  );
}

export function KpiCards({ pinnedWeekStart }: { pinnedWeekStart: Civil }) {
  const trailing = Array.from({ length: 7 }, (_, i) => addDays(TODAY, i - 6));
  const trailingSpark = trailing.map((c) => ({ label: formatMedium(c), value: capacityFor(c).pickupCount }));

  const weekCells = buildWeekGrid(pinnedWeekStart);
  const weekEnd = addDays(pinnedWeekStart, 6);
  const weekBooked = weekCells.reduce((s, d) => s + d.hoursBooked, 0);
  const weekMax = weekCells.reduce((s, d) => s + d.capacityMax, 0);
  const weekPct = weekMax > 0 ? Math.round((weekBooked / weekMax) * 100) : 0;
  const weekSpark = weekCells.map((d) => ({
    label: formatMedium(d.c),
    value: d.capacityMax > 0 ? Math.round((d.hoursBooked / d.capacityMax) * 100) : 0,
  }));

  const backlog = kpiBacklog();
  const inspecting = backlog.filter((r) => r.status === "Inspecting").length;
  const flagged = backlog.filter((r) => r.status === "Flagged").length;

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 min-w-0 sm:col-span-6 xl:col-span-3">
        <Kpi
          icon={PackagePlus}
          label="Scheduled Today"
          value={String(kpiScheduledToday())}
          caption={`Pickups queued for ${formatMedium(TODAY)}`}
        >
          <Sparkline data={trailingSpark} width={200} height={44} unit="" />
        </Kpi>
      </div>
      <div className="col-span-12 min-w-0 sm:col-span-6 xl:col-span-3">
        <Kpi
          icon={Gauge}
          label="Capacity Booked"
          value={`${weekPct}%`}
          caption={`Pinned week · ${formatMedium(pinnedWeekStart)}–${formatMedium(weekEnd)}`}
        >
          <Sparkline data={weekSpark} width={200} height={44} unit="%" stroke="#0f766e" fill="rgba(15,118,110,0.10)" />
        </Kpi>
      </div>
      <div className="col-span-12 min-w-0 sm:col-span-6 xl:col-span-3">
        <Kpi icon={ClipboardCheck} label="Grading Backlog" value={String(backlog.length)} caption="Awaiting grade decision · current week">
          <div className="flex gap-1.5">
            <Badge tone="blue">{inspecting} Inspecting</Badge>
            <Badge tone="red">{flagged} Flagged</Badge>
          </div>
        </Kpi>
      </div>
      <div className="col-span-12 min-w-0 sm:col-span-6 xl:col-span-3">
        <Kpi
          icon={Wallet}
          label="Est. Value · Current Week"
          value={currency(kpiTotalValue())}
          caption={`Across ${PICKUP_ROWS.length} scheduled pickups`}
        />
      </div>
    </div>
  );
}
