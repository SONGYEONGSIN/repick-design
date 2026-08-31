import Image from "next/image";
import { PauseCircle, PlayCircle, FilePen } from "lucide-react";
import type { FlagStatus } from "./data";

/** Shared card shell — one radius/border/shadow/padding contract used everywhere on this page. */
export function Card({
  children,
  className = "",
  padded = true,
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-zinc-900/60 shadow-[0_1px_0_0_rgba(255,255,255,0.03)] ${
        padded ? "p-5" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

const STATUS_STYLE: Record<FlagStatus, { label: string; cls: string; Icon: typeof PlayCircle }> = {
  active: { label: "Active", cls: "bg-emerald-400/10 text-emerald-300 ring-1 ring-inset ring-emerald-400/20", Icon: PlayCircle },
  paused: { label: "Paused", cls: "bg-orange-400/10 text-orange-300 ring-1 ring-inset ring-orange-400/20", Icon: PauseCircle },
  draft: { label: "Draft", cls: "bg-white/5 text-zinc-400 ring-1 ring-inset ring-white/10", Icon: FilePen },
};

export function StatusBadge({ status }: { status: FlagStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${s.cls}`}>
      <s.Icon className="size-3" aria-hidden="true" />
      {s.label}
    </span>
  );
}

export function ProgressBar({
  value,
  max = 100,
  label,
  className = "",
  trackClassName = "bg-white/10",
  barClassName = "bg-sky-400",
}: {
  value: number;
  max?: number;
  label: string;
  className?: string;
  trackClassName?: string;
  barClassName?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={`h-1.5 w-full overflow-hidden rounded-full ${trackClassName} ${className}`}
    >
      <div
        className={`h-full w-full origin-left rounded-full ${barClassName} transition-transform duration-200 ease-out motion-reduce:transition-none`}
        style={{ transform: `scaleX(${Math.round(pct) / 100})` }}
      />
    </div>
  );
}

/** Deterministic inline sparkline — 14 fixed data points, coordinates rounded to 2 decimals. */
export function Sparkline({ points, width = 64, height = 20 }: { points: number[]; width?: number; height?: number }) {
  const max = 100;
  const step = width / (points.length - 1);
  const coords = points.map((p, i) => {
    const x = Math.round(i * step * 100) / 100;
    const y = Math.round((height - (p / max) * height) * 100) / 100;
    return `${x},${y}`;
  });
  const last = points[points.length - 1];
  const lastX = Math.round((points.length - 1) * step * 100) / 100;
  const lastY = Math.round((height - (last / max) * height) * 100) / 100;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" className="shrink-0 overflow-visible">
      <polyline points={coords.join(" ")} fill="none" stroke="currentColor" strokeWidth={1.5} className="text-zinc-400" />
      <circle cx={lastX} cy={lastY} r={1.8} className="fill-sky-400" />
    </svg>
  );
}

export function OwnerAvatar({ name, seed, size = 24 }: { name: string; seed: string; size?: number }) {
  return (
    <Image
      src={`https://picsum.photos/seed/${seed}/${size * 2}/${size * 2}`}
      alt={`${name} avatar`}
      width={size}
      height={size}
      className="shrink-0 rounded-full border border-white/10"
    />
  );
}
