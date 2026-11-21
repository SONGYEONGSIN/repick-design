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
  className = "",
}: {
  label: string;
  sortKey: SortKey;
  active: boolean;
  dir: SortDir;
  onSort: (key: SortKey) => void;
  className?: string;
}) {
  return (
    <th scope="col" aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"} className={`px-3 py-2 text-left ${className}`}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 hover:text-zinc-900 ${FOCUS_RING}`}
      >
        {label}
        {active ? (
          dir === "asc" ? (
            <ArrowUp className="h-3 w-3" aria-hidden="true" />
          ) : (
            <ArrowDown className="h-3 w-3" aria-hidden="true" />
          )
        ) : (
          <ArrowUpDown className="h-3 w-3 text-zinc-300" aria-hidden="true" />
        )}
      </button>
    </th>
  );
}

function PreviewStrip({ incident }: { incident: Incident | null }) {
  if (!incident) {
    return (
      <div className="flex h-16 items-center rounded-lg border border-dashed border-zinc-200 px-3 text-sm text-zinc-500">
        Hover or focus a row — or use ⌘K — to preview an incident here. This preview never changes the hero number or the stats above: it is a separate, self-contained axis.
      </div>
    );
  }
  const owner = getOwner(incident.ownerId);
  const sla = withinSla(incident);
  return (
    <div className="flex h-auto min-h-16 flex-wrap items-center gap-4 rounded-lg border border-orange-200 bg-orange-50/40 px-3 py-2.5">
      <div className="flex items-center gap-2">
        <Avatar name={owner.name} photoId={owner.photoId} size={32} />
        <div className="min-w-0 text-sm">
          <p className="font-medium text-zinc-900">{owner.name}</p>
          <p className="text-xs text-zinc-500">On-call owner</p>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-zinc-900">
          {incident.id} — {incident.title}
        </p>
        <p className="text-xs text-zinc-500">{incident.service} · opened {incident.openedLabel}</p>
      </div>
      <div className="flex items-center gap-2">
        <SeverityBadge severity={incident.severity} />
        <SlaBadge withinSla={sla} />
      </div>
      <div className="flex items-center gap-1 text-xs text-zinc-500">
        <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
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
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">Recent incidents</h2>
          <p className="text-xs text-zinc-500">
            {rows.length} of {periodIncidents.length} incidents shown
          </p>
        </div>
        <SegmentedControl label="Filter by severity" value={severityFilter} onChange={setSeverityFilter} options={SEVERITY_FILTERS} />
      </div>

      {/* Independent axis: hover/focus on a row (or a ⌘K jump) only updates `previewedId`, which is
         scoped to this card. It intentionally never reads or writes the period state that drives
         the hero number and the inline-stat tiles above — the two axes are not wired together. */}
      <div className="mb-3">
        <PreviewStrip incident={previewed} />
      </div>

      {/* Desktop/tablet: a real sortable table. table-fixed + colgroup percentages, min-w lives on
         the <table>, not on any <td>. Row body scrolls vertically (not horizontally) past 6 rows. */}
      <div className="hidden lg:block">
        <div className="max-h-[420px] overflow-y-auto rounded-lg border border-zinc-200">
          <table className="w-full table-fixed border-collapse text-sm">
            <caption className="sr-only">Recent incidents for the selected period, sortable by column</caption>
            {/* ID and Severity were undersized (9% each) for their actual rendered content — the
               ID button's tabular-nums text and the "Severity" sort-header label + icon both
               visually bled into the next column at narrower desktop widths. Width is taken from
               Title (wraps via line-clamp-2, so it has slack) and SLA (badge has roomy slack). */}
            <colgroup>
              <col style={{ width: "15%" }} />
              <col style={{ width: "19%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "17%" }} />
            </colgroup>
            <thead className="sticky top-0 z-10 bg-zinc-50">
              <tr className="border-b border-zinc-200">
                <SortHeader label="ID" sortKey="id" active={sortKey === "id"} dir={sortDir} onSort={handleSort} />
                <th scope="col" className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                  Title
                </th>
                <SortHeader label="Service" sortKey="service" active={sortKey === "service"} dir={sortDir} onSort={handleSort} />
                <SortHeader label="Severity" sortKey="severity" active={sortKey === "severity"} dir={sortDir} onSort={handleSort} />
                <th scope="col" className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                  Owner
                </th>
                <SortHeader label="Resolved" sortKey="resolveMinutes" active={sortKey === "resolveMinutes"} dir={sortDir} onSort={handleSort} className="text-right" />
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
                    className={`border-b border-zinc-100 last:border-0 ${
                      previewedId === incident.id ? "bg-orange-50/50" : "hover:bg-zinc-50"
                    }`}
                  >
                    <td className="whitespace-nowrap px-3 py-2.5">
                      {/* The row's only focusable control: keyboard users Tab here to preview the
                         row, instead of a non-interactive <tr> carrying a tabIndex. */}
                      <button
                        type="button"
                        onFocus={() => onPreview(incident.id)}
                        onBlur={() => onPreview(null)}
                        className={`font-medium tabular-nums text-zinc-700 ${FOCUS_RING} rounded`}
                      >
                        {incident.id}
                      </button>
                    </td>
                    <td className="min-w-0 px-3 py-2.5">
                      <span className="line-clamp-2 break-words text-zinc-900">{incident.title}</span>
                    </td>
                    <td className="truncate px-3 py-2.5 text-zinc-600">{incident.service}</td>
                    <td className="px-3 py-2.5">
                      <SeverityBadge severity={incident.severity} />
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="flex items-center gap-1.5 text-zinc-700">
                        <Avatar name={owner.name} photoId={owner.photoId} size={20} />
                        <span className="truncate">{firstName}</span>
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-zinc-700">{incident.resolveMinutes}m</td>
                    <td className="px-3 py-2.5">
                      <SlaBadge withinSla={sla} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: the same rows as a stacked card list instead of a cramped table — no horizontal
         scroll anywhere on this page, mobile included. */}
      <ul className="flex flex-col gap-2 lg:hidden">
        {rows.map((incident) => {
          const owner = getOwner(incident.ownerId);
          const sla = withinSla(incident);
          return (
            <li key={incident.id}>
              <button
                type="button"
                onClick={() => onPreview(previewedId === incident.id ? null : incident.id)}
                onFocus={() => onPreview(incident.id)}
                onBlur={() => onPreview(null)}
                className={`w-full rounded-lg border px-3 py-2.5 text-left ${FOCUS_RING} ${
                  previewedId === incident.id ? "border-orange-300 bg-orange-50/50" : "border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium tabular-nums text-zinc-700">{incident.id}</span>
                  <SeverityBadge severity={incident.severity} />
                </div>
                <p className="mt-1 line-clamp-2 break-words text-sm text-zinc-900">{incident.title}</p>
                <div className="mt-1.5 flex min-w-0 items-center justify-between gap-2 text-xs text-zinc-500">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <Avatar name={owner.name} photoId={owner.photoId} size={18} />
                    <span className="truncate">{incident.service}</span>
                  </span>
                  <SlaBadge withinSla={sla} />
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
