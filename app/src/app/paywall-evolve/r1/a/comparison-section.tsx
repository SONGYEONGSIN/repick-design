"use client";

import { useState } from "react";
import { Check, ChevronDown, Minus } from "lucide-react";
import { COMPARISON_ROWS, cx, FOCUS, type ComparisonCell } from "./data";

function Cell({ value }: { value: ComparisonCell }) {
  if (typeof value === "boolean") {
    return value ? (
      <span className="inline-flex items-center gap-1.5 font-normal text-zinc-200">
        <Check className="h-4 w-4 flex-none text-emerald-400" aria-hidden="true" />
        Yes
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 font-normal text-zinc-400">
        <Minus className="h-4 w-4 flex-none" aria-hidden="true" />
        <span className="sr-only">Not included</span>
      </span>
    );
  }
  return <span className="font-normal text-zinc-200">{value}</span>;
}

/** A secondary, collapsed-by-default full comparison table. The rail above already carries the core
 * decision (price + CTA are visible without touching this), so gating this behind a click loses
 * nothing at rest — it only adds detail for anyone who wants the Free-tier column too. */
export default function ComparisonSection() {
  const [open, setOpen] = useState(false);

  return (
    <section aria-labelledby="compare-heading" className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="compare-heading" className="text-xl font-semibold text-zinc-50">
          Compare every plan
        </h2>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="compare-table"
          onClick={() => setOpen((v) => !v)}
          className={cx(
            "inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100",
            FOCUS,
          )}
        >
          {open ? "Hide full comparison" : "Show full comparison"}
          <ChevronDown className={cx("h-4 w-4 transition-transform", open && "rotate-180")} aria-hidden="true" />
        </button>
      </div>

      {open && (
        <div id="compare-table" className="mt-4 overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full min-w-[560px] table-fixed border-collapse text-sm">
            <caption className="sr-only">
              Feature comparison across the Free, Pro, and Team plans
            </caption>
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/60">
                <th scope="col" className="w-[34%] px-4 py-3 text-left font-medium text-zinc-400">
                  Feature
                </th>
                <th scope="col" className="w-[22%] px-4 py-3 text-left font-medium text-zinc-400">
                  Free
                </th>
                <th scope="col" className="w-[22%] px-4 py-3 text-left font-medium text-zinc-400">
                  Pro
                </th>
                <th scope="col" className="w-[22%] px-4 py-3 text-left font-medium text-zinc-400">
                  Team
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.label} className="border-b border-zinc-800 last:border-b-0 even:bg-zinc-900/30">
                  <th scope="row" className="px-4 py-3 text-left font-medium text-zinc-200">
                    {row.label}
                  </th>
                  <td className="px-4 py-3 tabular-nums">
                    <Cell value={row.free} />
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    <Cell value={row.pro} />
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    <Cell value={row.team} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
