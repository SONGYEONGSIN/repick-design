"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Check, Filter, Pin, Search } from "lucide-react";
import { ASSIGNEES, SERVICE_BY_ID, incidentsWithinPeriod, type Incident, type IncidentStatus, type Period, type Severity } from "./data";
import { formatAgo } from "./format";
import { Avatar, FOCUS_RING, IncidentStatusBadge, SeverityBadge, Tabs } from "./ui";

type SortKey = "age" | "severity";
type StatusTab = "all" | IncidentStatus;

const SEVERITY_RANK: Record<Severity, number> = { critical: 0, warning: 1, info: 2 };
const ALL_SEVERITIES: Severity[] = ["critical", "warning", "info"];
const SEVERITY_LABEL: Record<Severity, string> = { critical: "Critical", warning: "Warning", info: "Info" };

function PinButton({ serviceId, pinned, onPin, serviceName }: { serviceId: string; pinned: boolean; onPin: (id: string) => void; serviceName: string }) {
  return (
    <button
      type="button"
      aria-pressed={pinned}
      onClick={() => onPin(serviceId)}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md motion-safe:transition-colors ${FOCUS_RING} ${
        pinned ? "bg-violet-600 text-white" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
      }`}
    >
      <Pin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span className="sr-only">{pinned ? `${serviceName} is pinned` : `Pin ${serviceName} to the detail panel`}</span>
    </button>
  );
}

function SortHeader({
  label,
  sortKeyId,
  sortKey,
  asc,
  onToggle,
  className = "",
}: {
  label: string;
  sortKeyId: SortKey;
  sortKey: SortKey;
  asc: boolean;
  onToggle: (key: SortKey) => void;
  className?: string;
}) {
  const active = sortKey === sortKeyId;
  const Icon = active ? (asc ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th scope="col" aria-sort={active ? (asc ? "ascending" : "descending") : "none"} className={`py-2 text-left align-middle ${className}`}>
      <button
        type="button"
        onClick={() => onToggle(sortKeyId)}
        className={`inline-flex min-h-6 items-center gap-1 rounded px-1 py-0.5 font-medium text-[11px] uppercase tracking-[0.06em] motion-safe:transition-colors ${FOCUS_RING} ${
          active ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
        }`}
      >
        {label}
        <Icon className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
      </button>
    </th>
  );
}

export default function IncidentFeed({
  period,
  pinnedServiceId,
  onPin,
}: {
  period: Period;
  pinnedServiceId: string;
  onPin: (id: string) => void;
}) {
  const [statusTab, setStatusTab] = useState<StatusTab>("all");
  const [severities, setSeverities] = useState<Severity[]>(ALL_SEVERITIES);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("age");
  const [asc, setAsc] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const windowed = incidentsWithinPeriod(period);

  const counts = useMemo(
    () => ({
      all: windowed.length,
      open: windowed.filter((i) => i.status === "open").length,
      investigating: windowed.filter((i) => i.status === "investigating").length,
      resolved: windowed.filter((i) => i.status === "resolved").length,
    }),
    [windowed],
  );

  const q = search.trim().toLowerCase();
  const filtered = windowed.filter((incident) => {
    if (statusTab !== "all" && incident.status !== statusTab) return false;
    if (!severities.includes(incident.severity)) return false;
    if (q && !`${incident.serviceId} ${incident.message} ${incident.id}`.toLowerCase().includes(q)) return false;
    return true;
  });

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = sortKey === "age" ? a.ageMinutes : SEVERITY_RANK[a.severity];
      const bv = sortKey === "age" ? b.ageMinutes : SEVERITY_RANK[b.severity];
      return asc ? av - bv : bv - av;
    });
    return copy;
  }, [filtered, sortKey, asc]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setAsc((v) => !v);
    } else {
      setSortKey(key);
      setAsc(true);
    }
  }

  function toggleSeverity(s: Severity) {
    setSeverities((prev) => {
      if (prev.includes(s)) {
        const next = prev.filter((x) => x !== s);
        return next.length === 0 ? ALL_SEVERITIES : next;
      }
      return [...prev, s];
    });
  }

  const severityLabel = severities.length === ALL_SEVERITIES.length ? "All severities" : severities.map((s) => SEVERITY_LABEL[s]).join(", ");

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Tabs<StatusTab>
          ariaLabel="Filter incidents by status"
          value={statusTab}
          onChange={setStatusTab}
          options={[
            { id: "all", label: `All (${counts.all})` },
            { id: "open", label: `Open (${counts.open})` },
            { id: "investigating", label: `Investigating (${counts.investigating})` },
            { id: "resolved", label: `Resolved (${counts.resolved})` },
          ]}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-zinc-200 px-3 sm:max-w-xs">
          <Search className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search incidents…"
            aria-label="Search incidents by service or message"
            className="min-w-0 flex-1 bg-transparent font-normal text-sm text-zinc-900 placeholder:text-zinc-500"
          />
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setFilterOpen((o) => !o)}
            aria-expanded={filterOpen}
            className={`flex h-10 items-center gap-2 rounded-lg border border-zinc-200 px-3 font-normal text-sm text-zinc-600 hover:text-zinc-900 ${FOCUS_RING}`}
          >
            <Filter className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{severityLabel}</span>
          </button>
          {filterOpen ? (
            <div className="absolute left-0 top-full z-20 mt-2 w-48 rounded-lg border border-zinc-200 bg-white p-2 shadow-xl">
              <p className="px-2 py-1 font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-500">Severity</p>
              {ALL_SEVERITIES.map((s) => {
                const checked = severities.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={checked}
                    onClick={() => toggleSeverity(s)}
                    className={`flex h-9 w-full items-center justify-between rounded-md px-2 font-normal text-sm text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
                  >
                    {SEVERITY_LABEL[s]}
                    {checked ? <Check className="h-4 w-4 shrink-0 text-violet-600" aria-hidden="true" /> : null}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      {/* Mobile card list (<sm) */}
      <ul className="mt-3 divide-y divide-zinc-100 sm:hidden">
        {sorted.map((incident: Incident) => {
          const assignee = ASSIGNEES[incident.assignee];
          const pinned = incident.serviceId === pinnedServiceId;
          const serviceName = SERVICE_BY_ID[incident.serviceId].name;
          return (
            <li key={incident.id} className={pinned ? "bg-violet-50/60" : ""}>
              <div className="flex items-start gap-2 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-[11px] uppercase tracking-wide text-zinc-500">{serviceName}</p>
                  <p className="mt-0.5 font-normal text-[13px] text-zinc-900">{incident.message}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <SeverityBadge severity={incident.severity} />
                    <IncidentStatusBadge status={incident.status} />
                    <span className="font-normal text-[11px] tabular-nums text-zinc-600">{formatAgo(incident.ageMinutes)}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <Avatar initials={assignee.initials} tone={assignee.avatarClass} className="h-5 w-5 text-[9px]" />
                    <span className="font-normal text-[11px] text-zinc-600">{assignee.name}</span>
                  </div>
                </div>
                <PinButton serviceId={incident.serviceId} serviceName={serviceName} pinned={pinned} onPin={onPin} />
              </div>
            </li>
          );
        })}
        {sorted.length === 0 ? <li className="py-6 text-center font-normal text-sm text-zinc-500">No incidents match these filters.</li> : null}
      </ul>

      {/* Desktop table (sm and up) */}
      <div className="mt-3 hidden w-full sm:block">
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="sr-only">Incident feed, filterable by status and severity, sortable by age or severity</caption>
          {/*
            Column widths are sized against real rendered minimums at the narrowest
            tested desktop width (1264px → ~573px table, once the 8/12-col Feed card,
            its padding and the 12-col grid gap are subtracted), not eyeballed:
              Severity "Critical" badge  ≈ icon12 + gap4 + text(8ch@~8px)64 + badge pad16 + cell pad8 = 104px
              Status  "Investigating" badge ≈ icon12 + gap4 + text(13ch@~8px)104 + badge pad16 + cell pad8 = 144px
              Age     "16h ago" (longest formatAgo output, tabular-nums, no icon) ≈ 7ch@~7.3px + cell pad8 = 62px
              Pin     fixed h-8 w-8 button, no cell padding ≈ 36px
            Each column below clears its minimum with margin even at 1264px, and every
            wider tested width (1280–1536+) only grows the table, so the margin grows
            too. The desktop Assignee column was dropped entirely (it stayed in the
            <sm card list) to free enough width for Severity/Status/Age to each clear
            their real minimum without starving Service/Message into true overflow. */}
          <colgroup>
            <col className="w-[12%]" />
            <col className="w-[22%]" />
            <col className="w-[20%]" />
            <col className="w-[27%]" />
            <col className="w-[12%]" />
            <col className="w-[7%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200">
              <th scope="col" className="py-2 pr-2 text-left font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-500">
                Service
              </th>
              <th scope="col" className="py-2 pr-2 text-left font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-500">
                Message
              </th>
              <SortHeader label="Severity" sortKeyId="severity" sortKey={sortKey} asc={asc} onToggle={toggleSort} className="pr-2" />
              <th scope="col" className="py-2 pr-2 text-left font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-500">
                Status
              </th>
              <SortHeader label="Age" sortKeyId="age" sortKey={sortKey} asc={asc} onToggle={toggleSort} className="pr-2" />
              <th scope="col" className="py-2 text-right font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-500">
                <span className="sr-only">Pin</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {sorted.map((incident: Incident) => {
              const pinned = incident.serviceId === pinnedServiceId;
              const serviceName = SERVICE_BY_ID[incident.serviceId].name;
              return (
                <tr key={incident.id} className={pinned ? "bg-violet-50/60" : "hover:bg-zinc-50"}>
                  <td className="truncate py-2.5 pr-2 align-middle font-medium text-[13px] text-zinc-900">{serviceName}</td>
                  <td className="py-2.5 pr-2 align-middle">
                    <p className="truncate font-normal text-[13px] text-zinc-700">{incident.message}</p>
                    <p className="mt-0.5 font-normal text-[11px] text-zinc-500">{incident.id}</p>
                  </td>
                  <td className="py-2.5 pr-2 align-middle">
                    <SeverityBadge severity={incident.severity} />
                  </td>
                  <td className="py-2.5 pr-2 align-middle">
                    <IncidentStatusBadge status={incident.status} />
                  </td>
                  <td className="whitespace-nowrap py-2.5 pr-2 align-middle font-normal text-[13px] tabular-nums text-zinc-600">
                    {formatAgo(incident.ageMinutes)}
                  </td>
                  <td className="py-2.5 text-right align-middle">
                    <PinButton serviceId={incident.serviceId} serviceName={serviceName} pinned={pinned} onPin={onPin} />
                  </td>
                </tr>
              );
            })}
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center font-normal text-sm text-zinc-500">
                  No incidents match these filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
