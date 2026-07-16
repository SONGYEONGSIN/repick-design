"use client";

import { useEffect, useRef } from "react";
import { X, Gauge, TimerReset, TrendingUp, ActivitySquare, CalendarClock, MapPin } from "lucide-react";
import type { ServiceRecord, TimeRange } from "./data";
import { TIME_RANGE_LABEL } from "./data";
import { SERVICE_STATUS_META } from "./status-meta";
import { Avatar, Badge, CaptionLabel } from "./ui";
import { CrosshairChart } from "./crosshair-chart";
import { IncidentTable } from "./incident-table";
import { cn, FOCUS_RING } from "./cn";

function StatCell({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Gauge }) {
  return (
    <div className="min-w-0 rounded-lg border border-white/10 bg-white/[0.02] p-3">
      <div className="flex items-center gap-1.5 text-zinc-400">
        <Icon aria-hidden="true" className="size-3.5 shrink-0" />
        <CaptionLabel>{label}</CaptionLabel>
      </div>
      <p className="mt-1.5 truncate text-lg font-semibold tabular-nums text-zinc-50">{value}</p>
    </div>
  );
}

export function DetailDrawer({
  service,
  range,
  onClose,
}: {
  service: ServiceRecord | null;
  range: TimeRange;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = service !== null;

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => closeRef.current?.focus());
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div className="fixed inset-0 z-40 overflow-hidden" style={{ pointerEvents: open ? "auto" : "none" }}>
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/60 transition-opacity motion-reduce:transition-none",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={service ? `${service.name} detail` : "Service detail"}
        aria-hidden={!open}
        inert={!open}
        className={cn(
          "absolute inset-y-0 right-0 z-50 flex w-full max-w-full flex-col border-l border-white/10 bg-zinc-950 shadow-2xl shadow-black/50 transition-transform duration-200 ease-out motion-reduce:transition-none sm:w-[480px] lg:w-[560px]",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {service ? (
          <>
            <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
              <div className="min-w-0">
                <p className="truncate text-[11px] tabular-nums text-zinc-400">{service.id}</p>
                <h2 className="truncate text-lg font-semibold text-zinc-50">{service.name}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{service.description}</p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close detail drawer"
                className={cn(FOCUS_RING, "shrink-0 rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-zinc-200")}
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge meta={SERVICE_STATUS_META[service.status]} />
                <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-zinc-300">
                  {service.team}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-zinc-300">
                  {service.environment === "production" ? "Production" : "Staging"}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-zinc-300">
                  <MapPin aria-hidden="true" className="size-3" />
                  {service.region}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5">
                <Avatar src={service.ownerAvatar} name={service.owner} size={32} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-100">{service.owner}</p>
                  <p className="truncate text-xs text-zinc-400">Service owner</p>
                </div>
                <div className="ml-auto flex min-w-0 items-center gap-1.5 text-xs text-zinc-400">
                  <CalendarClock aria-hidden="true" className="size-3.5 shrink-0" />
                  <span className="truncate tabular-nums">{service.lastDeploy}</span>
                </div>
              </div>

              <div className="mt-5 grid min-w-0 grid-cols-2 gap-2.5 sm:grid-cols-3">
                <StatCell label="Latency p50" value={`${service.latencyP50Ms} ms`} icon={Gauge} />
                <StatCell label="Latency p99" value={`${service.latencyP99Ms} ms`} icon={TimerReset} />
                <StatCell label="Error rate" value={`${service.errorRatePct}%`} icon={ActivitySquare} />
                <StatCell label="Throughput" value={`${service.throughputRps} rps`} icon={TrendingUp} />
                <StatCell label="Uptime 30d" value={`${service.uptimePct30d}%`} icon={Gauge} />
              </div>

              <section aria-labelledby="drawer-chart-heading" className="mt-6 min-w-0">
                <div className="mb-2 flex items-baseline justify-between gap-2">
                  <h3 id="drawer-chart-heading" className="text-sm font-semibold text-zinc-100">
                    Latency trend
                  </h3>
                  <CaptionLabel>{TIME_RANGE_LABEL[range]}</CaptionLabel>
                </div>
                <CrosshairChart
                  points={service.history[range]}
                  unit="ms"
                  ariaTitle={`${service.name} latency trend, ${TIME_RANGE_LABEL[range].toLowerCase()}`}
                />
              </section>

              <section aria-labelledby="drawer-incidents-heading" className="mt-6 min-w-0">
                <h3 id="drawer-incidents-heading" className="mb-2 text-sm font-semibold text-zinc-100">
                  Incident log
                </h3>
                <IncidentTable incidents={service.incidents} serviceName={service.name} />
              </section>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
