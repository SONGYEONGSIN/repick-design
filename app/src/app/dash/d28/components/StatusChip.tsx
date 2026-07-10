import { Check, CircleDashed, X } from "lucide-react";

export type ChipTone = "go" | "hold" | "nogo" | "neutral";

const TONE_VAR: Record<ChipTone, string> = {
  go: "var(--hf-go)",
  hold: "var(--hf-hold)",
  nogo: "var(--hf-nogo)",
  neutral: "var(--hf-scrub)",
};

const TONE_ICON: Record<ChipTone, typeof Check> = {
  go: Check,
  hold: CircleDashed,
  nogo: X,
  neutral: CircleDashed,
};

/**
 * Rectangular tally light + uppercase mono label. Deliberately not a round
 * "signal lamp" bulb — status is always conveyed by icon + text, color is
 * supplementary only (WCAG 1.4.1).
 */
export function StatusChip({
  tone,
  label,
  className = "",
}: {
  tone: ChipTone;
  label: string;
  className?: string;
}) {
  const Icon = TONE_ICON[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] ${className}`}
      style={{
        color: TONE_VAR[tone],
        borderColor: TONE_VAR[tone],
        backgroundColor: "color-mix(in srgb, " + TONE_VAR[tone] + " 12%, transparent)",
      }}
    >
      <span
        aria-hidden="true"
        className="inline-block h-2 w-2.5 shrink-0 rounded-[1px]"
        style={{ backgroundColor: TONE_VAR[tone] }}
      />
      <Icon aria-hidden="true" className="h-3 w-3 shrink-0" />
      {label}
    </span>
  );
}

export function toneForPoll(status: "go" | "hold" | "nogo"): ChipTone {
  return status;
}

export function toneForChecklist(state: "done" | "failed" | "pending"): ChipTone {
  if (state === "done") return "go";
  if (state === "failed") return "nogo";
  return "neutral";
}

export function toneForMilestone(status: "complete" | "holding" | "pending"): ChipTone {
  if (status === "complete") return "go";
  if (status === "holding") return "hold";
  return "neutral";
}
