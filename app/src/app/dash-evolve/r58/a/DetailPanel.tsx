"use client";

import { CalendarClock, User, Tag, X } from "lucide-react";
import { Card, CardTitle, Badge, FOCUS } from "./ui";
import { fmtUsd, type Day, type Resource, type Slot } from "./data";

export function DetailPanel({
  day,
  hour,
  resource,
  slot,
  onClear,
}: {
  day: Day | null;
  hour: number | null;
  resource: Resource | null;
  slot: Slot | undefined;
  onClear: () => void;
}) {
  if (!day || hour === null || !resource) {
    return (
      <Card className="flex h-full min-h-48 flex-col items-center justify-center text-center">
        <CalendarClock className="h-5 w-5 text-slate-400" aria-hidden="true" />
        <p className="mt-2 text-sm font-medium text-slate-300">No slot selected</p>
        <p className="mt-1 text-xs font-normal text-slate-400">Select any cell in the schedule to see its details here.</p>
      </Card>
    );
  }

  const revenue = slot ? resource.hourlyRate * (slot.status === "booked" || slot.status === "hold" ? 1 : 0) : 0;

  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <CardTitle>
          {resource.name} · {day} {hour}:00
        </CardTitle>
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear selection"
          className={`flex-shrink-0 rounded-md p-1 text-slate-400 hover:bg-white/5 hover:text-slate-200 ${FOCUS}`}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {slot ? (
        <div className="mt-3 space-y-3">
          <Badge tone={slot.status === "booked" ? "confirmed" : "tentative"}>
            {slot.status === "booked" ? "Booked" : "Tentative hold"}
          </Badge>
          <div className="flex items-start gap-2.5">
            <User className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-100">{slot.client}</p>
              <p className="text-xs font-normal text-slate-400">Client</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Tag className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-100">{slot.project}</p>
              <p className="text-xs font-normal text-slate-400">Project</p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">This hour</p>
            <p className="mt-1 font-[family-name:var(--font-display-wide)] text-lg font-semibold tabular-nums text-slate-50">
              {fmtUsd(revenue)}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <Badge>Open</Badge>
          <p className="mt-3 text-sm font-normal text-slate-400">
            No booking in this hour. Rate: {fmtUsd(resource.hourlyRate)}/hr.
          </p>
        </div>
      )}
    </Card>
  );
}
