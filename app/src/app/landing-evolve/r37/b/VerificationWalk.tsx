"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Camera, Gauge, ShieldCheck, Tag, ChevronDown, CircleCheck } from "lucide-react";
import { STEPS, type StepId } from "./data";
import StepEvidence from "./StepEvidence";
import { FOCUS } from "./theme";

const STEP_ICON: Record<StepId, typeof Camera> = {
  scan: Camera,
  grading: Gauge,
  authenticity: ShieldCheck,
  listed: Tag,
};

interface VerificationWalkProps {
  inspected: ReadonlySet<StepId>;
  onInspect: (id: StepId) => void;
}

/**
 * The core device: a horizontal 4-step chain, click-to-inspect in any
 * order. Clicking a closed node opens its evidence panel AND marks it
 * inspected (growing the Trust Score's input set); clicking an already-open
 * node only collapses the panel — it stays inspected either way, so the
 * score never regresses. Only one panel is open at a time (an explicit
 * accordion, not a forced requirement from the brief, chosen so the
 * evidence area never has to reflow more than one block at once).
 */
export default function VerificationWalk({ inspected, onInspect }: VerificationWalkProps) {
  const [openStep, setOpenStep] = useState<StepId | null>(null);
  const reduced = useReducedMotion();

  function handleClick(id: StepId) {
    if (openStep === id) {
      setOpenStep(null);
      return;
    }
    setOpenStep(id);
    onInspect(id);
  }

  return (
    <div className="mt-14 lg:mt-16">
      <h2 id="walk-heading" className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-600">
        The verification walk
      </h2>
      <p className="mt-2 max-w-[480px] text-sm font-normal leading-[1.6] text-zinc-600">
        Every listing passes through these four steps before it reaches the catalog. Open any
        step, in any order, to see the actual evidence behind it.
      </p>

      <div className="mt-6 grid grid-cols-4 gap-2 sm:gap-4" role="group" aria-labelledby="walk-heading">
        {STEPS.map((step) => {
          const Icon = STEP_ICON[step.id];
          const isOpen = openStep === step.id;
          const isInspected = inspected.has(step.id);
          const panelId = `evidence-${step.id}`;

          return (
            <button
              key={step.id}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => handleClick(step.id)}
              className={`flex min-w-0 flex-col items-center gap-2 rounded-xl border px-1.5 py-3 text-center transition-colors sm:px-3 ${
                isOpen
                  ? "border-blue-600 bg-blue-50"
                  : isInspected
                    ? "border-blue-600/50 bg-white hover:bg-zinc-50"
                    : "border-zinc-200 bg-white hover:bg-zinc-50"
              } ${FOCUS}`}
            >
              <span
                className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${
                  isOpen
                    ? "border-blue-600 bg-blue-600"
                    : isInspected
                      ? "border-blue-600 bg-white"
                      : "border-zinc-300 bg-white"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${isOpen ? "text-white" : isInspected ? "text-blue-800" : "text-zinc-500"}`}
                  aria-hidden="true"
                />
                {isInspected && !isOpen && (
                  <CircleCheck
                    className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-white text-blue-600"
                    aria-hidden="true"
                  />
                )}
              </span>

              <span className="break-words text-[11px] font-semibold leading-tight text-zinc-900 sm:text-sm">
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{step.shortLabel}</span>
              </span>
              <span className="break-words text-[11px] font-normal leading-tight tabular-nums text-zinc-500">
                {step.chainCaption}
              </span>
              <span className="sr-only sm:not-sr-only sm:block sm:break-words sm:text-[11px] sm:font-normal sm:leading-tight sm:text-zinc-500">
                {isInspected ? "Inspected" : "Not yet opened"}
              </span>

              <ChevronDown
                className={`h-3.5 w-3.5 text-zinc-500 transition-transform motion-reduce:transition-none ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>

      <div className="relative mt-4">
        {STEPS.map((step) => {
          const panelId = `evidence-${step.id}`;
          if (openStep === step.id) return null;
          return <div key={step.id} id={panelId} className="sr-only" />;
        })}

        {openStep === null ? (
          <p className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-5 text-sm font-normal leading-[1.6] text-zinc-500">
            Pick any step above — the evidence behind it opens here, and the trust score starts
            building from whatever you open first.
          </p>
        ) : reduced ? (
          <div id={`evidence-${openStep}`} className="rounded-xl border border-blue-600 bg-white p-5">
            <StepEvidence stepId={openStep} />
          </div>
        ) : (
          <motion.div
            key={openStep}
            id={`evidence-${openStep}`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="rounded-xl border border-blue-600 bg-white p-5"
          >
            <StepEvidence stepId={openStep} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
