"use client";

import type { ReactNode } from "react";
import Image from "next/image";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium leading-none ${className}`}
    >
      {children}
    </span>
  );
}

export function EyebrowLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  className = "",
  trackClassName = "bg-zinc-100",
  ariaLabel,
}: {
  value: number;
  className?: string;
  trackClassName?: string;
  ariaLabel: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full ${trackClassName}`}
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full ${className}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { id: T; label: string; icon?: React.ComponentType<{ className?: string }> }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex items-center gap-0.5 rounded-lg border border-zinc-200 bg-zinc-50 p-0.5"
    >
      {options.map((opt) => {
        const active = opt.id === value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.id)}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 ${
              active
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function IconButton({
  children,
  label,
  className = "",
  onClick,
  active = false,
}: {
  children: ReactNode;
  label: string;
  className?: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 ${
        active
          ? "border-indigo-200 bg-indigo-50 text-indigo-700"
          : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function Avatar({
  src,
  name,
  size = 20,
}: {
  src: string;
  name: string;
  size?: number;
}) {
  return (
    <Image
      src={src}
      alt=""
      title={name}
      width={size}
      height={size}
      className="shrink-0 rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  );
}

export function UnassignedAvatar({ size = 20 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className="inline-flex shrink-0 items-center justify-center rounded-full border border-dashed border-zinc-300 bg-zinc-50 text-zinc-400"
    >
      <span className="block h-1.5 w-1.5 rounded-full bg-zinc-300" />
    </span>
  );
}
