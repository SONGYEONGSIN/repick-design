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
 * Chronological incident/alert timeline. This component takes NO props at all — no selected
 * node id, no inspector state, nothing — and reads straight from the static INCIDENTS list in
 * data.ts. Opening the node inspector (from a table row or a graph mark) never touches this
 * component's render in any way: it is not re-filtered, reordered or highlighted when a service
 * is selected elsewhere on the page. That narrow, genuinely independent fan-out is the point of
 * this round's assigned skeleton — a separate bottom strip, not a "select something →
 * everything recomputes" pane.
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
