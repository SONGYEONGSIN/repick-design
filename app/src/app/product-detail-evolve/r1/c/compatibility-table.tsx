import { CheckCircle2, TriangleAlert, XCircle } from "lucide-react";
import { COMPAT_ROWS, type FitStatus } from "./data";

const STATUS_META: Record<FitStatus, { label: string; icon: typeof CheckCircle2; className: string }> = {
  compatible: { label: "Compatible", icon: CheckCircle2, className: "text-emerald-700 dark:text-emerald-400" },
  partial: { label: "Partial fit", icon: TriangleAlert, className: "text-amber-700 dark:text-amber-400" },
  incompatible: { label: "Not compatible", icon: XCircle, className: "text-red-700 dark:text-red-400" },
};

export default function CompatibilityTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed border-collapse text-sm">
        <caption className="mb-3 text-left text-xs font-normal text-zinc-600 dark:text-zinc-400">
          Host controller and interface compatibility for the LA-640 series
        </caption>
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-800">
            <th scope="col" className="w-[30%] py-2 pr-2 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400">
              System
            </th>
            <th scope="col" className="w-[20%] py-2 pr-2 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Interface
            </th>
            <th scope="col" className="hidden w-[32%] py-2 pr-2 text-left text-xs font-medium text-zinc-600 sm:table-cell dark:text-zinc-400">
              Note
            </th>
            <th scope="col" className="w-[18%] py-2 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Fit
            </th>
          </tr>
        </thead>
        <tbody>
          {COMPAT_ROWS.map((row) => {
            const meta = STATUS_META[row.status];
            const Icon = meta.icon;
            return (
              <tr key={row.id} className="border-b border-zinc-100 last:border-0 dark:border-zinc-900">
                <th scope="row" className="py-2.5 pr-2 text-left text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {row.system}
                </th>
                <td className="py-2.5 pr-2 text-sm font-normal text-zinc-600 dark:text-zinc-400">{row.interface}</td>
                <td className="hidden py-2.5 pr-2 text-sm font-normal text-zinc-600 sm:table-cell dark:text-zinc-400">
                  {row.note}
                </td>
                <td className="py-2.5">
                  <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${meta.className}`}>
                    <Icon className="h-4 w-4 flex-none" aria-hidden="true" />
                    {meta.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
