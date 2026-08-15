"use client";

import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { BORDER, CARD, FOCUS_RING, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

/* ----------------------------------------------------------------- Card */

export function Card({
  children,
  className,
  padded = true,
  as: Tag = "div",
  ariaLabelledBy,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  as?: "div" | "section";
  ariaLabelledBy?: string;
}) {
  return (
    <Tag className={cx(CARD, padded && "p-4 sm:p-5", className)} aria-labelledby={ariaLabelledBy}>
      {children}
    </Tag>
  );
}

export function CardHeader({
  title,
  titleId,
  description,
  action,
  as: Tag = "h2",
  Icon,
}: {
  title: ReactNode;
  titleId?: string;
  description?: ReactNode;
  action?: ReactNode;
  as?: "h2" | "h3";
  Icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          {Icon ? <Icon size={14} aria-hidden="true" className={TEXT_CAPTION} /> : null}
          <Tag id={titleId} className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>
            {title}
          </Tag>
        </div>
        {description ? <p className={cx("mt-0.5 text-xs", TEXT_CAPTION)}>{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function EyebrowLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx("text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION, className)}>{children}</span>;
}

/* --------------------------------------------------------------- Badges */

export function StatusBadge({
  tone,
  Icon,
  children,
  className,
}: {
  tone: { text: string; bg: string; border: string };
  Icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[11px] font-medium leading-none", tone.text, tone.bg, tone.border, className)}>
      {Icon ? <Icon size={11} aria-hidden="true" className="shrink-0" /> : null}
      <span className="truncate">{children}</span>
    </span>
  );
}

/* --------------------------------------------------------------- Avatar */

export function Avatar({ avatarId, name, size = 28 }: { avatarId: string; name: string; size?: number }) {
  return (
    <Image
      src={`https://images.unsplash.com/photo-${avatarId}?w=${size * 2}&h=${size * 2}&fit=crop&crop=faces`}
      alt={`${name} profile photo`}
      width={size}
      height={size}
      className="shrink-0 rounded-full border border-zinc-200 object-cover"
      style={{ width: size, height: size }}
    />
  );
}

/* ------------------------------------------------------------- Dropdown */

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
  options: { id: T; label: string; Icon?: LucideIcon }[];
  value: T;
  onChange: (id: T) => void;
  ariaLabel: string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className={cx("inline-flex items-center gap-0.5 rounded-lg border p-0.5", BORDER, "bg-zinc-50")}>
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
              "flex h-9 items-center gap-1.5 rounded-md px-3 text-xs font-medium",
              TRANSITION,
              FOCUS_RING,
              active ? cx(CARD, TEXT_PRIMARY, "font-semibold") : cx(TEXT_CAPTION, "hover:text-zinc-900"),
            )}
          >
            {opt.Icon ? <opt.Icon size={13} aria-hidden="true" /> : null}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------- Stat (dl) */

export function StatItem({ Icon, label, value, valueClassName }: { Icon: LucideIcon; label: string; value: ReactNode; valueClassName?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className={cx("flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide", TEXT_CAPTION)}>
        <Icon size={13} aria-hidden="true" className="shrink-0" />
        {label}
      </dt>
      <dd className={cx("text-xl font-semibold tabular-nums sm:text-2xl", TEXT_PRIMARY, valueClassName)}>{value}</dd>
    </div>
  );
}
