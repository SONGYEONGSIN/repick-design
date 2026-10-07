"use client";

import { AlertOctagon, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { INCIDENTS, type Incident } from "./data";
import { SEVERITY_BADGE, TEXT_AUX, TEXT_PRIMARY, cx } from "./tokens";
import { Badge } from "./ui";

const SEVERITY_ICON: Record<Incident["severity"], typeof AlertOctagon> = {
  critical: AlertOctagon,
  warning: TriangleAlert,
  info: Info,
  resolved: CheckCircle2,
};
const SEVERITY_LABEL: Record<Incident["severity"], string> = {
  critical: "Critical",
  warning: "Warning",
  info: "Info",
  resolved: "Resolved",
};

/**
 * Chronological incident/alert timeline. This component reads straight from
 * the static INCIDENTS list in data.ts and takes no props at all — there is
 * no selectedNodeId wired in from the graph above, on purpose. Selecting a
 * node opens an ephemeral inspector popover that only the graph canvas
 * knows about; this strip never re-filters, reorders or highlights an entry
 * because a node was clicked. That is the assigned skeleton's point: one
 * ephemeral popover instead of a persistent synced pane, and a genuinely
 * independent bottom feed instead of a "select → everything recomputes"
 * fan-out.
 */
export default function IncidentTimeline() {
  return (
    <ol className="flex flex-col">
      {INCIDENTS.map((incident, i) => {
        const Icon = SEVERITY_ICON[incident.severity];
        return (
          <li key={incident.id} className={cx("flex gap-3 py-3", i !== INCIDENTS.length - 1 && "border-b border-white/5")}>
            <div className="flex w-16 shrink-0 flex-col items-start pt-0.5">
              <span className={cx("text-xs font-medium", TEXT_PRIMARY)}>{incident.time}</span>
              <span className={cx("text-[11px] font-normal", TEXT_AUX)}>{incident.dateLabel}</span>
            </div>
            <Icon
              size={16}
              aria-hidden="true"
              className={cx(
                "mt-0.5 shrink-0",
                incident.severity === "critical" && "text-rose-400",
                incident.severity === "warning" && "text-amber-400",
                incident.severity === "info" && "text-sky-400",
                incident.severity === "resolved" && "text-emerald-400",
              )}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={cx("text-sm font-medium", TEXT_PRIMARY)}>{incident.serviceName}</span>
                <Badge className={SEVERITY_BADGE[incident.severity]}>{SEVERITY_LABEL[incident.severity]}</Badge>
              </div>
              <p className={cx("mt-0.5 text-sm font-normal leading-relaxed", TEXT_AUX)}>{incident.message}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
