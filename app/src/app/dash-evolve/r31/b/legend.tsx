"use client";

import { DEPARTMENTS, departmentTotal, grandTotal, type Metric } from "./data";
import { cx } from "./ui";

const DEPT_SHADE = ["#6366f1", "#4f46e5", "#4338ca", "#3730a3", "#312e81"];

export default function Legend({
  metric,
  pinnedDept,
  onSelectDept,
}: {
  metric: Metric;
  pinnedDept: string;
  onSelectDept: (deptId: string) => void;
}) {
  const total = grandTotal(metric) || 1;
  return (
    <ul className="flex flex-col gap-1" aria-label="Department breakdown, always visible">
      {DEPARTMENTS.map((dept, i) => {
        const value = departmentTotal(dept, metric);
        const pct = Math.round((value / total) * 100);
        const active = dept.id === pinnedDept;
        return (
          <li key={dept.id}>
            <button
              type="button"
              onClick={() => onSelectDept(dept.id)}
              aria-pressed={active}
              className={cx(
                "flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400",
                active ? "border-indigo-400/40 bg-indigo-500/15" : "border-transparent hover:bg-white/5"
              )}
            >
              <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: DEPT_SHADE[i % DEPT_SHADE.length] }} />
              <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-zinc-100">{dept.name}</span>
              <span className="shrink-0 text-[12px] tabular-nums text-zinc-400">{pct}%</span>
              <span className="w-10 shrink-0 text-right text-[13px] font-semibold tabular-nums text-zinc-50">{value}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
