"use client";

import { useState } from "react";
import { FOCUS_RING, YEAR_STATS } from "./data";

/**
 * First wired interaction: a native <input type="range"> whose value is an index into the fixed
 * YEAR_STATS array. The slider never computes a number — it only picks which pre-written year
 * record to render, so the headline and stats can never show a value that doesn't exist in
 * data.ts. aria-valuetext announces the year, not the raw index, to screen readers.
 */
export default function YearScrubber() {
  const [index, setIndex] = useState(YEAR_STATS.length - 1);
  const current = YEAR_STATS[index];

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold uppercase tracking-[0.14em] text-lime-800">Fenwick, over time</span>
        <span className="text-3xl font-black tabular-nums text-zinc-900">{current.year}</span>
      </div>
      <input
        type="range"
        min={0}
        max={YEAR_STATS.length - 1}
        step={1}
        value={index}
        onChange={(e) => setIndex(Number(e.target.value))}
        aria-label="Select a year"
        aria-valuetext={String(current.year)}
        className={`mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-lime-700 ${FOCUS_RING}`}
      />
      <div className="mt-1 flex justify-between text-xs font-normal tabular-nums text-zinc-500">
        {YEAR_STATS.map((y) => (
          <span key={y.year}>{y.year}</span>
        ))}
      </div>

      <p className="mt-6 max-w-2xl text-lg font-normal leading-relaxed text-zinc-700">{current.headline}</p>

      <dl className="mt-6 grid grid-cols-3 gap-4">
        {current.stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <dt className="text-xs font-normal uppercase tracking-[0.1em] text-zinc-600">{stat.label}</dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums text-zinc-900">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
