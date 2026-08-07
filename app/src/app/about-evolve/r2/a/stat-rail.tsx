"use client";

import { useState } from "react";
import { FOCUS_RING, STAT_SETS } from "./data";

/**
 * Third wired interaction: a two-way segmented control (native <button> pair with aria-pressed)
 * that swaps which fixed stat set the rail displays. Both sets are real, pre-written data — no
 * value here is derived at click time, the control only chooses which literal array to render.
 * The rail is sticky on large viewports only (lg:sticky); on narrow viewports it lays out inline
 * with the rest of the column instead of stacking a second scroll region on top of the page one.
 */
export default function StatRail() {
  const [key, setKey] = useState<"company" | "culture">("company");
  const set = STAT_SETS.find((s) => s.key === key)!;

  return (
    <aside className="lg:sticky lg:top-24" aria-label="Company stats">
      <div role="group" aria-label="Stat set" className="inline-flex rounded-full border border-zinc-800 p-1">
        {STAT_SETS.map((s) => {
          const isActive = s.key === key;
          return (
            <button
              key={s.key}
              type="button"
              aria-pressed={isActive}
              onClick={() => setKey(s.key)}
              className={`rounded-full px-3.5 py-1.5 text-sm ${FOCUS_RING} ${
                isActive ? "bg-rose-400 font-semibold text-zinc-950" : "font-normal text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        {set.stats.map((stat) => (
          <div key={stat.label}>
            <dt className="text-xs font-normal uppercase tracking-[0.14em] text-zinc-400">{stat.label}</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-zinc-50">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
