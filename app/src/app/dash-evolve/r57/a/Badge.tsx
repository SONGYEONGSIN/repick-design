import type { ComponentType } from "react";

type Tone = "green" | "amber" | "red" | "sky" | "slate";

const TONE_CLASSES: Record<Tone, string> = {
  green: "bg-green-500/10 text-green-400 ring-1 ring-inset ring-green-500/30",
  amber: "bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/30",
  red: "bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/30",
  sky: "bg-sky-500/10 text-sky-400 ring-1 ring-inset ring-sky-500/30",
  slate: "bg-slate-500/10 text-slate-300 ring-1 ring-inset ring-slate-500/30",
};

// Meaning is always carried by the icon + label together, never by color alone, so the same
// badge still reads correctly for a colorblind viewer or in a contrast-forced mode.
export function Badge({
  tone,
  icon: Icon,
  children,
}: {
  tone: Tone;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  children: React.ReactNode;
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${TONE_CLASSES[tone]}`}>
      <Icon className="h-3.5 w-3.5 flex-shrink-0" aria-hidden={true} />
      {children}
    </span>
  );
}
