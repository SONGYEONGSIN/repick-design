"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Clock3 } from "lucide-react";
import { getIncidentsForPeriod, getOwner, SLA_TARGET_MINUTES, type Incident, type Period, type Severity } from "./data";
import { Avatar, Card, FOCUS_RING, SegmentedControl, SeverityBadge, SlaBadge } from "./ui";

type SortKey = "id" | "service" | "severity" | "resolveMinutes" | "sla";
type SortDir = "asc" | "desc";

const SEVERITY_RANK: Record<Severity, number> = { P1: 1, P2: 2, P3: 3 };
const SEVERITY_FILTERS: { value: Severity | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "P1", label: "P1" },
  { value: "P2", label: "P2" },
  { value: "P3", label: "P3" },
];

function numericId(id: string): number {
  return Number(id.replace(/[^0-9]/g, ""));
}

function withinSla(incident: Incident): boolean {
  return incident.resolveMinutes <= SLA_TARGET_MINUTES[incident.severity];
}

function sortIncidents(list: Incident[], key: SortKey, dir: SortDir): Incident[] {
  const sorted = [...list].sort((a, b) => {
    let cmp = 0;
    if (key === "id") cmp = numericId(a.id) - numericId(b.id);
    else if (key === "service") cmp = a.service.localeCompare(b.service);
    else if (key === "severity") cmp = SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
    else if (key === "resolveMinutes") cmp = a.resolveMinutes - b.resolveMinutes;
    else cmp = Number(withinSla(a)) - Number(withinSla(b));
    return dir === "asc" ? cmp : -cmp;
  });
  return sorted;
}

function SortHeader({
  label,
  sortKey,
  active,
  dir,
  onSort,
  align = "left",
}: {
  label: string;
  sortKey: SortKey;
  active: boolean;
  dir: SortDir;
  onSort: (key: SortKey) => void;
  align?: "left" | "right";
}) {
  return (
    <th
      scope="col"
      aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
      className={`overflow-hidden px-3 py-2 ${align === "right" ? "text-right" : "text-left"}`}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`inline-flex min-w-0 max-w-full items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-zinc-500 hover:text-zinc-900 ${FOCUS_RING}`}
      >
        <span className="min-w-0 truncate">{label}</span>
        {active ? (
          dir === "asc" ? (
            <ArrowUp className="h-3 w-3 shrink-0" aria-hidden="true" />
          ) : (
            <ArrowDown className="h-3 w-3 shrink-0" aria-hidden="true" />
          )
        ) : (
          <ArrowUpDown className="h-3 w-3 shrink-0 text-zinc-300" aria-hidden="true" />
        )}
      </button>
    </th>
  );
}

function PreviewStrip({ incident }: { incident: Incident | null }) {
  if (!incident) {
    return (
      <div className="flex h-auto min-h-16 min-w-0 items-center rounded-lg border border-dashed border-zinc-200 px-3 py-2.5 text-sm text-zinc-500">
        <span className="min-w-0 break-words">
          Hover or focus a row — or use ⌘K — to preview an incident here. This preview is a separate, self-contained axis from the period and stat tiles above.
        </span>
      </div>
    );
  }
  const owner = getOwner(incident.ownerId);
  const sla = withinSla(incident);
  return (
    <div className="flex h-auto min-h-16 min-w-0 flex-wrap items-center gap-4 rounded-lg border border-orange-200 bg-orange-50/40 px-3 py-2.5">
      <div className="flex min-w-0 shrink-0 items-center gap-2">
        <Avatar name={owner.name} photoId={owner.photoId} size={32} />
        <div className="min-w-0 text-sm">
          <p className="truncate font-medium text-zinc-900">{owner.name}</p>
          <p className="truncate text-xs text-zinc-500">On-call owner</p>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-900">
          {incident.id} — {incident.title}
        </p>
        <p className="truncate text-xs text-zinc-500">
          {incident.service} · opened {incident.openedLabel}
        </p>
      </div>
      <div className="flex min-w-0 shrink-0 items-center gap-2">
        <SeverityBadge severity={incident.severity} />
        <SlaBadge withinSla={sla} />
      </div>
      <div className="flex min-w-0 shrink-0 items-center gap-1 whitespace-nowrap text-xs text-zinc-500">
        <Clock3 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Ack {incident.ackMinutes}m · Resolve {incident.resolveMinutes}m
      </div>
    </div>
  );
}

