"use client";

import { ChevronDown, ListFilter, Search, X } from "lucide-react";
import { useMemo } from "react";
import {
  ENVIRONMENTS,
  eventsForPeriod,
  type EnvironmentId,
  type EventStatus,
  type Period,
} from "../data";
import { BORDER, NUM, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "../tokens";
import { SegmentedControl } from "../ui";
import FeedItem from "./FeedItem";

const STATUS_FILTERS: { id: EventStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "success", label: "Success" },
  { id: "failed", label: "Failed" },
  { id: "running", label: "Running" },
  { id: "rolled_back", label: "Rolled back" },
];

const PERIOD_FILTERS: { id: Period; label: string }[] = [
  { id: "24h", label: "Last 24h" },
  { id: "7d", label: "Last 7d" },
];

export default function ActivityFeed({
  period,
  onPeriodChange,
  envFilter,
  onEnvFilterChange,
  statusFilter,
  onStatusFilterChange,
  actorQuery,
  onActorQueryChange,
  selectedId,
  onSelect,
  expandedIds,
  onToggleExpand,
}: {
  period: Period;
  onPeriodChange: (p: Period) => void;
  envFilter: EnvironmentId | "all";
  onEnvFilterChange: (id: EnvironmentId | "all") => void;
  statusFilter: EventStatus | "all";
  onStatusFilterChange: (s: EventStatus | "all") => void;
  actorQuery: string;
  onActorQueryChange: (q: string) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
}) {
  const periodEvents = useMemo(() => eventsForPeriod(period), [period]);

  const filtered = useMemo(() => {
    const q = actorQuery.trim().toLowerCase();
    return periodEvents.filter((e) => {
      if (envFilter !== "all" && e.environment !== envFilter) return false;
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (q !== "" && !e.author.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [periodEvents, envFilter, statusFilter, actorQuery]);

  const hasActiveFilters = envFilter !== "all" || statusFilter !== "all" || actorQuery.trim() !== "";

  function clearFilters() {
    onEnvFilterChange("all");
    onStatusFilterChange("all");
    onActorQueryChange("");
  }

  return (
    <section aria-labelledby="feed-heading" className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 id="feed-heading" className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>
            Activity
          </h2>
          <p className={cx("mt-0.5 text-xs", TEXT_CAPTION)}>
            Build and deploy events across every service &middot; <span className={NUM}>{filtered.length}</span> of <span className={NUM}>{periodEvents.length}</span> shown
          </p>
        </div>
        <SegmentedControl options={PERIOD_FILTERS} value={period} onChange={onPeriodChange} ariaLabel="Select time period for the activity feed" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <label className="sr-only" htmlFor="env-filter">
            Filter by environment
          </label>
          <select
            id="env-filter"
            value={envFilter}
            onChange={(e) => onEnvFilterChange(e.target.value as EnvironmentId | "all")}
            className={cx(
              "h-11 appearance-none rounded-lg border py-0 pl-3 pr-8 text-sm outline-none",
              BORDER,
              "bg-zinc-950",
              TEXT_PRIMARY,
              TRANSITION,
              "focus-visible:ring-2 focus-visible:ring-cyan-400",
            )}
          >
            <option value="all">All environments</option>
            {ENVIRONMENTS.map((env) => (
              <option key={env.id} value={env.id}>
                {env.name}
              </option>
            ))}
          </select>
          <ChevronDown size={14} aria-hidden="true" className={cx("pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2", TEXT_CAPTION)} />
        </div>

        <SegmentedControl options={STATUS_FILTERS} value={statusFilter} onChange={onStatusFilterChange} ariaLabel="Filter by status" />

        <label className="relative">
          <span className="sr-only">Filter by actor name</span>
          <Search size={14} aria-hidden="true" className={cx("pointer-events-none absolute left-3 top-1/2 -translate-y-1/2", TEXT_CAPTION)} />
          <input
            type="text"
            value={actorQuery}
            onChange={(e) => onActorQueryChange(e.target.value)}
            placeholder="Filter by author…"
            className={cx(
              "h-11 w-44 rounded-lg border pl-8 pr-2.5 text-sm outline-none sm:w-52",
              BORDER,
              "bg-zinc-950",
              TEXT_PRIMARY,
              "placeholder:text-zinc-400",
              "focus-visible:ring-2 focus-visible:ring-cyan-400",
            )}
          />
        </label>

        {hasActiveFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className={cx("inline-flex h-11 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium", BORDER, TEXT_CAPTION, TRANSITION, "hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400")}
          >
            <X size={12} aria-hidden="true" />
            Clear filters
          </button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <div className={cx("flex flex-col items-center gap-2 rounded-xl border border-dashed py-12 text-center", BORDER)}>
          <ListFilter size={20} aria-hidden="true" className={TEXT_CAPTION} />
          <p className={cx("text-sm font-medium", TEXT_PRIMARY)}>No activity matches these filters.</p>
          <p className={cx("text-xs", TEXT_CAPTION)}>Try widening the time period or clearing a filter.</p>
        </div>
      ) : (
        <ul className="flex min-w-0 flex-col gap-2" aria-label="Build and deploy activity">
          {filtered.map((event) => (
            <FeedItem
              key={event.id}
              event={event}
              selected={selectedId === event.id}
              expanded={expandedIds.has(event.id)}
              onSelect={() => onSelect(event.id)}
              onToggleExpand={() => onToggleExpand(event.id)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
