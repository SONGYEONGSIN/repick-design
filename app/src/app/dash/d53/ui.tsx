"use client";

import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, CircleDot, Clock3 } from "lucide-react";
import type { CasePriority, CaseStatus } from "./data";
import { priorityLabel, statusLabel } from "./data";

// Standard focus-visible treatment used on every interactive element in this piece.
// Deliberately CSS `outline` (not `ring-*`/`ring-offset-*`, which can render as fully
// transparent under Tailwind v4's box-shadow-based ring implementation) so it always paints.
export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
      {children}
    </span>
  );
}

const STATUS_STYLE: Record<CaseStatus, { cls: string; Icon: typeof CircleDot }> = {
  open: { cls: "bg-sky-50 text-sky-700 border-sky-200", Icon: CircleDot },
  pending: { cls: "bg-amber-50 text-amber-800 border-amber-200", Icon: Clock3 },
  resolved: { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", Icon: CheckCircle2 },
};

export function StatusBadge({ status }: { status: CaseStatus }) {
  const { cls, Icon } = STATUS_STYLE[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${cls}`}>
      <Icon className="size-3" aria-hidden="true" strokeWidth={2.5} />
      {statusLabel(status)}
    </span>
  );
}

const PRIORITY_STYLE: Record<CasePriority, string> = {
  urgent: "bg-red-50 text-red-700 border-red-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  normal: "bg-zinc-100 text-zinc-600 border-zinc-200",
  low: "bg-zinc-50 text-zinc-500 border-zinc-200",
};

export function PriorityBadge({ priority }: { priority: CasePriority }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${PRIORITY_STYLE[priority]}`}>
      {priority === "urgent" && <AlertTriangle className="size-3" aria-hidden="true" strokeWidth={2.5} />}
      {priorityLabel(priority)}
    </span>
  );
}

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: SegmentOption<T>[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex items-center gap-0.5 rounded-lg border border-zinc-200 bg-zinc-100 p-0.5"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${FOCUS_RING} ${
              active ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function DropdownMenu({
  label,
  triggerContent,
  triggerClassName,
  align = "left",
  openUp = false,
  // Set when `triggerContent` already renders real, informative visible text (e.g. the
  // current user's name) — in that case an `aria-label` override on the button would
  // conflict with that visible text (axe `label-content-name-mismatch`), so the button's
  // accessible name is instead left to derive from its own content. `aria-haspopup="menu"`
  // already tells assistive tech this opens a menu, so the word "menu" isn't required in
  // the name. The `label` is still used for the open panel's `aria-label`, which has no
  // conflicting visible text of its own.
  useContentAsLabel = false,
  children,
}: {
  label: string;
  triggerContent: ReactNode;
  triggerClassName?: string;
  align?: "left" | "right";
  openUp?: boolean;
  useContentAsLabel?: boolean;
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={useContentAsLabel ? undefined : label}
        onClick={() => setOpen((v) => !v)}
        className={
          triggerClassName ??
          `inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 ${FOCUS_RING}`
        }
      >
        {triggerContent}
      </button>
      {open && (
        <div
          role="menu"
          aria-label={label}
          className={`absolute z-30 min-w-[13rem] overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-lg ${
            openUp ? "bottom-full mb-1.5" : "top-full mt-1.5"
          } ${align === "right" ? "right-0" : "left-0"}`}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

export function MenuItem({
  children,
  onClick,
  icon: Icon,
  danger,
}: {
  children: ReactNode;
  onClick?: () => void;
  icon?: ComponentType<{ className?: string }>;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${
        danger ? "text-red-600 hover:bg-red-50" : "text-zinc-700 hover:bg-zinc-50"
      } ${FOCUS_RING}`}
    >
      {Icon && <Icon className="size-4" aria-hidden="true" />}
      {children}
    </button>
  );
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) confirmRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4"
      onClick={onCancel}
      onKeyDown={(e) => {
        if (e.key === "Escape") onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p id="confirm-dialog-title" className="text-sm font-semibold text-zinc-900">
          {title}
        </p>
        <p id="confirm-dialog-desc" className="mt-1.5 text-sm text-zinc-600">
          {description}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className={`rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className={`rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 ${FOCUS_RING}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function HealthDot({ health }: { health: "good" | "watch" | "at-risk" }) {
  const cls =
    health === "good" ? "bg-emerald-500" : health === "watch" ? "bg-amber-500" : "bg-red-500";
  const label = health === "good" ? "Healthy" : health === "watch" ? "Watch" : "At risk";
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600">
      <span className={`size-1.5 rounded-full ${cls}`} aria-hidden="true" />
      {label}
    </span>
  );
}
