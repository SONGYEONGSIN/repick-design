"use client";

import type { ReactNode } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { Sentiment } from "./data";
import { scoreTone, sparklinePoints } from "./data";

/**
 * Font-weight budget for this whole route is exactly three rendered weights: 400 (body copy,
 * captions, data cells), 500 (labels, nav, buttons, secondary emphasis) and 600 (page/card titles,
 * headline numbers). `font-bold`/700 is never used, including on elements with a UA-default bold
 * (`<th>`, `<b>`/`<strong>` — both avoided outright) — every leaf text node carries an explicit
 * weight class instead of relying on inheritance.
 *
 * A real, opaque, visible focus ring — never bare `outline-none`, never `ring-*`/`ring-offset-*`
 * (renders fully transparent in this Tailwind v4 setup).
 */
export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400";

export function Card({
  children,
  className = "",
  padded = true,
  id,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={`min-w-0 rounded-2xl border border-white/10 bg-zinc-900/60 ${padded ? "p-4 sm:p-5" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function FieldLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400 ${className}`}>
      {children}
    </span>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex min-w-0 flex-wrap items-center gap-0.5 rounded-full border border-white/10 bg-zinc-950/60 p-1"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`${FOCUS} h-8 rounded-full px-3 text-xs font-medium transition-colors ${
              active ? "bg-sky-400 text-zinc-950" : "text-zinc-400 hover:text-zinc-50"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

const SENTIMENT_TONE: Record<Sentiment, { bg: string; text: string; label: string }> = {
  positive: { bg: "bg-emerald-400/10", text: "text-emerald-400", label: "Positive" },
  neutral: { bg: "bg-white/5", text: "text-zinc-300", label: "Neutral" },
  "at-risk": { bg: "bg-rose-400/10", text: "text-rose-400", label: "At risk" },
};

export function SentimentBadge({ sentiment }: { sentiment: Sentiment }) {
  const tone = SENTIMENT_TONE[sentiment];
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${tone.bg} ${tone.text}`}
    >
      {tone.label}
    </span>
  );
}

const SCORE_TONE = {
  positive: { bg: "bg-emerald-400/10", text: "text-emerald-400" },
  neutral: { bg: "bg-white/5", text: "text-zinc-300" },
  "at-risk": { bg: "bg-rose-400/10", text: "text-rose-400" },
} as const;

export function ScoreBadge({ score }: { score: number }) {
  const tone = SCORE_TONE[scoreTone(score)];
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md px-1.5 py-0.5 font-mono text-xs font-semibold tabular-nums ${tone.bg} ${tone.text}`}
    >
      {score}
    </span>
  );
}

export function TalkRatioBar({ value }: { value: number }) {
  const safe = Math.min(100, Math.max(0, value));
  return (
    <div
      role="img"
      aria-label={`Rep talked ${safe}% of the call`}
      className="h-1.5 w-full min-w-0 overflow-hidden rounded-full bg-white/10"
    >
      <div
        className={`h-full rounded-full ${safe > 62 ? "bg-rose-400" : "bg-sky-400"}`}
        style={{ width: `${safe}%` }}
      />
    </div>
  );
}

export function StatTile({
  label,
  value,
  delta,
  deltaGood,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaGood?: boolean;
}) {
  const up = delta?.trim().startsWith("+");
  return (
    <div className="min-w-0 rounded-xl border border-white/10 bg-white/5 px-3.5 py-3">
      <p className="truncate text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400">{label}</p>
      <p className="mt-1 truncate font-mono text-xl font-semibold tabular-nums text-zinc-50">{value}</p>
      {delta && (
        <p
          className={`mt-1 flex items-center gap-1 text-xs font-normal tabular-nums ${
            deltaGood ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {up ? (
            <ArrowUp className="h-3 w-3 shrink-0" aria-hidden="true" />
          ) : (
            <ArrowDown className="h-3 w-3 shrink-0" aria-hidden="true" />
          )}
          <span className="truncate">{delta}</span>
        </p>
      )}
    </div>
  );
}

export function Sparkline({ trend, className = "" }: { trend: number[]; className?: string }) {
  return (
    <svg
      viewBox="0 0 64 24"
      className={`h-6 w-16 shrink-0 ${className}`}
      role="img"
      aria-label={`Score trend over the last ${trend.length} weeks, from ${trend[0]} to ${trend[trend.length - 1]}`}
    >
      <polyline
        points={sparklinePoints(trend)}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
