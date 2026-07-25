import type { Period } from "./data";
import { PERIOD_LABEL } from "./data";
import { cn } from "./cn";

const PERIODS: Period[] = ["today", "week", "month"];

interface PeriodToggleProps {
  value: Period;
  onChange: (period: Period) => void;
}

export function PeriodToggle({ value, onChange }: PeriodToggleProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Date range"
      className="inline-flex h-11 items-center rounded-lg border border-zinc-200 bg-zinc-50 p-1"
    >
      {PERIODS.map((period) => {
        const active = period === value;
        return (
          <button
            key={period}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(period)}
            className={cn(
              "h-9 rounded-md px-3.5 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1",
              active
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-900",
            )}
          >
            {PERIOD_LABEL[period]}
          </button>
        );
      })}
    </div>
  );
}
