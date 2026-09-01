import { Check, CircleDashed, Clock3 } from "lucide-react";

import type { StepStatus } from "./data";

/**
 * Focus rule for the whole page: never `outline-none`/`outline-hidden` on an interactive
 * element. Tailwind v4 makes `outline-none` + `focus-visible:outline` self-cancel (both write
 * the same `--tw-outline-style` variable), so every focusable control below only ever *adds*
 * a focus-visible outline on top of the browser default — nothing turns it off first.
 */
export const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300";

const SIZES = {
  md: { outer: "h-6 w-6", inner: "h-3.5 w-3.5" },
  sm: { outer: "h-4 w-4", inner: "h-2.5 w-2.5" },
} as const;

export function StatusIcon({
  status,
  size = "md",
  className = "",
}: {
  status: StepStatus;
  size?: keyof typeof SIZES;
  /** Extra, non-sizing classes only (e.g. `relative z-10`) — sizing is owned by `size`. */
  className?: string;
}) {
  const { outer, inner } = SIZES[size];
  if (status === "pass") {
    return (
      <span
        className={`flex ${outer} shrink-0 items-center justify-center rounded-full bg-amber-700 ${className}`}
        aria-hidden="true"
      >
        <Check className={`${inner} text-white`} strokeWidth={3} />
      </span>
    );
  }
  if (status === "hold") {
    return (
      <span
        className={`flex ${outer} shrink-0 items-center justify-center rounded-full border border-zinc-500 bg-transparent ${className}`}
        aria-hidden="true"
      >
        <Clock3 className={`${inner} text-zinc-300`} strokeWidth={2.5} />
      </span>
    );
  }
  return (
    <span
      className={`flex ${outer} shrink-0 items-center justify-center rounded-full border border-dashed border-zinc-700 bg-transparent ${className}`}
      aria-hidden="true"
    >
      <CircleDashed className={`${inner} text-zinc-500`} strokeWidth={2.5} />
    </span>
  );
}

export function statusWord(status: StepStatus): string {
  if (status === "pass") return "Passed";
  if (status === "hold") return "Pending review";
  return "Skipped";
}

/**
 * page-brief-core §2 floors dark auxiliary text at zinc-400 — 500/600 read under AA on
 * `#0B0B0F`. "Skipped" is dimmed relative to "Passed" through weight and the dashed icon
 * next to it, never through a darker text color.
 */
export function StatusText({ status }: { status: StepStatus }) {
  const color = status === "pass" ? "text-zinc-100" : status === "hold" ? "text-zinc-300" : "text-zinc-400";
  const weight = status === "skipped" ? "font-normal" : "font-semibold";
  return <span className={`text-[13px] ${weight} ${color}`}>{statusWord(status)}</span>;
}
