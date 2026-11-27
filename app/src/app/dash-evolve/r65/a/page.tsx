"use client";

import { useEffect, useState } from "react";
import { Activity, CircleAlert, CircleCheck, CircleX, Server } from "lucide-react";
import AppShell from "./AppShell";
import ServiceRail from "./ServiceRail";
import LatencyChart from "./LatencyChart";
import TraceFeed from "./TraceFeed";
import CommandPalette from "./CommandPalette";
import { SERVICES, formatCompact, requests24h, type TimeRange } from "./data";

export default function Page() {
  const [selectedId, setSelectedId] = useState(SERVICES[0].id);
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  const [paletteOpen, setPaletteOpen] = useState(false);

  const selectedService = SERVICES.find((s) => s.id === selectedId) ?? SERVICES[0];

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      } else if (e.key === "Escape") {
        setPaletteOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Fleet-health tiles are reduced directly from the exact per-service arrays the rail and chart
  // render — never authored as separate numbers.
  const healthyCount = SERVICES.filter((s) => s.status === "healthy").length;
  const degradedCount = SERVICES.filter((s) => s.status === "degraded").length;
  const downCount = SERVICES.filter((s) => s.status === "down").length;
  const totalRequests24h = SERVICES.reduce((a, s) => a + requests24h(s), 0);

  return (
    <>
      <AppShell onOpenSearch={() => setPaletteOpen(true)}>
        <div className="flex flex-col lg:h-full lg:min-h-0">
          <section aria-labelledby="fleet-heading" className="shrink-0 border-b border-white/10 px-4 py-4 sm:px-6">
            <h2 id="fleet-heading" className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Fleet health
            </h2>
            <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <StatTile icon={Server} label="Services" value={String(SERVICES.length)} tone="text-zinc-300" />
              <StatTile icon={CircleCheck} label="Healthy" value={String(healthyCount)} tone="text-emerald-400" />
              <StatTile icon={CircleAlert} label="Degraded" value={String(degradedCount)} tone="text-amber-400" />
              <StatTile icon={CircleX} label="Down" value={String(downCount)} tone="text-rose-400" />
              <StatTile icon={Activity} label="Requests (24h)" value={formatCompact(totalRequests24h)} tone="text-violet-300" />
            </dl>
          </section>

          <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)_380px] lg:overflow-hidden">
            <div className="min-w-0 border-b border-white/10 lg:min-h-0 lg:overflow-y-auto lg:border-b-0 lg:border-r">
              <ServiceRail selectedId={selectedService.id} onSelect={setSelectedId} />
            </div>

            <div className="min-w-0 lg:min-h-0 lg:overflow-hidden">
              <LatencyChart service={selectedService} range={timeRange} onRangeChange={setTimeRange} />
            </div>

            <div className="min-w-0 border-t border-white/10 lg:min-h-0 lg:overflow-y-auto lg:border-t-0 lg:border-l">
              <TraceFeed service={selectedService} />
            </div>
          </div>
        </div>
      </AppShell>

      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} onSelect={setSelectedId} />}
    </>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Server;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5">
      <dt className="flex items-center gap-1.5 text-xs text-zinc-400">
        <Icon aria-hidden="true" className={`size-3.5 shrink-0 ${tone}`} />
        <span className="truncate">{label}</span>
      </dt>
      <dd className={`mt-1 truncate text-xl font-semibold tabular-nums ${tone}`}>{value}</dd>
    </div>
  );
}
