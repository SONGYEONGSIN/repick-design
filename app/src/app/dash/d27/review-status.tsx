import { ShieldCheck, ShieldAlert, ShieldX, ShieldOff } from "lucide-react";
import type { ReviewStatus } from "./data";
import { cn } from "./cn";

type Tone = "ink" | "stamp" | "muted";

const META: Record<ReviewStatus, { label: string; Icon: typeof ShieldCheck; tone: Tone }> = {
  approved: { label: "심의완료", Icon: ShieldCheck, tone: "ink" },
  pending: { label: "심의대기", Icon: ShieldAlert, tone: "stamp" },
  rejected: { label: "재심의요청", Icon: ShieldX, tone: "stamp" },
  exempt: { label: "심의제외", Icon: ShieldOff, tone: "muted" },
};

function toneClass(tone: Tone): string {
  if (tone === "stamp") return "text-[var(--stamp)]";
  if (tone === "muted") return "text-[var(--ink-soft)]";
  return "text-[var(--ink)]";
}

export function ReviewBadge({ status, className }: { status: ReviewStatus; className?: string }) {
  const { label, Icon, tone } = META[status];
  return (
    <span className={cn("inline-flex items-center gap-1 text-[11px] font-medium", toneClass(tone), className)}>
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      {label}
    </span>
  );
}

export function reviewLabel(status: ReviewStatus): string {
  return META[status].label;
}
