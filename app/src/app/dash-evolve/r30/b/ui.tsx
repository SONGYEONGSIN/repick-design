"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import {
  Siren,
  TriangleAlert,
  CircleAlert,
  Circle,
  Clock,
  CircleCheck,
  OctagonAlert,
  UserRound,
} from "lucide-react";
import { SEVERITY_META, formatMinutes, slaFor, type Incident, type Severity, type SlaState } from "./data";

/** Explicit, directly-specified focus treatment — never relies on ring utilities alone, and
 * nothing upstream sets `outline-none` on these elements or their ancestors. */
export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 focus-visible:rounded-md";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-white/10 bg-zinc-900 ${className}`}>
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">{children}</p>;
}

export function Avatar({ initials, size = 26 }: { initials: string | null; size?: number }) {
  if (!initials) {
    return (
      <span
        aria-hidden="true"
        className="flex shrink-0 items-center justify-center rounded-full border border-dashed border-white/15 bg-white/[0.03] text-zinc-400"
        style={{ width: size, height: size }}
      >
        <UserRound style={{ width: size * 0.55, height: size * 0.55 }} />
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-full bg-emerald-500/15 font-medium text-emerald-300"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </span>
  );
}

// ---------------------------------------------------------------------------------------
// Severity badge
// ---------------------------------------------------------------------------------------

const SEVERITY_ICON: Record<Severity, typeof Siren> = {
  sev1: Siren,
  sev2: TriangleAlert,
  sev3: CircleAlert,
  sev4: Circle,
};

const SEVERITY_TONE: Record<Severity, string> = {
  sev1: "border-red-500/25 bg-red-500/10 text-red-400",
  sev2: "border-orange-500/25 bg-orange-500/10 text-orange-400",
  sev3: "border-amber-500/25 bg-amber-500/10 text-amber-400",
  sev4: "border-white/10 bg-white/5 text-zinc-300",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  const Icon = SEVERITY_ICON[severity];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium tabular-nums ${SEVERITY_TONE[severity]}`}
    >
      <Icon aria-hidden="true" className="h-3 w-3 shrink-0" />
      {SEVERITY_META[severity].label}
    </span>
  );
}

// ---------------------------------------------------------------------------------------
// SLA pill — reads the shared slaFor() so the board, the list and the inspector strip can
// never disagree about an incident's SLA state.
// ---------------------------------------------------------------------------------------

const SLA_TONE: Record<SlaState, string> = {
  "on-track": "text-emerald-400",
  met: "text-emerald-400",
  "at-risk": "text-amber-400",
  breached: "text-red-400",
  missed: "text-red-400",
};

const SLA_ICON: Record<SlaState, typeof Clock> = {
  "on-track": Clock,
  met: CircleCheck,
  "at-risk": TriangleAlert,
  breached: OctagonAlert,
  missed: OctagonAlert,
};

export function slaDisplay(incident: Incident): { label: string; sub: string; state: SlaState } {
  const info = slaFor(incident);
  const isResolved = incident.column === "resolved";
  if (isResolved) {
    return info.state === "met"
      ? { label: "SLA met", sub: `resolved in ${formatMinutes(info.minutes)}`, state: info.state }
      : { label: "SLA missed", sub: `took ${formatMinutes(info.minutes)}`, state: info.state };
  }
  if (info.state === "breached") {
    return { label: "Breached", sub: `${formatMinutes(info.minutes)} over`, state: info.state };
  }
  if (info.state === "at-risk") {
    return { label: "At risk", sub: `${formatMinutes(info.minutes)} left`, state: info.state };
  }
  return { label: "On track", sub: `${formatMinutes(info.minutes)} left`, state: info.state };
}

/**
 * Two stacked lines rather than one long "label · detail" run — the board's columns are only
 * ~180px wide at the narrowest tested desktop width, and a single-line pill with the full
 * sentence has no room left to truncate gracefully once it's flexed inside a row with other
 * content. Stacking keeps every character legible at every width this ships to.
 */
export function SlaPill({ incident }: { incident: Incident }) {
  const d = slaDisplay(incident);
  const Icon = SLA_ICON[d.state];
  return (
    <span className={`block min-w-0 ${SLA_TONE[d.state]}`}>
      <span className="flex items-center gap-1 text-[11px] font-medium">
        <Icon aria-hidden="true" className="h-3 w-3 shrink-0" />
        <span className="min-w-0 truncate">{d.label}</span>
      </span>
      <span className="mt-0.5 block truncate text-[10px] tabular-nums text-zinc-400">{d.sub}</span>
    </span>
  );
}

// ---------------------------------------------------------------------------------------
// Sparkline with keyboard- and pointer-reachable crosshair. The SVG itself is decorative
// (aria-hidden); a sr-only sentence carries the full series to assistive tech up front, and
// the visible numeric readout below the graphic always shows a value — the current reading
// at rest, the scrubbed reading while hovering or arrow-keying through the button.
// ---------------------------------------------------------------------------------------

export function Sparkline({
  data, label, unit = "/min", width = 100, height = 30,
}: { data: number[]; label: string; unit?: string; width?: number; height?: number }) {
  const wrapRef = useRef<HTMLButtonElement>(null);
  const lastIndex = data.length - 1;
  const [activeIndex, setActiveIndex] = useState(lastIndex);

  const { points, coords, min, max } = useMemo(() => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const span = max - min || 1;
    const padY = 3;
    const coords = data.map((v, i) => {
      const x = (i / lastIndex) * width;
      const y = height - padY - ((v - min) / span) * (height - padY * 2);
      return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 };
    });
    const points = coords.map((c) => `${c.x},${c.y}`).join(" ");
    return { points, coords, min, max };
  }, [data, height, width, lastIndex]);

  function indexFromClientX(clientX: number) {
    const el = wrapRef.current;
    if (!el) return activeIndex;
    const rect = el.getBoundingClientRect();
    const frac = rect.width > 0 ? (clientX - rect.left) / rect.width : 0;
    return Math.min(lastIndex, Math.max(0, Math.round(frac * lastIndex)));
  }

  const minutesAgo = (6 - activeIndex) * 5;
  const timeLabel = minutesAgo === 0 ? "now" : `-${minutesAgo}m`;
  const active = coords[activeIndex];

  return (
    <button
      type="button"
      ref={wrapRef}
      onMouseMove={(e) => setActiveIndex(indexFromClientX(e.clientX))}
      onMouseLeave={() => setActiveIndex(lastIndex)}
      onFocus={() => setActiveIndex(lastIndex)}
      onBlur={() => setActiveIndex(lastIndex)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          setActiveIndex((i) => Math.max(0, i - 1));
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          setActiveIndex((i) => Math.min(lastIndex, i + 1));
        }
      }}
      className={`block w-full rounded-md text-left ${FOCUS_RING}`}
    >
      <span className="sr-only">
        {label}: {data.join(", ")} {unit}, scrub with the left and right arrow keys.
      </span>
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-[30px] w-full overflow-visible"
      >
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-emerald-400/70"
        />
        {active && (
          <>
            <line x1={active.x} x2={active.x} y1={0} y2={height} stroke="currentColor" strokeWidth="1" className="text-white/15" />
            <circle cx={active.x} cy={active.y} r="2.2" fill="currentColor" className="text-emerald-300" />
          </>
        )}
      </svg>
      <span aria-hidden="true" className="mt-0.5 flex items-baseline justify-between text-[10px] tabular-nums text-zinc-400">
        <span>{timeLabel}</span>
        <span className="font-medium text-zinc-300">
          {data[activeIndex]} {unit}
        </span>
      </span>
      <span className="sr-only">
        Range {min} to {max} {unit}.
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------------------
// Filter chip
// ---------------------------------------------------------------------------------------

export function Chip({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-8 items-center gap-1 whitespace-nowrap rounded-full border px-3 text-xs font-medium transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
        active
          ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-300"
          : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.07] hover:text-zinc-200"
      }`}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------------------
// Generic segmented control
// ---------------------------------------------------------------------------------------

export function Segmented<T extends string>({
  value, onChange, options, label,
}: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; label: string }) {
  return (
    <div role="group" aria-label={label} className="inline-flex h-8 overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
          className={`h-full px-3 text-xs font-medium transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
            value === opt.value ? "bg-emerald-500/20 text-emerald-300" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
