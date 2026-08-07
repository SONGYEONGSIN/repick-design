"use client";

import { useState } from "react";
import { FOCUS_RING, STAGES } from "./data";

/**
 * Second wired interaction: a horizontal numbered stepper where clicking a stage reveals its
 * detail panel below (single-select, native <button> + aria-expanded/aria-controls). Stage one
 * is selected by default, so a real detail panel is visible before any click.
 */
export default function StageStepper() {
  const [activeId, setActiveId] = useState(STAGES[0].id);
  const active = STAGES.find((s) => s.id === activeId)!;

  return (
    <div>
      <ol className="flex flex-wrap gap-2">
        {STAGES.map((stage, i) => {
          const isActive = stage.id === activeId;
          return (
            <li key={stage.id}>
              <button
                type="button"
                aria-expanded={isActive}
                aria-controls="stage-panel"
                onClick={() => setActiveId(stage.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${FOCUS_RING} ${
                  isActive
                    ? "border-green-700 bg-green-700/10 font-semibold text-green-800"
                    : "border-zinc-300 font-normal text-zinc-600 hover:border-zinc-400 hover:text-zinc-900"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-xs tabular-nums ${
                    isActive ? "bg-green-700 text-white" : "bg-zinc-200 text-zinc-700"
                  }`}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                {stage.label}
              </button>
            </li>
          );
        })}
      </ol>
      <div id="stage-panel" className="mt-6 max-w-2xl rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
        <h3 className="text-xl font-semibold text-zinc-900">{active.title}</h3>
        <p className="mt-3 text-base font-normal leading-relaxed text-zinc-700">{active.body}</p>
      </div>
    </div>
  );
}
