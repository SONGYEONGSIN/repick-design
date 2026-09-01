import type { ReactNode } from "react";

type Tone = "neutral" | "amber" | "teal" | "outline" | "solid";

// Status badges (Active / Sold / Expired) deliberately stay grayscale — tone is carried by
// prominence (solid > neutral > outline), not hue. `amber` and `teal` are reserved for the two
// functional accents used elsewhere (brand/primary, and the above/below-market axis) so a status
// pill never gets mistaken for a market signal.
const TONE_CLASSES: Record<Tone, string> = {
  solid: "bg-zinc-100 text-zinc-900 border-zinc-100",
  neutral: "bg-zinc-800 text-zinc-300 border-white/5",
  amber: "bg-amber-400/10 text-amber-300 border-amber-400/20",
  teal: "bg-teal-400/10 text-teal-300 border-teal-400/20",
  outline: "bg-transparent text-zinc-400 border-white/10",
};

export function Badge({
  children,
  tone = "neutral",
  icon,
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium leading-none whitespace-nowrap ${TONE_CLASSES[tone]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}

const STATUS_CONFIG: Record<string, { label: string; tone: Tone }> = {
  active: { label: "Active", tone: "solid" },
  sold: { label: "Sold", tone: "neutral" },
  expired: { label: "Expired", tone: "outline" },
};

export function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, tone: "neutral" };
  return <Badge tone={cfg.tone}>{cfg.label}</Badge>;
}
