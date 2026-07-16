"use client";

import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import type { ReactNode } from "react";
import { round2 } from "../lib/format";

// ── Card ────────────────────────────────────────────────────────────
export function Card({
  children,
  className = "",
  as: Tag = "section",
  id,
  highlighted = false,
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div";
  id?: string;
  highlighted?: boolean;
}) {
  return (
    <Tag
      id={id}
      className={`scroll-mt-28 rounded-xl border bg-white shadow-sm transition-colors motion-reduce:transition-none ${
        highlighted ? "border-indigo-300 ring-2 ring-indigo-500 ring-offset-2 ring-offset-zinc-50" : "border-zinc-200"
      } ${className}`}
    >
      {children}
    </Tag>
  );
}

// ── 섹션 레이블 (11px uppercase tracking 통일) ─────────────────────
export function SectionLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`text-[11px] font-semibold uppercase tracking-wide text-zinc-500 ${className}`}>
      {children}
    </span>
  );
}

// ── 위젯 헤더 (제목 + 부제 + 우측 슬롯) ──────────────────────────────
export function WidgetHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p> : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

// ── 델타 배지 (색+아이콘+텍스트 병행) ────────────────────────────────
export function DeltaPill({ value, invert = false }: { value: number; invert?: boolean }) {
  const isFlat = Math.abs(value) < 0.05;
  const isGood = invert ? value <= 0 : value >= 0;
  const Icon = isFlat ? Minus : value > 0 ? ArrowUp : ArrowDown;
  const toneClass = isFlat ? "text-zinc-500" : isGood ? "text-emerald-700" : "text-rose-700";
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium tabular-nums ${toneClass}`}>
      <Icon className="size-3" aria-hidden="true" />
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}

// ── 세그먼트 컨트롤 (radiogroup) ─────────────────────────────────────
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="inline-flex w-full items-center rounded-lg border border-zinc-200 bg-zinc-50 p-0.5">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          role="radio"
          aria-checked={value === opt.id}
          onClick={() => onChange(opt.id)}
          className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
            value === opt.id ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── 스파크라인 (선형 보간, 좌표 소수 2자리 반올림) ──────────────────
export function Sparkline({
  points,
  width = 96,
  height = 30,
  className = "",
}: {
  points: number[];
  width?: number;
  height?: number;
  className?: string;
}) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = points.length > 1 ? width / (points.length - 1) : 0;

  const coords = points.map((p, i) => {
    const x = round2(i * step);
    const y = round2(height - ((p - min) / range) * height);
    return `${x},${y}`;
  });

  const last = points[points.length - 1];
  const lastY = round2(height - ((last - min) / range) * height);
  const lastX = round2((points.length - 1) * step);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className={className} role="img" aria-hidden="true">
      <polyline points={coords.join(" ")} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lastX} cy={lastY} r="2" fill="currentColor" />
    </svg>
  );
}
