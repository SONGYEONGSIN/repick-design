"use client";

import { Pin, Clock, Server, X } from "lucide-react";
import { Card, CardTitle, SeverityBadge, StatusBadge, FOCUS } from "./ui";
import type { Incident } from "./data";

export function InspectorPanel({ incident, onClear }: { incident: Incident | null; onClear: () => void }) {
  if (!incident) {
    return (
      <Card id="incident-inspector" className="flex h-full min-h-48 flex-col items-center justify-center text-center">
        <Pin className="h-5 w-5 text-zinc-400" aria-hidden="true" />
        <p className="mt-2 text-sm font-medium text-zinc-700">No incident pinned</p>
        <p className="mt-1 text-xs font-normal text-zinc-500">Select any card in the feed to pin its details here.</p>
      </Card>
    );
  }

  return (
    <Card id="incident-inspector">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <Pin className="h-4 w-4 flex-shrink-0 text-emerald-600" aria-hidden="true" />
          <CardTitle className="truncate">{incident.id}</CardTitle>
        </div>
        <button
          type="button"
          onClick={onClear}
          aria-label="Unpin incident"
          className={`flex-shrink-0 rounded-md p-1 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 ${FOCUS}`}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2">
        <SeverityBadge severity={incident.severity} />
        <StatusBadge status={incident.status} />
      </div>

      <p className="mt-3 text-sm font-medium text-zinc-900">{incident.title}</p>
      <p className="mt-1.5 text-sm font-normal text-zinc-600">{incident.detail}</p>

      <dl className="mt-4 space-y-2 border-t border-zinc-100 pt-3">
        <div className="flex items-center gap-2.5">
          <Clock className="h-4 w-4 flex-shrink-0 text-zinc-500" aria-hidden="true" />
          <dt className="text-xs font-normal text-zinc-500">Opened</dt>
          <dd className="ml-auto text-sm font-normal tabular-nums text-zinc-900">{incident.time}</dd>
        </div>
        <div className="flex items-center gap-2.5">
          <Server className="h-4 w-4 flex-shrink-0 text-zinc-500" aria-hidden="true" />
          <dt className="min-w-0 flex-1 truncate text-xs font-normal text-zinc-500">Service</dt>
          <dd className="ml-auto truncate text-sm font-normal text-zinc-900">{incident.service}</dd>
        </div>
      </dl>
    </Card>
  );
}
