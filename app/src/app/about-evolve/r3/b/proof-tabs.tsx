"use client";

import { useState } from "react";
import { FOCUS_RING, PROOF_CATEGORIES } from "./data";

/**
 * Third wired interaction: plain toggle buttons (aria-pressed, not an ARIA tablist with arrow-key
 * navigation) that switch which category of proof stats is shown. Deliberately not the sticky
 * segmented stat rail or the ARIA-tablist pattern already used elsewhere in this catalog —  a
 * simple button group is the whole mechanism. The flat dl > div > (dt, dd) structure avoids
 * nesting an icon inside dt/dd (breaks axe's definition-list audit).
 */
export default function ProofTabs() {
  const [activeId, setActiveId] = useState(PROOF_CATEGORIES[0].id);
  const active = PROOF_CATEGORIES.find((c) => c.id === activeId) ?? PROOF_CATEGORIES[0];

  return (
    <div>
      <div role="group" aria-label="Proof category" className="flex flex-wrap gap-2">
        {PROOF_CATEGORIES.map((cat) => {
          const isActive = cat.id === activeId;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveId(cat.id)}
              aria-pressed={isActive}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                isActive
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-emerald-300 hover:text-emerald-800"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <dl aria-live="polite" className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {active.stats.map((stat) => (
          <div key={stat.label} className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-5">
            <dd className="text-3xl font-semibold tabular-nums text-zinc-900">{stat.value}</dd>
            <dt className="mt-1 text-sm font-normal leading-snug text-zinc-600">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </div>
  );
}
