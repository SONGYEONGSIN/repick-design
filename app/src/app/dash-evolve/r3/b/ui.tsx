"use client";

import { useEffect, useId, useRef, useState, type ComponentType, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn, FOCUS_RING } from "./cn";
import type { StatusMeta } from "./status-meta";

export function Card({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-zinc-900/60 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]",
        padded && "p-4 sm:p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CaptionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("text-[11px] font-medium uppercase tracking-wider text-zinc-400", className)}>
      {children}
    </span>
  );
}

export function Badge({ meta, className }: { meta: StatusMeta; className?: string }) {
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        meta.badge,
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-3.5 shrink-0" />
      {meta.label}
    </span>
  );
}

export function KpiStat({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="flex min-w-0 items-start justify-between gap-3">
      <div className="min-w-0">
        <CaptionLabel>{label}</CaptionLabel>
        <div className="mt-1.5 truncate font-sans text-2xl font-semibold tabular-nums text-zinc-50">
          {value}
        </div>
        {sub ? <div className="mt-1 truncate text-xs text-zinc-400">{sub}</div> : null}
      </div>
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-cyan-300">
        <Icon className="size-4" />
      </div>
    </Card>
  );
}

export function Progress({
  value,
  label,
  className,
}: {
  value: number;
  label: string;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={className}>
      <div className="mb-1 flex items-center justify-between text-xs text-zinc-400">
        <span>{label}</span>
        <span className="tabular-nums text-zinc-300">{clamped}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
      >
        <div
          className="h-full rounded-full bg-cyan-400"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

/** Toggle-chip group used for the zone filter — plain buttons, aria-pressed. */
export function ChipToggle({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        FOCUS_RING,
        "whitespace-nowrap rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200"
          : "border-white/10 bg-transparent text-zinc-300 hover:border-white/20 hover:bg-white/5",
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Generic dropdown/popover primitive: click trigger, click outside or Escape closes. */
export function Popover({
  label,
  icon: Icon,
  align = "left",
  side = "bottom",
  panelClassName,
  triggerClassName,
  fixedHeight = true,
  showChevron = true,
  triggerLabel,
  children,
}: {
  label: ReactNode;
  icon?: ComponentType<{ className?: string }>;
  align?: "left" | "right";
  side?: "top" | "bottom";
  panelClassName?: string;
  triggerClassName?: string;
  fixedHeight?: boolean;
  showChevron?: boolean;
  /** Accessible name for the trigger button, when `label` is visual-only or an icon. */
  triggerLabel?: string;
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={triggerLabel}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          FOCUS_RING,
          "inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10",
          fixedHeight && "h-[44px] py-0",
          triggerClassName,
        )}
      >
        {Icon ? <Icon className="size-4 text-zinc-400" /> : null}
        {label}
        {showChevron ? <ChevronDown aria-hidden="true" className="size-3.5 text-zinc-500" /> : null}
      </button>
      {open ? (
        <div
          id={panelId}
          role="menu"
          className={cn(
            "absolute z-30 min-w-56 rounded-xl border border-white/10 bg-zinc-900 p-2 shadow-xl shadow-black/40",
            side === "bottom" ? "top-full mt-2" : "bottom-full mb-2",
            align === "right" ? "right-0" : "left-0",
            panelClassName,
          )}
        >
          {children(() => setOpen(false))}
        </div>
      ) : null}
    </div>
  );
}

export function Avatar({
  src,
  name,
  size = 32,
}: {
  src?: string;
  name: string;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-full bg-white/10 font-medium text-zinc-200"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </span>
  );
}
