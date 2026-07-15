import {
  ArrowDownRight,
  ArrowUpRight,
  Briefcase,
  Camera,
  CheckCircle2,
  CircleAlert,
  Clock,
  Music2,
  Pencil,
  Play,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import type { ChannelId, PostStatus } from "../lib/data";

// ── 채널 메타 (아이콘 + 라벨 + 라이트 테마 색상) ────────────────────────
interface ChannelMeta {
  label: string;
  Icon: LucideIcon;
  /** 배지(연한 배경 + 텍스트) */
  chip: string;
  /** 점/막대 등 단색 강조 */
  dot: string;
  /** 스파크라인 선 색 (currentColor 상속용 text 클래스) */
  text: string;
  /** 캘린더 칩 좌측 강조선 */
  accent: string;
}

export const CHANNEL_META: Record<ChannelId, ChannelMeta> = {
  instagram: {
    label: "Instagram",
    Icon: Camera,
    chip: "bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
    text: "text-rose-600",
    accent: "border-l-rose-400",
  },
  x: {
    label: "X",
    Icon: MessageSquare,
    chip: "bg-zinc-800 text-white",
    dot: "bg-zinc-700",
    text: "text-zinc-700",
    accent: "border-l-zinc-500",
  },
  linkedin: {
    label: "LinkedIn",
    Icon: Briefcase,
    chip: "bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
    text: "text-blue-600",
    accent: "border-l-blue-400",
  },
  tiktok: {
    label: "TikTok",
    Icon: Music2,
    chip: "bg-violet-50 text-violet-700",
    dot: "bg-violet-500",
    text: "text-violet-600",
    accent: "border-l-violet-400",
  },
  youtube: {
    label: "YouTube",
    Icon: Play,
    chip: "bg-orange-50 text-orange-700",
    dot: "bg-orange-500",
    text: "text-orange-600",
    accent: "border-l-orange-400",
  },
};

// ── 상태 메타 (색 + 텍스트 병행) ─────────────────────────────────────
interface StatusMeta {
  label: string;
  Icon: LucideIcon;
  badge: string;
}

export const STATUS_META: Record<PostStatus, StatusMeta> = {
  published: { label: "발행됨", Icon: CheckCircle2, badge: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20" },
  scheduled: { label: "예약됨", Icon: Clock, badge: "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/20" },
  needs_review: { label: "검토 대기", Icon: CircleAlert, badge: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20" },
  draft: { label: "초안", Icon: Pencil, badge: "bg-zinc-100 text-zinc-600 ring-1 ring-inset ring-zinc-400/20" },
};

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

// ── 상태 배지 ───────────────────────────────────────────────────────
export function StatusBadge({ status, className = "" }: { status: PostStatus; className?: string }) {
  const meta = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap ${meta.badge} ${className}`}>
      <meta.Icon className="size-2.5" aria-hidden="true" />
      {meta.label}
    </span>
  );
}

// ── 채널 아이콘 칩 ──────────────────────────────────────────────────
export function ChannelIcon({ channel, className = "size-5" }: { channel: ChannelId; className?: string }) {
  const meta = CHANNEL_META[channel];
  return (
    <span className={`flex ${className} shrink-0 items-center justify-center rounded-md ${meta.chip}`} aria-hidden="true">
      <meta.Icon className="size-3" />
    </span>
  );
}

// ── 델타 칩 ─────────────────────────────────────────────────────────
export function DeltaChip({ value }: { value: number }) {
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium tabular-nums ${
        up ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
      }`}
    >
      <Icon className="size-3" aria-hidden="true" />
      {Math.abs(value).toFixed(1)}%
      <span className="sr-only">{up ? "증가" : "감소"}</span>
    </span>
  );
}

// ── 이니셜 아바타 (결정론적 색상) ──────────────────────────────────
const AVATAR_TONES = [
  "bg-violet-100 text-violet-700",
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-indigo-100 text-indigo-700",
];

function toneFor(name: string): string {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum = (sum + name.charCodeAt(i)) % 997;
  return AVATAR_TONES[sum % AVATAR_TONES.length];
}

export function Avatar({ name, className = "size-7" }: { name: string; className?: string }) {
  const initial = name.slice(0, 1);
  return (
    <span
      title={name}
      className={`flex ${className} shrink-0 items-center justify-center rounded-full text-xs font-semibold ${toneFor(name)}`}
    >
      <span aria-hidden="true">{initial}</span>
      <span className="sr-only">{name}</span>
    </span>
  );
}

// ── 세그먼트 컨트롤 ─────────────────────────────────────────────────
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string; Icon?: LucideIcon }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex h-11 items-center gap-0.5 rounded-lg border border-zinc-200 bg-zinc-50 p-0.5">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`inline-flex h-full items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
              active ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200" : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            {opt.Icon && <opt.Icon className="size-3.5" aria-hidden="true" />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ── 프로그레스 바 ───────────────────────────────────────────────────
export function ProgressBar({ value, tone = "bg-indigo-500", label }: { value: number; tone?: string; label: string }) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100"
    >
      <div className={`h-full rounded-full ${tone}`} style={{ width: `${Math.min(100, value).toFixed(1)}%` }} />
    </div>
  );
}

// ── 스파크라인 (좌표 소수 2자리 반올림 → 하이드레이션 안정) ─────────
export function Sparkline({
  values,
  className = "",
  label,
  width = 96,
  height = 28,
}: {
  values: number[];
  className?: string;
  label: string;
  width?: number;
  height?: number;
}) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const step = width / (values.length - 1 || 1);
  const points = values
    .map((v, i) => {
      const x = Number((i * step).toFixed(2));
      const y = Number((height - ((v - min) / range) * height).toFixed(2));
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ width, height }}
      role="img"
      aria-label={label}
      preserveAspectRatio="none"
    >
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
