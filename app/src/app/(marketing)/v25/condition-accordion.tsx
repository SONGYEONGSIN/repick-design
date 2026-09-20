"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, CircleCheck, CircleX } from "lucide-react";
import { CONDITION_RUBRIC, ITEM } from "./data";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDA4AF]";

/**
 * Product-preview interaction: a plain disclosure, independent of the hero's layer
 * toggles, exposing the 12-point condition rubric behind the letter grade badge.
 */
export default function ConditionAccordion() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const panelId = useId();
  const passCount = CONDITION_RUBRIC.filter((p) => p.pass).length;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between gap-3 px-5 py-4 text-left ${FOCUS}`}
      >
        <span className="min-w-0">
          <span className="block text-[14px] font-semibold text-white">
            Grade {ITEM.conditionGrade} — the 12-point condition rubric
          </span>
          <span className="mt-0.5 block text-[12px] font-normal tabular-nums text-zinc-400">
            {passCount} of {CONDITION_RUBRIC.length} points hold at full marks
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-[#FDA4AF] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Content only enters the DOM when open — no height/maxHeight is ever animated,
          only the opacity/y of the whole block, so nothing here touches layout properties. */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={reduce ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="grid grid-cols-1 gap-2 border-t border-white/10 px-5 py-4 sm:grid-cols-2">
              {CONDITION_RUBRIC.map((point) => (
                <li key={point.label} className="flex items-start gap-2">
                  {point.pass ? (
                    <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#FDA4AF]" aria-hidden="true" />
                  ) : (
                    <CircleX className="mt-0.5 h-4 w-4 shrink-0 text-white" aria-hidden="true" />
                  )}
                  <span className="min-w-0">
                    <span className="block text-[13px] font-normal leading-[1.5] text-white">
                      {point.label}
                      <span className="ml-1.5 text-[11px] font-semibold text-zinc-400">
                        {point.pass ? "· Pass" : "· Flagged"}
                      </span>
                    </span>
                    {point.note && (
                      <span className="mt-0.5 block text-[12px] font-normal leading-[1.5] text-zinc-400">
                        {point.note}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
