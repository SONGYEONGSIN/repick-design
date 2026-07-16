"use client";

import { Search, X, Users } from "lucide-react";
import type { Environment, Status, Team, TimeRange } from "./data";
import { STATUS_FILTER_OPTIONS } from "./status-meta";
import { ChipToggle, Popover, SegmentedControl } from "./ui";
import { cn, FOCUS_RING } from "./cn";

const ENV_OPTIONS: Array<{ key: Environment | "all"; label: string }> = [
  { key: "all", label: "All envs" },
  { key: "production", label: "Production" },
  { key: "staging", label: "Staging" },
];

const RANGE_OPTIONS: Array<{ key: TimeRange; label: string }> = [
  { key: "1h", label: "1H" },
  { key: "24h", label: "24H" },
  { key: "7d", label: "7D" },
];

export function FilterBar({
  query,
  onQueryChange,
  statusFilter,
  onToggleStatus,
  team,
  onTeamChange,
  teams,
  environment,
  onEnvironmentChange,
  timeRange,
  onTimeRangeChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  statusFilter: Set<Status>;
  onToggleStatus: (status: Status) => void;
  team: Team | "all";
  onTeamChange: (team: Team | "all") => void;
  teams: Team[];
  environment: Environment | "all";
  onEnvironmentChange: (env: Environment | "all") => void;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}) {
  const allStatusesActive = statusFilter.size === STATUS_FILTER_OPTIONS.length;

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 min-w-0 lg:col-span-6">
          <label htmlFor="tile-search" className="sr-only">
            Search services
          </label>
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <input
              id="tile-search"
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search by service, id or owner…"
              className={cn(
                FOCUS_RING,
                "h-[44px] w-full min-w-0 rounded-lg border border-white/10 bg-white/5 pl-9 pr-9 text-sm text-zinc-100 placeholder:text-zinc-400 transition-colors focus-visible:bg-white/10",
              )}
            />
            {query ? (
              <button
                type="button"
                onClick={() => onQueryChange("")}
                aria-label="Clear search"
                className={cn(
                  FOCUS_RING,
                  "absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-400 hover:bg-white/10 hover:text-zinc-200",
                )}
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="col-span-12 flex min-w-0 flex-wrap items-center gap-1.5 lg:col-span-6">
          <ChipToggle
            active={allStatusesActive}
            onClick={() =>
              STATUS_FILTER_OPTIONS.forEach((o) => {
                if (!statusFilter.has(o.key)) onToggleStatus(o.key);
              })
            }
          >
            All statuses
          </ChipToggle>
          {STATUS_FILTER_OPTIONS.map((opt) => {
            const Icon = opt.meta.icon;
            return (
              <ChipToggle key={opt.key} active={statusFilter.has(opt.key)} onClick={() => onToggleStatus(opt.key)}>
                <Icon aria-hidden="true" className="size-3.5" />
                {opt.meta.label}
              </ChipToggle>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-6 min-w-0 sm:col-span-4 lg:col-span-3">
          <Popover
            label={<span className="truncate">{team === "all" ? "All teams" : team}</span>}
            icon={Users}
            triggerClassName="w-full justify-between"
            panelClassName="w-full"
          >
            {(close) => (
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    onTeamChange("all");
                    close();
                  }}
                  className={cn(
                    FOCUS_RING,
                    "block w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-white/5",
                    team === "all" ? "text-violet-200" : "text-zinc-200",
                  )}
                >
                  All teams
                </button>
                {teams.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      onTeamChange(t);
                      close();
                    }}
                    className={cn(
                      FOCUS_RING,
                      "block w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-white/5",
                      team === t ? "text-violet-200" : "text-zinc-200",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </Popover>
        </div>

        <div className="col-span-6 min-w-0 sm:col-span-4 lg:col-span-4">
          <SegmentedControl ariaLabel="Filter by environment" options={ENV_OPTIONS} value={environment} onChange={onEnvironmentChange} />
        </div>

        <div className="col-span-12 min-w-0 sm:col-span-4 lg:col-span-3">
          <SegmentedControl ariaLabel="Chart time range" options={RANGE_OPTIONS} value={timeRange} onChange={onTimeRangeChange} />
        </div>
      </div>
    </div>
  );
}
