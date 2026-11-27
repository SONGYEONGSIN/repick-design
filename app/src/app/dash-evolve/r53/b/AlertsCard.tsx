import { TrendingUp } from "lucide-react";
import { Card, CardHeader, Badge } from "./ui";
import { ALERTS, SERVICE_BY_ID, alertDeltaPct } from "./data";

export function AlertsCard() {
  return (
    <Card colSpan="col-span-1 md:col-span-2 lg:col-span-12" rowSpan="lg:row-span-1">
      <CardHeader title="Anomalies" description="Metrics furthest from their 7-day baseline, right now" />
      <ul className="grid min-h-0 flex-1 grid-cols-1 gap-2 px-4 py-3 sm:grid-cols-2 lg:grid-cols-4">
        {ALERTS.map((a) => {
          const delta = alertDeltaPct(a);
          const service = SERVICE_BY_ID[a.serviceId];
          const tone: "red" | "amber" | "zinc" = delta >= 100 ? "red" : delta >= 30 ? "amber" : "zinc";
          return (
            <li key={a.id} className="min-w-0 rounded-lg border border-zinc-200 px-3 py-2.5">
              <p className="truncate text-xs font-medium text-zinc-900">{service.name}</p>
              <p className="mt-0.5 truncate text-[11px] text-zinc-500">{a.metric}</p>
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <span className="tabular-nums text-xs text-zinc-700">
                  {a.baseline}
                  {a.unit} → {a.current}
                  {a.unit}
                </span>
                <Badge tone={tone}>
                  <TrendingUp className="mr-0.5 h-3 w-3 flex-shrink-0" aria-hidden="true" />+{delta}%
                </Badge>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
