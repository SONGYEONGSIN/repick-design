"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, CircleAlert, Info, TriangleAlert } from "lucide-react";
import {
  REGIONS,
  EVENTS,
  balanceOf,
  renewableShareOf,
  statusOf,
  formatSignedMw,
  formatPct,
  STATUS_LABEL,
  SEVERITY_LABEL,
  type Severity,
  type EventStatus,
} from "./data";
import Badge, { type BadgeTone } from "./components/Badge";
import Card from "./components/Card";
import Tabs from "./components/Tabs";
import FilterMenu from "./components/FilterMenu";
import { STORAGE_COLOR, GAS_COLOR, WIND_COLOR, SOLAR_COLOR } from "./components/chartColors";
import { FOCUS_RING_INSET } from "./components/focus";

const SEVERITY_RANK: Record<Severity, number> = { critical: 3, warning: 2, info: 1 };
const SEVERITY_TONE: Record<Severity, BadgeTone> = { critical: "rose", warning: "amber", info: "zinc" };
const SEVERITY_ICON: Record<Severity, typeof CircleAlert> = { critical: CircleAlert, warning: TriangleAlert, info: Info };

type SortDir = "asc" | "desc" | null;

export default function EventFeed({ pinnedRegionId }: { pinnedRegionId: string }) {
  const [tab, setTab] = useState<EventStatus>("active");
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [severities, setSeverities] = useState<Set<Severity>>(() => new Set<Severity>(["critical", "warning", "info"]));

  const activeCount = EVENTS.filter((e) => e.status === "active").length;
  const resolvedCount = EVENTS.filter((e) => e.status === "resolved").length;

  const filtered = useMemo(
    () => EVENTS.filter((e) => e.status === tab && severities.has(e.severity)),
    [tab, severities],
  );

  const sorted = useMemo(() => {
    if (!sortDir) return filtered;
    const copy = filtered.slice();
    copy.sort((a, b) =>
      sortDir === "asc" ? SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] : SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity],
    );
    return copy;
  }, [filtered, sortDir]);

  function toggleSort() {
    setSortDir((d) => (d === "desc" ? "asc" : "desc"));
  }
  function toggleSeverity(s: Severity) {
    setSeverities((prev) => {
      const next = new Set(prev);
      if (next.has(s) && next.size > 1) next.delete(s);
      else next.add(s);
      return next;
    });
  }

  const ariaSort = sortDir === "asc" ? "ascending" : sortDir === "desc" ? "descending" : "none";

  const pinnedRegion = REGIONS.find((r) => r.id === pinnedRegionId) ?? REGIONS[0];
  const pinnedLatest = pinnedRegion.hourly[pinnedRegion.hourly.length - 1];
  const pinnedBalance = balanceOf(pinnedLatest);
  const pinnedStatus = statusOf(pinnedLatest);
  const pinnedShare = renewableShareOf(pinnedLatest);
  const mixTotal = pinnedLatest.solarMw + pinnedLatest.windMw + pinnedLatest.gasMw + pinnedLatest.storageMw || 1;
  const mix = [
    { label: "Solar", value: pinnedLatest.solarMw, color: SOLAR_COLOR },
    { label: "Wind", value: pinnedLatest.windMw, color: WIND_COLOR },
    { label: "Gas", value: pinnedLatest.gasMw, color: GAS_COLOR },
    { label: "Storage", value: pinnedLatest.storageMw, color: STORAGE_COLOR },
  ];

  return (
    <section aria-labelledby="feed-heading" className="flex h-full min-h-0 flex-col">
      <h2 id="feed-heading" className="sr-only">
        Pinned region snapshot and grid events
      </h2>

      <div className="shrink-0 border-b border-white/10 p-3">
        <Card className="p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Pinned region</p>
            <Badge tone={badgeToneForStatus(pinnedStatus)}>{STATUS_LABEL[pinnedStatus]}</Badge>
          </div>
          <p className="mt-1 truncate text-base font-semibold text-zinc-50">{pinnedRegion.name}</p>
          <p className="text-xs text-zinc-400">{pinnedRegion.description}</p>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wide text-zinc-400">Balance</p>
              <p className={`truncate text-sm font-semibold tabular-nums ${pinnedBalance >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                {formatSignedMw(pinnedBalance)}
              </p>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wide text-zinc-400">Renewable share</p>
              <p className="truncate text-sm font-semibold tabular-nums text-indigo-300">{formatPct(pinnedShare)}</p>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-white/10" role="img" aria-label={`Generation mix for ${pinnedRegion.name}: ${mix.map((m) => `${m.label} ${formatPct((m.value / mixTotal) * 100, 0)}`).join(", ")}`}>
              {mix.map((m) => (
                <span
                  key={m.label}
                  aria-hidden="true"
                  className="h-full first:rounded-l-full last:rounded-r-full"
                  style={{ width: `${(m.value / mixTotal) * 100}%`, backgroundColor: m.color }}
                />
              ))}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-zinc-400">
              {mix.map((m) => (
                <span key={m.label} className="flex items-center gap-1">
                  <span aria-hidden="true" className="size-2 rounded-sm" style={{ backgroundColor: m.color }} />
                  {m.label}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-2 pt-1">
        <Tabs
          ariaLabel="Event status"
          tabs={[
            { id: "active" as EventStatus, label: "Active", count: activeCount },
            { id: "resolved" as EventStatus, label: "Resolved", count: resolvedCount },
          ]}
          activeId={tab}
          onChange={(id) => setTab(id)}
        />
        <div className="pr-3">
          <FilterMenu
            label="Severity"
            options={[
              { value: "critical" as Severity, label: SEVERITY_LABEL.critical },
              { value: "warning" as Severity, label: SEVERITY_LABEL.warning },
              { value: "info" as Severity, label: SEVERITY_LABEL.info },
            ]}
            selected={severities}
            onToggle={toggleSeverity}
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
        {sorted.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-zinc-400">No events match the current filters.</p>
        ) : (
          <table className="w-full table-fixed border-collapse text-xs">
            <caption className="sr-only">
              {tab === "active" ? "Active" : "Resolved"} grid events, sorted by severity {ariaSort}
            </caption>
            <colgroup>
              <col style={{ width: "38%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "22%" }} />
            </colgroup>
            <thead>
              <tr className="border-b border-white/10 text-zinc-400">
                <th scope="col" className="px-2 py-2 text-left font-medium">
                  Event
                </th>
                <th scope="col" className="px-2 py-2 text-left font-medium">
                  Region
                </th>
                <th scope="col" aria-sort={ariaSort as "ascending" | "descending" | "none"} className="px-2 py-2 text-left font-medium">
                  <button type="button" onClick={toggleSort} className={`flex items-center gap-1 rounded px-1 py-1.5 ${FOCUS_RING_INSET}`}>
                    Severity
                    {sortDir === "asc" ? (
                      <ArrowUp aria-hidden="true" className="size-3" />
                    ) : sortDir === "desc" ? (
                      <ArrowDown aria-hidden="true" className="size-3" />
                    ) : (
                      <ArrowUpDown aria-hidden="true" className="size-3 opacity-60" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-2 py-2 text-left font-medium">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((event) => {
                const region = REGIONS.find((r) => r.id === event.regionId);
                const Icon = SEVERITY_ICON[event.severity];
                return (
                  <tr key={event.id} className="border-b border-white/5">
                    <td className="px-2 py-2">
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-medium text-zinc-100">{event.type}</span>
                        <span className="truncate text-zinc-400">{event.message}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-zinc-300">
                      <span className="block truncate">{region?.code ?? "—"}</span>
                    </td>
                    <td className="px-2 py-2">
                      <span className="flex items-center gap-1">
                        <Icon aria-hidden="true" className={`size-3 shrink-0 ${SEVERITY_COLOR_CLASS[event.severity]}`} />
                        <Badge tone={SEVERITY_TONE[event.severity]}>{SEVERITY_LABEL[event.severity]}</Badge>
                      </span>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-zinc-400">{event.time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

const SEVERITY_COLOR_CLASS: Record<Severity, string> = {
  critical: "text-rose-400",
  warning: "text-amber-400",
  info: "text-zinc-400",
};

function badgeToneForStatus(status: ReturnType<typeof statusOf>): BadgeTone {
  if (status === "surplus") return "emerald";
  if (status === "balanced") return "indigo";
  if (status === "tight") return "amber";
  return "rose";
}
