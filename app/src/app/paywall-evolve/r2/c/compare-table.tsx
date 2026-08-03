import { Check } from "lucide-react";
import { type BillingPeriod, COMPARE_FIELDS, PLANS, RECOMMENDED_PLAN_ID, cx } from "./data";

interface CompareTableProps {
  billing: BillingPeriod;
}

export default function CompareTable({ billing }: CompareTableProps) {
  return (
    <div className="relative -mx-1 overflow-x-auto px-1">
      <table className="w-full table-fixed border-collapse text-sm">
        <caption className="sr-only">Feature comparison across Starter, Growth, and Scale plans</caption>
        <colgroup>
          <col className="w-[30%]" />
          <col className="w-[23.34%]" />
          <col className="w-[23.33%]" />
          <col className="w-[23.33%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-zinc-800">
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-zinc-400">
              Plan
            </th>
            {PLANS.map((p) => (
              <th
                key={p.id}
                scope="col"
                className={cx(
                  "px-3 py-3 text-left text-xs font-medium",
                  p.id === RECOMMENDED_PLAN_ID ? "text-blue-400" : "text-zinc-400",
                )}
              >
                <span className="flex items-center gap-1.5">
                  {p.name}
                  {p.id === RECOMMENDED_PLAN_ID && (
                    <Check className="h-3.5 w-3.5 flex-none text-blue-400" aria-hidden="true" />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARE_FIELDS.map((field, i) => (
            <tr key={field.key} className={cx(i % 2 === 1 && "bg-zinc-900/50")}>
              <th scope="row" className="px-3 py-3 text-left text-sm font-normal text-zinc-400">
                {field.label}
              </th>
              {PLANS.map((p) => (
                <td
                  key={p.id}
                  className={cx(
                    "px-3 py-3 text-sm tabular-nums text-zinc-50",
                    p.id === RECOMMENDED_PLAN_ID ? "font-medium" : "font-normal",
                  )}
                >
                  {field.get(p, billing)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
