"use client";

import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Circle,
  Handshake,
  Minus,
  Search,
  Send,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import type { Priority, StageId } from "../lib/data";

// ── Card ────────────────────────────────────────────────────────────
export function Card({
  children,
  className = "",
  as: Tag = "section",
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "aside";
}) {
  return <Tag className={`rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`}>{children}</Tag>;
}

// ── 섹션 레이블 (11px uppercase tracking 통일) ─────────────────────
export function SectionLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`text-[11px] font-semibold uppercase tracking-wide text-zinc-500 ${className}`}>
      {children}
    </span>
  );
}

// ── 회사 이니셜 마크 (결정론적 색상 배정 — 이름 문자코드 합 기반) ───
const MARK_PALETTE = [
  "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  "bg-blue-50 text-blue-700 ring-blue-600/20",
  "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "bg-amber-50 text-amber-700 ring-amber-600/20",
  "bg-rose-50 text-rose-700 ring-rose-600/20",
  "bg-violet-50 text-violet-700 ring-violet-600/20",
];

function markToneFor(name: string): string {
  const sum = Array.from(name).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return MARK_PALETTE[sum % MARK_PALETTE.length];
}

export function CompanyMark({ name }: { name: string }) {
  const initial = name.charAt(0);
  return (
    <span
      className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ring-1 ring-inset ${markToneFor(name)}`}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

// ── 우선순위 배지 (색+아이콘+텍스트 병행, 색만으로 구분 금지) ───────
const PRIORITY_META: Record<Priority, { label: string; Icon: LucideIcon; className: string }> = {
  high: {
    label: "높음",
    Icon: ArrowUp,
    className: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20",
  },
  medium: {
    label: "보통",
    Icon: Minus,
    className: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
  },
  low: {
    label: "낮음",
    Icon: ArrowDown,
    className: "bg-zinc-100 text-zinc-600 ring-1 ring-inset ring-zinc-400/20",
  },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const meta = PRIORITY_META[priority];
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ${meta.className}`}
    >
      <meta.Icon className="size-3" aria-hidden="true" />
      {meta.label}
    </span>
  );
}

// ── 파이프라인 단계 배지 (드로어·헤더용) ─────────────────────────────
const STAGE_META: Record<StageId, { Icon: LucideIcon; className: string }> = {
  new: { Icon: Circle, className: "bg-zinc-100 text-zinc-600 ring-1 ring-inset ring-zinc-400/20" },
  qualifying: { Icon: Search, className: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20" },
  proposal: { Icon: Send, className: "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-600/20" },
  negotiation: { Icon: Handshake, className: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20" },
  won: { Icon: CheckCircle2, className: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20" },
};

export function StageBadge({ stage, label }: { stage: StageId; label: string }) {
  const meta = STAGE_META[stage];
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ${meta.className}`}
    >
      <meta.Icon className="size-3" aria-hidden="true" />
      {label}
    </span>
  );
}

// ── 확률 프로그레스 바 (수치를 함께 표기 — 색만으로 구분하지 않음) ──
export function ProbabilityBar({ value }: { value: number }) {
  const fillClass = value >= 100 ? "bg-emerald-500" : value >= 60 ? "bg-indigo-600" : "bg-indigo-400";
  return (
    <div className="flex items-center gap-2">
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`성사 확률 ${value}%`}
        className="h-1.5 w-full min-w-[36px] overflow-hidden rounded-full bg-zinc-100"
      >
        <div className={`h-full rounded-full ${fillClass}`} style={{ width: `${value}%` }} />
      </div>
      <span className="w-9 shrink-0 text-right text-xs tabular-nums text-zinc-600">{value}%</span>
    </div>
  );
}

// ── 스파크라인 (선형 보간, 좌표 소수 2자리 반올림) ──────────────────
export function Sparkline({
  points,
  width = 96,
  height = 28,
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
    const x = Math.round(i * step * 100) / 100;
    const y = Math.round((height - ((p - min) / range) * height) * 100) / 100;
    return `${x},${y}`;
  });

  const last = points[points.length - 1];
  const lastY = Math.round((height - ((last - min) / range) * height) * 100) / 100;
  const lastX = Math.round((points.length - 1) * step * 100) / 100;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      role="img"
      aria-hidden="true"
    >
      <polyline points={coords.join(" ")} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lastX} cy={lastY} r="2" fill="currentColor" />
    </svg>
  );
}

// ── 필터 칩 (다중 토글, aria-pressed) ────────────────────────────────
export function FilterChip({
  active,
  onClick,
  children,
  className = "",
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
        active
          ? "border-indigo-600 bg-indigo-600 text-white"
          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
      } ${className}`}
    >
      {children}
    </button>
  );
}