export function IncidentsTable({
  period,
  previewedId,
  onPreview,
}: {
  period: Period;
  previewedId: string | null;
  onPreview: (id: string | null) => void;
}) {
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const periodIncidents = useMemo(() => getIncidentsForPeriod(period), [period]);
  const filtered = useMemo(
    () => (severityFilter === "all" ? periodIncidents : periodIncidents.filter((i) => i.severity === severityFilter)),
    [periodIncidents, severityFilter],
  );
  const rows = useMemo(() => sortIncidents(filtered, sortKey, sortDir), [filtered, sortKey, sortDir]);
  const previewed = rows.find((r) => r.id === previewedId) ?? periodIncidents.find((r) => r.id === previewedId) ?? null;

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <Card className="min-w-0">
      <div className="mb-3 flex min-w-0 flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-zinc-900">Recent incidents</h2>
          <p className="truncate text-xs text-zinc-500">
            {rows.length} of {periodIncidents.length} incidents shown
          </p>
        </div>
        <SegmentedControl label="Filter by severity" value={severityFilter} onChange={setSeverityFilter} options={SEVERITY_FILTERS} />
      </div>

      {/* Independent axis: hover/focus on a row (or a ⌘K jump) only updates `previewedId`, scoped
         to this card. It never reads or writes the period state that drives the hero number and
         inline-stat tiles above — the two axes stay un-threaded. */}
      <div className="mb-3 min-w-0">
        <PreviewStrip incident={previewed} />
      </div>

      {/* Desktop/tablet: a real sortable table. table-fixed + colgroup percentages (sum to 100%),
         fully fluid — no min-w floor anywhere (an artificial min-w on the table forced a real
         horizontal scrollbar at 1280-1440px, where this pane is narrower than that floor; the
         brief requires zero desktop table scrollbars, so columns shrink with the pane instead and
         every th/td already carries its own overflow-hidden/truncate clipping safety net).
         No overflow-x-auto wrapper on desktop at all — the row body scrolls vertically only. */}
      <div className="hidden min-w-0 lg:block">
        <div className="relative min-w-0 rounded-lg border border-zinc-200">
          <div className="max-h-[420px] min-w-0 overflow-y-auto">
            <table className="w-full min-w-0 table-fixed border-collapse text-sm">
              <caption className="sr-only">Recent incidents for the selected period, sortable by column</caption>
              <colgroup>
                <col style={{ width: "12%" }} />
                <col style={{ width: "22%" }} />
                <col style={{ width: "13%" }} />
                <col style={{ width: "11%" }} />
                <col style={{ width: "13%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "17%" }} />
              </colgroup>
              <thead className="sticky top-0 z-10 bg-zinc-50">
                <tr className="border-b border-zinc-200">
                  <SortHeader label="ID" sortKey="id" active={sortKey === "id"} dir={sortDir} onSort={handleSort} />
                  <th scope="col" className="overflow-hidden px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                    <span className="truncate">Title</span>
                  </th>
                  <SortHeader label="Service" sortKey="service" active={sortKey === "service"} dir={sortDir} onSort={handleSort} />
                  <SortHeader label="Severity" sortKey="severity" active={sortKey === "severity"} dir={sortDir} onSort={handleSort} />
                  <th scope="col" className="overflow-hidden px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                    <span className="truncate">Owner</span>
                  </th>
                  <SortHeader label="Resolved" sortKey="resolveMinutes" active={sortKey === "resolveMinutes"} dir={sortDir} onSort={handleSort} align="right" />
                  <SortHeader label="SLA" sortKey="sla" active={sortKey === "sla"} dir={sortDir} onSort={handleSort} />
                </tr>
              </thead>
              <tbody>
                {rows.map((incident) => {
                  const owner = getOwner(incident.ownerId);
                  const sla = withinSla(incident);
                  const firstName = owner.name.split(" ")[0];
                  return (
                    <tr
                      key={incident.id}
                      onMouseEnter={() => onPreview(incident.id)}
                      onMouseLeave={() => onPreview(null)}
                      className={`border-b border-zinc-100 last:border-0 ${previewedId === incident.id ? "bg-orange-50/50" : "hover:bg-zinc-50"}`}
                    >
                      <td className="overflow-hidden whitespace-nowrap px-3 py-2.5 font-normal">
                        {/* The row's only focusable control: keyboard users Tab here to preview the
                           row, instead of a non-interactive <tr> carrying a tabIndex. */}
                        <button
                          type="button"
                          onFocus={() => onPreview(incident.id)}
                          onBlur={() => onPreview(null)}
                          className={`font-medium tabular-nums text-zinc-700 ${FOCUS_RING}`}
                        >
                          {incident.id}
                        </button>
                      </td>
                      <td className="overflow-hidden px-3 py-2.5 font-normal">
                        <span className="line-clamp-2 break-words text-zinc-900">{incident.title}</span>
                      </td>
                      <td className="overflow-hidden truncate px-3 py-2.5 font-normal text-zinc-600">{incident.service}</td>
                      <td className="overflow-hidden px-3 py-2.5 font-normal">
                        <SeverityBadge severity={incident.severity} />
                      </td>
                      <td className="overflow-hidden px-3 py-2.5 font-normal">
                        <span className="flex min-w-0 items-center gap-1.5 text-zinc-700">
                          <Avatar name={owner.name} photoId={owner.photoId} size={20} />
                          <span className="min-w-0 truncate">{firstName}</span>
                        </span>
                      </td>
                      <td className="overflow-hidden whitespace-nowrap px-3 py-2.5 text-right font-normal tabular-nums text-zinc-700">
                        {incident.resolveMinutes}m
                      </td>
                      <td className="overflow-hidden px-3 py-2.5 font-normal">
                        <SlaBadge withinSla={sla} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile: the same rows as a stacked card list instead of a cramped table — no horizontal
         scroll anywhere on mobile. */}
      <ul className="flex min-w-0 flex-col gap-2 lg:hidden">
        {rows.map((incident) => {
          const owner = getOwner(incident.ownerId);
          const sla = withinSla(incident);
          return (
            <li key={incident.id} className="min-w-0">
              <button
                type="button"
                onClick={() => onPreview(previewedId === incident.id ? null : incident.id)}
                onFocus={() => onPreview(incident.id)}
                onBlur={() => onPreview(null)}
                className={`w-full min-w-0 rounded-lg border px-3 py-2.5 text-left ${FOCUS_RING} ${
                  previewedId === incident.id ? "border-orange-300 bg-orange-50/50" : "border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                <div className="flex min-w-0 items-center justify-between gap-2">
                  <span className="min-w-0 truncate text-sm font-medium tabular-nums text-zinc-700">{incident.id}</span>
                  <span className="shrink-0">
                    <SeverityBadge severity={incident.severity} />
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 min-w-0 break-words text-sm text-zinc-900">{incident.title}</p>
                <div className="mt-1.5 flex min-w-0 items-center justify-between gap-2 text-xs text-zinc-500">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <Avatar name={owner.name} photoId={owner.photoId} size={18} />
                    <span className="min-w-0 truncate">{incident.service}</span>
                  </span>
                  <span className="shrink-0">
                    <SlaBadge withinSla={sla} />
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
