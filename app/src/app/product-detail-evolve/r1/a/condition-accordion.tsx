"use client";

import { ChevronDown } from "lucide-react";
import type { ConditionPoint } from "./data";

/**
 * Interaction 4 — expandable spec sections. Each inspection group opens independently (not an
 * accordion that forces one-at-a-time), because a shopper comparing "sole" and "hardware" notes
 * side-by-open is a real use case here. The numeric score is always visible on the closed header —
 * expansion reveals the *why*, not the headline number, so nothing load-bearing hides behind a click.
 */
export default function ConditionAccordion({
  points,
  expanded,
  onToggle,
}: {
  points: ConditionPoint[];
  expanded: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white">
      {points.map((point) => {
        const isOpen = expanded.has(point.id);
        const panelId = `condition-panel-${point.id}`;
        const buttonId = `condition-trigger-${point.id}`;
        return (
          <div key={point.id}>
            <h3 className="text-base">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => onToggle(point.id)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#A16207] sm:px-6"
              >
                <span className="flex-1 text-sm font-medium text-zinc-900">{point.title}</span>
                <span className="text-sm font-normal tabular-nums text-zinc-600">
                  {point.score}
                  <span className="text-zinc-500">/100</span>
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className={`h-4 w-4 flex-none text-zinc-500 transition-transform duration-200 motion-reduce:transition-none ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </h3>
            {isOpen ? (
              <div id={panelId} role="region" aria-labelledby={buttonId} className="px-5 pb-5 sm:px-6">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-[#A16207]"
                    style={{ width: `${point.score}%` }}
                  />
                </div>
                <p className="mt-3 text-sm font-normal leading-relaxed text-zinc-700">{point.summary}</p>
                <ul className="mt-3 space-y-1.5">
                  {point.notes.map((note, i) => (
                    <li key={i} className="flex gap-2 text-sm font-normal leading-relaxed text-zinc-600">
                      <span aria-hidden="true" className="mt-2 h-1 w-1 flex-none rounded-full bg-zinc-400" />
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
