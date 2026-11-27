import type { ReactNode } from "react";
import { AlertTriangle, CircleDot, Clock } from "lucide-react";
import type { CaseStatus } from "./data";

export function cx(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

// Focus-visible only — never pair with `outline-none` (this Tailwind v4 setup shares
// `--tw-outline-style` between the two, and `outline-none` silently cancels the later rule).
export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cx("rounded-xl border border-zinc-200 bg-white shadow-sm shadow-zinc-900/5", className)}>
      {children}
    </div>
  );
}

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-lg border border-zinc-200 bg-zinc-100 p-0.5">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={cx(
              "rounded-md px-2.5 py-1.5 text-[12px] font-medium leading-none transition-colors",
              FOCUS_RING,
              active ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

const CASE_STATUS_META: Record<CaseStatus, { label: string; cls: string; icon: typeof CircleDot }> = {
  open: { label: "Open", cls: "bg-zinc-100 text-zinc-700 border-zinc-200", icon: CircleDot },
  investigating: { label: "Investigating", cls: "bg-amber-50 text-amber-800 border-amber-200", icon: Clock },
  escalated: { label: "Escalated", cls: "bg-rose-50 text-rose-700 border-rose-200", icon: AlertTriangle },
};

export function CaseStatusBadge({ status }: { status: CaseStatus }) {
  const meta = CASE_STATUS_META[status];
  const Icon = meta.icon;
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium", meta.cls)}>
      <Icon aria-hidden className="h-3 w-3" />
      {meta.label}
    </span>
  );
}

export function SignalStatusBadge({ elevated }: { elevated: boolean }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
        elevated ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"
      )}
    >
      <span aria-hidden className={cx("h-1.5 w-1.5 rounded-full", elevated ? "bg-rose-600" : "bg-emerald-600")} />
      {elevated ? "Elevated" : "Nominal"}
    </span>
  );
}
