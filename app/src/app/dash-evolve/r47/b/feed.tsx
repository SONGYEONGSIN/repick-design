"use client";

import { useMemo, useState } from "react";
import { BookOpen, Rows3, Table2 } from "lucide-react";
import {
  ENGINEERS,
  SEVERITY_RANK,
  STATUS_RANK,
  regionLabel,
  serviceLabel,
  type EngineerId,
  type FeedFilter,
  type Incident,
} from "./data";
import { Avatar, Card, FOCUS_RING, SegmentedControl, SeverityBadge, SortHeader, StatusBadge } from "./ui";
import { IncidentComposer, type DraftIncident } from "./composer";

type SortKey = "id" | "service" | "severity" | "status" | "time";
type SortDir = "asc" | "desc";

const FILTER_OPTIONS: { value: FeedFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "acknowledged", label: "Acked" },
  { value: "critical", label: "Critical" },
  { value: "resolved", label: "Resolved" },
];

function applyFeedFilter(incidents: Incident[], filter: FeedFilter): Incident[] {
  if (filter === "all") return incidents;
  if (filter === "critical") return incidents.filter((i) => i.severity === "critical");
  return incidents.filter((i) => i.status === filter);
}

function timeText(incident: Incident): string {
  if (incident.status === "resolved") return `Resolved in ${incident.resolutionMinutes}m`;
  return `${incident.elapsedMinutes}m elapsed`;
}

function timeSortValue(incident: Incident): number {
  return incident.status === "resolved" ? -(incident.resolutionMinutes ?? 0) : incident.elapsedMinutes ?? 0;
}

function engineerName(id: EngineerId | null): string {
  return id ? ENGINEERS[id].name : "Unassigned";
}

/**
 * The page's "main character": a live incident stream. Two kinds of state live here and never
 * leave this file:
 *  - `view` / `sortKey` / `sortDir` — ordinary view state for this widget alone.
 *  - `hoverId` — tier-3 mechanism (b), the ephemeral inspector. It is written by hovering or
 *    focusing a stream row and reset to `null` on blur/mouse-leave, which simply means "show the
 *    first currently-filtered incident" (see `inspected` below) — so the inspector is NEVER an
 *    empty placeholder, and nothing outside this file ever reads `hoverId`.
 *
 * `feedFilter` is passed in from `page.tsx` because both this widget's own filter chips AND the
 * command palette write to it — an ordinary shared view filter, not an identity selection. It is
 * never the same channel as `hoverId` or the heatmap's `pinnedKey`.
 */
