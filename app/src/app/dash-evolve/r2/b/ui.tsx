"use client";

import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown } from "lucide-react";
import { clampPercent } from "./format";
import { CHANNEL_META, PRIORITY_META, STATUS_META } from "./data";
import type { Channel, Priority, AgentStatus, SortDirection } from "./types";

/* ── Card ─────────────────────────────────────────────── */

export function Card({
  children,
  className = "",
  as = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
  "aria-labelledby"?: string;
}) {
  const Comp = as;
  return (
    <Comp
      className={`rounded-xl border border-white/10 bg-zinc-900 shadow-[0_1px_0_0_rgba(255,255,255,0.03)] ${className}`}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/* ── Section label ────────────────────────────────────── */

export function SectionLabel({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">
      {icon}
      {children}
    </span>
  );
}

/* ── Badges ───────────────────────────────────────────── */

export function Badge({
  children,
  className = "",
  icon,
}: {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] leading-4 font-medium whitespace-nowrap ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const meta = PRIORITY_META[priority];
  return (
    <Badge className={meta.badgeClass} icon={<span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} aria-hidden="true" />}>
      {meta.label}
    </Badge>
  );
}

export function ChannelBadge({ channel, compact = false }: { channel: Channel; compact?: boolean }) {
  const meta = CHANNEL_META[channel];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium whitespace-nowrap ${meta.textClass}`}>
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${meta.dotClass}`} aria-hidden="true" />
      {compact ? meta.short : meta.label}
    </span>
  );
}

export function StatusBadge({ status }: { status: AgentStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium whitespace-nowrap ${meta.textClass}`}>
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${meta.dotClass}`} aria-hidden="true" />
      {meta.label}
    </span>
  );
}

/* ── Avatar (이니셜) ──────────────────────────────────── */

const AVATAR_PALETTE = [
  "bg-indigo-500/20 text-indigo-300",
  "bg-emerald-500/20 text-emerald-300",
  "bg-amber-500/20 text-amber-300",
  "bg-violet-500/20 text-violet-300",
  "bg-sky-500/20 text-sky-300",
  "bg-rose-500/20 text-rose-300",
];

export function Avatar({ name, size = 24 }: { name: string; size?: number }) {
  const initial = name.charAt(0);
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) % AVATAR_PALETTE.length;
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-white/10 font-semibold ${AVATAR_PALETTE[hash]}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

/* ── Progress ─────────────────────────────────────────── */

export function ProgressBar({
  value,
  label,
  barClassName = "bg-sky-400",
  trackClassName = "bg-white/10",
  className = "",
}: {
  value: number;
  label: string;
  barClassName?: string;
  trackClassName?: string;
  className?: string;
}) {
  const pct = clampPercent(value);
  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full ${trackClassName} ${className}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className={`h-full rounded-full ${barClassName} motion-safe:transition-[width] motion-safe:duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ── Segmented control (기간 토글) ────────────────────── */

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex h-[36px] items-center rounded-lg border border-white/10 bg-zinc-950 p-0.5"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`h-[30px] rounded-md px-3 text-[13px] font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-950 focus-visible:outline-none ${
              active ? "bg-zinc-800 text-zinc-50 shadow-sm" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Filter chips (채널 필터 — radiogroup, 단일 선택) ──── */

export function FilterRadioGroup<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  name,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
  name: string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="flex flex-wrap items-center gap-1.5">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <label key={opt.value} className="relative">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={active}
              onChange={() => onChange(opt.value)}
              className="peer sr-only"
            />
            <span
              className={`inline-flex h-[30px] cursor-pointer items-center rounded-full border px-3 text-[13px] font-medium whitespace-nowrap transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-sky-400 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-zinc-950 ${
                active
                  ? "border-sky-400/40 bg-sky-500/15 text-sky-200"
                  : "border-white/10 bg-transparent text-zinc-400 hover:border-white/20 hover:text-zinc-200"
              }`}
            >
              {opt.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}

/* ── Card header (아이콘 + 제목 + 배지 + 펼치기 토글) ─── */

export function CardHeader({
  icon,
  title,
  titleId,
  badge,
  expandable,
  expanded,
  onToggle,
  panelId,
}: {
  icon: ReactNode;
  title: string;
  titleId: string;
  badge?: ReactNode;
  expandable?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
  panelId?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-3 sm:px-5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-zinc-400">{icon}</span>
      <h3 id={titleId} className="min-w-0 flex-1 truncate text-[13px] font-semibold text-zinc-100">
        {title}
      </h3>
      {badge}
      {expandable && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex h-8 shrink-0 items-center gap-1 rounded-md px-2 text-[12px] font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
        >
          {expanded ? "접기" : "자세히"}
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

/* ── Sortable table header button ────────────────────── */

export function SortButton({
  active,
  direction,
  onClick,
  children,
  align = "left",
}: {
  active: boolean;
  direction: SortDirection;
  onClick: () => void;
  children: ReactNode;
  align?: "left" | "right";
}) {
  const Icon = !active ? ArrowUpDown : direction === "asc" ? ArrowUp : ArrowDown;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center gap-1 rounded text-[11px] font-semibold tracking-wide text-zinc-400 uppercase transition-colors hover:text-zinc-100 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none ${
        align === "right" ? "flex-row-reverse" : ""
      } ${active ? "text-zinc-100" : ""}`}
    >
      {children}
      <Icon className={`h-3 w-3 shrink-0 ${active ? "text-sky-400" : "text-zinc-600 group-hover:text-zinc-400"}`} aria-hidden="true" />
    </button>
  );
}
