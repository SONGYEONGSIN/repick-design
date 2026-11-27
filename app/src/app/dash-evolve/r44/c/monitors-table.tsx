"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import {
  ASSIGNEES,
  LATENCY_P95,
  LATENCY_SERIES,
  ON_CALL,
  SERVICES,
  deriveServiceStatus,
  openIncidentCountForService,
  type ServiceStatus,
} from "./data";
import { formatMs, formatUptime } from "./format";
import { Avatar, FOCUS_RING, Progress, ServiceStatusBadge, Sparkline } from "./ui";

type SortKey = "service" | "status" | "uptime" | "p95";

const STATUS_RANK: Record<ServiceStatus, number> = { down: 0, degraded: 1, operational: 2 };

function SortHeader({
  label,
  sortKeyId,
  sortKey,
  asc,
  onToggle,
  align = "left",
  className = "",
}: {
  label: string;
  sortKeyId: SortKey;
  sortKey: SortKey;
  asc: boolean;
  onToggle: (key: SortKey) => void;
  align?: "left" | "right";
  className?: string;
}) {
  const active = sortKey === sortKeyId;
  const Icon = active ? (asc ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th
      scope="col"
      aria-sort={active ? (asc ? "ascending" : "descending") : "none"}
      className={`py-2 align-middle ${align === "right" ? "text-right" : "text-left"} ${className}`}
    >
      <button
        type="button"
        onClick={() => onToggle(sortKeyId)}
        className={`inline-flex min-h-6 items-center gap-1 rounded px-1 py-0.5 font-medium text-[11px] uppercase tracking-[0.06em] motion-safe:transition-colors ${FOCUS_RING} ${
          active ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
        } ${align === "right" ? "flex-row-reverse" : ""}`}
      >
        {label}
        <Icon className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
      </button>
    </th>
  );
}

export default function MonitorsTable() {
  const [sortKey, setSortKey] = useState<SortKey>("status");
  const [asc, setAsc] = useState(true);

  const rows = useMemo(
    () =>
      SERVICES.map((service) => ({
        service,
        status: deriveServiceStatus(service.id),
        p95: LATENCY_P95[service.id]["24h"],
        openIncidents: openIncidentCountForService(service.id),
        onCall: ASSIGNEES[ON_CALL[service.id]],
        trend: LATENCY_SERIES[service.id]["24h"],
      })),
    [],
  );

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      let diff = 0;
      if (sortKey === "service") diff = a.service.name.localeCompare(b.service.name);
      else if (sortKey === "status") diff = STATUS_RANK[a.status] - STATUS_RANK[b.status];
      else if (sortKey === "uptime") diff = a.service.uptime30d - b.service.uptime30d;
      else diff = a.p95 - b.p95;
      return asc ? diff : -diff;
    });
    return copy;
  }, [rows, sortKey, asc]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setAsc((v) => !v);
    } else {
      setSortKey(key);
      setAsc(key === "service");
    }
  }

  return (
    <div>
      {/* Mobile card list (<sm) */}
      <ul className="divide-y divide-zinc-100 sm:hidden">
        {sorted.map((row) => (
          <li key={row.service.id} className="py-3">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate font-medium text-sm text-zinc-900">{row.service.name}</p>
              <ServiceStatusBadge status={row.status} />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 font-normal text-[11px] text-zinc-600">
              <span>
                Uptime <span className="font-semibold tabular-nums text-zinc-900">{formatUptime(row.service.uptime30d)}</span>
              </span>
              <span>
                P95 (24h) <span className="font-semibold tabular-nums text-zinc-900">{formatMs(row.p95)}</span>
              </span>
              <span>
                Open <span className="font-semibold tabular-nums text-zinc-900">{row.openIncidents}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Avatar initials={row.onCall.initials} tone={row.onCall.avatarClass} className="h-5 w-5 text-[9px]" />
                {row.onCall.name}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop table (sm and up) */}
      <div className="hidden w-full sm:block">
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="sr-only">Monitored services, sortable by name, status, uptime or P95 latency</caption>
          <colgroup>
            <col className="w-[20%]" />
            <col className="w-[13%]" />
            <col className="w-[15%]" />
            <col className="w-[11%]" />
            <col className="w-[9%]" />
            <col className="hidden w-[15%] md:table-column" />
            <col className="hidden w-[17%] lg:table-column" />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200">
              <SortHeader label="Service" sortKeyId="service" sortKey={sortKey} asc={asc} onToggle={toggleSort} className="pr-2" />
              <SortHeader label="Status" sortKeyId="status" sortKey={sortKey} asc={asc} onToggle={toggleSort} className="pr-2" />
              <SortHeader label="Uptime 30d" sortKeyId="uptime" sortKey={sortKey} asc={asc} onToggle={toggleSort} className="pr-2" />
              <SortHeader label="P95" sortKeyId="p95" sortKey={sortKey} asc={asc} onToggle={toggleSort} align="right" className="pr-2" />
              <th scope="col" className="py-2 pr-2 text-right font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-500">
                Open
              </th>
              <th scope="col" className="hidden py-2 pr-2 text-left font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-500 md:table-cell">
                On-call
              </th>
              <th scope="col" className="hidden py-2 text-left font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-500 lg:table-cell">
                24h trend
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {sorted.map((row) => (
              <tr key={row.service.id} className="hover:bg-zinc-50">
                <td className="py-2.5 pr-2 align-middle">
                  <p className="truncate font-medium text-[13px] text-zinc-900">{row.service.name}</p>
                  <p className="truncate font-normal text-[11px] text-zinc-500">{row.service.description}</p>
                </td>
                <td className="py-2.5 pr-2 align-middle">
                  <ServiceStatusBadge status={row.status} />
                </td>
                <td className="py-2.5 pr-2 align-middle">
                  <p className="font-normal tabular-nums text-[13px] text-zinc-700">{formatUptime(row.service.uptime30d)}</p>
                  <Progress value={row.service.uptime30d} className="mt-1 hidden md:block" />
                </td>
                <td className="whitespace-nowrap py-2.5 pr-2 text-right align-middle font-normal tabular-nums text-[13px] text-zinc-700">
                  {formatMs(row.p95)}
                </td>
                <td className="whitespace-nowrap py-2.5 pr-2 text-right align-middle font-normal tabular-nums text-[13px] text-zinc-700">
                  {row.openIncidents}
                </td>
                <td className="hidden py-2.5 pr-2 align-middle md:table-cell">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <Avatar initials={row.onCall.initials} tone={row.onCall.avatarClass} className="h-6 w-6 text-[10px]" />
                    <span className="truncate font-normal text-[13px] text-zinc-700">{row.onCall.name}</span>
                  </div>
                </td>
                <td className="hidden py-2.5 align-middle lg:table-cell">
                  <Sparkline values={row.trend} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