export function IncidentFeed({
  incidents,
  feedFilter,
  onFeedFilterChange,
  composerOpen,
  onCloseComposer,
  onAddIncident,
}: {
  incidents: Incident[];
  feedFilter: FeedFilter;
  onFeedFilterChange: (filter: FeedFilter) => void;
  composerOpen: boolean;
  onCloseComposer: () => void;
  onAddIncident: (draft: DraftIncident) => void;
}) {
  const [view, setView] = useState<"stream" | "table">("stream");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [hoverId, setHoverId] = useState<string | null>(null);

  const filtered = useMemo(() => applyFeedFilter(incidents, feedFilter), [incidents, feedFilter]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "id":
          cmp = Number(a.id.replace("INC-", "")) - Number(b.id.replace("INC-", ""));
          break;
        case "service":
          cmp = serviceLabel(a.serviceId).localeCompare(serviceLabel(b.serviceId));
          break;
        case "severity":
          cmp = SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
          break;
        case "status":
          cmp = STATUS_RANK[a.status] - STATUS_RANK[b.status];
          break;
        case "time":
          cmp = timeSortValue(a) - timeSortValue(b);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const inspected = filtered.find((i) => i.id === hoverId) ?? filtered[0] ?? null;

  return (
    <Card as="section" id="feed-section" ariaLabelledBy="feed-title" className="flex min-w-0 flex-col p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 id="feed-title" className="text-sm font-semibold text-zinc-50">
            Incident Feed
          </h2>
          <p className="mt-0.5 font-normal text-xs text-zinc-400">{filtered.length} incidents matching the current filter</p>
        </div>
        <SegmentedControl
          label="Feed view"
          value={view}
          onChange={setView}
          options={[
            { value: "stream", label: "Stream" },
            { value: "table", label: "Table" },
          ]}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Filter incidents">
        {FILTER_OPTIONS.map((opt) => {
          const active = opt.value === feedFilter;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={active}
              onClick={() => onFeedFilterChange(opt.value)}
              className={`flex h-7 items-center rounded-full border px-2.5 font-medium text-[11px] motion-safe:transition-colors ${FOCUS_RING} ${
                active ? "border-rose-700 bg-rose-950 text-rose-300" : "border-white/10 text-zinc-400 hover:text-zinc-50"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {composerOpen ? (
        <div className="mt-4">
          <IncidentComposer
            onSubmit={(draft) => {
              onAddIncident(draft);
            }}
            onCancel={onCloseComposer}
          />
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <p className="mt-6 font-normal text-sm text-zinc-400">No incidents match this filter.</p>
      ) : view === "stream" ? (
        <div className="mt-4 min-w-0">
          <ul className="max-h-[420px] min-w-0 space-y-2 overflow-y-auto pr-1">
            {sorted.map((incident) => {
              const isFocused = (hoverId ?? filtered[0]?.id) === incident.id;
              return (
                <li key={incident.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setHoverId(incident.id)}
                    onFocus={() => setHoverId(incident.id)}
                    onMouseLeave={() => setHoverId(null)}
                    onBlur={() => setHoverId(null)}
                    className={`flex w-full min-w-0 items-center gap-3 rounded-lg border px-3 py-2.5 text-left motion-safe:transition-colors ${FOCUS_RING} ${
                      isFocused ? "border-rose-800/60 bg-rose-500/5" : "border-white/10 hover:bg-white/5"
                    }`}
                  >
                    <Avatar name={engineerName(incident.assignee)} avatarId={incident.assignee ? ENGINEERS[incident.assignee].avatarId : null} size={28} />
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <span className="shrink-0 font-normal text-[11px] tabular-nums text-zinc-400">{incident.id}</span>
                        <span className="min-w-0 flex-1 truncate font-medium text-sm text-zinc-50">{incident.title}</span>
                      </div>
                      <p className="mt-0.5 truncate font-normal text-xs text-zinc-400">
                        {serviceLabel(incident.serviceId)} · {regionLabel(incident.regionId)} · {timeText(incident)}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <SeverityBadge severity={incident.severity} />
                      <StatusBadge status={incident.status} />
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          {inspected ? (
            <div className="mt-3 rounded-lg border border-white/10 bg-zinc-950/60 p-3">
              <p className="flex items-center gap-1.5 font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-400">
                <BookOpen className="h-3 w-3" aria-hidden="true" />
                Inspector
              </p>
              <p className="mt-1.5 font-medium text-sm text-zinc-50">
                {inspected.id} · {inspected.title}
              </p>
              <p className="mt-1 font-normal text-xs text-zinc-400">
                {serviceLabel(inspected.serviceId)} in {regionLabel(inspected.regionId)} — assigned to {engineerName(inspected.assignee)}
                {inspected.assignee ? `, ${ENGINEERS[inspected.assignee].role}` : ""}.
              </p>
              <p className="mt-1 font-normal text-xs text-zinc-400">{inspected.runbook} · {timeText(inspected)}</p>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-4 min-w-0">
          {/* Desktop/tablet: the real sortable data table. */}
          <table className="hidden w-full table-fixed border-collapse text-sm sm:table">
            <caption className="sr-only">Incidents, sortable by column, filtered to the active chip above.</caption>
            <colgroup>
              <col style={{ width: "30%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "12%" }} />
            </colgroup>
            <thead>
              <tr className="border-b border-white/10">
                <SortHeader label="Incident" active={sortKey === "id"} dir={sortDir} onSort={() => handleSort("id")} />
                <SortHeader label="Service" active={sortKey === "service"} dir={sortDir} onSort={() => handleSort("service")} />
                <th scope="col" className="px-2 py-2 text-left font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-400">
                  Region
                </th>
                <SortHeader label="Severity" active={sortKey === "severity"} dir={sortDir} onSort={() => handleSort("severity")} />
                <SortHeader label="Status" active={sortKey === "status"} dir={sortDir} onSort={() => handleSort("status")} />
                <SortHeader label="Time" active={sortKey === "time"} dir={sortDir} onSort={() => handleSort("time")} align="right" />
                <th scope="col" className="px-2 py-2 text-left font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-400">
                  Assignee
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((incident) => (
                <tr key={incident.id} className="border-b border-white/5 hover:bg-white/5">
                  <th scope="row" className="min-w-0 px-2 py-2 text-left font-normal">
                    <span className="block truncate font-normal text-[11px] tabular-nums text-zinc-400">{incident.id}</span>
                    <span className="block truncate font-medium text-sm text-zinc-50">{incident.title}</span>
                  </th>
                  <td className="truncate px-2 py-2 font-normal text-xs text-zinc-300">{serviceLabel(incident.serviceId)}</td>
                  <td className="truncate px-2 py-2 font-normal text-xs text-zinc-300">{regionLabel(incident.regionId)}</td>
                  <td className="px-2 py-2">
                    <SeverityBadge severity={incident.severity} />
                  </td>
                  <td className="px-2 py-2">
                    <StatusBadge status={incident.status} />
                  </td>
                  <td className="px-2 py-2 text-right font-normal text-xs tabular-nums text-zinc-300">{timeText(incident)}</td>
                  <td className="min-w-0 px-2 py-2">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <Avatar name={engineerName(incident.assignee)} avatarId={incident.assignee ? ENGINEERS[incident.assignee].avatarId : null} size={20} />
                      <span className="min-w-0 truncate font-normal text-xs text-zinc-300">{engineerName(incident.assignee)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile: card-list fallback, same data, no horizontal scroll. */}
          <ul className="space-y-2 sm:hidden">
            {sorted.map((incident) => (
              <li key={incident.id} className="rounded-lg border border-white/10 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-normal text-[11px] tabular-nums text-zinc-400">{incident.id}</p>
                    <p className="truncate font-medium text-sm text-zinc-50">{incident.title}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <SeverityBadge severity={incident.severity} />
                    <StatusBadge status={incident.status} />
                  </div>
                </div>
                <p className="mt-1.5 font-normal text-xs text-zinc-400">
                  {serviceLabel(incident.serviceId)} · {regionLabel(incident.regionId)} · {timeText(incident)}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <Avatar name={engineerName(incident.assignee)} avatarId={incident.assignee ? ENGINEERS[incident.assignee].avatarId : null} size={20} />
                  <span className="font-normal text-xs text-zinc-300">{engineerName(incident.assignee)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-3 flex items-center gap-1.5 border-t border-white/10 pt-3 font-normal text-[11px] text-zinc-400">
        {view === "stream" ? <Rows3 className="h-3 w-3" aria-hidden="true" /> : <Table2 className="h-3 w-3" aria-hidden="true" />}
        Sorted by {sortKey === "id" ? "incident" : sortKey} · {sortDir === "desc" ? "descending" : "ascending"}
      </div>
    </Card>
  );
}
