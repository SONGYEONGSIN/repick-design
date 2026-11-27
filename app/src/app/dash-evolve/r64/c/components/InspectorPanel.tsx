"use client";

import { useState } from "react";
import { ClipboardList, Database, FingerprintPattern, Globe, RotateCcw, ShieldQuestion, Target, Zap, type LucideIcon } from "lucide-react";
import { AXES, SLA_TARGET_MINUTES, analystOf, categoryOf, isActiveStatus, slaBurnPercent, type Alert, type AxisId } from "../lib/data";
import { formatAge, formatDuration, formatPercent } from "../lib/format";
import { Avatar, Card, CardHeader, ProgressBar, SeverityBadge, StatusBadge, Tabs } from "./ui";
import RadarChart from "./RadarChart";

const AXIS_ICONS: Record<AxisId, LucideIcon> = {
  exploitability: Zap,
  blastRadius: Target,
  dataSensitivity: Database,
  externalExposure: Globe,
  detectionConfidence: FingerprintPattern,
  recurrence: RotateCcw,
};

type InspectorTab = "overview" | "playbook";

/**
 * Reads only `pinnedId` — the one thing a feed-row click or a command-palette "Pin" action
 * changes. It never reads the feed's filter state, the period toggle, or the queue summary's
 * aggregates, so re-pinning never touches anything outside this panel.
 */
