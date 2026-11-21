import type { ReactNode } from "react";

export function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function StatusBadge({ status }: { status: "pass" | "watch" | "fail" }) {
  const map = {
    pass: { label: "Pass", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    watch: { label: "Watch", cls: "bg-amber-50 text-amber-700 border-amber-200" },
    fail: { label: "Fail", cls: "bg-rose-50 text-rose-700 border-rose-200" },
  } as const;
  const m = map[status];
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        m.cls
      )}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      {m.label}
    </span>
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
    <div
      role="group"
      aria-label={label}
      className="inline-flex items-center rounded-lg border border-zinc-200 bg-zinc-100 p-0.5"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={cx(
              "rounded-md px-3 py-1.5 text-[13px] font-medium leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500",
              active ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-800"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2">
      {children}
    </div>
  );
}

export function Sparkline({ values, width = 160, height = 40 }: { values: number[]; width?: number; height?: number }) {
  if (values.length < 2) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const step = width / (values.length - 1);
  const points = values
    .map((v, i) => {
      const x = round2(i * step);
      const y = round2(height - ((v - min) / span) * (height - 6) - 3);
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className="overflow-visible" aria-hidden>
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
