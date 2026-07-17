"use client";

import { ArrowLeft, ArrowRight, Minus } from "lucide-react";
import type { ZTestResult } from "../lib/stats";
import { formatSigned } from "../lib/format";

export default function DividerWinner({ comparison }: { comparison: ZTestResult }) {
  const leader = comparison.leader;
  const Icon = leader === "a" ? ArrowLeft : leader === "b" ? ArrowRight : Minus;
  const label =
    leader === "tie"
      ? "Statistical tie"
      : leader === "a"
        ? `A leads ${formatSigned(comparison.upliftPct)}`
        : `B leads ${formatSigned(comparison.upliftPct)}`;
  const tone =
    leader === "tie"
      ? "border-zinc-200 bg-white text-zinc-600 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400"
      : "border-indigo-200 bg-white text-indigo-700 dark:border-indigo-400/30 dark:bg-zinc-900 dark:text-indigo-300";

  return (
    <div className="relative h-px w-full shrink-0 bg-zinc-200 dark:bg-white/10 lg:h-auto lg:w-px lg:self-stretch">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span
          role="status"
          className={`pointer-events-auto inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold shadow-sm tabular-nums ${tone}`}
        >
          <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
          {label}
        </span>
      </div>
    </div>
  );
}
