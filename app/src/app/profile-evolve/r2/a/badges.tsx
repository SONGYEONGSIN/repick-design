import { CheckCircle2, CircleAlert, Clock, Info, ScrollText, ShieldAlert, type LucideIcon } from "lucide-react";
import type { Outcome, Severity } from "./data";

// Every badge pairs a color with an icon and a text label — color is never the only carrier of
// meaning. Backgrounds are the -100 step of each hue with -800 text; every one of those pairings was
// hand-checked against real WCAG relative-luminance math (documented in the concept note) rather than
// assumed safe, since several -700-on-100 combinations in this hue set land under 4.5:1.
const SEVERITY_META: Record<Severity, { label: string; icon: LucideIcon; classes: string }> = {
  critical: { label: "Critical", icon: ShieldAlert, classes: "bg-rose-100 text-rose-800" },
  high: { label: "High", icon: CircleAlert, classes: "bg-orange-100 text-orange-800" },
  medium: { label: "Medium", icon: Info, classes: "bg-amber-100 text-amber-800" },
  low: { label: "Low", icon: CheckCircle2, classes: "bg-zinc-100 text-zinc-800" },
};

const OUTCOME_META: Record<Outcome, { label: string; icon: LucideIcon; classes: string }> = {
  Resolved: { label: "Resolved", icon: CheckCircle2, classes: "bg-emerald-100 text-emerald-800" },
  Monitoring: { label: "Monitoring", icon: Clock, classes: "bg-amber-100 text-amber-800" },
  Disclosed: { label: "Disclosed", icon: ScrollText, classes: "bg-zinc-100 text-zinc-800" },
};

function Badge({ label, icon: Icon, classes }: { label: string; icon: LucideIcon; classes: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${classes}`}>
      <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      {label}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  const meta = SEVERITY_META[severity];
  return <Badge label={meta.label} icon={meta.icon} classes={meta.classes} />;
}

export function OutcomeBadge({ outcome }: { outcome: Outcome }) {
  const meta = OUTCOME_META[outcome];
  return <Badge label={meta.label} icon={meta.icon} classes={meta.classes} />;
}

export const SEVERITY_ORDER_FOR_FILTER: Severity[] = ["critical", "high", "medium", "low"];
export const SEVERITY_LABEL: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};
