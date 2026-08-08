"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { COMP_MATRIX, DEPARTMENTS, DEPARTMENT_LABELS, EXPERIENCE_BUCKETS, FOCUS_RING, type Department } from "./data";

/**
 * Third wired interaction: a compensation panel driven by two real inputs — department and years
 * of experience — that index into COMP_MATRIX, a small fixed lookup table (data.ts). Neither
 * control computes a number at render time; each combination only ever selects one pre-written
 * cell, so the displayed band can never diverge from what is published. Distinct from a single
 * level slider: the band depends on two independent axes, and switching department can change the
 * band even when experience stays put.
 */
export default function CompCalculator() {
  const [department, setDepartment] = useState<Department>("engineering");
  const [bucketIndex, setBucketIndex] = useState(2);

  const cell = useMemo(() => COMP_MATRIX[department][bucketIndex], [department, bucketIndex]);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-violet-300">
        <Calculator aria-hidden="true" className="h-3.5 w-3.5" />
        Compensation lookup
      </p>

      <div className="mt-5">
        <span className="text-sm font-semibold text-zinc-50" id="dept-control-label">
          Department
        </span>
        <div role="group" aria-labelledby="dept-control-label" className="mt-2 flex flex-wrap gap-2">
          {DEPARTMENTS.map((key) => {
            const active = department === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => setDepartment(key)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${FOCUS_RING} ${
                  active ? "border-violet-400 bg-violet-400 text-zinc-950" : "border-zinc-700 text-zinc-300 hover:border-zinc-600"
                }`}
              >
                {DEPARTMENT_LABELS[key]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <span className="text-sm font-semibold text-zinc-50" id="exp-control-label">
          Years of experience
        </span>
        <div role="group" aria-labelledby="exp-control-label" className="mt-2 flex flex-wrap gap-2">
          {EXPERIENCE_BUCKETS.map((label, i) => {
            const active = bucketIndex === i;
            return (
              <button
                key={label}
                type="button"
                aria-pressed={active}
                onClick={() => setBucketIndex(i)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold tabular-nums transition-colors ${FOCUS_RING} ${
                  active ? "border-violet-400 bg-violet-400 text-zinc-950" : "border-zinc-700 text-zinc-300 hover:border-zinc-600"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3" aria-live="polite">
        <div className="rounded-xl border border-zinc-800 p-4">
          <span className="text-xs font-normal uppercase tracking-[0.1em] text-zinc-400">Resolved band</span>
          <p className="mt-1 text-lg font-bold text-zinc-50">{cell.band}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 p-4">
          <span className="text-xs font-normal uppercase tracking-[0.1em] text-zinc-400">Base salary</span>
          <p className="mt-1 text-lg font-bold tabular-nums text-zinc-50">{cell.base}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 p-4">
          <span className="text-xs font-normal uppercase tracking-[0.1em] text-zinc-400">Equity</span>
          <p className="mt-1 text-lg font-bold tabular-nums text-zinc-50">{cell.equity}</p>
        </div>
      </div>
      {cell.note ? <p className="mt-3 text-sm font-normal text-zinc-400">{DEPARTMENT_LABELS[department]} roles are {cell.note}.</p> : null}
      <p className="mt-3 text-sm font-normal leading-relaxed text-zinc-400">
        Figures are the published band for {DEPARTMENT_LABELS[department]} at {EXPERIENCE_BUCKETS[bucketIndex]} of relevant experience —
        the same table hiring managers use in an offer.
      </p>
    </div>
  );
}
