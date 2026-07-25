import type { ExecStatus } from "../lib/data";
import { statusLabel } from "./StatusBadge";

export type StatusFilterValue = ExecStatus | "all";

interface StatusFilterProps {
  value: StatusFilterValue;
  onChange: (value: StatusFilterValue) => void;
  counts: Record<StatusFilterValue, number>;
}

const OPTIONS: StatusFilterValue[] = ["all", "success", "failed", "running", "warning"];

const DOT_CLASS: Record<StatusFilterValue, string> = {
  all: "bg-zinc-400",
  success: "bg-emerald-400",
  failed: "bg-rose-400",
  running: "bg-blue-400",
  warning: "bg-amber-400",
};

export default function StatusFilter({ value, onChange, counts }: StatusFilterProps) {
  return (
    <div
      role="group"
      aria-label="Filter workflow list by status"
      className="flex flex-wrap items-center gap-2"
    >
      {OPTIONS.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt)}
            className={`inline-flex min-h-[32px] items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 ${
              active
                ? "border-indigo-400/40 bg-indigo-400/10 text-indigo-300"
                : "border-white/10 bg-transparent text-zinc-400 hover:border-white/20 hover:text-zinc-200"
            }`}
          >
            {opt !== "all" && (
              <span className={`size-1.5 rounded-full ${DOT_CLASS[opt]}`} aria-hidden="true" />
            )}
            {opt === "all" ? "All" : statusLabel(opt)}
            <span className="tabular-nums text-[11px] text-zinc-500">{counts[opt]}</span>
          </button>
        );
      })}
    </div>
  );
}
