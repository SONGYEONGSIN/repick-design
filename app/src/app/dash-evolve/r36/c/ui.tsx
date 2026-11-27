"use client";

import type { LucideIcon } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { ACCENT_SOLID, BORDER, CARD, CHANNEL_HEX, FOCUS, INSET_BG, TEXT_DIM, TEXT_PRIMARY, TRANSITION, type ChannelId, type MarkerShape, cx, r2 } from "./tokens";

export function Card({ children, className, padded = true, id }: { children: ReactNode; className?: string; padded?: boolean; id?: string }) {
  return (
    <section id={id} className={cx(CARD, padded && "p-4 sm:p-5", className)}>
      {children}
    </section>
  );
}

export function CardHead({ title, hint, action, Icon }: { title: ReactNode; hint?: ReactNode; action?: ReactNode; Icon?: LucideIcon }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          {Icon ? <Icon size={14} aria-hidden="true" className={TEXT_DIM} /> : null}
          <h2 className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>{title}</h2>
        </div>
        {hint ? <p className={cx("mt-1 text-xs font-normal leading-relaxed", TEXT_DIM)}>{hint}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Eyebrow({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <span className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_DIM, className)} style={style}>
      {children}
    </span>
  );
}

const ACCENT_SUBTLE_BG = "border border-orange-400/25 bg-orange-400/15 text-orange-300";

/** Initials badge used in place of a photographic avatar — this console needs no
 * real photos, so there is no image host to depend on at all. */
export function InitialsAvatar({ name, size = 32, className }: { name: string; size?: number; className?: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.36)) }}
      className={cx("grid shrink-0 place-items-center rounded-full font-semibold", ACCENT_SUBTLE_BG, className)}
    >
      {initials}
    </span>
  );
}

export function Segmented<T extends string>({ options, value, onChange, ariaLabel }: { options: { id: T; label: string }[]; value: T; onChange: (id: T) => void; ariaLabel: string }) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className={cx("inline-flex flex-wrap items-center gap-0.5 rounded-xl border p-0.5", BORDER, INSET_BG)}>
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
              "h-9 rounded-lg px-3 text-xs",
              TRANSITION,
              FOCUS,
              active ? cx(ACCENT_SOLID, "font-semibold") : cx("font-medium", TEXT_DIM, "hover:bg-white/5 hover:text-zinc-50"),
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

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

/** Three equally-spaced vertices around (cx,cy), point-up — the only trig in this
 * route's marker geometry, rounded to 2dp like every other SVG coordinate here. */
function trianglePoints(cx: number, cy: number, r: number): string {
  const angles = [-Math.PI / 2, -Math.PI / 2 + (2 * Math.PI) / 3, -Math.PI / 2 + (4 * Math.PI) / 3];
  return angles.map((a) => `${r2(cx + r * Math.cos(a))},${r2(cy + r * Math.sin(a))}`).join(" ");
}

/**
 * The non-color-only cue for channel grouping. Every shape is built from the same
 * characteristic radius `r` so bubble SIZE (the third encoded variable) reads
 * consistently whichever shape it is drawn in.
 */
export function ShapeMark({
  shape,
  cx: x,
  cy: y,
  r,
  fill,
  fillOpacity = 1,
  stroke,
  strokeWidth = 0,
}: {
  shape: MarkerShape;
  cx: number;
  cy: number;
  r: number;
  fill: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
}) {
  const common = { fill, fillOpacity, stroke, strokeWidth: strokeWidth || undefined };
  if (shape === "circle") return <circle cx={x} cy={y} r={r} {...common} />;
  if (shape === "square") {
    const a = r2(r * 0.88);
    return <rect x={r2(x - a)} y={r2(y - a)} width={r2(a * 2)} height={r2(a * 2)} rx={r2(a * 0.2)} {...common} />;
  }
  if (shape === "diamond") {
    const pts = `${x},${r2(y - r)} ${r2(x + r)},${y} ${x},${r2(y + r)} ${r2(x - r)},${y}`;
    return <polygon points={pts} {...common} />;
  }
  if (shape === "triangle") {
    return <polygon points={trianglePoints(x, y, r2(r * 1.08))} strokeLinejoin="round" {...common} />;
  }
  const barHalfThick = r2(r * 0.32);
  const barHalfLen = r2(r * 1.05);
  return (
    <g>
      <rect x={r2(x - barHalfLen)} y={r2(y - barHalfThick)} width={r2(barHalfLen * 2)} height={r2(barHalfThick * 2)} rx={r2(barHalfThick * 0.4)} {...common} />
      <rect x={r2(x - barHalfThick)} y={r2(y - barHalfLen)} width={r2(barHalfThick * 2)} height={r2(barHalfLen * 2)} rx={r2(barHalfThick * 0.4)} {...common} />
    </g>
  );
}

/** Small standalone glyph reused in the filter rail and the data table's channel
 * column — same shape vocabulary as the chart markers. */
export function ChannelGlyph({ channel, shape, size = 14, dim = false }: { channel: ChannelId; shape: MarkerShape; size?: number; dim?: boolean }) {
  const color = dim ? "#71717a" : CHANNEL_HEX[channel];
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true" className="shrink-0">
      <ShapeMark shape={shape} cx={10} cy={10} r={7.2} fill={color} fillOpacity={dim ? 0.55 : 0.92} stroke={color} strokeWidth={dim ? 0 : 1} />
    </svg>
  );
}
