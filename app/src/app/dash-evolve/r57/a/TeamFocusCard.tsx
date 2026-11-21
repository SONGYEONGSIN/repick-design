import { Target } from "lucide-react";
import { Card, CardHeader } from "./Card";
import { ProgressMeter } from "./ProgressMeter";
import { RESOLVED_HOURS, fiveNumberSummary, slaCompliance, formatHours, formatCount, formatPercent, type Period, type TeamName } from "./data";

// This card is the one narrow slice that the box plot's pin actually updates. It reads the
// pinned team's numbers from the exact same `RESOLVED_HOURS` records the box plot drew its
// chart from (via the same `fiveNumberSummary`/`slaCompliance` helpers), so it can never disagree
// with the chart. Deliberately scoped to just this card — the ticket table and the activity feed
// below are untouched by the pin; see the comment in TicketFeedCard.tsx.
export function TeamFocusCard({ period, pinnedTeam }: { period: Period; pinnedTeam: TeamName | null }) {
  if (!pinnedTeam) {
    return (
      <Card>
        <CardHeader title="Team focus" description="Pin a team in the chart to see its detail here." />
        <div className="flex min-w-0 items-center gap-3 rounded-xl border border-dashed border-white/10 px-4 py-6 text-sm font-normal text-slate-400">
          <Target className="h-5 w-5 flex-shrink-0 text-slate-500" aria-hidden="true" />
          No team pinned yet. Click any row in &ldquo;Resolution time by team&rdquo; to pin it.
        </div>
      </Card>
    );
  }

  const values = RESOLVED_HOURS[period][pinnedTeam];
  const summary = fiveNumberSummary(values);
  const compliance = slaCompliance(values);

  return (
    <Card>
      <CardHeader title="Team focus" description={`${pinnedTeam}, last ${period === "7d" ? "7 days" : "30 days"}`} />
      <div className="grid min-w-0 grid-cols-2 gap-4">
        <dl className="min-w-0">
          <dt className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Tickets resolved</dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums text-slate-50">{formatCount(summary.count)}</dd>
        </dl>
        <dl className="min-w-0">
          <dt className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Median time</dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums text-slate-50">{formatHours(summary.median)}</dd>
        </dl>
      </div>
      <p className="mt-3 text-xs font-normal tabular-nums text-slate-400">
        Q1 {formatHours(summary.q1)} – Q3 {formatHours(summary.q3)} · range {formatHours(summary.min)}–{formatHours(summary.max)}
      </p>
      <div className="mt-4">
        <ProgressMeter label="SLA compliance (≤ 8h target)" fraction={compliance} valueText={formatPercent(compliance)} tone={compliance >= 0.6 ? "green" : "amber"} />
      </div>
    </Card>
  );
}
