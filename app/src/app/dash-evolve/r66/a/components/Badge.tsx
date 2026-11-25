import type { ReactNode } from "react";

export type BadgeTone = "emerald" | "amber" | "rose" | "indigo" | "zinc";

const TONE_CLASS: Record<BadgeTone, string> = {
  emerald: "bg-emerald-400/15 text-emerald-300",
  amber: "bg-amber-400/15 text-amber-300",
  rose: "bg-rose-400/15 text-rose-300",
  indigo: "bg-indigo-400/15 text-indigo-200",
  zinc: "bg-white/5 text-zinc-300",
};

export default function Badge({
  tone,
  children,
  icon,
}: {
  tone: BadgeTone;
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${TONE_CLASS[tone]}`}
    >
      {icon}
      {children}
    </span>
  );
}
