"use client";

import { AlertTriangle, Clock } from "lucide-react";
import { TICKETS, type Priority } from "./data";
import { Badge } from "./ui";

const PRIORITY_TONE: Record<Priority, "rose" | "amber" | "neutral"> = { p1: "rose", p2: "amber", p3: "neutral" };
const STAGE_LABEL: Record<string, string> = {
  triage: "Triage",
  engineering: "Engineering",
  waiting: "Waiting",
  escalated: "Escalated",
};

export function TicketRail({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold text-zinc-900">Open tickets</h2>
      <ul className="flex max-h-[32rem] flex-col gap-1.5 overflow-y-auto overflow-x-hidden pr-1">
        {TICKETS.map((t) => {
          const selected = t.id === selectedId;
          const breached = t.slaHours < 0;
          return (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => onSelect(t.id)}
                aria-pressed={selected}
                className={`flex w-full flex-col gap-1.5 rounded-lg border p-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 motion-reduce:transition-none ${
                  selected ? "border-indigo-300 bg-indigo-50" : "border-transparent hover:bg-zinc-50"
                }`}
              >
                <div className="line-clamp-2 text-sm font-medium text-zinc-900">{t.subject}</div>
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs text-zinc-600">{t.customer}</span>
                  <Badge tone={PRIORITY_TONE[t.priority]}>{t.priority.toUpperCase()}</Badge>
                </div>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-zinc-600">{STAGE_LABEL[t.stage]}</span>
                  <span className={`flex items-center gap-1 font-medium tabular-nums ${breached ? "text-rose-700" : "text-zinc-600"}`}>
                    {breached ? <AlertTriangle className="h-3 w-3" aria-hidden="true" /> : <Clock className="h-3 w-3" aria-hidden="true" />}
                    {breached ? `${Math.abs(t.slaHours)}h over` : `${t.slaHours}h left`}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
