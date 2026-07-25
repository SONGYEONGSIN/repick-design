"use client";

import { CircleCheck, Clock, ListChecks, Server, Siren, UserCheck } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  ESCALATION_POLICY,
  INCIDENTS,
  SEVERITY_META,
  STATUS_META,
  engineerById,
  secondaryFor,
  serviceIcon,
  serviceLabel,
  unsplashAvatar,
  type Incident,
} from "./data";
import { BORDER, NUM, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, cx } from "./tokens";
import { Badge, CardHeader, EyebrowLabel } from "./ui";

const TIMELINE_ICON = { triggered: Siren, acknowledged: UserCheck, resolved: CircleCheck } as const;
const TIMELINE_TONE = { triggered: "text-rose-300", acknowledged: "text-amber-300", resolved: "text-emerald-300" } as const;

export default function DetailPanel({ incidentId }: { incidentId: string | null }) {
  const incident: Incident = INCIDENTS.find((i) => i.id === incidentId) ?? INCIDENTS[0];
  const [trackedId, setTrackedId] = useState(incident.id);
  const [checked, setChecked] = useState<Record<string, boolean>>(() => Object.fromEntries(incident.runbook.map((r) => [r.id, r.done])));

  // When the selected incident changes, reset the checklist to that incident's initial state immediately during render (no useEffect — the React-recommended pattern).
  if (incident.id !== trackedId) {
    setTrackedId(incident.id);
    setChecked(Object.fromEntries(incident.runbook.map((r) => [r.id, r.done])));
  }

  const sev = SEVERITY_META[incident.severity];
  const status = STATUS_META[incident.status];
  const responder = engineerById(incident.responder);
  const secondary = secondaryFor(incident.responder);
  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="flex h-full flex-col overflow-y-auto pr-0.5 [scrollbar-width:thin]" style={{ maxHeight: 640 }}>
      <CardHeader as="h2" titleId="detail-heading" title="Incident detail" description={`${incident.id} · ${incident.dateLabel}, ${incident.triggeredClock}`} action={<Badge tone={sev.tone}>{sev.label}</Badge>} />

      <div className="mt-3">
        <h3 className={cx("text-base font-semibold leading-snug", TEXT_PRIMARY)}>{incident.title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge tone={status.tone}>{status.label}</Badge>
          <span className={cx("inline-flex items-center gap-1.5 whitespace-nowrap text-xs", TEXT_SECONDARY, NUM)}>
            <Clock size={13} aria-hidden="true" className={TEXT_CAPTION} />
            {incident.durationLabel}
          </span>
        </div>
        <p className={cx("mt-2 text-sm leading-relaxed", TEXT_SECONDARY)}>{incident.summary}</p>
      </div>

      <div className={cx("mt-4 border-t pt-4", BORDER)}>
        <EyebrowLabel>Affected services</EyebrowLabel>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {incident.affectedServices.map((sid) => {
            const Icon = serviceIcon(sid);
            return (
              <span key={sid} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-950 px-2 py-1 text-xs text-zinc-300">
                <Icon size={12} aria-hidden="true" className={TEXT_CAPTION} />
                {serviceLabel(sid)}
              </span>
            );
          })}
        </div>
      </div>

      <div className={cx("mt-4 border-t pt-4", BORDER)}>
        <EyebrowLabel>Assigned responder</EyebrowLabel>
        <div className="mt-2 flex items-center gap-2.5">
          <Image src={unsplashAvatar(responder.avatarId, 72)} alt={`${responder.name} profile photo`} width={36} height={36} className="h-9 w-9 shrink-0 rounded-full border border-white/10 object-cover" />
          <div className="min-w-0 flex-1">
            <p className={cx("truncate text-sm font-medium", TEXT_PRIMARY)}>{responder.name}</p>
            <p className={cx("truncate text-xs", TEXT_CAPTION)}>{responder.role} · Primary on-call</p>
          </div>
        </div>
        <p className={cx("mt-2 text-[11px] leading-snug", TEXT_CAPTION)}>
          Escalation ({ESCALATION_POLICY.name}): Secondary {secondary.name} after {ESCALATION_POLICY.tiers[1].waitMinutes}m, then {ESCALATION_POLICY.tiers[2].label.toLowerCase()} after{" "}
          {ESCALATION_POLICY.tiers[2].waitMinutes}m.
        </p>
      </div>

      <div className={cx("mt-4 border-t pt-4", BORDER)}>
        <EyebrowLabel>Timeline</EyebrowLabel>
        <ol className="mt-3 space-y-0">
          {incident.timeline.map((step, i) => {
            const Icon = TIMELINE_ICON[step.key];
            const isLast = i === incident.timeline.length - 1;
            return (
              <li key={step.key} className="relative flex gap-3 pb-5 last:pb-0">
                {!isLast ? <span aria-hidden="true" className="absolute left-[13px] top-6 h-[calc(100%-8px)] w-px bg-white/10" /> : null}
                <span
                  aria-hidden="true"
                  className={cx(
                    "relative z-10 mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border",
                    step.done ? cx("border-white/10 bg-zinc-800", TIMELINE_TONE[step.key]) : "border-white/10 bg-zinc-950 text-zinc-400",
                  )}
                >
                  <Icon size={14} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                    <p className={cx("text-sm font-medium", step.done ? TEXT_PRIMARY : "text-zinc-400")}>{step.label}</p>
                    <span className={cx("whitespace-nowrap text-xs", NUM, TEXT_CAPTION)}>{step.done ? step.timeLabel : "Pending"}</span>
                  </div>
                  {step.actor ? <p className={cx("text-xs", TEXT_CAPTION)}>by {step.actor}</p> : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className={cx("mt-4 border-t pt-4", BORDER)}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <ListChecks size={13} aria-hidden="true" className={TEXT_CAPTION} />
            <EyebrowLabel>Runbook checklist</EyebrowLabel>
          </div>
          <span className={cx("text-xs", TEXT_CAPTION, NUM)}>
            {doneCount}/{incident.runbook.length}
          </span>
        </div>
        <ul className="mt-2 space-y-1.5">
          {incident.runbook.map((item) => {
            const isChecked = checked[item.id] ?? item.done;
            return (
              <li key={item.id}>
                <label className="flex cursor-pointer items-start gap-2.5 rounded-lg px-1 py-1 text-sm hover:bg-white/5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setChecked((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                    className="mt-0.5 size-4 shrink-0 rounded border-white/20 bg-zinc-950 accent-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
                  />
                  <span className={cx(isChecked ? "text-zinc-400 line-through decoration-zinc-600" : TEXT_SECONDARY)}>{item.label}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-xs">
        <Server size={13} aria-hidden="true" className={TEXT_CAPTION} />
        <span className={TEXT_CAPTION}>Primary service</span>
        <span className={cx("font-medium", TEXT_PRIMARY)}>{serviceLabel(incident.service)}</span>
      </div>
    </div>
  );
}
