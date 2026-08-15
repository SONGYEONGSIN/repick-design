"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { QUEUE_META, formatKpiTarget, formatKpiValue, kpiPasses } from "./data";
import { BORDER, DISPLAY, NUM, TEXT_CAPTION, TEXT_PRIMARY, TONE, cx } from "./tokens";
import { Badge, Card, CardHeader } from "./ui";
import type { BulletKpi, QueueFilterValue, TimeRange } from "./types";

/** Qualitative-zone boundaries as a fraction of each KPI's axis max — the classic bullet-graph
 *  "poor / satisfactory / good" bands, rendered as three shades of the neutral scale so the single
 *  accent hue is reserved for the actual-value bar. */
const ZONE_SATISFACTORY = 0.6;
const ZONE_GOOD = 0.85;

function BulletRow({ kpi, range, highlighted }: { kpi: BulletKpi; range: TimeRange; highlighted: boolean }) {
  const actual = kpi.actualByRange[range];
  const actualPct = Math.min(100, Math.max(0, (actual / kpi.axisMax) * 100));
  const targetPct = Math.min(100, Math.max(0, (kpi.target / kpi.axisMax) * 100));
  const pass = kpiPasses(kpi, range);
  const statusLabel = pass ? "On target" : kpi.goal === "min" ? "Below target" : "Over target";
  const tone = pass ? TONE.good : TONE.warn;
  const StatusIcon = pass ? CheckCircle2 : AlertTriangle;
  const queueLabel = kpi.queue === "platform" ? "Platform-wide" : QUEUE_META[kpi.queue].label;

  return (
    <div
      role="group"
      aria-label={`${kpi.label}: ${formatKpiValue(kpi, range)}, target ${formatKpiTarget(kpi)}, ${statusLabel}`}
      className={cx("rounded-xl border p-3 transition-colors motion-reduce:transition-none", highlighted ? "border-emerald-500/40 bg-emerald-500/[0.06]" : "border-transparent")}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
        <div className="min-w-0">
          <p className={cx("line-clamp-2 text-sm leading-snug font-medium", TEXT_PRIMARY)}>{kpi.label}</p>
          <p className={cx("text-[11px] tracking-wide uppercase", TEXT_CAPTION)}>{queueLabel}</p>
        </div>
        <Badge tone={tone} Icon={StatusIcon}>
          {statusLabel}
        </Badge>
      </div>

      <div aria-hidden="true" className="relative mt-3 h-3 w-full overflow-hidden rounded-full bg-zinc-800">
        <div className="absolute inset-y-0 left-0 bg-zinc-800" style={{ width: `${ZONE_SATISFACTORY * 100}%` }} />
        <div className="absolute inset-y-0 bg-zinc-700" style={{ left: `${ZONE_SATISFACTORY * 100}%`, width: `${(ZONE_GOOD - ZONE_SATISFACTORY) * 100}%` }} />
        <div className="absolute inset-y-0 bg-zinc-600" style={{ left: `${ZONE_GOOD * 100}%`, width: `${(1 - ZONE_GOOD) * 100}%` }} />
        <div className={cx("absolute inset-y-1 left-0 rounded-full", pass ? "bg-emerald-500" : "bg-emerald-500/70")} style={{ width: `${actualPct}%` }} />
        <div className="absolute inset-y-0 w-[2px] -translate-x-1/2 bg-zinc-50" style={{ left: `${targetPct}%` }} />
      </div>

      <div className="mt-1.5 flex items-baseline justify-between gap-2">
        <span className={cx("text-sm font-semibold", TEXT_PRIMARY, NUM)} style={DISPLAY}>
          {formatKpiValue(kpi, range)}
        </span>
        <span className={cx("text-xs", TEXT_CAPTION, NUM)} style={DISPLAY}>
          Target {formatKpiTarget(kpi)}
        </span>
      </div>
    </div>
  );
}

export default function BulletGrid({ kpis, range, highlightQueue }: { kpis: BulletKpi[]; range: TimeRange; highlightQueue: QueueFilterValue }) {
  return (
    <Card id="kpi-panel" className="scroll-mt-20">
      <CardHeader
        title="Queue performance"
        description="Actual vs. target for every queue this period — shaded band marks the healthy range."
        titleId="kpi-panel-title"
      />
      <div role="list" aria-labelledby="kpi-panel-title" className="mt-4 space-y-2">
        {kpis.map((k) => (
          <div role="listitem" key={k.id}>
            <BulletRow kpi={k} range={range} highlighted={highlightQueue !== "all" && k.queue === highlightQueue} />
          </div>
        ))}
      </div>
      <p className={cx("mt-4 border-t pt-3 text-[11px] leading-snug", BORDER, TEXT_CAPTION)}>
        Bands read left→right as poor · satisfactory · good, scaled to each metric&apos;s own ceiling. The white tick marks target; the filled
        bar is the current actual.
      </p>
    </Card>
  );
}
