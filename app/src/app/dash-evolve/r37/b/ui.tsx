"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import type { VendorStatus } from "./data";
import { STATUS_LABEL } from "./data";

/* ---------------------------------------------------------------------- */
/* SegmentedControl                                                        */
/* ---------------------------------------------------------------------- */

interface SegmentedControlProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  getLabel: (option: T) => string;
  ariaLabel: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  getLabel,
  ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex flex-wrap items-center gap-1 rounded-lg border border-white/10 bg-zinc-900 p-1"
    >
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option)}
            className={
              "rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 " +
              (active
                ? "bg-indigo-500/15 text-indigo-300"
                : "text-zinc-400 hover:text-zinc-50")
            }
          >
            {getLabel(option)}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* StatusBadge — icon + text, never color alone                           */
/* ---------------------------------------------------------------------- */

const STATUS_ICON: Record<VendorStatus, typeof CheckCircle2> = {
  active: CheckCircle2,
  "renewal-due": Clock,
  expired: XCircle,
};

export function StatusBadge({ status }: { status: VendorStatus }) {
  const Icon = STATUS_ICON[status];
  const isActive = status === "active";
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-medium whitespace-nowrap " +
        (isActive
          ? "border-indigo-400/30 bg-indigo-500/10 text-indigo-300"
          : "border-white/10 bg-white/5 text-zinc-300")
      }
    >
      <Icon className="size-3.5 shrink-0" aria-hidden="true" />
      {STATUS_LABEL[status]}
    </span>
  );
}

/* ---------------------------------------------------------------------- */
/* Popover — click-triggered dropdown used for workspace / account menus  */
/* ---------------------------------------------------------------------- */

interface PopoverProps {
  trigger: (props: {
    ref: React.RefObject<HTMLButtonElement | null>;
    onClick: () => void;
    open: boolean;
  }) => React.ReactNode;
  children: (close: () => void) => React.ReactNode;
  align?: "left" | "right";
  panelLabel: string;
}

export function Popover({ trigger, children, align = "left", panelLabel }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      setOpen(false);
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
    <div className="relative">
      {trigger({ ref: triggerRef, onClick: () => setOpen((v) => !v), open })}
      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="menu"
          aria-label={panelLabel}
          className={
            "absolute top-full z-40 mt-2 w-60 rounded-lg border border-white/10 bg-zinc-900 p-1.5 shadow-lg shadow-black/40 " +
            (align === "right" ? "right-0" : "left-0")
          }
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

export function PopoverItem({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
    >
      {children}
    </button>
  );
}
