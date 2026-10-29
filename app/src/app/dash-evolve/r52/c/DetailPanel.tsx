"use client";

import { AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { TICKETS, TIMELINES, type Priority } from "./data";
import { Avatar, Badge, PrimaryButton } from "./ui";

const PRIORITY_TONE: Record<Priority, "rose" | "amber" | "neutral"> = { p1: "rose", p2: "amber", p3: "neutral" };
const STAGE_LABEL: Record<string, string> = {
  triage: "Triage",
  engineering: "Engineering",
  waiting: "Waiting on customer",
  escalated: "Escalated",
};

function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function DetailPanel({ ticketId }: { ticketId: string }) {
  const ticket = TICKETS.find((t) => t.id === ticketId);
  if (!ticket) {
    return <p className="text-sm text-zinc-500">Select a ticket from the rail to see its detail.</p>;
  }
  const timeline = TIMELINES[ticket.id] ?? [];
  const breached = ticket.slaHours < 0;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge tone={PRIORITY_TONE[ticket.priority]}>{ticket.priority.toUpperCase()}</Badge>
            <Badge tone={ticket.stage === "escalated" ? "rose" : "indigo"}>{STAGE_LABEL[ticket.stage]}</Badge>
          </div>
          <h2 className="mt-2 text-base font-semibold text-zinc-900">{ticket.subject}</h2>
          <p className="mt-1 text-sm text-zinc-500">{ticket.customer} · {ticket.id}</p>
        </div>
        <PrimaryButton>
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Mark resolved
        </PrimaryButton>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Avatar initials={initialsOf(ticket.assignee)} size={28} />
          <span className="text-sm text-zinc-700">{ticket.assignee}</span>
        </div>
        <div className={`flex items-center gap-1.5 text-sm font-medium tabular-nums ${breached ? "text-rose-700" : "text-zinc-700"}`}>
          {breached ? <AlertTriangle className="h-4 w-4" aria-hidden="true" /> : <Clock className="h-4 w-4" aria-hidden="true" />}
          {breached ? `SLA breached by ${Math.abs(ticket.slaHours)}h` : `${ticket.slaHours}h until SLA`}
        </div>
        <span className="text-sm text-zinc-500">Updated {ticket.updatedLabel}</span>
      </div>

      <h3 className="mt-5 text-xs font-medium uppercase tracking-wide text-zinc-500">Timeline</h3>
      <ol className="mt-2 flex flex-col gap-3 border-l border-zinc-200 pl-4">
        {timeline.map((step, idx) => (
          <li key={`${ticket.id}-${idx}`} className="relative">
            <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-indigo-600" aria-hidden="true" />
            <div className="text-sm font-medium text-zinc-900">{step.stage}</div>
            <div className="text-sm text-zinc-500">{step.label}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}
