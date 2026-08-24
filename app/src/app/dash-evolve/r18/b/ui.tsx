import type { ReactNode } from "react";
import { AlertTriangle, AlertCircle, ShieldCheck } from "lucide-react";

/**
 * Tenure — component system primitives.
 *
 * One radius scale (panel 12px / control 8px / chip 6px), one border token (white/10),
 * one elevation. Everything else in the route composes from these so the page reads as a
 * single system rather than a set of one-off cards.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * Focus ring. Two Tailwind v4 idioms are deliberately absent here: the outline-suppressing utility
 * (it sets the outline-style custom property to none and cancels any focus outline declared after
 * it) and the ring offset utilities (in v4 they paint the ring fully transparent). What remains is
 * a plain focus-visible outline, which is the only pair that actually renders.
 */
export const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400";

export type RiskTier = "critical" | "watch" | "steady";

export const TIER_META: Record<
  RiskTier,
  { label: string; icon: typeof AlertTriangle; chip: string; dot: string }
> = {
  critical: {
    label: "위험",
    icon: AlertTriangle,
    chip: "border-rose-500/30 bg-rose-500/10 text-rose-300",
    dot: "bg-rose-400",
  },
  watch: {
    label: "주의",
    icon: AlertCircle,
    chip: "border-amber-400/30 bg-amber-400/10 text-amber-200",
    dot: "bg-amber-300",
  },
  steady: {
    label: "안정",
    icon: ShieldCheck,
    chip: "border-white/15 bg-white/[0.06] text-zinc-300",
    dot: "bg-zinc-400",
  },
};

export function tierOf(score: number): RiskTier {
  if (score >= 60) return "critical";
  if (score >= 30) return "watch";
  return "steady";
}

export function RiskChip({
  tier,
  score,
  size = "sm",
}: {
  tier: RiskTier;
  score?: number;
  size?: "xs" | "sm";
}) {
  const meta = TIER_META[tier];
  const Icon = meta.icon;
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-md border font-medium",
        meta.chip,
        size === "xs" ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-1 text-xs",
      )}
    >
      <Icon className={size === "xs" ? "h-3 w-3" : "h-3.5 w-3.5"} aria-hidden="true" />
      <span>{meta.label}</span>
      {score !== undefined && (
        <span className="tabular-nums opacity-80">{score}</span>
      )}
    </span>
  );
}

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cx(
        "min-w-0 rounded-xl border border-white/10 bg-zinc-900/50 shadow-sm shadow-black/40",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function FieldLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "block text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-400",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Avatar({
  initials,
  tone = "neutral",
  size = "md",
}: {
  initials: string;
  tone?: "neutral" | "accent";
  size?: "sm" | "md";
}) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "inline-flex shrink-0 items-center justify-center rounded-full border font-medium",
        tone === "accent"
          ? "border-rose-500/25 bg-rose-500/15 text-rose-200"
          : "border-white/15 bg-white/[0.07] text-zinc-200",
        size === "sm" ? "h-5 w-5 text-[10px]" : "h-8 w-8 text-xs",
      )}
    >
      {initials}
    </span>
  );
}

export function Segment({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[11px] font-medium text-zinc-300">
      {children}
    </span>
  );
}
