"use client";

import type { ServiceRecord, TimeRange } from "./data";
import { TIME_RANGE_LABEL } from "./data";
import { SERVICE_STATUS_META } from "./status-meta";
import { Badge, StatusDot } from "./ui";
import { MiniSparkline } from "./crosshair-chart";
import { cn, FOCUS_RING } from "./cn";

const SPARK_COLOR: Record<ServiceRecord["status"], string> = {
  operational: "#34d399",
  degraded: "#fbbf24",
  down: "#f87171",
};

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-2 text-[11px]">
      <span className="truncate text-zinc-400">{label}</span>
      <span className="shrink-0 tabular-nums text-zinc-100">{value}</span>
    </div>
  );
}

export function ServiceTile({
  service,
  range,
  onOpen,
}: {
  service: ServiceRecord;
  range: TimeRange;
  onOpen: () => void;
}) {
  const meta = SERVICE_STATUS_META[service.status];
  const points = service.history[range];
  const envLabel = service.environment === "production" ? "Production" : "Staging";

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={`${service.name}, ${meta.label}, latency ${service.latencyP50Ms} milliseconds, error rate ${service.errorRatePct} percent. Open detail drawer.`}
      className={cn(
        FOCUS_RING,
        "flex h-full min-w-0 flex-col gap-2.5 rounded-xl border border-white/10 bg-zinc-900/60 p-3.5 text-left shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset] transition-colors hover:border-white/20 hover:bg-zinc-900",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <StatusDot meta={meta} pulse={service.status !== "operational"} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-zinc-50">{service.name}</p>
            <p className="truncate text-[11px] text-zinc-400">
              <span className="tabular-nums">{service.id}</span> · {service.team} · {envLabel}
            </p>
          </div>
        </div>
        <Badge meta={meta} className="shrink-0" />
      </div>

      <div className="grid min-w-0 grid-cols-2 gap-x-3 gap-y-1">
        <MetricRow label="Latency p50" value={`${service.latencyP50Ms} ms`} />
        <MetricRow label="Error rate" value={`${service.errorRatePct}%`} />
        <MetricRow label="Throughput" value={`${service.throughputRps} rps`} />
        <MetricRow label="Uptime 30d" value={`${service.uptimePct30d}%`} />
      </div>

      <div className="mt-auto pt-1">
        <div className="h-8 w-full">
          <MiniSparkline points={points} strokeColor={SPARK_COLOR[service.status]} />
        </div>
        <p className="mt-1 truncate text-[10px] text-zinc-400">
          Latency trend · {TIME_RANGE_LABEL[range]}
        </p>
      </div>
    </button>
  );
}
