import { countFmt, formatPercent, siteSummaries, type Visit } from "./data";
import { Card, CardHeader } from "./Card";
import { Progress } from "./Progress";

interface SiteRailProps {
  visits: Visit[];
  headingId: string;
}

export function SiteRail({ visits, headingId }: SiteRailProps) {
  const summaries = siteSummaries(visits);

  return (
    <Card>
      <CardHeader id={headingId} title="Sites" description="Month-to-date load and on-time rate, independent of the calendar selection." />
      <ul className="space-y-4">
        {summaries.map((s) => (
          <li key={s.site.id}>
            <div className="flex items-baseline justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-900">{s.site.name}</p>
                <p className="truncate text-xs text-zinc-500">{s.site.coordinator}</p>
              </div>
              <p className="shrink-0 text-sm font-bold tabular-nums text-zinc-900">{countFmt.format(s.total)}</p>
            </div>
            <div className="mt-2">
              <Progress ratio={s.total === 0 ? 0 : s.completed / s.total} label={`Completed of ${s.total} visits`} tone="zinc" />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-xs text-zinc-500">
              <span>
                On-time <span className="font-medium tabular-nums text-zinc-700">{formatPercent(s.onTime)}</span>
              </span>
              <span>
                {countFmt.format(s.upcoming)} upcoming
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
