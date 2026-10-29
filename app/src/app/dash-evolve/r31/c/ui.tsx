import { ArrowDown, ArrowUp, Minus } from "lucide-react";

export function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function StatusBadge({ status }: { status: "open" | "pending" | "resolved" }) {
  const map = {
    open: { label: "Open", cls: "bg-cyan-50 text-cyan-700 border-cyan-200" },
    pending: { label: "Pending", cls: "bg-amber-50 text-amber-700 border-amber-200" },
    resolved: { label: "Resolved", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  } as const;
  const m = map[status];
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide", m.cls)}>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      {m.label}
    </span>
  );
}

export function TrendIcon({ trend }: { trend: "up" | "down" | "flat" }) {
  if (trend === "flat") return <Minus aria-hidden className="h-3.5 w-3.5 text-zinc-400" />;
  if (trend === "up") return <ArrowUp aria-hidden className="h-3.5 w-3.5 text-rose-600" />;
  return <ArrowDown aria-hidden className="h-3.5 w-3.5 text-emerald-600" />;
}
