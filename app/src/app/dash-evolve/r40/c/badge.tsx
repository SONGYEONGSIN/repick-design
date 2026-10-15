import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  CircleDot,
  RotateCcw,
  Search,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { Priority, StateId } from "./data";

type Tone = "neutral" | "accent" | "critical";

interface StateMeta {
  icon: LucideIcon;
  tone: Tone;
}

export const STATE_META: Record<StateId, StateMeta> = {
  detected: { icon: Circle, tone: "neutral" },
  triaged: { icon: CircleDot, tone: "neutral" },
  investigating: { icon: Search, tone: "accent" },
  escalated: { icon: AlertTriangle, tone: "critical" },
  mitigating: { icon: Wrench, tone: "accent" },
  resolved: { icon: CheckCircle2, tone: "neutral" },
  reopened: { icon: RotateCcw, tone: "critical" },
};

const TONE_CLASSES: Record<Tone, string> = {
  neutral: "border-white/10 bg-white/5 text-zinc-50",
  accent: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
  critical: "border-red-400/30 bg-red-400/10 text-red-300",
};

export function StateBadge({ state, label }: { state: StateId; label: string }) {
  const meta = STATE_META[state];
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full border px-2 font-medium text-xs ${TONE_CLASSES[meta.tone]}`}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      {label}
    </span>
  );
}

const PRIORITY_ICON: Record<Priority, LucideIcon> = {
  Critical: AlertTriangle,
  High: AlertTriangle,
  Medium: Circle,
  Low: Circle,
};

const PRIORITY_TONE: Record<Priority, Tone> = {
  Critical: "critical",
  High: "neutral",
  Medium: "neutral",
  Low: "neutral",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const Icon = PRIORITY_ICON[priority];
  const tone = PRIORITY_TONE[priority];
  return (
    <span
      className={`inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full border px-2 font-medium text-xs ${TONE_CLASSES[tone]}`}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      {priority}
    </span>
  );
}
