"use client";

import { AlertTriangle } from "lucide-react";
import { Card, CardTitle, FOCUS } from "./ui";
import { SEVERITIES, SEVERITY_LABEL, INCIDENTS, type Severity } from "./data";

export function SeverityFilterRail({
  active,
  onToggle,
}: {
  active: Set<Severity>;
  onToggle: (s: Severity) => void;
}) {
  return (
    <Card className="lg:sticky lg:top-[60px]">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 flex-shrink-0 text-zinc-500" aria-hidden="true" />
        <CardTitle>Severity</CardTitle>
      </div>
      <fieldset className="mt-3 space-y-1">
        <legend className="sr-only">Filter incidents by severity</legend>
        {SEVERITIES.map((s) => {
          const count = INCIDENTS.filter((i) => i.severity === s).length;
          const checked = active.has(s);
          return (
            <label
              key={s}
              className={`flex min-w-0 cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm font-normal text-zinc-700 hover:bg-zinc-50`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(s)}
                className={`h-4 w-4 flex-shrink-0 rounded border-zinc-300 text-emerald-600 ${FOCUS}`}
              />
              <span className="min-w-0 flex-1 truncate">{SEVERITY_LABEL[s]}</span>
              <span className="flex-shrink-0 tabular-nums text-xs font-normal text-zinc-500">{count}</span>
            </label>
          );
        })}
      </fieldset>
    </Card>
  );
}
