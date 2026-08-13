import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Clock, Plane, Ship, TrainFront, Truck } from "lucide-react";
import { cn } from "../utils";
import type { Mode, ShipmentStatus } from "../types";
import { STATUS_META } from "../data";

export function Card({
  id,
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: {
  id?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      aria-labelledby={title && id ? `${id}-title` : undefined}
      className={cn("flex flex-col rounded-2xl border border-white/10 bg-zinc-900/60 shadow-sm", className)}
    >
      {(title || action) && (
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-5 pt-5">
          <div className="min-w-0">
            {title && (
              <h2 id={id ? `${id}-title` : undefined} title={title} className="truncate text-sm font-semibold text-zinc-100">
                {title}
              </h2>
            )}
            {description && (
              <p title={description} className="mt-0.5 truncate text-xs text-zinc-400">
                {description}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={cn("flex-1", bodyClassName)}>{children}</div>
    </section>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">{children}</p>;
}

const STATUS_STYLES: Record<ShipmentStatus, string> = {
  on_time: "bg-emerald-500/10 text-emerald-400",
  at_risk: "bg-amber-500/10 text-amber-400",
  delayed: "bg-rose-500/15 text-rose-400",
  delivered: "bg-zinc-500/15 text-zinc-300",
};

const STATUS_DOT: Record<ShipmentStatus, string> = {
  on_time: "bg-emerald-400",
  at_risk: "bg-amber-400",
  delayed: "bg-rose-400",
  delivered: "bg-zinc-400",
};

export function StatusPill({ status, className }: { status: ShipmentStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium whitespace-nowrap", STATUS_STYLES[status], className)}>
      <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", STATUS_DOT[status])} />
      {STATUS_META[status].abbr}
    </span>
  );
}

const MODE_ICON: Record<Mode, typeof Truck> = {
  Truck: Truck,
  Ocean: Ship,
  Rail: TrainFront,
  Air: Plane,
};

export function ModeIcon({ mode, className }: { mode: Mode; className?: string }) {
  const Icon = MODE_ICON[mode];
  return <Icon aria-hidden="true" className={className ?? "size-3.5"} />;
}

export function DeltaText({ hours, className }: { hours: number; className?: string }) {
  const isOnTime = Math.abs(hours) < 0.05;
  const late = hours > 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap tabular-nums text-[11px] font-medium",
        isOnTime ? "text-zinc-400" : late ? "text-rose-400" : "text-emerald-400",
        className,
      )}
    >
      {!isOnTime && (late ? <AlertTriangle aria-hidden="true" className="size-3" /> : <CheckCircle2 aria-hidden="true" className="size-3" />)}
      {isOnTime && <Clock aria-hidden="true" className="size-3" />}
      {hours > 0 ? "+" : hours < 0 ? "−" : ""}
      {Math.abs(hours).toFixed(1)}h
    </span>
  );
}
