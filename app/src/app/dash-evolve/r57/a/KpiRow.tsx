import { TrendingDown, TrendingUp, Ticket, Timer, ShieldCheck, ArrowUpCircle } from "lucide-react";
import { Card } from "./Card";
import { OPEN_TICKETS, FEED_EVENTS, allHoursForPeriod, fiveNumberSummary, slaCompliance, formatHours, formatCount, formatPercent, type Period } from "./data";

interface Kpi {
  label: string;
  value: string;
  deltaLabel: string;
  deltaDirection: "up" | "down";
  deltaGood: boolean;
  icon: typeof Ticket;
}

export function KpiRow({ period }: { period: Period }) {
  const hours = allHoursForPeriod(period);
  const overall = fiveNumberSummary(hours);
  const compliance = slaCompliance(hours);
  const escalatedOpen = OPEN_TICKETS.filter((t) => t.status === "Escalated").length;
  const escalationEvents = FEED_EVENTS.filter((e) => e.type === "escalated").length;

  const kpis: Kpi[] = [
    {
      label: "Open tickets",
      value: formatCount(OPEN_TICKETS.length),
      deltaLabel: "3 fewer than yesterday",
      deltaDirection: "down",
      deltaGood: true,
      icon: Ticket,
    },
    {
      label: "Median resolution",
      value: formatHours(overall.median),
      deltaLabel: period === "7d" ? "0.4h faster than last week" : "0.6h faster than prior 30 days",
      deltaDirection: "down",
      deltaGood: true,
      icon: Timer,
    },
    {
      label: "SLA compliance",
      value: formatPercent(compliance),
      deltaLabel: "2.1 pts above target",
      deltaDirection: "up",
      deltaGood: true,
      icon: ShieldCheck,
    },
    {
      label: "Escalations now",
      value: formatCount(escalatedOpen),
      deltaLabel: `${formatCount(escalationEvents)} escalated today`,
      deltaDirection: "up",
      deltaGood: false,
      icon: ArrowUpCircle,
    },
  ];

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => {
        const DeltaIcon = kpi.deltaDirection === "up" ? TrendingUp : TrendingDown;
        const deltaTone = kpi.deltaGood ? "text-green-400" : "text-amber-400";
        return (
          <Card key={kpi.label} className="min-w-0">
            <div className="flex min-w-0 items-start justify-between gap-2">
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">{kpi.label}</span>
              <kpi.icon className="h-4 w-4 flex-shrink-0 text-slate-500" aria-hidden="true" />
            </div>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-50">{kpi.value}</p>
            <p className={`mt-1 flex items-center gap-1 text-xs font-normal ${deltaTone}`}>
              <DeltaIcon className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
              {kpi.deltaLabel}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
