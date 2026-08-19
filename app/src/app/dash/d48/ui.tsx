"use client";

import type { LucideIcon } from "lucide-react";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import type { ServiceStatus, Tone } from "./tokens";
import { BORDER, CARD, FOCUS_VISIBLE, STATUS_LABEL, STATUS_TONE, TEXT_CAPTION, TEXT_CAPTION_MUTED, TEXT_PRIMARY, TONE, TRANSITION, cx } from "./tokens";

/* ----------------------------------------------------------------- Card */

export function Card({ children, className, padded = true, id }: { children: ReactNode; className?: string; padded?: boolean; id?: string }) {
  return (
    <div id={id} className={cx(CARD, padded && "p-4 sm:p-5", className)}>
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  description,
  action,
  Icon,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  Icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          {Icon ? <Icon size={14} aria-hidden="true" className={TEXT_CAPTION} /> : null}
          <h2 className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>{title}</h2>
        </div>
        {description ? <p className={cx("mt-0.5 text-xs", TEXT_CAPTION)}>{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function EyebrowLabel({ children, className, muted }: { children: ReactNode; className?: string; muted?: boolean }) {
  return <span className={cx("text-[11px] font-medium uppercase tracking-wider", muted ? TEXT_CAPTION_MUTED : TEXT_CAPTION, className)}>{children}</span>;
}

/* --------------------------------------------------------------- Badges */

export function Badge({ tone, Icon, children }: { tone: { text: string; bg: string; border: string }; Icon?: LucideIcon; children: ReactNode }) {
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium leading-none", tone.text, tone.bg, tone.border)}>
      {Icon ? <Icon size={12} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

const STATUS_ICON: Record<ServiceStatus, LucideIcon> = {
  operational: CheckCircle2,
  degraded: AlertTriangle,
  outage: XCircle,
};

/** Status is always color + icon + text together — never color alone. */
export function StatusBadge({ status, className }: { status: ServiceStatus; className?: string }) {
  const tone = TONE[STATUS_TONE[status]];
  const Icon = STATUS_ICON[status];
  return (
    <Badge tone={tone} Icon={Icon}>
      <span className={className}>{STATUS_LABEL[status]}</span>
    </Badge>
  );
}

/* ---------------------------------------------------------------- Dot tone */

export function ToneDot({ tone }: { tone: Tone }) {
  return <span aria-hidden="true" className={cx("inline-block h-1.5 w-1.5 shrink-0 rounded-full", TONE[tone].dot)} />;
}

/* ------------------------------------------------------------- Outside close */

export function useOutsideClose(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  return ref;
}

/* -------------------------------------------------------- Segmented control */

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { id: T; label: ReactNode }[];
  value: T;
  onChange: (id: T) => void;
  ariaLabel: string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className={cx("inline-flex flex-wrap items-center gap-0.5 rounded-lg border p-0.5", BORDER, "bg-zinc-100")}>
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.id)}
            className={cx(
              "h-9 rounded-md px-3 text-xs font-medium",
              TRANSITION,
              FOCUS_VISIBLE,
              active ? "bg-white text-zinc-900 font-semibold shadow-sm" : cx(TEXT_CAPTION_MUTED, "hover:text-zinc-900"),
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ Stat tile */

export function StatTile({
  label,
  value,
  Icon,
  focused,
  tone,
}: {
  label: string;
  value: ReactNode;
  Icon?: LucideIcon;
  focused?: boolean;
  tone?: Tone;
}) {
  return (
    <div
      className={cx(
        "rounded-xl border px-3 py-2.5",
        TRANSITION,
        focused ? "border-teal-300 bg-teal-50/70 ring-1 ring-teal-200" : cx(BORDER, "bg-zinc-50/60"),
      )}
    >
      <div className="flex items-center gap-1.5">
        {Icon ? <Icon size={12} aria-hidden="true" className={focused ? "text-teal-700" : TEXT_CAPTION} /> : null}
        <span className={cx("text-[11px] font-medium uppercase tracking-wider", focused ? "text-teal-800" : TEXT_CAPTION)}>{label}</span>
      </div>
      <p className={cx("mt-1 text-lg font-semibold tabular-nums leading-tight", tone ? TONE[tone].text : TEXT_PRIMARY)}>{value}</p>
    </div>
  );
}
