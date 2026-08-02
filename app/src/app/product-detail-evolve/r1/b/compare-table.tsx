"use client";

import { useId, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { COMPARE_ROWS, TIERS, FOCUS, cx } from "./data";

/** Comparison matrix across the three Aria tiers. "Show differences only" filters out rows that
 * read identically for every tier (price is pinned and never filtered, since it's the one row a
 * shopper always wants visible). Table stays `table-fixed` with percentage columns so it never
 * grows a horizontal scrollbar on desktop widths. */
export default function CompareTable() {
  const [diffOnly, setDiffOnly] = useState(false);
  const switchId = useId();

  const rows = useMemo(() => {
    if (!diffOnly) return COMPARE_ROWS;
    return COMPARE_ROWS.filter((row) => {
      if (row.pinned) return true;
      const values = TIERS.map((t) => row.values[t.id]);
      return new Set(values).size > 1;
    });
  }, [diffOnly]);

  const hiddenCount = COMPARE_ROWS.length - rows.length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
        <p className="text-sm font-normal text-zinc-600">
          {rows.length} of {COMPARE_ROWS.length} specs shown
          {hiddenCount > 0 && <span className="tabular-nums"> · {hiddenCount} identical row{hiddenCount === 1 ? "" : "s"} hidden</span>}
        </p>
        <label htmlFor={switchId} className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-zinc-900">
          Show differences only
          <span className="relative inline-flex">
            <input
              id={switchId}
              type="checkbox"
              checked={diffOnly}
              onChange={(e) => setDiffOnly(e.target.checked)}
              className={cx("peer sr-only", FOCUS)}
            />
            <span
              aria-hidden="true"
              className="block h-6 w-11 rounded-full bg-zinc-200 transition-colors peer-checked:bg-orange-700 peer-focus-visible:ring-2 peer-focus-visible:ring-orange-600 peer-focus-visible:ring-offset-2"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform duration-200 motion-reduce:transition-none peer-checked:translate-x-5"
            />
          </span>
        </label>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-200">
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="sr-only">Specification comparison across the Aria II, Aria II Pro, and Aria Studio tiers</caption>
          <thead>
            <tr className="bg-zinc-50">
              <th scope="col" className="w-[28%] px-4 py-3 text-left text-xs font-medium tracking-wide text-zinc-600 uppercase">
                Spec
              </th>
              {TIERS.map((tier) => (
                <th
                  key={tier.id}
                  scope="col"
                  className={cx(
                    "w-[24%] px-4 py-3 text-left align-top",
                    tier.current && "bg-orange-50",
                  )}
                >
                  <span className={cx("block text-sm font-medium", tier.current ? "text-orange-700" : "text-zinc-900")}>
                    {tier.name}
                  </span>
                  {tier.current && (
                    <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-normal text-orange-700">
                      <Check className="h-3 w-3" aria-hidden="true" />
                      This page
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {rows.map((row) => (
              <tr key={row.key}>
                <th scope="row" className="px-4 py-3 text-left text-sm font-normal text-zinc-600">
                  {row.label}
                </th>
                {TIERS.map((tier) => (
                  <td
                    key={tier.id}
                    className={cx(
                      "px-4 py-3 text-sm font-medium text-zinc-900 tabular-nums",
                      tier.current && "bg-orange-50/60",
                    )}
                  >
                    {row.values[tier.id]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
