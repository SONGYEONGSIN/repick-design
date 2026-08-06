"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ProcessStep } from "./data";

type ProcessStepsProps = {
  steps: ProcessStep[];
  activeStep: number;
  onActivate: (index: number) => void;
};

export default function ProcessSteps({ steps, activeStep, onActivate }: ProcessStepsProps) {
  // Desktop: each card can expand independently ("read the full story").
  const [expanded, setExpanded] = useState<boolean[]>(() => steps.map(() => false));
  // Mobile: a single-open accordion, separate from the desktop expand state so the two layouts
  // don't fight over the same flag when the viewport crosses the breakpoint.
  const [mobileOpen, setMobileOpen] = useState<number | null>(null);

  function toggleExpanded(i: number) {
    setExpanded((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  function toggleMobile(i: number) {
    onActivate(i);
    setMobileOpen((prev) => (prev === i ? null : i));
  }

  return (
    <div>
      {/* Desktop / tablet: always-visible horizontal sequence, hover or focus syncs the hero diagram. */}
      <div className="hidden md:grid md:grid-cols-4 md:gap-6">
        {steps.map((step, i) => (
          <div
            key={step.id}
            onMouseEnter={() => onActivate(i)}
            onFocus={() => onActivate(i)}
            className={`min-w-0 rounded-2xl border p-5 transition-colors duration-200 ${
              i === activeStep
                ? "border-rose-300 bg-rose-50"
                : "border-zinc-200 bg-white"
            }`}
          >
            <span className="font-medium text-xs uppercase tracking-wide text-rose-600 tabular-nums">
              Step {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-2 font-semibold text-lg text-zinc-900">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">{step.summary}</p>

            <button
              type="button"
              aria-expanded={expanded[i]}
              aria-controls={`step-detail-${step.id}`}
              onClick={() => toggleExpanded(i)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-md font-medium text-sm text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2"
            >
              {expanded[i] ? "Hide the full story" : "Read the full story"}
              <ChevronDown
                aria-hidden="true"
                className={`h-4 w-4 transition-transform duration-200 ${
                  expanded[i] ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              id={`step-detail-${step.id}`}
              className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: expanded[i] ? "1fr" : "0fr" }}
            >
              <div className="min-h-0 overflow-hidden">
                <p className="mt-3 border-t border-rose-200 pt-3 text-sm leading-relaxed text-zinc-600">
                  {step.story}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: accordion fallback. One row open at a time; opening a row also syncs the diagram. */}
      <div className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 md:hidden">
        {steps.map((step, i) => (
          <div key={step.id} className={i === activeStep ? "bg-rose-50" : "bg-white"}>
            <button
              type="button"
              aria-expanded={mobileOpen === i}
              aria-controls={`mobile-step-${step.id}`}
              onClick={() => toggleMobile(i)}
              className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rose-600"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="font-bold tabular-nums text-rose-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-semibold text-zinc-900">{step.title}</span>
              </span>
              <ChevronDown
                aria-hidden="true"
                className={`h-5 w-5 flex-none text-zinc-500 transition-transform duration-200 ${
                  mobileOpen === i ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              id={`mobile-step-${step.id}`}
              className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: mobileOpen === i ? "1fr" : "0fr" }}
            >
              <div className="min-h-0 overflow-hidden px-4 pb-4">
                <p className="text-sm leading-relaxed text-zinc-600">{step.summary}</p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">{step.story}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
