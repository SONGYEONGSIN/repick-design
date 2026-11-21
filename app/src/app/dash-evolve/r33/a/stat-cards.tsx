import type { LucideIcon } from "lucide-react";
import { Inbox, AlertTriangle, Clock, Sunrise } from "lucide-react";
import type { ReactNode } from "react";
import { TOTAL_BACKLOG, URGENT_AT_RISK, MEDIAN_AGE_DAYS, TODAY_INTAKE, BACKLOG_TREND } from "./data";
import { Card, SectionLabel, Sparkline } from "./ui";
import { formatCount } from "./format";

function StatCard({
  icon: Icon,
  label,
  value,
  caption,
  children,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  caption: string;
  children?: ReactNode;
}) {
  return (
    <Card className="col-span-12 sm:col-span-6 xl:col-span-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <SectionLabel>{label}</SectionLabel>
          <p className="mt-2 tabular-nums text-[28px] font-semibold leading-none text-zinc-900">{value}</p>
          <p className="mt-2 truncate text-xs text-zinc-600">{caption}</p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      {children}
    </Card>
  );
}

/** The dashboard's top-line KPI row — intentionally independent of the Today/7d/30d
 * toggle below it, since these describe the whole org's current state rather than
 * the backlog-composition snapshot the waffle is scoped to. */
export function StatCards() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <StatCard icon={Inbox} label="Open backlog" value={formatCount(TOTAL_BACKLOG)} caption="Across all channels">
        <div className="mt-3">
          <Sparkline data={BACKLOG_TREND} />
        </div>
      </StatCard>
      <StatCard
        icon={AlertTriangle}
        label="SLA at risk"
        value={formatCount(URGENT_AT_RISK)}
        caption="Urgent, open 3+ days"
      />
      <StatCard icon={Clock} label="Median age" value={`${MEDIAN_AGE_DAYS}d`} caption="Of the open backlog" />
      <StatCard icon={Sunrise} label="Today's intake" value={formatCount(TODAY_INTAKE)} caption="New tickets opened" />
    </div>
  );
}
