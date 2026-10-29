"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ShieldCheck, ShieldQuestion, Sparkles } from "lucide-react";
import { PRODUCTS, discountPct } from "./data";
import { Thumbnail } from "./graphics";
import { CAPTION, FOCUS_RING, MUTED_TEXT } from "./tokens";

export function ProductCards() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div>
      <h2 className="font-[var(--font-display-wide)] text-xl font-extrabold tracking-[-0.02em] text-[#15140E]">
        What the AI is appraising right now
      </h2>
      <p className={`mt-1 text-sm font-normal ${MUTED_TEXT}`}>Four live listings, each tagged with its own reasoning.</p>

      <ul className="mt-4 flex flex-col gap-3">
        {PRODUCTS.map((p) => {
          const pct = discountPct(p.before, p.after);
          const isOpen = open === p.id;
          const panelId = `${p.id}-detail`;
          return (
            <li key={p.id} className="min-w-0 rounded-xl border border-[#15140E]/12 bg-[#15140E]/[0.015] p-3">
              <div className="flex min-w-0 gap-3">
                <div className="aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#EFECE6]">
                  <Thumbnail variant={p.thumb} className="h-full w-full" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[#15140E]">{p.name}</p>

                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 ${CAPTION} text-[#15140E]`}>
                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                      Match
                    </span>
                    <span className={`inline-flex items-center rounded-full border border-[#15140E]/20 px-2 py-0.5 ${CAPTION} text-[#15140E]`}>
                      {p.condition}
                    </span>
                    {p.verified ? (
                      <span className={`inline-flex items-center gap-1 rounded-full border border-emerald-700/40 px-2 py-0.5 ${CAPTION} text-emerald-700`}>
                        <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                        Verified
                      </span>
                    ) : (
                      <span className={`inline-flex items-center gap-1 rounded-full border border-[#15140E]/20 px-2 py-0.5 ${CAPTION} ${MUTED_TEXT}`}>
                        <ShieldQuestion className="h-3 w-3" aria-hidden="true" />
                        Pending
                      </span>
                    )}
                  </div>

                  <p className={`mt-1.5 text-xs font-normal ${MUTED_TEXT}`}>{p.matchReason}</p>

                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className={`text-xs font-normal ${MUTED_TEXT} line-through`}>${p.before}</span>
                    <span className="text-sm font-bold text-[#15140E]">${p.after}</span>
                    <span className="text-xs font-bold text-emerald-700">−{pct}%</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : p.id)}
                className={`mt-2 flex min-h-9 items-center gap-1 text-xs font-bold text-[#15140E] ${FOCUS_RING}`}
              >
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex"
                >
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                </motion.span>
                Why this match
              </button>

              <p
                id={panelId}
                hidden={!isOpen}
                className={`mt-1.5 text-xs font-normal leading-[1.6] ${MUTED_TEXT}`}
              >
                {p.detail}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
