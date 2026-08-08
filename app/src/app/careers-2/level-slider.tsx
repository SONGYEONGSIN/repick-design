"use client";

import { useState } from "react";
import { FOCUS_RING, LEVELS } from "./data";

/**
 * Third wired interaction: a native <input type="range"> whose value is an index into the fixed
 * LEVELS array. The slider only ever selects a pre-written comp band — it never computes a number
 * — so the displayed base/equity figures can never diverge from what's published here.
 */
export default function LevelSlider() {
  const [index, setIndex] = useState(2);
  const level = LEVELS[index];

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-300">Level explorer</span>
        <span className="text-2xl font-black text-zinc-50">{level.label}</span>
      </div>
      <input
        type="range"
        min={0}
        max={LEVELS.length - 1}
        step={1}
        value={index}
        onChange={(e) => setIndex(Number(e.target.value))}
        aria-label="Select a level"
        aria-valuetext={level.label}
        className={`mt-5 h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-800 accent-teal-400 ${FOCUS_RING}`}
      />
      <div className="mt-1 flex justify-between text-xs font-normal tabular-nums text-zinc-400">
        {LEVELS.map((l) => (
          <span key={l.key}>{l.key}</span>
        ))}
      </div>

      <p className="mt-6 max-w-xl text-base font-normal leading-relaxed text-zinc-300">{level.summary}</p>

      <dl className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-zinc-800 p-4">
          <dt className="text-xs font-normal uppercase tracking-[0.1em] text-zinc-400">Base salary</dt>
          <dd className="mt-1 text-lg font-semibold tabular-nums text-zinc-50">{level.base}</dd>
        </div>
        <div className="rounded-xl border border-zinc-800 p-4">
          <dt className="text-xs font-normal uppercase tracking-[0.1em] text-zinc-400">Equity</dt>
          <dd className="mt-1 text-lg font-semibold tabular-nums text-zinc-50">{level.equity}</dd>
        </div>
      </dl>
    </div>
  );
}
