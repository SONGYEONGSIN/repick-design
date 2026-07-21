"use client";

import { Clock, GitBranch, Info, Server } from "lucide-react";
import { burnTrend, INCIDENTS, SEVERITY_META, STATUS_META, serviceLabel, type Incident } from "./data";
import { BORDER, NUM, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, TONE, cx } from "./tokens";
import { Badge, CardHeader, EyebrowLabel, Sparkline } from "./ui";

export default function DetailPanel({ incidentId }: { incidentId: string | null }) {
  const incident: Incident | undefined = INCIDENTS.find((i) => i.id === incidentId) ?? INCIDENTS[0];

  if (!incident) {
    return (
      <div>
        <CardHeader as="h2" title="Incident detail" />
        <p className={cx("mt-4 text-sm", TEXT_CAPTION)}>Select an incident from the table to see details here.</p>
      </div>
    );
  }

  const sev = SEVERITY_META[incident.severity];
  const status = STATUS_META[incident.status];
  const trend = burnTrend(incident.service);
  const trendTone = trend[trend.length - 1] >= 50 ? "good" : trend[trend.length - 1] >= 20 ? "warn" : "bad";

  return (
    <div className="flex h-full flex-col">
      <CardHeader
        as="h2"
        titleId="detail-heading"
        title="Incident detail"
        description={incident.id}
        action={<Badge tone={sev.tone}>{sev.label}</Badge>}
      />

      <div className="mt-3">
        <h3 className={cx("text-base font-semibold leading-snug", TEXT_PRIMARY)}>{incident.title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <span className={cx("inline-flex items-center gap-1.5 text-xs", TEXT_SECONDARY)}>
            <Server size={13} aria-hidden="true" className={TEXT_CAPTION} />
            {serviceLabel(incident.service)}
          </span>
          <span className={cx("inline-flex items-center gap-1.5 whitespace-nowrap text-xs", TEXT_SECONDARY, NUM)}>
            <Clock size={13} aria-hidden="true" className={TEXT_CAPTION} />
            {incident.startedLabel} · {incident.durationLabel}
          </span>
        </div>
        <div className="mt-2">
          <Badge tone={status.tone}>{status.label}</Badge>
        </div>
      </div>

      <div className={cx("mt-4 border-t pt-4", BORDER)}>
        <div className="flex items-center gap-1.5">
          <Info size={13} aria-hidden="true" className={TEXT_CAPTION} />
          <EyebrowLabel>Summary</EyebrowLabel>
        </div>
        <p className={cx("mt-1.5 text-sm leading-relaxed", TEXT_SECONDARY)}>{incident.summary}</p>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-1.5">
          <GitBranch size={13} aria-hidden="true" className={TEXT_CAPTION} />
          <EyebrowLabel>Root cause</EyebrowLabel>
        </div>
        <p className={cx("mt-1.5 text-sm leading-relaxed", TEXT_SECONDARY)}>{incident.rootCause}</p>
      </div>

      <div className={cx("mt-4 rounded-xl border p-3", BORDER, "bg-zinc-50 dark:bg-zinc-950")}>
        <div className="flex items-center justify-between gap-2">
          <EyebrowLabel>{serviceLabel(incident.service)} · budget remaining (12 ticks)</EyebrowLabel>
          <span className={cx("text-xs font-semibold tabular-nums", TONE[trendTone].text)}>{trend[trend.length - 1]}%</span>
        </div>
        <div className="mt-2 h-11">
          <Sparkline values={trend} stroke={cx("stroke-current", TONE[trendTone].text)} fill={cx("fill-current", TONE[trendTone].text)} />
        </div>
        <div className="sr-only">
          <table>
            <caption>{serviceLabel(incident.service)} error budget remaining over the last 12 observed ticks</caption>
            <thead>
              <tr>
                <th scope="col">Tick</th>
                <th scope="col">Budget remaining</th>
              </tr>
            </thead>
            <tbody>
              {trend.map((v, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{v}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
