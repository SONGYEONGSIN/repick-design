"use client";

import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Card, CardHeader, FOCUS_RING } from "./ui";
import { SERVICES, type ServiceStatus } from "./data";

const STATUS_META: Record<ServiceStatus, { label: string; icon: typeof CheckCircle2; text: string; ring: string; dot: string }> = {
  healthy: { label: "Healthy", icon: CheckCircle2, text: "text-green-700", ring: "ring-green-200", dot: "bg-green-600" },
  degraded: { label: "Degraded", icon: AlertTriangle, text: "text-amber-700", ring: "ring-amber-200", dot: "bg-amber-500" },
  down: { label: "Down", icon: XCircle, text: "text-red-700", ring: "ring-red-200", dot: "bg-red-600" },
};

export function ServiceHealthCard({
  selectedServiceId,
  onSelect,
  id,
}: {
  selectedServiceId: string | null;
  onSelect: (serviceId: string) => void;
  id?: string;
}) {
  return (
    <Card id={id} colSpan="col-span-1 md:col-span-2 lg:col-span-4" rowSpan="lg:row-span-2">
      <CardHeader title="Service health" description="Click a service to pin it across this page" />
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        <ul className="grid grid-cols-2 gap-2">
          {SERVICES.map((s) => {
            const meta = STATUS_META[s.status];
            const Icon = meta.icon;
            const isSelected = s.id === selectedServiceId;
            return (
              <li key={s.id} className="min-w-0">
                <button
                  type="button"
                  onClick={() => onSelect(s.id)}
                  aria-pressed={isSelected}
                  className={`flex w-full min-w-0 flex-col gap-1.5 rounded-lg border px-2.5 py-2 text-left transition-colors duration-150 ease-out ${FOCUS_RING} ${
                    isSelected ? "border-green-600 bg-green-50 ring-1 ring-inset ring-green-300" : "border-zinc-200 bg-white hover:border-zinc-300"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span aria-hidden="true" className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${meta.dot}`} />
                    <span className="min-w-0 truncate text-xs font-medium text-zinc-900">{s.name}</span>
                  </span>
                  <span className="truncate text-[11px] text-zinc-500">{s.team}</span>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${meta.text}`}>
                    <Icon className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                    {meta.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}
