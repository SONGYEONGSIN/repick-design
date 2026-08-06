"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FOCUS_RING, MILESTONES } from "./data";

/**
 * First wired interaction: each milestone is collapsed by default and expands on click. Uses a real
 * <button> (native Enter/Space handling, no custom key listener needed) with aria-expanded +
 * aria-controls wired to actual React state — not a CSS-only :hover/:focus reveal.
 */
export default function MilestoneTimeline() {
  const [openYears, setOpenYears] = useState<ReadonlySet<string>>(new Set());

  function toggle(year: string) {
    setOpenYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) {
        next.delete(year);
      } else {
        next.add(year);
      }
      return next;
    });
  }

  return (
    <ol className="relative ml-3 border-l-2 border-amber-200 sm:ml-4">
      {MILESTONES.map((milestone) => {
        const isOpen = openYears.has(milestone.year);
        const buttonId = `milestone-trigger-${milestone.year}`;
        const panelId = `milestone-panel-${milestone.year}`;
        return (
          <li key={milestone.year} className="relative pb-10 pl-6 last:pb-0 sm:pl-8">
            <span
              aria-hidden="true"
              className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-white bg-amber-600"
            />
            <h3 className="text-base leading-none">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(milestone.year)}
                className={`group flex w-full flex-wrap items-baseline gap-x-3 gap-y-1 rounded-sm text-left ${FOCUS_RING}`}
              >
                <span
                  className="tabular-nums font-black text-zinc-900"
                  style={{ fontFamily: "var(--font-display-grotesk)" }}
                >
                  {milestone.year}
                </span>
                <span className="font-semibold text-zinc-900">{milestone.title}</span>
                <ChevronDown
                  aria-hidden="true"
                  className={`h-4 w-4 flex-shrink-0 self-center text-zinc-500 transition-transform motion-reduce:transition-none group-hover:text-amber-700 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </h3>
            <p className="mt-1.5 max-w-prose font-normal text-zinc-600">{milestone.summary}</p>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="mt-3 max-w-prose border-l-2 border-amber-100 pl-4"
            >
              <p className="font-normal text-zinc-600">{milestone.detail}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
