"use client";

import { useState } from "react";
import { Check, ClipboardList } from "lucide-react";
import { RUNBOOK_STEPS } from "./data";

type ChecklistState = Record<string, boolean>;

function initialState(): ChecklistState {
  const state: ChecklistState = {};
  for (const step of RUNBOOK_STEPS) state[step.id] = step.defaultChecked;
  return state;
}

/**
 * Standard Incident Response Runbook.
 *
 * Deliberately NOT wired to the timeline above: it takes no `metric`,
 * `range`, `selectedAnomaly` or any other prop from the chart. Hovering,
 * focusing or hard-selecting any anomaly point changes nothing here — the
 * same seven steps and the same checked state persist regardless of which
 * anomaly (or none) a responder is currently looking at. This is the
 * macro-skeleton requirement for this round: an independent widget below
 * the hero, not a detail pane synced to chart selection.
 */
export function RunbookChecklist() {
  const [checked, setChecked] = useState<ChecklistState>(initialState);
  const doneCount = RUNBOOK_STEPS.filter((s) => checked[s.id]).length;

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
          <h2 className="text-base font-semibold text-zinc-50">Standard Incident Response Runbook</h2>
        </div>
        <p className="shrink-0 text-[11px] font-normal tabular-nums text-zinc-400">
          {doneCount} / {RUNBOOK_STEPS.length} complete
        </p>
      </div>
      <p className="mt-1 text-xs font-normal text-zinc-400">
        The same fixed procedure every time — it does not change with the metric, time range or anomaly selected above.
      </p>

      <ul className="mt-4 flex flex-col gap-1">
        {RUNBOOK_STEPS.map((step, i) => {
          const isChecked = checked[step.id];
          return (
            <li key={step.id}>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 hover:bg-zinc-800/60">
                <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggle(step.id)}
                    className="peer absolute inset-0 h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/20 bg-zinc-950 outline-offset-2 checked:border-cyan-400 checked:bg-cyan-400 focus-visible:outline-2 focus-visible:outline-cyan-400"
                    aria-describedby={`${step.id}-label`}
                  />
                  <Check
                    className="pointer-events-none relative h-3.5 w-3.5 text-zinc-950 opacity-0 peer-checked:opacity-100"
                    aria-hidden="true"
                    strokeWidth={3}
                  />
                </span>
                <span className="flex min-w-0 flex-1 items-baseline gap-2">
                  <span className="shrink-0 text-xs font-medium tabular-nums text-zinc-400">{i + 1}.</span>
                  <span
                    id={`${step.id}-label`}
                    className={`text-sm font-normal ${isChecked ? "text-zinc-400 line-through" : "text-zinc-50"}`}
                  >
                    {step.label}
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
