import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  Globe,
  MonitorSmartphone,
  MousePointerClick,
  Server,
  Smartphone,
  TriangleAlert,
  UserMinus,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import type { EventCategory, Source } from "../lib/data";

// ── 카테고리 메타 (아이콘 + 라벨 + 라이트 테마 색상) ─────────────────
interface CategoryMeta {
  label: string;
  Icon: LucideIcon;
  /** 배지/칩 (배경+텍스트+링) */
  badge: string;
  /** 아이콘 칩 (연한 배경 + 진한 아이콘) */
  chip: string;
  /** 분포 막대 채움색 */
  bar: string;
  /** 피드 좌측 강조선 */
  accent: string;
  dot: string;
}

export const CATEGORY_META: Record<EventCategory, CategoryMeta> = {
  conversion: {
    label: "전환",
    Icon: CreditCard,
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
    chip: "bg-emerald-50 text-emerald-600",
    bar: "bg-emerald-500",
    accent: "bg-emerald-400",
    dot: "bg-emerald-500",
  },
  signup: {
    label: "가입",
    Icon: UserPlus,
    badge: "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-600/20",
    chip: "bg-violet-50 text-violet-600",
    bar: "bg-violet-500",
    accent: "bg-violet-400",
    dot: "bg-violet-500",
  },
  engagement: {
    label: "참여",
    Icon: MousePointerClick,
    badge: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20",
    chip: "bg-sky-50 text-sky-600",
    bar: "bg-sky-500",
    accent: "bg-sky-400",
    dot: "bg-sky-500",
  },
  churn: {
    label: "이탈",
    Icon: UserMinus,
    badge: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
    chip: "bg-amber-50 text-amber-600",
    bar: "bg-amber-500",
    accent: "bg-amber-400",
    dot: "bg-amber-500",
  },
  error: {
    label: "오류",
    Icon: TriangleAlert,
    badge: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20",
    chip: "bg-rose-50 text-rose-600",
    bar: "bg-rose-500",
    accent: "bg-rose-400",
    dot: "bg-rose-500",
  },
};

export const CATEGORY_ORDER: EventCategory[] = ["conversion", "signup", "engagement", "churn", "error"];

// ── 소스 메타 ───────────────────────────────────────────────────────
export const SOURCE_META: Record<Source, { label: string; Icon: LucideIcon }> = {
  web: { label: "웹", Icon: Globe },
  ios: { label: "iOS", Icon: Smartphone },
  android: { label: "Android", Icon: MonitorSmartphone },
  server: { label: "서버", Icon: Server },
};

export const SOURCE_ORDER: Source[] = ["web", "ios", "android", "server"];

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
  return (
    <Tag className={`rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`}>{children}</Tag>
  );
}

// ── 카테고리 배지 (색 + 텍스트 병행) ────────────────────────────────
export function CategoryBadge({ category }: { category: EventCategory }) {
  const meta = CATEGORY_META[category];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${meta.badge}`}
    >
      <meta.Icon className="size-3" aria-hidden="true" />
      {meta.label}
    </span>
  );
}

// ── 아이콘 칩 (피드 리더) ───────────────────────────────────────────
export function CategoryIcon({ category }: { category: EventCategory }) {
  const meta = CATEGORY_META[category];
  return (
    <span
      className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${meta.chip}`}
      aria-hidden="true"
    >
      <meta.Icon className="size-4.5" />
    </span>
  );
}

// ── 델타 칩 ─────────────────────────────────────────────────────────
export function DeltaChip({ value }: { value: number }) {
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium tabular-nums ${
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

export function Avatar({ name, className = "size-9" }: { name: string | null; className?: string }) {
  if (!name) {
    return (
      <span
        className={`flex ${className} shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-400`}
        aria-hidden="true"
      >
        <Server className="size-4" />
      </span>
    );
  }
  const initial = name.slice(0, 1);
  return (
    <span
      className={`flex ${className} shrink-0 items-center justify-center rounded-full text-xs font-semibold ${toneFor(name)}`}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

// ── 세그먼트 컨트롤 (재사용) ────────────────────────────────────────
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  size = "md",
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  size?: "sm" | "md";
}) {
  const pad = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm";
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex items-center gap-0.5 rounded-lg border border-zinc-200 bg-zinc-50 p-0.5"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`rounded-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 ${pad} ${
              active
                ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ── 프로그레스 바 ───────────────────────────────────────────────────
export function ProgressBar({ value, tone = "bg-violet-500" }: { value: number; tone?: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
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
    <svg viewBox={`0 0 ${width} ${height}`} className={className} role="img" aria-label={label} preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
