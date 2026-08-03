import { CircleSlash } from "lucide-react";
import { cx, fmt, type UsagePoint } from "./data";

/** Plain HTML/CSS bar chart (no SVG needed) — every bar's exact value is real DOM text, so a
 * screen reader gets the numbers directly instead of relying on decorative shapes. Paused days are
 * marked three ways at once (dashed border + icon + "— paused" text), never by color alone. */
export default function UsageChart({ data }: { data: UsagePoint[] }) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex h-44 items-end gap-2 sm:gap-3">
      {data.map((d) => {
        const pct = Math.max((d.value / max) * 100, 4);
        return (
          <div key={d.label} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
            <span className="flex items-center gap-1 text-xs font-medium tabular-nums text-slate-700">
              {fmt(d.value)}
              {d.paused && <CircleSlash className="h-3 w-3 flex-none text-red-600" aria-hidden="true" />}
            </span>
            <div className="flex h-28 w-full items-end">
              <div
                style={{ height: `${pct}%` }}
                className={cx(
                  "w-full rounded-t-md",
                  d.paused ? "border border-dashed border-red-400 bg-red-100" : "bg-teal-600",
                )}
              />
            </div>
            <span className="text-xs font-normal text-slate-500">
              {d.label}
              {d.paused && <span className="sr-only"> — paused</span>}
            </span>
          </div>
        );
      })}
    </div>
  );
}
