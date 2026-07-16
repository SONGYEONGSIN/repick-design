"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DEGRADED_COUNT,
  DOWN_COUNT,
  OPEN_INCIDENT_COUNT,
  OPERATIONAL_COUNT,
  SERVICES,
  TEAMS,
  TOTAL_SERVICES,
  serviceById,
  type Environment,
  type Status,
  type Team,
  type TimeRange,
} from "./data";
import { SERVICE_STATUS_META } from "./status-meta";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { FilterBar } from "./filter-bar";
import { TileWall } from "./tile-wall";
import { DetailDrawer } from "./detail-drawer";
import { CommandPalette } from "./command-palette";
import { CaptionLabel, StatusDot } from "./ui";

const ALL_STATUSES: Set<Status> = new Set(["operational", "degraded", "down"]);

export function DashboardClient() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Set<Status>>(ALL_STATUSES);
  const [team, setTeam] = useState<Team | "all">("all");
  const [environment, setEnvironment] = useState<Environment | "all">("all");
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filteredServices = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SERVICES.filter((s) => {
      if (!statusFilter.has(s.status)) return false;
      if (team !== "all" && s.team !== team) return false;
      if (environment !== "all" && s.environment !== environment) return false;
      if (q && !(s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.owner.toLowerCase().includes(q))) {
        return false;
      }
      return true;
    });
  }, [query, statusFilter, team, environment]);

  function toggleStatus(status: Status) {
    setStatusFilter((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  }

  const selectedService = selectedServiceId ? serviceById(selectedServiceId) ?? null : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="flex min-h-screen">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onOpenSidebar={() => setSidebarOpen(true)} onOpenPalette={() => setPaletteOpen(true)} />

          <main className="mx-auto w-full min-w-0 max-w-[1920px] flex-1 p-4 sm:p-6">
            <header>
              <h1 className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">Service health</h1>
              <p className="mt-1 text-sm text-zinc-400">
                Wardline · Solace Systems · <span className="tabular-nums">{TOTAL_SERVICES}</span> monitored services
              </p>
            </header>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-300">
              <span className="inline-flex items-center gap-1.5">
                <StatusDot meta={SERVICE_STATUS_META.operational} />
                <span className="tabular-nums">{OPERATIONAL_COUNT}</span> operational
              </span>
              <span className="inline-flex items-center gap-1.5">
                <StatusDot meta={SERVICE_STATUS_META.degraded} />
                <span className="tabular-nums">{DEGRADED_COUNT}</span> degraded
              </span>
              <span className="inline-flex items-center gap-1.5">
                <StatusDot meta={SERVICE_STATUS_META.down} />
                <span className="tabular-nums">{DOWN_COUNT}</span> down
              </span>
              <span className="text-zinc-400">
                <span className="tabular-nums text-zinc-200">{OPEN_INCIDENT_COUNT}</span> open incidents across the fleet
              </span>
            </div>

            <div className="mt-5">
              <FilterBar
                query={query}
                onQueryChange={setQuery}
                statusFilter={statusFilter}
                onToggleStatus={toggleStatus}
                team={team}
                onTeamChange={setTeam}
                teams={TEAMS}
                environment={environment}
                onEnvironmentChange={setEnvironment}
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
              />
            </div>

            <div className="mt-6 mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-base font-semibold text-zinc-100">All services</h2>
              <CaptionLabel>
                <span className="tabular-nums">{filteredServices.length}</span> of{" "}
                <span className="tabular-nums">{TOTAL_SERVICES}</span> shown
              </CaptionLabel>
            </div>

            <TileWall services={filteredServices} range={timeRange} onOpenService={setSelectedServiceId} />
          </main>
        </div>
      </div>

      <DetailDrawer service={selectedService} range={timeRange} onClose={() => setSelectedServiceId(null)} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onSelectService={setSelectedServiceId} />
    </div>
  );
}
