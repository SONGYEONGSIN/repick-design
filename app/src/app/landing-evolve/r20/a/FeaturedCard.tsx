"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, ShieldCheck } from "lucide-react";
import CategoryIcon from "./CategoryIcon";
import type { Estimate } from "./data";

// The single example listing that lives inside the hero and stays synced to the wizard's
// answers — this is the second "surface" that recomputes alongside the estimate panel's
// range/comps/reasoning, per the brief's "2+ independent surfaces" requirement.
export default function FeaturedCard({ estimate }: { estimate: Estimate }) {
  const icon = estimate.category?.icon ?? "bag";
  const title = estimate.category ? `Example: ${estimate.category.label}` : "Example listing";
  const noun = estimate.category?.noun ?? "resale item";

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-7">
      <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-600">Proof, not just a number</p>
      <AnimatePresence mode="wait" initial={false}>
        <motion.h2
          key={title}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.32 } }}
          exit={{ opacity: 0, y: -4, transition: { duration: 0.15 } }}
          className="mt-1 text-[15px] font-bold tracking-[-0.02em] text-[#121214]"
        >
          {title}
        </motion.h2>
      </AnimatePresence>

      <div className="mt-4 flex gap-4">
        <div
          className="relative flex aspect-square w-24 shrink-0 items-center justify-center rounded-xl bg-zinc-100"
          aria-hidden="true"
        >
          <CategoryIcon icon={icon} className="h-9 w-9 text-zinc-500" strokeWidth={1.5} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[12px] font-medium text-zinc-600">
              <ShieldCheck className="h-3.5 w-3.5 text-[#1F7A5C]" aria-hidden="true" />
              Verified
            </span>
            <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[12px] font-bold text-[#121214]">
              Grade {estimate.grade}
            </span>
          </div>
          <p className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium tabular-nums text-[#1F7A5C]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {estimate.matchPct}% match to buyer demand for {noun}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-zinc-200 pt-4">
        <span className="text-[13px] text-zinc-500 line-through tabular-nums">${estimate.before.toLocaleString("en-US")}</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={estimate.mid}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.32 } }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.15 } }}
            className="text-[20px] font-bold tabular-nums tracking-[-0.02em] text-[#121214]"
          >
            ${estimate.mid.toLocaleString("en-US")}
          </motion.span>
        </AnimatePresence>
        <span className="rounded-full bg-[#1F7A5C] px-2 py-0.5 text-[12px] font-medium text-white tabular-nums">
          -{estimate.discountPct}%
        </span>
      </div>
    </div>
  );
}
