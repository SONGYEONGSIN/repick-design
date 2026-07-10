"use client";

import { CircleAlert, Info, TriangleAlert } from "lucide-react";
import { EVENTS, SEVERITY_LABEL, type Severity } from "./data";

const SEVERITY_ICON: Record<Severity, typeof Info> = {
  info: Info,
  warning: CircleAlert,
  alarm: TriangleAlert,
};

const SEVERITY_COLOR: Record<Severity, string> = {
  info: "text-[var(--ink-2)]",
  warning: "text-[var(--caution)]",
  alarm: "text-[var(--alarm)]",
};

export default function EventLog() {
  return (
    <ol className="flex flex-col gap-0.5">
      {EVENTS.map((event) => {
        const Icon = SEVERITY_ICON[event.severity];
        return (
          <li
            key={event.id}
            className="grid grid-cols-[3.5rem_1.25rem_1fr] items-start gap-x-3 border-b border-[var(--hair)] py-2.5 last:border-b-0"
          >
            <span className="pt-0.5 font-mono text-xs tabular-nums text-[var(--ink-2)]">{event.time}</span>
            <Icon aria-hidden size={15} className={`mt-0.5 ${SEVERITY_COLOR[event.severity]}`} />
            <span className="text-sm leading-snug text-[var(--ink-1)]">
              <span className="sr-only">{SEVERITY_LABEL[event.severity]}: </span>
              {event.message}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
