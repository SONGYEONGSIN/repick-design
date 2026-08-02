"use client";

import { useId, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { COMPARE_FIELDS, PLANS, RECOMMENDED_PLAN_ID, type BillingPeriod, cx, FOCUS } from "./data";

/** Disclosure that reveals the full three-tier spec matrix on demand. Kept off the hero so the
 * single recommended plan stays the primary decision, but the whole table renders in the DOM the
 * instant it opens (no lazy fetch) — a screen reader or Ctrl+F user gets it either way. */
export default function CompareDrawer({ billing }: { billing: BillingPeriod }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={cx(
          "flex w-full items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left",
          FOCUS,
        )}
      >
        <span className="text-sm font-medium text-zinc-100">
          {open ? "Hide full plan comparison" : "Show full plan comparison — Starter, Team, and Scale"}
        </span>
        <ChevronDown
          className={cx("h-4 w-4 flex-none text-zinc-400 transition-transform duration-200 motion-reduce:transition-none", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div id={panelId} className="border-t border-zinc-800 p-5 pt-4">
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full table-fixed border-collapse text-sm">
              <caption className="sr-only">Feature comparison across the Starter, Team, and Scale plans</caption>
              <thead>
                <tr className="bg-zinc-900">
                  <th scope="col" className="w-[28%] px-4 py-3 text-left text-xs font-medium tracking-wide text-zinc-400 uppercase">
                    Plan
                  </th>
                  {PLANS.map((plan) => (
                    <th
                      key={plan.id}
                      scope="col"
                      className={cx("w-[24%] px-4 py-3 text-left align-top", plan.id === RECOMMENDED_PLAN_ID && "bg-green-500/10")}
                    >
                      <span className={cx("block text-sm font-medium", plan.id === RECOMMENDED_PLAN_ID ? "text-green-400" : "text-zinc-100")}>
                        {plan.name}
                      </span>
                      {plan.id === RECOMMENDED_PLAN_ID && (
                        <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-normal text-green-400">
                          <Check className="h-3 w-3 flex-none" aria-hidden="true" />
                          Recommended
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {COMPARE_FIELDS.map((field) => (
                  <tr key={field.key}>
                    <th scope="row" className="px-4 py-3 text-left text-sm font-normal text-zinc-400">
                      {field.label}
                    </th>
                    {PLANS.map((plan) => (
                      <td
                        key={plan.id}
                        className={cx(
                          "px-4 py-3 text-sm font-medium text-zinc-100 tabular-nums",
                          plan.id === RECOMMENDED_PLAN_ID && "bg-green-500/5",
                        )}
                      >
                        {field.get(plan, billing)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
