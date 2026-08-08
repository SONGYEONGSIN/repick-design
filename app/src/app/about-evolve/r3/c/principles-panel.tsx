"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { PRINCIPLES, FOCUS_RING } from "./data";

/**
 * Second wired interaction: six numbered principles read one at a time, with a progress meter
 * that fills as each one is actually opened. The first principle is selected (and therefore
 * marked read) on initial render, so the full text of at least one principle and a truthful
 * "1 of 6" count are both visible before any interaction — the meter never starts at zero-with-
 * no-content. This is deliberately not a plain tablist: selecting a principle a second time does
 * not un-mark it, so the bar is a read receipt, not just a pointer to the current tab.
 */
export default function PrinciplesPanel() {
  const [activeId, setActiveId] = useState(PRINCIPLES[0].id);
  const [readIds, setReadIds] = useState<Set<string>>(new Set([PRINCIPLES[0].id]));

  const active = PRINCIPLES.find((p) => p.id === activeId)!;
  const readCount = readIds.size;

  function select(id: string) {
    setActiveId(id);
    setReadIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div
          className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-zinc-800"
          role="progressbar"
          aria-valuenow={readCount}
          aria-valuemin={0}
          aria-valuemax={PRINCIPLES.length}
          aria-label="Principles reviewed"
        >
          <div
            className="h-full rounded-full bg-cyan-400 transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${Math.round((readCount / PRINCIPLES.length) * 100)}%` }}
          />
        </div>
        <p className="text-sm font-normal tabular-nums text-zinc-400">
          {readCount} of {PRINCIPLES.length} reviewed
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[16rem_1fr]">
        <div role="group" aria-label="Select a principle" className="flex flex-row flex-wrap gap-2 lg:flex-col">
          {PRINCIPLES.map((p) => {
            const isActive = p.id === activeId;
            const isRead = readIds.has(p.id);
            return (
              <button
                key={p.id}
                type="button"
                aria-current={isActive ? "true" : undefined}
                onClick={() => select(p.id)}
                className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left ${FOCUS_RING} ${
                  isActive
                    ? "border-cyan-400/60 bg-cyan-400/[0.07]"
                    : "border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <span
                  className={`flex h-6 w-6 flex-none items-center justify-center rounded-full text-xs tabular-nums ${
                    isActive
                      ? "bg-cyan-400 font-semibold text-zinc-950"
                      : isRead
                        ? "bg-zinc-700 font-semibold text-zinc-100"
                        : "bg-zinc-800 font-normal text-zinc-500"
                  }`}
                >
                  {isRead && !isActive ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : p.number}
                </span>
                <span
                  className={`text-sm ${isActive ? "font-semibold text-zinc-50" : "font-normal text-zinc-300"}`}
                >
                  {p.title}
                </span>
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-300">
            Principle {active.number}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-zinc-50">{active.title}</h3>
          <p className="mt-3 text-base font-normal leading-relaxed text-zinc-300">{active.body}</p>
        </div>
      </div>
    </div>
  );
}
