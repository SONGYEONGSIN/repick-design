import { CircleCheck, CircleX, Loader2, TriangleAlert } from "lucide-react";
import type { ExecStatus } from "../lib/data";

const STATUS_META: Record<
  ExecStatus,
  { label: string; className: string; Icon: typeof CircleCheck }
> = {
  success: {
    label: "성공",
    className: "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20",
    Icon: CircleCheck,
  },
  failed: {
    label: "실패",
    className: "bg-rose-500/10 text-rose-400 ring-1 ring-inset ring-rose-500/20",
    Icon: CircleX,
  },
  running: {
    label: "실행중",
    className: "bg-blue-500/10 text-blue-400 ring-1 ring-inset ring-blue-500/20",
    Icon: Loader2,
  },
  warning: {
    label: "경고",
    className: "bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20",
    Icon: TriangleAlert,
  },
};

export function statusLabel(status: ExecStatus): string {
  return STATUS_META[status].label;
}

export default function StatusBadge({ status }: { status: ExecStatus }) {
  const { label, className, Icon } = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${className}`}
    >
      <Icon
        className={`size-3 ${status === "running" ? "animate-spin motion-reduce:animate-none" : ""}`}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
