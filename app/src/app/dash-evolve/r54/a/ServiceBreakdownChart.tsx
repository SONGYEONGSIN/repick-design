"use client";

import { useState } from "react";
import type { ServiceCount } from "./data";
import { Card, FOCUS_RING, Label } from "./ui";

/**
 * Incidents-by-service bar list. Clicking a row pins/highlights it — a selection axis that lives
 * entirely inside this component (`pinnedService`) and is never threaded up to a parent or shared
 * with the incidents table's hover-preview state below. The two "selected" things on this page
 * (a pinned service here, a previewed incident row in the table) are deliberately independent,
 * non-resetting state owned by different components, not one function rebuilding everything from
 * a single shared selection id.
 */
export function ServiceBreakdownChart({ data }: { data: ServiceCount[] }) {
  const [pinnedService, setPinnedService] = useState<string | null>(null);
  const max = Math.max(...data.map((d) => d.count), 1);
  const pinned = data.find((d) => d.service === pinnedService) ?? null;

  return (
    <Card className="min-w-0">
      <div className="mb-3 flex min-w-0 items-center justify-between gap-2">
        <h2 className="truncate text-sm font-semibold text-zinc-900">Incidents by service</h2>
        <Label className="shrink-0">Count</Label>
      </div>
      <ul className="flex min-w-0 flex-col gap-1">
        {data.map((row) => {
          const pct = (row.count / max) * 100;
          const isPinned = row.service === pinnedService;
          return (
            <li key={row.service} className="min-w-0">
              <button
                type="button"
                onClick={() => setPinnedService((cur) => (cur === row.service ? null : row.service))}
                aria-pressed={isPinned}
                className={`flex h-9 w-full min-w-0 items-center gap-3 rounded-md px-1.5 transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                  isPinned ? "bg-orange-50" : "hover:bg-zinc-50"
                }`}
              >
                <span className={`w-20 min-w-0 shrink-0 truncate text-left text-sm sm:w-28 ${isPinned ? "font-medium text-orange-700" : "text-zinc-700"}`}>
                  {row.service}
                </span>
                <span className="relative h-2 min-w-0 flex-1 rounded-full bg-zinc-100" aria-hidden="true">
                  <span className={`absolute inset-y-0 left-0 rounded-full ${isPinned ? "bg-orange-700" : "bg-orange-600"}`} style={{ width: `${pct}%` }} />
                </span>
                <span className="w-6 shrink-0 text-right text-sm font-medium tabular-nums text-zinc-900">{row.count}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 min-w-0 border-t border-zinc-100 pt-3 text-xs text-zinc-500">
        {pinned ? (
          <p className="truncate">
            Pinned: <span className="font-medium text-zinc-700">{pinned.service}</span> — {pinned.count} incident{pinned.count === 1 ? "" : "s"} this period.
          </p>
        ) : (
          <p className="truncate">Click a service to pin it — this selection is independent of the incident preview below.</p>
        )}
      </div>
    </Card>
  );
}
