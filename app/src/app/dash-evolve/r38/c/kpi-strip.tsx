import { AlertCircle, Gauge, ShieldCheck, Signal } from "lucide-react";
import { P50_SPARKLINE, REGIONS, type TimeRange } from "./data";
import { TEXT_AUX, TEXT_PRIMARY, fmtInt, fmtPct, tierForIncidents, cx } from "./tokens";
import { Card, Progress, Sparkline } from "./ui";

/**
 * Every number here is reduced from REGIONS[*].metrics[range] at render time — never a second,
 * separately hardcoded total — so these KPIs always reconcile with the region table below them.
 */
export function KpiStrip({ range }: { range: TimeRange }) {
  const rows = REGIONS.map((r) => r.metrics[range]);
  const avgUptime = rows.reduce((sum, m) => sum + m.uptimePct, 0) / rows.length;
  const avgP50 = rows.reduce((sum, m) => sum + m.p50Ms, 0) / rows.length;
  const totalIncidents = rows.reduce((sum, m) => sum + m.incidents, 0);
  const degradedCount = rows.filter((m) => tierForIncidents(m.incidents) >= 2).length;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={13} aria-hidden="true" className={TEXT_AUX} />
          <span className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>Avg regional uptime</span>
        </div>
        <p className={cx("text-2xl font-semibold tabular-nums", TEXT_PRIMARY)}>{fmtPct(avgUptime)}</p>
        <p className={cx("text-xs font-normal", TEXT_AUX)}>Mean across 14 regions, {range}</p>
      </Card>

      <Card className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Gauge size={13} aria-hidden="true" className={TEXT_AUX} />
            <span className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>Avg p50 latency</span>
          </div>
          <Sparkline values={P50_SPARKLINE[range]} />
        </div>
        <p className={cx("text-2xl font-semibold tabular-nums", TEXT_PRIMARY)}>{Math.round(avgP50)}ms</p>
        <p className={cx("text-xs font-normal", TEXT_AUX)}>Mean across 14 regions, {range}</p>
      </Card>

      <Card className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <AlertCircle size={13} aria-hidden="true" className={TEXT_AUX} />
          <span className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>Total incidents</span>
        </div>
        <p className={cx("text-2xl font-semibold tabular-nums", TEXT_PRIMARY)}>{fmtInt(totalIncidents)}</p>
        <p className={cx("text-xs font-normal", TEXT_AUX)}>Summed across 14 regions, {range}</p>
      </Card>

      <Card className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <Signal size={13} aria-hidden="true" className={TEXT_AUX} />
          <span className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>Regions degraded</span>
        </div>
        <p className={cx("text-2xl font-semibold tabular-nums", TEXT_PRIMARY)}>
          {degradedCount} <span className={cx("text-sm font-normal", TEXT_AUX)}>/ {REGIONS.length}</span>
        </p>
        <Progress value={(degradedCount / REGIONS.length) * 100} label={`${REGIONS.length - degradedCount} of ${REGIONS.length} at or below moderate severity`} />
      </Card>
    </div>
  );
}
