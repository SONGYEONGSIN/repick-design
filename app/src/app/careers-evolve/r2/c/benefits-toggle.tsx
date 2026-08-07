"use client";

import { useState } from "react";
import { BENEFITS, FOCUS_RING, type EmploymentType } from "./data";

/**
 * Third wired interaction: a two-way segmented control (native <button> pair with aria-pressed)
 * that swaps which fixed benefits list renders. Both lists are real, pre-written data — the
 * control only chooses which literal array to show.
 */
export default function BenefitsToggle() {
  const [type, setType] = useState<EmploymentType>("full-time");
  const rows = BENEFITS[type];

  return (
    <div>
      <div role="group" aria-label="Employment type" className="inline-flex rounded-full border border-zinc-300 p-1">
        {(["full-time", "contract"] as EmploymentType[]).map((t) => {
          const isActive = t === type;
          return (
            <button
              key={t}
              type="button"
              aria-pressed={isActive}
              onClick={() => setType(t)}
              className={`rounded-full px-4 py-1.5 text-sm capitalize ${FOCUS_RING} ${
                isActive ? "bg-green-700 font-semibold text-white" : "font-normal text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {t.replace("-", " ")}
            </button>
          );
        })}
      </div>
      <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="rounded-xl border border-zinc-200 bg-white p-4">
            <dt className="text-xs font-normal uppercase tracking-[0.1em] text-zinc-600">{row.label}</dt>
            <dd className="mt-1 text-base font-semibold text-zinc-900">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
