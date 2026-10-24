"use client";

import { useState } from "react";
import {
  ASSIGNEES,
  INCIDENTS,
  LATENCY_P95,
  LATENCY_SERIES,
  LATENCY_SUMMARY,
  ON_CALL,
  SERVICE_BY_ID,
  deriveServiceStatus,
  incidentsWithinPeriod,
  type Period,
} from "./data";
import { formatAgo, formatUptime } from "./format";
import { Avatar, IncidentStatusBadge, Progress, ServiceStatusBadge, SeverityBadge, Sparkline, Tabs } from "./ui";

type DetailTab = "overview" | "incidents";

const PERIOD_LABEL: Record<Period, string> = { "1h": "last hour", "24h": "last 24 hours", "7d": "last 7 days" };

export default function ServiceDetail({
  pinnedServiceId,
  hoveredServiceId,
  period,
}: {
  pinnedServiceId: string;
  hoveredServiceId: string | null;
  period: Period;
}) {
  const [tab, setTab] = useState<DetailTab>("overview");

  const service = SERVICE_BY_ID[pinnedServiceId];
  const summary = LATENCY_SUMMARY[pinnedServiceId][period];
  const p95 = LATENCY_P95[pinnedServiceId][period];
  const series = LATENCY_SERIES[pinnedServiceId][period];
  const status = deriveServiceStatus(pinnedServiceId);
  const onCall = ASSIGNEES[ON_CALL[pinnedServiceId]];
  const openCount = incidentsWithinPeriod(period).filter((i) => i.serviceId === pinnedServiceId && i.status !== "resolved").length;
  const recentIncidents = INCIDENTS.filter((i) => i.serviceId === pinnedServiceId).slice(0, 5);

  // Ephemeral hover preview: only rendered when hovering a group that is NOT the
  // one already pinned, so this never duplicates what the card already shows.
  const hoveredService = hoveredServiceId && hoveredServiceId !== pinnedServiceId ? SERVICE_BY_ID[hoveredServiceId] : null;
  const hoveredSummary = hoveredServiceId && hoveredServiceId !== pinnedServiceId ? LATENCY_SUMMARY[hoveredServiceId][period] : null;

  return (
    <div>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold text-sm text-zinc-900">{service.name}</p>
          <p className="truncate font-normal text-xs text-zinc-500">{service.description}</p>
        </div>
        <ServiceStatusBadge status={status} />
      </div>

      <p aria-live="polite" className="mt-1.5 min-h-[1rem] font-normal text-[11px] text-violet-700">
        {hoveredService && hoveredSummary
          ? `Comparing: ${hoveredService.name} — median ${hoveredSummary.median} ms (this panel stays pinned to ${service.name})`
          : ""}
      </p>

      <div className="mt-3">
        <Tabs<DetailTab>
          ariaLabel="Service detail view"
          value={tab}
          onChange={setTab}
          options={[
            { id: "overview", label: "Overview" },
            { id: "incidents", label: `Recent incidents (${recentIncidents.length})` },
          ]}
        />
      </div>

      {tab === "overview" ? (
        <div className="mt-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-500">P95 latency &middot; {PERIOD_LABEL[period]}</p>
              <p className="tabular-nums text-3xl text-zinc-900" style={{ fontFamily: "var(--font-display-mono)" }}>
                {p95}
                <span className="ml-1 font-normal text-sm text-zinc-500">ms</span>
              </p>
            </div>
            <Sparkline values={series} />
          </div>

          <dl className="mt-3 grid grid-cols-5 gap-x-1 rounded-lg border border-zinc-200 p-2 text-center">
            <div>
              <dt className="font-medium text-[11px] uppercase tracking-wide text-zinc-500">Min</dt>
              <dd className="font-semibold tabular-nums text-xs text-zinc-900">{summary.min}</dd>
            </div>
            <div>
              <dt className="font-medium text-[11px] uppercase tracking-wide text-zinc-500">Q1</dt>
              <dd className="font-semibold tabular-nums text-xs text-zinc-900">{summary.q1}</dd>
            </div>
            <div>
              <dt className="font-medium text-[11px] uppercase tracking-wide text-zinc-500">Med</dt>
              <dd className="font-semibold tabular-nums text-xs text-violet-700">{summary.median}</dd>
            </div>
            <div>
              <dt className="font-medium text-[11px] uppercase tracking-wide text-zinc-500">Q3</dt>
              <dd className="font-semibold tabular-nums text-xs text-zinc-900">{summary.q3}</dd>
            </div>
            <div>
              <dt className="font-medium text-[11px] uppercase tracking-wide text-zinc-500">Max</dt>
              <dd className="font-semibold tabular-nums text-xs text-zinc-900">{summary.max}</dd>
            </div>
          </dl>

          <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-zinc-200 p-2.5">
            <div className="flex min-w-0 items-center gap-2">
              <Avatar initials={onCall.initials} tone={onCall.avatarClass} className="h-7 w-7 text-[11px]" />
              <div className="min-w-0">
                <p className="truncate font-medium text-xs text-zinc-900">{onCall.name}</p>
                <p className="font-normal text-[11px] text-zinc-500">On-call</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold tabular-nums text-sm text-zinc-900">{openCount}</p>
              <p className="font-normal text-[11px] text-zinc-500">open ({PERIOD_LABEL[period]})</p>
            </div>
          </div>

          <div className="mt-3 rounded-lg border border-zinc-200 p-2.5">
            <div className="flex items-baseline justify-between">
              <p className="font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-500">Uptime, 30d</p>
              <p className="font-semibold tabular-nums text-xs text-zinc-900">{formatUptime(service.uptime30d)}</p>
            </div>
            <Progress value={service.uptime30d} className="mt-1.5" />
          </div>
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-zinc-100">
          {recentIncidents.map((incident) => (
            <li key={incident.id} className="py-2.5">
              <div className="flex items-start justify-between gap-2">
                <p className="min-w-0 font-normal text-[13px] text-zinc-700">{incident.message}</p>
                <span className="shrink-0 font-normal text-[11px] tabular-nums text-zinc-500">{formatAgo(incident.ageMinutes)}</span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <SeverityBadge severity={incident.severity} />
                <IncidentStatusBadge status={incident.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
