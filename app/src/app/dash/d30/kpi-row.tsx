import { CalendarCheck2, CalendarRange, Percent, TriangleAlert } from "lucide-react";
import type { Period } from "./data";
import {
  LAST_WEEK_MEETINGS,
  PERIOD_KPI,
  PERIOD_LABEL,
  YESTERDAY_MEETINGS,
  formatNumber,
  formatSignedPercent,
  formatSignedPoint,
} from "./data";
import { KpiCard } from "./kpi-card";

interface KpiRowProps {
  period: Period;
}

function pct(current: number, prev: number): number {
  return Math.round(((current - prev) / prev) * 1000) / 10;
}

export function KpiRow({ period }: KpiRowProps) {
  const kpi = PERIOD_KPI[period];
  const todayKpi = PERIOD_KPI.today;
  const weekKpi = PERIOD_KPI.week;

  const todayDeltaPct = pct(todayKpi.meetingsTotal, YESTERDAY_MEETINGS);
  const weekDeltaPct = pct(weekKpi.meetingsTotal, LAST_WEEK_MEETINGS);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="Today's meetings"
        value={formatNumber(todayKpi.meetingsTotal)}
        helpText="vs. yesterday"
        deltaText={formatSignedPercent(todayDeltaPct)}
        tone={todayDeltaPct >= 0 ? "positive" : "negative"}
        direction={todayDeltaPct >= 0 ? "up" : "down"}
        icon={CalendarCheck2}
        accentClass="bg-indigo-50 text-indigo-600"
      />
      <KpiCard
        label="This week's meetings"
        value={formatNumber(weekKpi.meetingsTotal)}
        helpText="vs. last week"
        deltaText={formatSignedPercent(weekDeltaPct)}
        tone={weekDeltaPct >= 0 ? "positive" : "negative"}
        direction={weekDeltaPct >= 0 ? "up" : "down"}
        icon={CalendarRange}
        accentClass="bg-blue-50 text-blue-600"
      />
      <KpiCard
        label={`Booking conversion · ${PERIOD_LABEL[period]}`}
        value={`${kpi.conversionRate.toFixed(1)}%`}
        helpText="vs. previous period"
        deltaText={formatSignedPoint(kpi.conversionDeltaPt)}
        tone={kpi.conversionDeltaPt >= 0 ? "positive" : "negative"}
        direction={kpi.conversionDeltaPt >= 0 ? "up" : "down"}
        icon={Percent}
        accentClass="bg-emerald-50 text-emerald-600"
      />
      <KpiCard
        label={`No-show rate · ${PERIOD_LABEL[period]}`}
        value={`${kpi.noShowRate.toFixed(1)}%`}
        helpText="vs. previous period"
        deltaText={formatSignedPoint(kpi.noShowDeltaPt)}
        tone={kpi.noShowDeltaPt <= 0 ? "positive" : "negative"}
        direction={kpi.noShowDeltaPt <= 0 ? "down" : "up"}
        icon={TriangleAlert}
        accentClass="bg-amber-50 text-amber-600"
      />
    </div>
  );
}
