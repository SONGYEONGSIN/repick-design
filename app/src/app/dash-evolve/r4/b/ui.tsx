"use client";

import { useEffect, useId, useRef, useState, type ComponentType, type ReactNode } from "react";
import Image from "next/image";
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

export function StatusDot({ meta, pulse = false }: { meta: StatusMeta; pulse?: boolean }) {
  return (
    <span className="relative flex size-2 shrink-0">
      {pulse ? (
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 motion-reduce:animate-none",
            meta.dot,
          )}
          aria-hidden="true"
        />
      ) : null}
      <span className={cn("relative inline-flex size-2 rounded-full", meta.dot)} aria-hidden="true" />
    </span>
  );
}

/** Toggle-chip used for status filters — plain button, aria-pressed. */
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
        "flex h-[44px] items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 text-sm font-medium transition-colors",
        active
          ? "border-violet-400/40 bg-violet-400/10 text-violet-200"
          : "border-white/10 bg-transparent text-zinc-300 hover:border-white/20 hover:bg-white/5",
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Segmented control — used for environment + time-range toggles. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: Array<{ key: T; label: string }>;
  value: T;
  onChange: (key: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex h-[44px] w-full min-w-0 items-center gap-0.5 rounded-lg border border-white/10 bg-white/5 p-1"
    >
      {options.map((opt) => {
        const active = opt.key === value;
        return (
          <button
            key={opt.key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.key)}
            className={cn(
              FOCUS_RING,
              "h-full min-w-0 flex-1 truncate rounded-md px-2 text-xs font-medium transition-colors sm:text-sm",
              active ? "bg-violet-400/15 text-violet-200" : "text-zinc-400 hover:text-zinc-200",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
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
          "inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10",
          fixedHeight && "h-[44px]",
          triggerClassName,
        )}
      >
        {Icon ? <Icon className="size-4 text-zinc-400" /> : null}
        {label}
        {showChevron ? <ChevronDown aria-hidden="true" className="size-3.5 text-zinc-400" /> : null}
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
    return (
      <Image
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
