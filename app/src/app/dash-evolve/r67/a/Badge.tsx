import type { ReactNode } from "react";
import type { VisitStatus } from "./data";
import { STATUS_LABEL } from "./data";
import { cx } from "./ui";

const STATUS_STYLE: Record<VisitStatus, string> = {
  scheduled: "border-zinc-200 bg-zinc-100 text-zinc-700",
  confirmed: "border-sky-200 bg-sky-50 text-sky-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  missed: "border-rose-200 bg-rose-50 text-rose-700",
  cancelled: "border-zinc-300 border-dashed bg-white text-zinc-500 line-through",
};

export function StatusBadge({ status }: { status: VisitStatus }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        STATUS_STYLE[status]
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function Pill({ children, tone = "zinc" }: { children: ReactNode; tone?: "zinc" | "lime" }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        tone === "lime" ? "border-lime-300 bg-lime-50 text-lime-800" : "border-zinc-200 bg-zinc-100 text-zinc-700"
      )}
    >
      {children}
    </span>
  );
}
