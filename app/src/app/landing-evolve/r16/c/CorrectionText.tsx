"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EyeOff } from "lucide-react";
import {
  CATEGORY_META,
  CORRECTIONS,
  REDLINE_TEMPLATE,
  type Category,
} from "./data";

/**
 * Renders the seller's paragraph as tracked changes. For an active category the original claim is
 * struck through and repick's correction is inserted, tagged with its category; for an inactive
 * one the sentence reverts to the seller's original, unmarked text — a visible, non-color-only cue
 * (icon + label) shows it's currently filtered out rather than "clean". This is the surface the
 * category-filter control recomputes most directly.
 */
export default function CorrectionText({ active }: { active: ReadonlySet<Category> }) {
  const shouldReduce = useReducedMotion();

  return (
    <p className="max-w-[496px] text-[15px] leading-[1.6] text-zinc-800 sm:text-[16px]">
      {REDLINE_TEMPLATE.map((segment, i) => {
        if (typeof segment === "string") {
          return <span key={`t-${i}`}>{segment}</span>;
        }
        const correction = CORRECTIONS.find((c) => c.id === segment.correctionId);
        if (!correction) return null;
        const isActive = active.has(correction.category);
        const meta = CATEGORY_META[correction.category];
        const CategoryIcon = meta.icon;

        return (
          <AnimatePresence key={correction.id} mode="popLayout" initial={false}>
            {isActive ? (
              <motion.span
                key="active"
                initial={shouldReduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={shouldReduce ? undefined : { opacity: 0 }}
                transition={{ duration: shouldReduce ? 0 : 0.18 }}
                className="inline"
              >
                <span className="text-zinc-500 line-through decoration-2 decoration-zinc-300">
                  {correction.before}
                </span>{" "}
                <span className="font-medium text-zinc-900 underline decoration-2 decoration-[#0369a1] underline-offset-2">
                  {correction.after}
                </span>{" "}
                <span className="inline-flex items-center gap-0.5 rounded-full bg-[#f0f9ff] px-1.5 py-0.5 align-middle text-[10px] font-medium uppercase tracking-[0.16em] text-[#0369a1]">
                  <CategoryIcon className="h-2.5 w-2.5" aria-hidden="true" />
                  {meta.short}
                </span>
              </motion.span>
            ) : (
              <motion.span
                key="inactive"
                initial={shouldReduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={shouldReduce ? undefined : { opacity: 0 }}
                transition={{ duration: shouldReduce ? 0 : 0.18 }}
                className="inline text-zinc-700"
              >
                {correction.before}{" "}
                <span className="inline-flex items-center gap-1 align-middle text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                  <EyeOff className="h-2.5 w-2.5" aria-hidden="true" />
                  not reviewed in this view
                </span>
              </motion.span>
            )}
          </AnimatePresence>
        );
      })}
    </p>
  );
}
