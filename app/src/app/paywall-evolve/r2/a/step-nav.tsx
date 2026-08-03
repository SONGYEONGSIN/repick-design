"use client";

import { Check } from "lucide-react";
import { cx } from "./data";

export interface StepDef {
  label: string;
  description: string;
}

export const STEPS: StepDef[] = [
  { label: "Evidence", description: "Why you're blocked" },
  { label: "Size it", description: "Match a plan to your usage" },
  { label: "Confirm", description: "Review & upgrade" },
];

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

/** The wizard's step control. Real navigation, not decoration: a step is clickable only once the
 * visitor has reached it (`maxReached`), which keeps the flow sequential on the way forward while
 * still letting them step back to re-check earlier evidence or numbers. */
export default function StepNav({
  step,
  maxReached,
  onGoStep,
}: {
  step: number;
  maxReached: number;
  onGoStep: (i: number) => void;
}) {
  return (
    <nav aria-label="Upgrade steps" className="mx-auto max-w-[1180px] px-4 pb-4 sm:px-6">
      <ol role="list" className="grid grid-cols-3 gap-2 sm:gap-3">
        {STEPS.map((s, i) => {
          const reached = i <= maxReached;
          const current = i === step;
          const done = i < step;
          return (
            <li key={s.label} className="min-w-0">
              <button
                type="button"
                disabled={!reached}
                aria-current={current ? "step" : undefined}
                onClick={() => reached && onGoStep(i)}
                className={cx(
                  "flex w-full min-w-0 items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-colors sm:px-3",
                  current
                    ? "border-amber-700 bg-amber-50"
                    : reached
                      ? "border-zinc-200 bg-white hover:border-zinc-300"
                      : "border-zinc-100 bg-zinc-50 cursor-not-allowed",
                  FOCUS,
                )}
              >
                <span
                  className={cx(
                    "flex h-5 w-5 flex-none items-center justify-center rounded-full text-[11px] font-medium tabular-nums",
                    current
                      ? "bg-amber-700 text-white"
                      : done
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-200 text-zinc-600",
                  )}
                >
                  {done ? <Check className="h-3 w-3" aria-hidden="true" /> : i + 1}
                </span>
                <span className="min-w-0">
                  <span
                    className={cx(
                      "block truncate text-xs font-medium",
                      current ? "text-amber-800" : reached ? "text-zinc-900" : "text-zinc-500",
                    )}
                  >
                    {s.label}
                  </span>
                  <span className="hidden truncate text-[11px] font-normal text-zinc-500 sm:block">
                    {s.description}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
