"use client";

import { ReactNode, RefObject, useEffect, useId, useRef } from "react";
import { AlertTriangle, ArrowUpCircle, CheckCircle2 } from "lucide-react";
import { round2 } from "./stats";
import { ACCENT, CARD, FOCUS_RING, INFO, TEXT, WARN } from "./tokens";

/* ───────────────────────── Card ───────────────────────── */

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`${CARD} ${className}`}>{children}</div>;
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 pt-5">
      <div className="min-w-0">
        <h2 className={`text-sm font-semibold ${TEXT.primary}`}>{title}</h2>
        {subtitle ? <p className={`mt-0.5 text-xs ${TEXT.muted}`}>{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* ───────────────────────── VisuallyHidden ───────────────────────── */

export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

/* ───────────────────────── Badge ───────────────────────── */

export type StatusVariant = "resolved" | "breached" | "escalated";

const STATUS_CONFIG: Record<StatusVariant, { label: string; icon: typeof CheckCircle2; classes: string }> = {
  resolved: {
    label: "On track",
    icon: CheckCircle2,
    classes: `${ACCENT.text} ${ACCENT.bgSoft} border ${ACCENT.borderSoft}`,
  },
  breached: {
    label: "Breached SLA",
    icon: AlertTriangle,
    // dashed border is the non-color cue: shape differs, not just hue, from "resolved".
    classes: `${WARN.text} ${WARN.bgSoft} border border-dashed ${WARN.borderSoft}`,
  },
  escalated: {
    label: "Escalated",
    icon: ArrowUpCircle,
    classes: `${INFO.text} ${INFO.bgSoft} border ${INFO.borderSoft}`,
  },
};

export function StatusBadge({ status }: { status: StatusVariant }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${config.classes}`}>
      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

export function TeamTag({ children }: { children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium ${TEXT.secondary}`}>
      {children}
    </span>
  );
}

/* ───────────────────────── SegmentedControl ───────────────────────── */

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  ariaLabel: string;
}) {
  return (
    <div role="group" aria-label={ariaLabel} className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-zinc-950/60 p-1">
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.id)}
            className={`min-h-[28px] rounded-md px-3 py-1 text-xs font-medium transition-colors ${FOCUS_RING} ${
              active ? `${ACCENT.bgSoft} ${ACCENT.text}` : `${TEXT.muted} hover:text-zinc-50`
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ───────────────────────── Tabs ───────────────────────── */

export function Tabs({
  tabs,
  value,
  onChange,
  ariaLabel,
}: {
  tabs: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  ariaLabel: string;
}) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="flex items-center gap-4 border-b border-white/10 px-5">
      {tabs.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={`relative py-2.5 text-xs font-medium hover:text-zinc-50 ${FOCUS_RING} ${active ? TEXT.primary : TEXT.muted}`}
          >
            {tab.label}
            {active ? <span className={`absolute inset-x-0 -bottom-px h-0.5 ${ACCENT.fill}`} /> : null}
          </button>
        );
      })}
    </div>
  );
}

/* ───────────────────────── Progress ───────────────────────── */

export function Progress({ value, label }: { value: number; label: string }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className={`text-xs ${TEXT.muted}`}>{label}</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10"
      >
        <div className={`h-full rounded-full ${ACCENT.fill}`} style={{ width: `${round2(clamped)}%` }} />
      </div>
    </div>
  );
}

/* ───────────────────────── Sparkline ───────────────────────── */

export function Sparkline({ values, width = 108, height = 28 }: { values: number[]; width?: number; height?: number }) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = Math.max(max - min, 1);
  const pad = 2;
  const points = values.map((v, i) => {
    const x = values.length === 1 ? pad : pad + (i / (values.length - 1)) * (width - pad * 2);
    const y = height - pad - ((v - min) / span) * (height - pad * 2);
    return `${round2(x)},${round2(y)}`;
  });
  const lastPoint = points[points.length - 1].split(",").map(Number);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Ticket volume trend, last four days">
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="currentColor"
        className={ACCENT.text}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={round2(lastPoint[0])} cy={round2(lastPoint[1])} r={2} className={ACCENT.text} fill="currentColor" />
    </svg>
  );
}

/* ───────────────────────── Popover (dropdown shell) ───────────────────────── */

export function Popover({
  open,
  onClose,
  anchorRef,
  align = "end",
  children,
  label,
}: {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  align?: "start" | "end";
  children: ReactNode;
  label: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      onClose();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      id={id}
      role="menu"
      aria-label={label}
      className={`absolute z-30 mt-2 w-64 rounded-xl border border-white/10 bg-zinc-900 p-1.5 shadow-xl shadow-black/40 ${
        align === "end" ? "right-0" : "left-0"
      }`}
    >
      {children}
    </div>
  );
}

export function PopoverItem({ children, onClick, icon: Icon }: { children: ReactNode; onClick?: () => void; icon?: typeof CheckCircle2 }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm hover:bg-white/5 hover:text-zinc-50 ${FOCUS_RING} ${TEXT.secondary}`}
    >
      {Icon ? <Icon aria-hidden="true" className="h-4 w-4" /> : null}
      {children}
    </button>
  );
}
