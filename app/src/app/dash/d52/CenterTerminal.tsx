"use client";

import { Camera, Watch as WatchIcon, Footprints, Handbag, ShieldCheck } from "lucide-react";
import { CATEGORY_LABEL, dayChangePct, PERIODS, sliceForPeriod, type Category, type PeriodId, type WatchItem } from "./data";
import { fmtCompact, fmtSignedPct } from "./format";
import { Card } from "./ui/Card";
import { Progress } from "./ui/Progress";
import { SegmentedControl } from "./ui/SegmentedControl";
import { PriceChart } from "./PriceChart";

const CATEGORY_ICON: Record<Category, typeof Camera> = {
  camera: Camera,
  watch: WatchIcon,
  sneaker: Footprints,
  bag: Handbag,
};

function avgConfidence(item: WatchItem): number {
  const sum = item.comps.reduce((acc, c) => acc + c.gradeConfidence, 0);
  return sum / item.comps.length;
}

export function CenterTerminal({
  item,
  period,
  onPeriodChange,
}: {
  item: WatchItem;
  period: PeriodId;
  onPeriodChange: (p: PeriodId) => void;
}) {
  const sliced = sliceForPeriod(item.series, period);
  const latest = item.series[item.series.length - 1];
  const change = dayChangePct(item.series);
  const Icon = CATEGORY_ICON[item.category];
  const confidence = avgConfidence(item);

  return (
    <Card className="flex h-full min-w-0 flex-col" padded={false}>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 p-4 sm:p-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-300">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-[17px] font-semibold text-zinc-50" style={{ fontFamily: "var(--font-display-wide)" }}>
              {item.name}
            </h1>
            <p className="mt-0.5 text-[12px] text-zinc-400">{CATEGORY_LABEL[item.category]} · pinned for chart &amp; stats</p>
          </div>
        </div>
        <div className="flex min-w-[9rem] flex-col items-end gap-1">
          <span className="flex items-center gap-1.5 text-[11px] text-zinc-400">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            AI grading confidence
          </span>
          <Progress value={confidence} className="w-36" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 p-4 sm:p-5 xl:grid-cols-4">
        <Stat dotClassName="bg-amber-400" label="Repick avg" value={fmtCompact(latest.repick)} sub={fmtSignedPct(change) + " today"} />
        <Stat dotClassName="bg-zinc-300" label="Market avg" value={fmtCompact(latest.market)} sub="external comps" />
        <Stat dotClassName="bg-zinc-500" label="Floor" value={fmtCompact(latest.floor)} sub="min. acceptable" />
        <Stat
          dotClassName="invisible bg-zinc-500"
          label="Spread"
          value={fmtSignedPct((latest.repick - latest.market) / latest.market)}
          sub="repick vs. market"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3 sm:px-5">
        <Legend />
        <SegmentedControl
          label="Chart period"
          activeId={period}
          onChange={(id) => onPeriodChange(id as PeriodId)}
          items={PERIODS.map((p) => ({ id: p.id, label: p.label }))}
        />
      </div>

      <div className="min-w-0 flex-1 p-4 pt-2 sm:p-5 sm:pt-2">
        <PriceChart series={sliced} periodId={period} />
      </div>
    </Card>
  );
}

function Stat({
  label,
  value,
  sub,
  dotClassName,
}: {
  label: string;
  value: string;
  sub: string;
  dotClassName: string;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        <span className={`h-2 w-2 shrink-0 rounded-full ${dotClassName}`} aria-hidden="true" />
        <span className="text-[11px] uppercase tracking-wider text-zinc-400">{label}</span>
      </div>
      <p className="mt-1 truncate text-xl font-semibold tabular-nums text-zinc-50">{value}</p>
      <p className="truncate text-[11px] text-zinc-400">{sub}</p>
    </div>
  );
}

function Legend() {
  return (
    <ul className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400">
      <li className="flex items-center gap-1.5">
        <span className="h-[2.5px] w-4 rounded-full bg-amber-400" aria-hidden="true" />
        Repick avg
      </li>
      <li className="flex items-center gap-1.5">
        <span className="h-[1.75px] w-4 rounded-full bg-zinc-300" aria-hidden="true" />
        Market avg
      </li>
      <li className="flex items-center gap-1.5">
        <span
          className="w-4 border-t-[1.5px] border-dashed border-zinc-500"
          aria-hidden="true"
        />
        Floor
      </li>
    </ul>
  );
}
