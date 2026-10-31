"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardHeader, Badge, FOCUS_RING } from "./ui";
import { INCIDENTS, SERVICE_BY_ID, type Incident, type Severity, type IncidentStatus } from "./data";

type SortKey = "severity" | "service" | "status" | "duration";
type SortDir = "asc" | "desc";

const SEVERITY_RANK: Record<Severity, number> = { "SEV-1": 0, "SEV-2": 1, "SEV-3": 2 };
const SEVERITY_TONE: Record<Severity, "red" | "amber" | "zinc"> = { "SEV-1": "red", "SEV-2": "amber", "SEV-3": "zinc" };
const STATUS_TONE: Record<IncidentStatus, "red" | "amber" | "green" | "zinc"> = {
  Open: "red",
  Investigating: "amber",
  Monitoring: "amber",
  Resolved: "green",
};

function durationLabel(min: number): string {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

// Status needs more headroom than Incident's share would suggest: "Investigating" in an
// 11px nowrap badge is the widest unsplittable label on the row, and at the card's desktop
// width (~1264–1440px viewport) a 12% column clips/overflows it. Incident's title wraps
// (line-clamp-2), so it has slack to give up without any visual cost.
const COLUMNS: { key: SortKey | null; label: string; widthPct: number }[] = [
  { key: "severity", label: "Severity", widthPct: 11 },
  { key: "service", label: "Service", widthPct: 17 },
  { key: null, label: "Incident", widthPct: 24 },
  { key: null, label: "Assignee", widthPct: 16 },
  { key: "duration", label: "Open for", widthPct: 12 },
  { key: "status", label: "Status", widthPct: 20 },
];

export function IncidentQueueCard({
  selectedServiceId,
  onSelectService,
  id,
}: {
  selectedServiceId: string | null;
  onSelectService: (id: string) => void;
  id?: string;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("duration");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const rows = useMemo(() => {
    const copy = [...INCIDENTS];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "severity") cmp = SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
      else if (sortKey === "service") cmp = SERVICE_BY_ID[a.serviceId].name.localeCompare(SERVICE_BY_ID[b.serviceId].name);
      else if (sortKey === "status") cmp = a.status.localeCompare(b.status);
      else cmp = a.durationMin - b.durationMin;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <Card id={id} colSpan="col-span-1 md:col-span-2 lg:col-span-8" rowSpan="lg:row-span-2">
      <CardHeader title="Incident queue" description={`${rows.length} incidents this week`} />
      {/* max-h keeps this card close to Service Health's natural height rather than growing past
          it and forcing that shorter sibling to stretch into awkward blank space; the remaining
          rows are one scroll away, not clipped. */}
      <div className="max-h-[360px] min-h-0 flex-1 overflow-auto">
        {/* Mobile keeps a horizontal scroll (this is the page's only overflow-x-auto container);
            at lg+ there is enough card width that table-fixed + the colgroup below fits with no scroll. */}
        <table className="min-w-[640px] border-collapse text-sm lg:min-w-0 lg:w-full lg:table-fixed">
          <caption className="sr-only">Incident queue, sortable by severity, service, open duration and status</caption>
          <colgroup>
            {COLUMNS.map((c, i) => (
              <col key={i} style={{ width: `${c.widthPct}%` }} />
            ))}
          </colgroup>
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-b border-zinc-200">
              {COLUMNS.map((c) => {
                if (!c.key) {
                  return (
                    <th key={c.label} scope="col" className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-zinc-500">
                      {c.label}
                    </th>
                  );
                }
                const isActive = c.key === sortKey;
                const ariaSort: "ascending" | "descending" | "none" = isActive ? (sortDir === "asc" ? "ascending" : "descending") : "none";
                const Icon = !isActive ? ArrowUpDown : sortDir === "asc" ? ArrowUp : ArrowDown;
                return (
                  <th key={c.label} scope="col" aria-sort={ariaSort} className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-zinc-500">
                    <button
                      type="button"
                      onClick={() => toggleSort(c.key as SortKey)}
                      className={`inline-flex items-center gap-1 rounded ${FOCUS_RING} ${isActive ? "text-zinc-900" : "hover:text-zinc-700"}`}
                    >
                      {c.label}
                      <Icon className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((inc) => (
              <IncidentRow key={inc.id} incident={inc} isSelected={inc.serviceId === selectedServiceId} onSelect={onSelectService} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function IncidentRow({ incident, isSelected, onSelect }: { incident: Incident; isSelected: boolean; onSelect: (id: string) => void }) {
  const service = SERVICE_BY_ID[incident.serviceId];
  return (
    <tr
      onClick={() => onSelect(incident.serviceId)}
      className={`relative cursor-pointer border-b border-zinc-100 transition-colors duration-150 ease-out last:border-b-0 hover:bg-zinc-50 ${isSelected ? "bg-green-50" : ""}`}
    >
      <td className="px-3 py-2.5 align-top">
        <Badge tone={SEVERITY_TONE[incident.severity]}>{incident.severity}</Badge>
      </td>
      <td className="px-3 py-2.5 align-top">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(incident.serviceId);
          }}
          className={`truncate text-xs font-medium text-zinc-900 underline-offset-2 hover:underline ${FOCUS_RING}`}
        >
          {service.name}
        </button>
      </td>
      <td className="px-3 py-2.5 align-top">
        <p className="line-clamp-2 text-xs text-zinc-700">{incident.title}</p>
      </td>
      <td className="px-3 py-2.5 align-top">
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="relative h-5 w-5 flex-shrink-0 overflow-hidden rounded-full bg-zinc-100">
            <Image
              src={`https://images.unsplash.com/photo-${incident.assigneeAvatarId}?w=40&h=40&fit=crop&crop=faces&q=80`}
              alt=""
              fill
              sizes="20px"
              className="object-cover"
            />
          </span>
          <span className="min-w-0 truncate text-xs text-zinc-700">{incident.assigneeName}</span>
        </span>
      </td>
      <td className="whitespace-nowrap px-3 py-2.5 align-top text-xs tabular-nums text-zinc-700">{durationLabel(incident.durationMin)}</td>
      <td className="px-3 py-2.5 align-top">
        <Badge tone={STATUS_TONE[incident.status]}>{incident.status}</Badge>
      </td>
    </tr>
  );
}
