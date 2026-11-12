"use client";

import type { LucideIcon } from "lucide-react";
import { Server, CheckCircle2, AlertTriangle, Siren } from "lucide-react";
import { computeKpis, formatInt } from "./data";
import { Card } from "./ui";

type Tone = "zinc" | "emerald" | "amber" | "red";

const TONE_CLASSES: Record<Tone, string> = {
  zinc: "bg-zinc-100 text-zinc-700",
  emerald: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
};

function KpiTile({
  label,
  value,
  caption,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  caption: string;
  icon: LucideIcon;
  tone: Tone;
}) {
  return (
    <Card className="min-w-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium leading-snug text-zinc-500">{label}</p>
          <p className="mt-1.5 truncate font-[family-name:var(--font-display-wide)] text-3xl font-semibold tabular-nums text-zinc-900">
            {formatInt(value)}
          </p>
          <p className="mt-1 text-xs leading-snug text-zinc-500">{caption}</p>
        </div>
        <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${TONE_CLASSES[tone]}`}>
          <Icon size={17} aria-hidden="true" />
        </span>
      </div>
    </Card>
  );
}

export function KpiRow() {
  const kpis = computeKpis();
  const atRisk = kpis.degraded + kpis.down;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiTile
        label="Total services"
        value={kpis.total}
        caption="Tracked in the dependency map"
        icon={Server}
        tone="zinc"
      />
      <KpiTile
        label="Healthy"
        value={kpis.healthy}
        caption={`${formatInt(kpis.total - kpis.healthy)} not fully healthy`}
        icon={CheckCircle2}
        tone="emerald"
      />
      <KpiTile
        label="Degraded"
        value={kpis.degraded}
        caption={atRisk > 0 ? "Elevated latency or errors" : "None right now"}
        icon={AlertTriangle}
        tone="amber"
      />
      <KpiTile
        label="Incidents today"
        value={kpis.incidentsToday}
        caption={kpis.down > 0 ? "Includes a full outage" : "Across all services"}
        icon={Siren}
        tone="red"
      />
    </div>
  );
}