export function InspectorPanel({ alert }: { alert: Alert }) {
  const [tab, setTab] = useState<InspectorTab>("overview");
  // Scoped entirely to this chart: which axis is being hovered/focused. Resets naturally when a
  // different alert is pinned because RadarChart is given a fresh `alert` prop, not because of
  // any effect that watches `alert.id` and clears this state.
  const [hoveredAxisIndex, setHoveredAxisIndex] = useState<number | null>(null);

  const category = categoryOf(alert.category);
  const analyst = analystOf(alert.analystId);
  const burn = slaBurnPercent(alert);

  return (
    <Card className="flex min-w-0 flex-col">
      <CardHeader title="Inspector" subtitle={`${category.label} · ${alert.asset}`} />
      <div className="min-w-0 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <SeverityBadge severity={alert.severity} />
          <StatusBadge status={alert.status} />
          <span className="text-xs text-zinc-500">{formatAge(alert.ageMinutes)} ago</span>
        </div>
        <h3 className="mt-2 text-sm font-semibold leading-snug text-zinc-900">{alert.title}</h3>

        <div className="mt-3 flex min-w-0 items-center gap-2">
          {analyst ? (
            <>
              <Avatar name={analyst.name} initials={analyst.initials} size={22} />
              <span className="min-w-0 truncate text-xs text-zinc-600">{analyst.name}</span>
            </>
          ) : (
            <span className="text-xs text-zinc-500">Unassigned</span>
          )}
        </div>

        {isActiveStatus(alert.status) && burn !== null ? (
          <div className="mt-3 min-w-0">
            <div className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-wide text-zinc-500">
              <span>SLA burn</span>
              <span className="tabular-nums font-medium text-zinc-700">{formatPercent(burn)}</span>
            </div>
            <div className="mt-1">
              <ProgressBar percent={burn} tone={burn >= 100 ? "bg-rose-600" : burn >= 70 ? "bg-amber-500" : "bg-orange-600"} />
            </div>
          </div>
        ) : null}

        <div className="mt-4">
          <Tabs
            idPrefix="inspector"
            ariaLabel="Inspector content"
            value={tab}
            onChange={setTab}
            tabs={[
              { value: "overview", label: "Risk profile" },
              { value: "playbook", label: "Playbook" },
            ]}
          />
        </div>

        {tab === "overview" ? (
          <div id="inspector-panel-overview" role="tabpanel" aria-labelledby="inspector-tab-overview" className="mt-4 min-w-0">
            <RadarChart alert={alert} category={category} hoveredAxisIndex={hoveredAxisIndex} onHoverAxis={setHoveredAxisIndex} />

            <div className="mt-3 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-zinc-500">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-orange-600" aria-hidden="true" />
                This alert
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 shrink-0 rounded-full border border-zinc-400" aria-hidden="true" />
                {category.label} baseline (24h)
              </span>
            </div>

            {/* The adjacent legend: every axis's exact value for both datasets, always visible —
               the hard requirement this chart is built around, independent of the SVG tip labels
               and the hover tooltip above. */}
            <div className="mt-3 min-w-0 overflow-hidden rounded-lg border border-zinc-200">
              <table className="w-full table-fixed border-collapse text-xs">
                <caption className="sr-only">Risk profile axis values for {alert.title}, this alert versus the {category.label} baseline</caption>
                <colgroup>
                  <col style={{ width: "46%" }} />
                  <col style={{ width: "27%" }} />
                  <col style={{ width: "27%" }} />
                </colgroup>
                <thead className="bg-zinc-50">
                  <tr className="border-b border-zinc-200">
                    <th scope="col" className="overflow-hidden px-2.5 py-1.5 text-left text-[10px] font-medium uppercase tracking-wide text-zinc-600">
                      <span className="block truncate">Axis</span>
                    </th>
                    <th scope="col" className="overflow-hidden px-2.5 py-1.5 text-right text-[10px] font-medium uppercase tracking-wide text-zinc-600">
                      <span className="block truncate">Alert</span>
                    </th>
                    <th scope="col" className="overflow-hidden px-2.5 py-1.5 text-right text-[10px] font-medium uppercase tracking-wide text-zinc-600">
                      <span className="block truncate">Baseline</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {AXES.map((axis) => {
                    const Icon = AXIS_ICONS[axis.id];
                    return (
                      <tr key={axis.id} className="border-b border-zinc-100 last:border-0">
                        <td className="overflow-hidden px-2.5 py-1.5">
                          <span className="flex min-w-0 items-center gap-1.5">
                            <Icon className="h-3 w-3 shrink-0 text-zinc-400" aria-hidden="true" />
                            <span className="min-w-0 flex-1 truncate text-zinc-700">{axis.shortLabel}</span>
                          </span>
                        </td>
                        <td className="overflow-hidden px-2.5 py-1.5 text-right font-semibold tabular-nums text-orange-800">{alert.profile[axis.id]}</td>
                        <td className="overflow-hidden px-2.5 py-1.5 text-right tabular-nums text-zinc-500">{category.baseline[axis.id]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div id="inspector-panel-playbook" role="tabpanel" aria-labelledby="inspector-tab-playbook" className="mt-4 min-w-0 space-y-4">
            <div className="min-w-0 rounded-lg border border-orange-200 bg-orange-50/60 p-3">
              <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-orange-800">
                <ShieldQuestion className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Recommended action
              </p>
              <p className="mt-1 text-sm leading-snug text-zinc-800">{alert.recommendedAction}</p>
            </div>

            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                <ClipboardList className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Standard triage checklist
              </p>
              <ol className="mt-1.5 list-decimal space-y-1 pl-4 text-xs text-zinc-700">
                <li>Contain — isolate the asset or revoke the session named below before anything else.</li>
                <li>Investigate — confirm the summary against {alert.source}, then record findings on this case.</li>
                <li>Remediate — apply the recommended action above and update the status once verified.</li>
              </ol>
            </div>

            <dl className="min-w-0 space-y-1.5 text-xs">
              <div className="flex min-w-0 items-center justify-between gap-2">
                <dt className="shrink-0 text-zinc-500">Affected asset</dt>
                <dd className="min-w-0 flex-1 truncate text-right font-medium text-zinc-800">{alert.asset}</dd>
              </div>
              <div className="flex min-w-0 items-center justify-between gap-2">
                <dt className="shrink-0 text-zinc-500">Source</dt>
                <dd className="min-w-0 flex-1 truncate text-right font-medium text-zinc-800">{alert.source}</dd>
              </div>
              <div className="flex min-w-0 items-center justify-between gap-2">
                <dt className="shrink-0 text-zinc-500">SLA target</dt>
                <dd className="min-w-0 flex-1 truncate text-right font-medium text-zinc-800">
                  {formatDuration(SLA_TARGET_MINUTES[alert.severity])}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </Card>
  );
}
